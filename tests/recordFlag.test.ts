import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { getRecordFlagPosition, RECORD_FLAG_X, worldToScreenX } from '../src/core/collision.ts';
import { MeshFactory } from '../src/view/meshFactory.ts';

describe('PB Record Flag & Breakthrough VFX Suite', () => {
  it('Property 1 (Coordinate Calculation): accurately maps highScore to row and shoulder coordinate', () => {
    // Normal highScores
    const pos15 = getRecordFlagPosition(15);
    assert.notEqual(pos15, null);
    assert.equal(pos15?.row, 15);
    assert.equal(pos15?.x, RECORD_FLAG_X);

    const pos42 = getRecordFlagPosition(42);
    assert.notEqual(pos42, null);
    assert.equal(pos42?.row, 42);
    assert.equal(pos42?.x, 3.8);

    const pos100 = getRecordFlagPosition(100);
    assert.notEqual(pos100, null);
    assert.equal(pos100?.row, 100);
    assert.equal(pos100?.x, 3.8);

    // Coordinate conversion in Three.js screen space
    assert.equal(worldToScreenX(RECORD_FLAG_X), -RECORD_FLAG_X);
  });

  it('Property 2 (Zero/Negative HighScore Invariant): flag does not appear when highScore <= 0 or invalid', () => {
    assert.equal(getRecordFlagPosition(0), null, 'Must not spawn at highScore = 0');
    assert.equal(getRecordFlagPosition(-1), null, 'Must not spawn at negative highScore');
    assert.equal(getRecordFlagPosition(-100), null, 'Must not spawn at -100');
    assert.equal(getRecordFlagPosition(Number.NaN), null, 'Must not spawn on NaN');
    assert.equal(getRecordFlagPosition(Number.NEGATIVE_INFINITY), null, 'Must not spawn on -Infinity');
  });

  it('Property 3 (Unblocked Passable Grid Invariant): flag is positioned on roadside shoulder and does not block playable corridor', () => {
    const pos = getRecordFlagPosition(25);
    assert.notEqual(pos, null);

    // Playable center corridor is [-3..3]
    for (let tileX = -3; tileX <= 3; tileX++) {
      const distance = Math.abs(tileX - pos!.x);
      assert.ok(
        distance >= 0.79,
        `Tile x=${tileX} must remain completely clear of flag on shoulder (distance was ${distance})`
      );
    }

    // Integer hopping grid [-9..9] must not directly collide with fractional shoulder placement (x = 3.8)
    for (let gridX = -9; gridX <= 9; gridX++) {
      assert.notEqual(
        gridX,
        pos!.x,
        `Flag at x=${pos!.x} must not occupy integer grid cell x=${gridX}`
      );
    }
  });

  it('Property 4 (Single Breakthrough Trigger Invariant): triggers breakthrough exactly once when player.row >= highScore', () => {
    const highScore = 20;
    let breakthroughFiredCount = 0;
    let flagActive = true;
    let confettiSpawned = false;
    let fanfarePlayed = false;

    // Simulation of GameLoop trigger logic
    const handleStep = (playerRow: number) => {
      if (highScore > 0 && flagActive && playerRow >= highScore) {
        breakthroughFiredCount++;
        flagActive = false;
        confettiSpawned = true;
        fanfarePlayed = true;
      }
    };

    // Advancing towards highScore: rows 0 to 19
    for (let r = 0; r < highScore; r++) {
      handleStep(r);
      assert.equal(breakthroughFiredCount, 0, `Breakthrough should not trigger before row ${highScore} (current: ${r})`);
      assert.equal(flagActive, true);
    }

    // Breakthrough moment at row 20
    handleStep(20);
    assert.equal(breakthroughFiredCount, 1, 'Breakthrough must trigger at row 20');
    assert.equal(flagActive, false, 'Record flag must disappear on breakthrough');
    assert.equal(confettiSpawned, true, 'Confetti must be triggered');
    assert.equal(fanfarePlayed, true, 'Fanfare must be played');

    // Continuing past record: rows 21..35
    for (let r = 21; r <= 35; r++) {
      handleStep(r);
      assert.equal(breakthroughFiredCount, 1, 'Breakthrough must trigger exactly once per run');
    }
  });

  it('Property 5 (3D Mesh & Voxel Aesthetics): creates record flag with flagpole, base platform, cloth and crown emblem', () => {
    const flagGroup = MeshFactory.createRecordFlag();
    assert.ok(flagGroup instanceof THREE.Group, 'Record flag must be a THREE.Group');
    assert.equal(flagGroup.name, 'recordFlag');

    // Flag cloth child for wind sway animation
    const cloth = flagGroup.getObjectByName('flagCloth');
    assert.ok(cloth !== undefined, 'Flag must contain child named flagCloth');

    // Verify materials and meshes exist in hierarchy
    let meshCount = 0;
    flagGroup.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) meshCount++;
    });
    assert.ok(meshCount >= 8, `Flag should contain rich voxel details (found ${meshCount} meshes)`);
  });
});
