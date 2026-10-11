import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  DailyRewardManager,
  DAILY_REWARD_DAYS,
  type DailyRewardState,
  setDevDisableDailyTimers,
} from '../src/core/dailyReward.ts';

describe('Daily Reward System — Core TDD & Property-Based Suite', () => {
  beforeEach(() => {
    setDevDisableDailyTimers(false);
  });
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  // Fixed baseline: 2026-10-12 12:00:00 (Monday noon)
  const BASE_TIME = new Date(2026, 9, 12, 12, 0, 0).getTime();

  it('Property 1 (7-Day Config Invariant): pool has exactly 7 days with progressive coin rewards', () => {
    assert.equal(DAILY_REWARD_DAYS.length, 7);
    assert.deepEqual(
      DAILY_REWARD_DAYS.map((d) => d.coins),
      [50, 75, 100, 150, 200, 250, 500]
    );
    assert.equal(DAILY_REWARD_DAYS[6].isMega, true);
    assert.equal(DAILY_REWARD_DAYS[0].isMega, false);
  });

  it('Property 2 (Fresh Player Initial State): Day 1 is immediately available to claim', () => {
    const manager = new DailyRewardManager();
    assert.equal(manager.canClaimToday(BASE_TIME), true);
    assert.equal(manager.getEligibleDay(BASE_TIME), 1);
    assert.equal(manager.getStreak(), 1);
    assert.equal(manager.getTotalClaims(), 0);

    const views = manager.getDaysView(BASE_TIME);
    assert.equal(views.length, 7);
    assert.equal(views[0].status, 'available');
    for (let i = 1; i < 7; i++) {
      assert.equal(views[i].status, 'locked');
    }
  });

  it('Property 3 (Same-Day Idempotency): claiming twice on the same day fails and grants 0 coins', () => {
    const manager = new DailyRewardManager();
    const result1 = manager.claimToday(false, BASE_TIME);
    assert.equal(result1.success, true);
    assert.equal(result1.coins, 50);
    assert.equal(result1.day, 1);
    assert.equal(result1.newStreak, 1);
    assert.equal(result1.totalClaims, 1);

    // Later that same afternoon
    const afternoonTime = BASE_TIME + 4 * 60 * 60 * 1000;
    assert.equal(manager.canClaimToday(afternoonTime), false);

    const result2 = manager.claimToday(false, afternoonTime);
    assert.equal(result2.success, false);
    assert.equal(result2.coins, 0);
    assert.equal(result2.error, 'ALREADY_CLAIMED_TODAY');
    assert.equal(manager.getTotalClaims(), 1);

    // View should show Day 1 claimed, others locked
    const views = manager.getDaysView(afternoonTime);
    assert.equal(views[0].status, 'claimed');
    assert.equal(views[1].status, 'locked');
  });

  it('Property 4 (Consecutive 7-Day Progression): steps day 1 through 7 and grants exact rewards', () => {
    const manager = new DailyRewardManager();

    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      const claimTime = BASE_TIME + dayIndex * MS_PER_DAY;
      assert.equal(manager.canClaimToday(claimTime), true, `Day ${dayIndex + 1} must be claimable`);
      assert.equal(manager.getEligibleDay(claimTime), dayIndex + 1);

      const result = manager.claimToday(false, claimTime);
      assert.equal(result.success, true);
      assert.equal(result.day, dayIndex + 1);
      assert.equal(result.coins, DAILY_REWARD_DAYS[dayIndex].coins);
      assert.equal(result.newStreak, dayIndex + 1);
      assert.equal(result.totalClaims, dayIndex + 1);
    }

    assert.equal(manager.getStreak(), 7);
    assert.equal(manager.getTotalClaims(), 7);
  });

  it('Property 5 (7-Day Loop Wrap): Day 8 wraps back to Day 1 while keeping cumulative total claims', () => {
    const manager = new DailyRewardManager();

    for (let i = 0; i < 7; i++) {
      manager.claimToday(false, BASE_TIME + i * MS_PER_DAY);
    }

    // Day 8 (Next cycle start)
    const day8Time = BASE_TIME + 7 * MS_PER_DAY;
    assert.equal(manager.canClaimToday(day8Time), true);
    assert.equal(manager.getEligibleDay(day8Time), 1);

    const result8 = manager.claimToday(false, day8Time);
    assert.equal(result8.success, true);
    assert.equal(result8.day, 1);
    assert.equal(result8.coins, 50);
    assert.equal(result8.newStreak, 1);
    assert.equal(result8.totalClaims, 8);
  });

  it('Property 6 (Rewarded Ad x2 Multiplier): doubles coins when flag is true', () => {
    const manager = new DailyRewardManager();
    const result = manager.claimToday(true, BASE_TIME);
    assert.equal(result.success, true);
    assert.equal(result.isDouble, true);
    assert.equal(result.coins, 100); // 50 * 2
  });

  it('Property 7 (Broken Streak & Reset to Day 1): missing a calendar day resets streak to 1', () => {
    const manager = new DailyRewardManager();
    // Claim day 1 and 2
    manager.claimToday(false, BASE_TIME);
    manager.claimToday(false, BASE_TIME + 1 * MS_PER_DAY);
    assert.equal(manager.getStreak(), 2);

    // Skip day 3, return on day 4 (2 days later)
    const returnTime = BASE_TIME + 3 * MS_PER_DAY;
    assert.equal(manager.canClaimToday(returnTime), true);
    assert.equal(manager.getEligibleDay(returnTime), 1, 'Streak broke: eligible day must be 1');

    const result = manager.claimToday(false, returnTime);
    assert.equal(result.success, true);
    assert.equal(result.day, 1);
    assert.equal(result.coins, 50);
    assert.equal(result.newStreak, 1);
  });

  it('Property 8 (Anti-Clock Rollback Guard): moving clock backward prevents claim', () => {
    const manager = new DailyRewardManager();
    manager.claimToday(false, BASE_TIME);

    // Time manipulated 5 hours into the past
    const hackedPastTime = BASE_TIME - 5 * 60 * 60 * 1000;
    assert.equal(manager.canClaimToday(hackedPastTime), false);
  });

  it('Property 9 (Countdown Timer Calculation): returns valid ms until midnight', () => {
    const manager = new DailyRewardManager();
    const remainingMs = manager.getTimeUntilNextClaimMs(BASE_TIME);
    // BASE_TIME was 12:00:00 (noon), so 12 hours until midnight
    const twelveHoursMs = 12 * 60 * 60 * 1000;
    assert.ok(Math.abs(remainingMs - twelveHoursMs) <= 1000);
  });

  it('Property 10 (State Hydration & Resilient Restoration): safely restores from saved state', () => {
    const savedState: DailyRewardState = {
      currentStreak: 4,
      lastClaimTimestamp: BASE_TIME,
      lastClaimDate: '2026-10-12',
      totalClaims: 11,
    };

    const manager = new DailyRewardManager(savedState);
    assert.equal(manager.getStreak(), 4);
    assert.equal(manager.getTotalClaims(), 11);

    // State getter matches
    const state = manager.getState();
    assert.equal(state.currentStreak, 4);
    assert.equal(state.totalClaims, 11);
    assert.equal(state.lastClaimDate, '2026-10-12');
  });

  it('Property 11 (DEV Testing Bypass): allows immediate consecutive claims without waiting', () => {
    setDevDisableDailyTimers(true);
    const manager = new DailyRewardManager();

    // In DEV mode, day 1 is immediately available
    assert.equal(manager.canClaimToday(BASE_TIME), true);
    const r1 = manager.claimToday(false, BASE_TIME);
    assert.equal(r1.success, true);
    assert.equal(r1.day, 1);

    // Immediately claim again without advancing time
    assert.equal(manager.canClaimToday(BASE_TIME), true);
    const r2 = manager.claimToday(false, BASE_TIME);
    assert.equal(r2.success, true);
    assert.equal(r2.day, 2);

    // Countdown is always 0
    assert.equal(manager.getTimeUntilNextClaimMs(BASE_TIME), 0);
  });
});
