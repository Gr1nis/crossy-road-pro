import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { InputManager, type InputCallbacks, type ModalStateProvider } from '../src/app/inputManager.ts';
import { MoveDirection, type MoveDirectionValue } from '../src/core/types.ts';

describe('InputManager — Mobile Touch & Swipe Controls', () => {
  function createSetup(overrides?: Partial<ModalStateProvider>) {
    const moves: MoveDirectionValue[] = [];
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
      ...overrides,
    };

    const input = new InputManager(callbacks, modalState);
    return { input, moves };
  }

  it('Touch Tap (<26px) triggers forward hop during active gameplay', () => {
    const { input, moves } = createSetup();

    input.handleTouchStart({
      touches: [{ clientX: 200, clientY: 300 }],
      target: null,
    } as any);

    input.handleTouchEnd({
      changedTouches: [{ clientX: 205, clientY: 302 }],
    } as any);

    assert.deepEqual(moves, [MoveDirection.FORWARD]);
  });

  it('Touch Swipe Right triggers MoveDirection.RIGHT', () => {
    const { input, moves } = createSetup();

    input.handleTouchStart({
      touches: [{ clientX: 100, clientY: 200 }],
      target: null,
    } as any);

    input.handleTouchEnd({
      changedTouches: [{ clientX: 160, clientY: 205 }],
    } as any);

    assert.deepEqual(moves, [MoveDirection.RIGHT]);
  });

  it('Touch Swipe Left triggers MoveDirection.LEFT', () => {
    const { input, moves } = createSetup();

    input.handleTouchStart({
      touches: [{ clientX: 200, clientY: 200 }],
      target: null,
    } as any);

    input.handleTouchEnd({
      changedTouches: [{ clientX: 140, clientY: 198 }],
    } as any);

    assert.deepEqual(moves, [MoveDirection.LEFT]);
  });

  it('Touch Swipe Up triggers MoveDirection.FORWARD', () => {
    const { input, moves } = createSetup();

    input.handleTouchStart({
      touches: [{ clientX: 150, clientY: 300 }],
      target: null,
    } as any);

    input.handleTouchEnd({
      changedTouches: [{ clientX: 152, clientY: 230 }],
    } as any);

    assert.deepEqual(moves, [MoveDirection.FORWARD]);
  });

  it('Touch Swipe Down triggers MoveDirection.BACKWARD', () => {
    const { input, moves } = createSetup();

    input.handleTouchStart({
      touches: [{ clientX: 150, clientY: 200 }],
      target: null,
    } as any);

    input.handleTouchEnd({
      changedTouches: [{ clientX: 148, clientY: 270 }],
    } as any);

    assert.deepEqual(moves, [MoveDirection.BACKWARD]);
  });

  it('Touch is ignored when touch target is inside UI buttons or modals', () => {
    const { input, moves } = createSetup();

    const mockButton = {
      closest: (sel: string) => sel.includes('button'),
    };

    input.handleTouchStart({
      touches: [{ clientX: 150, clientY: 200 }],
      target: mockButton,
    } as any);

    input.handleTouchEnd({
      changedTouches: [{ clientX: 250, clientY: 200 }],
    } as any);

    assert.equal(moves.length, 0, 'Touch on button should not trigger character movement');
  });

  it('Touch is ignored when game is not playing (e.g. paused or in menu)', () => {
    const { input, moves } = createSetup({ isPlaying: () => false });

    input.handleTouchStart({
      touches: [{ clientX: 100, clientY: 100 }],
      target: null,
    } as any);

    input.handleTouchEnd({
      changedTouches: [{ clientX: 100, clientY: 100 }],
    } as any);

    assert.equal(moves.length, 0, 'Tap when paused or in menu must not trigger movement');
  });

  it('Touch and swipe are blocked while daily quests modal is open', () => {
    const { input, moves } = createSetup({ isDailyQuestsOpen: () => true });

    input.handleTouchStart({
      touches: [{ clientX: 100, clientY: 200 }],
      target: null,
    } as any);

    input.handleTouchEnd({
      changedTouches: [{ clientX: 200, clientY: 200 }],
    } as any);

    assert.equal(moves.length, 0, 'Touch swipe must be blocked when daily quests modal is open');

    input.triggerMove(MoveDirection.FORWARD);
    assert.equal(moves.length, 0, 'triggerMove must be blocked when daily quests modal is open');
  });

  it('Escape key triggers onCloseModal when daily quests modal is open', () => {
    let closeModalCalled = false;
    const callbacks: InputCallbacks = {
      onMove: () => {},
      onStartGame: () => {},
      onPauseGame: () => {},
      onResumeGame: () => {},
      onRestartGame: () => {},
      onToMenu: () => {},
      onGachaRoll: () => {},
      onCloseModal: () => { closeModalCalled = true; },
    };
    const modalState: ModalStateProvider = {
      isSettingsOpen: () => false,
      isPauseOpen: () => false,
      isMainMenuOpen: () => false,
      isGachaOpen: () => false,
      isLeaderboardOpen: () => false,
      isGameOverOpen: () => false,
      isDailyQuestsOpen: () => true,
      isPlaying: () => true,
    };
    const input = new InputManager(callbacks, modalState);

    let defaultPrevented = false;
    input.handleKeyDown({
      code: 'Escape',
      preventDefault: () => { defaultPrevented = true; },
    } as any);

    assert.equal(closeModalCalled, true, 'Escape must call onCloseModal when daily quests modal is open');
    assert.equal(defaultPrevented, true, 'Escape event must be prevented');
  });

  it('F3 and Alt+P keys trigger onTogglePerfHUD', () => {
    let toggleCount = 0;
    const callbacks: InputCallbacks = {
      onMove: () => {},
      onStartGame: () => {},
      onPauseGame: () => {},
      onResumeGame: () => {},
      onRestartGame: () => {},
      onToMenu: () => {},
      onGachaRoll: () => {},
      onCloseModal: () => {},
      onTogglePerfHUD: () => { toggleCount++; },
    };
    const modalState: ModalStateProvider = {
      isSettingsOpen: () => false,
      isPauseOpen: () => false,
      isMainMenuOpen: () => false,
      isGachaOpen: () => false,
      isLeaderboardOpen: () => false,
      isGameOverOpen: () => false,
      isPlaying: () => true,
    };
    const input = new InputManager(callbacks, modalState);

    let prevented = false;
    input.handleKeyDown({
      code: 'F3',
      preventDefault: () => { prevented = true; },
    } as any);
    assert.equal(toggleCount, 1);
    assert.equal(prevented, true);

    prevented = false;
    input.handleKeyDown({
      code: 'KeyP',
      altKey: true,
      preventDefault: () => { prevented = true; },
    } as any);
    assert.equal(toggleCount, 2);
    assert.equal(prevented, true);
  });
});
