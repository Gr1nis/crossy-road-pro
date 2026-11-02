import json

REVISED_VOXELS = [
    # name, w, h, d, col, cx, cy, cz
    ("front_paw_pad_left", 0.10, 0.03, 0.10, 'nosePink', -0.14, 0.015, 0.16),
    ("front_paw_sock_left", 0.10, 0.12, 0.10, 'white', -0.14, 0.09, 0.16),
    ("front_toe_beans_left", 0.07, 0.03, 0.03, 'nosePink', -0.14, 0.015, 0.215),
    ("front_paw_pad_right", 0.10, 0.03, 0.10, 'nosePink', 0.14, 0.015, 0.16),
    ("front_paw_sock_right", 0.10, 0.12, 0.10, 'white', 0.14, 0.09, 0.16),
    ("front_toe_beans_right", 0.07, 0.03, 0.03, 'nosePink', 0.14, 0.015, 0.215),
    ("rear_paw_pad_left", 0.10, 0.03, 0.10, 'nosePink', -0.14, 0.015, -0.16),
    ("rear_paw_sock_left", 0.10, 0.12, 0.10, 'white', -0.14, 0.09, -0.16),
    ("rear_paw_pad_right", 0.10, 0.03, 0.10, 'nosePink', 0.14, 0.015, -0.16),
    ("rear_paw_sock_right", 0.10, 0.12, 0.10, 'white', 0.14, 0.09, -0.16),
    ("rear_thigh_fluff_left", 0.11, 0.08, 0.11, 'corgiOrange', -0.14, 0.19, -0.16),
    ("rear_thigh_fluff_right", 0.11, 0.08, 0.11, 'corgiOrange', 0.14, 0.19, -0.16),

    ("body_loaf_core", 0.38, 0.22, 0.44, 'corgiOrange', 0, 0.25, -0.01),
    ("body_belly_white", 0.28, 0.04, 0.38, 'white', 0, 0.14, -0.01),
    ("chest_bib_main", 0.34, 0.20, 0.12, 'white', 0, 0.26, 0.17),
    ("chest_bib_tuft", 0.20, 0.12, 0.05, 'white', 0, 0.27, 0.235),

    ("rear_bum_core", 0.36, 0.20, 0.08, 'corgiOrange', 0, 0.26, -0.23),
    ("butt_peach_left", 0.15, 0.16, 0.06, 'white', -0.075, 0.24, -0.27),
    ("butt_peach_right", 0.15, 0.16, 0.06, 'white', 0.075, 0.24, -0.27),
    ("butt_tail_bob", 0.12, 0.12, 0.10, 'corgiOrange', 0, 0.34, -0.26),
    ("butt_tail_tip", 0.08, 0.08, 0.06, 'white', 0, 0.36, -0.31),

    ("collar_ring", 0.34, 0.05, 0.24, 'pizzaRed', 0, 0.36, 0.14),
    ("collar_tag_gold", 0.06, 0.06, 0.04, 'pizzaCheese', 0, 0.32, 0.25),

    ("head_core", 0.36, 0.26, 0.30, 'corgiOrange', 0, 0.48, 0.16),
    ("cheek_fluff_left", 0.05, 0.13, 0.14, 'white', -0.185, 0.44, 0.17),
    ("cheek_fluff_right", 0.05, 0.13, 0.14, 'white', 0.185, 0.44, 0.17),

    ("blaze_forehead", 0.09, 0.24, 0.13, 'white', 0, 0.49, 0.26),
    ("blaze_crown", 0.07, 0.04, 0.10, 'white', 0, 0.61, 0.18),
    ("snout_muzzle", 0.20, 0.12, 0.14, 'white', 0, 0.42, 0.33),
    ("chin_under_mouth", 0.14, 0.04, 0.08, 'white', 0, 0.36, 0.31),
    ("nose_button", 0.08, 0.06, 0.06, 'darkCharcoal', 0, 0.46, 0.40),

    ("tongue_playful", 0.06, 0.035, 0.08, 'nosePink', 0.03, 0.385, 0.39),

    ("eye_left_iris", 0.06, 0.07, 0.04, 'darkCharcoal', -0.11, 0.51, 0.29),
    ("eye_left_sparkle", 0.025, 0.025, 0.02, 'white', -0.11, 0.53, 0.31),
    ("eyebrow_left", 0.05, 0.025, 0.02, 'white', -0.11, 0.56, 0.285),
    ("eye_right_iris", 0.06, 0.07, 0.04, 'darkCharcoal', 0.11, 0.51, 0.29),
    ("eye_right_sparkle", 0.025, 0.025, 0.02, 'white', 0.11, 0.53, 0.31),
    ("eyebrow_right", 0.05, 0.025, 0.02, 'white', 0.11, 0.56, 0.285),

    ("ear_base_left", 0.10, 0.14, 0.08, 'corgiOrange', -0.14, 0.65, 0.15),
    ("ear_tip_left", 0.06, 0.10, 0.06, 'corgiOrange', -0.14, 0.75, 0.15),
    ("ear_pink_left", 0.06, 0.12, 0.03, 'nosePink', -0.14, 0.65, 0.176),
    ("ear_base_right", 0.10, 0.14, 0.08, 'corgiOrange', 0.14, 0.65, 0.15),
    ("ear_tip_right", 0.06, 0.10, 0.06, 'corgiOrange', 0.14, 0.75, 0.15),
    ("ear_pink_right", 0.06, 0.12, 0.03, 'nosePink', 0.14, 0.65, 0.176),
]

COLOR_UVS = {
    'corgiOrange': [0, 0, 1, 1],
    'white': [1, 0, 2, 1],
    'nosePink': [2, 0, 3, 1],
    'darkCharcoal': [3, 0, 4, 1],
    'pizzaRed': [4, 0, 5, 1],
    'pizzaCheese': [5, 0, 6, 1],
}

cubes_js = []
for name, w, h, d, col, cx, cy, cz in REVISED_VOXELS:
    fx = round((cx - w/2) * 20, 2)
    tx = round((cx + w/2) * 20, 2)
    fy = round((cy - h/2) * 20, 2)
    ty = round((cy + h/2) * 20, 2)
    fz = round((-cz - d/2) * 20, 2)
    tz = round((-cz + d/2) * 20, 2)
    
    from_pt = [min(fx, tx), min(fy, ty), min(fz, tz)]
    to_pt = [max(fx, tx), max(fy, ty), max(fz, tz)]
    uv = COLOR_UVS[col]
    cubes_js.append({
        'name': name,
        'from': from_pt,
        'to': to_pt,
        'uv': uv,
        'color': col
    })

js_code = f"""
// 1. Reset project cubes and textures
Cube.all.slice().forEach(c => c.remove());
Texture.all.slice().forEach(t => t.remove());

// 2. Create 16x16 palette texture
const canvas = document.createElement('canvas');
canvas.width = 16;
canvas.height = 16;
const ctx = canvas.getContext('2d');
// Fill background
ctx.fillStyle = '#1e293b';
ctx.fillRect(0, 0, 16, 16);

// Color row 0
const swatches = [
  '#d97706', // 0: corgiOrange
  '#ffffff', // 1: white
  '#f472b6', // 2: nosePink
  '#1e293b', // 3: darkCharcoal
  '#b91c1c', // 4: pizzaRed
  '#facc15'  // 5: pizzaCheese
];

swatches.forEach((hex, idx) => {{
  ctx.fillStyle = hex;
  ctx.fillRect(idx, 0, 1, 1);
}});

const tex = new Texture({{ name: 'corgi_palette' }});
tex.fromDataURL(canvas.toDataURL('image/png')).add(false);

// 3. Create all 44 solid cubes
const cubesData = {json.dumps(cubes_js)};

Undo.initEdit({{ elements: [] }});

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
}});

Undo.finishEdit('Build Solid Corgi 44v');
Canvas.updateAll();

return {{
  cubesCount: Cube.all.length,
  textureName: tex.name
}};
"""

with open('scripts/build_corgi_bb.js', 'w') as f:
    f.write(js_code)
print("Saved scripts/build_corgi_bb.js")
