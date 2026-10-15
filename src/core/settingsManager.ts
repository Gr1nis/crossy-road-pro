import type { StorageAdapter } from './types.ts';
import type { Language } from './i18n.ts';

export type RenderQuality = 'high' | 'low';
export type AppLanguage = Language;
export type ControlsType = 'swipe' | 'dpad' | 'tap';
export type SwipeSensitivity = 'low' | 'normal' | 'high';

export interface GameSettings {
  sfxEnabled: boolean;
  sfxVolume: number;
  musicEnabled: boolean;
  musicVolume: number;
  hapticsEnabled: boolean;
  shadowsEnabled: boolean;
  renderQuality: RenderQuality;
  screenShakeEnabled: boolean;
  language: AppLanguage;
  controlsType: ControlsType;
  swipeSensitivity: SwipeSensitivity;
}

export const DEFAULT_GAME_SETTINGS: Readonly<GameSettings> = Object.freeze({
  sfxEnabled: true,
  sfxVolume: 0.8,
  musicEnabled: true,
  musicVolume: 0.25,
  hapticsEnabled: true,
  shadowsEnabled: true,
  renderQuality: 'high',
  screenShakeEnabled: true,
  language: 'ru',
  controlsType: 'swipe',
  swipeSensitivity: 'normal',
});

export const SETTINGS_STORAGE_KEY = 'crossy_game_settings';

class InMemoryStorageAdapter implements StorageAdapter {
  private readonly store = new Map<string, string>();

  getItem(key: string): string | null {
    return this.store.has(key) ? (this.store.get(key) ?? null) : null;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
}

function clampVolume(val: unknown, fallback: number): number {
  if (typeof val !== 'number' || !Number.isFinite(val)) return fallback;
  return Math.max(0, Math.min(1, Math.round(val * 100) / 100));
}

function parseBool(val: unknown, fallback: boolean): boolean {
  if (typeof val === 'boolean') return val;
  if (typeof val === 'string') {
    if (val === 'true') return true;
    if (val === 'false') return false;
  }
  return fallback;
}

export type SettingsChangeListener = (settings: Readonly<GameSettings>) => void;

export class SettingsManager {
  private readonly storage: StorageAdapter;
  private settings: GameSettings;
  private readonly listeners = new Set<SettingsChangeListener>();
  private hasStored = false;

  constructor(storage?: StorageAdapter) {
    this.storage = storage ?? new InMemoryStorageAdapter();
    this.settings = { ...DEFAULT_GAME_SETTINGS };
    this.load();
  }

  hasStoredSettings(): boolean {
    return this.hasStored;
  }

  getSettings(): Readonly<GameSettings> {
    return { ...this.settings };
  }

  getSetting<K extends keyof GameSettings>(key: K): GameSettings[K] {
    return this.settings[key];
  }

  setSetting<K extends keyof GameSettings>(key: K, value: GameSettings[K]): void {
    this.updateSettings({ [key]: value } as Partial<GameSettings>);
  }

  updateSettings(partial: Partial<GameSettings>): void {
    let changed = false;

    if (partial.sfxEnabled !== undefined) {
      const val = parseBool(partial.sfxEnabled, this.settings.sfxEnabled);
      if (val !== this.settings.sfxEnabled) {
        this.settings.sfxEnabled = val;
        changed = true;
      }
    }

    if (partial.sfxVolume !== undefined) {
      const val = clampVolume(partial.sfxVolume, this.settings.sfxVolume);
      if (val !== this.settings.sfxVolume) {
        this.settings.sfxVolume = val;
        changed = true;
      }
    }

    if (partial.musicEnabled !== undefined) {
      const val = parseBool(partial.musicEnabled, this.settings.musicEnabled);
      if (val !== this.settings.musicEnabled) {
        this.settings.musicEnabled = val;
        changed = true;
      }
    }

    if (partial.musicVolume !== undefined) {
      const val = clampVolume(partial.musicVolume, this.settings.musicVolume);
      if (val !== this.settings.musicVolume) {
        this.settings.musicVolume = val;
        changed = true;
      }
    }

    if (partial.hapticsEnabled !== undefined) {
      const val = parseBool(partial.hapticsEnabled, this.settings.hapticsEnabled);
      if (val !== this.settings.hapticsEnabled) {
        this.settings.hapticsEnabled = val;
        changed = true;
      }
    }

    if (partial.shadowsEnabled !== undefined) {
      const val = parseBool(partial.shadowsEnabled, this.settings.shadowsEnabled);
      if (val !== this.settings.shadowsEnabled) {
        this.settings.shadowsEnabled = val;
        changed = true;
      }
    }

    if (partial.renderQuality !== undefined) {
      const val: RenderQuality = partial.renderQuality === 'low' ? 'low' : 'high';
      if (val !== this.settings.renderQuality) {
        this.settings.renderQuality = val;
        changed = true;
      }
    }

    if (partial.screenShakeEnabled !== undefined) {
      const val = parseBool(partial.screenShakeEnabled, this.settings.screenShakeEnabled);
      if (val !== this.settings.screenShakeEnabled) {
        this.settings.screenShakeEnabled = val;
        changed = true;
      }
    }

    if (partial.language !== undefined) {
      const val: AppLanguage =
        partial.language === 'en' || partial.language === 'tr' ? partial.language : 'ru';
      if (val !== this.settings.language) {
        this.settings.language = val;
        changed = true;
      }
    }

    if (partial.controlsType !== undefined) {
      const val: ControlsType =
        partial.controlsType === 'dpad' || partial.controlsType === 'tap'
          ? partial.controlsType
          : 'swipe';
      if (val !== this.settings.controlsType) {
        this.settings.controlsType = val;
        changed = true;
      }
    }

    if (partial.swipeSensitivity !== undefined) {
      const val: SwipeSensitivity =
        partial.swipeSensitivity === 'low' || partial.swipeSensitivity === 'high'
          ? partial.swipeSensitivity
          : 'normal';
      if (val !== this.settings.swipeSensitivity) {
        this.settings.swipeSensitivity = val;
        changed = true;
      }
    }

    if (changed) {
      this.save();
      this.notifyListeners();
    }
  }

  resetToDefaults(): void {
    this.settings = { ...DEFAULT_GAME_SETTINGS };
    this.save();
    this.notifyListeners();
  }

  subscribe(listener: SettingsChangeListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    const readonlySnapshot = this.getSettings();
    for (const listener of this.listeners) {
      try {
        listener(readonlySnapshot);
      } catch (err) {
        console.warn('Error in settings listener:', err);
      }
    }
  }

  private load(): void {
    try {
      const raw = this.storage.getItem(SETTINGS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<GameSettings>;
        if (parsed && typeof parsed === 'object') {
          this.hasStored = true;
          this.settings = {
            sfxEnabled: parseBool(parsed.sfxEnabled, DEFAULT_GAME_SETTINGS.sfxEnabled),
            sfxVolume: clampVolume(parsed.sfxVolume, DEFAULT_GAME_SETTINGS.sfxVolume),
            musicEnabled: parseBool(parsed.musicEnabled, DEFAULT_GAME_SETTINGS.musicEnabled),
            musicVolume: clampVolume(parsed.musicVolume, DEFAULT_GAME_SETTINGS.musicVolume),
            hapticsEnabled: parseBool(parsed.hapticsEnabled, DEFAULT_GAME_SETTINGS.hapticsEnabled),
            shadowsEnabled: parseBool(parsed.shadowsEnabled, DEFAULT_GAME_SETTINGS.shadowsEnabled),
            renderQuality: parsed.renderQuality === 'low' ? 'low' : 'high',
            screenShakeEnabled: parseBool(
              parsed.screenShakeEnabled,
              DEFAULT_GAME_SETTINGS.screenShakeEnabled
            ),
            language:
              parsed.language === 'en' || parsed.language === 'tr' ? parsed.language : 'ru',
            controlsType:
              parsed.controlsType === 'dpad' || parsed.controlsType === 'tap'
                ? parsed.controlsType
                : 'swipe',
            swipeSensitivity:
              parsed.swipeSensitivity === 'low' || parsed.swipeSensitivity === 'high'
                ? parsed.swipeSensitivity
                : 'normal',
          };
          return;
        }
      }

      // Legacy settings migration fallback
      const legacySound = this.storage.getItem('crossy_setting_sound');
      if (legacySound !== null) {
        this.hasStored = true;
        this.settings.sfxEnabled = legacySound !== 'false';
      }
      const legacyMusic = this.storage.getItem('crossy_setting_music');
      if (legacyMusic !== null) {
        this.hasStored = true;
        this.settings.musicEnabled = legacyMusic !== 'false';
      }
      const legacySfxVol = this.storage.getItem('crossy_setting_sfx_vol');
      if (legacySfxVol !== null) {
        this.hasStored = true;
        this.settings.sfxVolume = clampVolume(Number(legacySfxVol), DEFAULT_GAME_SETTINGS.sfxVolume);
      }
      const legacyMusicVol = this.storage.getItem('crossy_setting_music_vol');
      if (legacyMusicVol !== null) {
        this.hasStored = true;
        this.settings.musicVolume = clampVolume(Number(legacyMusicVol), DEFAULT_GAME_SETTINGS.musicVolume);
      }
    } catch (_err: unknown) {
      // Safe fallback on defaults if storage contains invalid data
      this.settings = { ...DEFAULT_GAME_SETTINGS };
    }
  }

  private save(): void {
    this.hasStored = true;
    try {
      this.storage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(this.settings));
      // Keep legacy keys in sync for backward compatibility
      this.storage.setItem('crossy_setting_sound', String(this.settings.sfxEnabled));
      this.storage.setItem('crossy_setting_music', String(this.settings.musicEnabled));
      this.storage.setItem('crossy_setting_sfx_vol', String(this.settings.sfxVolume));
      this.storage.setItem('crossy_setting_music_vol', String(this.settings.musicVolume));
    } catch (_err: unknown) {
      console.warn('[SettingsManager] Failed to persist settings:', _err);
    }
  }
}
