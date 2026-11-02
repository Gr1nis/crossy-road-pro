import json
import sys
sys.path.insert(0, 'scripts')
from test_coplanar import check_coplanar

cubes = [
    # --- A. PARCEL DELIVERY BOX ---
    # 1. Floor: solid base plate
    {"name": "box_floor", "from": [-4.8, 0.0, -4.8], "to": [4.8, 0.8, 4.8], "color": "cardboard", "col_idx": 4},
    # 2. Front wall
    {"name": "box_wall_front", "from": [-5.0, 0.1, -5.0], "to": [5.0, 5.2, -4.2], "color": "cardboard", "col_idx": 4},
    # 3. Back wall
    {"name": "box_wall_back", "from": [-5.0, 0.1, 4.2], "to": [5.0, 5.2, 5.0], "color": "cardboard", "col_idx": 4},
    # 4. Left wall (penetrates into front/back walls: Z from -4.5 to 4.5, tucked X: -4.95 to -4.25)
    {"name": "box_wall_left", "from": [-4.95, 0.25, -4.5], "to": [-4.25, 5.05, 4.5], "color": "cardboard", "col_idx": 4},
    # 5. Right wall (penetrates into front/back walls: Z from -4.5 to 4.5, tucked X: 4.25 to 4.95)
    {"name": "box_wall_right", "from": [4.25, 0.25, -4.5], "to": [4.95, 5.05, 4.5], "color": "cardboard", "col_idx": 4},
    # 6. Front flap (angled forward/down)
    {"name": "box_flap_front", "from": [-4.6, 4.75, -6.4], "to": [4.6, 5.35, -4.7], "color": "boxFlap", "col_idx": 5},
    # 7. Back flap (angled backward/down)
    {"name": "box_flap_back", "from": [-4.6, 4.75, 4.7], "to": [4.6, 5.35, 6.4], "color": "boxFlap", "col_idx": 5},
    # 8. Left flap (angled outward/down)
    {"name": "box_flap_left", "from": [-6.4, 4.78, -4.3], "to": [-4.7, 5.38, 4.3], "color": "boxFlap", "col_idx": 5},
    # 9. Right flap (angled outward/down)
    {"name": "box_flap_right", "from": [4.7, 4.78, -4.3], "to": [6.4, 5.38, 4.3], "color": "boxFlap", "col_idx": 5},
    # 10. Packaging tape strip along bottom front
    {"name": "tape_strip_base", "from": [-5.08, -0.04, -5.08], "to": [5.08, 0.45, -4.12], "color": "boxTape", "col_idx": 6},
    # 11. White shipping label on front wall
    {"name": "shipping_label_white", "from": [0.4, 1.2, -5.18], "to": [3.8, 3.8, -4.92], "color": "white", "col_idx": 1},
    # 12. Red fragile / stamp on label
    {"name": "fragile_stamp_red", "from": [0.8, 2.2, -5.26], "to": [2.2, 3.5, -5.05], "color": "deliveryRed", "col_idx": 7},
    # 13. Dark barcode lines on label
    {"name": "barcode_strip_dark", "from": [0.8, 1.45, -5.26], "to": [3.4, 1.95, -5.05], "color": "darkCharcoal", "col_idx": 3},

    # --- B. CAT BODY & COMPACT PAWS SITTING SNUGLY ON RIM ---
    # 14. Torso loaf inside box
    {"name": "cat_torso_loaf", "from": [-3.6, 0.7, -3.6], "to": [3.6, 5.8, 3.6], "color": "catOrange", "col_idx": 0},
    # 15. White chest bib
    {"name": "cat_chest_bib", "from": [-2.2, 4.45, -4.1], "to": [2.2, 6.35, -3.1], "color": "white", "col_idx": 1},
    # 16. Chest bib tuft
    {"name": "cat_bib_tuft", "from": [-1.1, 4.25, -4.3], "to": [1.1, 5.55, -3.3], "color": "white", "col_idx": 1},
    # 17. Left front arm (penetrates into wall Z -4.4 to -2.8)
    {"name": "paw_left_arm", "from": [-3.2, 4.6, -4.4], "to": [-1.8, 5.85, -2.8], "color": "catOrange", "col_idx": 0},
    # 18. Left white mitten resting SNUGLY on front rim (Z -4.85 to -3.85)
    {"name": "paw_left_mitten", "from": [-3.3, 4.88, -4.85], "to": [-1.7, 5.82, -3.85], "color": "white", "col_idx": 1},
    # 19. Left pink toe beans on front rim
    {"name": "paw_left_beans", "from": [-3.05, 4.62, -4.88], "to": [-1.95, 5.12, -4.15], "color": "nosePink", "col_idx": 2},
    # 20. Right front arm (penetrates into wall Z -4.4 to -2.8)
    {"name": "paw_right_arm", "from": [1.8, 4.6, -4.4], "to": [3.2, 5.85, -2.8], "color": "catOrange", "col_idx": 0},
    # 21. Right white mitten resting SNUGLY on front rim (Z -4.85 to -3.85)
    {"name": "paw_right_mitten", "from": [1.7, 4.88, -4.85], "to": [3.3, 5.82, -3.85], "color": "white", "col_idx": 1},
    # 22. Right pink toe beans on front rim
    {"name": "paw_right_beans", "from": [1.95, 4.62, -4.88], "to": [3.05, 5.12, -4.15], "color": "nosePink", "col_idx": 2},
    # 23. Chubby side fluff left
    {"name": "body_side_fluff_left", "from": [-4.3, 4.45, -2.5], "to": [-3.3, 5.75, 2.5], "color": "catOrange", "col_idx": 0},
    # 24. Chubby side fluff right
    {"name": "body_side_fluff_right", "from": [3.3, 4.45, -2.5], "to": [4.3, 5.75, 2.5], "color": "catOrange", "col_idx": 0},

    # --- C. CAT HEAD & EXPRESSIVE FACE ---
    # 25. Head core
    {"name": "head_core", "from": [-3.2, 5.62, -2.6], "to": [3.2, 10.38, 2.8], "color": "catOrange", "col_idx": 0},
    # 26. Chubby cheek left
    {"name": "cheek_fluff_left", "from": [-4.0, 5.82, -2.2], "to": [-2.85, 8.38, 1.8], "color": "catOrange", "col_idx": 0},
    # 27. Chubby cheek right
    {"name": "cheek_fluff_right", "from": [2.85, 5.82, -2.2], "to": [4.0, 8.38, 1.8], "color": "catOrange", "col_idx": 0},
    # 28. White chubby snout / muzzle
    {"name": "muzzle_snout_white", "from": [-1.8, 6.02, -3.8], "to": [1.8, 7.98, -2.25], "color": "white", "col_idx": 1},
    # 29. White chin under mouth
    {"name": "chin_under_mouth", "from": [-1.2, 5.38, -3.38], "to": [1.2, 6.38, -2.32], "color": "white", "col_idx": 1},
    # 30. Cute pink nose button
    {"name": "nose_pink_button", "from": [-0.5, 7.12, -3.98], "to": [0.5, 7.78, -3.22], "color": "nosePink", "col_idx": 2},
    # 31. Tabby forehead stripe mid
    {"name": "forehead_stripe_mid", "from": [-0.5, 8.22, -2.98], "to": [0.5, 10.58, -1.82], "color": "catStripe", "col_idx": 8},
    # 32. Tabby forehead stripe left
    {"name": "forehead_stripe_left", "from": [-2.15, 8.42, -2.88], "to": [-1.15, 10.18, -1.92], "color": "catStripe", "col_idx": 8},
    # 33. Tabby forehead stripe right
    {"name": "forehead_stripe_right", "from": [1.15, 8.42, -2.88], "to": [2.15, 10.18, -1.92], "color": "catStripe", "col_idx": 8},
    # 34. Golden amber eye iris left
    {"name": "eye_left_iris", "from": [-2.5, 7.38, -2.95], "to": [-1.1, 8.92, -2.42], "color": "catEye", "col_idx": 9},
    # 35. Dark pupil left
    {"name": "eye_left_pupil", "from": [-2.2, 7.48, -3.05], "to": [-1.3, 8.82, -2.50], "color": "darkCharcoal", "col_idx": 3},
    # 36. White sparkle left
    {"name": "eye_left_sparkle", "from": [-2.4, 8.22, -3.15], "to": [-1.7, 8.78, -2.58], "color": "white", "col_idx": 1},
    # 37. Golden amber eye iris right
    {"name": "eye_right_iris", "from": [1.1, 7.38, -2.95], "to": [2.5, 8.92, -2.42], "color": "catEye", "col_idx": 9},
    # 38. Dark pupil right
    {"name": "eye_right_pupil", "from": [1.3, 7.48, -3.05], "to": [2.2, 8.82, -2.50], "color": "darkCharcoal", "col_idx": 3},
    # 39. White sparkle right
    {"name": "eye_right_sparkle", "from": [1.7, 8.22, -3.15], "to": [2.4, 8.78, -2.45], "color": "white", "col_idx": 1},
    # 40. Top crown dome
    {"name": "head_crown_top", "from": [-2.4, 10.22, -2.0], "to": [2.4, 10.98, 2.0], "color": "catOrange", "col_idx": 0},
    # 41. Cheek tabby stripe left
    {"name": "cheek_stripe_left", "from": [-3.95, 6.78, -2.08], "to": [-3.05, 7.78, -0.58], "color": "catStripe", "col_idx": 8},
    # 42. Cheek tabby stripe right
    {"name": "cheek_stripe_right", "from": [3.05, 6.78, -2.08], "to": [3.95, 7.78, -0.58], "color": "catStripe", "col_idx": 8},

    # --- D. PERKY CAT EARS ---
    # 43. Ear base left
    {"name": "ear_base_left", "from": [-3.0, 10.18, -1.6], "to": [-1.4, 12.18, 0.6], "color": "catOrange", "col_idx": 0},
    # 44. Ear tip left
    {"name": "ear_tip_left", "from": [-2.7, 11.98, -1.3], "to": [-1.7, 13.38, 0.3], "color": "catOrange", "col_idx": 0},
    # 45. Ear pink inside left
    {"name": "ear_pink_left", "from": [-2.6, 10.25, -1.88], "to": [-1.6, 11.85, -1.28], "color": "nosePink", "col_idx": 2},
    # 46. Ear base right
    {"name": "ear_base_right", "from": [1.4, 10.18, -1.6], "to": [3.0, 12.18, 0.6], "color": "catOrange", "col_idx": 0},
    # 47. Ear tip right
    {"name": "ear_tip_right", "from": [1.7, 11.98, -1.3], "to": [2.7, 13.38, 0.3], "color": "catOrange", "col_idx": 0},
    # 48. Ear pink inside right
    {"name": "ear_pink_right", "from": [1.6, 10.25, -1.88], "to": [2.6, 11.85, -1.28], "color": "nosePink", "col_idx": 2},

    # --- E. PLAYFULLY CURVED / ARCHED CAT TAIL (NO MORE VERTICAL POLE!) ---
    # 49. Tail base coming from rump inside box (Z 2.8 to 4.05)
    {"name": "tail_base", "from": [0.6, 3.6, 2.8], "to": [1.8, 5.0, 4.05], "color": "catOrange", "col_idx": 0},
    # 50. Tail segment climbing over back rim (Y 4.85 to 6.15, Z 3.8 to 5.15)
    {"name": "tail_over_rim", "from": [0.75, 4.85, 3.8], "to": [1.95, 6.15, 5.15], "color": "catStripe", "col_idx": 8},
    # 51. Tail arching backward into open air (Y 5.85 to 7.25, Z 4.4 to 5.6)
    {"name": "tail_arch_back", "from": [0.9, 5.85, 4.4], "to": [2.1, 7.25, 5.6], "color": "catOrange", "col_idx": 0},
    # 52. Tail curving up and forward (Y 6.95 to 8.35, Z 4.2 to 5.4)
    {"name": "tail_curve_up", "from": [0.75, 6.95, 4.2], "to": [1.95, 8.35, 5.4], "color": "catStripe", "col_idx": 8},
    # 53. Tail hook arching forward towards head (Y 7.85 to 8.95, Z 3.4 to 4.6)
    {"name": "tail_hook_front", "from": [0.55, 7.85, 3.4], "to": [1.75, 8.95, 4.6], "color": "catOrange", "col_idx": 0},
    # 54. Fluffy white tip curling forward with playful droop (Y 7.35 to 8.55, Z 2.6 to 3.8)
    {"name": "tail_tip_white", "from": [0.35, 7.35, 2.6], "to": [1.55, 8.55, 3.8], "color": "white", "col_idx": 1},
]

issues = check_coplanar(cubes)
print(f"Total cubes: {len(cubes)}")
print(f"Coplanar overlap issues: {len(issues)}")
if issues:
    for i, (c1, c2, plane, area) in enumerate(issues):
        print(f"  {i+1}: {c1} vs {c2} on {plane} ({area})")

with open('scripts/box_cat_v2_zero_zfight.json', 'w') as f:
    json.dump(cubes, f, indent=2)
