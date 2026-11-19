import type { BiomeType } from '../core/types.ts';
import type { VoxelMeshBuilder } from './voxelMeshBuilder.ts';

// Model 9: Riverbank Edge Parapet & Bollard (19 cubes, Zero Z-Fighting Certified)
const RIVERBANK_GEO: readonly [number, number, number, number, number, number, string][] = [
  [0.985, 0.11, 0.385, 0.0, 0.055, 0.0, 'graniteDark'],
  [0.975, 0.115, 0.31, 0.0, 0.1625, -0.0325, 'graniteMid'],
  [0.965, 0.085, 0.245, 0.0, 0.2575, -0.06, 'graniteLight'],
  [0.215, 0.045, 0.185, 0.0, 0.3175, 0.0, 'bollardIron'],
  [0.145, 0.185, 0.125, 0.0, 0.4275, 0.0, 'bollardIron'],
  [0.195, 0.065, 0.175, 0.0, 0.5475, 0.0, 'bollardIron'],
  [0.09, 0.06, 0.045, -0.1125, 0.44, 0.0, 'bollardIron'],
  [0.09, 0.06, 0.045, 0.1125, 0.44, 0.0, 'bollardIron'],
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
  forest: { granitePavement: 0x64748b, graniteDark: 0x475569, timberPost: 0x78350f, ironBollard: 0x334155, scupperHole: 0x0f172a },
  winter: { granitePavement: 0x94a3b8, graniteDark: 0x64748b, timberPost: 0x475569, ironBollard: 0xf1f5f9, scupperHole: 0x1e293b },
  desert: { granitePavement: 0xd97706, graniteDark: 0xb45309, timberPost: 0x92400e, ironBollard: 0x78350f, scupperHole: 0x451a03 },
  neon: { granitePavement: 0x312e81, graniteDark: 0x1e1b4b, timberPost: 0x06b6d4, ironBollard: 0xec4899, scupperHole: 0x020617 },
};

// Model 10: 3D Floating Gold Coin (20 cubes, Zero Z-Fighting Certified)
const COIN_BOXES: readonly [number, number, number, number, number, number, number][] = [
  [0.225, 0.32, 0.065, 0.0, 0.365, 0.0, 0xf59e0b],
  [0.345, 0.21, 0.055, 0.0, 0.365, 0.0, 0xf59e0b],
  [0.055, 0.07, 0.045, -0.125, 0.455, 0.0, 0xf59e0b],
  [0.055, 0.07, 0.045, 0.125, 0.275, 0.0, 0xf59e0b],
  [0.185, 0.045, 0.085, 0.0, 0.5125, 0.0, 0xd97706],
  [0.185, 0.04, 0.085, 0.0, 0.22, 0.0, 0xd97706],
  [0.0425, 0.19, 0.075, -0.1538, 0.365, 0.0, 0xd97706],
  [0.0425, 0.19, 0.075, 0.1538, 0.365, 0.0, 0xd97706],
  [0.07, 0.08, 0.095, -0.1225, 0.47, 0.0, 0xd97706],
  [0.07, 0.08, 0.095, 0.1225, 0.47, 0.0, 0xd97706],
  [0.07, 0.08, 0.095, -0.1225, 0.26, 0.0, 0xd97706],
  [0.07, 0.08, 0.095, 0.1225, 0.26, 0.0, 0xd97706],
  [0.035, 0.28, 0.105, 0.0, 0.365, 0.0, 0xfacc15],
  [0.135, 0.035, 0.115, 0.0, 0.4575, 0.0, 0xfacc15],
  [0.115, 0.03, 0.115, 0.0, 0.365, 0.0, 0xfacc15],
  [0.135, 0.035, 0.115, 0.0, 0.2725, 0.0, 0xfacc15],
  [0.03, 0.07, 0.12, -0.0575, 0.41, 0.0, 0xfacc15],
  [0.03, 0.07, 0.12, 0.0575, 0.32, 0.0, 0xfacc15],
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

// Model 12: Road Markings / Zebra Crossing (12 cubes, Zero Z-Fighting Certified)
const ROAD_MARKINGS_BOXES: readonly [number, number, number, number, number, number, number][] = [
  [0.17, 0.05, 0.785, -0.3575, 0.025, 0.0, 0xf8fafc],
  [0.17, 0.05, 0.785, -0.1425, 0.025, 0.0, 0xf8fafc],
  [0.17, 0.05, 0.785, 0.0725, 0.025, 0.0, 0xf8fafc],
  [0.17, 0.05, 0.785, 0.2875, 0.025, 0.0, 0xf8fafc],
  [0.815, 0.05, 0.035, -0.035, 0.025, -0.415, 0xfacc15],
  [0.815, 0.05, 0.035, -0.035, 0.025, 0.415, 0xfacc15],
  [0.03, 0.015, 0.03, -0.3575, 0.05, -0.2575, 0xe2e8f0],
  [0.03, 0.015, 0.03, -0.1425, 0.05, -0.0775, 0xe2e8f0],
  [0.03, 0.015, 0.03, 0.0725, 0.05, 0.1075, 0xe2e8f0],
  [0.03, 0.015, 0.03, 0.2875, 0.05, 0.2875, 0xe2e8f0],
  [0.025, 0.05, 0.325, -0.46, 0.025, 0.0, 0xf8fafc],
  [0.025, 0.05, 0.325, 0.39, 0.025, 0.0, 0xf8fafc],
];

// Model 1: Tree Planter Box & Foliage (31 cubes, Zero Z-Fighting Certified)
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
  forest: { woodPlankDark: 0x78350f, woodDarkEdge: 0x451a03, fertileSoil: 0x27170a, treeTrunk: 0x5c3217, greenLeaf: 0x16a34a, greenAccent: 0x4ade80 },
  winter: { woodPlankDark: 0x475569, woodDarkEdge: 0x334155, fertileSoil: 0x1e293b, treeTrunk: 0x475569, greenLeaf: 0x0f766e, greenAccent: 0xf8fafc },
  desert: { woodPlankDark: 0x92400e, woodDarkEdge: 0x78350f, fertileSoil: 0x451a03, treeTrunk: 0x78350f, greenLeaf: 0xa16207, greenAccent: 0xca8a04 },
  neon: { woodPlankDark: 0x1e1b4b, woodDarkEdge: 0x0f172a, fertileSoil: 0x020617, treeTrunk: 0x312e81, greenLeaf: 0x06b6d4, greenAccent: 0xd946ef },
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
  forest: { limeFoliage: 0x84cc16, greenAccent: 0x4ade80 },
  winter: { limeFoliage: 0xdbeafe, greenAccent: 0xf8fafc },
  desert: { limeFoliage: 0xb45309, greenAccent: 0xfde047 },
  neon: { limeFoliage: 0x7e22ce, greenAccent: 0xec4899 },
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

export function populateHedgeBuilder(b: VoxelMeshBuilder, biome: BiomeType = 'forest'): void {
  const pal = HEDGE_PALETTES[biome] ?? HEDGE_PALETTES.forest;
  for (let i = 0; i < HEDGE_GEO.length; i++) {
    const d = HEDGE_GEO[i];
    const col = pal[d[6]] ?? 0x84cc16;
    b.addBox(d[0], d[1], d[2], d[3], d[4], d[5], col);
  }
}
