import { ALL_SKINS, WORLD_CONFIG, type SkinId, type StorageAdapter } from './types.ts';

const HIGH_SCORE_KEY = 'crossy_road_pro_high_score';
const PROFILE_KEY = 'crossy_road_pro_profile_v1';

export const SkinRarity = {
  COMMON: 'Common',
  RARE: 'Rare',
  EPIC: 'Epic',
  LEGENDARY: 'Legendary',
} as const;

export type SkinRarityValue = (typeof SkinRarity)[keyof typeof SkinRarity];

export const GACHA_DUPLICATE_CASHBACK = 40;
export const MAX_LEADERBOARD_ENTRIES = 10;

export const SKIN_RARITY_MAP: Record<SkinId, SkinRarityValue> = {
  chicken: SkinRarity.COMMON,
  cyber_duck: SkinRarity.RARE,
  shadow_ninja: SkinRarity.EPIC,
  frost_penguin: SkinRarity.LEGENDARY,
};

export const SKIN_RARITY_WEIGHTS: Record<SkinRarityValue, number> = {
  [SkinRarity.COMMON]: 50,
  [SkinRarity.RARE]: 30,
  [SkinRarity.EPIC]: 15,
  [SkinRarity.LEGENDARY]: 5,
};

export interface LeaderboardEntry {
  rank: number;
  playerName: string;
  score: number;
  skinId: SkinId;
  date: string;
  isBot: boolean;
}

export type AchievementId =
  | 'first_50_steps'
  | 'collector'
  | 'train_conqueror'
  | 'rich_hopper'
  | 'leaderboard_champion';

export interface Achievement {
  id: AchievementId;
  title: string;
  description: string;
  badge: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export const DEFAULT_BOT_RIVALS: ReadonlyArray<Omit<LeaderboardEntry, 'rank'>> = [
  { playerName: 'CyberKaiser', score: 250, skinId: 'shadow_ninja', date: '2026-09-20', isBot: true },
  { playerName: 'ArcticFlash', score: 210, skinId: 'frost_penguin', date: '2026-09-21', isBot: true },
  { playerName: 'NeonQuack', score: 175, skinId: 'cyber_duck', date: '2026-09-22', isBot: true },
  { playerName: 'ShadowHopper', score: 142, skinId: 'shadow_ninja', date: '2026-09-23', isBot: true },
  { playerName: 'MasterChicken', score: 115, skinId: 'chicken', date: '2026-09-23', isBot: true },
  { playerName: 'GlacierWing', score: 95, skinId: 'frost_penguin', date: '2026-09-24', isBot: true },
  { playerName: 'PixelDrifter', score: 75, skinId: 'cyber_duck', date: '2026-09-24', isBot: true },
  { playerName: 'TurboCluck', score: 55, skinId: 'chicken', date: '2026-09-25', isBot: true },
  { playerName: 'TrainDodger', score: 35, skinId: 'shadow_ninja', date: '2026-09-25', isBot: true },
  { playerName: 'RookieFeather', score: 18, skinId: 'chicken', date: '2026-09-26', isBot: true },
];

export const ACHIEVEMENT_DEFINITIONS: ReadonlyArray<Omit<Achievement, 'unlocked' | 'unlockedAt'>> = [
  { id: 'first_50_steps', title: 'Первые 50 шагов', description: 'Достигните 50 очков за один забег', badge: '👣' },
  { id: 'collector', title: 'Коллекционер', description: 'Откройте все скины в Гача-автомате', badge: '🎭' },
  { id: 'train_conqueror', title: 'Покоритель поездов', description: 'Переживите встречу с 5 скоростными поездами', badge: '🚆' },
  { id: 'rich_hopper', title: 'Золотой запас', description: 'Накопите 200 монет на балансе', badge: '💰' },
  { id: 'leaderboard_champion', title: 'Король трассы', description: 'Займите 1-е место в таблице лидеров', badge: '👑' },
];

export interface GachaRollResult {
  success: boolean;
  skinId?: SkinId;
  rarity?: SkinRarityValue;
  isDuplicate?: boolean;
  cashback?: number;
  reason?: string;
}

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
}

export class ScoreTracker {
  private currentScore = 0;
  private highScore = 0;
  private bestRow = 0;
  private coins = 0;
  private unlockedSkins: SkinId[] = ['chicken'];
  private selectedSkin: SkinId = 'chicken';
  private playerName = 'Игрок';
  private playerRuns: Array<Omit<LeaderboardEntry, 'rank'>> = [];
  private unlockedAchievements = new Set<AchievementId>();
  private achievementDates = new Map<AchievementId, string>();
  private trainsSurvived = 0;
  private storage?: StorageAdapter;

  constructor(storage?: StorageAdapter, initialPlayerName?: string) {
    this.storage = storage;
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
        if (typeof data.playerName === 'string' && data.playerName.trim().length > 0) {
          this.playerName = data.playerName.trim();
        }
        if (Array.isArray(data.playerRuns)) {
          this.playerRuns = data.playerRuns
            .filter(
              (r): r is Omit<LeaderboardEntry, 'rank'> =>
                Boolean(r) &&
                typeof r.playerName === 'string' &&
                typeof r.score === 'number' &&
                Number.isFinite(r.score) &&
                r.score >= 0 &&
                validSkinIds.has(r.skinId) &&
                typeof r.date === 'string'
            )
            .map((r) => ({ ...r, score: Math.floor(r.score), isBot: false }))
            .slice(0, MAX_LEADERBOARD_ENTRIES);
        }
        const validAchIds = new Set<string>(ACHIEVEMENT_DEFINITIONS.map((a) => a.id));
        if (Array.isArray(data.unlockedAchievements)) {
          for (const id of data.unlockedAchievements) {
            if (validAchIds.has(id)) {
              this.unlockedAchievements.add(id as AchievementId);
            }
          }
        }
        if (typeof data.trainsSurvived === 'number' && Number.isFinite(data.trainsSurvived) && data.trainsSurvived >= 0) {
          this.trainsSurvived = Math.floor(data.trainsSurvived);
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
        playerName: this.playerName,
        playerRuns: this.playerRuns,
        unlockedAchievements: Array.from(this.unlockedAchievements),
        trainsSurvived: this.trainsSurvived,
      };
      this.storage.setItem(PROFILE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore storage quota errors
    }
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

  getCoins(): number {
    return this.coins;
  }

  addCoins(amount: number): void {
    if (!Number.isFinite(amount) || amount <= 0) return;
    this.coins += Math.floor(amount);
    this.evaluateAchievements();
    this.saveToStorage();
  }

  getUnlockedSkins(): SkinId[] {
    return [...this.unlockedSkins];
  }

  getSelectedSkin(): SkinId {
    return this.selectedSkin;
  }

  getSkinRarity(skinId: SkinId): SkinRarityValue {
    return SKIN_RARITY_MAP[skinId] ?? SkinRarity.COMMON;
  }

  selectSkin(skinId: SkinId): boolean {
    if (!this.unlockedSkins.includes(skinId)) return false;
    this.selectedSkin = skinId;
    this.saveToStorage();
    return true;
  }

  private pickSkinByRoll(randomInput: number): SkinId {
    if (!Number.isInteger(randomInput) && randomInput > 0 && randomInput < 1) {
      const rollPct = randomInput * 100;
      if (rollPct < 50) return 'chicken';
      if (rollPct < 80) return 'cyber_duck';
      if (rollPct < 95) return 'shadow_ninja';
      return 'frost_penguin';
    }
    const intVal = Math.floor(randomInput);
    if (intVal > 0) {
      const locked = ALL_SKINS.map((s) => s.id).filter((id) => !this.unlockedSkins.includes(id));
      if (locked.length > 0) {
        return locked[(intVal - 1) % locked.length];
      }
    }
    const idx = Math.abs(intVal) % ALL_SKINS.length;
    return ALL_SKINS[idx].id;
  }

  rollGacha(randomIndex: number = 0, forceSkinId?: SkinId): GachaRollResult {
    if (this.coins < WORLD_CONFIG.GACHA_COST) {
      return { success: false, reason: 'NOT_ENOUGH_COINS' };
    }
    this.coins -= WORLD_CONFIG.GACHA_COST;
    const chosen = forceSkinId ?? this.pickSkinByRoll(randomIndex);
    const rarity = this.getSkinRarity(chosen);
    const isDuplicate = this.unlockedSkins.includes(chosen);

    if (isDuplicate) {
      this.coins += GACHA_DUPLICATE_CASHBACK;
      this.evaluateAchievements();
      this.saveToStorage();
      return {
        success: true,
        skinId: chosen,
        rarity,
        isDuplicate: true,
        cashback: GACHA_DUPLICATE_CASHBACK,
      };
    }

    this.unlockedSkins.push(chosen);
    this.selectedSkin = chosen;
    this.evaluateAchievements();
    this.saveToStorage();
    return {
      success: true,
      skinId: chosen,
      rarity,
      isDuplicate: false,
      cashback: 0,
    };
  }

  getPlayerName(): string {
    return this.playerName;
  }

  setPlayerName(name: string): void {
    const clean = name.trim();
    if (clean.length > 0) {
      this.playerName = clean.slice(0, 24);
      this.saveToStorage();
    }
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
    const entrySkin = meta?.skinId ?? this.selectedSkin;

    if (cleanScore > 0) {
      this.playerRuns.unshift({
        playerName: entryName,
        score: cleanScore,
        skinId: entrySkin,
        date: entryDate,
        isBot: false,
      });
      this.playerRuns.sort((a, b) => b.score - a.score);
      this.playerRuns = this.playerRuns.slice(0, MAX_LEADERBOARD_ENTRIES);
    }

    const updated = this.getLeaderboard();
    const overtakenBots = prevBotsAbove.filter((botName) => {
      const bot = DEFAULT_BOT_RIVALS.find((b) => b.playerName === botName);
      return bot !== undefined && cleanScore > bot.score;
    });

    const found = updated.find(
      (e) => !e.isBot && e.score === cleanScore && e.playerName === entryName && e.skinId === entrySkin
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

  recordTrainSurvived(count: number = 1): void {
    if (!Number.isFinite(count) || count <= 0) return;
    this.trainsSurvived += Math.floor(count);
    this.evaluateAchievements();
    this.saveToStorage();
  }

  getTrainsSurvived(): number {
    return this.trainsSurvived;
  }

  unlockAchievement(id: AchievementId, date?: string): boolean {
    if (this.unlockedAchievements.has(id)) return false;
    this.unlockedAchievements.add(id);
    this.achievementDates.set(id, date ?? new Date().toISOString().slice(0, 10));
    this.saveToStorage();
    return true;
  }

  isAchievementUnlocked(id: AchievementId): boolean {
    return this.unlockedAchievements.has(id);
  }

  getAchievements(): Achievement[] {
    return ACHIEVEMENT_DEFINITIONS.map((def) => ({
      ...def,
      unlocked: this.unlockedAchievements.has(def.id),
      unlockedAt: this.achievementDates.get(def.id),
    }));
  }

  private evaluateAchievements(): void {
    if (this.currentScore >= 50 || this.highScore >= 50) {
      this.unlockedAchievements.add('first_50_steps');
    }
    if (this.unlockedSkins.length >= ALL_SKINS.length) {
      this.unlockedAchievements.add('collector');
    }
    if (this.trainsSurvived >= 5) {
      this.unlockedAchievements.add('train_conqueror');
    }
    if (this.coins >= 200) {
      this.unlockedAchievements.add('rich_hopper');
    }
    const topBotScore = DEFAULT_BOT_RIVALS[0]?.score ?? 250;
    if (this.highScore > topBotScore) {
      this.unlockedAchievements.add('leaderboard_champion');
    }
  }

  resetCurrentScore(): void {
    if (this.currentScore > 0) {
      this.recordRun(this.currentScore);
    }
    this.currentScore = 0;
  }
}
