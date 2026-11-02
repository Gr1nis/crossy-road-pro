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

export function createUrbanCharacterExpB(skinId: string, isGhost = false): THREE.Group {
  const group = new THREE.Group();

  if (skinId === 'raincoat_duck') {
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
