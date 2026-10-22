import { ALL_SKINS, type SkinId } from '../core/types.ts';
import { MENU_ICONS } from '../view/menuIconsBase64.ts';
import { GACHA_ICONS } from '../view/gachaIconsBase64.ts';
import {
  createGachaCardElement,
  revealGachaWinningCard,
  spawnGachaConfetti,
  preloadGachaCardThumbnails,
} from '../view/gachaCardArt.ts';
import { GachaRouletteAnim } from './gachaRouletteAnim.ts';

export interface GachaModalCallbacks {
  onRoll: () => void;
  onSelectAndPlay: (skinId: string) => void;
  onTick: (pitch: number) => void;
  onClose: () => void;
}

export function getGachaMachineCoinUrl(): string {
  return typeof MENU_ICONS !== 'undefined' && MENU_ICONS?.coin
    ? MENU_ICONS.coin
    : (typeof GACHA_ICONS !== 'undefined' && GACHA_ICONS?.coin ? GACHA_ICONS.coin : '');
}

export class GachaMachineModal {
  private readonly modal: HTMLElement | null;
  private readonly coinsEl: HTMLElement | null;
  private readonly closeBtn: HTMLElement | null;
  private readonly rollBtn: HTMLElement | null;
  private readonly trackEl: HTMLElement | null;
  private readonly viewportEl: HTMLElement | null;
  private readonly winFxEl: HTMLElement | null;
  private readonly dupStampEl: HTMLElement | null;
  private readonly cashbackFlyerEl: HTMLElement | null;
  private readonly callbacks: GachaModalCallbacks;
  private readonly anim: GachaRouletteAnim;

  private isSpinning = false;
  private hasSpinResult = false;
  private pendingWonSkinId: string | null = null;
  private unlockedSkins: SkinId[] = ['corgi'];
  private currentResult: { skinId?: string; rarity?: string; isDuplicate?: boolean; cashback?: number } | null = null;
  private currentOnFinished?: () => void;

  constructor(callbacks: GachaModalCallbacks) {
    this.callbacks = callbacks;
    const get = (id: string) => document.getElementById(id);
    this.modal = get('gacha-modal');
    this.coinsEl = get('gacha-modal-coins');
    this.closeBtn = get('gacha-modal-close-btn');
    this.rollBtn = get('gacha-modal-roll-btn');
    this.trackEl = get('gacha-modal-skin-list');
    this.viewportEl = get('gacha-viewport');
    this.winFxEl = get('gacha-win-fx');
    this.dupStampEl = get('gacha-duplicate-stamp');
    this.cashbackFlyerEl = get('gacha-cashback-flyer');

    this.anim = new GachaRouletteAnim(this.trackEl, this.viewportEl, {
      onTick: (pitch) => this.callbacks.onTick(pitch),
      onSpinFinished: (targetIndex) => {
        try {
          this.handleSpinComplete(this.currentResult || {}, targetIndex);
        } finally {
          this.isSpinning = false;
          this.pendingWonSkinId = null;
          this.currentResult = null;
          try {
            this.currentOnFinished?.();
          } catch (cbErr: unknown) {
            console.warn('[GachaMachineModal] onFinished error:', cbErr);
          }
        }
      },
    });

    this.bindEvents();
  }

  private bindEvents(): void {
    const handleClose = (e?: Event) => {
      e?.preventDefault();
      try { this.close(); } finally {
        try { this.callbacks.onClose(); } catch (cbErr: unknown) {
          console.warn('[GachaMachineModal] onClose error:', cbErr);
        }
      }
    };
    this.closeBtn?.addEventListener('click', handleClose);
    this.closeBtn?.addEventListener('touchend', handleClose);
    this.rollBtn?.addEventListener('click', () => {
      if (this.isSpinning) return;
      this.callbacks.onRoll();
    });
  }

  public getLockedSkins(): SkinId[] {
    const set = new Set(this.unlockedSkins);
    return ALL_SKINS.map((s) => s.id).filter((id) => !set.has(id));
  }

  public isAllUnlocked(): boolean { return this.getLockedSkins().length === 0; }
  public isSpinningActive(): boolean { return this.isSpinning; }
  public isOpen(): boolean { return Boolean(this.modal && !this.modal.classList.contains('hidden')); }
  public hasPendingSelection(): boolean { return Boolean(this.pendingWonSkinId); }
  public updateCoins(coins: number): void { if (this.coinsEl) this.coinsEl.textContent = String(coins); }
  public stopAmbientConveyor(): void { this.anim.stopAmbient(); }

  public open(currentSkinId: string = 'corgi', unlockedSkins?: string[]): void {
    if (unlockedSkins && Array.isArray(unlockedSkins)) {
      this.unlockedSkins = (unlockedSkins as SkinId[]).length > 0 ? (unlockedSkins as SkinId[]) : ['corgi'];
    }
    preloadGachaCardThumbnails();
    this.modal?.classList.remove('hidden');
    this.refreshReelState(currentSkinId);
  }

  public setUnlockedSkins(unlocked: string[]): void {
    this.unlockedSkins = (unlocked as SkinId[]) || ['corgi'];
    if (this.isOpen() && !this.isSpinning && !this.hasSpinResult && !this.pendingWonSkinId) {
      this.refreshReelState();
    }
  }

  public close(): void {
    try {
      this.anim.stopAll();
      this.isSpinning = false;
      this.hasSpinResult = false;
      this.pendingWonSkinId = null;
      this.currentResult = null;
      this.clearWinEffects();
      this.resetButton();
    } catch (err: unknown) {
      console.warn('[GachaMachineModal] Error closing modal:', err);
    } finally {
      this.modal?.classList.add('hidden');
    }
  }

  public shakeRollButton(): void {
    if (!this.rollBtn) return;
    this.rollBtn.classList.remove('shake-error');
    void this.rollBtn.offsetWidth;
    this.rollBtn.classList.add('shake-error');
    setTimeout(() => this.rollBtn?.classList.remove('shake-error'), 450);
  }

  public updateRollButtonPrice(priceText: string): void {
    if (!this.rollBtn) return;
    const priceEl = this.rollBtn.querySelector('.gacha-spin-price');
    if (priceEl) {
      const cleanText = priceText.replace(/🪙/g, '').trim();
      const coinUrl = getGachaMachineCoinUrl();
      priceEl.innerHTML = `${cleanText} <img src="${coinUrl}" class="gacha-btn-coin-img" alt="🪙">`;
    }
  }

  public resetButton(): void {
    if (!this.rollBtn) return;
    const coinUrl = getGachaMachineCoinUrl();
    this.rollBtn.removeAttribute('disabled');
    this.rollBtn.classList.remove('select-character-btn', 'all-collected-btn');
    this.rollBtn.innerHTML = `
      <div class="gacha-spin-content">
        <span class="gacha-spin-main">SPIN</span>
        <span class="gacha-spin-price">100 <img src="${coinUrl}" class="gacha-btn-coin-img" alt="🪙"></span>
      </div>`;
  }

  public clearWinEffects(): void {
    [this.winFxEl, this.dupStampEl, this.cashbackFlyerEl].forEach((el) => el?.classList.add('hidden'));
    this.trackEl?.querySelectorAll('.winning-card').forEach((c) => c.classList.remove('winning-card'));
    this.viewportEl?.querySelectorAll('.gacha-confetti-piece').forEach((c) => c.remove());
  }

  public refreshReelState(centerSkinId?: string): void {
    this.anim.stopAll();
    this.isSpinning = false;
    this.hasSpinResult = false;
    this.pendingWonSkinId = null;
    this.currentResult = null;
    this.clearWinEffects();
    this.resetButton();
    this.initReel(centerSkinId);
    this.startAmbientConveyor();
  }

  public initReel(_centerSkinId?: string): void {
    if (!this.trackEl) return;
    this.clearWinEffects();
    const allSkins = ALL_SKINS.map((s) => s.id);
    const block: SkinId[] = [...allSkins, ...allSkins];
    const reelSkins = [...block, ...block, ...block];
    this.anim.setRepeatWidth(block.length * 164);
    this.anim.resetAmbientOffset();
    this.trackEl.innerHTML = '';
    reelSkins.forEach((id, idx) => {
      const isSilhouette = !this.unlockedSkins.includes(id);
      this.trackEl?.appendChild(createGachaCardElement(id, idx, isSilhouette));
    });
    this.anim.setPosition(0);
  }

  public startAmbientConveyor(): void {
    if (this.isSpinning || this.pendingWonSkinId !== null) return;
    this.anim.startAmbient();
  }

  public startRoulette(
    result: { skinId?: string; rarity?: string; isDuplicate?: boolean; cashback?: number },
    onFinished?: () => void
  ): void {
    if (this.isSpinning || !this.trackEl) return;
    this.isSpinning = true;
    this.hasSpinResult = false;
    this.pendingWonSkinId = null;
    this.currentResult = result;
    this.currentOnFinished = onFinished;
    this.clearWinEffects();
    if (this.rollBtn) {
      this.rollBtn.setAttribute('disabled', 'true');
      this.rollBtn.classList.remove('select-character-btn');
      this.rollBtn.innerHTML = `<div class="gacha-spin-content"><span class="gacha-spin-main">КРУТИТСЯ...</span></div>`;
    }

    const winningSkin: SkinId = (result.skinId as SkinId) || 'corgi';
    const totalCards = 36;
    const targetIndex = 30;
    const allSkins = ALL_SKINS.map((s) => s.id);
    const reelSkins: SkinId[] = Array.from({ length: totalCards }, (_, i) =>
      i === targetIndex ? winningSkin : allSkins[Math.floor(Math.random() * allSkins.length)]
    );

    this.trackEl.innerHTML = '';
    reelSkins.forEach((id, idx) => {
      const isSilhouette = idx === targetIndex ? !result.isDuplicate : !this.unlockedSkins.includes(id);
      this.trackEl?.appendChild(createGachaCardElement(id, idx, isSilhouette));
    });
    this.anim.startSpin(targetIndex, totalCards);
  }

  private handleSpinComplete(
    result: { skinId?: string; rarity?: string; isDuplicate?: boolean; cashback?: number },
    targetIndex: number
  ): void {
    const coinUrl = getGachaMachineCoinUrl();
    try {
      const winningCardEl = this.trackEl?.querySelector(`[data-index="${targetIndex}"]`) as HTMLElement | null;

      if (!result.isDuplicate && result.skinId) {
        if (winningCardEl) revealGachaWinningCard(winningCardEl, result.skinId);
        this.winFxEl?.classList.remove('hidden');
        if (this.viewportEl) spawnGachaConfetti(this.viewportEl);
        const wonId = result.skinId as SkinId;
        if (!this.unlockedSkins.includes(wonId)) this.unlockedSkins.push(wonId);
      } else {
        if (winningCardEl) winningCardEl.classList.add('winning-card');
        if (this.dupStampEl) {
          const sub = this.dupStampEl.querySelector('.gacha-stamp-sub');
          if (sub) sub.textContent = `+${result.cashback ?? 40} 🪙 КЭШБЭК`;
          this.dupStampEl.classList.remove('hidden');
          void this.dupStampEl.offsetWidth;
        }
        if (this.cashbackFlyerEl) this.cashbackFlyerEl.textContent = `+${result.cashback ?? 40} 🪙`;
        this.triggerCashbackFlyer();
      }
    } catch (err: unknown) {
      console.warn('[GachaMachineModal] Error rendering spin rewards:', err);
    } finally {
      this.isSpinning = false;
      this.hasSpinResult = true;
      this.pendingWonSkinId = null;
      this.currentResult = null;
      if (this.rollBtn) {
        this.rollBtn.removeAttribute('disabled');
        this.rollBtn.classList.remove('all-collected-btn');
        this.rollBtn.classList.add('select-character-btn');
        this.rollBtn.innerHTML = `
          <div class="gacha-spin-content">
            <span class="gacha-spin-main">КРУТИТЬ ЕЩЁ</span>
            <span class="gacha-spin-price">100 <img src="${coinUrl}" class="gacha-btn-coin-img" alt="🪙"></span>
          </div>`;
      }
    }
  }

  private triggerCashbackFlyer(): void {
    if (!this.cashbackFlyerEl) return;
    this.cashbackFlyerEl.classList.remove('hidden', 'fly-anim');
    void this.cashbackFlyerEl.offsetWidth;
    this.cashbackFlyerEl.classList.add('fly-anim');
    setTimeout(() => {
      this.cashbackFlyerEl?.classList.add('hidden');
      this.cashbackFlyerEl?.classList.remove('fly-anim');
    }, 1200);
  }
}
