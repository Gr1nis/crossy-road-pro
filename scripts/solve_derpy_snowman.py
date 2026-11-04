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

def build_derpy_snowman():
    cubes = [
        # =========================================================================
        # 1. BASE SNOWBALL (7 cubes, grounded strictly at Y = 0.00)
        # =========================================================================
        {
            "name": "base_ground_pad",
            "group": "base_snowball",
            "from": [-2.50, 0.00, -2.50],
            "to": [2.50, 0.60, 2.50],
            "color": "snowBody",
            "col_idx": 1
        },
        {
            "name": "base_sphere_core",
            "group": "base_snowball",
            "from": [-3.00, 0.40, -3.00],
            "to": [3.00, 4.20, 3.00],
            "color": "snowWhite",
            "col_idx": 0
        },
        {
            "name": "base_bulge_front",
            "group": "base_snowball",
            "from": [-2.40, 0.70, -3.50],
            "to": [2.40, 3.90, -2.90],
            "color": "snowWhite",
            "col_idx": 0
        },
        {
            "name": "base_bulge_back",
            "group": "base_snowball",
            "from": [-2.40, 0.70, 2.90],
            "to": [2.40, 3.90, 3.50],
            "color": "snowBody",
            "col_idx": 1
        },
        {
            "name": "base_bulge_left",
            "group": "base_snowball",
            "from": [-3.50, 0.70, -2.40],
            "to": [-2.90, 3.90, 2.40],
            "color": "snowWhite",
            "col_idx": 0
        },
        {
            "name": "base_bulge_right",
            "group": "base_snowball",
            "from": [2.90, 0.70, -2.40],
            "to": [3.50, 3.90, 2.40],
            "color": "snowWhite",
            "col_idx": 0
        },
        {
            "name": "base_sphere_dome",
            "group": "base_snowball",
            "from": [-2.60, 4.10, -2.60],
            "to": [2.60, 4.70, 2.60],
            "color": "snowWhite",
            "col_idx": 0
        },

        # =========================================================================
        # 2. TORSO SNOWBALL (9 cubes: rounded core + 3 coal buttons)
        # =========================================================================
        {
            "name": "torso_sphere_core",
            "group": "torso_snowball",
            "from": [-2.30, 4.50, -2.30],
            "to": [2.30, 7.80, 2.30],
            "color": "snowWhite",
            "col_idx": 0
        },
        {
            "name": "torso_bulge_front",
            "group": "torso_snowball",
            "from": [-1.80, 4.90, -2.85],
            "to": [1.80, 7.40, -2.20],
            "color": "snowWhite",
            "col_idx": 0
        },
        {
            "name": "torso_bulge_back",
            "group": "torso_snowball",
            "from": [-1.80, 4.90, 2.20],
            "to": [1.80, 7.40, 2.85],
            "color": "snowBody",
            "col_idx": 1
        },
        {
            "name": "torso_bulge_left",
            "group": "torso_snowball",
            "from": [-2.85, 4.90, -1.80],
            "to": [-2.20, 7.40, 1.80],
            "color": "snowWhite",
            "col_idx": 0
        },
        {
            "name": "torso_bulge_right",
            "group": "torso_snowball",
            "from": [2.20, 4.90, -1.80],
            "to": [2.85, 7.40, 1.80],
            "color": "snowWhite",
            "col_idx": 0
        },
        {
            "name": "torso_top_dome",
            "group": "torso_snowball",
            "from": [-1.90, 7.70, -1.90],
            "to": [1.90, 8.30, 1.90],
            "color": "snowWhite",
            "col_idx": 0
        },
        {
            "name": "torso_button_upper",
            "group": "torso_snowball",
            "from": [-0.25, 6.95, -3.05],
            "to": [0.25, 7.45, -2.75],
            "color": "coalBlack",
            "col_idx": 2
        },
        {
            "name": "torso_button_mid",
            "group": "torso_snowball",
            "from": [-0.25, 6.10, -3.05],
            "to": [0.25, 6.60, -2.75],
            "color": "coalBlack",
            "col_idx": 2
        },
        {
            "name": "torso_button_lower",
            "group": "torso_snowball",
            "from": [-0.25, 5.25, -3.05],
            "to": [0.25, 5.75, -2.75],
            "color": "coalBlack",
            "col_idx": 2
        },

        # =========================================================================
        # 3. SCARF (14 cubes: 360° festive red/white stripes, knot + draping tail)
        # 5 stripes on each side: Red - White - Red - White - Red
        # Reaches X = +/-2.80..2.85 for prominent visibility from all angles
        # =========================================================================
        # Front (3 cubes: Red, White, Red)
        {
            "name": "scarf_ring_front_left",
            "group": "scarf",
            "from": [-2.70, 7.75, -2.60],
            "to": [-0.65, 8.55, -1.95],
            "color": "scarfRed",
            "col_idx": 4
        },
        {
            "name": "scarf_ring_front_center",
            "group": "scarf",
            "from": [-0.75, 7.90, -2.65],
            "to": [0.75, 8.70, -2.00],
            "color": "scarfWhite",
            "col_idx": 5
        },
        {
            "name": "scarf_ring_front_right",
            "group": "scarf",
            "from": [0.65, 7.75, -2.60],
            "to": [2.70, 8.55, -1.95],
            "color": "scarfRed",
            "col_idx": 4
        },

        # Right Side (3 cubes: White, Red, White)
        {
            "name": "scarf_ring_side_right_front",
            "group": "scarf",
            "from": [2.00, 7.70, -2.05],
            "to": [2.80, 8.65, -0.70],
            "color": "scarfWhite",
            "col_idx": 5
        },
        {
            "name": "scarf_ring_side_right_mid",
            "group": "scarf",
            "from": [2.05, 7.85, -0.80],
            "to": [2.85, 8.70, 0.65],
            "color": "scarfRed",
            "col_idx": 4
        },
        {
            "name": "scarf_ring_side_right_back",
            "group": "scarf",
            "from": [2.00, 7.70, 0.55],
            "to": [2.80, 8.65, 2.05],
            "color": "scarfWhite",
            "col_idx": 5
        },

        # Back (1 cube: Red)
        {
            "name": "scarf_ring_back",
            "group": "scarf",
            "from": [-2.15, 7.90, 2.00],
            "to": [2.15, 8.70, 2.65],
            "color": "scarfRed",
            "col_idx": 4
        },

        # Left Side (3 cubes: White, Red, White)
        {
            "name": "scarf_ring_side_left_back",
            "group": "scarf",
            "from": [-2.80, 7.70, 0.55],
            "to": [-2.00, 8.65, 2.05],
            "color": "scarfWhite",
            "col_idx": 5
        },
        {
            "name": "scarf_ring_side_left_mid",
            "group": "scarf",
            "from": [-2.85, 7.85, -0.80],
            "to": [-2.05, 8.70, 0.65],
            "color": "scarfRed",
            "col_idx": 4
        },
        {
            "name": "scarf_ring_side_left_front",
            "group": "scarf",
            "from": [-2.80, 7.70, -2.05],
            "to": [-2.00, 8.65, -0.70],
            "color": "scarfWhite",
            "col_idx": 5
        },

        # Scarf Knot (Red)
        {
            "name": "scarf_knot",
            "group": "scarf",
            "from": [-2.10, 7.70, -3.00],
            "to": [-1.15, 8.50, -2.35],
            "color": "scarfRed",
            "col_idx": 4
        },

        # Scarf Tail (3 cubes: White, Red, White with fringe)
        {
            "name": "scarf_tail_top",
            "group": "scarf",
            "from": [-2.05, 6.65, -2.90],
            "to": [-1.20, 7.85, -2.40],
            "color": "scarfWhite",
            "col_idx": 5
        },
        {
            "name": "scarf_tail_mid",
            "group": "scarf",
            "from": [-2.00, 5.45, -2.95],
            "to": [-1.25, 6.75, -2.35],
            "color": "scarfRed",
            "col_idx": 4
        },
        {
            "name": "scarf_tail_fringe",
            "group": "scarf",
            "from": [-2.10, 4.30, -2.90],
            "to": [-1.15, 5.55, -2.45],
            "color": "scarfWhite",
            "col_idx": 5
        },

        # =========================================================================
        # 4. HEAD SNOWBALL (14 cubes: core, carrot nose, eyes, smile)
        # =========================================================================
        {
            "name": "head_sphere_core",
            "group": "head_snowball",
            "from": [-1.80, 8.35, -1.80],
            "to": [1.80, 11.45, 1.80],
            "color": "snowWhite",
            "col_idx": 0
        },
        {
            "name": "head_bulge_front",
            "group": "head_snowball",
            "from": [-1.45, 8.50, -2.25],
            "to": [1.45, 11.15, -1.75],
            "color": "snowWhite",
            "col_idx": 0
        },
        {
            "name": "head_bulge_back",
            "group": "head_snowball",
            "from": [-1.45, 8.55, 1.75],
            "to": [1.45, 11.15, 2.25],
            "color": "snowBody",
            "col_idx": 1
        },
        {
            "name": "head_bulge_left",
            "group": "head_snowball",
            "from": [-2.25, 8.55, -1.45],
            "to": [-1.75, 11.15, 1.45],
            "color": "snowWhite",
            "col_idx": 0
        },
        {
            "name": "head_bulge_right",
            "group": "head_snowball",
            "from": [1.75, 8.55, -1.45],
            "to": [2.25, 11.15, 1.45],
            "color": "snowWhite",
            "col_idx": 0
        },
        {
            "name": "head_dome_top",
            "group": "head_snowball",
            "from": [-1.40, 11.40, -1.40],
            "to": [1.40, 11.75, 1.40],
            "color": "snowWhite",
            "col_idx": 0
        },
        # Carrot Nose
        {
            "name": "carrot_base",
            "group": "head_snowball",
            "from": [-0.35, 9.55, -2.90],
            "to": [0.35, 10.25, -2.20],
            "color": "carrotOrange",
            "col_idx": 3
        },
        {
            "name": "carrot_tip",
            "group": "head_snowball",
            "from": [-0.25, 9.65, -3.65],
            "to": [0.25, 10.15, -2.85],
            "color": "carrotOrange",
            "col_idx": 3
        },
        # Eyes
        {
            "name": "eye_charcoal_left",
            "group": "head_snowball",
            "from": [-1.05, 10.30, -2.35],
            "to": [-0.55, 10.80, -2.15],
            "color": "coalBlack",
            "col_idx": 2
        },
        {
            "name": "eye_charcoal_right",
            "group": "head_snowball",
            "from": [0.55, 10.20, -2.35],
            "to": [1.05, 10.70, -2.15],
            "color": "coalBlack",
            "col_idx": 2
        },
        # Smile
        {
            "name": "smile_coal_left",
            "group": "head_snowball",
            "from": [-0.90, 9.15, -2.30],
            "to": [-0.60, 9.45, -2.15],
            "color": "coalBlack",
            "col_idx": 2
        },
        {
            "name": "smile_coal_midleft",
            "group": "head_snowball",
            "from": [-0.50, 8.90, -2.30],
            "to": [-0.20, 9.20, -2.15],
            "color": "coalBlack",
            "col_idx": 2
        },
        {
            "name": "smile_coal_midright",
            "group": "head_snowball",
            "from": [0.15, 8.90, -2.30],
            "to": [0.45, 9.20, -2.15],
            "color": "coalBlack",
            "col_idx": 2
        },
        {
            "name": "smile_coal_right",
            "group": "head_snowball",
            "from": [0.55, 9.10, -2.30],
            "to": [0.85, 9.40, -2.15],
            "color": "coalBlack",
            "col_idx": 2
        },

        # =========================================================================
        # 5. BUCKET HAT (8 cubes: cobalt blue tin bucket cocked slightly askew)
        # =========================================================================
        {
            "name": "bucket_rim_silver",
            "group": "bucket_hat",
            "from": [-1.65, 11.55, -1.65],
            "to": [1.75, 11.85, 1.65],
            "color": "metalSilver",
            "col_idx": 7
        },
        {
            "name": "bucket_body_lower",
            "group": "bucket_hat",
            "from": [-1.50, 11.80, -1.50],
            "to": [1.70, 12.60, 1.50],
            "color": "bucketBlue",
            "col_idx": 6
        },
        {
            "name": "bucket_body_upper",
            "group": "bucket_hat",
            "from": [-1.35, 12.55, -1.35],
            "to": [1.75, 13.35, 1.45],
            "color": "bucketBlue",
            "col_idx": 6
        },
        {
            "name": "bucket_top_lid",
            "group": "bucket_hat",
            "from": [-1.20, 13.30, -1.20],
            "to": [1.60, 13.65, 1.30],
            "color": "bucketBlue",
            "col_idx": 6
        },
        {
            "name": "bucket_top_rim_silver",
            "group": "bucket_hat",
            "from": [-1.25, 13.60, -1.25],
            "to": [1.65, 13.80, 1.35],
            "color": "metalSilver",
            "col_idx": 7
        },
        {
            "name": "bucket_handle_ear_left",
            "group": "bucket_hat",
            "from": [-1.65, 12.10, -0.20],
            "to": [-1.45, 12.45, 0.20],
            "color": "metalSilver",
            "col_idx": 7
        },
        {
            "name": "bucket_handle_ear_right",
            "group": "bucket_hat",
            "from": [1.65, 12.10, -0.20],
            "to": [1.85, 12.45, 0.20],
            "color": "metalSilver",
            "col_idx": 7
        },
        {
            "name": "bucket_handle_bail",
            "group": "bucket_hat",
            "from": [-1.75, 11.35, -0.15],
            "to": [-1.55, 12.15, 0.15],
            "color": "metalSilver",
            "col_idx": 7
        },

        # =========================================================================
        # 6. TWIG ARMS & CANDY CANE (18 cubes: rustic twigs + candy cane staff)
        # =========================================================================
        # Left Twig Arm (gesturing warmly)
        {
            "name": "twig_arm_left_shoulder",
            "group": "twig_arms_candy",
            "from": [-3.20, 6.45, -0.25],
            "to": [-2.35, 6.85, 0.25],
            "color": "woodBrown",
            "col_idx": 8
        },
        {
            "name": "twig_arm_left_elbow",
            "group": "twig_arms_candy",
            "from": [-4.05, 6.75, -0.20],
            "to": [-3.15, 7.15, 0.30],
            "color": "woodBrown",
            "col_idx": 8
        },
        {
            "name": "twig_arm_left_fork_upper",
            "group": "twig_arms_candy",
            "from": [-4.45, 7.10, -0.15],
            "to": [-4.00, 7.75, 0.15],
            "color": "woodBrown",
            "col_idx": 8
        },
        {
            "name": "twig_arm_left_fork_lower",
            "group": "twig_arms_candy",
            "from": [-4.55, 6.55, 0.10],
            "to": [-4.00, 6.95, 0.40],
            "color": "woodBrown",
            "col_idx": 8
        },

        # Right Twig Arm (gripping candy cane)
        {
            "name": "twig_arm_right_shoulder",
            "group": "twig_arms_candy",
            "from": [2.35, 6.45, -0.25],
            "to": [3.20, 6.85, 0.25],
            "color": "woodBrown",
            "col_idx": 8
        },
        {
            "name": "twig_arm_right_elbow",
            "group": "twig_arms_candy",
            "from": [3.15, 6.25, -0.75],
            "to": [3.95, 6.65, -0.15],
            "color": "woodBrown",
            "col_idx": 8
        },
        {
            "name": "twig_arm_right_hand_grip",
            "group": "twig_arms_candy",
            "from": [3.55, 6.05, -1.45],
            "to": [4.25, 6.55, -0.70],
            "color": "woodBrown",
            "col_idx": 8
        },

        # Candy Cane (Standing on ground at Y = 0.00, gripped at Y = 6.05..6.55)
        {
            "name": "candy_stripe_0_red",
            "group": "twig_arms_candy",
            "from": [3.75, 0.00, -1.25],
            "to": [4.15, 1.20, -0.85],
            "color": "scarfRed",
            "col_idx": 4
        },
        {
            "name": "candy_stripe_1_white",
            "group": "twig_arms_candy",
            "from": [3.70, 1.15, -1.30],
            "to": [4.20, 2.30, -0.80],
            "color": "scarfWhite",
            "col_idx": 5
        },
        {
            "name": "candy_stripe_2_red",
            "group": "twig_arms_candy",
            "from": [3.75, 2.25, -1.25],
            "to": [4.15, 3.40, -0.85],
            "color": "scarfRed",
            "col_idx": 4
        },
        {
            "name": "candy_stripe_3_white",
            "group": "twig_arms_candy",
            "from": [3.70, 3.35, -1.30],
            "to": [4.20, 4.50, -0.80],
            "color": "scarfWhite",
            "col_idx": 5
        },
        {
            "name": "candy_stripe_4_red",
            "group": "twig_arms_candy",
            "from": [3.75, 4.45, -1.25],
            "to": [4.15, 5.60, -0.85],
            "color": "scarfRed",
            "col_idx": 4
        },
        {
            "name": "candy_stripe_5_white",
            "group": "twig_arms_candy",
            "from": [3.70, 5.55, -1.30],
            "to": [4.20, 6.70, -0.80],
            "color": "scarfWhite",
            "col_idx": 5
        },
        {
            "name": "candy_stripe_6_red",
            "group": "twig_arms_candy",
            "from": [3.75, 6.65, -1.25],
            "to": [4.15, 7.75, -0.85],
            "color": "scarfRed",
            "col_idx": 4
        },
        {
            "name": "candy_hook_turn_white",
            "group": "twig_arms_candy",
            "from": [3.70, 7.70, -1.30],
            "to": [4.20, 8.45, -0.35],
            "color": "scarfWhite",
            "col_idx": 5
        },
        {
            "name": "candy_hook_top_red",
            "group": "twig_arms_candy",
            "from": [3.75, 8.15, -0.40],
            "to": [4.15, 8.65, 0.45],
            "color": "scarfRed",
            "col_idx": 4
        },
        {
            "name": "candy_hook_down_white",
            "group": "twig_arms_candy",
            "from": [3.70, 7.35, 0.35],
            "to": [4.20, 8.20, 0.85],
            "color": "scarfWhite",
            "col_idx": 5
        },
        {
            "name": "candy_hook_tip_red",
            "group": "twig_arms_candy",
            "from": [3.75, 6.75, 0.40],
            "to": [4.15, 7.40, 0.80],
            "color": "scarfRed",
            "col_idx": 4
        }
    ]
    return cubes

if __name__ == '__main__':
    cubes = build_derpy_snowman()
    print(f"Total cubes count: {len(cubes)}")
    q_errs = check_quantization(cubes)
    print(f"Quantization errors: {len(q_errs)}")
    if q_errs:
        for q in q_errs:
            print("  ", q)
    min_y = min(c['from'][1] for c in cubes)
    grounded = [c['name'] for c in cubes if c['from'][1] == 0.0]
    print(f"Min Y: {min_y:.2f}, Grounded cubes ({len(grounded)}): {grounded}")
    issues = blockbench_check(cubes)
    print(f"Coplanar overlaps: {len(issues)}")
    if issues:
        for iss in issues:
            print(f"  {iss['c1']} vs {iss['c2']} on {iss['axis']} = {iss['plane']}")
