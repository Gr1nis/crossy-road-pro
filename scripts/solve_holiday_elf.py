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

def build_holiday_elf():
    cubes = [
        # =========================================================================
        # 1. SHOES & LEGS (16 cubes)
        # Grounding: Left & right shoe soles strictly on Y = 0.00.
        # Upturned pointy elf tips with golden bells.
        # Striped red-and-white candy-cane stockings.
        # =========================================================================
        # Left shoe
        {"name": "shoe_main_left", "group": "shoes_legs", "from": [-1.80, 0.00, -1.80], "to": [-0.80, 0.70, 0.60], "color": "elfGreen", "col_idx": 0},
        {"name": "shoe_toe_curve_left", "group": "shoes_legs", "from": [-1.60, 0.15, -2.50], "to": [-1.00, 0.85, -1.70], "color": "elfGreen", "col_idx": 0},
        {"name": "shoe_toe_tip_left", "group": "shoes_legs", "from": [-1.50, 0.65, -2.85], "to": [-1.10, 1.20, -2.35], "color": "elfGreen", "col_idx": 0},
        {"name": "shoe_bell_left", "group": "shoes_legs", "from": [-1.45, 1.05, -3.15], "to": [-1.15, 1.45, -2.75], "color": "elfGold", "col_idx": 4},

        # Right shoe
        {"name": "shoe_main_right", "group": "shoes_legs", "from": [0.80, 0.00, -1.80], "to": [1.80, 0.70, 0.60], "color": "elfGreen", "col_idx": 0},
        {"name": "shoe_toe_curve_right", "group": "shoes_legs", "from": [1.00, 0.15, -2.50], "to": [1.60, 0.85, -1.70], "color": "elfGreen", "col_idx": 0},
        {"name": "shoe_toe_tip_right", "group": "shoes_legs", "from": [1.10, 0.65, -2.85], "to": [1.50, 1.20, -2.35], "color": "elfGreen", "col_idx": 0},
        {"name": "shoe_bell_right", "group": "shoes_legs", "from": [1.15, 1.05, -3.15], "to": [1.45, 1.45, -2.75], "color": "elfGold", "col_idx": 4},

        # Left leg stockings (Stripes 1-4, alternating red and white)
        {"name": "leg_stripe_r1_left", "group": "shoes_legs", "from": [-1.65, 0.55, -0.95], "to": [-0.95, 1.25, -0.05], "color": "elfRed", "col_idx": 2},
        {"name": "leg_stripe_w1_left", "group": "shoes_legs", "from": [-1.60, 1.15, -0.90], "to": [-1.00, 1.85, -0.10], "color": "elfWhite", "col_idx": 3},
        {"name": "leg_stripe_r2_left", "group": "shoes_legs", "from": [-1.65, 1.75, -0.95], "to": [-0.95, 2.45, -0.05], "color": "elfRed", "col_idx": 2},
        {"name": "leg_stripe_w2_left", "group": "shoes_legs", "from": [-1.60, 2.35, -0.90], "to": [-1.00, 3.10, -0.10], "color": "elfWhite", "col_idx": 3},

        # Right leg stockings (Stripes 1-4, alternating red and white)
        {"name": "leg_stripe_r1_right", "group": "shoes_legs", "from": [0.95, 0.55, -0.95], "to": [1.65, 1.25, -0.05], "color": "elfRed", "col_idx": 2},
        {"name": "leg_stripe_w1_right", "group": "shoes_legs", "from": [1.00, 1.15, -0.90], "to": [1.60, 1.85, -0.10], "color": "elfWhite", "col_idx": 3},
        {"name": "leg_stripe_r2_right", "group": "shoes_legs", "from": [0.95, 1.75, -0.95], "to": [1.65, 2.45, -0.05], "color": "elfRed", "col_idx": 2},
        {"name": "leg_stripe_w2_right", "group": "shoes_legs", "from": [1.00, 2.35, -0.90], "to": [1.60, 3.10, -0.10], "color": "elfWhite", "col_idx": 3},

        # =========================================================================
        # 2. COAT & BODY (13 cubes)
        # Emerald green coat/tunic with flared hem.
        # Black belt with golden buckle.
        # Scalloped festive red collar around neck.
        # =========================================================================
        {"name": "tunic_skirt_hem", "group": "coat_body", "from": [-2.20, 2.85, -1.50], "to": [2.20, 3.85, 1.10], "color": "elfGreen", "col_idx": 0},
        {"name": "tunic_skirt_trim", "group": "coat_body", "from": [-2.00, 2.70, -1.35], "to": [2.00, 3.00, 0.95], "color": "elfGreenDark", "col_idx": 1},
        {"name": "tunic_torso_main", "group": "coat_body", "from": [-2.05, 3.65, -1.35], "to": [2.05, 5.65, 0.95], "color": "elfGreen", "col_idx": 0},
        {"name": "tunic_chest_breast", "group": "coat_body", "from": [-1.75, 4.25, -1.55], "to": [1.75, 5.45, -1.25], "color": "elfGreen", "col_idx": 0},
        {"name": "belt_strap", "group": "coat_body", "from": [-2.15, 3.80, -1.45], "to": [2.15, 4.30, 1.05], "color": "elfBelt", "col_idx": 8},
        {"name": "belt_buckle_gold", "group": "coat_body", "from": [-0.60, 3.70, -1.65], "to": [0.60, 4.40, -1.30], "color": "elfGold", "col_idx": 4},
        {"name": "belt_buckle_center", "group": "coat_body", "from": [-0.25, 3.85, -1.70], "to": [0.25, 4.25, -1.55], "color": "elfBelt", "col_idx": 8},
        {"name": "collar_front_bib", "group": "coat_body", "from": [-1.65, 5.30, -1.60], "to": [1.65, 5.95, -1.15], "color": "elfRed", "col_idx": 2},
        {"name": "collar_front_petal_center", "group": "coat_body", "from": [-0.45, 4.85, -1.65], "to": [0.45, 5.40, -1.30], "color": "elfRed", "col_idx": 2},
        {"name": "collar_front_petal_left", "group": "coat_body", "from": [-1.45, 5.00, -1.65], "to": [-0.75, 5.40, -1.20], "color": "elfRed", "col_idx": 2},
        {"name": "collar_front_petal_right", "group": "coat_body", "from": [0.75, 5.00, -1.65], "to": [1.45, 5.40, -1.20], "color": "elfRed", "col_idx": 2},
        {"name": "collar_back_mantle", "group": "coat_body", "from": [-1.90, 5.35, -0.70], "to": [1.90, 6.00, 1.15], "color": "elfRed", "col_idx": 2},
        {"name": "neck_core", "group": "coat_body", "from": [-1.20, 5.45, -0.80], "to": [1.20, 6.35, 0.40], "color": "elfSkin", "col_idx": 5},

        # =========================================================================
        # 3. HEAD & FACE & EARS (16 cubes)
        # Chibi peach head, rosy blush cheeks, anime twinkle eyes, pointy elf ears.
        # =========================================================================
        {"name": "head_core", "group": "head_face", "from": [-2.10, 6.15, -1.80], "to": [2.10, 9.45, 1.40], "color": "elfSkin", "col_idx": 5},
        {"name": "hair_back_bob", "group": "head_face", "from": [-2.20, 6.30, 0.45], "to": [2.20, 9.10, 1.60], "color": "elfHair", "col_idx": 9},
        {"name": "hair_side_left", "group": "head_face", "from": [-2.25, 7.20, -0.60], "to": [-1.95, 8.80, 0.70], "color": "elfHair", "col_idx": 9},
        {"name": "hair_side_right", "group": "head_face", "from": [1.95, 7.20, -0.60], "to": [2.25, 8.80, 0.70], "color": "elfHair", "col_idx": 9},
        {"name": "hair_bangs_front", "group": "head_face", "from": [-1.70, 8.65, -1.90], "to": [1.70, 9.25, -1.75], "color": "elfHair", "col_idx": 9},
        {"name": "cheek_blush_left", "group": "head_face", "from": [-1.95, 6.70, -1.90], "to": [-1.15, 7.35, -1.75], "color": "elfCheek", "col_idx": 6},
        {"name": "cheek_blush_right", "group": "head_face", "from": [1.15, 6.70, -1.90], "to": [1.95, 7.35, -1.75], "color": "elfCheek", "col_idx": 6},
        {"name": "nose_cute", "group": "head_face", "from": [-0.30, 7.20, -2.00], "to": [0.30, 7.60, -1.75], "color": "elfSkin", "col_idx": 5},
        {"name": "eye_pupil_left", "group": "head_face", "from": [-1.75, 7.45, -1.95], "to": [-0.95, 8.45, -1.75], "color": "elfEye", "col_idx": 7},
        {"name": "eye_sparkle_left", "group": "head_face", "from": [-1.65, 8.00, -2.00], "to": [-1.25, 8.40, -1.85], "color": "elfWhite", "col_idx": 3},
        {"name": "eye_pupil_right", "group": "head_face", "from": [0.95, 7.45, -1.95], "to": [1.75, 8.45, -1.75], "color": "elfEye", "col_idx": 7},
        {"name": "eye_sparkle_right", "group": "head_face", "from": [1.25, 8.00, -2.00], "to": [1.65, 8.40, -1.85], "color": "elfWhite", "col_idx": 3},
        {"name": "ear_base_left", "group": "head_face", "from": [-2.70, 7.15, -0.40], "to": [-2.00, 8.15, 0.40], "color": "elfSkin", "col_idx": 5},
        {"name": "ear_tip_point_left", "group": "head_face", "from": [-3.30, 7.60, 0.10], "to": [-2.60, 8.45, 0.70], "color": "elfSkin", "col_idx": 5},
        {"name": "ear_base_right", "group": "head_face", "from": [2.00, 7.15, -0.40], "to": [2.70, 8.15, 0.40], "color": "elfSkin", "col_idx": 5},
        {"name": "ear_tip_point_right", "group": "head_face", "from": [2.60, 7.60, 0.10], "to": [3.30, 8.45, 0.70], "color": "elfSkin", "col_idx": 5},

        # =========================================================================
        # 4. ELF HAT (8 cubes)
        # Plush white brim cuff, emerald cone curving backward, golden pompom/bell.
        # =========================================================================
        {"name": "hat_brim_trim", "group": "elf_hat", "from": [-2.30, 9.15, -2.00], "to": [2.30, 9.85, 1.60], "color": "elfWhite", "col_idx": 3},
        {"name": "hat_cone_tier1", "group": "elf_hat", "from": [-2.00, 9.75, -1.70], "to": [2.00, 10.95, 1.30], "color": "elfGreen", "col_idx": 0},
        {"name": "hat_cone_tier2", "group": "elf_hat", "from": [-1.60, 10.85, -1.20], "to": [1.60, 11.95, 1.40], "color": "elfGreen", "col_idx": 0},
        {"name": "hat_cone_tier3_bend", "group": "elf_hat", "from": [-1.45, 11.75, -0.50], "to": [1.05, 12.75, 1.70], "color": "elfGreen", "col_idx": 0},
        {"name": "hat_droop_tier4", "group": "elf_hat", "from": [-1.20, 11.35, 1.25], "to": [0.60, 12.35, 2.45], "color": "elfGreen", "col_idx": 0},
        {"name": "hat_droop_tier5_tail", "group": "elf_hat", "from": [-0.95, 10.25, 1.85], "to": [0.35, 11.45, 2.75], "color": "elfGreen", "col_idx": 0},
        {"name": "hat_tip_socket", "group": "elf_hat", "from": [-0.75, 9.55, 2.05], "to": [0.15, 10.35, 2.70], "color": "elfWhite", "col_idx": 3},
        {"name": "hat_pompom_bell", "group": "elf_hat", "from": [-0.65, 8.85, 2.15], "to": [0.05, 9.65, 2.85], "color": "elfGold", "col_idx": 4},

        # =========================================================================
        # 5. HANDS & WIND-UP KEY (14 cubes)
        # Green sleeves, white cuffs, peach hands clasping golden toy key.
        # Golden key: vertical stem, crossbar passing through hands, top hub, wings.
        # =========================================================================
        {"name": "arm_shoulder_left", "group": "hands_key", "from": [-2.65, 4.35, -0.90], "to": [-1.95, 5.45, 0.50], "color": "elfGreen", "col_idx": 0},
        {"name": "arm_forearm_left", "group": "hands_key", "from": [-2.45, 4.05, -1.85], "to": [-1.85, 4.85, -0.65], "color": "elfGreen", "col_idx": 0},
        {"name": "sleeve_cuff_left", "group": "hands_key", "from": [-2.35, 4.00, -2.15], "to": [-1.75, 4.70, -1.75], "color": "elfWhite", "col_idx": 3},
        {"name": "hand_clasp_left", "group": "hands_key", "from": [-1.80, 4.05, -2.45], "to": [-1.20, 4.65, -1.95], "color": "elfSkin", "col_idx": 5},

        {"name": "arm_shoulder_right", "group": "hands_key", "from": [1.95, 4.35, -0.90], "to": [2.65, 5.45, 0.50], "color": "elfGreen", "col_idx": 0},
        {"name": "arm_forearm_right", "group": "hands_key", "from": [1.85, 4.05, -1.85], "to": [2.45, 4.85, -0.65], "color": "elfGreen", "col_idx": 0},
        {"name": "sleeve_cuff_right", "group": "hands_key", "from": [1.75, 4.00, -2.15], "to": [2.35, 4.70, -1.75], "color": "elfWhite", "col_idx": 3},
        {"name": "hand_clasp_right", "group": "hands_key", "from": [1.20, 4.05, -2.45], "to": [1.80, 4.65, -1.95], "color": "elfSkin", "col_idx": 5},

        {"name": "key_shaft", "group": "hands_key", "from": [-0.30, 3.25, -2.35], "to": [0.30, 5.35, -1.95], "color": "elfGold", "col_idx": 4},
        {"name": "key_bridge_bar", "group": "hands_key", "from": [-1.35, 4.15, -2.30], "to": [1.35, 4.55, -2.00], "color": "elfGold", "col_idx": 4},
        {"name": "key_handle_hub", "group": "hands_key", "from": [-0.55, 5.25, -2.40], "to": [0.55, 5.75, -1.90], "color": "elfGold", "col_idx": 4},
        {"name": "key_wing_left", "group": "hands_key", "from": [-1.45, 5.65, -2.30], "to": [-0.30, 6.75, -2.00], "color": "elfGold", "col_idx": 4},
        {"name": "key_wing_right", "group": "hands_key", "from": [0.30, 5.65, -2.30], "to": [1.45, 6.75, -2.00], "color": "elfGold", "col_idx": 4},
        {"name": "key_wing_center", "group": "hands_key", "from": [-0.35, 5.95, -2.25], "to": [0.35, 6.45, -2.05], "color": "elfGold", "col_idx": 4},
    ]
    return cubes

if __name__ == '__main__':
    cubes = build_holiday_elf()
    print(f"Total cubes count: {len(cubes)}")
    q_errs = check_quantization(cubes)
    print(f"Quantization errors: {len(q_errs)}")
    for qe in q_errs:
        print("  ", qe)

    min_y = min(c['from'][1] for c in cubes)
    grounded = [c['name'] for c in cubes if c['from'][1] == 0.0]
    print(f"Min Y: {min_y:.2f}, Grounded elements ({len(grounded)}): {grounded}")

    issues = blockbench_check(cubes)
    print(f"Coplanar overlaps: {len(issues)}")
    for iss in issues:
        print(f"  ISSUE: {iss['c1']} vs {iss['c2']} on {iss['axis']} = {iss['plane']} ({iss['col1']} vs {iss['col2']})")
