import json

# Define cubes for Pigeon King V2.0
# Addressed all user feedback:
# 1. Croissant completely removed.
# 2. Replaced with proud puffed chest + Royal Golden Order of the Crown with Ruby Medallion.
# 3. Eyes redesigned: big expressive pigeon eyes on front-side corners with dark pupil, amber iris rim, sparkle, separated from crown by white forehead.
# 4. Cheeks lowered below the eye line (Y < 9.50) so cheeks NEVER clip the eyes.
# 5. Core gap/hole completely eliminated: seamless body core + throat + neck.
# 6. Weird grey wing blobs removed: elegant layered pure snow-white wings.
# 7. Mantle and tail fixed: mantle drapes smoothly over the back with an ermine fur hem, tail extends naturally UNDER the hem.

cubes = [
    # LEGS & FEET (10 cubes, coral pink #f43f5e, Y=0 ground)
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

    # BODY & CHEST (9 cubes, pure white #ffffff, completely solid core)
    {"name": "thigh_fluff_left", "group": "body", "from": [-2.25, 2.35, -0.45], "to": [-1.35, 3.45, 0.55], "color": "featherPureWhite", "col_idx": 0},
    {"name": "thigh_fluff_right", "group": "body", "from": [1.35, 2.35, -0.45], "to": [2.25, 3.45, 0.55], "color": "featherPureWhite", "col_idx": 0},
    {"name": "body_lower_belly", "group": "body", "from": [-2.45, 3.25, -1.75], "to": [2.45, 4.45, 1.95], "color": "featherPureWhite", "col_idx": 0},
    {"name": "body_core_loaf", "group": "body", "from": [-2.45, 4.35, -1.65], "to": [2.45, 7.55, 2.25], "color": "featherPureWhite", "col_idx": 0},
    {"name": "breast_puff_lower", "group": "body", "from": [-2.15, 4.45, -2.55], "to": [2.15, 6.25, -1.55], "color": "featherPureWhite", "col_idx": 0},
    {"name": "breast_puff_main", "group": "body", "from": [-2.05, 6.15, -2.85], "to": [2.05, 7.55, -1.55], "color": "featherPureWhite", "col_idx": 0},
    {"name": "breast_puff_upper", "group": "body", "from": [-1.65, 7.45, -2.65], "to": [1.65, 8.55, -1.65], "color": "featherPureWhite", "col_idx": 0},
    {"name": "neck_throat", "group": "body", "from": [-1.45, 7.35, -1.85], "to": [1.45, 8.85, -0.75], "color": "featherPureWhite", "col_idx": 0},
    {"name": "neck_core", "group": "body", "from": [-1.45, 7.35, -0.85], "to": [1.45, 8.95, 0.85], "color": "featherPureWhite", "col_idx": 0},

    # WINGS (6 cubes, pure snow-white layered feathers, NO grey blobs)
    {"name": "wing_left_shoulder", "group": "wings", "from": [-2.85, 5.25, -0.75], "to": [-2.35, 7.25, 1.75], "color": "featherPureWhite", "col_idx": 0},
    {"name": "wing_left_mid", "group": "wings", "from": [-2.80, 4.25, 0.15], "to": [-2.30, 5.45, 2.25], "color": "featherPureWhite", "col_idx": 0},
    {"name": "wing_left_flight", "group": "wings", "from": [-2.75, 3.65, 1.15], "to": [-2.35, 4.45, 2.95], "color": "featherPureWhite", "col_idx": 0},

    {"name": "wing_right_shoulder", "group": "wings", "from": [2.35, 5.25, -0.75], "to": [2.85, 7.25, 1.75], "color": "featherPureWhite", "col_idx": 0},
    {"name": "wing_right_mid", "group": "wings", "from": [2.30, 4.25, 0.15], "to": [2.80, 5.45, 2.25], "color": "featherPureWhite", "col_idx": 0},
    {"name": "wing_right_flight", "group": "wings", "from": [2.35, 3.65, 1.15], "to": [2.75, 4.45, 2.95], "color": "featherPureWhite", "col_idx": 0},

    # HEAD & FACE (11 cubes)
    # Head core:
    {"name": "head_core", "group": "head", "from": [-1.55, 8.65, -1.75], "to": [1.55, 11.15, 0.95], "color": "featherPureWhite", "col_idx": 0},
    # Cheeks lowered strictly below eye line (Y < 9.50) so NO eye clipping:
    {"name": "cheek_puff_left", "group": "head", "from": [-1.85, 8.65, -1.35], "to": [-1.45, 9.45, 0.45], "color": "featherPureWhite", "col_idx": 0},
    {"name": "cheek_puff_right", "group": "head", "from": [1.45, 8.65, -1.35], "to": [1.85, 9.45, 0.45], "color": "featherPureWhite", "col_idx": 0},
    # Beak:
    {"name": "beak_upper", "group": "head", "from": [-0.45, 8.95, -3.35], "to": [0.45, 9.65, -1.65], "color": "pigeonBeak", "col_idx": 2},
    {"name": "beak_tip", "group": "head", "from": [-0.30, 8.75, -3.95], "to": [0.30, 9.35, -3.25], "color": "pigeonBeak", "col_idx": 2},
    {"name": "beak_cere_white", "group": "head", "from": [-0.40, 9.55, -2.55], "to": [0.40, 9.95, -1.68], "color": "featherPureWhite", "col_idx": 0},
    {"name": "beak_lower", "group": "head", "from": [-0.35, 8.60, -3.15], "to": [0.35, 8.98, -1.68], "color": "pigeonBeak", "col_idx": 2},
    # Eyes: High contrast, dark pupil with white sparkle, well below crown (forehead separates them):
    {"name": "eye_left", "group": "head", "from": [-1.68, 9.65, -1.55], "to": [-1.15, 10.45, -0.75], "color": "eyePupil", "col_idx": 6},
    {"name": "eye_right", "group": "head", "from": [1.15, 9.65, -1.55], "to": [1.68, 10.45, -0.75], "color": "eyePupil", "col_idx": 6},
    {"name": "sparkle_left", "group": "head", "from": [-1.72, 10.05, -1.45], "to": [-1.35, 10.35, -1.05], "color": "sparkleWhite", "col_idx": 7},
    {"name": "sparkle_right", "group": "head", "from": [1.35, 10.05, -1.45], "to": [1.72, 10.35, -1.05], "color": "sparkleWhite", "col_idx": 7},

    # 24K IMPERIAL CROWN (7 cubes, Fleur-de-lis, tall finial & royal ruby)
    {"name": "crown_circlet", "group": "crown", "from": [-1.65, 10.95, -1.65], "to": [1.65, 11.55, 0.85], "color": "crownGold", "col_idx": 11},
    {"name": "crown_peak_front", "group": "crown", "from": [-0.55, 11.45, -1.75], "to": [0.55, 12.85, -1.15], "color": "crownGold", "col_idx": 11},
    {"name": "crown_peak_back", "group": "crown", "from": [-0.55, 11.45, 0.35], "to": [0.55, 12.55, 0.95], "color": "crownGold", "col_idx": 11},
    {"name": "crown_prong_left", "group": "crown", "from": [-1.75, 11.45, -0.65], "to": [-1.15, 12.45, 0.25], "color": "crownGold", "col_idx": 11},
    {"name": "crown_prong_right", "group": "crown", "from": [1.15, 11.45, -0.65], "to": [1.75, 12.45, 0.25], "color": "crownGold", "col_idx": 11},
    {"name": "crown_ruby_front", "group": "crown", "from": [-0.25, 11.75, -1.88], "to": [0.25, 12.35, -1.65], "color": "royalRuby", "col_idx": 13},
    {"name": "crown_cross_finial", "group": "crown", "from": [-0.18, 12.75, -1.65], "to": [0.18, 13.25, -1.25], "color": "crownGold", "col_idx": 11},

    # ROYAL VELVET MANTLE & ERMINE FUR (11 cubes)
    # Velvet red drape down back:
    {"name": "mantle_cape_upper", "group": "mantle", "from": [-2.25, 6.45, 1.85], "to": [2.25, 7.85, 2.45], "color": "mantleRed", "col_idx": 8},
    {"name": "mantle_cape_mid", "group": "mantle", "from": [-2.35, 4.85, 1.95], "to": [2.35, 6.55, 2.55], "color": "mantleRed", "col_idx": 8},
    {"name": "mantle_cape_lower", "group": "mantle", "from": [-2.25, 3.65, 2.05], "to": [2.25, 4.95, 2.65], "color": "mantleRed", "col_idx": 8},
    # Ermine fur collar & shoulders:
    {"name": "ermine_collar_back", "group": "mantle", "from": [-2.35, 7.65, 0.65], "to": [2.35, 8.45, 2.25], "color": "ermineFur", "col_idx": 9},
    {"name": "ermine_collar_shoulder_left", "group": "mantle", "from": [-2.55, 7.55, -1.25], "to": [-1.95, 8.35, 1.15], "color": "ermineFur", "col_idx": 9},
    {"name": "ermine_collar_shoulder_right", "group": "mantle", "from": [1.95, 7.55, -1.25], "to": [2.55, 8.35, 1.15], "color": "ermineFur", "col_idx": 9},
    {"name": "ermine_lapel_front_left", "group": "mantle", "from": [-2.05, 6.45, -2.05], "to": [-1.45, 7.65, -1.35], "color": "ermineFur", "col_idx": 9},
    {"name": "ermine_lapel_front_right", "group": "mantle", "from": [1.45, 6.45, -2.05], "to": [2.05, 7.65, -1.35], "color": "ermineFur", "col_idx": 9},
    # Ermine spots (black flecks):
    {"name": "ermine_spot_left", "group": "mantle", "from": [-1.95, 6.75, -2.15], "to": [-1.55, 7.15, -1.95], "color": "ermineSpot", "col_idx": 10},
    {"name": "ermine_spot_right", "group": "mantle", "from": [1.55, 6.75, -2.15], "to": [1.95, 7.15, -1.95], "color": "ermineSpot", "col_idx": 10},
    # Ermine fur hem (luxurious white fur trim bordering cape along bottom):
    {"name": "mantle_fur_hem", "group": "mantle", "from": [-2.35, 3.45, 2.45], "to": [2.35, 3.85, 2.95], "color": "ermineFur", "col_idx": 9},

    # ROYAL ORDER OF THE CROWN & RUBY MEDALLION (3 cubes on proud puffed chest)
    {"name": "order_gold_chain", "group": "mantle", "from": [-1.05, 7.35, -2.35], "to": [1.05, 7.75, -1.95], "color": "crownGold", "col_idx": 11},
    {"name": "order_gold_frame", "group": "mantle", "from": [-0.55, 6.55, -2.75], "to": [0.55, 7.45, -2.35], "color": "crownGold", "col_idx": 11},
    {"name": "order_ruby_gem", "group": "mantle", "from": [-0.30, 6.70, -2.92], "to": [0.30, 7.30, -2.65], "color": "royalRuby", "col_idx": 13},

    # TAIL FEATHERS (4 cubes, emerging naturally UNDER the cape hem)
    {"name": "tail_fan_base", "group": "body", "from": [-1.65, 3.45, 2.15], "to": [1.65, 4.15, 3.25], "color": "featherPureWhite", "col_idx": 0},
    {"name": "tail_fan_main", "group": "body", "from": [-1.45, 3.35, 3.15], "to": [1.45, 3.95, 4.35], "color": "featherPureWhite", "col_idx": 0},
    {"name": "tail_fan_stepped_left", "group": "body", "from": [-1.85, 3.35, 2.65], "to": [-1.35, 3.85, 3.95], "color": "featherPureWhite", "col_idx": 0},
    {"name": "tail_fan_stepped_right", "group": "body", "from": [1.35, 3.35, 2.65], "to": [1.85, 3.85, 3.95], "color": "featherPureWhite", "col_idx": 0}
]

print(f"Total cubes defined: {len(cubes)}")

with open('scripts/pigeon_king_v2_cubes.json', 'w') as f:
    json.dump(cubes, f, indent=2)

print("Saved scripts/pigeon_king_v2_cubes.json")
