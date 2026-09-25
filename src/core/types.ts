export const LaneType = {
  GRASS: 'GRASS',
  ROAD: 'ROAD',
  RIVER: 'RIVER',
} as const;

export type LaneTypeValue = (typeof LaneType)[keyof typeof LaneType];

export const MoveDirection = {
  FORWARD: 'FORWARD',
  BACKWARD: 'BACKWARD',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
} as const;

export type MoveDirectionValue = (typeof MoveDirection)[keyof typeof MoveDirection];

export const DeathReason = {
  NONE: 'NONE',
  CAR: 'CAR',
  WATER: 'WATER',
  OUT_OF_BOUNDS: 'OUT_OF_BOUNDS',
  CAMERA_BEHIND: 'CAMERA_BEHIND',
} as const;

export type DeathReasonValue = (typeof DeathReason)[keyof typeof DeathReason];

export interface Vehicle {
  id: number;
  x: number;       // Центр автомобиля по оси X
  length: number;  // Длина автомобиля (в тайлах, напр. 1.4 для легковой, 2.4 для грузовика)
  speed: number;   // Скорость (тайлов/сек, со знаком направления)
  type: 'car' | 'truck';
  color: number;
}

export interface LogPlatform {
  id: number;
  x: number;       // Центр бревна по оси X
  length: number;  // Длина бревна (в тайлах, напр. 2.5 .. 4.0)
  speed: number;   // Скорость течения (тайлов/сек, со знаком направления)
}

export interface Lane {
  index: number;
  type: LaneTypeValue;
  obstacles: number[];    // Заблокированные целочисленные координаты X (деревья/камни на GRASS)
  vehicles: Vehicle[];    // Автомобили (для ROAD)
  logs: LogPlatform[];    // Брёвна (для RIVER)
  direction: 1 | -1;      // Направление движения на полосе
  speed: number;          // Базовая скорость полосы
}

export interface PlayerState {
  row: number;            // Текущая полоса Z (целое число в покое, интерполируется при прыжке)
  x: number;              // Координата X (целая на суше, непрерывная на бревне)
  targetRow: number;      // Целевая полоса Z при прыжке
  targetX: number;        // Целевая координата X при прыжке
  startRow: number;       // Начальная полоса Z текущего прыжка
  startX: number;         // Начальная координата X текущего прыжка
  isHopping: boolean;     // Находится ли в фазе прыжка
  hopProgress: number;    // Прогресс прыжка [0..1]
  ridingLogId: number | null; // ID бревна, на котором стоит игрок (если на RIVER)
  isDead: boolean;
  deathReason: DeathReasonValue;
  facing: MoveDirectionValue;
}

export interface StorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export const WORLD_CONFIG = {
  MIN_X: -9,
  MAX_X: 9,
  OUT_OF_BOUNDS_X: 9.6,
  WRAP_LIMIT: 22,         // Граница бесшовного заворачивания трафика и брёвен за пределами экрана 16:9 / 21:9
  HOP_DURATION: 0.12,     // Длительность прыжка (120 мс)
  PLAYER_WIDTH: 0.65,     // Ширина хитбокса игрока
  LOG_MARGIN: 0.12,       // Честный допуск посадки на торец бревна (без зависания над водой)
  CAMERA_BACK_LIMIT: 5.5, // Максимальное отставание позади камеры
  BASE_CAMERA_SPEED: 0.85 // Скорость ползущего скролла камеры (полос/сек)
} as const;
