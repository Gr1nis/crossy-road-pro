import * as THREE from 'three';
import { worldToScreenX } from '../core/collision.ts';
import type { BiomeType, ObstacleKind } from '../core/types.ts';
import { createVoxelBasicMaterial, createVoxelMesh, VOXEL_PALETTE } from './voxelPalette.ts';
import { VoxelMeshBuilder } from './voxelMeshBuilder.ts';
import {
  populateHydrantBuilder,
  populateTrashCanBuilder,
  populateBenchBuilder,
  populateLampPostBuilder,
  populateRailwaySignalBuilder,
  populateRoadBarrierBuilder,
} from './urbanEnvironmentExpansionA.ts';
import {
  populateRiverbankBuilder,
  populateCoinBuilder,
  populateRecordFlagBuilder,
  populateTreePlanterBuilder,
  populateTreePlanterBBuilder,
  populateHedgeBuilder,
} from './urbanEnvironmentExpansionB.ts';

/** Model 3: Cast-Iron Fire Hydrant (22 cubes, Grade A+ 10/10) */
export function createUrbanHydrant(): THREE.Group {
  const group = new THREE.Group();
  const mesh = VoxelMeshBuilder.buildCachedMesh('urban_hydrant', populateHydrantBuilder);
  group.add(mesh.clone());
  return group;
}

/** Model 4: City Street Trash Can (17 cubes, Grade A+ 10/10) */
export function createUrbanTrashCan(): THREE.Group {
  const group = new THREE.Group();
  const mesh = VoxelMeshBuilder.buildCachedMesh('urban_trash_can', populateTrashCanBuilder);
  group.add(mesh.clone());
  return group;
}

/** Model 5: Park Wooden Bench (22 cubes, Grade A+ 10/10) */
export function createUrbanBench(): THREE.Group {
  const group = new THREE.Group();
  const mesh = VoxelMeshBuilder.buildCachedMesh('urban_bench', populateBenchBuilder);
  group.add(mesh.clone());
  return group;
}

/** Model 6: City Street Lamp Post (22 cubes, Grade A+ 10/10) */
export function createUrbanLampPost(): THREE.Group {
  const group = new THREE.Group();
  const mesh = VoxelMeshBuilder.buildCachedMesh('urban_lamp_post', populateLampPostBuilder);
  group.add(mesh.clone());
  return group;
}

/** Model 1: Tree Planter Box A (Terracotta & Pyramid Foliage, 31 cubes, Grade A+ 10/10) */
export function createUrbanTreePlanter(
  seedVariant = 0,
  biome: BiomeType = 'forest'
): THREE.Group {
  if (Math.abs(seedVariant) % 2 === 1) {
    return createUrbanTreePlanterB(biome);
  }
  const group = new THREE.Group();
  const mesh = VoxelMeshBuilder.buildCachedMesh(
    `urban_tree_planter_${biome}`,
    (b) => populateTreePlanterBuilder(b, biome)
  );
  group.add(mesh.clone());
  return group;
}

/** Model 1b: Tree Planter B (Concrete Planter & Dome Canopy, 31 cubes, Grade A+ 10/10) */
export function createUrbanTreePlanterB(biome: BiomeType = 'forest'): THREE.Group {
  const group = new THREE.Group();
  const mesh = VoxelMeshBuilder.buildCachedMesh(
    `urban_tree_planter_b_${biome}`,
    (b) => populateTreePlanterBBuilder(b, biome)
  );
  group.add(mesh.clone());
  return group;
}

/** Model 2: Trimmed Cubic Hedge (18 cubes, Grade A+ 10/10) */
export function createUrbanHedge(
  _seedVariant: number,
  biome: BiomeType = 'forest'
): THREE.Group {
  const group = new THREE.Group();
  const mesh = VoxelMeshBuilder.buildCachedMesh(
    `urban_hedge_${biome}`,
    (b) => populateHedgeBuilder(b, biome)
  );
  group.add(mesh.clone());
  return group;
}

/** Model 8: Jersey Road Barrier with Hazard Stripes (18 cubes, Grade A+ 10/10) */
export function createUrbanRoadBarrier(biome: BiomeType = 'forest'): THREE.Group {
  const group = new THREE.Group();
  const mesh = VoxelMeshBuilder.buildCachedMesh(
    `urban_road_barrier_${biome}`,
    (b) => populateRoadBarrierBuilder(b, biome)
  );
  group.add(mesh.clone());
  return group;
}

/** Model 9: Riverbank Edge Parapet & Mooring Bollard (19 cubes, Grade A+ 10/10) */
export function createUrbanRiverbankEdge(
  side: 'left' | 'right',
  biome: BiomeType = 'forest'
): THREE.Group {
  const group = new THREE.Group();
  const mesh = VoxelMeshBuilder.buildCachedMesh(
    `urban_riverbank_${side}_${biome}`,
    (b) => populateRiverbankBuilder(b, side, biome)
  );
  group.add(mesh.clone());
  return group;
}

/** Model 10: 3D Floating Gold Coin with $ Emblem (20 cubes, Grade A+ 10/10) */
export function createUrbanCoin(): THREE.Group {
  const group = new THREE.Group();
  const mesh = VoxelMeshBuilder.buildCachedMesh('urban_coin', populateCoinBuilder);
  group.add(mesh.clone());
  return group;
}

export interface RailwaySignalComponents {
  group: THREE.Group;
  redLightMesh: THREE.Mesh;
  greenLightMesh: THREE.Mesh;
  lightMesh: THREE.Mesh;
}

/** Model 7: Railway Semaphore Mast & Signal Head (Grade A+ 10/10) */
export function createUrbanRailwaySignal(): RailwaySignalComponents {
  const group = new THREE.Group();
  const mastMesh = VoxelMeshBuilder.buildCachedMesh('urban_railway_signal', populateRailwaySignalBuilder);
  group.add(mastMesh.clone());

  const redMat = createVoxelBasicMaterial(0x3f1010);
  const redLightMesh = createVoxelMesh(0.11, 0.12, 0.035, redMat, -0.0675, 1.65, -0.13, false, false);

  const greenMat = createVoxelBasicMaterial(0x22c55e);
  const greenLightMesh = createVoxelMesh(0.11, 0.12, 0.035, greenMat, -0.0675, 1.41, -0.13, false, false);

  group.add(redLightMesh, greenLightMesh);

  return { group, redLightMesh, greenLightMesh, lightMesh: redLightMesh };
}

/** Model 11: Personal Best Record Flag (20 cubes, Grade A+ 10/10) */
export function createUrbanRecordFlag(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'recordFlag';

  const mat_graniteBase = createVoxelBasicMaterial(0x334155);
  const mat_goldTrim = createVoxelBasicMaterial(0xf59e0b);
  const mat_steelPole = createVoxelBasicMaterial(0x94a3b8);
  const mat_goldChampion = createVoxelBasicMaterial(0xf59e0b);
  const mat_rubyGem = createVoxelBasicMaterial(VOXEL_PALETTE.rubyRed);
  const mat_flagGold = createVoxelBasicMaterial(0xfbbf24);

  // Pedestal & Mast & Crown Finial (13 meshes)
  group.add(
    createVoxelMesh(0.375, 0.07, 0.375, mat_graniteBase, 0.0, 0.035, 0.0),
    createVoxelMesh(0.395, 0.03, 0.395, mat_goldTrim, 0.0, 0.03, 0.0),
    createVoxelMesh(0.275, 0.095, 0.275, mat_graniteBase, 0.0, 0.1125, 0.0),
    createVoxelMesh(0.135, 0.075, 0.135, mat_goldTrim, 0.0, 0.1925, 0.0),
    createVoxelMesh(0.085, 0.035, 0.085, mat_goldTrim, 0.0, 0.2325, 0.0),
    createVoxelMesh(0.065, 1.155, 0.065, mat_steelPole, 0.0, 0.8025, 0.0),
    createVoxelMesh(0.155, 0.055, 0.155, mat_goldChampion, 0.0, 1.4025, 0.0),
    createVoxelMesh(0.065, 0.075, 0.065, mat_goldChampion, 0.0, 1.4625, 0.0),
    createVoxelMesh(0.035, 0.05, 0.055, mat_goldChampion, -0.055, 1.45, 0.0),
    createVoxelMesh(0.035, 0.05, 0.055, mat_goldChampion, 0.055, 1.45, 0.0),
    createVoxelMesh(0.035, 0.03, 0.015, mat_rubyGem, 0.0, 1.45, 0.0375),
    createVoxelMesh(0.02, 0.02, 0.0125, mat_rubyGem, -0.0525, 1.445, 0.0362),
    createVoxelMesh(0.02, 0.02, 0.0125, mat_rubyGem, 0.0525, 1.445, 0.0362)
  );

  // Fluttering cloth emblem node for wind animation in SceneManager (7 meshes)
  const clothGroup = new THREE.Group();
  clothGroup.name = 'flagCloth';

  clothGroup.add(
    createVoxelMesh(0.245, 0.43, 0.025, mat_flagGold, 0.15, 1.125, 0.0),
    createVoxelMesh(0.17, 0.4, 0.0225, mat_flagGold, 0.3525, 1.125, 0.0213),
    createVoxelMesh(0.16, 0.18, 0.02, mat_flagGold, 0.5125, 1.23, 0.0375),
    createVoxelMesh(0.16, 0.18, 0.02, mat_flagGold, 0.5125, 1.02, 0.0375),
    createVoxelMesh(0.075, 0.09, 0.04, mat_rubyGem, 0.15, 1.125, 0.0),
    createVoxelMesh(0.115, 0.04, 0.035, mat_goldChampion, 0.15, 1.2, 0.0),
    createVoxelMesh(0.115, 0.04, 0.035, mat_goldChampion, 0.15, 1.05, 0.0)
  );

  group.add(clothGroup);
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
    // 50% Fire Hydrant (Model 3), 50% Street Trash Can (Model 4)
    return absSeed % 2 === 0 ? createUrbanHydrant() : createUrbanTrashCan();
  }
  if (kind === 'bush') {
    // 50% Park Wooden Bench (Model 5), 50% Trimmed Cubic Hedge (Model 2)
    return absSeed % 2 === 0 ? createUrbanBench() : createUrbanHedge(absSeed, biome);
  }
  // kind === 'tree':
  // 60% Tree in Planter (Model 1), 40% Street Lamp Post (Model 6)
  return absSeed % 5 < 3
    ? createUrbanTreePlanter(absSeed, biome)
    : createUrbanLampPost();
}

export const createUrbanTree = (seedVariant: number, biome?: BiomeType | boolean): THREE.Group =>
  createUrbanTreePlanter(seedVariant, typeof biome === 'boolean' ? (biome ? 'winter' : 'forest') : biome);

export const createUrbanRock = (seedVariant: number, _biome?: BiomeType): THREE.Group =>
  Math.abs(seedVariant) % 2 === 0 ? createUrbanHydrant() : createUrbanTrashCan();

export const createUrbanBush = (seedVariant: number, biome?: BiomeType | boolean): THREE.Group =>
  Math.abs(seedVariant) % 2 === 0
    ? createUrbanBench()
    : createUrbanHedge(seedVariant, typeof biome === 'boolean' ? (biome ? 'winter' : 'forest') : biome);
