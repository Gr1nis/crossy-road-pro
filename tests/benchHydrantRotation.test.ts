import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createUrbanBench, createUrbanHydrant, createUrbanObstacle } from '../src/view/urbanEnvironment.ts';

describe('Bench & Hydrant Rotation Randomness Suite', () => {
  it('Property 1 (Hydrant Rotation Variation): spawns both facing front (PI) and back (0)', () => {
    const h0 = createUrbanHydrant(0);
    const h2 = createUrbanHydrant(2);
    assert.strictEqual(h0.rotation.y, 0, 'Seed 0 should face back (0)');
    assert.strictEqual(h2.rotation.y, Math.PI, 'Seed 2 should face front (Math.PI)');
  });

  it('Property 2 (Bench Rotation Variation): spawns both facing front (PI) and back (0)', () => {
    const b0 = createUrbanBench(0);
    const b2 = createUrbanBench(2);
    assert.strictEqual(b0.rotation.y, 0, 'Seed 0 should face back (0)');
    assert.strictEqual(b2.rotation.y, Math.PI, 'Seed 2 should face front (Math.PI)');
  });

  it('Property 3 (Balanced 50/50 Distribution Across Seeds): spawns both orientations in equal measure', () => {
    let benchFrontCount = 0;
    let benchBackCount = 0;
    let hydrantFrontCount = 0;
    let hydrantBackCount = 0;

    for (let i = 0; i < 20; i++) {
      const bench = createUrbanBench(i * 2);
      if (Math.abs(bench.rotation.y - Math.PI) < 0.001) benchFrontCount++;
      else if (Math.abs(bench.rotation.y) < 0.001) benchBackCount++;

      const hydrant = createUrbanHydrant(i * 2);
      if (Math.abs(hydrant.rotation.y - Math.PI) < 0.001) hydrantFrontCount++;
      else if (Math.abs(hydrant.rotation.y) < 0.001) hydrantBackCount++;
    }

    assert.strictEqual(benchFrontCount, 10, 'Expected exactly 10 benches facing front out of 20');
    assert.strictEqual(benchBackCount, 10, 'Expected exactly 10 benches facing back out of 20');
    assert.strictEqual(hydrantFrontCount, 10, 'Expected exactly 10 hydrants facing front out of 20');
    assert.strictEqual(hydrantBackCount, 10, 'Expected exactly 10 hydrants facing back out of 20');
  });

  it('Property 4 (Obstacle Dispatcher Integration): createUrbanObstacle preserves rotation variation for rocks and bushes', () => {
    // When seed % 4 === 0 -> Hydrant facing 0
    const rock0 = createUrbanObstacle('rock', 0);
    // When seed % 4 === 2 -> Hydrant facing PI
    const rock2 = createUrbanObstacle('rock', 2);
    assert.strictEqual(rock0.rotation.y, 0);
    assert.strictEqual(rock2.rotation.y, Math.PI);

    // When seed % 4 === 0 -> Bench facing 0
    const bush0 = createUrbanObstacle('bush', 0);
    // When seed % 4 === 2 -> Bench facing PI
    const bush2 = createUrbanObstacle('bush', 2);
    assert.strictEqual(bush0.rotation.y, 0);
    assert.strictEqual(bush2.rotation.y, Math.PI);
  });
});
