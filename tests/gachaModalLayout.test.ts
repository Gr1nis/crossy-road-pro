import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { InputManager, type ModalStateProvider } from '../src/app/inputManager.ts';
import { GachaMachineModal } from '../src/app/gachaMachineModal.ts';

describe('Gacha Prize Machine (Stage 2) — Modal Frame & Visual Overhaul Suite', () => {
  const htmlPath = path.join(process.cwd(), 'index.html');
  const html = fs.readFileSync(htmlPath, 'utf8');

  it('Requirement 1 (Container & Glassmorphism): .modal-card-gacha-pc has dark blue glass gradient, amber glow, and ::before highlight', () => {
    assert.ok(html.includes('.modal-card-gacha-pc {'), 'Must define .modal-card-gacha-pc');
    assert.ok(
      html.includes('background: linear-gradient(180deg, rgba(20, 31, 53, 0.95) 0%, rgba(13, 20, 36, 0.98) 100%)'),
      'Must have dark blue glass gradient background'
    );
    assert.ok(html.includes('border: 3px solid #f59e0b'), 'Must have 3px gold amber border');
    assert.ok(
      html.includes('box-shadow:') && html.includes('rgba(245, 158, 11, 0.45)') && html.includes('inset 0 0 20px rgba(245, 158, 11, 0.2)'),
      'Must have double amber glow box-shadow (outer and inset)'
    );
    assert.ok(html.includes('.modal-card-gacha-pc::before {'), 'Must define ::before glass highlight pseudo-element');
    assert.ok(html.includes('radial-gradient(ellipse at 20% 0%'), 'Must have glossy sheen in upper-left corner');
  });

  it('Requirement 2 (Header & Top Bar): No High Score widget, 3D Title, Close [ESC], and Coin Capsule', () => {
    // High Score widget completely removed per user feedback
    assert.ok(!html.includes('gacha-hanging-highscore'), 'Must NOT contain gacha-hanging-highscore element');
    assert.ok(!html.includes('id="gacha-modal-high-score"'), 'Must NOT contain id="gacha-modal-high-score"');

    // 3D Title
    assert.ok(html.includes('class="gacha-3d-title-img"'), 'Must contain 3D Title image');
    assert.ok(html.includes('gacha_title'), 'Must preserve i18n key gacha_title');

    // Top Left Group (Coin Capsule on the left)
    assert.ok(html.includes('gacha-top-left-group'), 'Must contain gacha-top-left-group');
    assert.ok(html.includes('id="gacha-modal-coins"'), 'Must preserve id="gacha-modal-coins"');
    assert.ok(html.includes('gacha-coin-capsule'), 'Must contain gacha-coin-capsule');
    assert.ok(html.includes('class="gacha-coin-icon-img"'), 'Coin capsule must use game coin icon image');
    assert.ok(html.includes('.gacha-top-left-group') && html.includes('left: 24px;'), 'Top left group must be positioned on the left');
    assert.ok(html.includes('.gacha-top-left-group') && html.includes('top: 16px;'), 'Top left group must be aligned at top: 16px');

    // Top Right Group (Close Button on the right)
    assert.ok(html.includes('gacha-top-right-group'), 'Must contain gacha-top-right-group');
    assert.ok(html.includes('id="gacha-modal-close-btn"'), 'Must preserve id="gacha-modal-close-btn"');
    assert.ok(html.includes('class="gacha-close-btn-img"'), 'Must contain 3D close button image');
    assert.ok(html.includes('[ESC]'), 'Must display [ESC] keyboard hint');
    assert.ok(html.includes('.gacha-top-right-group') && html.includes('right: 24px;'), 'Top right group must be positioned on the right');
    assert.ok(html.includes('.gacha-top-right-group') && html.includes('top: 16px;'), 'Top right group must be aligned at top: 16px');

    // Logo alignment
    assert.ok(html.includes('margin-top: -72px;'), 'Header wrap must raise 3D title logo so its center sits on the top border');
  });

  it('Requirement 3 (Roulette Drum & Chassis): 3D Pointer Arrow, Niche Chassis, and NO [A]/[D] BROWSE', () => {
    assert.ok(html.includes('id="gacha-viewport"'), 'Must preserve id="gacha-viewport"');
    assert.ok(html.includes('class="gacha-pointer-img"'), 'Must contain 3D pointer image');
    assert.ok(html.includes('id="gacha-modal-skin-list"'), 'Must preserve id="gacha-modal-skin-list"');
    assert.ok(!html.includes('BROWSE'), 'Must NOT contain [A]/[D] BROWSE hint');
    assert.ok(html.includes('radial-gradient(ellipse at 50% 50%, #0d162a 0%, #060912 100%)'), 'Must have deep dark chassis niche background');
  });

  it('Requirement 4 (Spin Button & Space Hint): 3D Spin Button, SPIN, Price, and Space hint', () => {
    assert.ok(html.includes('id="gacha-modal-roll-btn"'), 'Must preserve id="gacha-modal-roll-btn"');
    assert.ok(html.includes('gacha-spin-btn'), 'Must have gacha-spin-btn class');
    assert.ok(html.includes('gacha-spin-main'), 'Must contain gacha-spin-main');
    assert.ok(html.includes('gacha-spin-price'), 'Must contain gacha-spin-price');
    assert.ok(html.includes('class="gacha-btn-coin-img"'), 'Spin button must use game coin icon image');
    assert.ok(!html.includes('background: rgba(255, 255, 255, 0.55);'), 'Spin button price must not have oval pill background');
    assert.ok(html.includes('PRESS [SPACE] TO SPIN'), 'Must display glowing PRESS [SPACE] TO SPIN hint');
    assert.ok(html.includes('select-character-btn'), 'Must support select-character-btn winning state');
  });

  it('Requirement 5 (Interactive Elements & Feedback FX): Winning effects, duplicate stamp, cashback flyer, confetti', () => {
    assert.ok(html.includes('id="gacha-win-fx"'), 'Must preserve id="gacha-win-fx"');
    assert.ok(html.includes('id="gacha-duplicate-stamp"'), 'Must preserve id="gacha-duplicate-stamp"');
    assert.ok(html.includes('id="gacha-cashback-flyer"'), 'Must preserve id="gacha-cashback-flyer"');
    assert.ok(html.includes('.gacha-confetti-piece'), 'Must style confetti pieces with keyframe explosion');
  });

  it('Requirement 6 (Keyboard Control): Space, KeyG, and Enter trigger roll, Escape closes modal', () => {
    let rollTriggered = 0;
    let closeTriggered = 0;

    const modalState: ModalStateProvider = {
      isSettingsOpen: () => false,
      isPauseOpen: () => false,
      isMainMenuOpen: () => false,
      isGachaOpen: () => true,
      isLeaderboardOpen: () => false,
      isGameOverOpen: () => false,
      isPlaying: () => false,
    };

    const input = new InputManager(
      {
        onMove: () => {},
        onPauseGame: () => {},
        onResumeGame: () => {},
        onStartGame: () => {},
        onRestartGame: () => {},
        onToMenu: () => {},
        onGachaRoll: () => { rollTriggered++; },
        onCloseModal: () => { closeTriggered++; },
      },
      modalState
    );

    // Test Space key triggers roll
    input.handleKeyDown({ code: 'Space', preventDefault: () => {} } as any);
    assert.equal(rollTriggered, 1, 'Pressing Space must trigger gacha roll');

    // Test Enter key triggers roll
    input.handleKeyDown({ code: 'Enter', preventDefault: () => {} } as any);
    assert.equal(rollTriggered, 2, 'Pressing Enter must trigger gacha roll');

    // Test KeyG key triggers roll
    input.handleKeyDown({ code: 'KeyG', preventDefault: () => {} } as any);
    assert.equal(rollTriggered, 3, 'Pressing KeyG must trigger gacha roll');

    // Test Escape key closes modal
    input.handleKeyDown({ code: 'Escape', preventDefault: () => {} } as any);
    assert.equal(closeTriggered, 1, 'Pressing Escape must close gacha modal');
  });

  it('Requirement 7 (Roulette Spin Clean State): startRoulette displays only КРУТИТСЯ... without slot machine emoji', () => {
    const modalFilePath = path.join(process.cwd(), 'src/app/gachaMachineModal.ts');
    const modalSource = fs.readFileSync(modalFilePath, 'utf8');

    assert.ok(!modalSource.includes('🎰'), 'Roulette spinning state must not have slot machine emoji 🎰');
    assert.ok(modalSource.includes('КРУТИТСЯ...'), 'Roulette spinning state must show centered text КРУТИТСЯ...');
  });

  it('Requirement 8 (Keyboard & Spinning Invariant): Space key while spinning does NOT trigger roll and never moves character in background', () => {
    let rollTriggered = 0;
    let moveTriggered = 0;
    let isSpinning = true;

    const modalState: ModalStateProvider = {
      isSettingsOpen: () => false,
      isPauseOpen: () => false,
      isMainMenuOpen: () => false,
      isGachaOpen: () => true,
      isGachaSpinning: () => isSpinning,
      isLeaderboardOpen: () => false,
      isGameOverOpen: () => false,
      isPlaying: () => true,
    };

    const input = new InputManager(
      {
        onMove: () => { moveTriggered++; },
        onPauseGame: () => {},
        onResumeGame: () => {},
        onStartGame: () => {},
        onRestartGame: () => {},
        onToMenu: () => {},
        onGachaRoll: () => { rollTriggered++; },
        onCloseModal: () => {},
      },
      modalState
    );

    // When spinning: Space must be blocked from rolling and blocked from moving
    input.handleKeyDown({ code: 'Space', preventDefault: () => {} } as any);
    assert.equal(rollTriggered, 0, 'Space during spin must NOT trigger onGachaRoll');
    assert.equal(moveTriggered, 0, 'Space during spin must NOT trigger character onMove');

    // When spin finishes: Space can roll again
    isSpinning = false;
    input.handleKeyDown({ code: 'Space', preventDefault: () => {} } as any);
    assert.equal(rollTriggered, 1, 'Space after spin finishes must trigger onGachaRoll');
    assert.equal(moveTriggered, 0, 'Space must still not trigger onMove');
  });

  it('Requirement 9 (Button State Recovery & Safe Coin URL): handleSpinComplete resets to КРУТИТЬ ЕЩЁ with safe coin icon and close() has try/finally', () => {
    const modalFilePath = path.join(process.cwd(), 'src/app/gachaMachineModal.ts');
    const modalSource = fs.readFileSync(modalFilePath, 'utf8');

    assert.ok(modalSource.includes('КРУТИТЬ ЕЩЁ'), 'Must reset button label to КРУТИТЬ ЕЩЁ');
    assert.ok(modalSource.includes('getGachaMachineCoinUrl'), 'Must use safe coin url helper function');
    assert.ok(modalSource.includes('finally {'), 'Must use finally block to guarantee button reset and flag clearance');
    assert.ok(modalSource.includes("this.modal?.classList.add('hidden');"), 'Must hide modal in close() finally block');
    assert.ok(modalSource.includes("'touchend'"), 'Must bind touchend event listener for close button');
  });

  it('Requirement 10 (Reel Cards & Modal Defense): open() populates reel with all 5 characters and close() is protected', () => {
    const originalDocument = globalThis.document;
    const originalWindow = globalThis.window;
    const originalRaf = (globalThis as any).requestAnimationFrame;
    const originalCaf = (globalThis as any).cancelAnimationFrame;

    const elements = new Map<string, any>();
    const createMockEl = (id?: string) => {
      const classes = new Set<string>(['hidden']);
      const attrs = new Map<string, string>();
      const children: any[] = [];
      const el: any = {
        id,
        classList: {
          add: (...c: string[]) => c.forEach((x) => classes.add(x)),
          remove: (...c: string[]) => c.forEach((x) => classes.delete(x)),
          contains: (x: string) => classes.has(x),
        },
        children,
        appendChild: (child: any) => children.push(child),
        querySelectorAll: () => [],
        querySelector: () => null,
        setAttribute: (k: string, v: string) => attrs.set(k, v),
        removeAttribute: (k: string) => attrs.delete(k),
        getAttribute: (k: string) => attrs.get(k) ?? null,
        addEventListener: () => {},
        style: { transform: '', setProperty: () => {} },
        textContent: '',
        innerHTML: '',
      };
      if (id) elements.set(id, el);
      return el;
    };

    const ids = [
      'gacha-modal',
      'gacha-modal-coins',
      'gacha-modal-close-btn',
      'gacha-modal-roll-btn',
      'gacha-modal-skin-list',
      'gacha-viewport',
      'gacha-win-fx',
      'gacha-duplicate-stamp',
      'gacha-cashback-flyer',
    ];
    ids.forEach((id) => createMockEl(id));

    (globalThis as any).document = {
      getElementById: (id: string) => elements.get(id) || null,
      createElement: () => createMockEl(),
      readyState: 'complete',
      addEventListener: () => {},
    };
    (globalThis as any).window = {
      requestAnimationFrame: () => 1,
      cancelAnimationFrame: () => {},
    };
    (globalThis as any).requestAnimationFrame = () => 1;
    (globalThis as any).cancelAnimationFrame = () => {};

    try {
      const modal = new GachaMachineModal({
        onRoll: () => {},
        onSelectAndPlay: () => {},
        onTick: () => {},
        onClose: () => {},
      });

      assert.equal(modal.isOpen(), false);
      assert.equal(modal.isSpinningActive(), false);

      modal.open('corgi', ['corgi']);
      assert.equal(modal.isOpen(), true);
      assert.equal(modal.isSpinningActive(), false);

      const track = elements.get('gacha-modal-skin-list');
      assert.ok(track.children.length >= 5, 'Track must contain cards for all skins');

      modal.close();
      assert.equal(modal.isOpen(), false);
      assert.equal(modal.isSpinningActive(), false);
    } finally {
      (globalThis as any).document = originalDocument;
      (globalThis as any).window = originalWindow;
      (globalThis as any).requestAnimationFrame = originalRaf;
      (globalThis as any).cancelAnimationFrame = originalCaf;
    }
  });
});
