import json

palette_list = [
    ("ferretCream", "#fef3c7"),   # 0
    ("ferretSable", "#573419"),   # 1
    ("ferretDark", "#29180c"),    # 2
    ("nosePink", "#fb7185"),      # 3
    ("eyeBlack", "#09090b"),      # 4
    ("sparkleWhite", "#ffffff"),  # 5
    ("capRed", "#dc2626"),        # 6
    ("goldButton", "#facc15"),    # 7
    ("fireRed", "#ef4444"),       # 8
    ("gripTape", "#18181b"),      # 9
    ("truckSilver", "#94a3b8"),   # 10
    ("truckDark", "#475569"),     # 11
]

color_map = {name: (idx, hex_col) for idx, (name, hex_col) in enumerate(palette_list)}

with open('scripts/skater_ferret_cubes.json') as f:
    cubes = json.load(f)

for c in cubes:
    col = c['color']
    idx, hex_val = color_map[col]
    c['col_idx'] = idx
    c['uv'] = [idx, 0, idx + 1, 1]

with open('scripts/skater_ferret_zero_zfight.json', 'w') as f:
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

const tex = new Texture({{ name: 'skater_ferret_palette' }});
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

Undo.finishEdit('Skater Ferret V1.0 (Backwards Cap, Skateboard & Dynamic Tail)');
Canvas.updateAll();

return {{
  cubesCount: Cube.all.length,
  textureName: tex.name
}};
"""

with open('scripts/build_skater_ferret_bb.js', 'w') as f:
    f.write(js_content)

print("Generated scripts/skater_ferret_zero_zfight.json and scripts/build_skater_ferret_bb.js")
