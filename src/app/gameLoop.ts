import { GameEngine } from '../core/gameEngine.ts';
import { ALL_SKINS, DeathReason, MoveDirection, WORLD_CONFIG, type MoveDirectionValue, type SkinId } from '../core/types.ts';
import { AudioSynth } from '../view/audioSynth.ts';
import { SceneManager } from '../view/sceneManager.ts';
import { UIManager, UI_SKIN_RARITY, type UIActions } from './uiManager.ts';
import { type InputCallbacks, type ModalStateProvider } from './inputManager.ts';

const DEATH_LABELS: Record<string, string> = {
  [DeathReason.CAR]: 'Вас сбил автомобиль на трассе!',
  [DeathReason.TRAIN]: 'Вас снёс скоростной экспресс на переезде!',
  [DeathReason.WATER]: 'Вы упали в бурную реку!',
  [DeathReason.OUT_OF_BOUNDS]: 'Бревно унесло вас за край карты!',
  [DeathReason.CAMERA_BEHIND]: 'Вы слишком долго стояли на месте!',
};

export class GameLoop {
  public isPlaying = false;
  public isPaused = false;
  public wasDead = false;

  private readonly engine: GameEngine;
  private readonly sceneManager: SceneManager;
  private readonly audio: AudioSynth;
  private readonly ui: UIManager;

  private lastCoins: number;
  private runStartHighScore: number;
  private notifiedNewHighScoreThisRun = false;
  private lastTime = 0;
  private readonly unlockedAchievements = new Set<string>();

  constructor(
    engine: GameEngine,
    sceneManager: SceneManager,
    audio: AudioSynth,
    ui: UIManager
  ) {
    this.engine = engine;
    this.sceneManager = sceneManager;
    this.audio = audio;
    this.ui = ui;
    this.animate = this.animate.bind(this);
    this.lastCoins = this.engine.getCoins();
    this.runStartHighScore = this.engine.getHighScore();

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem('crossy_road_pro_achievements_v1');
        if (raw) {
          const arr = JSON.parse(raw);
          if (Array.isArray(arr)) {
            arr.forEach((id: string) => this.unlockedAchievements.add(id));
          }
        }
      } catch {
        // Safe fallback for corrupted storage
      }
    }

    this.ui.setSoundToggle(this.audio.isSoundEnabled());
    this.ui.setMusicToggle(this.audio.isMusicEnabled());
    const playerName = this.engine.getScoreTracker().getPlayerName() || 'Игрок';
    this.ui.setPlayerName(playerName);
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public start(): void {
    this.lastTime = performance.now();
    requestAnimationFrame(this.animate);
  }

  public startGame(): void {
    this.ui.hideAllModals();
    this.wasDead = false;
    this.isPaused = false;
    this.runStartHighScore = this.engine.getHighScore();
    this.notifiedNewHighScoreThisRun = false;
    this.sceneManager.clearAll();
    this.engine.reset(Date.now());
    this.lastCoins = this.engine.getCoins();
    this.isPlaying = true;
    this.lastTime = performance.now();
    this.renderSkinsUI();
    this.syncBackgroundMusic();
  }

  public pauseGame(): void {
    if (!this.isPlaying || this.engine.getPlayer().isDead || this.isPaused) return;
    this.isPaused = true;
    this.ui.openPause();
    this.syncBackgroundMusic();
  }

  public resumeGame(): void {
    if (!this.isPaused) return;
    this.isPaused = false;
    this.ui.closePause();
    this.lastTime = performance.now();
    this.syncBackgroundMusic();
  }

  public openMainMenu(): void {
    this.isPlaying = false;
    this.isPaused = false;
    this.ui.openMainMenu();
    this.updateMenuStats();
    this.syncBackgroundMusic();
  }

  public triggerMove(dir: MoveDirectionValue): void {
    if (!this.isPlaying || this.isPaused || this.engine.getPlayer().isDead) return;
    const targetRow = this.engine.getPlayer().row + (dir === MoveDirection.FORWARD ? 1 : dir === MoveDirection.BACKWARD ? -1 : 0);
    const lane = this.engine.getLane(targetRow);
    let surface: 'grass' | 'road' | 'log' | 'rail' = 'grass';
    if (lane.type === 'ROAD') surface = 'road';
    else if (lane.type === 'RIVER') surface = 'log';
    else if (lane.type === 'RAILWAY') surface = 'rail';

    if (this.engine.queueMove(dir)) {
      this.audio.playHop(this.engine.getComboMultiplier(), surface);
      this.audio.playSkinVoice(this.engine.getSelectedSkin());
    }
  }

  public handleGachaRoll(): void {
    const res = this.engine.rollGacha();
    if (res.success && res.skinId) {
      this.audio.playGachaRoll();
      const isRare = res.rarity === 'Legendary' || res.rarity === 'Epic';
      this.audio.playGachaUnlock(isRare);
      const meta = ALL_SKINS.find((s) => s.id === res.skinId);
      const rarity = UI_SKIN_RARITY[res.skinId] ?? { label: 'Эпический', css: 'rarity-epic' };
      if (res.isDuplicate) {
        const msg = `♻ Дубликат ${meta?.badge ?? ''} ${meta?.name}! Кэшбэк +${res.cashback ?? 40} 🪙`;
        this.ui.updateGachaStatus(msg);
        this.ui.showToast('🪙', 'Кэшбэк за дубликат!', `+${res.cashback ?? 40} монет возвращено на баланс`);
      } else {
        const msg = `🎉 Выбит скин (${rarity.label}): ${meta?.badge ?? ''} ${meta?.name ?? res.skinId}!`;
        this.ui.updateGachaStatus(msg);
        this.ui.showToast(meta?.badge ?? '🎰', `Новый скин (${rarity.label})!`, `Открыт ${meta?.name ?? res.skinId}`);
      }
      this.unlockAchievement('gacha_first', '🎰', 'Испытатель удачи', 'Выбит первый скин в Гача-автомате!');
      if (this.engine.getUnlockedSkins().length >= ALL_SKINS.length) {
        this.unlockAchievement('gacha_all', '👑', 'Полная коллекция', 'Собраны все воксельные скины!');
      }
      this.lastCoins = this.engine.getCoins();
      this.renderSkinsUI();
    } else {
      const msg = `Нужно ${WORLD_CONFIG.GACHA_COST} 🪙 (сейчас: ${this.engine.getCoins()} 🪙)`;
      this.ui.updateGachaStatus(msg);
    }
  }

  public savePlayerName(name: string): void {
    const clean = name.trim().slice(0, 18) || 'Игрок';
    this.engine.getScoreTracker().setPlayerName(clean);
    this.ui.setPlayerName(clean);
    this.updateMenuStats();
    this.ui.showToast('👤', 'Профиль обновлён', `Имя игрока сохранено: ${clean}`);
  }

  public toggleSound(enabled: boolean): void {
    this.audio.setSoundEnabled(enabled);
    this.ui.setSoundToggle(enabled);
    this.syncBackgroundMusic();
  }

  public toggleMusic(enabled: boolean): void {
    this.audio.setMusicEnabled(enabled);
    this.ui.setMusicToggle(enabled);
    this.syncBackgroundMusic();
  }

  public handleCloseModal(): void {
    if (this.ui.isSettingsOpen()) {
      this.ui.closeSettings();
    } else if (this.ui.isGachaOpen()) {
      this.ui.closeGacha();
    } else if (this.ui.isLeaderboardOpen()) {
      this.ui.closeLeaderboard();
    }
  }

  public syncBackgroundMusic(): void {
    const shouldPlay = this.isPlaying && !this.isPaused && !this.engine.getPlayer().isDead && this.audio.isMusicEnabled() && this.audio.isSoundEnabled();
    if (shouldPlay) {
      this.audio.startMusic();
    } else {
      this.audio.stopMusic();
    }
  }

  public updateMenuStats(): void {
    this.ui.updateMenuStats(this.engine.getHighScore(), this.engine.getCoins());
    this.ui.renderLeaderboard(this.engine.getScoreTracker().getLeaderboard());
  }

  public renderSkinsUI(): void {
    const unlocked = this.engine.getUnlockedSkins();
    const active = this.engine.getSelectedSkin();
    this.ui.renderSkins(unlocked, active, (skinId: string) => {
      if (this.engine.selectSkin(skinId as SkinId)) {
        this.audio.playSkinVoice(skinId);
        this.renderSkinsUI();
      }
    });
    this.ui.setGachaRollButtonText(`Крутить за ${WORLD_CONFIG.GACHA_COST} 🪙`);
    this.updateMenuStats();
  }

  private unlockAchievement(id: string, icon: string, title: string, desc: string): void {
    if (this.unlockedAchievements.has(id)) return;
    this.unlockedAchievements.add(id);
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('crossy_road_pro_achievements_v1', JSON.stringify(Array.from(this.unlockedAchievements)));
      } catch {}
    }
    this.ui.showToast(icon, `Достижение: ${title}`, desc);
  }

  private recordRunToLeaderboard(score: number): void {
    if (score <= 0) return;
    const tracker = this.engine.getScoreTracker();
    const runRes = tracker.recordRun(score);
    if (runRes.overtakenBots.length > 0) {
      this.ui.showToast('🏁', 'Соперник позади!', `Вы обошли: ${runRes.overtakenBots.slice(0, 2).join(', ')}`);
    }
    for (const ach of tracker.getAchievements()) {
      if (ach.unlocked) {
        this.unlockAchievement(ach.id, ach.badge, ach.title, ach.description);
      }
    }
  }

  public animate(now: number): void {
    const dt = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;

    if (this.isPlaying && !this.isPaused) {
      this.engine.step(dt);
    }
    this.sceneManager.sync(this.engine, dt);

    const currentCoins = this.engine.getCoins();
    if (currentCoins > this.lastCoins) {
      this.audio.playCoin();
      this.lastCoins = currentCoins;
      if (currentCoins >= 25) this.unlockAchievement('coin_25', '🪙', 'Нумизмат', 'Собрано 25 монет!');
      if (currentCoins >= 100) this.unlockAchievement('coin_100', '💰', 'Готов к Гаче', 'Накоплено 100 монет на прокрут!');
      this.renderSkinsUI();
    }

    const currentScore = this.engine.getScore();
    if (this.isPlaying && currentScore > 0) {
      if (currentScore > this.runStartHighScore && this.runStartHighScore > 0 && !this.notifiedNewHighScoreThisRun) {
        this.notifiedNewHighScoreThisRun = true;
        this.audio.playNewHighScore();
        this.ui.showToast('🏆', 'Новый рекорд!', `Вы побили прошлый рекорд (${this.runStartHighScore})!`);
      }
      if (currentScore >= 15) this.unlockAchievement('score_15', '🐣', 'Первые шаги', 'Набрано 15 очков за забег!');
      if (currentScore >= 50) this.unlockAchievement('score_50', '🔥', 'Мастер трассы', 'Набрано 50 очков за забег!');
      if (currentScore >= 100) this.unlockAchievement('score_100', '👑', 'Легенда перекрёстков', 'Набрано 100 очков!');
      if (this.engine.getComboMultiplier() >= 3) this.unlockAchievement('combo_3', '⚡', 'Комбо x3', 'Максимальный темп прыжков!');
    }

    this.ui.updateScore(currentScore);
    this.ui.updateCoins(currentCoins);

    if (this.isPlaying && !this.isPaused && !this.engine.getPlayer().isDead) {
      this.ui.setWarningVignette(this.engine.getCameraGraceRatio());
    } else {
      this.ui.setWarningVignette(0);
    }

    const p = this.engine.getPlayer();
    if (this.isPlaying && p.isDead && !this.wasDead) {
      this.wasDead = true;
      this.recordRunToLeaderboard(currentScore);
      this.sceneManager.spawnDeathFeathers(p.x, 0, p.row, p.deathReason);
      if (p.deathReason === DeathReason.WATER) {
        this.audio.playSplash();
      } else {
        this.audio.playCrash();
        this.sceneManager.triggerShake(p.deathReason === DeathReason.TRAIN ? 0.9 : 0.45);
      }
      this.ui.showGameOver(DEATH_LABELS[p.deathReason] ?? 'Игра окончена');
      this.updateMenuStats();
      this.syncBackgroundMusic();
    }

    requestAnimationFrame(this.animate);
  }

  public getUIActions(): UIActions {
    return {
      onPlay: () => this.startGame(),
      onPause: () => this.pauseGame(),
      onResume: () => this.resumeGame(),
      onToMenu: () => this.openMainMenu(),
      onRestart: () => this.startGame(),
      onRollGacha: () => this.handleGachaRoll(),
      onSaveName: (name: string) => this.savePlayerName(name),
      onToggleSound: (enabled: boolean) => this.toggleSound(enabled),
      onToggleMusic: (enabled: boolean) => this.toggleMusic(enabled),
    };
  }

  public getInputCallbacks(): InputCallbacks {
    return {
      onMove: (dir: MoveDirectionValue) => this.triggerMove(dir),
      onStartGame: () => this.startGame(),
      onPauseGame: () => this.pauseGame(),
      onResumeGame: () => this.resumeGame(),
      onRestartGame: () => this.startGame(),
      onToMenu: () => this.openMainMenu(),
      onGachaRoll: () => this.handleGachaRoll(),
      onCloseModal: () => this.handleCloseModal(),
      onSavePlayerName: () => this.ui.clickSaveName(),
    };
  }

  public getModalStateProvider(): ModalStateProvider {
    return {
      isSettingsOpen: () => this.ui.isSettingsOpen(),
      isPauseOpen: () => this.ui.isPauseOpen(),
      isMainMenuOpen: () => this.ui.isMainMenuOpen(),
      isGachaOpen: () => this.ui.isGachaOpen(),
      isLeaderboardOpen: () => this.ui.isLeaderboardOpen(),
      isGameOverOpen: () => this.ui.isGameOverOpen(),
      isNameInputFocused: () => this.ui.isNameInputFocused(),
      isPlaying: () => this.isPlaying,
    };
  }
}
