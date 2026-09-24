import { WORLD_CONFIG, type LogPlatform, type Vehicle } from './types.ts';

export function checkVehicleCollision(playerX: number, vehicles: Vehicle[]): Vehicle | null {
  for (const v of vehicles) {
    const halfSpan = (WORLD_CONFIG.PLAYER_WIDTH + v.length) / 2;
    if (Math.abs(playerX - v.x) < halfSpan) {
      return v;
    }
  }
  return null;
}

export function findSupportingLog(playerX: number, logs: LogPlatform[]): LogPlatform | null {
  for (const log of logs) {
    const halfLen = log.length / 2 + WORLD_CONFIG.LOG_MARGIN;
    if (Math.abs(playerX - log.x) <= halfLen) {
      return log;
    }
  }
  return null;
}

export function isOutOfBoundsX(playerX: number): boolean {
  return Math.abs(playerX) > WORLD_CONFIG.OUT_OF_BOUNDS_X;
}

export function quantizeLandX(x: number): number {
  const rounded = Math.round(x);
  return Math.max(WORLD_CONFIG.MIN_X, Math.min(WORLD_CONFIG.MAX_X, rounded));
}
