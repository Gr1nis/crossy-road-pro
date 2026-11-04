import json
import os
import sys

sys.path.insert(0, 'scripts')
from solve_holiday_owl import build_holiday_owl, check_quantization
from blockbench_coplanar_check import blockbench_check

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(ROOT_DIR, 'assets', 'models')
os.makedirs(MODELS_DIR, exist_ok=True)

cubes = build_holiday_owl()

# Palette definitions (13 swatches on 16x16 palette)
palette = [
    ("#f8fafc", "owlWhite", 0),
    ("#ffffff", "owlSnowPure", 1),
    ("#cbd5e1", "owlSpeckleLight", 2),
    ("#94a3b8", "owlSpeckleDark", 3),
    ("#e2e8f0", "silverFrost", 4),
    ("#334155", "graphiteBeak", 5),
    ("#0f172a", "eyePupil", 6),
    ("#f59e0b", "amberGold", 7),
    ("#fbbf24", "brightAmber", 8),
    ("#dc2626", "santaRed", 9),
    ("#78350f", "coneWoodDark", 10),
    ("#92400e", "coneWoodWarm", 11),
    ("#15803d", "pineGreen", 12),
]

swatches = [p[0] for p in palette]

for c in cubes:
    idx = c['col_idx']
    c['uv'] = [idx, 0, idx + 1, 1]

# Save JSON representation
json_path = os.path.join(MODELS_DIR, 'holiday_owl_cubes.json')
with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(cubes, f, indent=2)

print(f"Verified {len(cubes)} cubes saved to {json_path}")
issues = blockbench_check(cubes)
print(f"Coplanar overlaps: {len(issues)}")
assert len(issues) == 0, f"Must have zero coplanar overlaps! Found {len(issues)}"

q_errs = check_quantization(cubes)
assert len(q_errs) == 0, f"Must have zero quantization errors! Found {len(q_errs)}"

min_y = min(c['from'][1] for c in cubes)
grounded = [c['name'] for c in cubes if c['from'][1] == 0.0]
assert min_y == 0.0, f"Min Y must be 0.00, got {min_y}"
assert len(grounded) == 2, f"Must have exactly 2 grounded foot pads, got {len(grounded)}"

group_defs = ["feet", "body_wings", "head_face", "santa_hat", "silver_pinecone"]
bbmodel_target = os.path.join(MODELS_DIR, 'holiday_owl.bbmodel').replace('\\', '/')

js_code = f"""
Cube.all.slice().forEach(c => c.remove());
Group.all.slice().forEach(g => g.remove());
Texture.all.slice().forEach(t => t.remove());

Project.name = 'holiday_owl';
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
  ctx.fillRect(idx, 0, 1, 1);
}});

const tex = new Texture({{ name: 'holiday_owl_palette' }});
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

Undo.finishEdit('Holiday Owl (Rare 🦉) - Snowy Owl, Santa Hat, Frosted Cedar Pinecone with Sprig & Berry, Zero Z-Fighting, 69 Cubes');
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

js_path = os.path.join(ROOT_DIR, 'scripts', 'build_holiday_owl_bb.js')
with open(js_path, 'w', encoding='utf-8') as f:
    f.write(js_code)

print(f"Generated Blockbench script: {js_path}")
