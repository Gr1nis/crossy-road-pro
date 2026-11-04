import json
import os
import sys
import urllib.request

sys.path.insert(0, 'scripts')
from solve_reindeer_glow import build_reindeer_glow, check_quantization
from blockbench_coplanar_check import blockbench_check

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(ROOT_DIR, 'assets', 'models')
os.makedirs(MODELS_DIR, exist_ok=True)

cubes = build_reindeer_glow()

# Palette definitions
palette = [
    ("#b45309", "reindeerCaramel", 0),  # warm caramel / chestnut fur
    ("#78350f", "reindeerDark", 1),     # deep spine / joint accent
    ("#fef3c7", "bibCream", 2),         # fluffy cream chest bib & throat
    ("#f8fafc", "bellyWhite", 3),       # white belly, tail fluff & sparkles
    ("#1c1917", "hoofDark", 4),         # dark hooves, lip, eyes
    ("#ef4444", "noseRubyGlow", 5),     # Rudolph's radiant glowing red nose!
    ("#e7e5e4", "antlerBone", 6),       # bone ivory antlers
    ("#d6d3d1", "antlerShadow", 7),     # antler tips / shading
    ("#dc2626", "collarRed", 8),        # festive Christmas velvet collar
    ("#facc15", "bellGold", 9),         # shiny golden sleigh bells & light
    ("#10b981", "lightEmerald", 10),    # glowing emerald green fairy light
    ("#38bdf8", "lightCyan", 11),       # glowing ice cyan fairy light
    ("#f43f5e", "lightRuby", 12),       # glowing ruby magenta fairy light
]

swatches = [p[0] for p in palette]

for c in cubes:
    idx = c['col_idx']
    c['uv'] = [idx, 0, idx + 1, 1]

# Save JSON representation
json_path = os.path.join(MODELS_DIR, 'reindeer_glow_cubes.json')
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
assert len(grounded) == 4, f"Must have exactly 4 grounded hooves, got {len(grounded)}"

group_defs = ["legs_hooves", "body_torso", "collar_bells", "head_snout", "antlers_lights"]
bbmodel_target = os.path.join(MODELS_DIR, 'reindeer_glow.bbmodel').replace('\\', '/')

js_code = f"""
Cube.all.slice().forEach(c => c.remove());
Group.all.slice().forEach(g => g.remove());
Texture.all.slice().forEach(t => t.remove());

Project.name = 'reindeer_glow';
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

const tex = new Texture({{ name: 'reindeer_glow_palette' }});
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

Undo.finishEdit('Rudolph the Red-Nosed Reindeer (Epic 🦌) - Cream Bib Fluff, Branching Antlers with Fairy Lights, Shining Red Nose, Gold Sleigh Bells Collar, Zero Z-Fighting, 66 Cubes');
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

js_path = os.path.join(ROOT_DIR, 'scripts', 'build_reindeer_glow_bb.js')
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
