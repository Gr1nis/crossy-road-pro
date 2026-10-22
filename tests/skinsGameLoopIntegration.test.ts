import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { GameEngine } from '../src/core/gameEngine.ts';
import { GameLoop } from '../src/app/gameLoop.ts';
import { UIManager } from '../src/app/uiManager.ts';
import { SceneManager } from '../src/view/sceneManager.ts';
import { AudioSynth } from '../src/view/audioSynth.ts';
import { type SkinId } from '../src/core/types.ts';

interface MockElement {
  id: string; tagName: string; className: string; innerHTML: string; textContent: string;
  style: Record<string, string>; attributes: Record<string, string>; children: MockElement[];
  listeners: Record<string, Array<(e: unknown) => void>>;
  classList: {
    add: (...cls: string[]) => void; remove: (...cls: string[]) => void;
    contains: (cls: string) => boolean; toggle: (cls: string, force?: boolean) => boolean;
  };
  setAttribute: (k: string, v: string) => void; getAttribute: (k: string) => string | null;
  appendChild: (child: MockElement) => void;
  querySelector: (sel: string) => MockElement | null;
  addEventListener: (event: string, handler: (e: unknown) => void) => void;
  click: () => void; focus: () => void;
}

function createMockElement(id = '', tag = 'DIV'): MockElement {
  const classes = new Set<string>();
  const styles: Record<string, string> = {};
  const attrs: Record<string, string> = {};
  const listeners: Record<string, Array<(e: unknown) => void>> = {};
  const children: MockElement[] = [];

  const el: MockElement = {
    id, tagName: tag.toUpperCase(),
    get className() { return Array.from(classes).join(' '); },
    set className(val: string) { classes.clear(); val.split(/\s+/).filter(Boolean).forEach((c) => classes.add(c)); },
    innerHTML: '', textContent: '', style: styles, attributes: attrs, children, listeners,
    classList: {
      add: (...cls: string[]) => cls.forEach((c) => classes.add(c)),
      remove: (...cls: string[]) => cls.forEach((c) => classes.delete(c)),
      contains: (c: string) => classes.has(c),
      toggle: (c: string, force?: boolean) => {
        const add = force !== undefined ? force : !classes.has(c);
        if (add) classes.add(c); else classes.delete(c);
        return classes.has(c);
      },
    },
    setAttribute: (k: string, v: string) => { attrs[k] = v; },
    getAttribute: (k: string) => attrs[k] ?? null,
    appendChild: (child: MockElement) => { children.push(child); },
    querySelector: () => null,
    addEventListener: (event: string, handler: (e: unknown) => void) => {
      (listeners[event] = listeners[event] || []).push(handler);
    },
    click: () => { listeners['click']?.forEach((h) => h({ preventDefault: () => {}, stopPropagation: () => {} })); },
    focus: () => {},
  };
  (el.style as unknown as { setProperty: (k: string, v: string) => void }).setProperty = (k: string, v: string) => {
    styles[k] = v;
  };
  return el;
}

function setupMockDom() {
  const elements = new Map<string, MockElement>();
  const domIds = [
    'skins-modal', 'skins-modal-coins', 'skins-modal-close-btn', 'skins-modal-list',
    'menu-skins-btn', 'menu-coins', 'menu-high-score', 'game-container', 'hud',
    'gacha-modal', 'perf-report-modal'
  ];
  domIds.forEach((id) => elements.set(id, createMockElement(id)));
  elements.get('skins-modal')?.classList.add('hidden');
  const body = createMockElement('body', 'BODY');

  const origDoc = globalThis.document;
  const origWin = globalThis.window;
  (globalThis as unknown as { document: unknown }).document = {
    body,
    getElementById: (id: string) => elements.get(id) ?? null,
    createElement: (tag: string) => createMockElement('', tag),
    querySelector: () => null,
    querySelectorAll: () => [],
  };
  (globalThis as unknown as { window: unknown }).window = {
    addEventListener: () => {},
    removeEventListener: () => {},
  };

  return {
    elements,
    cleanup: () => {
      (globalThis as unknown as { document: unknown }).document = origDoc;
      (globalThis as unknown as { window: unknown }).window = origWin;
    },
  };
}

class MemStorage {
  private map = new Map<string, string>();
  getItem(k: string): string | null { return this.map.get(k) ?? null; }
  setItem(k: string, v: string): void { this.map.set(k, v); }
}

function createMocks() {
  const updatedSkins: SkinId[] = [];
  const voicedSkins: string[] = [];
  const sceneManager = Object.create(SceneManager.prototype) as SceneManager;
  Object.assign(sceneManager, {
    updatePlayerSkin: (id: SkinId) => { updatedSkins.push(id); },
    setMenuMode: () => {}, clearAll: () => {}, setRecordFlag: () => {},
    removeRecordFlag: () => {}, sync: () => {}, setShadowsEnabled: () => {},
    setRenderQuality: () => {}, setScreenShakeEnabled: () => {},
  });

  const audio = Object.create(AudioSynth.prototype) as AudioSynth;
  Object.assign(audio, {
    isSoundEnabled: () => false, isMusicEnabled: () => false,
    setSoundEnabled: () => {}, setMusicEnabled: () => {},
    setSfxVolume: () => {}, setMusicVolume: () => {},
    playSkinVoice: (id: string) => { voicedSkins.push(id); },
  });

  return { sceneManager, audio, updatedSkins, voicedSkins };
}

describe('Skins GameLoop Integration Tests', () => {
  it('Requirement: File length is strictly <= 300 lines', () => {
    const file = path.join(process.cwd(), 'tests/skinsGameLoopIntegration.test.ts');
    assert.ok(fs.existsSync(file), 'File must exist');
    const lines = fs.readFileSync(file, 'utf8').split('\n').length;
    assert.ok(lines <= 300, `File must be <= 300 lines, currently: ${lines}`);
  });

  it('renderSkinsUI callback selects skin, updates sceneManager.updatePlayerSkin, and plays audio voice', () => {
    const engine = new GameEngine(1234, new MemStorage());
    engine.unlockSkin('capybara_zen');
    const { sceneManager, audio, updatedSkins, voicedSkins } = createMocks();

    let renderedCallback!: (id: string) => void;
    let renderedUnlocked: string[] = [];
    let renderedActive = '';

    const mockUi = Object.create(UIManager.prototype) as UIManager;
    Object.assign(mockUi, {
      renderSkins: (unlocked: string[], active: string, onSelect: (id: string) => void) => {
        renderedUnlocked = [...unlocked];
        renderedActive = active;
        renderedCallback = onSelect;
      },
      setGachaRollButtonText: () => {}, updateMenuStats: () => {}, renderDailyBonus: () => {},
      updateDailyBadge: () => {}, renderDailyQuests: () => {}, renderAchievements: () => {},
      renderLeaderboard: () => {}, setSoundToggle: () => {}, setMusicToggle: () => {},
      setPlayerName: () => {}, initSettingsModal: () => {}, applyLanguage: () => {},
    });

    const loop = new GameLoop(engine, sceneManager, audio, mockUi);
    loop.renderSkinsUI();

    assert.ok(renderedUnlocked.includes('capybara_zen'));
    assert.equal(renderedActive, 'corgi');
    assert.ok(typeof renderedCallback === 'function');

    renderedCallback('capybara_zen');

    assert.equal(engine.getSelectedSkin(), 'capybara_zen');
    assert.deepEqual(updatedSkins, ['capybara_zen']);
    assert.deepEqual(voicedSkins, ['capybara_zen']);
    assert.equal(renderedActive, 'capybara_zen');
  });

  it('openSkins correctly passes coins, unlocked skins, and selected skin to SkinsCollectionModal', () => {
    const { elements, cleanup } = setupMockDom();
    try {
      const engine = new GameEngine(5678, new MemStorage());
      engine.getScoreTracker().addCoins(250);
      engine.unlockSkin('box_cat');
      const { sceneManager, audio } = createMocks();

      const ui = new UIManager();
      const loop = new GameLoop(engine, sceneManager, audio, ui);
      ui.bindActions(loop.getUIActions());

      const skinsModal = elements.get('skins-modal')!;
      assert.ok(skinsModal.classList.contains('hidden'));

      loop.handleOpenSkins();

      assert.equal(skinsModal.classList.contains('hidden'), false);
      assert.equal(ui.isSkinsOpen(), true);

      const coinsEl = elements.get('skins-modal-coins')!;
      assert.equal(coinsEl.textContent, '250');

      const listEl = elements.get('skins-modal-list')!;
      assert.equal(listEl.children.length, 5);

      const corgiCard = listEl.children.find((c) => c.getAttribute('data-skin-id') === 'corgi');
      assert.ok(corgiCard?.className.includes('active'));

      const boxCatCard = listEl.children.find((c) => c.getAttribute('data-skin-id') === 'box_cat');
      assert.equal(boxCatCard?.className.includes('locked'), false);

      const capyCard = listEl.children.find((c) => c.getAttribute('data-skin-id') === 'capybara_zen');
      assert.ok(capyCard?.className.includes('locked'));
    } finally {
      cleanup();
    }
  });

  it('#menu-skins-btn click handler invokes openSkins with current engine coins and skins', () => {
    const { elements, cleanup } = setupMockDom();
    try {
      const engine = new GameEngine(9999, new MemStorage());
      engine.getScoreTracker().addCoins(400);
      engine.unlockSkin('raccoon_bandit');
      const { sceneManager, audio } = createMocks();

      const ui = new UIManager();
      const loop = new GameLoop(engine, sceneManager, audio, ui);
      ui.bindActions(loop.getUIActions());

      const skinsBtn = elements.get('menu-skins-btn')!;
      assert.ok(skinsBtn.listeners['click']?.length);

      skinsBtn.click();

      const skinsModal = elements.get('skins-modal')!;
      assert.equal(skinsModal.classList.contains('hidden'), false);
      const coinsEl = elements.get('skins-modal-coins')!;
      assert.equal(coinsEl.textContent, '400');

      const controller = ui.getSkinsController();
      assert.ok(controller?.isOpen());
    } finally {
      cleanup();
    }
  });

  it('Selecting an unlocked card in SkinsCollectionModal invokes sceneManager.updatePlayerSkin', () => {
    const { elements, cleanup } = setupMockDom();
    try {
      const engine = new GameEngine(7777, new MemStorage());
      engine.unlockSkin('pigeon_pizza');
      const { sceneManager, audio, updatedSkins, voicedSkins } = createMocks();

      const ui = new UIManager();
      const loop = new GameLoop(engine, sceneManager, audio, ui);
      ui.bindActions(loop.getUIActions());
      loop.renderSkinsUI();

      loop.handleOpenSkins();

      const listEl = elements.get('skins-modal-list')!;
      const pigeonCard = listEl.children.find((c) => c.getAttribute('data-skin-id') === 'pigeon_pizza');
      assert.ok(pigeonCard);

      pigeonCard.click();

      assert.equal(engine.getSelectedSkin(), 'pigeon_pizza');
      assert.deepEqual(updatedSkins, ['pigeon_pizza']);
      assert.deepEqual(voicedSkins, ['pigeon_pizza']);
    } finally {
      cleanup();
    }
  });

  it('UIActions onOpenSkins delegate triggers modal open with latest engine data', () => {
    const { elements, cleanup } = setupMockDom();
    try {
      const engine = new GameEngine(3333, new MemStorage());
      engine.getScoreTracker().addCoins(175);
      const { sceneManager, audio } = createMocks();

      const ui = new UIManager();
      const loop = new GameLoop(engine, sceneManager, audio, ui);
      const actions = loop.getUIActions();

      assert.ok(typeof actions.onOpenSkins === 'function');
      actions.onOpenSkins?.();

      const skinsModal = elements.get('skins-modal')!;
      assert.equal(skinsModal.classList.contains('hidden'), false);
      const coinsEl = elements.get('skins-modal-coins')!;
      assert.equal(coinsEl.textContent, '175');
    } finally {
      cleanup();
    }
  });
});
