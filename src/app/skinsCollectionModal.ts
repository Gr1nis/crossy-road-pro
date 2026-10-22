import { ALL_SKINS, type SkinId } from '../core/types.ts';
import { GACHA_CHARACTER_SKIN_BASE64 } from '../view/gachaSkinsBase64.ts';
import { SKINS_MENU_ICONS } from '../view/skinsIconsBase64.ts';
import { WorldsViewManager } from './worldsCollectionModal.ts';

export interface SkinsModalCallbacks {
  onSelectSkin: (skinId: string) => void;
  onSelectWorld?: (worldId: string) => void;
  onOpenGacha?: () => void;
  onClose?: () => void;
}

export interface SkinRarityMeta {
  label: string;
  css: string;
  color: string;
  glow: string;
}

export const SKINS_RARITY_MAP: Record<string, SkinRarityMeta> = {
  corgi: { label: 'Обычный', css: 'rarity-common', color: '#94a3b8', glow: 'rgba(148, 163, 184, 0.45)' },
  pigeon_pizza: { label: 'Обычный', css: 'rarity-common', color: '#94a3b8', glow: 'rgba(148, 163, 184, 0.45)' },
  box_cat: { label: 'Редкий', css: 'rarity-rare', color: '#38bdf8', glow: 'rgba(56, 189, 248, 0.5)' },
  raccoon_bandit: { label: 'Эпический', css: 'rarity-epic', color: '#c084fc', glow: 'rgba(192, 132, 252, 0.55)' },
  capybara_zen: { label: 'Легендарный', css: 'rarity-legendary', color: '#fbbf24', glow: 'rgba(251, 191, 36, 0.6)' },
};

export class SkinsCollectionModal {
  private readonly modal: HTMLElement | null;
  private readonly coinsEl: HTMLElement | null;
  private readonly closeBtn: HTMLElement | null;
  private readonly listEl: HTMLElement | null;
  private readonly tabBtnCharacters: HTMLElement | null;
  private readonly tabBtnWorlds: HTMLElement | null;
  private readonly tabContentCharacters: HTMLElement | null;
  private readonly tabContentWorlds: HTMLElement | null;
  private readonly worldsListEl: HTMLElement | null;
  private readonly callbacks: SkinsModalCallbacks;
  private readonly worldsManager: WorldsViewManager;

  private activeTab: 'characters' | 'worlds' = 'characters';
  private currentBiome: string | null = null;
  private lastUnlocked: string[] = ['corgi'];
  private lastSelected: string = 'corgi';
  private focusedIndex = 0;
  private cardElements: HTMLElement[] = [];
  private boundWindowKeyDown: (e: KeyboardEvent) => void;

  constructor(callbacks: SkinsModalCallbacks) {
    this.callbacks = callbacks;
    this.worldsManager = new WorldsViewManager();
    const get = (id: string) => (typeof document !== 'undefined' ? document.getElementById(id) : null);
    this.modal = get('skins-modal');
    this.coinsEl = get('skins-modal-coins');
    this.closeBtn = get('skins-modal-close-btn');
    this.listEl = get('skins-modal-list');
    this.tabBtnCharacters = get('skins-tab-btn-characters');
    this.tabBtnWorlds = get('skins-tab-btn-worlds');
    this.tabContentCharacters = get('skins-tab-characters-content');
    this.tabContentWorlds = get('skins-tab-worlds-content');
    this.worldsListEl = get('skins-worlds-list');

    this.boundWindowKeyDown = (e: KeyboardEvent) => {
      if (this.isOpen() && this.handleKeyDown(e)) e.stopPropagation();
    };
    this.bindEvents();
  }

  private bindEvents(): void {
    const handleClose = (e?: Event) => {
      e?.preventDefault();
      this.close();
    };
    this.closeBtn?.addEventListener('click', handleClose);
    this.closeBtn?.addEventListener('touchend', handleClose);
    this.modal?.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });
    this.tabBtnCharacters?.addEventListener('click', () => this.switchTab('characters'));
    this.tabBtnWorlds?.addEventListener('click', () => this.switchTab('worlds'));

    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
      window.addEventListener('keydown', this.boundWindowKeyDown);
    }
  }

  public switchTab(tab: 'characters' | 'worlds'): void {
    this.activeTab = tab;
    const isChar = tab === 'characters';
    this.tabBtnCharacters?.classList.toggle('active', isChar);
    this.tabBtnWorlds?.classList.toggle('active', !isChar);
    this.tabContentCharacters?.classList.toggle('hidden', !isChar);
    this.tabContentCharacters?.classList.toggle('active', isChar);
    this.tabContentWorlds?.classList.toggle('hidden', isChar);
    this.tabContentWorlds?.classList.toggle('active', !isChar);
    if (!isChar) this.renderWorlds();
  }

  public getActiveTab(): 'characters' | 'worlds' {
    return this.activeTab;
  }

  public getCurrentBiome(): string | null {
    return this.currentBiome;
  }

  public setCurrentBiome(biome: string | null): void {
    this.currentBiome = biome;
    this.renderWorlds();
  }

  public open(coins: number, unlocked: string[], selected: string, currentBiome?: string | null): void {
    this.updateCoins(coins);
    if (currentBiome !== undefined) this.currentBiome = currentBiome;
    this.renderCards(unlocked, selected);
    this.renderWorlds();
    this.modal?.classList.remove('hidden');

    const selectedIndex = ALL_SKINS.findIndex((s) => s.id === selected);
    this.focusedIndex = selectedIndex >= 0 ? selectedIndex : 0;
    this.updateFocusVisual();
  }

  public close(): void {
    try {
      this.modal?.classList.add('hidden');
    } finally {
      try {
        this.callbacks.onClose?.();
      } catch (err: unknown) {
        console.warn('[SkinsCollectionModal] onClose error:', err);
      }
    }
  }

  public isOpen(): boolean {
    return Boolean(this.modal && !this.modal.classList.contains('hidden'));
  }

  public updateCoins(coins: number): void {
    if (this.coinsEl) this.coinsEl.textContent = String(Math.max(0, coins));
  }

  public renderWorlds(): void {
    if (!this.worldsListEl) return;
    this.worldsManager.render(this.worldsListEl, this.currentBiome, (worldId: string) => {
      this.currentBiome = worldId;
      this.callbacks.onSelectWorld?.(worldId);
      this.renderWorlds();
    });
  }

  public renderCards(unlocked: string[], selected: string): void {
    this.lastUnlocked = [...unlocked];
    this.lastSelected = selected;
    if (!this.listEl || typeof document === 'undefined') return;

    this.listEl.innerHTML = '';
    this.cardElements = [];

    ALL_SKINS.forEach((skin, index) => {
      const isUnlocked = unlocked.includes(skin.id);
      const isActive = selected === skin.id;
      const rarity = SKINS_RARITY_MAP[skin.id] ?? {
        label: 'Обычный', css: 'rarity-common', color: '#94a3b8', glow: 'rgba(148, 163, 184, 0.45)',
      };

      const card = document.createElement('div');
      const cardClasses = ['skin-card', rarity.css];
      if (isActive) cardClasses.push('active');
      if (!isUnlocked) cardClasses.push('locked', 'skin-card-silhouette');
      card.className = cardClasses.join(' ');
      card.setAttribute('data-skin-id', skin.id);
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', isUnlocked ? `${skin.name} (${rarity.label})` : `Заблокированный персонаж (${rarity.label})`);
      card.style.setProperty('--rarity-color', rarity.color);
      card.style.setProperty('--rarity-glow', rarity.glow);

      const imgSrc = GACHA_CHARACTER_SKIN_BASE64[skin.id] ?? '';
      const charName = isUnlocked ? skin.name : `??? [${rarity.label.toUpperCase()}]`;

      let btnHtml = '';
      if (isActive) {
        btnHtml = `<button type="button" class="skin-card-btn btn-active" style="background-image: url('${SKINS_MENU_ICONS.btnGreen}');" aria-label="Скин уже выбран"><span class="skin-card-btn-text">ВЫБРАН</span></button>`;
      } else if (isUnlocked) {
        btnHtml = `<button type="button" class="skin-card-btn btn-select" style="background-image: url('${SKINS_MENU_ICONS.btnGold}');" aria-label="Выбрать скин"><span class="skin-card-btn-text">ВЫБРАТЬ</span></button>`;
      } else {
        btnHtml = `<button type="button" class="skin-card-btn btn-locked" aria-label="Открыть в автомате призов"><span class="skin-card-btn-text"><img src="${SKINS_MENU_ICONS.lock}" class="skin-card-btn-lock-img" alt="🔒" />В АВТОМАТЕ</span></button>`;
      }

      card.innerHTML = `
        <div class="skin-card-rarity">${rarity.label}</div>
        <div class="skin-card-preview"><img src="${imgSrc}" class="skin-card-char-img" alt="${isUnlocked ? skin.name : 'Секретный скин'}" loading="lazy" /></div>
        <div class="skin-card-name">${charName}</div>
        ${btnHtml}
      `;

      card.addEventListener('click', (e: MouseEvent) => {
        e.preventDefault();
        this.focusedIndex = index;
        this.updateFocusVisual();
        if (isUnlocked) this.callbacks.onSelectSkin(skin.id);
        else this.callbacks.onOpenGacha?.();
      });

      this.listEl?.appendChild(card);
      this.cardElements.push(card);
    });

    this.updateFocusVisual();
  }

  public handleKeyDown(e: KeyboardEvent): boolean {
    if (!this.isOpen()) return false;
    if (e.code === 'Escape') {
      e.preventDefault();
      this.close();
      return true;
    }

    const key = e.key?.toLowerCase();
    const isLeft = e.code === 'ArrowLeft' || e.code === 'KeyA' || key === 'a' || key === 'ф';
    const isRight = e.code === 'ArrowRight' || e.code === 'KeyD' || key === 'd' || key === 'в';

    if (isLeft) {
      e.preventDefault();
      this.focusDelta(-1);
      return true;
    }
    if (isRight) {
      e.preventDefault();
      this.focusDelta(1);
      return true;
    }
    if (e.code === 'Enter' || e.code === 'Space') {
      e.preventDefault();
      this.selectFocused();
      return true;
    }
    return false;
  }

  public getFocusedIndex(): number {
    return this.focusedIndex;
  }

  public setFocusedIndex(index: number): void {
    const total = ALL_SKINS.length;
    if (total === 0) return;
    this.focusedIndex = ((index % total) + total) % total;
    this.updateFocusVisual(true);
  }

  public destroy(): void {
    if (typeof window !== 'undefined' && typeof window.removeEventListener === 'function') {
      window.removeEventListener('keydown', this.boundWindowKeyDown);
    }
  }

  private focusDelta(delta: number): void {
    const total = ALL_SKINS.length;
    if (total === 0) return;
    this.focusedIndex = (this.focusedIndex + delta + total) % total;
    this.updateFocusVisual(true);
  }

  private updateFocusVisual(scroll = false): void {
    this.cardElements.forEach((el, i) => {
      el.classList.toggle('focused', i === this.focusedIndex);
    });
    const target = this.cardElements[this.focusedIndex];
    if (target) {
      if (scroll && typeof target.scrollIntoView === 'function') {
        target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
      try {
        target.focus?.({ preventScroll: true });
      } catch {
        target.focus?.();
      }
    }
  }

  private selectFocused(): void {
    const skin = ALL_SKINS[this.focusedIndex];
    if (!skin) return;
    const isUnlocked = this.lastUnlocked.includes(skin.id);
    if (isUnlocked) this.callbacks.onSelectSkin(skin.id);
    else this.callbacks.onOpenGacha?.();
  }
}
