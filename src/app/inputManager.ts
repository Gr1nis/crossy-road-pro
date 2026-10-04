import { MoveDirection, type MoveDirectionValue } from '../core/types.ts';

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
  isInputBlocked?: () => boolean;
}

export interface ModalStateProvider {
  isSettingsOpen: () => boolean;
  isPauseOpen: () => boolean;
  isMainMenuOpen: () => boolean;
  isGachaOpen: () => boolean;
  isLeaderboardOpen: () => boolean;
  isGameOverOpen: () => boolean;
  isNameInputFocused?: () => boolean;
  isPlaying: () => boolean;
}

export class InputManager {
  private readonly callbacks: InputCallbacks;
  private readonly modalState: ModalStateProvider;
  private isAttached = false;
  private touchStartX = 0;
  private touchStartY = 0;
  private touchStartTime = 0;
  private touchIsInteractive = false;

  constructor(callbacks: InputCallbacks, modalState: ModalStateProvider) {
    this.callbacks = callbacks;
    this.modalState = modalState;
  }

  public attach(): void {
    if (this.isAttached) return;
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('touchstart', this.handleTouchStart, { passive: true });
    window.addEventListener('touchmove', this.handleTouchMove, { passive: false });
    window.addEventListener('touchend', this.handleTouchEnd, { passive: true });
    this.isAttached = true;
  }

  public detach(): void {
    if (!this.isAttached) return;
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('touchstart', this.handleTouchStart);
    window.removeEventListener('touchmove', this.handleTouchMove);
    window.removeEventListener('touchend', this.handleTouchEnd);
    this.isAttached = false;
  }

  public handleTouchStart = (e: TouchEvent): void => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
    this.touchStartTime = performance.now();
    const target = e.target as HTMLElement | null;
    this.touchIsInteractive = Boolean(target?.closest('button, input, select, textarea, a, .modal-card'));
  };

  public handleTouchMove = (e: TouchEvent): void => {
    if (!this.touchIsInteractive && this.modalState.isPlaying()) {
      if (e.cancelable) e.preventDefault();
    }
  };

  public handleTouchEnd = (e: TouchEvent): void => {
    if (this.touchIsInteractive) return;
    if (this.callbacks.isInputBlocked?.()) return;
    if (!this.modalState.isPlaying()) return;

    if (e.changedTouches.length === 0) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - this.touchStartX;
    const dy = touch.clientY - this.touchStartY;
    const dist = Math.hypot(dx, dy);
    const dt = performance.now() - this.touchStartTime;

    const SWIPE_THRESHOLD = 26;
    const TAP_MAX_DURATION = 400;

    if (dist < SWIPE_THRESHOLD && dt < TAP_MAX_DURATION) {
      this.callbacks.onMove(MoveDirection.FORWARD);
      return;
    }

    if (dist >= SWIPE_THRESHOLD) {
      if (Math.abs(dx) > Math.abs(dy)) {
        this.callbacks.onMove(dx > 0 ? MoveDirection.RIGHT : MoveDirection.LEFT);
      } else {
        this.callbacks.onMove(dy < 0 ? MoveDirection.FORWARD : MoveDirection.BACKWARD);
      }
    }
  };

  public handleKeyDown = (e: KeyboardEvent): void => {
    if (this.callbacks.isInputBlocked?.()) {
      return;
    }

    // Modal priority: Settings -> Pause -> Gacha -> Leaderboard -> Main Menu -> Game Over
    if (this.modalState.isSettingsOpen()) {
      if (e.code === 'Escape' || e.code === 'Enter') {
        e.preventDefault();
        this.callbacks.onCloseModal();
      }
      return;
    }

    if (this.modalState.isPauseOpen()) {
      if (e.code === 'Escape' || e.code === 'KeyP' || e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        this.callbacks.onResumeGame();
      }
      return;
    }

    if (this.modalState.isGachaOpen()) {
      if (e.code === 'Escape') {
        e.preventDefault();
        this.callbacks.onCloseModal();
      } else if (e.code === 'KeyG' || e.code === 'Enter') {
        e.preventDefault();
        this.callbacks.onGachaRoll();
      }
      return;
    }

    if (this.modalState.isLeaderboardOpen()) {
      if (this.modalState.isNameInputFocused?.()) {
        if (e.code === 'Enter') {
          e.preventDefault();
          this.callbacks.onSavePlayerName?.();
        } else if (e.code === 'Escape') {
          e.preventDefault();
          this.callbacks.onCloseModal();
        }
        return;
      }

      if (e.code === 'Escape' || e.code === 'Enter') {
        e.preventDefault();
        this.callbacks.onCloseModal();
      }
      return;
    }

    if (this.modalState.isMainMenuOpen()) {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        this.callbacks.onStartGame();
      }
      return;
    }

    if (this.modalState.isGameOverOpen()) {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        this.callbacks.onRestartGame();
      } else if (e.code === 'Escape') {
        e.preventDefault();
        this.callbacks.onToMenu();
      }
      return;
    }

    if (this.modalState.isNameInputFocused?.()) {
      if (e.code === 'Enter') {
        e.preventDefault();
        this.callbacks.onSavePlayerName?.();
      }
      return;
    }

    if (!this.modalState.isPlaying()) {
      return;
    }

    // In-game pause toggle
    if (e.code === 'Escape' || e.code === 'KeyP') {
      e.preventDefault();
      this.callbacks.onPauseGame();
      return;
    }

    // Active gameplay movement
    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
      case 'Space':
        e.preventDefault();
        this.callbacks.onMove(MoveDirection.FORWARD);
        break;
      case 'KeyS':
      case 'ArrowDown':
        e.preventDefault();
        this.callbacks.onMove(MoveDirection.BACKWARD);
        break;
      case 'KeyA':
      case 'ArrowLeft':
        e.preventDefault();
        this.callbacks.onMove(MoveDirection.LEFT);
        break;
      case 'KeyD':
      case 'ArrowRight':
        e.preventDefault();
        this.callbacks.onMove(MoveDirection.RIGHT);
        break;
    }
  };

  public triggerMove(dir: MoveDirectionValue): void {
    if (this.callbacks.isInputBlocked?.()) return;
    if (!this.modalState.isPlaying()) return;
    this.callbacks.onMove(dir);
  }
}
