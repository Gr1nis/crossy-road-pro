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

  constructor(callbacks: InputCallbacks, modalState: ModalStateProvider) {
    this.callbacks = callbacks;
    this.modalState = modalState;
  }

  public attach(): void {
    if (this.isAttached) return;
    window.addEventListener('keydown', this.handleKeyDown);
    this.isAttached = true;
  }

  public detach(): void {
    if (!this.isAttached) return;
    window.removeEventListener('keydown', this.handleKeyDown);
    this.isAttached = false;
  }

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
