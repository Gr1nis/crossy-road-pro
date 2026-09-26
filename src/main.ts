import { GameEngine } from './core/gameEngine.ts';
import { ALL_SKINS, DeathReason, MoveDirection, WORLD_CONFIG, type SkinId } from './core/types.ts';
import { AudioSynth } from './view/audioSynth.ts';
import { SceneManager } from './view/sceneManager.ts';

const container = document.getElementById('game-container')!;
const scoreEl = document.getElementById('score-value')!;
const coinsEl = document.getElementById('coins-value')!;
const pauseBtn = document.getElementById('pause-btn')!;
const warningVignetteEl = document.getElementById('warning-vignette');

// Main Menu Elements
const mainMenuModal = document.getElementById('main-menu-modal')!;
const menuPlayBtn = document.getElementById('menu-play-btn')!;
const menuGachaBtn = document.getElementById('menu-gacha-btn')!;
const menuLeaderboardBtn = document.getElementById('menu-leaderboard-btn')!;
const menuSettingsBtn = document.getElementById('menu-settings-btn')!;
const menuHighScoreEl = document.getElementById('menu-high-score')!;
const menuCoinsEl = document.getElementById('menu-coins')!;

// Pause Modal Elements
const pauseModal = document.getElementById('pause-modal')!;
const pauseResumeBtn = document.getElementById('pause-resume-btn')!;
const pauseSettingsBtn = document.getElementById('pause-settings-btn')!;
const pauseMenuBtn = document.getElementById('pause-menu-btn')!;

// Settings Modal Elements
const settingsModal = document.getElementById('settings-modal')!;
const settingSoundToggle = document.getElementById('setting-sound-toggle') as HTMLInputElement | null;
const settingsCloseBtn = document.getElementById('settings-close-btn')!;

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

// Game Over Modal Elements
const gameOverModal = document.getElementById('game-over-modal')!;
const deathReasonEl = document.getElementById('death-reason')!;
const restartBtn = document.getElementById('restart-btn')!;
const toMenuBtn = document.getElementById('to-menu-btn')!;

const urlSeed = Number(new URLSearchParams(window.location.search).get('seed'));
const initialSeed = Number.isFinite(urlSeed) && urlSeed > 0 ? urlSeed : Date.now();

const engine = new GameEngine(initialSeed, window.localStorage);
const sceneManager = new SceneManager(container);
const audio = new AudioSynth();

let isPlaying = false;
let isPaused = false;
let wasDead = false;
let lastCoins = engine.getCoins();
let settingsReturnTo: 'menu' | 'pause' = 'menu';

if (settingSoundToggle) {
  settingSoundToggle.checked = audio.isSoundEnabled();
  settingSoundToggle.addEventListener('change', () => {
    audio.setSoundEnabled(settingSoundToggle.checked);
  });
}

function updateMenuStats(): void {
  if (menuHighScoreEl) menuHighScoreEl.textContent = String(engine.getHighScore());
  if (menuCoinsEl) menuCoinsEl.textContent = String(engine.getCoins());
  if (leaderboardBestScoreEl) leaderboardBestScoreEl.textContent = String(engine.getHighScore());
}

function renderSkinsUI(): void {
  const unlocked = engine.getUnlockedSkins();
  const active = engine.getSelectedSkin();
  const remaining = ALL_SKINS.length - unlocked.length;

  if (gachaModalSkinListEl) {
    gachaModalSkinListEl.innerHTML = '';
    ALL_SKINS.forEach((skin) => {
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
    if (gachaModalStatusEl) gachaModalStatusEl.textContent = msg;
    lastCoins = engine.getCoins();
    renderSkinsUI();
  } else if (res.reason === 'ALL_UNLOCKED') {
    const msg = '✨ Вы уже собрали все 4 скина!';
    if (gachaModalStatusEl) gachaModalStatusEl.textContent = msg;
  } else {
    const msg = `Нужно ${WORLD_CONFIG.GACHA_COST} 🪙 (сейчас: ${engine.getCoins()} 🪙)`;
    if (gachaModalStatusEl) gachaModalStatusEl.textContent = msg;
  }
}

if (gachaModalRollBtn) gachaModalRollBtn.addEventListener('click', handleGachaRoll);

function openMainMenu(): void {
  isPlaying = false;
  isPaused = false;
  mainMenuModal.classList.remove('hidden');
  pauseModal.classList.add('hidden');
  gameOverModal.classList.add('hidden');
  gachaModal.classList.add('hidden');
  leaderboardModal.classList.add('hidden');
  settingsModal.classList.add('hidden');
  updateMenuStats();
}

function startGame(): void {
  mainMenuModal.classList.add('hidden');
  pauseModal.classList.add('hidden');
  gameOverModal.classList.add('hidden');
  gachaModal.classList.add('hidden');
  leaderboardModal.classList.add('hidden');
  settingsModal.classList.add('hidden');
  wasDead = false;
  isPaused = false;
  sceneManager.clearAll();
  engine.reset(Date.now());
  lastCoins = engine.getCoins();
  isPlaying = true;
  renderSkinsUI();
}

function pauseGame(): void {
  if (!isPlaying || engine.getPlayer().isDead || isPaused) return;
  isPaused = true;
  pauseModal.classList.remove('hidden');
}

function resumeGame(): void {
  if (!isPaused) return;
  isPaused = false;
  pauseModal.classList.add('hidden');
  lastTime = performance.now();
}

function openSettings(from: 'menu' | 'pause'): void {
  settingsReturnTo = from;
  settingsModal.classList.remove('hidden');
}

function closeSettings(): void {
  settingsModal.classList.add('hidden');
  if (settingsReturnTo === 'pause') {
    pauseModal.classList.remove('hidden');
  } else {
    mainMenuModal.classList.remove('hidden');
  }
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

if (menuSettingsBtn) {
  menuSettingsBtn.addEventListener('click', () => openSettings('menu'));
}

if (pauseBtn) pauseBtn.addEventListener('click', pauseGame);
if (pauseResumeBtn) pauseResumeBtn.addEventListener('click', resumeGame);
if (pauseSettingsBtn) pauseSettingsBtn.addEventListener('click', () => {
  pauseModal.classList.add('hidden');
  openSettings('pause');
});
if (pauseMenuBtn) pauseMenuBtn.addEventListener('click', openMainMenu);

if (settingsCloseBtn) settingsCloseBtn.addEventListener('click', closeSettings);

if (toMenuBtn) toMenuBtn.addEventListener('click', openMainMenu);
if (restartBtn) restartBtn.addEventListener('click', startGame);

function triggerMove(dir: typeof MoveDirection[keyof typeof MoveDirection]): void {
  if (!isPlaying || isPaused || engine.getPlayer().isDead) return;
  if (engine.queueMove(dir)) {
    audio.playHop(engine.getComboMultiplier());
  }
}

window.addEventListener('keydown', (e) => {
  // If settings modal is open
  if (!settingsModal.classList.contains('hidden')) {
    if (e.code === 'Escape' || e.code === 'Enter') {
      e.preventDefault();
      closeSettings();
    }
    return;
  }

  // If pause modal is open
  if (!pauseModal.classList.contains('hidden')) {
    if (e.code === 'Escape' || e.code === 'KeyP' || e.code === 'Space' || e.code === 'Enter') {
      e.preventDefault();
      resumeGame();
    }
    return;
  }

  // If in game, Escape or 'P' toggles pause
  if (isPlaying && !engine.getPlayer().isDead) {
    if (e.code === 'Escape' || e.code === 'KeyP') {
      e.preventDefault();
      pauseGame();
      return;
    }
  }

  // If Main Menu is open
  if (!mainMenuModal.classList.contains('hidden')) {
    if (e.code === 'Space' || e.code === 'Enter') {
      e.preventDefault();
      startGame();
    }
    return;
  }

  // If Gacha modal is open
  if (!gachaModal.classList.contains('hidden')) {
    if (e.code === 'Escape') {
      gachaModal.classList.add('hidden');
    } else if (e.code === 'KeyG' || e.code === 'Enter') {
      handleGachaRoll();
    }
    return;
  }

  // If Leaderboard modal is open
  if (!leaderboardModal.classList.contains('hidden')) {
    if (e.code === 'Escape' || e.code === 'Enter') {
      leaderboardModal.classList.add('hidden');
    }
    return;
  }

  // Game over state
  if (engine.getPlayer().isDead) {
    if (e.code === 'Space' || e.code === 'Enter') {
      startGame();
    } else if (e.code === 'Escape') {
      openMainMenu();
    }
    return;
  }

  // Active gameplay movement
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

  if (isPlaying && !isPaused) {
    engine.step(dt);
  }
  sceneManager.sync(engine);

  const currentCoins = engine.getCoins();
  if (currentCoins > lastCoins) {
    audio.playCoin();
    lastCoins = currentCoins;
    renderSkinsUI();
  }

  if (scoreEl) scoreEl.textContent = String(engine.getScore());
  if (coinsEl) coinsEl.textContent = String(currentCoins);

  if (warningVignetteEl) {
    if (isPlaying && !isPaused && !engine.getPlayer().isDead) {
      const graceRatio = engine.getCameraGraceRatio();
      warningVignetteEl.style.opacity = graceRatio > 0 ? String(0.3 + graceRatio * 0.7) : '0';
    } else {
      warningVignetteEl.style.opacity = '0';
    }
  }

  const p = engine.getPlayer();
  if (isPlaying && p.isDead && !wasDead) {
    wasDead = true;
    if (p.deathReason === DeathReason.WATER) {
      audio.playSplash();
    } else {
      audio.playCrash();
      sceneManager.triggerShake(p.deathReason === DeathReason.TRAIN ? 0.9 : 0.45);
    }
    if (deathReasonEl) deathReasonEl.textContent = DEATH_LABELS[p.deathReason] ?? 'Игра окончена';
    if (gameOverModal) gameOverModal.classList.remove('hidden');
    updateMenuStats();
  }

  requestAnimationFrame(animate);
}

// Initial state: show Main Menu
renderSkinsUI();
openMainMenu();
requestAnimationFrame(animate);
