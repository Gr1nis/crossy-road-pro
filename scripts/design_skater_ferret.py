import json
import sys
sys.path.insert(0, 'scripts')
from test_coplanar import check_coplanar

palette = {
    # Ferret Fur & Features
    'ferretCream': 0xfef3c7,    # warm cream cheeks, throat, muzzle, ear insides
    'ferretSable': 0x573419,    # rich sable brown body, neck, back, tail base
    'ferretDark': 0x29180c,     # dark espresso bandit eye mask, paws, tail tip
    'nosePink': 0xfb7185,       # cute pink button nose
    'eyeBlack': 0x09090b,       # glossy black bead eyes
    'sparkleWhite': 0xffffff,   # eye sparkles & stylish skater forelock tuft
    
    # Street Skater Backwards Cap & Matching Deck
    'capRed': 0xdc2626,         # vibrant red snapback cap & matching red skateboard deck
    'goldButton': 0xfacc15,     # snapback crown button & matching deck gold graphic stripe
    'fireRed': 0xef4444,        # fiery flame red 54mm urethane wheels

    # Skateboard Gear
    'gripTape': 0x18181b,       # coarse dark grip tape
    'truckSilver': 0x94a3b8,    # aluminum metal axle trucks
    'truckDark': 0x475569,      # truck baseplates & bushings
}

# Coordinate definitions (all staggered to avoid coplanar overlap)
cubes = [
    # === A. SKATEBOARD MATCHING CAP RED (15 cubes) ===
    # 1-4. Four Fiery Red Urethane Wheels (touching ground Y=0)
    {"name": "wheel_fl", "from": [-2.75, 0.0, -4.45], "to": [-1.85, 1.15, -3.25], "color": "fireRed"},
    {"name": "wheel_fr", "from": [1.85, 0.0, -4.45], "to": [2.75, 1.15, -3.25], "color": "fireRed"},
    {"name": "wheel_rl", "from": [-2.75, 0.0, 3.25], "to": [-1.85, 1.15, 4.45], "color": "fireRed"},
    {"name": "wheel_rr", "from": [1.85, 0.0, 3.25], "to": [2.75, 1.15, 4.45], "color": "fireRed"},

    # 5-6. Metal Axles (trucks connecting wheels)
    {"name": "truck_axle_front", "from": [-2.05, 0.45, -4.05], "to": [2.05, 0.95, -3.65], "color": "truckSilver"},
    {"name": "truck_axle_rear", "from": [-2.05, 0.45, 3.65], "to": [2.05, 0.95, 4.05], "color": "truckSilver"},

    # 7-8. Truck Baseplates / Bushings (mounting to deck)
    {"name": "truck_base_front", "from": [-1.15, 0.85, -4.25], "to": [1.15, 1.65, -3.45], "color": "truckDark"},
    {"name": "truck_base_rear", "from": [-1.15, 0.85, 3.45], "to": [1.15, 1.65, 4.25], "color": "truckDark"},

    # 9. Skateboard Deck Core (matching vibrant cap red)
    {"name": "deck_core", "from": [-2.45, 1.55, -5.25], "to": [2.45, 2.15, 5.25], "color": "capRed"},

    # 10-11. Deck Angled Kicks (Nose & Tail) - matching cap red
    {"name": "deck_kick_nose", "from": [-2.25, 1.85, -6.15], "to": [2.25, 2.55, -5.10], "color": "capRed"},
    {"name": "deck_kick_tail", "from": [-2.25, 1.85, 5.10], "to": [2.25, 2.55, 6.15], "color": "capRed"},

    # 12-14. Grip Tape (dark textured deck top)
    {"name": "grip_tape_main", "from": [-2.25, 2.05, -5.05], "to": [2.25, 2.25, 5.05], "color": "gripTape"},
    {"name": "grip_tape_nose", "from": [-2.05, 2.35, -5.95], "to": [2.05, 2.65, -4.90], "color": "gripTape"},
    {"name": "grip_tape_tail", "from": [-2.05, 2.35, 4.90], "to": [2.05, 2.65, 5.95], "color": "gripTape"},

    # 15. Skateboard Bottom Graphic Stripe (matching gold snapback button)
    {"name": "deck_graphic_stripe", "from": [-1.25, 1.35, -3.05], "to": [1.25, 1.65, 3.05], "color": "goldButton"},

    # === B. FERRET PAWS & CROUCHING STANCE (8 cubes) ===
    # 16-19. Four Paws Planted on Deck Grip Tape
    {"name": "paw_front_left", "from": [-2.15, 2.20, -3.65], "to": [-1.05, 3.35, -2.15], "color": "ferretDark"},
    {"name": "paw_front_right", "from": [1.05, 2.20, -3.65], "to": [2.15, 3.35, -2.15], "color": "ferretDark"},
    {"name": "paw_rear_left", "from": [-2.15, 2.20, 2.15], "to": [-0.95, 3.45, 3.65], "color": "ferretDark"},
    {"name": "paw_rear_right", "from": [0.95, 2.20, 2.15], "to": [2.15, 3.45, 3.65], "color": "ferretDark"},

    # 20-21. Front Arms
    {"name": "arm_front_left", "from": [-1.95, 3.15, -3.25], "to": [-1.15, 4.95, -2.25], "color": "ferretDark"},
    {"name": "arm_front_right", "from": [1.15, 3.15, -3.25], "to": [1.95, 4.95, -2.25], "color": "ferretDark"},

    # 22-23. Rear Thighs (crouched for pop)
    {"name": "thigh_rear_left", "from": [-2.25, 3.25, 1.95], "to": [-1.05, 5.35, 3.75], "color": "ferretSable"},
    {"name": "thigh_rear_right", "from": [1.05, 3.25, 1.95], "to": [2.25, 5.35, 3.75], "color": "ferretSable"},

    # === C. ELONGATED SLEEK FERRET BODY (6 cubes) ===
    # 24. Low Warm Underbelly (cream)
    {"name": "body_underbelly", "from": [-1.55, 3.05, -1.95], "to": [1.55, 4.25, 2.45], "color": "ferretCream"},
    # 25. Mid Torso Cylinder
    {"name": "body_mid_torso", "from": [-1.85, 3.85, -2.35], "to": [1.85, 5.75, 2.75], "color": "ferretSable"},
    # 26. Slender Arched Back Ridge
    {"name": "body_back_arch", "from": [-1.55, 5.55, -1.85], "to": [1.55, 6.65, 2.35], "color": "ferretSable"},
    # 27. Solid Rump / Pelvis
    {"name": "body_rump_rear", "from": [-1.75, 4.15, 2.55], "to": [1.75, 6.15, 4.05], "color": "ferretSable"},
    # 28. Chest / Ribcage
    {"name": "body_chest_front", "from": [-1.75, 4.15, -3.45], "to": [1.75, 6.45, -2.05], "color": "ferretSable"},
    # 29. Cream Chest Bib
    {"name": "chest_cream_bib", "from": [-1.25, 4.45, -3.75], "to": [1.25, 6.15, -3.15], "color": "ferretCream"},

    # === D. SLENDER NECK & FERRET HEAD (16 cubes) ===
    # 30. Forward-reaching muscular neck
    {"name": "neck_base", "from": [-1.45, 5.75, -4.35], "to": [1.45, 7.55, -2.75], "color": "ferretSable"},
    # 31. Cream throat underside
    {"name": "neck_throat_cream", "from": [-1.15, 5.85, -4.65], "to": [1.15, 7.25, -3.95], "color": "ferretCream"},
    # 32. Head core
    {"name": "head_core", "from": [-1.95, 6.65, -5.95], "to": [1.95, 9.25, -3.65], "color": "ferretSable"},
    # 33-34. Soft Cream Cheeks
    {"name": "cheek_fluff_left", "from": [-2.25, 6.75, -5.65], "to": [-1.75, 8.35, -4.15], "color": "ferretCream"},
    {"name": "cheek_fluff_right", "from": [1.75, 6.75, -5.65], "to": [2.25, 8.35, -4.15], "color": "ferretCream"},
    # 35. Pointed Ferret Muzzle
    {"name": "muzzle_upper", "from": [-1.25, 6.75, -6.95], "to": [1.25, 8.05, -5.75], "color": "ferretCream"},
    # 36. Chin Underside
    {"name": "chin_under", "from": [-0.95, 6.35, -6.65], "to": [0.95, 7.05, -5.55], "color": "ferretCream"},
    # 37. Cute Pink Nose Button
    {"name": "nose_button", "from": [-0.45, 7.55, -7.25], "to": [0.45, 8.15, -6.85], "color": "nosePink"},
    # 38. Bandit Eye Mask Band (iconic dark mask)
    {"name": "eye_mask_band", "from": [-2.05, 7.65, -6.15], "to": [2.05, 8.65, -5.55], "color": "ferretDark"},
    # 39-40. Beady Black Eyes
    {"name": "eye_iris_left", "from": [-1.75, 7.75, -6.35], "to": [-1.05, 8.55, -5.85], "color": "eyeBlack"},
    {"name": "eye_iris_right", "from": [1.05, 7.75, -6.35], "to": [1.75, 8.55, -5.85], "color": "eyeBlack"},
    # 41-42. Soulful Eye Sparkles
    {"name": "eye_sparkle_left", "from": [-1.65, 8.05, -6.45], "to": [-1.25, 8.45, -6.10], "color": "sparkleWhite"},
    {"name": "eye_sparkle_right", "from": [1.25, 8.05, -6.45], "to": [1.65, 8.45, -6.10], "color": "sparkleWhite"},
    # 43-44. Rounded Ears (outer sable)
    {"name": "ear_outer_left", "from": [-2.45, 8.75, -4.75], "to": [-1.75, 9.75, -3.85], "color": "ferretSable"},
    {"name": "ear_outer_right", "from": [1.75, 8.75, -4.75], "to": [2.45, 9.75, -3.85], "color": "ferretSable"},
    # 45-46. Rounded Ears (inner cream)
    {"name": "ear_inner_left", "from": [-2.35, 8.85, -4.65], "to": [-1.70, 9.55, -4.15], "color": "ferretCream"},
    {"name": "ear_inner_right", "from": [1.70, 8.85, -4.65], "to": [2.35, 9.55, -4.15], "color": "ferretCream"},

    # 47. White Skater Forelock / Tuft ("хохолок") peeking out cleanly UNDER the cap brim (NO intersection!)
    # Top is Y=8.95, while cap forehead arch bottom is Y=9.05 -> clean gap, 0 intersection!
    {"name": "forehead_tuft_main", "from": [-0.65, 8.45, -6.25], "to": [0.65, 8.95, -5.70], "color": "sparkleWhite"},

    # === E. BACKWARDS BASEBALL SNAPBACK CAP (5 cubes) ===
    # 48. Cap Crown (snug red cap dome)
    {"name": "cap_crown", "from": [-1.85, 9.15, -5.45], "to": [1.85, 10.35, -3.25], "color": "capRed"},
    # 49. Cap Front Forehead Arch (sitting cleanly above the forelock tuft, Y: 9.05..9.55)
    {"name": "cap_forehead_arch", "from": [-1.55, 9.05, -5.85], "to": [1.55, 9.55, -5.25], "color": "capRed"},
    # 50. Backwards Cap Visor / Brim (pointing over nape)
    {"name": "cap_visor_rear", "from": [-1.65, 8.75, -3.35], "to": [1.65, 9.25, -1.85], "color": "capRed"},
    # 51. Visor Lip
    {"name": "cap_visor_lip", "from": [-1.45, 8.95, -1.95], "to": [1.45, 9.35, -1.15], "color": "capRed"},
    # 52. Snapback Gold Top Button
    {"name": "cap_top_button", "from": [-0.35, 10.25, -4.55], "to": [0.35, 10.65, -3.95], "color": "goldButton"},

    # === F. DYNAMIC BALANCE FERRET TAIL (4 cubes) ===
    # 53. Tail Root at rear rump
    {"name": "tail_root", "from": [-0.65, 4.75, 3.85], "to": [0.65, 5.95, 4.95], "color": "ferretSable"},
    # 54. Tail Mid Arching Upwards
    {"name": "tail_mid_arch", "from": [-0.55, 5.55, 4.75], "to": [0.55, 6.95, 6.05], "color": "ferretSable"},
    # 55. Tail High Sweep (counterbalance)
    {"name": "tail_high_sweep", "from": [-0.45, 6.75, 5.75], "to": [0.45, 8.25, 7.05], "color": "ferretDark"},
    # 56. Bushy Tail Tip curling
    {"name": "tail_bushy_tip", "from": [-0.35, 7.85, 5.35], "to": [0.35, 8.95, 6.45], "color": "ferretDark"},
]

print(f"Total cubes: {len(cubes)}")
issues = check_coplanar(cubes)
print(f"Coplanar overlap issues: {len(issues)}")
for iss in issues:
    print(f"  Overlap: {iss[0]} <-> {iss[1]} at {iss[2]} ({iss[3]})")

with open('scripts/skater_ferret_cubes.json', 'w') as f:
    json.dump(cubes, f, indent=2)

print("Saved to scripts/skater_ferret_cubes.json")
