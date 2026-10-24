import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ScoreTracker, VALID_WORLD_IDS } from '../src/core/scoreTracker.ts';
import { GameEngine } from '../src/core/gameEngine.ts';
import {
  getBiomeForScore,
  MoveDirection,
  WORLD_CONFIG,
  type StorageAdapter,
} from '../src/core/types.ts';

class MemoryStorage implements StorageAdapter {
  private map = new Map<string, string>();

  getItem(key: string): string | null {
    return this.map.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.map.set(key, value);
  }
}

describe('World Biome Selection, Locking & Persistence Suite', () => {
  it('Property 1 (ScoreTracker World Selection & Persistence): defaults to auto, persists chosen world, handles invalid values and reset', () => {
    // 1. Default without storage
    const trackerNoStorage = new ScoreTracker();
    assert.equal(trackerNoStorage.getSelectedWorld(), 'auto');

    // 2. Default with empty storage
    const storage = new MemoryStorage();
    const tracker = new ScoreTracker(storage);
    assert.equal(tracker.getSelectedWorld(), 'auto');

    // 3. Cycle through valid worlds and verify persistence across reload
    const validWorlds = ['forest', 'winter', 'desert', 'neon', 'auto'];
    for (const world of validWorlds) {
      assert.ok(VALID_WORLD_IDS.has(world));
      tracker.setSelectedWorld(world);
      assert.equal(tracker.getSelectedWorld(), world);

      const reloaded = new ScoreTracker(storage);
      assert.equal(reloaded.getSelectedWorld(), world, `Reloaded instance should restore ${world}`);
    }

    // 4. Invalid input handling in setSelectedWorld
    tracker.setSelectedWorld('atlantis_underwater');
    assert.equal(tracker.getSelectedWorld(), 'auto', 'Invalid world ID must fall back to auto');
    const reloadedAfterInvalid = new ScoreTracker(storage);
    assert.equal(reloadedAfterInvalid.getSelectedWorld(), 'auto');

    // 5. Corrupted / invalid storage payload resilience
    storage.setItem('crossy_road_pro_profile_v1', JSON.stringify({ selectedWorld: 'cyberpunk_mars_99' }));
    const trackerFromCorrupted = new ScoreTracker(storage);
    assert.equal(trackerFromCorrupted.getSelectedWorld(), 'auto', 'Corrupted world ID in storage must default to auto');

    storage.setItem('crossy_road_pro_profile_v1', JSON.stringify({ selectedWorld: 12345 }));
    const trackerFromNumeric = new ScoreTracker(storage);
    assert.equal(trackerFromNumeric.getSelectedWorld(), 'auto', 'Non-string world ID in storage must default to auto');

    // 6. resetAllProgress restores selectedWorld to auto
    tracker.setSelectedWorld('desert');
    assert.equal(tracker.getSelectedWorld(), 'desert');
    tracker.resetAllProgress();
    assert.equal(tracker.getSelectedWorld(), 'auto');

    const reloadedAfterReset = new ScoreTracker(storage);
    assert.equal(reloadedAfterReset.getSelectedWorld(), 'auto');
  });

  it('Property 2 (Biome Locking & Hop Invariance): locks biome when biomeOverride is set, and does NOT switch biomes across 100+ hops', () => {
    const storage = new MemoryStorage();
    const tracker = new ScoreTracker(storage);
    tracker.setSelectedWorld('desert');

    const engine = new GameEngine(12345, storage);
    assert.equal(engine.getBiomeOverride(), 'desert');
    assert.equal(engine.getBiome(), 'desert');

    engine.setGodMode(true);
    engine.setIgnoreObstacles(true);

    const HOP_COUNT = 105;
    for (let hop = 1; hop <= HOP_COUNT; hop++) {
      const moved = engine.queueMove(MoveDirection.FORWARD);
      assert.equal(moved, true, `Hop ${hop} should start`);
      engine.step(WORLD_CONFIG.HOP_DURATION + 0.01);

      assert.equal(engine.getPlayer().row, hop);
      assert.equal(engine.getBiome(), 'desert', `Biome must remain locked to desert at hop ${hop}`);
      assert.equal(engine.getLane(hop).biome, 'desert', `Lane ${hop} biome must be desert`);
    }

    assert.ok(engine.getScore() >= 100, `Score must be >= 100, got: ${engine.getScore()}`);
    assert.equal(engine.getBiomeOverride(), 'desert');
    assert.equal(engine.getBiome(), 'desert');

    const activeLanes = engine.getActiveLanes();
    assert.ok(activeLanes.length > 0);
    for (const lane of activeLanes) {
      assert.equal(lane.biome, 'desert', `Active lane ${lane.index} must have biome desert`);
    }
  });

  it('Property 3 (Dynamic Auto Biome Cycle): auto-switches biomes every 25 points when biomeOverride is null (auto)', () => {
    const storage = new MemoryStorage();
    const engine = new GameEngine(54321, storage);
    assert.equal(engine.getBiomeOverride(), null);
    assert.equal(engine.getSelectedWorld(), 'auto');

    engine.setGodMode(true);
    engine.setIgnoreObstacles(true);

    const visitedBiomes = new Set<string>();
    const TOTAL_HOPS = 105;

    for (let hop = 1; hop <= TOTAL_HOPS; hop++) {
      const moved = engine.queueMove(MoveDirection.FORWARD);
      assert.equal(moved, true);
      engine.step(WORLD_CONFIG.HOP_DURATION + 0.01);

      const score = engine.getScore();
      const expectedBiome = getBiomeForScore(score);
      const currentBiome = engine.getBiome();

      assert.equal(currentBiome, expectedBiome, `At score ${score}, biome should match getBiomeForScore`);
      assert.equal(engine.getLane(hop).biome, expectedBiome);
      visitedBiomes.add(currentBiome);
    }

    // Must have cycled through all 4 biomes across 100+ points
    assert.ok(visitedBiomes.has('forest'), 'Should have visited forest');
    assert.ok(visitedBiomes.has('winter'), 'Should have visited winter');
    assert.ok(visitedBiomes.has('desert'), 'Should have visited desert');
    assert.ok(visitedBiomes.has('neon'), 'Should have visited neon');

    // Dynamic runtime override and switchback
    engine.setBiomeOverride('winter');
    assert.equal(engine.getBiome(), 'winter');
    assert.equal(engine.getSelectedWorld(), 'winter');

    engine.setBiomeOverride(null);
    assert.equal(engine.getBiomeOverride(), null);
    assert.equal(engine.getSelectedWorld(), 'auto');
    const expectedCurrentBiome = getBiomeForScore(engine.getScore());
    assert.equal(engine.getBiome(), expectedCurrentBiome);
  });

  it('Property 4 (Inheritance of biomeOverride in Newly Generated Lanes & Engine Reset): newly generated lanes inherit override', () => {
    const storage = new MemoryStorage();
    const tracker = new ScoreTracker(storage);
    tracker.setSelectedWorld('neon');

    const engine = new GameEngine(999, storage);
    assert.equal(engine.getBiomeOverride(), 'neon');

    // Far-ahead lanes generated on demand
    const farAheadRows = [0, 5, 25, 50, 75, 100, 250, 500];
    for (const r of farAheadRows) {
      const lane = engine.getLane(r);
      assert.equal(lane.biome, 'neon', `On-demand lane at row ${r} must inherit neon override`);
    }

    // Engine reset preserves biomeOverride and applies it to freshly generated initial lanes
    engine.reset(888);
    assert.equal(engine.getBiomeOverride(), 'neon', 'reset() must preserve biomeOverride');
    assert.equal(engine.getBiome(), 'neon');

    for (let r = 0; r <= 30; r++) {
      const lane = engine.getLane(r);
      assert.equal(lane.biome, 'neon', `Post-reset lane at row ${r} must inherit neon override`);
    }

    // Resetting all progress clears override
    engine.resetAllProgress();
    assert.equal(engine.getBiomeOverride(), null);
    assert.equal(engine.getSelectedWorld(), 'auto');
    assert.equal(engine.getLane(0).biome, 'forest');
  });
});
