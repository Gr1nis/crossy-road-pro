import { ALL_SKINS, type SkinId } from '../core/types.ts';
import { SKIN_RARITY_MAP, type SkinRarityValue } from '../core/gachaMachine.ts';
import { getGachaCardSvg } from '../view/gachaCardArt.ts';

export interface GachaModalCallbacks {
  onRoll: () => void;
  onSelectAndPlay: (skinId: string) => void;
  onTick: (pitch: number) => void;
  onClose: () => void;
}

const CARD_NAMES_UPPER: Record<string, string> = {
  corgi: 'CORGI',
  pigeon_pizza: 'PIZZA PIGEON',
  box_cat: 'BOX CAT',
  raccoon_bandit: 'RACCOON',
  capybara_zen: 'CAPYBARA',
};

const RARITY_CSS_MAP: Record<SkinRarityValue, { label: string; css: string }> = {
  Common: { label: 'COMMON', css: 'rarity-common' },
  Rare: { label: 'RARE', css: 'rarity-rare' },
  Epic: { label: 'EPIC', css: 'rarity-epic' },
  Legendary: { label: 'LEGENDARY', css: 'rarity-legendary' },
};

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

  private isSpinning = false;
  private pendingWonSkinId: string | null = null;
  private reelInitialized = false;
  private animFrameId: number | null = null;

  constructor(callbacks: GachaModalCallbacks) {
    this.callbacks = callbacks;
    this.modal = document.getElementById('gacha-modal');
    this.coinsEl = document.getElementById('gacha-modal-coins');
    this.closeBtn = document.getElementById('gacha-modal-close-btn');
    this.rollBtn = document.getElementById('gacha-modal-roll-btn');
    this.trackEl = document.getElementById('gacha-modal-skin-list');
    this.viewportEl = document.getElementById('gacha-viewport');
    this.winFxEl = document.getElementById('gacha-win-fx');
    this.dupStampEl = document.getElementById('gacha-duplicate-stamp');
    this.cashbackFlyerEl = document.getElementById('gacha-cashback-flyer');

    this.bindEvents();
  }

  private bindEvents(): void {
    this.closeBtn?.addEventListener('click', () => {
      this.close();
      this.callbacks.onClose();
    });

    this.rollBtn?.addEventListener('click', () => {
      if (this.isSpinning) return;
      if (this.pendingWonSkinId) {
        const chosen = this.pendingWonSkinId;
        this.pendingWonSkinId = null;
        this.callbacks.onSelectAndPlay(chosen);
      } else {
        this.callbacks.onRoll();
      }
    });
  }

  public open(currentSkinId: string = 'corgi'): void {
    this.modal?.classList.remove('hidden');
    if (!this.reelInitialized || !this.trackEl?.children.length) {
      this.initReel(currentSkinId);
    }
  }

  public close(): void {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    this.isSpinning = false;
    this.pendingWonSkinId = null;
    this.clearWinEffects();
    this.resetButton();
    this.modal?.classList.add('hidden');
  }

  public isOpen(): boolean {
    return Boolean(this.modal && !this.modal.classList.contains('hidden'));
  }

  public updateCoins(coins: number): void {
    if (this.coinsEl) {
      this.coinsEl.textContent = String(coins);
    }
  }

  public shakeRollButton(): void {
    if (!this.rollBtn) return;
    this.rollBtn.classList.remove('shake-error');
    // Force reflow
    void this.rollBtn.offsetWidth;
    this.rollBtn.classList.add('shake-error');
    setTimeout(() => {
      this.rollBtn?.classList.remove('shake-error');
    }, 450);
  }

  public resetButton(): void {
    if (!this.rollBtn) return;
    this.rollBtn.removeAttribute('disabled');
    this.rollBtn.classList.remove('select-character-btn');
    this.rollBtn.innerHTML = `
      <div class="gacha-spin-content">
        <span class="gacha-spin-main">SPIN</span>
        <span class="gacha-spin-price">100 🪙</span>
      </div>
    `;
  }

  public clearWinEffects(): void {
    this.winFxEl?.classList.add('hidden');
    this.dupStampEl?.classList.add('hidden');
    this.cashbackFlyerEl?.classList.add('hidden');
    if (this.trackEl) {
      const prevWinning = this.trackEl.querySelectorAll('.winning-card');
      prevWinning.forEach((c) => c.classList.remove('winning-card'));
    }
    const prevConfetti = this.viewportEl?.querySelectorAll('.gacha-confetti-piece');
    prevConfetti?.forEach((c) => c.remove());
  }

  public initReel(centerSkinId: string = 'corgi'): void {
    if (!this.trackEl) return;
    this.clearWinEffects();
    this.resetButton();

    const initialCards: SkinId[] = [
      'corgi', 'pigeon_pizza', 'box_cat', 'raccoon_bandit', 'capybara_zen',
      'corgi', 'pigeon_pizza', (centerSkinId as SkinId) || 'corgi', 'box_cat', 'raccoon_bandit',
      'capybara_zen', 'corgi', 'pigeon_pizza', 'box_cat', 'capybara_zen'
    ];

    this.trackEl.innerHTML = '';
    initialCards.forEach((id, idx) => {
      this.trackEl?.appendChild(this.createCardElement(id, idx));
    });

    const viewportW = this.viewportEl?.clientWidth || 780;
    const cardPitch = 164;
    const centerIdx = 7;
    const startX = viewportW / 2 - (centerIdx * cardPitch + 75);
    this.trackEl.style.transform = `translateX(${startX}px)`;
    this.reelInitialized = true;
  }

  public startRoulette(
    result: { skinId?: string; rarity?: string; isDuplicate?: boolean; cashback?: number },
    onFinished?: () => void
  ): void {
    if (this.isSpinning || !this.trackEl) return;
    this.isSpinning = true;
    this.pendingWonSkinId = null;
    this.clearWinEffects();

    if (this.rollBtn) {
      this.rollBtn.setAttribute('disabled', 'true');
      this.rollBtn.classList.remove('select-character-btn');
      this.rollBtn.innerHTML = `
        <div class="gacha-spin-content">
          <span class="gacha-spin-main">КРУТИТСЯ...</span>
          <span class="gacha-spin-price">🎰</span>
        </div>
      `;
    }

    const winningSkin: SkinId = (result.skinId as SkinId) || 'corgi';
    const totalCards = 36;
    const targetIndex = 30;
    const allSkinIds: SkinId[] = ['corgi', 'pigeon_pizza', 'box_cat', 'raccoon_bandit', 'capybara_zen'];

    const reelSkins: SkinId[] = [];
    for (let i = 0; i < totalCards; i++) {
      if (i === targetIndex) {
        reelSkins.push(winningSkin);
      } else {
        const randSkin = allSkinIds[Math.floor(Math.random() * allSkinIds.length)];
        reelSkins.push(randSkin);
      }
    }

    this.trackEl.innerHTML = '';
    reelSkins.forEach((id, idx) => {
      this.trackEl?.appendChild(this.createCardElement(id, idx));
    });

    const viewportW = this.viewportEl?.clientWidth || 780;
    const cardPitch = 164;
    const startX = 0;
    const organicDrift = (Math.random() - 0.5) * 32;
    const targetX = viewportW / 2 - (targetIndex * cardPitch + 75) + organicDrift;

    this.trackEl.style.transform = `translateX(${startX}px)`;

    const startTime = performance.now();
    const duration = 3800;
    let lastTickedCard = -1;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const tau = Math.min(1.0, elapsed / duration);
      // Quartic ease out: fast initial spin, smooth gradual deceleration
      const progress = 1.0 - Math.pow(1.0 - tau, 4);
      const currentX = startX + (targetX - startX) * progress;

      if (this.trackEl) {
        this.trackEl.style.transform = `translateX(${currentX}px)`;
      }

      // Check which card is under center marker
      const centerPos = viewportW / 2 - currentX;
      const currentIdx = Math.floor(centerPos / cardPitch);
      if (currentIdx !== lastTickedCard && currentIdx >= 0 && currentIdx <= totalCards) {
        lastTickedCard = currentIdx;
        const pitch = 0.8 + 0.6 * (1.0 - progress);
        this.callbacks.onTick(pitch);
      }

      if (tau < 1.0) {
        this.animFrameId = requestAnimationFrame(animate);
      } else {
        this.animFrameId = null;
        this.isSpinning = false;
        if (this.trackEl) {
          this.trackEl.style.transform = `translateX(${targetX}px)`;
        }
        this.handleSpinComplete(result, targetIndex);
        onFinished?.();
      }
    };

    this.animFrameId = requestAnimationFrame(animate);
  }

  private handleSpinComplete(
    result: { skinId?: string; rarity?: string; isDuplicate?: boolean; cashback?: number },
    targetIndex: number
  ): void {
    const winningCardEl = this.trackEl?.querySelector(`[data-index="${targetIndex}"]`) as HTMLElement | null;
    if (winningCardEl) {
      winningCardEl.classList.add('winning-card');
    }

    this.winFxEl?.classList.remove('hidden');

    if (!result.isDuplicate && result.skinId) {
      this.pendingWonSkinId = result.skinId;
      this.spawnConfetti();

      if (this.rollBtn) {
        this.rollBtn.removeAttribute('disabled');
        this.rollBtn.classList.add('select-character-btn');
        this.rollBtn.innerHTML = `
          <div class="gacha-spin-content">
            <span class="gacha-spin-main">ВЫБРАТЬ ПЕРСОНАЖА</span>
            <span class="gacha-spin-price">ИГРАТЬ СРАЗУ ▶</span>
          </div>
        `;
      }
    } else {
      this.pendingWonSkinId = null;
      this.dupStampEl?.classList.remove('hidden');
      this.triggerCashbackFlyer();

      if (this.rollBtn) {
        this.rollBtn.removeAttribute('disabled');
        this.rollBtn.classList.remove('select-character-btn');
        this.rollBtn.innerHTML = `
          <div class="gacha-spin-content">
            <span class="gacha-spin-main">КРУТИТЬ ЕЩЁ</span>
            <span class="gacha-spin-price">100 🪙</span>
          </div>
        `;
      }
    }
  }

  private triggerCashbackFlyer(): void {
    if (!this.cashbackFlyerEl) return;
    this.cashbackFlyerEl.classList.remove('hidden');
    this.cashbackFlyerEl.classList.remove('fly-anim');
    void this.cashbackFlyerEl.offsetWidth;
    this.cashbackFlyerEl.classList.add('fly-anim');
    setTimeout(() => {
      this.cashbackFlyerEl?.classList.add('hidden');
      this.cashbackFlyerEl?.classList.remove('fly-anim');
    }, 1200);
  }

  private spawnConfetti(): void {
    if (!this.viewportEl) return;
    const colors = ['#fbbf24', '#f59e0b', '#38bdf8', '#c084fc', '#4ade80', '#f43f5e', '#ffffff'];
    const count = 38;

    for (let i = 0; i < count; i++) {
      const piece = document.createElement('div');
      piece.className = 'gacha-confetti-piece';
      const color = colors[i % colors.length];
      const isSquare = i % 3 === 0;
      const w = isSquare ? 8 : 10;
      const h = isSquare ? 8 : 14;

      const angle = (Math.random() * Math.PI) - (Math.PI / 2);
      const dist = 70 + Math.random() * 160;
      const dx = Math.cos(angle) * dist * 1.5;
      const dy = -Math.abs(Math.sin(angle)) * dist - 30;
      const rot = (Math.random() - 0.5) * 720;

      piece.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        width: ${w}px;
        height: ${h}px;
        background: ${color};
        border-radius: 2px;
        pointer-events: none;
        z-index: 22;
        --dx: ${dx.toFixed(1)}px;
        --dy: ${dy.toFixed(1)}px;
        --rot: ${rot.toFixed(1)}deg;
      `;
      this.viewportEl.appendChild(piece);
    }
  }

  private createCardElement(skinId: SkinId, index: number): HTMLElement {
    const card = document.createElement('div');
    card.className = 'gacha-roulette-card';
    card.setAttribute('data-index', String(index));
    card.setAttribute('data-skin-id', skinId);

    const rarityVal = SKIN_RARITY_MAP[skinId] ?? 'Common';
    const rarityInfo = RARITY_CSS_MAP[rarityVal] ?? RARITY_CSS_MAP.Common;
    const nameUpper = CARD_NAMES_UPPER[skinId] ?? skinId.toUpperCase();
    const svgArt = getGachaCardSvg(skinId);

    card.innerHTML = `
      <div class="gacha-card-name">${nameUpper}</div>
      <div class="gacha-card-character">${svgArt}</div>
      <div class="gacha-card-rarity ${rarityInfo.css}">${rarityInfo.label}</div>
    `;
    return card;
  }
}
