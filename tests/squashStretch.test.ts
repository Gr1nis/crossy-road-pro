import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { DeathReason } from '../src/core/types.ts';
import {
  calculateHopSquashStretch,
  calculateLandingBounce,
  getDeathSquashScale,
  LANDING_BOUNCE_DURATION,
} from '../src/view/squashStretch.ts';

describe('Squash & Stretch — Procedural Hop, Landing Bounce & Death Flattening', () => {
  it('Phase 1 (Anticipation / Takeoff): hopProgress < 0.2 compresses vertically and expands horizontally', () => {
    const testPoints = [0.0, 0.05, 0.1, 0.15, 0.199];
    for (const p of testPoints) {
      const { scaleY, scaleXZ } = calculateHopSquashStretch(p);
      assert.equal(scaleY, 0.85, `scaleY at progress ${p} must be 0.85`);
      assert.equal(scaleXZ, 1.08, `scaleXZ at progress ${p} must be 1.08`);
    }
  });

  it('Phase 2 (Flight Stretch): 0.2 <= hopProgress <= 0.8 stretches vertically with volume conservation', () => {
    // Apogee (progress = 0.5): maximum vertical stretch
    const apogee = calculateHopSquashStretch(0.5);
    const expectedApogeeY = 1.0 + Math.sin(0.5 * Math.PI) * 0.32; // 1.32
    assert.ok(Math.abs(apogee.scaleY - expectedApogeeY) < 1e-6);
    assert.equal(apogee.scaleY, 1.32);
    assert.ok(Math.abs(apogee.scaleXZ - 1 / Math.sqrt(1.32)) < 1e-6);

    // Mid-flight sample at progress = 0.3
    const midFlight = calculateHopSquashStretch(0.3);
    const expectedMidY = 1.0 + Math.sin(0.3 * Math.PI) * 0.32;
    assert.ok(Math.abs(midFlight.scaleY - expectedMidY) < 1e-6);
    assert.ok(Math.abs(midFlight.scaleXZ - 1 / Math.sqrt(expectedMidY)) < 1e-6);

    // Boundary at progress = 0.2
    const startFlight = calculateHopSquashStretch(0.2);
    const expectedStartY = 1.0 + Math.sin(0.2 * Math.PI) * 0.32;
    assert.ok(Math.abs(startFlight.scaleY - expectedStartY) < 1e-6);
    assert.ok(Math.abs(startFlight.scaleXZ - 1 / Math.sqrt(expectedStartY)) < 1e-6);

    // Boundary at progress = 0.8
    const endFlight = calculateHopSquashStretch(0.8);
    const expectedEndY = 1.0 + Math.sin(0.8 * Math.PI) * 0.32;
    assert.ok(Math.abs(endFlight.scaleY - expectedEndY) < 1e-6);
    assert.ok(Math.abs(endFlight.scaleXZ - 1 / Math.sqrt(expectedEndY)) < 1e-6);
  });

  it('Phase 3 (Landing Readiness): hopProgress > 0.8 smoothly transitions to neutral 1.0', () => {
    const endFlight = calculateHopSquashStretch(0.8);
    const midPrep = calculateHopSquashStretch(0.9);
    const landed = calculateHopSquashStretch(1.0);

    // Progress 1.0 must be fully neutral
    assert.ok(Math.abs(landed.scaleY - 1.0) < 1e-6, 'scaleY at progress 1.0 must reach 1.0');
    assert.ok(Math.abs(landed.scaleXZ - 1.0) < 1e-6, 'scaleXZ at progress 1.0 must reach 1.0');

    // Scale must decrease monotonically towards 1.0 during landing readiness
    assert.ok(endFlight.scaleY > midPrep.scaleY, 'scaleY must decrease from 0.8 to 0.9');
    assert.ok(midPrep.scaleY > landed.scaleY, 'scaleY must decrease from 0.9 to 1.0');
  });

  it('Phase 4 (Elastic Landing Bounce): damped spring impact squashes and rebounds over ~0.12s', () => {
    assert.equal(LANDING_BOUNCE_DURATION, 0.12, 'Landing bounce duration must be 0.12s');

    // Initial impact at t = 0s
    const impact = calculateLandingBounce(0);
    const expectedImpactY = 1.0 - 0.18 * Math.exp(0) * Math.cos(0); // 0.82
    assert.ok(Math.abs(impact.scaleY - expectedImpactY) < 1e-6);
    assert.ok(Math.abs(impact.scaleY - 0.82) < 1e-6);
    assert.ok(Math.abs(impact.scaleXZ - 1 / Math.sqrt(0.82)) < 1e-6);

    // Sample spring rebound at t = 0.05s
    const rebound = calculateLandingBounce(0.05);
    const expectedReboundY = 1.0 - 0.18 * Math.exp(-0.05 * 18) * Math.cos(0.05 * 32);
    assert.ok(Math.abs(rebound.scaleY - expectedReboundY) < 1e-6);
    assert.ok(Math.abs(rebound.scaleXZ - 1 / Math.sqrt(expectedReboundY)) < 1e-6);

    // Clamped past duration
    const pastEnd = calculateLandingBounce(0.5);
    const atEnd = calculateLandingBounce(0.12);
    assert.equal(pastEnd.scaleY, atEnd.scaleY);
    assert.equal(pastEnd.scaleXZ, atEnd.scaleXZ);
  });

  it('Death Deformations: CAR and TRAIN extreme pancake flattening, WATER immersion', () => {
    const carScale = getDeathSquashScale(DeathReason.CAR);
    assert.notEqual(carScale, null);
    assert.deepEqual(carScale, { scaleX: 1.65, scaleY: 0.1, scaleZ: 1.65 });

    const trainScale = getDeathSquashScale(DeathReason.TRAIN);
    assert.notEqual(trainScale, null);
    assert.deepEqual(trainScale, { scaleX: 1.85, scaleY: 0.06, scaleZ: 1.85 });

    // Non-crush death reasons return null so default or water handling applies
    assert.equal(getDeathSquashScale(DeathReason.WATER), null);
    assert.equal(getDeathSquashScale(DeathReason.CAMERA_BEHIND), null);
  });

  it('Architectural Cleanliness: core files do not import Three.js, view logic is decoupled', () => {
    const coreFiles = ['collision.ts', 'gameEngine.ts', 'laneGenerator.ts', 'scoreTracker.ts', 'types.ts'];
    for (const f of coreFiles) {
      const content = fs.readFileSync(path.join(process.cwd(), 'src/core', f), 'utf8');
      assert.equal(
        content.includes("from 'three'"),
        false,
        `src/core/${f} must never import Three.js`
      );
    }

    const sceneManagerContent = fs.readFileSync(
      path.join(process.cwd(), 'src/view/sceneManager.ts'),
      'utf8'
    );
    assert.ok(sceneManagerContent.includes('calculateHopSquashStretch'));
    assert.ok(sceneManagerContent.includes('calculateLandingBounce'));
    assert.ok(sceneManagerContent.includes('landingBounceTimer'));
  });
});
