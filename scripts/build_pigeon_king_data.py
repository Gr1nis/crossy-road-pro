import json

palette_list = [
    ("featherPureWhite", "#ffffff"),   # 0
    ("featherShade", "#e2e8f0"),       # 1
    ("pigeonBeak", "#fde047"),         # 2
    ("beakCereWhite", "#ffffff"),      # 3
    ("pigeonFootRed", "#f43f5e"),      # 4
    ("eyeAmber", "#f59e0b"),           # 5
    ("eyeBlack", "#09090b"),           # 6
    ("sparkleWhite", "#ffffff"),       # 7
    ("mantleRed", "#991b1b"),          # 8
    ("ermineFur", "#f8fafc"),          # 9
    ("ermineSpot", "#0f172a"),         # 10
    ("crownGold", "#facc15"),          # 11
    ("crownGoldDark", "#ca8a04"),      # 12
    ("royalRuby", "#dc2626"),          # 13
    ("royalSapphire", "#2563eb"),      # 14
    ("croissantGold", "#d97706"),      # 15
    ("croissantCrust", "#b45309"),     # 16
    ("croissantHighlight", "#fde68a"), # 17
]

color_map = {name: (idx, hex_col) for idx, (name, hex_col) in enumerate(palette_list)}

with open('scripts/pigeon_king_cubes.json') as f:
    cubes = json.load(f)

for c in cubes:
    col = c['color']
    idx, hex_val = color_map[col]
    c['col_idx'] = idx
    c['uv'] = [idx, 0, idx + 1, 1]

with open('scripts/pigeon_king_zero_zfight.json', 'w') as f:
    json.dump(cubes, f, indent=2)

swatches_js = json.dumps([hex_col for _, hex_col in palette_list])
cubes_data_js = json.dumps(cubes)

js_content = f"""
Cube.all.slice().forEach(c => c.remove());
Texture.all.slice().forEach(t => t.remove());

const canvas = document.createElement('canvas');
canvas.width = 32;
canvas.height = 32;
const ctx = canvas.getContext('2d');
ctx.fillStyle = '#1e293b';
ctx.fillRect(0, 0, 32, 32);

const swatches = {swatches_js};
swatches.forEach((hex, idx) => {{
  ctx.fillStyle = hex;
  ctx.fillRect(idx, 0, 1, 1);
}});

const tex = new Texture({{ name: 'pigeon_king_palette' }});
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

Undo.finishEdit('Pigeon King V1.0 (Snow-White Pigeon, Crown, Ermine Mantle, Croissant)');
Canvas.updateAll();

const modelData = Format.codec.compile();
Blockbench.writeFile('/Users/egorbelogubec/Downloads/GitHub/Crossy road pro/assets/models/pigeon_king.bbmodel', {{ content: modelData }});

return {{
  cubesCount: Cube.all.length,
  textureName: tex.name,
  savedPath: '/Users/egorbelogubec/Downloads/GitHub/Crossy road pro/assets/models/pigeon_king.bbmodel'
}};
"""

with open('scripts/build_pigeon_king_bb.js', 'w') as f:
    f.write(js_content)

print("Generated scripts/pigeon_king_zero_zfight.json and scripts/build_pigeon_king_bb.js")
