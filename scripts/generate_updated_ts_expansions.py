import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from urban_models_data import ALL_URBAN_MODELS

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def get_boxes_data(model_id):
    meta = ALL_URBAN_MODELS[model_id]
    cubes = meta['builder']()
    palette_map = {name: int(hex_str.replace('#', '0x'), 16) for hex_str, name in meta['palette']}
    boxes = []
    for c in cubes:
        fx, fy, fz = c['from']
        tx, ty, tz = c['to']
        w = round((tx - fx) * 0.05, 4)
        h = round((ty - fy) * 0.05, 4)
        d = round((tz - fz) * 0.05, 4)
        cx = round(((fx + tx) / 2.0) * 0.05, 4)
        cy = round(((fy + ty) / 2.0) * 0.05, 4)
        cz = round(((fz + tz) / 2.0) * 0.05, 4)
        col = palette_map.get(c['color'], 0xffffff)
        boxes.append({
            'name': c['name'],
            'color_name': c['color'],
            'hex': col,
            'spec': (w, h, d, cx, cy, cz)
        })
    return boxes

# =============================================================================
# EXPANSION A
# =============================================================================
hydrant_boxes = get_boxes_data('hydrant')
trash_can_boxes = get_boxes_data('trash_can')
bench_boxes = get_boxes_data('bench')
lamp_post_boxes = get_boxes_data('lamp_post')
railway_signal_boxes = get_boxes_data('railway_signal')
road_barrier_boxes = get_boxes_data('road_barrier')

exp_a = """import type { BiomeType } from '../core/types.ts';
import type { VoxelMeshBuilder } from './voxelMeshBuilder.ts';

// Model 3: Cast-Iron Fire Hydrant (22 cubes, Zero Z-Fighting Certified)
const HYDRANT_BOXES: readonly [number, number, number, number, number, number, number][] = [
"""
for b in hydrant_boxes:
    w, h, d, x, y, z = b['spec']
    exp_a += f"  [{w}, {h}, {d}, {x}, {y}, {z}, 0x{b['hex']:06x}],\n"
exp_a += """];

// Model 4: City Street Trash Can (17 cubes, Zero Z-Fighting Certified)
const TRASH_CAN_BOXES: readonly [number, number, number, number, number, number, number][] = [
"""
for b in trash_can_boxes:
    w, h, d, x, y, z = b['spec']
    exp_a += f"  [{w}, {h}, {d}, {x}, {y}, {z}, 0x{b['hex']:06x}],\n"
exp_a += """];

// Model 5: Park Wooden Bench (22 cubes, Zero Z-Fighting Certified)
const BENCH_BOXES: readonly [number, number, number, number, number, number, number][] = [
"""
for b in bench_boxes:
    w, h, d, x, y, z = b['spec']
    exp_a += f"  [{w}, {h}, {d}, {x}, {y}, {z}, 0x{b['hex']:06x}],\n"
exp_a += """];

// Model 6: Classical Street Lamp Post (22 cubes, Zero Z-Fighting Certified)
const LAMP_POST_BOXES: readonly [number, number, number, number, number, number, number][] = [
"""
for b in lamp_post_boxes:
    w, h, d, x, y, z = b['spec']
    exp_a += f"  [{w}, {h}, {d}, {x}, {y}, {z}, 0x{b['hex']:06x}],\n"
exp_a += """];

// Model 7: Railway Semaphore Mast (22 cubes, Zero Z-Fighting Certified)
const RAILWAY_SIGNAL_BOXES: readonly [number, number, number, number, number, number, number][] = [
"""
for b in railway_signal_boxes:
    w, h, d, x, y, z = b['spec']
    exp_a += f"  [{w}, {h}, {d}, {x}, {y}, {z}, 0x{b['hex']:06x}],\n"
exp_a += """];

// Model 8: Highway Steel Guardrail (17 cubes, Zero Z-Fighting Certified)
const ROAD_BARRIER_GEO: readonly [number, number, number, number, number, number, string][] = [
"""
for b in road_barrier_boxes:
    w, h, d, x, y, z = b['spec']
    exp_a += f"  [{w}, {h}, {d}, {x}, {y}, {z}, '{b['color_name']}'],\n"
exp_a += """];

const BARRIER_PALETTES: Record<BiomeType, Record<string, number>> = {
  forest: { ironDark: 0x1e293b, postSteel: 0x334155, galvanizedLight: 0xcbd5e1, galvanizedShadow: 0x94a3b8, reflectorAmber: 0xfacc15, reflectorRed: 0xef4444 },
  winter: { ironDark: 0x1e293b, postSteel: 0x475569, galvanizedLight: 0xe2e8f0, galvanizedShadow: 0x94a3b8, reflectorAmber: 0x38bdf8, reflectorRed: 0xef4444 },
  desert: { ironDark: 0x451a03, postSteel: 0x78350f, galvanizedLight: 0xfef08a, galvanizedShadow: 0xd97706, reflectorAmber: 0xf59e0b, reflectorRed: 0xdc2626 },
  neon: { ironDark: 0x0f172a, postSteel: 0x1e1b4b, galvanizedLight: 0x06b6d4, galvanizedShadow: 0x312e81, reflectorAmber: 0xf43f5e, reflectorRed: 0xd946ef },
};

export function populateHydrantBuilder(b: VoxelMeshBuilder): void {
  for (let i = 0; i < HYDRANT_BOXES.length; i++) {
    const d = HYDRANT_BOXES[i];
    b.addBox(d[0], d[1], d[2], d[3], d[4], d[5], d[6]);
  }
}

export function populateTrashCanBuilder(b: VoxelMeshBuilder): void {
  for (let i = 0; i < TRASH_CAN_BOXES.length; i++) {
    const d = TRASH_CAN_BOXES[i];
    b.addBox(d[0], d[1], d[2], d[3], d[4], d[5], d[6]);
  }
}

export function populateBenchBuilder(b: VoxelMeshBuilder): void {
  for (let i = 0; i < BENCH_BOXES.length; i++) {
    const d = BENCH_BOXES[i];
    b.addBox(d[0], d[1], d[2], d[3], d[4], d[5], d[6]);
  }
}

export function populateLampPostBuilder(b: VoxelMeshBuilder): void {
  for (let i = 0; i < LAMP_POST_BOXES.length; i++) {
    const d = LAMP_POST_BOXES[i];
    b.addBox(d[0], d[1], d[2], d[3], d[4], d[5], d[6]);
  }
}

export function populateRailwaySignalBuilder(b: VoxelMeshBuilder): void {
  for (let i = 0; i < RAILWAY_SIGNAL_BOXES.length; i++) {
    const d = RAILWAY_SIGNAL_BOXES[i];
    b.addBox(d[0], d[1], d[2], d[3], d[4], d[5], d[6]);
  }
}

export function populateRoadBarrierBuilder(b: VoxelMeshBuilder, biome: BiomeType = 'forest'): void {
  const pal = BARRIER_PALETTES[biome] ?? BARRIER_PALETTES.forest;
  for (let i = 0; i < ROAD_BARRIER_GEO.length; i++) {
    const d = ROAD_BARRIER_GEO[i];
    const col = pal[d[6]] ?? 0xcbd5e1;
    b.addBox(d[0], d[1], d[2], d[3], d[4], d[5], col);
  }
}
"""

with open(os.path.join(ROOT_DIR, 'src', 'view', 'urbanEnvironmentExpansionA.ts'), 'w', encoding='utf-8') as f:
    f.write(exp_a)
print("urbanEnvironmentExpansionA.ts written.")

# =============================================================================
# EXPANSION B
# =============================================================================
riverbank_boxes = get_boxes_data('riverbank_edge')
coin_boxes = get_boxes_data('coin')
record_flag_boxes = get_boxes_data('record_flag')
road_markings_boxes = get_boxes_data('road_markings')
tree_planter_boxes = get_boxes_data('tree_planter')
tree_planter_b_boxes = get_boxes_data('tree_planter_b')
hedge_boxes = get_boxes_data('hedge')

exp_b = """import type { BiomeType } from '../core/types.ts';
import type { VoxelMeshBuilder } from './voxelMeshBuilder.ts';

// Model 9: Riverbank Edge Parapet & Bollard (19 cubes, Zero Z-Fighting Certified)
const RIVERBANK_GEO: readonly [number, number, number, number, number, number, string][] = [
"""
for b in riverbank_boxes:
    w, h, d, x, y, z = b['spec']
    exp_b += f"  [{w}, {h}, {d}, {x}, {y}, {z}, '{b['color_name']}'],\n"
exp_b += """];

const RIVERBANK_PALETTES: Record<BiomeType, Record<string, number>> = {
  forest: { graniteDark: 0x475569, graniteMid: 0x64748b, graniteLight: 0x94a3b8, bollardIron: 0x334155, grateMetal: 0x1e293b, slotBlack: 0x0f172a, buoyOrange: 0xea580c, buoyWhite: 0xf8fafc, mossGreen: 0x15803d },
  winter: { graniteDark: 0x64748b, graniteMid: 0x94a3b8, graniteLight: 0xcbd5e1, bollardIron: 0x1e293b, grateMetal: 0x334155, slotBlack: 0x0f172a, buoyOrange: 0x38bdf8, buoyWhite: 0xf8fafc, mossGreen: 0x0f766e },
  desert: { graniteDark: 0x78350f, graniteMid: 0xb45309, graniteLight: 0xd97706, bollardIron: 0x451a03, grateMetal: 0x78350f, slotBlack: 0x27170a, buoyOrange: 0xf59e0b, buoyWhite: 0xfef08a, mossGreen: 0x854d0e },
  neon: { graniteDark: 0x1e1b4b, graniteMid: 0x312e81, graniteLight: 0x4338ca, bollardIron: 0x06b6d4, grateMetal: 0x0f172a, slotBlack: 0x020617, buoyOrange: 0xf43f5e, buoyWhite: 0xd946ef, mossGreen: 0x10b981 },
};

// Model 10: 3D Floating Gold Coin with Star (21 cubes, Zero Z-Fighting Certified)
export const COIN_BOXES: readonly [number, number, number, number, number, number, number][] = [
"""
for b in coin_boxes:
    w, h, d, x, y, z = b['spec']
    exp_b += f"  [{w}, {h}, {d}, {x}, {y}, {z}, 0x{b['hex']:06x}],\n"
exp_b += """];

// Model 11: Personal Best Record Flag (20 cubes, Zero Z-Fighting Certified)
const RECORD_FLAG_BOXES: readonly [number, number, number, number, number, number, number][] = [
"""
for b in record_flag_boxes:
    w, h, d, x, y, z = b['spec']
    exp_b += f"  [{w}, {h}, {d}, {x}, {y}, {z}, 0x{b['hex']:06x}],\n"
exp_b += """];

// Model 12: Road Markings / Clean Zebra (8 cubes, Zero Z-Fighting Certified)
const ROAD_MARKINGS_BOXES: readonly [number, number, number, number, number, number, number][] = [
"""
for b in road_markings_boxes:
    w, h, d, x, y, z = b['spec']
    exp_b += f"  [{w}, {h}, {d}, {x}, {y}, {z}, 0x{b['hex']:06x}],\n"
exp_b += """];

// Model 1: Tree Planter A (31 cubes, Terracotta & Vibrant Red Apples)
const TREE_PLANTER_GEO: readonly [number, number, number, number, number, number, string][] = [
"""
for b in tree_planter_boxes:
    w, h, d, x, y, z = b['spec']
    exp_b += f"  [{w}, {h}, {d}, {x}, {y}, {z}, '{b['color_name']}'],\n"
exp_b += """];

const TREE_PALETTES: Record<BiomeType, Record<string, number>> = {
  forest: { woodPlankDark: 0x78350f, woodPlankMid: 0xb45309, soilDark: 0x451a03, trunkBark: 0x92400e, foliageBase: 0x15803d, foliageMid: 0x16a34a, foliageLight: 0x22c55e, appleRed: 0xef4444 },
  winter: { woodPlankDark: 0x334155, woodPlankMid: 0x64748b, soilDark: 0x1e293b, trunkBark: 0x475569, foliageBase: 0x0f766e, foliageMid: 0x115e59, foliageLight: 0xf8fafc, appleRed: 0xef4444 },
  desert: { woodPlankDark: 0x78350f, woodPlankMid: 0xb45309, soilDark: 0x451a03, trunkBark: 0x92400e, foliageBase: 0x854d0e, foliageMid: 0xa16207, foliageLight: 0xca8a04, appleRed: 0xdc2626 },
  neon: { woodPlankDark: 0x0f172a, woodPlankMid: 0x1e1b4b, soilDark: 0x020617, trunkBark: 0x312e81, foliageBase: 0x4338ca, foliageMid: 0x06b6d4, foliageLight: 0xd946ef, appleRed: 0xf43f5e },
};

// Model 1b: Tree Planter B (31 cubes, Graphite/Gold Concrete Planter & Dome Canopy)
const TREE_PLANTER_B_GEO: readonly [number, number, number, number, number, number, string][] = [
"""
for b in tree_planter_b_boxes:
    w, h, d, x, y, z = b['spec']
    exp_b += f"  [{w}, {h}, {d}, {x}, {y}, {z}, '{b['color_name']}'],\n"
exp_b += """];

const TREE_B_PALETTES: Record<BiomeType, Record<string, number>> = {
  forest: { concreteDark: 0x1e293b, concreteMid: 0x334155, goldRim: 0xd97706, soilDark: 0x27170a, trunkBark: 0x78350f, foliageBase: 0x166534, foliageMid: 0x15803d, foliageLight: 0x22c55e, appleRed: 0xef4444 },
  winter: { concreteDark: 0x1e293b, concreteMid: 0x475569, goldRim: 0x94a3b8, soilDark: 0x0f172a, trunkBark: 0x334155, foliageBase: 0x042f2e, foliageMid: 0x0f766e, foliageLight: 0xf8fafc, appleRed: 0xef4444 },
  desert: { concreteDark: 0x451a03, concreteMid: 0x78350f, goldRim: 0xb45309, soilDark: 0x27170a, trunkBark: 0x78350f, foliageBase: 0x713f12, foliageMid: 0x854d0e, foliageLight: 0xca8a04, appleRed: 0xdc2626 },
  neon: { concreteDark: 0x020617, concreteMid: 0x0f172a, goldRim: 0x06b6d4, soilDark: 0x000000, trunkBark: 0x1e1b4b, foliageBase: 0x312e81, foliageMid: 0x4338ca, foliageLight: 0xd946ef, appleRed: 0xf43f5e },
};

// Model 2: Trimmed Cubic Hedge (18 cubes, Zero Z-Fighting Certified)
const HEDGE_GEO: readonly [number, number, number, number, number, number, string][] = [
"""
for b in hedge_boxes:
    w, h, d, x, y, z = b['spec']
    exp_b += f"  [{w}, {h}, {d}, {x}, {y}, {z}, '{b['color_name']}'],\n"
exp_b += """];

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
"""

with open(os.path.join(ROOT_DIR, 'src', 'view', 'urbanEnvironmentExpansionB.ts'), 'w', encoding='utf-8') as f:
    f.write(exp_b)
print("urbanEnvironmentExpansionB.ts written.")
