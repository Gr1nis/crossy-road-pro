import * as THREE from 'three';
import type { BiomeType } from '../core/types.ts';

interface InstancedVoxelBox {
  w: number;
  h: number;
  d: number;
  x: number;
  y: number;
  z: number;
  color: number;
}

const b = (w: number, h: number, d: number, x: number, y: number, z: number, color: number): InstancedVoxelBox => ({
  w, h, d, x, y, z, color,
});

function createMergedDecorGeometry(boxes: readonly InstancedVoxelBox[]): THREE.BufferGeometry {
  const totalVerts = boxes.length * 36;
  const positions = new Float32Array(totalVerts * 3);
  const normals = new Float32Array(totalVerts * 3);
  const colors = new Float32Array(totalVerts * 3);
  const colorHelper = new THREE.Color();

  let vOffset = 0;
  for (let bi = 0; bi < boxes.length; bi++) {
    const box = boxes[bi];
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

// Forest Biome: Brown trunk 0x854d0e, green foliage 0x16a34a, 0x22c55e, 0x4ade80 | Rock: slate gray 0x64748b, 0x475569, 0x94a3b8
const INSTANCED_FOREST_TREE_BOXES: readonly InstancedVoxelBox[] = [
  b(0.60, 0.10, 0.60, 0, 0.05, 0, 0x854d0e), b(0.20, 0.60, 0.20, 0, 0.35, 0, 0x854d0e),
  b(0.75, 0.55, 0.75, 0, 0.85, 0, 0x16a34a), b(0.60, 0.40, 0.60, 0, 1.25, 0, 0x22c55e),
  b(0.35, 0.25, 0.35, 0, 1.55, 0, 0x4ade80), b(0.15, 0.15, 0.15, 0.20, 1.15, 0.30, 0x4ade80),
];
const INSTANCED_FOREST_ROCK_BOXES: readonly InstancedVoxelBox[] = [
  b(0.60, 0.25, 0.60, 0, 0.125, 0, 0x64748b), b(0.45, 0.20, 0.45, -0.05, 0.30, 0.05, 0x475569),
  b(0.30, 0.15, 0.30, 0.05, 0.45, -0.05, 0x94a3b8), b(0.15, 0.10, 0.15, 0.25, 0.05, 0.20, 0x64748b),
];

// Winter Biome: Dark trunk 0x475569, pine teal 0x0f766e, snow cap 0xf8fafc, 0xe2e8f0 | Rock: 0x94a3b8, snow cap 0xf1f5f9
const INSTANCED_WINTER_TREE_BOXES: readonly InstancedVoxelBox[] = [
  b(0.20, 0.50, 0.20, 0, 0.25, 0, 0x475569), b(0.80, 0.40, 0.80, 0, 0.65, 0, 0x0f766e),
  b(0.85, 0.05, 0.85, 0, 0.85, 0, 0xe2e8f0), b(0.60, 0.35, 0.60, 0, 1.00, 0, 0x0f766e),
  b(0.65, 0.05, 0.65, 0, 1.18, 0, 0xf8fafc), b(0.35, 0.30, 0.35, 0, 1.30, 0, 0x0f766e),
  b(0.40, 0.10, 0.40, 0, 1.48, 0, 0xf8fafc),
];
const INSTANCED_WINTER_ROCK_BOXES: readonly InstancedVoxelBox[] = [
  b(0.60, 0.25, 0.60, 0, 0.125, 0, 0x94a3b8), b(0.45, 0.20, 0.45, -0.05, 0.30, 0.05, 0x64748b),
  b(0.45, 0.08, 0.45, -0.05, 0.42, 0.05, 0xf1f5f9), b(0.25, 0.10, 0.25, 0.15, 0.20, -0.15, 0xf1f5f9),
];

// Desert Biome: Terracotta trunk 0x78350f, cactus green / golden-olive 0xa16207, 0xb45309, 0xd97706 | Rock: 0xd97706, 0xb45309, 0x92400e
const INSTANCED_DESERT_TREE_BOXES: readonly InstancedVoxelBox[] = [
  b(0.45, 0.05, 0.45, 0, 0.025, 0, 0x78350f), b(0.25, 1.35, 0.25, 0, 0.70, 0, 0xa16207),
  b(0.28, 1.05, 0.20, 0, 0.65, 0, 0xb45309), b(0.25, 0.20, 0.20, -0.22, 0.60, 0, 0xa16207),
  b(0.20, 0.50, 0.20, -0.32, 0.85, 0, 0xd97706), b(0.25, 0.20, 0.20, 0.22, 0.80, 0, 0xa16207),
  b(0.20, 0.45, 0.20, 0.32, 1.025, 0, 0xd97706), b(0.15, 0.10, 0.15, 0, 1.425, 0, 0xd97706),
];
const INSTANCED_DESERT_ROCK_BOXES: readonly InstancedVoxelBox[] = [
  b(0.65, 0.20, 0.65, 0, 0.10, 0, 0x92400e), b(0.50, 0.20, 0.50, 0.05, 0.28, -0.05, 0xb45309),
  b(0.35, 0.15, 0.35, 0.05, 0.43, -0.05, 0xd97706), b(0.18, 0.12, 0.18, -0.25, 0.06, 0.20, 0xd97706),
];

// Neon Biome: Obsidian trunk 0x1e1b4b, glowing cyan/magenta 0x06b6d4, 0xd946ef, 0xa855f7 | Rock: 0x312e81, 0x4338ca, 0x06b6d4
const INSTANCED_NEON_TREE_BOXES: readonly InstancedVoxelBox[] = [
  b(0.50, 0.10, 0.50, 0, 0.05, 0, 0x1e1b4b), b(0.25, 1.40, 0.25, 0, 0.75, 0, 0x1e1b4b),
  b(0.65, 0.10, 0.65, 0, 0.70, 0, 0x06b6d4), b(0.50, 0.10, 0.50, 0, 1.05, 0, 0xd946ef),
  b(0.35, 0.10, 0.35, 0, 1.35, 0, 0xa855f7), b(0.15, 0.20, 0.15, 0, 1.55, 0, 0x06b6d4),
];
const INSTANCED_NEON_ROCK_BOXES: readonly InstancedVoxelBox[] = [
  b(0.55, 0.20, 0.55, 0, 0.10, 0, 0x312e81), b(0.35, 0.35, 0.35, -0.05, 0.35, 0.05, 0x4338ca),
  b(0.15, 0.25, 0.15, 0.18, 0.25, -0.12, 0x06b6d4), b(0.10, 0.18, 0.10, -0.15, 0.48, -0.05, 0x06b6d4),
];

const INSTANCED_COIN_BOXES: readonly InstancedVoxelBox[] = [
  b(0.44, 0.44, 0.12, 0, 0, 0, 0xfacc15), b(0.18, 0.22, 0.15, 0, 0, 0, 0xef4444),
];

const INSTANCED_DECOR_Y_AXIS = new THREE.Vector3(0, 1, 0);
const INSTANCED_BIOMES: readonly BiomeType[] = ['forest', 'winter', 'desert', 'neon'];

export class InstancedDecorManager {
  public readonly group = new THREE.Group();
  public readonly treeMeshes: Record<BiomeType, THREE.InstancedMesh>;
  public readonly rockMeshes: Record<BiomeType, THREE.InstancedMesh>;
  public readonly coinMesh: THREE.InstancedMesh;

  public get treeMesh(): THREE.InstancedMesh { return this.treeMeshes.forest; }
  public get rockMesh(): THREE.InstancedMesh { return this.rockMeshes.forest; }

  private readonly maxTrees: number;
  private readonly maxRocks: number;
  private readonly maxCoins: number;

  private readonly treeCounts: Record<BiomeType, number> = { forest: 0, winter: 0, desert: 0, neon: 0 };
  private readonly rockCounts: Record<BiomeType, number> = { forest: 0, winter: 0, desert: 0, neon: 0 };
  private coinCount = 0;

  private readonly treeDirty: Record<BiomeType, boolean> = { forest: false, winter: false, desert: false, neon: false };
  private readonly rockDirty: Record<BiomeType, boolean> = { forest: false, winter: false, desert: false, neon: false };
  private coinDirty = false;

  private readonly scratchMatrix = new THREE.Matrix4();
  private readonly scratchPos = new THREE.Vector3();
  private readonly scratchQuat = new THREE.Quaternion();
  private readonly scratchScale = new THREE.Vector3();
  private readonly decorMaterial: THREE.MeshLambertMaterial;

  constructor(maxTrees = 1500, maxRocks = 400, maxCoins = 200) {
    this.maxTrees = maxTrees;
    this.maxRocks = maxRocks;
    this.maxCoins = maxCoins;
    this.decorMaterial = new THREE.MeshLambertMaterial({ vertexColors: true });

    const treeGeos: Record<BiomeType, THREE.BufferGeometry> = {
      forest: createMergedDecorGeometry(INSTANCED_FOREST_TREE_BOXES),
      winter: createMergedDecorGeometry(INSTANCED_WINTER_TREE_BOXES),
      desert: createMergedDecorGeometry(INSTANCED_DESERT_TREE_BOXES),
      neon: createMergedDecorGeometry(INSTANCED_NEON_TREE_BOXES),
    };
    const rockGeos: Record<BiomeType, THREE.BufferGeometry> = {
      forest: createMergedDecorGeometry(INSTANCED_FOREST_ROCK_BOXES),
      winter: createMergedDecorGeometry(INSTANCED_WINTER_ROCK_BOXES),
      desert: createMergedDecorGeometry(INSTANCED_DESERT_ROCK_BOXES),
      neon: createMergedDecorGeometry(INSTANCED_NEON_ROCK_BOXES),
    };

    this.treeMeshes = {} as Record<BiomeType, THREE.InstancedMesh>;
    this.rockMeshes = {} as Record<BiomeType, THREE.InstancedMesh>;

    for (let i = 0; i < INSTANCED_BIOMES.length; i++) {
      const bm = INSTANCED_BIOMES[i];
      const tm = new THREE.InstancedMesh(treeGeos[bm], this.decorMaterial, this.maxTrees);
      tm.count = 0;
      tm.castShadow = true;
      tm.receiveShadow = true;
      tm.frustumCulled = false;
      this.treeMeshes[bm] = tm;
      this.group.add(tm);

      const rm = new THREE.InstancedMesh(rockGeos[bm], this.decorMaterial, this.maxRocks);
      rm.count = 0;
      rm.castShadow = true;
      rm.receiveShadow = true;
      rm.frustumCulled = false;
      this.rockMeshes[bm] = rm;
      this.group.add(rm);
    }

    const coinGeo = createMergedDecorGeometry(INSTANCED_COIN_BOXES);
    this.coinMesh = new THREE.InstancedMesh(coinGeo, this.decorMaterial, this.maxCoins);
    this.coinMesh.count = 0;
    this.coinMesh.castShadow = true;
    this.coinMesh.receiveShadow = false;
    this.coinMesh.frustumCulled = false;
    this.group.add(this.coinMesh);

    this.group.name = 'instancedDecorGroup';
  }

  beginFrame(): void {
    for (let i = 0; i < INSTANCED_BIOMES.length; i++) {
      const bm = INSTANCED_BIOMES[i];
      this.treeCounts[bm] = 0;
      this.rockCounts[bm] = 0;
    }
    this.coinCount = 0;
  }

  private writeMatrix(mesh: THREE.InstancedMesh, idx: number, onDirty: () => void): void {
    const offset = idx * 16;
    const elems = this.scratchMatrix.elements;
    const arr = mesh.instanceMatrix.array as Float32Array;
    for (let i = 0; i < 16; i++) {
      if (Math.abs(arr[offset + i] - elems[i]) > 1e-5) {
        arr[offset + i] = elems[i];
        onDirty();
      }
    }
  }

  addTree(x: number, y: number, z: number, scale = 1, rotation = 0, biome: BiomeType = 'forest'): void {
    const validBiome = this.treeMeshes[biome] ? biome : 'forest';
    const count = this.treeCounts[validBiome];
    if (count >= this.maxTrees) return;
    this.scratchPos.set(x, y, z);
    this.scratchQuat.setFromAxisAngle(INSTANCED_DECOR_Y_AXIS, rotation);
    this.scratchScale.set(scale, scale, scale);
    this.scratchMatrix.compose(this.scratchPos, this.scratchQuat, this.scratchScale);
    this.writeMatrix(this.treeMeshes[validBiome], count, () => { this.treeDirty[validBiome] = true; });
    this.treeCounts[validBiome] = count + 1;
  }

  addRock(x: number, y: number, z: number, scale = 1, biome: BiomeType = 'forest'): void {
    const validBiome = this.rockMeshes[biome] ? biome : 'forest';
    const count = this.rockCounts[validBiome];
    if (count >= this.maxRocks) return;
    this.scratchPos.set(x, y, z);
    this.scratchQuat.identity();
    this.scratchScale.set(scale, scale, scale);
    this.scratchMatrix.compose(this.scratchPos, this.scratchQuat, this.scratchScale);
    this.writeMatrix(this.rockMeshes[validBiome], count, () => { this.rockDirty[validBiome] = true; });
    this.rockCounts[validBiome] = count + 1;
  }

  addCoin(x: number, y: number, z: number, rotationY = 0): void {
    if (this.coinCount >= this.maxCoins) return;
    this.scratchPos.set(x, y, z);
    this.scratchQuat.setFromAxisAngle(INSTANCED_DECOR_Y_AXIS, rotationY);
    this.scratchScale.set(1, 1, 1);
    this.scratchMatrix.compose(this.scratchPos, this.scratchQuat, this.scratchScale);
    this.writeMatrix(this.coinMesh, this.coinCount, () => { this.coinDirty = true; });
    this.coinCount++;
  }

  endFrame(): void {
    for (let i = 0; i < INSTANCED_BIOMES.length; i++) {
      const bm = INSTANCED_BIOMES[i];
      const tm = this.treeMeshes[bm];
      if (tm.count !== this.treeCounts[bm]) {
        tm.count = this.treeCounts[bm];
        this.treeDirty[bm] = true;
      }
      if (this.treeDirty[bm]) {
        tm.instanceMatrix.needsUpdate = true;
        this.treeDirty[bm] = false;
      }

      const rm = this.rockMeshes[bm];
      if (rm.count !== this.rockCounts[bm]) {
        rm.count = this.rockCounts[bm];
        this.rockDirty[bm] = true;
      }
      if (this.rockDirty[bm]) {
        rm.instanceMatrix.needsUpdate = true;
        this.rockDirty[bm] = false;
      }
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
    for (let i = 0; i < INSTANCED_BIOMES.length; i++) {
      const bm = INSTANCED_BIOMES[i];
      this.treeCounts[bm] = 0;
      this.rockCounts[bm] = 0;
      this.treeMeshes[bm].count = 0;
      this.rockMeshes[bm].count = 0;
      this.treeMeshes[bm].instanceMatrix.needsUpdate = true;
      this.rockMeshes[bm].instanceMatrix.needsUpdate = true;
    }
    this.coinCount = 0;
    this.coinMesh.count = 0;
    this.coinMesh.instanceMatrix.needsUpdate = true;
  }

  dispose(): void {
    for (let i = 0; i < INSTANCED_BIOMES.length; i++) {
      const bm = INSTANCED_BIOMES[i];
      this.treeMeshes[bm].geometry.dispose();
      this.rockMeshes[bm].geometry.dispose();
    }
    this.coinMesh.geometry.dispose();
    this.decorMaterial.dispose();
  }
}
