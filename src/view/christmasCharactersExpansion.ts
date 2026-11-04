import * as THREE from 'three';
import { createVoxelMesh, VoxelPalette, type VoxelColorKey } from './voxelPalette.ts';

function addXmasExpVoxel(
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
  group.add(createVoxelMesh(w, h, d, mat, x, y, z, !isGhost, !isGhost));
}

export function createChristmasCharacterExp(
  skinId: string,
  isGhost = false,
  targetGroup?: THREE.Group
): THREE.Group {
  const group = targetGroup ?? new THREE.Group();
  if (skinId === 'holiday_elf') {
    // 67 voxels: holiday_elf
    addXmasExpVoxel(group, 0.050, 0.035, 0.120, 'elfGreen', -0.065, 0.018, 0.030, isGhost); addXmasExpVoxel(group, 0.030, 0.035, 0.040, 'elfGreen', -0.065, 0.025, 0.105, isGhost);
    addXmasExpVoxel(group, 0.020, 0.028, 0.025, 'elfGreen', -0.065, 0.046, 0.130, isGhost); addXmasExpVoxel(group, 0.015, 0.020, 0.020, 'elfGold', -0.065, 0.062, 0.147, isGhost);
    addXmasExpVoxel(group, 0.050, 0.035, 0.120, 'elfGreen', 0.065, 0.018, 0.030, isGhost); addXmasExpVoxel(group, 0.030, 0.035, 0.040, 'elfGreen', 0.065, 0.025, 0.105, isGhost);
    addXmasExpVoxel(group, 0.020, 0.028, 0.025, 'elfGreen', 0.065, 0.046, 0.130, isGhost); addXmasExpVoxel(group, 0.015, 0.020, 0.020, 'elfGold', 0.065, 0.062, 0.147, isGhost);
    addXmasExpVoxel(group, 0.035, 0.035, 0.045, 'elfRed', -0.065, 0.045, 0.025, isGhost); addXmasExpVoxel(group, 0.030, 0.035, 0.040, 'elfWhite', -0.065, 0.075, 0.025, isGhost);
    addXmasExpVoxel(group, 0.035, 0.035, 0.045, 'elfRed', -0.065, 0.105, 0.025, isGhost); addXmasExpVoxel(group, 0.030, 0.037, 0.040, 'elfWhite', -0.065, 0.136, 0.025, isGhost);
    addXmasExpVoxel(group, 0.035, 0.035, 0.045, 'elfRed', 0.065, 0.045, 0.025, isGhost); addXmasExpVoxel(group, 0.030, 0.035, 0.040, 'elfWhite', 0.065, 0.075, 0.025, isGhost);
    addXmasExpVoxel(group, 0.035, 0.035, 0.045, 'elfRed', 0.065, 0.105, 0.025, isGhost); addXmasExpVoxel(group, 0.030, 0.037, 0.040, 'elfWhite', 0.065, 0.136, 0.025, isGhost);
    addXmasExpVoxel(group, 0.220, 0.050, 0.130, 'elfGreen', 0.000, 0.168, 0.010, isGhost); addXmasExpVoxel(group, 0.200, 0.015, 0.115, 'elfGreenDark', 0.000, 0.142, 0.010, isGhost);
    addXmasExpVoxel(group, 0.205, 0.100, 0.115, 'elfGreen', 0.000, 0.233, 0.010, isGhost); addXmasExpVoxel(group, 0.175, 0.060, 0.015, 'elfGreen', 0.000, 0.242, 0.070, isGhost);
    addXmasExpVoxel(group, 0.215, 0.025, 0.125, 'elfBelt', 0.000, 0.203, 0.010, isGhost); addXmasExpVoxel(group, 0.060, 0.035, 0.018, 'elfGold', 0.000, 0.203, 0.074, isGhost);
    addXmasExpVoxel(group, 0.025, 0.020, 0.007, 'elfBelt', 0.000, 0.203, 0.081, isGhost); addXmasExpVoxel(group, 0.165, 0.033, 0.022, 'elfRed', 0.000, 0.281, 0.069, isGhost);
    addXmasExpVoxel(group, 0.045, 0.028, 0.018, 'elfRed', 0.000, 0.256, 0.074, isGhost); addXmasExpVoxel(group, 0.035, 0.020, 0.022, 'elfRed', -0.055, 0.260, 0.071, isGhost);
    addXmasExpVoxel(group, 0.035, 0.020, 0.022, 'elfRed', 0.055, 0.260, 0.071, isGhost); addXmasExpVoxel(group, 0.190, 0.033, 0.092, 'elfRed', 0.000, 0.284, -0.011, isGhost);
    addXmasExpVoxel(group, 0.120, 0.045, 0.060, 'elfSkin', 0.000, 0.295, 0.010, isGhost); addXmasExpVoxel(group, 0.210, 0.165, 0.160, 'elfSkin', 0.000, 0.390, 0.010, isGhost);
    addXmasExpVoxel(group, 0.220, 0.140, 0.058, 'elfHair', 0.000, 0.385, -0.051, isGhost); addXmasExpVoxel(group, 0.015, 0.080, 0.065, 'elfHair', -0.105, 0.400, -0.003, isGhost);
    addXmasExpVoxel(group, 0.015, 0.080, 0.065, 'elfHair', 0.105, 0.400, -0.003, isGhost); addXmasExpVoxel(group, 0.170, 0.030, 0.007, 'elfHair', 0.000, 0.448, 0.091, isGhost);
    addXmasExpVoxel(group, 0.040, 0.033, 0.007, 'elfCheek', -0.077, 0.351, 0.091, isGhost); addXmasExpVoxel(group, 0.040, 0.033, 0.007, 'elfCheek', 0.077, 0.351, 0.091, isGhost);
    addXmasExpVoxel(group, 0.030, 0.020, 0.013, 'elfSkin', 0.000, 0.370, 0.094, isGhost); addXmasExpVoxel(group, 0.040, 0.050, 0.010, 'elfEye', -0.068, 0.398, 0.092, isGhost);
    addXmasExpVoxel(group, 0.020, 0.020, 0.007, 'elfWhite', -0.072, 0.410, 0.096, isGhost); addXmasExpVoxel(group, 0.040, 0.050, 0.010, 'elfEye', 0.068, 0.398, 0.092, isGhost);
    addXmasExpVoxel(group, 0.020, 0.020, 0.007, 'elfWhite', 0.072, 0.410, 0.096, isGhost); addXmasExpVoxel(group, 0.035, 0.050, 0.040, 'elfSkin', -0.117, 0.383, -0.000, isGhost);
    addXmasExpVoxel(group, 0.035, 0.043, 0.030, 'elfSkin', -0.147, 0.401, -0.020, isGhost); addXmasExpVoxel(group, 0.035, 0.050, 0.040, 'elfSkin', 0.117, 0.383, -0.000, isGhost);
    addXmasExpVoxel(group, 0.035, 0.043, 0.030, 'elfSkin', 0.147, 0.401, -0.020, isGhost); addXmasExpVoxel(group, 0.230, 0.035, 0.180, 'elfWhite', 0.000, 0.475, 0.010, isGhost);
    addXmasExpVoxel(group, 0.200, 0.060, 0.150, 'elfGreen', 0.000, 0.517, 0.010, isGhost); addXmasExpVoxel(group, 0.160, 0.055, 0.130, 'elfGreen', 0.000, 0.570, -0.005, isGhost);
    addXmasExpVoxel(group, 0.125, 0.050, 0.110, 'elfGreen', -0.010, 0.613, -0.030, isGhost); addXmasExpVoxel(group, 0.090, 0.050, 0.060, 'elfGreen', -0.015, 0.593, -0.092, isGhost);
    addXmasExpVoxel(group, 0.065, 0.060, 0.045, 'elfGreen', -0.015, 0.542, -0.115, isGhost); addXmasExpVoxel(group, 0.045, 0.040, 0.033, 'elfWhite', -0.015, 0.497, -0.119, isGhost);
    addXmasExpVoxel(group, 0.035, 0.040, 0.035, 'elfGold', -0.015, 0.463, -0.125, isGhost); addXmasExpVoxel(group, 0.035, 0.055, 0.070, 'elfGreen', -0.115, 0.245, 0.010, isGhost);
    addXmasExpVoxel(group, 0.030, 0.040, 0.060, 'elfGreen', -0.107, 0.223, 0.062, isGhost); addXmasExpVoxel(group, 0.030, 0.035, 0.020, 'elfWhite', -0.102, 0.217, 0.098, isGhost);
    addXmasExpVoxel(group, 0.030, 0.030, 0.025, 'elfSkin', -0.075, 0.217, 0.110, isGhost); addXmasExpVoxel(group, 0.035, 0.055, 0.070, 'elfGreen', 0.115, 0.245, 0.010, isGhost);
    addXmasExpVoxel(group, 0.030, 0.040, 0.060, 'elfGreen', 0.107, 0.223, 0.062, isGhost); addXmasExpVoxel(group, 0.030, 0.035, 0.020, 'elfWhite', 0.102, 0.217, 0.098, isGhost);
    addXmasExpVoxel(group, 0.030, 0.030, 0.025, 'elfSkin', 0.075, 0.217, 0.110, isGhost); addXmasExpVoxel(group, 0.030, 0.105, 0.020, 'elfGold', 0.000, 0.215, 0.107, isGhost);
    addXmasExpVoxel(group, 0.135, 0.020, 0.015, 'elfGold', 0.000, 0.217, 0.107, isGhost); addXmasExpVoxel(group, 0.055, 0.025, 0.025, 'elfGold', 0.000, 0.275, 0.107, isGhost);
    addXmasExpVoxel(group, 0.058, 0.055, 0.015, 'elfGold', -0.044, 0.310, 0.107, isGhost); addXmasExpVoxel(group, 0.058, 0.055, 0.015, 'elfGold', 0.044, 0.310, 0.107, isGhost);
    addXmasExpVoxel(group, 0.035, 0.025, 0.010, 'elfGold', 0.000, 0.310, 0.107, isGhost);
  } else if (skinId === 'holiday_owl') {
    // 69 voxels: holiday_owl
    addXmasExpVoxel(group, 0.055, 0.030, 0.085, 'amberGold', -0.060, 0.015, 0.015, isGhost); addXmasExpVoxel(group, 0.020, 0.018, 0.035, 'amberGold', -0.083, 0.014, 0.065, isGhost);
    addXmasExpVoxel(group, 0.020, 0.020, 0.052, 'amberGold', -0.058, 0.015, 0.071, isGhost); addXmasExpVoxel(group, 0.018, 0.018, 0.040, 'amberGold', -0.034, 0.014, 0.065, isGhost);
    addXmasExpVoxel(group, 0.055, 0.030, 0.085, 'amberGold', 0.060, 0.015, 0.015, isGhost); addXmasExpVoxel(group, 0.018, 0.018, 0.040, 'amberGold', 0.034, 0.014, 0.065, isGhost);
    addXmasExpVoxel(group, 0.020, 0.020, 0.052, 'amberGold', 0.058, 0.015, 0.071, isGhost); addXmasExpVoxel(group, 0.020, 0.018, 0.035, 'amberGold', 0.083, 0.014, 0.065, isGhost);
    addXmasExpVoxel(group, 0.045, 0.048, 0.065, 'owlWhite', -0.060, 0.049, 0.010, isGhost); addXmasExpVoxel(group, 0.045, 0.048, 0.065, 'owlWhite', 0.060, 0.049, 0.010, isGhost);
    addXmasExpVoxel(group, 0.215, 0.100, 0.140, 'owlWhite', 0.000, 0.113, 0.003, isGhost); addXmasExpVoxel(group, 0.165, 0.077, 0.020, 'owlWhite', 0.000, 0.116, 0.077, isGhost);
    addXmasExpVoxel(group, 0.060, 0.045, 0.007, 'owlSpeckleLight', 0.000, 0.115, 0.086, isGhost); addXmasExpVoxel(group, 0.235, 0.113, 0.160, 'owlWhite', 0.000, 0.206, 0.003, isGhost);
    addXmasExpVoxel(group, 0.185, 0.085, 0.020, 'owlWhite', 0.000, 0.210, 0.087, isGhost); addXmasExpVoxel(group, 0.045, 0.040, 0.007, 'owlSpeckleDark', -0.055, 0.203, 0.096, isGhost);
    addXmasExpVoxel(group, 0.045, 0.040, 0.007, 'owlSpeckleDark', 0.055, 0.203, 0.096, isGhost); addXmasExpVoxel(group, 0.045, 0.030, 0.007, 'owlSpeckleLight', 0.000, 0.228, 0.096, isGhost);
    addXmasExpVoxel(group, 0.135, 0.050, 0.028, 'owlWhite', 0.000, 0.130, -0.071, isGhost); addXmasExpVoxel(group, 0.155, 0.052, 0.030, 'owlSpeckleDark', 0.000, 0.086, -0.080, isGhost);
    addXmasExpVoxel(group, 0.120, 0.043, 0.030, 'owlWhite', 0.000, 0.049, -0.087, isGhost); addXmasExpVoxel(group, 0.075, 0.028, 0.028, 'owlSpeckleDark', 0.000, 0.021, -0.091, isGhost);
    addXmasExpVoxel(group, 0.040, 0.080, 0.125, 'owlWhite', -0.133, 0.217, -0.005, isGhost); addXmasExpVoxel(group, 0.048, 0.075, 0.120, 'owlWhite', -0.134, 0.150, 0.003, isGhost);
    addXmasExpVoxel(group, 0.045, 0.065, 0.105, 'owlSpeckleDark', -0.128, 0.090, -0.020, isGhost); addXmasExpVoxel(group, 0.035, 0.045, 0.085, 'owlWhite', -0.120, 0.045, -0.050, isGhost);
    addXmasExpVoxel(group, 0.040, 0.052, 0.045, 'owlWhite', -0.113, 0.134, 0.070, isGhost); addXmasExpVoxel(group, 0.040, 0.080, 0.125, 'owlWhite', 0.133, 0.217, -0.005, isGhost);
    addXmasExpVoxel(group, 0.048, 0.075, 0.120, 'owlWhite', 0.134, 0.150, 0.003, isGhost); addXmasExpVoxel(group, 0.045, 0.065, 0.105, 'owlSpeckleDark', 0.128, 0.090, -0.020, isGhost);
    addXmasExpVoxel(group, 0.035, 0.045, 0.085, 'owlWhite', 0.120, 0.045, -0.050, isGhost); addXmasExpVoxel(group, 0.040, 0.052, 0.045, 'owlWhite', 0.113, 0.134, 0.070, isGhost);
    addXmasExpVoxel(group, 0.175, 0.045, 0.130, 'owlWhite', 0.000, 0.270, 0.003, isGhost); addXmasExpVoxel(group, 0.225, 0.140, 0.150, 'owlWhite', 0.000, 0.352, 0.003, isGhost);
    addXmasExpVoxel(group, 0.215, 0.120, 0.035, 'owlWhite', 0.000, 0.350, -0.075, isGhost); addXmasExpVoxel(group, 0.235, 0.120, 0.028, 'owlSnowPure', 0.000, 0.347, 0.079, isGhost);
    addXmasExpVoxel(group, 0.255, 0.100, 0.015, 'owlSpeckleLight', 0.000, 0.347, 0.080, isGhost); addXmasExpVoxel(group, 0.205, 0.030, 0.018, 'owlSnowPure', 0.000, 0.407, 0.091, isGhost);
    addXmasExpVoxel(group, 0.040, 0.043, 0.045, 'owlWhite', -0.102, 0.436, 0.015, isGhost); addXmasExpVoxel(group, 0.040, 0.043, 0.045, 'owlWhite', 0.102, 0.436, 0.015, isGhost);
    addXmasExpVoxel(group, 0.065, 0.065, 0.015, 'amberGold', -0.062, 0.350, 0.092, isGhost); addXmasExpVoxel(group, 0.055, 0.055, 0.007, 'brightAmber', -0.062, 0.350, 0.099, isGhost);
    addXmasExpVoxel(group, 0.040, 0.040, 0.010, 'eyePupil', -0.062, 0.350, 0.102, isGhost); addXmasExpVoxel(group, 0.018, 0.015, 0.005, 'owlSnowPure', -0.069, 0.360, 0.107, isGhost);
    addXmasExpVoxel(group, 0.065, 0.065, 0.015, 'amberGold', 0.062, 0.350, 0.092, isGhost); addXmasExpVoxel(group, 0.055, 0.055, 0.007, 'brightAmber', 0.062, 0.350, 0.099, isGhost);
    addXmasExpVoxel(group, 0.040, 0.040, 0.010, 'eyePupil', 0.062, 0.350, 0.102, isGhost); addXmasExpVoxel(group, 0.018, 0.015, 0.005, 'owlSnowPure', 0.056, 0.360, 0.107, isGhost);
    addXmasExpVoxel(group, 0.035, 0.045, 0.028, 'graphiteBeak', 0.000, 0.335, 0.099, isGhost); addXmasExpVoxel(group, 0.025, 0.035, 0.018, 'graphiteBeak', 0.000, 0.305, 0.111, isGhost);
    addXmasExpVoxel(group, 0.210, 0.035, 0.155, 'owlSnowPure', 0.000, 0.430, 0.010, isGhost); addXmasExpVoxel(group, 0.175, 0.055, 0.130, 'santaRed', 0.000, 0.470, 0.007, isGhost);
    addXmasExpVoxel(group, 0.145, 0.050, 0.115, 'santaRed', 0.000, 0.512, -0.005, isGhost); addXmasExpVoxel(group, 0.110, 0.045, 0.100, 'santaRed', -0.007, 0.545, -0.028, isGhost);
    addXmasExpVoxel(group, 0.080, 0.045, 0.050, 'santaRed', -0.013, 0.520, -0.083, isGhost); addXmasExpVoxel(group, 0.060, 0.060, 0.040, 'santaRed', -0.013, 0.477, -0.102, isGhost);
    addXmasExpVoxel(group, 0.040, 0.040, 0.033, 'owlSnowPure', -0.013, 0.438, -0.109, isGhost); addXmasExpVoxel(group, 0.030, 0.045, 0.035, 'owlSnowPure', -0.013, 0.405, -0.115, isGhost);
    addXmasExpVoxel(group, 0.045, 0.028, 0.030, 'coneWoodDark', 0.000, 0.031, 0.098, isGhost); addXmasExpVoxel(group, 0.095, 0.035, 0.045, 'coneWoodWarm', 0.000, 0.058, 0.100, isGhost);
    addXmasExpVoxel(group, 0.105, 0.018, 0.040, 'silverFrost', 0.000, 0.059, 0.107, isGhost); addXmasExpVoxel(group, 0.125, 0.043, 0.055, 'coneWoodDark', 0.000, 0.094, 0.102, isGhost);
    addXmasExpVoxel(group, 0.115, 0.028, 0.055, 'coneWoodWarm', 0.000, 0.094, 0.107, isGhost); addXmasExpVoxel(group, 0.055, 0.020, 0.020, 'owlSnowPure', 0.000, 0.095, 0.133, isGhost);
    addXmasExpVoxel(group, 0.090, 0.035, 0.045, 'coneWoodDark', 0.000, 0.128, 0.100, isGhost); addXmasExpVoxel(group, 0.075, 0.018, 0.043, 'silverFrost', 0.000, 0.131, 0.106, isGhost);
    addXmasExpVoxel(group, 0.033, 0.028, 0.033, 'pineGreen', -0.021, 0.156, 0.101, isGhost); addXmasExpVoxel(group, 0.033, 0.028, 0.030, 'pineGreen', 0.021, 0.156, 0.100, isGhost);
    addXmasExpVoxel(group, 0.025, 0.025, 0.028, 'santaRed', 0.000, 0.170, 0.109, isGhost);
  } else if (skinId === 'gingerbread_man') {
    // 68 voxels: gingerbread_man
    addXmasExpVoxel(group, 0.060, 0.035, 0.120, 'doughWarm', -0.065, 0.018, 0.005, isGhost); addXmasExpVoxel(group, 0.045, 0.028, 0.030, 'doughCrust', -0.065, 0.019, 0.068, isGhost);
    addXmasExpVoxel(group, 0.045, 0.028, 0.028, 'doughCrust', -0.065, 0.019, -0.056, isGhost); addXmasExpVoxel(group, 0.050, 0.113, 0.105, 'doughWarm', -0.065, 0.084, 0.005, isGhost);
    addXmasExpVoxel(group, 0.060, 0.035, 0.120, 'doughWarm', 0.065, 0.018, 0.005, isGhost); addXmasExpVoxel(group, 0.045, 0.028, 0.030, 'doughCrust', 0.065, 0.019, 0.068, isGhost);
    addXmasExpVoxel(group, 0.045, 0.028, 0.028, 'doughCrust', 0.065, 0.019, -0.056, isGhost); addXmasExpVoxel(group, 0.050, 0.113, 0.105, 'doughWarm', 0.065, 0.084, 0.005, isGhost);
    addXmasExpVoxel(group, 0.130, 0.050, 0.100, 'doughWarm', 0.000, 0.145, 0.005, isGhost); addXmasExpVoxel(group, 0.210, 0.115, 0.105, 'doughWarm', 0.000, 0.215, 0.005, isGhost);
    addXmasExpVoxel(group, 0.170, 0.085, 0.015, 'doughCrust', 0.000, 0.215, 0.060, isGhost); addXmasExpVoxel(group, 0.170, 0.085, 0.015, 'doughCrust', 0.000, 0.215, -0.050, isGhost);
    addXmasExpVoxel(group, 0.195, 0.055, 0.100, 'doughWarm', 0.000, 0.290, 0.005, isGhost); addXmasExpVoxel(group, 0.110, 0.035, 0.070, 'doughCrust', 0.000, 0.325, 0.003, isGhost);
    addXmasExpVoxel(group, 0.043, 0.055, 0.080, 'doughWarm', -0.116, 0.275, 0.005, isGhost); addXmasExpVoxel(group, 0.045, 0.055, 0.075, 'doughWarm', -0.150, 0.235, 0.005, isGhost);
    addXmasExpVoxel(group, 0.037, 0.055, 0.083, 'doughWarm', -0.176, 0.195, 0.021, isGhost); addXmasExpVoxel(group, 0.040, 0.048, 0.062, 'doughCrust', -0.190, 0.166, 0.041, isGhost);
    addXmasExpVoxel(group, 0.043, 0.055, 0.080, 'doughWarm', 0.116, 0.275, 0.005, isGhost); addXmasExpVoxel(group, 0.045, 0.055, 0.075, 'doughWarm', 0.150, 0.235, 0.005, isGhost);
    addXmasExpVoxel(group, 0.037, 0.055, 0.083, 'doughWarm', 0.176, 0.195, 0.021, isGhost); addXmasExpVoxel(group, 0.040, 0.048, 0.062, 'doughCrust', 0.190, 0.166, 0.041, isGhost);
    addXmasExpVoxel(group, 0.215, 0.160, 0.100, 'doughWarm', 0.000, 0.412, 0.005, isGhost); addXmasExpVoxel(group, 0.165, 0.030, 0.085, 'doughCrust', 0.000, 0.338, 0.005, isGhost);
    addXmasExpVoxel(group, 0.165, 0.035, 0.085, 'doughCrust', 0.000, 0.500, 0.005, isGhost); addXmasExpVoxel(group, 0.028, 0.100, 0.085, 'doughCrust', -0.111, 0.412, 0.005, isGhost);
    addXmasExpVoxel(group, 0.028, 0.100, 0.085, 'doughCrust', 0.111, 0.412, 0.005, isGhost); addXmasExpVoxel(group, 0.190, 0.120, 0.015, 'doughCrust', 0.000, 0.415, 0.055, isGhost);
    addXmasExpVoxel(group, 0.185, 0.115, 0.015, 'doughCrust', 0.000, 0.415, -0.048, isGhost); addXmasExpVoxel(group, 0.065, 0.020, 0.115, 'icingWhite', -0.065, 0.062, 0.005, isGhost);
    addXmasExpVoxel(group, 0.045, 0.033, 0.018, 'icingWhite', -0.065, 0.061, 0.061, isGhost); addXmasExpVoxel(group, 0.045, 0.033, 0.018, 'icingWhite', -0.065, 0.061, -0.051, isGhost);
    addXmasExpVoxel(group, 0.065, 0.020, 0.115, 'icingWhite', 0.065, 0.062, 0.005, isGhost); addXmasExpVoxel(group, 0.045, 0.033, 0.018, 'icingWhite', 0.065, 0.061, 0.061, isGhost);
    addXmasExpVoxel(group, 0.045, 0.033, 0.018, 'icingWhite', 0.065, 0.061, -0.051, isGhost); addXmasExpVoxel(group, 0.040, 0.020, 0.083, 'icingWhite', -0.182, 0.172, 0.026, isGhost);
    addXmasExpVoxel(group, 0.040, 0.030, 0.020, 'icingWhite', -0.188, 0.172, 0.065, isGhost); addXmasExpVoxel(group, 0.040, 0.020, 0.083, 'icingWhite', 0.182, 0.172, 0.026, isGhost);
    addXmasExpVoxel(group, 0.040, 0.030, 0.020, 'icingWhite', 0.188, 0.172, 0.065, isGhost); addXmasExpVoxel(group, 0.040, 0.040, 0.013, 'icingWhite', -0.058, 0.425, 0.064, isGhost);
    addXmasExpVoxel(group, 0.020, 0.022, 0.013, 'eyePupil', -0.058, 0.424, 0.066, isGhost); addXmasExpVoxel(group, 0.040, 0.040, 0.013, 'icingWhite', 0.058, 0.425, 0.064, isGhost);
    addXmasExpVoxel(group, 0.020, 0.022, 0.013, 'eyePupil', 0.058, 0.424, 0.066, isGhost); addXmasExpVoxel(group, 0.045, 0.015, 0.007, 'icingWhite', -0.058, 0.460, 0.064, isGhost);
    addXmasExpVoxel(group, 0.045, 0.015, 0.007, 'icingWhite', 0.058, 0.460, 0.064, isGhost); addXmasExpVoxel(group, 0.070, 0.013, 0.010, 'icingWhite', 0.000, 0.366, 0.065, isGhost);
    addXmasExpVoxel(group, 0.028, 0.022, 0.010, 'icingWhite', -0.044, 0.376, 0.062, isGhost); addXmasExpVoxel(group, 0.028, 0.022, 0.010, 'icingWhite', 0.044, 0.376, 0.062, isGhost);
    addXmasExpVoxel(group, 0.028, 0.028, 0.007, 'cheekPink', -0.076, 0.384, 0.064, isGhost); addXmasExpVoxel(group, 0.028, 0.028, 0.007, 'cheekPink', 0.076, 0.384, 0.064, isGhost);
    addXmasExpVoxel(group, 0.090, 0.025, 0.060, 'icingWhite', 0.000, 0.520, 0.005, isGhost); addXmasExpVoxel(group, 0.050, 0.025, 0.040, 'icingWhite', 0.003, 0.540, 0.005, isGhost);
    addXmasExpVoxel(group, 0.035, 0.025, 0.028, 'gumdropGreen', 0.000, 0.318, 0.064, isGhost); addXmasExpVoxel(group, 0.055, 0.025, 0.022, 'candyRed', -0.040, 0.315, 0.064, isGhost);
    addXmasExpVoxel(group, 0.055, 0.025, 0.022, 'candyRed', 0.040, 0.315, 0.064, isGhost); addXmasExpVoxel(group, 0.025, 0.018, 0.010, 'icingWhite', -0.040, 0.316, 0.072, isGhost);
    addXmasExpVoxel(group, 0.025, 0.018, 0.010, 'icingWhite', 0.040, 0.316, 0.072, isGhost); addXmasExpVoxel(group, 0.040, 0.025, 0.018, 'gumdropRuby', 0.000, 0.258, 0.071, isGhost);
    addXmasExpVoxel(group, 0.020, 0.013, 0.010, 'icingWhite', 0.000, 0.259, 0.077, isGhost); addXmasExpVoxel(group, 0.040, 0.025, 0.018, 'gumdropGreen', 0.000, 0.220, 0.071, isGhost);
    addXmasExpVoxel(group, 0.020, 0.013, 0.010, 'icingWhite', 0.000, 0.221, 0.077, isGhost); addXmasExpVoxel(group, 0.040, 0.025, 0.018, 'gumdropYellow', 0.000, 0.182, 0.071, isGhost);
    addXmasExpVoxel(group, 0.020, 0.013, 0.010, 'icingWhite', 0.000, 0.184, 0.077, isGhost); addXmasExpVoxel(group, 0.020, 0.043, 0.020, 'candyRed', -0.188, 0.111, 0.070, isGhost);
    addXmasExpVoxel(group, 0.013, 0.058, 0.020, 'icingWhite', -0.186, 0.156, 0.068, isGhost); addXmasExpVoxel(group, 0.020, 0.060, 0.020, 'candyRed', -0.188, 0.210, 0.070, isGhost);
    addXmasExpVoxel(group, 0.045, 0.030, 0.015, 'icingWhite', -0.170, 0.250, 0.070, isGhost); addXmasExpVoxel(group, 0.020, 0.030, 0.020, 'candyRed', -0.142, 0.228, 0.070, isGhost);
  } else if (skinId === 'reindeer_glow') {
    // 66 voxels: reindeer_glow
    addXmasExpVoxel(group, 0.040, 0.025, 0.040, 'hoofDark', -0.095, 0.013, 0.105, isGhost); addXmasExpVoxel(group, 0.030, 0.115, 0.030, 'reindeerCaramel', -0.095, 0.077, 0.105, isGhost);
    addXmasExpVoxel(group, 0.035, 0.025, 0.013, 'reindeerDark', -0.095, 0.083, 0.119, isGhost); addXmasExpVoxel(group, 0.045, 0.080, 0.055, 'reindeerCaramel', -0.098, 0.170, 0.102, isGhost);
    addXmasExpVoxel(group, 0.040, 0.025, 0.040, 'hoofDark', 0.095, 0.013, 0.105, isGhost); addXmasExpVoxel(group, 0.030, 0.115, 0.030, 'reindeerCaramel', 0.095, 0.077, 0.105, isGhost);
    addXmasExpVoxel(group, 0.035, 0.025, 0.013, 'reindeerDark', 0.095, 0.083, 0.119, isGhost); addXmasExpVoxel(group, 0.045, 0.080, 0.055, 'reindeerCaramel', 0.098, 0.170, 0.102, isGhost);
    addXmasExpVoxel(group, 0.040, 0.025, 0.040, 'hoofDark', -0.095, 0.013, -0.105, isGhost); addXmasExpVoxel(group, 0.030, 0.110, 0.030, 'reindeerCaramel', -0.095, 0.075, -0.105, isGhost);
    addXmasExpVoxel(group, 0.035, 0.030, 0.015, 'reindeerDark', -0.095, 0.075, -0.120, isGhost); addXmasExpVoxel(group, 0.048, 0.105, 0.070, 'reindeerCaramel', -0.099, 0.172, -0.100, isGhost);
    addXmasExpVoxel(group, 0.040, 0.025, 0.040, 'hoofDark', 0.095, 0.013, -0.105, isGhost); addXmasExpVoxel(group, 0.030, 0.110, 0.030, 'reindeerCaramel', 0.095, 0.075, -0.105, isGhost);
    addXmasExpVoxel(group, 0.035, 0.030, 0.015, 'reindeerDark', 0.095, 0.075, -0.120, isGhost); addXmasExpVoxel(group, 0.048, 0.105, 0.070, 'reindeerCaramel', 0.099, 0.172, -0.100, isGhost);
    addXmasExpVoxel(group, 0.200, 0.135, 0.220, 'reindeerCaramel', 0.000, 0.207, -0.000, isGhost); addXmasExpVoxel(group, 0.180, 0.040, 0.077, 'reindeerCaramel', 0.000, 0.280, 0.069, isGhost);
    addXmasExpVoxel(group, 0.120, 0.025, 0.117, 'reindeerDark', 0.000, 0.278, -0.031, isGhost); addXmasExpVoxel(group, 0.140, 0.020, 0.180, 'bellyWhite', 0.000, 0.133, -0.000, isGhost);
    addXmasExpVoxel(group, 0.018, 0.085, 0.140, 'reindeerCaramel', -0.106, 0.203, -0.000, isGhost); addXmasExpVoxel(group, 0.018, 0.085, 0.140, 'reindeerCaramel', 0.106, 0.203, -0.000, isGhost);
    addXmasExpVoxel(group, 0.190, 0.120, 0.055, 'reindeerCaramel', 0.000, 0.210, -0.133, isGhost); addXmasExpVoxel(group, 0.150, 0.095, 0.015, 'bellyWhite', 0.000, 0.207, -0.165, isGhost);
    addXmasExpVoxel(group, 0.060, 0.050, 0.040, 'reindeerCaramel', 0.000, 0.255, -0.185, isGhost); addXmasExpVoxel(group, 0.050, 0.040, 0.043, 'bellyWhite', 0.000, 0.240, -0.191, isGhost);
    addXmasExpVoxel(group, 0.170, 0.130, 0.055, 'bibCream', 0.000, 0.220, 0.130, isGhost); addXmasExpVoxel(group, 0.125, 0.075, 0.015, 'bibCream', 0.000, 0.203, 0.160, isGhost);
    addXmasExpVoxel(group, 0.150, 0.135, 0.075, 'reindeerCaramel', 0.000, 0.323, 0.107, isGhost); addXmasExpVoxel(group, 0.110, 0.085, 0.013, 'bibCream', 0.000, 0.323, 0.149, isGhost);
    addXmasExpVoxel(group, 0.165, 0.035, 0.048, 'collarRed', 0.000, 0.305, 0.159, isGhost); addXmasExpVoxel(group, 0.175, 0.037, 0.062, 'collarRed', 0.000, 0.306, 0.106, isGhost);
    addXmasExpVoxel(group, 0.060, 0.050, 0.035, 'bellGold', 0.000, 0.295, 0.198, isGhost); addXmasExpVoxel(group, 0.013, 0.028, 0.030, 'bellGold', -0.089, 0.306, 0.110, isGhost);
    addXmasExpVoxel(group, 0.013, 0.028, 0.030, 'bellGold', 0.089, 0.306, 0.110, isGhost); addXmasExpVoxel(group, 0.170, 0.135, 0.100, 'reindeerCaramel', 0.000, 0.427, 0.140, isGhost);
    addXmasExpVoxel(group, 0.130, 0.037, 0.070, 'reindeerCaramel', 0.000, 0.504, 0.130, isGhost); addXmasExpVoxel(group, 0.110, 0.068, 0.070, 'reindeerCaramel', 0.000, 0.399, 0.220, isGhost);
    addXmasExpVoxel(group, 0.100, 0.033, 0.065, 'bibCream', 0.000, 0.354, 0.212, isGhost); addXmasExpVoxel(group, 0.050, 0.020, 0.022, 'hoofDark', 0.000, 0.352, 0.241, isGhost);
    addXmasExpVoxel(group, 0.060, 0.060, 0.050, 'noseRubyGlow', 0.000, 0.405, 0.270, isGhost); addXmasExpVoxel(group, 0.025, 0.020, 0.007, 'bellyWhite', 0.000, 0.420, 0.296, isGhost);
    addXmasExpVoxel(group, 0.013, 0.048, 0.040, 'hoofDark', -0.086, 0.429, 0.172, isGhost); addXmasExpVoxel(group, 0.007, 0.018, 0.020, 'bellyWhite', -0.091, 0.439, 0.172, isGhost);
    addXmasExpVoxel(group, 0.013, 0.048, 0.040, 'hoofDark', 0.086, 0.429, 0.172, isGhost); addXmasExpVoxel(group, 0.007, 0.018, 0.020, 'bellyWhite', 0.091, 0.439, 0.172, isGhost);
    addXmasExpVoxel(group, 0.060, 0.060, 0.045, 'reindeerCaramel', -0.105, 0.495, 0.107, isGhost); addXmasExpVoxel(group, 0.045, 0.040, 0.025, 'bibCream', -0.105, 0.495, 0.120, isGhost);
    addXmasExpVoxel(group, 0.060, 0.060, 0.045, 'reindeerCaramel', 0.105, 0.495, 0.107, isGhost); addXmasExpVoxel(group, 0.045, 0.040, 0.025, 'bibCream', 0.105, 0.495, 0.120, isGhost);
    addXmasExpVoxel(group, 0.025, 0.045, 0.030, 'antlerBone', -0.048, 0.537, 0.115, isGhost); addXmasExpVoxel(group, 0.020, 0.030, 0.043, 'antlerBone', -0.048, 0.560, 0.149, isGhost);
    addXmasExpVoxel(group, 0.037, 0.095, 0.030, 'antlerBone', -0.074, 0.603, 0.110, isGhost); addXmasExpVoxel(group, 0.035, 0.065, 0.035, 'antlerBone', -0.087, 0.672, 0.080, isGhost);
    addXmasExpVoxel(group, 0.052, 0.050, 0.030, 'antlerBone', -0.114, 0.655, 0.107, isGhost); addXmasExpVoxel(group, 0.025, 0.045, 0.030, 'antlerBone', 0.048, 0.537, 0.115, isGhost);
    addXmasExpVoxel(group, 0.020, 0.030, 0.043, 'antlerBone', 0.048, 0.560, 0.149, isGhost); addXmasExpVoxel(group, 0.037, 0.095, 0.030, 'antlerBone', 0.074, 0.603, 0.110, isGhost);
    addXmasExpVoxel(group, 0.035, 0.065, 0.035, 'antlerBone', 0.087, 0.672, 0.080, isGhost); addXmasExpVoxel(group, 0.052, 0.050, 0.030, 'antlerBone', 0.114, 0.655, 0.107, isGhost);
    addXmasExpVoxel(group, 0.125, 0.015, 0.010, 'lightEmerald', 0.000, 0.575, 0.107, isGhost); addXmasExpVoxel(group, 0.022, 0.028, 0.020, 'lightEmerald', -0.061, 0.586, 0.128, isGhost);
    addXmasExpVoxel(group, 0.025, 0.030, 0.020, 'bellGold', 0.000, 0.557, 0.107, isGhost); addXmasExpVoxel(group, 0.022, 0.028, 0.020, 'lightCyan', 0.061, 0.586, 0.128, isGhost);
    addXmasExpVoxel(group, 0.022, 0.028, 0.020, 'lightRuby', -0.109, 0.624, 0.122, isGhost); addXmasExpVoxel(group, 0.022, 0.028, 0.020, 'bellGold', 0.109, 0.624, 0.122, isGhost);
  } else if (skinId === 'santa_claus') {
    // 78 voxels: santa_claus
    addXmasExpVoxel(group, 0.075, 0.035, 0.150, 'bootBlack', -0.072, 0.018, 0.045, isGhost); addXmasExpVoxel(group, 0.060, 0.028, 0.080, 'bootBlack', -0.072, 0.044, 0.072, isGhost);
    addXmasExpVoxel(group, 0.090, 0.030, 0.110, 'furWhiteSoft', -0.072, 0.068, 0.033, isGhost); addXmasExpVoxel(group, 0.065, 0.048, 0.085, 'santaRedDark', -0.072, 0.101, 0.030, isGhost);
    addXmasExpVoxel(group, 0.075, 0.035, 0.150, 'bootBlack', 0.072, 0.018, 0.045, isGhost); addXmasExpVoxel(group, 0.060, 0.028, 0.080, 'bootBlack', 0.072, 0.044, 0.072, isGhost);
    addXmasExpVoxel(group, 0.090, 0.030, 0.110, 'furWhiteSoft', 0.072, 0.068, 0.033, isGhost); addXmasExpVoxel(group, 0.065, 0.048, 0.085, 'santaRedDark', 0.072, 0.101, 0.030, isGhost);
    addXmasExpVoxel(group, 0.255, 0.035, 0.045, 'furWhite', 0.000, 0.128, 0.070, isGhost); addXmasExpVoxel(group, 0.250, 0.030, 0.113, 'furWhiteSoft', 0.000, 0.128, -0.006, isGhost);
    addXmasExpVoxel(group, 0.245, 0.040, 0.145, 'santaRed', 0.000, 0.160, 0.018, isGhost); addXmasExpVoxel(group, 0.235, 0.085, 0.140, 'santaRed', 0.000, 0.220, 0.018, isGhost);
    addXmasExpVoxel(group, 0.185, 0.068, 0.030, 'santaRed', 0.000, 0.216, 0.092, isGhost); addXmasExpVoxel(group, 0.220, 0.052, 0.125, 'santaRed', 0.000, 0.284, 0.015, isGhost);
    addXmasExpVoxel(group, 0.045, 0.050, 0.030, 'furWhite', 0.000, 0.168, 0.098, isGhost); addXmasExpVoxel(group, 0.045, 0.050, 0.040, 'furWhite', 0.000, 0.260, 0.092, isGhost);
    addXmasExpVoxel(group, 0.250, 0.048, 0.145, 'beltBlack', 0.000, 0.214, 0.018, isGhost); addXmasExpVoxel(group, 0.100, 0.055, 0.033, 'buckleGold', 0.000, 0.212, 0.101, isGhost);
    addXmasExpVoxel(group, 0.060, 0.037, 0.007, 'beltBlack', 0.000, 0.214, 0.116, isGhost); addXmasExpVoxel(group, 0.015, 0.043, 0.007, 'goldAccent', 0.000, 0.214, 0.119, isGhost);
    addXmasExpVoxel(group, 0.210, 0.030, 0.098, 'furWhiteSoft', 0.000, 0.312, -0.006, isGhost); addXmasExpVoxel(group, 0.185, 0.030, 0.055, 'furWhite', 0.000, 0.305, 0.065, isGhost);
    addXmasExpVoxel(group, 0.120, 0.035, 0.075, 'peachSkin', 0.000, 0.325, 0.010, isGhost); addXmasExpVoxel(group, 0.050, 0.080, 0.095, 'santaRed', -0.133, 0.263, 0.015, isGhost);
    addXmasExpVoxel(group, 0.050, 0.052, 0.070, 'santaRed', -0.140, 0.209, 0.058, isGhost); addXmasExpVoxel(group, 0.062, 0.035, 0.065, 'furWhiteSoft', -0.141, 0.175, 0.075, isGhost);
    addXmasExpVoxel(group, 0.045, 0.050, 0.060, 'mittenGreen', -0.140, 0.142, 0.087, isGhost); addXmasExpVoxel(group, 0.025, 0.025, 0.025, 'mittenGreen', -0.110, 0.147, 0.115, isGhost);
    addXmasExpVoxel(group, 0.055, 0.013, 0.060, 'mittenGreen', -0.140, 0.156, 0.083, isGhost); addXmasExpVoxel(group, 0.050, 0.080, 0.095, 'santaRed', 0.133, 0.263, 0.015, isGhost);
    addXmasExpVoxel(group, 0.050, 0.052, 0.070, 'santaRed', 0.140, 0.209, 0.058, isGhost); addXmasExpVoxel(group, 0.062, 0.035, 0.065, 'furWhiteSoft', 0.141, 0.175, 0.075, isGhost);
    addXmasExpVoxel(group, 0.045, 0.050, 0.060, 'mittenGreen', 0.140, 0.142, 0.087, isGhost); addXmasExpVoxel(group, 0.025, 0.025, 0.025, 'mittenGreen', 0.110, 0.147, 0.115, isGhost);
    addXmasExpVoxel(group, 0.055, 0.013, 0.060, 'mittenGreen', 0.140, 0.156, 0.083, isGhost); addXmasExpVoxel(group, 0.175, 0.090, 0.110, 'peachSkin', 0.000, 0.367, 0.013, isGhost);
    addXmasExpVoxel(group, 0.165, 0.037, 0.015, 'peachSkin', 0.000, 0.389, 0.070, isGhost); addXmasExpVoxel(group, 0.035, 0.030, 0.020, 'rosyCheek', -0.075, 0.352, 0.075, isGhost);
    addXmasExpVoxel(group, 0.035, 0.030, 0.020, 'rosyCheek', 0.075, 0.352, 0.075, isGhost); addXmasExpVoxel(group, 0.045, 0.030, 0.033, 'rosyCheek', 0.000, 0.357, 0.094, isGhost);
    addXmasExpVoxel(group, 0.028, 0.022, 0.013, 'beltBlack', -0.041, 0.376, 0.081, isGhost); addXmasExpVoxel(group, 0.028, 0.022, 0.013, 'beltBlack', 0.041, 0.376, 0.081, isGhost);
    addXmasExpVoxel(group, 0.015, 0.010, 0.007, 'furWhite', -0.040, 0.380, 0.086, isGhost); addXmasExpVoxel(group, 0.015, 0.010, 0.007, 'furWhite', 0.040, 0.380, 0.086, isGhost);
    addXmasExpVoxel(group, 0.043, 0.022, 0.020, 'furWhite', -0.044, 0.401, 0.083, isGhost); addXmasExpVoxel(group, 0.043, 0.022, 0.020, 'furWhite', 0.044, 0.401, 0.083, isGhost);
    addXmasExpVoxel(group, 0.040, 0.025, 0.022, 'furWhite', 0.000, 0.340, 0.101, isGhost); addXmasExpVoxel(group, 0.060, 0.025, 0.020, 'furWhite', -0.048, 0.335, 0.098, isGhost);
    addXmasExpVoxel(group, 0.060, 0.025, 0.020, 'furWhite', 0.048, 0.335, 0.098, isGhost); addXmasExpVoxel(group, 0.025, 0.065, 0.070, 'furWhiteSoft', -0.090, 0.345, 0.045, isGhost);
    addXmasExpVoxel(group, 0.025, 0.065, 0.070, 'furWhiteSoft', 0.090, 0.345, 0.045, isGhost); addXmasExpVoxel(group, 0.190, 0.045, 0.065, 'furWhite', 0.000, 0.310, 0.072, isGhost);
    addXmasExpVoxel(group, 0.145, 0.050, 0.035, 'furWhite', 0.000, 0.268, 0.098, isGhost); addXmasExpVoxel(group, 0.085, 0.030, 0.018, 'furWhiteSoft', 0.000, 0.233, 0.101, isGhost);
    addXmasExpVoxel(group, 0.205, 0.035, 0.043, 'furWhite', 0.000, 0.420, 0.066, isGhost); addXmasExpVoxel(group, 0.215, 0.035, 0.095, 'furWhiteSoft', 0.000, 0.417, -0.000, isGhost);
    addXmasExpVoxel(group, 0.205, 0.035, 0.022, 'furWhiteSoft', 0.000, 0.420, -0.051, isGhost); addXmasExpVoxel(group, 0.180, 0.040, 0.107, 'santaRed', 0.000, 0.453, 0.009, isGhost);
    addXmasExpVoxel(group, 0.155, 0.035, 0.083, 'santaRed', 0.000, 0.485, 0.006, isGhost); addXmasExpVoxel(group, 0.125, 0.030, 0.058, 'santaRed', 0.000, 0.512, 0.004, isGhost);
    addXmasExpVoxel(group, 0.060, 0.030, 0.048, 'santaRed', 0.052, 0.507, -0.044, isGhost); addXmasExpVoxel(group, 0.040, 0.055, 0.035, 'santaRed', 0.077, 0.470, -0.065, isGhost);
    addXmasExpVoxel(group, 0.055, 0.043, 0.045, 'furWhite', 0.080, 0.426, -0.080, isGhost); addXmasExpVoxel(group, 0.040, 0.030, 0.055, 'furWhiteSoft', 0.080, 0.425, -0.080, isGhost);
    addXmasExpVoxel(group, 0.225, 0.080, 0.115, 'sackEmerald', 0.000, 0.177, -0.105, isGhost); addXmasExpVoxel(group, 0.245, 0.077, 0.130, 'sackEmerald', 0.000, 0.251, -0.107, isGhost);
    addXmasExpVoxel(group, 0.025, 0.085, 0.090, 'sackDark', -0.130, 0.220, -0.102, isGhost); addXmasExpVoxel(group, 0.025, 0.085, 0.090, 'sackDark', 0.130, 0.220, -0.102, isGhost);
    addXmasExpVoxel(group, 0.205, 0.080, 0.025, 'sackDark', 0.000, 0.228, -0.180, isGhost); addXmasExpVoxel(group, 0.165, 0.030, 0.085, 'sackEmerald', 0.000, 0.302, -0.105, isGhost);
    addXmasExpVoxel(group, 0.175, 0.013, 0.095, 'buckleGold', 0.000, 0.304, -0.105, isGhost); addXmasExpVoxel(group, 0.045, 0.030, 0.020, 'goldAccent', 0.000, 0.307, -0.160, isGhost);
    addXmasExpVoxel(group, 0.195, 0.035, 0.090, 'sackEmerald', 0.000, 0.330, -0.098, isGhost); addXmasExpVoxel(group, 0.025, 0.050, 0.025, 'santaRed', -0.055, 0.367, -0.090, isGhost);
    addXmasExpVoxel(group, 0.020, 0.033, 0.020, 'furWhite', -0.055, 0.406, -0.090, isGhost); addXmasExpVoxel(group, 0.040, 0.030, 0.025, 'santaRed', -0.062, 0.427, -0.090, isGhost);
    addXmasExpVoxel(group, 0.060, 0.060, 0.060, 'giftCyan', 0.048, 0.372, -0.102, isGhost); addXmasExpVoxel(group, 0.030, 0.022, 0.030, 'goldAccent', 0.048, 0.411, -0.102, isGhost);
  }

  return group;
}
