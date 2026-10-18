import { MoveDirection, type MoveDirectionValue } from '../core/types.ts';
import {
  type ControlsType,
  type SettingsManager,
  type SwipeSensitivity,
} from '../core/settingsManager.ts';

export interface InputCallbacks {
  onMove: (dir: MoveDirectionValue) => void;
  onStartGame: () => void;
  onPauseGame: () => void;
  onResumeGame: () => void;
  onRestartGame: () => void;
  onToMenu: () => void;
  onGachaRoll: () => void;
  onCloseModal: () => void;
  onSavePlayerName?: () => void;
  onTogglePerfHUD?: () => void;
  isInputBlocked?: () => boolean;
}

export interface ModalStateProvider {
  isSettingsOpen: () => boolean;
  isPauseOpen: () => boolean;
  isMainMenuOpen: () => boolean;
  isGachaOpen: () => boolean;
  isSkinsOpen?: () => boolean;
  isLeaderboardOpen: () => boolean;
  isAchievementsOpen?: () => boolean;
  isDailyBonusOpen?: () => boolean;
  isDailyQuestsOpen?: () => boolean;
  isDevModalOpen?: () => boolean;
  isPerfReportModalOpen?: () => boolean;
  isGameOverOpen: () => boolean;
  isNameInputFocused?: () => boolean;
  isPlaying: () => boolean;
}

export const SWIPE_THRESHOLDS: Record<SwipeSensitivity, number> = {
  low: 38,
  normal: 26,
  high: 16,
};

export class InputManager {
  private readonly callbacks: InputCallbacks;
  private readonly modalState: ModalStateProvider;
  private readonly settings?: SettingsManager;
  private settingsUnsubscribe?: () => void;
  private dpadContainer: HTMLElement | null = null;

  private isAttached = false;
  private touchStartX = 0;
  private touchStartY = 0;
  private touchStartTime = 0;
  private touchIsInteractive = false;

  constructor(
    callbacks: InputCallbacks,
    modalState: ModalStateProvider,
    settings?: SettingsManager
  ) {
    this.callbacks = callbacks;
    this.modalState = modalState;
    this.settings = settings;
  }

  public attach(): void {
    if (this.isAttached) return;
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('touchstart', this.handleTouchStart, { passive: true });
    window.addEventListener('touchmove', this.handleTouchMove, { passive: false });
    window.addEventListener('touchend', this.handleTouchEnd, { passive: true });

    this.bindDpad();
    if (this.settings) {
      this.settingsUnsubscribe = this.settings.subscribe(() => this.syncDpadVisibility());
    }
    this.syncDpadVisibility();
    this.isAttached = true;
  }

  public detach(): void {
    if (!this.isAttached) return;
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('touchstart', this.handleTouchStart);
    window.removeEventListener('touchmove', this.handleTouchMove);
    window.removeEventListener('touchend', this.handleTouchEnd);
    this.settingsUnsubscribe?.();
    this.isAttached = false;
  }

  public isDpadActive(): boolean {
    const isPlaying = this.modalState.isPlaying();
    const isPaused = this.modalState.isPauseOpen();
    const isModal =
      this.modalState.isMainMenuOpen() ||
      this.modalState.isGameOverOpen() ||
      this.modalState.isGachaOpen() ||
      this.isAnyGenericModalOpen();

    const ctrlType: ControlsType = this.settings?.getSetting('controlsType') ?? 'swipe';
    return ctrlType === 'dpad' && isPlaying && !isPaused && !isModal;
  }

  public syncDpadVisibility(): void {
    if (typeof document === 'undefined') return;
    if (!this.dpadContainer) this.dpadContainer = document.getElementById('on-screen-dpad');
    this.dpadContainer?.classList.toggle('hidden', !this.isDpadActive());
  }

  private isAnyGenericModalOpen(): boolean {
    return (
      this.modalState.isSettingsOpen() ||
      this.modalState.isLeaderboardOpen() ||
      Boolean(this.modalState.isAchievementsOpen?.()) ||
      Boolean(this.modalState.isDailyBonusOpen?.()) ||
      Boolean(this.modalState.isDailyQuestsOpen?.()) ||
      Boolean(this.modalState.isDevModalOpen?.()) ||
      Boolean(this.modalState.isPerfReportModalOpen?.())
    );
  }

  private bindDpad(): void {
    if (typeof document === 'undefined') return;
    this.dpadContainer = document.getElementById('on-screen-dpad');
    if (!this.dpadContainer) return;

    const dirs: Array<[string, MoveDirectionValue]> = [
      ['dpad-up', MoveDirection.FORWARD],
      ['dpad-down', MoveDirection.BACKWARD],
      ['dpad-left', MoveDirection.LEFT],
      ['dpad-right', MoveDirection.RIGHT],
    ];

    for (const [id, dir] of dirs) {
      const btn = document.getElementById(id);
      if (!btn) continue;
      let lastTrigger = 0;
      const onTrigger = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        const now = performance.now();
        if (now - lastTrigger < 80) return;
        lastTrigger = now;
        if (this.callbacks.isInputBlocked?.() || !this.modalState.isPlaying()) return;
        this.callbacks.onMove(dir);
      };
      btn.addEventListener('pointerdown', onTrigger);
      btn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); });
      btn.addEventListener('contextmenu', (e) => { e.preventDefault(); e.stopPropagation(); });
    }
  }

  public handleTouchStart = (e: TouchEvent): void => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
    this.touchStartTime = performance.now();
    const target = e.target as HTMLElement | null;
    this.touchIsInteractive = Boolean(
      target?.closest('button, input, select, textarea, a, .modal-card, #on-screen-dpad')
    );
  };

  public handleTouchMove = (e: TouchEvent): void => {
    if (!this.touchIsInteractive && this.modalState.isPlaying() && e.cancelable) {
      e.preventDefault();
    }
  };

  public handleTouchEnd = (e: TouchEvent): void => {
    if (this.touchIsInteractive || this.callbacks.isInputBlocked?.()) return;
    if (!this.modalState.isPlaying() || this.modalState.isDailyQuestsOpen?.()) return;
    if (e.changedTouches.length === 0) return;

    const touch = e.changedTouches[0];
    const dx = touch.clientX - this.touchStartX;
    const dy = touch.clientY - this.touchStartY;
    const dist = Math.hypot(dx, dy);
    const dt = performance.now() - this.touchStartTime;

    const ctrlType: ControlsType = this.settings?.getSetting('controlsType') ?? 'swipe';
    const sens: SwipeSensitivity = this.settings?.getSetting('swipeSensitivity') ?? 'normal';
    const threshold = SWIPE_THRESHOLDS[sens] ?? 26;

    if (dist < threshold && dt < 400) {
      if (ctrlType === 'tap') {
        const w = window.innerWidth;
        const h = window.innerHeight;
        if (this.touchStartX < w * 0.25) this.callbacks.onMove(MoveDirection.LEFT);
        else if (this.touchStartX > w * 0.75) this.callbacks.onMove(MoveDirection.RIGHT);
        else if (this.touchStartY > h * 0.8) this.callbacks.onMove(MoveDirection.BACKWARD);
        else this.callbacks.onMove(MoveDirection.FORWARD);
      } else {
        this.callbacks.onMove(MoveDirection.FORWARD);
      }
      return;
    }

    if (dist >= threshold) {
      if (Math.abs(dx) > Math.abs(dy)) {
        this.callbacks.onMove(dx > 0 ? MoveDirection.RIGHT : MoveDirection.LEFT);
      } else {
        this.callbacks.onMove(dy < 0 ? MoveDirection.FORWARD : MoveDirection.BACKWARD);
      }
    }
  };

  public handleKeyDown = (e: KeyboardEvent): void => {
    if (e.code === 'F3' || (e.altKey && e.code === 'KeyP')) {
      e.preventDefault();
      this.callbacks.onTogglePerfHUD?.();
      return;
    }
    if (this.callbacks.isInputBlocked?.()) return;

    if (this.modalState.isNameInputFocused?.()) {
      if (e.code === 'Enter') { e.preventDefault(); this.callbacks.onSavePlayerName?.(); }
      else if (e.code === 'Escape') { e.preventDefault(); this.callbacks.onCloseModal(); }
      return;
    }

    if (this.modalState.isPauseOpen()) {
      if (['Escape', 'KeyP', 'Space', 'Enter'].includes(e.code)) {
        e.preventDefault();
        this.callbacks.onResumeGame();
      }
      return;
    }

    if (this.modalState.isGachaOpen()) {
      if (e.code === 'Escape') { e.preventDefault(); this.callbacks.onCloseModal(); }
      else if (e.code === 'KeyG' || e.code === 'Enter') { e.preventDefault(); this.callbacks.onGachaRoll(); }
      return;
    }

    if (this.modalState.isMainMenuOpen()) {
      if (e.code === 'Space' || e.code === 'Enter') { e.preventDefault(); this.callbacks.onStartGame(); }
      return;
    }

    if (this.modalState.isGameOverOpen()) {
      if (e.code === 'Space' || e.code === 'Enter') { e.preventDefault(); this.callbacks.onRestartGame(); }
      else if (e.code === 'Escape') { e.preventDefault(); this.callbacks.onToMenu(); }
      return;
    }

    if (this.isAnyGenericModalOpen()) {
      if (e.code === 'Escape' || e.code === 'Enter') { e.preventDefault(); this.callbacks.onCloseModal(); }
      return;
    }

    if (!this.modalState.isPlaying()) return;

    if (e.code === 'Escape' || e.code === 'KeyP') {
      e.preventDefault();
      this.callbacks.onPauseGame();
      return;
    }

    switch (e.code) {
      case 'KeyW': case 'ArrowUp': case 'Space':
        e.preventDefault(); this.callbacks.onMove(MoveDirection.FORWARD); break;
      case 'KeyS': case 'ArrowDown':
        e.preventDefault(); this.callbacks.onMove(MoveDirection.BACKWARD); break;
      case 'KeyA': case 'ArrowLeft':
        e.preventDefault(); this.callbacks.onMove(MoveDirection.LEFT); break;
      case 'KeyD': case 'ArrowRight':
        e.preventDefault(); this.callbacks.onMove(MoveDirection.RIGHT); break;
    }
  };

  public triggerMove(dir: MoveDirectionValue): void {
    if (this.callbacks.isInputBlocked?.() || !this.modalState.isPlaying()) return;
    if (this.modalState.isDailyQuestsOpen?.()) return;
    this.callbacks.onMove(dir);
  }
}
