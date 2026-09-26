import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { GameEngine } from '../src/core/gameEngine.ts';
import { DeathReason, LaneType, MoveDirection, WORLD_CONFIG } from '../src/core/types.ts';

describe('GameEngine — Adversarial Physics, Log Riding & Collision Tests', () => {
  it('Invariant 1 (Tree & World Boundary Blocking): jumping into a tree or outside [-9..9] on land cancels movement without dying', () => {
    const engine = new GameEngine(42);
    const lane1 = engine.getLane(1);
    lane1.type = LaneType.GRASS;
    lane1.obstacles = [0]; // Put a tree directly in front of player at (row=1, x=0)

    engine.queueMove(MoveDirection.FORWARD);
    engine.step(WORLD_CONFIG.HOP_DURATION + 0.05);

    const p = engine.getPlayer();
    assert.equal(p.isDead, false);
    assert.equal(p.row, 0, 'Player must not enter tile with tree');
    assert.equal(p.x, 0);

    // Clear obstacles on row 0 and try walking beyond MIN_X (-9)
    const lane0 = engine.getLane(0);
    lane0.obstacles = [];
    for (let i = 0; i < 15; i++) {
      engine.queueMove(MoveDirection.LEFT);
      engine.step(WORLD_CONFIG.HOP_DURATION + 0.02);
    }
    assert.equal(engine.getPlayer().x, WORLD_CONFIG.MIN_X, 'Player must stop at MIN_X (-9) wall');
    assert.equal(engine.getPlayer().isDead, false);
  });

  it('Invariant 2 (Continuous Log Drift & Conservation of Relative X): riding a log preserves relative offset and quantizes X when jumping onto land', () => {
    const engine = new GameEngine(101);
    const riverLane = engine.getLane(1);
    riverLane.type = LaneType.RIVER;
    riverLane.obstacles = [];
    riverLane.vehicles = [];
    riverLane.logs = [{ id: 77, x: 0, length: 3.5, speed: 2.5 }];

    const landLane2 = engine.getLane(2);
    landLane2.type = LaneType.GRASS;
    landLane2.obstacles = [];

    // Jump onto the river log at row 1
    engine.queueMove(MoveDirection.FORWARD);
    engine.step(WORLD_CONFIG.HOP_DURATION + 0.01);

    assert.equal(engine.getPlayer().isDead, false, 'Player should land safely on the log');
    assert.equal(engine.getPlayer().row, 1);

    const initialRelativeX = engine.getPlayer().x - riverLane.logs[0].x;

    // Step with arbitrary fractional delta times so player.x becomes fractional (e.g. ~1.375)
    const dts = [0.11, 0.17, 0.09, 0.18];
    for (const dt of dts) {
      engine.step(dt);
      const currentRel = engine.getPlayer().x - riverLane.logs[0].x;
      assert.ok(
        Math.abs(currentRel - initialRelativeX) < 1e-5,
        `Relative offset drifted: expected ${initialRelativeX}, got ${currentRel}`
      );
    }

    // Player X is now fractional on the log (~1.375)
    assert.equal(Number.isInteger(engine.getPlayer().x), false);

    // Jump from fractional log position onto GRASS lane 2
    engine.queueMove(MoveDirection.FORWARD);
    engine.step(WORLD_CONFIG.HOP_DURATION + 0.02);

    const afterLand = engine.getPlayer();
    assert.equal(afterLand.isDead, false);
    assert.equal(afterLand.row, 2);
    assert.equal(
      Number.isInteger(afterLand.x),
      true,
      `Landing on GRASS from a log MUST quantize X to an integer, got ${afterLand.x}`
    );
  });

  it('Invariant 3 (River Drowning): jumping into a RIVER tile with no supporting log kills player with WATER reason', () => {
    const engine = new GameEngine(202);
    const riverLane = engine.getLane(1);
    riverLane.type = LaneType.RIVER;
    riverLane.logs = [{ id: 1, x: 6, length: 2.0, speed: 1.0 }]; // Far away from x=0

    engine.queueMove(MoveDirection.FORWARD);
    engine.step(WORLD_CONFIG.HOP_DURATION + 0.02);

    assert.equal(engine.getPlayer().isDead, true);
    assert.equal(engine.getPlayer().deathReason, DeathReason.WATER);
  });

  it('Invariant 4 (Log Out-Of-Bounds Death): riding a log past OUT_OF_BOUNDS_X kills player with OUT_OF_BOUNDS reason', () => {
    const engine = new GameEngine(303);
    const riverLane = engine.getLane(1);
    riverLane.type = LaneType.RIVER;
    riverLane.logs = [{ id: 9, x: 0, length: 4.0, speed: 5.0 }];

    engine.queueMove(MoveDirection.FORWARD);
    engine.step(WORLD_CONFIG.HOP_DURATION + 0.01);
    assert.equal(engine.getPlayer().isDead, false);

    // Advance time until log carries player beyond +9.6
    for (let i = 0; i < 30; i++) {
      engine.step(0.1);
    }

    assert.equal(engine.getPlayer().isDead, true);
    assert.equal(engine.getPlayer().deathReason, DeathReason.OUT_OF_BOUNDS);
  });

  it('Invariant 5 (Vehicle AABB Collision): car hitting player on ROAD lane triggers CAR death', () => {
    const engine = new GameEngine(404);
    const roadLane = engine.getLane(1);
    roadLane.type = LaneType.ROAD;
    roadLane.obstacles = [];
    roadLane.vehicles = [{ id: 500, x: -2.0, length: 1.6, speed: 10.0, type: 'car', color: 0xff0000 }];

    engine.queueMove(MoveDirection.FORWARD);
    engine.step(WORLD_CONFIG.HOP_DURATION + 0.01);
    assert.equal(engine.getPlayer().row, 1);

    // Step until car moves across x=0
    for (let i = 0; i < 10; i++) {
      engine.step(0.05);
    }

    assert.equal(engine.getPlayer().isDead, true);
    assert.equal(engine.getPlayer().deathReason, DeathReason.CAR);
  });

  it('Invariant 6 (Camera Scroll Timeout & Grace Period): crossing camera back edge does not kill immediately; requires grace period expiry', () => {
    const engine = new GameEngine(505);
    // Advance camera until player row is past CAMERA_BACK_LIMIT
    // CAMERA_BACK_LIMIT = 7.2, player is at row 0, base speed = 0.85
    // Camera reaches 7.2 + 0.1 around 8.6 seconds
    const stepDt = 0.1;
    let crossedEdge = false;

    for (let i = 0; i < 200; i++) {
      engine.step(stepDt);
      if (!crossedEdge && engine.getCameraZ() - engine.getPlayer().row > WORLD_CONFIG.CAMERA_BACK_LIMIT) {
        crossedEdge = true;
        // At the moment of crossing, player must NOT be dead yet thanks to the grace period!
        assert.equal(engine.getPlayer().isDead, false, 'Player must remain alive during camera grace period');
        assert.ok(engine.getCameraGraceRatio() > 0, 'Grace timer ratio should be actively counting');
      }
      if (engine.getPlayer().isDead) break;
    }

    assert.equal(crossedEdge, true, 'Player should cross the camera back boundary');
    assert.equal(engine.getPlayer().isDead, true, 'Player should die after grace period expires');
    assert.equal(engine.getPlayer().deathReason, DeathReason.CAMERA_BEHIND);
  });
});
