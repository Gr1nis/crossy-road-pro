import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { InputManager, SWIPE_THRESHOLDS, type InputCallbacks, type ModalStateProvider } from '../src/app/inputManager.ts';
import { SettingsManager } from '../src/core/settingsManager.ts';
import { MoveDirection, type MoveDirectionValue } from '../src/core/types.ts';

describe('InputManager — Controls Schemes, Sensitivity & D-Pad Suite', () => {
  function createInputWithSettings(initialSettings?: Parameters<SettingsManager['updateSettings']>[0], modalOverrides?: Partial<ModalStateProvider>) {
    const moves: MoveDirectionValue[] = [];
    const settings = new SettingsManager();
    if (initialSettings) {
      settings.updateSettings(initialSettings);
    }

    const callbacks: InputCallbacks = {
      onMove: (dir) => moves.push(dir),
      onStartGame: () => {},
      onPauseGame: () => {},
      onResumeGame: () => {},
      onRestartGame: () => {},
      onToMenu: () => {},
      onGachaRoll: () => {},
      onCloseModal: () => {},
    };

    const modalState: ModalStateProvider = {
      isSettingsOpen: () => false,
      isPauseOpen: () => false,
      isMainMenuOpen: () => false,
      isGachaOpen: () => false,
      isLeaderboardOpen: () => false,
      isGameOverOpen: () => false,
      isPlaying: () => true,
      ...modalOverrides,
    };

    const input = new InputManager(callbacks, modalState, settings);
    return { input, moves, settings };
  }

  it('Requirement: SWIPE_THRESHOLDS constants match low=38, normal=26, high=16', () => {
    assert.equal(SWIPE_THRESHOLDS.low, 38, 'Low sensitivity threshold must be 38px');
    assert.equal(SWIPE_THRESHOLDS.normal, 26, 'Normal sensitivity threshold must be 26px');
    assert.equal(SWIPE_THRESHOLDS.high, 16, 'High sensitivity threshold must be 16px');
  });

  it('Swipe sensitivity adjusts threshold: 30px swipe is swipe in normal, but tap in low', () => {
    // Normal sensitivity (threshold 26px): 30px delta is a SWIPE
    const normalSetup = createInputWithSettings({ swipeSensitivity: 'normal' });
    normalSetup.input.handleTouchStart({ touches: [{ clientX: 100, clientY: 100 }], target: null } as any);
    normalSetup.input.handleTouchEnd({ changedTouches: [{ clientX: 130, clientY: 100 }] } as any);
    assert.deepEqual(normalSetup.moves, [MoveDirection.RIGHT]);

    // Low sensitivity (threshold 38px): 30px delta is less than 38, so treated as forward TAP
    const lowSetup = createInputWithSettings({ swipeSensitivity: 'low' });
    lowSetup.input.handleTouchStart({ touches: [{ clientX: 100, clientY: 100 }], target: null } as any);
    lowSetup.input.handleTouchEnd({ changedTouches: [{ clientX: 130, clientY: 100 }] } as any);
    assert.deepEqual(lowSetup.moves, [MoveDirection.FORWARD]);

    // High sensitivity (threshold 16px): 20px delta is a SWIPE
    const highSetup = createInputWithSettings({ swipeSensitivity: 'high' });
    highSetup.input.handleTouchStart({ touches: [{ clientX: 100, clientY: 100 }], target: null } as any);
    highSetup.input.handleTouchEnd({ changedTouches: [{ clientX: 80, clientY: 100 }] } as any);
    assert.deepEqual(highSetup.moves, [MoveDirection.LEFT]);
  });

  it('Tap scheme: directional tap zones move LEFT, RIGHT, BACKWARD, and FORWARD', () => {
    // Mock window inner dimensions
    const origW = globalThis.window?.innerWidth;
    const origH = globalThis.window?.innerHeight;
    (globalThis as any).window = { ...(globalThis.window ?? {}), innerWidth: 400, innerHeight: 800 };

    try {
      const { input, moves } = createInputWithSettings({ controlsType: 'tap' });

      // Tap left (<25% of 400 = 100)
      input.handleTouchStart({ touches: [{ clientX: 50, clientY: 400 }], target: null } as any);
      input.handleTouchEnd({ changedTouches: [{ clientX: 52, clientY: 401 }] } as any);
      assert.equal(moves[moves.length - 1], MoveDirection.LEFT);

      // Tap right (>75% of 400 = 300)
      input.handleTouchStart({ touches: [{ clientX: 350, clientY: 400 }], target: null } as any);
      input.handleTouchEnd({ changedTouches: [{ clientX: 351, clientY: 400 }] } as any);
      assert.equal(moves[moves.length - 1], MoveDirection.RIGHT);

      // Tap bottom (>80% of 800 = 640)
      input.handleTouchStart({ touches: [{ clientX: 200, clientY: 700 }], target: null } as any);
      input.handleTouchEnd({ changedTouches: [{ clientX: 200, clientY: 702 }] } as any);
      assert.equal(moves[moves.length - 1], MoveDirection.BACKWARD);

      // Tap center (<75%, >25%, <80%) -> FORWARD
      input.handleTouchStart({ touches: [{ clientX: 200, clientY: 300 }], target: null } as any);
      input.handleTouchEnd({ changedTouches: [{ clientX: 201, clientY: 300 }] } as any);
      assert.equal(moves[moves.length - 1], MoveDirection.FORWARD);

      // Swipes still work in 'tap' mode
      input.handleTouchStart({ touches: [{ clientX: 200, clientY: 400 }], target: null } as any);
      input.handleTouchEnd({ changedTouches: [{ clientX: 260, clientY: 400 }] } as any);
      assert.equal(moves[moves.length - 1], MoveDirection.RIGHT);
    } finally {
      if (origW !== undefined) (globalThis as any).window.innerWidth = origW;
      if (origH !== undefined) (globalThis as any).window.innerHeight = origH;
    }
  });

  it('D-Pad visibility invariant: isDpadActive only when controlsType=dpad and playing without modals/pause', () => {
    const { input, settings } = createInputWithSettings({ controlsType: 'swipe' });
    assert.equal(input.isDpadActive(), false, 'Should be inactive when controlsType is swipe');

    settings.setSetting('controlsType', 'dpad');
    assert.equal(input.isDpadActive(), true, 'Should be active when controlsType is dpad and playing');

    // Paused
    const paused = createInputWithSettings({ controlsType: 'dpad' }, { isPauseOpen: () => true });
    assert.equal(paused.input.isDpadActive(), false, 'Should be inactive when paused');

    // Main Menu
    const menu = createInputWithSettings({ controlsType: 'dpad' }, { isMainMenuOpen: () => true });
    assert.equal(menu.input.isDpadActive(), false, 'Should be inactive when in main menu');

    // Settings Modal
    const inSettings = createInputWithSettings({ controlsType: 'dpad' }, { isSettingsOpen: () => true });
    assert.equal(inSettings.input.isDpadActive(), false, 'Should be inactive when settings modal is open');

    // Game Over
    const gameOver = createInputWithSettings({ controlsType: 'dpad' }, { isGameOverOpen: () => true });
    assert.equal(gameOver.input.isDpadActive(), false, 'Should be inactive when game over');
  });
});
