import json
import sys
sys.path.insert(0, 'scripts')
from test_coplanar import check_coplanar

cubes = [
    # --- A. GROUNDED ZEN LIMBS & PAWS (12 cubes) ---
    # 1. Front left paw
    {"name": "paw_front_left", "from": [-3.65, 0.0, -3.65], "to": [-2.05, 1.45, -1.85], "color": "capybaraPaws", "col_idx": 3},
    # 2. Front left digits
    {"name": "paw_digits_front_left", "from": [-3.45, 0.05, -4.25], "to": [-2.25, 0.75, -3.55], "color": "capybaraPaws", "col_idx": 3},
    # 3. Front left leg pillar
    {"name": "leg_front_left", "from": [-3.45, 1.25, -3.35], "to": [-2.25, 3.25, -2.05], "color": "capybaraCaramel", "col_idx": 0},

    # 4. Front right paw
    {"name": "paw_front_right", "from": [2.05, 0.0, -3.65], "to": [3.65, 1.45, -1.85], "color": "capybaraPaws", "col_idx": 3},
    # 5. Front right digits
    {"name": "paw_digits_front_right", "from": [2.25, 0.05, -4.25], "to": [3.45, 0.75, -3.55], "color": "capybaraPaws", "col_idx": 3},
    # 6. Front right leg pillar
    {"name": "leg_front_right", "from": [2.25, 1.25, -3.35], "to": [3.45, 3.25, -2.05], "color": "capybaraCaramel", "col_idx": 0},

    # 7. Rear left haunch (sturdy thigh)
    {"name": "thigh_rear_left", "from": [-4.15, 0.95, 1.25], "to": [-2.45, 4.25, 3.95], "color": "capybaraCaramel", "col_idx": 0},
    # 8. Rear left paw
    {"name": "paw_rear_left", "from": [-3.85, 0.0, 1.05], "to": [-2.25, 1.35, 3.55], "color": "capybaraPaws", "col_idx": 3},
    # 9. Rear left digits
    {"name": "paw_digits_rear_left", "from": [-3.65, 0.05, 0.35], "to": [-2.45, 0.75, 1.15], "color": "capybaraPaws", "col_idx": 3},

    # 10. Rear right haunch
    {"name": "thigh_rear_right", "from": [2.45, 0.95, 1.25], "to": [4.15, 4.25, 3.95], "color": "capybaraCaramel", "col_idx": 0},
    # 11. Rear right paw
    {"name": "paw_rear_right", "from": [2.25, 0.0, 1.05], "to": [3.85, 1.35, 3.55], "color": "capybaraPaws", "col_idx": 3},
    # 12. Rear right digits
    {"name": "paw_digits_rear_right", "from": [2.45, 0.05, 0.35], "to": [3.65, 0.75, 1.15], "color": "capybaraPaws", "col_idx": 3},

    # --- B. TORSO, FLANKS & UNDERBELLY (7 cubes) ---
    # 13. Main caramel body core
    {"name": "body_core", "from": [-3.75, 2.45, -2.95], "to": [3.75, 7.15, 3.75], "color": "capybaraCaramel", "col_idx": 0},
    # 14. Plump warm underbelly
    {"name": "body_underbelly", "from": [-2.85, 1.85, -2.55], "to": [2.85, 3.15, 3.35], "color": "capybaraMuzzle", "col_idx": 2},
    # 15. Left flank fluff
    {"name": "flank_left", "from": [-4.35, 2.85, -1.85], "to": [-3.55, 6.25, 2.85], "color": "capybaraBrown", "col_idx": 1},
    # 16. Right flank fluff
    {"name": "flank_right", "from": [3.55, 2.85, -1.85], "to": [4.35, 6.25, 2.85], "color": "capybaraBrown", "col_idx": 1},
    # 17. Rear rounded rump
    {"name": "rump_rear", "from": [-3.15, 2.95, 3.55], "to": [3.15, 6.65, 4.65], "color": "capybaraCaramel", "col_idx": 0},
    # 18. Upper rump slope
    {"name": "rump_slope_top", "from": [-2.65, 6.45, 1.85], "to": [2.65, 7.35, 4.15], "color": "capybaraBrown", "col_idx": 1},
    # 19. Cute tail stub
    {"name": "tail_stub", "from": [-0.65, 3.25, 4.55], "to": [0.65, 4.15, 5.25], "color": "capybaraMuzzle", "col_idx": 2},

    # --- C. NECK, CHEST & STOIC FLAT HEAD (15 cubes) ---
    # 20. Neck base
    {"name": "neck_base", "from": [-3.25, 3.85, -4.35], "to": [3.25, 7.45, -2.65], "color": "capybaraCaramel", "col_idx": 0},
    # 21. Neck throat
    {"name": "neck_bib_throat", "from": [-2.35, 3.15, -4.65], "to": [2.35, 5.65, -3.15], "color": "capybaraMuzzle", "col_idx": 2},
    # 22. Chest fluff
    {"name": "chest_zen_fluff", "from": [-2.15, 5.25, -3.85], "to": [2.15, 6.75, -2.75], "color": "capybaraBrown", "col_idx": 1},
    # 23. Head core (monolithic, stoic)
    {"name": "head_core", "from": [-3.05, 6.85, -5.85], "to": [3.05, 11.25, -1.65], "color": "capybaraCaramel", "col_idx": 0},
    # 24. Head crown flat (table for mandarin!)
    {"name": "head_crown_flat", "from": [-2.75, 11.05, -5.45], "to": [2.75, 11.85, -2.15], "color": "capybaraCaramel", "col_idx": 0},
    # 25. Heavy square snout
    {"name": "snout_muzzle", "from": [-2.45, 6.45, -7.45], "to": [2.45, 10.05, -5.65], "color": "capybaraMuzzle", "col_idx": 2},
    # 26. Chin under mouth
    {"name": "snout_chin_under", "from": [-1.95, 5.75, -6.85], "to": [1.95, 7.15, -4.95], "color": "capybaraMuzzle", "col_idx": 2},
    # 27. Dark nose pad
    {"name": "nose_pad_dark", "from": [-1.05, 8.55, -7.75], "to": [1.05, 9.85, -7.25], "color": "capybaraDark", "col_idx": 4},
    # 28. Left nostril slit
    {"name": "nostril_slit_left", "from": [-1.25, 8.85, -7.85], "to": [-0.65, 9.45, -7.55], "color": "maskBlack", "col_idx": 5},
    # 29. Right nostril slit
    {"name": "nostril_slit_right", "from": [0.65, 8.85, -7.85], "to": [1.25, 9.45, -7.55], "color": "maskBlack", "col_idx": 5},
    # 30. Nostril vertical philtrum bridge
    {"name": "nostril_bridge", "from": [-0.35, 7.85, -7.65], "to": [0.35, 8.75, -7.15], "color": "capybaraDark", "col_idx": 4},
    # 31. Left cheek fluff
    {"name": "cheek_fluff_left", "from": [-3.65, 7.25, -4.85], "to": [-2.85, 9.85, -2.55], "color": "capybaraBrown", "col_idx": 1},
    # 32. Right cheek fluff
    {"name": "cheek_fluff_right", "from": [2.85, 7.25, -4.85], "to": [3.65, 9.85, -2.55], "color": "capybaraBrown", "col_idx": 1},
    # 33. Left eye tranquil slit
    {"name": "eye_closed_left", "from": [-3.15, 9.25, -4.75], "to": [-2.95, 9.75, -3.35], "color": "maskBlack", "col_idx": 5},
    # 34. Right eye tranquil slit
    {"name": "eye_closed_right", "from": [2.95, 9.25, -4.75], "to": [3.15, 9.75, -3.35], "color": "maskBlack", "col_idx": 5},

    # --- D. PERKY ROUNDED EARS (6 cubes) ---
    # 35. Left ear base
    {"name": "ear_base_left", "from": [-3.35, 11.15, -2.85], "to": [-2.15, 12.65, -1.45], "color": "capybaraBrown", "col_idx": 1},
    # 36. Left ear rim
    {"name": "ear_rim_left", "from": [-3.15, 12.45, -2.65], "to": [-2.35, 13.35, -1.65], "color": "capybaraCaramel", "col_idx": 0},
    # 37. Left ear inner
    {"name": "ear_inner_left", "from": [-3.05, 11.55, -2.95], "to": [-2.45, 12.55, -2.75], "color": "capybaraMuzzle", "col_idx": 2},
    # 38. Right ear base
    {"name": "ear_base_right", "from": [2.15, 11.15, -2.85], "to": [3.35, 12.65, -1.45], "color": "capybaraBrown", "col_idx": 1},
    # 39. Right ear rim
    {"name": "ear_rim_right", "from": [2.35, 12.45, -2.65], "to": [3.15, 13.35, -1.65], "color": "capybaraCaramel", "col_idx": 0},
    # 40. Right ear inner
    {"name": "ear_inner_right", "from": [2.45, 11.55, -2.95], "to": [3.05, 12.55, -2.75], "color": "capybaraMuzzle", "col_idx": 2},

    # --- E. ZEN MANDARIN (YUZU) WITH LEAF & STEM (10 cubes) ---
    # 41. Mandarin base tier
    {"name": "mandarin_base", "from": [-1.25, 11.75, -4.75], "to": [1.25, 12.35, -2.85], "color": "orangeFruit", "col_idx": 6},
    # 42. Mandarin middle plump sphere
    {"name": "mandarin_middle_bulge", "from": [-1.65, 12.15, -5.15], "to": [1.65, 13.45, -2.45], "color": "orangeFruit", "col_idx": 6},
    # 43. Mandarin top dome
    {"name": "mandarin_top_dome", "from": [-1.15, 13.25, -4.65], "to": [1.15, 14.05, -2.95], "color": "orangeFruit", "col_idx": 6},
    # 44. Mandarin stem
    {"name": "mandarin_stem", "from": [-0.25, 13.95, -4.05], "to": [0.25, 14.65, -3.55], "color": "greenLeaf", "col_idx": 7},
    # 45. Mandarin right leaf
    {"name": "mandarin_leaf", "from": [0.15, 14.15, -3.85], "to": [1.25, 14.55, -2.95], "color": "greenLeaf", "col_idx": 7},
    # 46. Mandarin right leaf tip
    {"name": "mandarin_leaf_tip", "from": [0.75, 13.95, -3.45], "to": [1.65, 14.35, -2.75], "color": "greenLeaf", "col_idx": 7},
    # 47. Mandarin left secondary leaf
    {"name": "mandarin_leaf_left", "from": [-1.05, 14.15, -4.45], "to": [-0.15, 14.55, -3.75], "color": "greenLeaf", "col_idx": 7},
    # 48. Mandarin sun specular highlight
    {"name": "mandarin_sun_spot", "from": [-1.35, 12.65, -5.25], "to": [-0.65, 13.35, -4.75], "color": "goldCoin", "col_idx": 8},
    # 49. Zen forehead mark / calm tuft
    {"name": "forehead_zen_tuft", "from": [-0.65, 10.45, -5.95], "to": [0.65, 11.45, -5.35], "color": "capybaraBrown", "col_idx": 1},
    # 50. Serene chin button
    {"name": "chin_zen_button", "from": [-0.85, 6.15, -7.15], "to": [0.85, 6.95, -6.35], "color": "capybaraDark", "col_idx": 4},
]

issues = check_coplanar(cubes)
print(f"Total cubes: {len(cubes)}")
print(f"Coplanar overlap issues: {len(issues)}")
if issues:
    for i, (c1, c2, plane, area) in enumerate(issues):
        print(f"  {i+1}: {c1} vs {c2} on {plane} ({area})")

with open('scripts/capybara_zero_zfight.json', 'w') as f:
    json.dump(cubes, f, indent=2)
