import json
import sys
sys.path.insert(0, 'scripts')
from test_coplanar import check_coplanar

palette = {
    # Rat Body & Fur
    'ratGrey': 0x475569,        # cool slate/charcoal street rat fur
    'bellyLight': 0x94a3b8,     # warm lighter ash underbelly, throat & muzzle
    'ratPink': 0xfecdd3,        # soft pale pink paws, tail, nose & inner ears
    'nosePink': 0xf43f5e,       # distinct vivid pink button nose
    'buckTooth': 0xffffff,      # cute little white rat bucktooth
    'eyeBlack': 0x09090b,       # glossy beady black eyes
    'sparkleWhite': 0xffffff,   # eye sparkles
    
    # Whole Sesame Bagel
    'bagelCrust': 0xb45309,     # golden toasted bagel crust
    'sesameSeed': 0xfef3c7,     # toasted sesame seed speckles

    # Retro Walkman Headphones
    'retroOrange': 0xf97316,    # iconic 80s/90s bright orange foam ear cushions
    'headbandMetal': 0x64748b,  # spring steel silver/grey overhead band
    'cupDark': 0x1e293b,        # dark slate headphone cup casing
}

# 48–54 monolithic cubes, all strictly staggered to ensure coplanar_overlap = 0
cubes = [
    # === A. REAR LEGS & FEET (4 cubes, Y=0 contact) ===
    # 1. Left rear pink foot (planted on ground)
    {"name": "foot_rear_left", "from": [-2.45, 0.0, 0.35], "to": [-1.25, 0.95, 2.65], "color": "ratPink"},
    # 2. Right rear pink foot (planted on ground)
    {"name": "foot_rear_right", "from": [1.25, 0.0, 0.35], "to": [2.45, 0.95, 2.65], "color": "ratPink"},
    # 3. Left rear thigh / haunch
    {"name": "thigh_rear_left", "from": [-2.65, 0.75, 0.15], "to": [-1.45, 3.65, 2.85], "color": "ratGrey"},
    # 4. Right rear thigh / haunch
    {"name": "thigh_rear_right", "from": [1.45, 0.75, 0.15], "to": [2.65, 3.65, 2.85], "color": "ratGrey"},

    # === B. PLUMP PEAR-SHAPED RAT BODY (5 cubes) ===
    # 5. Plump lower belly / torso core
    {"name": "body_lower_core", "from": [-1.85, 0.85, -1.55], "to": [1.85, 4.35, 2.45], "color": "ratGrey"},
    # 6. Light ash belly plate
    {"name": "belly_front_plate", "from": [-1.35, 1.15, -1.95], "to": [1.35, 3.95, -1.35], "color": "bellyLight"},
    # 7. Mid torso / chest
    {"name": "body_mid_chest", "from": [-1.75, 3.85, -1.75], "to": [1.75, 6.65, 1.85], "color": "ratGrey"},
    # 8. Arched rat back ridge
    {"name": "body_back_arch", "from": [-1.45, 5.15, 0.15], "to": [1.45, 6.85, 2.15], "color": "ratGrey"},
    # 9. Plump rump rear
    {"name": "body_rump_rear", "from": [-1.65, 1.35, 2.15], "to": [1.65, 4.15, 3.15], "color": "ratGrey"},

    # === C. LONG RINGED RAT TAIL (4 cubes, trailing & curving) ===
    # 10. Tail root from rump
    {"name": "tail_root", "from": [-0.45, 1.05, 2.95], "to": [0.45, 1.85, 4.15], "color": "ratPink"},
    # 11. Tail mid segment 1 (sloping down)
    {"name": "tail_mid_1", "from": [-0.55, 0.55, 3.95], "to": [0.35, 1.35, 5.35], "color": "ratPink"},
    # 12. Tail mid segment 2 (touching ground)
    {"name": "tail_mid_2", "from": [-0.25, 0.0, 5.15], "to": [0.55, 0.75, 6.45], "color": "ratPink"},
    # 13. Tail curled tip (curls slightly off ground)
    {"name": "tail_curled_tip", "from": [0.35, 0.05, 6.15], "to": [1.25, 0.65, 7.25], "color": "ratPink"},

    # === D. FRONT ARMS & PAWS (4 cubes) ===
    # 14. Left shoulder / arm
    {"name": "arm_front_left", "from": [-2.05, 3.65, -2.15], "to": [-1.25, 5.15, -0.95], "color": "ratGrey"},
    # 15. Right shoulder / arm
    {"name": "arm_front_right", "from": [1.25, 3.65, -2.15], "to": [2.05, 5.15, -0.95], "color": "ratGrey"},
    # 16. Left front paw holding bagel side (wraps around bagel pillar)
    {"name": "paw_front_left", "from": [-1.95, 3.05, -3.55], "to": [-0.75, 4.15, -2.35], "color": "ratPink"},
    # 17. Right front paw holding bagel side (wraps around bagel pillar)
    {"name": "paw_front_right", "from": [0.75, 3.05, -3.55], "to": [1.95, 4.15, -2.35], "color": "ratPink"},

    # === E. WHOLE SESAME BAGEL (7 cubes, with authentic hole in center) ===
    # 18. Bagel bottom rim
    {"name": "bagel_rim_bottom", "from": [-1.45, 2.15, -3.70], "to": [1.45, 3.15, -2.50], "color": "bagelCrust"},
    # 19. Bagel top rim
    {"name": "bagel_rim_top", "from": [-1.45, 4.35, -3.70], "to": [1.45, 5.35, -2.50], "color": "bagelCrust"},
    # 20. Bagel left pillar
    {"name": "bagel_pillar_left", "from": [-1.80, 2.95, -3.80], "to": [-0.90, 4.55, -2.60], "color": "bagelCrust"},
    # 21. Bagel right pillar
    {"name": "bagel_pillar_right", "from": [0.90, 2.95, -3.80], "to": [1.80, 4.55, -2.60], "color": "bagelCrust"},
    # (The region [-0.90, 0.90] x [3.15, 4.35] is an open hole!)
    # 22. Sesame seeds on top rim
    {"name": "sesame_top_cluster", "from": [-1.15, 5.25, -3.65], "to": [1.15, 5.55, -2.65], "color": "sesameSeed"},
    # 23. Sesame seed cluster left
    {"name": "sesame_left_speck", "from": [-1.65, 4.15, -3.95], "to": [-1.05, 4.85, -3.55], "color": "sesameSeed"},
    # 24. Sesame seed cluster right
    {"name": "sesame_right_speck", "from": [1.05, 4.15, -3.95], "to": [1.65, 4.85, -3.55], "color": "sesameSeed"},

    # === F. RAT HEAD, SNOUT & BUCKTOOTH (8 cubes) ===
    # 25. Head core
    {"name": "head_core", "from": [-1.80, 6.05, -3.30], "to": [1.80, 8.75, -0.75], "color": "ratGrey"},
    # 26. Pointed snout bridge
    {"name": "snout_bridge", "from": [-1.15, 6.15, -4.45], "to": [1.15, 7.75, -3.05], "color": "ratGrey"},
    # 27. Muzzle tip (light ash)
    {"name": "muzzle_tip", "from": [-0.75, 6.25, -5.35], "to": [0.75, 7.35, -4.25], "color": "bellyLight"},
    # 28. Button pink nose
    {"name": "nose_button", "from": [-0.35, 6.85, -5.65], "to": [0.35, 7.45, -5.25], "color": "nosePink"},
    # 29. Cute little rodent bucktooth peeking under snout
    {"name": "bucktooth", "from": [-0.25, 5.85, -5.05], "to": [0.25, 6.35, -4.35], "color": "buckTooth"},
    # 30. Throat / chin underside
    {"name": "throat_under", "from": [-0.85, 5.65, -4.15], "to": [0.85, 6.45, -2.35], "color": "bellyLight"},
    # 31-32. Cheeks
    {"name": "cheek_left", "from": [-1.95, 6.25, -3.05], "to": [-1.55, 7.65, -1.35], "color": "ratGrey"},
    {"name": "cheek_right", "from": [1.55, 6.25, -3.05], "to": [1.95, 7.65, -1.35], "color": "ratGrey"},

    # === G. BEADY BLACK EYES & SPARKLES (4 cubes) ===
    # 33-34. Beady Black Eyes (embedded into head)
    {"name": "eye_iris_left", "from": [-1.55, 7.25, -3.85], "to": [-0.85, 8.05, -3.15], "color": "eyeBlack"},
    {"name": "eye_iris_right", "from": [0.85, 7.25, -3.85], "to": [1.55, 8.05, -3.15], "color": "eyeBlack"},
    # 35-36. White Eye Glints
    {"name": "eye_sparkle_left", "from": [-1.45, 7.65, -3.95], "to": [-1.05, 7.95, -3.75], "color": "sparkleWhite"},
    {"name": "eye_sparkle_right", "from": [1.05, 7.65, -3.95], "to": [1.45, 7.95, -3.75], "color": "sparkleWhite"},

    # === H. BIG ROUND RAT EARS (4 cubes) ===
    # 37-38. Outer Ears (grey)
    {"name": "ear_outer_left", "from": [-2.45, 8.15, -1.85], "to": [-1.65, 9.75, -0.65], "color": "ratGrey"},
    {"name": "ear_outer_right", "from": [1.65, 8.15, -1.85], "to": [2.45, 9.75, -0.65], "color": "ratGrey"},
    # 39-40. Inner Ears (pink)
    {"name": "ear_inner_left", "from": [-2.35, 8.35, -1.75], "to": [-1.70, 9.55, -0.85], "color": "ratPink"},
    {"name": "ear_inner_right", "from": [1.70, 8.35, -1.75], "to": [2.35, 9.55, -0.85], "color": "ratPink"},

    # === I. RETRO WALKMAN HEADPHONES (7 cubes) ===
    # 41. Overhead metal headband arch
    {"name": "headband_top", "from": [-1.55, 8.95, -2.05], "to": [1.55, 9.35, -1.35], "color": "headbandMetal"},
    # 42-43. Headband side arms
    {"name": "headband_arm_left", "from": [-2.25, 7.95, -1.95], "to": [-1.45, 9.05, -1.45], "color": "headbandMetal"},
    {"name": "headband_arm_right", "from": [1.45, 7.95, -1.95], "to": [2.25, 9.05, -1.45], "color": "headbandMetal"},
    # 44-45. Iconic Retro Orange Foam Ear Cushions
    {"name": "earpad_orange_left", "from": [-2.75, 6.85, -2.35], "to": [-2.05, 8.45, -1.05], "color": "retroOrange"},
    {"name": "earpad_orange_right", "from": [2.05, 6.85, -2.35], "to": [2.75, 8.45, -1.05], "color": "retroOrange"},
    # 46-47. Dark outer cup casings
    {"name": "cup_casing_left", "from": [-2.95, 7.15, -2.15], "to": [-2.65, 8.15, -1.25], "color": "cupDark"},
    {"name": "cup_casing_right", "from": [2.65, 7.15, -2.15], "to": [2.95, 8.15, -1.25], "color": "cupDark"},
]

print(f"Total cubes: {len(cubes)}")
issues = check_coplanar(cubes)
print(f"Coplanar overlap issues: {len(issues)}")
for iss in issues:
    print(f"  Overlap: {iss[0]} <-> {iss[1]} at {iss[2]} ({iss[3]})")

with open('scripts/subway_rat_cubes.json', 'w') as f:
    json.dump(cubes, f, indent=2)

print("Saved to scripts/subway_rat_cubes.json")
