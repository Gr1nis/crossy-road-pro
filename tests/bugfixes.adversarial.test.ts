import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { GameEngine } from '../src/core/gameEngine.ts';
import * as collisionModule from '../src/core/collision.ts';
import { LaneType, MoveDirection, WORLD_CONFIG } from '../src/core/types.ts';

const { findSupportingLog } = collisionModule;
const worldToScreenX = (collisionModule as Record<string, unknown>).worldToScreenX as
  | ((x: number) => number)
  | undefined;
const vehicleScreenRotationY = (collisionModule as Record<string, unknown>)
  .vehicleScreenRotationY as ((speed: number) => number) | undefined;

describe('Adversarial Bugfix Suite — Coordinate Sync, Log Hop Drift, Input Queue & Wrap Ring', () => {
  it('Bug 1 (Scene-Physics X-Axis Synchronization): worldToScreenX maps all entities identically so logs, trees, cars, and player never mirror-invert', () => {
    assert.equal(typeof worldToScreenX, 'function', 'worldToScreenX must be exported from collision.ts');
    assert.equal(worldToScreenX!(0), 0);
    assert.equal(worldToScreenX!(4), -4);
    assert.equal(worldToScreenX!(-3.5), 3.5);

    // Verify vehicle rotation matches inverted screen X axis
    assert.equal(typeof vehicleScreenRotationY, 'function');
    assert.notEqual(vehicleScreenRotationY!(3.0), vehicleScreenRotationY!(-3.0));

    // Verify SceneManager applies worldToScreenX to trees, vehicles, logs, and player
    const sceneManagerSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/view/sceneManager.ts'),
      'utf8'
    );
    assert.equal(
      sceneManagerSrc.includes('worldToScreenX(treeX)'),
      true,
      'SceneManager must position trees using worldToScreenX(treeX)'
    );
    assert.equal(
      sceneManagerSrc.includes('worldToScreenX(v.x)'),
      true,
      'SceneManager must position vehicles using worldToScreenX(v.x)'
    );
    assert.equal(
      sceneManagerSrc.includes('worldToScreenX(log.x)'),
      true,
      'SceneManager must position logs using worldToScreenX(log.x)'
    );
  });

  it('Bug 2 (Tight Log Hitbox Margin): player cannot hover 0.30 tiles past physical log end over open water', () => {
    const log = { id: 1, x: 0, length: 3.0, speed: 2.0 };
    // Half-length is 1.5. At x = 1.80 (0.30 past edge), player must NOT be supported
    assert.equal(
      findSupportingLog(1.8, [log]),
      null,
      'Standing 0.30 tiles outside physical log end must not count as supported'
    );
    // At x = 1.58 (within 0.12 margin), player IS supported
    assert.notEqual(findSupportingLog(1.58, [log]), null);
  });

  it('Bug 3 (Log Drift During Hop Animation): hopping along a moving log preserves exact relative step (-1/+1) on the log without slipping', () => {
    const engine = new GameEngine(707);
    const riverLane = engine.getLane(1);
    riverLane.type = LaneType.RIVER;
    riverLane.obstacles = [];
    riverLane.vehicles = [];
    riverLane.logs = [{ id: 88, x: 0, length: 3.8, speed: 4.0 }];

    // First hop onto the log at (row=1, x=0)
    engine.queueMove(MoveDirection.FORWARD);
    engine.step(WORLD_CONFIG.HOP_DURATION + 0.01);
    assert.equal(engine.getPlayer().row, 1);
    assert.equal(engine.getPlayer().isDead, false);

    const relBeforeHop = engine.getPlayer().x - riverLane.logs[0].x;

    // Now hop RIGHT (+1) along the same fast-moving log (speed = 4.0)
    engine.queueMove(MoveDirection.RIGHT);
    engine.step(WORLD_CONFIG.HOP_DURATION / 2);
    engine.step(WORLD_CONFIG.HOP_DURATION / 2 + 0.01);

    const p = engine.getPlayer();
    assert.equal(p.isDead, false, 'Player should stay on the log after stepping along it');
    const relAfterHop = p.x - riverLane.logs[0].x;
    assert.ok(
      Math.abs(relAfterHop - (relBeforeHop + 1)) < 1e-3,
      `Expected relative X on log to shift by exactly +1 (to ${relBeforeHop + 1}), but got ${relAfterHop}`
    );
  });

  it('Bug 4 (Input Queue Non-Stalling & Blocked Move Feedback): blocked move in queue does not stall subsequent valid move and returns false', () => {
    const engine = new GameEngine(808);
    const lane0 = engine.getLane(0);
    lane0.obstacles = [];
    const lane1 = engine.getLane(1);
    lane1.type = LaneType.GRASS;
    lane1.obstacles = [0]; // Tree directly ahead at (row=1, x=0)

    // Attempt blocked move when idle -> should return false (no hop started)
    const startedBlocked = engine.queueMove(MoveDirection.FORWARD);
    assert.equal(startedBlocked, false, 'queueMove should return false when move is blocked by a tree');
    assert.equal(engine.getPlayer().isHopping, false);

    // Start a valid move RIGHT to x=1, and while mid-hop queue a blocked FORWARD (if tree at (1,1)) + valid RIGHT (to x=2)
    lane1.obstacles = [0, 1];
    const startedValid = engine.queueMove(MoveDirection.RIGHT);
    assert.equal(startedValid, true, 'queueMove should return true when hop starts');

    // While hopping to (0, 1), buffer FORWARD (blocked by tree at (1,1)) and RIGHT (valid to (0,2))
    engine.queueMove(MoveDirection.FORWARD);
    engine.queueMove(MoveDirection.RIGHT);

    // Finish first hop -> engine should skip blocked FORWARD and immediately start valid RIGHT hop
    engine.step(WORLD_CONFIG.HOP_DURATION + 0.01);
    assert.equal(
      engine.getPlayer().isHopping,
      true,
      'Engine must skip blocked queued move and immediately start the next valid queued move'
    );
    engine.step(WORLD_CONFIG.HOP_DURATION + 0.01);
    assert.equal(engine.getPlayer().x, 2);
  });

  it('Bug 5 (Expanded Wrap Limit Outside Camera Frustum): WRAP_LIMIT is >= 22 so vehicles and logs do not pop in/out on 16:9 screens', () => {
    assert.ok(
      WORLD_CONFIG.WRAP_LIMIT >= 22,
      `Expected WORLD_CONFIG.WRAP_LIMIT >= 22, got ${WORLD_CONFIG.WRAP_LIMIT}`
    );
  });
});
