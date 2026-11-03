import * as THREE from 'three';
import { createVoxelMesh, VoxelPalette, type VoxelColorKey } from './voxelPalette.ts';

function addExpAVoxel(
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

export function createUrbanCharacterExpA(
  skinId: string,
  isGhost = false,
  targetGroup?: THREE.Group
): THREE.Group {
  const group = targetGroup ?? new THREE.Group();

  if (skinId === 'barista_pug') {
    // 47 voxels: Zero Z-Fighting Certified Solid barista_pug
    addExpAVoxel(group, 0.065, 0.165, 0.080, 'burlapBag', -0.135, 0.130, 0.133, isGhost); // leg_front_left
    addExpAVoxel(group, 0.075, 0.062, 0.095, 'maskBlack', -0.135, 0.031, 0.135, isGhost); // paw_front_left
    addExpAVoxel(group, 0.065, 0.165, 0.080, 'burlapBag', 0.135, 0.130, 0.133, isGhost); // leg_front_right
    addExpAVoxel(group, 0.075, 0.062, 0.095, 'maskBlack', 0.135, 0.031, 0.135, isGhost); // paw_front_right
    addExpAVoxel(group, 0.075, 0.140, 0.110, 'burlapBag', -0.140, 0.118, -0.107, isGhost); // thigh_rear_left
    addExpAVoxel(group, 0.060, 0.062, 0.110, 'maskBlack', -0.138, 0.031, -0.113, isGhost); // paw_rear_left
    addExpAVoxel(group, 0.075, 0.140, 0.110, 'burlapBag', 0.140, 0.118, -0.107, isGhost); // thigh_rear_right
    addExpAVoxel(group, 0.060, 0.062, 0.110, 'maskBlack', 0.138, 0.031, -0.113, isGhost); // paw_rear_right
    addExpAVoxel(group, 0.315, 0.210, 0.285, 'burlapBag', 0.000, 0.217, -0.015, isGhost); // body_core
    addExpAVoxel(group, 0.255, 0.055, 0.245, 'burlapBag', 0.000, 0.110, -0.015, isGhost); // body_underbelly
    addExpAVoxel(group, 0.265, 0.035, 0.205, 'burlapBag', 0.000, 0.330, -0.020, isGhost); // back_arch_ridge
    addExpAVoxel(group, 0.275, 0.165, 0.045, 'burlapBag', 0.000, 0.215, -0.170, isGhost); // rump_rear
    addExpAVoxel(group, 0.215, 0.135, 0.030, 'greenLeaf', 0.000, 0.245, 0.138, isGhost); // apron_bib
    addExpAVoxel(group, 0.035, 0.040, 0.050, 'greenLeaf', -0.110, 0.312, 0.118, isGhost); // apron_strap_left
    addExpAVoxel(group, 0.035, 0.040, 0.050, 'greenLeaf', 0.110, 0.312, 0.118, isGhost); // apron_strap_right
    addExpAVoxel(group, 0.325, 0.060, 0.250, 'greenLeaf', 0.000, 0.163, 0.013, isGhost); // apron_waist_wrap
    addExpAVoxel(group, 0.135, 0.045, 0.030, 'greenLeaf', 0.000, 0.160, -0.203, isGhost); // apron_tie_bow
    addExpAVoxel(group, 0.045, 0.025, 0.020, 'greenLeaf', 0.000, 0.160, -0.223, isGhost); // apron_tie_knot
    addExpAVoxel(group, 0.045, 0.030, 0.011, 'goldCoin', -0.070, 0.273, 0.153, isGhost); // barista_badge
    addExpAVoxel(group, 0.115, 0.083, 0.075, 'white', 0.000, 0.041, 0.185, isGhost); // cup_base
    addExpAVoxel(group, 0.125, 0.065, 0.085, 'cardboard', 0.000, 0.070, 0.185, isGhost); // cup_heat_sleeve
    addExpAVoxel(group, 0.135, 0.060, 0.093, 'white', 0.000, 0.128, 0.186, isGhost); // cup_upper_rim
    addExpAVoxel(group, 0.115, 0.020, 0.075, 'white', 0.000, 0.163, 0.185, isGhost); // latte_foam
    addExpAVoxel(group, 0.075, 0.010, 0.045, 'capybaraBrown', 0.000, 0.173, 0.185, isGhost); // crema_heart
    addExpAVoxel(group, 0.020, 0.055, 0.020, 'deliveryRed', 0.023, 0.190, 0.177, isGhost); // coffee_straw
    addExpAVoxel(group, 0.305, 0.215, 0.235, 'burlapBag', 0.000, 0.415, 0.060, isGhost); // head_core
    addExpAVoxel(group, 0.245, 0.035, 0.175, 'burlapBag', 0.000, 0.530, 0.055, isGhost); // head_crown_top
    addExpAVoxel(group, 0.275, 0.140, 0.030, 'burlapBag', 0.000, 0.417, 0.188, isGhost); // head_face_plate
    addExpAVoxel(group, 0.040, 0.115, 0.165, 'burlapBag', -0.163, 0.385, 0.065, isGhost); // cheek_fluff_left
    addExpAVoxel(group, 0.040, 0.115, 0.165, 'burlapBag', 0.163, 0.385, 0.065, isGhost); // cheek_fluff_right
    addExpAVoxel(group, 0.175, 0.055, 0.075, 'burlapBag', 0.000, 0.310, 0.145, isGhost); // snout_chin_under
    addExpAVoxel(group, 0.195, 0.095, 0.060, 'darkCharcoal', 0.000, 0.365, 0.217, isGhost); // muzzle_jowls
    addExpAVoxel(group, 0.065, 0.045, 0.030, 'maskBlack', 0.000, 0.415, 0.248, isGhost); // nose_button
    addExpAVoxel(group, 0.045, 0.060, 0.045, 'darkCharcoal', -0.070, 0.338, 0.220, isGhost); // jowl_droop_left
    addExpAVoxel(group, 0.045, 0.060, 0.045, 'darkCharcoal', 0.070, 0.338, 0.220, isGhost); // jowl_droop_right
    addExpAVoxel(group, 0.035, 0.030, 0.027, 'nosePink', 0.000, 0.323, 0.241, isGhost); // tongue_blep
    addExpAVoxel(group, 0.055, 0.065, 0.030, 'maskBlack', -0.105, 0.430, 0.198, isGhost); // eye_left_iris
    addExpAVoxel(group, 0.030, 0.030, 0.025, 'white', -0.113, 0.443, 0.205, isGhost); // eye_left_sparkle
    addExpAVoxel(group, 0.055, 0.065, 0.030, 'maskBlack', 0.105, 0.430, 0.198, isGhost); // eye_right_iris
    addExpAVoxel(group, 0.030, 0.030, 0.025, 'white', 0.113, 0.443, 0.205, isGhost); // eye_right_sparkle
    addExpAVoxel(group, 0.060, 0.075, 0.110, 'darkCharcoal', -0.148, 0.500, 0.043, isGhost); // ear_base_left
    addExpAVoxel(group, 0.060, 0.080, 0.090, 'darkCharcoal', -0.158, 0.443, 0.078, isGhost); // ear_flap_left
    addExpAVoxel(group, 0.060, 0.075, 0.110, 'darkCharcoal', 0.148, 0.500, 0.043, isGhost); // ear_base_right
    addExpAVoxel(group, 0.060, 0.080, 0.090, 'darkCharcoal', 0.158, 0.443, 0.078, isGhost); // ear_flap_right
    addExpAVoxel(group, 0.045, 0.040, 0.030, 'burlapBag', 0.000, 0.268, -0.198, isGhost); // tail_base
    addExpAVoxel(group, 0.045, 0.050, 0.025, 'darkCharcoal', 0.005, 0.302, -0.210, isGhost); // tail_hook_up
    addExpAVoxel(group, 0.035, 0.030, 0.030, 'darkCharcoal', 0.005, 0.333, -0.188, isGhost); // tail_hook_tip
  } else if (skinId === 'skater_ferret') {
    // 56 voxels: Zero Z-Fighting Certified Solid skater_ferret
    addExpAVoxel(group, 0.045, 0.057, 0.060, 'fireRed', -0.115, 0.029, 0.193, isGhost); // wheel_fl
    addExpAVoxel(group, 0.045, 0.057, 0.060, 'fireRed', 0.115, 0.029, 0.193, isGhost); // wheel_fr
    addExpAVoxel(group, 0.045, 0.057, 0.060, 'fireRed', -0.115, 0.029, -0.193, isGhost); // wheel_rl
    addExpAVoxel(group, 0.045, 0.057, 0.060, 'fireRed', 0.115, 0.029, -0.193, isGhost); // wheel_rr
    addExpAVoxel(group, 0.205, 0.025, 0.020, 'truckSilver', 0.000, 0.035, 0.193, isGhost); // truck_axle_front
    addExpAVoxel(group, 0.205, 0.025, 0.020, 'truckSilver', 0.000, 0.035, -0.193, isGhost); // truck_axle_rear
    addExpAVoxel(group, 0.115, 0.040, 0.040, 'truckDark', 0.000, 0.062, 0.193, isGhost); // truck_base_front
    addExpAVoxel(group, 0.115, 0.040, 0.040, 'truckDark', 0.000, 0.062, -0.193, isGhost); // truck_base_rear
    addExpAVoxel(group, 0.245, 0.030, 0.525, 'capRed', 0.000, 0.093, -0.000, isGhost); // deck_core
    addExpAVoxel(group, 0.225, 0.035, 0.053, 'capRed', 0.000, 0.110, 0.281, isGhost); // deck_kick_nose
    addExpAVoxel(group, 0.225, 0.035, 0.053, 'capRed', 0.000, 0.110, -0.281, isGhost); // deck_kick_tail
    addExpAVoxel(group, 0.225, 0.010, 0.505, 'gripTape', 0.000, 0.107, -0.000, isGhost); // grip_tape_main
    addExpAVoxel(group, 0.205, 0.015, 0.052, 'gripTape', 0.000, 0.125, 0.271, isGhost); // grip_tape_nose
    addExpAVoxel(group, 0.205, 0.015, 0.052, 'gripTape', 0.000, 0.125, -0.271, isGhost); // grip_tape_tail
    addExpAVoxel(group, 0.125, 0.015, 0.305, 'goldButton', 0.000, 0.075, -0.000, isGhost); // deck_graphic_stripe
    addExpAVoxel(group, 0.055, 0.057, 0.075, 'ferretDark', -0.080, 0.139, 0.145, isGhost); // paw_front_left
    addExpAVoxel(group, 0.055, 0.057, 0.075, 'ferretDark', 0.080, 0.139, 0.145, isGhost); // paw_front_right
    addExpAVoxel(group, 0.060, 0.062, 0.075, 'ferretDark', -0.077, 0.141, -0.145, isGhost); // paw_rear_left
    addExpAVoxel(group, 0.060, 0.062, 0.075, 'ferretDark', 0.077, 0.141, -0.145, isGhost); // paw_rear_right
    addExpAVoxel(group, 0.040, 0.090, 0.050, 'ferretDark', -0.077, 0.203, 0.138, isGhost); // arm_front_left
    addExpAVoxel(group, 0.040, 0.090, 0.050, 'ferretDark', 0.077, 0.203, 0.138, isGhost); // arm_front_right
    addExpAVoxel(group, 0.060, 0.105, 0.090, 'ferretSable', -0.083, 0.215, -0.143, isGhost); // thigh_rear_left
    addExpAVoxel(group, 0.060, 0.105, 0.090, 'ferretSable', 0.083, 0.215, -0.143, isGhost); // thigh_rear_right
    addExpAVoxel(group, 0.155, 0.060, 0.220, 'ferretCream', 0.000, 0.182, -0.013, isGhost); // body_underbelly
    addExpAVoxel(group, 0.185, 0.095, 0.255, 'ferretSable', 0.000, 0.240, -0.010, isGhost); // body_mid_torso
    addExpAVoxel(group, 0.155, 0.055, 0.210, 'ferretSable', 0.000, 0.305, -0.013, isGhost); // body_back_arch
    addExpAVoxel(group, 0.175, 0.100, 0.075, 'ferretSable', 0.000, 0.258, -0.165, isGhost); // body_rump_rear
    addExpAVoxel(group, 0.175, 0.115, 0.070, 'ferretSable', 0.000, 0.265, 0.138, isGhost); // body_chest_front
    addExpAVoxel(group, 0.125, 0.085, 0.030, 'ferretCream', 0.000, 0.265, 0.173, isGhost); // chest_cream_bib
    addExpAVoxel(group, 0.145, 0.090, 0.080, 'ferretSable', 0.000, 0.333, 0.177, isGhost); // neck_base
    addExpAVoxel(group, 0.115, 0.070, 0.035, 'ferretCream', 0.000, 0.328, 0.215, isGhost); // neck_throat_cream
    addExpAVoxel(group, 0.195, 0.130, 0.115, 'ferretSable', 0.000, 0.398, 0.240, isGhost); // head_core
    addExpAVoxel(group, 0.025, 0.080, 0.075, 'ferretCream', -0.100, 0.378, 0.245, isGhost); // cheek_fluff_left
    addExpAVoxel(group, 0.025, 0.080, 0.075, 'ferretCream', 0.100, 0.378, 0.245, isGhost); // cheek_fluff_right
    addExpAVoxel(group, 0.125, 0.065, 0.060, 'ferretCream', 0.000, 0.370, 0.318, isGhost); // muzzle_upper
    addExpAVoxel(group, 0.095, 0.035, 0.055, 'ferretCream', 0.000, 0.335, 0.305, isGhost); // chin_under
    addExpAVoxel(group, 0.045, 0.030, 0.020, 'nosePink', 0.000, 0.393, 0.353, isGhost); // nose_button
    addExpAVoxel(group, 0.205, 0.050, 0.030, 'ferretDark', 0.000, 0.408, 0.292, isGhost); // eye_mask_band
    addExpAVoxel(group, 0.035, 0.040, 0.025, 'eyeBlack', -0.070, 0.408, 0.305, isGhost); // eye_iris_left
    addExpAVoxel(group, 0.035, 0.040, 0.025, 'eyeBlack', 0.070, 0.408, 0.305, isGhost); // eye_iris_right
    addExpAVoxel(group, 0.020, 0.020, 0.018, 'sparkleWhite', -0.072, 0.413, 0.314, isGhost); // eye_sparkle_left
    addExpAVoxel(group, 0.020, 0.020, 0.018, 'sparkleWhite', 0.072, 0.413, 0.314, isGhost); // eye_sparkle_right
    addExpAVoxel(group, 0.035, 0.050, 0.045, 'ferretSable', -0.105, 0.463, 0.215, isGhost); // ear_outer_left
    addExpAVoxel(group, 0.035, 0.050, 0.045, 'ferretSable', 0.105, 0.463, 0.215, isGhost); // ear_outer_right
    addExpAVoxel(group, 0.033, 0.035, 0.025, 'ferretCream', -0.101, 0.460, 0.220, isGhost); // ear_inner_left
    addExpAVoxel(group, 0.033, 0.035, 0.025, 'ferretCream', 0.101, 0.460, 0.220, isGhost); // ear_inner_right
    addExpAVoxel(group, 0.065, 0.025, 0.027, 'sparkleWhite', 0.000, 0.435, 0.299, isGhost); // forehead_tuft_main
    addExpAVoxel(group, 0.185, 0.060, 0.110, 'capRed', 0.000, 0.488, 0.217, isGhost); // cap_crown
    addExpAVoxel(group, 0.155, 0.025, 0.030, 'capRed', 0.000, 0.465, 0.278, isGhost); // cap_forehead_arch
    addExpAVoxel(group, 0.165, 0.025, 0.075, 'capRed', 0.000, 0.450, 0.130, isGhost); // cap_visor_rear
    addExpAVoxel(group, 0.145, 0.020, 0.040, 'capRed', 0.000, 0.457, 0.077, isGhost); // cap_visor_lip
    addExpAVoxel(group, 0.035, 0.020, 0.030, 'goldButton', 0.000, 0.522, 0.213, isGhost); // cap_top_button
    addExpAVoxel(group, 0.065, 0.060, 0.055, 'ferretSable', 0.000, 0.268, -0.220, isGhost); // tail_root
    addExpAVoxel(group, 0.055, 0.070, 0.065, 'ferretSable', 0.000, 0.312, -0.270, isGhost); // tail_mid_arch
    addExpAVoxel(group, 0.045, 0.075, 0.065, 'ferretDark', 0.000, 0.375, -0.320, isGhost); // tail_high_sweep
    addExpAVoxel(group, 0.035, 0.055, 0.055, 'ferretDark', 0.000, 0.420, -0.295, isGhost); // tail_bushy_tip
  } else if (skinId === 'subway_rat') {
    // 54 voxels: Zero Z-Fighting Certified Solid subway_rat
    addExpAVoxel(group, 0.060, 0.155, 0.120, 'ratGrey', -0.107, 0.105, -0.083, isGhost); // thigh_rear_left
    addExpAVoxel(group, 0.060, 0.155, 0.120, 'ratGrey', 0.107, 0.105, -0.083, isGhost); // thigh_rear_right
    addExpAVoxel(group, 0.045, 0.055, 0.070, 'ratGrey', -0.105, 0.045, -0.072, isGhost); // ankle_rear_left
    addExpAVoxel(group, 0.045, 0.055, 0.070, 'ratGrey', 0.105, 0.045, -0.072, isGhost); // ankle_rear_right
    addExpAVoxel(group, 0.048, 0.033, 0.105, 'ratPink', -0.096, 0.016, -0.020, isGhost); // foot_heel_left
    addExpAVoxel(group, 0.048, 0.033, 0.105, 'ratPink', 0.096, 0.016, -0.020, isGhost); // foot_heel_right
    addExpAVoxel(group, 0.060, 0.023, 0.055, 'ratPink', -0.098, 0.014, 0.055, isGhost); // toes_front_left
    addExpAVoxel(group, 0.060, 0.023, 0.055, 'ratPink', 0.098, 0.014, 0.055, isGhost); // toes_front_right
    addExpAVoxel(group, 0.215, 0.175, 0.205, 'ratGrey', 0.000, 0.125, -0.030, isGhost); // body_lower_core
    addExpAVoxel(group, 0.155, 0.140, 0.030, 'bellyLight', 0.000, 0.128, 0.078, isGhost); // belly_front_plate
    addExpAVoxel(group, 0.200, 0.135, 0.200, 'ratGrey', 0.000, 0.255, -0.013, isGhost); // body_mid_chest
    addExpAVoxel(group, 0.195, 0.080, 0.085, 'ratGrey', 0.000, 0.302, 0.080, isGhost); // shoulders_neck_base
    addExpAVoxel(group, 0.185, 0.060, 0.140, 'ratGrey', 0.000, 0.318, -0.028, isGhost); // body_back_slope
    addExpAVoxel(group, 0.185, 0.140, 0.045, 'ratGrey', 0.000, 0.138, -0.140, isGhost); // body_rump_rear
    addExpAVoxel(group, 0.045, 0.040, 0.060, 'ratPink', 0.000, 0.073, -0.182, isGhost); // tail_root
    addExpAVoxel(group, 0.045, 0.040, 0.070, 'ratPink', -0.005, 0.048, -0.238, isGhost); // tail_mid_1
    addExpAVoxel(group, 0.040, 0.038, 0.065, 'ratPink', 0.008, 0.019, -0.295, isGhost); // tail_mid_2
    addExpAVoxel(group, 0.045, 0.030, 0.055, 'ratPink', 0.040, 0.018, -0.340, isGhost); // tail_curled_tip
    addExpAVoxel(group, 0.040, 0.085, 0.070, 'ratGrey', -0.093, 0.225, 0.078, isGhost); // arm_upper_left
    addExpAVoxel(group, 0.040, 0.085, 0.070, 'ratGrey', 0.093, 0.225, 0.078, isGhost); // arm_upper_right
    addExpAVoxel(group, 0.040, 0.070, 0.060, 'ratGrey', -0.083, 0.158, 0.128, isGhost); // arm_forearm_left
    addExpAVoxel(group, 0.040, 0.070, 0.060, 'ratGrey', 0.083, 0.158, 0.128, isGhost); // arm_forearm_right
    addExpAVoxel(group, 0.060, 0.050, 0.050, 'ratPink', -0.068, 0.138, 0.168, isGhost); // paw_front_left
    addExpAVoxel(group, 0.060, 0.050, 0.050, 'ratPink', 0.068, 0.138, 0.168, isGhost); // paw_front_right
    addExpAVoxel(group, 0.145, 0.050, 0.060, 'bagelCrust', 0.000, 0.093, 0.155, isGhost); // bagel_rim_bottom
    addExpAVoxel(group, 0.145, 0.045, 0.060, 'bagelCrust', 0.000, 0.200, 0.155, isGhost); // bagel_rim_top
    addExpAVoxel(group, 0.045, 0.080, 0.060, 'bagelCrust', -0.068, 0.148, 0.160, isGhost); // bagel_pillar_left
    addExpAVoxel(group, 0.045, 0.080, 0.060, 'bagelCrust', 0.068, 0.148, 0.160, isGhost); // bagel_pillar_right
    addExpAVoxel(group, 0.115, 0.020, 0.050, 'sesameSeed', 0.000, 0.228, 0.158, isGhost); // sesame_top_cluster
    addExpAVoxel(group, 0.030, 0.035, 0.020, 'sesameSeed', -0.068, 0.185, 0.188, isGhost); // sesame_left_speck
    addExpAVoxel(group, 0.030, 0.035, 0.020, 'sesameSeed', 0.068, 0.185, 0.188, isGhost); // sesame_right_speck
    addExpAVoxel(group, 0.190, 0.140, 0.125, 'ratGrey', 0.000, 0.372, 0.080, isGhost); // head_core
    addExpAVoxel(group, 0.125, 0.070, 0.085, 'ratGrey', 0.000, 0.323, 0.175, isGhost); // snout_bridge
    addExpAVoxel(group, 0.085, 0.055, 0.055, 'bellyLight', 0.000, 0.320, 0.235, isGhost); // muzzle_tip
    addExpAVoxel(group, 0.040, 0.030, 0.025, 'nosePink', 0.000, 0.338, 0.270, isGhost); // nose_button
    addExpAVoxel(group, 0.025, 0.025, 0.035, 'buckTooth', 0.000, 0.285, 0.230, isGhost); // bucktooth
    addExpAVoxel(group, 0.095, 0.040, 0.080, 'bellyLight', 0.000, 0.288, 0.152, isGhost); // throat_under
    addExpAVoxel(group, 0.023, 0.070, 0.080, 'ratGrey', -0.094, 0.348, 0.098, isGhost); // cheek_left
    addExpAVoxel(group, 0.023, 0.070, 0.080, 'ratGrey', 0.094, 0.348, 0.098, isGhost); // cheek_right
    addExpAVoxel(group, 0.035, 0.045, 0.035, 'eyeBlack', -0.065, 0.390, 0.155, isGhost); // eye_iris_left
    addExpAVoxel(group, 0.035, 0.045, 0.035, 'eyeBlack', 0.065, 0.390, 0.155, isGhost); // eye_iris_right
    addExpAVoxel(group, 0.020, 0.020, 0.010, 'sparkleWhite', -0.068, 0.398, 0.173, isGhost); // eye_sparkle_left
    addExpAVoxel(group, 0.020, 0.020, 0.010, 'sparkleWhite', 0.068, 0.398, 0.173, isGhost); // eye_sparkle_right
    addExpAVoxel(group, 0.040, 0.080, 0.070, 'ratGrey', -0.102, 0.468, 0.012, isGhost); // ear_outer_left
    addExpAVoxel(group, 0.040, 0.080, 0.070, 'ratGrey', 0.102, 0.468, 0.012, isGhost); // ear_outer_right
    addExpAVoxel(group, 0.033, 0.060, 0.055, 'ratPink', -0.101, 0.468, 0.015, isGhost); // ear_inner_left
    addExpAVoxel(group, 0.033, 0.060, 0.055, 'ratPink', 0.101, 0.468, 0.015, isGhost); // ear_inner_right
    addExpAVoxel(group, 0.165, 0.025, 0.035, 'headbandMetal', 0.000, 0.460, 0.085, isGhost); // headband_top
    addExpAVoxel(group, 0.040, 0.065, 0.025, 'headbandMetal', -0.098, 0.420, 0.085, isGhost); // headband_arm_left
    addExpAVoxel(group, 0.040, 0.065, 0.025, 'headbandMetal', 0.098, 0.420, 0.085, isGhost); // headband_arm_right
    addExpAVoxel(group, 0.035, 0.080, 0.065, 'retroOrange', -0.125, 0.378, 0.085, isGhost); // earpad_orange_left
    addExpAVoxel(group, 0.035, 0.080, 0.065, 'retroOrange', 0.125, 0.378, 0.085, isGhost); // earpad_orange_right
    addExpAVoxel(group, 0.015, 0.050, 0.045, 'cupDark', -0.145, 0.378, 0.085, isGhost); // cup_casing_left
    addExpAVoxel(group, 0.015, 0.050, 0.045, 'cupDark', 0.145, 0.378, 0.085, isGhost); // cup_casing_right
  } else {
    return group;
  }
  return group;
}
