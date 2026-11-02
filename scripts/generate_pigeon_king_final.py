import json

with open('scripts/pigeon_king_zero_zfight.json') as f:
    cubes = json.load(f)

# Palette swatches (18 colors)
swatches = [
    "#ffffff",  # 0 featherPureWhite
    "#e2e8f0",  # 1 featherShade
    "#fde047",  # 2 pigeonBeak
    "#ffffff",  # 3 beakCereWhite
    "#f43f5e",  # 4 pigeonFootRed
    "#f59e0b",  # 5 eyeAmber
    "#09090b",  # 6 eyePupil
    "#ffffff",  # 7 sparkleWhite
    "#991b1b",  # 8 mantleRed
    "#f8fafc",  # 9 ermineFur
    "#0f172a",  # 10 ermineSpot
    "#facc15",  # 11 crownGold
    "#ca8a04",  # 12 goldShade
    "#dc2626",  # 13 royalRuby
    "#2563eb",  # 14 royalSapphire
    "#d97706",  # 15 croissantGold
    "#b45309",  # 16 croissantCrust
    "#fde68a"   # 17 croissantHighlight
]

def get_uv(col_idx):
    if col_idx < 16:
        return [col_idx, 0, col_idx + 1, 1]
    else:
        x = col_idx - 16
        return [x, 1, x + 1, 2]

# Group mappings
group_definitions = [
    ("legs", [
        "foot_base_left", "leg_shank_left", "toe_mid_left", "toe_outer_left", "toe_inner_left",
        "foot_base_right", "leg_shank_right", "toe_mid_right", "toe_outer_right", "toe_inner_right"
    ]),
    ("body", [
        "thigh_fluff_left", "thigh_fluff_right",
        "body_lower_belly", "body_core_loaf", "breast_puff_main", "breast_puff_upper",
        "tail_fan_upper", "tail_fan_tip"
    ]),
    ("wings", [
        "wing_left_upper", "wing_left_primaries",
        "wing_right_upper", "wing_right_primaries"
    ]),
    ("mantle", [
        "mantle_train_back", "mantle_shoulder_left", "mantle_shoulder_right",
        "ermine_collar_ring", "ermine_lapel_left", "ermine_lapel_right",
        "ermine_spot_left", "ermine_spot_right",
        "mantle_gold_clasp", "mantle_ruby_gem"
    ]),
    ("head", [
        "neck_pigeon", "head_core", "cheek_fluff_left", "cheek_fluff_right",
        "beak_base", "beak_tip", "beak_cere_white", "beak_lower_mandible",
        "eye_left", "eye_right", "sparkle_left", "sparkle_right"
    ]),
    ("crown", [
        "crown_band", "crown_peak_front", "crown_peak_rear",
        "crown_prong_left", "crown_prong_right", "crown_gem_ruby"
    ]),
    ("croissant", [
        "croissant_center", "croissant_horn_left", "croissant_horn_right",
        "croissant_crust_ridge", "croissant_highlight"
    ])
]

cube_dict = {c["name"]: c for c in cubes}

processed_cubes = []
for grp_name, cube_names in group_definitions:
    for name in cube_names:
        c = cube_dict[name]
        uv = get_uv(c["col_idx"])
        processed_cubes.append({
            "name": name,
            "group": grp_name,
            "from": c["from"],
            "to": c["to"],
            "color": c["color"],
            "col_idx": c["col_idx"],
            "uv": uv
        })

print(f"Total processed cubes: {len(processed_cubes)}")
assert len(processed_cubes) == len(cubes) == 55

js_script = f"""
Cube.all.slice().forEach(c => c.remove());
Group.all.slice().forEach(g => g.remove());
Texture.all.slice().forEach(t => t.remove());

Project.texture_width = 16;
Project.texture_height = 16;

const canvas = document.createElement('canvas');
canvas.width = 16;
canvas.height = 16;
const ctx = canvas.getContext('2d');
ctx.fillStyle = '#0f172a';
ctx.fillRect(0, 0, 16, 16);

const swatches = {json.dumps(swatches)};
swatches.forEach((hex, idx) => {{
  ctx.fillStyle = hex;
  if (idx < 16) {{
    ctx.fillRect(idx, 0, 1, 1);
  }} else {{
    ctx.fillRect(idx - 16, 1, 1, 1);
  }}
}});

const tex = new Texture({{ name: 'pigeon_king_palette' }});
tex.fromDataURL(canvas.toDataURL('image/png')).add(false);

const groupDefs = {json.dumps([g[0] for g in group_definitions])};
const groups = {{}};
groupDefs.forEach(name => {{
  groups[name] = new Group({{ name: name }}).init();
}});

const cubesData = {json.dumps(processed_cubes)};

Undo.initEdit({{ elements: [], groups: [] }});

cubesData.forEach(d => {{
  const cube = new Cube({{
    name: d.name,
    from: d.from,
    to: d.to,
    faces: {{
      north: {{ uv: d.uv, texture: tex.uuid }},
      east:  {{ uv: d.uv, texture: tex.uuid }},
      south: {{ uv: d.uv, texture: tex.uuid }},
      west:  {{ uv: d.uv, texture: tex.uuid }},
      up:    {{ uv: d.uv, texture: tex.uuid }},
      down:  {{ uv: d.uv, texture: tex.uuid }}
    }}
  }});
  cube.init();
  if (groups[d.group]) {{
    cube.addTo(groups[d.group]);
  }}
}});

Undo.finishEdit('Pigeon King V1.0 Monolithic & Grouped');
Canvas.updateAll();

const modelData = Format.codec.compile();
Blockbench.writeFile('/Users/egorbelogubec/Downloads/GitHub/Crossy road pro/assets/models/pigeon_king.bbmodel', {{ content: modelData }});

return {{
  cubesCount: Cube.all.length,
  groupsCount: Group.all.length,
  textureName: tex.name,
  savedPath: '/Users/egorbelogubec/Downloads/GitHub/Crossy road pro/assets/models/pigeon_king.bbmodel'
}};
"""

with open('scripts/build_pigeon_king_bb.js', 'w') as f:
    f.write(js_script)

print("Saved scripts/build_pigeon_king_bb.js")
