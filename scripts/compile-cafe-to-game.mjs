import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const bbmodelPath = path.join(ROOT, 'assets/models/cafe_townhouse.bbmodel');
const targetTsPath = path.join(ROOT, 'src/view/townhouse/cafe.ts');

const model = JSON.parse(fs.readFileSync(bbmodelPath, 'utf8'));

const swatches = [
  { id: 0, name: 'white', x: 0, y: 0, hex: 0xFFFFFF },
  { id: 1, name: 'yellow_glow', x: 16, y: 0, hex: 0xFEF08A },
  { id: 2, name: 'flower_pink', x: 32, y: 0, hex: 0xF472B6 },
  { id: 3, name: 'flower_yellow', x: 48, y: 0, hex: 0xFCD34D },
  { id: 4, name: 'flower_red', x: 64, y: 0, hex: 0xEF4444 },
  { id: 5, name: 'plant_green', x: 80, y: 0, hex: 0x22C55E },
  { id: 6, name: 'wood_dark', x: 96, y: 0, hex: 0x5C3217 },
  { id: 7, name: 'wood_recess', x: 112, y: 0, hex: 0x3E1F0B },
  { id: 8, name: 'awning_red', x: 128, y: 0, hex: 0xDC2626 },
  { id: 9, name: 'roof_terracotta', x: 144, y: 0, hex: 0xC2410C },
  { id: 10, name: 'pot_clay', x: 160, y: 0, hex: 0xEA580C },
  { id: 11, name: 'slate_menu', x: 176, y: 0, hex: 0x1E293B },
  { id: 12, name: 'chalk_white', x: 192, y: 0, hex: 0xF1F5F9 },
  { id: 13, name: 'gold_handle', x: 208, y: 0, hex: 0xEAB308 },
  { id: 14, name: 'stone_grey', x: 224, y: 0, hex: 0xCBD5E1 },
  { id: 15, name: 'pipe_grey', x: 240, y: 0, hex: 0x64748B },
  { id: 16, name: 'wall_blue', x: 0, y: 16, hex: 0x2F78CF },
  { id: 17, name: 'brick_blue', x: 16, y: 16, hex: 0x2563EB },
  { id: 18, name: 'chimney_pot', x: 32, y: 16, hex: 0x334155 },
  { id: 19, name: 'dormer_caramel', x: 48, y: 16, hex: 0xC27835 }
];

function getSwatchId(uv) {
  if (!uv) return 16;
  const u = (uv[0] + uv[2]) / 2;
  const v = (uv[1] + uv[3]) / 2;
  for (const s of swatches) {
    if (u >= s.x && u < s.x + 16 && v >= s.y && v < s.y + 16) return s.id;
  }
  return 16;
}

const SCALE = 0.075;
const boxes = [];

for (const el of model.elements) {
  const f = el.faces?.north || el.faces?.up || Object.values(el.faces || {})[0];
  const swatchId = getSwatchId(f?.uv);
  const w = +Math.abs(el.to[0] - el.from[0]).toFixed(3) * SCALE;
  const h = +Math.abs(el.to[1] - el.from[1]).toFixed(3) * SCALE;
  const d = +Math.abs(el.to[2] - el.from[2]).toFixed(3) * SCALE;
  const xMid = (el.from[0] + el.to[0]) / 2;
  const yMid = (el.from[1] + el.to[1]) / 2;
  const zMid = (el.from[2] + el.to[2]) / 2;

  // 180° rotation around Y: x' = -x, z' = -z (orients front facade to +Z)
  const x = -xMid * SCALE;
  const y = yMid * SCALE;
  const z = -zMid * SCALE;

  boxes.push([
    +w.toFixed(3),
    +h.toFixed(3),
    +d.toFixed(3),
    +x.toFixed(3),
    +y.toFixed(3),
    +z.toFixed(3),
    swatchId
  ]);
}

console.log(`Parsed ${boxes.length} cubes from ${path.basename(bbmodelPath)}`);

// Format boxes 2 per line for compact readability and strictly staying under 300 lines limit
const boxLines = [];
for (let i = 0; i < boxes.length; i += 2) {
  const b1 = JSON.stringify(boxes[i]);
  if (i + 1 < boxes.length) {
    const b2 = JSON.stringify(boxes[i + 1]);
    boxLines.push(`  ${b1}, ${b2},`);
  } else {
    boxLines.push(`  ${b1},`);
  }
}

const tsContent = `import type { BiomeType } from '../../core/types.ts';
import { VoxelMeshBuilder } from '../voxelMeshBuilder.ts';

/**
 * Parisian Blue Cafe / Desert Cantina / Cyber Diner Modeler for Townhouse A.
 * Compiled from authoritative Blockbench model assets/models/cafe_townhouse.bbmodel (215 cubes).
 * Complies strictly with docs/VOXEL_GRID_SPECIFICATION.md.
 */

// Palette swatches per biome [0..19]
const CAFE_PALETTE_FOREST: readonly number[] = [
  0xffffff, // 0: white
  0xfef08a, // 1: yellow_glow
  0xf472b6, // 2: flower_pink
  0xfcd34d, // 3: flower_yellow
  0xef4444, // 4: flower_red
  0x22c55e, // 5: plant_green
  0x5c3217, // 6: wood_dark
  0x3e1f0b, // 7: wood_recess
  0xdc2626, // 8: awning_red
  0xc2410c, // 9: roof_terracotta
  0xea580c, // 10: pot_clay
  0x1e293b, // 11: slate_menu
  0xf1f5f9, // 12: chalk_white
  0xeab308, // 13: gold_handle
  0xcbd5e1, // 14: stone_grey
  0x64748b, // 15: pipe_grey
  0x2f78cf, // 16: wall_blue
  0x2563eb, // 17: brick_blue
  0x334155, // 18: chimney_pot
  0xc27835, // 19: dormer_caramel
];

const CAFE_PALETTE_WINTER: readonly number[] = [
  0xf8fafc, // 0: snow white
  0xfef08a, // 1: yellow_glow
  0xf472b6, // 2: flower_pink
  0xfcd34d, // 3: flower_yellow
  0xef4444, // 4: flower_red
  0x15803d, // 5: plant_green (deep pine)
  0x5c3217, // 6: wood_dark
  0x3e1f0b, // 7: wood_recess
  0xdc2626, // 8: awning_red
  0xc2410c, // 9: roof_terracotta
  0xea580c, // 10: pot_clay
  0x1e293b, // 11: slate_menu
  0xf1f5f9, // 12: chalk_white
  0xeab308, // 13: gold_handle
  0x94a3b8, // 14: stone_grey
  0x475569, // 15: pipe_grey
  0x2563eb, // 16: wall_blue (deep winter blue)
  0x1d4ed8, // 17: brick_blue
  0x1e293b, // 18: chimney_pot
  0xb45309, // 19: dormer_caramel
];

const CAFE_PALETTE_DESERT: readonly number[] = [
  0xfef3c7, // 0: warm cream white
  0xfde68a, // 1: yellow_glow
  0xf59e0b, // 2: flower_pink
  0xfbbf24, // 3: flower_yellow
  0xd97706, // 4: flower_red
  0x84cc16, // 5: plant_green (succulent)
  0x78350f, // 6: wood_dark
  0x451a03, // 7: wood_recess
  0xb45309, // 8: awning_red (terracotta)
  0xb45309, // 9: roof_terracotta (adobe)
  0x9a3412, // 10: pot_clay
  0x451a03, // 11: slate_menu
  0xfef3c7, // 12: chalk_white
  0xf59e0b, // 13: gold_handle
  0xd97706, // 14: stone_grey (sandstone)
  0x92400e, // 15: pipe_grey
  0xd97706, // 16: wall_blue (warm adobe)
  0xb45309, // 17: brick_blue
  0x78350f, // 18: chimney_pot
  0x92400e, // 19: dormer_caramel
];

const CAFE_PALETTE_NEON: readonly number[] = [
  0x06b6d4, // 0: cyan neon trim
  0xec4899, // 1: magenta neon glow
  0xec4899, // 2: flower_pink (neon pink)
  0x06b6d4, // 3: flower_yellow (cyan glow)
  0xf43f5e, // 4: flower_red
  0x10b981, // 5: plant_green (matrix green)
  0x1e1b4b, // 6: wood_dark (dark synth)
  0x0f172a, // 7: wood_recess
  0xec4899, // 8: awning_red (neon magenta)
  0x1e1b4b, // 9: roof_terracotta (obsidian)
  0x06b6d4, // 10: pot_clay (neon cyan)
  0x0f172a, // 11: slate_menu
  0x06b6d4, // 12: chalk_white
  0x06b6d4, // 13: gold_handle
  0x090d16, // 14: stone_grey (dark plinth)
  0x1e1b4b, // 15: pipe_grey
  0x0f172a, // 16: wall_blue (dark obsidian)
  0x1e1b4b, // 17: brick_blue
  0x090d16, // 18: chimney_pot
  0x06b6d4, // 19: dormer_caramel
];

// 215 Monolithic Boxes: [w, h, d, x, y, z, swatchId]
const CAFE_BOXES: readonly [number, number, number, number, number, number, number][] = [
${boxLines.join('\n')}
];

export function populateCafeBuilder(b: VoxelMeshBuilder, biome: BiomeType = 'forest'): void {
  let pal = CAFE_PALETTE_FOREST;
  if (biome === 'winter') pal = CAFE_PALETTE_WINTER;
  else if (biome === 'desert') pal = CAFE_PALETTE_DESERT;
  else if (biome === 'neon') pal = CAFE_PALETTE_NEON;

  for (let i = 0; i < CAFE_BOXES.length; i++) {
    const box = CAFE_BOXES[i];
    b.addBox(box[0], box[1], box[2], box[3], box[4], box[5], pal[box[6]]);
  }

  // Winter snow caps on roof ridge and chimney if winter biome
  if (biome === 'winter') {
    b.addBox(0.24, 0.05, 1.55, 0, 2.98, 0, 0xf8fafc);
    b.addBox(0.30, 0.05, 0.30, 0, 3.48, -0.52, 0xf8fafc);
  }
}
`;

fs.writeFileSync(targetTsPath, tsContent, 'utf8');
const linesCount = tsContent.split('\n').length;
console.log(`Generated ${targetTsPath} with ${linesCount} lines (limit: 300).`);
