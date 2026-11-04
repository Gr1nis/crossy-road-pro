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

def build_husky_sweater():
    cubes = [
        # =====================================================================
        # 1. LEGS (14 cubes) - All 4 paws grounded strictly at Y = 0.00
        # =====================================================================
        # FRONT LEFT LEG (sock + cuff + pad + toe beans)
        {"name": "front_paw_pad_left", "group": "legs", "from": [-3.70, 0.00, -3.90], "to": [-1.90, 0.60, -2.10], "color": "huskyWhite", "col_idx": 2},
        {"name": "front_toe_beans_left", "group": "legs", "from": [-3.40, 0.10, -4.40], "to": [-2.20, 0.55, -3.80], "color": "huskyWhite", "col_idx": 2},
        {"name": "front_paw_sock_left", "group": "legs", "from": [-3.80, 0.45, -4.00], "to": [-1.80, 2.05, -2.00], "color": "huskyWhite", "col_idx": 2},
        {"name": "front_sweater_cuff_left", "group": "legs", "from": [-3.90, 1.95, -4.10], "to": [-1.70, 3.00, -1.90], "color": "sweaterRed", "col_idx": 3},

        # FRONT RIGHT LEG
        {"name": "front_paw_pad_right", "group": "legs", "from": [1.90, 0.00, -3.90], "to": [3.70, 0.60, -2.10], "color": "huskyWhite", "col_idx": 2},
        {"name": "front_toe_beans_right", "group": "legs", "from": [2.20, 0.10, -4.40], "to": [3.40, 0.55, -3.80], "color": "huskyWhite", "col_idx": 2},
        {"name": "front_paw_sock_right", "group": "legs", "from": [1.80, 0.45, -4.00], "to": [3.80, 2.05, -2.00], "color": "huskyWhite", "col_idx": 2},
        {"name": "front_sweater_cuff_right", "group": "legs", "from": [1.70, 1.95, -4.10], "to": [3.90, 3.00, -1.90], "color": "sweaterRed", "col_idx": 3},

        # REAR LEFT LEG (expressive haunches/thighs like Corgi!)
        {"name": "rear_paw_pad_left", "group": "legs", "from": [-3.70, 0.00, 2.10], "to": [-1.90, 0.60, 3.90], "color": "huskyWhite", "col_idx": 2},
        {"name": "rear_paw_sock_left", "group": "legs", "from": [-3.80, 0.45, 2.00], "to": [-1.80, 2.85, 4.00], "color": "huskyWhite", "col_idx": 2},
        {"name": "rear_thigh_haunch_left", "group": "legs", "from": [-3.95, 2.75, 1.80], "to": [-1.70, 4.70, 4.20], "color": "huskyDark", "col_idx": 0},

        # REAR RIGHT LEG
        {"name": "rear_paw_pad_right", "group": "legs", "from": [1.90, 0.00, 2.10], "to": [3.70, 0.60, 3.90], "color": "huskyWhite", "col_idx": 2},
        {"name": "rear_paw_sock_right", "group": "legs", "from": [1.80, 0.45, 2.00], "to": [3.80, 2.85, 4.00], "color": "huskyWhite", "col_idx": 2},
        {"name": "rear_thigh_haunch_right", "group": "legs", "from": [1.70, 2.75, 1.80], "to": [3.95, 4.70, 4.20], "color": "huskyDark", "col_idx": 0},

        # =====================================================================
        # 2. BODY & SWEATER (11 cubes) - Loaf anatomy + Festive 2-tone Red/White
        # =====================================================================
        # Main torso loaf core in festive red
        {"name": "body_loaf_core", "group": "body_sweater", "from": [-3.50, 2.50, -3.70], "to": [3.50, 7.00, 3.30], "color": "sweaterRed", "col_idx": 3},
        # Soft belly drooping under sweater
        {"name": "body_belly_soft", "group": "body_sweater", "from": [-2.60, 2.20, -3.30], "to": [2.60, 2.60, 3.00], "color": "sweaterRed", "col_idx": 3},
        # Ribbed lower hem band
        {"name": "sweater_hem_trim", "group": "body_sweater", "from": [-3.60, 2.35, 2.70], "to": [3.60, 3.10, 3.35], "color": "sweaterWhite", "col_idx": 4},
        # Chest bib volume
        {"name": "chest_bib_sweater", "group": "body_sweater", "from": [-3.20, 3.10, -4.40], "to": [3.20, 6.70, -3.60], "color": "sweaterRed", "col_idx": 3},
        # Festive Nordic white snowflake emblem on chest
        {"name": "chest_snowflake_patch", "group": "body_sweater", "from": [-1.70, 4.10, -4.60], "to": [1.70, 5.90, -4.30], "color": "sweaterWhite", "col_idx": 4},
        # Nordic white knit band across upper back
        {"name": "sweater_band_white_back", "group": "body_sweater", "from": [-2.90, 6.95, -0.90], "to": [2.90, 7.20, 0.50], "color": "sweaterWhite", "col_idx": 4},
        # Nordic white knit band on flanks
        {"name": "sweater_band_white_left", "group": "body_sweater", "from": [-3.65, 4.60, -0.90], "to": [-3.45, 5.80, 0.50], "color": "sweaterWhite", "col_idx": 4},
        {"name": "sweater_band_white_right", "group": "body_sweater", "from": [3.45, 4.60, -0.90], "to": [3.65, 5.80, 0.50], "color": "sweaterWhite", "col_idx": 4},
        # Rounded rear loaf bum peeking past sweater
        {"name": "rear_bum_loaf", "group": "body_sweater", "from": [-3.30, 2.70, 3.25], "to": [3.30, 6.70, 4.65], "color": "huskyDark", "col_idx": 0},
        # Fluffy white husky under-tail breeches / cheeks
        {"name": "rear_bum_white_fluff", "group": "body_sweater", "from": [-2.70, 3.20, 4.55], "to": [2.70, 5.80, 5.10], "color": "huskyWhite", "col_idx": 2},
        # White chest tuft under turtleneck
        {"name": "chest_under_ruff", "group": "body_sweater", "from": [-1.50, 2.65, -4.20], "to": [1.50, 3.40, -3.65], "color": "huskyWhite", "col_idx": 2},

        # =====================================================================
        # 3. SWEATER COLLAR & NECK (3 cubes) - Low, broad, snug collar ring
        # =====================================================================
        # Thick rolled turtleneck collar (like Corgi collar_ring: wide X & Z, low Y!)
        {"name": "collar_roll_red", "group": "sweater_collar", "from": [-3.65, 6.45, -5.10], "to": [3.65, 7.35, -0.20], "color": "sweaterRed", "col_idx": 3},
        # White knitted roll trim atop collar
        {"name": "collar_trim_white", "group": "sweater_collar", "from": [-3.55, 7.30, -5.00], "to": [3.55, 7.60, -0.30], "color": "sweaterWhite", "col_idx": 4},
        # Muscular nape transition into head
        {"name": "neck_nape_husky", "group": "sweater_collar", "from": [-2.70, 7.25, -1.40], "to": [2.70, 8.45, -0.35], "color": "huskyDark", "col_idx": 0},

        # =====================================================================
        # 4. HEAD, EYES & SNOUT (24 cubes) - Eyes strictly at Y ~ 9.5..10.5
        # =====================================================================
        # Head core nested right in collar
        {"name": "head_core", "group": "head_neck", "from": [-3.40, 7.10, -5.80], "to": [3.40, 11.70, -0.40], "color": "huskyDark", "col_idx": 0},
        {"name": "head_crown", "group": "head_neck", "from": [-2.50, 11.60, -4.60], "to": [2.50, 12.20, -1.60], "color": "huskyDark", "col_idx": 0},

        # White cheeks strictly below Y 9.40 (DO NOT overlap eyes!)
        {"name": "cheek_fluff_left", "group": "head_neck", "from": [-4.00, 7.50, -4.80], "to": [-3.30, 9.35, -1.80], "color": "huskyWhite", "col_idx": 2},
        {"name": "cheek_fluff_right", "group": "head_neck", "from": [3.30, 7.50, -4.80], "to": [4.00, 9.35, -1.80], "color": "huskyWhite", "col_idx": 2},

        # Husky lower face mask
        {"name": "face_mask_white", "group": "head_neck", "from": [-2.90, 8.10, -6.00], "to": [2.90, 9.40, -5.70], "color": "huskyWhite", "col_idx": 2},
        # Husky blaze running up forehead
        {"name": "forehead_blaze", "group": "head_neck", "from": [-0.80, 9.35, -6.10], "to": [0.80, 12.10, -3.90], "color": "huskyWhite", "col_idx": 2},

        # Muzzle & jaw strictly below Y 9.30
        {"name": "snout_muzzle", "group": "head_neck", "from": [-1.80, 7.30, -7.50], "to": [1.80, 9.25, -5.65], "color": "huskyWhite", "col_idx": 2},
        {"name": "chin_under_mouth", "group": "head_neck", "from": [-1.30, 6.75, -6.70], "to": [1.30, 7.35, -5.60], "color": "huskyWhite", "col_idx": 2},
        {"name": "nose_button", "group": "head_neck", "from": [-0.70, 8.40, -8.10], "to": [0.70, 9.45, -7.40], "color": "noseBlack", "col_idx": 6},
        {"name": "tongue_playful", "group": "head_neck", "from": [0.20, 7.15, -7.80], "to": [0.75, 7.65, -6.85], "color": "tonguePink", "col_idx": 7},

        # EYES: STRICTLY AT Y ~ 9.50..10.50 (Sky-blue iris + black pupil + white sparkle)
        # Left Eye
        {"name": "eye_iris_left", "group": "head_neck", "from": [-2.50, 9.50, -6.05], "to": [-1.30, 10.55, -5.70], "color": "huskyBlue", "col_idx": 5},
        {"name": "eye_pupil_left", "group": "head_neck", "from": [-2.20, 9.75, -6.15], "to": [-1.50, 10.45, -5.95], "color": "noseBlack", "col_idx": 6},
        {"name": "eye_sparkle_left", "group": "head_neck", "from": [-2.10, 10.15, -6.25], "to": [-1.70, 10.40, -6.10], "color": "sweaterWhite", "col_idx": 4},
        {"name": "eyebrow_pip_left", "group": "head_neck", "from": [-2.40, 10.80, -6.00], "to": [-1.40, 11.25, -5.60], "color": "huskyWhite", "col_idx": 2},

        # Right Eye
        {"name": "eye_iris_right", "group": "head_neck", "from": [1.30, 9.50, -6.05], "to": [2.50, 10.55, -5.70], "color": "huskyBlue", "col_idx": 5},
        {"name": "eye_pupil_right", "group": "head_neck", "from": [1.50, 9.75, -6.15], "to": [2.20, 10.45, -5.95], "color": "noseBlack", "col_idx": 6},
        {"name": "eye_sparkle_right", "group": "head_neck", "from": [1.70, 10.15, -6.25], "to": [2.10, 10.40, -6.10], "color": "sweaterWhite", "col_idx": 4},
        {"name": "eyebrow_pip_right", "group": "head_neck", "from": [1.40, 10.80, -6.00], "to": [2.40, 11.25, -5.60], "color": "huskyWhite", "col_idx": 2},

        # Prick Ears
        {"name": "ear_base_left", "group": "head_neck", "from": [-3.30, 11.40, -3.80], "to": [-1.60, 13.80, -2.20], "color": "huskyDark", "col_idx": 0},
        {"name": "ear_tip_left", "group": "head_neck", "from": [-3.10, 13.60, -3.60], "to": [-1.80, 15.40, -2.40], "color": "huskyDark", "col_idx": 0},
        {"name": "ear_inner_left", "group": "head_neck", "from": [-2.90, 11.80, -4.00], "to": [-2.00, 13.90, -3.50], "color": "huskyWhite", "col_idx": 2},

        {"name": "ear_base_right", "group": "head_neck", "from": [1.60, 11.40, -3.80], "to": [3.30, 13.80, -2.20], "color": "huskyDark", "col_idx": 0},
        {"name": "ear_tip_right", "group": "head_neck", "from": [1.80, 13.60, -3.60], "to": [3.10, 15.40, -2.40], "color": "huskyDark", "col_idx": 0},
        {"name": "ear_inner_right", "group": "head_neck", "from": [2.00, 11.80, -4.00], "to": [2.90, 13.90, -3.50], "color": "huskyWhite", "col_idx": 2},

        # =====================================================================
        # 5. TAIL (5 cubes) - Upright lifted plume, proud curl with white tip!
        # =====================================================================
        # Tail base rising from upper rump
        {"name": "tail_base_up", "group": "tail", "from": [-0.90, 5.50, 4.10], "to": [0.90, 6.90, 5.30], "color": "huskyDark", "col_idx": 0},
        # Mid plume rising up and slightly backward
        {"name": "tail_mid_plume", "group": "tail", "from": [-1.00, 6.75, 4.60], "to": [1.00, 8.85, 6.00], "color": "huskyDark", "col_idx": 0},
        # High plume curl reaching up to Y=10.35
        {"name": "tail_high_curl", "group": "tail", "from": [-0.95, 8.70, 4.10], "to": [0.95, 10.35, 5.50], "color": "huskyGray", "col_idx": 1},
        # Forward curving crest
        {"name": "tail_crest_white", "group": "tail", "from": [-0.85, 9.90, 3.20], "to": [0.85, 11.10, 4.60], "color": "huskyWhite", "col_idx": 2},
        # Fluffy white inner plume tuft
        {"name": "tail_feather_white", "group": "tail", "from": [-0.70, 8.90, 3.00], "to": [0.70, 10.10, 3.80], "color": "huskyWhite", "col_idx": 2},
    ]
    return cubes

if __name__ == '__main__':
    cubes = build_husky_sweater()
    print(f"Total cubes: {len(cubes)}")
    q_errs = check_quantization(cubes)
    print(f"Quantization errors: {len(q_errs)}")
    min_y = min(c['from'][1] for c in cubes)
    grounded = [c['name'] for c in cubes if c['from'][1] == 0.0]
    print(f"Min Y: {min_y:.2f}, Grounded paws ({len(grounded)}): {grounded}")
    issues = blockbench_check(cubes)
    print(f"Coplanar overlaps: {len(issues)}")
