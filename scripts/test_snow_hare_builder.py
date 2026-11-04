import json
import os
import sys

sys.path.insert(0, 'scripts')
from blockbench_coplanar_check import blockbench_check

def get_snow_hare_cubes():
    return [
        # =========================================================================
        # 1. FEET & HAUNCHES (feet group) - Grounded at Y = 0.00
        # =========================================================================
        # Left Hind Foot Sole (grounded at Y=0.00)
        {
            "name": "foot_sole_left",
            "group": "feet",
            "from": [-2.45, 0.00, -1.05],
            "to": [-0.95, 0.90, 2.35],
            "color": "hareWhite",
            "col_idx": 0
        },
        # Right Hind Foot Sole (grounded at Y=0.00)
        {
            "name": "foot_sole_right",
            "group": "feet",
            "from": [0.95, 0.00, -1.05],
            "to": [2.45, 0.90, 2.35],
            "color": "hareWhite",
            "col_idx": 0
        },
        # Left Front Paw / Toe Pad (extends forward from sole)
        {
            "name": "foot_toes_left",
            "group": "feet",
            "from": [-2.30, 0.15, -1.85],
            "to": [-1.10, 0.75, -0.85],
            "color": "hareWhiteSoft",
            "col_idx": 1
        },
        # Right Front Paw / Toe Pad
        {
            "name": "foot_toes_right",
            "group": "feet",
            "from": [1.10, 0.15, -1.85],
            "to": [2.30, 0.75, -0.85],
            "color": "hareWhiteSoft",
            "col_idx": 1
        },
        # Left Haunch / Thigh (chubby rabbit sitting haunch)
        {
            "name": "haunch_left",
            "group": "feet",
            "from": [-2.60, 0.70, 0.45],
            "to": [-1.20, 2.80, 2.45],
            "color": "hareWhite",
            "col_idx": 0
        },
        # Right Haunch / Thigh
        {
            "name": "haunch_right",
            "group": "feet",
            "from": [1.20, 0.70, 0.45],
            "to": [2.60, 2.80, 2.45],
            "color": "hareWhite",
            "col_idx": 0
        },
        # Left Haunch Outer Fluff Puff
        {
            "name": "haunch_fluff_left",
            "group": "feet",
            "from": [-2.85, 1.15, 0.65],
            "to": [-2.45, 2.45, 2.25],
            "color": "hareWhiteSoft",
            "col_idx": 1
        },
        # Right Haunch Outer Fluff Puff
        {
            "name": "haunch_fluff_right",
            "group": "feet",
            "from": [2.45, 1.15, 0.65],
            "to": [2.85, 2.45, 2.25],
            "color": "hareWhiteSoft",
            "col_idx": 1
        },

        # =========================================================================
        # 2. BODY & PLUMP SNOW BELLY (body group)
        # =========================================================================
        # Main Body Core (pure snowy white)
        {
            "name": "body_core",
            "group": "body",
            "from": [-2.10, 1.20, -1.70],
            "to": [2.10, 5.80, 2.10],
            "color": "hareWhite",
            "col_idx": 0
        },
        # Lower Belly Cushion (settles down toward ground between haunches)
        {
            "name": "body_lower_belly",
            "group": "body",
            "from": [-1.80, 0.70, -1.45],
            "to": [1.80, 1.60, 1.80],
            "color": "hareWhiteSoft",
            "col_idx": 1
        },
        # Chest Front (plump chest pushing forward)
        {
            "name": "body_chest_front",
            "group": "body",
            "from": [-1.75, 1.80, -2.25],
            "to": [1.75, 5.40, -1.55],
            "color": "hareWhite",
            "col_idx": 0
        },
        # Soft Chest Fur Highlight / Bib
        {
            "name": "belly_cream_bib",
            "group": "body",
            "from": [-1.35, 2.05, -2.40],
            "to": [1.35, 4.65, -2.10],
            "color": "hareCream",
            "col_idx": 2
        },
        # Back Cushion Arch
        {
            "name": "body_back_cushion",
            "group": "body",
            "from": [-1.90, 1.80, 1.95],
            "to": [1.90, 5.20, 2.65],
            "color": "hareWhite",
            "col_idx": 0
        },
        # Left Flank Fur Puff
        {
            "name": "body_flank_puff_left",
            "group": "body",
            "from": [-2.40, 2.40, -1.15],
            "to": [-1.95, 4.80, 1.65],
            "color": "hareWhiteSoft",
            "col_idx": 1
        },
        # Right Flank Fur Puff
        {
            "name": "body_flank_puff_right",
            "group": "body",
            "from": [1.95, 2.40, -1.15],
            "to": [2.40, 4.80, 1.65],
            "color": "hareWhiteSoft",
            "col_idx": 1
        },

        # =========================================================================
        # 3. TAIL (tail group) - Fluffy round pompom
        # =========================================================================
        # Pompom Center Core
        {
            "name": "tail_core",
            "group": "tail",
            "from": [-0.85, 1.65, 2.35],
            "to": [0.85, 3.25, 3.95],
            "color": "hareWhite",
            "col_idx": 0
        },
        # Pompom Top Crest
        {
            "name": "tail_puff_top",
            "group": "tail",
            "from": [-0.65, 3.10, 2.65],
            "to": [0.65, 3.65, 3.75],
            "color": "hareWhiteSoft",
            "col_idx": 1
        },
        # Pompom Bottom Crest
        {
            "name": "tail_puff_bottom",
            "group": "tail",
            "from": [-0.65, 1.25, 2.65],
            "to": [0.65, 1.80, 3.75],
            "color": "hareWhiteSoft",
            "col_idx": 1
        },
        # Pompom Left Puff
        {
            "name": "tail_puff_left",
            "group": "tail",
            "from": [-1.15, 1.95, 2.65],
            "to": [-0.70, 2.95, 3.75],
            "color": "hareWhiteSoft",
            "col_idx": 1
        },
        # Pompom Right Puff
        {
            "name": "tail_puff_right",
            "group": "tail",
            "from": [0.70, 1.95, 2.65],
            "to": [1.15, 2.95, 3.75],
            "color": "hareWhiteSoft",
            "col_idx": 1
        },

        # =========================================================================
        # 4. HEAD, EARS & SNOUT (head_ears group)
        # =========================================================================
        # Head Main Skull Core
        {
            "name": "head_core",
            "group": "head_ears",
            "from": [-2.30, 5.40, -2.05],
            "to": [2.30, 8.80, 1.75],
            "color": "hareWhite",
            "col_idx": 0
        },
        # Head Crown Top (soft rounded crown between ears)
        {
            "name": "head_crown",
            "group": "head_ears",
            "from": [-1.90, 8.65, -1.65],
            "to": [1.90, 9.45, 1.45],
            "color": "hareWhiteSoft",
            "col_idx": 1
        },
        # Head Back Curve
        {
            "name": "head_back",
            "group": "head_ears",
            "from": [-2.05, 5.75, 1.60],
            "to": [2.05, 8.45, 2.25],
            "color": "hareWhite",
            "col_idx": 0
        },
        # Chubby Cheeks (left)
        {
            "name": "cheek_fluff_left",
            "group": "head_ears",
            "from": [-2.70, 5.70, -1.80],
            "to": [-2.15, 7.30, 0.40],
            "color": "hareWhiteSoft",
            "col_idx": 1
        },
        # Chubby Cheeks (right)
        {
            "name": "cheek_fluff_right",
            "group": "head_ears",
            "from": [2.15, 5.70, -1.80],
            "to": [2.70, 7.30, 0.40],
            "color": "hareWhiteSoft",
            "col_idx": 1
        },
        # Snout / Rabbit Muzzle
        {
            "name": "snout_muzzle",
            "group": "head_ears",
            "from": [-1.30, 5.80, -2.75],
            "to": [1.30, 7.20, -1.90],
            "color": "hareWhite",
            "col_idx": 0
        },
        # Left Lip / Whisker Pad
        {
            "name": "snout_lip_left",
            "group": "head_ears",
            "from": [-1.15, 5.95, -2.90],
            "to": [-0.10, 6.70, -2.60],
            "color": "hareWhiteSoft",
            "col_idx": 1
        },
        # Right Lip / Whisker Pad
        {
            "name": "snout_lip_right",
            "group": "head_ears",
            "from": [0.10, 5.95, -2.90],
            "to": [1.15, 6.70, -2.60],
            "color": "hareWhiteSoft",
            "col_idx": 1
        },
        # Cute Pink Hare Nose
        {
            "name": "nose_pink",
            "group": "head_ears",
            "from": [-0.40, 6.80, -2.95],
            "to": [0.40, 7.35, -2.65],
            "color": "earPink",
            "col_idx": 3
        },
        # Forehead Fluff tuft
        {
            "name": "forehead_fluff",
            "group": "head_ears",
            "from": [-0.65, 8.45, -2.25],
            "to": [0.65, 9.15, -1.85],
            "color": "hareWhiteSoft",
            "col_idx": 1
        },
        # Left Eye (Glossy black iris)
        {
            "name": "eye_iris_left",
            "group": "head_ears",
            "from": [-2.05, 6.95, -2.25],
            "to": [-1.35, 7.95, -1.95],
            "color": "eyeBlack",
            "col_idx": 4
        },
        # Left Eye Catchlight (Brilliant white reflection)
        {
            "name": "eye_sparkle_left",
            "group": "head_ears",
            "from": [-1.90, 7.45, -2.35],
            "to": [-1.45, 7.85, -2.15],
            "color": "pureWhite",
            "col_idx": 5
        },
        # Right Eye (Glossy black iris)
        {
            "name": "eye_iris_right",
            "group": "head_ears",
            "from": [1.35, 6.95, -2.25],
            "to": [2.05, 7.95, -1.95],
            "color": "eyeBlack",
            "col_idx": 4
        },
        # Right Eye Catchlight (Brilliant white reflection)
        {
            "name": "eye_sparkle_right",
            "group": "head_ears",
            "from": [1.45, 7.45, -2.35],
            "to": [1.90, 7.85, -2.15],
            "color": "pureWhite",
            "col_idx": 5
        },
        # Rosy Cheek Left (Anime style cute blush)
        {
            "name": "blush_left",
            "group": "head_ears",
            "from": [-2.15, 6.10, -2.20],
            "to": [-1.45, 6.65, -1.95],
            "color": "blushPink",
            "col_idx": 6
        },
        # Rosy Cheek Right
        {
            "name": "blush_right",
            "group": "head_ears",
            "from": [1.45, 6.10, -2.20],
            "to": [2.15, 6.65, -1.95],
            "color": "blushPink",
            "col_idx": 6
        },

        # --- EARS (Long, expressive, slightly angled back/outward) ---
        # Left Ear Base
        {
            "name": "ear_base_left",
            "group": "head_ears",
            "from": [-1.95, 9.15, -0.45],
            "to": [-0.85, 10.95, 0.85],
            "color": "hareWhite",
            "col_idx": 0
        },
        # Left Ear Lower Pink Lining
        {
            "name": "ear_pink_lower_left",
            "group": "head_ears",
            "from": [-1.75, 9.35, -0.55],
            "to": [-1.05, 10.55, -0.35],
            "color": "earPink",
            "col_idx": 3
        },
        # Left Ear Mid Section
        {
            "name": "ear_mid_left",
            "group": "head_ears",
            "from": [-2.15, 10.70, -0.25],
            "to": [-1.05, 12.65, 0.95],
            "color": "hareWhite",
            "col_idx": 0
        },
        # Left Ear Mid Pink Lining
        {
            "name": "ear_pink_mid_left",
            "group": "head_ears",
            "from": [-1.85, 10.40, -0.40],
            "to": [-1.25, 12.50, -0.15],
            "color": "earPinkLight",
            "col_idx": 7
        },
        # Left Ear Tip
        {
            "name": "ear_tip_left",
            "group": "head_ears",
            "from": [-2.05, 12.40, -0.05],
            "to": [-1.15, 13.95, 1.05],
            "color": "hareWhiteSoft",
            "col_idx": 1
        },
        # Right Ear Base
        {
            "name": "ear_base_right",
            "group": "head_ears",
            "from": [0.85, 9.15, -0.45],
            "to": [1.95, 10.95, 0.85],
            "color": "hareWhite",
            "col_idx": 0
        },
        # Right Ear Lower Pink Lining
        {
            "name": "ear_pink_lower_right",
            "group": "head_ears",
            "from": [1.05, 9.35, -0.55],
            "to": [1.75, 10.55, -0.35],
            "color": "earPink",
            "col_idx": 3
        },
        # Right Ear Mid Section
        {
            "name": "ear_mid_right",
            "group": "head_ears",
            "from": [1.05, 10.70, -0.25],
            "to": [2.15, 12.65, 0.95],
            "color": "hareWhite",
            "col_idx": 0
        },
        # Right Ear Mid Pink Lining
        {
            "name": "ear_pink_mid_right",
            "group": "head_ears",
            "from": [1.25, 10.40, -0.40],
            "to": [1.85, 12.50, -0.15],
            "color": "earPinkLight",
            "col_idx": 7
        },
        # Right Ear Tip
        {
            "name": "ear_tip_right",
            "group": "head_ears",
            "from": [1.15, 12.40, -0.05],
            "to": [2.05, 13.95, 1.05],
            "color": "hareWhiteSoft",
            "col_idx": 1
        },

        # =========================================================================
        # 5. FOREPAWS (forepaws group) - Holding the frosted carrot snugly
        # =========================================================================
        # Left Forearm (emerges from flank)
        {
            "name": "forearm_left",
            "group": "forepaws",
            "from": [-2.25, 3.40, -2.15],
            "to": [-1.45, 4.45, -0.85],
            "color": "hareWhite",
            "col_idx": 0
        },
        # Left Forepaw (wraps forward around carrot)
        {
            "name": "forepaw_left",
            "group": "forepaws",
            "from": [-1.80, 3.25, -3.20],
            "to": [-0.90, 4.15, -1.95],
            "color": "hareWhiteSoft",
            "col_idx": 1
        },
        # Left Paw Finger Claws / Mitt
        {
            "name": "paw_pad_left",
            "group": "forepaws",
            "from": [-1.45, 3.40, -3.45],
            "to": [-0.75, 3.95, -2.95],
            "color": "hareCream",
            "col_idx": 2
        },
        # Right Forearm (emerges from flank)
        {
            "name": "forearm_right",
            "group": "forepaws",
            "from": [1.45, 3.40, -2.15],
            "to": [2.25, 4.45, -0.85],
            "color": "hareWhite",
            "col_idx": 0
        },
        # Right Forepaw (wraps forward around carrot)
        {
            "name": "forepaw_right",
            "group": "forepaws",
            "from": [0.90, 3.25, -3.20],
            "to": [1.80, 4.15, -1.95],
            "color": "hareWhiteSoft",
            "col_idx": 1
        },
        # Right Paw Finger Claws / Mitt
        {
            "name": "paw_pad_right",
            "group": "forepaws",
            "from": [0.75, 3.40, -3.45],
            "to": [1.45, 3.95, -2.95],
            "color": "hareCream",
            "col_idx": 2
        },

        # =========================================================================
        # 6. FROSTED CARROT (frosted_carrot group) - Root + Frost crystals + Greens
        # =========================================================================
        # Carrot Tapered Bottom Tip
        {
            "name": "carrot_tip",
            "group": "frosted_carrot",
            "from": [-0.35, 1.80, -3.10],
            "to": [0.35, 2.55, -2.40],
            "color": "carrotOrangeDark",
            "col_idx": 8
        },
        # Carrot Mid Lower Root
        {
            "name": "carrot_mid",
            "group": "frosted_carrot",
            "from": [-0.55, 2.40, -3.35],
            "to": [0.55, 3.55, -2.25],
            "color": "carrotOrange",
            "col_idx": 9
        },
        # Carrot Main Upper Body (clutched in paws)
        {
            "name": "carrot_upper",
            "group": "frosted_carrot",
            "from": [-0.75, 3.35, -3.60],
            "to": [0.75, 4.65, -2.10],
            "color": "carrotOrange",
            "col_idx": 9
        },
        # Carrot Crown (top shoulder of carrot)
        {
            "name": "carrot_crown",
            "group": "frosted_carrot",
            "from": [-0.65, 4.50, -3.45],
            "to": [0.65, 5.05, -2.25],
            "color": "carrotOrangeBright",
            "col_idx": 10
        },
        # Frost Crystal 1 (Glistening white frost on side)
        {
            "name": "frost_crystal_left",
            "group": "frosted_carrot",
            "from": [-0.85, 3.85, -3.45],
            "to": [-0.60, 4.40, -2.95],
            "color": "frostIce",
            "col_idx": 11
        },
        # Frost Crystal 2 (Lower right frost patch)
        {
            "name": "frost_crystal_right",
            "group": "frosted_carrot",
            "from": [0.30, 2.75, -3.45],
            "to": [0.65, 3.25, -3.00],
            "color": "frostIce",
            "col_idx": 11
        },
        # Frost Crystal 3 (Crown front rim frost)
        {
            "name": "frost_crystal_crown",
            "group": "frosted_carrot",
            "from": [-0.25, 4.55, -3.70],
            "to": [0.45, 4.95, -3.40],
            "color": "frostIce",
            "col_idx": 11
        },
        # Carrot Greens Stem Base
        {
            "name": "carrot_stem",
            "group": "frosted_carrot",
            "from": [-0.35, 4.90, -3.05],
            "to": [0.35, 5.80, -2.45],
            "color": "leafGreenDark",
            "col_idx": 12
        },
        # Carrot Greens Leaf Sprig Left
        {
            "name": "leaf_sprig_left",
            "group": "frosted_carrot",
            "from": [-0.95, 5.45, -3.15],
            "to": [-0.20, 6.55, -2.35],
            "color": "leafGreen",
            "col_idx": 13
        },
        # Carrot Greens Leaf Sprig Right
        {
            "name": "leaf_sprig_right",
            "group": "frosted_carrot",
            "from": [0.20, 5.45, -3.15],
            "to": [0.95, 6.55, -2.35],
            "color": "leafGreen",
            "col_idx": 13
        },
        # Carrot Greens Center Tall Frond
        {
            "name": "leaf_frond_center",
            "group": "frosted_carrot",
            "from": [-0.35, 5.70, -2.85],
            "to": [0.35, 7.00, -2.20],
            "color": "leafGreenBright",
            "col_idx": 14
        },
        # Frost Crystal on Leaf Top Tip
        {
            "name": "frost_leaf_tip",
            "group": "frosted_carrot",
            "from": [-0.20, 6.85, -2.75],
            "to": [0.20, 7.25, -2.35],
            "color": "frostIce",
            "col_idx": 11
        }
    ]

if __name__ == '__main__':
    cubes = get_snow_hare_cubes()
    print(f"Total cubes: {len(cubes)}")
    
    # 1. Check quantization (all coords must be multiple of 0.05)
    quant_errors = []
    for c in cubes:
        for idx, (f_val, t_val) in enumerate(zip(c['from'], c['to'])):
            ax = ['x', 'y', 'z'][idx]
            if round(f_val / 0.05) * 0.05 != round(f_val, 4):
                quant_errors.append(f"{c['name']} from[{ax}]={f_val}")
            if round(t_val / 0.05) * 0.05 != round(t_val, 4):
                quant_errors.append(f"{c['name']} to[{ax}]={t_val}")
    print(f"Quantization errors: {len(quant_errors)}")
    if quant_errors:
        for qe in quant_errors:
            print("  ", qe)

    # 2. Check grounding (min Y == 0.00)
    min_y = min(c['from'][1] for c in cubes)
    grounded_cubes = [c['name'] for c in cubes if c['from'][1] == 0.0]
    print(f"Min Y: {min_y:.2f}, Grounded cubes: {grounded_cubes}")

    # 3. Check coplanar overlaps
    issues = blockbench_check(cubes)
    print(f"Coplanar overlaps: {len(issues)}")
    for iss in issues:
        print(f"  ISSUE: {iss['c1']} vs {iss['c2']} on {iss['axis']} = {iss['plane']} ({iss['col1']} vs {iss['col2']})")
    
    if len(issues) == 0 and len(quant_errors) == 0 and min_y == 0.0:
        print("\nSUCCESS: Model passes all criteria!")
