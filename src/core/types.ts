export const LaneType = {
  GRASS: 'GRASS',
  ROAD: 'ROAD',
  RIVER: 'RIVER',
  RAILWAY: 'RAILWAY',
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
  TRAIN: 'TRAIN',
  WATER: 'WATER',
  OUT_OF_BOUNDS: 'OUT_OF_BOUNDS',
  CAMERA_BEHIND: 'CAMERA_BEHIND',
} as const;

export type DeathReasonValue = (typeof DeathReason)[keyof typeof DeathReason];

export type SkinId = 'chicken' | 'cyber_duck' | 'shadow_ninja' | 'frost_penguin';

export const ALL_SKINS: ReadonlyArray<{ id: SkinId; name: string; badge: string }> = [
  { id: 'chicken', name: 'Классическая Курица', badge: '🐔' },
  { id: 'cyber_duck', name: 'Кибер-Утка', badge: '🦆' },
  { id: 'shadow_ninja', name: 'Тень-Ниндзя', badge: '🥷' },
  { id: 'frost_penguin', name: 'Арктический Пингвин', badge: '🐧' },
];

export type ObstacleKind = 'tree' | 'rock' | 'bush';

export interface ObstacleDetail {
  x: number;
  kind: ObstacleKind;
}

export interface Vehicle {
  id: number;
  x: number;
  length: number;
  speed: number;
  type: 'car' | 'truck';
  color: number;
}

export interface LogPlatform {
  id: number;
  x: number;
  length: number;
  speed: number;
}

export interface TrainState {
  timer: number;
  period: number;
  warningDuration: number;
  isWarning: boolean;
  isPassing: boolean;
  x: number;
  length: number;
  speed: number;
}

export interface Lane {
  index: number;
  type: LaneTypeValue;
  obstacles: number[];
  obstacleDetails: ObstacleDetail[];
  coins: number[];
  vehicles: Vehicle[];
  logs: LogPlatform[];
  train?: TrainState;
  direction: 1 | -1;
  speed: number;
}

export interface PlayerState {
  row: number;
  x: number;
  targetRow: number;
  targetX: number;
  startRow: number;
  startX: number;
  isHopping: boolean;
  hopProgress: number;
  ridingLogId: number | null;
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
  WRAP_LIMIT: 22,
  HOP_DURATION: 0.12,
  PLAYER_WIDTH: 0.65,
  LOG_MARGIN: 0.12,
  CAMERA_BACK_LIMIT: 6.5,
  BASE_CAMERA_SPEED: 0.85,
  GACHA_COST: 100,
} as const;
