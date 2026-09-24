import type { LogPlatform, Vehicle } from './types.ts';

export function checkVehicleCollision(_playerX: number, _vehicles: Vehicle[]): Vehicle | null {
  throw new Error('NotImplemented: checkVehicleCollision');
}

export function findSupportingLog(_playerX: number, _logs: LogPlatform[]): LogPlatform | null {
  throw new Error('NotImplemented: findSupportingLog');
}

export function isOutOfBoundsX(_playerX: number): boolean {
  throw new Error('NotImplemented: isOutOfBoundsX');
}

export function quantizeLandX(_x: number): number {
  throw new Error('NotImplemented: quantizeLandX');
}
