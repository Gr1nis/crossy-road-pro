import json

with open('scripts/bb_cubes_zero_zfight.json') as f:
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

// 3. Create all 43 cubes with ZERO coplanar overlaps
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

Undo.finishEdit('Zero Z-Fighting Corgi');
Canvas.updateAll();

return {{
  cubesCount: Cube.all.length,
  textureName: tex.name
}};
"""

with open('scripts/build_corgi_zero_zfight.js', 'w') as f:
    f.write(js_code)

print("Generated scripts/build_corgi_zero_zfight.js")
