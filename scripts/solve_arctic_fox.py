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

def build_arctic_fox():
    cubes = [
        # =====================================================================
        # 1. LEGS (14 cubes) - 4 neat fox legs, all soles grounded at Y = 0.00
        # =====================================================================
        {"name": "front_paw_pad_left", "group": "legs", "from": [-2.80, 0.00, -3.80], "to": [-1.60, 0.50, -2.40], "color": "foxSilver", "col_idx": 1},
        {"name": "front_paw_toes_left", "group": "legs", "from": [-2.60, 0.05, -4.20], "to": [-1.80, 0.45, -3.70], "color": "foxWhite", "col_idx": 2},
        {"name": "front_leg_left", "group": "legs", "from": [-2.70, 0.40, -3.70], "to": [-1.70, 2.70, -2.50], "color": "foxSilverWhite", "col_idx": 0},
        {"name": "front_shoulder_left", "group": "legs", "from": [-2.85, 2.60, -3.85], "to": [-1.60, 4.40, -2.35], "color": "foxSilverWhite", "col_idx": 0},

        {"name": "front_paw_pad_right", "group": "legs", "from": [1.60, 0.00, -3.80], "to": [2.80, 0.50, -2.40], "color": "foxSilver", "col_idx": 1},
        {"name": "front_paw_toes_right", "group": "legs", "from": [1.80, 0.05, -4.20], "to": [2.60, 0.45, -3.70], "color": "foxWhite", "col_idx": 2},
        {"name": "front_leg_right", "group": "legs", "from": [1.70, 0.40, -3.70], "to": [2.70, 2.70, -2.50], "color": "foxSilverWhite", "col_idx": 0},
        {"name": "front_shoulder_right", "group": "legs", "from": [1.60, 2.60, -3.85], "to": [2.85, 4.40, -2.35], "color": "foxSilverWhite", "col_idx": 0},

        {"name": "rear_paw_pad_left", "group": "legs", "from": [-2.80, 0.00, 1.80], "to": [-1.60, 0.50, 3.20], "color": "foxSilver", "col_idx": 1},
        {"name": "rear_paw_hock_left", "group": "legs", "from": [-2.70, 0.40, 1.90], "to": [-1.70, 2.65, 3.10], "color": "foxSilverWhite", "col_idx": 0},
        {"name": "rear_thigh_haunch_left", "group": "legs", "from": [-3.10, 2.50, 1.40], "to": [-1.55, 4.80, 3.50], "color": "foxSilverWhite", "col_idx": 0},

        {"name": "rear_paw_pad_right", "group": "legs", "from": [1.60, 0.00, 1.80], "to": [2.80, 0.50, 3.20], "color": "foxSilver", "col_idx": 1},
        {"name": "rear_paw_hock_right", "group": "legs", "from": [1.70, 0.40, 1.90], "to": [2.70, 2.65, 3.10], "color": "foxSilverWhite", "col_idx": 0},
        {"name": "rear_thigh_haunch_right", "group": "legs", "from": [1.55, 2.50, 1.40], "to": [3.10, 4.80, 3.50], "color": "foxSilverWhite", "col_idx": 0},

        # =====================================================================
        # 2. BODY (11 cubes) - Sleek agile silver torso, white belly & fluffy bib
        # =====================================================================
        {"name": "body_torso_core", "group": "body", "from": [-2.60, 2.40, -3.10], "to": [2.60, 6.00, 2.90], "color": "foxSilverWhite", "col_idx": 0},
        {"name": "body_belly_white", "group": "body", "from": [-2.00, 2.05, -2.70], "to": [2.00, 2.45, 2.50], "color": "foxWhite", "col_idx": 2},
        {"name": "chest_bib_main", "group": "body", "from": [-2.40, 2.80, -4.20], "to": [2.40, 6.20, -3.00], "color": "foxWhite", "col_idx": 2},
        {"name": "chest_bib_fluff_high", "group": "body", "from": [-1.90, 3.60, -4.60], "to": [1.90, 5.70, -4.10], "color": "foxWhite", "col_idx": 2},
        {"name": "chest_throat_tuft", "group": "body", "from": [-1.40, 5.50, -4.80], "to": [1.40, 6.70, -4.15], "color": "foxWhite", "col_idx": 2},
        {"name": "body_back_mantle", "group": "body", "from": [-2.20, 5.90, -2.30], "to": [2.20, 6.30, 2.10], "color": "foxSilver", "col_idx": 1},
        {"name": "body_flank_left", "group": "body", "from": [-2.80, 3.10, -1.80], "to": [-2.50, 5.40, 1.60], "color": "foxSilverWhite", "col_idx": 0},
        {"name": "body_flank_right", "group": "body", "from": [2.50, 3.10, -1.80], "to": [2.80, 5.40, 1.60], "color": "foxSilverWhite", "col_idx": 0},
        {"name": "body_rump_loaf", "group": "body", "from": [-2.40, 2.60, 2.80], "to": [2.40, 5.80, 3.90], "color": "foxSilverWhite", "col_idx": 0},
        {"name": "rear_breeches_fluff", "group": "body", "from": [-2.00, 3.00, 3.80], "to": [2.00, 5.20, 4.30], "color": "foxWhite", "col_idx": 2},
        {"name": "neck_transition", "group": "body", "from": [-2.10, 5.70, -3.70], "to": [2.10, 7.30, -1.90], "color": "foxSilverWhite", "col_idx": 0},

        # =====================================================================
        # 3. HEAD & SNOUT (21 cubes) - Open eyes, zero brow overhang, tall prick ears
        # =====================================================================
        {"name": "head_core", "group": "head_snout", "from": [-2.50, 6.80, -4.70], "to": [2.50, 10.50, -0.90], "color": "foxSilverWhite", "col_idx": 0},
        {"name": "head_crown_top", "group": "head_snout", "from": [-1.20, 10.40, -3.20], "to": [1.20, 10.95, -1.50], "color": "foxSilverWhite", "col_idx": 0},
        # Forehead brow: starts at Y=9.75 (strictly ABOVE eye top 9.65), front face at Z=-4.80 (strictly BEHIND eye front -5.15)
        {"name": "head_forehead_brow", "group": "head_snout", "from": [-1.60, 9.75, -4.80], "to": [1.60, 10.60, -3.50], "color": "foxSilverWhite", "col_idx": 0},
        # Soft white blaze between eyes (X: -1.00..1.00, leaving eyes completely uncovered)
        {"name": "snout_blaze_upper", "group": "head_snout", "from": [-1.00, 8.60, -5.00], "to": [1.00, 9.70, -4.55], "color": "foxWhite", "col_idx": 2},

        # Cute fox cheeks (triangular face fluff!)
        {"name": "cheek_fluff_left", "group": "head_snout", "from": [-3.20, 7.10, -4.30], "to": [-2.40, 8.90, -1.80], "color": "foxWhite", "col_idx": 2},
        {"name": "cheek_fluff_right", "group": "head_snout", "from": [2.40, 7.10, -4.30], "to": [3.20, 8.90, -1.80], "color": "foxWhite", "col_idx": 2},

        # Tapered Snout (pure white lower muzzle)
        {"name": "snout_bridge", "group": "head_snout", "from": [-1.40, 7.10, -6.10], "to": [1.40, 8.55, -4.60], "color": "foxWhite", "col_idx": 2},
        {"name": "snout_taper", "group": "head_snout", "from": [-1.00, 7.20, -7.20], "to": [1.00, 8.40, -6.00], "color": "foxWhite", "col_idx": 2},
        {"name": "snout_tip_wedge", "group": "head_snout", "from": [-0.65, 7.40, -7.80], "to": [0.65, 8.25, -7.10], "color": "foxWhite", "col_idx": 2},
        {"name": "chin_under_jaw", "group": "head_snout", "from": [-0.90, 6.65, -5.80], "to": [0.90, 7.20, -4.40], "color": "foxWhite", "col_idx": 2},
        # Obsidian black button nose
        {"name": "nose_button", "group": "head_snout", "from": [-0.50, 7.90, -8.15], "to": [0.50, 8.55, -7.60], "color": "foxNose", "col_idx": 3},

        # Eyes: Left Eye (proudly brought forward to Z = -5.15, fully open and clear)
        {"name": "eye_base_left", "group": "head_snout", "from": [-2.15, 8.60, -5.15], "to": [-1.15, 9.65, -4.65], "color": "foxEye", "col_idx": 4},
        {"name": "eye_sparkle_left", "group": "head_snout", "from": [-1.90, 9.15, -5.25], "to": [-1.35, 9.55, -5.00], "color": "foxWhite", "col_idx": 2},
        # Eyes: Right Eye
        {"name": "eye_base_right", "group": "head_snout", "from": [1.15, 8.60, -5.15], "to": [2.15, 9.65, -4.65], "color": "foxEye", "col_idx": 4},
        {"name": "eye_sparkle_right", "group": "head_snout", "from": [1.35, 9.15, -5.25], "to": [1.90, 9.55, -5.00], "color": "foxWhite", "col_idx": 2},

        # Fox Prick Ears (tall pointy triangular ears, Z: [-3.10, -1.80], Y: [10.30, 13.90])
        {"name": "ear_base_left", "group": "head_snout", "from": [-2.55, 10.30, -3.10], "to": [-1.35, 12.40, -1.80], "color": "foxSilver", "col_idx": 1},
        {"name": "ear_tip_left", "group": "head_snout", "from": [-2.25, 12.30, -2.95], "to": [-1.55, 13.90, -1.95], "color": "foxSilverWhite", "col_idx": 0},
        {"name": "ear_inner_pink_left", "group": "head_snout", "from": [-2.15, 10.60, -3.15], "to": [-1.45, 12.25, -2.90], "color": "innerEarPink", "col_idx": 7},

        {"name": "ear_base_right", "group": "head_snout", "from": [1.35, 10.30, -3.10], "to": [2.55, 12.40, -1.80], "color": "foxSilver", "col_idx": 1},
        {"name": "ear_tip_right", "group": "head_snout", "from": [1.55, 12.30, -2.95], "to": [2.25, 13.90, -1.95], "color": "foxSilverWhite", "col_idx": 0},
        {"name": "ear_inner_pink_right", "group": "head_snout", "from": [1.45, 10.60, -3.15], "to": [2.15, 12.25, -2.90], "color": "innerEarPink", "col_idx": 7},

        # =====================================================================
        # 4. EARMUFFS (10 cubes) - Classic Cartoon Headband passing through ears!
        # Festive Emerald Green (#059669) & Shimmering Gold (#facc15).
        # Headband arch runs directly across the crown through ear bases,
        # dropping down straight into the plush ear cups on the sides.
        # =====================================================================
        # Headband arching across crown and ear bases
        {"name": "earmuff_band_top", "group": "earmuffs", "from": [-2.50, 10.75, -2.85], "to": [2.50, 11.35, -2.15], "color": "muffEmerald", "col_idx": 5},
        # Headband central royal gold star crest
        {"name": "earmuff_band_crest", "group": "earmuffs", "from": [-0.55, 11.25, -2.95], "to": [0.55, 11.55, -2.05], "color": "muffGold", "col_idx": 6},
        # Headband side drops going straight down into cups
        {"name": "earmuff_band_left", "group": "earmuffs", "from": [-2.90, 9.90, -2.75], "to": [-2.35, 10.95, -2.25], "color": "muffEmerald", "col_idx": 5},
        {"name": "earmuff_band_right", "group": "earmuffs", "from": [2.35, 9.90, -2.75], "to": [2.90, 10.95, -2.25], "color": "muffEmerald", "col_idx": 5},

        # Left Earmuff Cup (plush gold fur cushion + emerald dome + gold jewel)
        {"name": "earmuff_cushion_left", "group": "earmuffs", "from": [-3.60, 8.40, -3.45], "to": [-2.55, 10.20, -1.55], "color": "muffGold", "col_idx": 6},
        {"name": "earmuff_dome_left", "group": "earmuffs", "from": [-3.85, 8.65, -3.25], "to": [-3.35, 9.95, -1.75], "color": "muffEmerald", "col_idx": 5},
        {"name": "earmuff_gem_left", "group": "earmuffs", "from": [-3.95, 9.10, -2.70], "to": [-3.75, 9.50, -2.30], "color": "muffGold", "col_idx": 6},

        # Right Earmuff Cup (plush gold fur cushion + emerald dome + gold jewel)
        {"name": "earmuff_cushion_right", "group": "earmuffs", "from": [2.55, 8.40, -3.45], "to": [3.60, 10.20, -1.55], "color": "muffGold", "col_idx": 6},
        {"name": "earmuff_dome_right", "group": "earmuffs", "from": [3.35, 8.65, -3.25], "to": [3.85, 9.95, -1.75], "color": "muffEmerald", "col_idx": 5},
        {"name": "earmuff_gem_right", "group": "earmuffs", "from": [3.75, 9.10, -2.70], "to": [3.95, 9.50, -2.30], "color": "muffGold", "col_idx": 6},

        # =====================================================================
        # 5. FLUFFY TAIL (11 cubes) - The Arctic Fox's Crown Jewel!
        # =====================================================================
        {"name": "tail_base_root", "group": "fluffy_tail", "from": [-0.85, 4.40, 3.60], "to": [0.85, 5.90, 4.90], "color": "foxSilverWhite", "col_idx": 0},
        {"name": "tail_mid_expand", "group": "fluffy_tail", "from": [-1.25, 5.50, 4.60], "to": [1.25, 7.30, 6.30], "color": "foxSilverWhite", "col_idx": 0},
        {"name": "tail_bulge_core", "group": "fluffy_tail", "from": [-1.55, 6.90, 5.40], "to": [1.55, 9.40, 7.50], "color": "foxSilverWhite", "col_idx": 0},
        {"name": "tail_fluff_flank_left", "group": "fluffy_tail", "from": [-1.90, 7.30, 5.70], "to": [-1.45, 9.00, 7.20], "color": "foxWhite", "col_idx": 2},
        {"name": "tail_fluff_flank_right", "group": "fluffy_tail", "from": [1.45, 7.30, 5.70], "to": [1.90, 9.00, 7.20], "color": "foxWhite", "col_idx": 2},
        {"name": "tail_upper_arch", "group": "fluffy_tail", "from": [-1.35, 9.10, 5.10], "to": [1.35, 11.20, 7.10], "color": "foxWhite", "col_idx": 2},
        {"name": "tail_white_tip_core", "group": "fluffy_tail", "from": [-1.05, 10.90, 4.40], "to": [1.05, 12.60, 6.20], "color": "foxWhite", "col_idx": 2},
        {"name": "tail_tip_curl_tuft", "group": "fluffy_tail", "from": [-0.70, 12.30, 3.90], "to": [0.70, 13.40, 5.30], "color": "foxWhite", "col_idx": 2},
        {"name": "tail_underside_shadow", "group": "fluffy_tail", "from": [-1.00, 6.10, 4.80], "to": [1.00, 7.20, 6.10], "color": "foxSilver", "col_idx": 1},
        {"name": "tail_dorsal_crest", "group": "fluffy_tail", "from": [-0.80, 8.80, 6.90], "to": [0.80, 10.50, 7.70], "color": "foxSilverWhite", "col_idx": 0},
        {"name": "tail_tip_hook", "group": "fluffy_tail", "from": [-0.50, 13.10, 3.50], "to": [0.50, 13.80, 4.50], "color": "foxWhite", "col_idx": 2},
    ]
    return cubes

if __name__ == '__main__':
    cubes = build_arctic_fox()
    print(f"Total cubes count: {len(cubes)}")
    q_errs = check_quantization(cubes)
    print(f"Quantization errors: {len(q_errs)}")
    min_y = min(c['from'][1] for c in cubes)
    grounded = [c['name'] for c in cubes if c['from'][1] == 0.0]
    print(f"Min Y: {min_y:.2f}, Grounded paws ({len(grounded)}): {grounded}")
    issues = blockbench_check(cubes)
    print(f"Coplanar overlaps: {len(issues)}")
    for iss in issues:
        print(f"  {iss['c1']} vs {iss['c2']} on {iss['axis']} = {iss['plane']}")
