import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { GameEngine } from '../src/core/gameEngine.ts';
import { LaneGenerator } from '../src/core/laneGenerator.ts';
import { DeathReason, LaneType, MoveDirection, WORLD_CONFIG } from '../src/core/types.ts';

class MemoryStorage {
  private map = new Map<string, string>();
  getItem(key: string): string | null {
    return this.map.get(key) ?? null;
  }
  setItem(key: string, value: string): void {
    this.map.set(key, value);
  }
}

describe('Arcade Pro Update — Railway, Coins, Rocks/Bushes, Gacha Skins, Combo & Persistence', () => {
  it('Feature 1 (Railway & High-Speed Train): generates RAILWAY lanes with warning phase and kills player with TRAIN reason on impact', () => {
    assert.equal((LaneType as Record<string, string>).RAILWAY, 'RAILWAY', 'LaneType.RAILWAY must exist');
    assert.equal((DeathReason as Record<string, string>).TRAIN, 'TRAIN', 'DeathReason.TRAIN must exist');

    const gen = new LaneGenerator(2026);
    const lanes = gen.generateRange(3, 120);
    const railwayLanes = lanes.filter((l) => l.type === 'RAILWAY');
    assert.ok(railwayLanes.length >= 3, 'World must generate RAILWAY lanes');
    assert.ok(railwayLanes[0].train !== undefined, 'RAILWAY lane must have train state');

    const engine = new GameEngine(42);
    const rail = engine.getLane(1);
    rail.type = 'RAILWAY' as any;
    rail.obstacles = [];
    rail.train = {
      timer: 0,
      period: 4.0,
      warningDuration: 1.0,
      isWarning: false,
      isPassing: true,
      x: -2.0,
      length: 14.0,
      speed: 30.0,
    };

    engine.queueMove(MoveDirection.FORWARD);
    engine.step(WORLD_CONFIG.HOP_DURATION + 0.01);
    assert.equal(engine.getPlayer().row, 1);

    // Step train across x=0
    engine.step(0.08);
    assert.equal(engine.getPlayer().isDead, true, 'Passing train must kill player on tracks');
    assert.equal(engine.getPlayer().deathReason, 'TRAIN');
  });

  it('Feature 2 (Boulders & Bushes): GRASS lanes generate trees, rocks, and bushes in obstacleDetails synchronized with obstacles[]', () => {
    const gen = new LaneGenerator(777);
    const lanes = gen.generateRange(0, 80);
    const kindsFound = new Set<string>();

    for (const lane of lanes) {
      if (lane.type === LaneType.GRASS) {
        const details = (lane as any).obstacleDetails as Array<{ x: number; kind: string }> | undefined;
        assert.ok(Array.isArray(details), 'GRASS lane must include obstacleDetails array');
        assert.equal(details!.length, lane.obstacles.length, 'obstacleDetails count must match obstacles');
        for (const item of details!) {
          kindsFound.add(item.kind);
          assert.ok(lane.obstacles.includes(item.x));
        }
      }
    }

    assert.equal(kindsFound.has('tree'), true, 'Must generate trees');
    assert.equal(kindsFound.has('rock'), true, 'Must generate rocks (boulders)');
    assert.equal(kindsFound.has('bush'), true, 'Must generate bushes');
  });

  it('Feature 3 (Coins & Persistent Collection): coins spawn on unblocked tiles, are collected on step, and persist in Storage', () => {
    const storage = new MemoryStorage();
    const engine = new GameEngine(909, storage);
    const lane1 = engine.getLane(1);
    lane1.type = LaneType.GRASS;
    lane1.obstacles = [];
    (lane1 as any).obstacleDetails = [];
    (lane1 as any).coins = [0]; // Place coin at (row=1, x=0)

    const initialCoins = (engine as any).getCoins?.() ?? 0;
    engine.queueMove(MoveDirection.FORWARD);
    engine.step(WORLD_CONFIG.HOP_DURATION + 0.01);

    assert.equal((engine as any).getCoins(), initialCoins + 1, 'Landing on a coin must increment coin balance');
    assert.equal((lane1 as any).coins.includes(0), false, 'Collected coin must be removed from lane');

    // Verify persistence when creating a fresh GameEngine with the same storage
    const reloadedEngine = new GameEngine(999, storage);
    assert.equal((reloadedEngine as any).getCoins(), initialCoins + 1, 'Coins must persist across page reloads');
  });

  it('Feature 4 (Gacha Machine & 3 Unlockable Skins + Persistence): rolls 3 unique skins without duplicates and saves selected skin', () => {
    const storage = new MemoryStorage();
    const engine = new GameEngine(555, storage) as any;

    assert.deepEqual(engine.getUnlockedSkins(), ['chicken']);
    assert.equal(engine.getSelectedSkin(), 'chicken');

    // Cannot roll with 0 coins
    const failRoll = engine.rollGacha();
    assert.equal(failRoll.success, false, 'Gacha roll must fail when player has insufficient coins');

    // Grant 300 coins (3 rolls x 100 coins) and unlock all 3 gacha skins
    engine.addCoins(300);
    const unlockedSet = new Set<string>();
    for (let i = 0; i < 3; i++) {
      const res = engine.rollGacha();
      assert.equal(res.success, true, `Roll ${i + 1} should succeed`);
      unlockedSet.add(res.skinId);
    }

    assert.equal(unlockedSet.size, 3, '3 rolls must unlock 3 distinct new skins without duplicates');
    assert.equal(engine.getUnlockedSkins().length, 4, 'Player should now have chicken + 3 gacha skins');

    // Select one of the new skins and verify persistence on reload
    const chosenSkin = Array.from(unlockedSet)[0];
    engine.selectSkin(chosenSkin);
    assert.equal(engine.getSelectedSkin(), chosenSkin);

    const reloaded = new GameEngine(111, storage) as any;
    assert.equal(reloaded.getUnlockedSkins().length, 4, 'All 4 unlocked skins must persist in LocalStorage');
    assert.equal(reloaded.getSelectedSkin(), chosenSkin, 'Selected skin must persist in LocalStorage');
  });

  it('Feature 5 (Rhythm Combo & Desktop-Only HTML without Mobile Controls): rapid hops increase combo multiplier and index.html has no mobile pad', () => {
    const engine = new GameEngine(313) as any;
    for (let r = 1; r <= 10; r++) {
      const l = engine.getLane(r);
      l.type = LaneType.GRASS;
      l.obstacles = [];
      l.obstacleDetails = [];
    }

    for (let i = 0; i < 6; i++) {
      engine.queueMove(MoveDirection.FORWARD);
      engine.step(WORLD_CONFIG.HOP_DURATION + 0.01);
    }
    assert.ok(engine.getComboMultiplier() >= 2, 'Rapid consecutive forward hops must build combo multiplier >= 2');

    // Wait 1.5s idle -> combo resets to 1
    engine.step(1.5);
    assert.equal(engine.getComboMultiplier(), 1, 'Pausing for 1.5s must reset combo multiplier to 1');

    // Verify index.html has no mobile .controls-pad
    const html = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf8');
    assert.equal(html.includes('class="controls-pad"'), false, 'Mobile controls-pad must be removed from index.html');
    assert.equal(html.includes('gacha-btn'), true, 'Gacha machine button must be present in index.html');
  });
});
