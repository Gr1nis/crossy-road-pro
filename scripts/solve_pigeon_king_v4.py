import json
import sys
sys.path.insert(0, 'scripts')
from blockbench_coplanar_check import blockbench_check

# Pigeon King Final (Reverted tail as requested: stepped fan tail)
# Preserves:
# - Solid core with zero holes (torso_upper_block)
# - Clean rear mantle hem (no black dots on back)
# - Front-corner expressive eyes + white forehead separation + lowered cheeks
# - Royal Grand Ruby Order with golden chain
# - 24K Fleur-de-lis imperial crown

cubes = [
    # === A. FEET & LEGS (10 cubes, coral pink #f43f5e, Y=0.00 ground contact) ===
    {"name": "foot_base_left", "group": "legs", "from": [-2.15, 0.04, -0.65], "to": [-1.45, 0.40, 0.75], "color": "pigeonFootRed", "col_idx": 4},
    {"name": "leg_shank_left", "group": "legs", "from": [-1.95, 0.35, -0.15], "to": [-1.65, 2.55, 0.25], "color": "pigeonFootRed", "col_idx": 4},
    {"name": "toe_mid_left", "group": "legs", "from": [-1.95, 0.00, -1.75], "to": [-1.65, 0.30, -0.55], "color": "pigeonFootRed", "col_idx": 4},
    {"name": "toe_outer_left", "group": "legs", "from": [-2.55, 0.00, -1.45], "to": [-2.05, 0.28, -0.45], "color": "pigeonFootRed", "col_idx": 4},
    {"name": "toe_inner_left", "group": "legs", "from": [-1.55, 0.00, -1.45], "to": [-1.05, 0.28, -0.45], "color": "pigeonFootRed", "col_idx": 4},

    {"name": "foot_base_right", "group": "legs", "from": [1.45, 0.04, -0.65], "to": [2.15, 0.40, 0.75], "color": "pigeonFootRed", "col_idx": 4},
    {"name": "leg_shank_right", "group": "legs", "from": [1.65, 0.35, -0.15], "to": [1.95, 2.55, 0.25], "color": "pigeonFootRed", "col_idx": 4},
    {"name": "toe_mid_right", "group": "legs", "from": [1.65, 0.00, -1.75], "to": [1.95, 0.30, -0.55], "color": "pigeonFootRed", "col_idx": 4},
    {"name": "toe_outer_right", "group": "legs", "from": [2.05, 0.00, -1.45], "to": [2.55, 0.28, -0.45], "color": "pigeonFootRed", "col_idx": 4},
    {"name": "toe_inner_right", "group": "legs", "from": [1.05, 0.00, -1.45], "to": [1.55, 0.28, -0.45], "color": "pigeonFootRed", "col_idx": 4},

    # === B. SOLID, SEAMLESS BODY CORE & PUFFED BREAST (10 cubes, zero holes) ===
    {"name": "thigh_fluff_left", "group": "body", "from": [-2.25, 2.35, -0.45], "to": [-1.35, 3.45, 0.55], "color": "featherPureWhite", "col_idx": 0},
    {"name": "thigh_fluff_right", "group": "body", "from": [1.35, 2.35, -0.45], "to": [2.25, 3.45, 0.55], "color": "featherPureWhite", "col_idx": 0},
    {"name": "body_lower_belly", "group": "body", "from": [-2.55, 3.25, -1.75], "to": [2.55, 4.38, 2.45], "color": "featherPureWhite", "col_idx": 0},
    {"name": "body_core_loaf", "group": "body", "from": [-2.45, 4.35, -1.65], "to": [2.45, 7.62, 2.45], "color": "featherPureWhite", "col_idx": 0},
    {"name": "breast_puff_lower", "group": "body", "from": [-2.15, 4.48, -2.55], "to": [2.15, 6.25, -1.50], "color": "featherPureWhite", "col_idx": 0},
    {"name": "breast_puff_main", "group": "body", "from": [-2.05, 6.15, -2.85], "to": [2.05, 7.48, -1.55], "color": "featherPureWhite", "col_idx": 0},
    {"name": "breast_puff_upper", "group": "body", "from": [-1.65, 7.45, -2.65], "to": [1.65, 8.48, -1.58], "color": "featherPureWhite", "col_idx": 0},
    {"name": "torso_upper_block", "group": "body", "from": [-2.25, 7.40, -1.70], "to": [2.25, 8.52, 1.75], "color": "featherPureWhite", "col_idx": 0},
    {"name": "neck_throat", "group": "body", "from": [-1.38, 7.30, -1.85], "to": [1.38, 8.85, -0.75], "color": "featherPureWhite", "col_idx": 0},
    {"name": "neck_core", "group": "body", "from": [-1.35, 7.35, -0.85], "to": [1.35, 8.95, 0.85], "color": "featherPureWhite", "col_idx": 0},

    # === C. MAJESTIC PURE WHITE WINGS & GOLDEN EPAULETTES (8 cubes) ===
    {"name": "wing_left_shoulder", "group": "wings", "from": [-2.85, 5.25, -0.75], "to": [-2.35, 7.25, 1.75], "color": "featherPureWhite", "col_idx": 0},
    {"name": "wing_left_mid", "group": "wings", "from": [-2.80, 4.25, 0.15], "to": [-2.30, 5.45, 2.18], "color": "featherPureWhite", "col_idx": 0},
    {"name": "wing_left_flight", "group": "wings", "from": [-2.78, 3.55, 1.05], "to": [-2.38, 4.40, 2.80], "color": "featherPureWhite", "col_idx": 0},
    {"name": "epaulette_left", "group": "wings", "from": [-2.92, 7.15, -0.55], "to": [-2.32, 7.50, 1.25], "color": "crownGold", "col_idx": 11},

    {"name": "wing_right_shoulder", "group": "wings", "from": [2.35, 5.25, -0.75], "to": [2.85, 7.25, 1.75], "color": "featherPureWhite", "col_idx": 0},
    {"name": "wing_right_mid", "group": "wings", "from": [2.30, 4.25, 0.15], "to": [2.80, 5.45, 2.18], "color": "featherPureWhite", "col_idx": 0},
    {"name": "wing_right_flight", "group": "wings", "from": [2.38, 3.55, 1.05], "to": [2.78, 4.40, 2.80], "color": "featherPureWhite", "col_idx": 0},
    {"name": "epaulette_right", "group": "wings", "from": [2.32, 7.15, -0.55], "to": [2.92, 7.50, 1.25], "color": "crownGold", "col_idx": 11},

    # === D. NOBLE HEAD, FRONT-FACING EXPRESSIVE EYES & LOWERED CHEEKS (11 cubes) ===
    {"name": "head_core", "group": "head", "from": [-1.55, 8.50, -1.75], "to": [1.55, 11.15, 0.95], "color": "featherPureWhite", "col_idx": 0},
    {"name": "cheek_puff_left", "group": "head", "from": [-1.85, 8.55, -1.35], "to": [-1.45, 9.35, 0.45], "color": "featherPureWhite", "col_idx": 0},
    {"name": "cheek_puff_right", "group": "head", "from": [1.45, 8.55, -1.35], "to": [1.85, 9.35, 0.45], "color": "featherPureWhite", "col_idx": 0},
    {"name": "beak_upper", "group": "head", "from": [-0.45, 8.95, -3.35], "to": [0.45, 9.65, -1.65], "color": "pigeonBeak", "col_idx": 2},
    {"name": "beak_tip", "group": "head", "from": [-0.30, 8.75, -3.95], "to": [0.30, 9.35, -3.25], "color": "pigeonBeak", "col_idx": 2},
    {"name": "beak_cere_white", "group": "head", "from": [-0.40, 9.55, -2.55], "to": [0.40, 9.95, -1.68], "color": "featherPureWhite", "col_idx": 0},
    {"name": "beak_lower", "group": "head", "from": [-0.35, 8.60, -3.15], "to": [0.35, 8.98, -1.68], "color": "pigeonBeak", "col_idx": 2},
    {"name": "eye_left", "group": "head", "from": [-1.65, 9.45, -1.92], "to": [-0.95, 10.25, -1.15], "color": "eyePupil", "col_idx": 6},
    {"name": "eye_right", "group": "head", "from": [0.95, 9.45, -1.92], "to": [1.65, 10.25, -1.15], "color": "eyePupil", "col_idx": 6},
    {"name": "sparkle_left", "group": "head", "from": [-1.52, 9.90, -1.98], "to": [-1.18, 10.20, -1.55], "color": "sparkleWhite", "col_idx": 7},
    {"name": "sparkle_right", "group": "head", "from": [1.18, 9.90, -1.98], "to": [1.52, 10.20, -1.55], "color": "sparkleWhite", "col_idx": 7},

    # === E. 24K IMPERIAL FLEUR-DE-LIS CROWN (7 cubes) ===
    {"name": "crown_circlet", "group": "crown", "from": [-1.68, 11.05, -1.68], "to": [1.68, 11.55, 0.88], "color": "crownGold", "col_idx": 11},
    {"name": "crown_peak_front", "group": "crown", "from": [-0.60, 11.45, -1.78], "to": [0.60, 12.85, -1.15], "color": "crownGold", "col_idx": 11},
    {"name": "crown_peak_back", "group": "crown", "from": [-0.55, 11.45, 0.35], "to": [0.55, 12.55, 0.95], "color": "crownGold", "col_idx": 11},
    {"name": "crown_prong_left", "group": "crown", "from": [-1.78, 11.45, -0.65], "to": [-1.15, 12.45, 0.25], "color": "crownGold", "col_idx": 11},
    {"name": "crown_prong_right", "group": "crown", "from": [1.15, 11.45, -0.65], "to": [1.78, 12.45, 0.25], "color": "crownGold", "col_idx": 11},
    {"name": "crown_ruby_front", "group": "crown", "from": [-0.25, 11.75, -1.90], "to": [0.25, 12.35, -1.68], "color": "royalRuby", "col_idx": 13},
    {"name": "crown_cross_finial", "group": "crown", "from": [-0.20, 12.80, -1.65], "to": [0.20, 13.35, -1.25], "color": "crownGold", "col_idx": 11},

    # === F. ROYAL VELVET MANTLE & ERMINE FUR (9 cubes, NO BLACK DOTS ON BACK!) ===
    {"name": "mantle_cape_upper", "group": "mantle", "from": [-2.25, 6.45, 1.85], "to": [2.25, 7.85, 2.48], "color": "mantleRed", "col_idx": 8},
    {"name": "mantle_cape_mid", "group": "mantle", "from": [-2.35, 4.85, 1.95], "to": [2.35, 6.55, 2.55], "color": "mantleRed", "col_idx": 8},
    {"name": "mantle_cape_lower", "group": "mantle", "from": [-2.25, 3.85, 2.05], "to": [2.25, 4.95, 2.58], "color": "mantleRed", "col_idx": 8},

    # Ermine fur collar & shoulders:
    {"name": "ermine_collar_back", "group": "mantle", "from": [-2.35, 7.65, 0.65], "to": [2.35, 8.45, 2.25], "color": "ermineFur", "col_idx": 9},
    {"name": "ermine_collar_shoulder_left", "group": "mantle", "from": [-2.55, 7.58, -1.25], "to": [-1.95, 8.35, 1.15], "color": "ermineFur", "col_idx": 9},
    {"name": "ermine_collar_shoulder_right", "group": "mantle", "from": [1.95, 7.58, -1.25], "to": [2.55, 8.35, 1.15], "color": "ermineFur", "col_idx": 9},
    {"name": "ermine_lapel_front_left", "group": "mantle", "from": [-2.12, 6.45, -2.05], "to": [-1.48, 7.65, -1.35], "color": "ermineFur", "col_idx": 9},
    {"name": "ermine_lapel_front_right", "group": "mantle", "from": [1.48, 6.45, -2.05], "to": [2.12, 7.65, -1.35], "color": "ermineFur", "col_idx": 9},

    # Ermine spots ONLY on front lapels:
    {"name": "ermine_spot_left", "group": "mantle", "from": [-1.95, 6.75, -2.15], "to": [-1.55, 7.15, -1.95], "color": "ermineSpot", "col_idx": 10},
    {"name": "ermine_spot_right", "group": "mantle", "from": [1.55, 6.75, -2.15], "to": [1.95, 7.15, -1.95], "color": "ermineSpot", "col_idx": 10},

    # Pristine white ermine fur hem:
    {"name": "mantle_fur_hem", "group": "mantle", "from": [-2.45, 3.75, 2.38], "to": [2.45, 4.15, 2.85], "color": "ermineFur", "col_idx": 9},

    # === G. ROYAL GRAND CROSS & RUBY MEDALLION (4 cubes) ===
    {"name": "order_gold_chain", "group": "mantle", "from": [-1.05, 7.35, -2.40], "to": [1.05, 7.75, -2.00], "color": "crownGold", "col_idx": 11},
    {"name": "order_gold_frame", "group": "mantle", "from": [-0.65, 6.45, -2.80], "to": [0.65, 7.38, -2.35], "color": "crownGold", "col_idx": 11},
    {"name": "order_ruby_gem", "group": "mantle", "from": [-0.35, 6.60, -2.95], "to": [0.35, 7.25, -2.65], "color": "royalRuby", "col_idx": 13},
    {"name": "order_ruby_sparkle", "group": "mantle", "from": [-0.20, 6.95, -2.98], "to": [0.05, 7.20, -2.82], "color": "sparkleWhite", "col_idx": 7},

    # === H. RESTORED STEPPED FAN TAIL (4 cubes, classic magnificent fan tail) ===
    {"name": "tail_fan_base", "group": "body", "from": [-1.65, 3.20, 2.05], "to": [1.65, 3.70, 3.25], "color": "featherPureWhite", "col_idx": 0},
    {"name": "tail_fan_main", "group": "body", "from": [-1.45, 3.10, 3.15], "to": [1.45, 3.65, 4.25], "color": "featherPureWhite", "col_idx": 0},
    {"name": "tail_fan_stepped_left", "group": "body", "from": [-1.85, 3.05, 2.55], "to": [-1.35, 3.55, 3.85], "color": "featherPureWhite", "col_idx": 0},
    {"name": "tail_fan_stepped_right", "group": "body", "from": [1.35, 3.05, 2.55], "to": [1.85, 3.55, 3.85], "color": "featherPureWhite", "col_idx": 0}
]

issues = blockbench_check(cubes)
print(f"Total cubes: {len(cubes)}")
print(f"Residual coplanar overlaps: {len(issues)}")
for iss in issues:
    print(f"  {iss['c1']} vs {iss['c2']} on {iss['axis']} = {iss['plane']}")

if len(issues) == 0:
    print("SUCCESS: 0 COPLANAR OVERLAPS ACHIEVED!")
    with open('scripts/pigeon_king_final_zero_zfight.json', 'w') as f:
        json.dump(cubes, f, indent=2)
    print("Saved scripts/pigeon_king_final_zero_zfight.json")
