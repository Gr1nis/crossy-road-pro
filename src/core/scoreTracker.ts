import type { StorageAdapter } from './types.ts';

const STORAGE_KEY = 'crossy_road_high_score';

export class ScoreTracker {
  private currentScore = 0;
  private highScore = 0;
  private storage?: StorageAdapter;

  constructor(storage?: StorageAdapter) {
    this.storage = storage;
    this.highScore = this.loadHighScore();
  }

  private loadHighScore(): number {
    if (!this.storage) return 0;
    try {
      const raw = this.storage.getItem(STORAGE_KEY);
      if (!raw) return 0;
      const parsed = Number(raw);
      if (!Number.isFinite(parsed) || parsed < 0) {
        return 0;
      }
      return Math.floor(parsed);
    } catch {
      return 0;
    }
  }

  private saveHighScore(): void {
    if (!this.storage) return;
    try {
      this.storage.setItem(STORAGE_KEY, String(this.highScore));
    } catch {
      // Ignore storage quota / security errors
    }
  }

  getScore(): number {
    return this.currentScore;
  }

  getHighScore(): number {
    return this.highScore;
  }

  updateRow(row: number): void {
    const cleanRow = Math.floor(row);
    if (cleanRow > this.currentScore) {
      this.currentScore = cleanRow;
      if (this.currentScore > this.highScore) {
        this.highScore = this.currentScore;
        this.saveHighScore();
      }
    }
  }

  resetCurrentScore(): void {
    this.currentScore = 0;
  }
}
