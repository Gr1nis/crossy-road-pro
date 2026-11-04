import json
import sys

sys.path.insert(0, 'scripts')
from blockbench_coplanar_check import blockbench_check

def check_quantization(cubes):
    errors = []
    for c in cubes:
        for idx, (f_val, t_val) in enumerate(zip(c['from'], c['to'])):
            ax = ['x', 'y', 'z'][idx]
            if abs(f_val * 20 - round(f_val * 20)) > 1e-4:
                errors.append(f"{c['name']} from[{ax}]={f_val}")
            if abs(t_val * 20 - round(t_val * 20)) > 1e-4:
                errors.append(f"{c['name']} to[{ax}]={t_val}")
    return errors

def build_reindeer_glow():
    cubes = [
        # =========================================================================
        # 1. LEGS & HOOVES (16 cubes)
        # All 4 hooves strictly grounded at Y = 0.00.
        # =========================================================================
        # Front Left Leg
        {"name": "hoof_front_left", "group": "legs_hooves", "from": [-2.30, 0.00, -2.50], "to": [-1.50, 0.50, -1.70], "color": "hoofDark", "col_idx": 4},
        {"name": "leg_shin_front_left", "group": "legs_hooves", "from": [-2.20, 0.40, -2.40], "to": [-1.60, 2.70, -1.80], "color": "reindeerCaramel", "col_idx": 0},
        {"name": "leg_knee_front_left", "group": "legs_hooves", "from": [-2.25, 1.40, -2.50], "to": [-1.55, 1.90, -2.25], "color": "reindeerDark", "col_idx": 1},
        {"name": "shoulder_front_left", "group": "legs_hooves", "from": [-2.40, 2.60, -2.60], "to": [-1.50, 4.20, -1.50], "color": "reindeerCaramel", "col_idx": 0},

        # Front Right Leg
        {"name": "hoof_front_right", "group": "legs_hooves", "from": [1.50, 0.00, -2.50], "to": [2.30, 0.50, -1.70], "color": "hoofDark", "col_idx": 4},
        {"name": "leg_shin_front_right", "group": "legs_hooves", "from": [1.60, 0.40, -2.40], "to": [2.20, 2.70, -1.80], "color": "reindeerCaramel", "col_idx": 0},
        {"name": "leg_knee_front_right", "group": "legs_hooves", "from": [1.55, 1.40, -2.50], "to": [2.25, 1.90, -2.25], "color": "reindeerDark", "col_idx": 1},
        {"name": "shoulder_front_right", "group": "legs_hooves", "from": [1.50, 2.60, -2.60], "to": [2.40, 4.20, -1.50], "color": "reindeerCaramel", "col_idx": 0},

        # Rear Left Leg
        {"name": "hoof_rear_left", "group": "legs_hooves", "from": [-2.30, 0.00, 1.70], "to": [-1.50, 0.50, 2.50], "color": "hoofDark", "col_idx": 4},
        {"name": "leg_shin_rear_left", "group": "legs_hooves", "from": [-2.20, 0.40, 1.80], "to": [-1.60, 2.60, 2.40], "color": "reindeerCaramel", "col_idx": 0},
        {"name": "leg_hock_rear_left", "group": "legs_hooves", "from": [-2.25, 1.20, 2.25], "to": [-1.55, 1.80, 2.55], "color": "reindeerDark", "col_idx": 1},
        {"name": "haunch_rear_left", "group": "legs_hooves", "from": [-2.45, 2.40, 1.30], "to": [-1.50, 4.50, 2.70], "color": "reindeerCaramel", "col_idx": 0},

        # Rear Right Leg
        {"name": "hoof_rear_right", "group": "legs_hooves", "from": [1.50, 0.00, 1.70], "to": [2.30, 0.50, 2.50], "color": "hoofDark", "col_idx": 4},
        {"name": "leg_shin_rear_right", "group": "legs_hooves", "from": [1.60, 0.40, 1.80], "to": [2.20, 2.60, 2.40], "color": "reindeerCaramel", "col_idx": 0},
        {"name": "leg_hock_rear_right", "group": "legs_hooves", "from": [1.55, 1.20, 2.25], "to": [2.25, 1.80, 2.55], "color": "reindeerDark", "col_idx": 1},
        {"name": "haunch_rear_right", "group": "legs_hooves", "from": [1.50, 2.40, 1.30], "to": [2.45, 4.50, 2.70], "color": "reindeerCaramel", "col_idx": 0},

        # =========================================================================
        # 2. BODY & TORSO (12 cubes)
        # =========================================================================
        {"name": "body_core", "group": "body_torso", "from": [-2.00, 2.80, -2.20], "to": [2.00, 5.50, 2.20], "color": "reindeerCaramel", "col_idx": 0},
        {"name": "body_withers_front", "group": "body_torso", "from": [-1.80, 5.20, -2.15], "to": [1.80, 6.00, -0.60], "color": "reindeerCaramel", "col_idx": 0},
        {"name": "body_back_spine", "group": "body_torso", "from": [-1.20, 5.30, -0.55], "to": [1.20, 5.80, 1.80], "color": "reindeerDark", "col_idx": 1},
        {"name": "body_belly_white", "group": "body_torso", "from": [-1.40, 2.45, -1.80], "to": [1.40, 2.85, 1.80], "color": "bellyWhite", "col_idx": 3},
        {"name": "body_flank_left", "group": "body_torso", "from": [-2.30, 3.20, -1.40], "to": [-1.95, 4.90, 1.40], "color": "reindeerCaramel", "col_idx": 0},
        {"name": "body_flank_right", "group": "body_torso", "from": [1.95, 3.20, -1.40], "to": [2.30, 4.90, 1.40], "color": "reindeerCaramel", "col_idx": 0},
        {"name": "body_rump_haunches", "group": "body_torso", "from": [-1.90, 3.00, 2.10], "to": [1.90, 5.40, 3.20], "color": "reindeerCaramel", "col_idx": 0},
        {"name": "rump_patch_white", "group": "body_torso", "from": [-1.50, 3.20, 3.15], "to": [1.50, 5.10, 3.45], "color": "bellyWhite", "col_idx": 3},
        {"name": "tail_base", "group": "body_torso", "from": [-0.60, 4.60, 3.30], "to": [0.60, 5.60, 4.10], "color": "reindeerCaramel", "col_idx": 0},
        {"name": "tail_white_fluff", "group": "body_torso", "from": [-0.50, 4.40, 3.40], "to": [0.50, 5.20, 4.25], "color": "bellyWhite", "col_idx": 3},
        {"name": "chest_bib_front", "group": "body_torso", "from": [-1.70, 3.10, -3.15], "to": [1.70, 5.70, -2.05], "color": "bibCream", "col_idx": 2},
        {"name": "chest_bib_lower_tuft", "group": "body_torso", "from": [-1.25, 3.30, -3.35], "to": [1.25, 4.80, -3.05], "color": "bibCream", "col_idx": 2},

        # =========================================================================
        # 3. COLLAR & JINGLE BELLS (7 cubes)
        # =========================================================================
        {"name": "neck_base_core", "group": "collar_bells", "from": [-1.50, 5.10, -2.90], "to": [1.50, 7.80, -1.40], "color": "reindeerCaramel", "col_idx": 0},
        {"name": "neck_throat_cream", "group": "collar_bells", "from": [-1.10, 5.60, -3.10], "to": [1.10, 7.30, -2.85], "color": "bibCream", "col_idx": 2},
        {"name": "collar_strap_front", "group": "collar_bells", "from": [-1.65, 5.75, -3.65], "to": [1.65, 6.45, -2.70], "color": "collarRed", "col_idx": 8},
        {"name": "collar_strap_sides", "group": "collar_bells", "from": [-1.75, 5.75, -2.75], "to": [1.75, 6.50, -1.50], "color": "collarRed", "col_idx": 8},
        {"name": "bell_center_gold", "group": "collar_bells", "from": [-0.60, 5.40, -4.30], "to": [0.60, 6.40, -3.60], "color": "bellGold", "col_idx": 9},
        {"name": "bell_left_gold", "group": "collar_bells", "from": [-1.90, 5.85, -2.50], "to": [-1.65, 6.40, -1.90], "color": "bellGold", "col_idx": 9},
        {"name": "bell_right_gold", "group": "collar_bells", "from": [1.65, 5.85, -2.50], "to": [1.90, 6.40, -1.90], "color": "bellGold", "col_idx": 9},

        # =========================================================================
        # 4. HEAD & SNOUT (15 cubes)
        # =========================================================================
        {"name": "head_core", "group": "head_snout", "from": [-1.70, 7.20, -3.80], "to": [1.70, 9.90, -1.80], "color": "reindeerCaramel", "col_idx": 0},
        {"name": "head_crown_forehead", "group": "head_snout", "from": [-1.30, 9.70, -3.30], "to": [1.30, 10.45, -1.90], "color": "reindeerCaramel", "col_idx": 0},
        {"name": "snout_bridge", "group": "head_snout", "from": [-1.10, 7.30, -5.10], "to": [1.10, 8.65, -3.70], "color": "reindeerCaramel", "col_idx": 0},
        {"name": "snout_muzzle_lower", "group": "head_snout", "from": [-1.00, 6.75, -4.90], "to": [1.00, 7.40, -3.60], "color": "bibCream", "col_idx": 2},
        {"name": "snout_tip_black_lip", "group": "head_snout", "from": [-0.50, 6.85, -5.05], "to": [0.50, 7.25, -4.60], "color": "hoofDark", "col_idx": 4},
        {"name": "rudolph_nose_glow", "group": "head_snout", "from": [-0.60, 7.50, -5.90], "to": [0.60, 8.70, -4.90], "color": "noseRubyGlow", "col_idx": 5},
        {"name": "rudolph_nose_highlight", "group": "head_snout", "from": [-0.25, 8.20, -6.00], "to": [0.25, 8.60, -5.85], "color": "bellyWhite", "col_idx": 3},
        {"name": "eye_left", "group": "head_snout", "from": [-1.85, 8.10, -3.85], "to": [-1.60, 9.05, -3.05], "color": "hoofDark", "col_idx": 4},
        {"name": "eye_sparkle_left", "group": "head_snout", "from": [-1.90, 8.60, -3.65], "to": [-1.75, 8.95, -3.25], "color": "bellyWhite", "col_idx": 3},
        {"name": "eye_right", "group": "head_snout", "from": [1.60, 8.10, -3.85], "to": [1.85, 9.05, -3.05], "color": "hoofDark", "col_idx": 4},
        {"name": "eye_sparkle_right", "group": "head_snout", "from": [1.75, 8.60, -3.65], "to": [1.90, 8.95, -3.25], "color": "bellyWhite", "col_idx": 3},
        {"name": "ear_base_left", "group": "head_snout", "from": [-2.70, 9.30, -2.60], "to": [-1.50, 10.50, -1.70], "color": "reindeerCaramel", "col_idx": 0},
        {"name": "ear_inner_left", "group": "head_snout", "from": [-2.55, 9.50, -2.65], "to": [-1.65, 10.30, -2.15], "color": "bibCream", "col_idx": 2},
        {"name": "ear_base_right", "group": "head_snout", "from": [1.50, 9.30, -2.60], "to": [2.70, 10.50, -1.70], "color": "reindeerCaramel", "col_idx": 0},
        {"name": "ear_inner_right", "group": "head_snout", "from": [1.65, 9.50, -2.65], "to": [2.55, 10.30, -2.15], "color": "bibCream", "col_idx": 2},

        # =========================================================================
        # 5. ANTLERS & FAIRY LIGHTS (16 cubes)
        # =========================================================================
        # Left Antler (Bone Ivory)
        {"name": "antler_pedicle_left", "group": "antlers_lights", "from": [-1.20, 10.30, -2.60], "to": [-0.70, 11.20, -2.00], "color": "antlerBone", "col_idx": 6},
        {"name": "antler_brow_tine_left", "group": "antlers_lights", "from": [-1.15, 10.90, -3.40], "to": [-0.75, 11.50, -2.55], "color": "antlerBone", "col_idx": 6},
        {"name": "antler_main_beam_left", "group": "antlers_lights", "from": [-1.85, 11.10, -2.50], "to": [-1.10, 13.00, -1.90], "color": "antlerBone", "col_idx": 6},
        {"name": "antler_top_fork_back_left", "group": "antlers_lights", "from": [-2.10, 12.80, -1.95], "to": [-1.40, 14.10, -1.25], "color": "antlerBone", "col_idx": 6},
        {"name": "antler_top_fork_out_left", "group": "antlers_lights", "from": [-2.80, 12.60, -2.45], "to": [-1.75, 13.60, -1.85], "color": "antlerBone", "col_idx": 6},

        # Right Antler (Bone Ivory)
        {"name": "antler_pedicle_right", "group": "antlers_lights", "from": [0.70, 10.30, -2.60], "to": [1.20, 11.20, -2.00], "color": "antlerBone", "col_idx": 6},
        {"name": "antler_brow_tine_right", "group": "antlers_lights", "from": [0.75, 10.90, -3.40], "to": [1.15, 11.50, -2.55], "color": "antlerBone", "col_idx": 6},
        {"name": "antler_main_beam_right", "group": "antlers_lights", "from": [1.10, 11.10, -2.50], "to": [1.85, 13.00, -1.90], "color": "antlerBone", "col_idx": 6},
        {"name": "antler_top_fork_back_right", "group": "antlers_lights", "from": [1.40, 12.80, -1.95], "to": [2.10, 14.10, -1.25], "color": "antlerBone", "col_idx": 6},
        {"name": "antler_top_fork_out_right", "group": "antlers_lights", "from": [1.75, 12.60, -2.45], "to": [2.80, 13.60, -1.85], "color": "antlerBone", "col_idx": 6},

        # Christmas Fairy Lights (Pine garland wire & glowing holiday bulbs)
        {"name": "garland_wire_swag", "group": "antlers_lights", "from": [-1.25, 11.35, -2.25], "to": [1.25, 11.65, -2.05], "color": "lightEmerald", "col_idx": 10},
        {"name": "light_bulb_emerald_left", "group": "antlers_lights", "from": [-1.45, 11.45, -2.75], "to": [-1.00, 12.00, -2.35], "color": "lightEmerald", "col_idx": 10},
        {"name": "light_bulb_gold_center", "group": "antlers_lights", "from": [-0.25, 10.85, -2.35], "to": [0.25, 11.45, -1.95], "color": "bellGold", "col_idx": 9},
        {"name": "light_bulb_cyan_right", "group": "antlers_lights", "from": [1.00, 11.45, -2.75], "to": [1.45, 12.00, -2.35], "color": "lightCyan", "col_idx": 11},
        {"name": "light_bulb_ruby_top_left", "group": "antlers_lights", "from": [-2.40, 12.20, -2.65], "to": [-1.95, 12.75, -2.25], "color": "lightRuby", "col_idx": 12},
        {"name": "light_bulb_gold_top_right", "group": "antlers_lights", "from": [1.95, 12.20, -2.65], "to": [2.40, 12.75, -2.25], "color": "bellGold", "col_idx": 9},
    ]
    return cubes

if __name__ == '__main__':
    cubes = build_reindeer_glow()
    print(f"Total cubes: {len(cubes)}")
    q_errs = check_quantization(cubes)
    print(f"Quantization errors: {len(q_errs)}")
    for e in q_errs:
        print("  ", e)
    issues = blockbench_check(cubes)
    print(f"Coplanar issues: {len(issues)}")
    for iss in issues:
        print(f"  {iss['c1']} vs {iss['c2']} on {iss['axis']} = {iss['plane']} ({iss['col1']} vs {iss['col2']})")
