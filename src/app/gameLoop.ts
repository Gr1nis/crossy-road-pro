import { GameEngine } from '../core/gameEngine.ts';
import { RECORD_FLAG_X } from '../core/collision.ts';
import { ALL_SKINS, DeathReason, MoveDirection, WORLD_CONFIG, BIOME_ORDER, type AdProvider, type MoveDirectionValue, type SkinId, type BiomeType } from '../core/types.ts';
import type { AchievementId } from '../core/achievements.ts';
import type { DailyQuestInstance } from '../core/dailyQuests.ts';
import { AudioSynth } from '../view/audioSynth.ts';
import { SceneManager } from '../view/sceneManager.ts';
import { UIManager, UI_SKIN_RARITY, type UIActions } from './uiManager.ts';
import { type InputCallbacks, type ModalStateProvider } from './inputManager.ts';
import { PerfMonitor } from './perfMonitor.ts';

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
  private readonly platform: AdProvider;

  private lastCoins: number;
  private runStartHighScore: number;
  private notifiedNewHighScoreThisRun = false;
  private lastTime = 0;
  private lastDailyTimerTick = 0;
  private lastLogsHopped = 0;
  private lastTrainsSurvived = 0;
  private readonly unlockedAchievements = new Set<string>();
  private godMode = false;
  private readonly perfMonitor: PerfMonitor;
  private benchmarkActive = false;
  private benchmarkTargetRow = 0;
  private lastAutoHopTime = 0;

  constructor(
    engine: GameEngine,
    sceneManager: SceneManager,
    audio: AudioSynth,
    ui: UIManager,
    platform?: AdProvider,
    perfMonitor?: PerfMonitor
  ) {
    this.engine = engine;
    this.sceneManager = sceneManager;
    this.audio = audio;
    this.ui = ui;
    this.perfMonitor = perfMonitor ?? new PerfMonitor();
    this.platform = platform ?? {
      isAdReady: () => false,
      showRewardedVideo: (cb) => cb.onError?.(new Error('No ad provider')),
    };
    this.animate = this.animate.bind(this);
    this.lastCoins = this.engine.getCoins();
    this.runStartHighScore = this.engine.getHighScore();

    for (const ach of this.engine.getScoreTracker().getAchievements()) {
      if (ach.unlocked) {
        this.unlockedAchievements.add(ach.id);
      }
    }

    this.ui.setSoundToggle(this.audio.isSoundEnabled());
    this.ui.setMusicToggle(this.audio.isMusicEnabled());
    const playerName = this.engine.getScoreTracker().getPlayerName() || 'Игрок';
    this.ui.setPlayerName(playerName);

    for (const skin of ALL_SKINS) {
      this.engine.unlockSkin(skin.id);
    }

    this.updateDailyBonusUI();
    this.updateDailyQuestsUI();
    this.lastLogsHopped = this.engine.getScoreTracker().getLogsHopped();
    this.lastTrainsSurvived = this.engine.getScoreTracker().getTrainsSurvived();
    this.setupDevGlobal();
  }

  private setupDevGlobal(): void {
    if (typeof window === 'undefined') return;
    interface CrossyDevGlobal {
      __CROSSY_DEV__?: {
        addCoins: (amount?: number) => void;
        claimDailyBonus: () => void;
        completeQuests: () => void;
        rerollQuests: () => void;
        toggleGodMode: () => boolean;
        togglePerfHUD: () => boolean;
        startBenchmark: (rows?: number) => void;
        openViewer: () => void;
      };
    }
    (window as Window & CrossyDevGlobal).__CROSSY_DEV__ = {
      addCoins: (amount = 500) => {
        this.engine.getScoreTracker().addCoins(amount);
        this.lastCoins = this.engine.getCoins();
        this.updateMenuStats();
        this.ui.showToast('🪙', '+500 Монет', 'Монеты начислены на баланс!');
      },
      claimDailyBonus: () => this.handleClaimDailyBonus(false),
      completeQuests: () => {
        this.engine.getDailyQuestTracker().devCompleteAllQuests();
        this.updateDailyQuestsUI();
        this.ui.showToast('🎯', 'Задания выполнены', 'Все задания завершены!');
      },
      rerollQuests: () => {
        this.engine.getDailyQuestTracker().devRerollQuests();
        this.updateDailyQuestsUI();
        this.ui.showToast('🔄', 'Новые задания', 'Квесты обновлены!');
      },
      toggleGodMode: () => {
        this.godMode = !this.godMode;
        this.engine.setGodMode(this.godMode);
        this.ui.updateGodModeButton(this.godMode);
        this.ui.showToast('🛡️', 'Режим бога', this.godMode ? 'Бессмертие ВКЛ' : 'Бессмертие ВЫКЛ');
        return this.godMode;
      },
      togglePerfHUD: () => this.togglePerfHUD(),
      startBenchmark: (rows = 300) => this.startBenchmark(rows),
      openViewer: () => window.open('model-viewer.html?v=' + Date.now(), '_blank'),
    };
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public start(): void {
    this.lastTime = performance.now();
    requestAnimationFrame(this.animate);
  }

  public startGame(): void {
    this.ui.closeMainMenu();
    this.ui.hideAllModals();
    this.ui.showHud();
    this.wasDead = false;
    this.isPaused = false;
    this.runStartHighScore = this.engine.getHighScore();
    this.notifiedNewHighScoreThisRun = false;
    this.sceneManager.clearAll();
    if (this.runStartHighScore > 0) {
      this.sceneManager.setRecordFlag(this.runStartHighScore, RECORD_FLAG_X);
    }
    this.engine.reset(Date.now());
    this.lastCoins = this.engine.getCoins();
    this.lastLogsHopped = this.engine.getScoreTracker().getLogsHopped();
    this.lastTrainsSurvived = this.engine.getScoreTracker().getTrainsSurvived();
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
    this.updateDailyBonusUI();
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
      const completed = this.engine.recordDailyQuestProgress({ gacha: 1 });
      this.notifyQuestsCompleted(completed);
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
    } else if (this.ui.isDailyBonusOpen()) {
      this.ui.closeDailyBonus();
    } else if (this.ui.isDailyQuestsOpen()) {
      this.ui.closeDailyQuests();
    } else if (this.ui.isAchievementsOpen()) {
      this.ui.closeAchievements();
    } else if (this.ui.isGachaOpen()) {
      this.ui.closeGacha();
    } else if (this.ui.isLeaderboardOpen()) {
      this.ui.closeLeaderboard();
    } else if (this.ui.isDevModalOpen()) {
      this.ui.closeDevModal();
    }
  }

  public syncBackgroundMusic(): void {
    const shouldPlay = !this.engine.getPlayer().isDead && this.audio.isMusicEnabled();
    if (shouldPlay) {
      if (this.isPaused) {
        this.audio.onPause?.();
      } else {
        this.audio.onResume?.();
      }
      this.audio.startMusic();
    } else {
      this.audio.stopMusic();
    }
  }

  public syncAchievements(): void {
    const tracker = this.engine.getScoreTracker();
    tracker.evaluateAchievements({
      forwardStreak: this.engine.getForwardStreak(),
      runCoins: this.engine.getRunCoins(),
    });
    const list = tracker.getAchievements({
      forwardStreak: this.engine.getForwardStreak(),
      runCoins: this.engine.getRunCoins(),
    });
    for (const ach of list) {
      if (ach.unlocked && !this.unlockedAchievements.has(ach.id)) {
        this.unlockAchievement(ach.id, ach.badge, ach.title, ach.description);
      }
    }
    const summary = tracker.getAchievementsSummary();
    this.ui.renderAchievements(list, summary, (id: AchievementId) => {
      const res = this.engine.claimAchievement(id);
      if (res.success) {
        this.audio.playCoin();
        this.ui.showToast('🎁', 'Награда получена!', `+${res.rewardCoins} 🪙 зачислено на баланс!`);
        this.updateMenuStats();
      }
    });
  }

  public updateMenuStats(): void {
    this.ui.updateMenuStats(this.engine.getHighScore(), this.engine.getCoins());
    this.ui.renderLeaderboard(this.engine.getScoreTracker().getLeaderboard());
    this.syncAchievements();
    this.updateDailyBonusUI();
    this.updateDailyQuestsUI();
  }

  public renderSkinsUI(): void {
    for (const skin of ALL_SKINS) {
      this.engine.unlockSkin(skin.id);
    }
    const unlocked = this.engine.getUnlockedSkins();
    const active = this.engine.getSelectedSkin();
    this.ui.renderSkins(unlocked, active, (skinId: string) => {
      if (this.engine.selectSkin(skinId as SkinId)) {
        this.audio.playSkinVoice(skinId);
        this.renderSkinsUI();
      }
    });
    this.ui.setGachaRollButtonText(`${WORLD_CONFIG.GACHA_COST} 🪙`);
    this.updateMenuStats();
  }

  private unlockAchievement(id: string, icon: string, title: string, desc: string): void {
    if (this.unlockedAchievements.has(id)) return;
    this.unlockedAchievements.add(id);
    this.ui.showToast(icon, `Достижение: ${title}`, desc);
  }

  private notifyQuestsCompleted(quests: DailyQuestInstance[]): void {
    if (!quests || quests.length === 0) return;
    for (const q of quests) {
      this.ui.showToast('🎯', 'Задание выполнено!', q.title);
    }
  }

  private recordRunToLeaderboard(score: number): void {
    if (score <= 0) return;
    const tracker = this.engine.getScoreTracker();
    const runRes = tracker.recordRun(score);
    if (runRes.overtakenBots.length > 0) {
      this.ui.showToast('🏁', 'Соперник позади!', `Вы обошли: ${runRes.overtakenBots.slice(0, 2).join(', ')}`);
    }
    this.syncAchievements();
  }

  public animate(now: number): void {
    const frameStart = performance.now();
    const dt = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;

    if (this.benchmarkActive && this.isPlaying && !this.isPaused) {
      if (now - this.lastAutoHopTime >= 65) {
        this.lastAutoHopTime = now;
        const px = this.engine.getPlayer().x;
        if (px > 1.8) {
          this.engine.queueMove(MoveDirection.LEFT);
        } else if (px < -1.8) {
          this.engine.queueMove(MoveDirection.RIGHT);
        } else {
          this.engine.queueMove(MoveDirection.FORWARD);
        }
      }
      if (this.engine.getPlayer().row >= this.benchmarkTargetRow) {
        this.finishBenchmark();
      }
    }

    const coreStart = performance.now();
    if (this.isPlaying && !this.isPaused) {
      this.engine.step(dt);
    } else {
      this.engine.stepAmbient(dt);
    }
    const coreMs = performance.now() - coreStart;

    this.sceneManager.sync(this.engine, dt);

    if (this.perfMonitor.isEnabled()) {
      const timings = this.sceneManager.getPerfTimings();
      const stats = this.sceneManager.getRenderStats();
      this.perfMonitor.recordFrame({
        frameTimeMs: performance.now() - frameStart,
        coreMs,
        syncMs: timings.syncMs,
        renderMs: timings.renderMs,
        calls: stats.calls,
        triangles: stats.triangles,
        geometries: stats.geometries,
        textures: stats.textures,
        lanesCount: stats.renderedLanesCount,
        particlesCount: stats.particlesCount,
        score: this.engine.getScore(),
      });
    }

    const currentCoins = this.engine.getCoins();
    if (currentCoins > this.lastCoins) {
      this.audio.playCoin();
      this.lastCoins = currentCoins;
      this.syncAchievements();
      this.renderSkinsUI();
    }

    const currentScore = this.engine.getScore();
    const p = this.engine.getPlayer();

    if (this.isPlaying && this.runStartHighScore > 0 && !this.notifiedNewHighScoreThisRun && p.row >= this.runStartHighScore) {
      this.notifiedNewHighScoreThisRun = true;
      this.sceneManager.removeRecordFlag();
      this.sceneManager.spawnRecordConfetti(RECORD_FLAG_X, 1.0, this.runStartHighScore);
      this.audio.playRecordFanfare();
      this.ui.showToast('🏆', 'НОВЫЙ РЕКОРД!', `Преодолён прошлый рекорд (${this.runStartHighScore})!`);
    }

    if (this.isPlaying && currentScore > 0) {
      this.syncAchievements();
    }

    this.ui.updateScore(currentScore);
    this.ui.updateCoins(currentCoins);

    const currentLogs = this.engine.getScoreTracker().getLogsHopped();
    if (currentLogs > this.lastLogsHopped) {
      const delta = currentLogs - this.lastLogsHopped;
      this.lastLogsHopped = currentLogs;
      const completed = this.engine.recordDailyQuestProgress({ rivers: delta });
      this.notifyQuestsCompleted(completed);
    }

    const currentTrains = this.engine.getScoreTracker().getTrainsSurvived();
    if (currentTrains > this.lastTrainsSurvived) {
      const delta = currentTrains - this.lastTrainsSurvived;
      this.lastTrainsSurvived = currentTrains;
      const completed = this.engine.recordDailyQuestProgress({ trains: delta });
      this.notifyQuestsCompleted(completed);
    }

    if (this.isPlaying && !this.isPaused && !p.isDead) {
      this.ui.setWarningVignette(this.engine.getCameraGraceRatio());
    } else {
      this.ui.setWarningVignette(0);
    }

    if (this.godMode && p.isDead) {
      p.isDead = false;
      p.deathReason = DeathReason.NONE;
    }

    if (this.isPlaying && p.isDead && !this.wasDead) {
      this.wasDead = true;
      const completed = this.engine.recordDailyQuestProgress({
        score: currentScore,
        coins: this.engine.getRunCoins(),
        hops: p.row,
        rivers: 0,
        trains: 0,
        gacha: 0,
      });
      this.notifyQuestsCompleted(completed);
      this.recordRunToLeaderboard(currentScore);
      this.sceneManager.spawnDeathFeathers(p.x, 0, p.row, p.deathReason);
      if (p.deathReason === DeathReason.WATER) {
        this.audio.playSplash();
      } else {
        this.audio.playCrash();
        this.sceneManager.triggerShake(p.deathReason === DeathReason.TRAIN ? 0.9 : 0.45);
      }
      this.ui.showGameOver(
        DEATH_LABELS[p.deathReason] ?? 'Игра окончена',
        currentScore,
        this.engine.getHighScore()
      );
      this.updateMenuStats();
      this.syncBackgroundMusic();
    }

    if (this.ui.isDailyBonusOpen() && now - this.lastDailyTimerTick > 1000) {
      this.lastDailyTimerTick = now;
      this.updateDailyBonusUI();
    }

    requestAnimationFrame(this.animate);
  }

  public handleOpenDailyBonus(): void {
    this.updateDailyBonusUI();
    this.ui.openDailyBonus();
  }

  public handleOpenDailyQuests(): void {
    this.updateDailyQuestsUI();
    this.ui.openDailyQuests();
  }

  public handleClaimDailyBonus(doubleMultiplier: boolean): void {
    if (doubleMultiplier) {
      this.platform.showRewardedVideo({
        onRewarded: () => {
          this.executeClaimDailyBonus(true);
        },
        onError: () => {
          this.ui.showToast('⚠️', 'Реклама недоступна', 'Не удалось загрузить видео. Попробуйте позже.');
        },
      });
    } else {
      this.executeClaimDailyBonus(false);
    }
  }

  private executeClaimDailyBonus(doubleMultiplier: boolean): void {
    const res = this.engine.claimDailyReward(doubleMultiplier);
    if (res.success) {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([25, 30, 25]);
      }
      if (res.isDouble) {
        if (typeof this.audio.playDailySuperBonusFanfare === 'function') {
          this.audio.playDailySuperBonusFanfare();
        } else {
          this.audio.playRecordFanfare();
        }
      } else {
        this.audio.playCoin();
      }
      this.ui.showToast(
        '🎁',
        'Ежедневный бонус',
        `Получено +${res.coins} 🪙 (${res.day}-й день${res.isDouble ? ' x2' : ''})!`
      );
      this.lastCoins = this.engine.getCoins();
      this.updateMenuStats();
      this.updateDailyBonusUI();
    }
  }

  public handleClaimDailyQuest(questId: string, doubleMultiplier: boolean = false): void {
    if (doubleMultiplier) {
      this.platform.showRewardedVideo({
        onRewarded: () => {
          this.executeClaimDailyQuest(questId, true);
        },
        onError: () => {
          this.ui.showToast('⚠️', 'Реклама недоступна', 'Не удалось загрузить видео. Попробуйте позже.');
        },
      });
    } else {
      this.executeClaimDailyQuest(questId, false);
    }
  }

  private executeClaimDailyQuest(questId: string, doubleMultiplier: boolean): void {
    const res = this.engine.claimDailyQuest(questId, doubleMultiplier);
    if (res.success) {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([25, 30, 25]);
      }
      if (res.isDouble) {
        if (typeof this.audio.playDailySuperBonusFanfare === 'function') {
          this.audio.playDailySuperBonusFanfare();
        } else {
          this.audio.playRecordFanfare();
        }
      } else {
        if (typeof this.audio.playQuestComplete === 'function') {
          this.audio.playQuestComplete();
        } else {
          this.audio.playCoin();
        }
      }
      this.ui.showToast(
        '🎯',
        'Задание выполнено!',
        `+${res.coins} 🪙 зачислено на баланс${res.isDouble ? ' (x2 за рекламу!)' : ''}!`
      );
      this.lastCoins = this.engine.getCoins();
      this.updateMenuStats();
      this.updateDailyQuestsUI();
    }
  }

  public handleClaimDailyQuestBonus(doubleMultiplier: boolean = false): void {
    if (doubleMultiplier) {
      this.platform.showRewardedVideo({
        onRewarded: () => {
          this.executeClaimDailyQuestBonus(true);
        },
        onError: () => {
          this.ui.showToast('⚠️', 'Реклама недоступна', 'Не удалось загрузить видео. Попробуйте позже.');
        },
      });
    } else {
      this.executeClaimDailyQuestBonus(false);
    }
  }

  private executeClaimDailyQuestBonus(doubleMultiplier: boolean): void {
    const res = this.engine.claimDailyQuestBonus(doubleMultiplier);
    if (res.success) {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([25, 30, 25]);
      }
      this.sceneManager.spawnRecordConfetti(0, 2.0, 100);
      if (typeof this.audio.playDailySuperBonusFanfare === 'function') {
        this.audio.playDailySuperBonusFanfare();
      } else {
        this.audio.playRecordFanfare();
      }
      this.ui.showToast(
        '👑',
        'Супер-приз получен!',
        `+${res.coins} 🪙 за все задания дня${res.isDouble ? ' (x2 за рекламу!)' : ''}!`
      );
      this.lastCoins = this.engine.getCoins();
      this.updateMenuStats();
      this.updateDailyQuestsUI();
    }
  }

  public updateDailyQuestsUI(): void {
    const state = this.engine.getDailyQuestTracker().getState();
    this.ui.renderDailyQuests(
      state,
      (id: string, doubleMultiplier?: boolean) => this.handleClaimDailyQuest(id, Boolean(doubleMultiplier)),
      (doubleMultiplier?: boolean) => this.handleClaimDailyQuestBonus(Boolean(doubleMultiplier))
    );
  }

  public updateDailyBonusUI(): void {
    const daily = this.engine.getScoreTracker().getDailyRewardManager();
    const canClaim = daily.canClaimToday();
    const streak = daily.getStreak();
    const views = daily.getDaysView();
    const remainingMs = daily.getTimeUntilNextClaimMs();

    this.ui.updateDailyBadge(canClaim);
    this.ui.renderDailyBonus(views, streak, canClaim, remainingMs);
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
      onOpenDaily: () => this.handleOpenDailyBonus(),
      onClaimDaily: (doubleMultiplier: boolean) => this.handleClaimDailyBonus(doubleMultiplier),
      onOpenDailyQuests: () => this.handleOpenDailyQuests(),
      onClaimDailyQuest: (id: string, doubleMultiplier?: boolean) => this.handleClaimDailyQuest(id, Boolean(doubleMultiplier)),
      onClaimDailyBonus: (doubleMultiplier?: boolean) => this.handleClaimDailyQuestBonus(Boolean(doubleMultiplier)),
      onDevAddCoins: () => {
        this.engine.getScoreTracker().addCoins(500);
        this.lastCoins = this.engine.getCoins();
        this.updateMenuStats();
        this.ui.showToast('🪙', '+500 Монет', 'Монеты начислены на баланс!');
      },
      onDevClaimDailyBonus: () => {
        this.handleClaimDailyBonus(false);
      },
      onDevCompleteQuests: () => {
        this.engine.getDailyQuestTracker().devCompleteAllQuests();
        this.updateDailyQuestsUI();
        this.ui.showToast('🎯', 'Задания выполнены', 'Все 3 ежедневных задания завершены!');
      },
      onDevRerollQuests: () => {
        this.engine.getDailyQuestTracker().devRerollQuests();
        this.updateDailyQuestsUI();
        this.ui.showToast('🔄', 'Новые задания', 'Сгенерированы новые ежедневные задания!');
      },
      onDevCycleBiome: () => {
        const biomes: BiomeType[] = ['forest', 'winter', 'desert', 'neon'];
        const currentIdx = biomes.indexOf(this.engine.getBiome());
        const nextBiome = biomes[(currentIdx + 1) % biomes.length];
        this.engine.setBiomeOverride(nextBiome);
        this.ui.showToast('🌲', 'Биом изменён', `Биом переключен на: ${nextBiome}`);
      },
      onDevToggleGodMode: () => {
        this.godMode = !this.godMode;
        this.engine.setGodMode(this.godMode);
        this.ui.updateGodModeButton(this.godMode);
        this.ui.showToast('🛡️', 'Режим бога', this.godMode ? 'Бессмертие ВКЛЮЧЕНО' : 'Бессмертие ВЫКЛЮЧЕНО');
      },
      onDevTogglePerfHUD: () => this.togglePerfHUD(),
      onDevStartBenchmark: () => this.startBenchmark(),
    };
  }

  public togglePerfHUD(): boolean {
    const active = this.perfMonitor.toggle();
    this.ui.updatePerfButton(active);
    this.ui.showToast('⚡', 'Perf Telemetry', active ? 'Монитор производительности ВКЛ (F3)' : 'Монитор ВЫКЛ');
    return active;
  }

  public startBenchmark(rows: number = 300): void {
    this.ui.closeDevModal();
    if (!this.isPlaying) {
      this.startGame();
    } else if (this.isPaused) {
      this.resumeGame();
    }
    this.godMode = true;
    this.engine.setGodMode(true);
    this.engine.setIgnoreObstacles(true);
    this.ui.updateGodModeButton(true);
    this.benchmarkActive = true;
    const startRow = this.engine.getPlayer().row;
    this.benchmarkTargetRow = startRow + rows;
    const stats = this.sceneManager.getRenderStats();
    this.perfMonitor.startBenchmarkSession(stats.geometries, startRow);
    this.ui.showToast('🚀', 'Бенчмарк запущен!', `Авто-раннер сквозь деревья и воду (${rows} полос). Следите за телеметрией!`);
  }

  private finishBenchmark(): void {
    this.benchmarkActive = false;
    this.engine.setIgnoreObstacles(false);
    this.engine.setGodMode(this.godMode);
    const stats = this.sceneManager.getRenderStats();
    const finalRow = this.engine.getPlayer().row;
    const report = this.perfMonitor.finishBenchmarkSession(stats.geometries, finalRow);
    const summaryMsg = `Avg: ${report.avgFps} FPS | 1% Low: ${report.low1PercentFps} | Calls: ${report.avgDrawCalls} (Пик: ${report.peakDrawCalls})`;
    this.ui.showToast('📊', 'Бенчмарк завершён!', summaryMsg);
    this.ui.showToast('💡', 'Диагностика', report.verdict);
    console.log('[PERF BENCHMARK REPORT]', report);
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
      onTogglePerfHUD: () => this.togglePerfHUD(),
    };
  }

  public getModalStateProvider(): ModalStateProvider {
    return {
      isSettingsOpen: () => this.ui.isSettingsOpen(),
      isPauseOpen: () => this.ui.isPauseOpen(),
      isMainMenuOpen: () => this.ui.isMainMenuOpen(),
      isGachaOpen: () => this.ui.isGachaOpen(),
      isLeaderboardOpen: () => this.ui.isLeaderboardOpen(),
      isAchievementsOpen: () => this.ui.isAchievementsOpen(),
      isDailyBonusOpen: () => this.ui.isDailyBonusOpen(),
      isDailyQuestsOpen: () => this.ui.isDailyQuestsOpen(),
      isDevModalOpen: () => this.ui.isDevModalOpen(),
      isGameOverOpen: () => this.ui.isGameOverOpen(),
      isNameInputFocused: () => this.ui.isNameInputFocused(),
      isPlaying: () => this.isPlaying,
    };
  }
}
