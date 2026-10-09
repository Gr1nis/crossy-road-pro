import * as THREE from 'three';
import type { BiomeType } from '../core/types.ts';

const buildingGeoCache = new Map<string, THREE.BoxGeometry>();
const buildingMatCache = new Map<string, THREE.Material>();

function getBldgGeo(w: number, h: number, d: number): THREE.BoxGeometry {
  const key = `${w.toFixed(2)}_${h.toFixed(2)}_${d.toFixed(2)}`;
  let geo = buildingGeoCache.get(key);
  if (!geo) {
    geo = new THREE.BoxGeometry(w, h, d);
    buildingGeoCache.set(key, geo);
  }
  return geo;
}

function getBldgMat(color: number, basic = false): THREE.Material {
  const key = `${color}_${basic ? 1 : 0}`;
  let mat = buildingMatCache.get(key);
  if (!mat) {
    mat = basic
      ? new THREE.MeshBasicMaterial({ color })
      : new THREE.MeshLambertMaterial({ color });
    buildingMatCache.set(key, mat);
  }
  return mat;
}

type BldgVoxel = [number, number, number, number, number, number, number, boolean?];

function buildVoxels(group: THREE.Group, specs: BldgVoxel[]): void {
  for (const [w, h, d, x, y, z, color, basic] of specs) {
    const geo = getBldgGeo(w, h, d);
    const mat = getBldgMat(color, basic ?? false);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
  }
}

/** Townhouse A: Parisian Blue Cafe (Ref: 11_townhouse_cafe_turnaround.jpg) */
export function createTownhouseA(): THREE.Group {
  const group = new THREE.Group();
  const voxels: BldgVoxel[] = [
    // Foundation & 1st Floor
    [1.60, 0.12, 1.40, 0, 0.06, 0, 0x94a3b8],
    [1.50, 1.30, 1.30, 0, 0.77, 0, 0x2563eb],
    [0.34, 0.90, 0.04, -0.42, 0.60, 0.66, 0x78350f],     // Door
    [0.26, 0.40, 0.05, -0.42, 0.72, 0.665, 0xfef08a, true], // Door glass
    [0.72, 0.70, 0.04, 0.26, 0.70, 0.66, 0xfef08a, true],  // Cafe window
    [0.76, 0.08, 0.06, 0.26, 0.32, 0.67, 0x1e3a8a],
    // Striped Awning (Red & White)
    [0.86, 0.14, 0.36, 0.26, 1.15, 0.80, 0xdc2626],
    [0.28, 0.15, 0.37, 0.26, 1.15, 0.80, 0xf8fafc],
    // Sign 'CAFE'
    [0.72, 0.24, 0.08, 0.26, 1.38, 0.68, 0x78350f],
    [0.54, 0.14, 0.09, 0.26, 1.38, 0.68, 0xfef08a, true],
    // Cornice Belt between 1st & 2nd floors
    [1.62, 0.12, 1.42, 0, 1.50, 0, 0xf8fafc],
    // 2nd Floor
    [1.50, 1.20, 1.30, 0, 2.16, 0, 0x3b82f6],
    [0.32, 0.60, 0.05, -0.38, 2.16, 0.66, 0xfef08a, true], // Window L
    [0.36, 0.66, 0.03, -0.38, 2.16, 0.65, 0xf8fafc],
    [0.32, 0.60, 0.05, 0.38, 2.16, 0.66, 0xfef08a, true],  // Window R
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
    [0.26, 0.24, 0.05, 0, 3.32, 0.76, 0xfef08a, true],
    [0.44, 0.12, 0.38, 0, 3.55, 0.58, 0x92400e],
    // Chimney
    [0.22, 0.60, 0.22, -0.45, 3.85, -0.25, 0x64748b],
    [0.26, 0.10, 0.26, -0.45, 4.18, -0.25, 0x475569],
  ];
  buildVoxels(group, voxels);
  return group;
}

/** Townhouse B: Red Brick Bakery (Ref: 12_townhouse_bakery_turnaround.jpg) */
export function createTownhouseB(): THREE.Group {
  const group = new THREE.Group();
  const voxels: BldgVoxel[] = [
    // Base & 1st Floor
    [1.60, 0.12, 1.40, 0, 0.06, 0, 0xfacc15],
    [1.50, 1.30, 1.30, 0, 0.77, 0, 0xdc2626],
    // Yellow quoin stones on corners
    [0.14, 1.30, 0.14, -0.70, 0.77, 0.60, 0xfacc15],
    [0.14, 1.30, 0.14, 0.70, 0.77, 0.60, 0xfacc15],
    // Door
    [0.34, 0.90, 0.04, -0.42, 0.60, 0.66, 0x78350f],
    [0.26, 0.34, 0.05, -0.42, 0.75, 0.665, 0xfef08a, true],
    // Bakery window & display
    [0.74, 0.68, 0.04, 0.26, 0.71, 0.66, 0xfef08a, true],
    // Awning (Red & White)
    [0.86, 0.14, 0.36, 0.26, 1.15, 0.80, 0xef4444],
    [0.30, 0.15, 0.37, 0.26, 1.15, 0.80, 0xf8fafc],
    // Sign 'BAKERY'
    [0.88, 0.26, 0.08, 0.22, 1.38, 0.68, 0x78350f],
    [0.72, 0.16, 0.09, 0.22, 1.38, 0.68, 0xfef08a, true],
    // Mid Cornice
    [1.62, 0.14, 1.42, 0, 1.50, 0, 0xfacc15],
    // 2nd Floor (Brick Red)
    [1.50, 1.25, 1.30, 0, 2.18, 0, 0xb91c1c],
    [0.14, 1.25, 0.14, -0.70, 2.18, 0.60, 0xfacc15],
    [0.14, 1.25, 0.14, 0.70, 2.18, 0.60, 0xfacc15],
    // 3 Arched Windows
    [0.26, 0.60, 0.05, -0.42, 2.20, 0.66, 0xfef08a, true],
    [0.30, 0.66, 0.03, -0.42, 2.20, 0.65, 0xfacc15],
    [0.26, 0.60, 0.05, 0, 2.20, 0.66, 0xfef08a, true],
    [0.30, 0.66, 0.03, 0, 2.20, 0.65, 0xfacc15],
    [0.26, 0.60, 0.05, 0.42, 2.20, 0.66, 0xfef08a, true],
    [0.30, 0.66, 0.03, 0.42, 2.20, 0.65, 0xfacc15],
    // Roof Cornice & Stepped Parapet Balustrade
    [1.64, 0.16, 1.44, 0, 2.86, 0, 0xfacc15],
    [1.50, 0.40, 1.30, 0, 3.12, 0, 0xb91c1c],
    [0.70, 0.36, 0.12, 0, 3.42, 0.60, 0xdc2626],
    [0.40, 0.16, 0.06, 0, 3.42, 0.66, 0x38bdf8, true], // Top decorative attic arch
    [0.76, 0.08, 0.14, 0, 3.62, 0.60, 0xfacc15],
    // Double Chimneys
    [0.24, 0.54, 0.24, 0.44, 3.50, -0.20, 0x991b1b],
    [0.28, 0.10, 0.28, 0.44, 3.80, -0.20, 0x475569],
  ];
  buildVoxels(group, voxels);
  return group;
}

/** Townhouse C: Green Books Store (Ref: 13_townhouse_books_turnaround.jpg) */
export function createTownhouseC(): THREE.Group {
  const group = new THREE.Group();
  const voxels: BldgVoxel[] = [
    // Base & 1st Floor
    [1.56, 0.12, 1.40, 0, 0.06, 0, 0x854d0e],
    [1.48, 1.30, 1.30, 0, 0.77, 0, 0x15803d],
    // Door
    [0.34, 0.90, 0.04, -0.40, 0.60, 0.66, 0x78350f],
    [0.26, 0.36, 0.05, -0.40, 0.74, 0.665, 0xfef08a, true],
    // Books Window with interior shelves
    [0.74, 0.70, 0.04, 0.24, 0.70, 0.66, 0xfef08a, true],
    [0.68, 0.20, 0.08, 0.24, 0.48, 0.67, 0x9333ea], // Books display
    // Emerald Awning
    [0.84, 0.14, 0.36, 0.24, 1.15, 0.80, 0x166534],
    [0.26, 0.15, 0.37, 0.24, 1.15, 0.80, 0x4ade80],
    // Sign 'BOOKS'
    [0.82, 0.26, 0.08, 0.18, 1.38, 0.68, 0x14532d],
    [0.68, 0.16, 0.09, 0.18, 1.38, 0.68, 0xa3e635, true],
    // Vertical blade sign 'BOOKS' on corner
    [0.10, 0.55, 0.24, -0.74, 1.80, 0.45, 0x78350f],
    [0.08, 0.45, 0.20, -0.74, 1.80, 0.45, 0xa3e635, true],
    // Mid Cornice
    [1.58, 0.12, 1.42, 0, 1.48, 0, 0xdcfce7],
    // 2nd Floor (Olive Green)
    [1.48, 1.20, 1.30, 0, 2.14, 0, 0x16a34a],
    // 3 Upper Windows
    [0.24, 0.58, 0.05, -0.40, 2.15, 0.66, 0xfef08a, true],
    [0.28, 0.64, 0.03, -0.40, 2.15, 0.65, 0xdcfce7],
    [0.24, 0.58, 0.05, 0, 2.15, 0.66, 0xfef08a, true],
    [0.28, 0.64, 0.03, 0, 2.15, 0.65, 0xdcfce7],
    [0.24, 0.58, 0.05, 0.40, 2.15, 0.66, 0xfef08a, true],
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
  buildVoxels(group, voxels);
  return group;
}

export function createUrbanTownhouse(seed: number, biome: BiomeType = 'forest'): THREE.Group {
  const variant = Math.abs(seed) % 3;
  let bldg: THREE.Group;
  if (variant === 0) bldg = createTownhouseA();
  else if (variant === 1) bldg = createTownhouseB();
  else bldg = createTownhouseC();

  // Special lighting or tinting for night / winter biomes if needed
  if (biome === 'winter') {
    const snowGeo = getBldgGeo(1.48, 0.08, 1.28);
    const snowMat = getBldgMat(0xf8fafc);
    const snowCap = new THREE.Mesh(snowGeo, snowMat);
    snowCap.position.set(0, 3.82, 0);
    bldg.add(snowCap);
  }
  return bldg;
}
