import * as THREE from 'three';
import type { BiomeType } from '../core/types.ts';
import { VoxelMeshBuilder } from './voxelMeshBuilder.ts';
import { populateCafeBuilder } from './townhouse/cafe.ts';
import { populateBakeryBuilder } from './townhouse/bakery.ts';
import { populateBooksBuilder } from './townhouse/books.ts';

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
export function createTownhouseB(biomeOrWinter: BiomeType | boolean = 'winter'): THREE.Group {
  const biome: BiomeType = typeof biomeOrWinter === 'boolean' ? (biomeOrWinter ? 'winter' : 'forest') : biomeOrWinter;
  const group = new THREE.Group();
  const key = `townhouse_b_${biome}`;
  const mesh = VoxelMeshBuilder.buildCachedMesh(key, (b) => {
    populateBakeryBuilder(b, biome);
  });
  group.add(mesh);
  return group;
}

/** Townhouse C: Green Books Store / Alpine Bookstore / Desert Scrolls / Synth-Library (Ref: 13_townhouse_books_turnaround.jpg) */
export function createTownhouseC(biomeOrWinter: BiomeType | boolean = 'forest'): THREE.Group {
  const biome: BiomeType = typeof biomeOrWinter === 'boolean' ? (biomeOrWinter ? 'winter' : 'forest') : biomeOrWinter;
  const group = new THREE.Group();
  const key = `townhouse_c_${biome}`;
  const mesh = VoxelMeshBuilder.buildCachedMesh(key, (b) => {
    populateBooksBuilder(b, biome);
  });
  group.add(mesh);
  return group;
}

export function createUrbanTownhouse(seed: number, biome: BiomeType = 'forest'): THREE.Group {
  const root = new THREE.Group();
  root.name = 'urbanTownhouse';
  const variant = Math.abs(seed) % 3;
  let bldg: THREE.Group;
  if (variant === 0) bldg = createTownhouseA(biome);
  else if (variant === 1) bldg = createTownhouseB(biome);
  else bldg = createTownhouseC(biome);

  bldg.position.z = -0.1325;
  root.add(bldg);
  root.scale.set(0.95, 0.95, 0.95);
  return root;
}
