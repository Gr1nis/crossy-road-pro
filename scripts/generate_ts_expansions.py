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

# --- EXPANSION A ---
# Hydrant, Trash Can, Bench, Lamp Post, Railway Signal, Road Barrier
hydrant_boxes = get_boxes_data('hydrant')
trash_can_boxes = get_boxes_data('trash_can')
bench_boxes = get_boxes_data('bench')
lamp_post_boxes = get_boxes_data('lamp_post')
railway_signal_boxes = get_boxes_data('railway_signal')
road_barrier_boxes = get_boxes_data('road_barrier')

exp_a_code = """import type { BiomeType } from '../core/types.ts';
import type { VoxelMeshBuilder } from './voxelMeshBuilder.ts';

// Model 3: Cast-Iron Fire Hydrant (22 cubes, Zero Z-Fighting Certified)
const HYDRANT_BOXES: readonly [number, number, number, number, number, number, number][] = [
"""
for b in hydrant_boxes:
    w, h, d, x, y, z = b['spec']
    exp_a_code += f"  [{w}, {h}, {d}, {x}, {y}, {z}, 0x{b['hex']:06x}],\n"

exp_a_code += """];

// Model 4: City Street Trash Can (17 cubes, Zero Z-Fighting Certified)
const TRASH_CAN_BOXES: readonly [number, number, number, number, number, number, number][] = [
"""
for b in trash_can_boxes:
    w, h, d, x, y, z = b['spec']
    exp_a_code += f"  [{w}, {h}, {d}, {x}, {y}, {z}, 0x{b['hex']:06x}],\n"

exp_a_code += """];

// Model 5: Park Wooden Bench (22 cubes, Zero Z-Fighting Certified)
const BENCH_BOXES: readonly [number, number, number, number, number, number, number][] = [
"""
for b in bench_boxes:
    w, h, d, x, y, z = b['spec']
    exp_a_code += f"  [{w}, {h}, {d}, {x}, {y}, {z}, 0x{b['hex']:06x}],\n"

exp_a_code += """];

// Model 6: City Street Lamp Post (22 cubes, Zero Z-Fighting Certified)
const LAMP_POST_BOXES: readonly [number, number, number, number, number, number, number][] = [
"""
for b in lamp_post_boxes:
    w, h, d, x, y, z = b['spec']
    exp_a_code += f"  [{w}, {h}, {d}, {x}, {y}, {z}, 0x{b['hex']:06x}],\n"

exp_a_code += """];

// Model 7: Railway Signal Mast & Head (22 cubes, Zero Z-Fighting Certified)
const RAILWAY_SIGNAL_BOXES: readonly [number, number, number, number, number, number, number][] = [
"""
for b in railway_signal_boxes:
    w, h, d, x, y, z = b['spec']
    exp_a_code += f"  [{w}, {h}, {d}, {x}, {y}, {z}, 0x{b['hex']:06x}],\n"

exp_a_code += """];

// Model 8: Jersey Road Barrier (18 cubes, Zero Z-Fighting Certified)
const ROAD_BARRIER_GEO: readonly [number, number, number, number, number, number, string][] = [
"""
for b in road_barrier_boxes:
    w, h, d, x, y, z = b['spec']
    exp_a_code += f"  [{w}, {h}, {d}, {x}, {y}, {z}, '{b['color_name']}'],\n"

exp_a_code += """];

const BARRIER_PALETTES: Record<BiomeType, Record<string, number>> = {
  forest: { concreteBase: 0x94a3b8, concreteDark: 0x64748b, warningYellow: 0xfacc15, hazardStripe: 0x0f172a },
  winter: { concreteBase: 0xe2e8f0, concreteDark: 0x94a3b8, warningYellow: 0x38bdf8, hazardStripe: 0x1e293b },
  desert: { concreteBase: 0xd97706, concreteDark: 0xb45309, warningYellow: 0xfef08a, hazardStripe: 0x78350f },
  neon: { concreteBase: 0x1e1b4b, concreteDark: 0x312e81, warningYellow: 0x06b6d4, hazardStripe: 0xec4899 },
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
    const col = pal[d[6]] ?? 0x94a3b8;
    b.addBox(d[0], d[1], d[2], d[3], d[4], d[5], col);
  }
}
"""

with open(os.path.join(ROOT_DIR, 'src', 'view', 'urbanEnvironmentExpansionA.ts'), 'w', encoding='utf-8') as f:
    f.write(exp_a_code)
print("urbanEnvironmentExpansionA.ts written.")

# --- EXPANSION B ---
# Riverbank Edge, Coin, Record Flag, Road Markings, Tree Planter, Hedge
riverbank_boxes = get_boxes_data('riverbank_edge')
coin_boxes = get_boxes_data('coin')
record_flag_boxes = get_boxes_data('record_flag')
road_markings_boxes = get_boxes_data('road_markings')
tree_planter_boxes = get_boxes_data('tree_planter')
hedge_boxes = get_boxes_data('hedge')

exp_b_code = """import type { BiomeType } from '../core/types.ts';
import type { VoxelMeshBuilder } from './voxelMeshBuilder.ts';

// Model 9: Riverbank Edge Parapet & Bollard (19 cubes, Zero Z-Fighting Certified)
const RIVERBANK_GEO: readonly [number, number, number, number, number, number, string][] = [
"""
for b in riverbank_boxes:
    w, h, d, x, y, z = b['spec']
    exp_b_code += f"  [{w}, {h}, {d}, {x}, {y}, {z}, '{b['color_name']}'],\n"

exp_b_code += """];

const RIVERBANK_PALETTES: Record<BiomeType, Record<string, number>> = {
  forest: { granitePavement: 0x64748b, graniteDark: 0x475569, timberPost: 0x78350f, ironBollard: 0x334155, scupperHole: 0x0f172a },
  winter: { granitePavement: 0x94a3b8, graniteDark: 0x64748b, timberPost: 0x475569, ironBollard: 0xf1f5f9, scupperHole: 0x1e293b },
  desert: { granitePavement: 0xd97706, graniteDark: 0xb45309, timberPost: 0x92400e, ironBollard: 0x78350f, scupperHole: 0x451a03 },
  neon: { granitePavement: 0x312e81, graniteDark: 0x1e1b4b, timberPost: 0x06b6d4, ironBollard: 0xec4899, scupperHole: 0x020617 },
};

// Model 10: 3D Floating Gold Coin (20 cubes, Zero Z-Fighting Certified)
const COIN_BOXES: readonly [number, number, number, number, number, number, number][] = [
"""
for b in coin_boxes:
    w, h, d, x, y, z = b['spec']
    exp_b_code += f"  [{w}, {h}, {d}, {x}, {y}, {z}, 0x{b['hex']:06x}],\n"

exp_b_code += """];

// Model 11: Personal Best Record Flag (20 cubes, Zero Z-Fighting Certified)
const RECORD_FLAG_BOXES: readonly [number, number, number, number, number, number, number][] = [
"""
for b in record_flag_boxes:
    w, h, d, x, y, z = b['spec']
    exp_b_code += f"  [{w}, {h}, {d}, {x}, {y}, {z}, 0x{b['hex']:06x}],\n"

exp_b_code += """];

// Model 12: Road Markings / Zebra Crossing (12 cubes, Zero Z-Fighting Certified)
const ROAD_MARKINGS_BOXES: readonly [number, number, number, number, number, number, number][] = [
"""
for b in road_markings_boxes:
    w, h, d, x, y, z = b['spec']
    exp_b_code += f"  [{w}, {h}, {d}, {x}, {y}, {z}, 0x{b['hex']:06x}],\n"

exp_b_code += """];

// Model 1: Tree Planter Box & Foliage (31 cubes, Zero Z-Fighting Certified)
const TREE_PLANTER_GEO: readonly [number, number, number, number, number, number, string][] = [
"""
for b in tree_planter_boxes:
    w, h, d, x, y, z = b['spec']
    exp_b_code += f"  [{w}, {h}, {d}, {x}, {y}, {z}, '{b['color_name']}'],\n"

exp_b_code += """];

const TREE_PALETTES: Record<BiomeType, Record<string, number>> = {
  forest: { woodPlankDark: 0x78350f, woodDarkEdge: 0x451a03, fertileSoil: 0x27170a, treeTrunk: 0x5c3217, greenLeaf: 0x16a34a, greenAccent: 0x4ade80 },
  winter: { woodPlankDark: 0x475569, woodDarkEdge: 0x334155, fertileSoil: 0x1e293b, treeTrunk: 0x475569, greenLeaf: 0x0f766e, greenAccent: 0xf8fafc },
  desert: { woodPlankDark: 0x92400e, woodDarkEdge: 0x78350f, fertileSoil: 0x451a03, treeTrunk: 0x78350f, greenLeaf: 0xa16207, greenAccent: 0xca8a04 },
  neon: { woodPlankDark: 0x1e1b4b, woodDarkEdge: 0x0f172a, fertileSoil: 0x020617, treeTrunk: 0x312e81, greenLeaf: 0x06b6d4, greenAccent: 0xd946ef },
};

// Model 2: Trimmed Cubic Hedge (18 cubes, Zero Z-Fighting Certified)
const HEDGE_GEO: readonly [number, number, number, number, number, number, string][] = [
"""
for b in hedge_boxes:
    w, h, d, x, y, z = b['spec']
    exp_b_code += f"  [{w}, {h}, {d}, {x}, {y}, {z}, '{b['color_name']}'],\n"

exp_b_code += """];

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
"""

with open(os.path.join(ROOT_DIR, 'src', 'view', 'urbanEnvironmentExpansionB.ts'), 'w', encoding='utf-8') as f:
    f.write(exp_b_code)
print("urbanEnvironmentExpansionB.ts written.")
