import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { GameEngine } from '../src/core/gameEngine.ts';
import { LaneGenerator } from '../src/core/laneGenerator.ts';
import {
  Biome,
  BIOME_INTERVAL,
  BIOME_ORDER,
  getBiomeForScore,
  LaneType,
  MoveDirection,
  WORLD_CONFIG,
} from '../src/core/types.ts';

describe('LaneGenerator — Adversarial & Property-Based Tests', () => {
  it('Property 1 (Safe Spawn Zone): lanes -3..2 are always GRASS and center path (x=0) is clear on rows 0..2', () => {
    const seeds = [1, 42, 777, 1337, 999999];
    for (const seed of seeds) {
      const gen = new LaneGenerator(seed);
      const startLanes = gen.generateRange(-3, 2);
      assert.equal(startLanes.length, 6);
      for (const lane of startLanes) {
        assert.equal(lane.type, LaneType.GRASS, `Lane ${lane.index} must be GRASS for seed ${seed}`);
        if (lane.index >= 0 && lane.index <= 2) {
          assert.equal(
            lane.obstacles.includes(0),
            false,
            `Center column x=0 on row ${lane.index} must never be blocked at spawn (seed=${seed})`
          );
        }
      }
    }
  });

  it('Property 2 (Solvability Invariant): across 5 seeds x 500 lanes (2,500 lanes), every GRASS lane has >= 4 free columns and shares at least 1 unblocked column with adjacent GRASS lanes', () => {
    const seeds = [7, 42, 2026, 88888, 314159];
    const totalCols = WORLD_CONFIG.MAX_X - WORLD_CONFIG.MIN_X + 1;

    for (const seed of seeds) {
      const gen = new LaneGenerator(seed);
      const lanes = gen.generateRange(0, 500);

      for (let i = 0; i < lanes.length; i++) {
        const lane = lanes[i];
        if (lane.type === LaneType.GRASS) {
          const freeCols: number[] = [];
          for (let x = WORLD_CONFIG.MIN_X; x <= WORLD_CONFIG.MAX_X; x++) {
            if (!lane.obstacles.includes(x)) {
              freeCols.push(x);
            }
          }
          assert.ok(
            freeCols.length >= 4,
            `Lane ${lane.index} (seed=${seed}) has only ${freeCols.length} free columns out of ${totalCols}`
          );

          if (i > 0 && lanes[i - 1].type === LaneType.GRASS) {
            const prev = lanes[i - 1];
            const shared = freeCols.filter((x) => !prev.obstacles.includes(x));
            assert.ok(
              shared.length >= 1,
              `Adjacent GRASS lanes ${prev.index} and ${lane.index} (seed=${seed}) have NO shared passable column!`
            );
          }
        }
      }
    }
  });

  it('Property 3 (Determinism): identical seeds generate strictly identical worlds, different seeds diverge', () => {
    const genA = new LaneGenerator(12345);
    const genB = new LaneGenerator(12345);
    const genC = new LaneGenerator(54321);

    const worldA = genA.generateRange(0, 80);
    const worldB = genB.generateRange(0, 80);
    const worldC = genC.generateRange(0, 80);

    assert.deepEqual(worldA, worldB);
    assert.notDeepEqual(worldA, worldC);
  });

  it('Property 4 (River Alternating Flow & Non-Empty Logs): consecutive RIVER lanes alternate flow direction and always spawn logs', () => {
    const gen = new LaneGenerator(42);
    const lanes = gen.generateRange(0, 300);

    for (let i = 0; i < lanes.length; i++) {
      const lane = lanes[i];
      if (lane.type === LaneType.RIVER) {
        assert.ok(lane.logs.length >= 2, `RIVER lane ${lane.index} must have at least 2 logs`);
        if (i > 0 && lanes[i - 1].type === LaneType.RIVER) {
          assert.equal(
            lane.direction,
            -lanes[i - 1].direction,
            `Consecutive RIVER lanes ${i - 1} and ${i} must have alternating flow directions`
          );
        }
      }
    }
  });

  it('Property 5 (Biome Cycle Every 25 Points in Lane & GameState): rotates forest -> winter -> desert -> neon every 25 points', () => {
    assert.equal(BIOME_INTERVAL, 25);
    assert.deepEqual(BIOME_ORDER, ['forest', 'winter', 'desert', 'neon']);

    const gen = new LaneGenerator(42);
    const lanes = gen.generateRange(-3, 124);

    for (const lane of lanes) {
      if (lane.index < 25) {
        assert.equal(lane.biome, Biome.FOREST, `Row ${lane.index} should be 'forest'`);
      } else if (lane.index < 50) {
        assert.equal(lane.biome, Biome.WINTER, `Row ${lane.index} should be 'winter'`);
      } else if (lane.index < 75) {
        assert.equal(lane.biome, Biome.DESERT, `Row ${lane.index} should be 'desert'`);
      } else if (lane.index < 100) {
        assert.equal(lane.biome, Biome.NEON, `Row ${lane.index} should be 'neon'`);
      } else {
        assert.equal(lane.biome, Biome.FOREST, `Row ${lane.index} should cycle back to 'forest'`);
      }
    }

    // Verify GameEngine GameState biome progression as player scores points across all 4 biomes
    const engine = new GameEngine(777);
    assert.equal(engine.getBiome(), 'forest');
    assert.equal(engine.getGameState().biome, 'forest');

    for (let r = 1; r <= 110; r++) {
      const l = engine.getLane(r);
      l.type = LaneType.GRASS;
      l.obstacles = [];
      l.obstacleDetails = [];
    }

    const visitedBiomes = new Set<string>([engine.getBiome()]);
    for (let step = 1; step <= 105; step++) {
      engine.queueMove(MoveDirection.FORWARD);
      engine.step(WORLD_CONFIG.HOP_DURATION + 0.01);

      const expectedBiome = getBiomeForScore(engine.getScore());
      visitedBiomes.add(expectedBiome);
      assert.equal(engine.getBiome(), expectedBiome);
      assert.equal(engine.getGameState().biome, expectedBiome);
      assert.equal(engine.getLane(engine.getPlayer().row).biome, expectedBiome);
    }

    assert.ok(engine.getScore() >= 100, `Expected score >= 100 after 105 hops, got ${engine.getScore()}`);
    assert.deepEqual(Array.from(visitedBiomes), ['forest', 'winter', 'desert', 'neon']);
    assert.equal(engine.getBiome(), 'forest', 'Score >= 100 (and < 125) must cycle back to forest biome');
  });

  it('Property 6 (Progressive Difficulty — Vehicle & Train Speeds): vehicle and train speeds strictly increase as score grows', () => {
    const gen = new LaneGenerator(2026);
    const earlyLanes = gen.generateRange(3, 24, 0);
    const midLanes = gen.generateRange(3, 24, 50);
    const lateLanes = gen.generateRange(3, 24, 100);

    const avgRoadSpeed = (lanes: ReturnType<typeof gen.generateRange>) => {
      const roads = lanes.filter((l) => l.type === LaneType.ROAD);
      assert.ok(roads.length > 0, 'Must have ROAD lanes in sample');
      return roads.reduce((acc, l) => acc + Math.abs(l.speed), 0) / roads.length;
    };

    const speed0 = avgRoadSpeed(earlyLanes);
    const speed50 = avgRoadSpeed(midLanes);
    const speed100 = avgRoadSpeed(lateLanes);

    assert.ok(speed50 > speed0, `Road speed at score 50 (${speed50}) must exceed score 0 (${speed0})`);
    assert.ok(speed100 > speed50, `Road speed at score 100 (${speed100}) must exceed score 50 (${speed50})`);

    // Verify railway train speed and frequency progression
    const earlyRail = earlyLanes.find((l) => l.type === LaneType.RAILWAY)!;
    const lateRail = lateLanes.find((l) => l.type === LaneType.RAILWAY)!;
    assert.ok(earlyRail && lateRail, 'Must have RAILWAY lanes');
    assert.ok(
      Math.abs(lateRail.train!.speed) > Math.abs(earlyRail.train!.speed),
      `Train speed at score 100 (${Math.abs(lateRail.train!.speed)}) must exceed score 0 (${Math.abs(earlyRail.train!.speed)})`
    );
    assert.ok(
      lateRail.train!.period < earlyRail.train!.period,
      `Train period at score 100 (${lateRail.train!.period}) must be shorter than score 0 (${earlyRail.train!.period})`
    );
    assert.ok(lateRail.train!.period >= 3.0, 'Train period must maintain a safe crossing window >= 3.0s');
  });

  it('Property 7 (Progressive Traffic Density & Guaranteed Road Passability): traffic count increases with score while preserving safe crossing gaps', () => {
    const gen = new LaneGenerator(42);
    const lowScoreRoads = gen.generateRange(3, 40, 0).filter((l) => l.type === LaneType.ROAD);
    const highScoreRoads = gen.generateRange(3, 40, 100).filter((l) => l.type === LaneType.ROAD);

    const avgVehicles = (roads: typeof lowScoreRoads) =>
      roads.reduce((sum, r) => sum + r.vehicles.length, 0) / roads.length;

    const densityLow = avgVehicles(lowScoreRoads);
    const densityHigh = avgVehicles(highScoreRoads);
    assert.ok(
      densityHigh > densityLow,
      `Traffic density at score 100 (${densityHigh}) must exceed score 0 (${densityLow})`
    );

    // Verify guaranteed passability across 300 high-difficulty lanes:
    // Every ROAD lane must have safe bumper-to-bumper gaps >= 2.0 units on the wrap ring
    const ringSpan = WORLD_CONFIG.WRAP_LIMIT * 2;
    const highDiffLanes = gen.generateRange(3, 300);
    for (const lane of highDiffLanes) {
      if (lane.type === LaneType.ROAD) {
        const sorted = [...lane.vehicles].sort((a, b) => a.x - b.x);
        assert.ok(sorted.length >= 2, `Road lane ${lane.index} must spawn vehicles`);

        let maxGap = 0;
        for (let i = 0; i < sorted.length; i++) {
          const curr = sorted[i];
          const next = sorted[(i + 1) % sorted.length];
          const rawDist = i + 1 < sorted.length ? next.x - curr.x : next.x + ringSpan - curr.x;
          const clearGap = rawDist - (curr.length + next.length) / 2;
          if (clearGap > maxGap) maxGap = clearGap;
          assert.ok(
            clearGap >= WORLD_CONFIG.PLAYER_WIDTH * 2,
            `Road lane ${lane.index} has overlapping or impassable gap (${clearGap.toFixed(2)}) between vehicles`
          );
        }
        assert.ok(maxGap >= 2.0, `Road lane ${lane.index} must have at least one >= 2.0u crossing gap`);
      }
    }
  });
});
