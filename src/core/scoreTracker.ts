import { ALL_SKINS, WORLD_CONFIG, type SkinId, type StorageAdapter } from './types.ts';

const HIGH_SCORE_KEY = 'crossy_road_pro_high_score';
const PROFILE_KEY = 'crossy_road_pro_profile_v1';

interface SavedProfile {
  highScore: number;
  bestRow: number;
  coins: number;
  unlockedSkins: SkinId[];
  selectedSkin: SkinId;
}

export class ScoreTracker {
  private currentScore = 0;
  private highScore = 0;
  private bestRow = 0;
  private coins = 0;
  private unlockedSkins: SkinId[] = ['chicken'];
  private selectedSkin: SkinId = 'chicken';
  private storage?: StorageAdapter;

  constructor(storage?: StorageAdapter) {
    this.storage = storage;
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    if (!this.storage) return;
    try {
      const rawHigh = this.storage.getItem(HIGH_SCORE_KEY);
      if (rawHigh !== null) {
        const parsed = Number(rawHigh);
        if (Number.isFinite(parsed) && parsed >= 0) {
          this.highScore = Math.floor(parsed);
        }
      }

      const rawProfile = this.storage.getItem(PROFILE_KEY);
      if (rawProfile) {
        const data = JSON.parse(rawProfile) as Partial<SavedProfile>;
        if (typeof data.highScore === 'number' && Number.isFinite(data.highScore) && data.highScore > this.highScore) {
          this.highScore = Math.floor(data.highScore);
        }
        if (typeof data.bestRow === 'number' && Number.isFinite(data.bestRow) && data.bestRow >= 0) {
          this.bestRow = Math.floor(data.bestRow);
        }
        if (typeof data.coins === 'number' && Number.isFinite(data.coins) && data.coins >= 0) {
          this.coins = Math.floor(data.coins);
        }
        const validSkinIds = new Set<string>(ALL_SKINS.map((s) => s.id));
        if (Array.isArray(data.unlockedSkins)) {
          const filtered = data.unlockedSkins.filter((s): s is SkinId => validSkinIds.has(s));
          this.unlockedSkins = Array.from(new Set<SkinId>(['chicken', ...filtered]));
        }
        if (typeof data.selectedSkin === 'string' && this.unlockedSkins.includes(data.selectedSkin as SkinId)) {
          this.selectedSkin = data.selectedSkin as SkinId;
        }
      }
    } catch {
      // Resilient fallback on corrupted storage
    }
  }

  private saveToStorage(): void {
    if (!this.storage) return;
    try {
      this.storage.setItem(HIGH_SCORE_KEY, String(this.highScore));
      const payload: SavedProfile = {
        highScore: this.highScore,
        bestRow: this.bestRow,
        coins: this.coins,
        unlockedSkins: this.unlockedSkins,
        selectedSkin: this.selectedSkin,
      };
      this.storage.setItem(PROFILE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore storage quota errors
    }
  }

  updateRow(row: number, multiplier: number = 1): void {
    const cleanRow = Math.floor(row);
    if (cleanRow > this.bestRow) {
      this.bestRow = cleanRow;
    }
    if (cleanRow > this.currentScore) {
      const delta = cleanRow - this.currentScore;
      this.currentScore += delta * Math.max(1, Math.floor(multiplier));
      if (this.currentScore > this.highScore) {
        this.highScore = this.currentScore;
      }
      this.saveToStorage();
    }
  }

  getScore(): number {
    return this.currentScore;
  }

  getHighScore(): number {
    return this.highScore;
  }

  getBestRow(): number {
    return this.bestRow;
  }

  getCoins(): number {
    return this.coins;
  }

  addCoins(amount: number): void {
    if (!Number.isFinite(amount) || amount <= 0) return;
    this.coins += Math.floor(amount);
    this.saveToStorage();
  }

  getUnlockedSkins(): SkinId[] {
    return [...this.unlockedSkins];
  }

  getSelectedSkin(): SkinId {
    return this.selectedSkin;
  }

  selectSkin(skinId: SkinId): boolean {
    if (!this.unlockedSkins.includes(skinId)) return false;
    this.selectedSkin = skinId;
    this.saveToStorage();
    return true;
  }

  rollGacha(randomIndex: number = 0): { success: boolean; skinId?: SkinId; reason?: string } {
    const locked = ALL_SKINS.map((s) => s.id).filter((id) => !this.unlockedSkins.includes(id));
    if (locked.length === 0) {
      return { success: false, reason: 'ALL_UNLOCKED' };
    }
    if (this.coins < WORLD_CONFIG.GACHA_COST) {
      return { success: false, reason: 'NOT_ENOUGH_COINS' };
    }
    this.coins -= WORLD_CONFIG.GACHA_COST;
    const idx = Math.abs(Math.floor(randomIndex)) % locked.length;
    const chosen = locked[idx];
    this.unlockedSkins.push(chosen);
    this.selectedSkin = chosen;
    this.saveToStorage();
    return { success: true, skinId: chosen };
  }

  resetCurrentScore(): void {
    this.currentScore = 0;
  }
}
