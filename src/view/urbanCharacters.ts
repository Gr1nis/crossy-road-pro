import * as THREE from 'three';
import { createVoxelMesh, VoxelPalette, type VoxelColorKey } from './voxelPalette.ts';
import { createUrbanCharacterExpA } from './urbanCharactersExpansionA.ts';
import { createUrbanCharacterExpB } from './urbanCharactersExpansionB.ts';

function addCharVoxel(
  group: THREE.Group, w: number, h: number, d: number,
  color: VoxelColorKey | number, x: number, y: number, z: number, isGhost: boolean
): void {
  const mat = VoxelPalette.getMaterial(color, isGhost);
  group.add(createVoxelMesh(w, h, d, mat, x, y, z, !isGhost, !isGhost));
}

export interface UrbanCharacterCalibration {
  scale: number;
  offsetY: number;
}

export const URBAN_CHARACTER_CALIBRATIONS: Record<string, UrbanCharacterCalibration> = {
  corgi: { scale: 1.00, offsetY: 0 },
  pigeon_pizza: { scale: 1.05, offsetY: 0 },
  barista_pug: { scale: 1.38, offsetY: 0 },
  skater_ferret: { scale: 1.42, offsetY: 0 },
  box_cat: { scale: 1.08, offsetY: 0 },
  subway_rat: { scale: 1.48, offsetY: 0 },
  raccoon_bandit: { scale: 1.00, offsetY: 0 },
  raincoat_duck: { scale: 1.30, offsetY: 0 },
  capybara_zen: { scale: 1.00, offsetY: 0 },
  pigeon_king: { scale: 1.14, offsetY: 0 },
};

export function createUrbanCharacter(skinId: string = 'corgi', isGhost = false): THREE.Group {
  const root = new THREE.Group();
  root.name = 'char_root';

  const innerPivot = new THREE.Group();
  innerPivot.name = 'innerPivot';

  const calib = URBAN_CHARACTER_CALIBRATIONS[skinId] ?? { scale: 1.0, offsetY: 0 };
  innerPivot.scale.set(calib.scale, calib.scale, calib.scale);
  innerPivot.position.set(0, calib.offsetY, 0);

  const group = innerPivot;

  if (skinId === 'corgi') {
    // 43 voxels: Zero Z-Fighting Certified Solid Corgi (0 coplanar overlaps)
    addCharVoxel(group, 0.090, 0.030, 0.090, 'nosePink', -0.140, 0.015, 0.150, isGhost); // front_paw_pad_left
    addCharVoxel(group, 0.100, 0.130, 0.100, 'white', -0.140, 0.085, 0.150, isGhost); // front_paw_sock_left
    addCharVoxel(group, 0.060, 0.022, 0.030, 'nosePink', -0.140, 0.016, 0.205, isGhost); // front_toe_beans_left
    addCharVoxel(group, 0.090, 0.030, 0.090, 'nosePink', 0.140, 0.015, 0.150, isGhost); // front_paw_pad_right
    addCharVoxel(group, 0.100, 0.130, 0.100, 'white', 0.140, 0.085, 0.150, isGhost); // front_paw_sock_right
    addCharVoxel(group, 0.060, 0.022, 0.030, 'nosePink', 0.140, 0.016, 0.205, isGhost); // front_toe_beans_right
    addCharVoxel(group, 0.090, 0.030, 0.090, 'nosePink', -0.140, 0.015, -0.150, isGhost); // rear_paw_pad_left
    addCharVoxel(group, 0.100, 0.130, 0.100, 'white', -0.140, 0.085, -0.150, isGhost); // rear_paw_sock_left
    addCharVoxel(group, 0.110, 0.095, 0.120, 'corgiOrange', -0.140, 0.188, -0.150, isGhost); // rear_thigh_fluff_left
    addCharVoxel(group, 0.090, 0.030, 0.090, 'nosePink', 0.140, 0.015, -0.150, isGhost); // rear_paw_pad_right
    addCharVoxel(group, 0.100, 0.130, 0.100, 'white', 0.140, 0.085, -0.150, isGhost); // rear_paw_sock_right
    addCharVoxel(group, 0.110, 0.095, 0.120, 'corgiOrange', 0.140, 0.188, -0.150, isGhost); // rear_thigh_fluff_right
    addCharVoxel(group, 0.350, 0.225, 0.370, 'corgiOrange', 0.000, 0.237, -0.000, isGhost); // body_loaf_core
    addCharVoxel(group, 0.260, 0.025, 0.330, 'white', 0.000, 0.122, -0.000, isGhost); // body_belly_white
    addCharVoxel(group, 0.320, 0.180, 0.110, 'white', 0.000, 0.245, 0.165, isGhost); // chest_bib_main
    addCharVoxel(group, 0.180, 0.110, 0.050, 'white', 0.000, 0.255, 0.220, isGhost); // chest_bib_tuft
    addCharVoxel(group, 0.330, 0.200, 0.065, 'corgiOrange', 0.000, 0.235, -0.203, isGhost); // rear_bum_core
    addCharVoxel(group, 0.270, 0.140, 0.045, 'white', 0.000, 0.235, -0.237, isGhost); // butt_peach_heart
    addCharVoxel(group, 0.110, 0.125, 0.080, 'corgiOrange', 0.000, 0.328, -0.245, isGhost); // butt_tail_bob
    addCharVoxel(group, 0.070, 0.070, 0.045, 'white', 0.000, 0.330, -0.292, isGhost); // butt_tail_tip
    addCharVoxel(group, 0.360, 0.045, 0.245, 'pizzaRed', 0.000, 0.347, 0.133, isGhost); // collar_ring
    addCharVoxel(group, 0.060, 0.060, 0.035, 'pizzaCheese', 0.000, 0.305, 0.253, isGhost); // collar_tag_gold
    addCharVoxel(group, 0.340, 0.230, 0.270, 'corgiOrange', 0.000, 0.470, 0.155, isGhost); // head_core
    addCharVoxel(group, 0.045, 0.110, 0.130, 'white', -0.177, 0.430, 0.165, isGhost); // cheek_fluff_left
    addCharVoxel(group, 0.045, 0.110, 0.130, 'white', 0.177, 0.430, 0.165, isGhost); // cheek_fluff_right
    addCharVoxel(group, 0.080, 0.260, 0.110, 'white', 0.000, 0.475, 0.250, isGhost); // blaze_forehead
    addCharVoxel(group, 0.070, 0.040, 0.100, 'white', 0.000, 0.595, 0.170, isGhost); // blaze_crown
    addCharVoxel(group, 0.180, 0.100, 0.130, 'white', 0.000, 0.415, 0.310, isGhost); // snout_muzzle
    addCharVoxel(group, 0.130, 0.020, 0.090, 'white', 0.000, 0.350, 0.290, isGhost); // chin_under_mouth
    addCharVoxel(group, 0.070, 0.055, 0.050, 'darkCharcoal', 0.000, 0.448, 0.380, isGhost); // nose_button
    addCharVoxel(group, 0.030, 0.030, 0.075, 'nosePink', 0.025, 0.370, 0.362, isGhost); // tongue_playful
    addCharVoxel(group, 0.055, 0.050, 0.040, 'darkCharcoal', -0.098, 0.500, 0.290, isGhost); // eye_left_iris
    addCharVoxel(group, 0.025, 0.015, 0.025, 'white', -0.102, 0.512, 0.307, isGhost); // eye_left_sparkle
    addCharVoxel(group, 0.045, 0.020, 0.025, 'white', -0.098, 0.550, 0.287, isGhost); // eyebrow_left
    addCharVoxel(group, 0.055, 0.050, 0.040, 'darkCharcoal', 0.098, 0.500, 0.290, isGhost); // eye_right_iris
    addCharVoxel(group, 0.025, 0.015, 0.025, 'white', 0.102, 0.512, 0.307, isGhost); // eye_right_sparkle
    addCharVoxel(group, 0.045, 0.020, 0.025, 'white', 0.098, 0.550, 0.287, isGhost); // eyebrow_right
    addCharVoxel(group, 0.090, 0.120, 0.080, 'corgiOrange', -0.130, 0.630, 0.150, isGhost); // ear_base_left
    addCharVoxel(group, 0.070, 0.100, 0.060, 'corgiOrange', -0.130, 0.725, 0.150, isGhost); // ear_tip_left
    addCharVoxel(group, 0.040, 0.110, 0.035, 'nosePink', -0.130, 0.650, 0.182, isGhost); // ear_pink_left
    addCharVoxel(group, 0.090, 0.120, 0.080, 'corgiOrange', 0.130, 0.630, 0.150, isGhost); // ear_base_right
    addCharVoxel(group, 0.070, 0.100, 0.060, 'corgiOrange', 0.130, 0.725, 0.150, isGhost); // ear_tip_right
    addCharVoxel(group, 0.040, 0.110, 0.035, 'nosePink', 0.130, 0.650, 0.182, isGhost); // ear_pink_right
  } else if (skinId === 'pigeon_pizza') {
    // 55 voxels: Zero Z-Fighting Certified Solid Pigeon Pizza (0 coplanar overlaps)
    addCharVoxel(group, 0.060, 0.025, 0.100, 'pigeonFootRed', -0.100, 0.013, -0.000, isGhost); // left_foot_base
    addCharVoxel(group, 0.030, 0.020, 0.075, 'pigeonFootRed', -0.100, 0.013, 0.083, isGhost); // left_toe_mid
    addCharVoxel(group, 0.030, 0.020, 0.060, 'pigeonFootRed', -0.140, 0.013, 0.075, isGhost); // left_toe_outer
    addCharVoxel(group, 0.030, 0.020, 0.060, 'pigeonFootRed', -0.060, 0.013, 0.075, isGhost); // left_toe_inner
    addCharVoxel(group, 0.030, 0.020, 0.050, 'pigeonFootRed', -0.100, 0.013, -0.070, isGhost); // left_toe_hallux
    addCharVoxel(group, 0.030, 0.105, 0.030, 'pigeonFootRed', -0.100, 0.072, -0.000, isGhost); // left_leg_shank
    addCharVoxel(group, 0.050, 0.070, 0.070, 'pigeonGrey', -0.100, 0.150, -0.000, isGhost); // left_thigh_fluff
    addCharVoxel(group, 0.060, 0.025, 0.100, 'pigeonFootRed', 0.100, 0.013, -0.000, isGhost); // right_foot_base
    addCharVoxel(group, 0.030, 0.020, 0.075, 'pigeonFootRed', 0.100, 0.013, 0.083, isGhost); // right_toe_mid
    addCharVoxel(group, 0.030, 0.020, 0.060, 'pigeonFootRed', 0.140, 0.013, 0.075, isGhost); // right_toe_outer
    addCharVoxel(group, 0.030, 0.020, 0.060, 'pigeonFootRed', 0.060, 0.013, 0.075, isGhost); // right_toe_inner
    addCharVoxel(group, 0.030, 0.020, 0.050, 'pigeonFootRed', 0.100, 0.013, -0.070, isGhost); // right_toe_hallux
    addCharVoxel(group, 0.030, 0.105, 0.030, 'pigeonFootRed', 0.100, 0.072, -0.000, isGhost); // right_leg_shank
    addCharVoxel(group, 0.050, 0.070, 0.070, 'pigeonGrey', 0.100, 0.150, -0.000, isGhost); // right_thigh_fluff
    addCharVoxel(group, 0.320, 0.065, 0.300, 'pigeonGrey', 0.000, 0.182, -0.010, isGhost); // body_belly_base
    addCharVoxel(group, 0.380, 0.205, 0.350, 'pigeonGrey', 0.000, 0.307, -0.005, isGhost); // body_core_loaf
    addCharVoxel(group, 0.300, 0.165, 0.070, 'white', 0.000, 0.308, 0.195, isGhost); // breast_puff_front
    addCharVoxel(group, 0.200, 0.080, 0.080, 'pigeonGrey', 0.000, 0.230, -0.210, isGhost); // undertail_cushion
    addCharVoxel(group, 0.040, 0.150, 0.250, 'pigeonGrey', -0.200, 0.315, 0.015, isGhost); // left_wing_mantle
    addCharVoxel(group, 0.040, 0.105, 0.045, 'darkCharcoal', -0.205, 0.308, -0.002, isGhost); // left_wing_bar_1
    addCharVoxel(group, 0.040, 0.100, 0.045, 'darkCharcoal', -0.205, 0.285, -0.072, isGhost); // left_wing_bar_2
    addCharVoxel(group, 0.095, 0.070, 0.205, 'darkCharcoal', -0.163, 0.255, -0.208, isGhost); // left_wing_primaries
    addCharVoxel(group, 0.040, 0.150, 0.250, 'pigeonGrey', 0.200, 0.315, 0.015, isGhost); // right_wing_mantle
    addCharVoxel(group, 0.040, 0.105, 0.045, 'darkCharcoal', 0.205, 0.308, -0.002, isGhost); // right_wing_bar_1
    addCharVoxel(group, 0.040, 0.100, 0.045, 'darkCharcoal', 0.205, 0.285, -0.072, isGhost); // right_wing_bar_2
    addCharVoxel(group, 0.095, 0.070, 0.205, 'darkCharcoal', 0.163, 0.255, -0.208, isGhost); // right_wing_primaries
    addCharVoxel(group, 0.240, 0.065, 0.140, 'pigeonGrey', 0.000, 0.288, -0.260, isGhost); // tail_base_grey
    addCharVoxel(group, 0.260, 0.055, 0.120, 'darkCharcoal', 0.000, 0.258, -0.380, isGhost); // tail_black_band
    addCharVoxel(group, 0.240, 0.035, 0.050, 'white', 0.000, 0.258, -0.455, isGhost); // tail_white_tip
    addCharVoxel(group, 0.190, 0.065, 0.120, 'pigeonTeal', 0.000, 0.428, 0.135, isGhost); // neck_base_teal
    addCharVoxel(group, 0.180, 0.065, 0.100, 'purpleNeck', 0.000, 0.483, 0.135, isGhost); // neck_collar_purple
    addCharVoxel(group, 0.140, 0.075, 0.035, 'pigeonTeal', 0.000, 0.448, 0.193, isGhost); // neck_sheen_front
    addCharVoxel(group, 0.250, 0.190, 0.210, 'pigeonGrey', 0.000, 0.595, 0.095, isGhost); // head_core
    addCharVoxel(group, 0.190, 0.045, 0.145, 'pigeonGrey', 0.000, 0.703, 0.102, isGhost); // head_crown
    addCharVoxel(group, 0.020, 0.080, 0.080, 'orangeFruit', -0.128, 0.600, 0.125, isGhost); // eye_ring_left
    addCharVoxel(group, 0.025, 0.050, 0.050, 'darkCharcoal', -0.128, 0.600, 0.125, isGhost); // eye_pupil_left
    addCharVoxel(group, 0.023, 0.020, 0.025, 'white', -0.131, 0.610, 0.128, isGhost); // eye_sparkle_left
    addCharVoxel(group, 0.020, 0.080, 0.080, 'orangeFruit', 0.128, 0.600, 0.125, isGhost); // eye_ring_right
    addCharVoxel(group, 0.025, 0.050, 0.050, 'darkCharcoal', 0.128, 0.600, 0.125, isGhost); // eye_pupil_right
    addCharVoxel(group, 0.023, 0.020, 0.025, 'white', 0.131, 0.610, 0.128, isGhost); // eye_sparkle_right
    addCharVoxel(group, 0.080, 0.035, 0.115, 'orangeFruit', 0.000, 0.578, 0.247, isGhost); // beak_upper
    addCharVoxel(group, 0.050, 0.040, 0.050, 'orangeFruit', 0.000, 0.565, 0.310, isGhost); // beak_tip
    addCharVoxel(group, 0.070, 0.035, 0.080, 'orangeFruit', 0.000, 0.533, 0.235, isGhost); // beak_lower
    addCharVoxel(group, 0.090, 0.035, 0.060, 'white', 0.000, 0.608, 0.225, isGhost); // cere_waxy_bump
    addCharVoxel(group, 0.280, 0.050, 0.055, 'pizzaCrust', 0.000, 0.565, 0.298, isGhost); // pizza_crust
    addCharVoxel(group, 0.240, 0.028, 0.160, 'pizzaRed', 0.000, 0.544, 0.380, isGhost); // pizza_sauce_base
    addCharVoxel(group, 0.230, 0.027, 0.060, 'pizzaCheese', 0.000, 0.566, 0.340, isGhost); // pizza_cheese_wide
    addCharVoxel(group, 0.160, 0.028, 0.070, 'pizzaCheese', 0.000, 0.561, 0.395, isGhost); // pizza_cheese_mid
    addCharVoxel(group, 0.080, 0.028, 0.060, 'pizzaCheese', 0.000, 0.556, 0.450, isGhost); // pizza_cheese_tip
    addCharVoxel(group, 0.055, 0.020, 0.050, 'pizzaRed', -0.057, 0.582, 0.340, isGhost); // pepperoni_back_left
    addCharVoxel(group, 0.055, 0.020, 0.050, 'pizzaRed', 0.057, 0.582, 0.340, isGhost); // pepperoni_back_right
    addCharVoxel(group, 0.060, 0.020, 0.050, 'pizzaRed', 0.000, 0.578, 0.400, isGhost); // pepperoni_front
    addCharVoxel(group, 0.035, 0.018, 0.035, 'greenLeaf', -0.043, 0.581, 0.398, isGhost); // basil_leaf
    addCharVoxel(group, 0.030, 0.065, 0.030, 'pizzaCheese', -0.080, 0.522, 0.350, isGhost); // cheese_drip_left
    addCharVoxel(group, 0.030, 0.055, 0.030, 'pizzaCheese', 0.070, 0.528, 0.370, isGhost); // cheese_drip_right
  } else if (skinId === 'box_cat') {
    // 54 voxels: Zero Z-Fighting Certified Solid Ginger Cat in Cardboard Box (0 coplanar overlaps)
    addCharVoxel(group, 0.480, 0.040, 0.480, 'cardboard', 0.000, 0.020, -0.000, isGhost); // box_floor
    addCharVoxel(group, 0.500, 0.255, 0.040, 'cardboard', 0.000, 0.133, 0.230, isGhost); // box_wall_front
    addCharVoxel(group, 0.500, 0.255, 0.040, 'cardboard', 0.000, 0.133, -0.230, isGhost); // box_wall_back
    addCharVoxel(group, 0.035, 0.240, 0.450, 'cardboard', -0.230, 0.133, -0.000, isGhost); // box_wall_left
    addCharVoxel(group, 0.035, 0.240, 0.450, 'cardboard', 0.230, 0.133, -0.000, isGhost); // box_wall_right
    addCharVoxel(group, 0.460, 0.030, 0.085, 'boxFlap', 0.000, 0.253, 0.278, isGhost); // box_flap_front
    addCharVoxel(group, 0.460, 0.030, 0.085, 'boxFlap', 0.000, 0.253, -0.278, isGhost); // box_flap_back
    addCharVoxel(group, 0.085, 0.030, 0.430, 'boxFlap', -0.278, 0.254, -0.000, isGhost); // box_flap_left
    addCharVoxel(group, 0.085, 0.030, 0.430, 'boxFlap', 0.278, 0.254, -0.000, isGhost); // box_flap_right
    addCharVoxel(group, 0.508, 0.025, 0.048, 'boxTape', 0.000, 0.010, 0.230, isGhost); // tape_strip_base
    addCharVoxel(group, 0.170, 0.130, 0.013, 'white', 0.105, 0.125, 0.253, isGhost); // shipping_label_white
    addCharVoxel(group, 0.070, 0.065, 0.010, 'deliveryRed', 0.075, 0.143, 0.258, isGhost); // fragile_stamp_red
    addCharVoxel(group, 0.130, 0.025, 0.010, 'darkCharcoal', 0.105, 0.085, 0.258, isGhost); // barcode_strip_dark
    addCharVoxel(group, 0.360, 0.255, 0.360, 'catOrange', 0.000, 0.163, -0.000, isGhost); // cat_torso_loaf
    addCharVoxel(group, 0.220, 0.095, 0.050, 'white', 0.000, 0.270, 0.180, isGhost); // cat_chest_bib
    addCharVoxel(group, 0.110, 0.065, 0.050, 'white', 0.000, 0.245, 0.190, isGhost); // cat_bib_tuft
    addCharVoxel(group, 0.070, 0.062, 0.080, 'catOrange', -0.125, 0.261, 0.180, isGhost); // paw_left_arm
    addCharVoxel(group, 0.080, 0.047, 0.050, 'white', -0.125, 0.268, 0.217, isGhost); // paw_left_mitten
    addCharVoxel(group, 0.055, 0.025, 0.036, 'nosePink', -0.125, 0.244, 0.226, isGhost); // paw_left_beans
    addCharVoxel(group, 0.070, 0.062, 0.080, 'catOrange', 0.125, 0.261, 0.180, isGhost); // paw_right_arm
    addCharVoxel(group, 0.080, 0.047, 0.050, 'white', 0.125, 0.268, 0.217, isGhost); // paw_right_mitten
    addCharVoxel(group, 0.055, 0.025, 0.036, 'nosePink', 0.125, 0.244, 0.226, isGhost); // paw_right_beans
    addCharVoxel(group, 0.050, 0.065, 0.250, 'catOrange', -0.190, 0.255, -0.000, isGhost); // body_side_fluff_left
    addCharVoxel(group, 0.050, 0.065, 0.250, 'catOrange', 0.190, 0.255, -0.000, isGhost); // body_side_fluff_right
    addCharVoxel(group, 0.320, 0.238, 0.270, 'catOrange', 0.000, 0.400, -0.005, isGhost); // head_core
    addCharVoxel(group, 0.057, 0.128, 0.200, 'catOrange', -0.171, 0.355, 0.010, isGhost); // cheek_fluff_left
    addCharVoxel(group, 0.057, 0.128, 0.200, 'catOrange', 0.171, 0.355, 0.010, isGhost); // cheek_fluff_right
    addCharVoxel(group, 0.180, 0.098, 0.077, 'white', 0.000, 0.350, 0.151, isGhost); // muzzle_snout_white
    addCharVoxel(group, 0.120, 0.050, 0.053, 'white', 0.000, 0.294, 0.142, isGhost); // chin_under_mouth
    addCharVoxel(group, 0.050, 0.033, 0.038, 'nosePink', 0.000, 0.373, 0.180, isGhost); // nose_pink_button
    addCharVoxel(group, 0.050, 0.118, 0.058, 'catStripe', 0.000, 0.470, 0.120, isGhost); // forehead_stripe_mid
    addCharVoxel(group, 0.050, 0.088, 0.048, 'catStripe', -0.083, 0.465, 0.120, isGhost); // forehead_stripe_left
    addCharVoxel(group, 0.050, 0.088, 0.048, 'catStripe', 0.083, 0.465, 0.120, isGhost); // forehead_stripe_right
    addCharVoxel(group, 0.070, 0.077, 0.027, 'catEye', -0.090, 0.408, 0.134, isGhost); // eye_left_iris
    addCharVoxel(group, 0.045, 0.067, 0.027, 'darkCharcoal', -0.088, 0.408, 0.139, isGhost); // eye_left_pupil
    addCharVoxel(group, 0.035, 0.028, 0.028, 'white', -0.102, 0.425, 0.143, isGhost); // eye_left_sparkle
    addCharVoxel(group, 0.070, 0.077, 0.027, 'catEye', 0.090, 0.408, 0.134, isGhost); // eye_right_iris
    addCharVoxel(group, 0.045, 0.067, 0.027, 'darkCharcoal', 0.088, 0.408, 0.139, isGhost); // eye_right_pupil
    addCharVoxel(group, 0.035, 0.028, 0.035, 'white', 0.102, 0.425, 0.140, isGhost); // eye_right_sparkle
    addCharVoxel(group, 0.240, 0.038, 0.200, 'catOrange', 0.000, 0.530, -0.000, isGhost); // head_crown_top
    addCharVoxel(group, 0.045, 0.050, 0.075, 'catStripe', -0.175, 0.364, 0.067, isGhost); // cheek_stripe_left
    addCharVoxel(group, 0.045, 0.050, 0.075, 'catStripe', 0.175, 0.364, 0.067, isGhost); // cheek_stripe_right
    addCharVoxel(group, 0.080, 0.100, 0.110, 'catOrange', -0.110, 0.559, 0.025, isGhost); // ear_base_left
    addCharVoxel(group, 0.050, 0.070, 0.080, 'catOrange', -0.110, 0.634, 0.025, isGhost); // ear_tip_left
    addCharVoxel(group, 0.050, 0.080, 0.030, 'nosePink', -0.105, 0.553, 0.079, isGhost); // ear_pink_left
    addCharVoxel(group, 0.080, 0.100, 0.110, 'catOrange', 0.110, 0.559, 0.025, isGhost); // ear_base_right
    addCharVoxel(group, 0.050, 0.070, 0.080, 'catOrange', 0.110, 0.634, 0.025, isGhost); // ear_tip_right
    addCharVoxel(group, 0.050, 0.080, 0.030, 'nosePink', 0.105, 0.553, 0.079, isGhost); // ear_pink_right
    addCharVoxel(group, 0.060, 0.070, 0.062, 'catOrange', 0.060, 0.215, -0.171, isGhost); // tail_base
    addCharVoxel(group, 0.060, 0.065, 0.068, 'catStripe', 0.068, 0.275, -0.224, isGhost); // tail_over_rim
    addCharVoxel(group, 0.060, 0.070, 0.060, 'catOrange', 0.075, 0.328, -0.250, isGhost); // tail_arch_back
    addCharVoxel(group, 0.060, 0.070, 0.060, 'catStripe', 0.068, 0.383, -0.240, isGhost); // tail_curve_up
    addCharVoxel(group, 0.060, 0.055, 0.060, 'catOrange', 0.057, 0.420, -0.200, isGhost); // tail_hook_front
    addCharVoxel(group, 0.060, 0.060, 0.060, 'white', 0.048, 0.398, -0.160, isGhost); // tail_tip_white
  } else if (skinId === 'raccoon_bandit') {
    // 53 voxels: Zero Z-Fighting Raccoon Bandit with Defined Paws, Centered Tail & Sack Loot
    addCharVoxel(group, 0.055, 0.120, 0.080, 'raccoonGrey', -0.165, 0.253, 0.102, isGhost); // arm_shoulder_left
    addCharVoxel(group, 0.060, 0.130, 0.080, 'raccoonGrey', -0.152, 0.138, 0.152, isGhost); // arm_forearm_left
    addCharVoxel(group, 0.070, 0.083, 0.090, 'maskBlack', -0.142, 0.041, 0.172, isGhost); // paw_glove_left
    addCharVoxel(group, 0.050, 0.040, 0.035, 'maskBlack', -0.142, 0.022, 0.230, isGhost); // paw_fingers_left
    addCharVoxel(group, 0.055, 0.120, 0.080, 'raccoonGrey', 0.165, 0.253, 0.102, isGhost); // arm_shoulder_right
    addCharVoxel(group, 0.060, 0.130, 0.080, 'raccoonGrey', 0.152, 0.138, 0.152, isGhost); // arm_forearm_right
    addCharVoxel(group, 0.070, 0.083, 0.090, 'maskBlack', 0.142, 0.041, 0.172, isGhost); // paw_glove_right
    addCharVoxel(group, 0.050, 0.040, 0.035, 'maskBlack', 0.142, 0.022, 0.230, isGhost); // paw_fingers_right
    addCharVoxel(group, 0.075, 0.150, 0.115, 'raccoonGrey', -0.150, 0.133, -0.115, isGhost); // thigh_rear_left
    addCharVoxel(group, 0.070, 0.072, 0.120, 'maskBlack', -0.142, 0.036, -0.122, isGhost); // paw_rear_left
    addCharVoxel(group, 0.075, 0.150, 0.115, 'raccoonGrey', 0.150, 0.133, -0.115, isGhost); // thigh_rear_right
    addCharVoxel(group, 0.070, 0.072, 0.120, 'maskBlack', 0.142, 0.036, -0.122, isGhost); // paw_rear_right
    addCharVoxel(group, 0.355, 0.255, 0.295, 'raccoonGrey', 0.000, 0.255, -0.000, isGhost); // body_core
    addCharVoxel(group, 0.255, 0.205, 0.070, 'white', 0.000, 0.220, 0.152, isGhost); // body_belly_white
    addCharVoxel(group, 0.185, 0.070, 0.070, 'white', 0.000, 0.333, 0.163, isGhost); // chest_bib_tuft
    addCharVoxel(group, 0.045, 0.175, 0.036, 'darkCharcoal', -0.120, 0.300, 0.149, isGhost); // strap_left
    addCharVoxel(group, 0.045, 0.175, 0.036, 'darkCharcoal', 0.120, 0.300, 0.149, isGhost); // strap_right
    addCharVoxel(group, 0.335, 0.240, 0.275, 'raccoonGrey', 0.000, 0.477, -0.000, isGhost); // head_core
    addCharVoxel(group, 0.060, 0.095, 0.185, 'white', -0.188, 0.470, 0.020, isGhost); // cheek_upper_left
    addCharVoxel(group, 0.080, 0.075, 0.170, 'white', -0.203, 0.400, 0.037, isGhost); // cheek_lower_left
    addCharVoxel(group, 0.060, 0.095, 0.185, 'white', 0.188, 0.470, 0.020, isGhost); // cheek_upper_right
    addCharVoxel(group, 0.080, 0.075, 0.170, 'white', 0.203, 0.400, 0.037, isGhost); // cheek_lower_right
    addCharVoxel(group, 0.175, 0.100, 0.090, 'white', 0.000, 0.422, 0.168, isGhost); // snout_muzzle_white
    addCharVoxel(group, 0.125, 0.055, 0.055, 'white', 0.000, 0.365, 0.160, isGhost); // snout_chin_white
    addCharVoxel(group, 0.055, 0.040, 0.040, 'maskBlack', 0.000, 0.448, 0.203, isGhost); // nose_black_button
    addCharVoxel(group, 0.275, 0.040, 0.215, 'raccoonGrey', 0.000, 0.608, -0.000, isGhost); // head_crown_top
    addCharVoxel(group, 0.080, 0.110, 0.115, 'darkCharcoal', -0.122, 0.637, 0.025, isGhost); // ear_base_left
    addCharVoxel(group, 0.060, 0.080, 0.085, 'white', -0.122, 0.718, 0.025, isGhost); // ear_tip_left
    addCharVoxel(group, 0.050, 0.070, 0.035, 'maskBlack', -0.117, 0.637, 0.080, isGhost); // ear_inner_left
    addCharVoxel(group, 0.080, 0.110, 0.115, 'darkCharcoal', 0.122, 0.637, 0.025, isGhost); // ear_base_right
    addCharVoxel(group, 0.060, 0.080, 0.085, 'white', 0.122, 0.718, 0.025, isGhost); // ear_tip_right
    addCharVoxel(group, 0.050, 0.070, 0.035, 'maskBlack', 0.117, 0.637, 0.080, isGhost); // ear_inner_right
    addCharVoxel(group, 0.018, 0.065, 0.265, 'maskBlack', -0.169, 0.495, -0.000, isGhost); // nvg_strap_left
    addCharVoxel(group, 0.018, 0.065, 0.265, 'maskBlack', 0.169, 0.495, -0.000, isGhost); // nvg_strap_right
    addCharVoxel(group, 0.105, 0.070, 0.070, 'maskBlack', 0.000, 0.497, 0.163, isGhost); // nvg_bridge_mount
    addCharVoxel(group, 0.085, 0.095, 0.075, 'darkCharcoal', -0.105, 0.490, 0.200, isGhost); // nvg_tube_left
    addCharVoxel(group, 0.065, 0.075, 0.020, 'nvgGreen', -0.105, 0.490, 0.242, isGhost); // nvg_lens_green_left
    addCharVoxel(group, 0.085, 0.095, 0.075, 'darkCharcoal', 0.105, 0.490, 0.200, isGhost); // nvg_tube_right
    addCharVoxel(group, 0.065, 0.075, 0.020, 'nvgGreen', 0.105, 0.490, 0.242, isGhost); // nvg_lens_green_right
    addCharVoxel(group, 0.105, 0.075, 0.080, 'raccoonGrey', 0.000, 0.100, -0.163, isGhost); // tail_ring_1
    addCharVoxel(group, 0.125, 0.075, 0.080, 'maskBlack', 0.000, 0.085, -0.233, isGhost); // tail_ring_2
    addCharVoxel(group, 0.135, 0.085, 0.080, 'raccoonGrey', 0.000, 0.085, -0.302, isGhost); // tail_ring_3
    addCharVoxel(group, 0.125, 0.090, 0.070, 'maskBlack', 0.000, 0.107, -0.367, isGhost); // tail_ring_4
    addCharVoxel(group, 0.115, 0.090, 0.060, 'raccoonGrey', 0.000, 0.152, -0.412, isGhost); // tail_ring_5
    addCharVoxel(group, 0.095, 0.085, 0.050, 'maskBlack', 0.000, 0.210, -0.443, isGhost); // tail_tip_black
    addCharVoxel(group, 0.255, 0.205, 0.180, 'burlapBag', 0.000, 0.275, -0.182, isGhost); // loot_sack_belly
    addCharVoxel(group, 0.235, 0.105, 0.160, 'burlapBag', 0.000, 0.420, -0.182, isGhost); // loot_sack_upper
    addCharVoxel(group, 0.185, 0.140, 0.055, 'burlapBag', 0.000, 0.282, -0.290, isGhost); // loot_sack_rear_bulge
    addCharVoxel(group, 0.175, 0.035, 0.130, 'bagRope', 0.000, 0.480, -0.182, isGhost); // loot_sack_cinch
    addCharVoxel(group, 0.205, 0.040, 0.150, 'burlapBag', 0.000, 0.507, -0.182, isGhost); // loot_sack_ruffle
    addCharVoxel(group, 0.070, 0.070, 0.090, 'goldCoin', 0.048, 0.547, -0.172, isGhost); // loot_gold_bar
    addCharVoxel(group, 0.070, 0.070, 0.080, 'goldCoin', -0.048, 0.542, -0.168, isGhost); // loot_gold_coin
    addCharVoxel(group, 0.075, 0.085, 0.090, 'rubyRed', 0.000, 0.560, -0.188, isGhost); // loot_ruby_gem
  } else if (skinId === 'barista_pug' || skinId === 'skater_ferret' || skinId === 'subway_rat') {
    createUrbanCharacterExpA(skinId, isGhost, innerPivot);
  } else if (skinId === 'capybara_zen' || skinId === 'raincoat_duck' || skinId === 'pigeon_king') {
    createUrbanCharacterExpB(skinId, isGhost, innerPivot);
  } else {
    // Fallback to Corgi mascot
    return createUrbanCharacter('corgi', isGhost);
  }

  root.add(innerPivot);
  return root;
}
