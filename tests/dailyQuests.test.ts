import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  DAILY_QUEST_DEFINITIONS,
  DAILY_SUPER_BONUS_COINS,
  DailyQuestTracker,
  selectDailyQuests,
  type DailyQuest,
  type DailyQuestCategory,
} from '../src/core/dailyQuests.ts';

describe('DailyQuests — Comprehensive TDD Suite', () => {
  it('Property 1 (Quest pool and validity): Pool has >= 9 valid definitions with mixed single-run & cumulative modes', () => {
    assert.ok(DAILY_QUEST_DEFINITIONS.length >= 9, 'Quest pool must contain at least 9 definitions');

    const validCategories = new Set<DailyQuestCategory>([
      'score', 'coins', 'hops', 'rivers', 'trains', 'gacha',
    ]);
    const idSet = new Set<string>();
    let hasSingleRun = false;
    let hasCumulative = false;

    for (const def of DAILY_QUEST_DEFINITIONS) {
      assert.ok(def.id.length > 0, 'Definition ID must be non-empty');
      assert.ok(!idSet.has(def.id), `Duplicate definition ID found: ${def.id}`);
      idSet.add(def.id);

      assert.ok(def.title.length > 0, `Title must be non-empty for ${def.id}`);
      assert.ok(def.description.length > 0, `Description must be non-empty for ${def.id}`);
      assert.ok(validCategories.has(def.category), `Invalid category ${def.category} for ${def.id}`);
      assert.ok(def.target > 0, `Target must be > 0 for ${def.id}`);
      assert.ok(def.rewardCoins > 0, `Reward coins must be > 0 for ${def.id}`);

      if (def.isSingleRun) {
        hasSingleRun = true;
      } else {
        hasCumulative = true;
      }
    }

    assert.equal(hasSingleRun, true, 'Pool must contain single-run quests (isSingleRun: true)');
    assert.equal(hasCumulative, true, 'Pool must contain cumulative quests (isSingleRun: false)');
  });

  it('Property 2 (Determinism of day generator): selectDailyQuests generates 3 unique quests deterministically', () => {
    const day1 = selectDailyQuests('2026-10-09');
    const day1Repeat = selectDailyQuests('2026-10-09');
    const day2 = selectDailyQuests('2026-10-10');

    assert.equal(day1.length, 3, 'Must return exactly 3 quests for a day');
    assert.equal(day1Repeat.length, 3);
    assert.equal(day2.length, 3);

    // Determinism: same date produces identical selection
    assert.deepEqual(day1, day1Repeat, 'Repeated call with same date must return identical quest instances');

    // No duplicate defIds within single day
    const day1DefIds = day1.map((q) => q.defId);
    const day1DefIdSet = new Set(day1DefIds);
    assert.equal(day1DefIdSet.size, 3, 'All 3 quests within a day must have unique defIds');

    // Different dates yield different selections
    const day2DefIds = day2.map((q) => q.defId);
    assert.notDeepEqual(day1DefIds, day2DefIds, 'Different dates must yield different quest selections');
  });

  it('Property 3 (Progress calculation & clamping): current clamped to [0, target], % to [0, 100], single-run vs cumulative', () => {
    const tracker = new DailyQuestTracker('2026-10-09');
    const quests = tracker.quests;
    assert.equal(quests.length, 3);

    const singleRunQuest = quests.find((q) => q.isSingleRun);
    const accumQuest = quests.find((q) => !q.isSingleRun);
    assert.ok(singleRunQuest, 'Active quests must have a single-run quest');
    assert.ok(accumQuest, 'Active quests must have a cumulative quest');

    // Test negative progress rejection
    tracker.recordProgress(accumQuest.category, -50);
    assert.equal(accumQuest.current, 0, 'Negative amount must not decrease progress');
    assert.equal(accumQuest.progressPercent, 0);

    // Cumulative quest: sums progress
    const step1 = Math.max(1, Math.floor(accumQuest.target / 4));
    const step2 = Math.max(1, Math.floor(accumQuest.target / 4));
    tracker.recordProgress(accumQuest.id, step1);
    assert.equal(accumQuest.current, step1);
    tracker.recordProgress(accumQuest.id, step2);
    assert.equal(accumQuest.current, step1 + step2);

    // Overflow clamping
    tracker.recordProgress(accumQuest.id, accumQuest.target * 10);
    assert.equal(accumQuest.current, accumQuest.target, 'Progress must be clamped to target');
    assert.equal(accumQuest.progressPercent, 100, 'Percent must be clamped to 100');
    assert.equal(accumQuest.isCompleted, true);

    // Single-run quest: takes max value of run, does not sum
    tracker.recordProgress(singleRunQuest.id, 20);
    assert.equal(singleRunQuest.current, Math.min(singleRunQuest.target, 20));
    const prevSingleCurrent = singleRunQuest.current;

    // Lower run does not reduce or add to progress
    tracker.recordProgress(singleRunQuest.id, 5);
    assert.equal(singleRunQuest.current, prevSingleCurrent, 'Lower run value must not alter single-run progress');

    // Higher run updates progress to new max
    const higherRun = singleRunQuest.target - 5;
    tracker.recordProgress(singleRunQuest.id, higherRun);
    assert.equal(singleRunQuest.current, higherRun);

    // Reaching target completes quest
    tracker.recordProgress(singleRunQuest.id, singleRunQuest.target + 100);
    assert.equal(singleRunQuest.current, singleRunQuest.target);
    assert.equal(singleRunQuest.progressPercent, 100);
    assert.equal(singleRunQuest.isCompleted, true);
  });

  it('Property 4 (Claim invariant): Cannot claim uncompleted quest, claim grants rewardCoins, repeat claim returns false', () => {
    const tracker = new DailyQuestTracker('2026-10-09');
    const quest = tracker.quests[0];

    // Cannot claim uncompleted
    const prematureClaim = tracker.claimQuest(quest.id);
    assert.equal(prematureClaim.success, false);
    assert.equal(prematureClaim.rewardCoins, 0);
    assert.equal(quest.isClaimed, false);

    // Complete quest
    tracker.recordProgress(quest.id, quest.target);
    assert.equal(quest.isCompleted, true);

    // First claim succeeds and grants exact rewardCoins
    const validClaim = tracker.claimQuest(quest.id);
    assert.equal(validClaim.success, true);
    assert.equal(validClaim.rewardCoins, quest.rewardCoins);
    assert.equal(quest.isClaimed, true);

    // Repeat claim fails (protection against duplicate reward)
    const duplicateClaim = tracker.claimQuest(quest.id);
    assert.equal(duplicateClaim.success, false);
    assert.equal(duplicateClaim.rewardCoins, 0);
  });

  it('Property 5 (Super-bonus & streak): Bonus unlocked only when all 3 quests completed, repeat claim returns false', () => {
    const tracker = new DailyQuestTracker('2026-10-09');

    // Initially 0/3 completed: bonus claim fails
    const claim0 = tracker.claimDailyBonus();
    assert.equal(claim0.success, false);
    assert.equal(claim0.rewardCoins, 0);

    // Complete quest 1 & 2 (2/3 completed): bonus claim still fails
    tracker.recordProgress(tracker.quests[0].id, tracker.quests[0].target);
    tracker.recordProgress(tracker.quests[1].id, tracker.quests[1].target);
    const claim2 = tracker.claimDailyBonus();
    assert.equal(claim2.success, false);
    assert.equal(claim2.rewardCoins, 0);

    // Complete quest 3 (3/3 completed): bonus claim succeeds with 100 coins
    tracker.recordProgress(tracker.quests[2].id, tracker.quests[2].target);
    const validBonus = tracker.claimDailyBonus();
    assert.equal(validBonus.success, true);
    assert.equal(validBonus.rewardCoins, DAILY_SUPER_BONUS_COINS);
    assert.equal(tracker.allCompletedBonusClaimed, true);

    // Repeat claim fails
    const duplicateBonus = tracker.claimDailyBonus();
    assert.equal(duplicateBonus.success, false);
    assert.equal(duplicateBonus.rewardCoins, 0);
  });

  it('Property 6 (Date rollover & streak): Consecutive days advance streak, gap resets to 1, same day ignored', () => {
    const tracker = new DailyQuestTracker('2026-10-09', { currentStreakDays: 1 });
    assert.equal(tracker.currentStreakDays, 1);

    // Completing all 3 quests on 2026-10-09
    for (const q of tracker.quests) {
      tracker.recordProgress(q.id, q.target);
      tracker.claimQuest(q.id);
    }
    tracker.claimDailyBonus();
    assert.equal(tracker.allCompletedBonusClaimed, true);

    // Rollover to same day returns false and retains progress
    const sameDayRollover = tracker.checkDateRollover('2026-10-09');
    assert.equal(sameDayRollover, false);
    assert.equal(tracker.allCompletedBonusClaimed, true);
    assert.equal(tracker.quests[0].isCompleted, true);

    // Consecutive day (2026-10-10) with fully completed previous day increments streak
    const nextDayRollover = tracker.checkDateRollover('2026-10-10');
    assert.equal(nextDayRollover, true);
    assert.equal(tracker.lastActiveDateKey, '2026-10-10');
    assert.equal(tracker.currentStreakDays, 2, 'Streak must increment on consecutive completed day');
    assert.equal(tracker.allCompletedBonusClaimed, false, 'Bonus flag must reset for new day');
    assert.equal(tracker.quests.length, 3);
    assert.equal(tracker.quests[0].current, 0, 'New day quests must have 0 progress');

    // Gap in days: jump from 2026-10-10 to 2026-10-12 (missed 2026-10-11)
    const gapRollover = tracker.checkDateRollover('2026-10-12');
    assert.equal(gapRollover, true);
    assert.equal(tracker.lastActiveDateKey, '2026-10-12');
    assert.equal(tracker.currentStreakDays, 1, 'Streak must reset to 1 after a gap');
  });

  it('Property 7 (Time anti-cheat): Past dates do not break state or duplicate rewards', () => {
    const tracker = new DailyQuestTracker('2026-10-09');
    tracker.recordProgress(tracker.quests[0].id, tracker.quests[0].target);
    const claimRes = tracker.claimQuest(tracker.quests[0].id);
    assert.equal(claimRes.success, true);

    // Attempting rollover to past date (e.g. clock rolled back to 2026-10-08)
    const pastRollover = tracker.checkDateRollover('2026-10-08');
    assert.equal(pastRollover, false, 'Rollover into past date must be rejected');
    assert.equal(tracker.lastActiveDateKey, '2026-10-09');

    // Quests and claim states remain intact, cannot re-claim
    assert.equal(tracker.quests[0].isClaimed, true);
    const reClaim = tracker.claimQuest(tracker.quests[0].id);
    assert.equal(reClaim.success, false, 'Cannot duplicate quest rewards via clock manipulation');
  });

  it('Property 8 (Serialization & adversarial corrupted storage): Handles valid states and corrupt inputs gracefully', () => {
    const original = new DailyQuestTracker('2026-10-09', { currentStreakDays: 3 });
    trackerProgressHelper(original);

    // Valid serialization / deserialization roundtrip
    const serialized = original.serialize();
    assert.ok(typeof serialized === 'string' && serialized.length > 0);

    const restored = DailyQuestTracker.deserialize(serialized);
    assert.equal(restored.lastActiveDateKey, '2026-10-09');
    assert.equal(restored.currentStreakDays, 3);
    assert.equal(restored.allCompletedBonusClaimed, original.allCompletedBonusClaimed);
    assert.deepEqual(restored.quests, original.quests);

    // Adversarial: Garbage / corrupt JSON strings
    const corruptInputs: unknown[] = [
      '',
      '{ invalid: json, corrupted ',
      JSON.stringify({ invalid: true, randomField: 12345 }),
      JSON.stringify({ currentStreakDays: -999, quests: 'not-an-array' }),
      JSON.stringify({ currentStreakDays: NaN, quests: [{ target: -10, current: 'bad' }] }),
      null,
      undefined,
      42,
    ];

    for (const input of corruptInputs) {
      assert.doesNotThrow(() => {
        const safeTracker = DailyQuestTracker.deserialize(input as string, '2026-10-09');
        assert.ok(safeTracker instanceof DailyQuestTracker);
        assert.equal(safeTracker.lastActiveDateKey, '2026-10-09');
        assert.ok(safeTracker.currentStreakDays >= 0);
        assert.equal(safeTracker.quests.length, 3);
      }, `Deserializing corrupted input must not throw exception: ${String(input)}`);
    }
  });
});

function trackerProgressHelper(tracker: DailyQuestTracker): void {
  const q0 = tracker.quests[0];
  tracker.recordProgress(q0.id, q0.target);
  tracker.claimQuest(q0.id);
}
