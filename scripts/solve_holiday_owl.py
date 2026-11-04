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

def build_holiday_owl():
    cubes = [
        # =========================================================================
        # 1. FEET & LEG FLUFF (10 cubes)
        # Grounding: Left & right foot soles strictly on Y = 0.00.
        # Amber-gold talons with front claw separation grasping pinecone base.
        # =========================================================================
        # Left foot pad & talons
        {"name": "foot_pad_left", "group": "feet", "from": [-1.75, 0.00, -1.15], "to": [-0.65, 0.60, 0.55], "color": "amberGold", "col_idx": 7},
        {"name": "talon_outer_left", "group": "feet", "from": [-1.85, 0.10, -1.65], "to": [-1.45, 0.45, -0.95], "color": "amberGold", "col_idx": 7},
        {"name": "talon_center_left", "group": "feet", "from": [-1.35, 0.10, -1.95], "to": [-0.95, 0.50, -0.90], "color": "amberGold", "col_idx": 7},
        {"name": "talon_inner_left", "group": "feet", "from": [-0.85, 0.10, -1.70], "to": [-0.50, 0.45, -0.90], "color": "amberGold", "col_idx": 7},

        # Right foot pad & talons
        {"name": "foot_pad_right", "group": "feet", "from": [0.65, 0.00, -1.15], "to": [1.75, 0.60, 0.55], "color": "amberGold", "col_idx": 7},
        {"name": "talon_inner_right", "group": "feet", "from": [0.50, 0.10, -1.70], "to": [0.85, 0.45, -0.90], "color": "amberGold", "col_idx": 7},
        {"name": "talon_center_right", "group": "feet", "from": [0.95, 0.10, -1.95], "to": [1.35, 0.50, -0.90], "color": "amberGold", "col_idx": 7},
        {"name": "talon_outer_right", "group": "feet", "from": [1.45, 0.10, -1.65], "to": [1.85, 0.45, -0.95], "color": "amberGold", "col_idx": 7},

        # Feathered leg fluff ("pantaloons")
        {"name": "leg_fluff_left", "group": "feet", "from": [-1.65, 0.50, -0.85], "to": [-0.75, 1.45, 0.45], "color": "owlWhite", "col_idx": 0},
        {"name": "leg_fluff_right", "group": "feet", "from": [0.75, 0.50, -0.85], "to": [1.65, 1.45, 0.45], "color": "owlWhite", "col_idx": 0},

        # =========================================================================
        # 2. BODY & WINGS (22 cubes)
        # Plump snowy owl torso, plumage speckles on breast and folded wings,
        # plus redesigned elegant downward sloping wedge-shaped tail (4 cubes).
        # =========================================================================
        {"name": "body_belly_lower", "group": "body_wings", "from": [-2.15, 1.25, -1.45], "to": [2.15, 3.25, 1.35], "color": "owlWhite", "col_idx": 0},
        {"name": "body_belly_fluff_front", "group": "body_wings", "from": [-1.65, 1.55, -1.75], "to": [1.65, 3.10, -1.35], "color": "owlWhite", "col_idx": 0},
        {"name": "body_belly_speckle_center", "group": "body_wings", "from": [-0.60, 1.85, -1.80], "to": [0.60, 2.75, -1.65], "color": "owlSpeckleLight", "col_idx": 2},
        {"name": "body_torso_mid", "group": "body_wings", "from": [-2.35, 3.00, -1.65], "to": [2.35, 5.25, 1.55], "color": "owlWhite", "col_idx": 0},
        {"name": "body_chest_puffy", "group": "body_wings", "from": [-1.85, 3.35, -1.95], "to": [1.85, 5.05, -1.55], "color": "owlWhite", "col_idx": 0},
        {"name": "body_chest_speckle_left", "group": "body_wings", "from": [-1.55, 3.65, -2.00], "to": [-0.65, 4.45, -1.85], "color": "owlSpeckleDark", "col_idx": 3},
        {"name": "body_chest_speckle_right", "group": "body_wings", "from": [0.65, 3.65, -2.00], "to": [1.55, 4.45, -1.85], "color": "owlSpeckleDark", "col_idx": 3},
        {"name": "body_chest_speckle_mid", "group": "body_wings", "from": [-0.45, 4.25, -2.00], "to": [0.45, 4.85, -1.85], "color": "owlSpeckleLight", "col_idx": 2},

        # Redesigned Tail: naturally sloping downward fan, tapered wedge, elegant silhouette (4 cubes)
        {"name": "tail_rump_coverts", "group": "body_wings", "from": [-1.35, 2.10, 1.15], "to": [1.35, 3.10, 1.70], "color": "owlWhite", "col_idx": 0},
        {"name": "tail_fan_upper", "group": "body_wings", "from": [-1.55, 1.20, 1.30], "to": [1.55, 2.25, 1.90], "color": "owlSpeckleDark", "col_idx": 3},
        {"name": "tail_wedge_lower", "group": "body_wings", "from": [-1.20, 0.55, 1.45], "to": [1.20, 1.40, 2.05], "color": "owlWhite", "col_idx": 0},
        {"name": "tail_feather_tips", "group": "body_wings", "from": [-0.75, 0.15, 1.55], "to": [0.75, 0.70, 2.10], "color": "owlSpeckleDark", "col_idx": 3},

        # Left wing
        {"name": "wing_shoulder_left", "group": "body_wings", "from": [-3.05, 3.55, -1.15], "to": [-2.25, 5.15, 1.35], "color": "owlWhite", "col_idx": 0},
        {"name": "wing_mid_left", "group": "body_wings", "from": [-3.15, 2.25, -1.25], "to": [-2.20, 3.75, 1.15], "color": "owlWhite", "col_idx": 0},
        {"name": "wing_primaries_left", "group": "body_wings", "from": [-3.00, 1.15, -0.65], "to": [-2.10, 2.45, 1.45], "color": "owlSpeckleDark", "col_idx": 3},
        {"name": "wing_tip_point_left", "group": "body_wings", "from": [-2.75, 0.45, 0.15], "to": [-2.05, 1.35, 1.85], "color": "owlWhite", "col_idx": 0},
        {"name": "wing_hand_front_left", "group": "body_wings", "from": [-2.65, 2.15, -1.85], "to": [-1.85, 3.20, -0.95], "color": "owlWhite", "col_idx": 0},

        # Right wing
        {"name": "wing_shoulder_right", "group": "body_wings", "from": [2.25, 3.55, -1.15], "to": [3.05, 5.15, 1.35], "color": "owlWhite", "col_idx": 0},
        {"name": "wing_mid_right", "group": "body_wings", "from": [2.20, 2.25, -1.25], "to": [3.15, 3.75, 1.15], "color": "owlWhite", "col_idx": 0},
        {"name": "wing_primaries_right", "group": "body_wings", "from": [2.10, 1.15, -0.65], "to": [3.00, 2.45, 1.45], "color": "owlSpeckleDark", "col_idx": 3},
        {"name": "wing_tip_point_right", "group": "body_wings", "from": [2.05, 0.45, 0.15], "to": [2.75, 1.35, 1.85], "color": "owlWhite", "col_idx": 0},
        {"name": "wing_hand_front_right", "group": "body_wings", "from": [1.85, 2.15, -1.85], "to": [2.65, 3.20, -0.95], "color": "owlWhite", "col_idx": 0},

        # =========================================================================
        # 3. HEAD & FACE (18 cubes)
        # Rounded facial disc, large expressive amber eyes, glints, graphite beak, tufts.
        # =========================================================================
        {"name": "head_neck_core", "group": "head_face", "from": [-1.75, 4.95, -1.35], "to": [1.75, 5.85, 1.25], "color": "owlWhite", "col_idx": 0},
        {"name": "head_cranium_main", "group": "head_face", "from": [-2.25, 5.65, -1.55], "to": [2.25, 8.45, 1.45], "color": "owlWhite", "col_idx": 0},
        {"name": "head_back_plumage", "group": "head_face", "from": [-2.15, 5.80, 1.15], "to": [2.15, 8.20, 1.85], "color": "owlWhite", "col_idx": 0},
        {"name": "face_disc_base", "group": "head_face", "from": [-2.35, 5.75, -1.85], "to": [2.35, 8.15, -1.30], "color": "owlSnowPure", "col_idx": 1},
        {"name": "face_disc_rim", "group": "head_face", "from": [-2.55, 5.95, -1.75], "to": [2.55, 7.95, -1.45], "color": "owlSpeckleLight", "col_idx": 2},
        {"name": "brow_ridge", "group": "head_face", "from": [-2.05, 7.85, -2.00], "to": [2.05, 8.45, -1.65], "color": "owlSnowPure", "col_idx": 1},
        {"name": "ear_tuft_left", "group": "head_face", "from": [-2.45, 8.30, -0.75], "to": [-1.65, 9.15, 0.15], "color": "owlWhite", "col_idx": 0},
        {"name": "ear_tuft_right", "group": "head_face", "from": [1.65, 8.30, -0.75], "to": [2.45, 9.15, 0.15], "color": "owlWhite", "col_idx": 0},

        # Eyes left
        {"name": "eye_iris_amber_left", "group": "head_face", "from": [-1.90, 6.35, -2.00], "to": [-0.60, 7.65, -1.70], "color": "amberGold", "col_idx": 7},
        {"name": "eye_iris_inner_left", "group": "head_face", "from": [-1.80, 6.45, -2.05], "to": [-0.70, 7.55, -1.90], "color": "brightAmber", "col_idx": 8},
        {"name": "eye_pupil_left", "group": "head_face", "from": [-1.65, 6.60, -2.15], "to": [-0.85, 7.40, -1.95], "color": "eyePupil", "col_idx": 6},
        {"name": "eye_glint_left", "group": "head_face", "from": [-1.55, 7.05, -2.20], "to": [-1.20, 7.35, -2.10], "color": "owlSnowPure", "col_idx": 1},

        # Eyes right
        {"name": "eye_iris_amber_right", "group": "head_face", "from": [0.60, 6.35, -2.00], "to": [1.90, 7.65, -1.70], "color": "amberGold", "col_idx": 7},
        {"name": "eye_iris_inner_right", "group": "head_face", "from": [0.70, 6.45, -2.05], "to": [1.80, 7.55, -1.90], "color": "brightAmber", "col_idx": 8},
        {"name": "eye_pupil_right", "group": "head_face", "from": [0.85, 6.60, -2.15], "to": [1.65, 7.40, -1.95], "color": "eyePupil", "col_idx": 6},
        {"name": "eye_glint_right", "group": "head_face", "from": [0.95, 7.05, -2.20], "to": [1.30, 7.35, -2.10], "color": "owlSnowPure", "col_idx": 1},

        # Beak
        {"name": "beak_base", "group": "head_face", "from": [-0.35, 6.25, -2.25], "to": [0.35, 7.15, -1.70], "color": "graphiteBeak", "col_idx": 5},
        {"name": "beak_hook_tip", "group": "head_face", "from": [-0.25, 5.75, -2.40], "to": [0.25, 6.45, -2.05], "color": "graphiteBeak", "col_idx": 5},

        # =========================================================================
        # 4. SANTA HAT (8 cubes)
        # White fur brim, red drooping cone, white pompom socket and ball.
        # =========================================================================
        {"name": "hat_fur_brim", "group": "santa_hat", "from": [-2.10, 8.25, -1.75], "to": [2.10, 8.95, 1.35], "color": "owlSnowPure", "col_idx": 1},
        {"name": "hat_cone_tier1", "group": "santa_hat", "from": [-1.75, 8.85, -1.45], "to": [1.75, 9.95, 1.15], "color": "santaRed", "col_idx": 9},
        {"name": "hat_cone_tier2", "group": "santa_hat", "from": [-1.45, 9.75, -1.05], "to": [1.45, 10.75, 1.25], "color": "santaRed", "col_idx": 9},
        {"name": "hat_cone_tier3_bend", "group": "santa_hat", "from": [-1.25, 10.45, -0.45], "to": [0.95, 11.35, 1.55], "color": "santaRed", "col_idx": 9},
        {"name": "hat_droop_tier4", "group": "santa_hat", "from": [-1.05, 9.95, 1.15], "to": [0.55, 10.85, 2.15], "color": "santaRed", "col_idx": 9},
        {"name": "hat_droop_tail", "group": "santa_hat", "from": [-0.85, 8.95, 1.65], "to": [0.35, 10.15, 2.45], "color": "santaRed", "col_idx": 9},
        {"name": "hat_pompom_socket", "group": "santa_hat", "from": [-0.65, 8.35, 1.85], "to": [0.15, 9.15, 2.50], "color": "owlSnowPure", "col_idx": 1},
        {"name": "hat_pompom_fluff", "group": "santa_hat", "from": [-0.55, 7.65, 1.95], "to": [0.05, 8.55, 2.65], "color": "owlSnowPure", "col_idx": 1},

        # =========================================================================
        # 5. REDESIGNED FROSTED CEDAR PINECONE WITH SPRIG & BERRY (11 cubes)
        # Teardrop/ovoid silhouette, warm cedar wood (#78350f / #92400e),
        # silver & snow frost tips (#e2e8f0 / #ffffff),
        # evergreen spruce sprig (#15803d) and red winter berry (#dc2626).
        # =========================================================================
        # Narrow bottom tip
        {"name": "cone_tip_bottom", "group": "silver_pinecone", "from": [-0.45, 0.35, -2.25], "to": [0.45, 0.90, -1.65], "color": "coneWoodDark", "col_idx": 10},
        # Lower tier stepped scales
        {"name": "cone_tier_lower", "group": "silver_pinecone", "from": [-0.95, 0.80, -2.45], "to": [0.95, 1.50, -1.55], "color": "coneWoodWarm", "col_idx": 11},
        {"name": "cone_tier_lower_frost", "group": "silver_pinecone", "from": [-1.05, 1.00, -2.55], "to": [1.05, 1.35, -1.75], "color": "silverFrost", "col_idx": 4},
        # Mid tier widest scales (core, warm scale shell, frosted center boss)
        {"name": "cone_tier_mid_core", "group": "silver_pinecone", "from": [-1.25, 1.45, -2.60], "to": [1.25, 2.30, -1.50], "color": "coneWoodDark", "col_idx": 10},
        {"name": "cone_tier_mid_scales", "group": "silver_pinecone", "from": [-1.15, 1.60, -2.70], "to": [1.15, 2.15, -1.60], "color": "coneWoodWarm", "col_idx": 11},
        {"name": "cone_scale_frost_center", "group": "silver_pinecone", "from": [-0.55, 1.70, -2.85], "to": [0.55, 2.10, -2.45], "color": "owlSnowPure", "col_idx": 1},
        # Upper tier scales
        {"name": "cone_tier_upper_core", "group": "silver_pinecone", "from": [-0.90, 2.20, -2.45], "to": [0.90, 2.90, -1.55], "color": "coneWoodDark", "col_idx": 10},
        {"name": "cone_tier_upper_frost", "group": "silver_pinecone", "from": [-0.75, 2.45, -2.55], "to": [0.75, 2.80, -1.70], "color": "silverFrost", "col_idx": 4},
        # Festive spruce sprig branches and ruby winter berry
        {"name": "cone_spruce_left", "group": "silver_pinecone", "from": [-0.75, 2.85, -2.35], "to": [-0.10, 3.40, -1.70], "color": "pineGreen", "col_idx": 12},
        {"name": "cone_spruce_right", "group": "silver_pinecone", "from": [0.10, 2.85, -2.30], "to": [0.75, 3.40, -1.70], "color": "pineGreen", "col_idx": 12},
        {"name": "cone_winter_berry", "group": "silver_pinecone", "from": [-0.25, 3.15, -2.45], "to": [0.25, 3.65, -1.90], "color": "santaRed", "col_idx": 9},
    ]
    return cubes

if __name__ == '__main__':
    cubes = build_holiday_owl()
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
