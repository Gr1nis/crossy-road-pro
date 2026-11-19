import type { BiomeType } from '../core/types.ts';
import type { VoxelMeshBuilder } from './voxelMeshBuilder.ts';

// Model 9: Riverbank Edge Parapet & Bollard (19 cubes, Zero Z-Fighting Certified)
const RIVERBANK_GEO: readonly [number, number, number, number, number, number, string][] = [
  [0.985, 0.11, 0.385, 0.0, 0.055, 0.0, 'graniteDark'],
  [0.975, 0.115, 0.31, 0.0, 0.1625, -0.0325, 'graniteMid'],
  [0.965, 0.085, 0.245, 0.0, 0.2575, -0.06, 'graniteLight'],
  [0.215, 0.045, 0.185, 0.1, 0.3175, 0.0, 'bollardIron'],
  [0.145, 0.185, 0.125, 0.1, 0.4275, 0.0, 'bollardIron'],
  [0.195, 0.065, 0.175, 0.1, 0.5475, 0.0, 'bollardIron'],
  [0.09, 0.06, 0.045, -0.0125, 0.44, 0.0, 'bollardIron'],
  [0.09, 0.06, 0.045, 0.2125, 0.44, 0.0, 'bollardIron'],
  [0.18, 0.01, 0.12, -0.3025, 0.3, -0.0825, 'grateMetal'],
  [0.03, 0.015, 0.1, -0.3575, 0.305, -0.0825, 'slotBlack'],
  [0.03, 0.015, 0.1, -0.3025, 0.305, -0.0825, 'slotBlack'],
  [0.03, 0.015, 0.1, -0.2475, 0.305, -0.0825, 'slotBlack'],
  [0.11, 0.04, 0.015, 0.3175, 0.1, 0.195, 'bollardIron'],
  [0.13, 0.11, 0.015, 0.3175, 0.1, 0.2025, 'buoyOrange'],
  [0.03, 0.025, 0.0225, 0.3175, 0.1475, 0.2013, 'buoyWhite'],
  [0.03, 0.025, 0.0225, 0.3175, 0.0525, 0.2013, 'buoyWhite'],
  [0.025, 0.03, 0.0225, 0.26, 0.1, 0.2013, 'buoyWhite'],
  [0.14, 0.07, 0.01, -0.3775, 0.055, 0.1925, 'mossGreen'],
  [0.125, 0.06, 0.01, 0.17, 0.045, 0.1925, 'mossGreen'],
];

const RIVERBANK_PALETTES: Record<BiomeType, Record<string, number>> = {
  forest: { graniteDark: 0x475569, graniteMid: 0x64748b, graniteLight: 0x94a3b8, bollardIron: 0x334155, grateMetal: 0x1e293b, slotBlack: 0x0f172a, buoyOrange: 0xea580c, buoyWhite: 0xf8fafc, mossGreen: 0x15803d },
  winter: { graniteDark: 0x64748b, graniteMid: 0x94a3b8, graniteLight: 0xcbd5e1, bollardIron: 0x1e293b, grateMetal: 0x334155, slotBlack: 0x0f172a, buoyOrange: 0x38bdf8, buoyWhite: 0xf8fafc, mossGreen: 0x0f766e },
  desert: { graniteDark: 0x78350f, graniteMid: 0xb45309, graniteLight: 0xd97706, bollardIron: 0x451a03, grateMetal: 0x78350f, slotBlack: 0x27170a, buoyOrange: 0xf59e0b, buoyWhite: 0xfef08a, mossGreen: 0x854d0e },
  neon: { graniteDark: 0x1e1b4b, graniteMid: 0x312e81, graniteLight: 0x4338ca, bollardIron: 0x06b6d4, grateMetal: 0x0f172a, slotBlack: 0x020617, buoyOrange: 0xf43f5e, buoyWhite: 0xd946ef, mossGreen: 0x10b981 },
};

// Model 10: 3D Floating Gold Coin with Star (21 cubes, Zero Z-Fighting Certified)
export const COIN_BOXES: readonly [number, number, number, number, number, number, number][] = [
  [0.225, 0.31, 0.065, 0.0, 0.365, 0.0, 0xf59e0b],
  [0.33, 0.205, 0.055, 0.0, 0.365, 0.0, 0xf59e0b],
  [0.05, 0.07, 0.045, -0.1225, 0.4525, 0.0, 0xf59e0b],
  [0.05, 0.07, 0.045, 0.1225, 0.2775, 0.0, 0xf59e0b],
  [0.185, 0.04, 0.085, 0.0, 0.51, 0.0, 0xd97706],
  [0.185, 0.04, 0.085, 0.0, 0.22, 0.0, 0xd97706],
  [0.0375, 0.19, 0.075, -0.1512, 0.365, 0.0, 0xd97706],
  [0.0375, 0.19, 0.075, 0.1512, 0.365, 0.0, 0xd97706],
  [0.07, 0.075, 0.095, -0.1225, 0.4675, 0.0, 0xd97706],
  [0.07, 0.075, 0.095, 0.1225, 0.4675, 0.0, 0xd97706],
  [0.07, 0.075, 0.095, -0.1225, 0.2625, 0.0, 0xd97706],
  [0.07, 0.075, 0.095, 0.1225, 0.2625, 0.0, 0xd97706],
  [0.075, 0.06, 0.105, 0.0, 0.36, 0.0, 0xfacc15],
  [0.045, 0.075, 0.11, 0.0, 0.4225, 0.0, 0xfef08a],
  [0.065, 0.045, 0.11, -0.065, 0.3775, 0.0, 0xfacc15],
  [0.065, 0.045, 0.11, 0.065, 0.3775, 0.0, 0xfacc15],
  [0.05, 0.065, 0.11, -0.0525, 0.3025, 0.0, 0xfacc15],
  [0.05, 0.065, 0.11, 0.0525, 0.3025, 0.0, 0xfacc15],
  [0.035, 0.03, 0.12, 0.0, 0.365, 0.0, 0xfef08a],
  [0.03, 0.03, 0.0075, -0.1075, 0.455, 0.0488, 0xfef08a],
  [0.03, 0.03, 0.0075, 0.1075, 0.275, 0.0488, 0xfef08a],
];

// Model 11: Personal Best Record Flag (20 cubes, Zero Z-Fighting Certified)
const RECORD_FLAG_BOXES: readonly [number, number, number, number, number, number, number][] = [
  [0.375, 0.07, 0.375, 0.0, 0.035, 0.0, 0x334155],
  [0.395, 0.03, 0.395, 0.0, 0.03, 0.0, 0xf59e0b],
  [0.275, 0.095, 0.275, 0.0, 0.1125, 0.0, 0x334155],
  [0.135, 0.075, 0.135, 0.0, 0.1925, 0.0, 0xf59e0b],
  [0.065, 1.155, 0.065, 0.0, 0.8025, 0.0, 0x94a3b8],
  [0.155, 0.055, 0.155, 0.0, 1.4025, 0.0, 0xfacc15],
  [0.065, 0.075, 0.065, 0.0, 1.4625, 0.0, 0xfacc15],
  [0.035, 0.05, 0.055, -0.055, 1.45, 0.0, 0xfacc15],
  [0.035, 0.05, 0.055, 0.055, 1.45, 0.0, 0xfacc15],
  [0.035, 0.03, 0.015, 0.0, 1.45, 0.0375, 0xdc2626],
  [0.02, 0.02, 0.0125, -0.0525, 1.445, 0.0362, 0xdc2626],
  [0.02, 0.02, 0.0125, 0.0525, 1.445, 0.0362, 0xdc2626],
  [0.245, 0.43, 0.025, 0.15, 1.125, 0.0, 0xfbbf24],
  [0.17, 0.4, 0.0225, 0.3525, 1.125, 0.0213, 0xfbbf24],
  [0.16, 0.18, 0.02, 0.5125, 1.23, 0.0375, 0xfbbf24],
  [0.16, 0.18, 0.02, 0.5125, 1.02, 0.0375, 0xfbbf24],
  [0.075, 0.09, 0.04, 0.15, 1.125, 0.0, 0xdc2626],
  [0.115, 0.04, 0.035, 0.15, 1.2, 0.0, 0xfacc15],
  [0.115, 0.04, 0.035, 0.15, 1.05, 0.0, 0xfacc15],
  [0.085, 0.035, 0.085, 0.0, 0.2325, 0.0, 0xf59e0b],
];

// Model 12: Road Markings / Clean Zebra (8 cubes, Zero Z-Fighting Certified)
const ROAD_MARKINGS_BOXES: readonly [number, number, number, number, number, number, number][] = [
  [0.15, 0.05, 0.785, -0.3475, 0.025, 0.0, 0xf8fafc],
  [0.15, 0.05, 0.785, -0.1375, 0.025, 0.0, 0xf8fafc],
  [0.15, 0.05, 0.785, 0.0725, 0.025, 0.0, 0xf8fafc],
  [0.15, 0.05, 0.785, 0.2825, 0.025, 0.0, 0xf8fafc],
  [0.82, 0.05, 0.035, -0.0325, 0.025, -0.415, 0xfacc15],
  [0.82, 0.05, 0.035, -0.0325, 0.025, 0.415, 0xfacc15],
  [0.025, 0.05, 0.325, -0.46, 0.025, 0.0, 0xf8fafc],
  [0.025, 0.05, 0.325, 0.395, 0.025, 0.0, 0xf8fafc],
];

// Model 1: Tree Planter A (31 cubes, Terracotta & Vibrant Red Apples)
const TREE_PLANTER_GEO: readonly [number, number, number, number, number, number, string][] = [
  [0.1, 0.1, 0.1, -0.3425, 0.05, -0.3425, 'woodPlankDark'],
  [0.1, 0.1, 0.1, 0.3425, 0.05, -0.3425, 'woodPlankDark'],
  [0.1, 0.1, 0.1, -0.3425, 0.05, 0.3425, 'woodPlankDark'],
  [0.1, 0.1, 0.1, 0.3425, 0.05, 0.3425, 'woodPlankDark'],
  [0.765, 0.065, 0.765, 0.0, 0.1275, 0.0, 'woodPlankMid'],
  [0.79, 0.345, 0.09, 0.0, 0.3275, -0.35, 'woodPlankMid'],
  [0.79, 0.345, 0.09, 0.0, 0.3275, 0.35, 'woodPlankMid'],
  [0.085, 0.345, 0.6, -0.3475, 0.3275, 0.0, 'woodPlankMid'],
  [0.085, 0.345, 0.6, 0.3475, 0.3275, 0.0, 'woodPlankMid'],
  [0.8, 0.065, 0.105, 0.0, 0.5275, -0.3475, 'woodPlankDark'],
  [0.8, 0.065, 0.105, 0.0, 0.5275, 0.3475, 'woodPlankDark'],
  [0.1, 0.065, 0.58, -0.345, 0.5275, 0.0, 'woodPlankDark'],
  [0.1, 0.065, 0.58, 0.345, 0.5275, 0.0, 'woodPlankDark'],
  [0.57, 0.08, 0.57, 0.0, 0.49, 0.0, 'soilDark'],
  [0.145, 0.375, 0.145, 0.0, 0.7125, 0.0, 'trunkBark'],
  [0.685, 0.27, 0.685, 0.0, 1.025, 0.0, 'foliageBase'],
  [0.545, 0.21, 0.055, 0.0, 1.025, -0.365, 'foliageBase'],
  [0.545, 0.21, 0.055, 0.0, 1.025, 0.365, 'foliageBase'],
  [0.055, 0.21, 0.545, -0.365, 1.025, 0.0, 'foliageBase'],
  [0.055, 0.21, 0.545, 0.365, 1.025, 0.0, 'foliageBase'],
  [0.615, 0.32, 0.615, 0.0, 1.315, 0.0, 'foliageMid'],
  [0.465, 0.225, 0.055, 0.0, 1.3125, -0.33, 'foliageMid'],
  [0.465, 0.225, 0.055, 0.0, 1.3125, 0.33, 'foliageMid'],
  [0.055, 0.225, 0.465, -0.33, 1.3125, 0.0, 'foliageMid'],
  [0.055, 0.225, 0.465, 0.33, 1.3125, 0.0, 'foliageMid'],
  [0.425, 0.26, 0.425, 0.0, 1.6, 0.0, 'foliageLight'],
  [0.245, 0.075, 0.245, 0.0, 1.7625, 0.0, 'foliageLight'],
  [0.07, 0.07, 0.015, -0.1375, 1.085, -0.39, 'appleRed'],
  [0.07, 0.07, 0.015, 0.1625, 1.035, -0.39, 'appleRed'],
  [0.015, 0.07, 0.07, 0.36, 1.31, -0.0875, 'appleRed'],
  [0.015, 0.07, 0.07, -0.36, 1.335, 0.0975, 'appleRed'],
];

const TREE_PALETTES: Record<BiomeType, Record<string, number>> = {
  forest: { woodPlankDark: 0x78350f, woodPlankMid: 0xb45309, soilDark: 0x451a03, trunkBark: 0x92400e, foliageBase: 0x15803d, foliageMid: 0x16a34a, foliageLight: 0x22c55e, appleRed: 0xef4444 },
  winter: { woodPlankDark: 0x334155, woodPlankMid: 0x64748b, soilDark: 0x1e293b, trunkBark: 0x475569, foliageBase: 0x0f766e, foliageMid: 0x115e59, foliageLight: 0xf8fafc, appleRed: 0xef4444 },
  desert: { woodPlankDark: 0x78350f, woodPlankMid: 0xb45309, soilDark: 0x451a03, trunkBark: 0x92400e, foliageBase: 0x854d0e, foliageMid: 0xa16207, foliageLight: 0xca8a04, appleRed: 0xdc2626 },
  neon: { woodPlankDark: 0x0f172a, woodPlankMid: 0x1e1b4b, soilDark: 0x020617, trunkBark: 0x312e81, foliageBase: 0x4338ca, foliageMid: 0x06b6d4, foliageLight: 0xd946ef, appleRed: 0xf43f5e },
};

// Model 1b: Tree Planter B (31 cubes, Graphite/Gold Concrete Planter & Dome Canopy)
const TREE_PLANTER_B_GEO: readonly [number, number, number, number, number, number, string][] = [
  [0.7, 0.09, 0.7, 0.0, 0.045, 0.0, 'concreteDark'],
  [0.725, 0.075, 0.725, 0.0, 0.1225, 0.0, 'concreteMid'],
  [0.79, 0.325, 0.09, 0.0, 0.3175, -0.35, 'concreteMid'],
  [0.79, 0.325, 0.09, 0.0, 0.3175, 0.35, 'concreteMid'],
  [0.085, 0.325, 0.6, -0.3475, 0.3175, 0.0, 'concreteMid'],
  [0.085, 0.325, 0.6, 0.3475, 0.3175, 0.0, 'concreteMid'],
  [0.8, 0.065, 0.105, 0.0, 0.5075, -0.3475, 'goldRim'],
  [0.8, 0.065, 0.105, 0.0, 0.5075, 0.3475, 'goldRim'],
  [0.1, 0.065, 0.58, -0.345, 0.5075, 0.0, 'goldRim'],
  [0.1, 0.065, 0.58, 0.345, 0.5075, 0.0, 'goldRim'],
  [0.565, 0.08, 0.565, 0.0, 0.47, 0.0, 'soilDark'],
  [0.185, 0.32, 0.185, 0.0, 0.665, 0.0, 'trunkBark'],
  [0.1, 0.2, 0.145, -0.1325, 0.875, 0.0, 'trunkBark'],
  [0.1, 0.2, 0.145, 0.1325, 0.875, 0.0, 'trunkBark'],
  [0.885, 0.24, 0.885, 0.0, 1.07, 0.0, 'foliageBase'],
  [0.745, 0.185, 0.055, 0.0, 1.0675, -0.465, 'foliageBase'],
  [0.745, 0.185, 0.055, 0.0, 1.0675, 0.465, 'foliageBase'],
  [0.055, 0.185, 0.745, -0.465, 1.0675, 0.0, 'foliageBase'],
  [0.055, 0.185, 0.745, 0.465, 1.0675, 0.0, 'foliageBase'],
  [0.765, 0.225, 0.765, 0.0, 1.2975, 0.0, 'foliageMid'],
  [0.585, 0.17, 0.055, 0.0, 1.295, -0.405, 'foliageMid'],
  [0.585, 0.17, 0.055, 0.0, 1.295, 0.405, 'foliageMid'],
  [0.055, 0.17, 0.585, -0.405, 1.295, 0.0, 'foliageMid'],
  [0.055, 0.17, 0.585, 0.405, 1.295, 0.0, 'foliageMid'],
  [0.545, 0.185, 0.545, 0.0, 1.4975, 0.0, 'foliageLight'],
  [0.325, 0.075, 0.325, 0.0, 1.6225, 0.0, 'foliageLight'],
  [0.07, 0.07, 0.015, -0.2775, 1.085, -0.49, 'appleRed'],
  [0.07, 0.07, 0.015, 0.2775, 1.11, -0.49, 'appleRed'],
  [0.015, 0.07, 0.07, 0.49, 1.135, -0.1275, 'appleRed'],
  [0.015, 0.07, 0.07, -0.49, 1.145, 0.1275, 'appleRed'],
  [0.075, 0.07, 0.015, -0.035, 1.26, 0.43, 'appleRed'],
];

const TREE_B_PALETTES: Record<BiomeType, Record<string, number>> = {
  forest: { concreteDark: 0x1e293b, concreteMid: 0x334155, goldRim: 0xd97706, soilDark: 0x27170a, trunkBark: 0x78350f, foliageBase: 0x166534, foliageMid: 0x15803d, foliageLight: 0x22c55e, appleRed: 0xef4444 },
  winter: { concreteDark: 0x1e293b, concreteMid: 0x475569, goldRim: 0x94a3b8, soilDark: 0x0f172a, trunkBark: 0x334155, foliageBase: 0x042f2e, foliageMid: 0x0f766e, foliageLight: 0xf8fafc, appleRed: 0xef4444 },
  desert: { concreteDark: 0x451a03, concreteMid: 0x78350f, goldRim: 0xb45309, soilDark: 0x27170a, trunkBark: 0x78350f, foliageBase: 0x713f12, foliageMid: 0x854d0e, foliageLight: 0xca8a04, appleRed: 0xdc2626 },
  neon: { concreteDark: 0x020617, concreteMid: 0x0f172a, goldRim: 0x06b6d4, soilDark: 0x000000, trunkBark: 0x1e1b4b, foliageBase: 0x312e81, foliageMid: 0x4338ca, foliageLight: 0xd946ef, appleRed: 0xf43f5e },
};

// Model 2: Trimmed Cubic Hedge (18 cubes, Zero Z-Fighting Certified)
const HEDGE_GEO: readonly [number, number, number, number, number, number, string][] = [
  [0.685, 0.06, 0.685, 0.0, 0.03, 0.0, 'hedgeDark'],
  [0.635, 0.465, 0.635, 0.0, 0.2875, 0.0, 'hedgeMid'],
  [0.525, 0.065, 0.525, 0.0, 0.5475, 0.0, 'hedgeLight'],
  [0.315, 0.025, 0.315, 0.0, 0.5875, 0.0, 'hedgeLight'],
  [0.575, 0.19, 0.035, 0.0, 0.195, -0.33, 'hedgeDark'],
  [0.465, 0.185, 0.035, 0.0, 0.3775, -0.325, 'hedgeMid'],
  [0.575, 0.19, 0.035, 0.0, 0.195, 0.33, 'hedgeDark'],
  [0.465, 0.185, 0.035, 0.0, 0.3775, 0.325, 'hedgeMid'],
  [0.035, 0.19, 0.575, -0.33, 0.195, 0.0, 'hedgeDark'],
  [0.035, 0.185, 0.465, -0.325, 0.3775, 0.0, 'hedgeMid'],
  [0.035, 0.19, 0.575, 0.33, 0.195, 0.0, 'hedgeDark'],
  [0.035, 0.185, 0.465, 0.325, 0.3775, 0.0, 'hedgeMid'],
  [0.06, 0.06, 0.015, -0.2275, 0.355, -0.3425, 'leafLime'],
  [0.06, 0.06, 0.015, 0.1725, 0.24, -0.3425, 'leafLime'],
  [0.06, 0.06, 0.015, -0.1775, 0.22, 0.3425, 'leafLime'],
  [0.06, 0.06, 0.015, 0.1875, 0.38, 0.3425, 'leafLime'],
  [0.06, 0.02, 0.06, -0.0775, 0.605, 0.0525, 'blossomYellow'],
  [0.06, 0.02, 0.06, 0.0925, 0.605, -0.0625, 'blossomYellow'],
];

const HEDGE_PALETTES: Record<BiomeType, Record<string, number>> = {
  forest: { hedgeDark: 0x166534, hedgeMid: 0x15803d, hedgeLight: 0x22c55e, leafLime: 0x84cc16, blossomYellow: 0xfacc15 },
  winter: { hedgeDark: 0x334155, hedgeMid: 0x475569, hedgeLight: 0x94a3b8, leafLime: 0xdbeafe, blossomYellow: 0xf8fafc },
  desert: { hedgeDark: 0x78350f, hedgeMid: 0x92400e, hedgeLight: 0xb45309, leafLime: 0xca8a04, blossomYellow: 0xfef08a },
  neon: { hedgeDark: 0x1e1b4b, hedgeMid: 0x312e81, hedgeLight: 0x4338ca, leafLime: 0x06b6d4, blossomYellow: 0xf43f5e },
};

export function populateRiverbankBuilder(
  b: VoxelMeshBuilder,
  side: 'left' | 'right' = 'left',
  biome: BiomeType = 'forest'
): void {
  const pal = RIVERBANK_PALETTES[biome] ?? RIVERBANK_PALETTES.forest;
  const flipX = side === 'right' ? -1 : 1;
  for (let i = 0; i < RIVERBANK_GEO.length; i++) {
    const d = RIVERBANK_GEO[i];
    const col = pal[d[6]] ?? 0x64748b;
    b.addBox(d[0], d[1], d[2], d[3] * flipX, d[4], d[5], col);
  }
}

export function populateCoinBuilder(b: VoxelMeshBuilder): void {
  for (let i = 0; i < COIN_BOXES.length; i++) {
    const d = COIN_BOXES[i];
    b.addBox(d[0], d[1], d[2], d[3], d[4], d[5], d[6]);
  }
}

export function populateRecordFlagBuilder(b: VoxelMeshBuilder): void {
  for (let i = 0; i < RECORD_FLAG_BOXES.length; i++) {
    const d = RECORD_FLAG_BOXES[i];
    b.addBox(d[0], d[1], d[2], d[3], d[4], d[5], d[6]);
  }
}

export function populateRoadMarkingsBuilder(b: VoxelMeshBuilder): void {
  for (let i = 0; i < ROAD_MARKINGS_BOXES.length; i++) {
    const d = ROAD_MARKINGS_BOXES[i];
    b.addBox(d[0], d[1], d[2], d[3], d[4], d[5], d[6]);
  }
}

export function populateTreePlanterBuilder(b: VoxelMeshBuilder, biome: BiomeType = 'forest'): void {
  const pal = TREE_PALETTES[biome] ?? TREE_PALETTES.forest;
  for (let i = 0; i < TREE_PLANTER_GEO.length; i++) {
    const d = TREE_PLANTER_GEO[i];
    const col = pal[d[6]] ?? 0x16a34a;
    b.addBox(d[0], d[1], d[2], d[3], d[4], d[5], col);
  }
}

export function populateTreePlanterBBuilder(b: VoxelMeshBuilder, biome: BiomeType = 'forest'): void {
  const pal = TREE_B_PALETTES[biome] ?? TREE_B_PALETTES.forest;
  for (let i = 0; i < TREE_PLANTER_B_GEO.length; i++) {
    const d = TREE_PLANTER_B_GEO[i];
    const col = pal[d[6]] ?? 0x15803d;
    b.addBox(d[0], d[1], d[2], d[3], d[4], d[5], col);
  }
}

export function populateHedgeBuilder(b: VoxelMeshBuilder, biome: BiomeType = 'forest'): void {
  const pal = HEDGE_PALETTES[biome] ?? HEDGE_PALETTES.forest;
  for (let i = 0; i < HEDGE_GEO.length; i++) {
    const d = HEDGE_GEO[i];
    const col = pal[d[6]] ?? 0x84cc16;
    b.addBox(d[0], d[1], d[2], d[3], d[4], d[5], col);
  }
}
