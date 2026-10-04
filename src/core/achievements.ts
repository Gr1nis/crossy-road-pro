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

export const ACHIEVEMENT_DEFINITIONS: ReadonlyArray<Omit<Achievement, 'unlocked' | 'unlockedAt'>> = [
  { id: 'first_50_steps', title: 'Первые 50 шагов', description: 'Достигните 50 очков за один забег', badge: '👣' },
  { id: 'collector', title: 'Коллекционер', description: 'Откройте все скины в Гача-автомате', badge: '🎭' },
  { id: 'train_conqueror', title: 'Покоритель поездов', description: 'Переживите встречу с 5 скоростными поездами', badge: '🚆' },
  { id: 'rich_hopper', title: 'Золотой запас', description: 'Накопите 200 монет на балансе', badge: '💰' },
  { id: 'leaderboard_champion', title: 'Король трассы', description: 'Займите 1-е место в таблице лидеров', badge: '👑' },
];

export interface AchievementEvaluationContext {
  score: number;
  coins: number;
  unlockedSkinsCount: number;
  allSkinsCount: number;
  isTop1: boolean;
}

/**
 * AchievementTracker manages player achievements and tracks unlock conditions.
 * Decoupled from storage, view, and game loop.
 */
export class AchievementTracker {
  private unlocked = new Set<AchievementId>();
  private dates = new Map<AchievementId, string>();
  private trainsSurvived = 0;

  constructor(
    initialUnlocked: AchievementId[] = [],
    initialTrainsSurvived: number = 0,
    initialDates?: Record<AchievementId, string> | Map<AchievementId, string>
  ) {
    if (Array.isArray(initialUnlocked)) {
      for (const id of initialUnlocked) {
        this.unlocked.add(id);
      }
    }
    if (Number.isFinite(initialTrainsSurvived) && initialTrainsSurvived >= 0) {
      this.trainsSurvived = Math.floor(initialTrainsSurvived);
    }
    if (initialDates) {
      if (initialDates instanceof Map) {
        for (const [k, v] of initialDates) {
          this.dates.set(k, v);
        }
      } else {
        for (const [k, v] of Object.entries(initialDates)) {
          this.dates.set(k as AchievementId, v);
        }
      }
    }
  }

  getAchievements(): Achievement[] {
    return ACHIEVEMENT_DEFINITIONS.map((def) => ({
      ...def,
      unlocked: this.unlocked.has(def.id),
      unlockedAt: this.dates.get(def.id),
    }));
  }

  isUnlocked(id: AchievementId): boolean {
    return this.unlocked.has(id);
  }

  unlock(id: AchievementId, date?: string): boolean {
    if (this.unlocked.has(id)) {
      return false;
    }
    this.unlocked.add(id);
    this.dates.set(id, date ?? new Date().toISOString().slice(0, 10));
    return true;
  }

  getUnlockedIds(): AchievementId[] {
    return Array.from(this.unlocked);
  }

  getTrainsSurvived(): number {
    return this.trainsSurvived;
  }

  recordTrainSurvived(count: number = 1): number {
    const inc = Number.isFinite(count) && count > 0 ? Math.floor(count) : 1;
    this.trainsSurvived += inc;
    if (this.trainsSurvived >= 5) {
      this.unlock('train_conqueror');
    }
    return this.trainsSurvived;
  }

  evaluate(context: AchievementEvaluationContext): Achievement[] {
    const newlyUnlocked: Achievement[] = [];

    if (context.score >= 50 && this.unlock('first_50_steps')) {
      const def = this.getAchievements().find((a) => a.id === 'first_50_steps');
      if (def) newlyUnlocked.push(def);
    }

    if (context.unlockedSkinsCount >= context.allSkinsCount && this.unlock('collector')) {
      const def = this.getAchievements().find((a) => a.id === 'collector');
      if (def) newlyUnlocked.push(def);
    }

    if (this.trainsSurvived >= 5 && this.unlock('train_conqueror')) {
      const def = this.getAchievements().find((a) => a.id === 'train_conqueror');
      if (def) newlyUnlocked.push(def);
    }

    if (context.coins >= 200 && this.unlock('rich_hopper')) {
      const def = this.getAchievements().find((a) => a.id === 'rich_hopper');
      if (def) newlyUnlocked.push(def);
    }

    if (context.isTop1 && this.unlock('leaderboard_champion')) {
      const def = this.getAchievements().find((a) => a.id === 'leaderboard_champion');
      if (def) newlyUnlocked.push(def);
    }

    return newlyUnlocked;
  }
}
