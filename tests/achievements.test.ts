import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  AchievementTracker,
  ACHIEVEMENT_DEFINITIONS,
} from '../src/core/achievements.ts';
import type { AchievementId } from '../src/core/achievements.ts';

describe('Adversarial TDD — Achievements System & Expansion', () => {
  it('Property 1: Pool size is exactly 10 definitions and combo is excluded', () => {
    assert.equal(ACHIEVEMENT_DEFINITIONS.length, 10);
    const ids = ACHIEVEMENT_DEFINITIONS.map((d) => d.id);
    assert.ok(!ids.includes('combo_master' as AchievementId), 'Combo achievement must not exist');
    assert.ok(ids.includes('centurion'));
    assert.ok(ids.includes('gacha_roller'));
    assert.ok(ids.includes('coin_hoarder'));
    assert.ok(ids.includes('river_navigator'));
    assert.ok(ids.includes('speedy_crosser'));
  });

  it('Property 2: Progress calculations are strictly clamped between 0 and 100', () => {
    const tracker = new AchievementTracker();
    const list = tracker.getAchievements({
      score: -50,
      coins: -100,
      unlockedSkinsCount: 0,
      allSkinsCount: 4,
      isTop1: false,
      runCoins: -10,
      logsHopped: -5,
      forwardStreak: -20,
      gachaRolls: -3,
    });

    for (const ach of list) {
      assert.ok(ach.currentProgress >= 0, `${ach.id} currentProgress must be >= 0`);
      assert.ok(ach.progressPercent >= 0 && ach.progressPercent <= 100, `${ach.id} percent must be 0..100`);
      assert.equal(ach.unlocked, false);
    }
  });

  it('Property 3: Threshold unlock triggers for all 10 achievements with dates', () => {
    const tracker = new AchievementTracker();
    tracker.recordTrainSurvived(5);
    tracker.recordLogHopped(10);
    tracker.recordGachaRoll(3);

    const newlyUnlocked = tracker.evaluate({
      score: 120,
      coins: 250,
      unlockedSkinsCount: 4,
      allSkinsCount: 4,
      isTop1: true,
      runCoins: 35,
      logsHopped: 10,
      forwardStreak: 35,
      gachaRolls: 3,
    });

    assert.equal(newlyUnlocked.length, 7, 'Remaining 7 achievements unlocked in evaluate');
    assert.equal(tracker.getUnlockedIds().length, 10, 'All 10 achievements should be unlocked in total');
    const summary = tracker.getSummary();
    assert.equal(summary.total, 10);
    assert.equal(summary.unlockedCount, 10);
    assert.equal(summary.percent, 100);

    for (const ach of tracker.getAchievements()) {
      assert.equal(ach.unlocked, true);
      assert.ok(ach.unlockedAt && ach.unlockedAt.length >= 10);
      assert.equal(ach.currentProgress, ach.maxProgress);
      assert.equal(ach.progressPercent, 100);
    }
  });

  it('Property 4: Adversarial Storage persistence handles corruption & restores dates', () => {
    const initialTracker = new AchievementTracker();
    initialTracker.unlock('centurion', '2026-10-04');
    initialTracker.unlock('gacha_roller', '2026-10-05');
    initialTracker.recordTrainSurvived(3);
    initialTracker.recordLogHopped(7);
    initialTracker.recordGachaRoll(2);

    const serialized = initialTracker.serialize();
    const restored = AchievementTracker.deserialize(serialized);

    assert.equal(restored.isUnlocked('centurion'), true);
    assert.equal(restored.isUnlocked('gacha_roller'), true);
    assert.equal(restored.isUnlocked('first_50_steps'), false);
    assert.equal(restored.getTrainsSurvived(), 3);
    assert.equal(restored.getLogsHopped(), 7);
    assert.equal(restored.getGachaRolls(), 2);

    // Corrupted input test
    const corrupted = AchievementTracker.deserialize('{ invalid json: true ]');
    assert.equal(corrupted.getSummary().unlockedCount, 0);
  });

  it('Property 5: Difficulty ranking tiers and reward coins are assigned correctly for all 10 achievements', () => {
    const tracker = new AchievementTracker();
    const list = tracker.getAchievements();

    const expectedTiers: Record<string, { difficulty: string; rewardCoins: number }> = {
      first_50_steps: { difficulty: 'easy', rewardCoins: 25 },
      gacha_roller: { difficulty: 'easy', rewardCoins: 25 },
      river_navigator: { difficulty: 'easy', rewardCoins: 25 },
      centurion: { difficulty: 'medium', rewardCoins: 50 },
      rich_hopper: { difficulty: 'medium', rewardCoins: 50 },
      speedy_crosser: { difficulty: 'medium', rewardCoins: 50 },
      train_conqueror: { difficulty: 'hard', rewardCoins: 100 },
      coin_hoarder: { difficulty: 'hard', rewardCoins: 100 },
      collector: { difficulty: 'master', rewardCoins: 200 },
      leaderboard_champion: { difficulty: 'master', rewardCoins: 200 },
    };

    for (const ach of list) {
      const exp = expectedTiers[ach.id];
      assert.ok(exp, `Achievement ${ach.id} must have expected tier`);
      assert.equal(ach.difficulty, exp.difficulty, `${ach.id} difficulty must match`);
      assert.equal(ach.rewardCoins, exp.rewardCoins, `${ach.id} rewardCoins must match`);
      assert.equal(ach.claimed, false);
      assert.equal(ach.canClaim, false);
    }
  });

  it('Property 6: Claiming mechanic awards coins, prevents duplicate claims, and persists claimed state', () => {
    const memory = new Map<string, string>();
    const storage = {
      getItem: (k: string) => memory.get(k) ?? null,
      setItem: (k: string, v: string) => { memory.set(k, v); },
      removeItem: (k: string) => { memory.delete(k); },
    };

    const tracker = new AchievementTracker();

    // Locked achievement cannot be claimed
    assert.equal(tracker.claim('first_50_steps').success, false);
    assert.equal(tracker.isClaimed('first_50_steps'), false);

    // Unlock achievement
    assert.equal(tracker.unlock('first_50_steps'), true);
    assert.equal(tracker.isUnlocked('first_50_steps'), true);
    const unlList = tracker.getAchievements();
    const first50 = unlList.find((a) => a.id === 'first_50_steps')!;
    assert.equal(first50.unlocked, true);
    assert.equal(first50.claimed, false);
    assert.equal(first50.canClaim, true);

    // First claim succeeds and awards 25 coins
    const claimRes = tracker.claim('first_50_steps');
    assert.equal(claimRes.success, true);
    assert.equal(claimRes.rewardCoins, 25);
    assert.equal(tracker.isClaimed('first_50_steps'), true);

    const claimedList = tracker.getAchievements();
    const claimedAch = claimedList.find((a) => a.id === 'first_50_steps')!;
    assert.equal(claimedAch.claimed, true);
    assert.equal(claimedAch.canClaim, false);

    // Second claim fails (idempotent / no duplicate reward)
    const secondClaim = tracker.claim('first_50_steps');
    assert.equal(secondClaim.success, false);
    assert.equal(secondClaim.rewardCoins, 0);

    // Serialization preserves claimed IDs
    const serialized = tracker.serialize();
    const restored = AchievementTracker.deserialize(serialized);
    assert.equal(restored.isUnlocked('first_50_steps'), true);
    assert.equal(restored.isClaimed('first_50_steps'), true);
    assert.equal(restored.claim('first_50_steps').success, false);
  });
});
