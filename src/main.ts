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
const settingMusicToggle = document.getElementById('setting-music-toggle') as HTMLInputElement | null;
const settingsCloseBtn = document.getElementById('settings-close-btn')!;
const toastContainerEl = document.getElementById('toast-container');

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
const leaderboardNameInput = document.getElementById('leaderboard-name-input') as HTMLInputElement | null;
const leaderboardSaveNameBtn = document.getElementById('leaderboard-save-name-btn');
const leaderboardRowsEl = document.getElementById('leaderboard-rows');

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
let runStartHighScore = engine.getHighScore();
let notifiedNewHighScoreThisRun = false;
let settingsReturnTo: 'menu' | 'pause' = 'menu';

const unlockedAchievements = new Set<string>(
  JSON.parse(localStorage.getItem('crossy_road_pro_achievements_v1') || '[]')
);

function showToast(icon: string, title: string, desc: string): void {
  if (!toastContainerEl) return;
  const item = document.createElement('div');
  item.className = 'toast-item';
  item.innerHTML = `<div class="toast-icon">${icon}</div><div><div class="toast-title">${title}</div><div class="toast-desc">${desc}</div></div>`;
  toastContainerEl.appendChild(item);
  setTimeout(() => { item.remove(); }, 3600);
}

function unlockAchievement(id: string, icon: string, title: string, desc: string): void {
  if (unlockedAchievements.has(id)) return;
  unlockedAchievements.add(id);
  localStorage.setItem('crossy_road_pro_achievements_v1', JSON.stringify(Array.from(unlockedAchievements)));
  showToast(icon, `Достижение: ${title}`, desc);
}

// Background Music Controller (delegates to AudioSynth if supported, with WebAudio fallback)
const audioAny = audio as unknown as Record<string, unknown>;
let musicEnabled = typeof audioAny.isMusicEnabled === 'function'
  ? Boolean((audioAny.isMusicEnabled as () => boolean)())
  : localStorage.getItem('crossy_setting_music') !== 'false';
let bgmInterval: number | null = null;
let bgmNoteIdx = 0;
const BGM_NOTES = [261.63, 329.63, 392.0, 523.25, 392.0, 329.63, 293.66, 349.23];

function syncBackgroundMusic(): void {
  if (typeof audioAny.setMusicEnabled === 'function') {
    (audioAny.setMusicEnabled as (v: boolean) => void)(musicEnabled);
    return;
  }
  if (bgmInterval !== null) {
    window.clearInterval(bgmInterval);
    bgmInterval = null;
  }
  if (!musicEnabled || !audio.isSoundEnabled()) return;
  bgmInterval = window.setInterval(() => {
    if (!isPlaying || isPaused || !musicEnabled || !audio.isSoundEnabled()) return;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = (audio as unknown as { ctx?: AudioContext }).ctx;
    if (!ctx || ctx.state !== 'running') return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(BGM_NOTES[bgmNoteIdx % BGM_NOTES.length], ctx.currentTime);
    bgmNoteIdx += 1;
    gain.gain.setValueAtTime(0.035, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.002, ctx.currentTime + 0.28);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  }, 340);
}

if (settingSoundToggle) {
  settingSoundToggle.checked = audio.isSoundEnabled();
  settingSoundToggle.addEventListener('change', () => {
    audio.setSoundEnabled(settingSoundToggle.checked);
    syncBackgroundMusic();
  });
}

if (settingMusicToggle) {
  settingMusicToggle.checked = musicEnabled;
  settingMusicToggle.addEventListener('change', () => {
    musicEnabled = settingMusicToggle.checked;
    localStorage.setItem('crossy_setting_music', String(musicEnabled));
    syncBackgroundMusic();
  });
}
syncBackgroundMusic();

const tracker = engine.getScoreTracker();
let playerName = tracker.getPlayerName() || 'Игрок';
if (leaderboardNameInput) leaderboardNameInput.value = playerName;

function recordRunToLeaderboard(score: number): void {
  if (score <= 0) return;
  const runRes = tracker.recordRun(score);
  if (runRes.overtakenBots.length > 0) {
    showToast('🏁', 'Соперник позади!', `Вы обошли: ${runRes.overtakenBots.slice(0, 2).join(', ')}`);
  }
  for (const ach of tracker.getAchievements()) {
    if (ach.unlocked) {
      unlockAchievement(ach.id, ach.badge, ach.title, ach.description);
    }
  }
}

function renderLeaderboardUI(): void {
  if (!leaderboardRowsEl) return;
  const entries = tracker.getLeaderboard();
  leaderboardRowsEl.innerHTML = entries
    .slice(0, 8)
    .map((entry) => {
      const skinMeta = ALL_SKINS.find((s) => s.id === entry.skinId);
      const badge = skinMeta?.badge ?? (entry.isBot ? '🤖' : '👤');
      return `
      <div class="lb-row ${!entry.isBot ? 'current-player' : ''}">
        <span>#${entry.rank} ${!entry.isBot ? '(Вы)' : ''}</span>
        <span>${badge} ${entry.playerName}</span>
        <span>${entry.score}</span>
      </div>
    `;
    })
    .join('');
}

if (leaderboardSaveNameBtn && leaderboardNameInput) {
  leaderboardSaveNameBtn.addEventListener('click', () => {
    const clean = leaderboardNameInput.value.trim().slice(0, 18) || 'Игрок';
    playerName = clean;
    leaderboardNameInput.value = clean;
    tracker.setPlayerName(clean);
    renderLeaderboardUI();
    showToast('👤', 'Профиль обновлён', `Имя игрока сохранено: ${clean}`);
  });
}

function updateMenuStats(): void {
  if (menuHighScoreEl) menuHighScoreEl.textContent = String(engine.getHighScore());
  if (menuCoinsEl) menuCoinsEl.textContent = String(engine.getCoins());
  if (leaderboardBestScoreEl) leaderboardBestScoreEl.textContent = String(engine.getHighScore());
  renderLeaderboardUI();
}

const UI_SKIN_RARITY: Record<string, { label: string; css: string }> = {
  chicken: { label: 'Обычный', css: 'rarity-common' },
  cyber_duck: { label: 'Редкий', css: 'rarity-rare' },
  shadow_ninja: { label: 'Эпический', css: 'rarity-epic' },
  frost_penguin: { label: 'Легендарный', css: 'rarity-legendary' },
};

function renderSkinsUI(): void {
  const unlocked = engine.getUnlockedSkins();
  const active = engine.getSelectedSkin();

  if (gachaModalSkinListEl) {
    gachaModalSkinListEl.innerHTML = '';
    ALL_SKINS.forEach((skin) => {
      const isUnlocked = unlocked.includes(skin.id);
      const rarity = UI_SKIN_RARITY[skin.id] ?? { label: 'Эпический', css: 'rarity-epic' };
      const card = document.createElement('div');
      card.className = `gacha-skin-card ${active === skin.id ? 'active' : ''} ${isUnlocked ? '' : 'locked'}`;
      card.innerHTML = `
        <div class="rarity-badge ${rarity.css}">${rarity.label}</div>
        <div class="gacha-skin-badge">${isUnlocked ? skin.badge : '🔒'}</div>
        <div class="gacha-skin-name">${isUnlocked ? skin.name : 'Секретный скин'}</div>
        <div class="gacha-skin-tag">${active === skin.id ? 'ВЫБРАН' : isUnlocked ? 'ДОСТУПЕН' : 'ЗАКРЫТ'}</div>
      `;
      if (isUnlocked) {
        card.addEventListener('click', () => {
          if (engine.selectSkin(skin.id)) {
            audio.playSkinVoice(skin.id);
            renderSkinsUI();
          }
        });
      }
      gachaModalSkinListEl.appendChild(card);
    });
  }

  if (gachaModalCoinsEl) gachaModalCoinsEl.textContent = String(engine.getCoins());
  if (gachaModalRollBtn) {
    gachaModalRollBtn.textContent = `Крутить за ${WORLD_CONFIG.GACHA_COST} 🪙`;
    (gachaModalRollBtn as HTMLButtonElement).disabled = false;
  }
  updateMenuStats();
}

function handleGachaRoll(): void {
  const res = engine.rollGacha();
  if (res.success && res.skinId) {
    audio.playGachaRoll();
    const isRare = res.rarity === 'Legendary' || res.rarity === 'Epic';
    audio.playGachaUnlock(isRare);
    const meta = ALL_SKINS.find((s) => s.id === res.skinId);
    const rarity = UI_SKIN_RARITY[res.skinId] ?? { label: 'Эпический', css: 'rarity-epic' };
    if (res.isDuplicate) {
      const msg = `♻ Дубликат ${meta?.badge ?? ''} ${meta?.name}! Кэшбэк +${res.cashback ?? 40} 🪙`;
      if (gachaModalStatusEl) gachaModalStatusEl.textContent = msg;
      showToast('🪙', 'Кэшбэк за дубликат!', `+${res.cashback ?? 40} монет возвращено на баланс`);
    } else {
      const msg = `🎉 Выбит скин (${rarity.label}): ${meta?.badge ?? ''} ${meta?.name ?? res.skinId}!`;
      if (gachaModalStatusEl) gachaModalStatusEl.textContent = msg;
      showToast(meta?.badge ?? '🎰', `Новый скин (${rarity.label})!`, `Открыт ${meta?.name ?? res.skinId}`);
    }
    unlockAchievement('gacha_first', '🎰', 'Испытатель удачи', 'Выбит первый скин в Гача-автомате!');
    if (engine.getUnlockedSkins().length >= ALL_SKINS.length) {
      unlockAchievement('gacha_all', '👑', 'Полная коллекция', 'Собраны все воксельные скины!');
    }
    lastCoins = engine.getCoins();
    renderSkinsUI();
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
  runStartHighScore = engine.getHighScore();
  notifiedNewHighScoreThisRun = false;
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
  const targetRow = engine.getPlayer().row + (dir === MoveDirection.FORWARD ? 1 : dir === MoveDirection.BACKWARD ? -1 : 0);
  const lane = engine.getLane(targetRow);
  let surface: 'grass' | 'road' | 'log' | 'rail' = 'grass';
  if (lane.type === 'ROAD') surface = 'road';
  else if (lane.type === 'RIVER') surface = 'log';
  else if (lane.type === 'RAILWAY') surface = 'rail';

  if (engine.queueMove(dir)) {
    audio.playHop(engine.getComboMultiplier(), surface);
    audio.playSkinVoice(engine.getSelectedSkin());
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
    if (document.activeElement === leaderboardNameInput) {
      if (e.code === 'Enter' && leaderboardSaveNameBtn) {
        e.preventDefault();
        leaderboardSaveNameBtn.click();
        leaderboardNameInput?.blur();
      } else if (e.code === 'Escape') {
        leaderboardNameInput?.blur();
      }
      return;
    }
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
  sceneManager.sync(engine, dt);

  const currentCoins = engine.getCoins();
  if (currentCoins > lastCoins) {
    audio.playCoin();
    lastCoins = currentCoins;
    if (currentCoins >= 25) unlockAchievement('coin_25', '🪙', 'Нумизмат', 'Собрано 25 монет!');
    if (currentCoins >= 100) unlockAchievement('coin_100', '💰', 'Готов к Гаче', 'Накоплено 100 монет на прокрут!');
    renderSkinsUI();
  }

  const currentScore = engine.getScore();
  if (isPlaying && currentScore > 0) {
    if (currentScore > runStartHighScore && runStartHighScore > 0 && !notifiedNewHighScoreThisRun) {
      notifiedNewHighScoreThisRun = true;
      audio.playNewHighScore();
      showToast('🏆', 'Новый рекорд!', `Вы побили прошлый рекорд (${runStartHighScore})!`);
    }
    if (currentScore >= 15) unlockAchievement('score_15', '🐣', 'Первые шаги', 'Набрано 15 очков за забег!');
    if (currentScore >= 50) unlockAchievement('score_50', '🔥', 'Мастер трассы', 'Набрано 50 очков за забег!');
    if (currentScore >= 100) unlockAchievement('score_100', '👑', 'Легенда перекрёстков', 'Набрано 100 очков!');
    if (engine.getComboMultiplier() >= 3) unlockAchievement('combo_3', '⚡', 'Комбо x3', 'Максимальный темп прыжков!');
  }

  if (scoreEl) scoreEl.textContent = String(currentScore);
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
    recordRunToLeaderboard(currentScore);
    sceneManager.spawnDeathFeathers(p.x, 0, p.row, p.deathReason);
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
