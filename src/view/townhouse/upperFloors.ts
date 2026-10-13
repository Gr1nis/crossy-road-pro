import { VoxelMeshBuilder } from '../voxelMeshBuilder.ts';

/**
 * Townhouse C (Books): Upper floors, quoins, cornices, windows, downspout and winter snow layer.
 * Strictly adheres to docs/VOXEL_GRID_SPECIFICATION.md (VOXEL_UNIT = 0.05).
 */
export function buildBooksUpperFloors(b: VoxelMeshBuilder, isWinter: boolean): void {
  // Color palette constants
  const cLimestone = 0xdcfce7; // Известняк (карнизы, рустовка, наличники, сандрики)
  const cWall = 0x15803d;      // Изумрудные стены книжного таунхауса
  const cGlass = 0xfef08a;     // Теплое стекло с внутренним светом
  const cWood = 0x713f12;      // Мореный дуб (цветочные ящики)
  const cGreen = 0x166534;     // Хвойная / растительная зелень
  const cBerry = 0xef4444;     // Красные акцентные ягоды / цветы
  const cPipe = 0x334155;      // Базальтовый сланец (водосточная труба)
  const cSnow = 0xf8fafc;      // Чистый снежный покров

  // 1. Междуэтажный карниз (Mid-Cornice) — поясок из известняка на Y=1.45
  b.addBox(1.70, 0.10, 1.50, 0.00, 1.45, 0.00, cLimestone);

  // 2. Жилые этажи (Upper Floors Walls) — изумрудные стены на Y=2.10
  b.addBox(1.60, 1.20, 1.40, 0.00, 2.10, 0.00, cWall);

  // 3. Венчающий карниз (Upper Cornice) — завершение стен на Y=2.75
  b.addBox(1.70, 0.10, 1.50, 0.00, 2.75, 0.00, cLimestone);

  // 4. Рустовка на 4 углах (Quoins) — чередующиеся длинные (0.15) и короткие (0.10) блоки
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
        b.addBox(qw, 0.10, qd, cx, quoinYs[q], cz, cLimestone);
      }
    }
  }

  // 5. 3 окна верхнего этажа на главном фасаде (X = -0.45, 0.00, 0.45)
  const frontWindowXs = [-0.45, 0.00, 0.45];
  for (let i = 0; i < frontWindowXs.length; i++) {
    const wx = frontWindowXs[i];

    // Наличники и теплое стекло (Z = 0.75)
    b.addBox(0.35, 0.70, 0.05, wx, 2.15, 0.75, cLimestone);
    b.addBox(0.25, 0.60, 0.05, wx, 2.15, 0.75, cGlass);

    // Выступающий подоконник и верхний сандрик
    b.addBox(0.40, 0.05, 0.10, wx, 1.75, 0.75, cLimestone);
    b.addBox(0.40, 0.05, 0.10, wx, 2.55, 0.75, cLimestone);

    // Деревянные ящики с цветами (дерево, зелень, красные ягоды)
    b.addBox(0.35, 0.10, 0.10, wx, 1.65, 0.80, cWood);
    b.addBox(0.30, 0.05, 0.05, wx, 1.75, 0.80, cGreen);
    b.addBox(0.05, 0.05, 0.05, wx - 0.10, 1.80, 0.80, cBerry);
    b.addBox(0.05, 0.05, 0.05, wx + 0.10, 1.80, 0.80, cBerry);
  }

  // 6. Боковой фасад: 2 окна (1-й и 2-й этажи) и вертикальная водосточная труба
  // Окно 2-го этажа (Y = 2.15)
  b.addBox(0.05, 0.60, 0.30, -0.85, 2.15, 0.00, cLimestone);
  b.addBox(0.05, 0.50, 0.20, -0.85, 2.15, 0.00, cGlass);
  b.addBox(0.10, 0.05, 0.35, -0.85, 1.80, 0.00, cLimestone);

  // Окно 1-го этажа (Y = 0.80)
  b.addBox(0.05, 0.60, 0.30, -0.85, 0.80, 0.00, cLimestone);
  b.addBox(0.05, 0.50, 0.20, -0.85, 0.80, 0.00, cGlass);
  b.addBox(0.10, 0.05, 0.35, -0.85, 0.45, 0.00, cLimestone);

  // Вертикальная водосточная труба на передне-левом углу
  b.addBox(0.05, 2.40, 0.05, -0.80, 1.40, 0.65, cPipe);

  // 7. Зимний слой (isWinter) — снежные шапки на выступах
  if (isWinter) {
    // Верхний карниз (передний и боковой свесы)
    b.addBox(1.70, 0.05, 0.10, 0.00, 2.85, 0.70, cSnow);
    b.addBox(0.10, 0.05, 1.50, -0.80, 2.85, 0.00, cSnow);

    // Междуэтажный карниз (передний и боковой свесы)
    b.addBox(1.70, 0.05, 0.10, 0.00, 1.55, 0.70, cSnow);
    b.addBox(0.10, 0.05, 1.50, -0.80, 1.55, 0.00, cSnow);

    // Подоконники и сандрики 3 главных окон
    for (let i = 0; i < frontWindowXs.length; i++) {
      const wx = frontWindowXs[i];
      b.addBox(0.40, 0.05, 0.10, wx, 2.60, 0.75, cSnow); // Снег на сандрике
      b.addBox(0.35, 0.05, 0.10, wx, 1.80, 0.75, cSnow); // Снег на подоконнике
    }

    // Подоконники боковых окон (1-й и 2-й этажи)
    b.addBox(0.10, 0.05, 0.35, -0.85, 1.85, 0.00, cSnow);
    b.addBox(0.10, 0.05, 0.35, -0.85, 0.50, 0.00, cSnow);
  }
}
