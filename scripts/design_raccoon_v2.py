import json
import sys
sys.path.insert(0, 'scripts')
from test_coplanar import check_coplanar

cubes = [
    # --- A. FRONT LIMBS & CUTE BANDIT PAWS (8 cubes) ---
    # 1. Left shoulder
    {"name": "arm_shoulder_left", "from": [-3.85, 3.85, -2.85], "to": [-2.75, 6.25, -1.25], "color": "raccoonGrey", "col_idx": 0},
    # 2. Left forearm angled forward
    {"name": "arm_forearm_left", "from": [-3.65, 1.45, -3.85], "to": [-2.45, 4.05, -2.25], "color": "raccoonGrey", "col_idx": 0},
    # 3. Left black glove paw
    {"name": "paw_glove_left", "from": [-3.55, 0.0, -4.35], "to": [-2.15, 1.65, -2.55], "color": "maskBlack", "col_idx": 2},
    # 4. Left cute paw digits
    {"name": "paw_fingers_left", "from": [-3.35, 0.05, -4.95], "to": [-2.35, 0.85, -4.25], "color": "maskBlack", "col_idx": 2},

    # 5. Right shoulder
    {"name": "arm_shoulder_right", "from": [2.75, 3.85, -2.85], "to": [3.85, 6.25, -1.25], "color": "raccoonGrey", "col_idx": 0},
    # 6. Right forearm angled forward
    {"name": "arm_forearm_right", "from": [2.45, 1.45, -3.85], "to": [3.65, 4.05, -2.25], "color": "raccoonGrey", "col_idx": 0},
    # 7. Right black glove paw
    {"name": "paw_glove_right", "from": [2.15, 0.0, -4.35], "to": [3.55, 1.65, -2.55], "color": "maskBlack", "col_idx": 2},
    # 8. Right cute paw digits
    {"name": "paw_fingers_right", "from": [2.35, 0.05, -4.95], "to": [3.35, 0.85, -4.25], "color": "maskBlack", "col_idx": 2},

    # --- B. REAR LIMBS & STURDY HAUNCHES (4 cubes) ---
    # 9. Rear left sturdy thigh
    {"name": "thigh_rear_left", "from": [-3.75, 1.15, 1.15], "to": [-2.25, 4.15, 3.45], "color": "raccoonGrey", "col_idx": 0},
    # 10. Rear left boot paw
    {"name": "paw_rear_left", "from": [-3.55, 0.0, 1.25], "to": [-2.15, 1.45, 3.65], "color": "maskBlack", "col_idx": 2},
    # 11. Rear right sturdy thigh
    {"name": "thigh_rear_right", "from": [2.25, 1.15, 1.15], "to": [3.75, 4.15, 3.45], "color": "raccoonGrey", "col_idx": 0},
    # 12. Rear right boot paw
    {"name": "paw_rear_right", "from": [2.15, 0.0, 1.25], "to": [3.55, 1.45, 3.65], "color": "maskBlack", "col_idx": 2},

    # --- C. CHUNKY RACCOON TORSO & HARNESS (5 cubes) ---
    # 13. Ash-grey torso core
    {"name": "body_core", "from": [-3.55, 2.55, -2.95], "to": [3.55, 7.65, 2.95], "color": "raccoonGrey", "col_idx": 0},
    # 14. Plump white underbelly
    {"name": "body_belly_white", "from": [-2.55, 2.35, -3.75], "to": [2.55, 6.45, -2.35], "color": "white", "col_idx": 1},
    # 15. White chest bib tuft
    {"name": "chest_bib_tuft", "from": [-1.85, 5.95, -3.95], "to": [1.85, 7.35, -2.55], "color": "white", "col_idx": 1},
    # 16. Backpack left harness strap
    {"name": "strap_left", "from": [-2.85, 4.25, -3.35], "to": [-1.95, 7.75, -2.62], "color": "darkCharcoal", "col_idx": 3},
    # 17. Backpack right harness strap
    {"name": "strap_right", "from": [1.95, 4.25, -3.35], "to": [2.85, 7.75, -2.62], "color": "darkCharcoal", "col_idx": 3},

    # --- D. HEAD & CONTOURED TEXTURED CHEEKS (9 cubes) ---
    # 18. Head core
    {"name": "head_core", "from": [-3.35, 7.15, -2.75], "to": [3.35, 11.95, 2.75], "color": "raccoonGrey", "col_idx": 0},
    # 19. Left cheek upper tier
    {"name": "cheek_upper_left", "from": [-4.35, 8.45, -2.25], "to": [-3.15, 10.35, 1.45], "color": "white", "col_idx": 1},
    # 20. Left cheek lower flared tuft
    {"name": "cheek_lower_left", "from": [-4.85, 7.25, -2.45], "to": [-3.25, 8.75, 0.95], "color": "white", "col_idx": 1},
    # 21. Right cheek upper tier
    {"name": "cheek_upper_right", "from": [3.15, 8.45, -2.25], "to": [4.35, 10.35, 1.45], "color": "white", "col_idx": 1},
    # 22. Right cheek lower flared tuft
    {"name": "cheek_lower_right", "from": [3.25, 7.25, -2.45], "to": [4.85, 8.75, 0.95], "color": "white", "col_idx": 1},
    # 23. Snout muzzle white
    {"name": "snout_muzzle_white", "from": [-1.75, 7.45, -4.25], "to": [1.75, 9.45, -2.45], "color": "white", "col_idx": 1},
    # 24. Snout chin white
    {"name": "snout_chin_white", "from": [-1.25, 6.75, -3.75], "to": [1.25, 7.85, -2.65], "color": "white", "col_idx": 1},
    # 25. Cute black button nose
    {"name": "nose_black_button", "from": [-0.55, 8.55, -4.45], "to": [0.55, 9.35, -3.65], "color": "maskBlack", "col_idx": 2},
    # 26. Head crown top
    {"name": "head_crown_top", "from": [-2.75, 11.75, -2.15], "to": [2.75, 12.55, 2.15], "color": "raccoonGrey", "col_idx": 0},

    # --- E. PERKY RACCOON EARS (6 cubes) ---
    # 27. Ear base left
    {"name": "ear_base_left", "from": [-3.25, 11.65, -1.65], "to": [-1.65, 13.85, 0.65], "color": "darkCharcoal", "col_idx": 3},
    # 28. Ear tip left
    {"name": "ear_tip_left", "from": [-3.05, 13.55, -1.35], "to": [-1.85, 15.15, 0.35], "color": "white", "col_idx": 1},
    # 29. Ear inner left
    {"name": "ear_inner_left", "from": [-2.85, 12.05, -1.95], "to": [-1.85, 13.45, -1.25], "color": "maskBlack", "col_idx": 2},
    # 30. Ear base right
    {"name": "ear_base_right", "from": [1.65, 11.65, -1.65], "to": [3.25, 13.85, 0.65], "color": "darkCharcoal", "col_idx": 3},
    # 31. Ear tip right
    {"name": "ear_tip_right", "from": [1.85, 13.55, -1.35], "to": [3.05, 15.15, 0.35], "color": "white", "col_idx": 1},
    # 32. Ear inner right
    {"name": "ear_inner_right", "from": [1.85, 12.05, -1.95], "to": [2.85, 13.45, -1.25], "color": "maskBlack", "col_idx": 2},

    # --- F. TACTICAL NIGHT VISION GOGGLES (CLEAN EMERALD, NO WHITE SPECULAR!) (7 cubes) ---
    # 33. NVG headband strap left
    {"name": "nvg_strap_left", "from": [-3.55, 9.25, -2.65], "to": [-3.20, 10.55, 2.65], "color": "maskBlack", "col_idx": 2},
    # 34. NVG headband strap right
    {"name": "nvg_strap_right", "from": [3.20, 9.25, -2.65], "to": [3.55, 10.55, 2.65], "color": "maskBlack", "col_idx": 2},
    # 35. NVG bridge mount
    {"name": "nvg_bridge_mount", "from": [-1.05, 9.25, -3.95], "to": [1.05, 10.65, -2.55], "color": "maskBlack", "col_idx": 2},
    # 36. NVG tube barrel left
    {"name": "nvg_tube_left", "from": [-2.95, 8.85, -4.75], "to": [-1.25, 10.75, -3.25], "color": "darkCharcoal", "col_idx": 3},
    # 37. Pure glowing emerald green lens left
    {"name": "nvg_lens_green_left", "from": [-2.75, 9.05, -5.05], "to": [-1.45, 10.55, -4.65], "color": "nvgGreen", "col_idx": 8},
    # 38. NVG tube barrel right
    {"name": "nvg_tube_right", "from": [1.25, 8.85, -4.75], "to": [2.95, 10.75, -3.25], "color": "darkCharcoal", "col_idx": 3},
    # 39. Pure glowing emerald green lens right
    {"name": "nvg_lens_green_right", "from": [1.45, 9.05, -5.05], "to": [2.75, 10.55, -4.65], "color": "nvgGreen", "col_idx": 8},

    # --- G. FLUFFY STRIPED TAIL (CENTERED AT X=0 BEHIND RUMP, FLOWS STRAIGHT BACK & UP) (6 cubes) ---
    # 40. Ring 1: Anchored directly into raccoon pelvis rump beneath sack
    {"name": "tail_ring_1", "from": [-1.05, 1.25, 2.45], "to": [1.05, 2.75, 4.05], "color": "raccoonGrey", "col_idx": 0},
    # 41. Ring 2: Flowing straight back along ground
    {"name": "tail_ring_2", "from": [-1.25, 0.95, 3.85], "to": [1.25, 2.45, 5.45], "color": "maskBlack", "col_idx": 2},
    # 42. Ring 3: Plump fluffy mid-tail
    {"name": "tail_ring_3", "from": [-1.35, 0.85, 5.25], "to": [1.35, 2.55, 6.85], "color": "raccoonGrey", "col_idx": 0},
    # 43. Ring 4: Curving upward
    {"name": "tail_ring_4", "from": [-1.25, 1.25, 6.65], "to": [1.25, 3.05, 8.05], "color": "maskBlack", "col_idx": 2},
    # 44. Ring 5: Arching higher
    {"name": "tail_ring_5", "from": [-1.15, 2.15, 7.65], "to": [1.15, 3.95, 8.85], "color": "raccoonGrey", "col_idx": 0},
    # 45. Tail tip: Fluffy black tip waving perkily
    {"name": "tail_tip_black", "from": [-0.95, 3.35, 8.35], "to": [0.95, 5.05, 9.35], "color": "maskBlack", "col_idx": 2},

    # --- H. SYMMETRIC BURGLAR LOOT SACK & BURSTING TREASURE (8 cubes) ---
    # 46. Plump sack body centered on back
    {"name": "loot_sack_belly", "from": [-2.55, 3.45, 1.85], "to": [2.55, 7.55, 5.45], "color": "burlapBag", "col_idx": 4},
    # 47. Sack upper volume
    {"name": "loot_sack_upper", "from": [-2.35, 7.35, 2.05], "to": [2.35, 9.45, 5.25], "color": "burlapBag", "col_idx": 4},
    # 48. Sack rear rounded bulge
    {"name": "loot_sack_rear_bulge", "from": [-1.85, 4.25, 5.25], "to": [1.85, 7.05, 6.35], "color": "burlapBag", "col_idx": 4},
    # 49. Tied rope cinch neck
    {"name": "loot_sack_cinch", "from": [-1.75, 9.25, 2.35], "to": [1.75, 9.95, 4.95], "color": "bagRope", "col_idx": 5},
    # 50. Open ruffled collar/mouth rim
    {"name": "loot_sack_ruffle", "from": [-2.05, 9.75, 2.15], "to": [2.05, 10.55, 5.15], "color": "burlapBag", "col_idx": 4},
    # 51. Shiny Gold Bullion peeking out of sack mouth
    {"name": "loot_gold_bar", "from": [0.25, 10.25, 2.55], "to": [1.65, 11.65, 4.35], "color": "goldCoin", "col_idx": 6},
    # 52. Big Gold Coin spilling over sack rim
    {"name": "loot_gold_coin", "from": [-1.65, 10.15, 2.55], "to": [-0.25, 11.55, 4.15], "color": "goldCoin", "col_idx": 6},
    # 53. Sparkling Ruby Gem centered atop the treasure pile
    {"name": "loot_ruby_gem", "from": [-0.75, 10.35, 2.85], "to": [0.75, 12.05, 4.65], "color": "rubyRed", "col_idx": 7},
]

issues = check_coplanar(cubes)
print(f"Total cubes: {len(cubes)}")
print(f"Coplanar overlap issues: {len(issues)}")
if issues:
    for i, (c1, c2, plane, area) in enumerate(issues):
        print(f"  {i+1}: {c1} vs {c2} on {plane} ({area})")

with open('scripts/raccoon_v2_zero_zfight.json', 'w') as f:
    json.dump(cubes, f, indent=2)
