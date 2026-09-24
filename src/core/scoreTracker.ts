import type { StorageAdapter } from './types.ts';

export class ScoreTracker {
  constructor(_storage?: StorageAdapter) {
    throw new Error('NotImplemented: ScoreTracker');
  }

  getScore(): number {
    throw new Error('NotImplemented: ScoreTracker.getScore');
  }

  getHighScore(): number {
    throw new Error('NotImplemented: ScoreTracker.getHighScore');
  }

  updateRow(_row: number): void {
    throw new Error('NotImplemented: ScoreTracker.updateRow');
  }

  resetCurrentScore(): void {
    throw new Error('NotImplemented: ScoreTracker.resetCurrentScore');
  }
}
