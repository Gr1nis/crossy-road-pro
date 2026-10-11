export interface DailyRewardDayConfig {
  readonly day: number;
  readonly coins: number;
  readonly isMega: boolean;
}

export const DAILY_REWARD_DAYS: ReadonlyArray<DailyRewardDayConfig> = [
  { day: 1, coins: 50, isMega: false },
  { day: 2, coins: 75, isMega: false },
  { day: 3, coins: 100, isMega: false },
  { day: 4, coins: 150, isMega: false },
  { day: 5, coins: 200, isMega: false },
  { day: 6, coins: 250, isMega: false },
  { day: 7, coins: 500, isMega: true },
];

export type DailyRewardCardStatus = 'claimed' | 'available' | 'locked';

export interface DailyRewardDayView {
  readonly day: number;
  readonly coins: number;
  readonly isMega: boolean;
  readonly status: DailyRewardCardStatus;
}

export interface DailyRewardState {
  currentStreak: number;       // 1..7 (current day in cycle)
  lastClaimTimestamp: number;  // epoch ms of last claim
  lastClaimDate: string;       // YYYY-MM-DD
  totalClaims: number;         // cumulative total claims across all time
  previousStreakBeforeBreak?: number; // for restoring streak via Rewarded Ad
}

export interface DailyClaimResult {
  readonly success: boolean;
  readonly coins: number;
  readonly day: number;
  readonly newStreak: number;
  readonly totalClaims: number;
  readonly isDouble: boolean;
  readonly error?: string;
}

function toLocalDateString(timestamp: number): string {
  const d = new Date(timestamp);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function calculateCalendarDayDiff(dateStr1: string, dateStr2: string): number {
  if (!dateStr1 || !dateStr2) return 999;
  const p1 = dateStr1.split('-').map(Number);
  const p2 = dateStr2.split('-').map(Number);
  if (p1.length !== 3 || p2.length !== 3) return 999;
  const d1 = new Date(p1[0], p1[1] - 1, p1[2]);
  const d2 = new Date(p2[0], p2[1] - 1, p2[2]);
  const msDiff = d2.getTime() - d1.getTime();
  return Math.round(msDiff / (1000 * 60 * 60 * 24));
}

export class DailyRewardManager {
  private currentStreak = 1;
  private lastClaimTimestamp = 0;
  private lastClaimDate = '';
  private totalClaims = 0;
  private previousStreakBeforeBreak: number | undefined = undefined;

  constructor(initialState?: Partial<DailyRewardState>) {
    if (initialState) {
      if (typeof initialState.currentStreak === 'number' && initialState.currentStreak >= 1 && initialState.currentStreak <= 7) {
        this.currentStreak = Math.floor(initialState.currentStreak);
      }
      if (typeof initialState.lastClaimTimestamp === 'number' && Number.isFinite(initialState.lastClaimTimestamp) && initialState.lastClaimTimestamp >= 0) {
        this.lastClaimTimestamp = Math.floor(initialState.lastClaimTimestamp);
      }
      if (typeof initialState.lastClaimDate === 'string' && initialState.lastClaimDate.trim().length > 0) {
        this.lastClaimDate = initialState.lastClaimDate.trim();
      }
      if (typeof initialState.totalClaims === 'number' && Number.isFinite(initialState.totalClaims) && initialState.totalClaims >= 0) {
        this.totalClaims = Math.floor(initialState.totalClaims);
      }
      if (typeof initialState.previousStreakBeforeBreak === 'number') {
        this.previousStreakBeforeBreak = initialState.previousStreakBeforeBreak;
      }
    }
  }

  getState(): DailyRewardState {
    return {
      currentStreak: this.currentStreak,
      lastClaimTimestamp: this.lastClaimTimestamp,
      lastClaimDate: this.lastClaimDate,
      totalClaims: this.totalClaims,
      previousStreakBeforeBreak: this.previousStreakBeforeBreak,
    };
  }

  /**
   * Evaluates if reward can be claimed at timestamp `now`.
   */
  canClaimToday(now: number = Date.now()): boolean {
    if (this.lastClaimTimestamp > 0 && now < this.lastClaimTimestamp) {
      // Clock moved backward or future timestamp: prevent exploit
      return false;
    }
    const today = toLocalDateString(now);
    if (!this.lastClaimDate) {
      return true;
    }
    const diff = calculateCalendarDayDiff(this.lastClaimDate, today);
    return diff >= 1;
  }

  /**
   * Returns which day (1..7) is currently active / eligible.
   */
  getEligibleDay(now: number = Date.now()): number {
    if (!this.lastClaimDate) {
      return 1;
    }
    const today = toLocalDateString(now);
    const diff = calculateCalendarDayDiff(this.lastClaimDate, today);

    if (diff === 0) {
      // Already claimed today: returns the day that was claimed today
      return this.currentStreak;
    }

    if (diff === 1) {
      // Consecutive day!
      return this.currentStreak === 7 ? 1 : this.currentStreak + 1;
    }

    // Broken streak (>1 day missed): resets to day 1
    return 1;
  }

  /**
   * Can streak be restored via Rewarded Ad?
   */
  canRestoreStreak(now: number = Date.now()): boolean {
    if (!this.lastClaimDate) return false;
    const today = toLocalDateString(now);
    const diff = calculateCalendarDayDiff(this.lastClaimDate, today);
    // Broken streak (>1 day) and player had a streak > 1 that was broken
    return diff > 1 && (this.previousStreakBeforeBreak ?? this.currentStreak) > 1;
  }

  /**
   * Restore streak after watching an ad.
   */
  restoreStreak(): boolean {
    const targetStreak = this.previousStreakBeforeBreak ?? this.currentStreak;
    if (targetStreak > 1) {
      this.currentStreak = targetStreak === 7 ? 1 : targetStreak;
      this.previousStreakBeforeBreak = undefined;
      return true;
    }
    return false;
  }

  /**
   * Claims today's daily bonus.
   */
  claimToday(doubleMultiplier: boolean = false, now: number = Date.now()): DailyClaimResult {
    if (!this.canClaimToday(now)) {
      return {
        success: false,
        coins: 0,
        day: this.currentStreak,
        newStreak: this.currentStreak,
        totalClaims: this.totalClaims,
        isDouble: false,
        error: 'ALREADY_CLAIMED_TODAY',
      };
    }

    const today = toLocalDateString(now);
    let targetDay = 1;

    if (!this.lastClaimDate) {
      targetDay = 1;
    } else {
      const diff = calculateCalendarDayDiff(this.lastClaimDate, today);
      if (diff === 1) {
        targetDay = this.currentStreak === 7 ? 1 : this.currentStreak + 1;
      } else {
        // Streak broken
        this.previousStreakBeforeBreak = this.currentStreak;
        targetDay = 1;
      }
    }

    const config = DAILY_REWARD_DAYS[targetDay - 1] ?? DAILY_REWARD_DAYS[0];
    const baseCoins = config.coins;
    const finalCoins = doubleMultiplier ? baseCoins * 2 : baseCoins;

    this.currentStreak = targetDay;
    this.lastClaimDate = today;
    this.lastClaimTimestamp = now;
    this.totalClaims += 1;
    this.previousStreakBeforeBreak = undefined;

    return {
      success: true,
      coins: finalCoins,
      day: targetDay,
      newStreak: this.currentStreak,
      totalClaims: this.totalClaims,
      isDouble: doubleMultiplier,
    };
  }

  /**
   * Milliseconds remaining until next local midnight.
   */
  getTimeUntilNextClaimMs(now: number = Date.now()): number {
    const d = new Date(now);
    const nextMidnight = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1, 0, 0, 0, 0);
    return Math.max(0, nextMidnight.getTime() - now);
  }

  /**
   * Returns status view for all 7 days in current cycle.
   */
  getDaysView(now: number = Date.now()): DailyRewardDayView[] {
    const canClaim = this.canClaimToday(now);
    const eligibleDay = this.getEligibleDay(now);

    return DAILY_REWARD_DAYS.map((config) => {
      let status: DailyRewardCardStatus;

      if (canClaim) {
        if (config.day < eligibleDay) {
          status = 'claimed';
        } else if (config.day === eligibleDay) {
          status = 'available';
        } else {
          status = 'locked';
        }
      } else {
        // Already claimed today
        if (config.day <= this.currentStreak) {
          status = 'claimed';
        } else {
          status = 'locked';
        }
      }

      return {
        day: config.day,
        coins: config.coins,
        isMega: config.isMega,
        status,
      };
    });
  }

  getStreak(): number {
    return this.currentStreak;
  }

  getTotalClaims(): number {
    return this.totalClaims;
  }
}
