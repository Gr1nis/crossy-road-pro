import json

palette_list = [
    ("ratGrey", "#475569"),        # 0
    ("bellyLight", "#94a3b8"),     # 1
    ("ratPink", "#fecdd3"),        # 2
    ("nosePink", "#f43f5e"),       # 3
    ("buckTooth", "#ffffff"),      # 4
    ("eyeBlack", "#09090b"),       # 5
    ("sparkleWhite", "#ffffff"),   # 6
    ("bagelCrust", "#b45309"),     # 7
    ("sesameSeed", "#fef3c7"),     # 8
    ("retroOrange", "#f97316"),    # 9
    ("headbandMetal", "#64748b"),  # 10
    ("cupDark", "#1e293b"),        # 11
]

color_map = {name: (idx, hex_col) for idx, (name, hex_col) in enumerate(palette_list)}

with open('scripts/subway_rat_cubes_v2.json') as f:
    cubes = json.load(f)

for c in cubes:
    col = c['color']
    idx, hex_val = color_map[col]
    c['col_idx'] = idx
    c['uv'] = [idx, 0, idx + 1, 1]

with open('scripts/subway_rat_zero_zfight.json', 'w') as f:
    json.dump(cubes, f, indent=2)

swatches_js = json.dumps([hex_col for _, hex_col in palette_list])
cubes_data_js = json.dumps(cubes)

js_content = f"""
Cube.all.slice().forEach(c => c.remove());
Texture.all.slice().forEach(t => t.remove());

const canvas = document.createElement('canvas');
canvas.width = 16;
canvas.height = 16;
const ctx = canvas.getContext('2d');
ctx.fillStyle = '#1e293b';
ctx.fillRect(0, 0, 16, 16);

const swatches = {swatches_js};
swatches.forEach((hex, idx) => {{
  ctx.fillStyle = hex;
  ctx.fillRect(idx, 0, 1, 1);
}});

const tex = new Texture({{ name: 'subway_rat_palette' }});
tex.fromDataURL(canvas.toDataURL('image/png')).add(false);

const cubesData = {cubes_data_js};

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

Undo.finishEdit('Subway Rat V1.0 (Retro Headphones, Sesame Bagel, Bucktooth)');
Canvas.updateAll();

return {{
  cubesCount: Cube.all.length,
  textureName: tex.name
}};
"""

with open('scripts/build_subway_rat_bb.js', 'w') as f:
    f.write(js_content)

print("Generated scripts/subway_rat_zero_zfight.json and scripts/build_subway_rat_bb.js")
