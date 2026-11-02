import json
import sys
sys.path.insert(0, 'scripts')
from test_coplanar import check_coplanar

cubes = [
    # --- A. GROUNDED LIMBS & PAWS (10 cubes) ---
    # 1. Front left paw
    {"name": "paw_front_left", "from": [-3.55, 0.0, -3.65], "to": [-2.05, 1.45, -1.95], "color": "capybaraPaws", "col_idx": 3},
    # 2. Front left digits
    {"name": "paw_digits_front_left", "from": [-3.35, 0.05, -4.35], "to": [-2.25, 0.75, -3.55], "color": "capybaraPaws", "col_idx": 3},
    # 3. Front left leg pillar
    {"name": "leg_front_left", "from": [-3.35, 1.25, -3.45], "to": [-2.25, 3.25, -2.15], "color": "capybaraCaramel", "col_idx": 0},

    # 4. Front right paw
    {"name": "paw_front_right", "from": [2.05, 0.0, -3.65], "to": [3.55, 1.45, -1.95], "color": "capybaraPaws", "col_idx": 3},
    # 5. Front right digits
    {"name": "paw_digits_front_right", "from": [2.25, 0.05, -4.35], "to": [3.35, 0.75, -3.55], "color": "capybaraPaws", "col_idx": 3},
    # 6. Front right leg pillar
    {"name": "leg_front_right", "from": [2.25, 1.25, -3.45], "to": [3.35, 3.25, -2.15], "color": "capybaraCaramel", "col_idx": 0},

    # 7. Rear left haunch (sturdy thigh)
    {"name": "thigh_rear_left", "from": [-4.15, 1.05, 1.15], "to": [-2.55, 4.35, 3.95], "color": "capybaraCaramel", "col_idx": 0},
    # 8. Rear left paw
    {"name": "paw_rear_left", "from": [-3.85, 0.0, 1.05], "to": [-2.35, 1.35, 3.55], "color": "capybaraPaws", "col_idx": 3},

    # 9. Rear right haunch
    {"name": "thigh_rear_right", "from": [2.55, 1.05, 1.15], "to": [4.15, 4.35, 3.95], "color": "capybaraCaramel", "col_idx": 0},
    # 10. Rear right paw
    {"name": "paw_rear_right", "from": [2.35, 0.0, 1.05], "to": [3.85, 1.35, 3.55], "color": "capybaraPaws", "col_idx": 3},

    # --- B. CONTOURED BARREL TORSO, SLOPES & RUMP (8 cubes) ---
    # 11. Main caramel body core
    {"name": "body_core", "from": [-3.45, 2.45, -2.85], "to": [3.45, 6.85, 3.55], "color": "capybaraCaramel", "col_idx": 0},
    # 12. Warm underbelly
    {"name": "body_underbelly", "from": [-2.75, 1.75, -2.45], "to": [2.75, 3.05, 3.25], "color": "capybaraMuzzle", "col_idx": 2},
    # 13. Left flank fluff
    {"name": "flank_left", "from": [-4.05, 2.75, -1.75], "to": [-3.35, 6.15, 2.75], "color": "capybaraBrown", "col_idx": 1},
    # 14. Right flank fluff
    {"name": "flank_right", "from": [3.35, 2.75, -1.75], "to": [4.05, 6.15, 2.75], "color": "capybaraBrown", "col_idx": 1},
    # 15. Rounded spine ridge (smooths back)
    {"name": "back_arch_ridge", "from": [-2.65, 6.75, -0.95], "to": [2.65, 7.45, 2.85], "color": "capybaraBrown", "col_idx": 1},
    # 16. Rounded rear rump
    {"name": "rump_rear", "from": [-3.05, 2.85, 3.45], "to": [3.05, 6.55, 4.45], "color": "capybaraCaramel", "col_idx": 0},
    # 17. Upper rump slope
    {"name": "rump_slope_top", "from": [-2.55, 6.25, 2.65], "to": [2.55, 7.15, 4.05], "color": "capybaraBrown", "col_idx": 1},
    # 18. Tail stub
    {"name": "tail_stub", "from": [-0.65, 3.35, 4.35], "to": [0.65, 4.25, 5.05], "color": "capybaraMuzzle", "col_idx": 2},

    # --- C. NECK & LEGENDARY MALA BEAD NECKLACE (6 cubes) ---
    # 19. Neck base
    {"name": "neck_base", "from": [-3.05, 3.75, -4.25], "to": [3.05, 7.35, -2.65], "color": "capybaraCaramel", "col_idx": 0},
    # 20. Neck bib throat
    {"name": "neck_bib_throat", "from": [-2.15, 3.05, -4.55], "to": [2.15, 5.55, -3.15], "color": "capybaraMuzzle", "col_idx": 2},
    # 21. Mala necklace left drape
    {"name": "mala_necklace_left", "from": [-2.75, 4.55, -4.65], "to": [-1.95, 6.65, -3.65], "color": "capybaraDark", "col_idx": 4},
    # 22. Mala necklace right drape
    {"name": "mala_necklace_right", "from": [1.95, 4.55, -4.65], "to": [2.75, 6.65, -3.65], "color": "capybaraDark", "col_idx": 4},
    # 23. Mala necklace bottom loop
    {"name": "mala_necklace_bottom", "from": [-1.85, 4.25, -4.75], "to": [1.85, 5.05, -4.05], "color": "capybaraDark", "col_idx": 4},
    # 24. Golden Lotus/Coin Medallion
    {"name": "mala_gold_medallion", "from": [-0.75, 3.45, -4.85], "to": [0.75, 4.45, -4.35], "color": "goldCoin", "col_idx": 8},

    # --- D. HEAD, SNOUT & EXPRESSIVE SOULFUL EYES (15 cubes) ---
    # 25. Head core
    {"name": "head_core", "from": [-2.95, 6.75, -5.65], "to": [2.95, 11.15, -1.75], "color": "capybaraCaramel", "col_idx": 0},
    # 26. Head crown flat
    {"name": "head_crown_flat", "from": [-2.65, 10.95, -5.25], "to": [2.65, 11.65, -2.05], "color": "capybaraCaramel", "col_idx": 0},
    # 27. Heavy snout
    {"name": "snout_muzzle", "from": [-2.35, 6.35, -7.25], "to": [2.35, 9.95, -5.55], "color": "capybaraMuzzle", "col_idx": 2},
    # 28. Chin under mouth
    {"name": "snout_chin_under", "from": [-1.85, 5.65, -6.65], "to": [1.85, 7.05, -4.85], "color": "capybaraMuzzle", "col_idx": 2},
    # 29. Dark nose pad
    {"name": "nose_pad_dark", "from": [-1.05, 8.45, -7.55], "to": [1.05, 9.75, -7.15], "color": "capybaraDark", "col_idx": 4},
    # 30. Left nostril slit
    {"name": "nostril_slit_left", "from": [-1.25, 8.75, -7.65], "to": [-0.65, 9.35, -7.35], "color": "maskBlack", "col_idx": 5},
    # 31. Right nostril slit
    {"name": "nostril_slit_right", "from": [0.65, 8.75, -7.65], "to": [1.25, 9.35, -7.35], "color": "maskBlack", "col_idx": 5},
    # 32. Nostril vertical philtrum bridge
    {"name": "nostril_bridge", "from": [-0.35, 7.75, -7.45], "to": [0.35, 8.65, -7.05], "color": "capybaraDark", "col_idx": 4},
    # 33. Left cheek fluff
    {"name": "cheek_fluff_left", "from": [-3.55, 7.15, -4.75], "to": [-2.75, 9.75, -2.55], "color": "capybaraBrown", "col_idx": 1},
    # 34. Right cheek fluff
    {"name": "cheek_fluff_right", "from": [2.75, 7.15, -4.75], "to": [3.55, 9.75, -2.55], "color": "capybaraBrown", "col_idx": 1},
    # 35. Left big cute eye pupil (CROSSY ROAD STYLE!)
    {"name": "eye_left_iris", "from": [-3.15, 8.95, -4.65], "to": [-2.85, 10.15, -3.45], "color": "maskBlack", "col_idx": 5},
    # 36. Left eye sparkle glint (white dot)
    {"name": "eye_left_sparkle", "from": [-3.18, 9.55, -4.55], "to": [-2.90, 10.05, -4.05], "color": "white", "col_idx": 9},
    # 37. Right big cute eye pupil
    {"name": "eye_right_iris", "from": [2.85, 8.95, -4.65], "to": [3.15, 10.15, -3.45], "color": "maskBlack", "col_idx": 5},
    # 38. Right eye sparkle glint (white dot)
    {"name": "eye_right_sparkle", "from": [2.90, 9.55, -4.55], "to": [3.18, 10.05, -4.05], "color": "white", "col_idx": 9},
    # 39. Forehead zen tuft
    {"name": "forehead_zen_tuft", "from": [-0.65, 10.35, -5.75], "to": [0.65, 11.35, -5.35], "color": "capybaraBrown", "col_idx": 1},

    # --- E. PERKY ROUNDED EARS (4 cubes) ---
    # 40. Left ear base
    {"name": "ear_base_left", "from": [-3.25, 11.05, -2.75], "to": [-2.15, 12.55, -1.55], "color": "capybaraBrown", "col_idx": 1},
    # 41. Left ear inner
    {"name": "ear_inner_left", "from": [-2.95, 11.35, -2.85], "to": [-2.35, 12.25, -2.55], "color": "capybaraMuzzle", "col_idx": 2},
    # 42. Right ear base
    {"name": "ear_base_right", "from": [2.15, 11.05, -2.75], "to": [3.25, 12.55, -1.55], "color": "capybaraBrown", "col_idx": 1},
    # 43. Right ear inner
    {"name": "ear_inner_right", "from": [2.35, 11.35, -2.85], "to": [2.95, 12.25, -2.55], "color": "capybaraMuzzle", "col_idx": 2},

    # --- F. LEGENDARY ONSEN TOWEL & YUZU MANDARIN (10 cubes) ---
    # 44. Folded Japanese Onsen Spa Towel Base
    {"name": "onsen_towel_main", "from": [-2.05, 11.55, -4.85], "to": [2.05, 12.25, -2.45], "color": "white", "col_idx": 9},
    # 45. Folded Towel Top Tier
    {"name": "onsen_towel_fold_top", "from": [-1.75, 12.15, -4.55], "to": [1.75, 12.65, -2.65], "color": "white", "col_idx": 9},
    # 46. Mandarin Base Tier
    {"name": "mandarin_base", "from": [-1.25, 12.55, -4.45], "to": [1.25, 13.05, -2.85], "color": "orangeFruit", "col_idx": 6},
    # 47. Mandarin Plump Middle
    {"name": "mandarin_middle_bulge", "from": [-1.55, 12.95, -4.75], "to": [1.55, 14.15, -2.55], "color": "orangeFruit", "col_idx": 6},
    # 48. Mandarin Top Dome
    {"name": "mandarin_top_dome", "from": [-1.05, 14.05, -4.35], "to": [1.05, 14.65, -2.95], "color": "orangeFruit", "col_idx": 6},
    # 49. Mandarin Sun Specular Spot
    {"name": "mandarin_sun_spot", "from": [-1.25, 13.45, -4.85], "to": [-0.65, 14.05, -4.35], "color": "goldCoin", "col_idx": 8},
    # 50. Mandarin Stem
    {"name": "mandarin_stem", "from": [-0.25, 14.55, -3.85], "to": [0.25, 15.25, -3.45], "color": "greenLeaf", "col_idx": 7},
    # 51. Mandarin Right Leaf
    {"name": "mandarin_leaf", "from": [0.15, 14.75, -3.65], "to": [1.15, 15.15, -2.85], "color": "greenLeaf", "col_idx": 7},
    # 52. Mandarin Right Leaf Tip
    {"name": "mandarin_leaf_tip", "from": [0.75, 14.55, -3.35], "to": [1.55, 14.95, -2.65], "color": "greenLeaf", "col_idx": 7},
    # 53. Mandarin Left Leaf
    {"name": "mandarin_leaf_left", "from": [-0.95, 14.75, -4.25], "to": [-0.15, 15.15, -3.65], "color": "greenLeaf", "col_idx": 7},
]

issues = check_coplanar(cubes)
print(f"Total cubes: {len(cubes)}")
print(f"Coplanar overlap issues: {len(issues)}")
if issues:
    for i, (c1, c2, plane, area) in enumerate(issues):
        print(f"  {i+1}: {c1} vs {c2} on {plane} ({area})")

with open('scripts/capybara_v2_zero_zfight.json', 'w') as f:
    json.dump(cubes, f, indent=2)
