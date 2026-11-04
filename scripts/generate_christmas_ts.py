import json
import os

CHAR_FILES_PART1 = [
    ('penguin_cocoa', 'assets/models/penguin_cocoa_cubes.json'),
    ('snow_hare', 'assets/models/snow_hare_cubes.json'),
    ('husky_sweater', 'assets/models/husky_sweater_cubes.json'),
    ('derpy_snowman', 'assets/models/derpy_snowman_cubes.json'),
    ('arctic_fox', 'assets/models/arctic_fox_cubes.json'),
]

CHAR_FILES_PART2 = [
    ('holiday_elf', 'assets/models/holiday_elf_cubes.json'),
    ('holiday_owl', 'assets/models/holiday_owl_cubes.json'),
    ('gingerbread_man', 'assets/models/gingerbread_man_cubes.json'),
    ('reindeer_glow', 'assets/models/reindeer_glow_cubes.json'),
    ('santa_claus', 'assets/models/santa_claus_cubes.json'),
]

def generate_calls(cubes, func_name):
    calls = []
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
        calls.append(f"{func_name}(group, {w:.3f}, {h:.3f}, {d:.3f}, '{col}', {cx:.3f}, {cy:.3f}, {cz:.3f}, isGhost);")
    
    # Pack 2 calls per line
    lines = []
    for i in range(0, len(calls), 2):
        if i + 1 < len(calls):
            lines.append(f"    {calls[i]} {calls[i+1]}")
        else:
            lines.append(f"    {calls[i]}")
    return lines

def build_part1():
    header = """import * as THREE from 'three';
import { createVoxelMesh, VoxelPalette, type VoxelColorKey } from './voxelPalette.ts';
import { createChristmasCharacterExp } from './christmasCharactersExpansion.ts';

function addXmasVoxel(
  group: THREE.Group,
  w: number,
  h: number,
  d: number,
  color: VoxelColorKey | number,
  x: number,
  y: number,
  z: number,
  isGhost: boolean
): void {
  const mat = VoxelPalette.getMaterial(color, isGhost);
  group.add(createVoxelMesh(w, h, d, mat, x, y, z, !isGhost, !isGhost));
}

export interface ChristmasCharacterCalibration {
  scale: number;
  offsetY: number;
}

export const CHRISTMAS_CHARACTER_CALIBRATIONS: Record<string, ChristmasCharacterCalibration> = {
  penguin_cocoa: { scale: 1.35, offsetY: 0 },
  snow_hare: { scale: 1.25, offsetY: 0 },
  husky_sweater: { scale: 1.15, offsetY: 0 },
  derpy_snowman: { scale: 1.22, offsetY: 0 },
  arctic_fox: { scale: 1.20, offsetY: 0 },
  holiday_elf: { scale: 1.28, offsetY: 0 },
  holiday_owl: { scale: 1.35, offsetY: 0 },
  gingerbread_man: { scale: 1.35, offsetY: 0 },
  reindeer_glow: { scale: 1.20, offsetY: 0 },
  santa_claus: { scale: 1.35, offsetY: 0 },
};

export function createChristmasCharacter(skinId: string, isGhost = false): THREE.Group {
  const root = new THREE.Group();
  root.name = 'char_root';

  const innerPivot = new THREE.Group();
  innerPivot.name = 'innerPivot';

  const calib = CHRISTMAS_CHARACTER_CALIBRATIONS[skinId] ?? { scale: 1.0, offsetY: 0 };
  innerPivot.scale.set(calib.scale, calib.scale, calib.scale);
  innerPivot.position.set(0, calib.offsetY, 0);

  const group = innerPivot;
"""
    body_parts = []
    for idx, (skin_id, json_path) in enumerate(CHAR_FILES_PART1):
        with open(json_path, 'r', encoding='utf-8') as f:
            cubes = json.load(f)
        keyword = "if" if idx == 0 else "} else if"
        lines = generate_calls(cubes, "addXmasVoxel")
        cube_lines = "\n".join(lines)
        body_parts.append(f"  {keyword} (skinId === '{skin_id}') {{\n    // {len(cubes)} voxels: {skin_id}\n{cube_lines}")

    footer = """  } else {
    createChristmasCharacterExp(skinId, isGhost, innerPivot);
  }

  root.add(innerPivot);
  return root;
}
"""
    return header + "\n".join(body_parts) + "\n" + footer

def build_part2():
    header = """import * as THREE from 'three';
import { createVoxelMesh, VoxelPalette, type VoxelColorKey } from './voxelPalette.ts';

function addXmasExpVoxel(
  group: THREE.Group,
  w: number,
  h: number,
  d: number,
  color: VoxelColorKey | number,
  x: number,
  y: number,
  z: number,
  isGhost: boolean
): void {
  const mat = VoxelPalette.getMaterial(color, isGhost);
  group.add(createVoxelMesh(w, h, d, mat, x, y, z, !isGhost, !isGhost));
}

export function createChristmasCharacterExp(
  skinId: string,
  isGhost = false,
  targetGroup?: THREE.Group
): THREE.Group {
  const group = targetGroup ?? new THREE.Group();
"""
    body_parts = []
    for idx, (skin_id, json_path) in enumerate(CHAR_FILES_PART2):
        with open(json_path, 'r', encoding='utf-8') as f:
            cubes = json.load(f)
        keyword = "if" if idx == 0 else "} else if"
        lines = generate_calls(cubes, "addXmasExpVoxel")
        cube_lines = "\n".join(lines)
        body_parts.append(f"  {keyword} (skinId === '{skin_id}') {{\n    // {len(cubes)} voxels: {skin_id}\n{cube_lines}")

    footer = """  }

  return group;
}
"""
    return header + "\n".join(body_parts) + "\n" + footer

part1_ts = build_part1()
part2_ts = build_part2()

with open('src/view/christmasCharacters.ts', 'w', encoding='utf-8') as f:
    f.write(part1_ts)

with open('src/view/christmasCharactersExpansion.ts', 'w', encoding='utf-8') as f:
    f.write(part2_ts)

lines1 = len(part1_ts.strip().split('\n'))
lines2 = len(part2_ts.strip().split('\n'))
print(f"christmasCharacters.ts created: {lines1} lines (<= 300 check: {lines1 <= 300})")
print(f"christmasCharactersExpansion.ts created: {lines2} lines (<= 300 check: {lines2 <= 300})")
