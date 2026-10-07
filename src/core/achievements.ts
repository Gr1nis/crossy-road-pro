export type AchievementId =
  | 'first_50_steps'
  | 'centurion'
  | 'collector'
  | 'train_conqueror'
  | 'rich_hopper'
  | 'coin_hoarder'
  | 'gacha_roller'
  | 'river_navigator'
  | 'speedy_crosser'
  | 'leaderboard_champion';

export interface Achievement {
  id: AchievementId;
  title: string;
  description: string;
  badge: string;
  unlocked: boolean;
  unlockedAt?: string;
  currentProgress: number;
  maxProgress: number;
  progressPercent: number;
}

export interface AchievementDefinition {
  id: AchievementId;
  title: string;
  description: string;
  badge: string;
  maxProgress: number;
}

export const ACHIEVEMENT_DEFINITIONS: ReadonlyArray<AchievementDefinition> = [
  { id: 'first_50_steps', title: 'Первые 50 шагов', description: 'Достигните 50 очков за один забег', badge: '👣', maxProgress: 50 },
  { id: 'centurion', title: 'Центурион', description: 'Достигните 100 очков за один забег', badge: '🏛️', maxProgress: 100 },
  { id: 'collector', title: 'Коллекционер', description: 'Откройте все 4 скина в Гача-автомате', badge: '🎭', maxProgress: 4 },
  { id: 'train_conqueror', title: 'Покоритель поездов', description: 'Переживите встречу с 5 скоростными поездами', badge: '🚆', maxProgress: 5 },
  { id: 'rich_hopper', title: 'Золотой запас', description: 'Накопите 200 монет на балансе', badge: '💰', maxProgress: 200 },
  { id: 'coin_hoarder', title: 'Монетный магнат', description: 'Соберите 30 монет за один забег', badge: '🪙', maxProgress: 30 },
  { id: 'gacha_roller', title: 'Азартный игрок', description: 'Совершите 3 прокрутки в Гача-автомате', badge: '🎰', maxProgress: 3 },
  { id: 'river_navigator', title: 'Речной волк', description: 'Совершите 10 прыжков по брёвнам', badge: '🪵', maxProgress: 10 },
  { id: 'speedy_crosser', title: 'Без оглядки', description: 'Сделайте 30 шагов вперед без движения назад', badge: '🏃', maxProgress: 30 },
  { id: 'leaderboard_champion', title: 'Король трассы', description: 'Займите 1-е место в таблице лидеров', badge: '👑', maxProgress: 1 },
];

export interface AchievementEvaluationContext {
  score?: number;
  coins?: number;
  unlockedSkinsCount?: number;
  allSkinsCount?: number;
  isTop1?: boolean;
  runCoins?: number;
  logsHopped?: number;
  forwardStreak?: number;
  gachaRolls?: number;
}

export class AchievementTracker {
  private unlocked = new Set<AchievementId>();
  private dates = new Map<AchievementId, string>();
  private trainsSurvived = 0;
  private logsHopped = 0;
  private gachaRolls = 0;
  private lastContext: AchievementEvaluationContext = {};

  constructor(
    initialUnlocked: AchievementId[] = [],
    initialCounters: number | { trains?: number; logs?: number; gacha?: number } = {},
    initialDates?: Record<AchievementId, string> | Map<AchievementId, string>
  ) {
    if (Array.isArray(initialUnlocked)) {
      for (const id of initialUnlocked) this.unlocked.add(id);
    }
    const counters = typeof initialCounters === 'number' ? { trains: initialCounters } : initialCounters;
    this.trainsSurvived = Math.max(0, Math.floor(counters.trains ?? 0));
    this.logsHopped = Math.max(0, Math.floor(counters.logs ?? 0));
    this.gachaRolls = Math.max(0, Math.floor(counters.gacha ?? 0));
    if (initialDates) {
      if (initialDates instanceof Map) {
        for (const [k, v] of initialDates) this.dates.set(k, v);
      } else {
        for (const [k, v] of Object.entries(initialDates)) this.dates.set(k as AchievementId, v);
      }
    }
  }

  isUnlocked(id: AchievementId): boolean {
    return this.unlocked.has(id);
  }

  unlock(id: AchievementId, date?: string): boolean {
    if (this.unlocked.has(id)) return false;
    this.unlocked.add(id);
    this.dates.set(id, date ?? new Date().toISOString().slice(0, 10));
    return true;
  }

  getUnlockedIds(): AchievementId[] {
    return Array.from(this.unlocked);
  }

  getTrainsSurvived(): number { return this.trainsSurvived; }
  getLogsHopped(): number { return this.logsHopped; }
  getGachaRolls(): number { return this.gachaRolls; }

  recordTrainSurvived(count = 1): number {
    this.trainsSurvived += Math.max(1, Math.floor(count));
    if (this.trainsSurvived >= 5) this.unlock('train_conqueror');
    return this.trainsSurvived;
  }

  recordLogHopped(count = 1): number {
    this.logsHopped += Math.max(1, Math.floor(count));
    if (this.logsHopped >= 10) this.unlock('river_navigator');
    return this.logsHopped;
  }

  recordGachaRoll(count = 1): number {
    this.gachaRolls += Math.max(1, Math.floor(count));
    if (this.gachaRolls >= 3) this.unlock('gacha_roller');
    return this.gachaRolls;
  }

  getAchievements(ctx?: AchievementEvaluationContext): Achievement[] {
    if (ctx) this.lastContext = { ...this.lastContext, ...ctx };
    const c = this.lastContext;

    return ACHIEVEMENT_DEFINITIONS.map((def) => {
      const isUnl = this.unlocked.has(def.id);
      let rawVal = 0;
      switch (def.id) {
        case 'first_50_steps': rawVal = Math.max(0, c.score ?? 0); break;
        case 'centurion': rawVal = Math.max(0, c.score ?? 0); break;
        case 'collector': rawVal = Math.max(0, c.unlockedSkinsCount ?? 0); break;
        case 'train_conqueror': rawVal = this.trainsSurvived; break;
        case 'rich_hopper': rawVal = Math.max(0, c.coins ?? 0); break;
        case 'coin_hoarder': rawVal = Math.max(0, c.runCoins ?? 0); break;
        case 'gacha_roller': rawVal = this.gachaRolls; break;
        case 'river_navigator': rawVal = this.logsHopped; break;
        case 'speedy_crosser': rawVal = Math.max(0, c.forwardStreak ?? 0); break;
        case 'leaderboard_champion': rawVal = c.isTop1 ? 1 : 0; break;
      }
      const cur = isUnl ? def.maxProgress : Math.min(def.maxProgress, Math.max(0, rawVal));
      const pct = isUnl ? 100 : Math.min(100, Math.max(0, Math.round((cur / def.maxProgress) * 100)));
      return {
        ...def,
        unlocked: isUnl,
        unlockedAt: this.dates.get(def.id),
        currentProgress: cur,
        progressPercent: pct,
      };
    });
  }

  getSummary(): { total: number; unlockedCount: number; percent: number } {
    const total = ACHIEVEMENT_DEFINITIONS.length;
    const unlockedCount = this.unlocked.size;
    const percent = total > 0 ? Math.round((unlockedCount / total) * 100) : 0;
    return { total, unlockedCount, percent };
  }

  evaluate(ctx: AchievementEvaluationContext): Achievement[] {
    this.lastContext = { ...this.lastContext, ...ctx };
    const newly: Achievement[] = [];
    const check = (id: AchievementId, condition: boolean) => {
      if (condition && this.unlock(id)) {
        const found = this.getAchievements().find((a) => a.id === id);
        if (found) newly.push(found);
      }
    };

    check('first_50_steps', (ctx.score ?? 0) >= 50);
    check('centurion', (ctx.score ?? 0) >= 100);
    check('collector', (ctx.unlockedSkinsCount ?? 0) >= 4);
    check('train_conqueror', this.trainsSurvived >= 5);
    check('rich_hopper', (ctx.coins ?? 0) >= 200);
    check('coin_hoarder', (ctx.runCoins ?? 0) >= 30);
    check('gacha_roller', this.gachaRolls >= 3);
    check('river_navigator', this.logsHopped >= 10);
    check('speedy_crosser', (ctx.forwardStreak ?? 0) >= 30);
    check('leaderboard_champion', Boolean(ctx.isTop1));

    return newly;
  }

  serialize(): string {
    return JSON.stringify({
      unlocked: Array.from(this.unlocked),
      dates: Object.fromEntries(this.dates),
      trains: this.trainsSurvived,
      logs: this.logsHopped,
      gacha: this.gachaRolls,
    });
  }

  static deserialize(json: string): AchievementTracker {
    try {
      const data = JSON.parse(json);
      if (!data || typeof data !== 'object') return new AchievementTracker();
      return new AchievementTracker(
        Array.isArray(data.unlocked) ? data.unlocked : [],
        { trains: data.trains, logs: data.logs, gacha: data.gacha },
        data.dates
      );
    } catch {
      return new AchievementTracker();
    }
  }
}
