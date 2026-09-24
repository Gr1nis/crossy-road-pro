import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { LaneGenerator } from '../src/core/laneGenerator.ts';
import { LaneType, WORLD_CONFIG } from '../src/core/types.ts';

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
});
