import json
from blockbench_coplanar_check import blockbench_check

# PIGEON V2:
# 1. Slimmer neck: width reduced from 6.0 down to ~3.8, depth ~2.2, gracefully connecting chest to head.
# 2. Pizza held by crust in beak:
#    - Crust is held at beak (Z around -5.5 to -6.5).
#    - Slice fans out forward towards -Z (Z from -6.2 to -9.6), pointing the tip forward!

PIGEON_V2 = [
    # --- FEET & LEGS (pigeonFootRed = #F43F5E) ---
    {"name": "left_foot_base", "from": [-2.6, 0.0, -1.0], "to": [-1.4, 0.5, 1.0], "color": "pigeonFootRed", "col_idx": 2},
    {"name": "left_toe_mid", "from": [-2.3, 0.05, -2.4], "to": [-1.7, 0.45, -0.9], "color": "pigeonFootRed", "col_idx": 2},
    {"name": "left_toe_outer", "from": [-3.1, 0.05, -2.1], "to": [-2.5, 0.45, -0.9], "color": "pigeonFootRed", "col_idx": 2},
    {"name": "left_toe_inner", "from": [-1.5, 0.05, -2.1], "to": [-0.9, 0.45, -0.9], "color": "pigeonFootRed", "col_idx": 2},
    {"name": "left_toe_hallux", "from": [-2.3, 0.05, 0.9], "to": [-1.7, 0.45, 1.9], "color": "pigeonFootRed", "col_idx": 2},
    {"name": "left_leg_shank", "from": [-2.3, 0.4, -0.3], "to": [-1.7, 2.5, 0.3], "color": "pigeonFootRed", "col_idx": 2},
    {"name": "left_thigh_fluff", "from": [-2.5, 2.3, -0.7], "to": [-1.5, 3.7, 0.7], "color": "pigeonGrey", "col_idx": 0},

    {"name": "right_foot_base", "from": [1.4, 0.0, -1.0], "to": [2.6, 0.5, 1.0], "color": "pigeonFootRed", "col_idx": 2},
    {"name": "right_toe_mid", "from": [1.7, 0.05, -2.4], "to": [2.3, 0.45, -0.9], "color": "pigeonFootRed", "col_idx": 2},
    {"name": "right_toe_outer", "from": [2.5, 0.05, -2.1], "to": [3.1, 0.45, -0.9], "color": "pigeonFootRed", "col_idx": 2},
    {"name": "right_toe_inner", "from": [0.9, 0.05, -2.1], "to": [1.5, 0.45, -0.9], "color": "pigeonFootRed", "col_idx": 2},
    {"name": "right_toe_hallux", "from": [1.7, 0.05, 0.9], "to": [2.3, 0.45, 1.9], "color": "pigeonFootRed", "col_idx": 2},
    {"name": "right_leg_shank", "from": [1.7, 0.4, -0.3], "to": [2.3, 2.5, 0.3], "color": "pigeonFootRed", "col_idx": 2},
    {"name": "right_thigh_fluff", "from": [1.5, 2.3, -0.7], "to": [2.5, 3.7, 0.7], "color": "pigeonGrey", "col_idx": 0},

    # --- BODY & BREAST ---
    {"name": "body_belly_base", "from": [-3.2, 3.0, -2.8], "to": [3.2, 4.3, 3.2], "color": "pigeonGrey", "col_idx": 0},
    {"name": "body_core_loaf", "from": [-3.8, 4.1, -3.4], "to": [3.8, 8.2, 3.6], "color": "pigeonGrey", "col_idx": 0},
    {"name": "breast_puff_front", "from": [-3.0, 4.5, -4.6], "to": [3.0, 7.8, -3.2], "color": "white", "col_idx": 1},
    {"name": "undertail_cushion", "from": [-2.0, 3.8, 3.4], "to": [2.0, 5.4, 5.0], "color": "pigeonGrey", "col_idx": 0},

    # --- WINGS ---
    {"name": "left_wing_mantle", "from": [-4.4, 4.8, -2.8], "to": [-3.6, 7.8, 2.2], "color": "pigeonGrey", "col_idx": 0},
    {"name": "left_wing_bar_1", "from": [-4.5, 5.1, -0.4], "to": [-3.7, 7.2, 0.5], "color": "darkCharcoal", "col_idx": 3},
    {"name": "left_wing_bar_2", "from": [-4.5, 4.7, 1.0], "to": [-3.7, 6.7, 1.9], "color": "darkCharcoal", "col_idx": 3},
    {"name": "left_wing_primaries", "from": [-4.2, 4.4, 2.1], "to": [-2.3, 5.8, 6.2], "color": "darkCharcoal", "col_idx": 3},

    {"name": "right_wing_mantle", "from": [3.6, 4.8, -2.8], "to": [4.4, 7.8, 2.2], "color": "pigeonGrey", "col_idx": 0},
    {"name": "right_wing_bar_1", "from": [3.7, 5.1, -0.4], "to": [4.5, 7.2, 0.5], "color": "darkCharcoal", "col_idx": 3},
    {"name": "right_wing_bar_2", "from": [3.7, 4.7, 1.0], "to": [4.5, 6.7, 1.9], "color": "darkCharcoal", "col_idx": 3},
    {"name": "right_wing_primaries", "from": [2.3, 4.4, 2.1], "to": [4.2, 5.8, 6.2], "color": "darkCharcoal", "col_idx": 3},

    # --- TAIL FAN ---
    {"name": "tail_base_grey", "from": [-2.4, 5.1, 3.8], "to": [2.4, 6.4, 6.6], "color": "pigeonGrey", "col_idx": 0},
    {"name": "tail_black_band", "from": [-2.6, 4.6, 6.4], "to": [2.6, 5.7, 8.8], "color": "darkCharcoal", "col_idx": 3},
    {"name": "tail_white_tip", "from": [-2.4, 4.8, 8.6], "to": [2.4, 5.5, 9.6], "color": "white", "col_idx": 1},

    # --- SLIMMER ELEGANT IRIDESCENT NECK ---
    # Width is now [-1.9, 1.9] (width 3.8 instead of 6.0!)
    {"name": "neck_base_teal", "from": [-1.9, 7.9, -3.9], "to": [1.9, 9.2, -1.5], "color": "pigeonTeal", "col_idx": 4},
    {"name": "neck_collar_purple", "from": [-1.8, 9.0, -3.7], "to": [1.8, 10.3, -1.7], "color": "purpleNeck", "col_idx": 5},
    {"name": "neck_sheen_front", "from": [-1.4, 8.2, -4.2], "to": [1.4, 9.7, -3.5], "color": "pigeonTeal", "col_idx": 4},

    # --- HEAD & CURIOUS FACE ---
    {"name": "head_core", "from": [-2.5, 10.0, -4.0], "to": [2.5, 13.8, 0.2], "color": "pigeonGrey", "col_idx": 0},
    {"name": "head_crown", "from": [-1.9, 13.6, -3.5], "to": [1.9, 14.5, -0.6], "color": "pigeonGrey", "col_idx": 0},

    {"name": "eye_ring_left", "from": [-2.75, 11.2, -3.3], "to": [-2.35, 12.8, -1.7], "color": "orangeFruit", "col_idx": 6},
    {"name": "eye_pupil_left", "from": [-2.8, 11.5, -3.0], "to": [-2.3, 12.5, -2.0], "color": "darkCharcoal", "col_idx": 3},
    {"name": "eye_sparkle_left", "from": [-2.85, 12.0, -2.8], "to": [-2.4, 12.4, -2.3], "color": "white", "col_idx": 1},

    {"name": "eye_ring_right", "from": [2.35, 11.2, -3.3], "to": [2.75, 12.8, -1.7], "color": "orangeFruit", "col_idx": 6},
    {"name": "eye_pupil_right", "from": [2.3, 11.5, -3.0], "to": [2.8, 12.5, -2.0], "color": "darkCharcoal", "col_idx": 3},
    {"name": "eye_sparkle_right", "from": [2.4, 12.0, -2.8], "to": [2.85, 12.4, -2.3], "color": "white", "col_idx": 1},

    # Beak & Cere holding the pizza crust firmly:
    {"name": "beak_upper", "from": [-0.8, 11.2, -6.1], "to": [0.8, 11.9, -3.8], "color": "orangeFruit", "col_idx": 6},
    {"name": "beak_tip", "from": [-0.5, 10.9, -6.7], "to": [0.5, 11.7, -5.7], "color": "orangeFruit", "col_idx": 6},
    {"name": "beak_lower", "from": [-0.7, 10.3, -5.5], "to": [0.7, 11.0, -3.9], "color": "orangeFruit", "col_idx": 6},
    {"name": "cere_waxy_bump", "from": [-0.9, 11.8, -5.1], "to": [0.9, 12.5, -3.9], "color": "white", "col_idx": 1},

    # --- PIZZA HELD BY CRUST IN BEAK ---
    # 1. Golden crust held firmly in the mouth (Z from -5.4 to -6.5, width 5.6 across beak):
    {"name": "pizza_crust", "from": [-2.8, 10.8, -6.5], "to": [2.8, 11.8, -5.4], "color": "pizzaCrust", "col_idx": 7},

    # 2. Triangular pizza slice extending FORWARD (Z from -6.3 down to -9.6):
    # Base near crust (wide, width 4.8, Z -6.3 to -7.3):
    {"name": "pizza_sauce_base", "from": [-2.4, 10.6, -9.2], "to": [2.4, 11.15, -6.0], "color": "pizzaRed", "col_idx": 9},
    {"name": "pizza_cheese_wide", "from": [-2.3, 11.05, -7.4], "to": [2.3, 11.6, -6.2], "color": "pizzaCheese", "col_idx": 8},

    # Mid section (medium, width 3.2, Z -7.3 to -8.5):
    {"name": "pizza_cheese_mid", "from": [-1.6, 10.95, -8.6], "to": [1.6, 11.5, -7.2], "color": "pizzaCheese", "col_idx": 8},

    # Pointy front tip pointing OUTWARD (narrow, width 1.6, Z -8.4 to -9.6):
    {"name": "pizza_cheese_tip", "from": [-0.8, 10.85, -9.6], "to": [0.8, 11.4, -8.4], "color": "pizzaCheese", "col_idx": 8},

    # 3. Pepperoni slices arranged on the slice:
    {"name": "pepperoni_back_left", "from": [-1.7, 11.45, -7.3], "to": [-0.6, 11.85, -6.3], "color": "pizzaRed", "col_idx": 9},
    {"name": "pepperoni_back_right", "from": [0.6, 11.45, -7.3], "to": [1.7, 11.85, -6.3], "color": "pizzaRed", "col_idx": 9},
    {"name": "pepperoni_front", "from": [-0.6, 11.35, -8.5], "to": [0.6, 11.75, -7.5], "color": "pizzaRed", "col_idx": 9},
    {"name": "basil_leaf", "from": [-1.2, 11.45, -8.3], "to": [-0.5, 11.80, -7.6], "color": "greenLeaf", "col_idx": 10},

    # 4. Melted cheese pull drips hanging down from the sides:
    {"name": "cheese_drip_left", "from": [-1.9, 9.8, -7.3], "to": [-1.3, 11.1, -6.7], "color": "pizzaCheese", "col_idx": 8},
    {"name": "cheese_drip_right", "from": [1.1, 10.0, -7.7], "to": [1.7, 11.1, -7.1], "color": "pizzaCheese", "col_idx": 8},
]

for c in PIGEON_V2:
    c['uv'] = [c['col_idx'], 0, c['col_idx'] + 1, 1]

issues = blockbench_check(PIGEON_V2)
print(f"PIGEON V2 COPPLANAR OVERLAPS: {len(issues)}")
for iss in issues:
    print(f"  {iss['c1']} vs {iss['c2']} on {iss['axis']} = {iss['plane']} ({iss['col1']} vs {iss['col2']})")

if len(issues) == 0:
    print("SUCCESS: PIGEON V2 HAS EXACTLY ZERO COPLANAR OVERLAPS!")
    with open('scripts/pigeon_v2_zero_zfight.json', 'w') as f:
        json.dump(PIGEON_V2, f, indent=2)
