import json
import os
import sys

sys.path.insert(0, 'scripts')
from test_penguin_cocoa_builder import get_penguin_cubes
from blockbench_coplanar_check import blockbench_check

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(ROOT_DIR, 'assets', 'models')
os.makedirs(MODELS_DIR, exist_ok=True)

cubes = get_penguin_cubes()

# Assign groups to cubes
cube_groups = {
    'foot_sole_left': 'feet',
    'foot_sole_right': 'feet',
    'foot_toe_ridge_left': 'feet',
    'foot_toe_ridge_right': 'feet',

    'body_core': 'body',
    'body_underbelly': 'body',
    'body_flank_left': 'body',
    'body_flank_right': 'body',
    'belly_white_lower': 'body',
    'belly_white_upper': 'body',
    'body_back_arch': 'body',

    'tail_main': 'tail',
    'tail_tip_white': 'tail',

    'flipper_shoulder_left': 'flippers',
    'flipper_arm_left': 'flippers',
    'flipper_hand_left': 'flippers',
    'flipper_cuff_left': 'flippers',
    'flipper_shoulder_right': 'flippers',
    'flipper_arm_right': 'flippers',
    'flipper_hand_right': 'flippers',
    'flipper_cuff_right': 'flippers',

    'mug_base': 'mug_cocoa',
    'mug_rim': 'mug_cocoa',
    'mug_handle_top': 'mug_cocoa',
    'mug_handle_vert': 'mug_cocoa',
    'mug_handle_bottom': 'mug_cocoa',
    'cocoa_surface': 'mug_cocoa',
    'marshmallow_1': 'mug_cocoa',
    'marshmallow_2': 'mug_cocoa',
    'marshmallow_3': 'mug_cocoa',
    'steam_puff_low': 'mug_cocoa',
    'steam_puff_mid': 'mug_cocoa',
    'steam_puff_high': 'mug_cocoa',

    'scarf_front': 'scarf',
    'scarf_back': 'scarf',
    'scarf_left': 'scarf',
    'scarf_right': 'scarf',
    'scarf_knot': 'scarf',
    'scarf_tail_drape': 'scarf',
    'scarf_stripe_accent': 'scarf',
    'scarf_tassels': 'scarf',

    'head_core': 'head_face',
    'head_crown_top': 'head_face',
    'head_back_arch': 'head_face',
    'face_mask_white': 'head_face',
    'face_forehead_notch': 'head_face',
    'beak_base': 'head_face',
    'beak_tip': 'head_face',
    'beak_culmen': 'head_face',
    'eye_iris_left': 'head_face',
    'eye_sparkle_left': 'head_face',
    'eye_iris_right': 'head_face',
    'eye_sparkle_right': 'head_face',
    'blush_cheek_left': 'head_face',
    'blush_cheek_right': 'head_face'
}

for c in cubes:
    c['group'] = cube_groups.get(c['name'], 'body')
    idx = c['col_idx']
    if idx < 16:
        c['uv'] = [idx, 0, idx + 1, 1]
    else:
        c['uv'] = [idx - 16, 1, idx - 15, 2]

# Save JSON representation
json_path = os.path.join(MODELS_DIR, 'penguin_cocoa_cubes.json')
with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(cubes, f, indent=2)

print(f"Verified {len(cubes)} cubes saved to {json_path}")
issues = blockbench_check(cubes)
print(f"Coplanar overlaps: {len(issues)}")
assert len(issues) == 0, "Must have zero coplanar overlaps!"

# Generate Blockbench JavaScript code
swatches = [
    "#0f172a", # 0: penguinBlack
    "#f8fafc", # 1: penguinWhite
    "#f97316", # 2: penguinOrange
    "#fb923c", # 3: penguinOrangeLight
    "#dc2626", # 4: scarfRed
    "#facc15", # 5: scarfGoldTassel
    "#0d9488", # 6: mugTeal
    "#14b8a6", # 7: mugRim
    "#451a03", # 8: cocoaBrown
    "#ffffff", # 9: marshmallowWhite
    "#fef08a", # 10: marshmallowCream
    "#e2e8f0", # 11: steamWhite
    "#991b1b", # 12: scarfDarkRed
    "#ffffff", # 13: scarfWhiteStripe
    "#09090b", # 14: eyeBlack
    "#ffffff", # 15: eyeSparkle
    "#f472b6"  # 16: blushPink
]

group_defs = ["feet", "body", "tail", "flippers", "mug_cocoa", "scarf", "head_face"]

bbmodel_target = os.path.join(MODELS_DIR, 'penguin_cocoa.bbmodel').replace('\\', '/')

js_code = f"""
Cube.all.slice().forEach(c => c.remove());
Group.all.slice().forEach(g => g.remove());
Texture.all.slice().forEach(t => t.remove());

Project.name = 'penguin_cocoa';
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

const tex = new Texture({{ name: 'penguin_cocoa_palette' }});
tex.fromDataURL(canvas.toDataURL('image/png')).add(false);

const groupDefs = {json.dumps(group_defs)};
const groups = {{}};
groupDefs.forEach(name => {{
  groups[name] = new Group({{ name: name }}).init();
}});

const cubesData = {json.dumps(cubes)};

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

Undo.finishEdit('Penguin Cocoa V1.0 (Zero Z-Fighting, 7 Groups, 55 Cubes)');
Canvas.updateAll();

const modelData = Format.codec.compile();
Blockbench.writeFile('{bbmodel_target}', {{ content: modelData }});

return {{
  success: true,
  cubesCount: Cube.all.length,
  groupsCount: Group.all.length,
  textureName: tex.name,
  savedPath: '{bbmodel_target}'
}};
"""

js_path = os.path.join(ROOT_DIR, 'scripts', 'build_penguin_cocoa_bb.js')
with open(js_path, 'w', encoding='utf-8') as f:
    f.write(js_code)

print(f"Generated Blockbench script: {js_path}")
