import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { GameEngine } from '../src/core/gameEngine.ts';
import { GameLoop } from '../src/app/gameLoop.ts';
import { UIManager } from '../src/app/uiManager.ts';
import { SceneManager } from '../src/view/sceneManager.ts';
import { AudioSynth } from '../src/view/audioSynth.ts';

describe('Menu Run Continuity & Death Reset Invariants', () => {
  function createTestHarness() {
    class MemoryStorage {
      private map = new Map<string, string>();
      getItem(key: string): string | null { return this.map.get(key) ?? null; }
      setItem(key: string, value: string): void { this.map.set(key, value); }
    }
    const engine = new GameEngine(12345, new MemoryStorage());

    const sceneManagerCalls = {
      setMenuMode: [] as Array<{ isMenu: boolean; snap?: boolean }>,
      clearAllCount: 0,
    };

    const mockSceneManager = Object.create(SceneManager.prototype) as SceneManager;
    mockSceneManager.setMenuMode = (isMenu: boolean, snap?: boolean) => {
      sceneManagerCalls.setMenuMode.push({ isMenu, snap });
    };
    mockSceneManager.clearAll = () => {
      sceneManagerCalls.clearAllCount++;
    };
    mockSceneManager.setRecordFlag = () => {};
    mockSceneManager.removeRecordFlag = () => {};
    mockSceneManager.sync = () => {};

    const mockAudio = Object.create(AudioSynth.prototype) as AudioSynth;
    mockAudio.isSoundEnabled = () => false;
    mockAudio.isMusicEnabled = () => false;
    mockAudio.startMusic = () => {};
    mockAudio.stopMusic = () => {};

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
    mockUi.showHud = () => {};
    mockUi.hideHud = () => {};
    mockUi.openMainMenu = () => {};
    mockUi.closeMainMenu = () => {};
    mockUi.hideAllModals = () => {};

    const loop = new GameLoop(engine, mockSceneManager, mockAudio, mockUi);
    return { engine, loop, sceneManagerCalls };
  }

  it('Requirement 1: Returning to menu after player death resets to row 0 ready for run', () => {
    const { engine, loop, sceneManagerCalls } = createTestHarness();

    // Start a game and simulate moving and death at row 10
    loop.startGame();
    engine.getPlayer().row = 10;
    engine.getPlayer().isDead = true;

    // Return to main menu
    loop.openMainMenu();

    assert.equal(loop.isPlaying, false, 'isPlaying must be false in menu');
    assert.equal(engine.getPlayer().isDead, false, 'Player must be alive and ready in menu');
    assert.equal(engine.getPlayer().row, 0, 'Player must be reset to row 0 in menu');
    assert.ok(sceneManagerCalls.clearAllCount > 0, 'clearAll must be called when returning to menu');
    const lastMenuCall = sceneManagerCalls.setMenuMode[sceneManagerCalls.setMenuMode.length - 1];
    assert.deepEqual(lastMenuCall, { isMenu: true, snap: true }, 'Camera must snap to menu position');
  });

  it('Requirement 2: Starting game preserves lanes already displayed in main menu', () => {
    const { engine, loop, sceneManagerCalls } = createTestHarness();

    // Player is in main menu, run is prepared
    loop.openMainMenu();
    const clearsBeforeStart = sceneManagerCalls.clearAllCount;
    const laneRow1Type = engine.getLane(1).type;
    const laneRow2Type = engine.getLane(2).type;

    // Click "PLAY"
    loop.startGame();

    assert.equal(loop.isPlaying, true, 'Game must be playing');
    assert.equal(sceneManagerCalls.clearAllCount, clearsBeforeStart, 'Must NOT clear scene again on start');
    assert.equal(engine.getLane(1).type, laneRow1Type, 'Lane 1 must remain identical to menu');
    assert.equal(engine.getLane(2).type, laneRow2Type, 'Lane 2 must remain identical to menu');
    const lastModeCall = sceneManagerCalls.setMenuMode[sceneManagerCalls.setMenuMode.length - 1];
    assert.equal(lastModeCall.isMenu, false, 'Camera must transition to gameplay mode');
  });

  it('Requirement 3: UIActions onRestart triggers restartGame', () => {
    const { engine, loop } = createTestHarness();
    const actions = loop.getUIActions();

    engine.getPlayer().row = 15;
    engine.getPlayer().isDead = true;

    actions.onRestart();

    assert.equal(loop.isPlaying, true, 'Must start game on restart');
    assert.equal(engine.getPlayer().row, 0, 'Player must restart from row 0');
    assert.equal(engine.getPlayer().isDead, false, 'Player must be alive on restart');
  });
});
