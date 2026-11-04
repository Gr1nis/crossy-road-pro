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

def build_gingerbread_man():
    # Palette map:
    # 0: doughWarm (#d97706) - golden ginger dough
    # 1: doughCrust (#b45309) - baked crust accent
    # 2: doughShade (#92400e) - toasted deep edges
    # 3: icingWhite (#ffffff) - crisp royal icing
    # 4: eyePupil (#1c1917) - chocolate chips
    # 5: cheekPink (#fb7185) - strawberry blush
    # 6: candyRed (#dc2626) - peppermint red
    # 7: gumdropGreen (#10b981) - emerald green
    # 8: gumdropYellow (#f59e0b) - amber citrus
    # 9: gumdropRuby (#ef4444) - ruby red

    cubes = [
        # =========================================================================
        # 1. LEGS & FEET (8 cubes)
        # Grounding: Left & right feet strictly at Y = 0.00.
        # Classic rounded cookie feet and sturdy gingerbread legs.
        # =========================================================================
        # Left foot & leg
        {"name": "foot_sole_left", "group": "legs_feet", "from": [-1.90, 0.00, -1.30], "to": [-0.70, 0.70, 1.10], "color": "doughWarm", "col_idx": 0},
        {"name": "foot_toe_round_left", "group": "legs_feet", "from": [-1.75, 0.10, -1.65], "to": [-0.85, 0.65, -1.05], "color": "doughCrust", "col_idx": 1},
        {"name": "foot_heel_round_left", "group": "legs_feet", "from": [-1.75, 0.10, 0.85], "to": [-0.85, 0.65, 1.40], "color": "doughCrust", "col_idx": 1},
        {"name": "leg_shaft_left", "group": "legs_feet", "from": [-1.80, 0.55, -1.15], "to": [-0.80, 2.80, 0.95], "color": "doughWarm", "col_idx": 0},

        # Right foot & leg
        {"name": "foot_sole_right", "group": "legs_feet", "from": [0.70, 0.00, -1.30], "to": [1.90, 0.70, 1.10], "color": "doughWarm", "col_idx": 0},
        {"name": "foot_toe_round_right", "group": "legs_feet", "from": [0.85, 0.10, -1.65], "to": [1.75, 0.65, -1.05], "color": "doughCrust", "col_idx": 1},
        {"name": "foot_heel_round_right", "group": "legs_feet", "from": [0.85, 0.10, 0.85], "to": [1.75, 0.65, 1.40], "color": "doughCrust", "col_idx": 1},
        {"name": "leg_shaft_right", "group": "legs_feet", "from": [0.80, 0.55, -1.15], "to": [1.80, 2.80, 0.95], "color": "doughWarm", "col_idx": 0},

        # =========================================================================
        # 2. TORSO & COOKIE LIMBS (14 cubes)
        # Chunky gingerbread body, rounded flanks, chubby outstretched cookie arms.
        # =========================================================================
        {"name": "torso_pelvis_crotch", "group": "torso_cookie", "from": [-1.30, 2.40, -1.10], "to": [1.30, 3.40, 0.90], "color": "doughWarm", "col_idx": 0},
        {"name": "torso_belly_main", "group": "torso_cookie", "from": [-2.10, 3.15, -1.15], "to": [2.10, 5.45, 0.95], "color": "doughWarm", "col_idx": 0},
        {"name": "torso_belly_bulge", "group": "torso_cookie", "from": [-1.70, 3.45, -1.35], "to": [1.70, 5.15, -1.05], "color": "doughCrust", "col_idx": 1},
        {"name": "torso_back_bulge", "group": "torso_cookie", "from": [-1.70, 3.45, 0.85], "to": [1.70, 5.15, 1.15], "color": "doughCrust", "col_idx": 1},
        {"name": "torso_chest_upper", "group": "torso_cookie", "from": [-1.95, 5.25, -1.10], "to": [1.95, 6.35, 0.90], "color": "doughWarm", "col_idx": 0},
        {"name": "neck_stem", "group": "torso_cookie", "from": [-1.10, 6.15, -0.75], "to": [1.10, 6.85, 0.65], "color": "doughCrust", "col_idx": 1},

        # Left arm & hand
        {"name": "arm_shoulder_left", "group": "torso_cookie", "from": [-2.75, 4.95, -0.90], "to": [-1.90, 6.05, 0.70], "color": "doughWarm", "col_idx": 0},
        {"name": "arm_bicep_left", "group": "torso_cookie", "from": [-3.45, 4.15, -0.85], "to": [-2.55, 5.25, 0.65], "color": "doughWarm", "col_idx": 0},
        {"name": "arm_forearm_left", "group": "torso_cookie", "from": [-3.90, 3.35, -1.25], "to": [-3.15, 4.45, 0.40], "color": "doughWarm", "col_idx": 0},
        {"name": "hand_mitten_left", "group": "torso_cookie", "from": [-4.20, 2.85, -1.45], "to": [-3.40, 3.80, -0.20], "color": "doughCrust", "col_idx": 1},

        # Right arm & hand
        {"name": "arm_shoulder_right", "group": "torso_cookie", "from": [1.90, 4.95, -0.90], "to": [2.75, 6.05, 0.70], "color": "doughWarm", "col_idx": 0},
        {"name": "arm_bicep_right", "group": "torso_cookie", "from": [2.55, 4.15, -0.85], "to": [3.45, 5.25, 0.65], "color": "doughWarm", "col_idx": 0},
        {"name": "arm_forearm_right", "group": "torso_cookie", "from": [3.15, 3.35, -1.25], "to": [3.90, 4.45, 0.40], "color": "doughWarm", "col_idx": 0},
        {"name": "hand_mitten_right", "group": "torso_cookie", "from": [3.40, 2.85, -1.45], "to": [4.20, 3.80, -0.20], "color": "doughCrust", "col_idx": 1},

        # =========================================================================
        # 3. HEAD COOKIE (7 cubes)
        # Rounded gingerbread cookie head, chubby cheeks, curved chin and crown.
        # =========================================================================
        {"name": "head_core", "group": "head_cookie", "from": [-2.15, 6.65, -1.10], "to": [2.15, 9.85, 0.90], "color": "doughWarm", "col_idx": 0},
        {"name": "head_chin_round", "group": "head_cookie", "from": [-1.65, 6.45, -0.95], "to": [1.65, 7.05, 0.75], "color": "doughCrust", "col_idx": 1},
        {"name": "head_crown_round", "group": "head_cookie", "from": [-1.65, 9.65, -0.95], "to": [1.65, 10.35, 0.75], "color": "doughCrust", "col_idx": 1},
        {"name": "head_cheek_left", "group": "head_cookie", "from": [-2.50, 7.25, -0.95], "to": [-1.95, 9.25, 0.75], "color": "doughCrust", "col_idx": 1},
        {"name": "head_cheek_right", "group": "head_cookie", "from": [1.95, 7.25, -0.95], "to": [2.50, 9.25, 0.75], "color": "doughCrust", "col_idx": 1},
        {"name": "head_front_round", "group": "head_cookie", "from": [-1.90, 7.10, -1.25], "to": [1.90, 9.50, -0.95], "color": "doughCrust", "col_idx": 1},
        {"name": "head_back_round", "group": "head_cookie", "from": [-1.85, 7.15, 0.80], "to": [1.85, 9.45, 1.10], "color": "doughCrust", "col_idx": 1},

        # =========================================================================
        # 4. ICING DECOR (23 cubes)
        # Royal sugar icing: ankle cuffs, wrist cuffs, face details, sugar hair curl.
        # =========================================================================
        # Ankle cuffs
        {"name": "icing_cuff_leg_left_main", "group": "icing_decor", "from": [-1.95, 1.05, -1.25], "to": [-0.65, 1.45, 1.05], "color": "icingWhite", "col_idx": 3},
        {"name": "icing_cuff_leg_left_wave1", "group": "icing_decor", "from": [-1.75, 0.90, -1.40], "to": [-0.85, 1.55, -1.05], "color": "icingWhite", "col_idx": 3},
        {"name": "icing_cuff_leg_left_wave2", "group": "icing_decor", "from": [-1.75, 0.90, 0.85], "to": [-0.85, 1.55, 1.20], "color": "icingWhite", "col_idx": 3},

        {"name": "icing_cuff_leg_right_main", "group": "icing_decor", "from": [0.65, 1.05, -1.25], "to": [1.95, 1.45, 1.05], "color": "icingWhite", "col_idx": 3},
        {"name": "icing_cuff_leg_right_wave1", "group": "icing_decor", "from": [0.85, 0.90, -1.40], "to": [1.75, 1.55, -1.05], "color": "icingWhite", "col_idx": 3},
        {"name": "icing_cuff_leg_right_wave2", "group": "icing_decor", "from": [0.85, 0.90, 0.85], "to": [1.75, 1.55, 1.20], "color": "icingWhite", "col_idx": 3},

        # Wrist cuffs
        {"name": "icing_cuff_arm_left", "group": "icing_decor", "from": [-4.05, 3.25, -1.35], "to": [-3.25, 3.65, 0.30], "color": "icingWhite", "col_idx": 3},
        {"name": "icing_wave_arm_left", "group": "icing_decor", "from": [-4.15, 3.15, -1.50], "to": [-3.35, 3.75, -1.10], "color": "icingWhite", "col_idx": 3},

        {"name": "icing_cuff_arm_right", "group": "icing_decor", "from": [3.25, 3.25, -1.35], "to": [4.05, 3.65, 0.30], "color": "icingWhite", "col_idx": 3},
        {"name": "icing_wave_arm_right", "group": "icing_decor", "from": [3.35, 3.15, -1.50], "to": [4.15, 3.75, -1.10], "color": "icingWhite", "col_idx": 3},

        # Facial icing: Eyes, pupils, eyebrows, smile, blush cheeks
        {"name": "icing_eye_white_left", "group": "icing_decor", "from": [-1.55, 8.10, -1.40], "to": [-0.75, 8.90, -1.15], "color": "icingWhite", "col_idx": 3},
        {"name": "icing_pupil_left", "group": "icing_decor", "from": [-1.35, 8.25, -1.45], "to": [-0.95, 8.70, -1.20], "color": "eyePupil", "col_idx": 4},
        {"name": "icing_eye_white_right", "group": "icing_decor", "from": [0.75, 8.10, -1.40], "to": [1.55, 8.90, -1.15], "color": "icingWhite", "col_idx": 3},
        {"name": "icing_pupil_right", "group": "icing_decor", "from": [0.95, 8.25, -1.45], "to": [1.35, 8.70, -1.20], "color": "eyePupil", "col_idx": 4},

        {"name": "icing_eyebrow_left", "group": "icing_decor", "from": [-1.60, 9.05, -1.35], "to": [-0.70, 9.35, -1.20], "color": "icingWhite", "col_idx": 3},
        {"name": "icing_eyebrow_right", "group": "icing_decor", "from": [0.70, 9.05, -1.35], "to": [1.60, 9.35, -1.20], "color": "icingWhite", "col_idx": 3},

        {"name": "icing_smile_center", "group": "icing_decor", "from": [-0.70, 7.20, -1.40], "to": [0.70, 7.45, -1.20], "color": "icingWhite", "col_idx": 3},
        {"name": "icing_smile_left_upturn", "group": "icing_decor", "from": [-1.15, 7.30, -1.35], "to": [-0.60, 7.75, -1.15], "color": "icingWhite", "col_idx": 3},
        {"name": "icing_smile_right_upturn", "group": "icing_decor", "from": [0.60, 7.30, -1.35], "to": [1.15, 7.75, -1.15], "color": "icingWhite", "col_idx": 3},

        {"name": "blush_cheek_left", "group": "icing_decor", "from": [-1.80, 7.40, -1.35], "to": [-1.25, 7.95, -1.20], "color": "cheekPink", "col_idx": 5},
        {"name": "blush_cheek_right", "group": "icing_decor", "from": [1.25, 7.40, -1.35], "to": [1.80, 7.95, -1.20], "color": "cheekPink", "col_idx": 5},

        # Top icing swirl
        {"name": "icing_hair_swirl_base", "group": "icing_decor", "from": [-0.90, 10.15, -0.70], "to": [0.90, 10.65, 0.50], "color": "icingWhite", "col_idx": 3},
        {"name": "icing_hair_swirl_peak", "group": "icing_decor", "from": [-0.45, 10.55, -0.50], "to": [0.55, 11.05, 0.30], "color": "icingWhite", "col_idx": 3},

        # =========================================================================
        # 5. ACCESSORIES (16 cubes)
        # Festive Bowtie, 3 Jelly Gumdrop Belly Buttons, Candy Cane in hand.
        # =========================================================================
        # Festive Candy Bowtie
        {"name": "bowtie_knot_center", "group": "accessories", "from": [-0.35, 6.10, -1.55], "to": [0.35, 6.60, -1.00], "color": "gumdropGreen", "col_idx": 7},
        {"name": "bowtie_wing_left", "group": "accessories", "from": [-1.35, 6.05, -1.50], "to": [-0.25, 6.55, -1.05], "color": "candyRed", "col_idx": 6},
        {"name": "bowtie_wing_right", "group": "accessories", "from": [0.25, 6.05, -1.50], "to": [1.35, 6.55, -1.05], "color": "candyRed", "col_idx": 6},
        {"name": "bowtie_stripe_left", "group": "accessories", "from": [-1.05, 6.15, -1.55], "to": [-0.55, 6.50, -1.35], "color": "icingWhite", "col_idx": 3},
        {"name": "bowtie_stripe_right", "group": "accessories", "from": [0.55, 6.15, -1.55], "to": [1.05, 6.50, -1.35], "color": "icingWhite", "col_idx": 3},

        # 3 Gumdrop buttons
        {"name": "button_ruby_top", "group": "accessories", "from": [-0.40, 4.90, -1.60], "to": [0.40, 5.40, -1.25], "color": "gumdropRuby", "col_idx": 9},
        {"name": "button_ruby_highlight", "group": "accessories", "from": [-0.20, 5.05, -1.65], "to": [0.20, 5.30, -1.45], "color": "icingWhite", "col_idx": 3},
        {"name": "button_emerald_mid", "group": "accessories", "from": [-0.40, 4.15, -1.60], "to": [0.40, 4.65, -1.25], "color": "gumdropGreen", "col_idx": 7},
        {"name": "button_emerald_highlight", "group": "accessories", "from": [-0.20, 4.30, -1.65], "to": [0.20, 4.55, -1.45], "color": "icingWhite", "col_idx": 3},
        {"name": "button_amber_bot", "group": "accessories", "from": [-0.40, 3.40, -1.60], "to": [0.40, 3.90, -1.25], "color": "gumdropYellow", "col_idx": 8},
        {"name": "button_amber_highlight", "group": "accessories", "from": [-0.20, 3.55, -1.65], "to": [0.20, 3.80, -1.45], "color": "icingWhite", "col_idx": 3},

        # Peppermint Candy Cane (held securely in left mitten hand)
        # Clear of arm / forearm coplanar boundaries
        {"name": "candycane_stem_lower", "group": "accessories", "from": [-3.95, 1.80, -1.60], "to": [-3.55, 2.65, -1.20], "color": "candyRed", "col_idx": 6},
        {"name": "candycane_stem_grip", "group": "accessories", "from": [-3.85, 2.55, -1.55], "to": [-3.60, 3.70, -1.15], "color": "icingWhite", "col_idx": 3},
        {"name": "candycane_stem_upper", "group": "accessories", "from": [-3.95, 3.60, -1.60], "to": [-3.55, 4.80, -1.20], "color": "candyRed", "col_idx": 6},
        {"name": "candycane_hook_top", "group": "accessories", "from": [-3.85, 4.70, -1.55], "to": [-2.95, 5.30, -1.25], "color": "icingWhite", "col_idx": 3},
        {"name": "candycane_hook_tip", "group": "accessories", "from": [-3.05, 4.25, -1.60], "to": [-2.65, 4.85, -1.20], "color": "candyRed", "col_idx": 6},
    ]

    return cubes

if __name__ == '__main__':
    cubes = build_gingerbread_man()
    print(f"Total cubes: {len(cubes)}")
    q_errs = check_quantization(cubes)
    print(f"Quantization errors: {len(q_errs)}")
    for e in q_errs:
        print("  ", e)
    issues = blockbench_check(cubes)
    print(f"Coplanar issues: {len(issues)}")
    for iss in issues:
        print(f"  {iss['c1']} vs {iss['c2']} on {iss['axis']} = {iss['plane']} ({iss['col1']} vs {iss['col2']})")
