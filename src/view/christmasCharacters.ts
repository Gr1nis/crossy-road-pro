import * as THREE from 'three';
import { createVoxelMesh, VoxelPalette, type VoxelColorKey } from './voxelPalette.ts';
import { createChristmasCharacterExp } from './christmasCharactersExpansion.ts';

function addXmasVoxel(
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

export interface ChristmasCharacterCalibration {
  scale: number;
  offsetY: number;
}

export const CHRISTMAS_CHARACTER_CALIBRATIONS: Record<string, ChristmasCharacterCalibration> = {
  penguin_cocoa: { scale: 1.35, offsetY: 0 },
  snow_hare: { scale: 1.10, offsetY: 0 },
  husky_sweater: { scale: 1.00, offsetY: 0 },
  derpy_snowman: { scale: 1.22, offsetY: 0 },
  arctic_fox: { scale: 1.20, offsetY: 0 },
  holiday_elf: { scale: 1.28, offsetY: 0 },
  holiday_owl: { scale: 1.35, offsetY: 0 },
  gingerbread_man: { scale: 1.35, offsetY: 0 },
  reindeer_glow: { scale: 1.20, offsetY: 0 },
  santa_claus: { scale: 1.35, offsetY: 0 },
};

export function createChristmasCharacter(skinId: string, isGhost = false): THREE.Group {
  const root = new THREE.Group();
  root.name = 'char_root';

  const innerPivot = new THREE.Group();
  innerPivot.name = 'innerPivot';

  const calib = CHRISTMAS_CHARACTER_CALIBRATIONS[skinId] ?? { scale: 1.0, offsetY: 0 };
  innerPivot.scale.set(calib.scale, calib.scale, calib.scale);
  innerPivot.position.set(0, calib.offsetY, 0);

  const group = innerPivot;
  if (skinId === 'penguin_cocoa') {
    // 55 voxels: penguin_cocoa
    addXmasVoxel(group, 0.105, 0.035, 0.220, 'penguinOrange', -0.085, 0.018, 0.048, isGhost); addXmasVoxel(group, 0.105, 0.035, 0.220, 'penguinOrange', 0.085, 0.018, 0.048, isGhost);
    addXmasVoxel(group, 0.075, 0.015, 0.050, 'penguinOrangeLight', -0.085, 0.035, 0.142, isGhost); addXmasVoxel(group, 0.075, 0.015, 0.050, 'penguinOrangeLight', 0.085, 0.035, 0.142, isGhost);
    addXmasVoxel(group, 0.255, 0.285, 0.220, 'penguinBlack', 0.000, 0.168, -0.005, isGhost); addXmasVoxel(group, 0.220, 0.040, 0.190, 'penguinBlack', 0.000, 0.035, -0.000, isGhost);
    addXmasVoxel(group, 0.025, 0.210, 0.175, 'penguinBlack', -0.133, 0.165, -0.003, isGhost); addXmasVoxel(group, 0.025, 0.210, 0.175, 'penguinBlack', 0.133, 0.165, -0.003, isGhost);
    addXmasVoxel(group, 0.205, 0.175, 0.043, 'penguinWhite', 0.000, 0.128, 0.109, isGhost); addXmasVoxel(group, 0.175, 0.113, 0.035, 'penguinWhite', 0.000, 0.261, 0.107, isGhost);
    addXmasVoxel(group, 0.220, 0.210, 0.028, 'penguinBlack', 0.000, 0.185, -0.121, isGhost); addXmasVoxel(group, 0.075, 0.048, 0.050, 'penguinBlack', 0.000, 0.081, -0.150, isGhost);
    addXmasVoxel(group, 0.055, 0.028, 0.025, 'penguinWhite', 0.000, 0.076, -0.177, isGhost); addXmasVoxel(group, 0.045, 0.080, 0.125, 'penguinBlack', -0.140, 0.253, -0.000, isGhost);
    addXmasVoxel(group, 0.048, 0.068, 0.090, 'penguinBlack', -0.134, 0.201, 0.092, isGhost); addXmasVoxel(group, 0.060, 0.050, 0.065, 'penguinBlack', -0.087, 0.195, 0.145, isGhost);
    addXmasVoxel(group, 0.043, 0.033, 0.035, 'penguinWhite', -0.084, 0.191, 0.165, isGhost); addXmasVoxel(group, 0.045, 0.080, 0.125, 'penguinBlack', 0.140, 0.253, -0.000, isGhost);
    addXmasVoxel(group, 0.048, 0.068, 0.090, 'penguinBlack', 0.134, 0.201, 0.092, isGhost); addXmasVoxel(group, 0.060, 0.050, 0.065, 'penguinBlack', 0.087, 0.195, 0.145, isGhost);
    addXmasVoxel(group, 0.043, 0.033, 0.035, 'penguinWhite', 0.084, 0.191, 0.165, isGhost); addXmasVoxel(group, 0.120, 0.102, 0.107, 'mugTeal', 0.000, 0.189, 0.146, isGhost);
    addXmasVoxel(group, 0.130, 0.025, 0.117, 'mugRim', 0.000, 0.247, 0.146, isGhost); addXmasVoxel(group, 0.048, 0.022, 0.030, 'mugTeal', 0.079, 0.221, 0.147, isGhost);
    addXmasVoxel(group, 0.022, 0.062, 0.037, 'mugTeal', 0.096, 0.196, 0.146, isGhost); addXmasVoxel(group, 0.048, 0.022, 0.030, 'mugTeal', 0.079, 0.166, 0.147, isGhost);
    addXmasVoxel(group, 0.110, 0.013, 0.090, 'cocoaBrown', 0.000, 0.249, 0.147, isGhost); addXmasVoxel(group, 0.035, 0.028, 0.033, 'marshmallowWhite', -0.025, 0.266, 0.159, isGhost);
    addXmasVoxel(group, 0.033, 0.025, 0.035, 'marshmallowCream', 0.024, 0.265, 0.152, isGhost); addXmasVoxel(group, 0.033, 0.020, 0.025, 'marshmallowWhite', -0.004, 0.263, 0.120, isGhost);
    addXmasVoxel(group, 0.040, 0.030, 0.030, 'steamWhite', -0.003, 0.297, 0.172, isGhost); addXmasVoxel(group, 0.033, 0.033, 0.033, 'steamWhite', -0.021, 0.326, 0.176, isGhost);
    addXmasVoxel(group, 0.030, 0.033, 0.030, 'steamWhite', -0.003, 0.356, 0.172, isGhost); addXmasVoxel(group, 0.250, 0.060, 0.055, 'scarfRed', 0.000, 0.338, 0.120, isGhost);
    addXmasVoxel(group, 0.250, 0.058, 0.050, 'scarfRed', 0.000, 0.341, -0.113, isGhost); addXmasVoxel(group, 0.043, 0.075, 0.220, 'scarfRed', -0.126, 0.340, 0.003, isGhost);
    addXmasVoxel(group, 0.043, 0.075, 0.220, 'scarfRed', 0.126, 0.340, 0.003, isGhost); addXmasVoxel(group, 0.058, 0.055, 0.055, 'scarfDarkRed', -0.144, 0.315, 0.005, isGhost);
    addXmasVoxel(group, 0.045, 0.098, 0.040, 'scarfRed', -0.155, 0.249, 0.003, isGhost); addXmasVoxel(group, 0.050, 0.018, 0.045, 'scarfWhiteStripe', -0.155, 0.231, 0.003, isGhost);
    addXmasVoxel(group, 0.040, 0.033, 0.035, 'scarfGoldTassel', -0.155, 0.189, 0.003, isGhost); addXmasVoxel(group, 0.245, 0.160, 0.205, 'penguinBlack', 0.000, 0.440, -0.000, isGhost);
    addXmasVoxel(group, 0.190, 0.035, 0.165, 'penguinBlack', 0.000, 0.532, -0.000, isGhost); addXmasVoxel(group, 0.215, 0.135, 0.025, 'penguinBlack', 0.000, 0.440, -0.110, isGhost);
    addXmasVoxel(group, 0.205, 0.130, 0.033, 'penguinWhite', 0.000, 0.430, 0.111, isGhost); addXmasVoxel(group, 0.110, 0.028, 0.025, 'penguinWhite', 0.000, 0.504, 0.110, isGhost);
    addXmasVoxel(group, 0.075, 0.040, 0.050, 'penguinOrange', 0.000, 0.422, 0.142, isGhost); addXmasVoxel(group, 0.055, 0.030, 0.033, 'penguinOrangeLight', 0.000, 0.412, 0.176, isGhost);
    addXmasVoxel(group, 0.035, 0.015, 0.028, 'penguinOrange', 0.000, 0.445, 0.134, isGhost); addXmasVoxel(group, 0.037, 0.048, 0.020, 'eyeBlack', -0.076, 0.456, 0.125, isGhost);
    addXmasVoxel(group, 0.025, 0.018, 0.020, 'white', -0.077, 0.466, 0.130, isGhost); addXmasVoxel(group, 0.037, 0.048, 0.020, 'eyeBlack', 0.076, 0.456, 0.125, isGhost);
    addXmasVoxel(group, 0.025, 0.018, 0.020, 'white', 0.077, 0.466, 0.130, isGhost); addXmasVoxel(group, 0.033, 0.030, 0.018, 'blushPink', -0.084, 0.403, 0.121, isGhost);
    addXmasVoxel(group, 0.033, 0.030, 0.018, 'blushPink', 0.084, 0.403, 0.121, isGhost);
  } else if (skinId === 'snow_hare') {
    // 61 voxels: snow_hare
    addXmasVoxel(group, 0.075, 0.045, 0.170, 'hareWhite', -0.085, 0.022, -0.033, isGhost); addXmasVoxel(group, 0.075, 0.045, 0.170, 'hareWhite', 0.085, 0.022, -0.033, isGhost);
    addXmasVoxel(group, 0.060, 0.030, 0.050, 'hareWhiteSoft', -0.085, 0.022, 0.068, isGhost); addXmasVoxel(group, 0.060, 0.030, 0.050, 'hareWhiteSoft', 0.085, 0.022, 0.068, isGhost);
    addXmasVoxel(group, 0.070, 0.105, 0.100, 'hareWhite', -0.095, 0.087, -0.072, isGhost); addXmasVoxel(group, 0.070, 0.105, 0.100, 'hareWhite', 0.095, 0.087, -0.072, isGhost);
    addXmasVoxel(group, 0.020, 0.065, 0.080, 'hareWhiteSoft', -0.133, 0.090, -0.072, isGhost); addXmasVoxel(group, 0.020, 0.065, 0.080, 'hareWhiteSoft', 0.133, 0.090, -0.072, isGhost);
    addXmasVoxel(group, 0.210, 0.230, 0.190, 'hareWhite', 0.000, 0.175, -0.010, isGhost); addXmasVoxel(group, 0.180, 0.052, 0.163, 'hareWhiteSoft', 0.000, 0.054, -0.009, isGhost);
    addXmasVoxel(group, 0.175, 0.185, 0.033, 'hareWhite', 0.000, 0.182, 0.094, isGhost); addXmasVoxel(group, 0.135, 0.130, 0.013, 'hareCream', 0.000, 0.168, 0.109, isGhost);
    addXmasVoxel(group, 0.190, 0.172, 0.035, 'hareWhite', 0.000, 0.174, -0.115, isGhost); addXmasVoxel(group, 0.022, 0.120, 0.140, 'hareWhiteSoft', -0.109, 0.180, -0.013, isGhost);
    addXmasVoxel(group, 0.022, 0.120, 0.140, 'hareWhiteSoft', 0.109, 0.180, -0.013, isGhost); addXmasVoxel(group, 0.085, 0.080, 0.080, 'hareWhite', 0.000, 0.122, -0.158, isGhost);
    addXmasVoxel(group, 0.065, 0.028, 0.062, 'hareWhiteSoft', 0.000, 0.169, -0.156, isGhost); addXmasVoxel(group, 0.065, 0.030, 0.062, 'hareWhiteSoft', 0.000, 0.077, -0.156, isGhost);
    addXmasVoxel(group, 0.022, 0.050, 0.062, 'hareWhiteSoft', -0.046, 0.122, -0.156, isGhost); addXmasVoxel(group, 0.022, 0.050, 0.062, 'hareWhiteSoft', 0.046, 0.122, -0.156, isGhost);
    addXmasVoxel(group, 0.230, 0.170, 0.190, 'hareWhite', 0.000, 0.355, 0.007, isGhost); addXmasVoxel(group, 0.190, 0.040, 0.155, 'hareWhiteSoft', 0.000, 0.453, 0.005, isGhost);
    addXmasVoxel(group, 0.205, 0.135, 0.033, 'hareWhite', 0.000, 0.355, -0.096, isGhost); addXmasVoxel(group, 0.028, 0.080, 0.110, 'hareWhiteSoft', -0.121, 0.325, 0.035, isGhost);
    addXmasVoxel(group, 0.028, 0.080, 0.110, 'hareWhiteSoft', 0.121, 0.325, 0.035, isGhost); addXmasVoxel(group, 0.130, 0.068, 0.040, 'hareWhite', 0.000, 0.326, 0.115, isGhost);
    addXmasVoxel(group, 0.052, 0.037, 0.015, 'hareWhiteSoft', -0.031, 0.316, 0.138, isGhost); addXmasVoxel(group, 0.052, 0.037, 0.015, 'hareWhiteSoft', 0.031, 0.316, 0.138, isGhost);
    addXmasVoxel(group, 0.040, 0.028, 0.015, 'earPink', 0.000, 0.354, 0.140, isGhost); addXmasVoxel(group, 0.065, 0.035, 0.020, 'hareWhiteSoft', 0.000, 0.440, 0.102, isGhost);
    addXmasVoxel(group, 0.035, 0.050, 0.015, 'eyeBlack', -0.085, 0.372, 0.105, isGhost); addXmasVoxel(group, 0.022, 0.020, 0.010, 'pureWhite', -0.084, 0.383, 0.113, isGhost);
    addXmasVoxel(group, 0.035, 0.050, 0.015, 'eyeBlack', 0.085, 0.372, 0.105, isGhost); addXmasVoxel(group, 0.022, 0.020, 0.010, 'pureWhite', 0.084, 0.383, 0.113, isGhost);
    addXmasVoxel(group, 0.035, 0.028, 0.013, 'blushPink', -0.090, 0.319, 0.104, isGhost); addXmasVoxel(group, 0.035, 0.028, 0.013, 'blushPink', 0.090, 0.319, 0.104, isGhost);
    addXmasVoxel(group, 0.055, 0.090, 0.065, 'hareWhite', -0.070, 0.502, -0.010, isGhost); addXmasVoxel(group, 0.035, 0.060, 0.010, 'earPink', -0.070, 0.497, 0.022, isGhost);
    addXmasVoxel(group, 0.055, 0.098, 0.060, 'hareWhite', -0.080, 0.584, -0.018, isGhost); addXmasVoxel(group, 0.030, 0.105, 0.013, 'earPinkLight', -0.077, 0.573, 0.014, isGhost);
    addXmasVoxel(group, 0.045, 0.077, 0.055, 'hareWhiteSoft', -0.080, 0.659, -0.025, isGhost); addXmasVoxel(group, 0.055, 0.090, 0.065, 'hareWhite', 0.070, 0.502, -0.010, isGhost);
    addXmasVoxel(group, 0.035, 0.060, 0.010, 'earPink', 0.070, 0.497, 0.022, isGhost); addXmasVoxel(group, 0.055, 0.098, 0.060, 'hareWhite', 0.080, 0.584, -0.018, isGhost);
    addXmasVoxel(group, 0.030, 0.105, 0.013, 'earPinkLight', 0.077, 0.573, 0.014, isGhost); addXmasVoxel(group, 0.045, 0.077, 0.055, 'hareWhiteSoft', 0.080, 0.659, -0.025, isGhost);
    addXmasVoxel(group, 0.040, 0.052, 0.065, 'hareWhite', -0.092, 0.164, 0.075, isGhost); addXmasVoxel(group, 0.050, 0.052, 0.075, 'hareWhiteSoft', -0.058, 0.159, 0.130, isGhost);
    addXmasVoxel(group, 0.052, 0.035, 0.028, 'hareCream', -0.034, 0.160, 0.174, isGhost); addXmasVoxel(group, 0.040, 0.052, 0.065, 'hareWhite', 0.092, 0.164, 0.075, isGhost);
    addXmasVoxel(group, 0.050, 0.052, 0.075, 'hareWhiteSoft', 0.058, 0.159, 0.130, isGhost); addXmasVoxel(group, 0.052, 0.035, 0.028, 'hareCream', 0.034, 0.160, 0.174, isGhost);
    addXmasVoxel(group, 0.035, 0.037, 0.025, 'carrotOrangeDark', 0.000, 0.079, 0.135, isGhost); addXmasVoxel(group, 0.055, 0.058, 0.045, 'carrotOrange', 0.000, 0.119, 0.140, isGhost);
    addXmasVoxel(group, 0.075, 0.058, 0.065, 'carrotOrange', 0.000, 0.169, 0.145, isGhost); addXmasVoxel(group, 0.065, 0.022, 0.055, 'carrotOrangeBright', 0.000, 0.204, 0.145, isGhost);
    addXmasVoxel(group, 0.025, 0.028, 0.028, 'leafGreenDark', 0.000, 0.224, 0.141, isGhost); addXmasVoxel(group, 0.035, 0.033, 0.037, 'leafGreen', -0.025, 0.239, 0.149, isGhost);
    addXmasVoxel(group, 0.035, 0.033, 0.037, 'leafGreen', 0.025, 0.239, 0.149, isGhost); addXmasVoxel(group, 0.035, 0.030, 0.040, 'leafGreenBright', 0.000, 0.242, 0.163, isGhost);
    addXmasVoxel(group, 0.030, 0.028, 0.028, 'leafGreen', 0.000, 0.231, 0.179, isGhost);
  } else if (skinId === 'husky_sweater') {
    // 57 voxels: husky_sweater
    addXmasVoxel(group, 0.090, 0.030, 0.090, 'huskyWhite', -0.140, 0.015, 0.150, isGhost); addXmasVoxel(group, 0.060, 0.022, 0.030, 'huskyWhite', -0.140, 0.016, 0.205, isGhost);
    addXmasVoxel(group, 0.100, 0.080, 0.100, 'huskyWhite', -0.140, 0.062, 0.150, isGhost); addXmasVoxel(group, 0.110, 0.052, 0.110, 'sweaterRed', -0.140, 0.124, 0.150, isGhost);
    addXmasVoxel(group, 0.090, 0.030, 0.090, 'huskyWhite', 0.140, 0.015, 0.150, isGhost); addXmasVoxel(group, 0.060, 0.022, 0.030, 'huskyWhite', 0.140, 0.016, 0.205, isGhost);
    addXmasVoxel(group, 0.100, 0.080, 0.100, 'huskyWhite', 0.140, 0.062, 0.150, isGhost); addXmasVoxel(group, 0.110, 0.052, 0.110, 'sweaterRed', 0.140, 0.124, 0.150, isGhost);
    addXmasVoxel(group, 0.090, 0.030, 0.090, 'huskyWhite', -0.140, 0.015, -0.150, isGhost); addXmasVoxel(group, 0.100, 0.120, 0.100, 'huskyWhite', -0.140, 0.083, -0.150, isGhost);
    addXmasVoxel(group, 0.113, 0.098, 0.120, 'huskyDark', -0.141, 0.186, -0.150, isGhost); addXmasVoxel(group, 0.090, 0.030, 0.090, 'huskyWhite', 0.140, 0.015, -0.150, isGhost);
    addXmasVoxel(group, 0.100, 0.120, 0.100, 'huskyWhite', 0.140, 0.083, -0.150, isGhost); addXmasVoxel(group, 0.113, 0.098, 0.120, 'huskyDark', 0.141, 0.186, -0.150, isGhost);
    addXmasVoxel(group, 0.350, 0.225, 0.350, 'sweaterRed', 0.000, 0.237, 0.010, isGhost); addXmasVoxel(group, 0.260, 0.020, 0.315, 'sweaterRed', 0.000, 0.120, 0.007, isGhost);
    addXmasVoxel(group, 0.360, 0.037, 0.033, 'sweaterWhite', 0.000, 0.136, -0.151, isGhost); addXmasVoxel(group, 0.320, 0.180, 0.040, 'sweaterRed', 0.000, 0.245, 0.200, isGhost);
    addXmasVoxel(group, 0.170, 0.090, 0.015, 'sweaterWhite', 0.000, 0.250, 0.223, isGhost); addXmasVoxel(group, 0.290, 0.013, 0.070, 'sweaterWhite', 0.000, 0.354, 0.010, isGhost);
    addXmasVoxel(group, 0.010, 0.060, 0.070, 'sweaterWhite', -0.177, 0.260, 0.010, isGhost); addXmasVoxel(group, 0.010, 0.060, 0.070, 'sweaterWhite', 0.177, 0.260, 0.010, isGhost);
    addXmasVoxel(group, 0.330, 0.200, 0.070, 'huskyDark', 0.000, 0.235, -0.198, isGhost); addXmasVoxel(group, 0.270, 0.130, 0.028, 'huskyWhite', 0.000, 0.225, -0.241, isGhost);
    addXmasVoxel(group, 0.150, 0.037, 0.028, 'huskyWhite', 0.000, 0.151, 0.196, isGhost); addXmasVoxel(group, 0.365, 0.045, 0.245, 'sweaterRed', 0.000, 0.345, 0.133, isGhost);
    addXmasVoxel(group, 0.355, 0.015, 0.235, 'sweaterWhite', 0.000, 0.372, 0.133, isGhost); addXmasVoxel(group, 0.270, 0.060, 0.052, 'huskyDark', 0.000, 0.393, 0.044, isGhost);
    addXmasVoxel(group, 0.340, 0.230, 0.270, 'huskyDark', 0.000, 0.470, 0.155, isGhost); addXmasVoxel(group, 0.250, 0.030, 0.150, 'huskyDark', 0.000, 0.595, 0.155, isGhost);
    addXmasVoxel(group, 0.035, 0.092, 0.150, 'huskyWhite', -0.182, 0.421, 0.165, isGhost); addXmasVoxel(group, 0.035, 0.092, 0.150, 'huskyWhite', 0.182, 0.421, 0.165, isGhost);
    addXmasVoxel(group, 0.290, 0.065, 0.015, 'huskyWhite', 0.000, 0.438, 0.292, isGhost); addXmasVoxel(group, 0.080, 0.138, 0.110, 'huskyWhite', 0.000, 0.536, 0.250, isGhost);
    addXmasVoxel(group, 0.180, 0.098, 0.092, 'huskyWhite', 0.000, 0.414, 0.329, isGhost); addXmasVoxel(group, 0.130, 0.030, 0.055, 'huskyWhite', 0.000, 0.352, 0.307, isGhost);
    addXmasVoxel(group, 0.070, 0.052, 0.035, 'noseBlack', 0.000, 0.446, 0.388, isGhost); addXmasVoxel(group, 0.028, 0.025, 0.048, 'tonguePink', 0.024, 0.370, 0.366, isGhost);
    addXmasVoxel(group, 0.060, 0.052, 0.018, 'huskyBlue', -0.095, 0.501, 0.294, isGhost); addXmasVoxel(group, 0.035, 0.035, 0.010, 'noseBlack', -0.092, 0.505, 0.302, isGhost);
    addXmasVoxel(group, 0.020, 0.013, 0.007, 'sweaterWhite', -0.095, 0.514, 0.309, isGhost); addXmasVoxel(group, 0.050, 0.022, 0.020, 'huskyWhite', -0.095, 0.551, 0.290, isGhost);
    addXmasVoxel(group, 0.060, 0.052, 0.018, 'huskyBlue', 0.095, 0.501, 0.294, isGhost); addXmasVoxel(group, 0.035, 0.035, 0.010, 'noseBlack', 0.092, 0.505, 0.302, isGhost);
    addXmasVoxel(group, 0.020, 0.013, 0.007, 'sweaterWhite', 0.095, 0.514, 0.309, isGhost); addXmasVoxel(group, 0.050, 0.022, 0.020, 'huskyWhite', 0.095, 0.551, 0.290, isGhost);
    addXmasVoxel(group, 0.085, 0.120, 0.080, 'huskyDark', -0.122, 0.630, 0.150, isGhost); addXmasVoxel(group, 0.065, 0.090, 0.060, 'huskyDark', -0.122, 0.725, 0.150, isGhost);
    addXmasVoxel(group, 0.045, 0.105, 0.025, 'huskyWhite', -0.122, 0.642, 0.188, isGhost); addXmasVoxel(group, 0.085, 0.120, 0.080, 'huskyDark', 0.122, 0.630, 0.150, isGhost);
    addXmasVoxel(group, 0.065, 0.090, 0.060, 'huskyDark', 0.122, 0.725, 0.150, isGhost); addXmasVoxel(group, 0.045, 0.105, 0.025, 'huskyWhite', 0.122, 0.642, 0.188, isGhost);
    addXmasVoxel(group, 0.090, 0.070, 0.060, 'huskyDark', 0.000, 0.310, -0.235, isGhost); addXmasVoxel(group, 0.100, 0.105, 0.070, 'huskyDark', 0.000, 0.390, -0.265, isGhost);
    addXmasVoxel(group, 0.095, 0.083, 0.070, 'huskyGray', 0.000, 0.476, -0.240, isGhost); addXmasVoxel(group, 0.085, 0.060, 0.070, 'huskyWhite', 0.000, 0.525, -0.195, isGhost);
    addXmasVoxel(group, 0.070, 0.060, 0.040, 'huskyWhite', 0.000, 0.475, -0.170, isGhost);
  } else if (skinId === 'derpy_snowman') {
    // 70 voxels: derpy_snowman
    addXmasVoxel(group, 0.250, 0.030, 0.250, 'snowBody', 0.000, 0.015, -0.000, isGhost); addXmasVoxel(group, 0.300, 0.190, 0.300, 'snowWhite', 0.000, 0.115, -0.000, isGhost);
    addXmasVoxel(group, 0.240, 0.160, 0.030, 'snowWhite', 0.000, 0.115, 0.160, isGhost); addXmasVoxel(group, 0.240, 0.160, 0.030, 'snowBody', 0.000, 0.115, -0.160, isGhost);
    addXmasVoxel(group, 0.030, 0.160, 0.240, 'snowWhite', -0.160, 0.115, -0.000, isGhost); addXmasVoxel(group, 0.030, 0.160, 0.240, 'snowWhite', 0.160, 0.115, -0.000, isGhost);
    addXmasVoxel(group, 0.260, 0.030, 0.260, 'snowWhite', 0.000, 0.220, -0.000, isGhost); addXmasVoxel(group, 0.230, 0.165, 0.230, 'snowWhite', 0.000, 0.307, -0.000, isGhost);
    addXmasVoxel(group, 0.180, 0.125, 0.033, 'snowWhite', 0.000, 0.307, 0.126, isGhost); addXmasVoxel(group, 0.180, 0.125, 0.033, 'snowBody', 0.000, 0.307, -0.126, isGhost);
    addXmasVoxel(group, 0.033, 0.125, 0.180, 'snowWhite', -0.126, 0.307, -0.000, isGhost); addXmasVoxel(group, 0.033, 0.125, 0.180, 'snowWhite', 0.126, 0.307, -0.000, isGhost);
    addXmasVoxel(group, 0.190, 0.030, 0.190, 'snowWhite', 0.000, 0.400, -0.000, isGhost); addXmasVoxel(group, 0.025, 0.025, 0.015, 'coalBlack', 0.000, 0.360, 0.145, isGhost);
    addXmasVoxel(group, 0.025, 0.025, 0.015, 'coalBlack', 0.000, 0.318, 0.145, isGhost); addXmasVoxel(group, 0.025, 0.025, 0.015, 'coalBlack', 0.000, 0.275, 0.145, isGhost);
    addXmasVoxel(group, 0.102, 0.040, 0.033, 'scarfRed', -0.084, 0.407, 0.114, isGhost); addXmasVoxel(group, 0.075, 0.040, 0.033, 'scarfWhite', 0.000, 0.415, 0.116, isGhost);
    addXmasVoxel(group, 0.102, 0.040, 0.033, 'scarfRed', 0.084, 0.407, 0.114, isGhost); addXmasVoxel(group, 0.040, 0.048, 0.068, 'scarfWhite', 0.120, 0.409, 0.069, isGhost);
    addXmasVoxel(group, 0.040, 0.043, 0.072, 'scarfRed', 0.122, 0.414, 0.004, isGhost); addXmasVoxel(group, 0.040, 0.048, 0.075, 'scarfWhite', 0.120, 0.409, -0.065, isGhost);
    addXmasVoxel(group, 0.215, 0.040, 0.033, 'scarfRed', 0.000, 0.415, -0.116, isGhost); addXmasVoxel(group, 0.040, 0.048, 0.075, 'scarfWhite', -0.120, 0.409, -0.065, isGhost);
    addXmasVoxel(group, 0.040, 0.043, 0.072, 'scarfRed', -0.122, 0.414, 0.004, isGhost); addXmasVoxel(group, 0.040, 0.048, 0.068, 'scarfWhite', -0.120, 0.409, 0.069, isGhost);
    addXmasVoxel(group, 0.048, 0.040, 0.033, 'scarfRed', -0.081, 0.405, 0.134, isGhost); addXmasVoxel(group, 0.043, 0.060, 0.025, 'scarfWhite', -0.081, 0.362, 0.133, isGhost);
    addXmasVoxel(group, 0.037, 0.065, 0.030, 'scarfRed', -0.081, 0.305, 0.133, isGhost); addXmasVoxel(group, 0.048, 0.062, 0.022, 'scarfWhite', -0.081, 0.246, 0.134, isGhost);
    addXmasVoxel(group, 0.180, 0.155, 0.180, 'snowWhite', 0.000, 0.495, -0.000, isGhost); addXmasVoxel(group, 0.145, 0.133, 0.025, 'snowWhite', 0.000, 0.491, 0.100, isGhost);
    addXmasVoxel(group, 0.145, 0.130, 0.025, 'snowBody', 0.000, 0.492, -0.100, isGhost); addXmasVoxel(group, 0.025, 0.130, 0.145, 'snowWhite', -0.100, 0.492, -0.000, isGhost);
    addXmasVoxel(group, 0.025, 0.130, 0.145, 'snowWhite', 0.100, 0.492, -0.000, isGhost); addXmasVoxel(group, 0.140, 0.018, 0.140, 'snowWhite', 0.000, 0.579, -0.000, isGhost);
    addXmasVoxel(group, 0.035, 0.035, 0.035, 'carrotOrange', 0.000, 0.495, 0.128, isGhost); addXmasVoxel(group, 0.025, 0.025, 0.040, 'carrotOrange', 0.000, 0.495, 0.163, isGhost);
    addXmasVoxel(group, 0.025, 0.025, 0.010, 'coalBlack', -0.040, 0.527, 0.113, isGhost); addXmasVoxel(group, 0.025, 0.025, 0.010, 'coalBlack', 0.040, 0.522, 0.113, isGhost);
    addXmasVoxel(group, 0.015, 0.015, 0.007, 'coalBlack', -0.037, 0.465, 0.111, isGhost); addXmasVoxel(group, 0.015, 0.015, 0.007, 'coalBlack', -0.018, 0.453, 0.111, isGhost);
    addXmasVoxel(group, 0.015, 0.015, 0.007, 'coalBlack', 0.015, 0.453, 0.111, isGhost); addXmasVoxel(group, 0.015, 0.015, 0.007, 'coalBlack', 0.035, 0.463, 0.111, isGhost);
    addXmasVoxel(group, 0.170, 0.015, 0.165, 'metalSilver', 0.003, 0.585, -0.000, isGhost); addXmasVoxel(group, 0.160, 0.040, 0.150, 'bucketBlue', 0.005, 0.610, -0.000, isGhost);
    addXmasVoxel(group, 0.155, 0.040, 0.140, 'bucketBlue', 0.010, 0.647, -0.003, isGhost); addXmasVoxel(group, 0.140, 0.018, 0.125, 'bucketBlue', 0.010, 0.674, -0.003, isGhost);
    addXmasVoxel(group, 0.145, 0.010, 0.130, 'metalSilver', 0.010, 0.685, -0.003, isGhost); addXmasVoxel(group, 0.010, 0.018, 0.020, 'metalSilver', -0.077, 0.614, -0.000, isGhost);
    addXmasVoxel(group, 0.010, 0.018, 0.020, 'metalSilver', 0.087, 0.614, -0.000, isGhost); addXmasVoxel(group, 0.010, 0.040, 0.015, 'metalSilver', -0.083, 0.588, -0.000, isGhost);
    addXmasVoxel(group, 0.043, 0.020, 0.025, 'woodBrown', -0.139, 0.333, -0.000, isGhost); addXmasVoxel(group, 0.045, 0.020, 0.025, 'woodBrown', -0.180, 0.347, -0.003, isGhost);
    addXmasVoxel(group, 0.022, 0.033, 0.015, 'woodBrown', -0.211, 0.371, -0.000, isGhost); addXmasVoxel(group, 0.028, 0.020, 0.015, 'woodBrown', -0.214, 0.338, -0.013, isGhost);
    addXmasVoxel(group, 0.043, 0.020, 0.025, 'woodBrown', 0.139, 0.333, -0.000, isGhost); addXmasVoxel(group, 0.040, 0.020, 0.030, 'woodBrown', 0.177, 0.323, 0.022, isGhost);
    addXmasVoxel(group, 0.035, 0.025, 0.037, 'woodBrown', 0.195, 0.315, 0.054, isGhost); addXmasVoxel(group, 0.020, 0.060, 0.020, 'scarfRed', 0.198, 0.030, 0.052, isGhost);
    addXmasVoxel(group, 0.025, 0.058, 0.025, 'scarfWhite', 0.198, 0.086, 0.052, isGhost); addXmasVoxel(group, 0.020, 0.058, 0.020, 'scarfRed', 0.198, 0.141, 0.052, isGhost);
    addXmasVoxel(group, 0.025, 0.058, 0.025, 'scarfWhite', 0.198, 0.196, 0.052, isGhost); addXmasVoxel(group, 0.020, 0.058, 0.020, 'scarfRed', 0.198, 0.251, 0.052, isGhost);
    addXmasVoxel(group, 0.025, 0.058, 0.025, 'scarfWhite', 0.198, 0.306, 0.052, isGhost); addXmasVoxel(group, 0.020, 0.055, 0.020, 'scarfRed', 0.198, 0.360, 0.052, isGhost);
    addXmasVoxel(group, 0.025, 0.037, 0.048, 'scarfWhite', 0.198, 0.404, 0.041, isGhost); addXmasVoxel(group, 0.020, 0.025, 0.043, 'scarfRed', 0.198, 0.420, -0.001, isGhost);
    addXmasVoxel(group, 0.025, 0.043, 0.025, 'scarfWhite', 0.198, 0.389, -0.030, isGhost); addXmasVoxel(group, 0.020, 0.033, 0.020, 'scarfRed', 0.198, 0.354, -0.030, isGhost);
  } else if (skinId === 'arctic_fox') {
    // 67 voxels: arctic_fox
    addXmasVoxel(group, 0.060, 0.025, 0.070, 'foxSilver', -0.110, 0.013, 0.155, isGhost); addXmasVoxel(group, 0.040, 0.020, 0.025, 'foxWhite', -0.110, 0.013, 0.198, isGhost);
    addXmasVoxel(group, 0.050, 0.115, 0.060, 'foxSilverWhite', -0.110, 0.077, 0.155, isGhost); addXmasVoxel(group, 0.062, 0.090, 0.075, 'foxSilverWhite', -0.111, 0.175, 0.155, isGhost);
    addXmasVoxel(group, 0.060, 0.025, 0.070, 'foxSilver', 0.110, 0.013, 0.155, isGhost); addXmasVoxel(group, 0.040, 0.020, 0.025, 'foxWhite', 0.110, 0.013, 0.198, isGhost);
    addXmasVoxel(group, 0.050, 0.115, 0.060, 'foxSilverWhite', 0.110, 0.077, 0.155, isGhost); addXmasVoxel(group, 0.062, 0.090, 0.075, 'foxSilverWhite', 0.111, 0.175, 0.155, isGhost);
    addXmasVoxel(group, 0.060, 0.025, 0.070, 'foxSilver', -0.110, 0.013, -0.125, isGhost); addXmasVoxel(group, 0.050, 0.113, 0.060, 'foxSilverWhite', -0.110, 0.076, -0.125, isGhost);
    addXmasVoxel(group, 0.077, 0.115, 0.105, 'foxSilverWhite', -0.116, 0.182, -0.122, isGhost); addXmasVoxel(group, 0.060, 0.025, 0.070, 'foxSilver', 0.110, 0.013, -0.125, isGhost);
    addXmasVoxel(group, 0.050, 0.113, 0.060, 'foxSilverWhite', 0.110, 0.076, -0.125, isGhost); addXmasVoxel(group, 0.077, 0.115, 0.105, 'foxSilverWhite', 0.116, 0.182, -0.122, isGhost);
    addXmasVoxel(group, 0.260, 0.180, 0.300, 'foxSilverWhite', 0.000, 0.210, 0.005, isGhost); addXmasVoxel(group, 0.200, 0.020, 0.260, 'foxWhite', 0.000, 0.113, 0.005, isGhost);
    addXmasVoxel(group, 0.240, 0.170, 0.060, 'foxWhite', 0.000, 0.225, 0.180, isGhost); addXmasVoxel(group, 0.190, 0.105, 0.025, 'foxWhite', 0.000, 0.233, 0.217, isGhost);
    addXmasVoxel(group, 0.140, 0.060, 0.033, 'foxWhite', 0.000, 0.305, 0.224, isGhost); addXmasVoxel(group, 0.220, 0.020, 0.220, 'foxSilver', 0.000, 0.305, 0.005, isGhost);
    addXmasVoxel(group, 0.015, 0.115, 0.170, 'foxSilverWhite', -0.133, 0.212, 0.005, isGhost); addXmasVoxel(group, 0.015, 0.115, 0.170, 'foxSilverWhite', 0.133, 0.212, 0.005, isGhost);
    addXmasVoxel(group, 0.240, 0.160, 0.055, 'foxSilverWhite', 0.000, 0.210, -0.168, isGhost); addXmasVoxel(group, 0.200, 0.110, 0.025, 'foxWhite', 0.000, 0.205, -0.203, isGhost);
    addXmasVoxel(group, 0.210, 0.080, 0.090, 'foxSilverWhite', 0.000, 0.325, 0.140, isGhost); addXmasVoxel(group, 0.250, 0.185, 0.190, 'foxSilverWhite', 0.000, 0.432, 0.140, isGhost);
    addXmasVoxel(group, 0.120, 0.028, 0.085, 'foxSilverWhite', 0.000, 0.534, 0.117, isGhost); addXmasVoxel(group, 0.160, 0.043, 0.065, 'foxSilverWhite', 0.000, 0.509, 0.207, isGhost);
    addXmasVoxel(group, 0.100, 0.055, 0.022, 'foxWhite', 0.000, 0.458, 0.239, isGhost); addXmasVoxel(group, 0.040, 0.090, 0.125, 'foxWhite', -0.140, 0.400, 0.152, isGhost);
    addXmasVoxel(group, 0.040, 0.090, 0.125, 'foxWhite', 0.140, 0.400, 0.152, isGhost); addXmasVoxel(group, 0.140, 0.072, 0.075, 'foxWhite', 0.000, 0.391, 0.268, isGhost);
    addXmasVoxel(group, 0.100, 0.060, 0.060, 'foxWhite', 0.000, 0.390, 0.330, isGhost); addXmasVoxel(group, 0.065, 0.043, 0.035, 'foxWhite', 0.000, 0.391, 0.372, isGhost);
    addXmasVoxel(group, 0.090, 0.028, 0.070, 'foxWhite', 0.000, 0.346, 0.255, isGhost); addXmasVoxel(group, 0.050, 0.033, 0.028, 'foxNose', 0.000, 0.411, 0.394, isGhost);
    addXmasVoxel(group, 0.050, 0.052, 0.025, 'foxEye', -0.083, 0.456, 0.245, isGhost); addXmasVoxel(group, 0.028, 0.020, 0.013, 'foxWhite', -0.081, 0.468, 0.256, isGhost);
    addXmasVoxel(group, 0.050, 0.052, 0.025, 'foxEye', 0.083, 0.456, 0.245, isGhost); addXmasVoxel(group, 0.028, 0.020, 0.013, 'foxWhite', 0.081, 0.468, 0.256, isGhost);
    addXmasVoxel(group, 0.060, 0.105, 0.065, 'foxSilver', -0.098, 0.568, 0.122, isGhost); addXmasVoxel(group, 0.035, 0.080, 0.050, 'foxSilverWhite', -0.095, 0.655, 0.122, isGhost);
    addXmasVoxel(group, 0.035, 0.083, 0.013, 'innerEarPink', -0.090, 0.571, 0.151, isGhost); addXmasVoxel(group, 0.060, 0.105, 0.065, 'foxSilver', 0.098, 0.568, 0.122, isGhost);
    addXmasVoxel(group, 0.035, 0.080, 0.050, 'foxSilverWhite', 0.095, 0.655, 0.122, isGhost); addXmasVoxel(group, 0.035, 0.083, 0.013, 'innerEarPink', 0.090, 0.571, 0.151, isGhost);
    addXmasVoxel(group, 0.250, 0.030, 0.035, 'muffEmerald', 0.000, 0.552, 0.125, isGhost); addXmasVoxel(group, 0.055, 0.015, 0.045, 'muffGold', 0.000, 0.570, 0.125, isGhost);
    addXmasVoxel(group, 0.028, 0.052, 0.025, 'muffEmerald', -0.131, 0.521, 0.125, isGhost); addXmasVoxel(group, 0.028, 0.052, 0.025, 'muffEmerald', 0.131, 0.521, 0.125, isGhost);
    addXmasVoxel(group, 0.052, 0.090, 0.095, 'muffGold', -0.154, 0.465, 0.125, isGhost); addXmasVoxel(group, 0.025, 0.065, 0.075, 'muffEmerald', -0.180, 0.465, 0.125, isGhost);
    addXmasVoxel(group, 0.010, 0.020, 0.020, 'muffGold', -0.193, 0.465, 0.125, isGhost); addXmasVoxel(group, 0.052, 0.090, 0.095, 'muffGold', 0.154, 0.465, 0.125, isGhost);
    addXmasVoxel(group, 0.025, 0.065, 0.075, 'muffEmerald', 0.180, 0.465, 0.125, isGhost); addXmasVoxel(group, 0.010, 0.020, 0.020, 'muffGold', 0.193, 0.465, 0.125, isGhost);
    addXmasVoxel(group, 0.085, 0.075, 0.065, 'foxSilverWhite', 0.000, 0.258, -0.212, isGhost); addXmasVoxel(group, 0.125, 0.090, 0.085, 'foxSilverWhite', 0.000, 0.320, -0.273, isGhost);
    addXmasVoxel(group, 0.155, 0.125, 0.105, 'foxSilverWhite', 0.000, 0.407, -0.323, isGhost); addXmasVoxel(group, 0.022, 0.085, 0.075, 'foxWhite', -0.084, 0.407, -0.323, isGhost);
    addXmasVoxel(group, 0.022, 0.085, 0.075, 'foxWhite', 0.084, 0.407, -0.323, isGhost); addXmasVoxel(group, 0.135, 0.105, 0.100, 'foxWhite', 0.000, 0.507, -0.305, isGhost);
    addXmasVoxel(group, 0.105, 0.085, 0.090, 'foxWhite', 0.000, 0.588, -0.265, isGhost); addXmasVoxel(group, 0.070, 0.055, 0.070, 'foxWhite', 0.000, 0.642, -0.230, isGhost);
    addXmasVoxel(group, 0.100, 0.055, 0.065, 'foxSilver', 0.000, 0.333, -0.273, isGhost); addXmasVoxel(group, 0.080, 0.085, 0.040, 'foxSilverWhite', 0.000, 0.482, -0.365, isGhost);
    addXmasVoxel(group, 0.050, 0.035, 0.050, 'foxWhite', 0.000, 0.672, -0.200, isGhost);
  } else {
    createChristmasCharacterExp(skinId, isGhost, innerPivot);
  }

  root.add(innerPivot);
  return root;
}
