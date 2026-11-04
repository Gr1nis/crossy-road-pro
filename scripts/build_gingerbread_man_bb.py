import json
import os
import sys
import urllib.request

sys.path.insert(0, 'scripts')
from solve_gingerbread_man import build_gingerbread_man, check_quantization
from blockbench_coplanar_check import blockbench_check

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(ROOT_DIR, 'assets', 'models')
os.makedirs(MODELS_DIR, exist_ok=True)

cubes = build_gingerbread_man()

# Palette definitions
palette = [
    ("#d97706", "doughWarm", 0),       # golden ginger honey dough
    ("#b45309", "doughCrust", 1),      # baked crust accent
    ("#92400e", "doughShade", 2),      # toasted deep edges
    ("#ffffff", "icingWhite", 3),      # crisp royal sugar icing
    ("#1c1917", "eyePupil", 4),        # dark chocolate chips
    ("#fb7185", "cheekPink", 5),       # strawberry sugar blush
    ("#dc2626", "candyRed", 6),        # peppermint red
    ("#10b981", "gumdropGreen", 7),    # emerald green jelly
    ("#f59e0b", "gumdropYellow", 8),   # amber citrus jelly
    ("#ef4444", "gumdropRuby", 9),     # ruby red jelly
]

swatches = [p[0] for p in palette]

for c in cubes:
    idx = c['col_idx']
    c['uv'] = [idx, 0, idx + 1, 1]

# Save JSON representation
json_path = os.path.join(MODELS_DIR, 'gingerbread_man_cubes.json')
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
assert len(grounded) == 2, f"Must have exactly 2 grounded foot soles, got {len(grounded)}"

group_defs = ["legs_feet", "torso_cookie", "head_cookie", "icing_decor", "accessories"]
bbmodel_target = os.path.join(MODELS_DIR, 'gingerbread_man.bbmodel').replace('\\', '/')

js_code = f"""
Cube.all.slice().forEach(c => c.remove());
Group.all.slice().forEach(g => g.remove());
Texture.all.slice().forEach(t => t.remove());

Project.name = 'gingerbread_man';
Project.texture_width = 16;
Project.texture_height = 16;

const canvas = document.createElement('canvas');
canvas.width = 16;
canvas.height = 16;
const ctx = canvas.getContext('2d');
ctx.fillStyle = '#1c1917';
ctx.fillRect(0, 0, 16, 16);

const swatches = {json.dumps(swatches)};
swatches.forEach((hex, idx) => {{
  ctx.fillStyle = hex;
  ctx.fillRect(idx, 0, 1, 1);
}});

const tex = new Texture({{ name: 'gingerbread_man_palette' }});
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

Undo.finishEdit('Gingerbread Man (Epic 🍪) - Golden Honey Dough, Royal Sugar Icing Cuffs & Face, Festive Candy Bowtie, 3 Juicy Gumdrop Buttons, Peppermint Candy Cane in Hand, Zero Z-Fighting, 68 Cubes');
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

js_path = os.path.join(ROOT_DIR, 'scripts', 'build_gingerbread_man_bb.js')
with open(js_path, 'w', encoding='utf-8') as f:
    f.write(js_code)

print(f"Generated Blockbench script: {js_path}")

# Execute script in live Blockbench
payload = json.dumps({
    "id": f"build-bb-{int(os.path.getmtime(js_path))}",
    "action": "execute_script",
    "params": {
        "code": js_code
    }
}).encode('utf-8')

req = urllib.request.Request(
    "http://127.0.0.1:8787/command",
    data=payload,
    headers={"Content-Type": "application/json"}
)

try:
    with urllib.request.urlopen(req, timeout=15) as resp:
        res = json.loads(resp.read().decode('utf-8'))
        print("Blockbench response:", json.dumps(res, indent=2))
except Exception as e:
    print(f"Error communicating with Blockbench: {e}")
