import { ALL_SKINS, type SkinId, type StorageAdapter } from './types.ts';
import { CoinWallet } from './wallet.ts';
import { SkinInventory } from './skinInventory.ts';
import {
  GachaMachine,
  SkinRarity,
  type SkinRarityValue,
  GACHA_DUPLICATE_CASHBACK,
  SKIN_RARITY_MAP,
  SKIN_RARITY_WEIGHTS,
  type GachaRollResult,
} from './gachaMachine.ts';
import {
  AchievementTracker,
  type AchievementId,
  type Achievement,
  type AchievementEvaluationContext,
  ACHIEVEMENT_DEFINITIONS,
} from './achievements.ts';

// Re-exports for backward compatibility
export {
  SkinRarity,
  type SkinRarityValue,
  GACHA_DUPLICATE_CASHBACK,
  SKIN_RARITY_MAP,
  SKIN_RARITY_WEIGHTS,
  type GachaRollResult,
  GachaMachine,
  CoinWallet,
  SkinInventory,
  type AchievementId,
  type Achievement,
  ACHIEVEMENT_DEFINITIONS,
  AchievementTracker,
};

const HIGH_SCORE_KEY = 'crossy_road_pro_high_score';
const PROFILE_KEY = 'crossy_road_pro_profile_v1';
export const MAX_LEADERBOARD_ENTRIES = 10;

export interface LeaderboardEntry {
  rank: number;
  playerName: string;
  score: number;
  skinId: SkinId;
  date: string;
  isBot: boolean;
}

export const DEFAULT_BOT_RIVALS: ReadonlyArray<Omit<LeaderboardEntry, 'rank'>> = [
  { playerName: 'CyberKaiser', score: 250, skinId: 'capybara_zen', date: '2026-09-20', isBot: true },
  { playerName: 'ArcticFlash', score: 210, skinId: 'raccoon_bandit', date: '2026-09-21', isBot: true },
  { playerName: 'NeonQuack', score: 175, skinId: 'box_cat', date: '2026-09-22', isBot: true },
  { playerName: 'ShadowHopper', score: 142, skinId: 'pigeon_pizza', date: '2026-09-23', isBot: true },
  { playerName: 'MasterChicken', score: 115, skinId: 'corgi', date: '2026-09-23', isBot: true },
  { playerName: 'GlacierWing', score: 95, skinId: 'capybara_zen', date: '2026-09-24', isBot: true },
  { playerName: 'PixelDrifter', score: 75, skinId: 'raccoon_bandit', date: '2026-09-24', isBot: true },
  { playerName: 'TurboCluck', score: 55, skinId: 'corgi', date: '2026-09-25', isBot: true },
  { playerName: 'TrainDodger', score: 35, skinId: 'box_cat', date: '2026-09-25', isBot: true },
  { playerName: 'RookieFeather', score: 18, skinId: 'pigeon_pizza', date: '2026-09-26', isBot: true },
];

interface SavedProfile {
  highScore: number;
  bestRow: number;
  coins: number;
  unlockedSkins: SkinId[];
  selectedSkin: SkinId;
  playerName?: string;
  playerRuns?: Array<Omit<LeaderboardEntry, 'rank'>>;
  unlockedAchievements?: AchievementId[];
  trainsSurvived?: number;
  logsHopped?: number;
  gachaRolls?: number;
}

export class ScoreTracker {
  private currentScore = 0;
  private highScore = 0;
  private bestRow = 0;
  private playerName = 'Игрок';
  private playerRuns: Array<Omit<LeaderboardEntry, 'rank'>> = [];
  private storage?: StorageAdapter;

  private wallet: CoinWallet;
  private inventory: SkinInventory;
  private gacha: GachaMachine;
  private achievements: AchievementTracker;

  constructor(storage?: StorageAdapter, initialPlayerName?: string) {
    this.storage = storage;
    this.wallet = new CoinWallet(0);
    this.inventory = new SkinInventory(['corgi'], 'corgi');
    this.gacha = new GachaMachine();
    this.achievements = new AchievementTracker();

    if (initialPlayerName && initialPlayerName.trim().length > 0) {
      this.playerName = initialPlayerName.trim();
    }
    this.loadFromStorage();
    this.evaluateAchievements();
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
          this.wallet.setCoins(data.coins);
        }
        const validSkinIds = new Set<string>(ALL_SKINS.map((s) => s.id));
        let loadedUnlocked: SkinId[] = ['corgi'];
        if (Array.isArray(data.unlockedSkins)) {
          const filtered = data.unlockedSkins.filter((s): s is SkinId => validSkinIds.has(s));
          loadedUnlocked = Array.from(new Set<SkinId>(['corgi', ...filtered]));
        }
        let loadedSelected: SkinId = 'corgi';
        if (typeof data.selectedSkin === 'string' && loadedUnlocked.includes(data.selectedSkin as SkinId)) {
          loadedSelected = data.selectedSkin as SkinId;
        }
        this.inventory = new SkinInventory(loadedUnlocked, loadedSelected);

        if (typeof data.playerName === 'string' && data.playerName.trim().length > 0) {
          this.playerName = data.playerName.trim();
        }
        if (Array.isArray(data.playerRuns)) {
          const mapByName = new Map<string, Omit<LeaderboardEntry, 'rank'>>();
          for (const r of data.playerRuns) {
            if (
              Boolean(r) &&
              typeof r.playerName === 'string' &&
              typeof r.score === 'number' &&
              Number.isFinite(r.score) &&
              r.score >= 0 &&
              validSkinIds.has(r.skinId) &&
              typeof r.date === 'string'
            ) {
              const name = r.playerName.trim();
              if (!name) continue;
              const cleanScore = Math.floor(r.score);
              const existing = mapByName.get(name);
              if (!existing || cleanScore > existing.score) {
                mapByName.set(name, {
                  playerName: name,
                  score: cleanScore,
                  skinId: r.skinId,
                  date: r.date,
                  isBot: false,
                });
              }
            }
          }
          this.playerRuns = Array.from(mapByName.values());
        }
        if (this.highScore > 0) {
          const existing = this.playerRuns.find((r) => r.playerName === this.playerName);
          if (existing) {
            if (this.highScore > existing.score) {
              existing.score = this.highScore;
              existing.skinId = this.inventory.getSelectedSkin();
            }
          } else {
            this.playerRuns.push({
              playerName: this.playerName,
              score: this.highScore,
              skinId: this.inventory.getSelectedSkin(),
              date: new Date().toISOString().slice(0, 10),
              isBot: false,
            });
          }
        }
        this.playerRuns.sort((a, b) => b.score - a.score);
        this.playerRuns = this.playerRuns.slice(0, MAX_LEADERBOARD_ENTRIES);
        const validAchIds = new Set<string>(ACHIEVEMENT_DEFINITIONS.map((a) => a.id));
        const loadedAch: AchievementId[] = [];
        if (Array.isArray(data.unlockedAchievements)) {
          for (const id of data.unlockedAchievements) {
            if (validAchIds.has(id)) {
              loadedAch.push(id as AchievementId);
            }
          }
        }
        const loadedTrains = typeof data.trainsSurvived === 'number' && Number.isFinite(data.trainsSurvived) && data.trainsSurvived >= 0
          ? Math.floor(data.trainsSurvived)
          : 0;
        const loadedLogs = typeof data.logsHopped === 'number' && Number.isFinite(data.logsHopped) && data.logsHopped >= 0
          ? Math.floor(data.logsHopped)
          : 0;
        const loadedGacha = typeof data.gachaRolls === 'number' && Number.isFinite(data.gachaRolls) && data.gachaRolls >= 0
          ? Math.floor(data.gachaRolls)
          : 0;
        this.achievements = new AchievementTracker(loadedAch, {
          trains: loadedTrains,
          logs: loadedLogs,
          gacha: loadedGacha,
        });
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
        coins: this.wallet.getCoins(),
        unlockedSkins: this.inventory.getUnlockedSkins(),
        selectedSkin: this.inventory.getSelectedSkin(),
        playerName: this.playerName,
        playerRuns: this.playerRuns,
        unlockedAchievements: this.achievements.getUnlockedIds(),
        trainsSurvived: this.achievements.getTrainsSurvived(),
        logsHopped: this.achievements.getLogsHopped(),
        gachaRolls: this.achievements.getGachaRolls(),
      };
      this.storage.setItem(PROFILE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore storage quota errors
    }
  }

  evaluateAchievements(additions?: Partial<AchievementEvaluationContext>): Achievement[] {
    const topBotScore = DEFAULT_BOT_RIVALS[0]?.score ?? 250;
    return this.achievements.evaluate({
      score: Math.max(this.currentScore, this.highScore),
      coins: this.wallet.getCoins(),
      unlockedSkinsCount: this.inventory.getUnlockedSkins().length,
      allSkinsCount: ALL_SKINS.length,
      isTop1: this.highScore > topBotScore,
      ...additions,
    });
  }

  updateRow(row: number, multiplier: number = 1): void {
    if (!Number.isFinite(row)) return;
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
      this.evaluateAchievements();
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

  resetCurrentScore(): void {
    if (this.currentScore > 0) {
      this.recordRun(this.currentScore);
    }
    this.currentScore = 0;
  }

  getCoins(): number {
    return this.wallet.getCoins();
  }

  addCoins(amount: number): void {
    if (!Number.isFinite(amount) || amount <= 0) return;
    this.wallet.addCoins(amount);
    this.evaluateAchievements();
    this.saveToStorage();
  }

  getUnlockedSkins(): SkinId[] {
    return this.inventory.getUnlockedSkins();
  }

  unlockSkin(skinId: SkinId): boolean {
    const success = this.inventory.unlockSkin(skinId);
    if (success) {
      this.saveToStorage();
    }
    return success;
  }

  getSelectedSkin(): SkinId {
    return this.inventory.getSelectedSkin();
  }

  getSkinRarity(skinId: SkinId): SkinRarityValue {
    return this.gacha.getSkinRarity(skinId);
  }

  selectSkin(skinId: SkinId): boolean {
    const success = this.inventory.selectSkin(skinId);
    if (success) {
      this.saveToStorage();
    }
    return success;
  }

  rollGacha(randomIndex: number = 0, forceSkinId?: SkinId): GachaRollResult {
    let forced = forceSkinId;
    if (!forced && Number.isInteger(randomIndex) && randomIndex > 0) {
      const locked = ALL_SKINS.map((s) => s.id).filter((id) => !this.inventory.isUnlocked(id));
      if (locked.length > 0) {
        forced = locked[(Math.floor(randomIndex) - 1) % locked.length];
      }
    }
    const result = this.gacha.roll(randomIndex, this.wallet, this.inventory, forced);
    if (result.success) {
      this.achievements.recordGachaRoll();
      if (!result.isDuplicate && result.skinId) {
        this.inventory.selectSkin(result.skinId);
      }
      this.evaluateAchievements();
      this.saveToStorage();
    }
    return result;
  }

  getPlayerName(): string {
    return this.playerName;
  }

  setPlayerName(name: string): void {
    const clean = name.trim();
    if (clean.length > 0) {
      const oldName = this.playerName;
      this.playerName = clean.slice(0, 24);
      const oldEntry = this.playerRuns.find((r) => r.playerName === oldName);
      if (oldEntry) {
        const targetEntry = this.playerRuns.find((r) => r.playerName === this.playerName);
        if (targetEntry && targetEntry !== oldEntry) {
          if (oldEntry.score > targetEntry.score) {
            targetEntry.score = oldEntry.score;
            targetEntry.skinId = oldEntry.skinId;
            targetEntry.date = oldEntry.date;
          }
          this.playerRuns = this.playerRuns.filter((r) => r !== oldEntry);
        } else {
          oldEntry.playerName = this.playerName;
        }
      }
      this.saveToStorage();
    }
  }

  getPlayerRuns(): LeaderboardEntry[] {
    return this.playerRuns.map((r, idx) => ({ ...r, rank: idx + 1 }));
  }

  getLeaderboard(): LeaderboardEntry[] {
    const combined: Array<Omit<LeaderboardEntry, 'rank'>> = [...this.playerRuns, ...DEFAULT_BOT_RIVALS];
    combined.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (a.isBot !== b.isBot) return a.isBot ? 1 : -1;
      return 0;
    });
    return combined.slice(0, MAX_LEADERBOARD_ENTRIES).map((entry, idx) => ({
      ...entry,
      rank: idx + 1,
    }));
  }

  getNextRival(referenceScore: number = this.currentScore): LeaderboardEntry | null {
    const board = this.getLeaderboard();
    const botsAhead = board.filter((e) => e.isBot && e.score > referenceScore);
    if (botsAhead.length === 0) return null;
    return botsAhead[botsAhead.length - 1];
  }

  recordRun(
    score: number = this.currentScore,
    meta?: { playerName?: string; skinId?: SkinId; date?: string }
  ): { rank: number | null; overtakenBots: string[]; isNewHighScore: boolean; entries: LeaderboardEntry[] } {
    const cleanScore = Number.isFinite(score) && score >= 0 ? Math.floor(score) : 0;
    const prevLeaderboard = this.getLeaderboard();
    const prevBotsAbove = prevLeaderboard.filter((e) => e.isBot && e.score >= this.highScore).map((e) => e.playerName);

    const isNewHighScore = cleanScore > this.highScore;
    if (isNewHighScore) {
      this.highScore = cleanScore;
      if (cleanScore > this.bestRow) {
        this.bestRow = cleanScore;
      }
    }

    const entryDate = meta?.date ?? new Date().toISOString().slice(0, 10);
    const entryName = meta?.playerName?.trim() || this.playerName;
    const entrySkin = meta?.skinId ?? this.inventory.getSelectedSkin();

    if (cleanScore > 0) {
      const existing = this.playerRuns.find((r) => r.playerName === entryName);
      if (existing) {
        if (cleanScore > existing.score) {
          existing.score = cleanScore;
          existing.skinId = entrySkin;
          existing.date = entryDate;
        }
      } else {
        this.playerRuns.push({
          playerName: entryName,
          score: cleanScore,
          skinId: entrySkin,
          date: entryDate,
          isBot: false,
        });
      }
      this.playerRuns.sort((a, b) => b.score - a.score);
      this.playerRuns = this.playerRuns.slice(0, MAX_LEADERBOARD_ENTRIES);
    }

    const updated = this.getLeaderboard();
    const overtakenBots = prevBotsAbove.filter((botName) => {
      const bot = DEFAULT_BOT_RIVALS.find((b) => b.playerName === botName);
      return bot !== undefined && cleanScore > bot.score;
    });

    const found = updated.find(
      (e) => !e.isBot && e.playerName === entryName
    );
    this.evaluateAchievements();
    this.saveToStorage();
    return {
      rank: found ? found.rank : null,
      overtakenBots,
      isNewHighScore,
      entries: updated,
    };
  }

  recordTrainSurvived(count: number = 1): void {
    if (!Number.isFinite(count) || count <= 0) return;
    this.achievements.recordTrainSurvived(count);
    this.evaluateAchievements();
    this.saveToStorage();
  }

  getTrainsSurvived(): number {
    return this.achievements.getTrainsSurvived();
  }

  unlockAchievement(id: AchievementId, date?: string): boolean {
    const success = this.achievements.unlock(id, date);
    if (success) {
      this.saveToStorage();
    }
    return success;
  }

  isAchievementUnlocked(id: AchievementId): boolean {
    return this.achievements.isUnlocked(id);
  }

  recordLogHopped(count: number = 1): number {
    if (!Number.isFinite(count) || count <= 0) return this.achievements.getLogsHopped();
    const res = this.achievements.recordLogHopped(count);
    this.evaluateAchievements();
    this.saveToStorage();
    return res;
  }

  getLogsHopped(): number {
    return this.achievements.getLogsHopped();
  }

  getGachaRolls(): number {
    return this.achievements.getGachaRolls();
  }

  getAchievementsSummary(): { total: number; unlockedCount: number; percent: number } {
    return this.achievements.getSummary();
  }

  getAchievements(ctx?: Partial<AchievementEvaluationContext>): Achievement[] {
    return this.achievements.getAchievements(ctx);
  }
}
