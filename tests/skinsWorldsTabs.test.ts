import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { ALL_WORLDS, WorldsViewManager } from '../src/app/worldsCollectionModal.ts';
import { SkinsCollectionModal } from '../src/app/skinsCollectionModal.ts';
import { GameEngine } from '../src/core/gameEngine.ts';
import { GameLoop } from '../src/app/gameLoop.ts';
import { UIManager } from '../src/app/uiManager.ts';
import type { SceneManager } from '../src/view/sceneManager.ts';
import type { AudioSynth } from '../src/view/audioSynth.ts';
import { SKINS_MENU_ICONS } from '../src/view/skinsIconsBase64.ts';

interface MockDomElement {
  id: string;
  tagName: string;
  className: string;
  innerHTML: string;
  textContent: string;
  style: Record<string, string>;
  attributes: Record<string, string>;
  children: MockDomElement[];
  listeners: Record<string, Array<(e: unknown) => void>>;
  classList: {
    add: (...cls: string[]) => void;
    remove: (...cls: string[]) => void;
    contains: (cls: string) => boolean;
    toggle: (cls: string, force?: boolean) => boolean;
  };
  setAttribute: (k: string, v: string) => void;
  getAttribute: (k: string) => string | null;
  styleSetProperty: (k: string, v: string) => void;
  appendChild: (child: MockDomElement) => void;
  addEventListener: (event: string, handler: (e: unknown) => void) => void;
  removeEventListener: (event: string, handler: (e: unknown) => void) => void;
  click: () => void;
  focus: () => void;
  scrollIntoView: () => void;
}

function createMockElement(id = '', tag = 'DIV'): MockDomElement {
  const classes = new Set<string>();
  const styles: Record<string, string> = {};
  const attrs: Record<string, string> = {};
  const listeners: Record<string, Array<(e: unknown) => void>> = {};
  const children: MockDomElement[] = [];
  let innerHtmlVal = '';

  const el: MockDomElement = {
    id,
    tagName: tag.toUpperCase(),
    get className() {
      return Array.from(classes).join(' ');
    },
    set className(val: string) {
      classes.clear();
      val.split(/\s+/).filter(Boolean).forEach((c) => classes.add(c));
    },
    get innerHTML() {
      return innerHtmlVal;
    },
    set innerHTML(val: string) {
      innerHtmlVal = val;
      if (val === '') {
        children.length = 0;
      }
    },
    textContent: '',
    style: styles,
    attributes: attrs,
    children,
    listeners,
    classList: {
      add: (...cls: string[]) => cls.forEach((c) => classes.add(c)),
      remove: (...cls: string[]) => cls.forEach((c) => classes.delete(c)),
      contains: (c: string) => classes.has(c),
      toggle: (c: string, force?: boolean) => {
        const has = classes.has(c);
        const shouldAdd = force !== undefined ? force : !has;
        if (shouldAdd) classes.add(c);
        else classes.delete(c);
        return classes.has(c);
      },
    },
    setAttribute: (k: string, v: string) => {
      attrs[k] = v;
    },
    getAttribute: (k: string) => attrs[k] ?? null,
    styleSetProperty: (k: string, v: string) => {
      styles[k] = v;
    },
    appendChild: (child: MockDomElement) => {
      children.push(child);
    },
    addEventListener: (event: string, handler: (e: unknown) => void) => {
      if (!listeners[event]) listeners[event] = [];
      listeners[event].push(handler);
    },
    removeEventListener: (event: string, handler: (e: unknown) => void) => {
      if (!listeners[event]) return;
      listeners[event] = listeners[event].filter((h) => h !== handler);
    },
    click: () => {
      listeners['click']?.forEach((h) => h({ preventDefault: () => {} }));
    },
    focus: () => {},
    scrollIntoView: () => {},
  };

  (el.style as unknown as { setProperty: (k: string, v: string) => void }).setProperty = (k: string, v: string) => {
    styles[k] = v;
  };

  return el;
}

function setupFullMockDom() {
  const elements = new Map<string, MockDomElement>();

  const modal = createMockElement('skins-modal');
  modal.classList.add('modal', 'hidden');
  elements.set('skins-modal', modal);

  const coins = createMockElement('skins-modal-coins', 'SPAN');
  coins.textContent = '0';
  elements.set('skins-modal-coins', coins);

  const closeBtn = createMockElement('skins-modal-close-btn', 'BUTTON');
  elements.set('skins-modal-close-btn', closeBtn);

  const list = createMockElement('skins-modal-list');
  elements.set('skins-modal-list', list);

  const tabBtnCharacters = createMockElement('skins-tab-btn-characters', 'BUTTON');
  tabBtnCharacters.classList.add('skins-tab-btn', 'active');
  elements.set('skins-tab-btn-characters', tabBtnCharacters);

  const tabBtnWorlds = createMockElement('skins-tab-btn-worlds', 'BUTTON');
  tabBtnWorlds.classList.add('skins-tab-btn');
  elements.set('skins-tab-btn-worlds', tabBtnWorlds);

  const tabContentCharacters = createMockElement('skins-tab-characters-content');
  tabContentCharacters.classList.add('skins-tab-content', 'active');
  elements.set('skins-tab-characters-content', tabContentCharacters);

  const tabContentWorlds = createMockElement('skins-tab-worlds-content');
  tabContentWorlds.classList.add('skins-tab-content', 'hidden');
  elements.set('skins-tab-worlds-content', tabContentWorlds);

  const worldsList = createMockElement('skins-worlds-list');
  worldsList.classList.add('skins-cards-grid');
  elements.set('skins-worlds-list', worldsList);

  const windowListeners: Record<string, Array<(e: unknown) => void>> = {};
  const originalDoc = globalThis.document;
  const originalWin = globalThis.window;

  (globalThis as unknown as { document: unknown }).document = {
    getElementById: (id: string) => elements.get(id) ?? null,
    createElement: (tag: string) => createMockElement('', tag),
  };

  (globalThis as unknown as { window: unknown }).window = {
    addEventListener: (event: string, handler: (e: unknown) => void) => {
      if (!windowListeners[event]) windowListeners[event] = [];
      windowListeners[event].push(handler);
    },
    removeEventListener: (event: string, handler: (e: unknown) => void) => {
      if (!windowListeners[event]) return;
      windowListeners[event] = windowListeners[event].filter((h) => h !== handler);
    },
  };

  return {
    elements,
    cleanup: () => {
      (globalThis as unknown as { document: unknown }).document = originalDoc;
      (globalThis as unknown as { window: unknown }).window = originalWin;
    },
  };
}

describe('Skins & Worlds Tabs Suite (Micro-task 3)', () => {
  it('Requirement 1: File length constraints: worldsCollectionModal <= 200, skinsCollectionModal <= 300', () => {
    const worldsPath = path.join(process.cwd(), 'src/app/worldsCollectionModal.ts');
    assert.ok(fs.existsSync(worldsPath), 'src/app/worldsCollectionModal.ts must exist');
    const worldsLines = fs.readFileSync(worldsPath, 'utf8').split('\n').length;
    assert.ok(worldsLines <= 200, `worldsCollectionModal.ts must be <= 200 lines, got: ${worldsLines}`);

    const skinsPath = path.join(process.cwd(), 'src/app/skinsCollectionModal.ts');
    assert.ok(fs.existsSync(skinsPath), 'src/app/skinsCollectionModal.ts must exist');
    const skinsLines = fs.readFileSync(skinsPath, 'utf8').split('\n').length;
    assert.ok(skinsLines <= 300, `skinsCollectionModal.ts must be <= 300 lines, got: ${skinsLines}`);
  });

  it('Requirement 2: ALL_WORLDS defines all 5 worlds with correct metadata', () => {
    assert.strictEqual(ALL_WORLDS.length, 5, 'Must contain exactly 5 worlds');
    const expected = [
      { id: 'auto', name: 'Динамический цикл', icon: '🔄', desc: 'Смена каждые 25 очков' },
      { id: 'forest', name: 'Лесной мегаполис', icon: '🌲', desc: 'Классический парк и город' },
      { id: 'winter', name: 'Снежный город', icon: '❄️', desc: 'Зимний мегаполис и сугробы' },
      { id: 'desert', name: 'Пустынный каньон', icon: '🏜️', desc: 'Золотые пески и скалы' },
      { id: 'neon', name: 'Киберпанк неон', icon: '🌆', desc: 'Ночные неоновые трассы' },
    ];

    expected.forEach((exp, idx) => {
      const actual = ALL_WORLDS[idx];
      assert.strictEqual(actual.id, exp.id);
      assert.strictEqual(actual.name, exp.name);
      assert.strictEqual(actual.icon, exp.icon);
      assert.strictEqual(actual.desc, exp.desc);
      assert.ok(actual.color, `World ${exp.id} must define a theme color`);
      assert.ok(actual.glow, `World ${exp.id} must define a glow color`);
    });
  });

  it('Requirement 3: WorldsViewManager renders cards with active/select buttons and triggers onSelect', () => {
    const { elements, cleanup } = setupFullMockDom();
    try {
      const container = elements.get('skins-worlds-list') as unknown as HTMLElement;
      const manager = new WorldsViewManager();

      let selectedWorld = '';
      manager.render(container, null, (id) => {
        selectedWorld = id;
      });

      const mockContainer = container as unknown as MockDomElement;
      assert.strictEqual(mockContainer.children.length, 5, 'Should render 5 cards');

      // Default (null) -> 'auto' should be active
      const autoCard = mockContainer.children[0];
      assert.ok(autoCard.classList.contains('active'), 'Auto world must be active when currentBiome is null');
      assert.ok(autoCard.innerHTML.includes('btn-active'), 'Auto card button must be active');
      assert.ok(autoCard.innerHTML.includes('ВЫБРАН'), 'Auto card button must say ВЫБРАН');
      assert.ok(autoCard.innerHTML.includes(SKINS_MENU_ICONS.btnGreen), 'Auto card button must have green texture');

      // Other cards -> select button
      const forestCard = mockContainer.children[1];
      assert.ok(!forestCard.classList.contains('active'), 'Forest must not be active');
      assert.ok(forestCard.innerHTML.includes('btn-select'), 'Forest card button must be select');
      assert.ok(forestCard.innerHTML.includes('ВЫБРАТЬ'), 'Forest card button must say ВЫБРАТЬ');
      assert.ok(forestCard.innerHTML.includes(SKINS_MENU_ICONS.btnGold), 'Forest card button must have gold texture');

      // Click forest card
      forestCard.click();
      assert.strictEqual(selectedWorld, 'forest', 'Clicking card must trigger onSelect with world id');

      // Re-render with 'winter'
      manager.render(container, 'winter', (id) => {
        selectedWorld = id;
      });
      assert.strictEqual(mockContainer.children.length, 5, 'Should still have 5 cards after re-render');
      const winterCard = mockContainer.children[2];
      assert.ok(winterCard.classList.contains('active'), 'Winter must be active when currentBiome is winter');
      assert.ok(winterCard.innerHTML.includes('ВЫБРАН'));
      const autoCardAfter = mockContainer.children[0];
      assert.ok(!autoCardAfter.classList.contains('active'), 'Auto must not be active when winter is selected');
      assert.ok(autoCardAfter.innerHTML.includes('ВЫБРАТЬ'));
    } finally {
      cleanup();
    }
  });

  it('Requirement 4: SkinsCollectionModal manages tab switching and world selection callbacks', () => {
    const { elements, cleanup } = setupFullMockDom();
    try {
      let selectedWorldId = '';

      const modal = new SkinsCollectionModal({
        onSelectSkin: () => {},
        onSelectWorld: (id) => { selectedWorldId = id; },
      });

      modal.open(250, ['corgi', 'box_cat'], 'corgi', 'auto');
      assert.strictEqual(modal.getActiveTab(), 'characters', 'Initial tab must be characters');

      const tabBtnWorlds = elements.get('skins-tab-btn-worlds')!;
      const tabBtnCharacters = elements.get('skins-tab-btn-characters')!;
      const tabContentWorlds = elements.get('skins-tab-worlds-content')!;
      const tabContentCharacters = elements.get('skins-tab-characters-content')!;

      // Click worlds tab
      tabBtnWorlds.click();
      assert.strictEqual(modal.getActiveTab(), 'worlds', 'Active tab should switch to worlds');
      assert.ok(tabBtnWorlds.classList.contains('active'), 'Worlds tab button must be active');
      assert.ok(!tabBtnCharacters.classList.contains('active'), 'Characters tab button must not be active');
      assert.ok(!tabContentWorlds.classList.contains('hidden'), 'Worlds content must not be hidden');
      assert.ok(tabContentCharacters.classList.contains('hidden'), 'Characters content must be hidden');

      // Select a world from the rendered list
      const worldsList = elements.get('skins-worlds-list')!;
      assert.strictEqual(worldsList.children.length, 5, 'Worlds list must be rendered');
      const desertCard = worldsList.children[3];
      desertCard.click();
      assert.strictEqual(selectedWorldId, 'desert', 'Selecting desert card must invoke onSelectWorld');
      assert.strictEqual(modal.getCurrentBiome(), 'desert');

      // Click characters tab to switch back
      tabBtnCharacters.click();
      assert.strictEqual(modal.getActiveTab(), 'characters', 'Active tab should switch back to characters');
      assert.ok(tabBtnCharacters.classList.contains('active'), 'Characters tab button must be active');
      assert.ok(!tabContentCharacters.classList.contains('hidden'), 'Characters content must not be hidden');
      assert.ok(tabContentWorlds.classList.contains('hidden'), 'Worlds content must be hidden');
    } finally {
      cleanup();
    }
  });

  it('Requirement 5: GameEngine biomeOverride and gameLoop onSelectWorld delegate work properly', () => {
    const engine = new GameEngine();
    assert.strictEqual(engine.getBiomeOverride(), null, 'Default biomeOverride must be null');
    assert.strictEqual(engine.getBiome(), 'forest', 'Default score 0 gives forest biome');

    engine.setBiomeOverride('winter');
    assert.strictEqual(engine.getBiomeOverride(), 'winter');
    assert.strictEqual(engine.getBiome(), 'winter');

    engine.setBiomeOverride(null);
    assert.strictEqual(engine.getBiomeOverride(), null);
    assert.strictEqual(engine.getBiome(), 'forest');

    // Test gameLoop UIActions integration
    const mockStorage = {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    };
    const gameEngine = new GameEngine(12345, mockStorage);
    const mockUi = Object.create(UIManager.prototype) as UIManager;
    Object.assign(mockUi, {
      renderSkins: () => {},
      setGachaRollButtonText: () => {},
      updateMenuStats: () => {},
      renderDailyBonus: () => {},
      updateDailyBadge: () => {},
      renderDailyQuests: () => {},
      renderAchievements: () => {},
      renderLeaderboard: () => {},
      setSoundToggle: () => {},
      setMusicToggle: () => {},
      setPlayerName: () => {},
      initSettingsModal: () => {},
      applyLanguage: () => {},
      showToast: () => {},
    });
    const mockAudio = {
      setSoundEnabled: () => {},
      setMusicEnabled: () => {},
      setSfxVolume: () => {},
      setMusicVolume: () => {},
      isSoundEnabled: () => true,
      isMusicEnabled: () => true,
      playSkinVoice: () => {},
    } as unknown as AudioSynth;
    const sceneManager = {
      updatePlayerSkin: () => {},
      setMenuMode: () => {}, clearAll: () => {}, setRecordFlag: () => {},
      removeRecordFlag: () => {}, sync: () => {}, setShadowsEnabled: () => {},
      setRenderQuality: () => {}, setScreenShakeEnabled: () => {},
    } as unknown as SceneManager;

    const gameLoop = new GameLoop(gameEngine, sceneManager, mockAudio, mockUi);

    const uiActions = gameLoop.getUIActions();
    assert.ok(typeof uiActions.onSelectWorld === 'function', 'UIActions must include onSelectWorld');

    uiActions.onSelectWorld?.('neon');
    assert.strictEqual(gameEngine.getBiomeOverride(), 'neon', 'Selecting neon should set override');
    assert.strictEqual(gameEngine.getBiome(), 'neon');

    uiActions.onSelectWorld?.('auto');
    assert.strictEqual(gameEngine.getBiomeOverride(), null, 'Selecting auto should clear override to null');
    assert.strictEqual(gameEngine.getBiome(), 'forest');
  });

  it('Requirement 6: scripts/build.mjs registers src/app/worldsCollectionModal.ts in moduleOrder', () => {
    const buildPath = path.join(process.cwd(), 'scripts/build.mjs');
    assert.ok(fs.existsSync(buildPath));
    const buildContent = fs.readFileSync(buildPath, 'utf8');

    assert.ok(
      buildContent.includes("'src/app/worldsCollectionModal.ts'"),
      'build.mjs moduleOrder must include src/app/worldsCollectionModal.ts'
    );

    const gachaIdx = buildContent.indexOf("'src/app/gachaMachineModal.ts'");
    const worldsIdx = buildContent.indexOf("'src/app/worldsCollectionModal.ts'");
    const skinsIdx = buildContent.indexOf("'src/app/skinsCollectionModal.ts'");
    const uiIdx = buildContent.indexOf("'src/app/uiManager.ts'");

    assert.ok(
      gachaIdx < worldsIdx && worldsIdx < skinsIdx && skinsIdx < uiIdx,
      'moduleOrder must order: gachaMachineModal -> worldsCollectionModal -> skinsCollectionModal -> uiManager'
    );
  });
});
