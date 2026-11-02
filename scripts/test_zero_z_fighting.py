import json

# Blockbench coordinates with ZERO coplanar overlaps (staggered & penetrating)
ZERO_ZFIGHT_CUBES = [
    # 4 Paws & Legs
    # Left Front
    {"name": "front_paw_pad_left", "from": [-3.8, 0.0, -4.0], "to": [-1.8, 0.7, -2.0], "color": "nosePink", "uv": [2, 0, 3, 1]},
    {"name": "front_paw_sock_left", "from": [-3.8, 0.6, -4.0], "to": [-1.8, 3.1, -2.0], "color": "white", "uv": [1, 0, 2, 1]},
    {"name": "front_toe_beans_left", "from": [-3.4, 0.1, -4.4], "to": [-2.2, 0.5, -3.8], "color": "nosePink", "uv": [2, 0, 3, 1]},

    # Right Front
    {"name": "front_paw_pad_right", "from": [1.8, 0.0, -4.0], "to": [3.8, 0.7, -2.0], "color": "nosePink", "uv": [2, 0, 3, 1]},
    {"name": "front_paw_sock_right", "from": [1.8, 0.6, -4.0], "to": [3.8, 3.1, -2.0], "color": "white", "uv": [1, 0, 2, 1]},
    {"name": "front_toe_beans_right", "from": [2.2, 0.1, -4.4], "to": [3.4, 0.5, -3.8], "color": "nosePink", "uv": [2, 0, 3, 1]},

    # Left Rear
    {"name": "rear_paw_pad_left", "from": [-3.8, 0.0, 2.0], "to": [-1.8, 0.7, 4.0], "color": "nosePink", "uv": [2, 0, 3, 1]},
    {"name": "rear_paw_sock_left", "from": [-3.8, 0.6, 2.0], "to": [-1.8, 3.1, 4.0], "color": "white", "uv": [1, 0, 2, 1]},
    {"name": "rear_thigh_fluff_left", "from": [-3.9, 2.9, 1.8], "to": [-1.7, 4.8, 4.2], "color": "corgiOrange", "uv": [0, 0, 1, 1]},

    # Right Rear
    {"name": "rear_paw_pad_right", "from": [1.8, 0.0, 2.0], "to": [3.8, 0.7, 4.0], "color": "nosePink", "uv": [2, 0, 3, 1]},
    {"name": "rear_paw_sock_right", "from": [1.8, 0.6, 2.0], "to": [3.8, 3.1, 4.0], "color": "white", "uv": [1, 0, 2, 1]},
    {"name": "rear_thigh_fluff_right", "from": [1.7, 2.9, 1.8], "to": [3.9, 4.8, 4.2], "color": "corgiOrange", "uv": [0, 0, 1, 1]},

    # Body Loaf & Belly
    {"name": "body_loaf_core", "from": [-3.4, 2.6, -3.8], "to": [3.4, 7.0, 4.0], "color": "corgiOrange", "uv": [0, 0, 1, 1]},
    {"name": "body_belly_white", "from": [-2.6, 2.3, -3.4], "to": [2.6, 3.3, 3.6], "color": "white", "uv": [1, 0, 2, 1]},

    # Chest Bib & Tuft
    {"name": "chest_bib_main", "from": [-3.2, 3.0, -4.5], "to": [3.2, 6.8, -2.2], "color": "white", "uv": [1, 0, 2, 1]},
    {"name": "chest_bib_tuft", "from": [-1.8, 4.0, -5.0], "to": [1.8, 6.2, -3.6], "color": "white", "uv": [1, 0, 2, 1]},

    # Rear Bum, Peach Butt & Tail
    {"name": "rear_bum_core", "from": [-3.3, 3.1, 3.5], "to": [3.3, 6.7, 4.8], "color": "corgiOrange", "uv": [0, 0, 1, 1]},
    {"name": "butt_peach_heart", "from": [-2.7, 3.3, 4.4], "to": [2.7, 6.3, 5.3], "color": "white", "uv": [1, 0, 2, 1]},
    {"name": "butt_tail_bob", "from": [-1.1, 5.4, 4.2], "to": [1.1, 7.6, 5.8], "color": "corgiOrange", "uv": [0, 0, 1, 1]},
    {"name": "butt_tail_tip", "from": [-0.7, 6.0, 5.5], "to": [0.7, 7.2, 6.4], "color": "white", "uv": [1, 0, 2, 1]},

    # Collar & Tag
    {"name": "collar_ring", "from": [-3.6, 6.6, -5.2], "to": [3.6, 7.4, -0.2], "color": "pizzaRed", "uv": [4, 0, 5, 1]},
    {"name": "collar_tag_gold", "from": [-0.6, 5.6, -5.4], "to": [0.6, 6.7, -4.6], "color": "pizzaCheese", "uv": [5, 0, 6, 1]},

    # Head, Cheeks & Blaze
    {"name": "head_core", "from": [-3.4, 7.0, -5.8], "to": [3.4, 11.8, -0.4], "color": "corgiOrange", "uv": [0, 0, 1, 1]},
    {"name": "cheek_fluff_left", "from": [-4.0, 7.4, -4.6], "to": [-3.1, 9.8, -2.0], "color": "white", "uv": [1, 0, 2, 1]},
    {"name": "cheek_fluff_right", "from": [3.1, 7.4, -4.6], "to": [4.0, 9.8, -2.0], "color": "white", "uv": [1, 0, 2, 1]},

    {"name": "blaze_forehead", "from": [-0.8, 7.2, -6.1], "to": [0.8, 12.1, -3.9], "color": "white", "uv": [1, 0, 2, 1]},
    {"name": "blaze_crown", "from": [-0.7, 11.7, -4.4], "to": [0.7, 12.3, -2.4], "color": "white", "uv": [1, 0, 2, 1]},

    # Muzzle, Chin, Nose & Tongue
    {"name": "snout_muzzle", "from": [-1.8, 7.2, -7.6], "to": [1.8, 9.4, -5.0], "color": "white", "uv": [1, 0, 2, 1]},
    {"name": "chin_under_mouth", "from": [-1.3, 6.5, -6.8], "to": [1.3, 7.3, -5.2], "color": "white", "uv": [1, 0, 2, 1]},
    {"name": "nose_button", "from": [-0.7, 8.5, -8.1], "to": [0.7, 9.5, -7.2], "color": "darkCharcoal", "uv": [3, 0, 4, 1]},
    {"name": "tongue_playful", "from": [0.2, 7.2, -8.0], "to": [0.8, 7.8, -6.6], "color": "nosePink", "uv": [2, 0, 3, 1]},

    # Eyes & Eyebrows
    {"name": "eye_left_iris", "from": [-2.5, 9.4, -6.2], "to": [-1.4, 10.6, -5.4], "color": "darkCharcoal", "uv": [3, 0, 4, 1]},
    {"name": "eye_left_sparkle", "from": [-2.3, 10.1, -6.4], "to": [-1.8, 10.5, -5.9], "color": "white", "uv": [1, 0, 2, 1]},
    {"name": "eyebrow_left", "from": [-2.4, 10.8, -6.0], "to": [-1.5, 11.3, -5.5], "color": "white", "uv": [1, 0, 2, 1]},

    {"name": "eye_right_iris", "from": [1.4, 9.4, -6.2], "to": [2.5, 10.6, -5.4], "color": "darkCharcoal", "uv": [3, 0, 4, 1]},
    {"name": "eye_right_sparkle", "from": [1.8, 10.1, -6.4], "to": [2.3, 10.5, -5.9], "color": "white", "uv": [1, 0, 2, 1]},
    {"name": "eyebrow_right", "from": [1.5, 10.8, -6.0], "to": [2.4, 11.3, -5.5], "color": "white", "uv": [1, 0, 2, 1]},

    # Ears (Base, Tip, Pink Inner)
    {"name": "ear_base_left", "from": [-3.5, 11.5, -3.8], "to": [-1.7, 13.8, -2.2], "color": "corgiOrange", "uv": [0, 0, 1, 1]},
    {"name": "ear_tip_left", "from": [-3.2, 13.5, -3.6], "to": [-2.0, 15.5, -2.4], "color": "corgiOrange", "uv": [0, 0, 1, 1]},
    {"name": "ear_pink_left", "from": [-3.0, 12.0, -4.0], "to": [-2.2, 14.2, -3.3], "color": "nosePink", "uv": [2, 0, 3, 1]},

    {"name": "ear_base_right", "from": [1.7, 11.5, -3.8], "to": [3.5, 13.8, -2.2], "color": "corgiOrange", "uv": [0, 0, 1, 1]},
    {"name": "ear_tip_right", "from": [2.0, 13.5, -3.6], "to": [3.2, 15.5, -2.4], "color": "corgiOrange", "uv": [0, 0, 1, 1]},
    {"name": "ear_pink_right", "from": [2.2, 12.0, -4.0], "to": [3.0, 14.2, -3.3], "color": "nosePink", "uv": [2, 0, 3, 1]},
]

from audit_z_fighting import check_coplanar
issues = check_coplanar(ZERO_ZFIGHT_CUBES)
print(f"Zero Z-Fight Audit: Found {len(issues)} coplanar overlaps.")
for iss in issues:
    print(f"  {iss['c1']} vs {iss['c2']} on {iss['axis']} = {iss['plane']} (col: {iss['col1']} vs {iss['col2']})")
