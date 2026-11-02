import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const bbmodelPath = path.join(ROOT, 'assets/models/books_townhouse.bbmodel');
const targetTsPath = path.join(ROOT, 'src/view/townhouse/books.ts');

const model = JSON.parse(fs.readFileSync(bbmodelPath, 'utf8'));

const swatches = [
  { id: 0, name: 'white_trim', x: 0, y: 0 },
  { id: 1, name: 'yellow_glow', x: 16, y: 0 },
  { id: 2, name: 'cornice_cream', x: 32, y: 0 },
  { id: 3, name: 'facade_green', x: 48, y: 0 },
  { id: 4, name: 'brick_accent', x: 64, y: 0 },
  { id: 5, name: 'wood_door', x: 80, y: 0 },
  { id: 6, name: 'wood_dark', x: 96, y: 0 },
  { id: 7, name: 'brass_gold', x: 112, y: 0 },
  { id: 8, name: 'awning_dark', x: 128, y: 0 },
  { id: 9, name: 'awning_light', x: 144, y: 0 },
  { id: 10, name: 'sign_bg_dark', x: 160, y: 0 },
  { id: 11, name: 'sign_lime', x: 176, y: 0 },
  { id: 12, name: 'plinth_slate', x: 192, y: 0 },
  { id: 13, name: 'drainpipe_teal', x: 208, y: 0 },
  { id: 14, name: 'roof_terracotta', x: 224, y: 0 },
  { id: 15, name: 'roof_dark', x: 240, y: 0 },
  // Row 1 (y = 16)
  { id: 16, name: 'book_wine', x: 0, y: 16 },
  { id: 17, name: 'book_navy', x: 16, y: 16 },
  { id: 18, name: 'book_terracotta', x: 32, y: 16 },
  { id: 19, name: 'book_amber', x: 48, y: 16 },
  { id: 20, name: 'chimney_stone', x: 64, y: 16 },
  { id: 21, name: 'chimney_pot', x: 80, y: 16 },
  { id: 22, name: 'smoke_puff', x: 96, y: 16 },
  { id: 23, name: 'book_green', x: 112, y: 16 },
  { id: 24, name: 'chalkboard_dark', x: 128, y: 16 }
];

function getSwatchId(uv) {
  if (!uv) return 3;
  const u = (uv[0] + uv[2]) / 2;
  const v = (uv[1] + uv[3]) / 2;
  for (const s of swatches) {
    if (u >= s.x && u < s.x + 16 && v >= s.y && v < s.y + 16) return s.id;
  }
  return 3;
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
 * Green Books Store / Alpine Bookstore / Desert Scrolls / Synth-Library for Townhouse C.
 * Compiled from authoritative Blockbench model assets/models/books_townhouse.bbmodel (${boxes.length} cubes).
 * Complies strictly with docs/VOXEL_GRID_SPECIFICATION.md.
 */

// Palette swatches per biome [0..24]
const BOOKS_PALETTE_FOREST: readonly number[] = [
  0xffffff, // 0: white_trim
  0xfef08a, // 1: yellow_glow
  0xfef3c7, // 2: cornice_cream (warm limestone)
  0x3e6b27, // 3: facade_green (rich sage forest green)
  0x2d4e1c, // 4: brick_accent
  0x713f12, // 5: wood_door
  0x451a03, // 6: wood_dark
  0xfacc15, // 7: brass_gold
  0x166534, // 8: awning_dark (deep forest green)
  0x84cc16, // 9: awning_light (warm salad lime green, NO MINT!)
  0x0f381e, // 10: sign_bg_dark
  0xffe066, // 11: sign_lime (warm golden honey)
  0x334155, // 12: plinth_slate
  0x386b5c, // 13: drainpipe_teal
  0xc2410c, // 14: roof_terracotta
  0x9a3412, // 15: roof_dark
  0x991b1b, // 16: book_wine (classic burgundy)
  0x1e3a8a, // 17: book_navy (deep blue)
  0xc2410c, // 18: book_terracotta
  0xd97706, // 19: book_amber (golden ochre)
  0xd4a373, // 20: chimney_stone
  0xc2410c, // 21: chimney_pot
  0xcbd5e1, // 22: smoke_puff (light slate electric box)
  0x166534, // 23: book_green (forest green)
  0x1c2e24, // 24: chalkboard_dark (chalkboard surface)
];

const BOOKS_PALETTE_WINTER: readonly number[] = [
  0xffffff, // 0: white_trim
  0xfef08a, // 1: yellow_glow
  0xf8fafc, // 2: snow white cornice
  0x1e3a2f, // 3: alpine pine green
  0x14532d, // 4: dark pine accent
  0x582d0c, // 5: rustic wood door
  0x3b1d0e, // 6: dark timber
  0xfacc15, // 7: brass_gold
  0x0f381e, // 8: winter awning dark
  0xffffff, // 9: snow white awning stripe
  0x0a2714, // 10: dark spruce sign bg
  0x4ade80, // 11: mint green sign text
  0x1e293b, // 12: frosted slate plinth
  0x334155, // 13: frosted drainpipe
  0xf8fafc, // 14: snow roof
  0xe2e8f0, // 15: snow shadow
  0x9333ea, // 16: book_purple
  0x2563eb, // 17: book_blue
  0xdc2626, // 18: book_red
  0xf59e0b, // 19: book_yellow
  0xcbd5e1, // 20: frost stone chimney
  0x991b1b, // 21: terracotta pot
  0xffffff, // 22: white smoke
  0x16a34a, // 23: book_green
  0x0f381e, // 24: chalkboard_green
];

const BOOKS_PALETTE_DESERT: readonly number[] = [
  0xfef3c7, // 0: cream sandstone trim
  0xfde68a, // 1: golden glow
  0xfde68a, // 2: sandstone cornice
  0xd97706, // 3: adobe ochre facade
  0xb45309, // 4: terracotta accent
  0x78350f, // 5: cedar wood door
  0x451a03, // 6: dark cedar
  0xfbbf24, // 7: desert gold handle
  0xb45309, // 8: terracotta awning
  0xfde68a, // 9: sandstone awning
  0x78350f, // 10: cedar sign bg
  0xfbbf24, // 11: golden text
  0x78350f, // 12: adobe plinth
  0x92400e, // 13: copper drainpipe
  0xea580c, // 14: sunbaked tile roof
  0xc2410c, // 15: dark terracotta
  0x9333ea, // 16: scroll purple
  0x0284c7, // 17: lapis blue
  0xea580c, // 18: terracotta red
  0xfbbf24, // 19: gold parchment
  0xd97706, // 20: adobe chimney
  0x78350f, // 21: clay pot
  0xe2e8f0, // 22: smoke puff
  0x65a30d, // 23: scroll green
  0x78350f, // 24: chalkboard cedar
];

const BOOKS_PALETTE_NEON: readonly number[] = [
  0x06b6d4, // 0: cyan neon trim
  0xec4899, // 1: magenta neon glow
  0x06b6d4, // 2: cyan cornice
  0x0f172a, // 3: dark obsidian facade
  0x1e1b4b, // 4: synth-violet brick
  0x1e1b4b, // 5: cyber door
  0x090d16, // 6: carbon frame
  0xfacc15, // 7: gold terminal
  0x831843, // 8: synth awning dark
  0xec4899, // 9: pink neon awning
  0x090d16, // 10: black mirror sign bg
  0x38bdf8, // 11: holographic cyan text
  0x090d16, // 12: carbon plinth
  0x06b6d4, // 13: cyan conduit pipe
  0x0f172a, // 14: solar carbon roof
  0x1e1b4b, // 15: synth roof grid
  0xd946ef, // 16: neon magenta datapad
  0x06b6d4, // 17: cyan datapad
  0xf43f5e, // 18: neon red datapad
  0xfacc15, // 19: neon yellow datapad
  0x334155, // 20: tech vent chimney
  0x06b6d4, // 21: cyan emitter pot
  0x38bdf8, // 22: plasma vapor
  0x10b981, // 23: emerald datapad
  0x090d16, // 24: holographic board
];

// ${boxes.length} Monolithic Boxes: [w, h, d, x, y, z, swatchId]
const BOOKS_BOXES: readonly [number, number, number, number, number, number, number][] = [
${boxLines.join('\n')}
];

export function populateBooksBuilder(b: VoxelMeshBuilder, biome: BiomeType = 'forest'): void {
  let pal = BOOKS_PALETTE_FOREST;
  if (biome === 'winter') pal = BOOKS_PALETTE_WINTER;
  else if (biome === 'desert') pal = BOOKS_PALETTE_DESERT;
  else if (biome === 'neon') pal = BOOKS_PALETTE_NEON;

  for (let i = 0; i < BOOKS_BOXES.length; i++) {
    const box = BOOKS_BOXES[i];
    b.addBox(box[0], box[1], box[2], box[3], box[4], box[5], pal[box[6]]);
  }
}
`;

fs.writeFileSync(targetTsPath, tsContent, 'utf8');
const linesCount = tsContent.split('\n').length;
console.log(`Generated ${targetTsPath} with ${linesCount} lines (limit: 300).`);
