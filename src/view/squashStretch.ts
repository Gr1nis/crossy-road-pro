import { DeathReason, type DeathReasonValue } from '../core/types.ts';

export const LANDING_BOUNCE_DURATION = 0.12;

export interface SquashStretchScale {
  scaleX: number;
  scaleY: number;
  scaleZ: number;
}

export function calculateHopSquashStretch(hopProgress: number): { scaleY: number; scaleXZ: number } {
  const progress = Math.max(0, Math.min(1, hopProgress));

  if (progress < 0.2) {
    // Anticipation / takeoff: slight vertical compression
    return {
      scaleY: 0.85,
      scaleXZ: 1.08,
    };
  }

  if (progress <= 0.8) {
    // Flight Stretch: body stretches vertically along jump arc
    const scaleY = 1.0 + Math.sin(progress * Math.PI) * 0.32;
    const scaleXZ = 1 / Math.sqrt(scaleY);
    return {
      scaleY,
      scaleXZ,
    };
  }

  // Smooth transition to landing readiness (progress > 0.8)
  const t = (progress - 0.8) / 0.2;
  const stretchAt08 = 1.0 + Math.sin(0.8 * Math.PI) * 0.32;
  const scaleY = stretchAt08 * (1 - t) + 1.0 * t;
  const scaleXZ = 1 / Math.sqrt(scaleY);
  return {
    scaleY,
    scaleXZ,
  };
}

export function calculateLandingBounce(elapsedSeconds: number): { scaleY: number; scaleXZ: number } {
  const t = Math.max(0, Math.min(LANDING_BOUNCE_DURATION, elapsedSeconds));
  // Damped spring: smooth squash from impact with bouncy return to 1.0
  const scaleY = 1.0 - 0.18 * Math.exp(-t * 18) * Math.cos(t * 32);
  const scaleXZ = 1 / Math.sqrt(scaleY);
  return {
    scaleY,
    scaleXZ,
  };
}

export function getDeathSquashScale(reason: DeathReasonValue | string): SquashStretchScale | null {
  if (reason === DeathReason.CAR || reason === 'CAR') {
    return { scaleX: 1.65, scaleY: 0.1, scaleZ: 1.65 };
  }
  if (reason === DeathReason.TRAIN || reason === 'TRAIN') {
    return { scaleX: 1.85, scaleY: 0.06, scaleZ: 1.85 };
  }
  return null;
}
