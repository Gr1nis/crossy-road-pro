import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { GameEngine } from '../src/core/gameEngine.ts';
import {
  getCameraFrustumNdcY,
  isPlayerBehindCameraFrustum,
} from '../src/core/collision.ts';
import { LaneGeometryPool } from '../src/view/laneGeometryPool.ts';
import { MeshFactory } from '../src/view/meshFactory.ts';
import {
  createUrbanRoadBarrier,
  createUrbanRiverbankEdge,
} from '../src/view/urbanEnvironment.ts';
import { LaneType, MoveDirection } from '../src/core/types.ts';

describe('Road Barrier, Riverbank Rotation, Lane Divider & Parallel Death Line Suite', () => {
  it('Requirement 1: Road barriers are rotated by 90 degrees clockwise (-PI/2) to stand perpendicular to the road', () => {
    const barrier = createUrbanRoadBarrier('forest');
    assert.ok(barrier instanceof THREE.Group);
    assert.strictEqual(
      Math.abs(barrier.rotation.y - (-Math.PI / 2)) < 1e-5,
      true,
      `Road barrier rotation.y must be -PI/2 (-90 deg clockwise), got ${barrier.rotation.y}`
    );
  });

  it('Requirement 2: Riverbank edge barriers are rotated by 90 degrees clockwise (-PI/2) to stand perpendicular to the river', () => {
    const leftBank = createUrbanRiverbankEdge('left', 'forest');
    assert.ok(leftBank instanceof THREE.Group);
    assert.strictEqual(
      Math.abs(leftBank.rotation.y - (-Math.PI / 2)) < 1e-5,
      true,
      `Riverbank left edge rotation.y must be -PI/2 (-90 deg clockwise), got ${leftBank.rotation.y}`
    );

    const rightBank = createUrbanRiverbankEdge('right', 'forest');
    assert.ok(rightBank instanceof THREE.Group);
    assert.strictEqual(
      Math.abs(rightBank.rotation.y - (-Math.PI / 2)) < 1e-5,
      true,
      `Riverbank right edge rotation.y must be -PI/2 (-90 deg clockwise), got ${rightBank.rotation.y}`
    );
  });

  it('Requirement 3: Dashed line dividers between road lanes are restored with pooled geometry & material', () => {
    const divider = MeshFactory.createLaneDivider();
    assert.ok(divider instanceof THREE.Group);
    assert.ok(divider.children.length > 5, 'Divider group must contain dashed meshes');

    const firstDash = divider.children[0] as THREE.Mesh;
    assert.strictEqual(firstDash.geometry, LaneGeometryPool.dividerGeo);
    assert.strictEqual(firstDash.material, LaneGeometryPool.dividerMat);
    assert.strictEqual(firstDash.position.z, 0.5, 'Dashes must sit at z = 0.5 (boundary between lanes)');
    assert.strictEqual(firstDash.position.y, 0.015, 'Dashes must sit at y = 0.015 (above road asphalt)');

    // Verify protection in sharedGeometries / sharedMaterials
    assert.strictEqual(LaneGeometryPool.isSharedGeometry(LaneGeometryPool.dividerGeo), true);
    assert.strictEqual(LaneGeometryPool.isSharedMaterial(LaneGeometryPool.dividerMat), true);
  });

  it('Requirement 4: Frustum death boundary is strictly parallel to the lanes (invariant to playerX)', () => {
    const camZ = -1.0;
    const testRows = [-6, -4, -2, 0, 5, 10];

    for (const row of testRows) {
      const centerNdcY = getCameraFrustumNdcY(0, row, camZ);
      // For any X across the corridor, NDC Y must be IDENTICAL because the death line is parallel to the lanes
      for (const x of [-6, -4, -2, 2, 4, 6]) {
        const xNdcY = getCameraFrustumNdcY(x, row, camZ);
        assert.strictEqual(
          Math.abs(xNdcY - centerNdcY) < 1e-9,
          true,
          `NDC Y must be identical across X at row ${row} (got ${xNdcY} at x=${x} vs ${centerNdcY} at x=0)`
        );

        assert.strictEqual(
          isPlayerBehindCameraFrustum(x, row, camZ),
          isPlayerBehindCameraFrustum(0, row, camZ),
          `isPlayerBehindCameraFrustum must match regardless of X at row ${row}`
        );
      }
    }
  });

  it('Requirement 4 (Corner Survival): Player standing in bottom-left corner does NOT die while on a visible lane', () => {
    const engine = new GameEngine(777);
    // Move player left (player.x = 4 in corner)
    for (let i = 0; i < 4; i++) {
      engine.queueMove(MoveDirection.LEFT);
      engine.step(0.2);
    }
    // Now move backward through safe rows -1 to -6
    for (let r = 1; r <= 6; r++) {
      engine.queueMove(MoveDirection.BACKWARD);
      engine.step(0.2);
      assert.strictEqual(
        engine.isBehindCameraEdge(),
        false,
        `Player at row -${r} in left corner must NOT be flagged as behind camera edge`
      );
      assert.strictEqual(
        engine.getPlayer().isDead,
        false,
        `Player at row -${r} in left corner must remain alive`
      );
    }
  });
});
