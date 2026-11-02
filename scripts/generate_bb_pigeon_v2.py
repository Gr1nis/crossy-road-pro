import json

with open('scripts/pigeon_v2_zero_zfight.json') as f:
    cubes_js = json.load(f)

js_code = f"""
// 1. Reset project cubes and textures
Cube.all.slice().forEach(c => c.remove());
Texture.all.slice().forEach(t => t.remove());

// 2. Create 16x16 palette texture
const canvas = document.createElement('canvas');
canvas.width = 16;
canvas.height = 16;
const ctx = canvas.getContext('2d');
ctx.fillStyle = '#1e293b';
ctx.fillRect(0, 0, 16, 16);

const swatches = [
  '#64748b', // 0: pigeonGrey
  '#ffffff', // 1: white
  '#f43f5e', // 2: pigeonFootRed
  '#1e293b', // 3: darkCharcoal
  '#0d9488', // 4: pigeonTeal
  '#8b5cf6', // 5: purpleNeck
  '#f97316', // 6: orangeFruit
  '#b45309', // 7: pizzaCrust
  '#facc15', // 8: pizzaCheese
  '#b91c1c', // 9: pizzaRed
  '#16a34a'  // 10: greenLeaf
];

swatches.forEach((hex, idx) => {{
  ctx.fillStyle = hex;
  ctx.fillRect(idx, 0, 1, 1);
}});

const tex = new Texture({{ name: 'pigeon_palette' }});
tex.fromDataURL(canvas.toDataURL('image/png')).add(false);

// 3. Create all 55 solid cubes with zero coplanar overlaps
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

Undo.finishEdit('Zero Z-Fighting Pigeon Pizza V2');
Canvas.updateAll();

return {{
  cubesCount: Cube.all.length,
  textureName: tex.name
}};
"""

with open('scripts/build_pigeon_v2_bb.js', 'w') as f:
    f.write(js_code)

print("Saved scripts/build_pigeon_v2_bb.js")
