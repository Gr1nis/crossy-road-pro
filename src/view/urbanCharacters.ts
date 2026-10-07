import * as THREE from 'three';
import { createVoxelMesh, VoxelPalette, type VoxelColorKey } from './voxelPalette.ts';

function addCharVoxel(
  group: THREE.Group,
  w: number,
  h: number,
  d: number,
  color: VoxelColorKey | number,
  x: number,
  y: number,
  z: number,
  isGhost: boolean
): void {
  const mat = VoxelPalette.getMaterial(color, isGhost);
  const mesh = createVoxelMesh(w, h, d, mat, x, y, z, !isGhost, !isGhost);
  group.add(mesh);
}

export function createUrbanCharacter(skinId: string = 'corgi', isGhost = false): THREE.Group {
  const group = new THREE.Group();

  if (skinId === 'corgi') {
    // 17 voxels: Corgi with stubby paws, pointy ears, tongue, fluffy tail
    addCharVoxel(group, 0.10, 0.14, 0.12, 'white', -0.16, 0.07, 0.14, isGhost);
    addCharVoxel(group, 0.10, 0.14, 0.12, 'white', 0.16, 0.07, 0.14, isGhost);
    addCharVoxel(group, 0.10, 0.14, 0.12, 'corgiOrange', -0.16, 0.07, -0.14, isGhost);
    addCharVoxel(group, 0.10, 0.14, 0.12, 'corgiOrange', 0.16, 0.07, -0.14, isGhost);
    addCharVoxel(group, 0.46, 0.30, 0.50, 'corgiOrange', 0, 0.28, 0, isGhost);
    addCharVoxel(group, 0.32, 0.22, 0.24, 'white', 0, 0.25, 0.14, isGhost);
    addCharVoxel(group, 0.36, 0.32, 0.34, 'corgiOrange', 0, 0.46, 0.20, isGhost);
    addCharVoxel(group, 0.22, 0.14, 0.16, 'white', 0, 0.40, 0.36, isGhost);
    addCharVoxel(group, 0.08, 0.06, 0.08, 'darkCharcoal', 0, 0.44, 0.44, isGhost);
    addCharVoxel(group, 0.08, 0.03, 0.08, 'nosePink', 0, 0.36, 0.40, isGhost);
    addCharVoxel(group, 0.06, 0.06, 0.04, 'darkCharcoal', -0.12, 0.50, 0.34, isGhost);
    addCharVoxel(group, 0.06, 0.06, 0.04, 'darkCharcoal', 0.12, 0.50, 0.34, isGhost);
    addCharVoxel(group, 0.10, 0.18, 0.06, 'corgiOrange', -0.14, 0.68, 0.18, isGhost);
    addCharVoxel(group, 0.10, 0.18, 0.06, 'corgiOrange', 0.14, 0.68, 0.18, isGhost);
    addCharVoxel(group, 0.06, 0.10, 0.04, 'nosePink', -0.14, 0.66, 0.19, isGhost);
    addCharVoxel(group, 0.06, 0.10, 0.04, 'nosePink', 0.14, 0.66, 0.19, isGhost);
    addCharVoxel(group, 0.14, 0.14, 0.14, 'corgiOrange', 0, 0.35, -0.28, isGhost);
  } else if (skinId === 'pigeon_pizza') {
    // 16 voxels: Pigeon with purple neck, beak, and triangular pizza slice
    addCharVoxel(group, 0.10, 0.12, 0.14, 'orangeFruit', -0.12, 0.06, 0.02, isGhost);
    addCharVoxel(group, 0.10, 0.12, 0.14, 'orangeFruit', 0.12, 0.06, 0.02, isGhost);
    addCharVoxel(group, 0.44, 0.38, 0.50, 'pigeonGrey', 0, 0.30, 0, isGhost);
    addCharVoxel(group, 0.08, 0.22, 0.32, 'darkCharcoal', -0.24, 0.32, -0.02, isGhost);
    addCharVoxel(group, 0.08, 0.22, 0.32, 'darkCharcoal', 0.24, 0.32, -0.02, isGhost);
    addCharVoxel(group, 0.22, 0.10, 0.18, 'darkCharcoal', 0, 0.28, -0.28, isGhost);
    addCharVoxel(group, 0.30, 0.14, 0.30, 'purpleNeck', 0, 0.44, 0.16, isGhost);
    addCharVoxel(group, 0.26, 0.24, 0.28, 'pigeonGrey', 0, 0.56, 0.20, isGhost);
    addCharVoxel(group, 0.05, 0.06, 0.06, 'orangeFruit', -0.14, 0.58, 0.24, isGhost);
    addCharVoxel(group, 0.05, 0.06, 0.06, 'orangeFruit', 0.14, 0.58, 0.24, isGhost);
    addCharVoxel(group, 0.12, 0.09, 0.14, 'pizzaCheese', 0, 0.53, 0.36, isGhost);
    addCharVoxel(group, 0.26, 0.06, 0.08, 'cardboard', 0, 0.52, 0.60, isGhost);
    addCharVoxel(group, 0.22, 0.04, 0.12, 'pizzaCheese', 0, 0.50, 0.52, isGhost);
    addCharVoxel(group, 0.12, 0.04, 0.10, 'pizzaCheese', 0, 0.49, 0.43, isGhost);
    addCharVoxel(group, 0.06, 0.05, 0.06, 'pizzaRed', -0.05, 0.51, 0.53, isGhost);
    addCharVoxel(group, 0.06, 0.05, 0.06, 'pizzaRed', 0.05, 0.51, 0.47, isGhost);
  } else if (skinId === 'box_cat') {
    // 17 voxels: Ginger cat peeking from cardboard parcel box
    addCharVoxel(group, 0.54, 0.38, 0.54, 'cardboard', 0, 0.19, 0, isGhost);
    addCharVoxel(group, 0.56, 0.04, 0.16, 'orangeFruit', 0, 0.38, 0, isGhost);
    addCharVoxel(group, 0.16, 0.12, 0.02, 'white', 0.14, 0.20, 0.28, isGhost);
    addCharVoxel(group, 0.42, 0.26, 0.36, 'catOrange', 0, 0.34, 0.06, isGhost);
    addCharVoxel(group, 0.38, 0.30, 0.34, 'catOrange', 0, 0.48, 0.12, isGhost);
    addCharVoxel(group, 0.22, 0.14, 0.12, 'white', 0, 0.42, 0.28, isGhost);
    addCharVoxel(group, 0.06, 0.05, 0.06, 'nosePink', 0, 0.44, 0.34, isGhost);
    addCharVoxel(group, 0.06, 0.06, 0.04, 'pizzaCheese', -0.11, 0.50, 0.29, isGhost);
    addCharVoxel(group, 0.06, 0.06, 0.04, 'pizzaCheese', 0.11, 0.50, 0.29, isGhost);
    addCharVoxel(group, 0.10, 0.14, 0.06, 'catOrange', -0.14, 0.66, 0.10, isGhost);
    addCharVoxel(group, 0.10, 0.14, 0.06, 'catOrange', 0.14, 0.66, 0.10, isGhost);
    addCharVoxel(group, 0.06, 0.08, 0.04, 'nosePink', -0.14, 0.65, 0.12, isGhost);
    addCharVoxel(group, 0.06, 0.08, 0.04, 'nosePink', 0.14, 0.65, 0.12, isGhost);
    addCharVoxel(group, 0.10, 0.08, 0.12, 'white', -0.14, 0.38, 0.28, isGhost);
    addCharVoxel(group, 0.10, 0.08, 0.12, 'white', 0.14, 0.38, 0.28, isGhost);
    addCharVoxel(group, 0.08, 0.16, 0.08, 'catOrange', 0, 0.32, -0.30, isGhost);
    addCharVoxel(group, 0.08, 0.10, 0.08, 'white', 0, 0.22, -0.32, isGhost);
  } else if (skinId === 'raccoon_bandit') {
    // 17 voxels: Raccoon with bandit eye mask, striped tail & loot sack
    addCharVoxel(group, 0.12, 0.14, 0.12, 'maskBlack', -0.15, 0.07, -0.06, isGhost);
    addCharVoxel(group, 0.12, 0.14, 0.12, 'maskBlack', 0.15, 0.07, -0.06, isGhost);
    addCharVoxel(group, 0.48, 0.40, 0.48, 'raccoonGrey', 0, 0.30, 0, isGhost);
    addCharVoxel(group, 0.30, 0.26, 0.08, 'white', 0, 0.28, 0.22, isGhost);
    addCharVoxel(group, 0.36, 0.32, 0.34, 'raccoonGrey', 0, 0.50, 0.16, isGhost);
    addCharVoxel(group, 0.40, 0.12, 0.10, 'maskBlack', 0, 0.50, 0.29, isGhost);
    addCharVoxel(group, 0.08, 0.05, 0.04, 'white', -0.10, 0.57, 0.30, isGhost);
    addCharVoxel(group, 0.08, 0.05, 0.04, 'white', 0.10, 0.57, 0.30, isGhost);
    addCharVoxel(group, 0.18, 0.12, 0.14, 'white', 0, 0.42, 0.34, isGhost);
    addCharVoxel(group, 0.06, 0.05, 0.06, 'maskBlack', 0, 0.44, 0.41, isGhost);
    addCharVoxel(group, 0.08, 0.12, 0.05, 'maskBlack', -0.15, 0.66, 0.14, isGhost);
    addCharVoxel(group, 0.08, 0.12, 0.05, 'maskBlack', 0.15, 0.66, 0.14, isGhost);
    addCharVoxel(group, 0.14, 0.14, 0.14, 'maskBlack', 0, 0.30, -0.30, isGhost);
    addCharVoxel(group, 0.14, 0.14, 0.14, 'raccoonGrey', 0, 0.34, -0.42, isGhost);
    addCharVoxel(group, 0.12, 0.12, 0.12, 'maskBlack', 0, 0.38, -0.52, isGhost);
    addCharVoxel(group, 0.32, 0.30, 0.22, 'cardboard', 0, 0.35, -0.20, isGhost);
    addCharVoxel(group, 0.14, 0.10, 0.12, 'pizzaCheese', 0, 0.50, -0.16, isGhost);
  } else if (skinId === 'capybara_zen') {
    // 16 voxels: Chill capybara with yuzu/mandarin on head
    addCharVoxel(group, 0.12, 0.14, 0.12, 'darkCharcoal', -0.16, 0.07, 0.20, isGhost);
    addCharVoxel(group, 0.12, 0.14, 0.12, 'darkCharcoal', 0.16, 0.07, 0.20, isGhost);
    addCharVoxel(group, 0.12, 0.14, 0.12, 'darkCharcoal', -0.16, 0.07, -0.20, isGhost);
    addCharVoxel(group, 0.12, 0.14, 0.12, 'darkCharcoal', 0.16, 0.07, -0.20, isGhost);
    addCharVoxel(group, 0.54, 0.44, 0.60, 'capybaraBrown', 0, 0.32, 0, isGhost);
    addCharVoxel(group, 0.40, 0.34, 0.38, 'capybaraBrown', 0, 0.45, 0.26, isGhost);
    addCharVoxel(group, 0.26, 0.20, 0.18, 'darkCharcoal', 0, 0.38, 0.46, isGhost);
    addCharVoxel(group, 0.14, 0.04, 0.05, 'maskBlack', 0, 0.40, 0.54, isGhost);
    addCharVoxel(group, 0.08, 0.03, 0.04, 'darkCharcoal', -0.17, 0.48, 0.38, isGhost);
    addCharVoxel(group, 0.08, 0.03, 0.04, 'darkCharcoal', 0.17, 0.48, 0.38, isGhost);
    addCharVoxel(group, 0.06, 0.06, 0.05, 'darkCharcoal', -0.20, 0.58, 0.20, isGhost);
    addCharVoxel(group, 0.06, 0.06, 0.05, 'darkCharcoal', 0.20, 0.58, 0.20, isGhost);
    addCharVoxel(group, 0.22, 0.14, 0.10, 'capybaraBrown', 0, 0.34, -0.32, isGhost);
    addCharVoxel(group, 0.18, 0.16, 0.18, 'orangeFruit', 0, 0.68, 0.24, isGhost);
    addCharVoxel(group, 0.04, 0.06, 0.04, 'greenLeaf', 0, 0.78, 0.24, isGhost);
    addCharVoxel(group, 0.07, 0.03, 0.06, 'greenLeaf', 0.04, 0.79, 0.26, isGhost);
  } else {
    // 14 voxels: Legacy and classical fallback (chicken, cyber_duck, shadow_ninja, frost_penguin)
    const bodyColor: VoxelColorKey =
      skinId === 'cyber_duck'
        ? 'pizzaCheese'
        : skinId === 'shadow_ninja'
          ? 'maskBlack'
          : skinId === 'frost_penguin'
            ? 'darkCharcoal'
            : 'white';

    const combColor: VoxelColorKey =
      skinId === 'cyber_duck'
        ? 'purpleNeck'
        : skinId === 'frost_penguin'
          ? 'pigeonGrey'
          : 'pizzaRed';

    const chestColor: VoxelColorKey =
      skinId === 'shadow_ninja' ? 'darkCharcoal' : 'white';

    const beakColor: VoxelColorKey =
      skinId === 'shadow_ninja' ? 'darkCharcoal' : 'orangeFruit';

    const eyeColor: VoxelColorKey =
      skinId === 'shadow_ninja' || skinId === 'frost_penguin' ? 'white' : 'darkCharcoal';

    addCharVoxel(group, 0.10, 0.14, 0.12, 'orangeFruit', -0.14, 0.07, 0, isGhost);
    addCharVoxel(group, 0.10, 0.14, 0.12, 'orangeFruit', 0.14, 0.07, 0, isGhost);
    addCharVoxel(group, 0.14, 0.04, 0.22, 'orangeFruit', -0.14, 0.02, 0.04, isGhost);
    addCharVoxel(group, 0.14, 0.04, 0.22, 'orangeFruit', 0.14, 0.02, 0.04, isGhost);
    addCharVoxel(group, 0.52, 0.50, 0.56, bodyColor, 0, 0.36, 0, isGhost);
    addCharVoxel(group, 0.08, 0.26, 0.32, bodyColor, -0.28, 0.34, -0.02, isGhost);
    addCharVoxel(group, 0.08, 0.26, 0.32, bodyColor, 0.28, 0.34, -0.02, isGhost);
    addCharVoxel(group, 0.22, 0.20, 0.12, bodyColor, 0, 0.42, -0.32, isGhost);
    addCharVoxel(group, 0.14, 0.16, 0.28, combColor, 0, 0.68, 0.04, isGhost);
    addCharVoxel(group, 0.16, 0.12, 0.18, beakColor, 0, 0.44, 0.34, isGhost);
    addCharVoxel(group, 0.12, 0.12, 0.10, 'pizzaRed', 0, 0.32, 0.30, isGhost);
    addCharVoxel(group, 0.06, 0.08, 0.08, eyeColor, -0.26, 0.48, 0.16, isGhost);
    addCharVoxel(group, 0.06, 0.08, 0.08, eyeColor, 0.26, 0.48, 0.16, isGhost);
    addCharVoxel(group, 0.34, 0.32, 0.10, chestColor, 0, 0.32, 0.26, isGhost);
  }

  return group;
}
