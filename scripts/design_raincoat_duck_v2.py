import json
import sys
sys.path.insert(0, 'scripts')
from test_coplanar import check_coplanar

palette = {
    # Duck Feathers & Features
    'featherWhite': 0xffffff,    # crisp white duck plumage
    'duckOrange': 0xf97316,      # vibrant orange duck bill & webbed legs
    'billDark': 0xc2410c,        # deep orange nostril accents & bill nail
    'billLower': 0xe05600,       # slightly deeper orange lower mandible
    'eyeBlack': 0x09090b,        # beady black pupils
    'sparkleWhite': 0xffffff,    # eye highlight sparkles
    'drawstringWhite': 0xf1f5f9, # white hood drawstrings

    # Bright Yellow Raincoat & Sou'wester Hood
    'raincoatYellow': 0xfacc15,  # iconic bright yellow slicker vinyl
    'coatAccent': 0xeab308,      # darker yellow placket, pockets & belt
    'toggleDark': 0x1e293b,      # charcoal toggle clasp buttons

    # Glossy Blue Rubber Rainboots
    'bootBlue': 0x2563eb,        # vibrant royal blue rubber wellingtons
    'bootSole': 0x1d4ed8,        # deep blue treaded sole
    'bootRim': 0x60a5fa,         # sky blue boot opening collar rim
}

cubes = [
    # === A. BLUE RUBBER WELLINGTON BOOTS (8 cubes, touching ground Y=0) ===
    # 1-2. Deep blue boot soles (touching pavement Y=0)
    {"name": "boot_sole_left", "from": [-2.45, 0.0, -1.95], "to": [-0.95, 0.65, 1.25], "color": "bootSole"},
    {"name": "boot_sole_right", "from": [0.95, 0.0, -1.95], "to": [2.45, 0.65, 1.25], "color": "bootSole"},
    # 3-4. Blue rubber foot / vamp
    {"name": "boot_vamp_left", "from": [-2.35, 0.55, -1.85], "to": [-1.05, 1.65, 1.05], "color": "bootBlue"},
    {"name": "boot_vamp_right", "from": [1.05, 0.55, -1.85], "to": [2.35, 1.65, 1.05], "color": "bootBlue"},
    # 5-6. Blue rubber boot shaft
    {"name": "boot_shaft_left", "from": [-2.15, 1.55, -0.95], "to": [-1.25, 2.85, 0.75], "color": "bootBlue"},
    {"name": "boot_shaft_right", "from": [1.25, 1.55, -0.95], "to": [2.15, 2.85, 0.75], "color": "bootBlue"},
    # 7-8. Sky blue boot collar rim
    {"name": "boot_rim_left", "from": [-2.25, 2.75, -1.05], "to": [-1.15, 3.15, 0.85], "color": "bootRim"},
    {"name": "boot_rim_right", "from": [1.15, 2.75, -1.05], "to": [2.25, 3.15, 0.85], "color": "bootRim"},

    # === B. DUCK LEGS & PLUMP BODY IN YELLOW SLICKER (12 cubes) ===
    # 9-10. Orange duck legs emerging from boots
    {"name": "leg_left", "from": [-1.95, 2.95, -0.65], "to": [-1.45, 3.95, 0.45], "color": "duckOrange"},
    {"name": "leg_right", "from": [1.45, 2.95, -0.65], "to": [1.95, 3.95, 0.45], "color": "duckOrange"},
    # 11. Flared yellow raincoat hem
    {"name": "raincoat_hem", "from": [-2.45, 3.75, -1.95], "to": [2.45, 4.55, 2.45], "color": "raincoatYellow"},
    # 12. Main yellow raincoat torso
    {"name": "raincoat_body", "from": [-2.25, 4.45, -1.75], "to": [2.25, 7.25, 2.15], "color": "raincoatYellow"},
    # 13. Front button closure placket
    {"name": "coat_placket_strip", "from": [-0.35, 4.25, -2.05], "to": [0.35, 7.15, -1.70], "color": "coatAccent"},
    # 14-16. Three dark toggle clasp buttons
    {"name": "toggle_button_1", "from": [-0.25, 4.65, -2.25], "to": [0.25, 5.15, -1.95], "color": "toggleDark"},
    {"name": "toggle_button_2", "from": [-0.25, 5.65, -2.25], "to": [0.25, 6.15, -1.95], "color": "toggleDark"},
    {"name": "toggle_button_3", "from": [-0.25, 6.55, -2.25], "to": [0.25, 7.05, -1.95], "color": "toggleDark"},
    # 17-18. Flap pockets
    {"name": "pocket_left", "from": [-2.35, 4.62, -1.85], "to": [-1.45, 5.45, -1.05], "color": "coatAccent"},
    {"name": "pocket_right", "from": [1.45, 4.62, -1.85], "to": [2.35, 5.45, -1.05], "color": "coatAccent"},
    # 19-20. Raincoat back cinch belt & buckle
    {"name": "coat_belt_back", "from": [-1.85, 4.85, 2.05], "to": [1.85, 5.55, 2.35], "color": "coatAccent"},
    {"name": "coat_belt_buckle", "from": [-0.45, 4.95, 2.25], "to": [0.45, 5.45, 2.55], "color": "toggleDark"},

    # === C. RAINCOAT SLEEVES & CLEAN DUCK WINGS (4 cubes, umbrella removed!) ===
    # 21-22. Yellow sleeves (clean, symmetric on both sides)
    {"name": "sleeve_left", "from": [-2.75, 4.85, -1.15], "to": [-2.15, 6.75, 1.15], "color": "raincoatYellow"},
    {"name": "sleeve_right", "from": [2.15, 4.85, -1.15], "to": [2.75, 6.75, 1.15], "color": "raincoatYellow"},
    # 23-24. White feather wingtips peeking out of cuffs
    {"name": "wingtip_left", "from": [-2.65, 4.15, -0.85], "to": [-2.28, 4.95, 0.85], "color": "featherWhite"},
    {"name": "wingtip_right", "from": [2.28, 4.15, -0.85], "to": [2.65, 4.95, 0.85], "color": "featherWhite"},

    # === D. DUCK TAIL FEATHERS PEEKING OUT RAINCOAT VENT (2 cubes) ===
    # 25. Tail feathers base
    {"name": "tail_base", "from": [-0.85, 4.75, 2.10], "to": [0.85, 5.85, 3.15], "color": "featherWhite"},
    # 26. Perky upward curled tail tip
    {"name": "tail_curl_tip", "from": [-0.55, 5.65, 2.85], "to": [0.55, 6.75, 3.85], "color": "featherWhite"},

    # === E. DUCK NECK, HEAD CORE & CHEEKS (5 cubes) ===
    # 27. White feather neck
    {"name": "neck_duck", "from": [-1.55, 7.05, -1.35], "to": [1.55, 8.20, 1.05], "color": "featherWhite"},
    # 28. Yellow raincoat collar
    {"name": "raincoat_collar", "from": [-1.85, 6.95, -1.65], "to": [1.85, 7.65, 1.35], "color": "raincoatYellow"},
    # 29. Head core
    {"name": "head_core", "from": [-1.85, 7.85, -2.15], "to": [1.85, 10.65, 1.35], "color": "featherWhite"},
    # 30-31. Fluffy cheeks
    {"name": "cheek_fluff_left", "from": [-2.15, 7.95, -1.85], "to": [-1.65, 9.35, 0.75], "color": "featherWhite"},
    {"name": "cheek_fluff_right", "from": [1.65, 7.95, -1.85], "to": [2.15, 9.35, 0.75], "color": "featherWhite"},

    # === F. FACTURED, SCULPTED DUCK BILL (7 cubes) ===
    # 32. Lower mandible / jaw (gives beak thickness and mouth line)
    {"name": "bill_lower_jaw", "from": [-1.05, 7.55, -3.95], "to": [1.05, 7.95, -1.90], "color": "billLower"},
    # 33. Upper bill bridge (slopes down from between eyes)
    {"name": "bill_dorsal_bridge", "from": [-0.85, 8.45, -3.35], "to": [0.85, 9.05, -2.05], "color": "duckOrange"},
    # 34. Nostril plate / cere accent
    {"name": "bill_nostril_plate", "from": [-0.45, 8.75, -3.15], "to": [0.45, 9.15, -2.45], "color": "billDark"},
    # 35. Main mid-bill body (starts at Y=7.80 to not clash with head Y=7.85)
    {"name": "bill_main_body", "from": [-1.30, 7.80, -3.85], "to": [1.30, 8.65, -1.95], "color": "duckOrange"},
    # 36-37. Sculpted lateral rims (curved side edges / tomia of the bill)
    {"name": "bill_rim_left", "from": [-1.42, 8.05, -4.35], "to": [-1.22, 8.55, -2.25], "color": "billDark"},
    {"name": "bill_rim_right", "from": [1.22, 8.05, -4.35], "to": [1.42, 8.55, -2.25], "color": "billDark"},
    # 38. Broad spatulate spoon tip (flares wider at the front)
    {"name": "bill_spoon_flare", "from": [-1.20, 7.90, -4.75], "to": [1.20, 8.45, -3.75], "color": "duckOrange"},
    # 39. Duck "nail" (роговой ноготок на самом кончике клюва)
    {"name": "bill_tip_nail", "from": [-0.35, 7.95, -4.95], "to": [0.35, 8.35, -4.65], "color": "billDark"},

    # === G. BIG DUCK EYES & HIGHLIGHTS (4 cubes) ===
    # 40-41. Big glossy eyes
    {"name": "eye_left", "from": [-1.65, 8.75, -2.45], "to": [-0.95, 9.65, -1.85], "color": "eyeBlack"},
    {"name": "eye_right", "from": [0.95, 8.75, -2.45], "to": [1.65, 9.65, -1.85], "color": "eyeBlack"},
    # 42-43. Sparkling white highlights
    {"name": "sparkle_left", "from": [-1.55, 9.15, -2.55], "to": [-1.15, 9.55, -2.25], "color": "sparkleWhite"},
    {"name": "sparkle_right", "from": [1.15, 9.15, -2.55], "to": [1.55, 9.55, -2.25], "color": "sparkleWhite"},

    # === H. FULL-COVERAGE SOU'WESTER HAT BRIM OVER ENTIRE HEAD (9 cubes) ===
    # 44. Hood crown over top of head
    {"name": "hood_crown", "from": [-1.95, 10.45, -1.95], "to": [1.95, 11.55, 1.55], "color": "raincoatYellow"},
    # 45. Hood rear drape down neck
    {"name": "hood_drape_rear", "from": [-2.05, 8.28, 0.45], "to": [2.05, 10.70, 1.65], "color": "raincoatYellow"},
    # 46-47. Hood side flaps
    {"name": "hood_flap_left", "from": [-2.25, 9.25, -1.75], "to": [-1.75, 10.60, 0.55], "color": "raincoatYellow"},
    {"name": "hood_flap_right", "from": [1.75, 9.25, -1.75], "to": [2.25, 10.60, 0.55], "color": "raincoatYellow"},
    # 48. Wide sweeping front visor (wider than head & cheeks, X: -2.45..+2.45, covers entire face from above!)
    {"name": "hood_visor_main", "from": [-2.45, 10.15, -3.35], "to": [2.45, 10.75, -1.70], "color": "raincoatYellow"},
    # 49. Front visor rain lip / edge (extends forward over beak, Z: -3.85..-3.25)
    {"name": "hood_visor_lip", "from": [-2.25, 9.85, -3.85], "to": [2.25, 10.45, -3.25], "color": "coatAccent"},
    # 50-51. Left & Right flared side eaves (covers sides of head and cheeks completely!)
    {"name": "hood_brim_eave_left", "from": [-2.55, 9.95, -2.15], "to": [-2.15, 10.55, 0.75], "color": "raincoatYellow"},
    {"name": "hood_brim_eave_right", "from": [2.15, 9.95, -2.15], "to": [2.55, 10.55, 0.75], "color": "raincoatYellow"},
    # 52-53. White drawstring cords hanging under chin
    {"name": "drawstring_left", "from": [-1.15, 6.75, -2.15], "to": [-0.75, 7.75, -1.80], "color": "drawstringWhite"},
    {"name": "drawstring_right", "from": [0.75, 6.75, -2.15], "to": [1.15, 7.75, -1.80], "color": "drawstringWhite"},
]

print(f"Total cubes: {len(cubes)}")
issues = check_coplanar(cubes)
print(f"Coplanar overlap issues: {len(issues)}")
for iss in issues:
    print(f"  Overlap: {iss[0]} <-> {iss[1]} at {iss[2]} ({iss[3]})")

with open('scripts/raincoat_duck_cubes_v2.json', 'w') as f:
    json.dump(cubes, f, indent=2)
