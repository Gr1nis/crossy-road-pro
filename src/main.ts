import { GameEngine } from './core/gameEngine.ts';
import { ALL_SKINS, DeathReason, MoveDirection, WORLD_CONFIG, type SkinId } from './core/types.ts';
import { AudioSynth } from './view/audioSynth.ts';
import { SceneManager } from './view/sceneManager.ts';

const container = document.getElementById('game-container')!;
const scoreEl = document.getElementById('score-value')!;
const highScoreEl = document.getElementById('high-score-value')!;
const coinsEl = document.getElementById('coins-value')!;
const comboEl = document.getElementById('combo-value')!;
const gachaBtn = document.getElementById('gacha-btn')!;
const gachaStatusEl = document.getElementById('gacha-status')!;
const skinListEl = document.getElementById('skin-list')!;
const gameOverModal = document.getElementById('game-over-modal')!;
const deathReasonEl = document.getElementById('death-reason')!;
const restartBtn = document.getElementById('restart-btn')!;

const urlSeed = Number(new URLSearchParams(window.location.search).get('seed'));
const initialSeed = Number.isFinite(urlSeed) && urlSeed > 0 ? urlSeed : Date.now();

const engine = new GameEngine(initialSeed, window.localStorage);
const sceneManager = new SceneManager(container);
const audio = new AudioSynth();

let wasDead = false;
let lastCoins = engine.getCoins();

function renderSkinsUI(): void {
  const unlocked = engine.getUnlockedSkins();
  const active = engine.getSelectedSkin();
  skinListEl.innerHTML = '';

  ALL_SKINS.forEach((skin, idx) => {
    const isUnlocked = unlocked.includes(skin.id);
    const btn = document.createElement('button');
    btn.className = `skin-btn ${active === skin.id ? 'active' : ''} ${isUnlocked ? '' : 'locked'}`;
    btn.textContent = isUnlocked ? `${skin.badge} ${skin.name} [${idx + 1}]` : `🔒 ???`;
    btn.disabled = !isUnlocked;
    btn.addEventListener('click', () => {
      if (engine.selectSkin(skin.id)) {
        audio.playCoin();
        renderSkinsUI();
      }
    });
    skinListEl.appendChild(btn);
  });

  const remaining = ALL_SKINS.length - unlocked.length;
  gachaBtn.textContent =
    remaining > 0 ? `🎰 Гача (${WORLD_CONFIG.GACHA_COST} 🪙) [G]` : '✨ Все скины открыты!';
}

function handleGachaRoll(): void {
  const res = engine.rollGacha();
  if (res.success && res.skinId) {
    audio.playGacha();
    const meta = ALL_SKINS.find((s) => s.id === res.skinId);
    gachaStatusEl.textContent = `🎉 Выбит новый скин: ${meta?.badge ?? ''} ${meta?.name ?? res.skinId}!`;
    lastCoins = engine.getCoins();
    renderSkinsUI();
  } else if (res.reason === 'ALL_UNLOCKED') {
    gachaStatusEl.textContent = '✨ Вы уже собрали все 4 скина!';
  } else {
    gachaStatusEl.textContent = `Нужно ${WORLD_CONFIG.GACHA_COST} 🪙 (сейчас: ${engine.getCoins()} 🪙)`;
  }
}

gachaBtn.addEventListener('click', handleGachaRoll);
renderSkinsUI();

function triggerMove(dir: typeof MoveDirection[keyof typeof MoveDirection]): void {
  if (engine.getPlayer().isDead) return;
  if (engine.queueMove(dir)) {
    audio.playHop(engine.getComboMultiplier());
  }
}

window.addEventListener('keydown', (e) => {
  if (e.code === 'KeyG') {
    e.preventDefault();
    handleGachaRoll();
    return;
  }
  if (['Digit1', 'Digit2', 'Digit3', 'Digit4'].includes(e.code)) {
    const idx = Number(e.code.replace('Digit', '')) - 1;
    const skin = ALL_SKINS[idx];
    if (skin && engine.selectSkin(skin.id as SkinId)) {
      audio.playCoin();
      renderSkinsUI();
    }
    return;
  }

  if (engine.getPlayer().isDead) {
    if (e.code === 'Space' || e.code === 'Enter') {
      restartGame();
    }
    return;
  }

  switch (e.code) {
    case 'KeyW':
    case 'ArrowUp':
    case 'Space':
      e.preventDefault();
      triggerMove(MoveDirection.FORWARD);
      break;
    case 'KeyS':
    case 'ArrowDown':
      e.preventDefault();
      triggerMove(MoveDirection.BACKWARD);
      break;
    case 'KeyA':
    case 'ArrowLeft':
      e.preventDefault();
      triggerMove(MoveDirection.LEFT);
      break;
    case 'KeyD':
    case 'ArrowRight':
      e.preventDefault();
      triggerMove(MoveDirection.RIGHT);
      break;
  }
});

function restartGame(): void {
  wasDead = false;
  gameOverModal.classList.add('hidden');
  sceneManager.clearAll();
  engine.reset(Date.now());
  lastCoins = engine.getCoins();
  renderSkinsUI();
}

restartBtn.addEventListener('click', restartGame);

const DEATH_LABELS: Record<string, string> = {
  [DeathReason.CAR]: 'Вас сбил автомобиль на трассе!',
  [DeathReason.TRAIN]: 'Вас снёс скоростной экспресс на переезде!',
  [DeathReason.WATER]: 'Вы упали в бурную реку!',
  [DeathReason.OUT_OF_BOUNDS]: 'Бревно унесло вас за край карты!',
  [DeathReason.CAMERA_BEHIND]: 'Вы слишком долго стояли на месте!',
};

let lastTime = performance.now();

function animate(now: number): void {
  const dt = Math.min((now - lastTime) / 1000, 0.1);
  lastTime = now;

  engine.step(dt);
  sceneManager.sync(engine);

  const currentCoins = engine.getCoins();
  if (currentCoins > lastCoins) {
    audio.playCoin();
    lastCoins = currentCoins;
    renderSkinsUI();
  }

  scoreEl.textContent = String(engine.getScore());
  highScoreEl.textContent = String(engine.getHighScore());
  coinsEl.textContent = String(currentCoins);
  const mult = engine.getComboMultiplier();
  comboEl.textContent = `x${mult}`;
  comboEl.style.color = mult >= 3 ? '#f43f5e' : mult === 2 ? '#fbbf24' : '#38bdf8';

  const p = engine.getPlayer();
  if (p.isDead && !wasDead) {
    wasDead = true;
    if (p.deathReason === DeathReason.WATER) {
      audio.playSplash();
    } else {
      audio.playCrash();
      sceneManager.triggerShake(p.deathReason === DeathReason.TRAIN ? 0.9 : 0.45);
    }
    deathReasonEl.textContent = DEATH_LABELS[p.deathReason] ?? 'Игра окончена';
    gameOverModal.classList.remove('hidden');
  }

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
