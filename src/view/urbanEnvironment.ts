import * as THREE from 'three';
import { worldToScreenX } from '../core/collision.ts';
import type { BiomeType, ObstacleKind } from '../core/types.ts';
import {
  createVoxelBasicMaterial,
  createVoxelMaterial,
  createVoxelMesh,
  VOXEL_PALETTE,
} from './voxelPalette.ts';

export function createUrbanTree(
  seedVariant: number,
  biomeOrSnow: BiomeType | boolean = false
): THREE.Group {
  const group = new THREE.Group();
  const biome: BiomeType =
    typeof biomeOrSnow === 'boolean' ? (biomeOrSnow ? 'winter' : 'forest') : biomeOrSnow;
  const absSeed = Math.abs(seedVariant);

  if (biome === 'desert') {
    const cactusMat = createVoxelMaterial(0x15803d);
    const flowerMat = createVoxelMaterial(0xf43f5e);
    group.add(createVoxelMesh(0.36, 1.35, 0.36, cactusMat, 0, 0.675, 0));
    group.add(createVoxelMesh(0.24, 0.18, 0.22, cactusMat, -0.26, 0.65, 0));
    group.add(createVoxelMesh(0.20, 0.42, 0.22, cactusMat, -0.34, 0.86, 0));
    group.add(createVoxelMesh(0.24, 0.18, 0.22, cactusMat, 0.26, 0.82, 0));
    group.add(createVoxelMesh(0.20, 0.38, 0.22, cactusMat, 0.34, 1.0, 0));
    group.add(createVoxelMesh(0.16, 0.12, 0.16, flowerMat, 0, 1.4, 0));
    return group;
  }

  const trunkColor = biome === 'neon' ? 0x1e1b4b : 0x78350f;
  const trunkMat = createVoxelMaterial(trunkColor);
  group.add(createVoxelMesh(0.36, 0.56, 0.36, trunkMat, 0, 0.28, 0));

  const isPine = absSeed % 2 === 1 || biome === 'winter';
  const leafColor =
    biome === 'winter'
      ? 0x0f766e
      : biome === 'neon'
        ? absSeed % 2 === 0
          ? 0x06b6d4
          : 0xd946ef
        : absSeed % 3 === 0
          ? 0x16a34a
          : absSeed % 3 === 1
            ? 0x15803d
            : 0x22c55e;
  const leavesMat = createVoxelMaterial(leafColor);

  if (isPine) {
    group.add(createVoxelMesh(0.86, 0.46, 0.86, leavesMat, 0, 0.72, 0));
    group.add(createVoxelMesh(0.66, 0.44, 0.66, leavesMat, 0, 1.10, 0));
    group.add(createVoxelMesh(0.42, 0.38, 0.42, leavesMat, 0, 1.44, 0));
    if (biome === 'winter') {
      const snowMat = createVoxelMaterial(0xf8fafc);
      group.add(createVoxelMesh(0.88, 0.08, 0.88, snowMat, 0, 0.96, 0));
      group.add(createVoxelMesh(0.44, 0.12, 0.44, snowMat, 0, 1.65, 0));
    }
  } else {
    const height = 0.85 + (absSeed % 3) * 0.22;
    group.add(createVoxelMesh(0.82, height, 0.82, leavesMat, 0, 0.54 + height / 2, 0));
    group.add(createVoxelMesh(0.56, 0.24, 0.56, leavesMat, 0, 0.54 + height + 0.1, 0));
  }

  return group;
}

export function createUrbanRock(seedVariant: number, biome: BiomeType = 'forest'): THREE.Group {
  const group = new THREE.Group();
  const absSeed = Math.abs(seedVariant);
  const isHydrant = absSeed % 3 === 0 && biome !== 'desert';

  if (isHydrant) {
    // City Cast-Iron Fire Hydrant
    const hydrantMat = createVoxelMaterial(VOXEL_PALETTE.hydrantRed);
    const nutMat = createVoxelMaterial(VOXEL_PALETTE.woodLight);
    group.add(createVoxelMesh(0.36, 0.46, 0.36, hydrantMat, 0, 0.23, 0));
    group.add(createVoxelMesh(0.48, 0.14, 0.24, hydrantMat, 0, 0.28, 0));
    group.add(createVoxelMesh(0.26, 0.18, 0.26, hydrantMat, 0, 0.52, 0));
    group.add(createVoxelMesh(0.12, 0.10, 0.12, nutMat, 0, 0.64, 0));
    return group;
  }

  // Street concrete bollard or park boulder
  const baseColor =
    biome === 'desert' ? 0xb45309 : biome === 'neon' ? 0x312e81 : VOXEL_PALETTE.concreteGrey;
  const topColor =
    biome === 'winter' ? 0xf1f5f9 : biome === 'desert' ? 0xd97706 : biome === 'neon' ? 0x22d3ee : 0x94a3b8;
  const baseMat = createVoxelMaterial(baseColor);
  const topMat = createVoxelMaterial(topColor);

  group.add(createVoxelMesh(0.76, 0.44, 0.72, baseMat, 0, 0.22, 0));
  const shardX = absSeed % 2 === 0 ? -0.26 : 0.26;
  group.add(createVoxelMesh(0.32, 0.30, 0.34, baseMat, shardX, 0.15, 0.18));
  group.add(createVoxelMesh(0.52, 0.28, 0.48, topMat, (absSeed % 2 === 0 ? 1 : -1) * 0.06, 0.54, 0));

  return group;
}

export function createUrbanBush(
  seedVariant: number,
  biomeOrSnow: BiomeType | boolean = false
): THREE.Group {
  const group = new THREE.Group();
  const biome: BiomeType =
    typeof biomeOrSnow === 'boolean' ? (biomeOrSnow ? 'winter' : 'forest') : biomeOrSnow;
  const bushColor =
    biome === 'winter'
      ? 0xdbeafe
      : biome === 'desert'
        ? 0xa16207
        : biome === 'neon'
          ? 0x7e22ce
          : 0x22c55e;
  const bushMat = createVoxelMaterial(bushColor);
  const berryColor =
    biome === 'neon' ? 0x06b6d4 : Math.abs(seedVariant) % 2 === 0 ? 0xef4444 : 0xf59e0b;
  const berryMat = createVoxelMaterial(berryColor);

  group.add(createVoxelMesh(0.78, 0.46, 0.78, bushMat, 0, 0.23, 0));
  group.add(createVoxelMesh(0.54, 0.22, 0.54, bushMat, 0, 0.52, 0));
  group.add(createVoxelMesh(0.12, 0.12, 0.12, berryMat, -0.22, 0.46, 0.22));
  group.add(createVoxelMesh(0.12, 0.12, 0.12, berryMat, 0.22, 0.42, -0.18));
  group.add(createVoxelMesh(0.10, 0.10, 0.10, berryMat, 0.05, 0.62, 0.12));

  return group;
}

export function createUrbanObstacle(
  kind: ObstacleKind,
  seedVariant: number,
  biomeOrSnow: BiomeType | boolean = false
): THREE.Group {
  const biome: BiomeType =
    typeof biomeOrSnow === 'boolean' ? (biomeOrSnow ? 'winter' : 'forest') : biomeOrSnow;
  if (kind === 'rock') return createUrbanRock(seedVariant, biome);
  if (kind === 'bush') return createUrbanBush(seedVariant, biome);
  return createUrbanTree(seedVariant, biome);
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

export function createUrbanLaneDivider(): THREE.Group {
  const group = new THREE.Group();
  const dividerMat = createVoxelBasicMaterial(0xf8fafc);
  const dashGeo = new THREE.BoxGeometry(0.65, 0.02, 0.08);

  for (let x = -8.5; x <= 8.5; x += 1.6) {
    const dash = new THREE.Mesh(dashGeo, dividerMat);
    dash.position.set(x, 0.015, 0.5);
    group.add(dash);
  }

  return group;
}

export function createUrbanRoadBarrier(biome: BiomeType = 'forest'): THREE.Group {
  const group = new THREE.Group();
  const postColor =
    biome === 'neon' ? 0x1e1b4b : biome === 'desert' ? 0x78716c : biome === 'winter' ? 0x475569 : 0x64748b;
  const railColor =
    biome === 'neon' ? 0x06b6d4 : biome === 'desert' ? 0xd97706 : biome === 'winter' ? 0xe2e8f0 : 0x94a3b8;
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
  const woodColor =
    biome === 'winter' ? 0x475569 : biome === 'desert' ? 0x92400e : biome === 'neon' ? 0x1e1b4b : 0x78350f;
  const capColor =
    biome === 'winter' ? 0xf1f5f9 : biome === 'desert' ? 0xd97706 : biome === 'neon' ? 0x06b6d4 : 0x451a03;
  const rockColor =
    biome === 'winter' ? 0x94a3b8 : biome === 'desert' ? 0xb45309 : biome === 'neon' ? 0x312e81 : 0x64748b;

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
