import json

with open('scripts/pigeon_king_v3_zero_zfight.json') as f:
    cubes = json.load(f)

# Palette swatches (15 colors)
swatches = [
    "#ffffff",  # 0 featherPureWhite
    "#e2e8f0",  # 1 featherShade
    "#fde047",  # 2 pigeonBeak
    "#ffffff",  # 3 beakCereWhite
    "#f43f5e",  # 4 pigeonFootRed
    "#f59e0b",  # 5 eyeAmber
    "#09090b",  # 6 eyePupil
    "#ffffff",  # 7 sparkleWhite
    "#991b1b",  # 8 mantleRed
    "#f8fafc",  # 9 ermineFur
    "#0f172a",  # 10 ermineSpot
    "#facc15",  # 11 crownGold
    "#ca8a04",  # 12 goldShade
    "#dc2626",  # 13 royalRuby
    "#2563eb"   # 14 royalSapphire
]

def get_uv(col_idx):
    return [col_idx, 0, col_idx + 1, 1]

group_defs = ["legs", "body", "wings", "head", "crown", "mantle"]

processed_cubes = []
for c in cubes:
    uv = get_uv(c["col_idx"])
    processed_cubes.append({
        "name": c["name"],
        "group": c["group"],
        "from": c["from"],
        "to": c["to"],
        "color": c["color"],
        "col_idx": c["col_idx"],
        "uv": uv
    })

print(f"Total processed cubes in V3: {len(processed_cubes)}")

js_script = f"""
Cube.all.slice().forEach(c => c.remove());
Group.all.slice().forEach(g => g.remove());
Texture.all.slice().forEach(t => t.remove());

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

const tex = new Texture({{ name: 'pigeon_king_palette' }});
tex.fromDataURL(canvas.toDataURL('image/png')).add(false);

const groupDefs = {json.dumps(group_defs)};
const groups = {{}};
groupDefs.forEach(name => {{
  groups[name] = new Group({{ name: name }}).init();
}});

const cubesData = {json.dumps(processed_cubes)};

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

Undo.finishEdit('Pigeon King V3.0 (Zero Holes & Sleek Tail)');
Canvas.updateAll();

const modelData = Format.codec.compile();
Blockbench.writeFile('/Users/egorbelogubec/Downloads/GitHub/Crossy road pro/assets/models/pigeon_king.bbmodel', {{ content: modelData }});

return {{
  cubesCount: Cube.all.length,
  groupsCount: Group.all.length,
  textureName: tex.name,
  savedPath: '/Users/egorbelogubec/Downloads/GitHub/Crossy road pro/assets/models/pigeon_king.bbmodel'
}};
"""

with open('scripts/build_pigeon_king_v3_bb.js', 'w') as f:
    f.write(js_script)

print("Saved scripts/build_pigeon_king_v3_bb.js")
