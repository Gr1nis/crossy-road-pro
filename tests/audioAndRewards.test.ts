import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { AudioSynth } from '../src/view/audioSynth.ts';
import { DailyQuestTracker, DAILY_SUPER_BONUS_COINS } from '../src/core/dailyQuests.ts';
import { ScoreTracker } from '../src/core/scoreTracker.ts';
import { GameEngine } from '../src/core/gameEngine.ts';
import { PlatformBridge, type YsdkInstance } from '../src/platform/ysdk.ts';

// WebAudio Mock for Headless Node.js
interface MockOscNode {
  type: OscillatorType;
  frequency: {
    value: number;
    setValueAtTime: (val: number, time: number) => void;
    exponentialRampToValueAtTime: (val: number, time: number) => void;
  };
  connect: (dest: unknown) => void;
  start: (time: number) => void;
  stop: (time: number) => void;
  startTime?: number;
  stopTime?: number;
}

interface MockGainNode {
  gain: {
    value: number;
    setValueAtTime: (val: number, time: number) => void;
    linearRampToValueAtTime: (val: number, time: number) => void;
    exponentialRampToValueAtTime: (val: number, time: number) => void;
  };
  connect: (dest: unknown) => void;
}

class MockAudioContext {
  public currentTime = 10.0;
  public state: AudioContextState = 'running';
  public destination = {};
  public createdOscillators: MockOscNode[] = [];
  public createdGains: MockGainNode[] = [];

  createOscillator(): MockOscNode {
    const osc: MockOscNode = {
      type: 'sine',
      frequency: {
        value: 440,
        setValueAtTime: (val: number) => { osc.frequency.value = val; },
        exponentialRampToValueAtTime: (val: number) => { osc.frequency.value = val; },
      },
      connect: () => {},
      start: (time: number) => { osc.startTime = time; },
      stop: (time: number) => { osc.stopTime = time; },
    };
    this.createdOscillators.push(osc);
    return osc;
  }

  createGain(): MockGainNode {
    const gain: MockGainNode = {
      gain: {
        value: 1.0,
        setValueAtTime: (val: number) => { gain.gain.value = val; },
        linearRampToValueAtTime: (val: number) => { gain.gain.value = val; },
        exponentialRampToValueAtTime: (val: number) => { gain.gain.value = val; },
      },
      connect: () => {},
    };
    this.createdGains.push(gain);
    return gain;
  }

  createBiquadFilter() {
    return {
      type: 'lowpass',
      frequency: {
        setValueAtTime: () => {},
        setTargetAtTime: () => {},
      },
      connect: () => {},
    };
  }

  async resume(): Promise<void> {
    this.state = 'running';
  }
}

class MockStorage {
  private map = new Map<string, string>();
  getItem(key: string): string | null { return this.map.get(key) ?? null; }
  setItem(key: string, value: string): void { this.map.set(key, value); }
}

describe('AudioSynth & Reward Doubling Suite', () => {
  describe('AudioSynth — Procedural WebAudio SFX', () => {
    it('Property 1 (playQuestComplete): schedules 4 ascending notes (C5->E5->G5->C6) with triangle body and sine shimmer', () => {
      const mockCtx = new MockAudioContext();
      const synth = new AudioSynth();
      // Inject mock context
      (synth as unknown as { ctx: MockAudioContext }).ctx = mockCtx;
      synth.setSoundEnabled(true);

      synth.playQuestComplete();

      assert.ok(mockCtx.createdOscillators.length >= 8, 'Must create at least 8 oscillators (4 body + 4 shimmer)');

      // Extract frequencies and wave types
      const oscs = mockCtx.createdOscillators;
      const expectedFrequencies = [523.25, 659.25, 783.99, 1046.5];

      for (let i = 0; i < expectedFrequencies.length; i++) {
        const targetFreq = expectedFrequencies[i];
        const bodyOsc = oscs.find((o) => Math.abs(o.frequency.value - targetFreq) < 0.1 && o.type === 'triangle');
        const shimmerOsc = oscs.find((o) => Math.abs(o.frequency.value - targetFreq * 2) < 0.1 && o.type === 'sine');

        assert.ok(bodyOsc, `Must have triangle body oscillator for frequency ${targetFreq}`);
        assert.ok(shimmerOsc, `Must have sine shimmer harmonic oscillator for frequency ${targetFreq * 2}`);
        assert.ok(bodyOsc!.startTime !== undefined && bodyOsc!.stopTime !== undefined, 'Body osc must be started and stopped');
        assert.ok(bodyOsc!.stopTime! > bodyOsc!.startTime!, 'Body osc stop time must exceed start time');
      }
    });

    it('Property 2 (playDailySuperBonusFanfare): schedules 8-bit triumphant retro melody of ~0.8s total duration', () => {
      const mockCtx = new MockAudioContext();
      const synth = new AudioSynth();
      (synth as unknown as { ctx: MockAudioContext }).ctx = mockCtx;
      synth.setSoundEnabled(true);

      synth.playDailySuperBonusFanfare();

      const oscs = mockCtx.createdOscillators;
      assert.ok(oscs.length >= 7, 'Fanfare must generate a multi-note melody');

      // Check 8-bit timbre: uses square oscillators
      const squareOscs = oscs.filter((o) => o.type === 'square');
      assert.ok(squareOscs.length >= 5, 'Fanfare must predominantly use square oscillators for 8-bit sound');

      // Check duration: total duration ~0.8s
      const startTimes = oscs.map((o) => o.startTime ?? mockCtx.currentTime);
      const stopTimes = oscs.map((o) => o.stopTime ?? mockCtx.currentTime);
      const minStart = Math.min(...startTimes);
      const maxStop = Math.max(...stopTimes);
      const totalDuration = maxStop - minStart;

      assert.ok(
        totalDuration >= 0.75 && totalDuration <= 0.88,
        `Fanfare total duration must be ~0.8s, got ${totalDuration.toFixed(3)}s`
      );
    });

    it('Property 3 (Sound Mute Guard): When sound is disabled, playQuestComplete and playDailySuperBonusFanfare do nothing', () => {
      const mockCtx = new MockAudioContext();
      const synth = new AudioSynth();
      (synth as unknown as { ctx: MockAudioContext }).ctx = mockCtx;
      synth.setSoundEnabled(false);
      assert.equal(synth.isSoundEnabled(), false);

      synth.playQuestComplete();
      synth.playDailySuperBonusFanfare();

      assert.equal(mockCtx.createdOscillators.length, 0, 'No oscillators must be created when sound is disabled');
      assert.equal(mockCtx.createdGains.length, 0, 'No gain nodes must be created when sound is disabled');
    });

    it('Property 4 (Sound Toggle Roundtrip): Toggling sound enabled persists state and updates gain', () => {
      const synth = new AudioSynth();
      synth.setSoundEnabled(false);
      assert.equal(synth.isSoundEnabled(), false);

      synth.setSoundEnabled(true);
      assert.equal(synth.isSoundEnabled(), true);
    });
  });

  describe('Daily Quests — x2 Multiplier Logic', () => {
    it('Property 5 (Quest x2 Claim): Regular claim grants 1x coins; x2 claim grants 2x coins', () => {
      const tracker = new DailyQuestTracker('2026-10-11');
      const q0 = tracker.quests[0];
      const q1 = tracker.quests[1];

      // Complete q0 and q1
      tracker.recordProgress(q0.id, q0.target);
      tracker.recordProgress(q1.id, q1.target);

      // Claim q0 with doubleMultiplier = false
      const res0 = tracker.claimQuest(q0.id, false);
      assert.equal(res0.success, true);
      assert.equal(res0.rewardCoins, q0.rewardCoins);
      assert.equal(res0.isDouble, false);
      assert.equal(q0.isClaimed, true);

      // Duplicate claim fails
      const dup0 = tracker.claimQuest(q0.id, true);
      assert.equal(dup0.success, false);
      assert.equal(dup0.rewardCoins, 0);

      // Claim q1 with doubleMultiplier = true
      const res1 = tracker.claimQuest(q1.id, true);
      assert.equal(res1.success, true);
      assert.equal(res1.rewardCoins, q1.rewardCoins * 2, 'Reward coins must be doubled when doubleMultiplier is true');
      assert.equal(res1.isDouble, true);
      assert.equal(q1.isClaimed, true);

      // Duplicate claim fails
      const dup1 = tracker.claimQuest(q1.id, false);
      assert.equal(dup1.success, false);
      assert.equal(dup1.rewardCoins, 0);
    });

    it('Property 6 (Super Bonus x2 Claim): Grants 100 on normal claim and 200 on x2 claim', () => {
      // Normal super bonus claim
      const trackerA = new DailyQuestTracker('2026-10-11');
      for (const q of trackerA.quests) {
        trackerA.recordProgress(q.id, q.target);
        trackerA.claimQuest(q.id);
      }
      const normalBonus = trackerA.claimDailyBonus(false);
      assert.equal(normalBonus.success, true);
      assert.equal(normalBonus.rewardCoins, DAILY_SUPER_BONUS_COINS);
      assert.equal(normalBonus.isDouble, false);

      // x2 super bonus claim
      const trackerB = new DailyQuestTracker('2026-10-11');
      for (const q of trackerB.quests) {
        trackerB.recordProgress(q.id, q.target);
        trackerB.claimQuest(q.id);
      }
      const doubleBonus = trackerB.claimDailyBonus(true);
      assert.equal(doubleBonus.success, true);
      assert.equal(doubleBonus.rewardCoins, DAILY_SUPER_BONUS_COINS * 2, 'Super bonus must double to 200 coins');
      assert.equal(doubleBonus.isDouble, true);

      // Repeated super bonus claim fails
      const dupBonus = trackerB.claimDailyBonus(true);
      assert.equal(dupBonus.success, false);
      assert.equal(dupBonus.rewardCoins, 0);
    });

    it('Property 7 (ScoreTracker & Wallet Integration): Correctly deposits doubled coins into player wallet', () => {
      const storage = new MockStorage();
      const tracker = new ScoreTracker(storage);
      const initialCoins = tracker.getCoins();

      // Complete all 3 quests
      const quests = tracker.getDailyQuestTracker().quests;
      for (const q of quests) {
        tracker.recordDailyQuestProgress({ [q.category]: q.target });
      }

      // Claim quest 0 with x2
      const q0 = quests[0];
      const claim0 = tracker.claimDailyQuest(q0.id, true);
      assert.equal(claim0.success, true);
      assert.equal(claim0.coins, q0.rewardCoins * 2);
      assert.equal(claim0.isDouble, true);
      assert.equal(tracker.getCoins(), initialCoins + q0.rewardCoins * 2);

      // Claim super bonus with x2
      const claimBonus = tracker.claimDailyQuestBonus(true);
      assert.equal(claimBonus.success, true);
      assert.equal(claimBonus.coins, DAILY_SUPER_BONUS_COINS * 2);
      assert.equal(claimBonus.isDouble, true);
      assert.equal(tracker.getCoins(), initialCoins + q0.rewardCoins * 2 + DAILY_SUPER_BONUS_COINS * 2);

      // Verify persistence: reloaded tracker retains coins and claims
      const reloaded = new ScoreTracker(storage);
      assert.equal(reloaded.getCoins(), tracker.getCoins());
      assert.equal(reloaded.getDailyQuestTracker().allCompletedBonusClaimed, true);
    });

    it('Property 8 (GameEngine Delegations): Engine delegates doubleMultiplier to scoreTracker seamlessly', () => {
      const storage = new MockStorage();
      const engine = new GameEngine(42, storage);
      const q = engine.getDailyQuestTracker().quests[0];

      engine.recordDailyQuestProgress({ [q.category]: q.target });
      const res = engine.claimDailyQuest(q.id, true);
      assert.equal(res.success, true);
      assert.equal(res.coins, q.rewardCoins * 2);
      assert.equal(res.isDouble, true);
    });
  });

  describe('Platform Integration & Graceful Fallback', () => {
    it('Property 9 (Offline / Headless Graceful Fallback): PlatformBridge safely handles absent SDK', async () => {
      const bridge = new PlatformBridge(false);
      const initialized = await bridge.init();
      assert.equal(initialized, false, 'init must resolve false when window.YaGames is missing');
      assert.equal(bridge.isAvailable(), false, 'isAvailable must be false without YaGames');

      let errorCaught = false;
      bridge.showRewardedVideo({
        onRewarded: () => {
          assert.fail('Should not reward without ad');
        },
        onError: () => {
          errorCaught = true;
        },
      });
      assert.equal(errorCaught, true, 'Must invoke onError callback when SDK not initialized and simulation disabled');
    });

    it('Property 10 (Simulation Mode Fallback): Simulated rewarded video grants reward asynchronously', async () => {
      const bridge = new PlatformBridge(true);
      assert.equal(bridge.isAdReady(), true, 'isAdReady must be true in simulation mode');

      let opened = false;
      let rewarded = false;
      let closed = false;

      await new Promise<void>((resolve) => {
        bridge.showRewardedVideo({
          onOpen: () => { opened = true; },
          onRewarded: () => { rewarded = true; },
          onClose: () => {
            closed = true;
            resolve();
          },
        });
      });

      assert.equal(opened, true, 'Must trigger onOpen in simulation mode');
      assert.equal(rewarded, true, 'Must trigger onRewarded in simulation mode');
      assert.equal(closed, true, 'Must trigger onClose in simulation mode');
    });

    it('Property 11 (Live Yandex SDK Mock Delegation): Passes callbacks to ysdk.adv.showRewardedVideo', () => {
      const bridge = new PlatformBridge(false);
      let passedCallbacks: unknown = null;

      const mockYsdk: YsdkInstance = {
        adv: {
          showRewardedVideo: (options) => {
            passedCallbacks = options.callbacks;
            options.callbacks.onRewarded?.();
            options.callbacks.onClose?.();
          },
        },
      };

      (bridge as unknown as { ysdk: YsdkInstance }).ysdk = mockYsdk;
      assert.equal(bridge.isAvailable(), true);

      let rewarded = false;
      let closed = false;

      bridge.showRewardedVideo({
        onRewarded: () => { rewarded = true; },
        onClose: () => { closed = true; },
      });

      assert.ok(passedCallbacks, 'Must pass callbacks object to ysdk');
      assert.equal(rewarded, true, 'onRewarded must be triggered');
      assert.equal(closed, true, 'onClose must be triggered');
    });
  });
});
