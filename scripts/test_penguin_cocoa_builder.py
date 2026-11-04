import json
import sys

sys.path.insert(0, 'scripts')
from blockbench_coplanar_check import blockbench_check

def get_penguin_cubes():
    return [
        # =========================================================================
        # 1. FEET & TOES (Base planted firmly at Y = 0.00)
        # =========================================================================
        # Left Foot Sole (grounded at Y=0.00)
        {
            "name": "foot_sole_left",
            "from": [-2.75, 0.00, -3.15],
            "to": [-0.65, 0.70, 1.25],
            "color": "penguinOrange",
            "col_idx": 2,
            "uv": [2, 0, 3, 1]
        },
        # Right Foot Sole (grounded at Y=0.00)
        {
            "name": "foot_sole_right",
            "from": [0.65, 0.00, -3.15],
            "to": [2.75, 0.70, 1.25],
            "color": "penguinOrange",
            "col_idx": 2,
            "uv": [2, 0, 3, 1]
        },
        # Left Foot Toe Ridge / Pad (starts at Y=0.55, penetrates into sole, no coplanar faces)
        {
            "name": "foot_toe_ridge_left",
            "from": [-2.45, 0.55, -3.35],
            "to": [-0.95, 0.85, -2.35],
            "color": "penguinOrangeLight",
            "col_idx": 3,
            "uv": [3, 0, 4, 1]
        },
        # Right Foot Toe Ridge / Pad
        {
            "name": "foot_toe_ridge_right",
            "from": [0.95, 0.55, -3.35],
            "to": [2.45, 0.85, -2.35],
            "color": "penguinOrangeLight",
            "col_idx": 3,
            "uv": [3, 0, 4, 1]
        },

        # =========================================================================
        # 2. BODY & PLUMP BABY BELLY (Monolithic core, dark plumage + snowy chest)
        # =========================================================================
        # Main Body Core (deep midnight navy / black plumage)
        {
            "name": "body_core",
            "from": [-2.55, 0.50, -2.10],
            "to": [2.55, 6.20, 2.30],
            "color": "penguinBlack",
            "col_idx": 0,
            "uv": [0, 0, 1, 1]
        },
        # Underbelly Lower Cushion
        {
            "name": "body_underbelly",
            "from": [-2.20, 0.30, -1.90],
            "to": [2.20, 1.10, 1.90],
            "color": "penguinBlack",
            "col_idx": 0,
            "uv": [0, 0, 1, 1]
        },
        # Left Flank Curvature
        {
            "name": "body_flank_left",
            "from": [-2.90, 1.20, -1.70],
            "to": [-2.40, 5.40, 1.80],
            "color": "penguinBlack",
            "col_idx": 0,
            "uv": [0, 0, 1, 1]
        },
        # Right Flank Curvature
        {
            "name": "body_flank_right",
            "from": [2.40, 1.20, -1.70],
            "to": [2.90, 5.40, 1.80],
            "color": "penguinBlack",
            "col_idx": 0,
            "uv": [0, 0, 1, 1]
        },
        # Lower Chubby White Belly
        {
            "name": "belly_white_lower",
            "from": [-2.05, 0.80, -2.60],
            "to": [2.05, 4.30, -1.75],
            "color": "penguinWhite",
            "col_idx": 1,
            "uv": [1, 0, 2, 1]
        },
        # Upper Fluffy White Chest
        {
            "name": "belly_white_upper",
            "from": [-1.75, 4.10, -2.50],
            "to": [1.75, 6.35, -1.80],
            "color": "penguinWhite",
            "col_idx": 1,
            "uv": [1, 0, 2, 1]
        },
        # Back Feather Arch
        {
            "name": "body_back_arch",
            "from": [-2.20, 1.60, 2.15],
            "to": [2.20, 5.80, 2.70],
            "color": "penguinBlack",
            "col_idx": 0,
            "uv": [0, 0, 1, 1]
        },

        # =========================================================================
        # 3. TAIL (Cute stubby penguin tail at rear)
        # =========================================================================
        {
            "name": "tail_main",
            "from": [-0.75, 1.15, 2.50],
            "to": [0.75, 2.10, 3.50],
            "color": "penguinBlack",
            "col_idx": 0,
            "uv": [0, 0, 1, 1]
        },
        {
            "name": "tail_tip_white",
            "from": [-0.55, 1.25, 3.30],
            "to": [0.55, 1.80, 3.80],
            "color": "penguinWhite",
            "col_idx": 1,
            "uv": [1, 0, 2, 1]
        },

        # =========================================================================
        # 4. FLIPPERS / WINGS (Curled snugly around the cocoa mug)
        # =========================================================================
        # Left Wing Shoulder
        {
            "name": "flipper_shoulder_left",
            "from": [-3.25, 4.25, -1.25],
            "to": [-2.35, 5.85, 1.25],
            "color": "penguinBlack",
            "col_idx": 0,
            "uv": [0, 0, 1, 1]
        },
        # Left Wing Mid Forearm
        {
            "name": "flipper_arm_left",
            "from": [-3.15, 3.35, -2.75],
            "to": [-2.20, 4.70, -0.95],
            "color": "penguinBlack",
            "col_idx": 0,
            "uv": [0, 0, 1, 1]
        },
        # Left Wing Hand / Flipper Tip holding the mug
        {
            "name": "flipper_hand_left",
            "from": [-2.35, 3.40, -3.55],
            "to": [-1.15, 4.40, -2.25],
            "color": "penguinBlack",
            "col_idx": 0,
            "uv": [0, 0, 1, 1]
        },
        # Left Flipper White Inner Cuff
        {
            "name": "flipper_cuff_left",
            "from": [-2.10, 3.50, -3.65],
            "to": [-1.25, 4.15, -2.95],
            "color": "penguinWhite",
            "col_idx": 1,
            "uv": [1, 0, 2, 1]
        },
        # Right Wing Shoulder
        {
            "name": "flipper_shoulder_right",
            "from": [2.35, 4.25, -1.25],
            "to": [3.25, 5.85, 1.25],
            "color": "penguinBlack",
            "col_idx": 0,
            "uv": [0, 0, 1, 1]
        },
        # Right Wing Mid Forearm
        {
            "name": "flipper_arm_right",
            "from": [2.20, 3.35, -2.75],
            "to": [3.15, 4.70, -0.95],
            "color": "penguinBlack",
            "col_idx": 0,
            "uv": [0, 0, 1, 1]
        },
        # Right Wing Hand / Flipper Tip holding the mug
        {
            "name": "flipper_hand_right",
            "from": [1.15, 3.40, -3.55],
            "to": [2.35, 4.40, -2.25],
            "color": "penguinBlack",
            "col_idx": 0,
            "uv": [0, 0, 1, 1]
        },
        # Right Flipper White Inner Cuff
        {
            "name": "flipper_cuff_right",
            "from": [1.25, 3.50, -3.65],
            "to": [2.10, 4.15, -2.95],
            "color": "penguinWhite",
            "col_idx": 1,
            "uv": [1, 0, 2, 1]
        },

        # =========================================================================
        # 5. FESTIVE MUG WITH STEAMING HOT COCOA & MARSHMALLOWS
        # =========================================================================
        # Ceramic Holiday Mug Body (Festive Emerald Teal)
        {
            "name": "mug_base",
            "from": [-1.20, 2.75, -4.00],
            "to": [1.20, 4.80, -1.85],
            "color": "mugTeal",
            "col_idx": 6,
            "uv": [6, 0, 7, 1]
        },
        # Mug Upper Rim
        {
            "name": "mug_rim",
            "from": [-1.30, 4.70, -4.10],
            "to": [1.30, 5.20, -1.75],
            "color": "mugRim",
            "col_idx": 7,
            "uv": [7, 0, 8, 1]
        },
        # Handle Top Attachment
        {
            "name": "mug_handle_top",
            "from": [1.10, 4.20, -3.25],
            "to": [2.05, 4.65, -2.65],
            "color": "mugTeal",
            "col_idx": 6,
            "uv": [6, 0, 7, 1]
        },
        # Handle Vertical Bar
        {
            "name": "mug_handle_vert",
            "from": [1.70, 3.30, -3.30],
            "to": [2.15, 4.55, -2.55],
            "color": "mugTeal",
            "col_idx": 6,
            "uv": [6, 0, 7, 1]
        },
        # Handle Bottom Attachment
        {
            "name": "mug_handle_bottom",
            "from": [1.10, 3.10, -3.25],
            "to": [2.05, 3.55, -2.65],
            "color": "mugTeal",
            "col_idx": 6,
            "uv": [6, 0, 7, 1]
        },
        # Rich Hot Cocoa Liquid Surface
        {
            "name": "cocoa_surface",
            "from": [-1.10, 4.85, -3.85],
            "to": [1.10, 5.10, -2.05],
            "color": "cocoaBrown",
            "col_idx": 8,
            "uv": [8, 0, 9, 1]
        },
        # Marshmallow Cube #1 (Fluffy white)
        {
            "name": "marshmallow_1",
            "from": [-0.85, 5.05, -3.50],
            "to": [-0.15, 5.60, -2.85],
            "color": "marshmallowWhite",
            "col_idx": 9,
            "uv": [9, 0, 10, 1]
        },
        # Marshmallow Cube #2 (Tilted warm vanilla cream)
        {
            "name": "marshmallow_2",
            "from": [0.15, 5.05, -3.40],
            "to": [0.80, 5.55, -2.70],
            "color": "marshmallowCream",
            "col_idx": 10,
            "uv": [10, 0, 11, 1]
        },
        # Marshmallow Cube #3 (Cute mini marshmallow near rear rim)
        {
            "name": "marshmallow_3",
            "from": [-0.40, 5.05, -2.65],
            "to": [0.25, 5.45, -2.15],
            "color": "marshmallowWhite",
            "col_idx": 9,
            "uv": [9, 0, 10, 1]
        },
        # Steam Puff #1 (Low curl rising forward from cocoa)
        {
            "name": "steam_puff_low",
            "from": [-0.45, 5.65, -3.75],
            "to": [0.35, 6.25, -3.15],
            "color": "steamWhite",
            "col_idx": 11,
            "uv": [11, 0, 12, 1]
        },
        # Steam Puff #2 (Mid swirl curling forward-left)
        {
            "name": "steam_puff_mid",
            "from": [-0.75, 6.20, -3.85],
            "to": [-0.10, 6.85, -3.20],
            "color": "steamWhite",
            "col_idx": 11,
            "uv": [11, 0, 12, 1]
        },
        # Steam Puff #3 (High dainty wisp over front of mug)
        {
            "name": "steam_puff_high",
            "from": [-0.35, 6.80, -3.75],
            "to": [0.25, 7.45, -3.15],
            "color": "steamWhite",
            "col_idx": 11,
            "uv": [11, 0, 12, 1]
        },

        # =========================================================================
        # 6. FESTIVE RED SCARF WITH TASSELS & STRIPES
        # =========================================================================
        # Front Scarf Wrap
        {
            "name": "scarf_front",
            "from": [-2.50, 6.15, -2.95],
            "to": [2.50, 7.35, -1.85],
            "color": "scarfRed",
            "col_idx": 4,
            "uv": [4, 0, 5, 1]
        },
        # Back Scarf Wrap
        {
            "name": "scarf_back",
            "from": [-2.50, 6.25, 1.75],
            "to": [2.50, 7.40, 2.75],
            "color": "scarfRed",
            "col_idx": 4,
            "uv": [4, 0, 5, 1]
        },
        # Left Scarf Wrap
        {
            "name": "scarf_left",
            "from": [-2.95, 6.05, -2.25],
            "to": [-2.10, 7.55, 2.15],
            "color": "scarfRed",
            "col_idx": 4,
            "uv": [4, 0, 5, 1]
        },
        # Right Scarf Wrap
        {
            "name": "scarf_right",
            "from": [2.10, 6.05, -2.25],
            "to": [2.95, 7.55, 2.15],
            "color": "scarfRed",
            "col_idx": 4,
            "uv": [4, 0, 5, 1]
        },
        # Cozy Scarf Knot (Relocated to left side of neck/flank)
        {
            "name": "scarf_knot",
            "from": [-3.45, 5.75, -0.65],
            "to": [-2.30, 6.85, 0.45],
            "color": "scarfDarkRed",
            "col_idx": 12,
            "uv": [12, 0, 13, 1]
        },
        # Scarf Drape Tail hanging down along the left side/flank
        {
            "name": "scarf_tail_drape",
            "from": [-3.55, 4.00, -0.45],
            "to": [-2.65, 5.95, 0.35],
            "color": "scarfRed",
            "col_idx": 4,
            "uv": [4, 0, 5, 1]
        },
        # Festive Snowflake White Stripe on Tail
        {
            "name": "scarf_stripe_accent",
            "from": [-3.60, 4.45, -0.50],
            "to": [-2.60, 4.80, 0.40],
            "color": "scarfWhiteStripe",
            "col_idx": 13,
            "uv": [13, 0, 14, 1]
        },
        # Gold/Cream Fringed Tassels at bottom of scarf
        {
            "name": "scarf_tassels",
            "from": [-3.50, 3.45, -0.40],
            "to": [-2.70, 4.10, 0.30],
            "color": "scarfGoldTassel",
            "col_idx": 5,
            "uv": [5, 0, 6, 1]
        },

        # =========================================================================
        # 7. HEAD & ADORABLE BABY PENGUIN FACE
        # =========================================================================
        # Main Head Core (Black plumage hood)
        {
            "name": "head_core",
            "from": [-2.45, 7.20, -2.05],
            "to": [2.45, 10.40, 2.05],
            "color": "penguinBlack",
            "col_idx": 0,
            "uv": [0, 0, 1, 1]
        },
        # Crown Dome (Rounded top of head)
        {
            "name": "head_crown_top",
            "from": [-1.90, 10.30, -1.65],
            "to": [1.90, 11.00, 1.65],
            "color": "penguinBlack",
            "col_idx": 0,
            "uv": [0, 0, 1, 1]
        },
        # Back of Head Curvature
        {
            "name": "head_back_arch",
            "from": [-2.15, 7.45, 1.95],
            "to": [2.15, 10.15, 2.45],
            "color": "penguinBlack",
            "col_idx": 0,
            "uv": [0, 0, 1, 1]
        },
        # Snowy White Face Mask & Cheeks
        {
            "name": "face_mask_white",
            "from": [-2.05, 7.30, -2.55],
            "to": [2.05, 9.90, -1.90],
            "color": "penguinWhite",
            "col_idx": 1,
            "uv": [1, 0, 2, 1]
        },
        # White Forehead Peak / Notch
        {
            "name": "face_forehead_notch",
            "from": [-1.10, 9.80, -2.45],
            "to": [1.10, 10.35, -1.95],
            "color": "penguinWhite",
            "col_idx": 1,
            "uv": [1, 0, 2, 1]
        },
        # Beak Base (Warm pumpkin orange)
        {
            "name": "beak_base",
            "from": [-0.75, 8.05, -3.35],
            "to": [0.75, 8.85, -2.35],
            "color": "penguinOrange",
            "col_idx": 2,
            "uv": [2, 0, 3, 1]
        },
        # Beak Perky Tip
        {
            "name": "beak_tip",
            "from": [-0.55, 7.95, -3.85],
            "to": [0.55, 8.55, -3.20],
            "color": "penguinOrangeLight",
            "col_idx": 3,
            "uv": [3, 0, 4, 1]
        },
        # Beak Nostril Culmen Ridge
        {
            "name": "beak_culmen",
            "from": [-0.35, 8.75, -2.95],
            "to": [0.35, 9.05, -2.40],
            "color": "penguinOrange",
            "col_idx": 2,
            "uv": [2, 0, 3, 1]
        },
        # Left Eye (Glossy black iris)
        {
            "name": "eye_iris_left",
            "from": [-1.90, 8.65, -2.70],
            "to": [-1.15, 9.60, -2.30],
            "color": "eyeBlack",
            "col_idx": 14,
            "uv": [14, 0, 15, 1]
        },
        # Left Eye Specular Sparkle (Cute gleam!)
        {
            "name": "eye_sparkle_left",
            "from": [-1.80, 9.15, -2.80],
            "to": [-1.30, 9.50, -2.40],
            "color": "white",
            "col_idx": 15,
            "uv": [15, 0, 16, 1]
        },
        # Right Eye (Glossy black iris)
        {
            "name": "eye_iris_right",
            "from": [1.15, 8.65, -2.70],
            "to": [1.90, 9.60, -2.30],
            "color": "eyeBlack",
            "col_idx": 14,
            "uv": [14, 0, 15, 1]
        },
        # Right Eye Specular Sparkle (Cute gleam!)
        {
            "name": "eye_sparkle_right",
            "from": [1.30, 9.15, -2.80],
            "to": [1.80, 9.50, -2.40],
            "color": "white",
            "col_idx": 15,
            "uv": [15, 0, 16, 1]
        },
        # Left Cheek Rosy Blush (Soft anime/chibi pink)
        {
            "name": "blush_cheek_left",
            "from": [-2.00, 7.75, -2.60],
            "to": [-1.35, 8.35, -2.25],
            "color": "blushPink",
            "col_idx": 16,
            "uv": [16, 0, 17, 1]
        },
        # Right Cheek Rosy Blush (Soft anime/chibi pink)
        {
            "name": "blush_cheek_right",
            "from": [1.35, 7.75, -2.60],
            "to": [2.00, 8.35, -2.25],
            "color": "blushPink",
            "col_idx": 16,
            "uv": [16, 0, 17, 1]
        }
    ]

if __name__ == '__main__':
    cubes = get_penguin_cubes()
    print(f"Total cubes: {len(cubes)}")
    issues = blockbench_check(cubes)
    print(f"Coplanar overlaps: {len(issues)}")
    for iss in issues:
        print(f"  ISSUE: {iss['c1']} vs {iss['c2']} on {iss['axis']} = {iss['plane']} ({iss['col1']} vs {iss['col2']})")
    if len(issues) == 0:
        print("SUCCESS: EXACTLY ZERO COPLANAR OVERLAPS! (ZERO Z-FIGHTING CERTIFIED)")
