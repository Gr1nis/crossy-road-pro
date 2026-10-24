import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { GameEngine } from '../src/core/gameEngine.ts';
import { GameLoop } from '../src/app/gameLoop.ts';
import { UIManager } from '../src/app/uiManager.ts';
import { AudioSynth } from '../src/view/audioSynth.ts';
import { SceneManager } from '../src/view/sceneManager.ts';
import { MeshFactory } from '../src/view/meshFactory.ts';
import { InstancedDecorManager } from '../src/view/instancedDecorManager.ts';
import type { LogPlatform } from '../src/core/types.ts';

describe('World Biome View & Hot-Reload Integration Suite', () => {
  it('Property 1 (MeshFactory createLog multi-biome platforms): creates distinct voxel models per biome', () => {
    const dummyLog: LogPlatform = { id: 101, x: 0, length: 3.5, speed: 2 };

    const forestMesh = MeshFactory.createLog(dummyLog, 'forest');
    const winterMesh = MeshFactory.createLog(dummyLog, 'winter');
    const desertMesh = MeshFactory.createLog(dummyLog, 'desert');
    const neonMesh = MeshFactory.createLog(dummyLog, 'neon');

    assert.ok(forestMesh instanceof THREE.Group, 'Forest pallet must be a THREE.Group');
    assert.ok(winterMesh instanceof THREE.Group, 'Winter ice floe must be a THREE.Group');
    assert.ok(desertMesh instanceof THREE.Group, 'Desert timber raft must be a THREE.Group');
    assert.ok(neonMesh instanceof THREE.Group, 'Neon hover platform must be a THREE.Group');

    // Verify children mesh presence
    assert.ok(forestMesh.children.length > 0);
    assert.ok(winterMesh.children.length > 0);
    assert.ok(desertMesh.children.length > 0);
    assert.ok(neonMesh.children.length > 0);
  });

  it('Property 2 (InstancedDecorManager multi-biome trees and rocks): isolates instances per biome', () => {
    const decor = new InstancedDecorManager(100, 50, 20);

    decor.beginFrame();
    decor.addTree(0, 0, 0, 1, 0, 'forest');
    decor.addTree(2, 0, 0, 1, 0, 'winter');
    decor.addTree(4, 0, 0, 1, 0, 'desert');
    decor.addTree(6, 0, 0, 1, 0, 'neon');

    decor.addRock(1, 0, 0, 1, 'forest');
    decor.addRock(3, 0, 0, 1, 'winter');
    decor.addRock(5, 0, 0, 1, 'desert');
    decor.addRock(7, 0, 0, 1, 'neon');
    decor.endFrame();

    assert.strictEqual(decor.treeMeshes['forest'].count, 1);
    assert.strictEqual(decor.treeMeshes['winter'].count, 1);
    assert.strictEqual(decor.treeMeshes['desert'].count, 1);
    assert.strictEqual(decor.treeMeshes['neon'].count, 1);

    assert.strictEqual(decor.rockMeshes['forest'].count, 1);
    assert.strictEqual(decor.rockMeshes['winter'].count, 1);
    assert.strictEqual(decor.rockMeshes['desert'].count, 1);
    assert.strictEqual(decor.rockMeshes['neon'].count, 1);

    decor.clear();
    assert.strictEqual(decor.treeMeshes['forest'].count, 0);
    assert.strictEqual(decor.treeMeshes['winter'].count, 0);
    decor.dispose();
  });

  it('Property 3 (SceneManager refreshWorld method contract): purges rendered lanes, clears decor, and re-syncs', () => {
    assert.ok(typeof SceneManager.prototype.refreshWorld === 'function', 'SceneManager must expose refreshWorld method');

    let clearedDecor = false;
    let synced = false;
    const dummyGroup0 = new THREE.Group();
    const dummyGroup1 = new THREE.Group();
    const fakeScene = new THREE.Scene();
    fakeScene.add(dummyGroup0);
    fakeScene.add(dummyGroup1);

    const fakeSceneManager = {
      renderedLanes: new Map([
        [0, { group: dummyGroup0, biome: 'forest' }],
        [1, { group: dummyGroup1, biome: 'forest' }],
      ]),
      decorManager: {
        clear: () => { clearedDecor = true; },
      },
      scene: fakeScene,
      disposeHierarchy: () => {},
      cachedSkyColor: new THREE.Color(),
      fog: { color: new THREE.Color(), density: 0.01 },
      cachedFogColor: new THREE.Color(),
      ambientLight: { color: new THREE.Color(), intensity: 1 },
      cachedAmbientColor: new THREE.Color(),
      dirLight: { color: new THREE.Color(), intensity: 1 },
      cachedDirColor: new THREE.Color(),
      sync: () => { synced = true; },
    };

    const engine = new GameEngine(12345);
    engine.setBiomeOverride('winter');

    SceneManager.prototype.refreshWorld.call(fakeSceneManager as unknown as SceneManager, engine);

    assert.strictEqual(fakeSceneManager.renderedLanes.size, 0, 'Must purge renderedLanes map');
    assert.ok(clearedDecor, 'Must clear decorManager');
    assert.ok(synced, 'Must invoke sync to rebuild scene');
  });

  it('Property 4 (GameLoop onSelectWorld delegate): calls refreshWorld and preserves biome selection', () => {
    let refreshWorldCalledWith: GameEngine | null = null;
    const mockStorage = {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    };
    const engine = new GameEngine(42, mockStorage);

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

    const mockSceneMgr = {
      updatePlayerSkin: () => {},
      setMenuMode: () => {},
      clearAll: () => {},
      setRecordFlag: () => {},
      removeRecordFlag: () => {},
      sync: () => {},
      setShadowsEnabled: () => {},
      setRenderQuality: () => {},
      setScreenShakeEnabled: () => {},
      refreshWorld: (eng: GameEngine) => {
        refreshWorldCalledWith = eng;
      },
    } as unknown as SceneManager;

    const loop = new GameLoop(engine, mockSceneMgr, mockAudio, mockUi);
    const actions = loop.getUIActions();

    actions.onSelectWorld?.('winter');
    assert.strictEqual(engine.getBiomeOverride(), 'winter');
    assert.strictEqual(engine.getSelectedWorld(), 'winter');
    assert.strictEqual(refreshWorldCalledWith, engine, 'refreshWorld must be called with engine');

    actions.onSelectWorld?.('auto');
    assert.strictEqual(engine.getBiomeOverride(), null);
    assert.strictEqual(engine.getSelectedWorld(), 'auto');
  });
});
