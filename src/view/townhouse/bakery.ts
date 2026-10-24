import type { BiomeType } from '../../core/types.ts';
import { VoxelMeshBuilder } from '../voxelMeshBuilder.ts';

/**
 * Red Brick Bakery / Desert Adobe Bakehouse / Neon Synth-Bakery for Townhouse B.
 * Strictly complies with docs/VOXEL_GRID_SPECIFICATION.md (VOXEL_UNIT = 0.05).
 */
export function populateBakeryBuilder(builder: VoxelMeshBuilder, biome: BiomeType = 'forest'): void {
  const W = 1.60;
  const D = 1.40;
  const hw = W * 0.5;
  const hd = D * 0.5;

  const isWinter = biome === 'winter';
  const isDesert = biome === 'desert';
  const isNeon = biome === 'neon';

  // Palettes for biomes
  let cPlinth = 0x334155;
  let cBrick = 0xba3224;
  let cStone = 0xf59e0b;
  const cSnow = 0xf8fafc;
  const cWindow = isNeon ? 0xec4899 : 0xfef08a;
  let cDoor = 0x713f12;
  const cGarland = 0x166534;
  let cBerry = 0xef4444;
  let cSign = 0x451a03;
  let cSignText = 0xffedd5;
  const cSmoke = isNeon ? 0x38bdf8 : 0xe2e8f0;
  let cRoof = 0x78350f;

  if (isDesert) {
    // Desert: sandstone/terracotta walls 0xd97706, 0xf59e0b, adobe roof 0xb45309
    cPlinth = 0x78350f;
    cBrick = 0xd97706;
    cStone = 0xf59e0b;
    cDoor = 0x78350f;
    cBerry = 0xb45309;
    cSign = 0x78350f;
    cSignText = 0xfde68a;
    cRoof = 0xb45309;
  } else if (isNeon) {
    // Neon: dark obsidian 0x0f172a, 0x1e1b4b, cyan/magenta neon trim 0x06b6d4, 0xec4899
    cPlinth = 0x090d16;
    cBrick = 0x0f172a;
    cStone = 0x06b6d4;
    cDoor = 0x1e1b4b;
    cBerry = 0x06b6d4;
    cSign = 0x1e1b4b;
    cSignText = 0x06b6d4;
    cRoof = 0x1e1b4b;
  }

  // 1. Plinth / Foundation
  builder.addBox(1.68, 0.14, 1.48, 0, 0.07, 0, cPlinth);
  builder.addBox(1.64, 0.04, 1.44, 0, 0.16, 0, cPlinth);

  // 2. Core Brick / Sandstone / Obsidian Walls & Cornices
  builder.addBox(W, 1.25, D, 0, 0.805, 0, cBrick);
  builder.addBox(1.66, 0.10, 1.46, 0, 1.48, 0, cStone);
  builder.addBox(W, 0.95, D, 0, 2.005, 0, cBrick);
  builder.addBox(W, 0.95, D, 0, 2.955, 0, cBrick);
  builder.addBox(1.66, 0.10, 1.46, 0, 3.48, 0, cStone);

  // 3. Quoins (Рустовка на 4 углах)
  const cornerXs = [-hw, hw];
  const cornerZs = [-hd, hd];
  for (let ci = 0; ci < 2; ci++) {
    const cx = cornerXs[ci];
    const sx = cx < 0 ? 1 : -1;
    for (let cj = 0; cj < 2; cj++) {
      const cz = cornerZs[cj];
      const sz = cz < 0 ? 1 : -1;
      for (let q = 0; q < 14; q++) {
        const qy = 0.24 + q * 0.23;
        const isLong = q % 2 === 0;
        const qw = isLong ? 0.14 : 0.08;
        const qd = isLong ? 0.08 : 0.14;
        builder.addBox(qw, 0.14, qd, cx + sx * (qw * 0.5 - 0.02), qy, cz + sz * (qd * 0.5 - 0.02), cStone);
      }
    }
  }

  // 4. Ground Floor Features (Front Facade at Z = hd = 0.70)
  builder.addBox(0.42, 0.94, 0.04, 0, 0.65, hd + 0.005, cStone);
  builder.addBox(0.36, 0.88, 0.06, 0, 0.62, hd + 0.01, cDoor);
  builder.addBox(0.20, 0.32, 0.03, 0, 0.78, hd + 0.03, cWindow);
  const shopWindows = [-0.48, 0.48];
  for (let i = 0; i < 2; i++) {
    const wx = shopWindows[i];
    builder.addBox(0.46, 0.78, 0.06, wx, 0.65, hd + 0.01, cStone);
    builder.addBox(0.34, 0.66, 0.08, wx, 0.65, hd + 0.02, cWindow);
    builder.addBox(0.38, 0.10, 0.07, wx, 1.05, hd + 0.015, cStone);
    if (isWinter) {
      builder.addBox(0.38, 0.04, 0.09, wx, 1.11, hd + 0.02, cSnow);
    }
  }

  // 5. 'BAKERY' Sign
  builder.addBox(0.76, 0.22, 0.08, 0, 1.28, hd + 0.04, cSign);
  builder.addBox(0.66, 0.12, 0.04, 0, 1.28, hd + 0.08, cSignText);
  if (isWinter) {
    builder.addBox(0.80, 0.08, 0.12, 0, 1.40, hd + 0.05, cSnow);
  }

  // 6. 2nd & 3rd Floor Arched Windows
  const winXs = [-0.46, 0, 0.46];
  const winYs = [2.00, 2.95];
  for (let y = 0; y < 2; y++) {
    const wy = winYs[y];
    for (let x = 0; x < 3; x++) {
      const wx = winXs[x];
      builder.addBox(0.32, 0.05, 0.08, wx, wy - 0.26, hd + 0.02, cStone);
      if (isWinter) {
        builder.addBox(0.30, 0.03, 0.09, wx, wy - 0.22, hd + 0.025, cSnow);
      }
      builder.addBox(0.30, 0.54, 0.05, wx, wy + 0.02, hd + 0.01, cStone);
      builder.addBox(0.20, 0.44, 0.07, wx, wy + 0.02, hd + 0.02, cWindow);
      builder.addBox(0.08, 0.08, 0.07, wx, wy + 0.31, hd + 0.02, cStone);
      if (isWinter) {
        builder.addBox(0.24, 0.04, 0.08, wx, wy + 0.33, hd + 0.02, cSnow);
      }
    }
  }

  // 7. Festive Garland (Pine Needles & Berries)
  if (isWinter) {
    const garlandYs = [1.22, 2.45, 3.38];
    for (let g = 0; g < 3; g++) {
      const gy = garlandYs[g];
      for (let s = 0; s < 3; s++) {
        const sx = -0.48 + s * 0.48;
        builder.addBox(0.40, 0.08, 0.08, sx, gy - 0.03, hd + 0.03, cGarland);
        builder.addBox(0.06, 0.06, 0.09, sx - 0.20, gy, hd + 0.04, cBerry);
      }
      builder.addBox(0.06, 0.06, 0.09, 0.48, gy, hd + 0.04, cBerry);

      const sideXs = [-hw - 0.02, hw + 0.02];
      for (let x = 0; x < 2; x++) {
        const gx = sideXs[x];
        for (let s = 0; s < 2; s++) {
          const sz = -0.28 + s * 0.56;
          builder.addBox(0.08, 0.08, 0.48, gx, gy - 0.03, sz, cGarland);
          builder.addBox(0.09, 0.06, 0.06, gx, gy, sz - 0.24, cBerry);
        }
        builder.addBox(0.09, 0.06, 0.06, gx, gy, 0.32, cBerry);
      }
    }
  }

  // 8. Flat Roof & Battlements (Zubtsy)
  builder.addBox(W - 0.12, 0.12, D - 0.12, 0, 3.52, 0, isWinter ? cSnow : cRoof);
  const teethX = [-0.60, -0.20, 0.20, 0.60];
  const teethZBounds = [-hd + 0.06, hd - 0.06];
  for (let x = 0; x < 4; x++) {
    const tx = teethX[x];
    for (let z = 0; z < 2; z++) {
      const tz = teethZBounds[z];
      builder.addBox(0.24, 0.30, 0.14, tx, 3.68, tz, cBrick);
      if (isWinter) {
        builder.addBox(0.26, 0.08, 0.16, tx, 3.86, tz, cSnow);
      }
    }
  }
  const midTeethZ = [-0.22, 0.22];
  const teethXBounds = [-hw + 0.06, hw - 0.06];
  for (let z = 0; z < 2; z++) {
    const tz = midTeethZ[z];
    for (let x = 0; x < 2; x++) {
      const tx = teethXBounds[x];
      builder.addBox(0.14, 0.30, 0.24, tx, 3.68, tz, cBrick);
      if (isWinter) {
        builder.addBox(0.16, 0.08, 0.26, tx, 3.86, tz, cSnow);
      }
    }
  }

  // 9. Chimney with Smoke Puffs
  const chimX = 0.46;
  const chimZ = -0.26;
  builder.addBox(0.26, 0.65, 0.26, chimX, 3.85, chimZ, cBrick);
  builder.addBox(0.30, 0.08, 0.30, chimX, 4.20, chimZ, cStone);
  if (isWinter) {
    builder.addBox(0.32, 0.06, 0.32, chimX, 4.26, chimZ, cSnow);
    builder.addBox(0.08, 0.08, 0.08, chimX, 4.36, chimZ, cSmoke);
    builder.addBox(0.09, 0.09, 0.09, chimX - 0.03, 4.49, chimZ + 0.02, cSmoke);
    builder.addBox(0.08, 0.08, 0.08, chimX + 0.02, 4.62, chimZ + 0.04, cSmoke);
    builder.addBox(0.06, 0.06, 0.06, chimX - 0.01, 4.74, chimZ + 0.05, cSmoke);
  }
}
