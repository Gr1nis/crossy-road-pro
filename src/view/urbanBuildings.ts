import * as THREE from 'three';
import type { BiomeType } from '../core/types.ts';
import { VoxelMeshBuilder } from './voxelMeshBuilder.ts';
import { populateCafeBuilder } from './townhouse/cafe.ts';
import { populateBakeryBuilder } from './townhouse/bakery.ts';
import { buildBooksShopfront } from './townhouse/shopfront.ts';
import { buildBooksUpperFloors } from './townhouse/upperFloors.ts';
import { buildBooksRoof } from './townhouse/roof.ts';

function populateBooksBuilder(builder: VoxelMeshBuilder, isWinter: boolean): void {
  buildBooksShopfront(builder, isWinter);
  buildBooksUpperFloors(builder, isWinter);
  buildBooksRoof(builder, isWinter);
}

/** Townhouse A: Parisian Blue Cafe / Desert Cantina / Cyber Diner (Ref: 11_townhouse_cafe_turnaround.jpg) */
export function createTownhouseA(biomeOrWinter: BiomeType | boolean = 'forest'): THREE.Group {
  const biome: BiomeType = typeof biomeOrWinter === 'boolean' ? (biomeOrWinter ? 'winter' : 'forest') : biomeOrWinter;
  const group = new THREE.Group();
  const key = `townhouse_a_${biome}`;
  const mesh = VoxelMeshBuilder.buildCachedMesh(key, (b) => {
    populateCafeBuilder(b, biome);
  });
  group.add(mesh);
  return group;
}

/** Townhouse B: Red Brick Bakery / Adobe Bakehouse / Synth-Bakery (Ref: 12_townhouse_bakery_turnaround.jpg) */
export function createTownhouseB(biomeOrWinter: BiomeType | boolean = 'forest'): THREE.Group {
  const biome: BiomeType = typeof biomeOrWinter === 'boolean' ? (biomeOrWinter ? 'winter' : 'forest') : biomeOrWinter;
  const group = new THREE.Group();
  const key = `townhouse_b_${biome}`;
  const mesh = VoxelMeshBuilder.buildCachedMesh(key, (b) => {
    populateBakeryBuilder(b, biome);
  });
  group.add(mesh);
  return group;
}

/** Townhouse C: Green Books Store (Ref: 13_townhouse_books_turnaround.jpg) */
export function createTownhouseC(biomeOrWinter: BiomeType | boolean = 'forest'): THREE.Group {
  const isWinter = biomeOrWinter === 'winter' || biomeOrWinter === true;
  const biomeKey = typeof biomeOrWinter === 'string' ? biomeOrWinter : isWinter ? 'winter' : 'forest';
  const group = new THREE.Group();
  const key = `townhouse_c_${biomeKey}`;
  const mesh = VoxelMeshBuilder.buildCachedMesh(key, (b) => {
    populateBooksBuilder(b, isWinter);
  });
  group.add(mesh);
  return group;
}

export function createUrbanTownhouse(seed: number, biome: BiomeType = 'forest'): THREE.Group {
  const root = new THREE.Group();
  root.name = 'urbanTownhouse';
  const variant = Math.abs(seed) % 3;
  let bldg: THREE.Group;
  if (biome === 'desert' || biome === 'neon') {
    bldg = variant % 2 === 0 ? createTownhouseA(biome) : createTownhouseB(biome);
  } else {
    if (variant === 0) bldg = createTownhouseA(biome);
    else if (variant === 1) bldg = createTownhouseB(biome);
    else bldg = createTownhouseC(biome);
  }

  bldg.position.z = -0.1325;
  root.add(bldg);
  root.scale.set(0.95, 0.95, 0.95);
  return root;
}
