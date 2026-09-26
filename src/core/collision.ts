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

/**
 * Snaps candidate landing X on a log to the nearest discrete segment slot [-1.0, 0, +1.0]
 * relative to the center of the log, so the character cleanly magnets to a log section.
 */
export function snapToLogSlot(landingX: number, log: LogPlatform): number {
  const rel = landingX - log.x;
  // Discrete 1.0-spaced slots centered on log
  const snappedRel = Math.round(rel);
  const maxRel = Math.max(0, (log.length - 1.0) / 2);
  const clampedRel = Math.max(-maxRel, Math.min(maxRel, snappedRel));
  return log.x + clampedRel;
}

export function isOutOfBoundsX(playerX: number): boolean {
  return Math.abs(playerX) > WORLD_CONFIG.OUT_OF_BOUNDS_X;
}

export function quantizeLandX(x: number): number {
  const rounded = Math.round(x);
  return Math.max(WORLD_CONFIG.MIN_X, Math.min(WORLD_CONFIG.MAX_X, rounded));
}

/**
 * Maps logical world X coordinate to Three.js right-handed X coordinate
 * (where camera looks toward +Z, so screen-right is -X and screen-left is +X).
 */
export function worldToScreenX(x: number): number {
  return x === 0 ? 0 : -x;
}

/**
 * Returns vehicle Y-rotation so the front of the vehicle faces its movement direction on screen.
 */
export function vehicleScreenRotationY(speed: number): number {
  return speed > 0 ? Math.PI : 0;
}

/**
 * Calculates normalized device coordinate (NDC) Y [-1.0..1.0] for the top-most visible vertex
 * of the player character under the isometric orthographic camera.
 * -1.0 corresponds strictly to the bottom visible edge of the screen viewport.
 */
export function getCameraFrustumNdcY(playerX: number, playerRow: number, camZ: number): number {
  const sx = -playerX + 0.35;
  const sy = 0.65;
  const sz = playerRow + 0.35;
  const dx = sx + 7.5;
  const dy = sy - 12.5;
  const dz = sz - camZ + 7.5;
  const vy = dx * 0.42426406871192857 + dy * 0.7071067811865476 + dz * 0.565685424949238;
  return vy / 11;
}

/**
 * Returns true only when the player's 3D mesh has completely crossed below
 * the visible bottom edge of the screen (NDC Y < -1.0).
 */
export function isPlayerBehindCameraFrustum(playerX: number, playerRow: number, camZ: number): boolean {
  return getCameraFrustumNdcY(playerX, playerRow, camZ) < -1.0;
}
