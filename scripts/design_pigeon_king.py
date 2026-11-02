import json
import sys
sys.path.insert(0, 'scripts')
from test_coplanar import check_coplanar

palette = {
    # Snow-white Pigeon Feathering & Features
    'featherPureWhite': 0xffffff,  # snow-white plumage of the king
    'featherShade': 0xe2e8f0,      # soft shadow / wing feather contrast
    'pigeonBeak': 0xfde047,        # delicate golden/pale bone beak
    'beakCereWhite': 0xffffff,     # chalk-white pigeon cere
    'pigeonFootRed': 0xf43f5e,     # vibrant coral-pink pigeon feet
    'eyeAmber': 0xf59e0b,          # noble amber-golden pigeon iris
    'eyeBlack': 0x09090b,          # pupil
    'sparkleWhite': 0xffffff,      # eye highlight

    # Royal Ermine Velvet Mantle
    'mantleRed': 0x991b1b,         # deep royal crimson velvet
    'ermineFur': 0xf8fafc,         # lush white ermine fur trim
    'ermineSpot': 0x0f172a,        # black ermine tail flecks
    'crownGold': 0xfacc15,         # rich imperial 24K gold
    'crownGoldDark': 0xca8a04,     # shaded gold crenellation
    'royalRuby': 0xdc2626,         # glowing royal ruby gemstone
    'royalSapphire': 0x2563eb,     # sapphire jewel accent

    # Golden French Butter Croissant
    'croissantGold': 0xd97706,     # flaky golden baked pastry
    'croissantCrust': 0xb45309,    # deep toasted butter crust
    'croissantHighlight': 0xfde68a,# warm flaky pastry highlight
}

cubes = [
    # === A. CORAL PINK PIGEON FEET & LEGS (10 cubes, touching ground Y=0) ===
    # 1-2. Left foot base (slightly elevated Y=0.04) & leg shank
    {"name": "foot_base_left", "from": [-2.25, 0.04, -0.65], "to": [-1.45, 0.45, 0.85], "color": "pigeonFootRed"},
    {"name": "leg_shank_left", "from": [-2.05, 0.35, -0.15], "to": [-1.65, 2.55, 0.35], "color": "pigeonFootRed"},
    # 3-5. Left 3 splayed toes on ground (Y=0.00..0.32)
    {"name": "toe_mid_left", "from": [-2.00, 0.00, -1.85], "to": [-1.70, 0.32, -0.55], "color": "pigeonFootRed"},
    {"name": "toe_outer_left", "from": [-2.65, 0.00, -1.55], "to": [-2.15, 0.30, -0.45], "color": "pigeonFootRed"},
    {"name": "toe_inner_left", "from": [-1.55, 0.00, -1.55], "to": [-1.05, 0.30, -0.45], "color": "pigeonFootRed"},

    # 6-7. Right foot base (slightly elevated Y=0.04) & leg shank
    {"name": "foot_base_right", "from": [1.45, 0.04, -0.65], "to": [2.25, 0.45, 0.85], "color": "pigeonFootRed"},
    {"name": "leg_shank_right", "from": [1.65, 0.35, -0.15], "to": [2.05, 2.55, 0.35], "color": "pigeonFootRed"},
    # 8-10. Right 3 splayed toes on ground (Y=0.00..0.32)
    {"name": "toe_mid_right", "from": [1.70, 0.00, -1.85], "to": [2.00, 0.32, -0.55], "color": "pigeonFootRed"},
    {"name": "toe_outer_right", "from": [2.15, 0.00, -1.55], "to": [2.65, 0.30, -0.45], "color": "pigeonFootRed"},
    {"name": "toe_inner_right", "from": [1.05, 0.00, -1.55], "to": [1.55, 0.30, -0.45], "color": "pigeonFootRed"},

    # === B. SNOW-WHITE THIGHS, PLUMP BODY & STEAMING REGAL BREAST (8 cubes) ===
    # 11-12. White thigh fluff emerging above shanks
    {"name": "thigh_fluff_left", "from": [-2.35, 2.35, -0.45], "to": [-1.35, 3.45, 0.65], "color": "featherPureWhite"},
    {"name": "thigh_fluff_right", "from": [1.35, 2.35, -0.45], "to": [2.35, 3.45, 0.65], "color": "featherPureWhite"},
    # 13. Lower belly base
    {"name": "body_lower_belly", "from": [-2.65, 3.25, -1.85], "to": [2.65, 4.45, 2.15], "color": "featherPureWhite"},
    # 14. Main body loaf
    {"name": "body_core_loaf", "from": [-2.55, 4.35, -1.65], "to": [2.55, 7.35, 2.35], "color": "featherPureWhite"},
    # 15-16. Puffed-out pompous pigeon breast (грудь колесом!)
    {"name": "breast_puff_main", "from": [-2.25, 4.75, -2.45], "to": [2.25, 7.25, -1.55], "color": "featherPureWhite"},
    {"name": "breast_puff_upper", "from": [-1.75, 6.75, -2.75], "to": [1.75, 8.45, -1.85], "color": "featherPureWhite"},
    # 17-18. Stepped aristocratic pigeon tail
    {"name": "tail_fan_upper", "from": [-1.35, 3.75, 2.25], "to": [1.35, 4.85, 4.15], "color": "featherPureWhite"},
    {"name": "tail_fan_tip", "from": [-1.05, 3.55, 4.05], "to": [1.05, 4.35, 5.25], "color": "featherShade"},

    # === C. PURE WHITE FOLDED WINGS (4 cubes) ===
    # 19-20. Left wing mantle & primaries
    {"name": "wing_left_upper", "from": [-2.95, 4.55, -0.55], "to": [-2.45, 6.95, 1.95], "color": "featherPureWhite"},
    {"name": "wing_left_primaries", "from": [-2.85, 3.75, 1.35], "to": [-2.25, 4.75, 3.35], "color": "featherShade"},
    # 21-22. Right wing mantle & primaries
    {"name": "wing_right_upper", "from": [2.45, 4.55, -0.55], "to": [2.95, 6.95, 1.95], "color": "featherPureWhite"},
    {"name": "wing_right_primaries", "from": [2.25, 3.75, 1.35], "to": [2.85, 4.75, 3.35], "color": "featherShade"},

    # === D. ROYAL ERMINE VELVET MANTLE (10 cubes) ===
    # 23. Cascading crimson velvet mantle train down back
    {"name": "mantle_train_back", "from": [-2.35, 3.45, 2.30], "to": [2.35, 7.45, 2.75], "color": "mantleRed"},
    # 24-25. Crimson mantle shoulder drapes
    {"name": "mantle_shoulder_left", "from": [-2.75, 6.85, -1.35], "to": [-2.25, 7.85, 1.80], "color": "mantleRed"},
    {"name": "mantle_shoulder_right", "from": [2.25, 6.85, -1.35], "to": [2.75, 7.85, 1.80], "color": "mantleRed"},
    # 26. Luxurious fluffy white ermine fur collar framing neck (starts Y=7.70)
    {"name": "ermine_collar_ring", "from": [-2.45, 7.70, -1.65], "to": [2.45, 8.55, 1.85], "color": "ermineFur"},
    # 27-28. Ermine fur lapels hanging down front over chest
    {"name": "ermine_lapel_left", "from": [-2.15, 6.25, -2.25], "to": [-1.45, 7.75, -1.60], "color": "ermineFur"},
    {"name": "ermine_lapel_right", "from": [1.45, 6.25, -2.25], "to": [2.15, 7.75, -1.60], "color": "ermineFur"},
    # 29-30. Black ermine tail flecks (the iconic royal ermine spots)
    {"name": "ermine_spot_left", "from": [-1.95, 6.55, -2.35], "to": [-1.65, 7.15, -2.15], "color": "ermineSpot"},
    {"name": "ermine_spot_right", "from": [1.65, 6.55, -2.35], "to": [1.95, 7.15, -2.15], "color": "ermineSpot"},
    # 31. Royal gold mantle chain & medallion
    {"name": "mantle_gold_clasp", "from": [-0.55, 7.35, -2.35], "to": [0.55, 7.95, -1.95], "color": "crownGold"},
    # 32. Glowing royal ruby gemstone at center of clasp
    {"name": "mantle_ruby_gem", "from": [-0.25, 7.45, -2.48], "to": [0.25, 7.85, -2.28], "color": "royalRuby"},

    # === E. NOBLE PIGEON HEAD, PUFFED CHEEKS & BEAK (8 cubes) ===
    # 33. White feathered neck
    {"name": "neck_pigeon", "from": [-1.35, 7.65, -1.25], "to": [1.35, 8.95, 0.95], "color": "featherPureWhite"},
    # 34. Noble head core
    {"name": "head_core", "from": [-1.55, 8.65, -1.85], "to": [1.55, 10.95, 1.05], "color": "featherPureWhite"},
    # 35-36. Puffed aristocratic pigeon cheeks
    {"name": "cheek_fluff_left", "from": [-1.85, 8.75, -1.55], "to": [-1.45, 9.95, 0.55], "color": "featherPureWhite"},
    {"name": "cheek_fluff_right", "from": [1.45, 8.75, -1.55], "to": [1.85, 9.95, 0.55], "color": "featherPureWhite"},
    # 37. Pale yellow/bone beak base
    {"name": "beak_base", "from": [-0.55, 8.95, -3.15], "to": [0.55, 9.65, -1.75], "color": "pigeonBeak"},
    # 38. Pale beak tip
    {"name": "beak_tip", "from": [-0.35, 8.85, -3.95], "to": [0.35, 9.45, -3.05], "color": "pigeonBeak"},
    # 39. Chalk-white pigeon cere on top of beak (Z to -1.80)
    {"name": "beak_cere_white", "from": [-0.45, 9.55, -2.85], "to": [0.45, 9.95, -1.80], "color": "beakCereWhite"},
    # 40. Lower beak mandible (starts at Y=8.60 to avoid head Y=8.65)
    {"name": "beak_lower_mandible", "from": [-0.40, 8.60, -3.45], "to": [0.40, 9.05, -1.80], "color": "pigeonBeak"},

    # === F. NOBLE AMBER EYES & SPARKLES (4 cubes) ===
    # 41-42. Noble amber pigeon eyes
    {"name": "eye_left", "from": [-1.65, 9.55, -1.65], "to": [-1.05, 10.35, -0.95], "color": "eyeAmber"},
    {"name": "eye_right", "from": [1.05, 9.55, -1.65], "to": [1.65, 10.35, -0.95], "color": "eyeAmber"},
    # 43-44. White sparkles (staggered X to not clash with head X=±1.55)
    {"name": "sparkle_left", "from": [-1.50, 9.85, -1.75], "to": [-1.20, 10.15, -1.45], "color": "sparkleWhite"},
    {"name": "sparkle_right", "from": [1.20, 9.85, -1.75], "to": [1.50, 10.15, -1.45], "color": "sparkleWhite"},

    # === G. GOLDEN IMPERIAL CROWN (6 cubes) ===
    # 45. Solid gold crown ring/band around head
    {"name": "crown_band", "from": [-1.68, 10.75, -1.75], "to": [1.68, 11.35, 1.15], "color": "crownGold"},
    # 46. Front tall fleur-de-lis crown peak
    {"name": "crown_peak_front", "from": [-0.55, 11.25, -1.85], "to": [0.55, 12.55, -1.15], "color": "crownGold"},
    # 47. Rear fleur-de-lis crown peak
    {"name": "crown_peak_rear", "from": [-0.55, 11.25, 0.45], "to": [0.55, 12.35, 1.22], "color": "crownGold"},
    # 48-49. Left & Right side crown prongs
    {"name": "crown_prong_left", "from": [-1.78, 11.25, -0.55], "to": [-1.08, 12.25, 0.45], "color": "crownGold"},
    {"name": "crown_prong_right", "from": [1.08, 11.25, -0.55], "to": [1.78, 12.25, 0.45], "color": "crownGold"},
    # 50. Imperial glowing ruby gem on the front peak
    {"name": "crown_gem_ruby", "from": [-0.25, 11.55, -1.98], "to": [0.25, 12.05, -1.75], "color": "royalRuby"},

    # === H. GOLDEN FRENCH BUTTER CROISSANT (5 cubes) ===
    # 51. Plump curved croissant center (Z to -2.50 to avoid breast Z=-2.45)
    {"name": "croissant_center", "from": [-0.95, 5.35, -3.45], "to": [0.95, 6.45, -2.50], "color": "croissantGold"},
    # 52-53. Curved croissant horns pointing upward & back (Z to -2.30 to avoid lapels Z=-2.25)
    {"name": "croissant_horn_left", "from": [-1.65, 5.75, -3.15], "to": [-0.85, 6.55, -2.30], "color": "croissantGold"},
    {"name": "croissant_horn_right", "from": [0.85, 5.75, -3.15], "to": [1.65, 6.55, -2.30], "color": "croissantGold"},
    # 54. Flaky browned butter crust ridge (Y to 6.70)
    {"name": "croissant_crust_ridge", "from": [-0.75, 6.35, -3.25], "to": [0.75, 6.70, -2.65], "color": "croissantCrust"},
    # 55. Warm baked pastry highlight on top (Z to -2.78)
    {"name": "croissant_highlight", "from": [-0.55, 6.65, -3.15], "to": [0.55, 6.95, -2.78], "color": "croissantHighlight"},
]

print(f"Total cubes: {len(cubes)}")
issues = check_coplanar(cubes)
print(f"Coplanar overlap issues: {len(issues)}")
for iss in issues:
    print(f"  Overlap: {iss[0]} <-> {iss[1]} at {iss[2]} ({iss[3]})")

with open('scripts/pigeon_king_cubes.json', 'w') as f:
    json.dump(cubes, f, indent=2)
print("Saved scripts/pigeon_king_cubes.json")
