import { GameEngine } from './core/gameEngine.ts';
import { AudioSynth } from './view/audioSynth.ts';
import { SceneManager } from './view/sceneManager.ts';
import { UIManager } from './app/uiManager.ts';
import { InputManager } from './app/inputManager.ts';
import { GameLoop } from './app/gameLoop.ts';

const container = document.getElementById('game-container')!;
const urlSeed = Number(new URLSearchParams(window.location.search).get('seed'));
const initialSeed = Number.isFinite(urlSeed) && urlSeed > 0 ? urlSeed : Date.now();

const engine = new GameEngine(initialSeed, window.localStorage);
const sceneManager = new SceneManager(container);
const audio = new AudioSynth();
const ui = new UIManager();
const gameLoop = new GameLoop(engine, sceneManager, audio, ui);

ui.bindActions(gameLoop.getUIActions());
const inputManager = new InputManager(gameLoop.getInputCallbacks(), gameLoop.getModalStateProvider());
inputManager.attach();

ui.openMainMenu();
gameLoop.updateMenuStats();
gameLoop.renderSkinsUI();
gameLoop.start();
