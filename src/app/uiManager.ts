import { ALL_SKINS, type AdProvider } from '../core/types.ts';
import type { Achievement, AchievementId } from '../core/achievements.ts';
import type { DailyRewardDayView } from '../core/dailyReward.ts';
import type { DailyQuestDayState } from '../core/dailyQuests.ts';
import type { SettingsManager } from '../core/settingsManager.ts';
import { type Language, t } from '../core/i18n.ts';
import { SettingsModalController, type SettingsModalCallbacks } from './settingsModal.ts';
import { GachaMachineModal } from './gachaMachineModal.ts';

export interface LeaderboardEntry {
  rank: number;
  playerName: string;
  score: number;
  skinId: string;
  isBot: boolean;
}

export interface UIActions {
  onPlay: () => void;
  onPause: () => void;
  onResume: () => void;
  onToMenu: () => void;
  onRestart: () => void;
  onRollGacha: () => void;
  onSelectAndPlay?: (skinId: string) => void;
  onGachaTick?: (pitch: number) => void;
  onSaveName: (name: string) => void;
  onToggleSound: (enabled: boolean) => void;
  onToggleMusic: (enabled: boolean) => void;
  onOpenDaily?: () => void;
  onClaimDaily?: (doubleMultiplier: boolean) => void;
  onOpenDailyQuests?: () => void;
  onClaimDailyQuest?: (id: string, doubleMultiplier?: boolean) => void;
  onClaimDailyBonus?: (doubleMultiplier?: boolean) => void;
  onDevAddCoins?: () => void;
  onDevClaimDailyBonus?: () => void;
  onDevCompleteQuests?: () => void;
  onDevRerollQuests?: () => void;
  onDevCycleBiome?: () => void;
  onDevToggleGodMode?: () => void;
  onDevTogglePerfHUD?: () => void;
  onDevStartBenchmark?: () => void;
  onDevOpenReport?: () => void;
}

export const UI_SKIN_RARITY: Record<string, { label: string; css: string }> = {
  corgi: { label: 'Обычный', css: 'rarity-common' },
  pigeon_pizza: { label: 'Обычный', css: 'rarity-common' },
  box_cat: { label: 'Редкий', css: 'rarity-rare' },
  raccoon_bandit: { label: 'Эпический', css: 'rarity-epic' },
  capybara_zen: { label: 'Легендарный', css: 'rarity-legendary' },
};

export class UIManager {
  // HUD
  private readonly hudEl: HTMLElement | null;
  private readonly scoreEl: HTMLElement | null;
  private readonly coinsEl: HTMLElement | null;
  private readonly pauseBtn: HTMLElement | null;
  private readonly warningVignetteEl: HTMLElement | null;
  private readonly toastContainerEl: HTMLElement | null;

  // Modals
  private readonly mainMenuModal: HTMLElement | null;
  private readonly pauseModal: HTMLElement | null;
  private readonly settingsModal: HTMLElement | null;
  private settingsController: SettingsModalController | null = null;
  private currentLanguage: Language = 'ru';
  private readonly gachaModal: HTMLElement | null;
  private readonly leaderboardModal: HTMLElement | null;
  private readonly achievementsModal: HTMLElement | null;
  private readonly gameOverModal: HTMLElement | null;

  // Buttons & Controls
  private readonly menuPlayBtn: HTMLElement | null;
  private readonly menuAchievementsBtn: HTMLElement | null;
  private readonly menuAchievementsBadgeEl: HTMLElement | null;
  private readonly menuGachaBtn: HTMLElement | null;
  private readonly menuLeaderboardBtn: HTMLElement | null;
  private readonly menuSettingsBtn: HTMLElement | null;
  private readonly menuHighScoreEl: HTMLElement | null;
  private readonly menuCoinsEl: HTMLElement | null;

  private readonly pauseResumeBtn: HTMLElement | null;
  private readonly pauseSettingsBtn: HTMLElement | null;
  private readonly pauseMenuBtn: HTMLElement | null;

  private readonly settingSoundToggle: HTMLInputElement | null;
  private readonly settingMusicToggle: HTMLInputElement | null;
  private readonly settingsCloseBtn: HTMLElement | null;

  private readonly gachaModalRollBtn: HTMLElement | null;
  private readonly gachaModalCloseBtn: HTMLElement | null;
  private readonly gachaModalCoinsEl: HTMLElement | null;
  private readonly gachaModalSkinListEl: HTMLElement | null;
  private readonly skinsModal: HTMLElement | null;
  private readonly skinsModalCloseBtn: HTMLElement | null;
  private readonly skinsModalListEl: HTMLElement | null;
  private gachaController: GachaMachineModal | null = null;
  private uiActions: UIActions | null = null;

  private readonly leaderboardCloseBtn: HTMLElement | null;
  private readonly leaderboardBestScoreEl: HTMLElement | null;
  private readonly leaderboardNameInput: HTMLInputElement | null;
  private readonly leaderboardSaveNameBtn: HTMLElement | null;
  private readonly leaderboardRowsEl: HTMLElement | null;

  private readonly achievementsCloseBtn: HTMLElement | null;
  private readonly achSummaryTextEl: HTMLElement | null;
  private readonly achSummaryBarEl: HTMLElement | null;
  private readonly achievementsListEl: HTMLElement | null;

  private readonly deathReasonEl: HTMLElement | null;
  private readonly gameOverScoreValEl: HTMLElement | null;
  private readonly gameOverBestValEl: HTMLElement | null;
  private readonly restartBtn: HTMLElement | null;
  private readonly toMenuBtn: HTMLElement | null;

  // Daily Bonus
  private readonly dailyBonusModal: HTMLElement | null;
  private readonly menuDailyBtn: HTMLElement | null;
  private readonly menuDailyBadgeEl: HTMLElement | null;
  private readonly dailyStreakTextEl: HTMLElement | null;
  private readonly dailyBonusGridEl: HTMLElement | null;
  private readonly dailyTimerBoxEl: HTMLElement | null;
  private readonly dailyTimerValEl: HTMLElement | null;
  private readonly dailyClaimBtn: HTMLElement | null;
  private readonly dailyDoubleBtn: HTMLElement | null;
  private readonly dailyCloseBtn: HTMLElement | null;

  // Daily Quests
  private readonly dailyQuestsModal: HTMLElement | null;
  private readonly menuDailyQuestsBtn: HTMLElement | null;
  private readonly menuDailyQuestsBadgeEl: HTMLElement | null;
  private readonly questsTimerValEl: HTMLElement | null;
  private readonly questsCoinsValEl: HTMLElement | null;
  private readonly questsSummaryTextEl: HTMLElement | null;
  private readonly questsSummaryBarEl: HTMLElement | null;
  private readonly dailyQuestsListEl: HTMLElement | null;
  private readonly questsClaimBonusBtn: HTMLButtonElement | null;
  private readonly questsClaimBonusX2Btn: HTMLButtonElement | null;
  private readonly questsCloseBtn: HTMLElement | null;
  private readonly platform: AdProvider;
  private questsTimerInterval: number | null = null;

  // Dev Sandbox
  private readonly menuDevBtn: HTMLElement | null;
  private readonly devModal: HTMLElement | null;
  private readonly devCloseBtn: HTMLElement | null;
  private readonly devAddCoinsBtn: HTMLElement | null;
  private readonly devBonusBtn: HTMLElement | null;
  private readonly devCompleteQuestsBtn: HTMLElement | null;
  private readonly devRerollQuestsBtn: HTMLElement | null;
  private readonly devCycleBiomeBtn: HTMLElement | null;
  private readonly devGodModeBtn: HTMLElement | null;
  private readonly devPerfBtn: HTMLElement | null;
  private readonly devBenchmarkBtn: HTMLElement | null;
  private readonly devReportBtn: HTMLElement | null;

  // State
  private lastScore = -1;
  private lastCoins = -1;
  private settingsReturnTo: 'menu' | 'pause' = 'menu';

  constructor(platform?: AdProvider) {
    this.platform = platform ?? {
      isAdReady: () => false,
      showRewardedVideo: (cb) => cb.onError?.(new Error('No ad provider')),
    };
    this.hudEl = document.getElementById('in-game-hud') ?? (typeof document.querySelector === 'function' ? document.querySelector('.hud') : null);
    this.scoreEl = document.getElementById('score-value');
    this.coinsEl = document.getElementById('coins-value');
    this.pauseBtn = document.getElementById('pause-btn');
    this.warningVignetteEl = document.getElementById('warning-vignette');
    this.toastContainerEl = document.getElementById('toast-container');

    this.mainMenuModal = document.getElementById('main-menu-modal');
    this.pauseModal = document.getElementById('pause-modal');
    this.settingsModal = document.getElementById('settings-modal');
    this.gachaModal = document.getElementById('gacha-modal');
    this.leaderboardModal = document.getElementById('leaderboard-modal');
    this.achievementsModal = document.getElementById('achievements-modal');
    this.gameOverModal = document.getElementById('game-over-modal');

    this.menuPlayBtn = document.getElementById('menu-play-btn');
    this.menuAchievementsBtn = document.getElementById('menu-achievements-btn');
    this.menuAchievementsBadgeEl = document.getElementById('menu-achievements-badge');
    this.menuGachaBtn = document.getElementById('menu-gacha-btn');
    this.menuLeaderboardBtn = document.getElementById('menu-leaderboard-btn');
    this.menuSettingsBtn = document.getElementById('menu-settings-btn');
    this.menuHighScoreEl = document.getElementById('menu-high-score');
    this.menuCoinsEl = document.getElementById('menu-coins');

    this.pauseResumeBtn = document.getElementById('pause-resume-btn');
    this.pauseSettingsBtn = document.getElementById('pause-settings-btn');
    this.pauseMenuBtn = document.getElementById('pause-menu-btn');

    this.settingSoundToggle = document.getElementById('setting-sound-toggle') as HTMLInputElement | null;
    this.settingMusicToggle = document.getElementById('setting-music-toggle') as HTMLInputElement | null;
    this.settingsCloseBtn = document.getElementById('settings-close-btn');

    this.gachaModalRollBtn = document.getElementById('gacha-modal-roll-btn');
    this.gachaModalCloseBtn = document.getElementById('gacha-modal-close-btn');
    this.gachaModalCoinsEl = document.getElementById('gacha-modal-coins');
    this.gachaModalSkinListEl = document.getElementById('gacha-modal-skin-list');

    this.skinsModal = document.getElementById('skins-modal');
    this.skinsModalCloseBtn = document.getElementById('skins-modal-close-btn');
    this.skinsModalListEl = document.getElementById('skins-modal-list');
    this.skinsModalCloseBtn?.addEventListener('click', () => this.closeSkins());

    this.gachaController = new GachaMachineModal({
      onRoll: () => this.uiActions?.onRollGacha(),
      onSelectAndPlay: (skinId) => this.uiActions?.onSelectAndPlay?.(skinId),
      onTick: (pitch) => this.uiActions?.onGachaTick?.(pitch),
      onClose: () => {},
    });

    this.leaderboardCloseBtn = document.getElementById('leaderboard-close-btn');
    this.leaderboardBestScoreEl = document.getElementById('leaderboard-best-score');
    this.leaderboardNameInput = document.getElementById('leaderboard-name-input') as HTMLInputElement | null;
    this.leaderboardSaveNameBtn = document.getElementById('leaderboard-save-name-btn');
    this.leaderboardRowsEl = document.getElementById('leaderboard-rows');

    this.achievementsCloseBtn = document.getElementById('achievements-close-btn');
    this.achSummaryTextEl = document.getElementById('ach-summary-text');
    this.achSummaryBarEl = document.getElementById('ach-summary-bar');
    this.achievementsListEl = document.getElementById('achievements-list');

    this.deathReasonEl = document.getElementById('death-reason');
    this.gameOverScoreValEl = document.getElementById('game-over-score-val');
    this.gameOverBestValEl = document.getElementById('game-over-best-val');
    this.restartBtn = document.getElementById('restart-btn');
    this.toMenuBtn = document.getElementById('to-menu-btn');

    this.dailyBonusModal = document.getElementById('daily-bonus-modal');
    this.menuDailyBtn = document.getElementById('menu-daily-btn');
    this.menuDailyBadgeEl = document.getElementById('menu-daily-badge');
    this.dailyStreakTextEl = document.getElementById('daily-streak-text');
    this.dailyBonusGridEl = document.getElementById('daily-bonus-grid');
    this.dailyTimerBoxEl = document.getElementById('daily-timer-box');
    this.dailyTimerValEl = document.getElementById('daily-timer-val');
    this.dailyClaimBtn = document.getElementById('daily-claim-btn');
    this.dailyDoubleBtn = document.getElementById('daily-double-btn');
    this.dailyCloseBtn = document.getElementById('daily-close-btn');

    this.dailyQuestsModal = document.getElementById('daily-quests-modal');
    this.menuDailyQuestsBtn = document.getElementById('menu-daily-quests-btn');
    this.menuDailyQuestsBadgeEl = document.getElementById('menu-daily-quests-badge');
    this.questsTimerValEl = document.getElementById('quests-timer-val');
    this.questsCoinsValEl = document.getElementById('quests-coins-val');
    this.questsSummaryTextEl = document.getElementById('quests-summary-text');
    this.questsSummaryBarEl = document.getElementById('quests-summary-bar');
    this.dailyQuestsListEl = document.getElementById('daily-quests-list');
    this.questsClaimBonusBtn = document.getElementById('quests-claim-bonus-btn') as HTMLButtonElement | null;
    this.questsClaimBonusX2Btn = document.getElementById('quests-claim-bonus-x2-btn') as HTMLButtonElement | null;
    this.questsCloseBtn = document.getElementById('quests-close-btn');

    this.menuDevBtn = document.getElementById('menu-dev-btn');
    this.devModal = document.getElementById('dev-modal');
    this.devCloseBtn = document.getElementById('dev-close-btn');
    this.devAddCoinsBtn = document.getElementById('dev-add-coins-btn');
    this.devBonusBtn = document.getElementById('dev-bonus-btn');
    this.devCompleteQuestsBtn = document.getElementById('dev-complete-quests-btn');
    this.devRerollQuestsBtn = document.getElementById('dev-reroll-quests-btn');
    this.devCycleBiomeBtn = document.getElementById('dev-cycle-biome-btn');
    this.devGodModeBtn = document.getElementById('dev-godmode-btn');
    this.devPerfBtn = document.getElementById('dev-perf-btn');
    this.devBenchmarkBtn = document.getElementById('dev-benchmark-btn');
    this.devReportBtn = document.getElementById('dev-report-btn');

    this.setupInternalNavigation();
    this.hideHud();
  }

  private setupInternalNavigation(): void {
    this.menuDailyBtn?.addEventListener('click', () => this.openDailyBonus());
    this.dailyCloseBtn?.addEventListener('click', () => this.closeDailyBonus());
    this.menuDailyQuestsBtn?.addEventListener('click', () => this.openDailyQuests());
    this.questsCloseBtn?.addEventListener('click', () => this.closeDailyQuests());
    this.menuDevBtn?.addEventListener('click', () => this.openDevModal());
    this.devCloseBtn?.addEventListener('click', () => this.closeDevModal());
    this.menuAchievementsBtn?.addEventListener('click', () => this.openAchievements());
    this.achievementsCloseBtn?.addEventListener('click', () => this.closeAchievements());
    this.menuGachaBtn?.addEventListener('click', () => this.openGacha());
    this.gachaModalCloseBtn?.addEventListener('click', () => this.closeGacha());
    this.menuLeaderboardBtn?.addEventListener('click', () => this.openLeaderboard());
    this.leaderboardCloseBtn?.addEventListener('click', () => this.closeLeaderboard());
    this.menuSettingsBtn?.addEventListener('click', () => this.openSettings('menu'));
    document.getElementById('menu-skins-btn')?.addEventListener('click', () => this.openSkins());
    document.getElementById('menu-coins-plus-btn')?.addEventListener('click', () => this.openGacha());
    document.getElementById('menu-coins-pill')?.addEventListener('click', () => this.openGacha());
    const stopBubble = (e: Event) => e.stopPropagation();
    this.menuDailyBtn?.addEventListener('click', stopBubble);
    this.menuDailyQuestsBtn?.addEventListener('click', stopBubble);
    this.menuDevBtn?.addEventListener('click', stopBubble);
    this.menuAchievementsBtn?.addEventListener('click', stopBubble);
    this.menuGachaBtn?.addEventListener('click', stopBubble);
    this.menuLeaderboardBtn?.addEventListener('click', stopBubble);
    this.menuSettingsBtn?.addEventListener('click', stopBubble);
    document.getElementById('menu-skins-btn')?.addEventListener('click', stopBubble);
    document.getElementById('menu-coins-plus-btn')?.addEventListener('click', stopBubble);
    document.getElementById('menu-score-pill')?.addEventListener('click', stopBubble);
    if (typeof document.querySelector === 'function') {
      document.querySelector('.top-pill-score')?.addEventListener('click', stopBubble);
    }
    this.pauseSettingsBtn?.addEventListener('click', () => {
      this.closePause();
      this.openSettings('pause');
    });
    this.settingsCloseBtn?.addEventListener('click', () => this.closeSettings());
  }

  hideAllModals(): void {
    this.mainMenuModal?.classList.add('hidden');
    this.pauseModal?.classList.add('hidden');
    this.settingsModal?.classList.add('hidden');
    this.gachaModal?.classList.add('hidden');
    this.leaderboardModal?.classList.add('hidden');
    this.achievementsModal?.classList.add('hidden');
    this.dailyBonusModal?.classList.add('hidden');
    this.dailyQuestsModal?.classList.add('hidden');
    this.devModal?.classList.add('hidden');
    this.stopQuestsCountdown();
    this.gameOverModal?.classList.add('hidden');
  }

  showHud(): void {
    this.hudEl?.classList.remove('hidden');
  }

  hideHud(): void {
    this.hudEl?.classList.add('hidden');
  }

  openMainMenu(): void {
    this.hideAllModals();
    this.hideHud();
    this.mainMenuModal?.classList.remove('hidden');
  }

  closeMainMenu(): void {
    this.showHud();
    this.mainMenuModal?.classList.add('hidden');
  }

  openPause(): void {
    this.pauseModal?.classList.remove('hidden');
  }

  closePause(): void {
    this.pauseModal?.classList.add('hidden');
  }

  initSettingsModal(settings: SettingsManager, callbacks: SettingsModalCallbacks): void {
    this.settingsController = new SettingsModalController(settings, callbacks);
  }

  openSettings(returnTo: 'menu' | 'pause' = 'menu'): void {
    this.settingsReturnTo = returnTo;
    this.settingsController?.syncUI();
    this.settingsModal?.classList.remove('hidden');
  }

  closeSettings(): 'menu' | 'pause' {
    this.settingsModal?.classList.add('hidden');
    if (this.settingsReturnTo === 'pause') {
      this.pauseModal?.classList.remove('hidden');
    } else {
      this.mainMenuModal?.classList.remove('hidden');
    }
    return this.settingsReturnTo;
  }

  applyLanguage(lang: Language): void {
    this.currentLanguage = lang;
    if (typeof document === 'undefined') return;

    const elements = document.querySelectorAll<HTMLElement>('[data-i18n]');
    for (const el of elements) {
      const key = el.dataset.i18n;
      if (!key) continue;
      const text = t(key, lang);
      if (text) {
        if (el.tagName === 'INPUT') {
          (el as HTMLInputElement).placeholder = text;
        } else {
          el.textContent = text;
        }
      }
    }

    const titleElements = document.querySelectorAll<HTMLElement>('[data-i18n-title]');
    for (const el of titleElements) {
      const key = el.dataset.i18nTitle;
      if (!key) continue;
      const text = t(key, lang);
      if (text) el.title = text;
    }

    const lbRank = document.querySelector<HTMLElement>('.lb-row.header .lb-col-rank');
    if (lbRank) lbRank.textContent = t('leaderboard_rank', lang);
    const lbPlayer = document.querySelector<HTMLElement>('.lb-row.header .lb-col-player');
    if (lbPlayer) lbPlayer.textContent = t('leaderboard_player', lang);
    const lbScore = document.querySelector<HTMLElement>('.lb-row.header .lb-col-score');
    if (lbScore) lbScore.textContent = t('leaderboard_score', lang);
  }

  getLanguage(): Language {
    return this.currentLanguage;
  }

  openGacha(currentSkinId?: string): void {
    this.gachaController?.open(currentSkinId);
  }

  closeGacha(): void {
    this.gachaController?.close();
  }

  openSkins(): void {
    this.skinsModal?.classList.remove('hidden');
  }

  closeSkins(): void {
    this.skinsModal?.classList.add('hidden');
  }

  isSkinsOpen(): boolean {
    return Boolean(this.skinsModal && !this.skinsModal.classList.contains('hidden'));
  }

  startGachaRoulette(
    result: { skinId?: string; rarity?: string; isDuplicate?: boolean; cashback?: number },
    onFinished?: () => void
  ): void {
    this.gachaController?.startRoulette(result, onFinished);
  }

  shakeGachaRollButton(): void {
    this.gachaController?.shakeRollButton();
  }

  openLeaderboard(): void {
    this.leaderboardModal?.classList.remove('hidden');
  }

  closeLeaderboard(): void {
    this.leaderboardModal?.classList.add('hidden');
  }

  openAchievements(): void {
    this.achievementsModal?.classList.remove('hidden');
  }

  closeAchievements(): void {
    this.achievementsModal?.classList.add('hidden');
  }

  openDailyBonus(): void {
    this.dailyBonusModal?.classList.remove('hidden');
  }

  closeDailyBonus(): void {
    this.dailyBonusModal?.classList.add('hidden');
  }

  isDailyBonusOpen(): boolean {
    return Boolean(this.dailyBonusModal && !this.dailyBonusModal.classList.contains('hidden'));
  }

  openDailyQuests(): void {
    this.dailyQuestsModal?.classList.remove('hidden');
    this.startQuestsCountdown();
  }

  closeDailyQuests(): void {
    this.dailyQuestsModal?.classList.add('hidden');
    this.stopQuestsCountdown();
  }

  isDailyQuestsOpen(): boolean {
    return Boolean(this.dailyQuestsModal && !this.dailyQuestsModal.classList.contains('hidden'));
  }

  openDevModal(): void {
    this.devModal?.classList.remove('hidden');
  }

  closeDevModal(): void {
    this.devModal?.classList.add('hidden');
  }

  isDevModalOpen(): boolean {
    return Boolean(this.devModal && !this.devModal.classList.contains('hidden'));
  }

  updateGodModeButton(enabled: boolean): void {
    if (this.devGodModeBtn) {
      this.devGodModeBtn.textContent = `🛡️ God Mode: ${enabled ? 'ВКЛ' : 'ВЫКЛ'}`;
      this.devGodModeBtn.style.color = enabled ? '#4ade80' : '#f87171';
    }
  }

  updatePerfButton(enabled: boolean): void {
    if (this.devPerfBtn) {
      this.devPerfBtn.textContent = `⚡ Perf HUD: ${enabled ? 'ВКЛ' : 'ВЫКЛ'}`;
      this.devPerfBtn.style.color = enabled ? '#38bdf8' : '#94a3b8';
    }
  }

  private updateQuestsCountdown(): void {
    if (!this.questsTimerValEl) return;
    // === [DEV TESTING: Таймер заданий отключен для тестов] ===
    // Для возврата стандартного обратного отсчета до полуночи раскомментируйте блок ниже:
    /*
    const now = Date.now();
    const d = new Date(now);
    const nextMidnight = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1, 0, 0, 0, 0);
    const diffSec = Math.max(0, Math.floor((nextMidnight - now) / 1000));
    const hours = String(Math.floor(diffSec / 3600)).padStart(2, '0');
    const mins = String(Math.floor((diffSec % 3600) / 60)).padStart(2, '0');
    const secs = String(diffSec % 60).padStart(2, '0');
    this.questsTimerValEl.textContent = `${hours}:${mins}:${secs}`;
    */
    this.questsTimerValEl.textContent = '00:00:00 (DEV)';
  }

  private startQuestsCountdown(): void {
    this.stopQuestsCountdown();
    this.updateQuestsCountdown();
    this.questsTimerInterval = window.setInterval(() => {
      this.updateQuestsCountdown();
    }, 1000);
  }

  private stopQuestsCountdown(): void {
    if (this.questsTimerInterval !== null) {
      clearInterval(this.questsTimerInterval);
      this.questsTimerInterval = null;
    }
  }

  updateDailyBadge(hasReward: boolean): void {
    if (!this.menuDailyBadgeEl) return;
    if (hasReward) {
      this.menuDailyBadgeEl.textContent = '!';
      this.menuDailyBadgeEl.classList.remove('hidden');
    } else {
      this.menuDailyBadgeEl.classList.add('hidden');
    }
  }

  renderDailyBonus(
    days: DailyRewardDayView[],
    streak: number,
    canClaim: boolean,
    remainingMs: number
  ): void {
    if (this.dailyStreakTextEl) {
      this.dailyStreakTextEl.textContent = t('daily_streak', this.currentLanguage, [streak]);
    }

    if (this.dailyTimerBoxEl && this.dailyTimerValEl) {
      // === [DEV TESTING: Таймер ожидания бонуса скрыт для моментального тестирования] ===
      // Для возврата стандартного таймера ожидания раскомментируйте блок ниже:
      /*
      if (!canClaim) {
        this.dailyTimerBoxEl.classList.remove('hidden');
        const totalSec = Math.floor(remainingMs / 1000);
        const hours = String(Math.floor(totalSec / 3600)).padStart(2, '0');
        const mins = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
        const secs = String(totalSec % 60).padStart(2, '0');
        this.dailyTimerValEl.textContent = `${hours}:${mins}:${secs}`;
      } else {
        this.dailyTimerBoxEl.classList.add('hidden');
      }
      */
      this.dailyTimerBoxEl.classList.add('hidden');
    }

    if (this.dailyClaimBtn) {
      this.dailyClaimBtn.style.display = canClaim ? 'flex' : 'none';
      const availableDay = days.find((d) => d.status === 'available');
      if (availableDay) {
        this.dailyClaimBtn.textContent = `Забрать ${availableDay.coins} 🪙`;
      }
    }

    if (this.dailyDoubleBtn) {
      const showX2 = canClaim && this.platform.isAdReady();
      this.dailyDoubleBtn.style.display = showX2 ? 'flex' : 'none';
      const availableDay = days.find((d) => d.status === 'available');
      if (availableDay) {
        this.dailyDoubleBtn.textContent = `🎬 Забрать x2 (${availableDay.coins * 2} 🪙)`;
      }
    }

    if (!this.dailyBonusGridEl) return;
    this.dailyBonusGridEl.innerHTML = '';

    for (const day of days) {
      const card = document.createElement('div');
      const isMega = day.isMega;
      let cardClass = `daily-card ${day.status}`;
      if (isMega) cardClass += ' daily-card-mega';
      card.className = cardClass;

      let icon = '🪙';
      if (day.day >= 3 && day.day < 5) icon = '💰';
      else if (day.day >= 5 && !isMega) icon = '🎁';
      else if (isMega) icon = '👑';

      let statusLabel = '🔒 Закрыто';
      if (day.status === 'claimed') statusLabel = '✔ Получено';
      else if (day.status === 'available') statusLabel = '✨ Доступно';

      if (isMega) {
        card.innerHTML = `
          <div style="display: flex; align-items: center; gap: 12px;">
            <div class="daily-card-icon">${icon}</div>
            <div style="text-align: left;">
              <div class="daily-card-day" style="color: #fbbf24;">ДЕНЬ 7 (СУПЕР-ПРИЗ)</div>
              <div class="daily-card-reward">+${day.coins} 🪙 ДЖЕКПОТ</div>
            </div>
          </div>
          <div class="daily-card-status">${statusLabel}</div>
        `;
      } else {
        card.innerHTML = `
          <div class="daily-card-day">День ${day.day}</div>
          <div class="daily-card-icon">${icon}</div>
          <div class="daily-card-reward">+${day.coins} 🪙</div>
          <div class="daily-card-status">${statusLabel}</div>
        `;
      }

      this.dailyBonusGridEl.appendChild(card);
    }
  }

  renderDailyQuests(
    state: DailyQuestDayState,
    onClaimQuest: (id: string, doubleMultiplier?: boolean) => void,
    onClaimBonus: (doubleMultiplier?: boolean) => void
  ): void {
    const quests = state.quests || [];
    const completedCount = quests.filter((q) => q.isCompleted).length;
    const readyCount = quests.filter((q) => q.isCompleted && !q.isClaimed).length;
    const allCompleted = quests.length >= 3 && completedCount >= quests.length;
    const canClaimSuperBonus = allCompleted && !state.allCompletedBonusClaimed;

    // 1. Badge in Main Menu: shows completed/total fraction when active quests exist
    if (this.menuDailyQuestsBadgeEl) {
      if (quests.length > 0) {
        this.menuDailyQuestsBadgeEl.textContent = `${completedCount}/${quests.length}`;
        this.menuDailyQuestsBadgeEl.classList.remove('hidden');
      } else {
        this.menuDailyQuestsBadgeEl.classList.add('hidden');
      }
    }

    // 2. Day summary progress: "Выполнено X из 3" + progress bar
    if (this.questsSummaryTextEl) {
      this.questsSummaryTextEl.textContent = t('quests_progress_summary', this.currentLanguage, [completedCount, quests.length || 3]);
    }
    if (this.questsSummaryBarEl) {
      const totalPercent = quests.length > 0 ? Math.round((completedCount / quests.length) * 100) : 0;
      this.questsSummaryBarEl.style.width = `${totalPercent}%`;
    }

    // 3. Render 3 quest cards
    if (this.dailyQuestsListEl) {
      this.dailyQuestsListEl.innerHTML = '';

      const categoryIcons: Record<string, string> = {
        score: '🎯',
        coins: '🪙',
        hops: '👟',
        rivers: '🪵',
        trains: '🚂',
        gacha: '🎰',
      };

      for (const q of quests) {
        const card = document.createElement('div');
        let statusClass = 'in-progress';
        if (q.isClaimed) {
          statusClass = 'claimed';
        } else if (q.isCompleted) {
          statusClass = 'ready';
        }
        card.className = `quest-card ${statusClass}`;

        const icon = categoryIcons[q.category] || '🎯';
        const pct = Math.min(100, Math.max(0, q.progressPercent));

        let actionHtml = '';
        if (q.isClaimed) {
          actionHtml = `<span class="quest-status-badge claimed">✔ Получено</span>`;
        } else if (q.isCompleted) {
          const showX2 = this.platform.isAdReady();
          actionHtml = `
            <button class="quest-btn quest-btn-claim" type="button">Забрать ${q.rewardCoins} 🪙</button>
            ${showX2 ? `<button class="quest-btn quest-btn-purple quest-btn-x2" type="button">🎬 x2 (${q.rewardCoins * 2} 🪙)</button>` : ''}
          `;
        } else {
          actionHtml = `<span class="quest-status-badge pending">${q.current}/${q.target}</span>`;
        }

        card.innerHTML = `
          <div class="quest-icon-col">
            <div class="quest-icon">${icon}</div>
          </div>
          <div class="quest-info-col">
            <div class="quest-title-row">
              <span class="quest-title">${q.title}</span>
              <span class="quest-reward-pill">+${q.rewardCoins} 🪙</span>
            </div>
            <div class="quest-desc">${q.description}</div>
            <div class="quest-progress-row">
              <div class="quest-progress-bar-bg">
                <div class="quest-progress-bar-fill ${q.isCompleted ? 'gold' : 'blue'}" style="width: ${pct}%;"></div>
              </div>
              <span class="quest-progress-text">${q.current}/${q.target} (${pct}%)</span>
            </div>
          </div>
          <div class="quest-action-col">
            ${actionHtml}
          </div>
        `;

        if (q.isCompleted && !q.isClaimed) {
          const claimBtn = card.querySelector('.quest-btn-claim');
          claimBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.spawnFlyingCoins(claimBtn as HTMLElement);
            onClaimQuest(q.id, false);
          });

          const x2Btn = card.querySelector('.quest-btn-x2');
          x2Btn?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.spawnFlyingCoins(x2Btn as HTMLElement, 6);
            onClaimQuest(q.id, true);
          });
        }

        this.dailyQuestsListEl.appendChild(card);
      }
    }

    // 4. Super-prize button: active only if allCompleted && !allCompletedBonusClaimed
    if (this.questsClaimBonusBtn) {
      if (state.allCompletedBonusClaimed) {
        this.questsClaimBonusBtn.disabled = true;
        this.questsClaimBonusBtn.textContent = '✔ Получено';
        this.questsClaimBonusBtn.className = 'quest-btn quest-status-badge claimed';
        this.questsClaimBonusBtn.onclick = null;
        if (this.questsClaimBonusX2Btn) {
          this.questsClaimBonusX2Btn.style.display = 'none';
          this.questsClaimBonusX2Btn.onclick = null;
        }
      } else if (canClaimSuperBonus) {
        this.questsClaimBonusBtn.disabled = false;
        this.questsClaimBonusBtn.textContent = 'Забрать 100 🪙';
        this.questsClaimBonusBtn.className = 'quest-btn quest-btn-claim quest-super-btn';
        this.questsClaimBonusBtn.onclick = () => {
          this.spawnFlyingCoins(this.questsClaimBonusBtn as HTMLElement, 8);
          onClaimBonus(false);
        };
        if (this.questsClaimBonusX2Btn) {
          const showX2 = this.platform.isAdReady();
          this.questsClaimBonusX2Btn.style.display = showX2 ? 'block' : 'none';
          this.questsClaimBonusX2Btn.disabled = false;
          this.questsClaimBonusX2Btn.textContent = '🎬 Забрать x2 (200 🪙)';
          this.questsClaimBonusX2Btn.className = 'quest-btn quest-super-btn quest-btn-purple';
          this.questsClaimBonusX2Btn.onclick = () => {
            this.spawnFlyingCoins(this.questsClaimBonusX2Btn as HTMLElement, 12);
            onClaimBonus(true);
          };
        }
      } else {
        this.questsClaimBonusBtn.disabled = true;
        this.questsClaimBonusBtn.textContent = 'Забрать 100 🪙';
        this.questsClaimBonusBtn.className = 'quest-btn quest-super-btn';
        this.questsClaimBonusBtn.onclick = null;
        if (this.questsClaimBonusX2Btn) {
          this.questsClaimBonusX2Btn.style.display = 'none';
          this.questsClaimBonusX2Btn.onclick = null;
        }
      }
    }
  }

  showGameOver(reasonText: string, score = 0, highScore = 0): void {
    this.hideHud();
    if (this.deathReasonEl) {
      this.deathReasonEl.textContent = reasonText;
    }
    if (this.gameOverScoreValEl) {
      this.gameOverScoreValEl.textContent = String(score);
    }
    if (this.gameOverBestValEl) {
      this.gameOverBestValEl.textContent = String(highScore);
    }
    this.gameOverModal?.classList.remove('hidden');
  }

  isMainMenuOpen(): boolean {
    return Boolean(this.mainMenuModal && !this.mainMenuModal.classList.contains('hidden'));
  }

  isPauseOpen(): boolean {
    return Boolean(this.pauseModal && !this.pauseModal.classList.contains('hidden'));
  }

  isSettingsOpen(): boolean {
    return Boolean(this.settingsModal && !this.settingsModal.classList.contains('hidden'));
  }

  isGachaOpen(): boolean {
    return Boolean(this.gachaController ? this.gachaController.isOpen() : (this.gachaModal && !this.gachaModal.classList.contains('hidden')));
  }

  isLeaderboardOpen(): boolean {
    return Boolean(this.leaderboardModal && !this.leaderboardModal.classList.contains('hidden'));
  }

  isAchievementsOpen(): boolean {
    return Boolean(this.achievementsModal && !this.achievementsModal.classList.contains('hidden'));
  }

  isGameOverOpen(): boolean {
    return Boolean(this.gameOverModal && !this.gameOverModal.classList.contains('hidden'));
  }

  updateScore(score: number): void {
    if (this.lastScore === score) return;
    this.lastScore = score;
    if (this.scoreEl) {
      this.scoreEl.textContent = String(score);
    }
  }

  updateCoins(coins: number): void {
    if (this.lastCoins === coins) return;
    this.lastCoins = coins;
    if (this.coinsEl) {
      this.coinsEl.textContent = String(coins);
    }
    if (this.menuCoinsEl) {
      this.menuCoinsEl.textContent = String(coins);
    }
    if (this.gachaModalCoinsEl) {
      this.gachaModalCoinsEl.textContent = String(coins);
    }
    if (this.questsCoinsValEl) {
      this.questsCoinsValEl.textContent = String(coins);
    }
  }

  setWarningVignette(graceRatio: number): void {
    if (!this.warningVignetteEl) return;
    if (graceRatio > 0) {
      const opacity = Math.min(1, Math.max(0.05, graceRatio));
      this.warningVignetteEl.style.opacity = String(opacity);
    } else {
      this.warningVignetteEl.style.opacity = '0';
    }
  }

  showToast(icon: string, title: string, desc: string, durationMs = 3600): void {
    if (!this.toastContainerEl) return;
    const item = document.createElement('div');
    item.className = 'toast-item';
    item.innerHTML = `<div class="toast-icon">${icon}</div><div><div class="toast-title">${title}</div><div class="toast-desc">${desc}</div></div>`;
    this.toastContainerEl.appendChild(item);
    window.setTimeout(() => {
      item.remove();
    }, durationMs);
  }

  updateGachaStatus(_message: string): void {
    // Gacha status element was removed in favor of roll button price and toasts
  }

  updateMenuStats(highScore: number, coins: number): void {
    if (this.menuHighScoreEl) this.menuHighScoreEl.textContent = String(highScore);
    if (this.menuCoinsEl) this.menuCoinsEl.textContent = String(coins);
    if (this.leaderboardBestScoreEl) this.leaderboardBestScoreEl.textContent = String(highScore);
    if (this.gachaModalCoinsEl) this.gachaModalCoinsEl.textContent = String(coins);
    if (this.questsCoinsValEl) this.questsCoinsValEl.textContent = String(coins);
    this.gachaController?.updateCoins(coins);
  }

  renderLeaderboard(entries: LeaderboardEntry[]): void {
    if (!this.leaderboardRowsEl) return;
    this.leaderboardRowsEl.innerHTML = entries
      .slice(0, 8)
      .map((entry) => {
        const skinMeta = ALL_SKINS.find((s) => s.id === entry.skinId);
        const badge = skinMeta?.badge ?? (entry.isBot ? '🤖' : '👤');
        return `
      <div class="lb-row ${!entry.isBot ? 'current-player' : ''}">
        <span class="lb-col-rank">#${entry.rank} ${!entry.isBot ? '<small style="color:#38bdf8;font-weight:700;">(Вы)</small>' : ''}</span>
        <span class="lb-col-player">${badge} ${entry.playerName}</span>
        <span class="lb-col-score">${entry.score}</span>
      </div>
    `;
      })
      .join('');
  }

  renderSkins(unlocked: string[], selected: string, onSelectSkin: (id: string) => void): void {
    const container = this.skinsModalListEl ?? this.gachaModalSkinListEl;
    if (!container) return;
    container.innerHTML = '';

    ALL_SKINS.forEach((skin) => {
      const isUnlocked = unlocked.includes(skin.id);
      const rarity = UI_SKIN_RARITY[skin.id] ?? { label: 'Эпический', css: 'rarity-epic' };
      const card = document.createElement('div');
      card.className = `gacha-skin-card ${selected === skin.id ? 'active' : ''} ${isUnlocked ? '' : 'locked'}`;
      card.innerHTML = `
        <div class="rarity-badge ${rarity.css}">${rarity.label}</div>
        <div class="gacha-skin-badge">${isUnlocked ? skin.badge : '🔒'}</div>
        <div class="gacha-skin-name">${isUnlocked ? skin.name : 'Секретный скин'}</div>
        <div class="gacha-skin-tag">${selected === skin.id ? 'ВЫБРАН' : isUnlocked ? 'ДОСТУПЕН' : 'ЗАКРЫТ'}</div>
      `;
      if (isUnlocked) {
        card.addEventListener('click', () => {
          onSelectSkin(skin.id);
          this.closeSkins();
        });
      }
      container.appendChild(card);
    });
  }

  bindActions(handlers: UIActions): void {
    this.uiActions = handlers;
    this.mainMenuModal?.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (
        target.closest('button') ||
        target.closest('.top-pill') ||
        target.closest('.floating-widget-btn') ||
        target.closest('.dock-btn') ||
        target.closest('#menu-dev-btn')
      ) {
        return;
      }
      this.closeMainMenu();
      this.showHud();
      handlers.onPlay();
    });

    this.menuPlayBtn?.addEventListener('click', () => {
      this.closeMainMenu();
      this.showHud();
      handlers.onPlay();
    });
    this.pauseBtn?.addEventListener('click', handlers.onPause);
    this.pauseResumeBtn?.addEventListener('click', handlers.onResume);
    this.pauseMenuBtn?.addEventListener('click', handlers.onToMenu);
    this.toMenuBtn?.addEventListener('click', handlers.onToMenu);
    this.restartBtn?.addEventListener('click', handlers.onRestart);
    this.menuDailyBtn?.addEventListener('click', () => {
      handlers.onOpenDaily?.();
    });
    this.menuDailyQuestsBtn?.addEventListener('click', () => {
      handlers.onOpenDailyQuests?.();
    });
    this.dailyClaimBtn?.addEventListener('click', () => {
      handlers.onClaimDaily?.(false);
    });
    this.dailyDoubleBtn?.addEventListener('click', () => {
      handlers.onClaimDaily?.(true);
    });

    this.devAddCoinsBtn?.addEventListener('click', () => handlers.onDevAddCoins?.());
    this.devBonusBtn?.addEventListener('click', () => handlers.onDevClaimDailyBonus?.());
    this.devCompleteQuestsBtn?.addEventListener('click', () => handlers.onDevCompleteQuests?.());
    this.devRerollQuestsBtn?.addEventListener('click', () => handlers.onDevRerollQuests?.());
    this.devCycleBiomeBtn?.addEventListener('click', () => handlers.onDevCycleBiome?.());
    this.devGodModeBtn?.addEventListener('click', () => handlers.onDevToggleGodMode?.());
    this.devPerfBtn?.addEventListener('click', () => handlers.onDevTogglePerfHUD?.());
    this.devBenchmarkBtn?.addEventListener('click', () => handlers.onDevStartBenchmark?.());
    this.devReportBtn?.addEventListener('click', () => handlers.onDevOpenReport?.());

    this.leaderboardSaveNameBtn?.addEventListener('click', () => {
      const raw = this.leaderboardNameInput?.value ?? '';
      const clean = raw.trim().slice(0, 18) || 'Игрок';
      if (this.leaderboardNameInput) {
        this.leaderboardNameInput.value = clean;
      }
      handlers.onSaveName(clean);
    });

    this.settingSoundToggle?.addEventListener('change', () => {
      if (this.settingSoundToggle) {
        handlers.onToggleSound(this.settingSoundToggle.checked);
      }
    });

    this.settingMusicToggle?.addEventListener('change', () => {
      if (this.settingMusicToggle) {
        handlers.onToggleMusic(this.settingMusicToggle.checked);
      }
    });
  }

  setSoundToggle(enabled: boolean): void {
    if (this.settingSoundToggle) {
      this.settingSoundToggle.checked = enabled;
    }
  }

  setMusicToggle(enabled: boolean): void {
    if (this.settingMusicToggle) {
      this.settingMusicToggle.checked = enabled;
    }
  }

  setPlayerName(name: string): void {
    if (this.leaderboardNameInput) {
      this.leaderboardNameInput.value = name;
    }
  }

  getPlayerName(): string {
    return this.leaderboardNameInput?.value.trim().slice(0, 18) || 'Игрок';
  }

  isNameInputFocused(): boolean {
    return document.activeElement === this.leaderboardNameInput;
  }

  blurNameInput(): void {
    this.leaderboardNameInput?.blur();
  }

  clickSaveName(): void {
    this.leaderboardSaveNameBtn?.click();
  }

  clickRollGacha(): void {
    this.gachaModalRollBtn?.click();
  }

  setGachaRollButtonText(text: string): void {
    if (this.gachaModalRollBtn) {
      this.gachaModalRollBtn.textContent = text;
    }
  }

  updateAchievementsBadge(unlocked: number, total: number): void {
    if (this.menuAchievementsBadgeEl) {
      this.menuAchievementsBadgeEl.textContent = `${unlocked}/${total}`;
      if (unlocked > 0) {
        this.menuAchievementsBadgeEl.classList.remove('hidden');
      } else {
        this.menuAchievementsBadgeEl.classList.add('hidden');
      }
    }
  }

  clickOpenAchievements(): void {
    this.menuAchievementsBtn?.click();
  }

  renderAchievements(
    achievements: Achievement[],
    summary: { total: number; unlockedCount: number; percent: number },
    onClaim?: (id: AchievementId) => void
  ): void {
    this.updateAchievementsBadge(summary.unlockedCount, summary.total);

    if (this.achSummaryTextEl) {
      this.achSummaryTextEl.textContent = `Открыто: ${summary.unlockedCount} из ${summary.total} (${summary.percent}%)`;
    }
    if (this.achSummaryBarEl) {
      this.achSummaryBarEl.style.width = `${summary.percent}%`;
    }
    if (!this.achievementsListEl) return;
    this.achievementsListEl.innerHTML = '';

    const diffLabels: Record<string, string> = {
      easy: 'Легко',
      medium: 'Средне',
      hard: 'Сложно',
      master: 'Мастер',
    };

    for (const ach of achievements) {
      const card = document.createElement('div');
      let cardClass = 'ach-card';
      if (ach.canClaim) cardClass += ' unlocked claimable';
      else if (ach.claimed) cardClass += ' unlocked claimed';
      else if (ach.unlocked) cardClass += ' unlocked';
      else cardClass += ' locked';
      card.className = cardClass;

      const diffText = diffLabels[ach.difficulty] ?? 'Легко';
      let actionHtml = '';
      if (ach.canClaim) {
        actionHtml = `<button class="ach-claim-btn" type="button">Забрать +${ach.rewardCoins} 🪙</button>`;
      } else if (ach.claimed) {
        actionHtml = `<span class="ach-status-badge done">✅ Забрано</span>`;
      } else if (ach.unlocked) {
        actionHtml = `<span class="ach-status-badge done">✅ Открыто</span>`;
      } else {
        actionHtml = `<span class="ach-status-badge pending">🔒 В процессе</span>`;
      }

      card.innerHTML = `
        <div class="ach-badge-col">
          <div class="ach-badge-icon">${ach.badge}</div>
        </div>
        <div class="ach-info-col">
          <div class="ach-title-row">
            <span class="ach-title">${ach.title}</span>
            <span class="ach-diff-tag ${ach.difficulty}">${diffText}</span>
            ${actionHtml}
          </div>
          <div class="ach-desc">${ach.description}</div>
          <div class="ach-progress-row">
            <div class="ach-progress-bar-bg small">
              <div class="ach-progress-bar-fill ${ach.unlocked ? 'gold' : 'blue'}" style="width: ${ach.progressPercent}%;"></div>
            </div>
            <span class="ach-progress-num">${ach.currentProgress} / ${ach.maxProgress}</span>
            <span class="ach-reward-tag">+${ach.rewardCoins} 🪙</span>
          </div>
        </div>
      `;

      if (ach.canClaim && onClaim) {
        card.addEventListener('click', (e) => {
          e.stopPropagation();
          onClaim(ach.id);
        });
      }

      this.achievementsListEl.appendChild(card);
    }
  }

  spawnFlyingCoins(origin: HTMLElement | { x: number; y: number }, coinCount = 7): void {
    if (typeof document === 'undefined') return;

    let startX = (typeof window !== 'undefined' ? window.innerWidth : 800) / 2;
    let startY = (typeof window !== 'undefined' ? window.innerHeight : 600) / 2;
    if ('getBoundingClientRect' in origin && typeof origin.getBoundingClientRect === 'function') {
      const rect = origin.getBoundingClientRect();
      if (rect.width > 0 || rect.height > 0) {
        startX = rect.left + rect.width / 2;
        startY = rect.top + rect.height / 2;
      }
    } else if (origin && 'x' in origin && typeof origin.x === 'number') {
      startX = origin.x;
      startY = origin.y;
    }

    const candidates = [
      this.questsCoinsValEl,
      this.menuCoinsEl,
      this.coinsEl,
      document.getElementById('quests-coins-val'),
      document.getElementById('menu-coins'),
      document.getElementById('coins-value'),
    ];

    let targetEl: HTMLElement | null = null;
    let targetX = (typeof window !== 'undefined' ? window.innerWidth : 800) - 48;
    let targetY = 36;

    for (const el of candidates) {
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0 && rect.top >= 0 && rect.left >= 0) {
          targetEl = el;
          targetX = rect.left + rect.width / 2;
          targetY = rect.top + rect.height / 2;
          break;
        }
      }
    }

    const count = Math.max(5, Math.min(8, coinCount));
    let landedCount = 0;

    const rAF = (typeof requestAnimationFrame === 'function')
      ? requestAnimationFrame
      : (cb: (now: number) => void) => setTimeout(() => cb(performance.now()), 16);

    for (let i = 0; i < count; i++) {
      const coin = document.createElement('div');
      coin.className = 'flying-coin-particle';
      coin.textContent = '🪙';
      document.body.appendChild(coin);

      const delay = i * 45;
      const duration = 520 + Math.random() * 140;
      const cpX = (startX + targetX) / 2 + (Math.random() - 0.5) * 60;
      const cpY = Math.min(startY, targetY) - (60 + Math.random() * 80);

      const startTime = performance.now() + delay;

      const animateStep = (now: number) => {
        if (now < startTime) {
          rAF(animateStep);
          return;
        }

        const elapsed = now - startTime;
        const t = Math.min(1, elapsed / duration);
        const easeT = t * t * (3 - 2 * t);

        const inv = 1 - easeT;
        const curX = inv * inv * startX + 2 * inv * easeT * cpX + easeT * easeT * targetX;
        const curY = inv * inv * startY + 2 * inv * easeT * cpY + easeT * easeT * targetY;

        const scale = t < 0.25 ? 0.6 + t * 2.5 : Math.max(0.65, 1.25 - (t - 0.25) * 0.7);
        const rotation = (i % 2 === 0 ? 1 : -1) * (t * 360);

        coin.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`;
        coin.style.opacity = t > 0.88 ? `${(1 - t) / 0.12}` : '1';

        if (t < 1) {
          rAF(animateStep);
        } else {
          coin.remove();
          landedCount++;
          if (landedCount === 1 || landedCount === count) {
            this.pulseCoinCounter(targetEl);
          }
        }
      };

      setTimeout(() => {
        if (coin.parentNode) {
          coin.remove();
        }
      }, 2500);

      rAF(animateStep);
    }
  }

  public pulseCoinCounter(targetEl: HTMLElement | null): void {
    const el = targetEl || this.questsCoinsValEl || this.menuCoinsEl || this.coinsEl;
    if (!el) return;
    el.classList.remove('coin-counter-pulse');
    void el.offsetWidth;
    el.classList.add('coin-counter-pulse');
    setTimeout(() => {
      el.classList.remove('coin-counter-pulse');
    }, 320);
  }
}
