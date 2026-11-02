import json
from blockbench_coplanar_check import blockbench_check

CUBES = [
    # 4 Paws & Legs
    # Left Front
    {"name": "front_paw_pad_left", "from": [-3.7, 0.0, -3.9], "to": [-1.9, 0.6, -2.1], "color": "nosePink", "uv": [2, 0, 3, 1]},
    {"name": "front_paw_sock_left", "from": [-3.8, 0.4, -4.0], "to": [-1.8, 3.0, -2.0], "color": "white", "uv": [1, 0, 2, 1]},
    {"name": "front_toe_beans_left", "from": [-3.4, 0.1, -4.4], "to": [-2.2, 0.55, -3.8], "color": "nosePink", "uv": [2, 0, 3, 1]},

    # Right Front
    {"name": "front_paw_pad_right", "from": [1.9, 0.0, -3.9], "to": [3.7, 0.6, -2.1], "color": "nosePink", "uv": [2, 0, 3, 1]},
    {"name": "front_paw_sock_right", "from": [1.8, 0.4, -4.0], "to": [3.8, 3.0, -2.0], "color": "white", "uv": [1, 0, 2, 1]},
    {"name": "front_toe_beans_right", "from": [2.2, 0.1, -4.4], "to": [3.4, 0.55, -3.8], "color": "nosePink", "uv": [2, 0, 3, 1]},

    # Left Rear
    {"name": "rear_paw_pad_left", "from": [-3.7, 0.0, 2.1], "to": [-1.9, 0.6, 3.9], "color": "nosePink", "uv": [2, 0, 3, 1]},
    {"name": "rear_paw_sock_left", "from": [-3.8, 0.4, 2.0], "to": [-1.8, 3.0, 4.0], "color": "white", "uv": [1, 0, 2, 1]},
    {"name": "rear_thigh_fluff_left", "from": [-3.9, 2.8, 1.8], "to": [-1.7, 4.7, 4.2], "color": "corgiOrange", "uv": [0, 0, 1, 1]},

    # Right Rear
    {"name": "rear_paw_pad_right", "from": [1.9, 0.0, 2.1], "to": [3.7, 0.6, 3.9], "color": "nosePink", "uv": [2, 0, 3, 1]},
    {"name": "rear_paw_sock_right", "from": [1.8, 0.4, 2.0], "to": [3.8, 3.0, 4.0], "color": "white", "uv": [1, 0, 2, 1]},
    {"name": "rear_thigh_fluff_right", "from": [1.7, 2.8, 1.8], "to": [3.9, 4.7, 4.2], "color": "corgiOrange", "uv": [0, 0, 1, 1]},

    # Body Loaf & Belly
    {"name": "body_loaf_core", "from": [-3.5, 2.5, -3.7], "to": [3.5, 7.0, 3.7], "color": "corgiOrange", "uv": [0, 0, 1, 1]},
    {"name": "body_belly_white", "from": [-2.6, 2.2, -3.3], "to": [2.6, 2.7, 3.3], "color": "white", "uv": [1, 0, 2, 1]},

    # Chest Bib & Tuft
    {"name": "chest_bib_main", "from": [-3.2, 3.1, -4.4], "to": [3.2, 6.7, -2.2], "color": "white", "uv": [1, 0, 2, 1]},
    {"name": "chest_bib_tuft", "from": [-1.8, 4.0, -4.9], "to": [1.8, 6.2, -3.9], "color": "white", "uv": [1, 0, 2, 1]},

    # Rear Bum, Peach Butt & Tail
    {"name": "rear_bum_core", "from": [-3.3, 2.7, 3.4], "to": [3.3, 6.7, 4.7], "color": "corgiOrange", "uv": [0, 0, 1, 1]},
    {"name": "butt_peach_heart", "from": [-2.7, 3.3, 4.3], "to": [2.7, 6.1, 5.2], "color": "white", "uv": [1, 0, 2, 1]},
    {"name": "butt_tail_bob", "from": [-1.1, 5.3, 4.1], "to": [1.1, 7.8, 5.7], "color": "corgiOrange", "uv": [0, 0, 1, 1]},
    {"name": "butt_tail_tip", "from": [-0.7, 5.9, 5.4], "to": [0.7, 7.3, 6.3], "color": "white", "uv": [1, 0, 2, 1]},

    # Collar & Tag
    {"name": "collar_ring", "from": [-3.6, 6.5, -5.1], "to": [3.6, 7.4, -0.2], "color": "pizzaRed", "uv": [4, 0, 5, 1]},
    {"name": "collar_tag_gold", "from": [-0.6, 5.5, -5.4], "to": [0.6, 6.7, -4.7], "color": "pizzaCheese", "uv": [5, 0, 6, 1]},

    # Head, Cheeks & Blaze
    {"name": "head_core", "from": [-3.4, 7.1, -5.8], "to": [3.4, 11.7, -0.4], "color": "corgiOrange", "uv": [0, 0, 1, 1]},
    {"name": "cheek_fluff_left", "from": [-4.0, 7.5, -4.6], "to": [-3.1, 9.7, -2.0], "color": "white", "uv": [1, 0, 2, 1]},
    {"name": "cheek_fluff_right", "from": [3.1, 7.5, -4.6], "to": [4.0, 9.7, -2.0], "color": "white", "uv": [1, 0, 2, 1]},

    {"name": "blaze_forehead", "from": [-0.8, 6.9, -6.1], "to": [0.8, 12.1, -3.9], "color": "white", "uv": [1, 0, 2, 1]},
    {"name": "blaze_crown", "from": [-0.7, 11.5, -4.4], "to": [0.7, 12.3, -2.4], "color": "white", "uv": [1, 0, 2, 1]},

    # Muzzle, Chin, Nose & Tongue
    {"name": "snout_muzzle", "from": [-1.8, 7.3, -7.5], "to": [1.8, 9.3, -4.9], "color": "white", "uv": [1, 0, 2, 1]},
    {"name": "chin_under_mouth", "from": [-1.3, 6.8, -6.7], "to": [1.3, 7.2, -4.9], "color": "white", "uv": [1, 0, 2, 1]},
    {"name": "nose_button", "from": [-0.7, 8.4, -8.1], "to": [0.7, 9.5, -7.1], "color": "darkCharcoal", "uv": [3, 0, 4, 1]},
    {"name": "tongue_playful", "from": [0.2, 7.1, -8.0], "to": [0.8, 7.7, -6.5], "color": "nosePink", "uv": [2, 0, 3, 1]},

    # Eyes & Eyebrows
    {"name": "eye_left_iris", "from": [-2.5, 9.5, -6.2], "to": [-1.4, 10.5, -5.4], "color": "darkCharcoal", "uv": [3, 0, 4, 1]},
    {"name": "eye_left_sparkle", "from": [-2.3, 10.1, -6.4], "to": [-1.8, 10.4, -5.9], "color": "white", "uv": [1, 0, 2, 1]},
    {"name": "eyebrow_left", "from": [-2.4, 10.8, -6.0], "to": [-1.5, 11.2, -5.5], "color": "white", "uv": [1, 0, 2, 1]},

    {"name": "eye_right_iris", "from": [1.4, 9.5, -6.2], "to": [2.5, 10.5, -5.4], "color": "darkCharcoal", "uv": [3, 0, 4, 1]},
    {"name": "eye_right_sparkle", "from": [1.8, 10.1, -6.4], "to": [2.3, 10.4, -5.9], "color": "white", "uv": [1, 0, 2, 1]},
    {"name": "eyebrow_right", "from": [1.5, 10.8, -6.0], "to": [2.4, 11.2, -5.5], "color": "white", "uv": [1, 0, 2, 1]},

    # Ears (Base, Tip, Pink Inner)
    {"name": "ear_base_left", "from": [-3.5, 11.4, -3.8], "to": [-1.7, 13.8, -2.2], "color": "corgiOrange", "uv": [0, 0, 1, 1]},
    {"name": "ear_tip_left", "from": [-3.3, 13.5, -3.6], "to": [-1.9, 15.5, -2.4], "color": "corgiOrange", "uv": [0, 0, 1, 1]},
    {"name": "ear_pink_left", "from": [-3.0, 11.9, -4.0], "to": [-2.2, 14.1, -3.3], "color": "nosePink", "uv": [2, 0, 3, 1]},

    {"name": "ear_base_right", "from": [1.7, 11.4, -3.8], "to": [3.5, 13.8, -2.2], "color": "corgiOrange", "uv": [0, 0, 1, 1]},
    {"name": "ear_tip_right", "from": [1.9, 13.5, -3.6], "to": [3.3, 15.5, -2.4], "color": "corgiOrange", "uv": [0, 0, 1, 1]},
    {"name": "ear_pink_right", "from": [2.2, 11.9, -4.0], "to": [3.0, 14.1, -3.3], "color": "nosePink", "uv": [2, 0, 3, 1]},
]

issues = blockbench_check(CUBES)
print(f"Result: {len(issues)} coplanar overlaps.")
for iss in issues:
    print(f"  {iss['c1']} vs {iss['c2']} on {iss['axis']} = {iss['plane']} ({iss['col1']} vs {iss['col2']})")

if len(issues) == 0:
    print("SUCCESS: EXACTLY ZERO COPLANAR OVERLAPS!")
    with open('scripts/bb_cubes_zero_zfight.json', 'w') as f:
        json.dump(CUBES, f, indent=2)
