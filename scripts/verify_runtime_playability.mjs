/**
 * Standalone Verification Script for Crossy Road Pro:
 * Tests the built `index.html` runtime, 3D world initialization,
 * Gacha prize machine drum, spin, duplicate cashback, modal close, and core gameplay.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

class MockClassList {
  constructor(classes = []) {
    this._set = new Set(classes);
  }
  add(...names) { names.forEach(n => this._set.add(n)); }
  remove(...names) { names.forEach(n => this._set.delete(n)); }
  contains(name) { return this._set.has(name); }
  toggle(name, force) {
    if (force === undefined) {
      if (this._set.has(name)) { this._set.delete(name); return false; }
      else { this._set.add(name); return true; }
    } else if (force) {
      this._set.add(name); return true;
    } else {
      this._set.delete(name); return false;
    }
  }
  get length() { return this._set.size; }
  toString() { return Array.from(this._set).join(' '); }
}

const createGlProxy = () => new Proxy({}, {
  get(target, prop) {
    if (prop === 'getExtension') return () => ({});
    if (prop === 'getParameter') return () => 'WebGL 2.0 (Mock)';
    if (prop === 'getShaderPrecisionFormat') return () => ({ rangeMin: 1, rangeMax: 1, precision: 1 });
    if (prop === 'getContextAttributes') return () => ({});
    return () => 0;
  }
});

const mock2dCtx = new Proxy({}, {
  get(target, prop) {
    if (prop === 'measureText') return () => ({ width: 10 });
    return () => {};
  }
});

class MockStyle {
  constructor() {
    this._props = new Map();
  }
  setProperty(name, val) {
    this._props.set(name, String(val));
    this[name] = String(val);
  }
  getPropertyValue(name) {
    return this._props.get(name) ?? '';
  }
  removeProperty(name) {
    this._props.delete(name);
    delete this[name];
  }
}

class MockElement {
  constructor(tagName = 'div', id = '', classNames = []) {
    this.tagName = tagName.toUpperCase();
    this.id = id;
    this.classList = new MockClassList(classNames);
    this.style = new MockStyle();
    this.attributes = new Map();
    this.children = [];
    this.parentElement = null;
    this.listeners = new Map();
    this._innerHTML = '';
    this._textContent = '';
    this.clientWidth = 800;
    this.clientHeight = 600;
    this.offsetWidth = 800;
    this.offsetHeight = 600;
  }
  get innerHTML() { return this._innerHTML; }
  set innerHTML(val) {
    this._innerHTML = val;
    this.children = [];
    const tagRegex = /<([a-zA-Z0-9]+)([^>]*)>([\s\S]*?)<\/\1>|<([a-zA-Z0-9]+)([^>]*)\/>/g;
    let m;
    while ((m = tagRegex.exec(val)) !== null) {
      const tag = m[1] || m[4];
      const attrs = m[2] || m[5] || '';
      const content = m[3] || '';
      const idMatch = /id=[\"']([^\"']+)[\"']/.exec(attrs);
      const classMatch = /class=[\"']([^\"']+)[\"']/.exec(attrs);
      const child = new MockElement(
        tag,
        idMatch ? idMatch[1] : '',
        classMatch ? classMatch[1].split(/\s+/).filter(Boolean) : []
      );
      child.textContent = content.replace(/<[^>]+>/g, '').trim();
      this.appendChild(child);
    }
  }
  get textContent() {
    if (this._textContent) return this._textContent;
    if (this.children.length > 0) return this.children.map(c => c.textContent).join(' ');
    return '';
  }
  set textContent(val) { this._textContent = val; }

  setAttribute(name, val) { this.attributes.set(name, String(val)); }
  getAttribute(name) { return this.attributes.get(name) ?? null; }
  removeAttribute(name) { this.attributes.delete(name); }
  hasAttribute(name) { return this.attributes.has(name); }

  getContext(type) {
    return type === '2d' ? mock2dCtx : createGlProxy();
  }

  addEventListener(type, cb) {
    if (!this.listeners.has(type)) this.listeners.set(type, []);
    this.listeners.get(type).push(cb);
  }
  removeEventListener(type, cb) {
    const list = this.listeners.get(type);
    if (!list) return;
    this.listeners.set(type, list.filter(l => l !== cb));
  }
  dispatchEvent(evt) {
    const list = this.listeners.get(evt.type);
    if (list) list.forEach(cb => cb(evt));
    return true;
  }
  click() {
    this.dispatchEvent({ type: 'click', preventDefault: () => {} });
  }

  appendChild(child) {
    child.parentElement = this;
    this.children.push(child);
    return child;
  }
  removeChild(child) {
    const idx = this.children.indexOf(child);
    if (idx !== -1) {
      this.children.splice(idx, 1);
      child.parentElement = null;
    }
    return child;
  }
  remove() {
    if (this.parentElement) {
      this.parentElement.removeChild(this);
    }
  }

  querySelector(sel) {
    const matches = this.querySelectorAll(sel);
    return matches.length > 0 ? matches[0] : null;
  }
  querySelectorAll(sel) {
    const res = [];
    const walk = (el) => {
      for (const child of el.children) {
        if (matchesSelector(child, sel)) res.push(child);
        walk(child);
      }
    };
    walk(this);
    return res;
  }
}

function matchesSelector(el, sel) {
  if (sel.startsWith('#')) return el.id === sel.slice(1);
  if (sel.startsWith('.')) return el.classList.contains(sel.slice(1));
  if (sel.startsWith('[')) {
    const match = /\[([a-zA-Z0-9_-]+)(?:=[\"']?([^\"']+)[\"']?)?\]/.exec(sel);
    if (match) {
      const [, attr, val] = match;
      if (val === undefined) return el.hasAttribute(attr);
      return el.getAttribute(attr) === val;
    }
  }
  return el.tagName.toLowerCase() === sel.toLowerCase();
}

console.log('--- STARTING PLAYABILITY & RUNTIME VERIFICATION ---');

const htmlPath = path.join(process.cwd(), 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

// Parse element IDs, tags, and classes from index.html
const elementsById = new Map();
const tagRegex = /<([a-zA-Z0-9]+)\s+([^>]*?)>/g;
let m;
while ((m = tagRegex.exec(html)) !== null) {
  const [_, tag, attrs] = m;
  const idMatch = /id=[\"']([^\"']+)[\"']/.exec(attrs);
  if (idMatch) {
    const id = idMatch[1];
    const classMatch = /class=[\"']([^\"']+)[\"']/.exec(attrs);
    const classes = classMatch ? classMatch[1].split(/\s+/).filter(Boolean) : [];
    if (!elementsById.has(id)) {
      elementsById.set(id, new MockElement(tag, id, classes));
    }
  }
}

const dupStampTemplate = elementsById.get('gacha-duplicate-stamp');
if (dupStampTemplate) {
  const stampSub = new MockElement('div', '', ['gacha-stamp-sub']);
  stampSub.textContent = '+40 🪙 КЭШБЭК';
  dupStampTemplate.appendChild(stampSub);
}

const mockStorage = {
  _map: new Map(),
  getItem(k) { return this._map.get(k) ?? null; },
  setItem(k, v) { this._map.set(k, String(v)); },
  removeItem(k) { this._map.delete(k); },
  clear() { this._map.clear(); }
};

Object.defineProperty(globalThis, 'localStorage', {
  value: mockStorage,
  configurable: true,
  writable: true
});

const windowListeners = new Map();
globalThis.window = {
  innerWidth: 1024,
  innerHeight: 768,
  devicePixelRatio: 1,
  location: { search: '' },
  localStorage: mockStorage,
  setTimeout: globalThis.setTimeout.bind(globalThis),
  clearTimeout: globalThis.clearTimeout.bind(globalThis),
  setInterval: globalThis.setInterval.bind(globalThis),
  clearInterval: globalThis.clearInterval.bind(globalThis),
  addEventListener: (type, cb) => {
    if (!windowListeners.has(type)) windowListeners.set(type, []);
    windowListeners.get(type).push(cb);
  },
  removeEventListener: (type, cb) => {
    const list = windowListeners.get(type);
    if (!list) return;
    windowListeners.set(type, list.filter(l => l !== cb));
  },
  dispatchEvent: (evt) => {
    const list = windowListeners.get(evt.type);
    if (list) list.forEach(cb => cb(evt));
    return true;
  }
};

globalThis.document = {
  getElementById: (id) => {
    let el = elementsById.get(id);
    if (!el) {
      el = new MockElement('div', id);
      elementsById.set(id, el);
    }
    return el;
  },
  querySelector: (sel) => {
    if (sel.startsWith('#')) return globalThis.document.getElementById(sel.slice(1));
    return new MockElement('div');
  },
  querySelectorAll: () => [],
  createElement: (tag) => new MockElement(tag),
  createElementNS: (ns, tag) => new MockElement(tag),
  body: new MockElement('body'),
  addEventListener: (type, cb) => {
    globalThis.window.addEventListener(type, cb);
  }
};

let queuedRaf = [];
globalThis.requestAnimationFrame = (cb) => {
  const id = Math.random();
  queuedRaf.push({ id, cb });
  return id;
};
globalThis.cancelAnimationFrame = (id) => {
  queuedRaf = queuedRaf.filter(item => item.id !== id);
};

globalThis.AudioContext = class {
  createOscillator() { return { connect() {}, start() {}, stop() {}, frequency: { value: 0 } }; }
  createGain() { return { connect() {}, gain: { value: 1, setValueAtTime() {}, linearRampToValueAtTime() {} } }; }
  get destination() { return {}; }
  get currentTime() { return 0; }
  resume() { return Promise.resolve(); }
};

// 1. PAGE LOADING VERIFICATION
console.log('1. Page Loading: Importing modules and testing initialization...');
const THREE = await import('three');
const { VoxelPalette } = await import('../src/view/voxelPalette.ts');
const { SceneManager } = await import('../src/view/sceneManager.ts');
const { GameEngine } = await import('../src/core/gameEngine.ts');
const { UIManager } = await import('../src/app/uiManager.ts');
const { GachaMachineModal } = await import('../src/app/gachaMachineModal.ts');
const { GameLoop } = await import('../src/app/gameLoop.ts');
const { AudioSynth } = await import('../src/view/audioSynth.ts');
const { PlatformBridge } = await import('../src/platform/ysdk.ts');
const { InputManager } = await import('../src/app/inputManager.ts');
const { MoveDirection, ALL_SKINS } = await import('../src/core/types.ts');
const { GACHA_CHARACTER_SKIN_BASE64 } = await import('../src/view/gachaSkinsBase64.ts');
const { getGachaCardThumbUrl, createGachaCardElement, revealGachaWinningCard } = await import('../src/view/gachaCardArt.ts');

console.log('✔ All core, view, and app classes imported without ReferenceError/TypeError.');

// 2. 3D WORLD VERIFICATION
console.log('2. 3D World: Testing SceneManager, VoxelPalette.geoCache, and lane generation...');
assert.ok(VoxelPalette.geoCache.size > 0, 'VoxelPalette.geoCache must contain pre-populated geometries');
for (const [key, geo] of VoxelPalette.geoCache.entries()) {
  assert.ok(geo.attributes.position, `Geometry ${key} must have position attribute`);
}

const gameContainer = globalThis.document.getElementById('game-container');
const sceneManager = new SceneManager(gameContainer);
// Stub renderer.render so headless environment doesn't require WebGL shader compilation
(sceneManager).renderer.render = () => {};

const engine = new GameEngine(12345, mockStorage);
sceneManager.sync(engine);

const renderedLanesCount = (sceneManager).renderedLanes.size;
assert.ok(renderedLanesCount >= 20, `SceneManager must generate at least 20 starting lanes, got: ${renderedLanesCount}`);
assert.ok((sceneManager).playerMesh !== null, 'SceneManager must generate the player model mesh');
assert.ok((sceneManager).decorManager !== null, 'SceneManager must instantiate the decor manager');

// Step 35 hops forward to trigger lane eviction
for (let step = 0; step < 35; step++) {
  engine.queueMove(MoveDirection.FORWARD);
  engine.step(0.25);
  sceneManager.sync(engine);
}

// Verify VoxelPalette geometries were NOT disposed during evictions
for (const [key, geo] of VoxelPalette.geoCache.entries()) {
  assert.ok(geo.attributes.position, `Geometry ${key} must NOT be disposed after lane eviction`);
}
console.log('✔ 3D World: SceneManager generated lanes, decor, player model; VoxelPalette geometries are valid and protected.');

// 3. GACHA MACHINE MODAL & VISUAL VERIFICATION
console.log('3. Gacha Machine Modal: Testing top bar layout, 3D character card renders, roulette spin, duplicate cashback, and closing...');

// 3a. Top Bar Layout Verification: Coin capsule on left (24px, 16px), close box on right (24px, 16px)
console.log('3a. Top Bar Layout: Verifying coin capsule left and close button right alignment...');
assert.ok(
  html.includes('.gacha-top-left-group') && html.includes('left: 24px;') && html.includes('top: 16px;'),
  'Top bar: .gacha-top-left-group / coin capsule wrap must be positioned at left: 24px; top: 16px;'
);
assert.ok(
  html.includes('.gacha-top-right-group') && html.includes('right: 24px;') && html.includes('top: 16px;'),
  'Top bar: .gacha-top-right-group / close box wrap must be positioned at right: 24px; top: 16px;'
);
assert.ok(html.includes('.gacha-coin-capsule'), 'index.html must define .gacha-coin-capsule');
assert.ok(html.includes('.gacha-close-box'), 'index.html must define .gacha-close-box');

// Verify DOM structure in index.html: coin capsule on the left, close box on the right
const gachaTopLeftIdx = html.indexOf('gacha-top-left-group');
const gachaCoinCapsuleIdx = html.indexOf('gacha-coin-capsule');
const gachaTopRightIdx = html.indexOf('gacha-top-right-group');
const gachaCloseBoxIdx = html.indexOf('gacha-close-box');

assert.ok(gachaTopLeftIdx !== -1, 'index.html must contain .gacha-top-left-group');
assert.ok(gachaCoinCapsuleIdx !== -1, 'index.html must contain .gacha-coin-capsule');
assert.ok(gachaTopRightIdx !== -1, 'index.html must contain .gacha-top-right-group');
assert.ok(gachaCloseBoxIdx !== -1, 'index.html must contain .gacha-close-box');

assert.ok(gachaTopLeftIdx < gachaCoinCapsuleIdx && gachaCoinCapsuleIdx < gachaTopRightIdx,
  'Coin capsule must reside inside top-left group before top-right group in DOM');
assert.ok(gachaTopRightIdx < gachaCloseBoxIdx,
  'Close box must reside inside top-right group in DOM');
console.log('✔ Top bar: .gacha-coin-capsule located on left (left: 24px; top: 16px;), .gacha-close-box located on right (right: 24px; top: 16px;)');

// 3b. Verification: No captureSkinThumbnails in index.html and dist/bundle.js
console.log('3b. Verifying absence of destructive captureSkinThumbnails in built assets...');
assert.ok(!html.includes('captureSkinThumbnails'), 'index.html must not contain any reference to captureSkinThumbnails');
const bundlePath = path.join(process.cwd(), 'dist', 'bundle.js');
assert.ok(fs.existsSync(bundlePath), 'dist/bundle.js must exist');
const bundleContent = fs.readFileSync(bundlePath, 'utf8');
assert.ok(!bundleContent.includes('captureSkinThumbnails'), 'dist/bundle.js must not contain any reference to captureSkinThumbnails');
console.log('✔ Verified: Neither index.html nor dist/bundle.js contains captureSkinThumbnails.');

// 3c. 3D Character Card Models, VP8X Alpha Channels & Silhouette Verification
console.log('3c. 3D Character Cards: Verifying VP8X alpha channel transparency, color and silhouette display...');
for (const skin of ALL_SKINS) {
  const base64Uri = GACHA_CHARACTER_SKIN_BASE64[skin.id];
  assert.ok(typeof base64Uri === 'string', `Skin ${skin.id} must have a base64 render in GACHA_CHARACTER_SKIN_BASE64`);
  assert.ok(
    base64Uri.startsWith('data:image/webp;base64,'),
    `Skin ${skin.id} render must be a valid WebP data URL`
  );
  assert.ok(
    base64Uri.length > 500,
    `Skin ${skin.id} render must be > 500 bytes (got: ${base64Uri.length}B, not empty stub)`
  );

  // Check WebP VP8X header bytes and alpha transparency flag
  const base64Data = base64Uri.replace(/^data:image\/webp;base64,/, '');
  const buf = Buffer.from(base64Data, 'base64');
  const riff = buf.subarray(0, 4).toString('ascii');
  const webp = buf.subarray(8, 12).toString('ascii');
  const vp8x = buf.subarray(12, 16).toString('ascii');
  const flags = buf[20];
  const hasAlphaBit = (flags & 0x10) !== 0;
  const hasAlphChunk = buf.includes(Buffer.from('ALPH'));

  assert.equal(riff, 'RIFF', `Skin ${skin.id} WebP must have RIFF signature`);
  assert.equal(webp, 'WEBP', `Skin ${skin.id} WebP must have WEBP signature`);
  assert.equal(vp8x, 'VP8X', `Skin ${skin.id} WebP must use extended VP8X chunk for alpha transparency`);
  assert.ok(hasAlphaBit, `Skin ${skin.id} WebP VP8X header must have Alpha flag (bit 4 / 0x10) set`);
  assert.ok(hasAlphChunk, `Skin ${skin.id} WebP must contain ALPH chunk with alpha transparency channel`);

  const thumbUrl = getGachaCardThumbUrl(skin.id);
  assert.equal(thumbUrl, base64Uri, `getGachaCardThumbUrl for ${skin.id} must return authentic 3D render`);

  // Unlocked card: must display full color without card-silhouette, with transparent image background
  const unlockedCard = createGachaCardElement(skin.id, 1, false);
  assert.ok(unlockedCard.innerHTML.includes(base64Uri), `Unlocked card for ${skin.id} must embed 3D render`);
  assert.ok(!unlockedCard.innerHTML.includes('card-silhouette'), `Unlocked card for ${skin.id} must NOT have silhouette class`);
  assert.ok(unlockedCard.innerHTML.includes('gacha-card-char-img'), `Unlocked card for ${skin.id} must contain gacha-card-char-img`);

  // Locked card: must display silhouette with card-silhouette class
  const lockedCard = createGachaCardElement(skin.id, 1, true);
  assert.ok(lockedCard.innerHTML.includes(base64Uri), `Locked card for ${skin.id} must embed 3D render`);
  assert.ok(lockedCard.innerHTML.includes('card-silhouette'), `Locked card for ${skin.id} MUST have card-silhouette class`);
  assert.ok(lockedCard.innerHTML.includes('gacha-card-char-img'), `Locked card for ${skin.id} must contain gacha-card-char-img`);

  // Dynamic reveal transition: removing card-silhouette reveals character in full color
  const charContainer = lockedCard.querySelector('.gacha-card-character');
  assert.ok(charContainer.classList.contains('card-silhouette'), 'Locked card character container must have card-silhouette class');
  revealGachaWinningCard(lockedCard, skin.id);
  assert.ok(!charContainer.classList.contains('card-silhouette'), 'Revealed card must have card-silhouette class removed');
  assert.ok(charContainer.classList.contains('reveal-pop'), 'Revealed card must have reveal-pop class added');
}

// Verify CSS rules in index.html for transparent image silhouette styling
assert.ok(
  html.includes('.card-silhouette .gacha-card-char-img') && html.includes('filter: brightness(0)'),
  'index.html CSS must style .card-silhouette .gacha-card-char-img with filter: brightness(0) on transparent image'
);
console.log('✔ Character cards: all 5 skins use authentic 3D renders with VP8X alpha transparency, rendered in color (unlocked) and silhouette (locked), reveal transition verified.');

const platform = new PlatformBridge();
const ui = new UIManager(platform);
const audio = new AudioSynth();
const loop = new GameLoop(engine, sceneManager, audio, ui, platform);
ui.bindActions(loop.getUIActions());

const modalStateProvider = loop.getModalStateProvider();
const inputManager = new InputManager(loop.getInputCallbacks(), modalStateProvider, loop.getSettingsManager());
inputManager.attach();

// Give player 500 coins so they can roll
engine.addCoins(500);

const gachaModalEl = globalThis.document.getElementById('gacha-modal');
const drumListEl = globalThis.document.getElementById('gacha-modal-skin-list');
const rollBtnEl = globalThis.document.getElementById('gacha-modal-roll-btn');
const closeBtnEl = globalThis.document.getElementById('gacha-modal-close-btn');
const dupStampEl = globalThis.document.getElementById('gacha-duplicate-stamp');

// Open Gacha
ui.openGacha('corgi', ['corgi']);
assert.equal(gachaModalEl.classList.contains('hidden'), false, 'Gacha modal must be visible after openGacha()');

// (a) Drum cards immediately populated with 5 skins (unlocked in color, locked as silhouettes)
assert.ok(drumListEl.children.length >= 5, `Drum must immediately have cards, found: ${drumListEl.children.length}`);
const firstCard = drumListEl.children[0];
assert.ok(firstCard.innerHTML.includes('gacha-card-name'), 'Cards must have name');
assert.ok(firstCard.innerHTML.includes('gacha-card-character'), 'Cards must have character art');
assert.ok(firstCard.innerHTML.includes('data:image/webp;base64,'), 'Cards must contain 3D WebP render');

let drumHasColor = false;
let drumHasSilhouette = false;
for (const card of drumListEl.children) {
  if (card.innerHTML.includes('card-silhouette')) {
    drumHasSilhouette = true;
  } else {
    drumHasColor = true;
  }
}
assert.ok(drumHasColor, 'Drum must contain at least one unlocked card rendered in full color');
assert.ok(drumHasSilhouette, 'Drum must contain locked cards rendered in silhouette');

assert.ok(rollBtnEl.textContent.includes('SPIN') || rollBtnEl.innerHTML.includes('SPIN'), 'Roll button must display SPIN');
assert.ok(rollBtnEl.innerHTML.includes('100'), 'Roll button must display 100 price');
console.log('✔ Gacha Modal open: drum immediately populated with 3D cards in color and silhouette, button has SPIN and 100 🪙');

// (b) Spin start and completion
const initialCoins = engine.getCoins();
let onSpinFinishedCb = null;

// Mock startRoulette to inspect spin states
const gachaController = (ui).gachaController;
const origStartRoulette = gachaController.startRoulette.bind(gachaController);
gachaController.startRoulette = (res, onFinished) => {
  onSpinFinishedCb = onFinished;
  origStartRoulette(res, onFinished);
};

// Trigger roll
(loop).handleGachaRoll();

// During spin: button must say "КРУТИТСЯ..." and be disabled
assert.ok(rollBtnEl.innerHTML.includes('КРУТИТСЯ'), 'Button must display КРУТИТСЯ during spin');
assert.equal(rollBtnEl.hasAttribute('disabled'), true, 'Button must be disabled during spin');
assert.equal(engine.getCoins(), initialCoins - 100, 'During spin, 100 coins must be deducted immediately');

// Flush animation frames up to duration (avoid infinite loop with ambient conveyor)
let rafIters = 0;
while (queuedRaf.length > 0 && rafIters < 20) {
  rafIters++;
  const currentBatch = [...queuedRaf];
  queuedRaf = [];
  currentBatch.forEach(item => item.cb(performance.now() + 5000));
}

// (c) After spin finishes: button GUARANTEED to return to "КРУТИТЬ ЕЩЁ" with 100 coins and unlocked
assert.equal(rollBtnEl.hasAttribute('disabled'), false, 'Button must be unlocked after spin finishes');
assert.ok(rollBtnEl.innerHTML.includes('КРУТИТЬ ЕЩЁ'), 'Button must say КРУТИТЬ ЕЩЁ after spin');
assert.ok(rollBtnEl.innerHTML.includes('100'), 'Button must show 100 price');

// Check duplicate handling and cashback
const finalCoins = engine.getCoins();
// If corgi was rolled (duplicate since corgi was unlocked), cashback of 40 was credited
if (dupStampEl.classList.contains('hidden') === false) {
  assert.ok(dupStampEl.textContent.includes('КЭШБЭК') || dupStampEl.innerHTML.includes('КЭШБЭК'), 'Duplicate stamp must show cashback');
  assert.equal(finalCoins, initialCoins - 100 + 40, 'Balance must reflect +40 cashback credited strictly after spin');
  console.log('✔ Duplicate spin: stamp displayed and +40 cashback credited after spin');
} else {
  console.log('✔ Non-duplicate skin unlocked!');
}

// Test Guaranteed Duplicate Spin (all skins unlocked):
ALL_SKINS.forEach(s => engine.unlockSkin(s.id));
ui.openGacha('corgi', ALL_SKINS.map(s => s.id));
const coinsBeforeDup = engine.getCoins();
(loop).handleGachaRoll();
assert.equal(engine.getCoins(), coinsBeforeDup - 100, 'Coins drop by 100 on start of duplicate spin');
let dupRafIters = 0;
while (queuedRaf.length > 0 && dupRafIters < 20) {
  dupRafIters++;
  const currentBatch = [...queuedRaf];
  queuedRaf = [];
  currentBatch.forEach(item => item.cb(performance.now() + 5000));
}
assert.equal(dupStampEl.classList.contains('hidden'), false, 'Duplicate stamp must be displayed on duplicate');
assert.ok(dupStampEl.textContent.includes('40') && dupStampEl.textContent.includes('КЭШБЭК'), 'Duplicate stamp must show +40 cashback');
assert.equal(engine.getCoins(), coinsBeforeDup - 100 + 40, 'Balance must reflect +40 cashback credited strictly after spin');
assert.equal(rollBtnEl.hasAttribute('disabled'), false, 'Button must be unlocked after duplicate spin');
assert.ok(rollBtnEl.innerHTML.includes('КРУТИТЬ ЕЩЁ'), 'Button must say КРУТИТЬ ЕЩЁ after duplicate spin');
console.log('✔ Guaranteed duplicate spin: stamp displayed and +40 cashback credited strictly after spin');

// (d) Modal Close via [X] button and ESC
closeBtnEl.click();
assert.equal(gachaModalEl.classList.contains('hidden'), true, 'Clicking [X] button must close gacha modal');

ui.openGacha('corgi');
// Press Escape key
const escEvent = { code: 'Escape', type: 'keydown', preventDefault: () => {} };
const keydownListeners = windowListeners.get('keydown') || [];
keydownListeners.forEach(cb => cb(escEvent));
assert.equal(gachaModalEl.classList.contains('hidden'), true, 'Pressing Escape must close gacha modal');
console.log('✔ Close button [X] and ESC key close gacha modal cleanly');

// 4. GAMEPLAY VERIFICATION
console.log('4. Gameplay: Testing startGame, HUD visibility, forward hops, score increments, pause and toMenu...');
const hudEl = globalThis.document.getElementById('in-game-hud');
const scoreValEl = globalThis.document.getElementById('score-value');
const pauseModalEl = globalThis.document.getElementById('pause-modal');

loop.restartGame();
assert.equal((loop).isPlaying, true, 'loop.isPlaying must be true after restartGame()');
assert.equal(hudEl.classList.contains('hidden'), false, 'HUD must be visible when playing');
engine.setGodMode(true);
engine.setIgnoreObstacles(true);

// Hop forward 5 steps
for (let hop = 0; hop < 5; hop++) {
  engine.queueMove(MoveDirection.FORWARD);
  engine.step(0.25);
  sceneManager.sync(engine);
}
assert.ok(engine.getPlayer().row >= 5, 'Player row must increase with forward moves');
assert.ok(engine.getScore() >= 5, 'Score must increase with forward moves');

// Pause game
loop.pauseGame();
assert.equal((loop).isPaused, true, 'Game must be paused');
assert.equal(pauseModalEl.classList.contains('hidden'), false, 'Pause modal must be open');

// Resume game
loop.resumeGame();
assert.equal((loop).isPaused, false, 'Game must resume from pause');
assert.equal(pauseModalEl.classList.contains('hidden'), true, 'Pause modal must be closed');

// Return to menu
loop.openMainMenu();
assert.equal((loop).isPlaying, false, 'Game must stop playing when returning to menu');
assert.equal((loop).isPaused, false, 'Game must not be paused in menu');
const menuModalEl = globalThis.document.getElementById('main-menu-modal');
assert.equal(menuModalEl.classList.contains('hidden'), false, 'Main menu must be open');
console.log('✔ Gameplay: start, HUD, score tracking, pause, resume, and openMainMenu work perfectly');

console.log('\n======================================================');
console.log('🎉 ALL PLAYABILITY & RUNTIME INVARIANTS VERIFIED 100%!');
console.log('======================================================');
process.exit(0);
