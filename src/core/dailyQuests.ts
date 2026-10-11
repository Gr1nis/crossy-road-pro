export type DailyQuestCategory = 'score' | 'coins' | 'hops' | 'rivers' | 'trains' | 'gacha';

export interface DailyQuestDefinition {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly category: DailyQuestCategory;
  readonly target: number;
  readonly rewardCoins: number;
  readonly isSingleRun: boolean;
}

export interface DailyQuestInstance {
  readonly id: string;
  readonly defId: string;
  readonly title: string;
  readonly description: string;
  readonly category: DailyQuestCategory;
  readonly target: number;
  readonly rewardCoins: number;
  readonly isSingleRun: boolean;
  current: number;
  progressPercent: number;
  isCompleted: boolean;
  isClaimed: boolean;
}

export type DailyQuest = DailyQuestInstance;

export interface DailyQuestDayState {
  lastActiveDateKey: string;
  currentStreakDays: number;
  allCompletedBonusClaimed: boolean;
  quests: DailyQuestInstance[];
}

export type DailyQuestState = DailyQuestDayState;

export interface DailyQuestEventData {
  score?: number;
  coins?: number;
  hops?: number;
  rivers?: number;
  trains?: number;
  gacha?: number;
  [key: string]: number | undefined;
}

export const DAILY_SUPER_BONUS_COINS = 100;

export const DAILY_QUEST_DEFINITIONS: ReadonlyArray<DailyQuestDefinition> = [
  { id: 'hop_distance', title: 'Прыжковый марафон', description: 'Сделайте 200 шагов суммарно', category: 'hops', target: 200, rewardCoins: 25, isSingleRun: false },
  { id: 'single_run_score', title: 'Рекордный забег', description: 'Наберите 40 очков за один забег', category: 'score', target: 40, rewardCoins: 40, isSingleRun: true },
  { id: 'coin_collector', title: 'Сборщик монет', description: 'Соберите 15 монет суммарно', category: 'coins', target: 15, rewardCoins: 25, isSingleRun: false },
  { id: 'river_hopper', title: 'Покоритель рек', description: 'Пересеките 12 брёвен на воде', category: 'rivers', target: 12, rewardCoins: 35, isSingleRun: false },
  { id: 'train_evader', title: 'Гроза поездов', description: 'Переживите 3 мчащихся поезда', category: 'trains', target: 3, rewardCoins: 50, isSingleRun: false },
  { id: 'combo_rusher', title: 'Комбо-мастер', description: 'Выполните серию комбо из 4 шагов', category: 'score', target: 4, rewardCoins: 40, isSingleRun: false },
  { id: 'forward_streak', title: 'Только вперёд', description: 'Сделайте 25 шагов вперёд без отката', category: 'hops', target: 25, rewardCoins: 50, isSingleRun: true },
  { id: 'daily_runs', title: 'Ежедневные забеги', description: 'Сыграйте 5 забегов', category: 'score', target: 5, rewardCoins: 25, isSingleRun: false },
  { id: 'gacha_spin', title: 'Удачный спин', description: 'Совершите 1 прокрутку в автомате', category: 'gacha', target: 1, rewardCoins: 30, isSingleRun: false },
];

export function getDailyDateKey(dateOrTimestamp?: number | Date): string {
  const d = dateOrTimestamp instanceof Date ? dateOrTimestamp : new Date(dateOrTimestamp ?? Date.now());
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${d.getUTCFullYear()}-${m}-${day}`;
}

export function getDailySeedFromDate(dateKey: string): number {
  let hash = 2166136261 ^ 37;
  for (let i = 0; i < dateKey.length; i++) {
    hash = Math.imul(hash ^ dateKey.charCodeAt(i), 16777619);
  }
  return hash >>> 0;
}

function dailyQuestCalendarDiff(d1: string, d2: string): number {
  if (!d1 || !d2) return 999;
  const p1 = d1.split('-').map(Number);
  const p2 = d2.split('-').map(Number);
  if (p1.length !== 3 || p2.length !== 3 || !p1.every(Number.isFinite) || !p2.every(Number.isFinite)) return 999;
  return Math.round((Date.UTC(p2[0], p2[1] - 1, p2[2]) - Date.UTC(p1[0], p1[1] - 1, p1[2])) / 86400000);
}

function dailyQuestIsRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

export function selectDailyQuests(dateKey: string): DailyQuestInstance[] {
  let seed = getDailySeedFromDate(dateKey);
  const pool = [...DAILY_QUEST_DEFINITIONS];
  for (let i = pool.length - 1; i > 0; i--) {
    seed = (seed * 9301 + 49297) % 233280;
    const j = Math.floor((seed / 233280) * (i + 1));
    const temp = pool[i];
    pool[i] = pool[j];
    pool[j] = temp;
  }
  return pool.slice(0, 3).map((def) => ({
    id: `${dateKey}_${def.id}`,
    defId: def.id,
    title: def.title,
    description: def.description,
    category: def.category,
    target: def.target,
    rewardCoins: def.rewardCoins,
    isSingleRun: def.isSingleRun,
    current: 0,
    progressPercent: 0,
    isCompleted: false,
    isClaimed: false,
  }));
}

export class DailyQuestTracker {
  private _lastActiveDateKey: string;
  private _currentStreakDays: number;
  private _allCompletedBonusClaimed: boolean;
  private _quests: DailyQuestInstance[];

  constructor(
    dateOrState?: string | Partial<DailyQuestDayState>,
    extraState?: Partial<DailyQuestDayState>
  ) {
    let dateKey = '2026-10-09';
    let state: Partial<DailyQuestDayState> | undefined = extraState;
    if (typeof dateOrState === 'string' && dateOrState.trim() !== '') {
      dateKey = dateOrState.trim();
    } else if (dailyQuestIsRecord(dateOrState)) {
      state = dateOrState as Partial<DailyQuestDayState>;
      if (typeof state.lastActiveDateKey === 'string' && state.lastActiveDateKey.trim() !== '') {
        dateKey = state.lastActiveDateKey.trim();
      }
    }

    this._lastActiveDateKey = dateKey;
    const streak = state?.currentStreakDays;
    this._currentStreakDays = typeof streak === 'number' && Number.isFinite(streak) && streak >= 0 ? Math.floor(streak) : 1;
    this._allCompletedBonusClaimed = Boolean(state?.allCompletedBonusClaimed);
    this._quests = Array.isArray(state?.quests) && state.quests.length === 3
      ? state.quests.map((q) => ({ ...q }))
      : selectDailyQuests(this._lastActiveDateKey);
  }

  public get lastActiveDateKey(): string { return this._lastActiveDateKey; }
  public get currentStreakDays(): number { return this._currentStreakDays; }
  public get allCompletedBonusClaimed(): boolean { return this._allCompletedBonusClaimed; }
  public get quests(): DailyQuestInstance[] { return this._quests; }
  public getQuests(): DailyQuestInstance[] { return this._quests; }

  public getQuest(idOrDefId: string): DailyQuestInstance | undefined {
    return this._quests.find((q) => q.id === idOrDefId || q.defId === idOrDefId);
  }

  public isAllCompleted(): boolean {
    return this._quests.length >= 3 && this._quests.every((q) => q.isCompleted);
  }

  public canClaimDailyBonus(): boolean {
    return !this._allCompletedBonusClaimed && this.isAllCompleted();
  }

  public checkDateRollover(currentDateKey: string): boolean {
    if (!currentDateKey || typeof currentDateKey !== 'string') return false;
    const diff = dailyQuestCalendarDiff(this._lastActiveDateKey, currentDateKey);
    if (diff <= 0) return false;

    this._currentStreakDays = diff === 1 && this.isAllCompleted() ? this._currentStreakDays + 1 : 1;
    this._lastActiveDateKey = currentDateKey;
    this._allCompletedBonusClaimed = false;
    this._quests = selectDailyQuests(currentDateKey);
    return true;
  }

  public recordProgress(
    eventsOrTarget: DailyQuestEventData | string,
    amount?: number
  ): { newlyCompletedQuests: DailyQuestInstance[] } {
    const newlyCompletedQuests: DailyQuestInstance[] = [];

    const applyAmount = (targetKey: string, val: number): void => {
      if (!Number.isFinite(val) || val <= 0) return;
      for (const quest of this._quests) {
        if (quest.id === targetKey || quest.defId === targetKey || quest.category === targetKey) {
          const wasCompleted = quest.isCompleted;
          quest.current = quest.isSingleRun ? Math.min(quest.target, Math.max(quest.current, val)) : Math.min(quest.target, quest.current + val);
          quest.current = Math.max(0, quest.current);
          quest.progressPercent = quest.target > 0 ? Math.min(100, Math.max(0, Math.round((quest.current / quest.target) * 100))) : 100;
          quest.isCompleted = quest.current >= quest.target;
          if (!wasCompleted && quest.isCompleted && !newlyCompletedQuests.includes(quest)) newlyCompletedQuests.push(quest);
        }
      }
    };

    if (typeof eventsOrTarget === 'string') {
      applyAmount(eventsOrTarget, typeof amount === 'number' ? amount : 0);
    } else if (dailyQuestIsRecord(eventsOrTarget)) {
      for (const [key, val] of Object.entries(eventsOrTarget)) {
        if (typeof val === 'number') applyAmount(key, val);
      }
    }
    return { newlyCompletedQuests };
  }

  public claimQuest(questId: string, doubleMultiplier: boolean = false): { success: boolean; rewardCoins: number; isDouble: boolean } {
    const quest = this.getQuest(questId);
    if (!quest || !quest.isCompleted || quest.isClaimed || quest.current < quest.target) {
      return { success: false, rewardCoins: 0, isDouble: false };
    }
    quest.isClaimed = true;
    const coins = doubleMultiplier ? quest.rewardCoins * 2 : quest.rewardCoins;
    return { success: true, rewardCoins: coins, isDouble: doubleMultiplier };
  }

  public claimDailyBonus(doubleMultiplier: boolean = false): { success: boolean; rewardCoins: number; isDouble: boolean } {
    if (!this.canClaimDailyBonus()) return { success: false, rewardCoins: 0, isDouble: false };
    this._allCompletedBonusClaimed = true;
    const coins = doubleMultiplier ? DAILY_SUPER_BONUS_COINS * 2 : DAILY_SUPER_BONUS_COINS;
    return { success: true, rewardCoins: coins, isDouble: doubleMultiplier };
  }

  public getState(): DailyQuestDayState {
    return {
      lastActiveDateKey: this._lastActiveDateKey,
      currentStreakDays: this._currentStreakDays,
      allCompletedBonusClaimed: this._allCompletedBonusClaimed,
      quests: this._quests.map((q) => ({ ...q })),
    };
  }

  public serialize(): string {
    return JSON.stringify(this.getState());
  }

  public static deserialize(json: string | unknown, fallbackDateKey?: string): DailyQuestTracker {
    const fallback = typeof fallbackDateKey === 'string' && fallbackDateKey.trim() !== '' ? fallbackDateKey.trim() : '2026-10-09';
    try {
      let parsed: unknown = json;
      if (typeof json === 'string') {
        if (json.trim() === '') return new DailyQuestTracker(fallback);
        parsed = JSON.parse(json);
      }
      if (!dailyQuestIsRecord(parsed)) return new DailyQuestTracker(fallback);

      const dateKey = typeof parsed.lastActiveDateKey === 'string' && parsed.lastActiveDateKey.trim() !== '' ? parsed.lastActiveDateKey.trim() : fallback;
      const streak = typeof parsed.currentStreakDays === 'number' && Number.isFinite(parsed.currentStreakDays) && parsed.currentStreakDays >= 0 ? Math.floor(parsed.currentStreakDays) : 1;
      const bonusClaimed = Boolean(parsed.allCompletedBonusClaimed);

      let quests: DailyQuestInstance[] = [];
      if (Array.isArray(parsed.quests) && parsed.quests.length === 3) {
        quests = parsed.quests.map((item: unknown): DailyQuestInstance | null => {
          if (!dailyQuestIsRecord(item)) return null;
          const id = typeof item.id === 'string' ? item.id : '';
          const defId = typeof item.defId === 'string' ? item.defId : '';
          const title = typeof item.title === 'string' ? item.title : '';
          const description = typeof item.description === 'string' ? item.description : '';
          const category = typeof item.category === 'string' ? (item.category as DailyQuestCategory) : 'score';
          const target = typeof item.target === 'number' && Number.isFinite(item.target) && item.target > 0 ? item.target : 1;
          const rewardCoins = typeof item.rewardCoins === 'number' && Number.isFinite(item.rewardCoins) && item.rewardCoins > 0 ? item.rewardCoins : 10;
          const isSingleRun = Boolean(item.isSingleRun);
          const current = typeof item.current === 'number' && Number.isFinite(item.current) && item.current >= 0 ? Math.min(target, item.current) : 0;
          const progressPercent = typeof item.progressPercent === 'number' && Number.isFinite(item.progressPercent) && item.progressPercent >= 0 && item.progressPercent <= 100
            ? item.progressPercent
            : Math.min(100, Math.max(0, Math.round((current / target) * 100)));
          if (!id || !defId) return null;
          return {
            id, defId, title, description, category, target, rewardCoins, isSingleRun,
            current, progressPercent,
            isCompleted: current >= target || Boolean(item.isCompleted),
            isClaimed: Boolean(item.isClaimed),
          };
        }).filter((q): q is DailyQuestInstance => q !== null);
      }

      if (quests.length !== 3) quests = selectDailyQuests(dateKey);
      return new DailyQuestTracker(dateKey, { currentStreakDays: streak, allCompletedBonusClaimed: bonusClaimed, quests });
    } catch (_err) {
      return new DailyQuestTracker(fallback);
    }
  }
}
