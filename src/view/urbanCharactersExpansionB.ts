import * as THREE from 'three';
import { createVoxelMesh, VoxelPalette, type VoxelColorKey } from './voxelPalette.ts';

function addExpBVoxel(
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

export function createUrbanCharacterExpB(
  skinId: string,
  isGhost = false,
  targetGroup?: THREE.Group
): THREE.Group {
  const group = targetGroup ?? new THREE.Group();

  if (skinId === 'capybara_zen') {
    // 53 voxels: Legendary Zen Capybara (Expressive Eyes, Folded Spa Towel, Mala Beads)
    addExpBVoxel(group, 0.075, 0.072, 0.085, 'capybaraPaws', -0.140, 0.036, 0.140, isGhost); // paw_front_left
    addExpBVoxel(group, 0.055, 0.035, 0.040, 'capybaraPaws', -0.140, 0.020, 0.198, isGhost); // paw_digits_front_left
    addExpBVoxel(group, 0.055, 0.100, 0.065, 'capybaraCaramel', -0.140, 0.113, 0.140, isGhost); // leg_front_left
    addExpBVoxel(group, 0.075, 0.072, 0.085, 'capybaraPaws', 0.140, 0.036, 0.140, isGhost); // paw_front_right
    addExpBVoxel(group, 0.055, 0.035, 0.040, 'capybaraPaws', 0.140, 0.020, 0.198, isGhost); // paw_digits_front_right
    addExpBVoxel(group, 0.055, 0.100, 0.065, 'capybaraCaramel', 0.140, 0.113, 0.140, isGhost); // leg_front_right
    addExpBVoxel(group, 0.080, 0.165, 0.140, 'capybaraCaramel', -0.168, 0.135, -0.128, isGhost); // thigh_rear_left
    addExpBVoxel(group, 0.075, 0.068, 0.125, 'capybaraPaws', -0.155, 0.034, -0.115, isGhost); // paw_rear_left
    addExpBVoxel(group, 0.080, 0.165, 0.140, 'capybaraCaramel', 0.168, 0.135, -0.128, isGhost); // thigh_rear_right
    addExpBVoxel(group, 0.075, 0.068, 0.125, 'capybaraPaws', 0.155, 0.034, -0.115, isGhost); // paw_rear_right
    addExpBVoxel(group, 0.345, 0.220, 0.320, 'capybaraCaramel', 0.000, 0.233, -0.018, isGhost); // body_core
    addExpBVoxel(group, 0.275, 0.065, 0.285, 'capybaraMuzzle', 0.000, 0.120, -0.020, isGhost); // body_underbelly
    addExpBVoxel(group, 0.035, 0.170, 0.225, 'capybaraBrown', -0.185, 0.223, -0.025, isGhost); // flank_left
    addExpBVoxel(group, 0.035, 0.170, 0.225, 'capybaraBrown', 0.185, 0.223, -0.025, isGhost); // flank_right
    addExpBVoxel(group, 0.265, 0.035, 0.190, 'capybaraBrown', 0.000, 0.355, -0.048, isGhost); // back_arch_ridge
    addExpBVoxel(group, 0.305, 0.185, 0.050, 'capybaraCaramel', 0.000, 0.235, -0.198, isGhost); // rump_rear
    addExpBVoxel(group, 0.255, 0.045, 0.070, 'capybaraBrown', 0.000, 0.335, -0.168, isGhost); // rump_slope_top
    addExpBVoxel(group, 0.065, 0.045, 0.035, 'capybaraMuzzle', 0.000, 0.190, -0.235, isGhost); // tail_stub
    addExpBVoxel(group, 0.305, 0.180, 0.080, 'capybaraCaramel', 0.000, 0.278, 0.172, isGhost); // neck_base
    addExpBVoxel(group, 0.215, 0.125, 0.070, 'capybaraMuzzle', 0.000, 0.215, 0.193, isGhost); // neck_bib_throat
    addExpBVoxel(group, 0.040, 0.105, 0.050, 'capybaraDark', -0.117, 0.280, 0.207, isGhost); // mala_necklace_left
    addExpBVoxel(group, 0.040, 0.105, 0.050, 'capybaraDark', 0.117, 0.280, 0.207, isGhost); // mala_necklace_right
    addExpBVoxel(group, 0.185, 0.040, 0.035, 'capybaraDark', 0.000, 0.233, 0.220, isGhost); // mala_necklace_bottom
    addExpBVoxel(group, 0.075, 0.050, 0.025, 'goldCoin', 0.000, 0.198, 0.230, isGhost); // mala_gold_medallion
    addExpBVoxel(group, 0.295, 0.220, 0.195, 'capybaraCaramel', 0.000, 0.448, 0.185, isGhost); // head_core
    addExpBVoxel(group, 0.265, 0.035, 0.160, 'capybaraCaramel', 0.000, 0.565, 0.182, isGhost); // head_crown_flat
    addExpBVoxel(group, 0.235, 0.180, 0.085, 'capybaraMuzzle', 0.000, 0.407, 0.320, isGhost); // snout_muzzle
    addExpBVoxel(group, 0.185, 0.070, 0.090, 'capybaraMuzzle', 0.000, 0.318, 0.287, isGhost); // snout_chin_under
    addExpBVoxel(group, 0.105, 0.065, 0.020, 'capybaraDark', 0.000, 0.455, 0.367, isGhost); // nose_pad_dark
    addExpBVoxel(group, 0.030, 0.030, 0.015, 'maskBlack', -0.048, 0.453, 0.375, isGhost); // nostril_slit_left
    addExpBVoxel(group, 0.030, 0.030, 0.015, 'maskBlack', 0.048, 0.453, 0.375, isGhost); // nostril_slit_right
    addExpBVoxel(group, 0.035, 0.045, 0.020, 'capybaraDark', 0.000, 0.410, 0.362, isGhost); // nostril_bridge
    addExpBVoxel(group, 0.040, 0.130, 0.110, 'capybaraBrown', -0.158, 0.422, 0.182, isGhost); // cheek_fluff_left
    addExpBVoxel(group, 0.040, 0.130, 0.110, 'capybaraBrown', 0.158, 0.422, 0.182, isGhost); // cheek_fluff_right
    addExpBVoxel(group, 0.015, 0.060, 0.060, 'maskBlack', -0.150, 0.477, 0.203, isGhost); // eye_left_iris
    addExpBVoxel(group, 0.014, 0.025, 0.025, 'white', -0.152, 0.490, 0.215, isGhost); // eye_left_sparkle
    addExpBVoxel(group, 0.015, 0.060, 0.060, 'maskBlack', 0.150, 0.477, 0.203, isGhost); // eye_right_iris
    addExpBVoxel(group, 0.014, 0.025, 0.025, 'white', 0.152, 0.490, 0.215, isGhost); // eye_right_sparkle
    addExpBVoxel(group, 0.065, 0.050, 0.020, 'capybaraBrown', 0.000, 0.542, 0.278, isGhost); // forehead_zen_tuft
    addExpBVoxel(group, 0.055, 0.075, 0.060, 'capybaraBrown', -0.135, 0.590, 0.107, isGhost); // ear_base_left
    addExpBVoxel(group, 0.030, 0.045, 0.015, 'capybaraMuzzle', -0.133, 0.590, 0.135, isGhost); // ear_inner_left
    addExpBVoxel(group, 0.055, 0.075, 0.060, 'capybaraBrown', 0.135, 0.590, 0.107, isGhost); // ear_base_right
    addExpBVoxel(group, 0.030, 0.045, 0.015, 'capybaraMuzzle', 0.133, 0.590, 0.135, isGhost); // ear_inner_right
    addExpBVoxel(group, 0.205, 0.035, 0.120, 'white', 0.000, 0.595, 0.182, isGhost); // onsen_towel_main
    addExpBVoxel(group, 0.175, 0.025, 0.095, 'white', 0.000, 0.620, 0.180, isGhost); // onsen_towel_fold_top
    addExpBVoxel(group, 0.125, 0.025, 0.080, 'orangeFruit', 0.000, 0.640, 0.182, isGhost); // mandarin_base
    addExpBVoxel(group, 0.155, 0.060, 0.110, 'orangeFruit', 0.000, 0.677, 0.182, isGhost); // mandarin_middle_bulge
    addExpBVoxel(group, 0.105, 0.030, 0.070, 'orangeFruit', 0.000, 0.718, 0.182, isGhost); // mandarin_top_dome
    addExpBVoxel(group, 0.030, 0.030, 0.025, 'goldCoin', -0.048, 0.688, 0.230, isGhost); // mandarin_sun_spot
    addExpBVoxel(group, 0.025, 0.035, 0.020, 'greenLeaf', 0.000, 0.745, 0.182, isGhost); // mandarin_stem
    addExpBVoxel(group, 0.050, 0.020, 0.040, 'greenLeaf', 0.033, 0.748, 0.163, isGhost); // mandarin_leaf
    addExpBVoxel(group, 0.040, 0.020, 0.035, 'greenLeaf', 0.058, 0.738, 0.150, isGhost); // mandarin_leaf_tip
    addExpBVoxel(group, 0.040, 0.020, 0.030, 'greenLeaf', -0.028, 0.748, 0.198, isGhost); // mandarin_leaf_left
  } else if (skinId === 'raincoat_duck') {
    // 48 voxels: Zero Z-Fighting Certified Solid raincoat_duck
    addExpBVoxel(group, 0.075, 0.033, 0.160, 'bootSole', -0.085, 0.016, 0.017, isGhost); // boot_sole_left
    addExpBVoxel(group, 0.075, 0.033, 0.160, 'bootSole', 0.085, 0.016, 0.017, isGhost); // boot_sole_right
    addExpBVoxel(group, 0.065, 0.055, 0.145, 'bootBlue', -0.085, 0.055, 0.020, isGhost); // boot_vamp_left
    addExpBVoxel(group, 0.065, 0.055, 0.145, 'bootBlue', 0.085, 0.055, 0.020, isGhost); // boot_vamp_right
    addExpBVoxel(group, 0.045, 0.065, 0.085, 'bootBlue', -0.085, 0.110, 0.005, isGhost); // boot_shaft_left
    addExpBVoxel(group, 0.045, 0.065, 0.085, 'bootBlue', 0.085, 0.110, 0.005, isGhost); // boot_shaft_right
    addExpBVoxel(group, 0.055, 0.020, 0.095, 'bootRim', -0.085, 0.148, 0.005, isGhost); // boot_rim_left
    addExpBVoxel(group, 0.055, 0.020, 0.095, 'bootRim', 0.085, 0.148, 0.005, isGhost); // boot_rim_right
    addExpBVoxel(group, 0.025, 0.050, 0.055, 'duckOrange', -0.085, 0.173, 0.005, isGhost); // leg_left
    addExpBVoxel(group, 0.025, 0.050, 0.055, 'duckOrange', 0.085, 0.173, 0.005, isGhost); // leg_right
    addExpBVoxel(group, 0.245, 0.040, 0.220, 'raincoatYellow', 0.000, 0.208, -0.013, isGhost); // raincoat_hem
    addExpBVoxel(group, 0.225, 0.140, 0.195, 'raincoatYellow', 0.000, 0.292, -0.010, isGhost); // raincoat_body
    addExpBVoxel(group, 0.035, 0.145, 0.017, 'coatAccent', 0.000, 0.285, 0.094, isGhost); // coat_placket_strip
    addExpBVoxel(group, 0.025, 0.025, 0.015, 'toggleDark', 0.000, 0.245, 0.105, isGhost); // toggle_button_1
    addExpBVoxel(group, 0.025, 0.025, 0.015, 'toggleDark', 0.000, 0.295, 0.105, isGhost); // toggle_button_2
    addExpBVoxel(group, 0.025, 0.025, 0.015, 'toggleDark', 0.000, 0.340, 0.105, isGhost); // toggle_button_3
    addExpBVoxel(group, 0.045, 0.042, 0.040, 'coatAccent', -0.095, 0.252, 0.073, isGhost); // pocket_left
    addExpBVoxel(group, 0.045, 0.042, 0.040, 'coatAccent', 0.095, 0.252, 0.073, isGhost); // pocket_right
    addExpBVoxel(group, 0.185, 0.035, 0.015, 'coatAccent', 0.000, 0.260, -0.110, isGhost); // coat_belt_back
    addExpBVoxel(group, 0.045, 0.025, 0.015, 'toggleDark', 0.000, 0.260, -0.120, isGhost); // coat_belt_buckle
    addExpBVoxel(group, 0.030, 0.095, 0.115, 'raincoatYellow', -0.123, 0.290, -0.000, isGhost); // sleeve_left
    addExpBVoxel(group, 0.030, 0.095, 0.115, 'raincoatYellow', 0.123, 0.290, -0.000, isGhost); // sleeve_right
    addExpBVoxel(group, 0.019, 0.040, 0.085, 'featherWhite', -0.123, 0.228, -0.000, isGhost); // wingtip_left
    addExpBVoxel(group, 0.019, 0.040, 0.085, 'featherWhite', 0.123, 0.228, -0.000, isGhost); // wingtip_right
    addExpBVoxel(group, 0.085, 0.055, 0.052, 'featherWhite', 0.000, 0.265, -0.131, isGhost); // tail_base
    addExpBVoxel(group, 0.055, 0.055, 0.050, 'featherWhite', 0.000, 0.310, -0.168, isGhost); // tail_curl_tip
    addExpBVoxel(group, 0.155, 0.057, 0.120, 'featherWhite', 0.000, 0.381, 0.008, isGhost); // neck_duck
    addExpBVoxel(group, 0.185, 0.035, 0.150, 'raincoatYellow', 0.000, 0.365, 0.007, isGhost); // raincoat_collar
    addExpBVoxel(group, 0.185, 0.140, 0.175, 'featherWhite', 0.000, 0.463, 0.020, isGhost); // head_core
    addExpBVoxel(group, 0.025, 0.070, 0.130, 'featherWhite', -0.095, 0.433, 0.028, isGhost); // cheek_fluff_left
    addExpBVoxel(group, 0.025, 0.070, 0.130, 'featherWhite', 0.095, 0.433, 0.028, isGhost); // cheek_fluff_right
    addExpBVoxel(group, 0.125, 0.044, 0.085, 'duckOrange', 0.000, 0.412, 0.140, isGhost); // bill_base
    addExpBVoxel(group, 0.105, 0.030, 0.048, 'duckOrange', 0.000, 0.413, 0.201, isGhost); // bill_tip
    addExpBVoxel(group, 0.045, 0.012, 0.030, 'billDark', 0.000, 0.437, 0.142, isGhost); // bill_nostrils
    addExpBVoxel(group, 0.035, 0.045, 0.030, 'eyeBlack', -0.065, 0.460, 0.108, isGhost); // eye_left
    addExpBVoxel(group, 0.035, 0.045, 0.030, 'eyeBlack', 0.065, 0.460, 0.108, isGhost); // eye_right
    addExpBVoxel(group, 0.020, 0.020, 0.015, 'sparkleWhite', -0.068, 0.468, 0.120, isGhost); // sparkle_left
    addExpBVoxel(group, 0.020, 0.020, 0.015, 'sparkleWhite', 0.068, 0.468, 0.120, isGhost); // sparkle_right
    addExpBVoxel(group, 0.195, 0.055, 0.175, 'raincoatYellow', 0.000, 0.550, 0.010, isGhost); // hood_crown
    addExpBVoxel(group, 0.205, 0.121, 0.060, 'raincoatYellow', 0.000, 0.474, -0.053, isGhost); // hood_drape_rear
    addExpBVoxel(group, 0.025, 0.067, 0.115, 'raincoatYellow', -0.100, 0.496, 0.030, isGhost); // hood_flap_left
    addExpBVoxel(group, 0.025, 0.067, 0.115, 'raincoatYellow', 0.100, 0.496, 0.030, isGhost); // hood_flap_right
    addExpBVoxel(group, 0.245, 0.030, 0.083, 'raincoatYellow', 0.000, 0.522, 0.126, isGhost); // hood_visor_main
    addExpBVoxel(group, 0.225, 0.030, 0.030, 'coatAccent', 0.000, 0.507, 0.177, isGhost); // hood_visor_lip
    addExpBVoxel(group, 0.020, 0.030, 0.145, 'raincoatYellow', -0.117, 0.513, 0.035, isGhost); // hood_brim_eave_left
    addExpBVoxel(group, 0.020, 0.030, 0.145, 'raincoatYellow', 0.117, 0.513, 0.035, isGhost); // hood_brim_eave_right
    addExpBVoxel(group, 0.020, 0.050, 0.017, 'drawstringWhite', -0.048, 0.363, 0.099, isGhost); // drawstring_left
    addExpBVoxel(group, 0.020, 0.050, 0.017, 'drawstringWhite', 0.048, 0.363, 0.099, isGhost); // drawstring_right
  } else if (skinId === 'pigeon_king') {
    // 65 voxels: Zero Z-Fighting Certified Solid pigeon_king
    addExpBVoxel(group, 0.035, 0.018, 0.070, 'pigeonFootRed', -0.090, 0.011, -0.002, isGhost); // foot_base_left
    addExpBVoxel(group, 0.015, 0.110, 0.020, 'pigeonFootRed', -0.090, 0.072, -0.003, isGhost); // leg_shank_left
    addExpBVoxel(group, 0.015, 0.015, 0.060, 'pigeonFootRed', -0.090, 0.007, 0.057, isGhost); // toe_mid_left
    addExpBVoxel(group, 0.025, 0.014, 0.050, 'pigeonFootRed', -0.115, 0.007, 0.048, isGhost); // toe_outer_left
    addExpBVoxel(group, 0.025, 0.014, 0.050, 'pigeonFootRed', -0.065, 0.007, 0.048, isGhost); // toe_inner_left
    addExpBVoxel(group, 0.035, 0.018, 0.070, 'pigeonFootRed', 0.090, 0.011, -0.002, isGhost); // foot_base_right
    addExpBVoxel(group, 0.015, 0.110, 0.020, 'pigeonFootRed', 0.090, 0.072, -0.003, isGhost); // leg_shank_right
    addExpBVoxel(group, 0.015, 0.015, 0.060, 'pigeonFootRed', 0.090, 0.007, 0.057, isGhost); // toe_mid_right
    addExpBVoxel(group, 0.025, 0.014, 0.050, 'pigeonFootRed', 0.115, 0.007, 0.048, isGhost); // toe_outer_right
    addExpBVoxel(group, 0.025, 0.014, 0.050, 'pigeonFootRed', 0.065, 0.007, 0.048, isGhost); // toe_inner_right
    addExpBVoxel(group, 0.045, 0.055, 0.050, 'featherPureWhite', -0.090, 0.145, -0.003, isGhost); // thigh_fluff_left
    addExpBVoxel(group, 0.045, 0.055, 0.050, 'featherPureWhite', 0.090, 0.145, -0.003, isGhost); // thigh_fluff_right
    addExpBVoxel(group, 0.255, 0.056, 0.210, 'featherPureWhite', 0.000, 0.191, -0.018, isGhost); // body_lower_belly
    addExpBVoxel(group, 0.245, 0.164, 0.205, 'featherPureWhite', 0.000, 0.299, -0.020, isGhost); // body_core_loaf
    addExpBVoxel(group, 0.215, 0.088, 0.052, 'featherPureWhite', 0.000, 0.268, 0.101, isGhost); // breast_puff_lower
    addExpBVoxel(group, 0.205, 0.067, 0.065, 'featherPureWhite', 0.000, 0.341, 0.110, isGhost); // breast_puff_main
    addExpBVoxel(group, 0.165, 0.052, 0.053, 'featherPureWhite', 0.000, 0.398, 0.106, isGhost); // breast_puff_upper
    addExpBVoxel(group, 0.225, 0.056, 0.173, 'featherPureWhite', 0.000, 0.398, -0.001, isGhost); // torso_upper_block
    addExpBVoxel(group, 0.138, 0.077, 0.055, 'featherPureWhite', 0.000, 0.404, 0.065, isGhost); // neck_throat
    addExpBVoxel(group, 0.135, 0.080, 0.085, 'featherPureWhite', 0.000, 0.407, -0.000, isGhost); // neck_core
    addExpBVoxel(group, 0.025, 0.100, 0.125, 'featherPureWhite', -0.130, 0.312, -0.025, isGhost); // wing_left_shoulder
    addExpBVoxel(group, 0.025, 0.060, 0.102, 'featherPureWhite', -0.128, 0.242, -0.058, isGhost); // wing_left_mid
    addExpBVoxel(group, 0.020, 0.043, 0.087, 'featherPureWhite', -0.129, 0.199, -0.096, isGhost); // wing_left_flight
    addExpBVoxel(group, 0.030, 0.017, 0.090, 'crownGold', -0.131, 0.366, -0.017, isGhost); // epaulette_left
    addExpBVoxel(group, 0.025, 0.100, 0.125, 'featherPureWhite', 0.130, 0.312, -0.025, isGhost); // wing_right_shoulder
    addExpBVoxel(group, 0.025, 0.060, 0.102, 'featherPureWhite', 0.128, 0.242, -0.058, isGhost); // wing_right_mid
    addExpBVoxel(group, 0.020, 0.043, 0.087, 'featherPureWhite', 0.129, 0.199, -0.096, isGhost); // wing_right_flight
    addExpBVoxel(group, 0.030, 0.017, 0.090, 'crownGold', 0.131, 0.366, -0.017, isGhost); // epaulette_right
    addExpBVoxel(group, 0.155, 0.133, 0.135, 'featherPureWhite', 0.000, 0.491, 0.020, isGhost); // head_core
    addExpBVoxel(group, 0.020, 0.040, 0.090, 'featherPureWhite', -0.083, 0.448, 0.023, isGhost); // cheek_puff_left
    addExpBVoxel(group, 0.020, 0.040, 0.090, 'featherPureWhite', 0.083, 0.448, 0.023, isGhost); // cheek_puff_right
    addExpBVoxel(group, 0.045, 0.035, 0.085, 'pigeonBeak', 0.000, 0.465, 0.125, isGhost); // beak_upper
    addExpBVoxel(group, 0.030, 0.030, 0.035, 'pigeonBeak', 0.000, 0.453, 0.180, isGhost); // beak_tip
    addExpBVoxel(group, 0.040, 0.020, 0.043, 'featherPureWhite', 0.000, 0.488, 0.106, isGhost); // beak_cere_white
    addExpBVoxel(group, 0.035, 0.019, 0.073, 'pigeonBeak', 0.000, 0.440, 0.121, isGhost); // beak_lower
    addExpBVoxel(group, 0.035, 0.040, 0.039, 'eyePupil', -0.065, 0.492, 0.077, isGhost); // eye_left
    addExpBVoxel(group, 0.035, 0.040, 0.039, 'eyePupil', 0.065, 0.492, 0.077, isGhost); // eye_right
    addExpBVoxel(group, 0.017, 0.015, 0.021, 'sparkleWhite', -0.068, 0.503, 0.088, isGhost); // sparkle_left
    addExpBVoxel(group, 0.017, 0.015, 0.021, 'sparkleWhite', 0.068, 0.503, 0.088, isGhost); // sparkle_right
    addExpBVoxel(group, 0.168, 0.025, 0.128, 'crownGold', 0.000, 0.565, 0.020, isGhost); // crown_circlet
    addExpBVoxel(group, 0.060, 0.070, 0.032, 'crownGold', 0.000, 0.607, 0.073, isGhost); // crown_peak_front
    addExpBVoxel(group, 0.055, 0.055, 0.030, 'crownGold', 0.000, 0.600, -0.032, isGhost); // crown_peak_back
    addExpBVoxel(group, 0.032, 0.050, 0.045, 'crownGold', -0.073, 0.598, 0.010, isGhost); // crown_prong_left
    addExpBVoxel(group, 0.032, 0.050, 0.045, 'crownGold', 0.073, 0.598, 0.010, isGhost); // crown_prong_right
    addExpBVoxel(group, 0.025, 0.030, 0.011, 'royalRuby', 0.000, 0.603, 0.090, isGhost); // crown_ruby_front
    addExpBVoxel(group, 0.020, 0.027, 0.020, 'crownGold', 0.000, 0.654, 0.072, isGhost); // crown_cross_finial
    addExpBVoxel(group, 0.225, 0.070, 0.031, 'mantleRed', 0.000, 0.358, -0.108, isGhost); // mantle_cape_upper
    addExpBVoxel(group, 0.235, 0.085, 0.030, 'mantleRed', 0.000, 0.285, -0.113, isGhost); // mantle_cape_mid
    addExpBVoxel(group, 0.225, 0.055, 0.027, 'mantleRed', 0.000, 0.220, -0.116, isGhost); // mantle_cape_lower
    addExpBVoxel(group, 0.235, 0.040, 0.080, 'ermineFur', 0.000, 0.403, -0.072, isGhost); // ermine_collar_back
    addExpBVoxel(group, 0.030, 0.038, 0.120, 'ermineFur', -0.113, 0.398, 0.003, isGhost); // ermine_collar_shoulder_left
    addExpBVoxel(group, 0.030, 0.038, 0.120, 'ermineFur', 0.113, 0.398, 0.003, isGhost); // ermine_collar_shoulder_right
    addExpBVoxel(group, 0.032, 0.060, 0.035, 'ermineFur', -0.090, 0.353, 0.085, isGhost); // ermine_lapel_front_left
    addExpBVoxel(group, 0.032, 0.060, 0.035, 'ermineFur', 0.090, 0.353, 0.085, isGhost); // ermine_lapel_front_right
    addExpBVoxel(group, 0.020, 0.020, 0.010, 'ermineSpot', -0.088, 0.348, 0.102, isGhost); // ermine_spot_left
    addExpBVoxel(group, 0.020, 0.020, 0.010, 'ermineSpot', 0.088, 0.348, 0.102, isGhost); // ermine_spot_right
    addExpBVoxel(group, 0.245, 0.020, 0.024, 'ermineFur', 0.000, 0.198, -0.131, isGhost); // mantle_fur_hem
    addExpBVoxel(group, 0.105, 0.020, 0.020, 'crownGold', 0.000, 0.378, 0.110, isGhost); // order_gold_chain
    addExpBVoxel(group, 0.065, 0.046, 0.022, 'crownGold', 0.000, 0.346, 0.129, isGhost); // order_gold_frame
    addExpBVoxel(group, 0.035, 0.033, 0.015, 'royalRuby', 0.000, 0.346, 0.140, isGhost); // order_ruby_gem
    addExpBVoxel(group, 0.013, 0.013, 0.008, 'sparkleWhite', -0.004, 0.354, 0.145, isGhost); // order_ruby_sparkle
    addExpBVoxel(group, 0.165, 0.025, 0.060, 'featherPureWhite', 0.000, 0.173, -0.133, isGhost); // tail_fan_base
    addExpBVoxel(group, 0.145, 0.027, 0.055, 'featherPureWhite', 0.000, 0.169, -0.185, isGhost); // tail_fan_main
    addExpBVoxel(group, 0.025, 0.025, 0.065, 'featherPureWhite', -0.080, 0.165, -0.160, isGhost); // tail_fan_stepped_left
    addExpBVoxel(group, 0.025, 0.025, 0.065, 'featherPureWhite', 0.080, 0.165, -0.160, isGhost); // tail_fan_stepped_right
  } else {
    return group;
  }
  return group;
}
