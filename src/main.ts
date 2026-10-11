import { GameEngine } from './core/gameEngine.ts';
import { AudioSynth } from './view/audioSynth.ts';
import { SceneManager } from './view/sceneManager.ts';
import { UIManager } from './app/uiManager.ts';
import { InputManager } from './app/inputManager.ts';
import { GameLoop } from './app/gameLoop.ts';
import { PlatformBridge } from './platform/ysdk.ts';

const container = document.getElementById('game-container')!;
const urlSeed = Number(new URLSearchParams(window.location.search).get('seed'));
const initialSeed = Number.isFinite(urlSeed) && urlSeed > 0 ? urlSeed : Date.now();

const engine = new GameEngine(initialSeed, window.localStorage);
const sceneManager = new SceneManager(container);
const audio = new AudioSynth();
const platform = new PlatformBridge();
const ui = new UIManager(platform);
const gameLoop = new GameLoop(engine, sceneManager, audio, ui, platform);

platform.init().catch((e: unknown) => console.warn(e));
ui.bindActions(gameLoop.getUIActions());
new InputManager(gameLoop.getInputCallbacks(), gameLoop.getModalStateProvider()).attach();

ui.openMainMenu();
gameLoop.updateMenuStats();
gameLoop.renderSkinsUI();
if (engine.canClaimDailyReward()) gameLoop.handleOpenDailyBonus();
gameLoop.start();
