import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { VoxelPalette } from '../src/view/voxelPalette.ts';
import { SceneManager } from '../src/view/sceneManager.ts';
import { GameEngine } from '../src/core/gameEngine.ts';
import { GachaMachineModal } from '../src/app/gachaMachineModal.ts';
import { InputManager } from '../src/app/inputManager.ts';
import { MoveDirection, type StorageAdapter, ALL_SKINS } from '../src/core/types.ts';
import { GACHA_CHARACTER_SKIN_BASE64 } from '../src/view/gachaSkinsBase64.ts';
import { getGachaCardThumbUrl, createGachaCardElement } from '../src/view/gachaCardArt.ts';

class MockClassList {
  private set = new Set<string>();
  add(...names: string[]) { names.forEach((n) => this.set.add(n)); }
  remove(...names: string[]) { names.forEach((n) => this.set.delete(n)); }
  contains(name: string) { return this.set.has(name); }
}

class MockStyle {
  [key: string]: unknown;
  setProperty(k: string, v: string) {
    this[k] = v;
  }
}

const elementMap = new Map<string, MockElement>();

class MockElement {
  private _id = '';
  tagName: string;
  classList = new MockClassList();
  style = new MockStyle();
  children: MockElement[] = [];
  parentElement: MockElement | null = null;
  attributes = new Map<string, string>();
  listeners = new Map<string, Array<(e: unknown) => void>>();
  private _innerHTML = '';
  textContent = '';
  clientWidth = 800;
  clientHeight = 600;

  get id(): string { return this._id; }
  set id(val: string) {
    this._id = val;
    if (val) elementMap.set(val, this);
  }

  get className(): string { return Array.from((this.classList as unknown as { set: Set<string> }).set).join(' '); }
  set className(val: string) {
    (this.classList as unknown as { set: Set<string> }).set.clear();
    val.split(/\s+/).filter(Boolean).forEach((c) => this.classList.add(c));
  }

  constructor(tagName = 'div', id = '') {
    this.tagName = tagName.toUpperCase();
    if (id) this.id = id;
  }
  get innerHTML(): string { return this._innerHTML; }
  set innerHTML(val: string) {
    this._innerHTML = val;
    this.children = [];
    const tagRegex = /<([a-zA-Z0-9]+)([^>]*)>([\s\S]*?)<\/\1>|<([a-zA-Z0-9]+)([^>]*)\/>/g;
    let m: RegExpExecArray | null;
    while ((m = tagRegex.exec(val)) !== null) {
      const tag = m[1] || m[4];
      const attrs = m[2] || m[5] || '';
      const content = m[3] || '';
      const idMatch = /id=["']([^"']+)["']/.exec(attrs);
      const classMatch = /class=["']([^"']+)["']/.exec(attrs);
      const child = new MockElement(tag, idMatch ? idMatch[1] : '');
      if (classMatch) classMatch[1].split(/\s+/).filter(Boolean).forEach((c) => child.classList.add(c));
      child.textContent = content.replace(/<[^>]+>/g, '').trim();
      this.appendChild(child as unknown as HTMLElement);
    }
  }
  setAttribute(name: string, val: string) { this.attributes.set(name, String(val)); }
  getAttribute(name: string) { return this.attributes.get(name) ?? null; }
  removeAttribute(name: string) { this.attributes.delete(name); }
  hasAttribute(name: string) { return this.attributes.has(name); }
  addEventListener(type: string, cb: (e: unknown) => void) {
    if (!this.listeners.has(type)) this.listeners.set(type, []);
    this.listeners.get(type)!.push(cb);
  }
  dispatchEvent(evt: { type: string; preventDefault?: () => void }) {
    this.listeners.get(evt.type)?.forEach((cb) => cb(evt));
  }
  click() { this.dispatchEvent({ type: 'click', preventDefault: () => {} }); }
  appendChild(child: HTMLElement) {
    const c = child as unknown as MockElement;
    c.parentElement = this;
    this.children.push(c);
    return child;
  }
  append(...nodes: (HTMLElement | MockElement)[]) {
    for (const node of nodes) this.appendChild(node as unknown as HTMLElement);
  }
  remove() {
    if (this.parentElement) {
      const idx = this.parentElement.children.indexOf(this);
      if (idx !== -1) this.parentElement.children.splice(idx, 1);
    }
  }
  querySelector(sel: string): MockElement | null {
    const matches = this.querySelectorAll(sel);
    return matches.length > 0 ? matches[0] : null;
  }
  querySelectorAll(sel: string): MockElement[] {
    const res: MockElement[] = [];
    const walk = (el: MockElement) => {
      for (const child of el.children) {
        if (sel.startsWith('.') && child.classList.contains(sel.slice(1))) res.push(child);
        else if (sel.startsWith('#') && child.id === sel.slice(1)) res.push(child);
        walk(child);
      }
    };
    walk(this);
    return res;
  }
  getContext() {
    return new Proxy({}, {
      get: (_, prop) => {
        if (prop === 'getParameter') return () => 'WebGL 2.0 (Mock)';
        if (prop === 'getExtension') return () => ({});
        if (prop === 'getShaderPrecisionFormat') return () => ({ rangeMin: 1, rangeMax: 1, precision: 1 });
        return () => 0;
      },
    });
  }
}

const mockDoc = {
  elements: elementMap,
  body: new MockElement('body'),
  createElement(tag: string) { return new MockElement(tag) as unknown as HTMLElement; },
  createElementNS(_ns: string, tag: string) { return new MockElement(tag) as unknown as HTMLElement; },
  getElementById(id: string) {
    let el = this.elements.get(id);
    if (!el) { el = new MockElement('div', id); this.elements.set(id, el); }
    return el as unknown as HTMLElement;
  },
  querySelector(sel: string) {
    if (sel.startsWith('#')) return this.getElementById(sel.slice(1));
    return new MockElement('div') as unknown as HTMLElement;
  },
  querySelectorAll() { return []; },
};

let queuedRaf: ((time: number) => void)[] = [];
(globalThis as unknown as { requestAnimationFrame: unknown }).requestAnimationFrame = (cb: (time: number) => void) => {
  queuedRaf.push(cb);
  return Math.random();
};
(globalThis as unknown as { cancelAnimationFrame: unknown }).cancelAnimationFrame = (id: number) => {
  queuedRaf = [];
};

(globalThis as unknown as { document: unknown }).document = mockDoc;
(globalThis as unknown as { window: unknown }).window = {
  innerWidth: 1024,
  innerHeight: 768,
  devicePixelRatio: 1,
  addEventListener: () => {},
  removeEventListener: () => {},
};

class MemoryStorage implements StorageAdapter {
  private map = new Map<string, string>();
  getItem(key: string): string | null { return this.map.get(key) ?? null; }
  setItem(key: string, value: string): void { this.map.set(key, value); }
  removeItem(key: string): void { this.map.delete(key); }
}

describe('Runtime Playability & Regression Verification Suite', () => {
  it('Regression 1 (3D World & Voxel Cache Protection): VoxelPalette.geoCache holds valid non-disposed geometries through lane eviction and clearAll', () => {
    assert.ok(VoxelPalette.geoCache.size > 0, 'VoxelPalette.geoCache must have pre-populated standard geometries');
    for (const [key, geo] of VoxelPalette.geoCache.entries()) {
      assert.ok(geo.attributes.position, `Geometry ${key} must have valid position attribute`);
    }

    const dummyContainer = new MockElement('div', 'container') as unknown as HTMLElement;
    const sceneManager = new SceneManager(dummyContainer);
    (sceneManager as unknown as { renderer: { render: () => void } }).renderer.render = () => {};

    const storage = new MemoryStorage();
    const engine = new GameEngine(777, storage);
    sceneManager.sync(engine);

    const initialLanes = (sceneManager as unknown as { renderedLanes: Map<number, unknown> }).renderedLanes.size;
    assert.ok(initialLanes >= 20, 'SceneManager must generate starting lanes (eliminating blue screen)');
    assert.ok((sceneManager as unknown as { playerMesh: unknown }).playerMesh !== null, 'Player model must be created');

    for (let step = 0; step < 40; step++) {
      engine.queueMove(MoveDirection.FORWARD);
      engine.step(0.25);
      sceneManager.sync(engine);
    }

    for (const [key, geo] of VoxelPalette.geoCache.entries()) {
      assert.ok(geo.attributes.position, `Geometry ${key} must NOT be disposed after lane evictions`);
    }

    sceneManager.clearAll();
    sceneManager.sync(engine);
    for (const [key, geo] of VoxelPalette.geoCache.entries()) {
      assert.ok(geo.attributes.position, `Geometry ${key} must NOT be disposed after clearAll()`);
    }
  });

  it('Regression 2 (Drum Immediate Cards & Silhouettes): openGacha immediately populates drum cards with colors and silhouettes', () => {
    const modal = document.createElement('div');
    modal.id = 'gacha-modal';
    const skinList = document.createElement('div');
    skinList.id = 'gacha-modal-skin-list';
    const rollBtn = document.createElement('button');
    rollBtn.id = 'gacha-modal-roll-btn';
    const closeBtn = document.createElement('button');
    closeBtn.id = 'gacha-modal-close-btn';

    modal.appendChild(skinList);
    modal.appendChild(rollBtn);
    modal.appendChild(closeBtn);
    document.body.appendChild(modal);

    const gacha = new GachaMachineModal({
      onRoll: () => {},
      onClose: () => {},
      onSelectAndPlay: () => {},
      onTick: () => {},
    });

    gacha.open('corgi', ['corgi']);
    assert.equal(gacha.isOpen(), true, 'Modal must report isOpen() == true');
    assert.ok(skinList.children.length >= 5, 'Drum must be immediately populated with cards upon opening');
    assert.ok(rollBtn.innerHTML.includes('SPIN'), 'Roll button must display SPIN upon initial opening');
    assert.ok(rollBtn.innerHTML.includes('100'), 'Roll button must display price 100 🪙');

    const cards = Array.from(skinList.children);
    const silhouetteCards = cards.filter((c) => (c as unknown as MockElement).innerHTML.includes('card-silhouette'));
    const unlockedCards = cards.filter((c) => !(c as unknown as MockElement).innerHTML.includes('card-silhouette'));
    assert.ok(silhouetteCards.length > 0, 'Locked skins must have silhouette class');
    assert.ok(unlockedCards.length > 0, 'Unlocked corgi must NOT have silhouette class');

    gacha.close();
    assert.equal(gacha.isOpen(), false, 'Modal must report isOpen() == false after close()');
    modal.remove();
  });

  it('Regression 3 (Guaranteed Button Recovery & Cashback Post-Spin): roulette completion unlocks button to КРУТИТЬ ЕЩЁ 100 and credits cashback', () => {
    const modal = document.createElement('div');
    modal.id = 'gacha-modal';
    const skinList = document.createElement('div');
    skinList.id = 'gacha-modal-skin-list';
    const rollBtn = document.createElement('button');
    rollBtn.id = 'gacha-modal-roll-btn';
    const dupStamp = document.createElement('div');
    dupStamp.id = 'gacha-duplicate-stamp';
    dupStamp.className = 'hidden';
    const dupSub = document.createElement('div');
    dupSub.className = 'gacha-stamp-sub';
    dupStamp.appendChild(dupSub);

    modal.append(skinList, rollBtn, dupStamp);
    document.body.appendChild(modal);

    const gacha = new GachaMachineModal({
      onRoll: () => {},
      onClose: () => {},
      onSelectAndPlay: () => {},
      onTick: () => {},
    });

    gacha.open('corgi', ['corgi']);
    let spinFinishedCalled = false;
    gacha.startRoulette({ skinId: 'corgi', isDuplicate: true, cashback: 40 }, () => {
      spinFinishedCalled = true;
    });

    assert.equal(rollBtn.hasAttribute('disabled'), true, 'Button must be disabled while spinning');
    assert.ok(rollBtn.innerHTML.includes('КРУТИТСЯ'), 'Button must display КРУТИТСЯ while spinning');

    let iters = 0;
    while (queuedRaf.length > 0 && iters < 20) {
      iters++;
      const batch = [...queuedRaf];
      queuedRaf = [];
      batch.forEach((cb) => cb(performance.now() + 5000));
    }

    assert.equal(spinFinishedCalled, true, 'onFinished callback must be invoked');
    assert.equal(rollBtn.hasAttribute('disabled'), false, 'Button must be unlocked after spin finishes');
    assert.ok(rollBtn.innerHTML.includes('КРУТИТЬ ЕЩЁ'), 'Button must display КРУТИТЬ ЕЩЁ after spin');
    assert.ok(rollBtn.innerHTML.includes('100'), 'Button must show price 100 🪙');

    assert.equal((dupStamp as unknown as MockElement).classList.contains('hidden'), false, 'Duplicate stamp must be displayed on duplicate');
    assert.ok(dupSub.textContent?.includes('+40 🪙 КЭШБЭК'), 'Cashback amount must be shown in stamp sub');

    gacha.setUnlockedSkins(['corgi']);
    assert.ok(rollBtn.innerHTML.includes('КРУТИТЬ ЕЩЁ'), 'Button must remain КРУТИТЬ ЕЩЁ even after setUnlockedSkins');
    assert.equal((dupStamp as unknown as MockElement).classList.contains('hidden'), false, 'Duplicate stamp must remain visible');

    modal.remove();
  });

  it('Regression 4 (Modal Exit via [X] Button and Escape Key): click and ESC cleanly close gacha modal', () => {
    let closeModalTriggered = 0;
    const inputCallbacks = {
      onMove: () => {},
      onStartGame: () => {},
      onPauseGame: () => {},
      onResumeGame: () => {},
      onRestartGame: () => {},
      onToMenu: () => {},
      onGachaRoll: () => {},
      onCloseModal: () => { closeModalTriggered++; },
    };

    let gachaOpen = true;
    const modalState = {
      isSettingsOpen: () => false,
      isPauseOpen: () => false,
      isMainMenuOpen: () => false,
      isGachaOpen: () => gachaOpen,
      isLeaderboardOpen: () => false,
      isGameOverOpen: () => false,
      isPlaying: () => false,
    };

    const input = new InputManager(inputCallbacks, modalState);
    input.handleKeyDown({ code: 'Escape', preventDefault: () => {} } as KeyboardEvent);
    assert.equal(closeModalTriggered, 1, 'Pressing Escape when Gacha is open must trigger onCloseModal');

    const modal = document.createElement('div');
    modal.id = 'gacha-modal';
    const closeBtn = document.createElement('button');
    closeBtn.id = 'gacha-modal-close-btn';
    modal.appendChild(closeBtn);
    document.body.appendChild(modal);

    let gachaClosed = false;
    const gacha = new GachaMachineModal({
      onRoll: () => {},
      onClose: () => { gachaClosed = true; },
      onSelectAndPlay: () => {},
      onTick: () => {},
    });

    gacha.open('corgi');
    assert.equal((modal as unknown as MockElement).classList.contains('hidden'), false);

    closeBtn.click();
    assert.equal(gachaClosed, true, 'Clicking close button must trigger onClose');
    assert.equal((modal as unknown as MockElement).classList.contains('hidden'), true, 'Modal must have hidden class after click');
    modal.remove();
  });

  it('Regression 5 (Top Bar Layout Alignment): .gacha-coin-capsule located at left: 24px; top: 16px; and .gacha-close-box at right: 24px; top: 16px;', () => {
    const htmlPath = path.join(process.cwd(), 'index.html');
    const html = fs.readFileSync(htmlPath, 'utf8');

    assert.ok(
      html.includes('.gacha-top-left-group') && html.includes('left: 24px;') && html.includes('top: 16px;'),
      'CSS must style .gacha-top-left-group with left: 24px; top: 16px;'
    );
    assert.ok(
      html.includes('.gacha-top-right-group') && html.includes('right: 24px;') && html.includes('top: 16px;'),
      'CSS must style .gacha-top-right-group with right: 24px; top: 16px;'
    );
    assert.ok(html.includes('.gacha-coin-capsule'), 'index.html must include .gacha-coin-capsule');
    assert.ok(html.includes('.gacha-close-box'), 'index.html must include .gacha-close-box');

    const topLeftIdx = html.indexOf('gacha-top-left-group');
    const coinCapsuleIdx = html.indexOf('gacha-coin-capsule');
    const topRightIdx = html.indexOf('gacha-top-right-group');
    const closeBoxIdx = html.indexOf('gacha-close-box');

    assert.ok(topLeftIdx !== -1 && coinCapsuleIdx !== -1, 'Top left group and coin capsule must exist');
    assert.ok(topRightIdx !== -1 && closeBoxIdx !== -1, 'Top right group and close box must exist');
    assert.ok(topLeftIdx < coinCapsuleIdx && coinCapsuleIdx < topRightIdx, 'Coin capsule must reside on left before top-right group');
    assert.ok(topRightIdx < closeBoxIdx, 'Close box must reside on right');
  });

  it('Regression 6 (3D Character Card Models): all 5 skins use real 3D WebP renders (>500B) in color and silhouette', () => {
    for (const skin of ALL_SKINS) {
      const uri = GACHA_CHARACTER_SKIN_BASE64[skin.id];
      assert.ok(typeof uri === 'string', `Skin ${skin.id} must exist in GACHA_CHARACTER_SKIN_BASE64`);
      assert.ok(uri.startsWith('data:image/webp;base64,'), `Skin ${skin.id} must be WebP data URL`);
      assert.ok(uri.length > 500, `Skin ${skin.id} render must be > 500 bytes (got: ${uri.length}B)`);

      const thumbUrl = getGachaCardThumbUrl(skin.id);
      assert.equal(thumbUrl, uri, `Thumb URL for ${skin.id} must match GACHA_CHARACTER_SKIN_BASE64`);

      // Unlocked card (full color)
      const unlocked = createGachaCardElement(skin.id, 1, false);
      assert.ok(unlocked.innerHTML.includes(uri), `Unlocked card must contain 3D image`);
      assert.ok(!unlocked.innerHTML.includes('card-silhouette'), `Unlocked card must NOT have silhouette class`);

      // Locked card (silhouette)
      const locked = createGachaCardElement(skin.id, 1, true);
      assert.ok(locked.innerHTML.includes(uri), `Locked card must contain 3D image`);
      assert.ok(locked.innerHTML.includes('card-silhouette'), `Locked card MUST have silhouette class`);
    }
  });
});

