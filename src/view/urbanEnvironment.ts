import * as THREE from 'three';
import { worldToScreenX } from '../core/collision.ts';
import type { BiomeType, ObstacleKind } from '../core/types.ts';
import {
  createVoxelBasicMaterial,
  createVoxelMaterial,
  createVoxelMesh,
  VOXEL_PALETTE,
} from './voxelPalette.ts';

/** Asset 16: Cast-Iron Fire Hydrant (Ref: 16_fire_hydrant_turnaround.jpg) */
export function createUrbanHydrant(): THREE.Group {
  const group = new THREE.Group();
  const redMat = createVoxelMaterial(0xef4444);
  const silverMat = createVoxelMaterial(0xcbd5e1);

  // Flanged base, barrel, collar, domed cap & top square nut
  group.add(
    createVoxelMesh(0.44, 0.08, 0.44, redMat, 0, 0.04, 0),
    createVoxelMesh(0.34, 0.44, 0.34, redMat, 0, 0.30, 0),
    createVoxelMesh(0.40, 0.08, 0.40, redMat, 0, 0.48, 0),
    createVoxelMesh(0.28, 0.14, 0.28, redMat, 0, 0.59, 0),
    createVoxelMesh(0.10, 0.10, 0.10, silverMat, 0, 0.71, 0),
    // Side & front nozzles
    createVoxelMesh(0.14, 0.14, 0.16, redMat, -0.22, 0.34, 0),
    createVoxelMesh(0.08, 0.10, 0.12, silverMat, -0.29, 0.34, 0),
    createVoxelMesh(0.14, 0.14, 0.16, redMat, 0.22, 0.34, 0),
    createVoxelMesh(0.08, 0.10, 0.12, silverMat, 0.29, 0.34, 0),
    createVoxelMesh(0.16, 0.16, 0.14, redMat, 0, 0.34, 0.22),
    createVoxelMesh(0.10, 0.10, 0.08, silverMat, 0, 0.34, 0.29)
  );
  return group;
}

/** Asset 17: Green Street Trash Can (Ref: 17_trash_can_turnaround.jpg) */
export function createUrbanTrashCan(): THREE.Group {
  const group = new THREE.Group();
  const greenMat = createVoxelMaterial(0x15803d);
  const darkMat = createVoxelMaterial(0x1e293b);
  const whiteMat = createVoxelBasicMaterial(0xf8fafc);
  const greyMat = createVoxelMaterial(0x64748b);

  group.add(
    createVoxelMesh(0.46, 0.52, 0.46, greenMat, 0, 0.33, 0),
    createVoxelMesh(0.32, 0.08, 0.02, whiteMat, 0, 0.46, 0.24, false, false),
    createVoxelMesh(0.52, 0.10, 0.52, greenMat, 0, 0.64, 0),
    createVoxelMesh(0.26, 0.06, 0.16, greenMat, 0, 0.72, 0),
    createVoxelMesh(0.08, 0.14, 0.14, darkMat, -0.22, 0.07, -0.16),
    createVoxelMesh(0.08, 0.14, 0.14, darkMat, 0.22, 0.07, -0.16),
    createVoxelMesh(0.08, 0.07, 0.08, darkMat, -0.18, 0.035, 0.16),
    createVoxelMesh(0.08, 0.07, 0.08, darkMat, 0.18, 0.035, 0.16),
    createVoxelMesh(0.06, 0.06, 0.18, greyMat, -0.25, 0.45, 0),
    createVoxelMesh(0.06, 0.06, 0.18, greyMat, 0.25, 0.45, 0)
  );
  return group;
}

/** Asset 14: Park Wooden Bench (Ref: 14_park_bench_turnaround.jpg) */
export function createUrbanBench(): THREE.Group {
  const group = new THREE.Group();
  const woodMat = createVoxelMaterial(0x854d0e);
  const ironMat = createVoxelMaterial(0x1e293b);

  // Cast iron legs & frame
  for (const lx of [-0.34, 0.34]) {
    group.add(createVoxelMesh(0.08, 0.22, 0.08, ironMat, lx, 0.11, 0.14)); // Front leg
    group.add(createVoxelMesh(0.08, 0.54, 0.08, ironMat, lx, 0.27, -0.14)); // Rear upright
    group.add(createVoxelMesh(0.06, 0.06, 0.36, ironMat, lx, 0.28, 0)); // Armrest
  }
  // Seat slats (4 horizontal wooden slats)
  for (let i = 0; i < 4; i++) {
    const zPos = -0.10 + i * 0.09;
    group.add(createVoxelMesh(0.84, 0.04, 0.07, woodMat, 0, 0.22, zPos));
  }
  // Backrest slats (3 horizontal wooden slats)
  for (let i = 0; i < 3; i++) {
    const yPos = 0.32 + i * 0.10;
    group.add(createVoxelMesh(0.84, 0.08, 0.04, woodMat, 0, yPos, -0.14));
  }
  return group;
}

/** Asset 15: City Street Lamp Post (Ref: 15_street_lamp_turnaround.jpg) */
export function createUrbanLampPost(): THREE.Group {
  const group = new THREE.Group();
  const ironMat = createVoxelMaterial(0x0f172a);
  const glowMat = createVoxelBasicMaterial(0xfef08a);

  // Stepped square base pedestal & slender pole
  group.add(createVoxelMesh(0.34, 0.08, 0.34, ironMat, 0, 0.04, 0));
  group.add(createVoxelMesh(0.26, 0.24, 0.26, ironMat, 0, 0.20, 0));
  group.add(createVoxelMesh(0.10, 1.10, 0.10, ironMat, 0, 0.87, 0));
  // Crossbar collar
  group.add(createVoxelMesh(0.36, 0.06, 0.08, ironMat, 0, 1.34, 0));
  group.add(createVoxelMesh(0.20, 0.06, 0.20, ironMat, 0, 1.45, 0));
  // Glowing yellow lantern chamber & cap
  group.add(createVoxelMesh(0.24, 0.30, 0.24, glowMat, 0, 1.63, 0, false, false));
  group.add(createVoxelMesh(0.28, 0.06, 0.28, ironMat, 0, 1.81, 0));
  group.add(createVoxelMesh(0.10, 0.08, 0.10, ironMat, 0, 1.88, 0));
  return group;
}

/** Asset 18: Square Tree in Planter Box (Ref: 18_tree_planter_turnaround.jpg) */
export function createUrbanTreePlanter(seedVariant: number, biome: BiomeType = 'forest'): THREE.Group {
  const group = new THREE.Group();
  const absSeed = Math.abs(seedVariant);
  const boxMat = createVoxelMaterial(0x78350f);
  const darkWood = createVoxelMaterial(0x451a03);
  const trunkMat = createVoxelMaterial(0x854d0e);

  const leafColor =
    biome === 'winter'
      ? 0x0f766e
      : biome === 'neon'
        ? absSeed % 2 === 0 ? 0x06b6d4 : 0xd946ef
        : biome === 'desert' ? 0xa16207 : 0x16a34a;
  const leafMat = createVoxelMaterial(leafColor);
  const accentMat = createVoxelMaterial(biome === 'winter' ? 0xf8fafc : 0x4ade80);

  group.add(
    createVoxelMesh(0.64, 0.44, 0.64, boxMat, 0, 0.22, 0),
    createVoxelMesh(0.68, 0.06, 0.68, darkWood, 0, 0.42, 0),
    createVoxelMesh(0.54, 0.04, 0.54, leafMat, 0, 0.44, 0),
    createVoxelMesh(0.16, 0.56, 0.16, trunkMat, 0, 0.70, 0),
    createVoxelMesh(0.72, 0.80, 0.72, leafMat, 0, 1.34, 0),
    createVoxelMesh(0.78, 0.64, 0.78, leafMat, 0, 1.34, 0),
    createVoxelMesh(0.08, 0.08, 0.08, accentMat, 0.20, 1.48, 0.40),
    createVoxelMesh(0.08, 0.08, 0.08, accentMat, -0.20, 1.25, 0.40),
    createVoxelMesh(0.08, 0.08, 0.08, accentMat, 0.40, 1.38, -0.15)
  );
  return group;
}

/** Asset 19: Neat Trimmed Cubic Bush Hedge (Ref: 19_cubic_hedge_turnaround.jpg) */
export function createUrbanHedge(seedVariant: number, biome: BiomeType = 'forest'): THREE.Group {
  const group = new THREE.Group();
  const absSeed = Math.abs(seedVariant);
  const hedgeColor =
    biome === 'winter'
      ? 0xdbeafe
      : biome === 'neon'
        ? 0x7e22ce
        : biome === 'desert' ? 0xb45309 : 0x84cc16;
  const hedgeMat = createVoxelMaterial(hedgeColor);
  const accentMat = createVoxelMaterial(biome === 'winter' ? 0xf8fafc : 0x4ade80);

  // Stepped monolithic rectangular hedge block
  group.add(createVoxelMesh(0.76, 0.06, 0.56, hedgeMat, 0, 0.03, 0));
  group.add(createVoxelMesh(0.82, 0.52, 0.62, hedgeMat, 0, 0.29, 0));
  group.add(createVoxelMesh(0.76, 0.08, 0.56, hedgeMat, 0, 0.58, 0));
  // Leaf accent cubes
  group.add(createVoxelMesh(0.07, 0.07, 0.07, accentMat, 0.18, 0.35, 0.32));
  group.add(createVoxelMesh(0.07, 0.07, 0.07, accentMat, -0.22, 0.22, 0.32));
  group.add(createVoxelMesh(0.07, 0.07, 0.07, accentMat, 0.10, 0.62, -0.12));
  return group;
}

/** Obstacle Dispatcher */
export function createUrbanObstacle(
  kind: ObstacleKind,
  seedVariant: number,
  biomeOrSnow: BiomeType | boolean = false
): THREE.Group {
  const biome: BiomeType =
    typeof biomeOrSnow === 'boolean' ? (biomeOrSnow ? 'winter' : 'forest') : biomeOrSnow;
  const absSeed = Math.abs(seedVariant);

  if (kind === 'rock') {
    // 50% Fire Hydrant (Asset 16), 50% Green Street Trash Can (Asset 17)
    return absSeed % 2 === 0 ? createUrbanHydrant() : createUrbanTrashCan();
  }
  if (kind === 'bush') {
    // 50% Park Wooden Bench (Asset 14), 50% Trimmed Cubic Bush Hedge (Asset 19)
    return absSeed % 2 === 0 ? createUrbanBench() : createUrbanHedge(absSeed, biome);
  }
  // kind === 'tree':
  // 60% Square Tree in Planter Box (Asset 18), 40% City Street Lamp Post (Asset 15)
  return absSeed % 5 < 3
    ? createUrbanTreePlanter(absSeed, biome)
    : createUrbanLampPost();
}

export function createUrbanCoin(): THREE.Group {
  const group = new THREE.Group();
  const goldMat = createVoxelMaterial(VOXEL_PALETTE.goldCoin);
  const innerMat = createVoxelMaterial(0xef4444);
  group.add(createVoxelMesh(0.44, 0.44, 0.12, goldMat, 0, 0.36, 0));
  group.add(createVoxelMesh(0.18, 0.22, 0.15, innerMat, 0, 0.36, 0));
  return group;
}

export function createUrbanRailwaySignal(): { group: THREE.Group; lightMesh: THREE.Mesh } {
  const group = new THREE.Group();
  const poleMat = createVoxelMaterial(0x1e293b);
  const lightMat = createVoxelBasicMaterial(0x334155);
  group.add(createVoxelMesh(0.14, 1.20, 0.14, poleMat, 0, 0.60, 0));
  group.add(createVoxelMesh(0.36, 0.28, 0.24, poleMat, 0, 1.22, 0));
  const lightMesh = createVoxelMesh(0.22, 0.16, 0.28, lightMat, 0, 1.22, 0, false, false);
  group.add(lightMesh);
  return { group, lightMesh };
}

export function createUrbanRoadMarkings(): THREE.Group {
  const group = new THREE.Group();
  const whiteLineMat = createVoxelBasicMaterial(0xf8fafc);
  group.add(createVoxelMesh(0.12, 0.02, 1.0, whiteLineMat, worldToScreenX(-9.5), 0.015, 0, false, false));
  group.add(createVoxelMesh(0.12, 0.02, 1.0, whiteLineMat, worldToScreenX(9.5), 0.015, 0, false, false));
  return group;
}

export function createUrbanRoadBarrier(biome: BiomeType = 'forest'): THREE.Group {
  const group = new THREE.Group();
  const postColor = biome === 'neon' ? 0x1e1b4b : biome === 'winter' ? 0x475569 : 0x64748b;
  const railColor = biome === 'neon' ? 0x06b6d4 : biome === 'winter' ? 0xe2e8f0 : 0x94a3b8;
  const reflectorColor = biome === 'neon' ? 0xec4899 : 0xfacc15;

  const postMat = createVoxelMaterial(postColor);
  const railMat = createVoxelMaterial(railColor);
  const reflectorMat = createVoxelBasicMaterial(reflectorColor);

  group.add(createVoxelMesh(0.12, 0.42, 0.12, postMat, 0, 0.21, -0.32));
  group.add(createVoxelMesh(0.12, 0.42, 0.12, postMat, 0, 0.21, 0.32));
  group.add(createVoxelMesh(0.14, 0.18, 0.96, railMat, 0, 0.28, 0));
  group.add(createVoxelMesh(0.15, 0.08, 0.18, reflectorMat, 0, 0.28, 0, false, false));
  return group;
}

export function createUrbanRiverbankEdge(
  side: 'left' | 'right',
  biome: BiomeType = 'forest'
): THREE.Group {
  const group = new THREE.Group();
  const woodColor = biome === 'winter' ? 0x475569 : biome === 'neon' ? 0x1e1b4b : 0x78350f;
  const capColor = biome === 'winter' ? 0xf1f5f9 : biome === 'neon' ? 0x06b6d4 : 0x451a03;
  const rockColor = biome === 'winter' ? 0x94a3b8 : biome === 'neon' ? 0x312e81 : 0x64748b;

  const woodMat = createVoxelMaterial(woodColor);
  const capMat = createVoxelMaterial(capColor);
  const rockMat = createVoxelMaterial(rockColor);

  group.add(createVoxelMesh(0.28, 0.44, 0.28, woodMat, 0, 0.16, -0.22));
  group.add(createVoxelMesh(0.32, 0.08, 0.32, capMat, 0, 0.40, -0.22));
  const bx = side === 'left' ? 0.2 : -0.2;
  group.add(createVoxelMesh(0.36, 0.22, 0.32, rockMat, bx, 0.07, 0.2));
  group.add(createVoxelMesh(0.18, 0.10, 0.16, capMat, bx + (side === 'left' ? 0.03 : -0.03), 0.17, 0.22));
  return group;
}

export function createUrbanRecordFlag(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'recordFlag';

  const baseMat = createVoxelMaterial(0x334155);
  const trimMat = createVoxelMaterial(0xf59e0b);
  const poleMat = createVoxelMaterial(0x94a3b8);
  const clothMat = createVoxelMaterial(0xfbbf24);
  const crownMat = createVoxelMaterial(0xf59e0b);
  const rubyMat = createVoxelMaterial(VOXEL_PALETTE.rubyRed);

  group.add(createVoxelMesh(0.70, 0.12, 0.70, baseMat, 0, 0.06, 0));
  group.add(createVoxelMesh(0.76, 0.04, 0.76, trimMat, 0, 0.02, 0));
  group.add(createVoxelMesh(0.10, 1.80, 0.10, poleMat, 0, 1.02, 0));
  group.add(createVoxelMesh(0.18, 0.14, 0.18, crownMat, 0, 1.99, 0));

  const clothGroup = new THREE.Group();
  clothGroup.name = 'flagCloth';
  clothGroup.position.set(0.05, 1.45, 0);

  clothGroup.add(createVoxelMesh(0.75, 0.44, 0.04, clothMat, 0.375, 0, 0));
  clothGroup.add(createVoxelMesh(0.20, 0.14, 0.042, clothMat, 0.85, 0.14, 0));
  clothGroup.add(createVoxelMesh(0.20, 0.14, 0.042, clothMat, 0.85, -0.14, 0));

  // Crown emblem 👑 on flag
  clothGroup.add(createVoxelMesh(0.36, 0.06, 0.07, crownMat, 0.375, -0.08, 0));
  clothGroup.add(createVoxelMesh(0.08, 0.16, 0.07, crownMat, 0.24, -0.01, 0));
  clothGroup.add(createVoxelMesh(0.09, 0.22, 0.07, crownMat, 0.375, 0.02, 0));
  clothGroup.add(createVoxelMesh(0.08, 0.16, 0.07, crownMat, 0.51, -0.01, 0));

  // Ruby gems
  clothGroup.add(createVoxelMesh(0.06, 0.06, 0.08, rubyMat, 0.24, 0.09, 0));
  clothGroup.add(createVoxelMesh(0.07, 0.07, 0.08, rubyMat, 0.375, 0.15, 0));
  clothGroup.add(createVoxelMesh(0.06, 0.06, 0.08, rubyMat, 0.51, 0.09, 0));

  group.add(clothGroup);
  return group;
}

export const createUrbanTree = (seedVariant: number, biome?: BiomeType | boolean): THREE.Group =>
  createUrbanTreePlanter(seedVariant, typeof biome === 'boolean' ? (biome ? 'winter' : 'forest') : biome);

export const createUrbanRock = (seedVariant: number, _biome?: BiomeType): THREE.Group =>
  Math.abs(seedVariant) % 2 === 0 ? createUrbanHydrant() : createUrbanTrashCan();

export const createUrbanBush = (seedVariant: number, biome?: BiomeType | boolean): THREE.Group =>
  Math.abs(seedVariant) % 2 === 0
    ? createUrbanBench()
    : createUrbanHedge(seedVariant, typeof biome === 'boolean' ? (biome ? 'winter' : 'forest') : biome);

