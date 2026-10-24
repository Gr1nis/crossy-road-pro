import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { InstancedDecorManager } from '../src/view/instancedDecorManager.ts';

describe('InstancedDecorManager — InstancedMesh Environment & Coins Suite', () => {
  it('Property 1 (Initialization and Capacities): allocates instanced meshes with correct buffer capacities', () => {
    const manager = new InstancedDecorManager(100, 50, 20);
    assert.ok(manager.treeMesh.isInstancedMesh, 'treeMesh must be an InstancedMesh');
    assert.ok(manager.rockMesh.isInstancedMesh, 'rockMesh must be an InstancedMesh');
    assert.ok(manager.coinMesh.isInstancedMesh, 'coinMesh must be an InstancedMesh');

    assert.equal(manager.treeMesh.count, 0, 'Initial treeMesh count must be 0');
    assert.equal(manager.rockMesh.count, 0, 'Initial rockMesh count must be 0');
    assert.equal(manager.coinMesh.count, 0, 'Initial coinMesh count must be 0');

    assert.equal(manager.group.children.length, 9, 'Group must contain 4 tree, 4 rock, and 1 coin instanced meshes');
    manager.dispose();
  });

  it('Property 2 (Frame Lifecycle & Matrix Update): beginFrame, add items, and endFrame correctly set count and update flags', () => {
    const manager = new InstancedDecorManager(100, 50, 20);

    manager.beginFrame();
    manager.addTree(2, 0, 10, 1.0, Math.PI / 4);
    manager.addTree(-3, 0, 12, 0.8, 0);
    manager.addRock(5, 0, 11, 1.2);
    manager.addCoin(0, 0.36, 10, Math.PI / 2);
    manager.endFrame();

    assert.equal(manager.treeMesh.count, 2, 'treeMesh count must be 2');
    assert.equal(manager.rockMesh.count, 1, 'rockMesh count must be 1');
    assert.equal(manager.coinMesh.count, 1, 'coinMesh count must be 1');

    // Matrix extraction and verification
    const m = new THREE.Matrix4();
    manager.treeMesh.getMatrixAt(0, m);
    const pos = new THREE.Vector3();
    pos.setFromMatrixPosition(m);
    assert.equal(Math.round(pos.x), 2);
    assert.equal(Math.round(pos.z), 10);

    const v1 = manager.treeMesh.instanceMatrix.version;

    // Subsequent frame with identical positions should NOT trigger unnecessary matrix upload
    manager.beginFrame();
    manager.addTree(2, 0, 10, 1.0, Math.PI / 4);
    manager.addTree(-3, 0, 12, 0.8, 0);
    manager.addRock(5, 0, 11, 1.2);
    manager.endFrame();

    assert.equal(manager.treeMesh.count, 2);
    assert.equal(manager.treeMesh.instanceMatrix.version, v1, 'Unchanged trees must not increment matrix version');

    manager.dispose();
  });

  it('Property 3 (Capacity Protection & Clear): respects maximum capacities and clear() resets counts to 0', () => {
    const manager = new InstancedDecorManager(5, 3, 2);

    manager.beginFrame();
    for (let i = 0; i < 10; i++) {
      manager.addTree(i, 0, i);
      manager.addRock(i, 0, i);
      manager.addCoin(i, 0, i);
    }
    manager.endFrame();

    assert.equal(manager.treeMesh.count, 5, 'Must clamp to maxTrees capacity (5)');
    assert.equal(manager.rockMesh.count, 3, 'Must clamp to maxRocks capacity (3)');
    assert.equal(manager.coinMesh.count, 2, 'Must clamp to maxCoins capacity (2)');

    manager.clear();
    assert.equal(manager.treeMesh.count, 0);
    assert.equal(manager.rockMesh.count, 0);
    assert.equal(manager.coinMesh.count, 0);

    manager.dispose();
  });

  it('Property 4 (Biome Instanced Meshes): independently manages forest, winter, desert, and neon decor', () => {
    const manager = new InstancedDecorManager(20, 20, 20);

    manager.beginFrame();
    manager.addTree(1, 0, 1, 1, 0, 'forest');
    manager.addTree(2, 0, 2, 1, 0, 'winter');
    manager.addTree(3, 0, 3, 1, 0, 'desert');
    manager.addTree(4, 0, 4, 1, 0, 'neon');

    manager.addRock(1, 0, 1, 1, 'forest');
    manager.addRock(2, 0, 2, 1, 'winter');
    manager.addRock(3, 0, 3, 1, 'desert');
    manager.addRock(4, 0, 4, 1, 'neon');
    manager.endFrame();

    assert.equal(manager.treeMeshes.forest.count, 1);
    assert.equal(manager.treeMeshes.winter.count, 1);
    assert.equal(manager.treeMeshes.desert.count, 1);
    assert.equal(manager.treeMeshes.neon.count, 1);

    assert.equal(manager.rockMeshes.forest.count, 1);
    assert.equal(manager.rockMeshes.winter.count, 1);
    assert.equal(manager.rockMeshes.desert.count, 1);
    assert.equal(manager.rockMeshes.neon.count, 1);

    manager.clear();
    assert.equal(manager.treeMeshes.winter.count, 0);
    assert.equal(manager.treeMeshes.desert.count, 0);
    assert.equal(manager.treeMeshes.neon.count, 0);

    manager.dispose();
  });
});
