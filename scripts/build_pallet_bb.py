import json
import os
import sys
import urllib.request

sys.path.insert(0, 'scripts')
from solve_pallet import build_pallet, check_quantization, check_connectivity
from blockbench_coplanar_check import blockbench_check

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(ROOT_DIR, 'assets', 'models')
os.makedirs(MODELS_DIR, exist_ok=True)

cubes = build_pallet()

# Palette definitions (8 swatches on 16x16 palette)
palette = [
    ("#d97706", "woodDeckLight", 0),
    ("#b45309", "woodDeckMid", 1),
    ("#92400e", "woodDark", 2),
    ("#78350f", "woodBlock", 3),
    ("#451a03", "stampBurn", 4),
    ("#94a3b8", "nailSteel", 5),
    ("#f8fafc", "foamWhite", 6),
    ("#0284c7", "waterAqua", 7),
]

swatches = [p[0] for p in palette]
while len(swatches) < 16:
    swatches.append("#0f172a")

for c in cubes:
    idx = c['col_idx']
    c['uv'] = [idx, 0, idx + 1, 1]

# Save JSON representation
json_path = os.path.join(MODELS_DIR, 'pallet_cubes.json')
with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(cubes, f, indent=2)

print(f"Verified {len(cubes)} cubes saved to {json_path}")
issues = blockbench_check(cubes)
print(f"Coplanar overlaps: {len(issues)}")
assert len(issues) == 0, f"Must have zero coplanar overlaps! Found {len(issues)}"

q_errs = check_quantization(cubes)
assert len(q_errs) == 0, f"Must have zero quantization errors! Found {len(q_errs)}"

min_y = min(c['from'][1] for c in cubes)
assert min_y == 0.0, f"Min Y must be 0.00, got {min_y}"

visited = check_connectivity(cubes)
assert len(visited) == len(cubes), f"Must be 100% connected! {len(visited)}/{len(cubes)}"

group_defs = ["bottom_runners", "spacer_blocks", "cross_stringers", "top_deck_slats", "branding_fasteners"]
bbmodel_target = os.path.join(MODELS_DIR, 'pallet.bbmodel').replace('\\', '/')
views_dir = os.path.join(MODELS_DIR, 'pallet_views').replace('\\', '/')
os.makedirs(os.path.join(MODELS_DIR, 'pallet_views'), exist_ok=True)

js_code = f"""
Cube.all.slice().forEach(c => c.remove());
Group.all.slice().forEach(g => g.remove());
Texture.all.slice().forEach(t => t.remove());

Project.name = 'pallet';
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

const tex = new Texture({{ name: 'pallet_palette' }});
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

Undo.finishEdit('Floating Wooden Euro-Pallet - 5 Slats, 3 Stringers, 9 Blocks, 3 Runners, Foam Wake');
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

js_path = os.path.join(ROOT_DIR, 'scripts', 'build_pallet_bb.js')
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
