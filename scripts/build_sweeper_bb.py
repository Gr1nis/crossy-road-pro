import json
import os
import sys
import urllib.request

sys.path.insert(0, 'scripts')
from solve_sweeper import build_sweeper, check_quantization, check_connectivity
from blockbench_coplanar_check import blockbench_check

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(ROOT_DIR, 'assets', 'models')
os.makedirs(MODELS_DIR, exist_ok=True)

cubes = build_sweeper()

# Palette definitions (16 swatches on 16x16 palette)
palette = [
    ("#ea580c", "sweeperOrange", 0),
    ("#c2410c", "sweeperOrangeDark", 1),
    ("#475569", "hopperGrey", 2),
    ("#334155", "hopperGreyDark", 3),
    ("#facc15", "chevronYellow", 4),
    ("#0f172a", "tireBlack", 5),
    ("#1e293b", "tireTread", 6),
    ("#cbd5e1", "rimSilver", 7),
    ("#94a3b8", "metalChrome", 8),
    ("#1e293b", "brushBristlesDark", 9),
    ("#38bdf8", "glassSky", 10),
    ("#e0f2fe", "headlightIce", 11),
    ("#f59e0b", "beaconAmber", 12),
    ("#ef4444", "taillightRed", 13),
    ("#f8fafc", "letteringWhite", 14),
    ("#1e293b", "trimDark", 15),
]

swatches = [p[0] for p in palette]

for c in cubes:
    idx = c['col_idx']
    c['uv'] = [idx, 0, idx + 1, 1]

# Save JSON representation
json_path = os.path.join(MODELS_DIR, 'sweeper_cubes.json')
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
assert len(grounded) == 4, f"Must have exactly 4 grounded wheel treads, got {len(grounded)}"

visited = check_connectivity(cubes)
assert len(visited) == len(cubes), f"Must be 100% connected! {len(visited)}/{len(cubes)}"

group_defs = ["chassis_wheels", "front_brushes", "cab_structure", "roof_beacon", "rear_hopper"]
bbmodel_target = os.path.join(MODELS_DIR, 'sweeper.bbmodel').replace('\\', '/')
views_dir = os.path.join(MODELS_DIR, 'sweeper_views').replace('\\', '/')
os.makedirs(os.path.join(MODELS_DIR, 'sweeper_views'), exist_ok=True)

js_code = f"""
Cube.all.slice().forEach(c => c.remove());
Group.all.slice().forEach(g => g.remove());
Texture.all.slice().forEach(t => t.remove());

Project.name = 'sweeper';
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

const tex = new Texture({{ name: 'sweeper_palette' }});
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

Undo.finishEdit('Municipal Street Sweeper - Dual Outrigger Brushes, Orange Cab, Slate Hopper, Hazard Chevrons, 99 Cubes');
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

js_path = os.path.join(ROOT_DIR, 'scripts', 'build_sweeper_bb.js')
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
