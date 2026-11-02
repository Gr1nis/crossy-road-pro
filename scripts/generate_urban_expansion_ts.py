import json

def generate_file(group_name, func_name, files, out_path):
    code_lines = [
        "import * as THREE from 'three';",
        "import { createVoxelMesh, VoxelPalette, type VoxelColorKey } from './voxelPalette.ts';",
        "",
        f"function add{group_name}Voxel(",
        "  group: THREE.Group,",
        "  w: number,",
        "  h: number,",
        "  d: number,",
        "  color: VoxelColorKey | number,",
        "  x: number,",
        "  y: number,",
        "  z: number,",
        "  isGhost: boolean",
        "): void {",
        "  const mat = VoxelPalette.getMaterial(color, isGhost);",
        "  const mesh = createVoxelMesh(w, h, d, mat, x, y, z, !isGhost, !isGhost);",
        "  group.add(mesh);",
        "}",
        "",
        f"export function {func_name}(skinId: string, isGhost = false): THREE.Group {{",
        "  const group = new THREE.Group();",
        ""
    ]

    for idx, (skin_id, fpath) in enumerate(files):
        with open(fpath) as f:
            cubes = json.load(f)

        cond = "if" if idx == 0 else "} else if"
        code_lines.append(f"  {cond} (skinId === '{skin_id}') {{")
        code_lines.append(f"    // {len(cubes)} voxels: Zero Z-Fighting Certified Solid {skin_id}")
        for c in cubes:
            fx, fy, fz = c["from"]
            tx, ty, tz = c["to"]
            w = round((tx - fx) * 0.05, 3)
            h = round((ty - fy) * 0.05, 3)
            d = round((tz - fz) * 0.05, 3)
            x = round(((fx + tx) / 2.0) * 0.05, 3)
            y = round(((fy + ty) / 2.0) * 0.05, 3)
            z = round(-((fz + tz) / 2.0) * 0.05, 3)
            color = c["color"]
            name = c["name"]
            code_lines.append(f"    add{group_name}Voxel(group, {w:.3f}, {h:.3f}, {d:.3f}, '{color}', {x:.3f}, {y:.3f}, {z:.3f}, isGhost); // {name}")

    code_lines.append("  } else {")
    code_lines.append("    return group;")
    code_lines.append("  }")
    code_lines.append("  return group;")
    code_lines.append("}")

    full_code = "\n".join(code_lines) + "\n"
    print(f"Generated {out_path}: {len(code_lines)} lines")
    with open(out_path, "w") as f:
        f.write(full_code)

files_a = [
    ("barista_pug", "scripts/barista_pug_zero_zfight.json"),
    ("skater_ferret", "scripts/skater_ferret_zero_zfight.json"),
    ("subway_rat", "scripts/subway_rat_zero_zfight.json"),
]

files_b = [
    ("raincoat_duck", "scripts/raincoat_duck_zero_zfight_v3.json"),
    ("pigeon_king", "scripts/pigeon_king_final_zero_zfight.json"),
]

generate_file("ExpA", "createUrbanCharacterExpA", files_a, "src/view/urbanCharactersExpansionA.ts")
generate_file("ExpB", "createUrbanCharacterExpB", files_b, "src/view/urbanCharactersExpansionB.ts")
