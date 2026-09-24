import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ScoreTracker } from '../src/core/scoreTracker.ts';
import type { StorageAdapter } from '../src/core/types.ts';

class MemoryStorage implements StorageAdapter {
  private map = new Map<string, string>();
  getItem(key: string): string | null {
    return this.map.get(key) ?? null;
  }
  setItem(key: string, value: string): void {
    this.map.set(key, value);
  }
}

describe('ScoreTracker — Monotonicity & Adversarial Storage Tests', () => {
  it('Property 1 (Score Monotonicity): stepping backward or negative rows never decreases score', () => {
    const storage = new MemoryStorage();
    const tracker = new ScoreTracker(storage);

    const rowSequence = [0, 1, 2, 5, 4, 3, 1, 0, -2, 4, 5, 9, 7, 2, 12, 10];
    let prevScore = 0;

    for (const r of rowSequence) {
      tracker.updateRow(r);
      const current = tracker.getScore();
      assert.ok(current >= prevScore, `Score decreased from ${prevScore} to ${current} at row ${r}`);
      prevScore = current;
    }

    assert.equal(tracker.getScore(), 12);
    assert.equal(tracker.getHighScore(), 12);
  });

  it('Property 2 (HighScore Persistence): resetCurrentScore clears current score but keeps HighScore in storage', () => {
    const storage = new MemoryStorage();
    const tracker1 = new ScoreTracker(storage);
    tracker1.updateRow(24);
    tracker1.resetCurrentScore();

    assert.equal(tracker1.getScore(), 0);
    assert.equal(tracker1.getHighScore(), 24);

    // Second instance reading from same storage must restore 24
    const tracker2 = new ScoreTracker(storage);
    assert.equal(tracker2.getHighScore(), 24);
    tracker2.updateRow(10);
    assert.equal(tracker2.getHighScore(), 24);
    tracker2.updateRow(30);
    assert.equal(tracker2.getHighScore(), 30);
  });

  it('Property 3 (Adversarial Corrupted Storage): handles NaN, negative numbers, garbage strings, and throwing storage safely', () => {
    const badValues = ['NaN', '-500', 'Infinity', '{"corrupt":true}', '   ', 'undefined'];
    for (const val of badValues) {
      const storage = new MemoryStorage();
      storage.setItem('crossy_road_high_score', val);
      const tracker = new ScoreTracker(storage);
      assert.equal(tracker.getHighScore(), 0, `Corrupted value "${val}" should sanitize to 0`);
      tracker.updateRow(5);
      assert.equal(tracker.getHighScore(), 5);
    }

    const throwingStorage: StorageAdapter = {
      getItem() {
        throw new Error('SecurityError: storage disabled');
      },
      setItem() {
        throw new Error('QuotaExceededError');
      }
    };

    const resilientTracker = new ScoreTracker(throwingStorage);
    assert.equal(resilientTracker.getHighScore(), 0);
    resilientTracker.updateRow(7);
    assert.equal(resilientTracker.getScore(), 7);
    assert.equal(resilientTracker.getHighScore(), 7);
  });
});
