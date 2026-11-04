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

def build_snow_hare():
    cubes = [
        # =========================================================================
        # 1. FEET & HAUNCHES (8 cubes, grounded at Y = 0.00)
        # =========================================================================
        {
            "name": "foot_sole_left",
            "group": "feet",
            "from": [-2.45, 0.00, -1.05],
            "to": [-0.95, 0.90, 2.35],
            "color": "hareWhite",
            "col_idx": 0
        },
        {
            "name": "foot_sole_right",
            "group": "feet",
            "from": [0.95, 0.00, -1.05],
            "to": [2.45, 0.90, 2.35],
            "color": "hareWhite",
            "col_idx": 0
        },
        {
            "name": "foot_toes_left",
            "group": "feet",
            "from": [-2.30, 0.15, -1.85],
            "to": [-1.10, 0.75, -0.85],
            "color": "hareWhiteSoft",
            "col_idx": 1
        },
        {
            "name": "foot_toes_right",
            "group": "feet",
            "from": [1.10, 0.15, -1.85],
            "to": [2.30, 0.75, -0.85],
            "color": "hareWhiteSoft",
            "col_idx": 1
        },
        {
            "name": "haunch_left",
            "group": "feet",
            "from": [-2.60, 0.70, 0.45],
            "to": [-1.20, 2.80, 2.45],
            "color": "hareWhite",
            "col_idx": 0
        },
        {
            "name": "haunch_right",
            "group": "feet",
            "from": [1.20, 0.70, 0.45],
            "to": [2.60, 2.80, 2.45],
            "color": "hareWhite",
            "col_idx": 0
        },
        {
            "name": "haunch_fluff_left",
            "group": "feet",
            "from": [-2.85, 1.15, 0.65],
            "to": [-2.45, 2.45, 2.25],
            "color": "hareWhiteSoft",
            "col_idx": 1
        },
        {
            "name": "haunch_fluff_right",
            "group": "feet",
            "from": [2.45, 1.15, 0.65],
            "to": [2.85, 2.45, 2.25],
            "color": "hareWhiteSoft",
            "col_idx": 1
        },

        # =========================================================================
        # 2. BODY (7 cubes)
        # =========================================================================
        {
            "name": "body_core",
            "group": "body",
            "from": [-2.10, 1.20, -1.70],
            "to": [2.10, 5.80, 2.10],
            "color": "hareWhite",
            "col_idx": 0
        },
        {
            "name": "body_lower_belly",
            "group": "body",
            "from": [-1.80, 0.55, -1.45],
            "to": [1.80, 1.60, 1.80],
            "color": "hareWhiteSoft",
            "col_idx": 1
        },
        {
            "name": "body_chest_front",
            "group": "body",
            "from": [-1.75, 1.80, -2.20],
            "to": [1.75, 5.50, -1.55],
            "color": "hareWhite",
            "col_idx": 0
        },
        {
            "name": "belly_cream_bib",
            "group": "body",
            "from": [-1.35, 2.05, -2.30],
            "to": [1.35, 4.65, -2.05],
            "color": "hareCream",
            "col_idx": 2
        },
        {
            "name": "body_back_cushion",
            "group": "body",
            "from": [-1.90, 1.75, 1.95],
            "to": [1.90, 5.20, 2.65],
            "color": "hareWhite",
            "col_idx": 0
        },
        {
            "name": "body_flank_puff_left",
            "group": "body",
            "from": [-2.40, 2.40, -1.15],
            "to": [-1.95, 4.80, 1.65],
            "color": "hareWhiteSoft",
            "col_idx": 1
        },
        {
            "name": "body_flank_puff_right",
            "group": "body",
            "from": [1.95, 2.40, -1.15],
            "to": [2.40, 4.80, 1.65],
            "color": "hareWhiteSoft",
            "col_idx": 1
        },

        # =========================================================================
        # 3. TAIL (5 cubes)
        # =========================================================================
        {
            "name": "tail_core",
            "group": "tail",
            "from": [-0.85, 1.65, 2.35],
            "to": [0.85, 3.25, 3.95],
            "color": "hareWhite",
            "col_idx": 0
        },
        {
            "name": "tail_puff_top",
            "group": "tail",
            "from": [-0.65, 3.10, 2.50],
            "to": [0.65, 3.65, 3.75],
            "color": "hareWhiteSoft",
            "col_idx": 1
        },
        {
            "name": "tail_puff_bottom",
            "group": "tail",
            "from": [-0.65, 1.25, 2.50],
            "to": [0.65, 1.85, 3.75],
            "color": "hareWhiteSoft",
            "col_idx": 1
        },
        {
            "name": "tail_puff_left",
            "group": "tail",
            "from": [-1.15, 1.95, 2.50],
            "to": [-0.70, 2.95, 3.75],
            "color": "hareWhiteSoft",
            "col_idx": 1
        },
        {
            "name": "tail_puff_right",
            "group": "tail",
            "from": [0.70, 1.95, 2.50],
            "to": [1.15, 2.95, 3.75],
            "color": "hareWhiteSoft",
            "col_idx": 1
        },

        # =========================================================================
        # 4. HEAD & EARS (20 cubes)
        # =========================================================================
        {
            "name": "head_core",
            "group": "head_ears",
            "from": [-2.30, 5.40, -2.05],
            "to": [2.30, 8.80, 1.75],
            "color": "hareWhite",
            "col_idx": 0
        },
        {
            "name": "head_crown",
            "group": "head_ears",
            "from": [-1.90, 8.65, -1.65],
            "to": [1.90, 9.45, 1.45],
            "color": "hareWhiteSoft",
            "col_idx": 1
        },
        {
            "name": "head_back",
            "group": "head_ears",
            "from": [-2.05, 5.75, 1.60],
            "to": [2.05, 8.45, 2.25],
            "color": "hareWhite",
            "col_idx": 0
        },
        {
            "name": "cheek_fluff_left",
            "group": "head_ears",
            "from": [-2.70, 5.70, -1.80],
            "to": [-2.15, 7.30, 0.40],
            "color": "hareWhiteSoft",
            "col_idx": 1
        },
        {
            "name": "cheek_fluff_right",
            "group": "head_ears",
            "from": [2.15, 5.70, -1.80],
            "to": [2.70, 7.30, 0.40],
            "color": "hareWhiteSoft",
            "col_idx": 1
        },
        {
            "name": "snout_muzzle",
            "group": "head_ears",
            "from": [-1.30, 5.85, -2.70],
            "to": [1.30, 7.20, -1.90],
            "color": "hareWhite",
            "col_idx": 0
        },
        {
            "name": "snout_lip_left",
            "group": "head_ears",
            "from": [-1.15, 5.95, -2.90],
            "to": [-0.10, 6.70, -2.60],
            "color": "hareWhiteSoft",
            "col_idx": 1
        },
        {
            "name": "snout_lip_right",
            "group": "head_ears",
            "from": [0.10, 5.95, -2.90],
            "to": [1.15, 6.70, -2.60],
            "color": "hareWhiteSoft",
            "col_idx": 1
        },
        {
            "name": "nose_pink",
            "group": "head_ears",
            "from": [-0.40, 6.80, -2.95],
            "to": [0.40, 7.35, -2.65],
            "color": "earPink",
            "col_idx": 3
        },
        {
            "name": "forehead_fluff",
            "group": "head_ears",
            "from": [-0.65, 8.45, -2.25],
            "to": [0.65, 9.15, -1.85],
            "color": "hareWhiteSoft",
            "col_idx": 1
        },
        {
            "name": "eye_iris_left",
            "group": "head_ears",
            "from": [-2.05, 6.95, -2.25],
            "to": [-1.35, 7.95, -1.95],
            "color": "eyeBlack",
            "col_idx": 4
        },
        {
            "name": "eye_sparkle_left",
            "group": "head_ears",
            "from": [-1.90, 7.45, -2.35],
            "to": [-1.45, 7.85, -2.15],
            "color": "pureWhite",
            "col_idx": 5
        },
        {
            "name": "eye_iris_right",
            "group": "head_ears",
            "from": [1.35, 6.95, -2.25],
            "to": [2.05, 7.95, -1.95],
            "color": "eyeBlack",
            "col_idx": 4
        },
        {
            "name": "eye_sparkle_right",
            "group": "head_ears",
            "from": [1.45, 7.45, -2.35],
            "to": [1.90, 7.85, -2.15],
            "color": "pureWhite",
            "col_idx": 5
        },
        {
            "name": "blush_left",
            "group": "head_ears",
            "from": [-2.15, 6.10, -2.20],
            "to": [-1.45, 6.65, -1.95],
            "color": "blushPink",
            "col_idx": 6
        },
        {
            "name": "blush_right",
            "group": "head_ears",
            "from": [1.45, 6.10, -2.20],
            "to": [2.15, 6.65, -1.95],
            "color": "blushPink",
            "col_idx": 6
        },
        {
            "name": "ear_base_left",
            "group": "head_ears",
            "from": [-1.95, 9.15, -0.45],
            "to": [-0.85, 10.95, 0.85],
            "color": "hareWhite",
            "col_idx": 0
        },
        {
            "name": "ear_pink_lower_left",
            "group": "head_ears",
            "from": [-1.75, 9.35, -0.55],
            "to": [-1.05, 10.55, -0.35],
            "color": "earPink",
            "col_idx": 3
        },
        {
            "name": "ear_mid_left",
            "group": "head_ears",
            "from": [-2.15, 10.70, -0.25],
            "to": [-1.05, 12.65, 0.95],
            "color": "hareWhite",
            "col_idx": 0
        },
        {
            "name": "ear_pink_mid_left",
            "group": "head_ears",
            "from": [-1.85, 10.40, -0.40],
            "to": [-1.25, 12.50, -0.15],
            "color": "earPinkLight",
            "col_idx": 7
        },
        {
            "name": "ear_tip_left",
            "group": "head_ears",
            "from": [-2.05, 12.40, -0.05],
            "to": [-1.15, 13.95, 1.05],
            "color": "hareWhiteSoft",
            "col_idx": 1
        },
        {
            "name": "ear_base_right",
            "group": "head_ears",
            "from": [0.85, 9.15, -0.45],
            "to": [1.95, 10.95, 0.85],
            "color": "hareWhite",
            "col_idx": 0
        },
        {
            "name": "ear_pink_lower_right",
            "group": "head_ears",
            "from": [1.05, 9.35, -0.55],
            "to": [1.75, 10.55, -0.35],
            "color": "earPink",
            "col_idx": 3
        },
        {
            "name": "ear_mid_right",
            "group": "head_ears",
            "from": [1.05, 10.70, -0.25],
            "to": [2.15, 12.65, 0.95],
            "color": "hareWhite",
            "col_idx": 0
        },
        {
            "name": "ear_pink_mid_right",
            "group": "head_ears",
            "from": [1.25, 10.40, -0.40],
            "to": [1.85, 12.50, -0.15],
            "color": "earPinkLight",
            "col_idx": 7
        },
        {
            "name": "ear_tip_right",
            "group": "head_ears",
            "from": [1.15, 12.40, -0.05],
            "to": [2.05, 13.95, 1.05],
            "color": "hareWhiteSoft",
            "col_idx": 1
        },

        # =========================================================================
        # 5. FOREPAWS (6 cubes) - Firmly grasping & clasping the carrot
        # =========================================================================
        {
            "name": "forearm_left",
            "group": "forepaws",
            "from": [-2.25, 2.75, -2.15],
            "to": [-1.45, 3.80, -0.85],
            "color": "hareWhite",
            "col_idx": 0
        },
        {
            "name": "forepaw_left",
            "group": "forepaws",
            "from": [-1.65, 2.65, -3.35],
            "to": [-0.65, 3.70, -1.85],
            "color": "hareWhiteSoft",
            "col_idx": 1
        },
        {
            "name": "paw_pad_left",
            "group": "forepaws",
            "from": [-1.20, 2.85, -3.75],
            "to": [-0.15, 3.55, -3.20],
            "color": "hareCream",
            "col_idx": 2
        },
        {
            "name": "forearm_right",
            "group": "forepaws",
            "from": [1.45, 2.75, -2.15],
            "to": [2.25, 3.80, -0.85],
            "color": "hareWhite",
            "col_idx": 0
        },
        {
            "name": "forepaw_right",
            "group": "forepaws",
            "from": [0.65, 2.65, -3.35],
            "to": [1.65, 3.70, -1.85],
            "color": "hareWhiteSoft",
            "col_idx": 1
        },
        {
            "name": "paw_pad_right",
            "group": "forepaws",
            "from": [0.15, 2.85, -3.75],
            "to": [1.20, 3.55, -3.20],
            "color": "hareCream",
            "col_idx": 2
        },

        # =========================================================================
        # 6. CARROT (9 cubes, ZERO frost cubes, lowered under chin, full clasp)
        # =========================================================================
        {
            "name": "carrot_tip",
            "group": "frosted_carrot",
            "from": [-0.35, 1.20, -2.95],
            "to": [0.35, 1.95, -2.45],
            "color": "carrotOrangeDark",
            "col_idx": 8
        },
        {
            "name": "carrot_mid",
            "group": "frosted_carrot",
            "from": [-0.55, 1.80, -3.25],
            "to": [0.55, 2.95, -2.35],
            "color": "carrotOrange",
            "col_idx": 9
        },
        {
            "name": "carrot_upper",
            "group": "frosted_carrot",
            "from": [-0.75, 2.80, -3.55],
            "to": [0.75, 3.95, -2.25],
            "color": "carrotOrange",
            "col_idx": 9
        },
        {
            "name": "carrot_crown",
            "group": "frosted_carrot",
            "from": [-0.65, 3.85, -3.45],
            "to": [0.65, 4.30, -2.35],
            "color": "carrotOrangeBright",
            "col_idx": 10
        },
        {
            "name": "carrot_stem",
            "group": "frosted_carrot",
            "from": [-0.25, 4.20, -3.10],
            "to": [0.25, 4.75, -2.55],
            "color": "leafGreenDark",
            "col_idx": 12
        },
        {
            "name": "leaf_sprig_left",
            "group": "frosted_carrot",
            "from": [-0.85, 4.45, -3.35],
            "to": [-0.15, 5.10, -2.60],
            "color": "leafGreen",
            "col_idx": 13
        },
        {
            "name": "leaf_sprig_right",
            "group": "frosted_carrot",
            "from": [0.15, 4.45, -3.35],
            "to": [0.85, 5.10, -2.60],
            "color": "leafGreen",
            "col_idx": 13
        },
        {
            "name": "leaf_frond_center",
            "group": "frosted_carrot",
            "from": [-0.35, 4.55, -3.65],
            "to": [0.35, 5.15, -2.85],
            "color": "leafGreenBright",
            "col_idx": 14
        },
        {
            "name": "leaf_frond_front",
            "group": "frosted_carrot",
            "from": [-0.30, 4.35, -3.85],
            "to": [0.30, 4.90, -3.30],
            "color": "leafGreen",
            "col_idx": 13
        }
    ]
    return cubes

cubes = build_snow_hare()
print(f"Total cubes: {len(cubes)}")
issues = blockbench_check(cubes)
print(f"Issues: {len(issues)}")
for iss in issues:
    print(f"  ISSUE: {iss['c1']} vs {iss['c2']} on {iss['axis']} = {iss['plane']} ({iss['col1']} vs {iss['col2']})")
q_errors = check_quantization(cubes)
print(f"Quantization errors: {len(q_errors)}")
for qe in q_errors:
    print("  Q-ERROR:", qe)
if len(issues) == 0 and len(q_errors) == 0:
    print("PERFECT! ZERO ISSUES!")
