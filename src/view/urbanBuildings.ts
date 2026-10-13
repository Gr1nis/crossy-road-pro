import * as THREE from 'three';
import type { BiomeType } from '../core/types.ts';
import { VoxelMeshBuilder } from './voxelMeshBuilder.ts';
import { buildBooksShopfront } from './townhouse/shopfront.ts';
import { buildBooksUpperFloors } from './townhouse/upperFloors.ts';
import { buildBooksRoof } from './townhouse/roof.ts';

function populateCafeBuilder(b: VoxelMeshBuilder, isWinter: boolean): void {
  const cPlinth = 0x334155;
  const cWall = 0x2563eb;
  const cTrim = 0x1d4ed8;
  const cWhite = 0xf8fafc;
  const cDoor = 0x713f12;
  const cGlass = 0xfef08a;
  const cGold = 0xfacc15;
  const cRed = 0xdc2626;
  const cSign = 0x451a03;
  const cGreen = 0x16a34a;
  const cBerry = 0xef4444;
  const cRoof = 0xb45309;
  const cRidge = 0x92400e;
  const cChimney = 0x64748b;
  const cGarland = 0x166534;
  const cSmoke = 0xe2e8f0;

  // 1. Plinth (Цоколь) — Basalt dark slate, 1 voxel wider than walls
  b.addBox(1.70, 0.10, 1.50, 0, 0.05, 0, cPlinth);
  b.addBox(1.65, 0.10, 1.45, 0, 0.15, 0, cPlinth);

  // 2. Commercial 1st floor — Ultramarine facade & white mid-cornice
  b.addBox(1.60, 1.20, 1.40, 0, 0.80, 0, cWall);
  b.addBox(1.70, 0.10, 1.50, 0, 1.45, 0, cWhite);

  // Entrance door portal (bog oak with warm transom and brass doorknob)
  b.addBox(0.45, 1.00, 0.05, -0.45, 0.70, 0.75, cTrim);
  b.addBox(0.35, 0.90, 0.05, -0.45, 0.65, 0.75, cDoor);
  b.addBox(0.25, 0.35, 0.05, -0.45, 0.85, 0.75, cGlass);
  b.addBox(0.05, 0.05, 0.05, -0.30, 0.55, 0.80, cGold);
  b.addBox(0.45, 0.05, 0.10, -0.45, 0.20, 0.75, cPlinth);

  // Wide showcase window (warm interior light with white frames)
  b.addBox(0.75, 0.85, 0.05, 0.30, 0.70, 0.75, cWhite);
  b.addBox(0.65, 0.75, 0.05, 0.30, 0.70, 0.75, cGlass);
  b.addBox(0.75, 0.05, 0.10, 0.30, 0.25, 0.75, cDoor);
  b.addBox(0.05, 0.75, 0.05, 0.30, 0.70, 0.80, cWhite);
  b.addBox(0.65, 0.05, 0.05, 0.30, 0.90, 0.80, cWhite);

  // Striped awning (8 alternating red and white stripes, sloped)
  for (let i = 0; i < 8; i++) {
    const ax = -0.05 + i * 0.10;
    const col = i % 2 === 0 ? cRed : cWhite;
    b.addBox(0.10, 0.05, 0.15, ax, 1.25, 0.80, col);
    b.addBox(0.10, 0.10, 0.15, ax, 1.15, 0.95, col);
  }

  // Front 'CAFE' sign above awning
  b.addBox(0.65, 0.15, 0.05, 0.30, 1.35, 0.75, cSign);
  b.addBox(0.70, 0.05, 0.05, 0.30, 1.45, 0.75, cDoor);
  b.addBox(0.05, 0.10, 0.05, 0.15, 1.35, 0.80, cWhite); // C
  b.addBox(0.05, 0.10, 0.05, 0.25, 1.35, 0.80, cWhite); // A
  b.addBox(0.05, 0.10, 0.05, 0.35, 1.35, 0.80, cWhite); // F
  b.addBox(0.05, 0.10, 0.05, 0.45, 1.35, 0.80, cWhite); // E

  // Hanging cantilever sign with coffee cup
  b.addBox(0.15, 0.05, 0.05, -0.85, 1.25, 0.40, cPlinth);
  b.addBox(0.05, 0.25, 0.25, -0.95, 1.15, 0.40, cSign);
  b.addBox(0.05, 0.20, 0.20, -0.95, 1.15, 0.40, cWhite);
  b.addBox(0.05, 0.10, 0.10, -0.95, 1.10, 0.40, cDoor);
  b.addBox(0.05, 0.05, 0.05, -0.95, 1.20, 0.40, cGlass);

  // Sidewalk planters & cafe bench
  for (const px of [-0.70, 0.70]) {
    b.addBox(0.15, 0.15, 0.15, px, 0.25, 0.75, cRoof);
    b.addBox(0.10, 0.20, 0.10, px, 0.40, 0.75, cGreen);
  }
  b.addBox(0.40, 0.05, 0.15, 0.30, 0.20, 0.80, cDoor);
  b.addBox(0.05, 0.10, 0.10, 0.15, 0.10, 0.80, cDoor);
  b.addBox(0.05, 0.10, 0.10, 0.45, 0.10, 0.80, cDoor);

  // 3. Quoins (Рустовка на 4 углах)
  const cornerXs = [-0.80, 0.80];
  const cornerZs = [-0.70, 0.70];
  const quoinYs = [0.30, 0.70, 1.10, 1.70, 2.10, 2.50];
  for (let ci = 0; ci < 2; ci++) {
    const cx = cornerXs[ci];
    for (let cj = 0; cj < 2; cj++) {
      const cz = cornerZs[cj];
      for (let q = 0; q < quoinYs.length; q++) {
        const isLong = q % 2 === 0;
        const qw = isLong ? 0.15 : 0.10;
        const qd = isLong ? 0.10 : 0.15;
        b.addBox(qw, 0.10, qd, cx, quoinYs[q], cz, cWhite);
      }
    }
  }

  // 4. 2nd Floor Walls, Windows & Flower Boxes
  b.addBox(1.60, 1.20, 1.40, 0, 2.10, 0, cWall);
  b.addBox(1.70, 0.10, 1.50, 0, 2.75, 0, cWhite); // Upper cornice

  for (const wx of [-0.35, 0.35]) {
    b.addBox(0.35, 0.70, 0.05, wx, 2.15, 0.75, cWhite);
    b.addBox(0.25, 0.60, 0.05, wx, 2.15, 0.75, cGlass);
    b.addBox(0.40, 0.05, 0.10, wx, 1.75, 0.75, cWhite);
    b.addBox(0.40, 0.05, 0.10, wx, 2.55, 0.75, cWhite);
    b.addBox(0.35, 0.10, 0.10, wx, 1.65, 0.80, cDoor);
    b.addBox(0.30, 0.05, 0.05, wx, 1.75, 0.80, cGreen);
    b.addBox(0.05, 0.05, 0.05, wx - 0.10, 1.80, 0.80, cBerry);
    b.addBox(0.05, 0.05, 0.05, wx + 0.10, 1.80, 0.80, cBerry);
  }

  // Side facade windows & downspout
  b.addBox(0.05, 0.60, 0.30, -0.85, 2.15, 0, cWhite);
  b.addBox(0.05, 0.50, 0.20, -0.85, 2.15, 0, cGlass);
  b.addBox(0.10, 0.05, 0.35, -0.85, 1.80, 0, cWhite);
  b.addBox(0.05, 0.60, 0.30, -0.85, 0.80, 0, cWhite);
  b.addBox(0.05, 0.50, 0.20, -0.85, 0.80, 0, cGlass);
  b.addBox(0.10, 0.05, 0.35, -0.85, 0.45, 0, cWhite);
  b.addBox(0.05, 2.40, 0.05, -0.80, 1.40, 0.65, cChimney);

  // 5. Mansard Roof, Dormer Windows & Chimney
  b.addBox(1.55, 0.20, 1.35, 0, 2.90, 0, cRoof);
  b.addBox(1.45, 0.20, 1.20, 0, 3.10, 0, cRoof);
  b.addBox(1.35, 0.20, 1.05, 0, 3.30, 0, cRoof);
  b.addBox(1.25, 0.20, 0.90, 0, 3.50, 0, cRoof);
  b.addBox(1.15, 0.10, 0.80, 0, 3.65, 0, cRidge);

  for (const lx of [-0.35, 0.35]) {
    b.addBox(0.30, 0.25, 0.25, lx, 3.10, 0.55, cWall);
    b.addBox(0.20, 0.20, 0.05, lx, 3.10, 0.70, cGlass);
    b.addBox(0.25, 0.05, 0.05, lx, 2.95, 0.70, cWhite);
    b.addBox(0.35, 0.10, 0.30, lx, 3.30, 0.55, cRoof);
  }

  // Brick chimney with cap
  b.addBox(0.25, 0.60, 0.25, 0.45, 3.80, -0.25, cChimney);
  b.addBox(0.30, 0.10, 0.30, 0.45, 4.15, -0.25, cPlinth);
  b.addBox(0.15, 0.10, 0.15, 0.45, 4.25, -0.25, cTrim);

  // 6. Winter Layer (Snow caps, garland, chimney smoke)
  if (isWinter) {
    b.addBox(1.20, 0.10, 0.85, 0, 3.75, 0, cWhite); // Roof snow
    b.addBox(1.40, 0.05, 0.20, 0, 3.55, 0.40, cWhite); // Front mansard slope snow
    b.addBox(1.40, 0.05, 0.20, 0, 3.55, -0.40, cWhite); // Back slope snow
    for (const lx of [-0.35, 0.35]) {
      b.addBox(0.35, 0.05, 0.30, lx, 3.40, 0.55, cWhite);
    }
    b.addBox(1.70, 0.05, 0.10, 0, 2.85, 0.70, cWhite);
    b.addBox(0.10, 0.05, 1.50, -0.80, 2.85, 0, cWhite);
    b.addBox(1.70, 0.05, 0.10, 0, 1.55, 0.70, cWhite);
    b.addBox(0.10, 0.05, 1.50, -0.80, 1.55, 0, cWhite);

    for (const wx of [-0.35, 0.35]) {
      b.addBox(0.40, 0.05, 0.10, wx, 2.60, 0.75, cWhite);
      b.addBox(0.35, 0.05, 0.10, wx, 1.80, 0.75, cWhite);
    }
    b.addBox(0.10, 0.05, 0.35, -0.85, 1.85, 0, cWhite);
    b.addBox(0.85, 0.05, 0.20, 0.30, 1.30, 0.90, cWhite);
    b.addBox(0.70, 0.05, 0.05, 0.30, 1.45, 0.75, cWhite);
    b.addBox(0.05, 0.05, 0.25, -0.95, 1.30, 0.40, cWhite);

    for (const px of [-0.70, 0.70]) {
      b.addBox(0.15, 0.05, 0.15, px, 0.55, 0.75, cWhite);
    }
    b.addBox(0.40, 0.05, 0.15, 0.30, 0.25, 0.80, cWhite);
    b.addBox(0.30, 0.05, 0.30, 0.45, 4.25, -0.25, cWhite);

    // Chimney smoke puffs
    b.addBox(0.10, 0.10, 0.10, 0.45, 4.40, -0.25, cSmoke);
    b.addBox(0.10, 0.10, 0.10, 0.40, 4.55, -0.20, cSmoke);
    b.addBox(0.10, 0.10, 0.10, 0.45, 4.70, -0.15, cSmoke);
    b.addBox(0.05, 0.05, 0.05, 0.40, 4.80, -0.15, cSmoke);

    // Festive garland with berries along cornice
    for (const gx of [-0.50, 0.00, 0.50]) {
      b.addBox(0.45, 0.05, 0.05, gx, 1.40, 0.75, cGarland);
    }
    for (const bx of [-0.65, -0.25, 0.25, 0.65]) {
      b.addBox(0.05, 0.05, 0.05, bx, 1.40, 0.80, cBerry);
    }
    b.addBox(0.05, 0.05, 0.60, -0.85, 1.40, 0.20, cGarland);
    for (const bz of [-0.10, 0.50]) {
      b.addBox(0.05, 0.05, 0.05, -0.85, 1.40, bz, cBerry);
    }
  }
}

function populateBakeryBuilder(builder: VoxelMeshBuilder, isWinter: boolean): void {
  const W = 1.60;
  const D = 1.40;
  const hw = W * 0.5;
  const hd = D * 0.5;

  // Colors based on reference: 22_winter_brick_bakery_turnaround.jpg
  const cPlinth = 0x334155;
  const cBrick = 0xba3224;
  const cStone = 0xf59e0b;
  const cSnow = 0xf8fafc;
  const cWindow = 0xfef08a;
  const cDoor = 0x713f12;
  const cGarland = 0x166534;
  const cBerry = 0xef4444;
  const cSign = 0x451a03;
  const cSignText = 0xffedd5;
  const cSmoke = 0xe2e8f0;

  // 1. Plinth / Foundation
  builder.addBox(1.68, 0.14, 1.48, 0, 0.07, 0, cPlinth);
  builder.addBox(1.64, 0.04, 1.44, 0, 0.16, 0, cPlinth);

  // 2. Core Brick Walls & Cornices
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

  // 8. Flat Roof & Battlements (Zubtsy with Snow Caps)
  builder.addBox(W - 0.12, 0.12, D - 0.12, 0, 3.52, 0, isWinter ? cSnow : 0x78350f);
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

function populateBooksBuilder(builder: VoxelMeshBuilder, isWinter: boolean): void {
  buildBooksShopfront(builder, isWinter);
  buildBooksUpperFloors(builder, isWinter);
  buildBooksRoof(builder, isWinter);
}

/** Townhouse A: Parisian Blue Cafe (Ref: 11_townhouse_cafe_turnaround.jpg) */
export function createTownhouseA(isWinter = false): THREE.Group {
  const group = new THREE.Group();
  const key = isWinter ? 'townhouse_a_winter' : 'townhouse_a';
  const mesh = VoxelMeshBuilder.buildCachedMesh(key, (b) => {
    populateCafeBuilder(b, isWinter);
  });
  group.add(mesh);
  return group;
}

/** Townhouse B: Red Brick Bakery (Ref: 12_townhouse_bakery_turnaround.jpg / 22_winter_brick_bakery_turnaround.jpg) */
export function createTownhouseB(isWinter = false): THREE.Group {
  const group = new THREE.Group();
  const key = isWinter ? 'townhouse_b_winter' : 'townhouse_b';
  const mesh = VoxelMeshBuilder.buildCachedMesh(key, (b) => {
    populateBakeryBuilder(b, isWinter);
  });
  group.add(mesh);
  return group;
}

/** Townhouse C: Green Books Store (Ref: 13_townhouse_books_turnaround.jpg) */
export function createTownhouseC(isWinter = false): THREE.Group {
  const group = new THREE.Group();
  const key = isWinter ? 'townhouse_c_winter' : 'townhouse_c';
  const mesh = VoxelMeshBuilder.buildCachedMesh(key, (b) => {
    populateBooksBuilder(b, isWinter);
  });
  group.add(mesh);
  return group;
}

export function createUrbanTownhouse(seed: number, biome: BiomeType = 'forest'): THREE.Group {
  const root = new THREE.Group();
  root.name = 'urbanTownhouse';
  const variant = Math.abs(seed) % 3;
  const isWinter = biome === 'winter';
  let bldg: THREE.Group;
  if (variant === 0) bldg = createTownhouseA(isWinter);
  else if (variant === 1) bldg = createTownhouseB(isWinter);
  else bldg = createTownhouseC(isWinter);

  bldg.position.z = -0.1325;
  root.add(bldg);
  root.scale.set(0.95, 0.95, 0.95);
  return root;
}
