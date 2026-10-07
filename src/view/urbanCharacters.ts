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
    // 32 voxels: Corgi with stubby paws, pink pads, white chest & blaze, tongue, upright ears, peach tail
    // 4 Stubby paws with pink pads
    addCharVoxel(group, 0.10, 0.03, 0.10, 'nosePink', -0.14, 0.015, 0.16, isGhost);
    addCharVoxel(group, 0.10, 0.12, 0.10, 'white', -0.14, 0.09, 0.16, isGhost);
    addCharVoxel(group, 0.10, 0.03, 0.10, 'nosePink', 0.14, 0.015, 0.16, isGhost);
    addCharVoxel(group, 0.10, 0.12, 0.10, 'white', 0.14, 0.09, 0.16, isGhost);
    addCharVoxel(group, 0.10, 0.03, 0.10, 'nosePink', -0.14, 0.015, -0.16, isGhost);
    addCharVoxel(group, 0.10, 0.12, 0.10, 'white', -0.14, 0.09, -0.16, isGhost);
    addCharVoxel(group, 0.10, 0.03, 0.10, 'nosePink', 0.14, 0.015, -0.16, isGhost);
    addCharVoxel(group, 0.10, 0.12, 0.10, 'white', 0.14, 0.09, -0.16, isGhost);
    // Body, underbelly, fluffy chest & rear bum
    addCharVoxel(group, 0.38, 0.22, 0.46, 'corgiOrange', 0, 0.25, -0.01, isGhost);
    addCharVoxel(group, 0.26, 0.04, 0.38, 'white', 0, 0.15, -0.01, isGhost);
    addCharVoxel(group, 0.34, 0.20, 0.12, 'white', 0, 0.26, 0.18, isGhost);
    addCharVoxel(group, 0.36, 0.20, 0.08, 'corgiOrange', 0, 0.26, -0.24, isGhost);
    addCharVoxel(group, 0.16, 0.12, 0.03, 'white', 0, 0.25, -0.28, isGhost);
    addCharVoxel(group, 0.12, 0.12, 0.10, 'corgiOrange', 0, 0.35, -0.27, isGhost);
    addCharVoxel(group, 0.08, 0.08, 0.05, 'white', 0, 0.37, -0.31, isGhost);
    // Collar & golden tag
    addCharVoxel(group, 0.32, 0.04, 0.22, 'pizzaRed', 0, 0.35, 0.15, isGhost);
    addCharVoxel(group, 0.04, 0.04, 0.03, 'pizzaCheese', 0, 0.33, 0.26, isGhost);
    // Head, blaze, muzzle, nose, tongue, expressive eyes
    addCharVoxel(group, 0.36, 0.26, 0.30, 'corgiOrange', 0, 0.48, 0.18, isGhost);
    addCharVoxel(group, 0.08, 0.22, 0.12, 'white', 0, 0.50, 0.28, isGhost);
    addCharVoxel(group, 0.20, 0.12, 0.14, 'white', 0, 0.42, 0.35, isGhost);
    addCharVoxel(group, 0.08, 0.06, 0.06, 'darkCharcoal', 0, 0.46, 0.42, isGhost);
    addCharVoxel(group, 0.06, 0.03, 0.08, 'nosePink', 0.03, 0.38, 0.41, isGhost);
    addCharVoxel(group, 0.05, 0.06, 0.04, 'darkCharcoal', -0.11, 0.51, 0.33, isGhost);
    addCharVoxel(group, 0.02, 0.02, 0.02, 'white', -0.11, 0.53, 0.35, isGhost);
    addCharVoxel(group, 0.05, 0.06, 0.04, 'darkCharcoal', 0.11, 0.51, 0.33, isGhost);
    addCharVoxel(group, 0.02, 0.02, 0.02, 'white', 0.11, 0.53, 0.35, isGhost);
    // Big fox ears with pink inner layer
    addCharVoxel(group, 0.10, 0.16, 0.06, 'corgiOrange', -0.14, 0.66, 0.16, isGhost);
    addCharVoxel(group, 0.06, 0.08, 0.05, 'corgiOrange', -0.15, 0.76, 0.16, isGhost);
    addCharVoxel(group, 0.06, 0.14, 0.03, 'nosePink', -0.14, 0.67, 0.18, isGhost);
    addCharVoxel(group, 0.10, 0.16, 0.06, 'corgiOrange', 0.14, 0.66, 0.16, isGhost);
    addCharVoxel(group, 0.06, 0.08, 0.05, 'corgiOrange', 0.15, 0.76, 0.16, isGhost);
    addCharVoxel(group, 0.06, 0.14, 0.03, 'nosePink', 0.14, 0.67, 0.18, isGhost);
  } else if (skinId === 'pigeon_pizza') {
    // 33 voxels: Pigeon with iridescent neck, wing stripes, and triangular pepperoni pizza
    // Coral feet & legs
    addCharVoxel(group, 0.12, 0.03, 0.14, 'pigeonFootRed', -0.10, 0.015, 0.02, isGhost);
    addCharVoxel(group, 0.05, 0.10, 0.05, 'pigeonFootRed', -0.10, 0.07, 0.00, isGhost);
    addCharVoxel(group, 0.12, 0.03, 0.14, 'pigeonFootRed', 0.10, 0.015, 0.02, isGhost);
    addCharVoxel(group, 0.05, 0.10, 0.05, 'pigeonFootRed', 0.10, 0.07, 0.00, isGhost);
    // Body, light chest, tail feathers
    addCharVoxel(group, 0.40, 0.28, 0.42, 'pigeonGrey', 0, 0.28, -0.04, isGhost);
    addCharVoxel(group, 0.30, 0.20, 0.12, 'white', 0, 0.28, 0.12, isGhost);
    addCharVoxel(group, 0.22, 0.08, 0.18, 'pigeonGrey', 0, 0.26, -0.28, isGhost);
    addCharVoxel(group, 0.18, 0.05, 0.12, 'darkCharcoal', 0, 0.24, -0.38, isGhost);
    // Wings with black bars & tips
    addCharVoxel(group, 0.06, 0.22, 0.32, 'pigeonGrey', -0.22, 0.32, -0.04, isGhost);
    addCharVoxel(group, 0.07, 0.05, 0.22, 'darkCharcoal', -0.22, 0.28, -0.06, isGhost);
    addCharVoxel(group, 0.06, 0.08, 0.14, 'darkCharcoal', -0.20, 0.24, -0.20, isGhost);
    addCharVoxel(group, 0.06, 0.22, 0.32, 'pigeonGrey', 0.22, 0.32, -0.04, isGhost);
    addCharVoxel(group, 0.07, 0.05, 0.22, 'darkCharcoal', 0.22, 0.28, -0.06, isGhost);
    addCharVoxel(group, 0.06, 0.08, 0.14, 'darkCharcoal', 0.20, 0.24, -0.20, isGhost);
    // Iridescent shimmering neck & collar
    addCharVoxel(group, 0.28, 0.12, 0.26, 'purpleNeck', 0, 0.43, 0.10, isGhost);
    addCharVoxel(group, 0.29, 0.04, 0.27, 'pigeonTeal', 0, 0.41, 0.10, isGhost);
    // Head, eyes with orange ring, beak & cere
    addCharVoxel(group, 0.26, 0.22, 0.26, 'pigeonGrey', 0, 0.56, 0.14, isGhost);
    addCharVoxel(group, 0.18, 0.06, 0.18, 'pigeonGrey', 0, 0.68, 0.14, isGhost);
    addCharVoxel(group, 0.03, 0.07, 0.07, 'orangeFruit', -0.14, 0.60, 0.17, isGhost);
    addCharVoxel(group, 0.04, 0.04, 0.04, 'darkCharcoal', -0.14, 0.60, 0.17, isGhost);
    addCharVoxel(group, 0.03, 0.07, 0.07, 'orangeFruit', 0.14, 0.60, 0.17, isGhost);
    addCharVoxel(group, 0.04, 0.04, 0.04, 'darkCharcoal', 0.14, 0.60, 0.17, isGhost);
    addCharVoxel(group, 0.09, 0.06, 0.12, 'orangeFruit', 0, 0.55, 0.26, isGhost);
    addCharVoxel(group, 0.08, 0.04, 0.08, 'orangeFruit', 0, 0.50, 0.24, isGhost);
    addCharVoxel(group, 0.08, 0.04, 0.04, 'white', 0, 0.59, 0.23, isGhost);
    // Realistic triangular pizza slice with cheese, crust & pepperoni
    addCharVoxel(group, 0.08, 0.04, 0.06, 'pizzaCheese', 0, 0.52, 0.26, isGhost);
    addCharVoxel(group, 0.16, 0.04, 0.06, 'pizzaCheese', 0, 0.52, 0.31, isGhost);
    addCharVoxel(group, 0.24, 0.04, 0.06, 'pizzaCheese', 0, 0.52, 0.36, isGhost);
    addCharVoxel(group, 0.26, 0.06, 0.06, 'pizzaCrust', 0, 0.53, 0.41, isGhost);
    addCharVoxel(group, 0.06, 0.02, 0.06, 'pizzaRed', -0.05, 0.54, 0.36, isGhost);
    addCharVoxel(group, 0.06, 0.02, 0.06, 'pizzaRed', 0.05, 0.54, 0.32, isGhost);
    addCharVoxel(group, 0.04, 0.02, 0.04, 'pizzaRed', 0, 0.54, 0.28, isGhost);
    addCharVoxel(group, 0.03, 0.02, 0.03, 'greenLeaf', -0.02, 0.54, 0.33, isGhost);
  } else if (skinId === 'box_cat') {
    // 37 voxels: Ginger cat in cardboard parcel box with flaps, FRAGILE stamp & paws on rim
    // Corrugated box & angled flaps
    addCharVoxel(group, 0.52, 0.04, 0.52, 'cardboard', 0, 0.02, 0, isGhost);
    addCharVoxel(group, 0.52, 0.26, 0.04, 'cardboard', 0, 0.17, 0.24, isGhost);
    addCharVoxel(group, 0.52, 0.26, 0.04, 'cardboard', 0, 0.17, -0.24, isGhost);
    addCharVoxel(group, 0.04, 0.26, 0.44, 'cardboard', -0.24, 0.17, 0, isGhost);
    addCharVoxel(group, 0.04, 0.26, 0.44, 'cardboard', 0.24, 0.17, 0, isGhost);
    addCharVoxel(group, 0.46, 0.03, 0.10, 'boxFlap', 0, 0.29, 0.31, isGhost);
    addCharVoxel(group, 0.46, 0.03, 0.10, 'boxFlap', 0, 0.29, -0.31, isGhost);
    addCharVoxel(group, 0.10, 0.03, 0.46, 'boxFlap', -0.31, 0.29, 0, isGhost);
    addCharVoxel(group, 0.10, 0.03, 0.46, 'boxFlap', 0.31, 0.29, 0, isGhost);
    // Red DELIVERY / FRAGILE stamp label
    addCharVoxel(group, 0.22, 0.12, 0.02, 'deliveryRed', 0.10, 0.15, 0.262, isGhost);
    addCharVoxel(group, 0.16, 0.04, 0.02, 'white', 0.10, 0.16, 0.272, isGhost);
    addCharVoxel(group, 0.04, 0.05, 0.02, 'darkCharcoal', 0.02, 0.15, 0.274, isGhost);
    // Cat body & white chest
    addCharVoxel(group, 0.38, 0.22, 0.38, 'catOrange', 0, 0.20, 0, isGhost);
    addCharVoxel(group, 0.20, 0.14, 0.06, 'white', 0, 0.26, 0.18, isGhost);
    // Paws resting over the front rim
    addCharVoxel(group, 0.09, 0.07, 0.10, 'white', -0.13, 0.32, 0.24, isGhost);
    addCharVoxel(group, 0.06, 0.02, 0.06, 'nosePink', -0.13, 0.29, 0.26, isGhost);
    addCharVoxel(group, 0.09, 0.07, 0.10, 'white', 0.13, 0.32, 0.24, isGhost);
    addCharVoxel(group, 0.06, 0.02, 0.06, 'nosePink', 0.13, 0.29, 0.26, isGhost);
    // Cat head, tabby stripes, cheeks & nose
    addCharVoxel(group, 0.34, 0.26, 0.30, 'catOrange', 0, 0.44, 0.06, isGhost);
    addCharVoxel(group, 0.05, 0.12, 0.26, 'catStripe', 0, 0.52, 0.06, isGhost);
    addCharVoxel(group, 0.04, 0.10, 0.22, 'catStripe', -0.09, 0.51, 0.06, isGhost);
    addCharVoxel(group, 0.04, 0.10, 0.22, 'catStripe', 0.09, 0.51, 0.06, isGhost);
    addCharVoxel(group, 0.18, 0.09, 0.08, 'white', 0, 0.39, 0.21, isGhost);
    addCharVoxel(group, 0.05, 0.04, 0.04, 'nosePink', 0, 0.42, 0.25, isGhost);
    // Expressive cat eyes with dark pupils
    addCharVoxel(group, 0.05, 0.06, 0.04, 'catEye', -0.08, 0.46, 0.212, isGhost);
    addCharVoxel(group, 0.025, 0.05, 0.04, 'darkCharcoal', -0.08, 0.46, 0.216, isGhost);
    addCharVoxel(group, 0.05, 0.06, 0.04, 'catEye', 0.08, 0.46, 0.212, isGhost);
    addCharVoxel(group, 0.025, 0.05, 0.04, 'darkCharcoal', 0.08, 0.46, 0.216, isGhost);
    // Ears with pink inner lining
    addCharVoxel(group, 0.09, 0.10, 0.06, 'catOrange', -0.12, 0.60, 0.06, isGhost);
    addCharVoxel(group, 0.05, 0.07, 0.03, 'nosePink', -0.12, 0.59, 0.08, isGhost);
    addCharVoxel(group, 0.09, 0.10, 0.06, 'catOrange', 0.12, 0.60, 0.06, isGhost);
    addCharVoxel(group, 0.05, 0.07, 0.03, 'nosePink', 0.12, 0.59, 0.08, isGhost);
    // Striped tail sticking straight up out of the back
    addCharVoxel(group, 0.07, 0.14, 0.07, 'catOrange', 0.06, 0.35, -0.21, isGhost);
    addCharVoxel(group, 0.07, 0.07, 0.07, 'catStripe', 0.06, 0.44, -0.21, isGhost);
    addCharVoxel(group, 0.07, 0.07, 0.07, 'catOrange', 0.06, 0.51, -0.21, isGhost);
    addCharVoxel(group, 0.07, 0.07, 0.07, 'catStripe', 0.06, 0.58, -0.21, isGhost);
    addCharVoxel(group, 0.07, 0.07, 0.08, 'white', 0.06, 0.65, -0.19, isGhost);
  } else if (skinId === 'raccoon_bandit') {
    // 41 voxels: Bandit Raccoon with mask, fur cheeks, striped tail & canvas loot bag
    // 4 Stubby paws & legs
    addCharVoxel(group, 0.08, 0.08, 0.08, 'maskBlack', -0.13, 0.04, 0.14, isGhost);
    addCharVoxel(group, 0.08, 0.08, 0.08, 'maskBlack', 0.13, 0.04, 0.14, isGhost);
    addCharVoxel(group, 0.08, 0.08, 0.08, 'maskBlack', -0.13, 0.04, -0.13, isGhost);
    addCharVoxel(group, 0.08, 0.08, 0.08, 'maskBlack', 0.13, 0.04, -0.13, isGhost);
    addCharVoxel(group, 0.09, 0.08, 0.09, 'raccoonGrey', -0.13, 0.12, 0.14, isGhost);
    addCharVoxel(group, 0.09, 0.08, 0.09, 'raccoonGrey', 0.13, 0.12, 0.14, isGhost);
    addCharVoxel(group, 0.09, 0.08, 0.09, 'raccoonGrey', -0.13, 0.12, -0.13, isGhost);
    addCharVoxel(group, 0.09, 0.08, 0.09, 'raccoonGrey', 0.13, 0.12, -0.13, isGhost);

    // Ash-grey body & white underbelly / chest
    addCharVoxel(group, 0.36, 0.22, 0.38, 'raccoonGrey', 0, 0.23, 0, isGhost);
    addCharVoxel(group, 0.24, 0.16, 0.24, 'white', 0, 0.20, 0.06, isGhost);
    addCharVoxel(group, 0.24, 0.16, 0.06, 'white', 0, 0.25, 0.19, isGhost);
    addCharVoxel(group, 0.28, 0.08, 0.20, 'raccoonGrey', 0, 0.34, 0.12, isGhost);

    // Head core & white fur cheeks
    addCharVoxel(group, 0.32, 0.22, 0.24, 'raccoonGrey', 0, 0.45, 0.16, isGhost);
    addCharVoxel(group, 0.06, 0.12, 0.16, 'white', -0.17, 0.42, 0.18, isGhost);
    addCharVoxel(group, 0.06, 0.12, 0.16, 'white', 0.17, 0.42, 0.18, isGhost);

    // Bandit mask & eye features
    addCharVoxel(group, 0.22, 0.08, 0.05, 'maskBlack', 0, 0.46, 0.28, isGhost);
    addCharVoxel(group, 0.08, 0.10, 0.05, 'maskBlack', -0.12, 0.46, 0.28, isGhost);
    addCharVoxel(group, 0.08, 0.10, 0.05, 'maskBlack', 0.12, 0.46, 0.28, isGhost);
    addCharVoxel(group, 0.04, 0.04, 0.02, 'darkCharcoal', -0.11, 0.46, 0.31, isGhost);
    addCharVoxel(group, 0.04, 0.04, 0.02, 'darkCharcoal', 0.11, 0.46, 0.31, isGhost);
    addCharVoxel(group, 0.05, 0.04, 0.04, 'white', -0.11, 0.53, 0.27, isGhost);
    addCharVoxel(group, 0.05, 0.04, 0.04, 'white', 0.11, 0.53, 0.27, isGhost);

    // White snout, black nose & chin
    addCharVoxel(group, 0.14, 0.09, 0.10, 'white', 0, 0.39, 0.31, isGhost);
    addCharVoxel(group, 0.06, 0.05, 0.04, 'maskBlack', 0, 0.42, 0.36, isGhost);
    addCharVoxel(group, 0.10, 0.04, 0.06, 'white', 0, 0.34, 0.28, isGhost);

    // Pointed ears with white inner rim
    addCharVoxel(group, 0.08, 0.09, 0.05, 'raccoonGrey', -0.13, 0.58, 0.14, isGhost);
    addCharVoxel(group, 0.05, 0.06, 0.03, 'white', -0.13, 0.57, 0.16, isGhost);
    addCharVoxel(group, 0.08, 0.09, 0.05, 'raccoonGrey', 0.13, 0.58, 0.14, isGhost);
    addCharVoxel(group, 0.05, 0.06, 0.03, 'white', 0.13, 0.57, 0.16, isGhost);

    // 5-segment alternating ringed fluffy tail
    addCharVoxel(group, 0.14, 0.14, 0.06, 'raccoonGrey', 0, 0.24, -0.21, isGhost);
    addCharVoxel(group, 0.15, 0.15, 0.06, 'maskBlack', 0, 0.26, -0.26, isGhost);
    addCharVoxel(group, 0.15, 0.15, 0.06, 'raccoonGrey', 0, 0.28, -0.31, isGhost);
    addCharVoxel(group, 0.14, 0.14, 0.06, 'maskBlack', 0, 0.30, -0.36, isGhost);
    addCharVoxel(group, 0.10, 0.10, 0.05, 'raccoonGrey', 0, 0.32, -0.41, isGhost);

    // Burlap loot sack on back with tied rope neck & patches
    addCharVoxel(group, 0.26, 0.18, 0.20, 'burlapBag', 0, 0.37, -0.08, isGhost);
    addCharVoxel(group, 0.22, 0.10, 0.16, 'burlapBag', 0, 0.47, -0.08, isGhost);
    addCharVoxel(group, 0.12, 0.04, 0.12, 'bagRope', 0, 0.53, -0.08, isGhost);
    addCharVoxel(group, 0.14, 0.06, 0.12, 'burlapBag', 0, 0.57, -0.08, isGhost);
    addCharVoxel(group, 0.27, 0.03, 0.21, 'bagRope', 0, 0.43, -0.08, isGhost);
    addCharVoxel(group, 0.02, 0.07, 0.10, 'darkCharcoal', -0.135, 0.38, -0.08, isGhost);
    addCharVoxel(group, 0.02, 0.07, 0.10, 'darkCharcoal', 0.135, 0.38, -0.08, isGhost);
  } else if (skinId === 'capybara_zen') {
    // 32 voxels: Zen Capybara in grounded meditative pose with mandarin on flat head
    // 4 Paws touching ground & front leg pillars
    addCharVoxel(group, 0.09, 0.08, 0.10, 'capybaraPaws', -0.14, 0.04, 0.15, isGhost);
    addCharVoxel(group, 0.09, 0.08, 0.10, 'capybaraPaws', 0.14, 0.04, 0.15, isGhost);
    addCharVoxel(group, 0.10, 0.08, 0.11, 'capybaraPaws', -0.15, 0.04, -0.15, isGhost);
    addCharVoxel(group, 0.10, 0.08, 0.11, 'capybaraPaws', 0.15, 0.04, -0.15, isGhost);
    addCharVoxel(group, 0.09, 0.12, 0.09, 'capybaraCaramel', -0.14, 0.14, 0.15, isGhost);
    addCharVoxel(group, 0.09, 0.12, 0.09, 'capybaraCaramel', 0.14, 0.14, 0.15, isGhost);

    // Caramel monolithic torso, underbelly tone & wide zen haunches
    addCharVoxel(group, 0.38, 0.32, 0.42, 'capybaraCaramel', 0, 0.24, -0.02, isGhost);
    addCharVoxel(group, 0.28, 0.08, 0.34, 'capybaraMuzzle', 0, 0.10, -0.02, isGhost);
    addCharVoxel(group, 0.06, 0.24, 0.26, 'capybaraCaramel', -0.19, 0.20, -0.12, isGhost);
    addCharVoxel(group, 0.06, 0.24, 0.26, 'capybaraCaramel', 0.19, 0.20, -0.12, isGhost);
    addCharVoxel(group, 0.32, 0.26, 0.08, 'capybaraCaramel', 0, 0.22, -0.26, isGhost);
    addCharVoxel(group, 0.06, 0.05, 0.04, 'capybaraDark', 0, 0.24, -0.31, isGhost);

    // Neck slope & heavy square flat-topped capybara head
    addCharVoxel(group, 0.32, 0.22, 0.14, 'capybaraCaramel', 0, 0.32, 0.16, isGhost);
    addCharVoxel(group, 0.30, 0.24, 0.26, 'capybaraCaramel', 0, 0.46, 0.19, isGhost);
    addCharVoxel(group, 0.26, 0.20, 0.14, 'capybaraCaramel', 0, 0.42, 0.33, isGhost);
    addCharVoxel(group, 0.04, 0.12, 0.02, 'capybaraDark', 0, 0.41, 0.405, isGhost);
    addCharVoxel(group, 0.03, 0.03, 0.02, 'maskBlack', -0.05, 0.42, 0.405, isGhost);
    addCharVoxel(group, 0.03, 0.03, 0.02, 'maskBlack', 0.05, 0.42, 0.405, isGhost);
    addCharVoxel(group, 0.20, 0.06, 0.10, 'capybaraMuzzle', 0, 0.30, 0.32, isGhost);

    // Serene meditative closed slit eyes & cute rounded ears
    addCharVoxel(group, 0.02, 0.03, 0.07, 'maskBlack', -0.155, 0.48, 0.22, isGhost);
    addCharVoxel(group, 0.02, 0.03, 0.07, 'maskBlack', 0.155, 0.48, 0.22, isGhost);
    addCharVoxel(group, 0.02, 0.02, 0.07, 'capybaraMuzzle', -0.155, 0.50, 0.22, isGhost);
    addCharVoxel(group, 0.02, 0.02, 0.07, 'capybaraMuzzle', 0.155, 0.50, 0.22, isGhost);
    addCharVoxel(group, 0.05, 0.06, 0.05, 'capybaraDark', -0.16, 0.57, 0.12, isGhost);
    addCharVoxel(group, 0.05, 0.06, 0.05, 'capybaraDark', 0.16, 0.57, 0.12, isGhost);
    addCharVoxel(group, 0.03, 0.04, 0.03, 'capybaraMuzzle', -0.16, 0.56, 0.13, isGhost);
    addCharVoxel(group, 0.03, 0.04, 0.03, 'capybaraMuzzle', 0.16, 0.56, 0.13, isGhost);

    // Round voxel mandarin/yuzu on head with green stem & leaf
    addCharVoxel(group, 0.14, 0.03, 0.14, 'orangeFruit', 0, 0.595, 0.19, isGhost);
    addCharVoxel(group, 0.18, 0.08, 0.18, 'orangeFruit', 0, 0.64, 0.19, isGhost);
    addCharVoxel(group, 0.12, 0.03, 0.12, 'orangeFruit', 0, 0.69, 0.19, isGhost);
    addCharVoxel(group, 0.03, 0.05, 0.03, 'greenLeaf', 0, 0.725, 0.19, isGhost);
    addCharVoxel(group, 0.06, 0.03, 0.04, 'greenLeaf', 0.035, 0.73, 0.21, isGhost);
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
