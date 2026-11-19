import json
import math
import os
import sys

# Add scripts directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from blockbench_coplanar_check import blockbench_check

def check_quantization(cubes):
    errors = []
    for c in cubes:
        for ax in range(3):
            f_val = c['from'][ax]
            t_val = c['to'][ax]
            if abs(f_val * 20 - round(f_val * 20)) > 1e-4:
                errors.append(f"{c['name']} from[{ax}]={f_val}")
            if abs(t_val * 20 - round(t_val * 20)) > 1e-4:
                errors.append(f"{c['name']} to[{ax}]={t_val}")
    return errors

def check_connectivity(cubes, expected_min_y=0.0):
    n = len(cubes)
    adj = {i: set() for i in range(n)}
    tol = 0.30
    for i in range(n):
        c1 = cubes[i]
        f1, t1 = c1['from'], c1['to']
        for j in range(i + 1, n):
            c2 = cubes[j]
            f2, t2 = c2['from'], c2['to']
            ox = min(t1[0], t2[0]) - max(f1[0], f2[0])
            oy = min(t1[1], t2[1]) - max(f1[1], f2[1])
            oz = min(t1[2], t2[2]) - max(f1[2], f2[2])
            if ox >= -tol and oy >= -tol and oz >= -tol:
                adj[i].add(j)
                adj[j].add(i)

    grounded_idx = [i for i, c in enumerate(cubes) if abs(c['from'][1] - expected_min_y) < 1e-4]
    if not grounded_idx:
        return set()

    visited = set()
    queue = list(grounded_idx)
    for g in queue:
        visited.add(g)
    while queue:
        curr = queue.pop(0)
        for nbr in adj[curr]:
            if nbr not in visited:
                visited.add(nbr)
                queue.append(nbr)
    return visited

def check_enclosed(cubes):
    enclosed = []
    for i, c1 in enumerate(cubes):
        f1, t1 = c1['from'], c1['to']
        for j, c2 in enumerate(cubes):
            if i == j: continue
            f2, t2 = c2['from'], c2['to']
            if f2[0] <= f1[0] and t2[0] >= t1[0] and f2[1] <= f1[1] and t2[1] >= t1[1] and f2[2] <= f1[2] and t2[2] >= t1[2]:
                enclosed.append((c1['name'], c2['name']))
    return enclosed

# Registry of models
# =============================================================================
# 1. TREE PLANTER (25–35 cubes, 16×36×16, min_y = 0.00)
# =============================================================================
def build_tree_planter():
    cubes = [
        # 4 Corner Feet (Grounded min_y = 0.00)
        {"name": "leg_fl", "group": "planter_base", "from": [-7.85, 0.00, -7.85], "to": [-5.85, 2.00, -5.85], "color": "woodPlankDark", "col_idx": 0},
        {"name": "leg_fr", "group": "planter_base", "from": [5.85, 0.00, -7.85], "to": [7.85, 2.00, -5.85], "color": "woodPlankDark", "col_idx": 0},
        {"name": "leg_bl", "group": "planter_base", "from": [-7.85, 0.00, 5.85], "to": [-5.85, 2.00, 7.85], "color": "woodPlankDark", "col_idx": 0},
        {"name": "leg_br", "group": "planter_base", "from": [5.85, 0.00, 5.85], "to": [7.85, 2.00, 7.85], "color": "woodPlankDark", "col_idx": 0},
        # Planter Bottom Plinth
        {"name": "planter_bottom", "group": "planter_base", "from": [-7.65, 1.90, -7.65], "to": [7.65, 3.20, 7.65], "color": "woodPlankMid", "col_idx": 1},
        # 4 Walls
        {"name": "wall_front", "group": "planter_walls", "from": [-7.90, 3.10, -7.90], "to": [7.90, 10.00, -6.10], "color": "woodPlankMid", "col_idx": 1},
        {"name": "wall_back", "group": "planter_walls", "from": [-7.90, 3.10, 6.10], "to": [7.90, 10.00, 7.90], "color": "woodPlankMid", "col_idx": 1},
        {"name": "wall_left", "group": "planter_walls", "from": [-7.90, 3.10, -6.20], "to": [-6.10, 10.00, 6.20], "color": "woodPlankMid", "col_idx": 1},
        {"name": "wall_right", "group": "planter_walls", "from": [6.10, 3.10, -6.20], "to": [7.90, 10.00, 6.20], "color": "woodPlankMid", "col_idx": 1},
        # Top Rim Collar (4 segments)
        {"name": "rim_front", "group": "planter_walls", "from": [-8.00, 9.90, -8.00], "to": [8.00, 11.20, -5.90], "color": "woodPlankDark", "col_idx": 0},
        {"name": "rim_back", "group": "planter_walls", "from": [-8.00, 9.90, 5.90], "to": [8.00, 11.20, 8.00], "color": "woodPlankDark", "col_idx": 0},
        {"name": "rim_left", "group": "planter_walls", "from": [-8.00, 9.90, -6.00], "to": [-5.90, 11.20, 6.00], "color": "woodPlankDark", "col_idx": 0},
        {"name": "rim_right", "group": "planter_walls", "from": [5.90, 9.90, -6.00], "to": [8.00, 11.20, 6.00], "color": "woodPlankDark", "col_idx": 0},
        # Soil Bed & Trunk
        {"name": "soil_bed", "group": "soil_trunk", "from": [-6.00, 9.00, -6.00], "to": [6.00, 10.60, 6.00], "color": "soilDark", "col_idx": 2},
        {"name": "trunk_stem", "group": "soil_trunk", "from": [-1.45, 10.50, -1.45], "to": [1.45, 18.00, 1.45], "color": "trunkBark", "col_idx": 3},
        # Tier 1 Foliage (Lower canopy)
        {"name": "foliage_t1_core", "group": "foliage_lower", "from": [-6.85, 17.80, -6.85], "to": [6.85, 23.20, 6.85], "color": "foliageBase", "col_idx": 4},
        {"name": "foliage_t1_front", "group": "foliage_lower", "from": [-5.45, 18.40, -7.85], "to": [5.45, 22.60, -6.75], "color": "foliageBase", "col_idx": 4},
        {"name": "foliage_t1_back", "group": "foliage_lower", "from": [-5.45, 18.40, 6.75], "to": [5.45, 22.60, 7.85], "color": "foliageBase", "col_idx": 4},
        {"name": "foliage_t1_left", "group": "foliage_lower", "from": [-7.85, 18.40, -5.45], "to": [-6.75, 22.60, 5.45], "color": "foliageBase", "col_idx": 4},
        {"name": "foliage_t1_right", "group": "foliage_lower", "from": [6.75, 18.40, -5.45], "to": [7.85, 22.60, 5.45], "color": "foliageBase", "col_idx": 4},
        # Tier 2 Foliage (Mid canopy)
        {"name": "foliage_t2_core", "group": "foliage_mid", "from": [-6.15, 23.10, -6.15], "to": [6.15, 29.50, 6.15], "color": "foliageMid", "col_idx": 5},
        {"name": "foliage_t2_front", "group": "foliage_mid", "from": [-4.65, 24.00, -7.15], "to": [4.65, 28.50, -6.05], "color": "foliageMid", "col_idx": 5},
        {"name": "foliage_t2_back", "group": "foliage_mid", "from": [-4.65, 24.00, 6.05], "to": [4.65, 28.50, 7.15], "color": "foliageMid", "col_idx": 5},
        {"name": "foliage_t2_left", "group": "foliage_mid", "from": [-7.15, 24.00, -4.65], "to": [-6.05, 28.50, 4.65], "color": "foliageMid", "col_idx": 5},
        {"name": "foliage_t2_right", "group": "foliage_mid", "from": [6.05, 24.00, -4.65], "to": [7.15, 28.50, 4.65], "color": "foliageMid", "col_idx": 5},
        # Tier 3 Foliage (Crown & Accents)
        {"name": "foliage_t3_core", "group": "foliage_crown", "from": [-4.25, 29.40, -4.25], "to": [4.25, 34.60, 4.25], "color": "foliageLight", "col_idx": 6},
        {"name": "foliage_t3_top", "group": "foliage_crown", "from": [-2.45, 34.50, -2.45], "to": [2.45, 36.00, 2.45], "color": "foliageLight", "col_idx": 6},
        {"name": "fruit_front_l", "group": "foliage_crown", "from": [-3.45, 21.00, -7.95], "to": [-2.05, 22.40, -7.65], "color": "appleRed", "col_idx": 7},
        {"name": "fruit_front_r", "group": "foliage_crown", "from": [2.55, 20.00, -7.95], "to": [3.95, 21.40, -7.65], "color": "appleRed", "col_idx": 7},
        {"name": "fruit_right_side", "group": "foliage_crown", "from": [7.05, 25.50, -2.45], "to": [7.35, 26.90, -1.05], "color": "appleRed", "col_idx": 7},
        {"name": "fruit_left_side", "group": "foliage_crown", "from": [-7.35, 26.00, 1.25], "to": [-7.05, 27.40, 2.65], "color": "appleRed", "col_idx": 7},
    ]
    return cubes

# =============================================================================
# 2. HEDGE (15–25 cubes, 14×12×14, min_y = 0.00)
# =============================================================================
def build_hedge():
    cubes = [
        # Ground Curb Base (Grounded min_y = 0.00)
        {"name": "curb_base", "group": "hedge_base", "from": [-6.85, 0.00, -6.85], "to": [6.85, 1.20, 6.85], "color": "hedgeDark", "col_idx": 0},
        # Main Hedge Core
        {"name": "hedge_core", "group": "hedge_core", "from": [-6.35, 1.10, -6.35], "to": [6.35, 10.40, 6.35], "color": "hedgeMid", "col_idx": 1},
        # Top Trimmed Crown
        {"name": "hedge_top_trim", "group": "hedge_top", "from": [-5.25, 10.30, -5.25], "to": [5.25, 11.60, 5.25], "color": "hedgeLight", "col_idx": 2},
        {"name": "hedge_top_peak", "group": "hedge_top", "from": [-3.15, 11.50, -3.15], "to": [3.15, 12.00, 3.15], "color": "hedgeLight", "col_idx": 2},
        # 8 Stepped Facets (Manicured hedge facets)
        {"name": "facet_front_low", "group": "hedge_facets", "from": [-5.75, 2.00, -6.95], "to": [5.75, 5.80, -6.25], "color": "hedgeDark", "col_idx": 0},
        {"name": "facet_front_high", "group": "hedge_facets", "from": [-4.65, 5.70, -6.85], "to": [4.65, 9.40, -6.25], "color": "hedgeMid", "col_idx": 1},
        {"name": "facet_back_low", "group": "hedge_facets", "from": [-5.75, 2.00, 6.25], "to": [5.75, 5.80, 6.95], "color": "hedgeDark", "col_idx": 0},
        {"name": "facet_back_high", "group": "hedge_facets", "from": [-4.65, 5.70, 6.25], "to": [4.65, 9.40, 6.85], "color": "hedgeMid", "col_idx": 1},
        {"name": "facet_left_low", "group": "hedge_facets", "from": [-6.95, 2.00, -5.75], "to": [-6.25, 5.80, 5.75], "color": "hedgeDark", "col_idx": 0},
        {"name": "facet_left_high", "group": "hedge_facets", "from": [-6.85, 5.70, -4.65], "to": [-6.25, 9.40, 4.65], "color": "hedgeMid", "col_idx": 1},
        {"name": "facet_right_low", "group": "hedge_facets", "from": [6.25, 2.00, -5.75], "to": [6.95, 5.80, 5.75], "color": "hedgeDark", "col_idx": 0},
        {"name": "facet_right_high", "group": "hedge_facets", "from": [6.25, 5.70, -4.65], "to": [6.85, 9.40, 4.65], "color": "hedgeMid", "col_idx": 1},
        # Accent Buds & Blossoms (6 cubes)
        {"name": "bud_front_left", "group": "hedge_buds", "from": [-5.15, 6.50, -7.00], "to": [-3.95, 7.70, -6.70], "color": "leafLime", "col_idx": 3},
        {"name": "bud_front_right", "group": "hedge_buds", "from": [2.85, 4.20, -7.00], "to": [4.05, 5.40, -6.70], "color": "leafLime", "col_idx": 3},
        {"name": "bud_back_left", "group": "hedge_buds", "from": [-4.15, 3.80, 6.70], "to": [-2.95, 5.00, 7.00], "color": "leafLime", "col_idx": 3},
        {"name": "bud_back_right", "group": "hedge_buds", "from": [3.15, 7.00, 6.70], "to": [4.35, 8.20, 7.00], "color": "leafLime", "col_idx": 3},
        {"name": "blossom_top_1", "group": "hedge_buds", "from": [-2.15, 11.80, 0.45], "to": [-0.95, 12.00, 1.65], "color": "blossomYellow", "col_idx": 4},
        {"name": "blossom_top_2", "group": "hedge_buds", "from": [1.25, 11.80, -1.85], "to": [2.45, 12.00, -0.65], "color": "blossomYellow", "col_idx": 4},
    ]
    return cubes

MODELS_GENERATORS = {
    "tree_planter": {
        "builder": build_tree_planter,
        "budget": (25, 35),
        "dims": (16, 36, 16),
        "min_y": 0.0,
        "palette": [
            ("#78350f", "woodPlankDark"),
            ("#92400e", "woodPlankMid"),
            ("#451a03", "soilDark"),
            ("#b45309", "trunkBark"),
            ("#15803d", "foliageBase"),
            ("#16a34a", "foliageMid"),
            ("#22c55e", "foliageLight"),
            ("#ef4444", "appleRed"),
        ],
        "groups": ["planter_base", "planter_walls", "soil_trunk", "foliage_lower", "foliage_mid", "foliage_crown"]
    },
    "hedge": {
        "builder": build_hedge,
        "budget": (15, 25),
        "dims": (14, 12, 14),
        "min_y": 0.0,
        "palette": [
            ("#166534", "hedgeDark"),
            ("#15803d", "hedgeMid"),
            ("#22c55e", "hedgeLight"),
            ("#84cc16", "leafLime"),
            ("#facc15", "blossomYellow"),
        ],
        "groups": ["hedge_base", "hedge_core", "hedge_top", "hedge_facets", "hedge_buds"]
    }
}

