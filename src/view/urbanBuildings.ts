import * as THREE from 'three';
import type { BiomeType } from '../core/types.ts';
import { VoxelMeshBuilder } from './voxelMeshBuilder.ts';

type BldgVoxel = [number, number, number, number, number, number, number];

const townhouseAVoxels: BldgVoxel[] = [
  // Foundation & 1st Floor
  [1.60, 0.12, 1.40, 0, 0.06, 0, 0x94a3b8],
  [1.50, 1.30, 1.30, 0, 0.77, 0, 0x2563eb],
  [0.34, 0.90, 0.04, -0.42, 0.60, 0.66, 0x78350f],     // Door
  [0.26, 0.40, 0.05, -0.42, 0.72, 0.665, 0xfef08a],    // Door glass
  [0.72, 0.70, 0.04, 0.26, 0.70, 0.66, 0xfef08a],     // Cafe window
  [0.76, 0.08, 0.06, 0.26, 0.32, 0.67, 0x1e3a8a],
  // Striped Awning (Red & White)
  [0.86, 0.14, 0.36, 0.26, 1.15, 0.80, 0xdc2626],
  [0.28, 0.15, 0.37, 0.26, 1.15, 0.80, 0xf8fafc],
  // Sign 'CAFE'
  [0.72, 0.24, 0.08, 0.26, 1.38, 0.68, 0x78350f],
  [0.54, 0.14, 0.09, 0.26, 1.38, 0.68, 0xfef08a],
  // Cornice Belt between 1st & 2nd floors
  [1.62, 0.12, 1.42, 0, 1.50, 0, 0xf8fafc],
  // 2nd Floor
  [1.50, 1.20, 1.30, 0, 2.16, 0, 0x3b82f6],
  [0.32, 0.60, 0.05, -0.38, 2.16, 0.66, 0xfef08a],    // Window L
  [0.36, 0.66, 0.03, -0.38, 2.16, 0.65, 0xf8fafc],
  [0.32, 0.60, 0.05, 0.38, 2.16, 0.66, 0xfef08a],     // Window R
  [0.36, 0.66, 0.03, 0.38, 2.16, 0.65, 0xf8fafc],
  // Planter boxes under 2nd floor windows
  [0.38, 0.12, 0.14, -0.38, 1.80, 0.70, 0x854d0e],
  [0.32, 0.08, 0.10, -0.38, 1.88, 0.70, 0x16a34a],
  [0.38, 0.12, 0.14, 0.38, 1.80, 0.70, 0x854d0e],
  [0.32, 0.08, 0.10, 0.38, 1.88, 0.70, 0x16a34a],
  // Roof cornice
  [1.64, 0.14, 1.44, 0, 2.82, 0, 0xf8fafc],
  // Mansard Roof (Terracotta Tiles)
  [1.46, 0.85, 1.26, 0, 3.28, 0, 0xb45309],
  [1.30, 0.20, 1.10, 0, 3.75, 0, 0x92400e],
  // Dormer window on roof
  [0.40, 0.38, 0.36, 0, 3.32, 0.58, 0x3b82f6],
  [0.26, 0.24, 0.05, 0, 3.32, 0.76, 0xfef08a],
  [0.44, 0.12, 0.38, 0, 3.55, 0.58, 0x92400e],
  // Chimney
  [0.22, 0.60, 0.22, -0.45, 3.85, -0.25, 0x64748b],
  [0.26, 0.10, 0.26, -0.45, 4.18, -0.25, 0x475569],
];

const townhouseBVoxels: BldgVoxel[] = [
  // Base & 1st Floor
  [1.60, 0.12, 1.40, 0, 0.06, 0, 0xfacc15],
  [1.50, 1.30, 1.30, 0, 0.77, 0, 0xdc2626],
  // Yellow quoin stones on corners
  [0.14, 1.30, 0.14, -0.70, 0.77, 0.60, 0xfacc15],
  [0.14, 1.30, 0.14, 0.70, 0.77, 0.60, 0xfacc15],
  // Door
  [0.34, 0.90, 0.04, -0.42, 0.60, 0.66, 0x78350f],
  [0.26, 0.34, 0.05, -0.42, 0.75, 0.665, 0xfef08a],
  // Bakery window & display
  [0.74, 0.68, 0.04, 0.26, 0.71, 0.66, 0xfef08a],
  // Awning (Red & White)
  [0.86, 0.14, 0.36, 0.26, 1.15, 0.80, 0xef4444],
  [0.30, 0.15, 0.37, 0.26, 1.15, 0.80, 0xf8fafc],
  // Sign 'BAKERY'
  [0.88, 0.26, 0.08, 0.22, 1.38, 0.68, 0x78350f],
  [0.72, 0.16, 0.09, 0.22, 1.38, 0.68, 0xfef08a],
  // Mid Cornice
  [1.62, 0.14, 1.42, 0, 1.50, 0, 0xfacc15],
  // 2nd Floor (Brick Red)
  [1.50, 1.25, 1.30, 0, 2.18, 0, 0xb91c1c],
  [0.14, 1.25, 0.14, -0.70, 2.18, 0.60, 0xfacc15],
  [0.14, 1.25, 0.14, 0.70, 2.18, 0.60, 0xfacc15],
  // 3 Arched Windows
  [0.26, 0.60, 0.05, -0.42, 2.20, 0.66, 0xfef08a],
  [0.30, 0.66, 0.03, -0.42, 2.20, 0.65, 0xfacc15],
  [0.26, 0.60, 0.05, 0, 2.20, 0.66, 0xfef08a],
  [0.30, 0.66, 0.03, 0, 2.20, 0.65, 0xfacc15],
  [0.26, 0.60, 0.05, 0.42, 2.20, 0.66, 0xfef08a],
  [0.30, 0.66, 0.03, 0.42, 2.20, 0.65, 0xfacc15],
  // Roof Cornice & Stepped Parapet Balustrade
  [1.64, 0.16, 1.44, 0, 2.86, 0, 0xfacc15],
  [1.50, 0.40, 1.30, 0, 3.12, 0, 0xb91c1c],
  [0.70, 0.36, 0.12, 0, 3.42, 0.60, 0xdc2626],
  [0.40, 0.16, 0.06, 0, 3.42, 0.66, 0x38bdf8],     // Top decorative attic arch
  [0.76, 0.08, 0.14, 0, 3.62, 0.60, 0xfacc15],
  // Double Chimneys
  [0.24, 0.54, 0.24, 0.44, 3.50, -0.20, 0x991b1b],
  [0.28, 0.10, 0.28, 0.44, 3.80, -0.20, 0x475569],
];

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

/** Townhouse B: Red Brick Bakery (Ref: 12_townhouse_bakery_turnaround.jpg) */
export function createTownhouseB(isWinter = false): THREE.Group {
  const group = new THREE.Group();
  const key = isWinter ? 'townhouse_b_winter' : 'townhouse_b';
  const mesh = VoxelMeshBuilder.buildCachedMesh(key, (b) => {
    populateTownhouseBuilder(b, townhouseBVoxels, isWinter);
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
