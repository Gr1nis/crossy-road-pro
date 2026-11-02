import json

palette_list = [
    ("featherWhite", "#ffffff"),      # 0
    ("duckOrange", "#f97316"),        # 1
    ("billDark", "#c2410c"),          # 2
    ("eyeBlack", "#09090b"),          # 3
    ("sparkleWhite", "#ffffff"),      # 4
    ("drawstringWhite", "#f1f5f9"),   # 5
    ("raincoatYellow", "#facc15"),    # 6
    ("coatAccent", "#eab308"),        # 7
    ("toggleDark", "#1e293b"),        # 8
    ("bootBlue", "#2563eb"),          # 9
    ("bootSole", "#1d4ed8"),          # 10
    ("bootRim", "#60a5fa"),           # 11
]

color_map = {name: (idx, hex_col) for idx, (name, hex_col) in enumerate(palette_list)}

with open('scripts/raincoat_duck_cubes_v3.json') as f:
    cubes = json.load(f)

for c in cubes:
    col = c['color']
    idx, hex_val = color_map[col]
    c['col_idx'] = idx
    c['uv'] = [idx, 0, idx + 1, 1]

with open('scripts/raincoat_duck_zero_zfight_v3.json', 'w') as f:
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

const tex = new Texture({{ name: 'raincoat_duck_palette' }});
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

Undo.finishEdit('Raincoat Duck V3.0 (Cute Normal Duck Bill, Wide Protective Hat Brim, Clean Wings)');
Canvas.updateAll();

return {{
  cubesCount: Cube.all.length,
  textureName: tex.name
}};
"""

with open('scripts/build_raincoat_duck_bb_v3.js', 'w') as f:
    f.write(js_content)

print("Generated scripts/raincoat_duck_zero_zfight_v3.json and scripts/build_raincoat_duck_bb_v3.js")
