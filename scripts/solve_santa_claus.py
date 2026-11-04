import json
import os
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

def build_santa_claus():
    cubes = [
        # =========================================================================
        # 1. BOOTS & LEGS (8 cubes)
        # Grounding: Left & right boot soles strictly grounded on Y = 0.00 (min_y = 0.00).
        # =========================================================================
        {"name": "boot_sole_left", "group": "boots_legs", "from": [-2.20, 0.00, -2.40], "to": [-0.70, 0.70, 0.60], "color": "bootBlack", "col_idx": 4},
        {"name": "boot_instep_left", "group": "boots_legs", "from": [-2.05, 0.60, -2.25], "to": [-0.85, 1.15, -0.65], "color": "bootBlack", "col_idx": 4},
        {"name": "boot_fur_cuff_left", "group": "boots_legs", "from": [-2.35, 1.05, -1.75], "to": [-0.55, 1.65, 0.45], "color": "furWhiteSoft", "col_idx": 3},
        {"name": "pants_leg_left", "group": "boots_legs", "from": [-2.10, 1.55, -1.45], "to": [-0.80, 2.50, 0.25], "color": "santaRedDark", "col_idx": 1},

        {"name": "boot_sole_right", "group": "boots_legs", "from": [0.70, 0.00, -2.40], "to": [2.20, 0.70, 0.60], "color": "bootBlack", "col_idx": 4},
        {"name": "boot_instep_right", "group": "boots_legs", "from": [0.85, 0.60, -2.25], "to": [2.05, 1.15, -0.65], "color": "bootBlack", "col_idx": 4},
        {"name": "boot_fur_cuff_right", "group": "boots_legs", "from": [0.55, 1.05, -1.75], "to": [2.35, 1.65, 0.45], "color": "furWhiteSoft", "col_idx": 3},
        {"name": "pants_leg_right", "group": "boots_legs", "from": [0.80, 1.55, -1.45], "to": [2.10, 2.50, 0.25], "color": "santaRedDark", "col_idx": 1},

        # =========================================================================
        # 2. COAT & BODY (15 cubes)
        # =========================================================================
        {"name": "coat_fur_hem_front", "group": "coat_body", "from": [-2.55, 2.20, -1.85], "to": [2.55, 2.90, -0.95], "color": "furWhite", "col_idx": 2},
        {"name": "coat_fur_hem_back", "group": "coat_body", "from": [-2.50, 2.25, -1.00], "to": [2.50, 2.85, 1.25], "color": "furWhiteSoft", "col_idx": 3},
        {"name": "coat_skirt_lower", "group": "coat_body", "from": [-2.45, 2.80, -1.80], "to": [2.45, 3.60, 1.10], "color": "santaRed", "col_idx": 0},
        {"name": "coat_belly_main", "group": "coat_body", "from": [-2.35, 3.55, -1.75], "to": [2.35, 5.25, 1.05], "color": "santaRed", "col_idx": 0},
        {"name": "coat_belly_bump", "group": "coat_body", "from": [-1.85, 3.65, -2.15], "to": [1.85, 5.00, -1.55], "color": "santaRed", "col_idx": 0},
        {"name": "coat_chest_upper", "group": "coat_body", "from": [-2.20, 5.15, -1.55], "to": [2.20, 6.20, 0.95], "color": "santaRed", "col_idx": 0},
        {"name": "coat_center_fur_lower", "group": "coat_body", "from": [-0.45, 2.85, -2.25], "to": [0.45, 3.85, -1.65], "color": "furWhite", "col_idx": 2},
        {"name": "coat_center_fur_upper", "group": "coat_body", "from": [-0.45, 4.70, -2.25], "to": [0.45, 5.70, -1.45], "color": "furWhite", "col_idx": 2},
        {"name": "belt_strap_main", "group": "coat_body", "from": [-2.50, 3.80, -1.80], "to": [2.50, 4.75, 1.10], "color": "beltBlack", "col_idx": 5},
        {"name": "belt_buckle_gold_rim", "group": "coat_body", "from": [-1.00, 3.70, -2.35], "to": [1.00, 4.80, -1.70], "color": "buckleGold", "col_idx": 6},
        {"name": "belt_buckle_inner_dark", "group": "coat_body", "from": [-0.60, 3.90, -2.40], "to": [0.60, 4.65, -2.25], "color": "beltBlack", "col_idx": 5},
        {"name": "belt_buckle_prong_gold", "group": "coat_body", "from": [-0.15, 3.85, -2.45], "to": [0.15, 4.70, -2.30], "color": "goldAccent", "col_idx": 13},
        {"name": "coat_collar_fur_back", "group": "coat_body", "from": [-2.10, 5.95, -0.85], "to": [2.10, 6.55, 1.10], "color": "furWhiteSoft", "col_idx": 3},
        {"name": "coat_collar_fur_front", "group": "coat_body", "from": [-1.85, 5.80, -1.85], "to": [1.85, 6.40, -0.75], "color": "furWhite", "col_idx": 2},
        {"name": "neck_core", "group": "coat_body", "from": [-1.20, 6.15, -0.95], "to": [1.20, 6.85, 0.55], "color": "peachSkin", "col_idx": 7},
        # =========================================================================
        # 3. ARMS & MITTENS (12 cubes)
        # =========================================================================
        {"name": "arm_shoulder_left", "group": "arms_mittens", "from": [-3.15, 4.45, -1.25], "to": [-2.15, 6.05, 0.65], "color": "santaRed", "col_idx": 0},
        {"name": "arm_forearm_left", "group": "arms_mittens", "from": [-3.30, 3.65, -1.85], "to": [-2.30, 4.70, -0.45], "color": "santaRed", "col_idx": 0},
        {"name": "arm_cuff_fur_left", "group": "arms_mittens", "from": [-3.45, 3.15, -2.15], "to": [-2.20, 3.85, -0.85], "color": "furWhiteSoft", "col_idx": 3},
        {"name": "mitten_hand_left", "group": "arms_mittens", "from": [-3.25, 2.35, -2.35], "to": [-2.35, 3.35, -1.15], "color": "mittenGreen", "col_idx": 9},
        {"name": "mitten_thumb_left", "group": "arms_mittens", "from": [-2.45, 2.70, -2.55], "to": [-1.95, 3.20, -2.05], "color": "mittenGreen", "col_idx": 9},
        {"name": "mitten_cuff_piping_left", "group": "arms_mittens", "from": [-3.35, 3.00, -2.25], "to": [-2.25, 3.25, -1.05], "color": "mittenGreen", "col_idx": 9},

        {"name": "arm_shoulder_right", "group": "arms_mittens", "from": [2.15, 4.45, -1.25], "to": [3.15, 6.05, 0.65], "color": "santaRed", "col_idx": 0},
        {"name": "arm_forearm_right", "group": "arms_mittens", "from": [2.30, 3.65, -1.85], "to": [3.30, 4.70, -0.45], "color": "santaRed", "col_idx": 0},
        {"name": "arm_cuff_fur_right", "group": "arms_mittens", "from": [2.20, 3.15, -2.15], "to": [3.45, 3.85, -0.85], "color": "furWhiteSoft", "col_idx": 3},
        {"name": "mitten_hand_right", "group": "arms_mittens", "from": [2.35, 2.35, -2.35], "to": [3.25, 3.35, -1.15], "color": "mittenGreen", "col_idx": 9},
        {"name": "mitten_thumb_right", "group": "arms_mittens", "from": [1.95, 2.70, -2.55], "to": [2.45, 3.20, -2.05], "color": "mittenGreen", "col_idx": 9},
        {"name": "mitten_cuff_piping_right", "group": "arms_mittens", "from": [2.25, 3.00, -2.25], "to": [3.35, 3.25, -1.05], "color": "mittenGreen", "col_idx": 9},

        # =========================================================================
        # 4. HEAD, FACE & BEARD (19 cubes)
        # =========================================================================
        {"name": "head_core", "group": "head_face_beard", "from": [-1.75, 6.45, -1.35], "to": [1.75, 8.25, 0.85], "color": "peachSkin", "col_idx": 7},
        {"name": "face_forehead_brow", "group": "head_face_beard", "from": [-1.65, 7.40, -1.55], "to": [1.65, 8.15, -1.25], "color": "peachSkin", "col_idx": 7},
        {"name": "cheek_left", "group": "head_face_beard", "from": [-1.85, 6.75, -1.70], "to": [-1.15, 7.35, -1.30], "color": "rosyCheek", "col_idx": 8},
        {"name": "cheek_right", "group": "head_face_beard", "from": [1.15, 6.75, -1.70], "to": [1.85, 7.35, -1.30], "color": "rosyCheek", "col_idx": 8},
        {"name": "nose_santa", "group": "head_face_beard", "from": [-0.45, 6.85, -2.20], "to": [0.45, 7.45, -1.55], "color": "rosyCheek", "col_idx": 8},
        {"name": "eye_left", "group": "head_face_beard", "from": [-1.10, 7.30, -1.75], "to": [-0.55, 7.75, -1.50], "color": "beltBlack", "col_idx": 5},
        {"name": "eye_right", "group": "head_face_beard", "from": [0.55, 7.30, -1.75], "to": [1.10, 7.75, -1.50], "color": "beltBlack", "col_idx": 5},
        {"name": "eye_sparkle_left", "group": "head_face_beard", "from": [-0.95, 7.50, -1.80], "to": [-0.65, 7.70, -1.65], "color": "furWhite", "col_idx": 2},
        {"name": "eye_sparkle_right", "group": "head_face_beard", "from": [0.65, 7.50, -1.80], "to": [0.95, 7.70, -1.65], "color": "furWhite", "col_idx": 2},
        {"name": "eyebrow_bushy_left", "group": "head_face_beard", "from": [-1.30, 7.80, -1.85], "to": [-0.45, 8.25, -1.45], "color": "furWhite", "col_idx": 2},
        {"name": "eyebrow_bushy_right", "group": "head_face_beard", "from": [0.45, 7.80, -1.85], "to": [1.30, 8.25, -1.45], "color": "furWhite", "col_idx": 2},
        {"name": "mustache_center", "group": "head_face_beard", "from": [-0.40, 6.55, -2.25], "to": [0.40, 7.05, -1.80], "color": "furWhite", "col_idx": 2},
        {"name": "mustache_wing_left", "group": "head_face_beard", "from": [-1.55, 6.45, -2.15], "to": [-0.35, 6.95, -1.75], "color": "furWhite", "col_idx": 2},
        {"name": "mustache_wing_right", "group": "head_face_beard", "from": [0.35, 6.45, -2.15], "to": [1.55, 6.95, -1.75], "color": "furWhite", "col_idx": 2},
        {"name": "beard_sideburn_left", "group": "head_face_beard", "from": [-2.05, 6.25, -1.60], "to": [-1.55, 7.55, -0.20], "color": "furWhiteSoft", "col_idx": 3},
        {"name": "beard_sideburn_right", "group": "head_face_beard", "from": [1.55, 6.25, -1.60], "to": [2.05, 7.55, -0.20], "color": "furWhiteSoft", "col_idx": 3},
        {"name": "beard_jaw_chin_main", "group": "head_face_beard", "from": [-1.90, 5.75, -2.10], "to": [1.90, 6.65, -0.80], "color": "furWhite", "col_idx": 2},
        {"name": "beard_chest_cascade", "group": "head_face_beard", "from": [-1.45, 4.85, -2.30], "to": [1.45, 5.85, -1.60], "color": "furWhite", "col_idx": 2},
        {"name": "beard_tip_curl", "group": "head_face_beard", "from": [-0.85, 4.35, -2.20], "to": [0.85, 4.95, -1.85], "color": "furWhiteSoft", "col_idx": 3},

        # =========================================================================
        # 5. SANTA HAT (10 cubes)
        # =========================================================================
        {"name": "hat_brim_front", "group": "santa_hat", "from": [-2.05, 8.05, -1.75], "to": [2.05, 8.75, -0.90], "color": "furWhite", "col_idx": 2},
        {"name": "hat_brim_sides", "group": "santa_hat", "from": [-2.15, 8.00, -0.95], "to": [2.15, 8.70, 0.95], "color": "furWhiteSoft", "col_idx": 3},
        {"name": "hat_brim_back", "group": "santa_hat", "from": [-2.05, 8.05, 0.80], "to": [2.05, 8.75, 1.25], "color": "furWhiteSoft", "col_idx": 3},
        {"name": "hat_cone_lower", "group": "santa_hat", "from": [-1.80, 8.65, -1.25], "to": [1.80, 9.45, 0.90], "color": "santaRed", "col_idx": 0},
        {"name": "hat_cone_mid", "group": "santa_hat", "from": [-1.55, 9.35, -0.95], "to": [1.55, 10.05, 0.70], "color": "santaRed", "col_idx": 0},
        {"name": "hat_cone_upper", "group": "santa_hat", "from": [-1.25, 9.95, -0.65], "to": [1.25, 10.55, 0.50], "color": "santaRed", "col_idx": 0},
        {"name": "hat_droop_slant", "group": "santa_hat", "from": [0.45, 9.85, 0.40], "to": [1.65, 10.45, 1.35], "color": "santaRed", "col_idx": 0},
        {"name": "hat_droop_hang", "group": "santa_hat", "from": [1.15, 8.85, 0.95], "to": [1.95, 9.95, 1.65], "color": "santaRed", "col_idx": 0},
        {"name": "hat_pom_pom_main", "group": "santa_hat", "from": [1.05, 8.10, 1.15], "to": [2.15, 8.95, 2.05], "color": "furWhite", "col_idx": 2},
        {"name": "hat_pom_pom_fluff", "group": "santa_hat", "from": [1.20, 8.20, 1.05], "to": [2.00, 8.80, 2.15], "color": "furWhiteSoft", "col_idx": 3},

        # =========================================================================
        # 6. GIFT SACK & HOLIDAY ACCESSORIES (14 cubes)
        # =========================================================================
        {"name": "sack_body_base", "group": "gift_sack", "from": [-2.25, 2.75, 0.95], "to": [2.25, 4.35, 3.25], "color": "sackEmerald", "col_idx": 10},
        {"name": "sack_body_mid", "group": "gift_sack", "from": [-2.45, 4.25, 0.85], "to": [2.45, 5.80, 3.45], "color": "sackEmerald", "col_idx": 10},
        {"name": "sack_bulge_left", "group": "gift_sack", "from": [-2.85, 3.55, 1.15], "to": [-2.35, 5.25, 2.95], "color": "sackDark", "col_idx": 11},
        {"name": "sack_bulge_right", "group": "gift_sack", "from": [2.35, 3.55, 1.15], "to": [2.85, 5.25, 2.95], "color": "sackDark", "col_idx": 11},
        {"name": "sack_bulge_back", "group": "gift_sack", "from": [-2.05, 3.75, 3.35], "to": [2.05, 5.35, 3.85], "color": "sackDark", "col_idx": 11},
        {"name": "sack_neck_cinch", "group": "gift_sack", "from": [-1.65, 5.75, 1.25], "to": [1.65, 6.35, 2.95], "color": "sackEmerald", "col_idx": 10},
        {"name": "sack_rope_gold", "group": "gift_sack", "from": [-1.75, 5.95, 1.15], "to": [1.75, 6.20, 3.05], "color": "buckleGold", "col_idx": 6},
        {"name": "sack_rope_knot_gold", "group": "gift_sack", "from": [-0.45, 5.85, 3.00], "to": [0.45, 6.45, 3.40], "color": "goldAccent", "col_idx": 13},
        {"name": "sack_ruffle_top", "group": "gift_sack", "from": [-1.95, 6.25, 1.05], "to": [1.95, 6.95, 2.85], "color": "sackEmerald", "col_idx": 10},
        {"name": "candy_stem_red", "group": "gift_sack", "from": [-1.35, 6.85, 1.55], "to": [-0.85, 7.85, 2.05], "color": "santaRed", "col_idx": 0},
        {"name": "candy_stem_white", "group": "gift_sack", "from": [-1.30, 7.80, 1.60], "to": [-0.90, 8.45, 2.00], "color": "furWhite", "col_idx": 2},
        {"name": "candy_hook_curve", "group": "gift_sack", "from": [-1.65, 8.25, 1.55], "to": [-0.85, 8.85, 2.05], "color": "santaRed", "col_idx": 0},
        {"name": "gift_box_main", "group": "gift_sack", "from": [0.35, 6.85, 1.45], "to": [1.55, 8.05, 2.65], "color": "giftCyan", "col_idx": 12},
        {"name": "gift_ribbon_bow", "group": "gift_sack", "from": [0.65, 8.00, 1.75], "to": [1.25, 8.45, 2.35], "color": "goldAccent", "col_idx": 13},
    ]

    for c in cubes:
        c['from'] = [round(v, 2) for v in c['from']]
        c['to'] = [round(v, 2) for v in c['to']]

    return cubes

if __name__ == '__main__':
    cubes = build_santa_claus()
    print(f"Total cubes: {len(cubes)}")
    q_errs = check_quantization(cubes)
    print(f"Quantization errors: {len(q_errs)}")
    issues = blockbench_check(cubes)
    print(f"Coplanar overlaps: {len(issues)}")
