import { ALL_SKINS } from '../core/types.ts';

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
  onSaveName: (name: string) => void;
  onToggleSound: (enabled: boolean) => void;
  onToggleMusic: (enabled: boolean) => void;
}

export const UI_SKIN_RARITY: Record<string, { label: string; css: string }> = {
  chicken: { label: 'Обычный', css: 'rarity-common' },
  cyber_duck: { label: 'Редкий', css: 'rarity-rare' },
  shadow_ninja: { label: 'Эпический', css: 'rarity-epic' },
  frost_penguin: { label: 'Легендарный', css: 'rarity-legendary' },
};

export class UIManager {
  // HUD
  private readonly scoreEl: HTMLElement | null;
  private readonly coinsEl: HTMLElement | null;
  private readonly pauseBtn: HTMLElement | null;
  private readonly warningVignetteEl: HTMLElement | null;
  private readonly toastContainerEl: HTMLElement | null;

  // Modals
  private readonly mainMenuModal: HTMLElement | null;
  private readonly pauseModal: HTMLElement | null;
  private readonly settingsModal: HTMLElement | null;
  private readonly gachaModal: HTMLElement | null;
  private readonly leaderboardModal: HTMLElement | null;
  private readonly gameOverModal: HTMLElement | null;

  // Buttons & Controls
  private readonly menuPlayBtn: HTMLElement | null;
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
  private readonly gachaModalStatusEl: HTMLElement | null;
  private readonly gachaModalSkinListEl: HTMLElement | null;

  private readonly leaderboardCloseBtn: HTMLElement | null;
  private readonly leaderboardBestScoreEl: HTMLElement | null;
  private readonly leaderboardNameInput: HTMLInputElement | null;
  private readonly leaderboardSaveNameBtn: HTMLElement | null;
  private readonly leaderboardRowsEl: HTMLElement | null;

  private readonly deathReasonEl: HTMLElement | null;
  private readonly restartBtn: HTMLElement | null;
  private readonly toMenuBtn: HTMLElement | null;

  // State
  private lastScore = -1;
  private lastCoins = -1;
  private settingsReturnTo: 'menu' | 'pause' = 'menu';

  constructor() {
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
    this.gameOverModal = document.getElementById('game-over-modal');

    this.menuPlayBtn = document.getElementById('menu-play-btn');
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
    this.gachaModalStatusEl = document.getElementById('gacha-modal-status');
    this.gachaModalSkinListEl = document.getElementById('gacha-modal-skin-list');

    this.leaderboardCloseBtn = document.getElementById('leaderboard-close-btn');
    this.leaderboardBestScoreEl = document.getElementById('leaderboard-best-score');
    this.leaderboardNameInput = document.getElementById('leaderboard-name-input') as HTMLInputElement | null;
    this.leaderboardSaveNameBtn = document.getElementById('leaderboard-save-name-btn');
    this.leaderboardRowsEl = document.getElementById('leaderboard-rows');

    this.deathReasonEl = document.getElementById('death-reason');
    this.restartBtn = document.getElementById('restart-btn');
    this.toMenuBtn = document.getElementById('to-menu-btn');

    this.setupInternalNavigation();
  }

  private setupInternalNavigation(): void {
    this.menuGachaBtn?.addEventListener('click', () => this.openGacha());
    this.gachaModalCloseBtn?.addEventListener('click', () => this.closeGacha());
    this.menuLeaderboardBtn?.addEventListener('click', () => this.openLeaderboard());
    this.leaderboardCloseBtn?.addEventListener('click', () => this.closeLeaderboard());
    this.menuSettingsBtn?.addEventListener('click', () => this.openSettings('menu'));
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
    this.gameOverModal?.classList.add('hidden');
  }

  openMainMenu(): void {
    this.hideAllModals();
    this.mainMenuModal?.classList.remove('hidden');
  }

  closeMainMenu(): void {
    this.mainMenuModal?.classList.add('hidden');
  }

  openPause(): void {
    this.pauseModal?.classList.remove('hidden');
  }

  closePause(): void {
    this.pauseModal?.classList.add('hidden');
  }

  openSettings(returnTo: 'menu' | 'pause' = 'menu'): void {
    this.settingsReturnTo = returnTo;
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

  openGacha(): void {
    this.gachaModal?.classList.remove('hidden');
  }

  closeGacha(): void {
    this.gachaModal?.classList.add('hidden');
  }

  openLeaderboard(): void {
    this.leaderboardModal?.classList.remove('hidden');
  }

  closeLeaderboard(): void {
    this.leaderboardModal?.classList.add('hidden');
  }

  showGameOver(reasonText: string): void {
    if (this.deathReasonEl) {
      this.deathReasonEl.textContent = reasonText;
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
    return Boolean(this.gachaModal && !this.gachaModal.classList.contains('hidden'));
  }

  isLeaderboardOpen(): boolean {
    return Boolean(this.leaderboardModal && !this.leaderboardModal.classList.contains('hidden'));
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

  updateGachaStatus(message: string): void {
    if (this.gachaModalStatusEl) {
      this.gachaModalStatusEl.textContent = message;
    }
  }

  updateMenuStats(highScore: number, coins: number): void {
    if (this.menuHighScoreEl) this.menuHighScoreEl.textContent = String(highScore);
    if (this.menuCoinsEl) this.menuCoinsEl.textContent = String(coins);
    if (this.leaderboardBestScoreEl) this.leaderboardBestScoreEl.textContent = String(highScore);
    if (this.gachaModalCoinsEl) this.gachaModalCoinsEl.textContent = String(coins);
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
        <span>#${entry.rank} ${!entry.isBot ? '(Вы)' : ''}</span>
        <span>${badge} ${entry.playerName}</span>
        <span>${entry.score}</span>
      </div>
    `;
      })
      .join('');
  }

  renderSkins(unlocked: string[], selected: string, onSelectSkin: (id: string) => void): void {
    if (!this.gachaModalSkinListEl) return;
    this.gachaModalSkinListEl.innerHTML = '';

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
        card.addEventListener('click', () => onSelectSkin(skin.id));
      }
      this.gachaModalSkinListEl?.appendChild(card);
    });
  }

  bindActions(handlers: UIActions): void {
    this.menuPlayBtn?.addEventListener('click', handlers.onPlay);
    this.pauseBtn?.addEventListener('click', handlers.onPause);
    this.pauseResumeBtn?.addEventListener('click', handlers.onResume);
    this.pauseMenuBtn?.addEventListener('click', handlers.onToMenu);
    this.toMenuBtn?.addEventListener('click', handlers.onToMenu);
    this.restartBtn?.addEventListener('click', handlers.onRestart);
    this.gachaModalRollBtn?.addEventListener('click', handlers.onRollGacha);

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
}
