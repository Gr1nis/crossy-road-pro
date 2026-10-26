import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const bbmodelPath = path.join(ROOT, 'assets/models/bakery_townhouse.bbmodel');
const targetTsPath = path.join(ROOT, 'src/view/townhouse/bakery.ts');

const model = JSON.parse(fs.readFileSync(bbmodelPath, 'utf8'));

const swatches = [
  { id: 0, name: 'snow_white', x: 0, y: 0, hex: 0xFFFFFF },
  { id: 1, name: 'yellow_glow', x: 16, y: 0, hex: 0xFEF08A },
  { id: 2, name: 'stone_sandstone', x: 32, y: 0, hex: 0xF59E0B },
  { id: 3, name: 'stone_ochre_dark', x: 48, y: 0, hex: 0xD97706 },
  { id: 4, name: 'brick_red', x: 64, y: 0, hex: 0xBA3224 },
  { id: 5, name: 'brick_accent', x: 80, y: 0, hex: 0x991B1B },
  { id: 6, name: 'wood_door', x: 96, y: 0, hex: 0x713F12 },
  { id: 7, name: 'wood_dark', x: 112, y: 0, hex: 0x451A03 },
  { id: 8, name: 'garland_pine', x: 128, y: 0, hex: 0x166534 },
  { id: 9, name: 'garland_light', x: 144, y: 0, hex: 0x22C55E },
  { id: 10, name: 'bauble_red', x: 160, y: 0, hex: 0xEF4444 },
  { id: 11, name: 'bauble_cyan', x: 176, y: 0, hex: 0x06B6D4 },
  { id: 12, name: 'bauble_gold', x: 192, y: 0, hex: 0xFCD34D },
  { id: 13, name: 'bauble_pink', x: 208, y: 0, hex: 0xF472B6 },
  { id: 14, name: 'plinth_slate', x: 224, y: 0, hex: 0x334155 },
  { id: 15, name: 'smoke_puff', x: 240, y: 0, hex: 0xE2E8F0 },
  { id: 16, name: 'chimney_pot', x: 0, y: 16, hex: 0x1E293B },
  { id: 17, name: 'metal_handle', x: 16, y: 16, hex: 0xCBD5E1 }
];

function getSwatchId(uv) {
  if (!uv) return 4;
  const u = (uv[0] + uv[2]) / 2;
  const v = (uv[1] + uv[3]) / 2;
  for (const s of swatches) {
    if (u >= s.x && u < s.x + 16 && v >= s.y && v < s.y + 16) return s.id;
  }
  return 4;
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
 * Winter Brick Bakery / Desert Adobe Bakehouse / Neon Synth-Bakery for Townhouse B.
 * Compiled from authoritative Blockbench model assets/models/bakery_townhouse.bbmodel (${boxes.length} cubes).
 * Complies strictly with docs/VOXEL_GRID_SPECIFICATION.md.
 */

// Palette swatches per biome [0..17]
const BAKERY_PALETTE_WINTER: readonly number[] = [
  0xf8fafc, // 0: snow_white
  0xfef08a, // 1: yellow_glow
  0xf59e0b, // 2: stone_sandstone
  0xd97706, // 3: stone_ochre_dark
  0xba3224, // 4: brick_red
  0x991b1b, // 5: brick_accent
  0x713f12, // 6: wood_door
  0x451a03, // 7: wood_dark
  0x166534, // 8: garland_pine
  0x22c55e, // 9: garland_light
  0xef4444, // 10: bauble_red
  0x06b6d4, // 11: bauble_cyan
  0xfcd34d, // 12: bauble_gold
  0xf472b6, // 13: bauble_pink
  0x334155, // 14: plinth_slate
  0xe2e8f0, // 15: smoke_puff
  0x1e293b, // 16: chimney_pot
  0xcbd5e1, // 17: metal_handle
];

const BAKERY_PALETTE_FOREST: readonly number[] = [
  0xffffff, // 0: white trim
  0xfef08a, // 1: yellow_glow
  0xf59e0b, // 2: stone_sandstone
  0xd97706, // 3: stone_ochre_dark
  0xba3224, // 4: brick_red
  0x991b1b, // 5: brick_accent
  0x713f12, // 6: wood_door
  0x451a03, // 7: wood_dark
  0x15803d, // 8: garland_pine
  0x22c55e, // 9: garland_light
  0xef4444, // 10: bauble_red
  0x06b6d4, // 11: bauble_cyan
  0xfcd34d, // 12: bauble_gold
  0xf472b6, // 13: bauble_pink
  0x334155, // 14: plinth_slate
  0x94a3b8, // 15: smoke_puff
  0x1e293b, // 16: chimney_pot
  0xcbd5e1, // 17: metal_handle
];

const BAKERY_PALETTE_DESERT: readonly number[] = [
  0xfef3c7, // 0: cream sandstone trim
  0xfde68a, // 1: yellow_glow
  0xf59e0b, // 2: stone_sandstone
  0xb45309, // 3: stone_ochre_dark
  0xd97706, // 4: warm adobe terracotta
  0xb45309, // 5: brick_accent
  0x78350f, // 6: wood_door
  0x451a03, // 7: wood_dark
  0x84cc16, // 8: desert succulent trim
  0xa3e635, // 9: garland_light
  0xd97706, // 10: bauble_red
  0x0284c7, // 11: bauble_cyan
  0xfbbf24, // 12: bauble_gold
  0xf59e0b, // 13: bauble_pink
  0x78350f, // 14: plinth_slate
  0xd4d4d8, // 15: smoke_puff
  0x451a03, // 16: chimney_pot
  0xf59e0b, // 17: metal_handle
];

const BAKERY_PALETTE_NEON: readonly number[] = [
  0x06b6d4, // 0: cyan neon trim
  0xec4899, // 1: magenta neon glow
  0x06b6d4, // 2: cyan frame
  0x0891b2, // 3: dark cyan
  0x0f172a, // 4: dark obsidian
  0x1e1b4b, // 5: dark synth accent
  0x1e1b4b, // 6: wood_door
  0x090d16, // 7: wood_dark
  0xec4899, // 8: neon magenta garland
  0xf43f5e, // 9: garland_light
  0xf43f5e, // 10: bauble_red
  0x06b6d4, // 11: bauble_cyan
  0xfacc15, // 12: bauble_gold
  0xec4899, // 13: bauble_pink
  0x090d16, // 14: plinth_slate
  0x38bdf8, // 15: smoke_puff
  0x020617, // 16: chimney_pot
  0x06b6d4, // 17: metal_handle
];

// ${boxes.length} Monolithic Boxes: [w, h, d, x, y, z, swatchId]
const BAKERY_BOXES: readonly [number, number, number, number, number, number, number][] = [
${boxLines.join('\n')}
];

export function populateBakeryBuilder(b: VoxelMeshBuilder, biome: BiomeType = 'winter'): void {
  let pal = BAKERY_PALETTE_WINTER;
  if (biome === 'forest') pal = BAKERY_PALETTE_FOREST;
  else if (biome === 'desert') pal = BAKERY_PALETTE_DESERT;
  else if (biome === 'neon') pal = BAKERY_PALETTE_NEON;

  for (let i = 0; i < BAKERY_BOXES.length; i++) {
    const box = BAKERY_BOXES[i];
    b.addBox(box[0], box[1], box[2], box[3], box[4], box[5], pal[box[6]]);
  }
}
`;

fs.writeFileSync(targetTsPath, tsContent, 'utf8');
const linesCount = tsContent.split('\n').length;
console.log(`Generated ${targetTsPath} with ${linesCount} lines (limit: 300).`);
