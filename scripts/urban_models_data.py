"""
Crossy Road Pro — World 1 Environment Voxel Models Generator Data
Stores voxel cube definitions for all 12 urban environment models.
"""

# =============================================================================
# 1. TREE PLANTER (31 cubes, 16×36×16, min_y = 0.00)
# =============================================================================
def build_tree_planter():
    return [
        {"name": "leg_fl", "group": "planter_base", "from": [-7.85, 0.00, -7.85], "to": [-5.85, 2.00, -5.85], "color": "woodPlankDark", "col_idx": 0},
        {"name": "leg_fr", "group": "planter_base", "from": [5.85, 0.00, -7.85], "to": [7.85, 2.00, -5.85], "color": "woodPlankDark", "col_idx": 0},
        {"name": "leg_bl", "group": "planter_base", "from": [-7.85, 0.00, 5.85], "to": [-5.85, 2.00, 7.85], "color": "woodPlankDark", "col_idx": 0},
        {"name": "leg_br", "group": "planter_base", "from": [5.85, 0.00, 5.85], "to": [7.85, 2.00, 7.85], "color": "woodPlankDark", "col_idx": 0},
        {"name": "planter_bottom", "group": "planter_base", "from": [-7.65, 1.90, -7.65], "to": [7.65, 3.20, 7.65], "color": "woodPlankMid", "col_idx": 1},
        {"name": "wall_front", "group": "planter_walls", "from": [-7.90, 3.10, -7.90], "to": [7.90, 10.00, -6.10], "color": "woodPlankMid", "col_idx": 1},
        {"name": "wall_back", "group": "planter_walls", "from": [-7.90, 3.10, 6.10], "to": [7.90, 10.00, 7.90], "color": "woodPlankMid", "col_idx": 1},
        {"name": "wall_left", "group": "planter_walls", "from": [-7.80, 3.10, -6.00], "to": [-6.10, 10.00, 6.00], "color": "woodPlankMid", "col_idx": 1},
        {"name": "wall_right", "group": "planter_walls", "from": [6.10, 3.10, -6.00], "to": [7.80, 10.00, 6.00], "color": "woodPlankMid", "col_idx": 1},
        {"name": "rim_front", "group": "planter_walls", "from": [-8.00, 9.90, -8.00], "to": [8.00, 11.20, -5.90], "color": "woodPlankDark", "col_idx": 0},
        {"name": "rim_back", "group": "planter_walls", "from": [-8.00, 9.90, 5.90], "to": [8.00, 11.20, 8.00], "color": "woodPlankDark", "col_idx": 0},
        {"name": "rim_left", "group": "planter_walls", "from": [-7.90, 9.90, -5.80], "to": [-5.90, 11.20, 5.80], "color": "woodPlankDark", "col_idx": 0},
        {"name": "rim_right", "group": "planter_walls", "from": [5.90, 9.90, -5.80], "to": [7.90, 11.20, 5.80], "color": "woodPlankDark", "col_idx": 0},
        {"name": "soil_bed", "group": "soil_trunk", "from": [-5.70, 9.00, -5.70], "to": [5.70, 10.60, 5.70], "color": "soilDark", "col_idx": 2},
        {"name": "trunk_stem", "group": "soil_trunk", "from": [-1.45, 10.50, -1.45], "to": [1.45, 18.00, 1.45], "color": "trunkBark", "col_idx": 3},
        {"name": "foliage_t1_core", "group": "foliage_lower", "from": [-6.85, 17.80, -6.85], "to": [6.85, 23.20, 6.85], "color": "foliageBase", "col_idx": 4},
        {"name": "foliage_t1_front", "group": "foliage_lower", "from": [-5.45, 18.40, -7.85], "to": [5.45, 22.60, -6.75], "color": "foliageBase", "col_idx": 4},
        {"name": "foliage_t1_back", "group": "foliage_lower", "from": [-5.45, 18.40, 6.75], "to": [5.45, 22.60, 7.85], "color": "foliageBase", "col_idx": 4},
        {"name": "foliage_t1_left", "group": "foliage_lower", "from": [-7.85, 18.40, -5.45], "to": [-6.75, 22.60, 5.45], "color": "foliageBase", "col_idx": 4},
        {"name": "foliage_t1_right", "group": "foliage_lower", "from": [6.75, 18.40, -5.45], "to": [7.85, 22.60, 5.45], "color": "foliageBase", "col_idx": 4},
        {"name": "foliage_t2_core", "group": "foliage_mid", "from": [-6.15, 23.10, -6.15], "to": [6.15, 29.50, 6.15], "color": "foliageMid", "col_idx": 5},
        {"name": "foliage_t2_front", "group": "foliage_mid", "from": [-4.65, 24.00, -7.15], "to": [4.65, 28.50, -6.05], "color": "foliageMid", "col_idx": 5},
        {"name": "foliage_t2_back", "group": "foliage_mid", "from": [-4.65, 24.00, 6.05], "to": [4.65, 28.50, 7.15], "color": "foliageMid", "col_idx": 5},
        {"name": "foliage_t2_left", "group": "foliage_mid", "from": [-7.15, 24.00, -4.65], "to": [-6.05, 28.50, 4.65], "color": "foliageMid", "col_idx": 5},
        {"name": "foliage_t2_right", "group": "foliage_mid", "from": [6.05, 24.00, -4.65], "to": [7.15, 28.50, 4.65], "color": "foliageMid", "col_idx": 5},
        {"name": "foliage_t3_core", "group": "foliage_crown", "from": [-4.25, 29.40, -4.25], "to": [4.25, 34.60, 4.25], "color": "foliageLight", "col_idx": 6},
        {"name": "foliage_t3_top", "group": "foliage_crown", "from": [-2.45, 34.50, -2.45], "to": [2.45, 36.00, 2.45], "color": "foliageLight", "col_idx": 6},
        {"name": "fruit_front_l", "group": "foliage_crown", "from": [-3.45, 21.00, -7.95], "to": [-2.05, 22.40, -7.65], "color": "appleRed", "col_idx": 7},
        {"name": "fruit_front_r", "group": "foliage_crown", "from": [2.55, 20.00, -7.95], "to": [3.95, 21.40, -7.65], "color": "appleRed", "col_idx": 7},
        {"name": "fruit_right_side", "group": "foliage_crown", "from": [7.05, 25.50, -2.45], "to": [7.35, 26.90, -1.05], "color": "appleRed", "col_idx": 7},
        {"name": "fruit_left_side", "group": "foliage_crown", "from": [-7.35, 26.00, 1.25], "to": [-7.05, 27.40, 2.65], "color": "appleRed", "col_idx": 7},
    ]

# =============================================================================
# 1b. TREE PLANTER B (31 cubes, 20×34×20, min_y = 0.00, dome canopy)
# =============================================================================
def build_tree_planter_b():
    return [
        {"name": "plinth", "group": "planter_base", "from": [-7.00, 0.00, -7.00], "to": [7.00, 1.80, 7.00], "color": "concreteDark", "col_idx": 0},
        {"name": "planter_bottom", "group": "planter_base", "from": [-7.25, 1.70, -7.25], "to": [7.25, 3.20, 7.25], "color": "concreteMid", "col_idx": 1},
        {"name": "wall_front", "group": "planter_walls", "from": [-7.90, 3.10, -7.90], "to": [7.90, 9.60, -6.10], "color": "concreteMid", "col_idx": 1},
        {"name": "wall_back", "group": "planter_walls", "from": [-7.90, 3.10, 6.10], "to": [7.90, 9.60, 7.90], "color": "concreteMid", "col_idx": 1},
        {"name": "wall_left", "group": "planter_walls", "from": [-7.80, 3.10, -6.00], "to": [-6.10, 9.60, 6.00], "color": "concreteMid", "col_idx": 1},
        {"name": "wall_right", "group": "planter_walls", "from": [6.10, 3.10, -6.00], "to": [7.80, 9.60, 6.00], "color": "concreteMid", "col_idx": 1},
        {"name": "rim_front", "group": "planter_rim", "from": [-8.00, 9.50, -8.00], "to": [8.00, 10.80, -5.90], "color": "goldRim", "col_idx": 2},
        {"name": "rim_back", "group": "planter_rim", "from": [-8.00, 9.50, 5.90], "to": [8.00, 10.80, 8.00], "color": "goldRim", "col_idx": 2},
        {"name": "rim_left", "group": "planter_rim", "from": [-7.90, 9.50, -5.80], "to": [-5.90, 10.80, 5.80], "color": "goldRim", "col_idx": 2},
        {"name": "rim_right", "group": "planter_rim", "from": [5.90, 9.50, -5.80], "to": [7.90, 10.80, 5.80], "color": "goldRim", "col_idx": 2},
        {"name": "soil_bed", "group": "soil_trunk", "from": [-5.65, 8.60, -5.65], "to": [5.65, 10.20, 5.65], "color": "soilDark", "col_idx": 3},
        {"name": "trunk_stem", "group": "soil_trunk", "from": [-1.85, 10.10, -1.85], "to": [1.85, 16.50, 1.85], "color": "trunkBark", "col_idx": 4},
        {"name": "branch_left", "group": "soil_trunk", "from": [-3.65, 15.50, -1.45], "to": [-1.65, 19.50, 1.45], "color": "trunkBark", "col_idx": 4},
        {"name": "branch_right", "group": "soil_trunk", "from": [1.65, 15.50, -1.45], "to": [3.65, 19.50, 1.45], "color": "trunkBark", "col_idx": 4},
        {"name": "canopy_t1_core", "group": "foliage_lower", "from": [-8.85, 19.00, -8.85], "to": [8.85, 23.80, 8.85], "color": "foliageBase", "col_idx": 5},
        {"name": "canopy_t1_f", "group": "foliage_lower", "from": [-7.45, 19.50, -9.85], "to": [7.45, 23.20, -8.75], "color": "foliageBase", "col_idx": 5},
        {"name": "canopy_t1_b", "group": "foliage_lower", "from": [-7.45, 19.50, 8.75], "to": [7.45, 23.20, 9.85], "color": "foliageBase", "col_idx": 5},
        {"name": "canopy_t1_l", "group": "foliage_lower", "from": [-9.85, 19.50, -7.45], "to": [-8.75, 23.20, 7.45], "color": "foliageBase", "col_idx": 5},
        {"name": "canopy_t1_r", "group": "foliage_lower", "from": [8.75, 19.50, -7.45], "to": [9.85, 23.20, 7.45], "color": "foliageBase", "col_idx": 5},
        {"name": "canopy_t2_core", "group": "foliage_mid", "from": [-7.65, 23.70, -7.65], "to": [7.65, 28.20, 7.65], "color": "foliageMid", "col_idx": 6},
        {"name": "canopy_t2_f", "group": "foliage_mid", "from": [-5.85, 24.20, -8.65], "to": [5.85, 27.60, -7.55], "color": "foliageMid", "col_idx": 6},
        {"name": "canopy_t2_b", "group": "foliage_mid", "from": [-5.85, 24.20, 7.55], "to": [5.85, 27.60, 8.65], "color": "foliageMid", "col_idx": 6},
        {"name": "canopy_t2_l", "group": "foliage_mid", "from": [-8.65, 24.20, -5.85], "to": [-7.55, 27.60, 5.85], "color": "foliageMid", "col_idx": 6},
        {"name": "canopy_t2_r", "group": "foliage_mid", "from": [7.55, 24.20, -5.85], "to": [8.65, 27.60, 5.85], "color": "foliageMid", "col_idx": 6},
        {"name": "canopy_t3_core", "group": "foliage_crown", "from": [-5.45, 28.10, -5.45], "to": [5.45, 31.80, 5.45], "color": "foliageLight", "col_idx": 7},
        {"name": "canopy_t3_top", "group": "foliage_crown", "from": [-3.25, 31.70, -3.25], "to": [3.25, 33.20, 3.25], "color": "foliageLight", "col_idx": 7},
        {"name": "fruit_fl", "group": "foliage_crown", "from": [-6.25, 21.00, -9.95], "to": [-4.85, 22.40, -9.65], "color": "appleRed", "col_idx": 8},
        {"name": "fruit_fr", "group": "foliage_crown", "from": [4.85, 21.50, -9.95], "to": [6.25, 22.90, -9.65], "color": "appleRed", "col_idx": 8},
        {"name": "fruit_r", "group": "foliage_crown", "from": [9.65, 22.00, -3.25], "to": [9.95, 23.40, -1.85], "color": "appleRed", "col_idx": 8},
        {"name": "fruit_l", "group": "foliage_crown", "from": [-9.95, 22.20, 1.85], "to": [-9.65, 23.60, 3.25], "color": "appleRed", "col_idx": 8},
        {"name": "fruit_b", "group": "foliage_crown", "from": [-1.45, 24.50, 8.45], "to": [0.05, 25.90, 8.75], "color": "appleRed", "col_idx": 8},
    ]

# =============================================================================
# 2. HEDGE (18 cubes, 14×12×14, min_y = 0.00)
# =============================================================================
def build_hedge():
    return [
        {"name": "curb_base", "group": "hedge_base", "from": [-6.85, 0.00, -6.85], "to": [6.85, 1.20, 6.85], "color": "hedgeDark", "col_idx": 0},
        {"name": "hedge_core", "group": "hedge_core", "from": [-6.35, 1.10, -6.35], "to": [6.35, 10.40, 6.35], "color": "hedgeMid", "col_idx": 1},
        {"name": "hedge_top_trim", "group": "hedge_top", "from": [-5.25, 10.30, -5.25], "to": [5.25, 11.60, 5.25], "color": "hedgeLight", "col_idx": 2},
        {"name": "hedge_top_peak", "group": "hedge_top", "from": [-3.15, 11.50, -3.15], "to": [3.15, 12.00, 3.15], "color": "hedgeLight", "col_idx": 2},
        {"name": "facet_front_low", "group": "hedge_facets", "from": [-5.75, 2.00, -6.95], "to": [5.75, 5.80, -6.25], "color": "hedgeDark", "col_idx": 0},
        {"name": "facet_front_high", "group": "hedge_facets", "from": [-4.65, 5.70, -6.85], "to": [4.65, 9.40, -6.15], "color": "hedgeMid", "col_idx": 1},
        {"name": "facet_back_low", "group": "hedge_facets", "from": [-5.75, 2.00, 6.25], "to": [5.75, 5.80, 6.95], "color": "hedgeDark", "col_idx": 0},
        {"name": "facet_back_high", "group": "hedge_facets", "from": [-4.65, 5.70, 6.15], "to": [4.65, 9.40, 6.85], "color": "hedgeMid", "col_idx": 1},
        {"name": "facet_left_low", "group": "hedge_facets", "from": [-6.95, 2.00, -5.75], "to": [-6.25, 5.80, 5.75], "color": "hedgeDark", "col_idx": 0},
        {"name": "facet_left_high", "group": "hedge_facets", "from": [-6.85, 5.70, -4.65], "to": [-6.15, 9.40, 4.65], "color": "hedgeMid", "col_idx": 1},
        {"name": "facet_right_low", "group": "hedge_facets", "from": [6.25, 2.00, -5.75], "to": [6.95, 5.80, 5.75], "color": "hedgeDark", "col_idx": 0},
        {"name": "facet_right_high", "group": "hedge_facets", "from": [6.15, 5.70, -4.65], "to": [6.85, 9.40, 4.65], "color": "hedgeMid", "col_idx": 1},
        {"name": "bud_front_left", "group": "hedge_buds", "from": [-5.15, 6.50, -7.00], "to": [-3.95, 7.70, -6.70], "color": "leafLime", "col_idx": 3},
        {"name": "bud_front_right", "group": "hedge_buds", "from": [2.85, 4.20, -7.00], "to": [4.05, 5.40, -6.70], "color": "leafLime", "col_idx": 3},
        {"name": "bud_back_left", "group": "hedge_buds", "from": [-4.15, 3.80, 6.70], "to": [-2.95, 5.00, 7.00], "color": "leafLime", "col_idx": 3},
        {"name": "bud_back_right", "group": "hedge_buds", "from": [3.15, 7.00, 6.70], "to": [4.35, 8.20, 7.00], "color": "leafLime", "col_idx": 3},
        {"name": "blossom_top_1", "group": "hedge_buds", "from": [-2.15, 11.90, 0.45], "to": [-0.95, 12.30, 1.65], "color": "blossomYellow", "col_idx": 4},
        {"name": "blossom_top_2", "group": "hedge_buds", "from": [1.25, 11.90, -1.85], "to": [2.45, 12.30, -0.65], "color": "blossomYellow", "col_idx": 4},
    ]

# =============================================================================
# 3. HYDRANT (22 cubes, 7×13×7, min_y = 0.00)
# =============================================================================
def build_hydrant():
    return [
        # Base Flange & 4 Mounting Bolts (Grounded min_y = 0.00)
        {"name": "base_flange", "group": "hydrant_base", "from": [-3.45, 0.00, -3.45], "to": [3.45, 1.40, 3.45], "color": "hydrantRedDark", "col_idx": 0},
        {"name": "bolt_fl", "group": "hydrant_base", "from": [-3.35, 1.20, -3.35], "to": [-2.15, 1.70, -2.15], "color": "brassGold", "col_idx": 1},
        {"name": "bolt_fr", "group": "hydrant_base", "from": [2.15, 1.20, -3.35], "to": [3.35, 1.70, -2.15], "color": "brassGold", "col_idx": 1},
        {"name": "bolt_bl", "group": "hydrant_base", "from": [-3.35, 1.20, 2.15], "to": [-2.15, 1.70, 3.35], "color": "brassGold", "col_idx": 1},
        {"name": "bolt_br", "group": "hydrant_base", "from": [2.15, 1.20, 2.15], "to": [3.35, 1.70, 3.35], "color": "brassGold", "col_idx": 1},
        # Barrel Body (Lower, Collar, Upper Bonnet, Dome, Operating Nut)
        {"name": "barrel_lower", "group": "hydrant_barrel", "from": [-2.45, 1.30, -2.45], "to": [2.45, 6.20, 2.45], "color": "hydrantRed", "col_idx": 2},
        {"name": "barrel_collar", "group": "hydrant_barrel", "from": [-2.75, 6.10, -2.75], "to": [2.75, 7.30, 2.75], "color": "hydrantRedDark", "col_idx": 0},
        {"name": "barrel_bonnet", "group": "hydrant_barrel", "from": [-2.25, 7.20, -2.25], "to": [2.25, 10.80, 2.25], "color": "hydrantRed", "col_idx": 2},
        {"name": "dome_cap", "group": "hydrant_barrel", "from": [-1.75, 10.70, -1.75], "to": [1.75, 12.00, 1.75], "color": "hydrantRed", "col_idx": 2},
        {"name": "operating_nut", "group": "hydrant_barrel", "from": [-0.75, 11.90, -0.75], "to": [0.75, 13.00, 0.75], "color": "brassGold", "col_idx": 1},
        # Left Side Nozzle (Stem, Cap, Lug)
        {"name": "nozzle_stem_l", "group": "hydrant_nozzles", "from": [-3.35, 7.50, -0.85], "to": [-2.15, 9.10, 0.85], "color": "hydrantRed", "col_idx": 2},
        {"name": "nozzle_cap_l", "group": "hydrant_nozzles", "from": [-3.50, 7.60, -0.75], "to": [-3.25, 9.00, 0.75], "color": "brassGold", "col_idx": 1},
        {"name": "nozzle_lug_l", "group": "hydrant_nozzles", "from": [-3.60, 8.10, -0.35], "to": [-3.45, 8.50, 0.35], "color": "silverSteel", "col_idx": 3},
        # Right Side Nozzle
        {"name": "nozzle_stem_r", "group": "hydrant_nozzles", "from": [2.15, 7.50, -0.85], "to": [3.35, 9.10, 0.85], "color": "hydrantRed", "col_idx": 2},
        {"name": "nozzle_cap_r", "group": "hydrant_nozzles", "from": [3.25, 7.60, -0.75], "to": [3.50, 9.00, 0.75], "color": "brassGold", "col_idx": 1},
        {"name": "nozzle_lug_r", "group": "hydrant_nozzles", "from": [3.45, 8.10, -0.35], "to": [3.60, 8.50, 0.35], "color": "silverSteel", "col_idx": 3},
        # Front Steamer Pumper Port
        {"name": "steamer_stem", "group": "hydrant_steamer", "from": [-1.25, 7.40, 2.15], "to": [1.25, 9.20, 3.25], "color": "hydrantRed", "col_idx": 2},
        {"name": "steamer_cap", "group": "hydrant_steamer", "from": [-1.15, 7.50, 3.15], "to": [1.15, 9.10, 3.50], "color": "brassGold", "col_idx": 1},
        {"name": "steamer_lug", "group": "hydrant_steamer", "from": [-0.45, 8.10, 3.40], "to": [0.45, 8.60, 3.60], "color": "silverSteel", "col_idx": 3},
        # Front Inspection Badge & Chains
        {"name": "badge_front", "group": "hydrant_details", "from": [-0.95, 3.20, 2.40], "to": [0.95, 4.60, 2.60], "color": "brassGold", "col_idx": 1},
        {"name": "chain_l", "group": "hydrant_details", "from": [-2.95, 6.40, 0.85], "to": [-2.35, 7.20, 1.45], "color": "silverSteel", "col_idx": 3},
        {"name": "chain_r", "group": "hydrant_details", "from": [2.35, 6.40, 0.85], "to": [2.95, 7.20, 1.45], "color": "silverSteel", "col_idx": 3},
    ]

# =============================================================================
# 4. TRASH CAN (17 cubes, 7×12×7, min_y = 0.00)
# =============================================================================
def build_trash_can():
    return [
        # Ground Mounting Base & Central Post (Grounded min_y = 0.00)
        {"name": "base_plate", "group": "can_base", "from": [-3.25, 0.00, -3.25], "to": [3.25, 0.80, 3.25], "color": "ironDark", "col_idx": 0},
        {"name": "support_post", "group": "can_base", "from": [-1.15, 0.70, -1.15], "to": [1.15, 2.60, 1.15], "color": "ironDark", "col_idx": 0},
        {"name": "receptacle_tray", "group": "can_base", "from": [-3.15, 2.50, -3.15], "to": [3.15, 3.60, 3.15], "color": "ironDark", "col_idx": 0},
        # Main Bin Body & 4 Corner Protective Ribs
        {"name": "bin_body_core", "group": "can_body", "from": [-2.95, 3.50, -2.95], "to": [2.95, 9.60, 2.95], "color": "binGreen", "col_idx": 1},
        {"name": "rib_fl", "group": "can_body", "from": [-3.45, 3.40, -3.45], "to": [-2.85, 9.80, -2.85], "color": "ironDark", "col_idx": 0},
        {"name": "rib_fr", "group": "can_body", "from": [2.85, 3.40, -3.45], "to": [3.45, 9.80, -2.85], "color": "ironDark", "col_idx": 0},
        {"name": "rib_bl", "group": "can_body", "from": [-3.45, 3.40, 2.85], "to": [-2.85, 9.80, 3.45], "color": "ironDark", "col_idx": 0},
        {"name": "rib_br", "group": "can_body", "from": [2.85, 3.40, 2.85], "to": [3.45, 9.80, 3.45], "color": "ironDark", "col_idx": 0},
        # Front Sorting Panel with Eco Logo
        {"name": "panel_white", "group": "can_panel", "from": [-2.15, 5.00, -3.15], "to": [2.15, 7.80, -2.85], "color": "panelWhite", "col_idx": 2},
        {"name": "panel_logo", "group": "can_panel", "from": [-0.75, 5.80, -3.25], "to": [0.75, 7.00, -3.05], "color": "logoGreen", "col_idx": 3},
        # Side Handles
        {"name": "handle_l", "group": "can_details", "from": [-3.35, 6.20, -0.65], "to": [-2.85, 7.40, 0.65], "color": "silverSteel", "col_idx": 4},
        {"name": "handle_r", "group": "can_details", "from": [2.85, 6.20, -0.65], "to": [3.35, 7.40, 0.65], "color": "silverSteel", "col_idx": 4},
        # Top Hood, Trash Slot Aperture & Ashtray
        {"name": "top_rim", "group": "can_hood", "from": [-3.25, 9.50, -3.25], "to": [3.25, 10.60, 3.25], "color": "ironDark", "col_idx": 0},
        {"name": "hood_roof", "group": "can_hood", "from": [-3.05, 10.50, -3.05], "to": [3.05, 11.50, 3.05], "color": "ironDark", "col_idx": 0},
        {"name": "trash_slot", "group": "can_hood", "from": [-2.05, 10.40, -3.20], "to": [2.05, 11.00, -2.80], "color": "slotBlack", "col_idx": 5},
        {"name": "ashtray_plate", "group": "can_hood", "from": [-1.45, 11.40, -1.45], "to": [1.45, 11.90, 1.45], "color": "silverSteel", "col_idx": 4},
        {"name": "ashtray_grate", "group": "can_hood", "from": [-0.75, 11.80, -0.75], "to": [0.75, 12.00, 0.75], "color": "ironDark", "col_idx": 0},
    ]

# =============================================================================
# 5. BENCH (22 cubes, 18×11×8, min_y = 0.00)
# =============================================================================
def build_bench():
    return [
        # Left Cast-Iron Leg Frame (Grounded min_y = 0.00)
        {"name": "leg_fl", "group": "bench_iron_left", "from": [-7.85, 0.00, 1.85], "to": [-6.45, 4.20, 3.25], "color": "ironDark", "col_idx": 0},
        {"name": "leg_bl", "group": "bench_iron_left", "from": [-7.85, 0.00, -3.45], "to": [-6.45, 9.80, -2.05], "color": "ironDark", "col_idx": 0},
        {"name": "armrest_l", "group": "bench_iron_left", "from": [-7.75, 4.80, -2.25], "to": [-6.55, 5.80, 3.15], "color": "ironDark", "col_idx": 0},
        {"name": "brace_low_l", "group": "bench_iron_left", "from": [-7.65, 1.20, -2.15], "to": [-6.65, 2.20, 2.15], "color": "ironDark", "col_idx": 0},
        {"name": "seat_bracket_l", "group": "bench_iron_left", "from": [-7.65, 3.90, -2.15], "to": [-6.65, 4.60, 2.85], "color": "ironDark", "col_idx": 0},
        # Right Cast-Iron Leg Frame
        {"name": "leg_fr", "group": "bench_iron_right", "from": [6.45, 0.00, 1.85], "to": [7.85, 4.20, 3.25], "color": "ironDark", "col_idx": 0},
        {"name": "leg_br", "group": "bench_iron_right", "from": [6.45, 0.00, -3.45], "to": [7.85, 9.80, -2.05], "color": "ironDark", "col_idx": 0},
        {"name": "armrest_r", "group": "bench_iron_right", "from": [6.55, 4.80, -2.25], "to": [7.75, 5.80, 3.15], "color": "ironDark", "col_idx": 0},
        {"name": "brace_low_r", "group": "bench_iron_right", "from": [6.65, 1.20, -2.15], "to": [7.65, 2.20, 2.15], "color": "ironDark", "col_idx": 0},
        {"name": "seat_bracket_r", "group": "bench_iron_right", "from": [6.65, 3.90, -2.15], "to": [7.65, 4.60, 2.85], "color": "ironDark", "col_idx": 0},
        # Central Stretcher Tie Bar
        {"name": "tie_bar", "group": "bench_tie", "from": [-6.55, 1.40, -0.45], "to": [6.55, 2.00, 0.45], "color": "ironDark", "col_idx": 0},
        # Wooden Seat Slats (4 slats with gaps)
        {"name": "slat_seat_1", "group": "bench_seat", "from": [-8.85, 4.40, -1.95], "to": [8.85, 5.10, -0.85], "color": "woodWarm", "col_idx": 1},
        {"name": "slat_seat_2", "group": "bench_seat", "from": [-8.85, 4.40, -0.55], "to": [8.85, 5.10, 0.55], "color": "woodMid", "col_idx": 2},
        {"name": "slat_seat_3", "group": "bench_seat", "from": [-8.85, 4.40, 0.85], "to": [8.85, 5.10, 1.95], "color": "woodWarm", "col_idx": 1},
        {"name": "slat_seat_4_bullnose", "group": "bench_seat", "from": [-8.85, 4.10, 2.25], "to": [8.85, 4.90, 3.45], "color": "woodMid", "col_idx": 2},
        # Wooden Backrest Slats (3 slats)
        {"name": "slat_back_1", "group": "bench_back", "from": [-8.85, 6.20, -2.75], "to": [8.85, 7.20, -1.95], "color": "woodWarm", "col_idx": 1},
        {"name": "slat_back_2", "group": "bench_back", "from": [-8.85, 7.50, -2.75], "to": [8.85, 8.50, -1.95], "color": "woodMid", "col_idx": 2},
        {"name": "slat_back_3_crest", "group": "bench_back", "from": [-8.85, 8.80, -2.85], "to": [8.85, 10.00, -1.95], "color": "woodWarm", "col_idx": 1},
        # Fastener Bolt Accents (outside armrest on outer slat overhang)
        {"name": "bolt_slat_f1", "group": "bench_bolts", "from": [-8.55, 5.05, -1.55], "to": [-7.95, 5.35, -1.25], "color": "boltSteel", "col_idx": 3},
        {"name": "bolt_slat_f2", "group": "bench_bolts", "from": [7.95, 5.05, -1.55], "to": [8.55, 5.35, -1.25], "color": "boltSteel", "col_idx": 3},
        {"name": "bolt_slat_b1", "group": "bench_bolts", "from": [-8.55, 9.35, -1.85], "to": [-7.95, 9.65, -1.65], "color": "boltSteel", "col_idx": 3},
        {"name": "bolt_slat_b2", "group": "bench_bolts", "from": [7.95, 9.35, -1.85], "to": [8.55, 9.65, -1.65], "color": "boltSteel", "col_idx": 3},
    ]

# =============================================================================
# 6. LAMP POST (22 cubes, 8×42×12, min_y = 0.00)
# =============================================================================
def build_lamp_post():
    return [
        # Ground Pedestal (Grounded min_y = 0.00)
        {"name": "base_plate", "group": "lamp_base", "from": [-3.45, 0.00, -3.45], "to": [3.45, 1.40, 3.45], "color": "castIronDark", "col_idx": 0},
        {"name": "base_plinth", "group": "lamp_base", "from": [-2.75, 1.30, -2.75], "to": [2.75, 4.60, 2.75], "color": "castIronDark", "col_idx": 0},
        {"name": "base_collar", "group": "lamp_base", "from": [-2.15, 4.50, -2.15], "to": [2.15, 6.20, 2.15], "color": "castIronDark", "col_idx": 0},
        # Fluted Pole & Ladder Pegs
        {"name": "pole_lower", "group": "lamp_pole", "from": [-1.25, 6.10, -1.25], "to": [1.25, 20.20, 1.25], "color": "castIronDark", "col_idx": 0},
        {"name": "pole_mid_collar", "group": "lamp_pole", "from": [-1.65, 20.10, -1.65], "to": [1.65, 21.60, 1.65], "color": "ironTrimGold", "col_idx": 1},
        {"name": "pole_ladder_peg_l", "group": "lamp_pole", "from": [-3.45, 19.80, -0.45], "to": [-1.15, 20.60, 0.45], "color": "castIronDark", "col_idx": 0},
        {"name": "pole_ladder_peg_r", "group": "lamp_pole", "from": [1.15, 19.80, -0.45], "to": [3.45, 20.60, 0.45], "color": "castIronDark", "col_idx": 0},
        {"name": "pole_upper", "group": "lamp_pole", "from": [-1.05, 21.50, -1.05], "to": [1.05, 30.60, 1.05], "color": "castIronDark", "col_idx": 0},
        {"name": "pole_top_collar", "group": "lamp_pole", "from": [-1.45, 30.50, -1.45], "to": [1.45, 32.20, 1.45], "color": "ironTrimGold", "col_idx": 1},
        # Arched Gooseneck Arm
        {"name": "arm_root", "group": "lamp_arm", "from": [-0.95, 32.10, -0.85], "to": [0.95, 34.40, 2.45], "color": "castIronDark", "col_idx": 0},
        {"name": "arm_horizontal", "group": "lamp_arm", "from": [-0.85, 34.10, 1.85], "to": [0.85, 35.80, 5.65], "color": "castIronDark", "col_idx": 0},
        {"name": "arm_arch_down", "group": "lamp_arm", "from": [-0.65, 33.20, 4.85], "to": [0.65, 34.60, 6.25], "color": "castIronDark", "col_idx": 0},
        {"name": "arm_finial_ring", "group": "lamp_arm", "from": [-1.15, 35.50, 4.95], "to": [1.15, 36.80, 6.15], "color": "ironTrimGold", "col_idx": 1},
        # Lantern Assembly
        {"name": "lantern_cap_roof", "group": "lamp_lantern", "from": [-2.65, 32.60, 3.25], "to": [2.65, 33.80, 7.85], "color": "castIronDark", "col_idx": 0},
        {"name": "lantern_cap_peak", "group": "lamp_lantern", "from": [-1.45, 33.60, 4.45], "to": [1.45, 34.90, 6.65], "color": "castIronDark", "col_idx": 0},
        {"name": "lantern_glass_core", "group": "lamp_lantern", "from": [-2.15, 28.50, 3.75], "to": [2.15, 32.80, 7.35], "color": "glassWarmGlow", "col_idx": 2},
        {"name": "lantern_strut_fl", "group": "lamp_lantern", "from": [-2.45, 28.40, 3.45], "to": [-1.85, 33.00, 4.05], "color": "castIronDark", "col_idx": 0},
        {"name": "lantern_strut_fr", "group": "lamp_lantern", "from": [1.85, 28.40, 3.45], "to": [2.45, 33.00, 4.05], "color": "castIronDark", "col_idx": 0},
        {"name": "lantern_strut_bl", "group": "lamp_lantern", "from": [-2.45, 28.40, 7.05], "to": [-1.85, 33.00, 7.65], "color": "castIronDark", "col_idx": 0},
        {"name": "lantern_strut_br", "group": "lamp_lantern", "from": [1.85, 28.40, 7.05], "to": [2.45, 33.00, 7.65], "color": "castIronDark", "col_idx": 0},
        {"name": "lantern_base_cup", "group": "lamp_lantern", "from": [-2.35, 27.50, 3.55], "to": [2.35, 28.60, 7.55], "color": "castIronDark", "col_idx": 0},
        {"name": "lantern_drop_pendant", "group": "lamp_lantern", "from": [-0.75, 26.20, 4.85], "to": [0.75, 27.60, 6.25], "color": "ironTrimGold", "col_idx": 1},
    ]

# =============================================================================
# 7. RAILWAY SIGNAL (22 cubes, 8×36×7, min_y = 0.00)
# =============================================================================
def build_railway_signal():
    return [
        # Base Ground Plate & Transformer Cabinet (Grounded min_y = 0.00)
        {"name": "signal_base_plate", "group": "signal_base", "from": [-3.45, 0.00, -2.95], "to": [3.45, 1.20, 2.95], "color": "ironDark", "col_idx": 0},
        {"name": "signal_cabinet", "group": "signal_base", "from": [-2.85, 1.10, -2.45], "to": [-0.85, 5.20, 2.45], "color": "cabinetGrey", "col_idx": 1},
        {"name": "signal_cabinet_door", "group": "signal_base", "from": [-2.95, 1.80, -1.85], "to": [-2.75, 4.60, 1.85], "color": "cabinetDark", "col_idx": 2},
        {"name": "signal_mast_collar", "group": "signal_base", "from": [0.65, 1.10, -1.25], "to": [2.85, 2.40, 1.25], "color": "ironDark", "col_idx": 0},
        # Mast Column & Service Rungs
        {"name": "signal_mast_column", "group": "signal_mast", "from": [1.15, 2.30, -0.75], "to": [2.35, 24.20, 0.75], "color": "poleSilver", "col_idx": 3},
        {"name": "signal_mast_top_collar", "group": "signal_mast", "from": [0.95, 24.10, -0.95], "to": [2.55, 25.40, 0.95], "color": "ironDark", "col_idx": 0},
        {"name": "rung_1", "group": "signal_mast", "from": [-0.65, 7.80, -0.35], "to": [1.25, 8.40, 0.35], "color": "ironDark", "col_idx": 0},
        {"name": "rung_2", "group": "signal_mast", "from": [-0.65, 13.80, -0.35], "to": [1.25, 14.40, 0.35], "color": "ironDark", "col_idx": 0},
        {"name": "rung_3", "group": "signal_mast", "from": [-0.65, 19.80, -0.35], "to": [1.25, 20.40, 0.35], "color": "ironDark", "col_idx": 0},
        # Service Platform & Railing
        {"name": "platform_grate", "group": "signal_platform", "from": [-2.95, 24.80, -2.65], "to": [3.25, 25.80, 2.65], "color": "ironDark", "col_idx": 0},
        {"name": "platform_railing_back", "group": "signal_platform", "from": [-2.45, 25.70, 2.35], "to": [3.15, 29.40, 2.75], "color": "safetyYellow", "col_idx": 4},
        {"name": "platform_railing_left", "group": "signal_platform", "from": [-2.85, 25.70, -2.35], "to": [-2.55, 29.40, 2.45], "color": "safetyYellow", "col_idx": 4},
        # Signal Head Housing, Visors & Glow Lenses
        {"name": "signal_backboard", "group": "signal_head", "from": [-3.45, 25.60, -2.45], "to": [0.65, 35.80, -2.05], "color": "blackPlate", "col_idx": 5},
        {"name": "signal_head_body", "group": "signal_head", "from": [-3.15, 26.00, -2.15], "to": [0.35, 35.40, -0.25], "color": "ironDark", "col_idx": 0},
        {"name": "visor_upper", "group": "signal_head", "from": [-2.85, 33.60, -3.45], "to": [0.05, 35.20, -2.75], "color": "blackPlate", "col_idx": 5},
        {"name": "lens_red_upper", "group": "signal_head", "from": [-2.45, 31.80, -2.95], "to": [-0.25, 34.20, -2.25], "color": "redGlow", "col_idx": 6},
        {"name": "visor_lower", "group": "signal_head", "from": [-2.85, 28.80, -3.45], "to": [0.05, 30.40, -2.75], "color": "blackPlate", "col_idx": 5},
        {"name": "lens_green_lower", "group": "signal_head", "from": [-2.45, 27.00, -2.95], "to": [-0.25, 29.40, -2.25], "color": "greenGlow", "col_idx": 7},
        # Mount Brackets, Cable & Cap
        {"name": "bracket_low", "group": "signal_details", "from": [0.25, 26.80, -1.25], "to": [1.25, 27.60, 0.05], "color": "ironDark", "col_idx": 0},
        {"name": "bracket_high", "group": "signal_details", "from": [0.25, 33.20, -1.25], "to": [1.25, 34.00, 0.05], "color": "ironDark", "col_idx": 0},
        {"name": "conduit_cable", "group": "signal_details", "from": [1.95, 2.20, 0.70], "to": [2.25, 25.20, 1.00], "color": "blackPlate", "col_idx": 5},
        {"name": "mast_finial_cap", "group": "signal_details", "from": [1.35, 25.30, -0.55], "to": [2.15, 26.20, 0.55], "color": "poleSilver", "col_idx": 3},
    ]

# =============================================================================
# 8. ROAD BARRIER (18 cubes, 18×9×6, min_y = 0.00)
# =============================================================================
def build_road_barrier():
    return [
        # Left Post: mounting foot & column
        {"name": "foot_left", "group": "barrier_posts", "from": [-6.45, 0.00, -1.85], "to": [-3.55, 1.20, 1.85], "color": "ironDark", "col_idx": 0},
        {"name": "post_left", "group": "barrier_posts", "from": [-5.75, 1.10, -1.25], "to": [-4.25, 8.80, 1.25], "color": "postSteel", "col_idx": 1},
        # Right Post: mounting foot & column
        {"name": "foot_right", "group": "barrier_posts", "from": [3.55, 0.00, -1.85], "to": [6.45, 1.20, 1.85], "color": "ironDark", "col_idx": 0},
        {"name": "post_right", "group": "barrier_posts", "from": [4.25, 1.10, -1.25], "to": [5.75, 8.80, 1.25], "color": "postSteel", "col_idx": 1},
        # Offset brackets
        {"name": "bracket_left", "group": "barrier_posts", "from": [-5.55, 4.20, -1.95], "to": [-4.45, 7.80, -1.15], "color": "ironDark", "col_idx": 0},
        {"name": "bracket_right", "group": "barrier_posts", "from": [4.45, 4.20, -1.95], "to": [5.55, 7.80, -1.15], "color": "ironDark", "col_idx": 0},
        # Main Galvanized W-Beam Rail
        {"name": "rail_main", "group": "barrier_rail", "from": [-8.85, 4.00, -2.85], "to": [8.85, 8.00, -1.85], "color": "galvanizedLight", "col_idx": 2},
        {"name": "rail_top_ridge", "group": "barrier_rail", "from": [-8.65, 7.90, -2.55], "to": [8.65, 8.80, -1.95], "color": "galvanizedShadow", "col_idx": 3},
        {"name": "rail_bot_ridge", "group": "barrier_rail", "from": [-8.65, 3.20, -2.55], "to": [8.65, 4.10, -1.95], "color": "galvanizedShadow", "col_idx": 3},
        # End Terminal Wings
        {"name": "end_terminal_l", "group": "barrier_rail", "from": [-9.45, 3.40, -2.65], "to": [-8.75, 8.60, -1.80], "color": "galvanizedShadow", "col_idx": 3},
        {"name": "end_terminal_r", "group": "barrier_rail", "from": [8.75, 3.40, -2.65], "to": [9.45, 8.60, -1.80], "color": "galvanizedShadow", "col_idx": 3},
        # Rear Flange
        {"name": "rail_rear", "group": "barrier_rail", "from": [-8.85, 4.50, 1.15], "to": [8.85, 7.50, 1.85], "color": "galvanizedShadow", "col_idx": 3},
        # Reflectors / Cataphotes
        {"name": "reflector_left", "group": "barrier_reflectors", "from": [-5.65, 5.20, -3.05], "to": [-4.35, 6.80, -2.75], "color": "reflectorAmber", "col_idx": 4},
        {"name": "reflector_right", "group": "barrier_reflectors", "from": [4.35, 5.20, -3.05], "to": [5.65, 6.80, -2.75], "color": "reflectorAmber", "col_idx": 4},
        {"name": "reflector_center", "group": "barrier_reflectors", "from": [-0.65, 5.20, -3.05], "to": [0.65, 6.80, -2.75], "color": "reflectorAmber", "col_idx": 4},
        {"name": "end_cap_red_l", "group": "barrier_reflectors", "from": [-9.55, 5.00, -2.75], "to": [-9.35, 7.00, -1.75], "color": "reflectorRed", "col_idx": 5},
        {"name": "end_cap_red_r", "group": "barrier_reflectors", "from": [9.35, 5.00, -2.75], "to": [9.55, 7.00, -1.75], "color": "reflectorRed", "col_idx": 5},
    ]

# =============================================================================
# 9. RIVERBANK EDGE (19 cubes, 20×6×8, min_y = 0.00)
# =============================================================================
def build_riverbank_edge():
    return [
        # Seawall Granite Base Course (Grounded min_y = 0.00)
        {"name": "seawall_base", "group": "river_quay", "from": [-9.85, 0.00, -3.85], "to": [9.85, 2.20, 3.85], "color": "graniteDark", "col_idx": 0},
        {"name": "curb_coping", "group": "river_quay", "from": [-9.75, 2.10, -3.75], "to": [9.75, 4.40, 2.45], "color": "graniteMid", "col_idx": 1},
        {"name": "promenade_paving", "group": "river_quay", "from": [-9.65, 4.30, -3.65], "to": [9.65, 6.00, 1.25], "color": "graniteLight", "col_idx": 2},
        # Cast-Iron Mooring Bollard (Shifted to center X = +2.00, Three.js 0.10)
        {"name": "bollard_base", "group": "river_bollard", "from": [-0.15, 5.90, -1.85], "to": [4.15, 6.80, 1.85], "color": "bollardIron", "col_idx": 3},
        {"name": "bollard_column", "group": "river_bollard", "from": [0.55, 6.70, -1.25], "to": [3.45, 10.40, 1.25], "color": "bollardIron", "col_idx": 3},
        {"name": "bollard_cap", "group": "river_bollard", "from": [0.05, 10.30, -1.75], "to": [3.95, 11.60, 1.75], "color": "bollardIron", "col_idx": 3},
        {"name": "bollard_pin_l", "group": "river_bollard", "from": [-1.15, 8.20, -0.45], "to": [0.65, 9.40, 0.45], "color": "bollardIron", "col_idx": 3},
        {"name": "bollard_pin_r", "group": "river_bollard", "from": [3.35, 8.20, -0.45], "to": [5.15, 9.40, 0.45], "color": "bollardIron", "col_idx": 3},
        # Storm Drain Scupper Grate (Raised on pavement)
        {"name": "drain_frame", "group": "river_drain", "from": [-7.85, 5.90, -2.85], "to": [-4.25, 6.10, -0.45], "color": "grateMetal", "col_idx": 4},
        {"name": "drain_slot_1", "group": "river_drain", "from": [-7.45, 5.95, -2.65], "to": [-6.85, 6.25, -0.65], "color": "slotBlack", "col_idx": 5},
        {"name": "drain_slot_2", "group": "river_drain", "from": [-6.35, 5.95, -2.65], "to": [-5.75, 6.25, -0.65], "color": "slotBlack", "col_idx": 5},
        {"name": "drain_slot_3", "group": "river_drain", "from": [-5.25, 5.95, -2.65], "to": [-4.65, 6.25, -0.65], "color": "slotBlack", "col_idx": 5},
        # River Safety Lifebuoy Ring on Wall
        {"name": "buoy_bracket", "group": "river_safety", "from": [5.25, 1.60, 3.75], "to": [7.45, 2.40, 4.05], "color": "bollardIron", "col_idx": 3},
        {"name": "buoy_ring_main", "group": "river_safety", "from": [5.05, 0.90, 3.90], "to": [7.65, 3.10, 4.20], "color": "buoyOrange", "col_idx": 6},
        {"name": "buoy_tape_t", "group": "river_safety", "from": [6.05, 2.70, 3.80], "to": [6.65, 3.20, 4.25], "color": "buoyWhite", "col_idx": 7},
        {"name": "buoy_tape_b", "group": "river_safety", "from": [6.05, 0.80, 3.80], "to": [6.65, 1.30, 4.25], "color": "buoyWhite", "col_idx": 7},
        {"name": "buoy_tape_l", "group": "river_safety", "from": [4.95, 1.70, 3.80], "to": [5.45, 2.30, 4.25], "color": "buoyWhite", "col_idx": 7},
        # Moss Patches near Waterline
        {"name": "moss_patch_l", "group": "river_safety", "from": [-8.95, 0.40, 3.75], "to": [-6.15, 1.80, 3.95], "color": "mossGreen", "col_idx": 8},
        {"name": "moss_patch_r", "group": "river_safety", "from": [2.15, 0.30, 3.75], "to": [4.65, 1.50, 3.95], "color": "mossGreen", "col_idx": 8},
    ]

# =============================================================================
# 10. COIN 3D (20 cubes, 7×7×2, min_y = 4.00 = 0.20 Three.js floating)
# =============================================================================
def build_coin():
    return [
        # Recessed Face / Core
        {"name": "core_vert", "group": "coin_core", "from": [-2.25, 4.20, -0.65], "to": [2.25, 10.40, 0.65], "color": "goldBase", "col_idx": 1},
        {"name": "core_horiz", "group": "coin_core", "from": [-3.30, 5.25, -0.55], "to": [3.30, 9.35, 0.55], "color": "goldBase", "col_idx": 1},
        {"name": "core_diag_tl", "group": "coin_core", "from": [-2.95, 8.35, -0.45], "to": [-1.95, 9.75, 0.45], "color": "goldBase", "col_idx": 1},
        {"name": "core_diag_br", "group": "coin_core", "from": [1.95, 4.85, -0.45], "to": [2.95, 6.25, 0.45], "color": "goldBase", "col_idx": 1},
        # Outer Raised Rim
        {"name": "rim_top", "group": "coin_rim", "from": [-1.85, 9.80, -0.85], "to": [1.85, 10.60, 0.85], "color": "goldRim", "col_idx": 0},
        {"name": "rim_bottom", "group": "coin_rim", "from": [-1.85, 4.00, -0.85], "to": [1.85, 4.80, 0.85], "color": "goldRim", "col_idx": 0},
        {"name": "rim_left", "group": "coin_rim", "from": [-3.40, 5.40, -0.75], "to": [-2.65, 9.20, 0.75], "color": "goldRim", "col_idx": 0},
        {"name": "rim_right", "group": "coin_rim", "from": [2.65, 5.40, -0.75], "to": [3.40, 9.20, 0.75], "color": "goldRim", "col_idx": 0},
        {"name": "rim_tl", "group": "coin_rim", "from": [-3.15, 8.60, -0.95], "to": [-1.75, 10.10, 0.95], "color": "goldRim", "col_idx": 0},
        {"name": "rim_tr", "group": "coin_rim", "from": [1.75, 8.60, -0.95], "to": [3.15, 10.10, 0.95], "color": "goldRim", "col_idx": 0},
        {"name": "rim_bl", "group": "coin_rim", "from": [-3.15, 4.50, -0.95], "to": [-1.75, 6.00, 0.95], "color": "goldRim", "col_idx": 0},
        {"name": "rim_br", "group": "coin_rim", "from": [1.75, 4.50, -0.95], "to": [3.15, 6.00, 0.95], "color": "goldRim", "col_idx": 0},
        # Embossed 5-Pointed Star ⭐
        {"name": "star_core", "group": "coin_star", "from": [-0.75, 6.60, -1.05], "to": [0.75, 7.80, 1.05], "color": "goldBright", "col_idx": 2},
        {"name": "star_top_ray", "group": "coin_star", "from": [-0.45, 7.70, -1.10], "to": [0.45, 9.20, 1.10], "color": "goldShine", "col_idx": 3},
        {"name": "star_left_ray", "group": "coin_star", "from": [-1.95, 7.10, -1.10], "to": [-0.65, 8.00, 1.10], "color": "goldBright", "col_idx": 2},
        {"name": "star_right_ray", "group": "coin_star", "from": [0.65, 7.10, -1.10], "to": [1.95, 8.00, 1.10], "color": "goldBright", "col_idx": 2},
        {"name": "star_bl_ray", "group": "coin_star", "from": [-1.55, 5.40, -1.10], "to": [-0.55, 6.70, 1.10], "color": "goldBright", "col_idx": 2},
        {"name": "star_br_ray", "group": "coin_star", "from": [0.55, 5.40, -1.10], "to": [1.55, 6.70, 1.10], "color": "goldBright", "col_idx": 2},
        {"name": "star_center_pip", "group": "coin_star", "from": [-0.35, 7.00, -1.20], "to": [0.35, 7.60, 1.20], "color": "goldShine", "col_idx": 3},
        # Glints
        {"name": "glint_tl", "group": "coin_glints", "from": [-2.45, 8.80, 0.90], "to": [-1.85, 9.40, 1.05], "color": "goldShine", "col_idx": 3},
        {"name": "glint_br", "group": "coin_glints", "from": [1.85, 5.20, 0.90], "to": [2.45, 5.80, 1.05], "color": "goldShine", "col_idx": 3},
    ]

# =============================================================================
# 11. RECORD FLAG (20 cubes, 8×30×8, min_y = 0.00)
# =============================================================================
def build_record_flag():
    return [
        # Base Pedestal (Grounded min_y = 0.00)
        {"name": "pedestal_granite", "group": "flag_pedestal", "from": [-3.75, 0.00, -3.75], "to": [3.75, 1.40, 3.75], "color": "graniteBase", "col_idx": 0},
        {"name": "pedestal_trim", "group": "flag_pedestal", "from": [-3.95, 0.30, -3.95], "to": [3.95, 0.90, 3.95], "color": "goldTrim", "col_idx": 1},
        {"name": "pedestal_plinth", "group": "flag_pedestal", "from": [-2.75, 1.30, -2.75], "to": [2.75, 3.20, 2.75], "color": "graniteBase", "col_idx": 0},
        {"name": "mast_socket", "group": "flag_pedestal", "from": [-1.35, 3.10, -1.35], "to": [1.35, 4.60, 1.35], "color": "goldTrim", "col_idx": 1},
        # Mast Pole
        {"name": "mast_pole", "group": "flag_mast", "from": [-0.65, 4.50, -0.65], "to": [0.65, 27.60, 0.65], "color": "steelPole", "col_idx": 2},
        # Champion Crown Finial & Rubies
        {"name": "crown_ring", "group": "flag_crown", "from": [-1.55, 27.50, -1.55], "to": [1.55, 28.60, 1.55], "color": "goldChampion", "col_idx": 3},
        {"name": "crown_peak_c", "group": "flag_crown", "from": [-0.65, 28.50, -0.65], "to": [0.65, 30.00, 0.65], "color": "goldChampion", "col_idx": 3},
        {"name": "crown_peak_l", "group": "flag_crown", "from": [-1.45, 28.50, -0.55], "to": [-0.75, 29.50, 0.55], "color": "goldChampion", "col_idx": 3},
        {"name": "crown_peak_r", "group": "flag_crown", "from": [0.75, 28.50, -0.55], "to": [1.45, 29.50, 0.55], "color": "goldChampion", "col_idx": 3},
        {"name": "ruby_c", "group": "flag_crown", "from": [-0.35, 28.70, 0.60], "to": [0.35, 29.30, 0.90], "color": "rubyGem", "col_idx": 4},
        {"name": "ruby_l", "group": "flag_crown", "from": [-1.25, 28.70, 0.60], "to": [-0.85, 29.10, 0.85], "color": "rubyGem", "col_idx": 4},
        {"name": "ruby_r", "group": "flag_crown", "from": [0.85, 28.70, 0.60], "to": [1.25, 29.10, 0.85], "color": "rubyGem", "col_idx": 4},
        # Fluttering Swallowtail Cloth
        {"name": "cloth_main", "group": "flag_cloth", "from": [0.55, 18.20, -0.25], "to": [5.45, 26.80, 0.25], "color": "flagGold", "col_idx": 5},
        {"name": "cloth_wave", "group": "flag_cloth", "from": [5.35, 18.50, 0.20], "to": [8.75, 26.50, 0.65], "color": "flagGold", "col_idx": 5},
        {"name": "tail_top", "group": "flag_cloth", "from": [8.65, 22.80, 0.55], "to": [11.85, 26.40, 0.95], "color": "flagGold", "col_idx": 5},
        {"name": "tail_bot", "group": "flag_cloth", "from": [8.65, 18.60, 0.55], "to": [11.85, 22.20, 0.95], "color": "flagGold", "col_idx": 5},
        # Champion Emblem on Banner
        {"name": "emblem_star", "group": "flag_emblem", "from": [2.25, 21.60, -0.40], "to": [3.75, 23.40, 0.40], "color": "rubyGem", "col_idx": 4},
        {"name": "emblem_chev_up", "group": "flag_emblem", "from": [1.85, 23.60, -0.35], "to": [4.15, 24.40, 0.35], "color": "goldChampion", "col_idx": 3},
        {"name": "emblem_chev_dn", "group": "flag_emblem", "from": [1.85, 20.60, -0.35], "to": [4.15, 21.40, 0.35], "color": "goldChampion", "col_idx": 3},
        {"name": "mast_finial_drop", "group": "flag_mast", "from": [-0.85, 4.30, -0.85], "to": [0.85, 5.00, 0.85], "color": "goldTrim", "col_idx": 1},
    ]

# =============================================================================
# 12. ROAD MARKINGS (12 cubes, 18×1×16, min_y = 0.00, H = 1.00 = 0.05 Three.js)
# =============================================================================
def build_road_markings():
    return [
        # 4 Clean Monolithic White Zebra Crossing Stripes (Height strictly 1 voxel = 1.00)
        {"name": "zebra_1", "group": "markings_zebra", "from": [-8.45, 0.00, -7.85], "to": [-5.45, 1.00, 7.85], "color": "markingWhite", "col_idx": 0},
        {"name": "zebra_2", "group": "markings_zebra", "from": [-4.25, 0.00, -7.85], "to": [-1.25, 1.00, 7.85], "color": "markingWhite", "col_idx": 0},
        {"name": "zebra_3", "group": "markings_zebra", "from": [-0.05, 0.00, -7.85], "to": [2.95, 1.00, 7.85], "color": "markingWhite", "col_idx": 0},
        {"name": "zebra_4", "group": "markings_zebra", "from": [4.15, 0.00, -7.85], "to": [7.15, 1.00, 7.85], "color": "markingWhite", "col_idx": 0},
        # Transverse Stop-Line Edge Borders
        {"name": "stop_line_front", "group": "markings_stop", "from": [-8.85, 0.00, -8.65], "to": [7.55, 1.00, -7.95], "color": "markingYellow", "col_idx": 1},
        {"name": "stop_line_rear", "group": "markings_stop", "from": [-8.85, 0.00, 7.95], "to": [7.55, 1.00, 8.65], "color": "markingYellow", "col_idx": 1},
        # Outer Boundary Guide Dashes
        {"name": "guide_dash_l", "group": "markings_guide", "from": [-9.45, 0.00, -3.25], "to": [-8.95, 1.00, 3.25], "color": "markingWhite", "col_idx": 0},
        {"name": "guide_dash_r", "group": "markings_guide", "from": [7.65, 0.00, -3.25], "to": [8.15, 1.00, 3.25], "color": "markingWhite", "col_idx": 0},
    ]

# =============================================================================
# MODEL REGISTRY DICTIONARY
# =============================================================================
ALL_URBAN_MODELS = {
    "tree_planter": {
        "title": "Городское дерево в кадке А (Терракота)",
        "category": "nature",
        "builder": build_tree_planter,
        "budget": (25, 35),
        "dims": (0.80, 1.80, 0.80),
        "grid_dims": (16, 36, 16),
        "min_y": 0.0,
        "palette": [
            ("#78350f", "woodPlankDark"),
            ("#b45309", "woodPlankMid"),
            ("#451a03", "soilDark"),
            ("#92400e", "trunkBark"),
            ("#15803d", "foliageBase"),
            ("#16a34a", "foliageMid"),
            ("#22c55e", "foliageLight"),
            ("#ef4444", "appleRed"),
        ],
        "groups": ["planter_base", "planter_walls", "soil_trunk", "foliage_lower", "foliage_mid", "foliage_crown"]
    },
    "tree_planter_b": {
        "title": "Городское дерево в кадке Б (Купольная крона)",
        "category": "nature",
        "builder": build_tree_planter_b,
        "budget": (25, 35),
        "dims": (1.00, 1.66, 1.00),
        "grid_dims": (20, 34, 20),
        "min_y": 0.0,
        "palette": [
            ("#1e293b", "concreteDark"),
            ("#334155", "concreteMid"),
            ("#d97706", "goldRim"),
            ("#27170a", "soilDark"),
            ("#78350f", "trunkBark"),
            ("#166534", "foliageBase"),
            ("#15803d", "foliageMid"),
            ("#22c55e", "foliageLight"),
            ("#ef4444", "appleRed"),
        ],
        "groups": ["planter_base", "planter_walls", "planter_rim", "soil_trunk", "foliage_lower", "foliage_mid", "foliage_crown"]},
    "hedge": {
        "title": "Подстриженная живая изгородь",
        "category": "nature",
        "builder": build_hedge,
        "budget": (15, 25),
        "dims": (0.70, 0.60, 0.70),
        "grid_dims": (14, 12, 14),
        "min_y": 0.0,
        "palette": [
            ("#166534", "hedgeDark"),
            ("#15803d", "hedgeMid"),
            ("#22c55e", "hedgeLight"),
            ("#84cc16", "leafLime"),
            ("#facc15", "blossomYellow"),
        ],
        "groups": ["hedge_base", "hedge_core", "hedge_top", "hedge_facets", "hedge_buds"]
    },
    "hydrant": {
        "title": "Чугунный пожарный гидрант",
        "category": "props",
        "builder": build_hydrant,
        "budget": (18, 26),
        "dims": (0.35, 0.65, 0.35),
        "grid_dims": (7, 13, 7),
        "min_y": 0.0,
        "palette": [
            ("#b91c1c", "hydrantRedDark"),
            ("#f59e0b", "brassGold"),
            ("#ef4444", "hydrantRed"),
            ("#cbd5e1", "silverSteel"),
        ],
        "groups": ["hydrant_base", "hydrant_barrel", "hydrant_nozzles", "hydrant_steamer", "hydrant_details"]
    },
    "trash_can": {
        "title": "Городская урна для сортировки",
        "category": "props",
        "builder": build_trash_can,
        "budget": (16, 24),
        "dims": (0.35, 0.60, 0.35),
        "grid_dims": (7, 12, 7),
        "min_y": 0.0,
        "palette": [
            ("#1e293b", "ironDark"),
            ("#15803d", "binGreen"),
            ("#f8fafc", "panelWhite"),
            ("#22c55e", "logoGreen"),
            ("#94a3b8", "silverSteel"),
            ("#0f172a", "slotBlack"),
        ],
        "groups": ["can_base", "can_body", "can_panel", "can_details", "can_hood"]
    },
    "bench": {
        "title": "Парковая деревянная скамейка",
        "category": "props",
        "builder": build_bench,
        "budget": (18, 28),
        "dims": (0.90, 0.55, 0.40),
        "grid_dims": (18, 11, 8),
        "min_y": 0.0,
        "palette": [
            ("#1e293b", "ironDark"),
            ("#b45309", "woodWarm"),
            ("#92400e", "woodMid"),
            ("#64748b", "boltSteel"),
        ],
        "groups": ["bench_iron_left", "bench_iron_right", "bench_tie", "bench_seat", "bench_back", "bench_bolts"]
    },
    "lamp_post": {
        "title": "Уличный фонарный столб",
        "category": "props",
        "builder": build_lamp_post,
        "budget": (20, 30),
        "dims": (0.40, 2.10, 0.60),
        "grid_dims": (8, 42, 12),
        "min_y": 0.0,
        "palette": [
            ("#0f172a", "castIronDark"),
            ("#f59e0b", "ironTrimGold"),
            ("#fef08a", "glassWarmGlow"),
        ],
        "groups": ["lamp_base", "lamp_pole", "lamp_arm", "lamp_lantern"]
    },
    "railway_signal": {
        "title": "Железнодорожный семафор",
        "category": "props",
        "builder": build_railway_signal,
        "budget": (20, 28),
        "dims": (0.40, 1.80, 0.35),
        "grid_dims": (8, 36, 7),
        "min_y": 0.0,
        "palette": [
            ("#1e293b", "ironDark"),
            ("#475569", "cabinetGrey"),
            ("#334155", "cabinetDark"),
            ("#94a3b8", "poleSilver"),
            ("#eab308", "safetyYellow"),
            ("#0f172a", "blackPlate"),
            ("#ef4444", "redGlow"),
            ("#22c55e", "greenGlow"),
        ],
        "groups": ["signal_base", "signal_mast", "signal_platform", "signal_head", "signal_details"]
    },
    "road_barrier": {
        "title": "Дорожный металлический отбойник",
        "category": "props",
        "builder": build_road_barrier,
        "budget": (15, 25),
        "dims": (0.95, 0.44, 0.20),
        "grid_dims": (19, 9, 4),
        "min_y": 0.0,
        "palette": [
            ("#1e293b", "ironDark"),
            ("#334155", "postSteel"),
            ("#cbd5e1", "galvanizedLight"),
            ("#94a3b8", "galvanizedShadow"),
            ("#facc15", "reflectorAmber"),
            ("#ef4444", "reflectorRed"),
        ],
        "groups": ["barrier_posts", "barrier_rail", "barrier_reflectors"]},
    "riverbank_edge": {
        "title": "Парапет набережной с кнехтом",
        "category": "props",
        "builder": build_riverbank_edge,
        "budget": (15, 25),
        "dims": (1.00, 0.30, 0.40),
        "grid_dims": (20, 6, 8),
        "min_y": 0.0,
        "palette": [
            ("#334155", "graniteDark"),
            ("#64748b", "graniteMid"),
            ("#94a3b8", "graniteLight"),
            ("#1e293b", "bollardIron"),
            ("#475569", "grateMetal"),
            ("#0f172a", "slotBlack"),
            ("#ea580c", "buoyOrange"),
            ("#f8fafc", "buoyWhite"),
            ("#15803d", "mossGreen"),
        ],
        "groups": ["river_quay", "river_bollard", "river_drain", "river_safety"]
    },
    "coin": {
        "title": "Золотая монета 3D со звездой",
        "category": "pickups",
        "builder": build_coin,
        "budget": (18, 25),
        "dims": (0.35, 0.35, 0.12),
        "grid_dims": (7, 7, 2),
        "min_y": 4.0,
        "palette": [
            ("#d97706", "goldRim"),
            ("#f59e0b", "goldBase"),
            ("#facc15", "goldBright"),
            ("#fef08a", "goldShine"),
        ],
        "groups": ["coin_core", "coin_rim", "coin_star", "coin_glints"]},
    "record_flag": {
        "title": "Постамент флага рекорда",
        "category": "props",
        "builder": build_record_flag,
        "budget": (18, 26),
        "dims": (0.40, 1.50, 0.40),
        "grid_dims": (8, 30, 8),
        "min_y": 0.0,
        "palette": [
            ("#334155", "graniteBase"),
            ("#f59e0b", "goldTrim"),
            ("#94a3b8", "steelPole"),
            ("#facc15", "goldChampion"),
            ("#dc2626", "rubyGem"),
            ("#fbbf24", "flagGold"),
        ],
        "groups": ["flag_pedestal", "flag_mast", "flag_crown", "flag_cloth", "flag_emblem"]
    },
    "road_markings": {
        "title": "Дорожная разметка (Пешеходный переход)",
        "category": "infrastructure",
        "builder": build_road_markings,
        "budget": (6, 12),
        "dims": (0.90, 0.05, 0.90),
        "grid_dims": (18, 1, 18),
        "min_y": 0.0,
        "palette": [
            ("#f8fafc", "markingWhite"),
            ("#facc15", "markingYellow"),
        ],
        "groups": ["markings_zebra", "markings_stop", "markings_guide"]
    }
}
