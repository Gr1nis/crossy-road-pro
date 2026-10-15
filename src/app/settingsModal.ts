import {
  type AppLanguage,
  type ControlsType,
  type RenderQuality,
  type SettingsManager,
  type SwipeSensitivity,
} from '../core/settingsManager.ts';

export interface SettingsModalCallbacks {
  onSoundToggle?: (enabled: boolean) => void;
  onSfxVolumeChange?: (volume: number) => void;
  onMusicToggle?: (enabled: boolean) => void;
  onMusicVolumeChange?: (volume: number) => void;
  onShadowsToggle?: (enabled: boolean) => void;
  onQualityChange?: (quality: RenderQuality) => void;
  onScreenShakeToggle?: (enabled: boolean) => void;
  onToggleFullscreen?: () => void;
  onHapticsToggle?: (enabled: boolean) => void;
  onControlsTypeChange?: (type: ControlsType) => void;
  onSwipeSensitivityChange?: (sensitivity: SwipeSensitivity) => void;
  onLanguageChange?: (lang: AppLanguage) => void;
  onResetDefaults?: () => void;
  onResetData?: () => void;
}

export class SettingsModalController {
  private readonly settings: SettingsManager;
  private readonly callbacks: SettingsModalCallbacks;

  private tabButtons: HTMLButtonElement[] = [];
  private tabPanels: HTMLElement[] = [];

  private sfxToggle: HTMLInputElement | null = null;
  private sfxSlider: HTMLInputElement | null = null;
  private sfxBadge: HTMLElement | null = null;
  private musicToggle: HTMLInputElement | null = null;
  private musicSlider: HTMLInputElement | null = null;
  private musicBadge: HTMLElement | null = null;

  private shadowsToggle: HTMLInputElement | null = null;
  private qualityButtons: HTMLButtonElement[] = [];
  private shakeToggle: HTMLInputElement | null = null;
  private fullscreenBtn: HTMLButtonElement | null = null;

  private controlsButtons: HTMLButtonElement[] = [];
  private sensitivityButtons: HTMLButtonElement[] = [];

  private hapticsToggle: HTMLInputElement | null = null;
  private langButtons: HTMLButtonElement[] = [];
  private resetBtn: HTMLButtonElement | null = null;
  private resetDataBtn: HTMLButtonElement | null = null;
  private resetConfirmModal: HTMLElement | null = null;
  private resetConfirmCancelBtn: HTMLButtonElement | null = null;
  private resetConfirmOkBtn: HTMLButtonElement | null = null;

  constructor(settings: SettingsManager, callbacks: SettingsModalCallbacks = {}) {
    this.settings = settings;
    this.callbacks = callbacks;
    if (typeof document !== 'undefined') {
      this.initDOM();
      this.bindEvents();
      this.syncUI();
    }
  }

  private initDOM(): void {
    this.tabButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('.settings-tab-btn'));
    this.tabPanels = Array.from(document.querySelectorAll<HTMLElement>('.settings-tab-panel'));

    this.sfxToggle = (document.getElementById('setting-sound-toggle') ||
      document.getElementById('setting-sfx-toggle')) as HTMLInputElement | null;
    this.sfxSlider = document.getElementById('setting-sfx-volume') as HTMLInputElement | null;
    this.sfxBadge = document.getElementById('setting-sfx-volume-val');

    this.musicToggle = document.getElementById('setting-music-toggle') as HTMLInputElement | null;
    this.musicSlider = document.getElementById('setting-music-volume') as HTMLInputElement | null;
    this.musicBadge = document.getElementById('setting-music-volume-val');

    this.shadowsToggle = document.getElementById('setting-shadows-toggle') as HTMLInputElement | null;
    this.qualityButtons = Array.from(
      document.querySelectorAll<HTMLButtonElement>('button[data-quality]')
    );
    this.shakeToggle = document.getElementById('setting-shake-toggle') as HTMLInputElement | null;
    this.fullscreenBtn = document.getElementById('setting-fullscreen-btn') as HTMLButtonElement | null;

    this.controlsButtons = Array.from(
      document.querySelectorAll<HTMLButtonElement>('button[data-controls]')
    );
    this.sensitivityButtons = Array.from(
      document.querySelectorAll<HTMLButtonElement>('button[data-sensitivity]')
    );

    this.hapticsToggle = document.getElementById('setting-haptics-toggle') as HTMLInputElement | null;
    this.langButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('button[data-lang]'));
    this.resetBtn = document.getElementById('setting-reset-btn') as HTMLButtonElement | null;
    this.resetDataBtn = document.getElementById('setting-reset-data-btn') as HTMLButtonElement | null;
    this.resetConfirmModal = document.getElementById('reset-confirm-modal');
    this.resetConfirmCancelBtn = document.getElementById('reset-confirm-cancel-btn') as HTMLButtonElement | null;
    this.resetConfirmOkBtn = document.getElementById('reset-confirm-ok-btn') as HTMLButtonElement | null;
  }

  private bindEvents(): void {
    for (const btn of this.tabButtons) {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        if (tab) this.switchTab(tab);
      });
    }

    this.sfxToggle?.addEventListener('change', () => {
      const enabled = Boolean(this.sfxToggle?.checked);
      this.settings.setSetting('sfxEnabled', enabled);
      this.callbacks.onSoundToggle?.(enabled);
    });

    this.sfxSlider?.addEventListener('input', () => {
      const val = Number(this.sfxSlider?.value ?? 80);
      const vol = Math.max(0, Math.min(1, val / 100));
      if (this.sfxBadge) this.sfxBadge.textContent = `${Math.round(val)}%`;
      this.settings.setSetting('sfxVolume', vol);
      this.callbacks.onSfxVolumeChange?.(vol);
    });

    this.musicToggle?.addEventListener('change', () => {
      const enabled = Boolean(this.musicToggle?.checked);
      this.settings.setSetting('musicEnabled', enabled);
      this.callbacks.onMusicToggle?.(enabled);
    });

    this.musicSlider?.addEventListener('input', () => {
      const val = Number(this.musicSlider?.value ?? 25);
      const vol = Math.max(0, Math.min(1, val / 100));
      if (this.musicBadge) this.musicBadge.textContent = `${Math.round(val)}%`;
      this.settings.setSetting('musicVolume', vol);
      this.callbacks.onMusicVolumeChange?.(vol);
    });

    this.shadowsToggle?.addEventListener('change', () => {
      const enabled = Boolean(this.shadowsToggle?.checked);
      this.settings.setSetting('shadowsEnabled', enabled);
      this.callbacks.onShadowsToggle?.(enabled);
    });

    for (const btn of this.qualityButtons) {
      btn.addEventListener('click', () => {
        const q = btn.dataset.quality as RenderQuality;
        if (q === 'high' || q === 'low') {
          this.settings.setSetting('renderQuality', q);
          this.updateSegmentActive(this.qualityButtons, 'quality', q);
          this.callbacks.onQualityChange?.(q);
        }
      });
    }

    this.shakeToggle?.addEventListener('change', () => {
      const enabled = Boolean(this.shakeToggle?.checked);
      this.settings.setSetting('screenShakeEnabled', enabled);
      this.callbacks.onScreenShakeToggle?.(enabled);
    });

    this.fullscreenBtn?.addEventListener('click', () => {
      this.callbacks.onToggleFullscreen?.();
    });

    for (const btn of this.controlsButtons) {
      btn.addEventListener('click', () => {
        const c = btn.dataset.controls as ControlsType;
        if (c === 'swipe' || c === 'dpad' || c === 'tap') {
          this.settings.setSetting('controlsType', c);
          this.updateSegmentActive(this.controlsButtons, 'controls', c);
          this.callbacks.onControlsTypeChange?.(c);
        }
      });
    }

    for (const btn of this.sensitivityButtons) {
      btn.addEventListener('click', () => {
        const s = btn.dataset.sensitivity as SwipeSensitivity;
        if (s === 'low' || s === 'normal' || s === 'high') {
          this.settings.setSetting('swipeSensitivity', s);
          this.updateSegmentActive(this.sensitivityButtons, 'sensitivity', s);
          this.callbacks.onSwipeSensitivityChange?.(s);
        }
      });
    }

    this.hapticsToggle?.addEventListener('change', () => {
      const enabled = Boolean(this.hapticsToggle?.checked);
      this.settings.setSetting('hapticsEnabled', enabled);
      this.callbacks.onHapticsToggle?.(enabled);
    });

    for (const btn of this.langButtons) {
      btn.addEventListener('click', () => {
        const l = btn.dataset.lang as AppLanguage;
        if (l === 'ru' || l === 'en' || l === 'tr') {
          this.settings.setSetting('language', l);
          this.updateSegmentActive(this.langButtons, 'lang', l);
          this.callbacks.onLanguageChange?.(l);
        }
      });
    }

    this.resetBtn?.addEventListener('click', () => {
      this.settings.resetToDefaults();
      this.syncUI();
      this.callbacks.onResetDefaults?.();
    });

    this.resetDataBtn?.addEventListener('click', () => {
      this.resetConfirmModal?.classList.remove('hidden');
    });

    this.resetConfirmCancelBtn?.addEventListener('click', () => {
      this.resetConfirmModal?.classList.add('hidden');
    });

    this.resetConfirmOkBtn?.addEventListener('click', () => {
      this.resetConfirmModal?.classList.add('hidden');
      this.callbacks.onResetData?.();
    });
  }

  public switchTab(targetTab: string): void {
    for (const btn of this.tabButtons) {
      btn.classList.toggle('active', btn.dataset.tab === targetTab);
    }
    for (const panel of this.tabPanels) {
      panel.classList.toggle('hidden', panel.dataset.tab !== targetTab);
    }
  }

  public syncUI(): void {
    const s = this.settings.getSettings();

    if (this.sfxToggle) this.sfxToggle.checked = s.sfxEnabled;
    const sfxPct = Math.round(s.sfxVolume * 100);
    if (this.sfxSlider) this.sfxSlider.value = String(sfxPct);
    if (this.sfxBadge) this.sfxBadge.textContent = `${sfxPct}%`;

    if (this.musicToggle) this.musicToggle.checked = s.musicEnabled;
    const musPct = Math.round(s.musicVolume * 100);
    if (this.musicSlider) this.musicSlider.value = String(musPct);
    if (this.musicBadge) this.musicBadge.textContent = `${musPct}%`;

    if (this.shadowsToggle) this.shadowsToggle.checked = s.shadowsEnabled;
    if (this.shakeToggle) this.shakeToggle.checked = s.screenShakeEnabled;
    if (this.hapticsToggle) this.hapticsToggle.checked = s.hapticsEnabled;

    this.updateSegmentActive(this.qualityButtons, 'quality', s.renderQuality);
    this.updateSegmentActive(this.controlsButtons, 'controls', s.controlsType);
    this.updateSegmentActive(this.sensitivityButtons, 'sensitivity', s.swipeSensitivity);
    this.updateSegmentActive(this.langButtons, 'lang', s.language);
  }

  private updateSegmentActive(buttons: HTMLButtonElement[], dataKey: string, value: string): void {
    for (const btn of buttons) {
      btn.classList.toggle('active', btn.dataset[dataKey] === value);
    }
  }
}
