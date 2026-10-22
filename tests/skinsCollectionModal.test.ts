import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { ALL_SKINS, type SkinId } from '../src/core/types.ts';
import { GACHA_CHARACTER_SKIN_BASE64 } from '../src/view/gachaSkinsBase64.ts';
import { SKINS_MENU_ICONS } from '../src/view/skinsIconsBase64.ts';
import {
  SkinsCollectionModal,
  SKINS_RARITY_MAP,
  type SkinsModalCallbacks,
} from '../src/app/skinsCollectionModal.ts';
import { UIManager, UI_SKIN_RARITY } from '../src/app/uiManager.ts';

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
    innerHTML: '',
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

function setupMockDom() {
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

describe('SkinsCollectionModal — State Machine & Gameplay Logic Suite', () => {
  it('Requirement 1: File length is strictly <= 300 lines', () => {
    const filePath = path.join(process.cwd(), 'src/app/skinsCollectionModal.ts');
    assert.ok(fs.existsSync(filePath), 'src/app/skinsCollectionModal.ts must exist');
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n').length;
    assert.ok(lines <= 300, `src/app/skinsCollectionModal.ts must be <= 300 lines, currently: ${lines}`);
  });

  it('Requirement 2: SKINS_RARITY_MAP matches all 4 tiers with exact colors and glows', () => {
    assert.equal(SKINS_RARITY_MAP['corgi'].label, 'Обычный');
    assert.equal(SKINS_RARITY_MAP['corgi'].color, '#94a3b8');
    assert.equal(SKINS_RARITY_MAP['corgi'].glow, 'rgba(148, 163, 184, 0.45)');

    assert.equal(SKINS_RARITY_MAP['box_cat'].label, 'Редкий');
    assert.equal(SKINS_RARITY_MAP['box_cat'].color, '#38bdf8');
    assert.equal(SKINS_RARITY_MAP['box_cat'].glow, 'rgba(56, 189, 248, 0.5)');

    assert.equal(SKINS_RARITY_MAP['raccoon_bandit'].label, 'Эпический');
    assert.equal(SKINS_RARITY_MAP['raccoon_bandit'].color, '#c084fc');
    assert.equal(SKINS_RARITY_MAP['raccoon_bandit'].glow, 'rgba(192, 132, 252, 0.55)');

    assert.equal(SKINS_RARITY_MAP['capybara_zen'].label, 'Легендарный');
    assert.equal(SKINS_RARITY_MAP['capybara_zen'].color, '#fbbf24');
    assert.equal(SKINS_RARITY_MAP['capybara_zen'].glow, 'rgba(251, 191, 36, 0.6)');

    // UI_SKIN_RARITY re-exports the exact mapping
    assert.equal(UI_SKIN_RARITY['capybara_zen'].label, 'Легендарный');
    assert.equal(UI_SKIN_RARITY['capybara_zen'].css, 'rarity-legendary');
  });

  it('Requirement 3: Renders all 5 character cards with authentic 3D WebP renders and correct states', () => {
    const { elements, cleanup } = setupMockDom();
    try {
      let selectedSkinId = '';
      let gachaOpened = false;

      const controller = new SkinsCollectionModal({
        onSelectSkin: (id) => {
          selectedSkinId = id;
        },
        onOpenGacha: () => {
          gachaOpened = true;
        },
      });

      const unlocked = ['corgi', 'box_cat'];
      const active = 'corgi';

      controller.open(250, unlocked, active);

      // Verify coins
      assert.equal(elements.get('skins-modal-coins')?.textContent, '250');
      assert.equal(controller.isOpen(), true);

      // Verify 5 cards rendered
      const list = elements.get('skins-modal-list')!;
      assert.equal(list.children.length, 5);

      // 1. Corgi (unlocked & active)
      const corgiCard = list.children[0];
      assert.ok(corgiCard.classList.contains('skin-card'));
      assert.ok(corgiCard.classList.contains('active'));
      assert.ok(!corgiCard.classList.contains('locked'));
      assert.ok(corgiCard.innerHTML.includes(GACHA_CHARACTER_SKIN_BASE64['corgi']));
      assert.ok(corgiCard.innerHTML.includes('btn-active'));
      assert.ok(corgiCard.innerHTML.includes('ВЫБРАН'));
      assert.ok(corgiCard.innerHTML.includes(SKINS_MENU_ICONS.btnGreen));

      // 2. Box Cat (unlocked & available)
      const boxCatCard = list.children[2];
      assert.ok(boxCatCard.classList.contains('skin-card'));
      assert.ok(!boxCatCard.classList.contains('active'));
      assert.ok(!boxCatCard.classList.contains('locked'));
      assert.ok(boxCatCard.innerHTML.includes(GACHA_CHARACTER_SKIN_BASE64['box_cat']));
      assert.ok(boxCatCard.innerHTML.includes('btn-select'));
      assert.ok(boxCatCard.innerHTML.includes('ВЫБРАТЬ'));
      assert.ok(boxCatCard.innerHTML.includes(SKINS_MENU_ICONS.btnGold));

      // 3. Capybara Zen (locked silhouette)
      const capyCard = list.children[4];
      assert.ok(capyCard.classList.contains('skin-card'));
      assert.ok(capyCard.classList.contains('locked'));
      assert.ok(capyCard.classList.contains('skin-card-silhouette'));
      assert.ok(capyCard.innerHTML.includes(GACHA_CHARACTER_SKIN_BASE64['capybara_zen']));
      assert.ok(capyCard.innerHTML.includes('??? [ЛЕГЕНДАРНЫЙ]'), 'Locked skin name must be masked with rank');
      assert.ok(capyCard.innerHTML.includes('btn-locked'));
      assert.ok(capyCard.innerHTML.includes('В АВТОМАТЕ'));
      assert.ok(capyCard.innerHTML.includes(SKINS_MENU_ICONS.lock));

      // Test clicks
      boxCatCard.click();
      assert.equal(selectedSkinId, 'box_cat', 'Clicking unlocked card must invoke onSelectSkin');

      capyCard.click();
      assert.equal(gachaOpened, true, 'Clicking locked card must invoke onOpenGacha');

      controller.destroy();
    } finally {
      cleanup();
    }
  });

  it('Requirement 4: Keyboard navigation cyclically updates focus with A/D, arrows and Enter', () => {
    const { cleanup } = setupMockDom();
    try {
      let selectedId = '';
      let gachaOpened = false;
      let closed = false;

      const controller = new SkinsCollectionModal({
        onSelectSkin: (id) => {
          selectedId = id;
        },
        onOpenGacha: () => {
          gachaOpened = true;
        },
        onClose: () => {
          closed = true;
        },
      });

      controller.open(100, ['corgi'], 'corgi');
      assert.equal(controller.getFocusedIndex(), 0);

      // ArrowRight advances focus
      let handled = controller.handleKeyDown({
        code: 'ArrowRight',
        preventDefault: () => {},
      } as unknown as KeyboardEvent);
      assert.equal(handled, true);
      assert.equal(controller.getFocusedIndex(), 1); // pigeon_pizza

      // KeyD advances focus
      handled = controller.handleKeyDown({
        code: 'KeyD',
        preventDefault: () => {},
      } as unknown as KeyboardEvent);
      assert.equal(handled, true);
      assert.equal(controller.getFocusedIndex(), 2); // box_cat

      // Russian keyboard layout 'в' advances focus
      handled = controller.handleKeyDown({
        code: 'KeyD',
        key: 'в',
        preventDefault: () => {},
      } as unknown as KeyboardEvent);
      assert.equal(handled, true);
      assert.equal(controller.getFocusedIndex(), 3); // raccoon_bandit

      // ArrowLeft steps backward
      handled = controller.handleKeyDown({
        code: 'ArrowLeft',
        preventDefault: () => {},
      } as unknown as KeyboardEvent);
      assert.equal(handled, true);
      assert.equal(controller.getFocusedIndex(), 2); // box_cat

      // [A] steps backward
      handled = controller.handleKeyDown({
        code: 'KeyA',
        key: 'a',
        preventDefault: () => {},
      } as unknown as KeyboardEvent);
      assert.equal(handled, true);
      assert.equal(controller.getFocusedIndex(), 1); // pigeon_pizza

      // Enter selects focused (pigeon_pizza is locked)
      handled = controller.handleKeyDown({
        code: 'Enter',
        preventDefault: () => {},
      } as unknown as KeyboardEvent);
      assert.equal(handled, true);
      assert.equal(gachaOpened, true, 'Enter on locked skin opens gacha');

      // Wrap around backward from index 0
      controller.setFocusedIndex(0);
      controller.handleKeyDown({
        code: 'ArrowLeft',
        preventDefault: () => {},
      } as unknown as KeyboardEvent);
      assert.equal(controller.getFocusedIndex(), 4, 'Left on index 0 must wrap to index 4');

      // Escape closes window
      handled = controller.handleKeyDown({
        code: 'Escape',
        preventDefault: () => {},
      } as unknown as KeyboardEvent);
      assert.equal(handled, true);
      assert.equal(controller.isOpen(), false);
      assert.equal(closed, true);

      controller.destroy();
    } finally {
      cleanup();
    }
  });

  it('Requirement 5: Close method wraps in try...finally and close button triggers cleanly', () => {
    const { elements, cleanup } = setupMockDom();
    try {
      let closeCalled = false;
      const controller = new SkinsCollectionModal({
        onSelectSkin: () => {},
        onClose: () => {
          closeCalled = true;
        },
      });

      controller.open(50, ['corgi'], 'corgi');
      assert.equal(controller.isOpen(), true);

      elements.get('skins-modal-close-btn')?.click();
      assert.equal(controller.isOpen(), false);
      assert.equal(closeCalled, true);

      controller.destroy();
    } finally {
      cleanup();
    }
  });

  it('Requirement 6: UIManager integration delegates renderSkins, openSkins, and closeSkins', () => {
    const { elements, cleanup } = setupMockDom();
    try {
      const ui = new UIManager();
      assert.ok(ui.getSkinsController() !== null, 'UIManager must instantiate skinsController');

      let selectedSkin = '';
      ui.renderSkins(['corgi', 'raccoon_bandit'], 'raccoon_bandit', (id) => {
        selectedSkin = id;
      });

      ui.openSkins(340, ['corgi', 'raccoon_bandit'], 'raccoon_bandit');
      assert.equal(ui.isSkinsOpen(), true);
      assert.equal(elements.get('skins-modal-coins')?.textContent, '340');

      const list = elements.get('skins-modal-list')!;
      // Index 3 is raccoon_bandit
      const raccoonCard = list.children[3];
      assert.ok(raccoonCard.classList.contains('active'));
      assert.ok(raccoonCard.innerHTML.includes('ВЫБРАН'));

      // Index 0 is corgi (unlocked)
      const corgiCard = list.children[0];
      corgiCard.click();
      assert.equal(selectedSkin, 'corgi');

      ui.closeSkins();
      assert.equal(ui.isSkinsOpen(), false);
    } finally {
      cleanup();
    }
  });

  it('Requirement 7: scripts/build.mjs registers src/app/skinsCollectionModal.ts in moduleOrder', () => {
    const buildPath = path.join(process.cwd(), 'scripts/build.mjs');
    const buildContent = fs.readFileSync(buildPath, 'utf8');

    assert.ok(
      buildContent.includes("'src/app/skinsCollectionModal.ts'"),
      'build.mjs must contain src/app/skinsCollectionModal.ts'
    );

    // Verify ordering: gachaMachineModal -> skinsCollectionModal -> uiManager
    const gachaIdx = buildContent.indexOf("'src/app/gachaMachineModal.ts'");
    const skinsIdx = buildContent.indexOf("'src/app/skinsCollectionModal.ts'");
    const uiIdx = buildContent.indexOf("'src/app/uiManager.ts'");

    assert.ok(gachaIdx !== -1 && skinsIdx !== -1 && uiIdx !== -1);
    assert.ok(
      gachaIdx < skinsIdx && skinsIdx < uiIdx,
      'moduleOrder must place skinsCollectionModal between gachaMachineModal and uiManager'
    );
  });
});
