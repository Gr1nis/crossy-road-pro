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
const toMenuBtn = document.getElementById('to-menu-btn')!;

// Main Menu Elements
const mainMenuModal = document.getElementById('main-menu-modal')!;
const menuPlayBtn = document.getElementById('menu-play-btn')!;
const menuGachaBtn = document.getElementById('menu-gacha-btn')!;
const menuLeaderboardBtn = document.getElementById('menu-leaderboard-btn')!;
const menuHighScoreEl = document.getElementById('menu-high-score')!;
const menuCoinsEl = document.getElementById('menu-coins')!;

// Gacha Modal Elements
const gachaModal = document.getElementById('gacha-modal')!;
const gachaModalRollBtn = document.getElementById('gacha-modal-roll-btn')!;
const gachaModalCloseBtn = document.getElementById('gacha-modal-close-btn')!;
const gachaModalCoinsEl = document.getElementById('gacha-modal-coins')!;
const gachaModalStatusEl = document.getElementById('gacha-modal-status')!;
const gachaModalSkinListEl = document.getElementById('gacha-modal-skin-list')!;

// Leaderboard Modal Elements
const leaderboardModal = document.getElementById('leaderboard-modal')!;
const leaderboardCloseBtn = document.getElementById('leaderboard-close-btn')!;
const leaderboardBestScoreEl = document.getElementById('leaderboard-best-score')!;

const urlSeed = Number(new URLSearchParams(window.location.search).get('seed'));
const initialSeed = Number.isFinite(urlSeed) && urlSeed > 0 ? urlSeed : Date.now();

const engine = new GameEngine(initialSeed, window.localStorage);
const sceneManager = new SceneManager(container);
const audio = new AudioSynth();

let isPlaying = false;
let wasDead = false;
let lastCoins = engine.getCoins();

function updateMenuStats(): void {
  if (menuHighScoreEl) menuHighScoreEl.textContent = String(engine.getHighScore());
  if (menuCoinsEl) menuCoinsEl.textContent = String(engine.getCoins());
  if (leaderboardBestScoreEl) leaderboardBestScoreEl.textContent = String(engine.getHighScore());
}

function renderSkinsUI(): void {
  const unlocked = engine.getUnlockedSkins();
  const active = engine.getSelectedSkin();
  const remaining = ALL_SKINS.length - unlocked.length;
  const gachaText = remaining > 0 ? `🎰 Гача (${WORLD_CONFIG.GACHA_COST} 🪙) [G]` : '✨ Все скины открыты!';

  // HUD panel skin list
  if (skinListEl) {
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
  }

  if (gachaBtn) gachaBtn.textContent = gachaText;

  // Gacha modal skin list
  if (gachaModalSkinListEl) {
    gachaModalSkinListEl.innerHTML = '';
    ALL_SKINS.forEach((skin, idx) => {
      const isUnlocked = unlocked.includes(skin.id);
      const card = document.createElement('div');
      card.className = `gacha-skin-card ${active === skin.id ? 'active' : ''} ${isUnlocked ? '' : 'locked'}`;
      card.innerHTML = `
        <div class="gacha-skin-badge">${isUnlocked ? skin.badge : '🔒'}</div>
        <div class="gacha-skin-name">${isUnlocked ? skin.name : 'Секретный скин'}</div>
        <div class="gacha-skin-tag">${active === skin.id ? 'ВЫБРАН' : isUnlocked ? 'ДОСТУПЕН' : 'ЗАКРЫТ'}</div>
      `;
      if (isUnlocked) {
        card.addEventListener('click', () => {
          if (engine.selectSkin(skin.id)) {
            audio.playCoin();
            renderSkinsUI();
          }
        });
      }
      gachaModalSkinListEl.appendChild(card);
    });
  }

  if (gachaModalCoinsEl) gachaModalCoinsEl.textContent = String(engine.getCoins());
  if (gachaModalRollBtn) {
    gachaModalRollBtn.textContent = remaining > 0 ? `Крутить за ${WORLD_CONFIG.GACHA_COST} 🪙` : 'Все скины собраны!';
    (gachaModalRollBtn as HTMLButtonElement).disabled = remaining === 0;
  }
  updateMenuStats();
}

function handleGachaRoll(): void {
  const res = engine.rollGacha();
  if (res.success && res.skinId) {
    audio.playGacha();
    const meta = ALL_SKINS.find((s) => s.id === res.skinId);
    const msg = `🎉 Выбит новый скин: ${meta?.badge ?? ''} ${meta?.name ?? res.skinId}!`;
    if (gachaStatusEl) gachaStatusEl.textContent = msg;
    if (gachaModalStatusEl) gachaModalStatusEl.textContent = msg;
    lastCoins = engine.getCoins();
    renderSkinsUI();
  } else if (res.reason === 'ALL_UNLOCKED') {
    const msg = '✨ Вы уже собрали все 4 скина!';
    if (gachaStatusEl) gachaStatusEl.textContent = msg;
    if (gachaModalStatusEl) gachaModalStatusEl.textContent = msg;
  } else {
    const msg = `Нужно ${WORLD_CONFIG.GACHA_COST} 🪙 (сейчас: ${engine.getCoins()} 🪙)`;
    if (gachaStatusEl) gachaStatusEl.textContent = msg;
    if (gachaModalStatusEl) gachaModalStatusEl.textContent = msg;
  }
}

if (gachaBtn) gachaBtn.addEventListener('click', handleGachaRoll);
if (gachaModalRollBtn) gachaModalRollBtn.addEventListener('click', handleGachaRoll);

function openMainMenu(): void {
  isPlaying = false;
  mainMenuModal.classList.remove('hidden');
  gameOverModal.classList.add('hidden');
  gachaModal.classList.add('hidden');
  leaderboardModal.classList.add('hidden');
  updateMenuStats();
}

function startGame(): void {
  mainMenuModal.classList.add('hidden');
  gameOverModal.classList.add('hidden');
  gachaModal.classList.add('hidden');
  leaderboardModal.classList.add('hidden');
  wasDead = false;
  sceneManager.clearAll();
  engine.reset(Date.now());
  lastCoins = engine.getCoins();
  isPlaying = true;
  renderSkinsUI();
}

if (menuPlayBtn) menuPlayBtn.addEventListener('click', startGame);

if (menuGachaBtn) {
  menuGachaBtn.addEventListener('click', () => {
    if (gachaModalStatusEl) gachaModalStatusEl.textContent = `1 прокрут = ${WORLD_CONFIG.GACHA_COST} монет`;
    gachaModal.classList.remove('hidden');
    renderSkinsUI();
  });
}

if (gachaModalCloseBtn) {
  gachaModalCloseBtn.addEventListener('click', () => {
    gachaModal.classList.add('hidden');
  });
}

if (menuLeaderboardBtn) {
  menuLeaderboardBtn.addEventListener('click', () => {
    leaderboardModal.classList.remove('hidden');
    updateMenuStats();
  });
}

if (leaderboardCloseBtn) {
  leaderboardCloseBtn.addEventListener('click', () => {
    leaderboardModal.classList.add('hidden');
  });
}

if (toMenuBtn) toMenuBtn.addEventListener('click', openMainMenu);

function triggerMove(dir: typeof MoveDirection[keyof typeof MoveDirection]): void {
  if (!isPlaying || engine.getPlayer().isDead) return;
  if (engine.queueMove(dir)) {
    audio.playHop(engine.getComboMultiplier());
  }
}

window.addEventListener('keydown', (e) => {
  // If modals are open, handle escape or space
  if (!mainMenuModal.classList.contains('hidden')) {
    if (e.code === 'Space' || e.code === 'Enter') {
      e.preventDefault();
      startGame();
    }
    return;
  }

  if (!gachaModal.classList.contains('hidden')) {
    if (e.code === 'Escape') {
      gachaModal.classList.add('hidden');
    } else if (e.code === 'KeyG' || e.code === 'Enter') {
      handleGachaRoll();
    }
    return;
  }

  if (!leaderboardModal.classList.contains('hidden')) {
    if (e.code === 'Escape' || e.code === 'Enter') {
      leaderboardModal.classList.add('hidden');
    }
    return;
  }

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
      startGame();
    } else if (e.code === 'Escape') {
      openMainMenu();
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

if (restartBtn) restartBtn.addEventListener('click', startGame);

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

  if (isPlaying) {
    engine.step(dt);
  }
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
  if (isPlaying && p.isDead && !wasDead) {
    wasDead = true;
    if (p.deathReason === DeathReason.WATER) {
      audio.playSplash();
    } else {
      audio.playCrash();
      sceneManager.triggerShake(p.deathReason === DeathReason.TRAIN ? 0.9 : 0.45);
    }
    deathReasonEl.textContent = DEATH_LABELS[p.deathReason] ?? 'Игра окончена';
    gameOverModal.classList.remove('hidden');
    updateMenuStats();
  }

  requestAnimationFrame(animate);
}

// Initial state: show Main Menu
renderSkinsUI();
openMainMenu();
requestAnimationFrame(animate);
