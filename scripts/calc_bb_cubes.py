import json

REVISED_VOXELS = [
    # name, w, h, d, col, cx, cy, cz
    ("front_paw_pad_left", 0.10, 0.03, 0.10, 'nosePink', -0.14, 0.015, 0.16),
    ("front_paw_sock_left", 0.10, 0.12, 0.10, 'white', -0.14, 0.09, 0.16),
    ("front_paw_pad_right", 0.10, 0.03, 0.10, 'nosePink', 0.14, 0.015, 0.16),
    ("front_paw_sock_right", 0.10, 0.12, 0.10, 'white', 0.14, 0.09, 0.16),
    ("rear_paw_pad_left", 0.10, 0.03, 0.10, 'nosePink', -0.14, 0.015, -0.16),
    ("rear_paw_sock_left", 0.10, 0.12, 0.10, 'white', -0.14, 0.09, -0.16),
    ("rear_paw_pad_right", 0.10, 0.03, 0.10, 'nosePink', 0.14, 0.015, -0.16),
    ("rear_paw_sock_right", 0.10, 0.12, 0.10, 'white', 0.14, 0.09, -0.16),

    ("rear_thigh_fluff_left", 0.11, 0.08, 0.11, 'corgiOrange', -0.14, 0.19, -0.16),
    ("rear_thigh_fluff_right", 0.11, 0.08, 0.11, 'corgiOrange', 0.14, 0.19, -0.16),

    ("body_loaf_core", 0.38, 0.22, 0.44, 'corgiOrange', 0, 0.25, -0.01),
    ("body_belly_white", 0.28, 0.04, 0.38, 'white', 0, 0.14, -0.01),
    ("chest_bib_main", 0.34, 0.20, 0.12, 'white', 0, 0.26, 0.17),
    ("chest_bib_tuft", 0.20, 0.12, 0.05, 'white', 0, 0.27, 0.235),

    ("rear_bum_core", 0.36, 0.20, 0.08, 'corgiOrange', 0, 0.26, -0.23),
    ("butt_peach_heart", 0.24, 0.16, 0.06, 'white', 0, 0.24, -0.27),
    ("butt_tail_bob", 0.12, 0.12, 0.10, 'corgiOrange', 0, 0.34, -0.26),
    ("butt_tail_tip", 0.08, 0.08, 0.06, 'white', 0, 0.36, -0.31),

    ("collar_ring", 0.34, 0.05, 0.24, 'pizzaRed', 0, 0.36, 0.14),
    ("collar_tag_gold", 0.06, 0.06, 0.04, 'pizzaCheese', 0, 0.32, 0.25),

    ("head_core", 0.36, 0.26, 0.30, 'corgiOrange', 0, 0.48, 0.16),
    ("cheek_fluff_left", 0.05, 0.13, 0.14, 'white', -0.185, 0.44, 0.17),
    ("cheek_fluff_right", 0.05, 0.13, 0.14, 'white', 0.185, 0.44, 0.17),

    ("blaze_forehead", 0.09, 0.24, 0.13, 'white', 0, 0.49, 0.26),
    ("snout_muzzle", 0.20, 0.12, 0.14, 'white', 0, 0.42, 0.33),
    ("chin_under_mouth", 0.14, 0.04, 0.08, 'white', 0, 0.36, 0.31),
    ("nose_button", 0.08, 0.06, 0.06, 'darkCharcoal', 0, 0.46, 0.40),

    ("tongue_playful", 0.06, 0.035, 0.08, 'nosePink', 0.03, 0.385, 0.39),

    ("eye_left_iris", 0.06, 0.07, 0.04, 'darkCharcoal', -0.11, 0.51, 0.29),
    ("eye_left_sparkle", 0.025, 0.025, 0.02, 'white', -0.11, 0.53, 0.31),
    ("eye_right_iris", 0.06, 0.07, 0.04, 'darkCharcoal', 0.11, 0.51, 0.29),
    ("eye_right_sparkle", 0.025, 0.025, 0.02, 'white', 0.11, 0.53, 0.31),

    ("ear_base_left", 0.10, 0.14, 0.08, 'corgiOrange', -0.14, 0.65, 0.15),
    ("ear_tip_left", 0.06, 0.10, 0.06, 'corgiOrange', -0.14, 0.75, 0.15),
    ("ear_pink_left", 0.06, 0.12, 0.03, 'nosePink', -0.14, 0.65, 0.176),

    ("ear_base_right", 0.10, 0.14, 0.08, 'corgiOrange', 0.14, 0.65, 0.15),
    ("ear_tip_right", 0.06, 0.10, 0.06, 'corgiOrange', 0.14, 0.75, 0.15),
    ("ear_pink_right", 0.06, 0.12, 0.03, 'nosePink', 0.14, 0.65, 0.176),
]

COLOR_INDICES = {
    'corgiOrange': 0,
    'white': 1,
    'nosePink': 2,
    'darkCharcoal': 3,
    'pizzaRed': 4,
    'pizzaCheese': 5,
}

bb_cubes = []
for name, w, h, d, col, cx, cy, cz in REVISED_VOXELS:
    fx = round((cx - w/2) * 20, 2)
    tx = round((cx + w/2) * 20, 2)
    fy = round((cy - h/2) * 20, 2)
    ty = round((cy + h/2) * 20, 2)
    # Note: Three.js faces +Z, Blockbench faces -Z
    # z_bb = -z_three
    fz = round((-cz - d/2) * 20, 2)
    tz = round((-cz + d/2) * 20, 2)
    
    # Ensure min < max
    from_pt = [min(fx, tx), min(fy, ty), min(fz, tz)]
    to_pt = [max(fx, tx), max(fy, ty), max(fz, tz)]
    
    col_idx = COLOR_INDICES[col]
    bb_cubes.append({
        'name': name,
        'from': from_pt,
        'to': to_pt,
        'color': col,
        'col_idx': col_idx,
    })

print(f"Generated {len(bb_cubes)} Blockbench cubes.")
with open('scripts/bb_cubes_data.json', 'w') as f:
    json.dump(bb_cubes, f, indent=2)
