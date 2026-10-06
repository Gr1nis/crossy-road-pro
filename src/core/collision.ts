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

export function vehicleScreenRotationY(speed: number): number {
  return speed > 0 ? Math.PI : 0;
}

export const RECORD_FLAG_X = 3.8;

export interface RecordFlagPosition {
  x: number;
  row: number;
}

export function getRecordFlagPosition(
  highScore: number,
  shoulderX: number = RECORD_FLAG_X
): RecordFlagPosition | null {
  if (!Number.isFinite(highScore) || highScore <= 0) {
    return null;
  }
  return {
    x: shoulderX,
    row: Math.floor(highScore),
  };
}

export const CAMERA_CONFIG = {
  MOBILE_VIEW_HEIGHT: 15.0,
  DESKTOP_VIEW_HEIGHT: 22.0,
  PLAYER_SCREEN_Y_RATIO: 0.28,
  BASE_PLAYER_VIEW_Y: -0.44,
  MAX_PAN_CORRIDOR_HALF: 10.0,
  FRUSTUM_EDGE_NDC_THRESHOLD: -0.98,
} as const;

export function getCameraFrustumDimensions(aspect: number = 9 / 16): {
  viewHeight: number;
  halfWidth: number;
  bottom: number;
  top: number;
} {
  const t = Math.max(0, Math.min(1, (aspect - 0.5625) / (1.7778 - 0.5625)));
  const viewHeight =
    CAMERA_CONFIG.MOBILE_VIEW_HEIGHT +
    t * (CAMERA_CONFIG.DESKTOP_VIEW_HEIGHT - CAMERA_CONFIG.MOBILE_VIEW_HEIGHT);
  const halfWidth = (viewHeight * aspect) / 2;
  const bottom =
    CAMERA_CONFIG.BASE_PLAYER_VIEW_Y -
    CAMERA_CONFIG.PLAYER_SCREEN_Y_RATIO * viewHeight;
  const top = bottom + viewHeight;
  return { viewHeight, halfWidth, bottom, top };
}

/**
 * Calculates normalized device coordinate (NDC) Y [-1.0..1.0] for the top-most visible vertex
 * of the player character under the isometric orthographic camera.
 * -1.0 corresponds strictly to the bottom visible edge of the screen viewport.
 */
export function getCameraFrustumNdcY(
  playerX: number,
  playerRow: number,
  camZ: number,
  aspect: number = 9 / 16
): number {
  const sx = -playerX + 0.35;
  const sy = 0.65;
  const sz = playerRow + 0.35;
  const dx = sx - WORLD_CONFIG.CAMERA_OFFSET.X;
  const dy = sy - WORLD_CONFIG.CAMERA_OFFSET.Y;
  const dz = sz - camZ - WORLD_CONFIG.CAMERA_OFFSET.Z;
  const vy =
    dx * 0.42426406871192857 +
    dy * 0.7071067811865476 +
    dz * 0.565685424949238;
  const { viewHeight, bottom } = getCameraFrustumDimensions(aspect);
  return (2 * (vy - bottom)) / viewHeight - 1.0;
}

/**
 * Returns true when the player touches or crosses below the visible
 * bottom edge of the screen (NDC Y < -0.98).
 */
export function isPlayerBehindCameraFrustum(
  playerX: number,
  playerRow: number,
  camZ: number,
  aspect: number = 9 / 16
): boolean {
  return getCameraFrustumNdcY(playerX, playerRow, camZ, aspect) < CAMERA_CONFIG.FRUSTUM_EDGE_NDC_THRESHOLD;
}
