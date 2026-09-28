import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ScoreTracker } from '../src/core/scoreTracker.ts';
import type { StorageAdapter } from '../src/core/types.ts';

class MemoryStorage implements StorageAdapter {
  private map = new Map<string, string>();
  getItem(key: string): string | null {
    return this.map.get(key) ?? null;
  }
  setItem(key: string, value: string): void {
    this.map.set(key, value);
  }
}

describe('ScoreTracker — Monotonicity & Adversarial Storage Tests', () => {
  it('Property 1 (Score Monotonicity): stepping backward or negative rows never decreases score', () => {
    const storage = new MemoryStorage();
    const tracker = new ScoreTracker(storage);

    const rowSequence = [0, 1, 2, 5, 4, 3, 1, 0, -2, 4, 5, 9, 7, 2, 12, 10];
    let prevScore = 0;

    for (const r of rowSequence) {
      tracker.updateRow(r);
      const current = tracker.getScore();
      assert.ok(current >= prevScore, `Score decreased from ${prevScore} to ${current} at row ${r}`);
      prevScore = current;
    }

    assert.equal(tracker.getScore(), 12);
    assert.equal(tracker.getHighScore(), 12);
  });

  it('Property 2 (HighScore Persistence): resetCurrentScore clears current score but keeps HighScore in storage', () => {
    const storage = new MemoryStorage();
    const tracker1 = new ScoreTracker(storage);
    tracker1.updateRow(24);
    tracker1.resetCurrentScore();

    assert.equal(tracker1.getScore(), 0);
    assert.equal(tracker1.getHighScore(), 24);

    // Second instance reading from same storage must restore 24
    const tracker2 = new ScoreTracker(storage);
    assert.equal(tracker2.getHighScore(), 24);
    tracker2.updateRow(10);
    assert.equal(tracker2.getHighScore(), 24);
    tracker2.updateRow(30);
    assert.equal(tracker2.getHighScore(), 30);
  });

  it('Property 3 (Adversarial Corrupted Storage): handles NaN, negative numbers, garbage strings, and throwing storage safely', () => {
    const badValues = ['NaN', '-500', 'Infinity', '{"corrupt":true}', '   ', 'undefined'];
    for (const val of badValues) {
      const storage = new MemoryStorage();
      storage.setItem('crossy_road_high_score', val);
      const tracker = new ScoreTracker(storage);
      assert.equal(tracker.getHighScore(), 0, `Corrupted value "${val}" should sanitize to 0`);
      tracker.updateRow(5);
      assert.equal(tracker.getHighScore(), 5);
    }

    const throwingStorage: StorageAdapter = {
      getItem() {
        throw new Error('SecurityError: storage disabled');
      },
      setItem() {
        throw new Error('QuotaExceededError');
      }
    };

    const resilientTracker = new ScoreTracker(throwingStorage);
    assert.equal(resilientTracker.getHighScore(), 0);
    resilientTracker.updateRow(7);
    assert.equal(resilientTracker.getScore(), 7);
    assert.equal(resilientTracker.getHighScore(), 7);
  });

  it('Property 4 (Local Top-10 Leaderboard & Overtaking Rival Bots): merges player runs with bots, tracks overtaken bots, and persists top 10', () => {
    const storage = new MemoryStorage();
    const tracker = new ScoreTracker(storage, 'VibeRunner');
    tracker.addCoins(100);
    tracker.rollGacha(1); // unlocks cyber_duck
    tracker.selectSkin('cyber_duck');

    const initialBoard = tracker.getLeaderboard();
    assert.equal(initialBoard.length, 10, 'Leaderboard must always contain Top-10 entries');
    assert.equal(initialBoard[0].isBot, true);
    assert.equal(initialBoard[9].playerName, 'RookieFeather');

    // Next rival at score 0 should be RookieFeather (18 pts)
    const firstRival = tracker.getNextRival(0);
    assert.equal(firstRival?.playerName, 'RookieFeather');

    // Record a run of 120 points -> should overtake RookieFeather (18), TrainDodger (35), TurboCluck (55), PixelDrifter (75), GlacierWing (95), MasterChicken (115)
    const runResult = tracker.recordRun(120, { date: '2026-09-26' });
    assert.equal(runResult.isNewHighScore, true);
    assert.equal(runResult.rank, 5, '120 pts should place #5 right behind ShadowHopper (142)');
    assert.ok(runResult.overtakenBots.includes('MasterChicken'));
    assert.ok(runResult.overtakenBots.includes('RookieFeather'));

    const updatedBoard = tracker.getLeaderboard();
    assert.equal(updatedBoard.length, 10);
    assert.equal(updatedBoard[4].playerName, 'VibeRunner');
    assert.equal(updatedBoard[4].score, 120);
    assert.equal(updatedBoard[4].skinId, 'cyber_duck');
    assert.equal(updatedBoard[4].date, '2026-09-26');
    assert.equal(updatedBoard[4].isBot, false);

    // Reload from storage and verify leaderboard persistence
    const reloaded = new ScoreTracker(storage);
    assert.equal(reloaded.getPlayerName(), 'VibeRunner');
    assert.equal(reloaded.getLeaderboard()[4].playerName, 'VibeRunner');
    assert.equal(reloaded.getLeaderboard()[4].score, 120);
  });

  it('Property 5 (Gacha Skin Rarities & Duplicate Cashback +40 Coins): assigns Common/Rare/Epic/Legendary rarities and refunds +40 coins on duplicates', () => {
    const storage = new MemoryStorage();
    const tracker = new ScoreTracker(storage);

    assert.equal(tracker.getSkinRarity('chicken'), 'Common');
    assert.equal(tracker.getSkinRarity('cyber_duck'), 'Rare');
    assert.equal(tracker.getSkinRarity('shadow_ninja'), 'Epic');
    assert.equal(tracker.getSkinRarity('frost_penguin'), 'Legendary');

    // Give 200 coins. Roll index 0 -> 'chicken' (Common), which is ALREADY unlocked at start!
    tracker.addCoins(200);
    const dupRoll = tracker.rollGacha(0);
    assert.equal(dupRoll.success, true);
    assert.equal(dupRoll.skinId, 'chicken');
    assert.equal(dupRoll.rarity, 'Common');
    assert.equal(dupRoll.isDuplicate, true);
    assert.equal(dupRoll.cashback, 40);
    // 200 - 100 (cost) + 40 (cashback) = 140 coins remaining
    assert.equal(tracker.getCoins(), 140);

    // Roll weighted probability 0.97 -> Legendary 'frost_penguin' (new skin!)
    const legRoll = tracker.rollGacha(0.97);
    assert.equal(legRoll.success, true);
    assert.equal(legRoll.skinId, 'frost_penguin');
    assert.equal(legRoll.rarity, 'Legendary');
    assert.equal(legRoll.isDuplicate, false);
    assert.equal(legRoll.cashback, 0);
    assert.equal(tracker.getCoins(), 40);

    // Roll frost_penguin again -> duplicate Legendary gives +40 cashback
    tracker.addCoins(60); // now 100 coins
    const dupLegRoll = tracker.rollGacha(0.97);
    assert.equal(dupLegRoll.isDuplicate, true);
    assert.equal(dupLegRoll.cashback, 40);
    assert.equal(tracker.getCoins(), 40);
  });

  it('Property 6 (Achievements System & Persistence): unlocks First 50 Steps, Collector, Train Conqueror, Rich Hopper, and Leaderboard Champion', () => {
    const storage = new MemoryStorage();
    const tracker = new ScoreTracker(storage);

    assert.equal(tracker.isAchievementUnlocked('first_50_steps'), false);
    assert.equal(tracker.isAchievementUnlocked('collector'), false);
    assert.equal(tracker.isAchievementUnlocked('train_conqueror'), false);

    // 1. First 50 steps
    tracker.updateRow(52);
    assert.equal(tracker.isAchievementUnlocked('first_50_steps'), true);

    // 2. Train Conqueror (survive 5 trains)
    for (let i = 0; i < 5; i++) {
      tracker.recordTrainSurvived();
    }
    assert.equal(tracker.getTrainsSurvived(), 5);
    assert.equal(tracker.isAchievementUnlocked('train_conqueror'), true);

    // 3. Rich Hopper (200+ coins) & Collector (all 4 skins unlocked)
    tracker.addCoins(400);
    assert.equal(tracker.isAchievementUnlocked('rich_hopper'), true);
    tracker.rollGacha(1);
    tracker.rollGacha(2);
    tracker.rollGacha(3);
    assert.equal(tracker.isAchievementUnlocked('collector'), true);

    // 4. Leaderboard Champion (beat top bot CyberKaiser > 250 pts)
    tracker.recordRun(265);
    assert.equal(tracker.isAchievementUnlocked('leaderboard_champion'), true);

    // Verify persistence across reload
    const reloaded = new ScoreTracker(storage);
    assert.equal(reloaded.getAchievements().every((a) => a.unlocked), true);
  });
});
