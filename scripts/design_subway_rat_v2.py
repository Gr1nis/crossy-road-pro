import json
import sys
sys.path.insert(0, 'scripts')
from test_coplanar import check_coplanar

palette = {
    'ratGrey': 0x475569,        # cool slate/charcoal street rat fur
    'bellyLight': 0x94a3b8,     # warm lighter ash underbelly, throat & muzzle
    'ratPink': 0xfecdd3,        # soft pale pink paws, tail, nose & inner ears
    'nosePink': 0xf43f5e,       # distinct vivid pink button nose
    'buckTooth': 0xffffff,      # cute little white rat bucktooth
    'eyeBlack': 0x09090b,       # glossy beady black eyes
    'sparkleWhite': 0xffffff,   # eye sparkles
    'bagelCrust': 0xb45309,     # golden toasted bagel crust
    'sesameSeed': 0xfef3c7,     # toasted sesame seed speckles
    'retroOrange': 0xf97316,    # iconic 80s/90s bright orange foam ear cushions
    'headbandMetal': 0x64748b,  # spring steel silver/grey overhead band
    'cupDark': 0x1e293b,        # dark slate headphone cup casing
}

cubes = [
    # === A. REAR LEGS & ARTICULATED FEET (8 cubes, Y=0 contact) ===
    # 1-2. Sturdy rear thighs / haunches (sitting rat posture)
    {"name": "thigh_rear_left", "from": [-2.75, 0.55, 0.45], "to": [-1.55, 3.65, 2.85], "color": "ratGrey"},
    {"name": "thigh_rear_right", "from": [1.55, 0.55, 0.45], "to": [2.75, 3.65, 2.85], "color": "ratGrey"},

    # 3-4. Lower legs / ankles (grey fur)
    {"name": "ankle_rear_left", "from": [-2.55, 0.35, 0.75], "to": [-1.65, 1.45, 2.15], "color": "ratGrey"},
    {"name": "ankle_rear_right", "from": [1.65, 0.35, 0.75], "to": [2.55, 1.45, 2.15], "color": "ratGrey"},

    # 5-6. Pink foot heel / sole
    {"name": "foot_heel_left", "from": [-2.40, 0.0, -0.65], "to": [-1.45, 0.65, 1.45], "color": "ratPink"},
    {"name": "foot_heel_right", "from": [1.45, 0.0, -0.65], "to": [2.40, 0.65, 1.45], "color": "ratPink"},

    # 7-8. Pink toes spreading forward (slightly raised claws, Y: 0.05..0.50)
    {"name": "toes_front_left", "from": [-2.55, 0.05, -1.65], "to": [-1.35, 0.50, -0.55], "color": "ratPink"},
    {"name": "toes_front_right", "from": [1.35, 0.05, -1.65], "to": [2.55, 0.50, -0.55], "color": "ratPink"},

    # === B. ORGANIC PEAR-SHAPED BODY (NO WEIRD HUMP, SOLID NECK) (6 cubes) ===
    # 9. Plump lower torso / pelvis
    {"name": "body_lower_core", "from": [-2.15, 0.75, -1.45], "to": [2.15, 4.25, 2.65], "color": "ratGrey"},
    # 10. Warm light ash belly plate
    {"name": "belly_front_plate", "from": [-1.55, 1.15, -1.85], "to": [1.55, 3.95, -1.25], "color": "bellyLight"},
    # 11. Mid torso & ribcage
    {"name": "body_mid_chest", "from": [-2.00, 3.75, -1.75], "to": [2.00, 6.45, 2.25], "color": "ratGrey"},
    # 12. Broad muscular shoulder/neck transition (eliminates narrow neck!)
    {"name": "shoulders_neck_base", "from": [-1.95, 5.25, -2.45], "to": [1.95, 6.85, -0.75], "color": "ratGrey"},
    # 13. Smooth, natural arched rat back slope (blended into body, NOT a sharp hump!)
    {"name": "body_back_slope", "from": [-1.85, 5.75, -0.85], "to": [1.85, 6.95, 1.95], "color": "ratGrey"},
    # 14. Plump rear rump
    {"name": "body_rump_rear", "from": [-1.85, 1.35, 2.35], "to": [1.85, 4.15, 3.25], "color": "ratGrey"},

    # === C. LONG RINGED RAT TAIL (4 cubes, trailing & curving) ===
    # 15. Tail root from rump
    {"name": "tail_root", "from": [-0.45, 1.05, 3.05], "to": [0.45, 1.85, 4.25], "color": "ratPink"},
    # 16. Tail mid segment 1 (sloping down)
    {"name": "tail_mid_1", "from": [-0.55, 0.55, 4.05], "to": [0.35, 1.35, 5.45], "color": "ratPink"},
    # 17. Tail mid segment 2 (touching ground)
    {"name": "tail_mid_2", "from": [-0.25, 0.0, 5.25], "to": [0.55, 0.75, 6.55], "color": "ratPink"},
    # 18. Tail curled tip
    {"name": "tail_curled_tip", "from": [0.35, 0.05, 6.25], "to": [1.25, 0.65, 7.35], "color": "ratPink"},

    # === D. FULLY CONNECTED FRONT ARMS & PAWS (6 cubes, NO LEVITATION) ===
    # 19-20. Upper arms attached solidly to shoulders/chest
    {"name": "arm_upper_left", "from": [-2.25, 3.65, -2.25], "to": [-1.45, 5.35, -0.85], "color": "ratGrey"},
    {"name": "arm_upper_right", "from": [1.45, 3.65, -2.25], "to": [2.25, 5.35, -0.85], "color": "ratGrey"},

    # 21-22. Forearms reaching forward and down to hold bagel comfortably in front of belly
    {"name": "arm_forearm_left", "from": [-2.05, 2.45, -3.15], "to": [-1.25, 3.85, -1.95], "color": "ratGrey"},
    {"name": "arm_forearm_right", "from": [1.25, 2.45, -3.15], "to": [2.05, 3.85, -1.95], "color": "ratGrey"},

    # 23-24. Pink front paws gripping bagel sides (solidly wrapping around pillars)
    {"name": "paw_front_left", "from": [-1.95, 2.25, -3.85], "to": [-0.75, 3.25, -2.85], "color": "ratPink"},
    {"name": "paw_front_right", "from": [0.75, 2.25, -3.85], "to": [1.95, 3.25, -2.85], "color": "ratPink"},

    # === E. WHOLE SESAME BAGEL (7 cubes, positioned cleanly BELOW chin & bucktooth) ===
    # 25. Bagel bottom rim (resting above feet, in front of belly)
    {"name": "bagel_rim_bottom", "from": [-1.45, 1.35, -3.70], "to": [1.45, 2.35, -2.50], "color": "bagelCrust"},
    # 26. Bagel top rim (comfortably below chin Y=5.35)
    {"name": "bagel_rim_top", "from": [-1.45, 3.55, -3.70], "to": [1.45, 4.45, -2.50], "color": "bagelCrust"},
    # 27. Bagel left pillar
    {"name": "bagel_pillar_left", "from": [-1.80, 2.15, -3.80], "to": [-0.90, 3.75, -2.60], "color": "bagelCrust"},
    # 28. Bagel right pillar
    {"name": "bagel_pillar_right", "from": [0.90, 2.15, -3.80], "to": [1.80, 3.75, -2.60], "color": "bagelCrust"},
    # 29. Sesame seeds on top rim (peak at Y=4.75, strictly below chin Y=5.35 - NO INTERSECTION!)
    {"name": "sesame_top_cluster", "from": [-1.15, 4.35, -3.65], "to": [1.15, 4.75, -2.65], "color": "sesameSeed"},
    # 30. Sesame seed cluster left
    {"name": "sesame_left_speck", "from": [-1.65, 3.35, -3.95], "to": [-1.05, 4.05, -3.55], "color": "sesameSeed"},
    # 31. Sesame seed cluster right
    {"name": "sesame_right_speck", "from": [1.05, 3.35, -3.95], "to": [1.65, 4.05, -3.55], "color": "sesameSeed"},

    # === F. RAT HEAD, LOWERED SNOUT (BELOW EYES) & BUCKTOOTH (8 cubes) ===
    # 32. Head core
    {"name": "head_core", "from": [-1.90, 6.05, -2.85], "to": [1.90, 8.85, -0.35], "color": "ratGrey"},
    # 33. Lowered snout bridge (Y: 5.75..7.15, strictly BELOW eyes!)
    {"name": "snout_bridge", "from": [-1.25, 5.75, -4.35], "to": [1.25, 7.15, -2.65], "color": "ratGrey"},
    # 34. Muzzle tip (light ash, below eyes)
    {"name": "muzzle_tip", "from": [-0.85, 5.85, -5.25], "to": [0.85, 6.95, -4.15], "color": "bellyLight"},
    # 35. Button pink nose (at very front of snout, strictly below eyes)
    {"name": "nose_button", "from": [-0.40, 6.45, -5.65], "to": [0.40, 7.05, -5.15], "color": "nosePink"},
    # 36. Cute white rodent bucktooth peeking under snout
    {"name": "bucktooth", "from": [-0.25, 5.45, -4.95], "to": [0.25, 5.95, -4.25], "color": "buckTooth"},
    # 37. Throat / chin underside (light ash)
    {"name": "throat_under", "from": [-0.95, 5.35, -3.85], "to": [0.95, 6.15, -2.25], "color": "bellyLight"},
    # 38-39. Cheeks
    {"name": "cheek_left", "from": [-2.10, 6.25, -2.75], "to": [-1.65, 7.65, -1.15], "color": "ratGrey"},
    {"name": "cheek_right", "from": [1.65, 6.25, -2.75], "to": [2.10, 7.65, -1.15], "color": "ratGrey"},

    # === G. BEADY BLACK EYES & SPARKLES (ON FOREHEAD, UNBLOCKED) (4 cubes) ===
    # Eyes sit cleanly on upper face (Y: 7.25..8.25), unobstructed by the lowered snout!
    # 40-41. Beady Black Eyes
    {"name": "eye_iris_left", "from": [-1.65, 7.35, -3.45], "to": [-0.95, 8.25, -2.75], "color": "eyeBlack"},
    {"name": "eye_iris_right", "from": [0.95, 7.35, -3.45], "to": [1.65, 8.25, -2.75], "color": "eyeBlack"},
    # 42-43. White Eye Glints
    {"name": "eye_sparkle_left", "from": [-1.55, 7.75, -3.55], "to": [-1.15, 8.15, -3.35], "color": "sparkleWhite"},
    {"name": "eye_sparkle_right", "from": [1.15, 7.75, -3.55], "to": [1.55, 8.15, -3.35], "color": "sparkleWhite"},

    # === H. BIG ROUND RAT EARS (ROOTED IN HEAD BEHIND HEADPHONES) (4 cubes) ===
    # Ears sit high and back on the skull (Z: -0.95..0.45, Y: 8.55..10.15) — completely separate from headphones!
    # 44-45. Outer Ears (grey fur)
    {"name": "ear_outer_left", "from": [-2.45, 8.55, -0.95], "to": [-1.65, 10.15, 0.45], "color": "ratGrey"},
    {"name": "ear_outer_right", "from": [1.65, 8.55, -0.95], "to": [2.45, 10.15, 0.45], "color": "ratGrey"},
    # 46-47. Inner Ears (pink)
    {"name": "ear_inner_left", "from": [-2.35, 8.75, -0.85], "to": [-1.70, 9.95, 0.25], "color": "ratPink"},
    {"name": "ear_inner_right", "from": [1.70, 8.75, -0.85], "to": [2.35, 9.95, 0.25], "color": "ratPink"},

    # === I. RETRO WALKMAN HEADPHONES (SEPARATE ACCESSORY WORN ON SIDES) (7 cubes) ===
    # Headband passes over the top/front of the head (Z: -2.05..-1.35)
    # 48. Overhead metal headband arch
    {"name": "headband_top", "from": [-1.65, 8.95, -2.05], "to": [1.65, 9.45, -1.35], "color": "headbandMetal"},
    # 49-50. Headband side arms
    {"name": "headband_arm_left", "from": [-2.35, 7.75, -1.95], "to": [-1.55, 9.05, -1.45], "color": "headbandMetal"},
    {"name": "headband_arm_right", "from": [1.55, 7.75, -1.95], "to": [2.35, 9.05, -1.45], "color": "headbandMetal"},
    # 51-52. Iconic Retro Orange Foam Ear Cushions (on sides of temporal skull, below ears)
    {"name": "earpad_orange_left", "from": [-2.85, 6.75, -2.35], "to": [-2.15, 8.35, -1.05], "color": "retroOrange"},
    {"name": "earpad_orange_right", "from": [2.15, 6.75, -2.35], "to": [2.85, 8.35, -1.05], "color": "retroOrange"},
    # 53-54. Dark outer cup casings
    {"name": "cup_casing_left", "from": [-3.05, 7.05, -2.15], "to": [-2.75, 8.05, -1.25], "color": "cupDark"},
    {"name": "cup_casing_right", "from": [2.75, 7.05, -2.15], "to": [3.05, 8.05, -1.25], "color": "cupDark"},
]

print(f"Total cubes: {len(cubes)}")
issues = check_coplanar(cubes)
print(f"Coplanar overlap issues: {len(issues)}")
for iss in issues:
    print(f"  Overlap: {iss[0]} <-> {iss[1]} at {iss[2]} ({iss[3]})")

with open('scripts/subway_rat_cubes_v2.json', 'w') as f:
    json.dump(cubes, f, indent=2)

print("Saved to scripts/subway_rat_cubes_v2.json")
