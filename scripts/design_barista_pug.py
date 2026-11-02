import json
import sys
sys.path.insert(0, 'scripts')
from test_coplanar import check_coplanar

cubes = [
    # --- A. CHUBBY PUG LIMBS & PAWS (10 cubes) ---
    # 1. Front left shoulder
    {"name": "arm_shoulder_left", "from": [-3.45, 2.45, -2.85], "to": [-2.25, 4.45, -1.45], "color": "burlapBag", "col_idx": 0},
    # 2. Front left forearm reaching forward
    {"name": "arm_forearm_left", "from": [-3.35, 1.25, -3.65], "to": [-2.05, 2.95, -2.25], "color": "burlapBag", "col_idx": 0},
    # 3. Front left black paw holding cup side
    {"name": "paw_front_left", "from": [-2.85, 1.15, -4.25], "to": [-1.65, 2.35, -3.25], "color": "maskBlack", "col_idx": 1},

    # 4. Front right shoulder
    {"name": "arm_shoulder_right", "from": [2.25, 2.45, -2.85], "to": [3.45, 4.45, -1.45], "color": "burlapBag", "col_idx": 0},
    # 5. Front right forearm reaching forward
    {"name": "arm_forearm_right", "from": [2.05, 1.25, -3.65], "to": [3.35, 2.95, -2.25], "color": "burlapBag", "col_idx": 0},
    # 6. Front right black paw holding cup side
    {"name": "paw_front_right", "from": [1.65, 1.15, -4.25], "to": [2.85, 2.35, -3.25], "color": "maskBlack", "col_idx": 1},

    # 7. Rear left haunch (sturdy thigh)
    {"name": "thigh_rear_left", "from": [-3.55, 0.95, 1.05], "to": [-2.05, 3.75, 3.25], "color": "burlapBag", "col_idx": 0},
    # 8. Rear left black paw
    {"name": "paw_rear_left", "from": [-3.35, 0.0, 1.15], "to": [-2.15, 1.25, 3.35], "color": "maskBlack", "col_idx": 1},

    # 9. Rear right haunch
    {"name": "thigh_rear_right", "from": [2.05, 0.95, 1.05], "to": [3.55, 3.75, 3.25], "color": "burlapBag", "col_idx": 0},
    # 10. Rear right black paw
    {"name": "paw_rear_right", "from": [2.15, 0.0, 1.15], "to": [3.35, 1.25, 3.35], "color": "maskBlack", "col_idx": 1},

    # --- B. PLUMP PUG BARREL BODY & CURLY TAIL (7 cubes) ---
    # 11. Main fawn torso
    {"name": "body_core", "from": [-3.15, 2.25, -2.55], "to": [3.15, 6.45, 3.15], "color": "burlapBag", "col_idx": 0},
    # 12. Warm underbelly
    {"name": "body_underbelly", "from": [-2.55, 1.65, -2.15], "to": [2.55, 2.75, 2.75], "color": "burlapBag", "col_idx": 0},
    # 13. Rounded back slope
    {"name": "back_arch_ridge", "from": [-2.65, 6.25, -1.65], "to": [2.65, 6.95, 2.45], "color": "burlapBag", "col_idx": 0},
    # 14. Plump rear rump
    {"name": "rump_rear", "from": [-2.75, 2.65, 2.95], "to": [2.75, 5.95, 3.85], "color": "burlapBag", "col_idx": 0},
    # 15. Cinnamon roll tail root (lowered to rump, above apron bow)
    {"name": "tail_base", "from": [-0.75, 3.85, 3.65], "to": [0.75, 4.75, 4.45], "color": "burlapBag", "col_idx": 0},
    # 16. Cinnamon roll tail curl upward
    {"name": "tail_curl_up", "from": [0.25, 4.55, 3.25], "to": [1.55, 5.65, 4.25], "color": "darkCharcoal", "col_idx": 2},
    # 17. Cinnamon roll tail tip tucked
    {"name": "tail_curl_tip", "from": [-0.45, 5.15, 2.75], "to": [0.75, 5.85, 3.65], "color": "darkCharcoal", "col_idx": 2},

    # --- C. BARISTA GREEN APRON & GOLD BADGE (7 cubes) ---
    # 18. Apron chest bib
    {"name": "apron_bib", "from": [-2.15, 3.55, -3.05], "to": [2.15, 6.25, -2.45], "color": "greenLeaf", "col_idx": 3},
    # 19. Apron strap left (over shoulder)
    {"name": "apron_strap_left", "from": [-2.55, 5.85, -2.85], "to": [-1.85, 6.65, -1.85], "color": "greenLeaf", "col_idx": 3},
    # 20. Apron strap right (over shoulder)
    {"name": "apron_strap_right", "from": [1.85, 5.85, -2.85], "to": [2.55, 6.65, -1.85], "color": "greenLeaf", "col_idx": 3},
    # 21. Apron waist wrap
    {"name": "apron_waist_wrap", "from": [-3.25, 2.65, -2.75], "to": [3.25, 3.85, 2.25], "color": "greenLeaf", "col_idx": 3},
    # 22. Apron tie bow on back (centered on waist wrap)
    {"name": "apron_tie_bow", "from": [-1.35, 2.75, 3.75], "to": [1.35, 3.65, 4.35], "color": "greenLeaf", "col_idx": 3},
    # 23. Apron tie knot
    {"name": "apron_tie_knot", "from": [-0.45, 2.95, 4.25], "to": [0.45, 3.45, 4.65], "color": "greenLeaf", "col_idx": 3},
    # 24. Gold Barista Name Badge
    {"name": "barista_badge", "from": [-1.85, 5.15, -3.18], "to": [-0.95, 5.75, -2.95], "color": "goldCoin", "col_idx": 4},

    # --- D. TAKEOUT COFFEE CUP & LATTE ART (6 cubes) ---
    # 25. Paper cup base
    {"name": "cup_base", "from": [-1.25, 1.45, -4.65], "to": [1.25, 3.05, -3.15], "color": "white", "col_idx": 5},
    # 26. Kraft heat sleeve
    {"name": "cup_heat_sleeve", "from": [-1.35, 2.15, -4.75], "to": [1.35, 3.35, -3.05], "color": "cardboard", "col_idx": 6},
    # 27. Paper cup upper rim
    {"name": "cup_upper_rim", "from": [-1.45, 3.25, -4.85], "to": [1.45, 4.45, -2.95], "color": "white", "col_idx": 5},
    # 28. Steamed latte milk foam
    {"name": "latte_foam", "from": [-1.25, 4.35, -4.65], "to": [1.25, 4.75, -3.15], "color": "white", "col_idx": 5},
    # 29. Coffee crema heart
    {"name": "crema_heart", "from": [-0.85, 4.65, -4.35], "to": [0.85, 4.85, -3.45], "color": "capybaraBrown", "col_idx": 7},
    # 30. Bright red cafe sipping straw (high contrast against green apron)
    {"name": "coffee_straw", "from": [0.25, 4.55, -3.75], "to": [0.65, 5.55, -3.35], "color": "deliveryRed", "col_idx": 9},

    # --- E. FAWN PUG HEAD & WARM BROW WRINKLES (8 cubes) ---
    # 31. Head core
    {"name": "head_core", "from": [-3.05, 6.15, -3.55], "to": [3.05, 10.45, 1.15], "color": "burlapBag", "col_idx": 0},
    # 32. Head crown top
    {"name": "head_crown_top", "from": [-2.45, 10.25, -2.85], "to": [2.45, 10.95, 0.65], "color": "burlapBag", "col_idx": 0},
    # 33. Left cheek fluff
    {"name": "cheek_fluff_left", "from": [-3.65, 6.55, -2.95], "to": [-2.85, 8.85, 0.35], "color": "burlapBag", "col_idx": 0},
    # 34. Right cheek fluff
    {"name": "cheek_fluff_right", "from": [2.85, 6.55, -2.95], "to": [3.65, 8.85, 0.35], "color": "burlapBag", "col_idx": 0},
    # 35. Forehead wrinkle tier 1 (warm caramel brown)
    {"name": "forehead_wrinkle_1", "from": [-2.15, 8.85, -4.15], "to": [2.15, 9.75, -3.25], "color": "bagRope", "col_idx": 8},
    # 36. Forehead wrinkle tier 2 (fawn ridge)
    {"name": "forehead_wrinkle_2", "from": [-1.65, 9.55, -3.95], "to": [1.65, 10.35, -3.15], "color": "burlapBag", "col_idx": 0},
    # 37. Forehead wrinkle tier 3 (warm caramel brown)
    {"name": "forehead_wrinkle_3", "from": [-1.15, 10.15, -3.65], "to": [1.15, 10.85, -2.95], "color": "bagRope", "col_idx": 8},
    # 38. Throat / chin underside (fawn fur)
    {"name": "snout_chin_under", "from": [-1.75, 5.65, -3.65], "to": [1.75, 6.75, -2.15], "color": "burlapBag", "col_idx": 0},

    # --- F. HIGH-CONTRAST SNOUT, NOSE & TONGUE BLEP (6 cubes) ---
    # 39. Fawn face plate (bright base behind eyes and forehead)
    {"name": "mask_face_plate", "from": [-2.75, 6.95, -4.05], "to": [2.75, 9.45, -3.45], "color": "burlapBag", "col_idx": 0},
    # 40. Muzzle / jowls block (deep espresso dark snout)
    {"name": "muzzle_jowls", "from": [-1.95, 6.35, -4.95], "to": [1.95, 8.25, -3.75], "color": "darkCharcoal", "col_idx": 2},
    # 41. Button nose (jet black protruding button)
    {"name": "nose_button", "from": [-0.65, 7.85, -5.25], "to": [0.65, 8.75, -4.65], "color": "maskBlack", "col_idx": 1},
    # 42. Left droopy jowl
    {"name": "jowl_droop_left", "from": [-1.85, 6.15, -4.85], "to": [-0.95, 7.35, -3.95], "color": "darkCharcoal", "col_idx": 2},
    # 43. Right droopy jowl
    {"name": "jowl_droop_right", "from": [0.95, 6.15, -4.85], "to": [1.85, 7.35, -3.95], "color": "darkCharcoal", "col_idx": 2},
    # 44. Cute pink tongue blep (breaks up dark snout)
    {"name": "tongue_blep", "from": [-0.35, 6.15, -5.10], "to": [0.35, 6.75, -4.55], "color": "nosePink", "col_idx": 10},

    # --- G. BIG SOULFUL PUG EYES (4 cubes) ---
    # 45. Left eye pupil (jet black on fawn fur)
    {"name": "eye_left_iris", "from": [-2.65, 7.95, -4.25], "to": [-1.55, 9.25, -3.65], "color": "maskBlack", "col_idx": 1},
    # 46. Left eye sparkle (white dot)
    {"name": "eye_left_sparkle", "from": [-2.55, 8.55, -4.35], "to": [-1.95, 9.15, -3.85], "color": "white", "col_idx": 5},
    # 47. Right eye pupil (jet black on fawn fur)
    {"name": "eye_right_iris", "from": [1.55, 7.95, -4.25], "to": [2.65, 9.25, -3.65], "color": "maskBlack", "col_idx": 1},
    # 48. Right eye sparkle (white dot)
    {"name": "eye_right_sparkle", "from": [1.95, 8.55, -4.35], "to": [2.55, 9.15, -3.85], "color": "white", "col_idx": 5},

    # --- H. FOLDED BUTTON EARS (4 cubes) ---
    # 49. Left ear base
    {"name": "ear_base_left", "from": [-3.55, 9.25, -1.95], "to": [-2.35, 10.75, 0.25], "color": "darkCharcoal", "col_idx": 2},
    # 50. Left ear flap forward
    {"name": "ear_flap_left", "from": [-3.75, 8.05, -2.45], "to": [-2.55, 9.65, -0.65], "color": "darkCharcoal", "col_idx": 2},
    # 51. Right ear base
    {"name": "ear_base_right", "from": [2.35, 9.25, -1.95], "to": [3.55, 10.75, 0.25], "color": "darkCharcoal", "col_idx": 2},
    # 52. Right ear flap forward
    {"name": "ear_flap_right", "from": [2.55, 8.05, -2.45], "to": [3.75, 9.65, -0.65], "color": "darkCharcoal", "col_idx": 2},
]

for c in cubes:
    c["uv"] = [c["col_idx"], 0, c["col_idx"] + 1, 1]

issues = check_coplanar(cubes)
print(f"Total cubes: {len(cubes)}")
print(f"Coplanar overlap issues: {len(issues)}")
if issues:
    for i, (c1, c2, plane, area) in enumerate(issues):
        print(f"  {i+1}: {c1} vs {c2} on {plane} ({area})")

with open('scripts/barista_pug_zero_zfight.json', 'w') as f:
    json.dump(cubes, f, indent=2)
