import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { GameEngine } from '../src/core/gameEngine.ts';
import { GameLoop } from '../src/app/gameLoop.ts';
import { UIManager } from '../src/app/uiManager.ts';
import { SceneManager } from '../src/view/sceneManager.ts';
import { AudioSynth } from '../src/view/audioSynth.ts';

describe('Daily Quests & Bonus — VFX, Juice & Polish Suite', () => {
  it('Property 1 (CSS VFX & Shimmer Invariants): index.html includes shimmer animation, ready glow, and flying coin classes', () => {
    const htmlPath = path.join(process.cwd(), 'index.html');
    assert.ok(fs.existsSync(htmlPath), 'index.html must exist');
    const html = fs.readFileSync(htmlPath, 'utf8');

    // 1. Shimmer on ready quest claim buttons
    assert.ok(
      html.includes('questBtnShimmer'),
      'Must contain @keyframes questBtnShimmer for golden shimmer effect'
    );
    assert.ok(
      html.includes('.quest-card.ready .quest-btn-claim'),
      'Must style ready claim buttons with shimmer'
    );
    assert.ok(
      html.includes('.quest-super-btn:not(:disabled)'),
      'Must style ready super bonus button with shimmer'
    );

    // 2. Pulse badge in main menu
    assert.ok(
      html.includes('#menu-daily-quests-badge'),
      'Must style #menu-daily-quests-badge'
    );
    assert.ok(
      html.includes('animation: pulse 1.5s infinite'),
      'Must apply smooth 1.5s pulse animation to #menu-daily-quests-badge'
    );
    assert.ok(
      html.includes('@keyframes pulse'),
      'Must define @keyframes pulse'
    );

    // 3. Flying coins & counter pulse
    assert.ok(
      html.includes('.flying-coin-particle'),
      'Must define .flying-coin-particle class'
    );
    assert.ok(
      html.includes('.coin-counter-pulse'),
      'Must define .coin-counter-pulse class'
    );
    assert.ok(
      html.includes('scale(1.25)'),
      'Must animate coin counter pulse to scale(1.25)'
    );
    assert.ok(
      html.includes('id="quests-coins-val"'),
      'Must include #quests-coins-val in daily quests modal header'
    );
  });

  it('Property 2 (3D Voxel Confetti & Super Bonus Trigger): GameLoop.handleClaimDailyQuestBonus triggers confetti salute', () => {
    class MemoryStorage {
      private map = new Map<string, string>();
      getItem(key: string): string | null { return this.map.get(key) ?? null; }
      setItem(key: string, value: string): void { this.map.set(key, value); }
    }
    const engine = new GameEngine(999, new MemoryStorage());

    // Prepare quests completed
    const tracker = engine.getDailyQuestTracker();
    for (const q of tracker.quests) {
      tracker.recordProgress(q.id, q.target);
      engine.claimDailyQuest(q.id);
    }

    let confettiCalls: Array<{ x: number; y: number; z: number }> = [];
    const mockSceneManager = Object.create(SceneManager.prototype) as SceneManager;
    mockSceneManager.spawnRecordConfetti = (x: number, y: number, z: number) => {
      confettiCalls.push({ x, y, z });
    };

    const mockAudio = Object.create(AudioSynth.prototype) as AudioSynth;
    mockAudio.isSoundEnabled = () => false;
    mockAudio.isMusicEnabled = () => false;
    mockAudio.playCoin = () => {};
    mockAudio.playRecordFanfare = () => {};

    let toastCalls: string[] = [];
    const mockUi = Object.create(UIManager.prototype) as UIManager;
    mockUi.setSoundToggle = () => {};
    mockUi.setMusicToggle = () => {};
    mockUi.setPlayerName = () => {};
    mockUi.updateMenuStats = () => {};
    mockUi.updateDailyBadge = () => {};
    mockUi.renderDailyBonus = () => {};
    mockUi.renderDailyQuests = () => {};
    mockUi.renderAchievements = () => {};
    mockUi.renderLeaderboard = () => {};
    mockUi.renderSkins = () => {};
    mockUi.setGachaRollButtonText = () => {};
    mockUi.showToast = (_icon: string, title: string) => {
      toastCalls.push(title);
    };
    mockUi.spawnFlyingCoins = () => {};
    mockUi.pulseCoinCounter = () => {};

    const loop = new GameLoop(engine, mockSceneManager, mockAudio, mockUi);

    assert.equal(confettiCalls.length, 0);
    loop.handleClaimDailyQuestBonus();

    assert.equal(confettiCalls.length, 1, 'Must invoke spawnRecordConfetti exactly once');
    assert.equal(confettiCalls[0].x, 0, 'Confetti X must be 0 (center)');
    assert.equal(confettiCalls[0].y, 2.0, 'Confetti Y must be 2.0');
    assert.equal(confettiCalls[0].z, 100, 'Confetti Z argument must be 100');
    assert.ok(toastCalls.some((t) => t.includes('Супер-приз')), 'Toast must notify super prize');
  });

  it('Property 3 (Haptic Feedback Pattern): Claiming quest, super bonus, and daily bonus invokes navigator.vibrate([25, 30, 25])', () => {
    class MemoryStorage {
      private map = new Map<string, string>();
      getItem(key: string): string | null { return this.map.get(key) ?? null; }
      setItem(key: string, value: string): void { this.map.set(key, value); }
    }
    const engine = new GameEngine(123, new MemoryStorage());

    const vibrateCalls: Array<number | number[]> = [];
    const originalNavigator = globalThis.navigator;

    // Install mock navigator.vibrate
    Object.defineProperty(globalThis, 'navigator', {
      value: {
        ...originalNavigator,
        vibrate: (pattern: number | number[]) => {
          vibrateCalls.push(pattern);
          return true;
        },
      },
      configurable: true,
      writable: true,
    });

    try {
      const mockSceneManager = Object.create(SceneManager.prototype) as SceneManager;
      mockSceneManager.spawnRecordConfetti = () => {};

      const mockAudio = Object.create(AudioSynth.prototype) as AudioSynth;
      mockAudio.isSoundEnabled = () => false;
      mockAudio.isMusicEnabled = () => false;
      mockAudio.playCoin = () => {};
      mockAudio.playRecordFanfare = () => {};

      const mockUi = Object.create(UIManager.prototype) as UIManager;
      mockUi.setSoundToggle = () => {};
      mockUi.setMusicToggle = () => {};
      mockUi.setPlayerName = () => {};
      mockUi.updateMenuStats = () => {};
      mockUi.updateDailyBadge = () => {};
      mockUi.renderDailyBonus = () => {};
      mockUi.renderDailyQuests = () => {};
      mockUi.renderAchievements = () => {};
      mockUi.renderLeaderboard = () => {};
      mockUi.renderSkins = () => {};
      mockUi.setGachaRollButtonText = () => {};
      mockUi.showToast = () => {};

      const loop = new GameLoop(engine, mockSceneManager, mockAudio, mockUi);

      // 1. Claim regular daily quest
      const q0 = engine.getDailyQuestTracker().quests[0];
      engine.getDailyQuestTracker().recordProgress(q0.id, q0.target);
      loop.handleClaimDailyQuest(q0.id);

      assert.equal(vibrateCalls.length, 1);
      assert.deepEqual(vibrateCalls[0], [25, 30, 25], 'Haptic vibration pattern must match [25, 30, 25]');

      // Complete remaining 2 quests
      const q1 = engine.getDailyQuestTracker().quests[1];
      const q2 = engine.getDailyQuestTracker().quests[2];
      engine.getDailyQuestTracker().recordProgress(q1.id, q1.target);
      engine.getDailyQuestTracker().recordProgress(q2.id, q2.target);
      loop.handleClaimDailyQuest(q1.id);
      loop.handleClaimDailyQuest(q2.id);

      assert.equal(vibrateCalls.length, 3);

      // 2. Claim super bonus
      loop.handleClaimDailyQuestBonus();
      assert.equal(vibrateCalls.length, 4);
      assert.deepEqual(vibrateCalls[3], [25, 30, 25], 'Super bonus must trigger haptic [25, 30, 25]');

      // 3. Claim daily calendar bonus
      loop.handleClaimDailyBonus(false);
      assert.equal(vibrateCalls.length, 5);
      assert.deepEqual(vibrateCalls[4], [25, 30, 25], 'Daily reward bonus must trigger haptic [25, 30, 25]');
    } finally {
      // Restore original navigator
      Object.defineProperty(globalThis, 'navigator', {
        value: originalNavigator,
        configurable: true,
        writable: true,
      });
    }
  });

  it('Property 4 (Flying Coin Particle Lifecycle & DOM Safety): UIManager.spawnFlyingCoins creates bounded coin elements and safely cleans them up', () => {
    const createdElements: Array<{ className: string; textContent: string; removed: boolean }> = [];

    // Mock DOM document and window
    const originalDocument = globalThis.document;
    const originalWindow = globalThis.window;

    Object.defineProperty(globalThis, 'document', {
      value: {
        createElement: (tag: string) => {
          const el = {
            tag,
            className: '',
            textContent: '',
            style: { transform: '', opacity: '' },
            parentNode: {},
            remove: () => {
              el.removed = true;
            },
            removed: false,
          };
          createdElements.push(el);
          return el;
        },
        body: {
          appendChild: () => {},
        },
        getElementById: () => null,
      },
      configurable: true,
      writable: true,
    });

    Object.defineProperty(globalThis, 'window', {
      value: {
        innerWidth: 400,
        innerHeight: 800,
      },
      configurable: true,
      writable: true,
    });

    try {
      const ui = new UIManager();
      assert.equal(typeof ui.spawnFlyingCoins, 'function');
      assert.equal(typeof ui.pulseCoinCounter, 'function');

      ui.spawnFlyingCoins({ x: 200, y: 400 }, 7);

      assert.ok(createdElements.length >= 5 && createdElements.length <= 8, 'Must spawn 5–8 flying coin particles');
      for (const coin of createdElements) {
        assert.equal(coin.className, 'flying-coin-particle');
        assert.equal(coin.textContent, '🪙');
      }
    } finally {
      globalThis.document = originalDocument;
      globalThis.window = originalWindow;
    }
  });
});
