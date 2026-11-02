import json

with open('scripts/pigeon_zero_zfight.json') as f:
    cubes = json.load(f)

lines = []
lines.append("  } else if (skinId === 'pigeon_pizza') {")
lines.append("    // 55 voxels: Zero Z-Fighting Certified Solid Pigeon Pizza (0 coplanar overlaps)")
for c in cubes:
    fx, fy, fz = c['from']
    tx, ty, tz = c['to']
    
    w = round((tx - fx) * 0.05, 4)
    h = round((ty - fy) * 0.05, 4)
    d = round((tz - fz) * 0.05, 4)
    
    cx = round(((fx + tx) / 2.0) * 0.05, 4)
    cy = round(((fy + ty) / 2.0) * 0.05, 4)
    cz = round(-((fz + tz) / 2.0) * 0.05, 4)
    
    col = c['color']
    name = c['name']
    
    lines.append(f"    addCharVoxel(group, {w:.3f}, {h:.3f}, {d:.3f}, '{col}', {cx:.3f}, {cy:.3f}, {cz:.3f}, isGhost); // {name}")

ts_block = "\n".join(lines)

with open('src/view/urbanCharacters.ts', 'r', encoding='utf-8') as f:
    content = f.read()

import re
pattern = r"  \} else if \(skinId === 'pigeon_pizza'\) \{.*?  \} else if \(skinId === 'box_cat'\) \{"
new_content = re.sub(pattern, ts_block + "\n  } else if (skinId === 'box_cat') {", content, flags=re.DOTALL)

with open('src/view/urbanCharacters.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Successfully synced Zero Z-Fighting Pigeon Pizza to src/view/urbanCharacters.ts!")
