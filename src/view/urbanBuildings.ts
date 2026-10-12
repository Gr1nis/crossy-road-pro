import * as THREE from 'three';
import type { BiomeType } from '../core/types.ts';
import { VoxelMeshBuilder } from './voxelMeshBuilder.ts';

type BldgVoxel = [number, number, number, number, number, number, number];

const townhouseAVoxels: BldgVoxel[] = [
  // Foundation, Walls & Shopfront
  [1.60, 0.12, 1.40, 0, 0.06, 0, 0x94a3b8], [1.50, 1.30, 1.30, 0, 0.77, 0, 0x2563eb],
  [0.34, 0.90, 0.04, -0.42, 0.60, 0.66, 0x78350f], [0.26, 0.40, 0.05, -0.42, 0.72, 0.665, 0xfef08a],
  [0.72, 0.70, 0.04, 0.26, 0.70, 0.66, 0xfef08a], [0.76, 0.08, 0.06, 0.26, 0.32, 0.67, 0x1e3a8a],
  // Awning & Sign
  [0.86, 0.14, 0.36, 0.26, 1.15, 0.80, 0xdc2626], [0.28, 0.15, 0.37, 0.26, 1.15, 0.80, 0xf8fafc],
  [0.72, 0.24, 0.08, 0.26, 1.38, 0.68, 0x78350f], [0.54, 0.14, 0.09, 0.26, 1.38, 0.68, 0xfef08a],
  [1.62, 0.12, 1.42, 0, 1.50, 0, 0xf8fafc], [1.50, 1.20, 1.30, 0, 2.16, 0, 0x3b82f6],
  // 2nd Floor Windows & Planters
  [0.32, 0.60, 0.05, -0.38, 2.16, 0.66, 0xfef08a], [0.36, 0.66, 0.03, -0.38, 2.16, 0.65, 0xf8fafc],
  [0.32, 0.60, 0.05, 0.38, 2.16, 0.66, 0xfef08a], [0.36, 0.66, 0.03, 0.38, 2.16, 0.65, 0xf8fafc],
  [0.38, 0.12, 0.14, -0.38, 1.80, 0.70, 0x854d0e], [0.32, 0.08, 0.10, -0.38, 1.88, 0.70, 0x16a34a],
  [0.38, 0.12, 0.14, 0.38, 1.80, 0.70, 0x854d0e], [0.32, 0.08, 0.10, 0.38, 1.88, 0.70, 0x16a34a],
  // Roof & Dormer
  [1.64, 0.14, 1.44, 0, 2.82, 0, 0xf8fafc], [1.46, 0.85, 1.26, 0, 3.28, 0, 0xb45309],
  [1.30, 0.20, 1.10, 0, 3.75, 0, 0x92400e], [0.40, 0.38, 0.36, 0, 3.32, 0.58, 0x3b82f6],
  [0.26, 0.24, 0.05, 0, 3.32, 0.76, 0xfef08a], [0.44, 0.12, 0.38, 0, 3.55, 0.58, 0x92400e],
  [0.22, 0.60, 0.22, -0.45, 3.85, -0.25, 0x64748b], [0.26, 0.10, 0.26, -0.45, 4.18, -0.25, 0x475569],
];

function populateBakeryBuilder(builder: VoxelMeshBuilder, isWinter: boolean): void {
  const W = 1.60;
  const D = 1.40;
  const hw = W * 0.5;
  const hd = D * 0.5;

  // Colors based on reference: 22_winter_brick_bakery_turnaround.jpg
  const cPlinth = 0x334155;
  const cBrick = 0xba3224;
  const cStone = 0xf59e0b;
  const cSnow = 0xf8fafc;
  const cWindow = 0xfef08a;
  const cDoor = 0x713f12;
  const cGarland = 0x166534;
  const cBerry = 0xef4444;
  const cSign = 0x451a03;
  const cSignText = 0xffedd5;
  const cSmoke = 0xe2e8f0;

  // 1. Plinth / Foundation
  builder.addBox(1.68, 0.14, 1.48, 0, 0.07, 0, cPlinth);
  builder.addBox(1.64, 0.04, 1.44, 0, 0.16, 0, cPlinth);

  // 2. Core Brick Walls & Cornices
  builder.addBox(W, 1.25, D, 0, 0.805, 0, cBrick);
  builder.addBox(1.66, 0.10, 1.46, 0, 1.48, 0, cStone);
  builder.addBox(W, 0.95, D, 0, 2.005, 0, cBrick);
  builder.addBox(W, 0.95, D, 0, 2.955, 0, cBrick);
  builder.addBox(1.66, 0.10, 1.46, 0, 3.48, 0, cStone);

  // 3. Quoins (Рустовка на 4 углах)
  const cornerXs = [-hw, hw];
  const cornerZs = [-hd, hd];
  for (let ci = 0; ci < 2; ci++) {
    const cx = cornerXs[ci];
    const sx = cx < 0 ? 1 : -1;
    for (let cj = 0; cj < 2; cj++) {
      const cz = cornerZs[cj];
      const sz = cz < 0 ? 1 : -1;
      for (let q = 0; q < 14; q++) {
        const qy = 0.24 + q * 0.23;
        const isLong = q % 2 === 0;
        const qw = isLong ? 0.14 : 0.08;
        const qd = isLong ? 0.08 : 0.14;
        builder.addBox(qw, 0.14, qd, cx + sx * (qw * 0.5 - 0.02), qy, cz + sz * (qd * 0.5 - 0.02), cStone);
      }
    }
  }

  // 4. Ground Floor Features (Front Facade at Z = hd = 0.70)
  builder.addBox(0.42, 0.94, 0.04, 0, 0.65, hd + 0.005, cStone);
  builder.addBox(0.36, 0.88, 0.06, 0, 0.62, hd + 0.01, cDoor);
  builder.addBox(0.20, 0.32, 0.03, 0, 0.78, hd + 0.03, cWindow);
  const shopWindows = [-0.48, 0.48];
  for (let i = 0; i < 2; i++) {
    const wx = shopWindows[i];
    builder.addBox(0.46, 0.78, 0.06, wx, 0.65, hd + 0.01, cStone);
    builder.addBox(0.34, 0.66, 0.08, wx, 0.65, hd + 0.02, cWindow);
    builder.addBox(0.38, 0.10, 0.07, wx, 1.05, hd + 0.015, cStone);
    if (isWinter) {
      builder.addBox(0.38, 0.04, 0.09, wx, 1.11, hd + 0.02, cSnow);
    }
  }

  // 5. 'BAKERY' Sign
  builder.addBox(0.76, 0.22, 0.08, 0, 1.28, hd + 0.04, cSign);
  builder.addBox(0.66, 0.12, 0.04, 0, 1.28, hd + 0.08, cSignText);
  if (isWinter) {
    builder.addBox(0.80, 0.08, 0.12, 0, 1.40, hd + 0.05, cSnow);
  }

  // 6. 2nd & 3rd Floor Arched Windows
  const winXs = [-0.46, 0, 0.46];
  const winYs = [2.00, 2.95];
  for (let y = 0; y < 2; y++) {
    const wy = winYs[y];
    for (let x = 0; x < 3; x++) {
      const wx = winXs[x];
      builder.addBox(0.32, 0.05, 0.08, wx, wy - 0.26, hd + 0.02, cStone);
      if (isWinter) {
        builder.addBox(0.30, 0.03, 0.09, wx, wy - 0.22, hd + 0.025, cSnow);
      }
      builder.addBox(0.30, 0.54, 0.05, wx, wy + 0.02, hd + 0.01, cStone);
      builder.addBox(0.20, 0.44, 0.07, wx, wy + 0.02, hd + 0.02, cWindow);
      builder.addBox(0.08, 0.08, 0.07, wx, wy + 0.31, hd + 0.02, cStone);
      if (isWinter) {
        builder.addBox(0.24, 0.04, 0.08, wx, wy + 0.33, hd + 0.02, cSnow);
      }
    }
  }

  // 7. Festive Garland (Pine Needles & Berries)
  if (isWinter) {
    const garlandYs = [1.22, 2.45, 3.38];
    for (let g = 0; g < 3; g++) {
      const gy = garlandYs[g];
      for (let s = 0; s < 3; s++) {
        const sx = -0.48 + s * 0.48;
        builder.addBox(0.40, 0.08, 0.08, sx, gy - 0.03, hd + 0.03, cGarland);
        builder.addBox(0.06, 0.06, 0.09, sx - 0.20, gy, hd + 0.04, cBerry);
      }
      builder.addBox(0.06, 0.06, 0.09, 0.48, gy, hd + 0.04, cBerry);

      const sideXs = [-hw - 0.02, hw + 0.02];
      for (let x = 0; x < 2; x++) {
        const gx = sideXs[x];
        for (let s = 0; s < 2; s++) {
          const sz = -0.28 + s * 0.56;
          builder.addBox(0.08, 0.08, 0.48, gx, gy - 0.03, sz, cGarland);
          builder.addBox(0.09, 0.06, 0.06, gx, gy, sz - 0.24, cBerry);
        }
        builder.addBox(0.09, 0.06, 0.06, gx, gy, 0.32, cBerry);
      }
    }
  }

  // 8. Flat Roof & Battlements (Zubtsy with Snow Caps)
  builder.addBox(W - 0.12, 0.12, D - 0.12, 0, 3.52, 0, isWinter ? cSnow : 0x78350f);
  const teethX = [-0.60, -0.20, 0.20, 0.60];
  const teethZBounds = [-hd + 0.06, hd - 0.06];
  for (let x = 0; x < 4; x++) {
    const tx = teethX[x];
    for (let z = 0; z < 2; z++) {
      const tz = teethZBounds[z];
      builder.addBox(0.24, 0.30, 0.14, tx, 3.68, tz, cBrick);
      if (isWinter) {
        builder.addBox(0.26, 0.08, 0.16, tx, 3.86, tz, cSnow);
      }
    }
  }
  const midTeethZ = [-0.22, 0.22];
  const teethXBounds = [-hw + 0.06, hw - 0.06];
  for (let z = 0; z < 2; z++) {
    const tz = midTeethZ[z];
    for (let x = 0; x < 2; x++) {
      const tx = teethXBounds[x];
      builder.addBox(0.14, 0.30, 0.24, tx, 3.68, tz, cBrick);
      if (isWinter) {
        builder.addBox(0.16, 0.08, 0.26, tx, 3.86, tz, cSnow);
      }
    }
  }

  // 9. Chimney with Smoke Puffs
  const chimX = 0.46;
  const chimZ = -0.26;
  builder.addBox(0.26, 0.65, 0.26, chimX, 3.85, chimZ, cBrick);
  builder.addBox(0.30, 0.08, 0.30, chimX, 4.20, chimZ, cStone);
  if (isWinter) {
    builder.addBox(0.32, 0.06, 0.32, chimX, 4.26, chimZ, cSnow);
    builder.addBox(0.08, 0.08, 0.08, chimX, 4.36, chimZ, cSmoke);
    builder.addBox(0.09, 0.09, 0.09, chimX - 0.03, 4.49, chimZ + 0.02, cSmoke);
    builder.addBox(0.08, 0.08, 0.08, chimX + 0.02, 4.62, chimZ + 0.04, cSmoke);
    builder.addBox(0.06, 0.06, 0.06, chimX - 0.01, 4.74, chimZ + 0.05, cSmoke);
  }
}

const townhouseCVoxels: BldgVoxel[] = [
  // Base & 1st Floor
  [1.56, 0.12, 1.40, 0, 0.06, 0, 0x854d0e],
  [1.48, 1.30, 1.30, 0, 0.77, 0, 0x15803d],
  // Door
  [0.34, 0.90, 0.04, -0.40, 0.60, 0.66, 0x78350f],
  [0.26, 0.36, 0.05, -0.40, 0.74, 0.665, 0xfef08a],
  // Books Window with interior shelves
  [0.74, 0.70, 0.04, 0.24, 0.70, 0.66, 0xfef08a],
  [0.68, 0.20, 0.08, 0.24, 0.48, 0.67, 0x9333ea],   // Books display
  // Emerald Awning
  [0.84, 0.14, 0.36, 0.24, 1.15, 0.80, 0x166534],
  [0.26, 0.15, 0.37, 0.24, 1.15, 0.80, 0x4ade80],
  // Sign 'BOOKS'
  [0.82, 0.26, 0.08, 0.18, 1.38, 0.68, 0x14532d],
  [0.68, 0.16, 0.09, 0.18, 1.38, 0.68, 0xa3e635],
  // Vertical blade sign 'BOOKS' on corner
  [0.10, 0.55, 0.24, -0.74, 1.80, 0.45, 0x78350f],
  [0.08, 0.45, 0.20, -0.74, 1.80, 0.45, 0xa3e635],
  // Mid Cornice
  [1.58, 0.12, 1.42, 0, 1.48, 0, 0xdcfce7],
  // 2nd Floor (Olive Green)
  [1.48, 1.20, 1.30, 0, 2.14, 0, 0x16a34a],
  // 3 Upper Windows
  [0.24, 0.58, 0.05, -0.40, 2.15, 0.66, 0xfef08a],
  [0.28, 0.64, 0.03, -0.40, 2.15, 0.65, 0xdcfce7],
  [0.24, 0.58, 0.05, 0, 2.15, 0.66, 0xfef08a],
  [0.28, 0.64, 0.03, 0, 2.15, 0.65, 0xdcfce7],
  [0.24, 0.58, 0.05, 0.40, 2.15, 0.66, 0xfef08a],
  [0.28, 0.64, 0.03, 0.40, 2.15, 0.65, 0xdcfce7],
  // Gable Roof (Terracotta Tile Pitch)
  [1.54, 0.14, 1.44, 0, 2.78, 0, 0xdcfce7],
  [1.44, 0.60, 1.32, 0, 3.12, 0, 0xc2410c],
  [1.24, 0.40, 1.20, 0, 3.52, 0, 0x9a3412],
  [0.96, 0.24, 1.08, 0, 3.78, 0, 0x7c2d12],
  // Chimney with terracotta pots
  [0.26, 0.68, 0.26, 0.40, 3.72, -0.22, 0x854d0e],
  [0.10, 0.16, 0.10, 0.36, 4.12, -0.22, 0xc2410c],
  [0.10, 0.16, 0.10, 0.44, 4.12, -0.22, 0xc2410c],
];

function populateTownhouseBuilder(
  builder: VoxelMeshBuilder,
  specs: BldgVoxel[],
  isWinter: boolean
): void {
  for (let i = 0; i < specs.length; i++) {
    const s = specs[i];
    builder.addBox(s[0], s[1], s[2], s[3], s[4], s[5], s[6]);
  }
  if (isWinter) {
    builder.addBox(1.48, 0.08, 1.28, 0, 3.82, 0, 0xf8fafc);
  }
}

/** Townhouse A: Parisian Blue Cafe (Ref: 11_townhouse_cafe_turnaround.jpg) */
export function createTownhouseA(isWinter = false): THREE.Group {
  const group = new THREE.Group();
  const key = isWinter ? 'townhouse_a_winter' : 'townhouse_a';
  const mesh = VoxelMeshBuilder.buildCachedMesh(key, (b) => {
    populateTownhouseBuilder(b, townhouseAVoxels, isWinter);
  });
  group.add(mesh);
  return group;
}

/** Townhouse B: Red Brick Bakery (Ref: 12_townhouse_bakery_turnaround.jpg / 22_winter_brick_bakery_turnaround.jpg) */
export function createTownhouseB(isWinter = false): THREE.Group {
  const group = new THREE.Group();
  const key = isWinter ? 'townhouse_b_winter' : 'townhouse_b';
  const mesh = VoxelMeshBuilder.buildCachedMesh(key, (b) => {
    populateBakeryBuilder(b, isWinter);
  });
  group.add(mesh);
  return group;
}

/** Townhouse C: Green Books Store (Ref: 13_townhouse_books_turnaround.jpg) */
export function createTownhouseC(isWinter = false): THREE.Group {
  const group = new THREE.Group();
  const key = isWinter ? 'townhouse_c_winter' : 'townhouse_c';
  const mesh = VoxelMeshBuilder.buildCachedMesh(key, (b) => {
    populateTownhouseBuilder(b, townhouseCVoxels, isWinter);
  });
  group.add(mesh);
  return group;
}

export function createUrbanTownhouse(seed: number, biome: BiomeType = 'forest'): THREE.Group {
  const root = new THREE.Group();
  root.name = 'urbanTownhouse';
  const variant = Math.abs(seed) % 3;
  const isWinter = biome === 'winter';
  let bldg: THREE.Group;
  if (variant === 0) bldg = createTownhouseA(isWinter);
  else if (variant === 1) bldg = createTownhouseB(isWinter);
  else bldg = createTownhouseC(isWinter);

  bldg.position.z = -0.1325;
  root.add(bldg);
  root.scale.set(0.95, 0.95, 0.95);
  return root;
}
