import * as THREE from 'three';

interface InstancedVoxelBox {
  w: number;
  h: number;
  d: number;
  x: number;
  y: number;
  z: number;
  color: number;
}

function createMergedDecorGeometry(boxes: readonly InstancedVoxelBox[]): THREE.BufferGeometry {
  const totalVerts = boxes.length * 36;
  const positions = new Float32Array(totalVerts * 3);
  const normals = new Float32Array(totalVerts * 3);
  const colors = new Float32Array(totalVerts * 3);
  const colorHelper = new THREE.Color();

  let vOffset = 0;
  for (let b = 0; b < boxes.length; b++) {
    const box = boxes[b];
    const geo = new THREE.BoxGeometry(box.w, box.h, box.d).toNonIndexed();
    geo.translate(box.x, box.y, box.z);
    colorHelper.setHex(box.color);

    const posArray = geo.attributes.position.array as Float32Array;
    const normArray = geo.attributes.normal.array as Float32Array;
    positions.set(posArray, vOffset * 3);
    normals.set(normArray, vOffset * 3);

    for (let i = 0; i < 36; i++) {
      const idx = (vOffset + i) * 3;
      colors[idx] = colorHelper.r;
      colors[idx + 1] = colorHelper.g;
      colors[idx + 2] = colorHelper.b;
    }
    geo.dispose();
    vOffset += 36;
  }

  const merged = new THREE.BufferGeometry();
  merged.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  merged.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
  merged.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  return merged;
}

const INSTANCED_TREE_BOXES: readonly InstancedVoxelBox[] = [
  { w: 0.64, h: 0.44, d: 0.64, x: 0, y: 0.22, z: 0, color: 0x78350f },
  { w: 0.68, h: 0.06, d: 0.68, x: 0, y: 0.42, z: 0, color: 0x451a03 },
  { w: 0.18, h: 0.56, d: 0.18, x: 0, y: 0.70, z: 0, color: 0x854d0e },
  { w: 0.76, h: 0.64, d: 0.76, x: 0, y: 1.25, z: 0, color: 0x16a34a },
  { w: 0.64, h: 0.40, d: 0.64, x: 0, y: 1.60, z: 0, color: 0x22c55e },
  { w: 0.12, h: 0.12, d: 0.12, x: 0.22, y: 1.35, z: 0.35, color: 0x4ade80 },
];

const INSTANCED_ROCK_BOXES: readonly InstancedVoxelBox[] = [
  { w: 0.58, h: 0.26, d: 0.58, x: 0, y: 0.13, z: 0, color: 0x64748b },
  { w: 0.44, h: 0.22, d: 0.44, x: -0.04, y: 0.32, z: 0.02, color: 0x475569 },
  { w: 0.28, h: 0.16, d: 0.28, x: 0.04, y: 0.48, z: -0.02, color: 0x94a3b8 },
  { w: 0.16, h: 0.10, d: 0.16, x: 0.24, y: 0.05, z: 0.20, color: 0x64748b },
];

const INSTANCED_COIN_BOXES: readonly InstancedVoxelBox[] = [
  { w: 0.44, h: 0.44, d: 0.12, x: 0, y: 0, z: 0, color: 0xfacc15 },
  { w: 0.18, h: 0.22, d: 0.15, x: 0, y: 0, z: 0, color: 0xef4444 },
];

const INSTANCED_DECOR_Y_AXIS = new THREE.Vector3(0, 1, 0);

export class InstancedDecorManager {
  public readonly group = new THREE.Group();
  public readonly treeMesh: THREE.InstancedMesh;
  public readonly rockMesh: THREE.InstancedMesh;
  public readonly coinMesh: THREE.InstancedMesh;

  private readonly maxTrees: number;
  private readonly maxRocks: number;
  private readonly maxCoins: number;

  private treeCount = 0;
  private rockCount = 0;
  private coinCount = 0;

  private treeDirty = false;
  private rockDirty = false;
  private coinDirty = false;

  private readonly scratchMatrix = new THREE.Matrix4();
  private readonly scratchPos = new THREE.Vector3();
  private readonly scratchQuat = new THREE.Quaternion();
  private readonly scratchScale = new THREE.Vector3();

  constructor(maxTrees = 1500, maxRocks = 400, maxCoins = 200) {
    this.maxTrees = maxTrees;
    this.maxRocks = maxRocks;
    this.maxCoins = maxCoins;

    const decorMaterial = new THREE.MeshLambertMaterial({ vertexColors: true });

    const treeGeo = createMergedDecorGeometry(INSTANCED_TREE_BOXES);
    this.treeMesh = new THREE.InstancedMesh(treeGeo, decorMaterial, this.maxTrees);
    this.treeMesh.count = 0;
    this.treeMesh.castShadow = true;
    this.treeMesh.receiveShadow = true;
    this.treeMesh.frustumCulled = false;

    const rockGeo = createMergedDecorGeometry(INSTANCED_ROCK_BOXES);
    this.rockMesh = new THREE.InstancedMesh(rockGeo, decorMaterial, this.maxRocks);
    this.rockMesh.count = 0;
    this.rockMesh.castShadow = true;
    this.rockMesh.receiveShadow = true;
    this.rockMesh.frustumCulled = false;

    const coinGeo = createMergedDecorGeometry(INSTANCED_COIN_BOXES);
    this.coinMesh = new THREE.InstancedMesh(coinGeo, decorMaterial, this.maxCoins);
    this.coinMesh.count = 0;
    this.coinMesh.castShadow = true;
    this.coinMesh.receiveShadow = false;
    this.coinMesh.frustumCulled = false;

    this.group.name = 'instancedDecorGroup';
    this.group.add(this.treeMesh, this.rockMesh, this.coinMesh);
  }

  beginFrame(): void {
    this.treeCount = 0;
    this.rockCount = 0;
    this.coinCount = 0;
  }

  addTree(x: number, y: number, z: number, scale = 1, rotation = 0): void {
    if (this.treeCount >= this.maxTrees) return;
    this.scratchPos.set(x, y, z);
    this.scratchQuat.setFromAxisAngle(INSTANCED_DECOR_Y_AXIS, rotation);
    this.scratchScale.set(scale, scale, scale);
    this.scratchMatrix.compose(this.scratchPos, this.scratchQuat, this.scratchScale);

    const offset = this.treeCount * 16;
    const elems = this.scratchMatrix.elements;
    const arr = this.treeMesh.instanceMatrix.array as Float32Array;
    for (let i = 0; i < 16; i++) {
      if (Math.abs(arr[offset + i] - elems[i]) > 1e-5) {
        arr[offset + i] = elems[i];
        this.treeDirty = true;
      }
    }
    this.treeCount++;
  }

  addRock(x: number, y: number, z: number, scale = 1): void {
    if (this.rockCount >= this.maxRocks) return;
    this.scratchPos.set(x, y, z);
    this.scratchQuat.identity();
    this.scratchScale.set(scale, scale, scale);
    this.scratchMatrix.compose(this.scratchPos, this.scratchQuat, this.scratchScale);

    const offset = this.rockCount * 16;
    const elems = this.scratchMatrix.elements;
    const arr = this.rockMesh.instanceMatrix.array as Float32Array;
    for (let i = 0; i < 16; i++) {
      if (Math.abs(arr[offset + i] - elems[i]) > 1e-5) {
        arr[offset + i] = elems[i];
        this.rockDirty = true;
      }
    }
    this.rockCount++;
  }

  addCoin(x: number, y: number, z: number, rotationY = 0): void {
    if (this.coinCount >= this.maxCoins) return;
    this.scratchPos.set(x, y, z);
    this.scratchQuat.setFromAxisAngle(INSTANCED_DECOR_Y_AXIS, rotationY);
    this.scratchScale.set(1, 1, 1);
    this.scratchMatrix.compose(this.scratchPos, this.scratchQuat, this.scratchScale);

    const offset = this.coinCount * 16;
    const elems = this.scratchMatrix.elements;
    const arr = this.coinMesh.instanceMatrix.array as Float32Array;
    for (let i = 0; i < 16; i++) {
      if (Math.abs(arr[offset + i] - elems[i]) > 1e-5) {
        arr[offset + i] = elems[i];
        this.coinDirty = true;
      }
    }
    this.coinCount++;
  }

  endFrame(): void {
    if (this.treeMesh.count !== this.treeCount) {
      this.treeMesh.count = this.treeCount;
      this.treeDirty = true;
    }
    if (this.treeDirty) {
      this.treeMesh.instanceMatrix.needsUpdate = true;
      this.treeDirty = false;
    }

    if (this.rockMesh.count !== this.rockCount) {
      this.rockMesh.count = this.rockCount;
      this.rockDirty = true;
    }
    if (this.rockDirty) {
      this.rockMesh.instanceMatrix.needsUpdate = true;
      this.rockDirty = false;
    }

    if (this.coinMesh.count !== this.coinCount) {
      this.coinMesh.count = this.coinCount;
      this.coinDirty = true;
    }
    if (this.coinDirty) {
      this.coinMesh.instanceMatrix.needsUpdate = true;
      this.coinDirty = false;
    }
  }

  clear(): void {
    this.treeCount = 0;
    this.rockCount = 0;
    this.coinCount = 0;
    this.treeMesh.count = 0;
    this.rockMesh.count = 0;
    this.coinMesh.count = 0;
    this.treeMesh.instanceMatrix.needsUpdate = true;
    this.rockMesh.instanceMatrix.needsUpdate = true;
    this.coinMesh.instanceMatrix.needsUpdate = true;
  }

  dispose(): void {
    this.treeMesh.geometry.dispose();
    (this.treeMesh.material as THREE.Material).dispose();
    this.rockMesh.geometry.dispose();
    (this.rockMesh.material as THREE.Material).dispose();
    this.coinMesh.geometry.dispose();
    (this.coinMesh.material as THREE.Material).dispose();
  }
}
