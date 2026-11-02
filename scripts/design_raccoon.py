import json
import sys
sys.path.insert(0, 'scripts')
from test_coplanar import check_coplanar

cubes = [
    # --- A. PAWS & LEGS ---
    # 1. Front left black glove
    {"name": "paw_front_left", "from": [-3.15, 0.0, -3.55], "to": [-1.85, 1.15, -2.05], "color": "maskBlack", "col_idx": 2},
    # 2. Front left grey leg (Z -3.50 to -2.10, avoids -3.45 and -2.15)
    {"name": "leg_front_left", "from": [-3.05, 0.95, -3.50], "to": [-1.95, 2.55, -2.10], "color": "raccoonGrey", "col_idx": 0},
    # 3. Front right black glove
    {"name": "paw_front_right", "from": [1.85, 0.0, -3.55], "to": [3.15, 1.15, -2.05], "color": "maskBlack", "col_idx": 2},
    # 4. Front right grey leg (Z -3.50 to -2.10)
    {"name": "leg_front_right", "from": [1.95, 0.95, -3.50], "to": [3.05, 2.55, -2.10], "color": "raccoonGrey", "col_idx": 0},
    # 5. Rear left black foot
    {"name": "paw_rear_left", "from": [-3.15, 0.0, 1.65], "to": [-1.85, 1.15, 3.15], "color": "maskBlack", "col_idx": 2},
    # 6. Rear left grey thigh
    {"name": "thigh_rear_left", "from": [-3.25, 0.95, 1.45], "to": [-1.75, 3.35, 3.35], "color": "raccoonGrey", "col_idx": 0},
    # 7. Rear right black foot
    {"name": "paw_rear_right", "from": [1.85, 0.0, 1.65], "to": [3.15, 1.15, 3.15], "color": "maskBlack", "col_idx": 2},
    # 8. Rear right grey thigh
    {"name": "thigh_rear_right", "from": [1.75, 0.95, 1.45], "to": [3.25, 3.35, 3.35], "color": "raccoonGrey", "col_idx": 0},

    # --- B. TORSO & UNDERBELLY ---
    # 9. Main ash-grey body core
    {"name": "body_core", "from": [-3.35, 2.22, -2.75], "to": [3.35, 6.78, 2.75], "color": "raccoonGrey", "col_idx": 0},
    # 10. White underbelly
    {"name": "body_belly_white", "from": [-2.35, 2.02, -3.45], "to": [2.35, 5.58, -2.15], "color": "white", "col_idx": 1},
    # 11. White chest tuft (from.z -3.62 avoids -3.55)
    {"name": "chest_bib_tuft", "from": [-1.55, 5.22, -3.62], "to": [1.55, 6.58, -2.35], "color": "white", "col_idx": 1},
    # 12. Fluffy rear rump
    {"name": "body_rump", "from": [-2.95, 2.42, 2.55], "to": [2.95, 6.18, 3.75], "color": "raccoonGrey", "col_idx": 0},
    # 13. Left flank fluff
    {"name": "flank_fluff_left", "from": [-3.95, 3.02, -1.75], "to": [-3.15, 5.78, 1.75], "color": "raccoonGrey", "col_idx": 0},
    # 14. Right flank fluff
    {"name": "flank_fluff_right", "from": [3.15, 3.02, -1.75], "to": [3.95, 5.78, 1.75], "color": "raccoonGrey", "col_idx": 0},

    # --- C. HEAD & MISCHIEVOUS BANDIT FACE ---
    # 15. Head core
    {"name": "head_core", "from": [-3.15, 6.22, -2.55], "to": [3.15, 10.78, 2.55], "color": "raccoonGrey", "col_idx": 0},
    # 16. White cheek flare left
    {"name": "cheek_fluff_left", "from": [-4.55, 6.42, -2.35], "to": [-2.95, 8.98, 1.55], "color": "white", "col_idx": 1},
    # 17. White cheek flare right
    {"name": "cheek_fluff_right", "from": [2.95, 6.42, -2.35], "to": [4.55, 8.98, 1.55], "color": "white", "col_idx": 1},
    # 18. White snout muzzle (to.z -2.25 avoids -2.35)
    {"name": "snout_muzzle_white", "from": [-1.55, 6.62, -3.95], "to": [1.55, 8.38, -2.25], "color": "white", "col_idx": 1},
    # 19. White chin under mouth
    {"name": "snout_chin_white", "from": [-1.05, 5.95, -3.55], "to": [1.05, 6.95, -2.45], "color": "white", "col_idx": 1},
    # 20. Black button nose
    {"name": "nose_black_button", "from": [-0.48, 7.58, -4.15], "to": [0.48, 8.28, -3.35], "color": "maskBlack", "col_idx": 2},
    # 21. Bandit mask center bridge
    {"name": "bandit_mask_center", "from": [-0.95, 8.22, -3.55], "to": [0.95, 9.58, -2.35], "color": "maskBlack", "col_idx": 2},
    # 22. Bandit mask left patch
    {"name": "bandit_mask_left", "from": [-3.35, 7.82, -3.15], "to": [-0.85, 9.78, -2.15], "color": "maskBlack", "col_idx": 2},
    # 23. Bandit mask right patch
    {"name": "bandit_mask_right", "from": [0.85, 7.82, -3.15], "to": [3.35, 9.78, -2.15], "color": "maskBlack", "col_idx": 2},
    # 24. White eye sclera ring left
    {"name": "eye_left_sclera", "from": [-2.55, 8.12, -3.25], "to": [-1.25, 9.48, -2.35], "color": "white", "col_idx": 1},
    # 25. Black pupil left
    {"name": "eye_left_pupil", "from": [-2.35, 8.22, -3.35], "to": [-1.35, 9.38, -2.45], "color": "darkCharcoal", "col_idx": 3},
    # 26. White sparkle left (to.z -2.48, to.y 9.30)
    {"name": "eye_left_sparkle", "from": [-2.45, 8.82, -3.45], "to": [-1.75, 9.30, -2.48], "color": "white", "col_idx": 1},
    # 27. White eye sclera ring right
    {"name": "eye_right_sclera", "from": [1.25, 8.12, -3.25], "to": [2.55, 9.48, -2.35], "color": "white", "col_idx": 1},
    # 28. Black pupil right
    {"name": "eye_right_pupil", "from": [1.35, 8.22, -3.35], "to": [2.35, 9.38, -2.45], "color": "darkCharcoal", "col_idx": 3},
    # 29. White sparkle right (to.z -2.48, to.y 9.30)
    {"name": "eye_right_sparkle", "from": [1.75, 8.82, -3.45], "to": [2.45, 9.30, -2.48], "color": "white", "col_idx": 1},
    # 30. Forehead vertical blaze (to.z -1.85 avoids -1.95)
    {"name": "forehead_blaze_dark", "from": [-0.38, 9.22, -2.95], "to": [0.38, 10.98, -1.85], "color": "darkCharcoal", "col_idx": 3},
    # 31. Head crown top
    {"name": "head_crown_top", "from": [-2.55, 10.62, -1.95], "to": [2.55, 11.38, 1.95], "color": "raccoonGrey", "col_idx": 0},
    # 32. White eyebrow tuft left (from.y 9.85 avoids 9.78)
    {"name": "eyebrow_tuft_left", "from": [-2.75, 9.85, -2.95], "to": [-1.15, 10.38, -2.05], "color": "white", "col_idx": 1},
    # 33. White eyebrow tuft right (from.y 9.85 avoids 9.78)
    {"name": "eyebrow_tuft_right", "from": [1.15, 9.85, -2.95], "to": [2.75, 10.38, -2.05], "color": "white", "col_idx": 1},

    # --- D. RACCOON EARS ---
    # 34. Ear base left (from.x -3.10 avoids -3.15)
    {"name": "ear_base_left", "from": [-3.10, 10.58, -1.55], "to": [-1.55, 12.58, 0.55], "color": "darkCharcoal", "col_idx": 3},
    # 35. Ear tip left (white rim)
    {"name": "ear_tip_left", "from": [-2.95, 12.38, -1.25], "to": [-1.75, 13.78, 0.25], "color": "white", "col_idx": 1},
    # 36. Ear inner left (from.y 10.60 penetrates into head 10.78)
    {"name": "ear_inner_left", "from": [-2.75, 10.60, -1.85], "to": [-1.75, 12.25, -1.15], "color": "maskBlack", "col_idx": 2},
    # 37. Ear base right (to.x 3.10 avoids 3.15)
    {"name": "ear_base_right", "from": [1.55, 10.58, -1.55], "to": [3.10, 12.58, 0.55], "color": "darkCharcoal", "col_idx": 3},
    # 38. Ear tip right (white rim)
    {"name": "ear_tip_right", "from": [1.75, 12.38, -1.25], "to": [2.95, 13.78, 0.25], "color": "white", "col_idx": 1},
    # 39. Ear inner right (from.y 10.60 penetrates into head 10.78)
    {"name": "ear_inner_right", "from": [1.75, 10.60, -1.85], "to": [2.75, 12.25, -1.15], "color": "maskBlack", "col_idx": 2},

    # --- E. 5-SEGMENT RINGED FLUFFY TAIL ---
    # 40. Ring 1 (grey base)
    {"name": "tail_ring_1", "from": [-0.95, 2.58, 3.55], "to": [0.95, 4.38, 4.95], "color": "raccoonGrey", "col_idx": 0},
    # 41. Ring 2 (black ring)
    {"name": "tail_ring_2", "from": [-1.15, 3.58, 4.55], "to": [1.15, 5.58, 6.15], "color": "maskBlack", "col_idx": 2},
    # 42. Ring 3 (grey ring)
    {"name": "tail_ring_3", "from": [-1.25, 4.78, 5.55], "to": [1.25, 6.78, 7.15], "color": "raccoonGrey", "col_idx": 0},
    # 43. Ring 4 (black ring)
    {"name": "tail_ring_4", "from": [-1.15, 5.98, 6.15], "to": [1.15, 7.98, 7.75], "color": "maskBlack", "col_idx": 2},
    # 44. Ring 5 (grey ring)
    {"name": "tail_ring_5", "from": [-0.95, 7.18, 5.95], "to": [0.95, 8.98, 7.55], "color": "raccoonGrey", "col_idx": 0},
    # 45. Bushy black tail tip
    {"name": "tail_tip_black", "from": [-0.75, 8.18, 5.15], "to": [0.75, 9.78, 6.75], "color": "maskBlack", "col_idx": 2},

    # --- F. BURLAP LOOT SACK WITH GOLD & RUBY ---
    # 46. Bulging burlap swag bag
    {"name": "loot_bag_body", "from": [-2.35, 3.98, 1.15], "to": [2.35, 7.58, 4.15], "color": "burlapBag", "col_idx": 4},
    # 47. Tied neck of the sack
    {"name": "loot_bag_neck", "from": [-1.55, 7.18, 1.35], "to": [1.55, 8.58, 3.75], "color": "burlapBag", "col_idx": 4},
    # 48. Rope wrapped around sack neck
    {"name": "bag_rope_tie", "from": [-1.72, 8.18, 1.25], "to": [1.72, 8.78, 3.85], "color": "bagRope", "col_idx": 5},
    # 49. Gathered burlap ruffle at sack top (from.y 8.45 penetrates neck 8.58)
    {"name": "bag_ruffle_top", "from": [-1.75, 8.45, 1.45], "to": [1.75, 9.78, 3.65], "color": "burlapBag", "col_idx": 4},
    # 50. Shiny gold coin 1 spilling out (to.z 2.65 avoids 2.55)
    {"name": "loot_gold_coin_1", "from": [0.18, 9.18, 1.55], "to": [1.55, 10.38, 2.65], "color": "goldCoin", "col_idx": 6},
    # 51. Shiny gold coin 2 spilling out
    {"name": "loot_gold_coin_2", "from": [-1.38, 8.98, 1.75], "to": [-0.08, 9.98, 2.75], "color": "goldCoin", "col_idx": 6},
    # 52. Sparkling ruby gem
    {"name": "loot_ruby_gem", "from": [-0.58, 9.58, 2.15], "to": [0.58, 10.58, 3.15], "color": "rubyRed", "col_idx": 7},
]

issues = check_coplanar(cubes)
print(f"Total cubes: {len(cubes)}")
print(f"Coplanar overlap issues: {len(issues)}")
if issues:
    for i, (c1, c2, plane, area) in enumerate(issues):
        print(f"  {i+1}: {c1} vs {c2} on {plane} ({area})")

with open('scripts/raccoon_zero_zfight.json', 'w') as f:
    json.dump(cubes, f, indent=2)
