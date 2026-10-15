import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  SettingsManager,
  DEFAULT_GAME_SETTINGS,
  SETTINGS_STORAGE_KEY,
  type GameSettings,
} from '../src/core/settingsManager.ts';
import type { StorageAdapter } from '../src/core/types.ts';

class MockStorage implements StorageAdapter {
  public map = new Map<string, string>();
  public throwOnSet = false;
  public throwOnGet = false;

  getItem(key: string): string | null {
    if (this.throwOnGet) throw new Error('Storage read failure');
    return this.map.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    if (this.throwOnSet) throw new Error('Storage write failure');
    this.map.set(key, value);
  }
}

describe('SettingsManager — Game Settings & Persistence Suite', () => {
  it('Property 1 (Default Settings Invariant): initializes with all specified defaults', () => {
    const storage = new MockStorage();
    const mgr = new SettingsManager(storage);
    const settings = mgr.getSettings();

    assert.equal(settings.sfxEnabled, true);
    assert.equal(settings.sfxVolume, 0.8);
    assert.equal(settings.musicEnabled, true);
    assert.equal(settings.musicVolume, 0.25);
    assert.equal(settings.hapticsEnabled, true);
    assert.equal(settings.shadowsEnabled, true);
    assert.equal(settings.renderQuality, 'high');
    assert.equal(settings.screenShakeEnabled, true);
    assert.equal(settings.language, 'ru');
    assert.equal(settings.controlsType, 'swipe');
    assert.equal(settings.swipeSensitivity, 'normal');

    assert.deepEqual(settings, DEFAULT_GAME_SETTINGS);
  });

  it('Property 2 (Volume Bounds Validation): clamps values to [0.0, 1.0] and handles NaN/invalids safely', () => {
    const mgr = new SettingsManager();

    // Upper bound clamping
    mgr.setSetting('sfxVolume', 1.5);
    assert.equal(mgr.getSetting('sfxVolume'), 1.0);

    // Lower bound clamping
    mgr.setSetting('sfxVolume', -0.5);
    assert.equal(mgr.getSetting('sfxVolume'), 0.0);

    // Music volume clamping
    mgr.setSetting('musicVolume', 2.0);
    assert.equal(mgr.getSetting('musicVolume'), 1.0);
    mgr.setSetting('musicVolume', -1.0);
    assert.equal(mgr.getSetting('musicVolume'), 0.0);

    // Valid intermediate decimal
    mgr.setSetting('sfxVolume', 0.65);
    assert.equal(mgr.getSetting('sfxVolume'), 0.65);

    // Non-finite or NaN numbers fallback safely
    mgr.setSetting('sfxVolume', NaN);
    assert.equal(mgr.getSetting('sfxVolume'), 0.65);

    mgr.setSetting('musicVolume', Infinity);
    assert.equal(mgr.getSetting('musicVolume'), 0.0);
  });

  it('Property 3 (Enum Bounds Validation): rejects invalid unions and falls back to safe defaults', () => {
    const mgr = new SettingsManager();

    // Render quality
    mgr.setSetting('renderQuality', 'low');
    assert.equal(mgr.getSetting('renderQuality'), 'low');
    mgr.setSetting('renderQuality', 'ultra' as any);
    assert.equal(mgr.getSetting('renderQuality'), 'high');

    // Language
    mgr.setSetting('language', 'en');
    assert.equal(mgr.getSetting('language'), 'en');
    mgr.setSetting('language', 'tr');
    assert.equal(mgr.getSetting('language'), 'tr');
    mgr.setSetting('language', 'fr' as any);
    assert.equal(mgr.getSetting('language'), 'ru');

    // Controls type
    mgr.setSetting('controlsType', 'dpad');
    assert.equal(mgr.getSetting('controlsType'), 'dpad');
    mgr.setSetting('controlsType', 'tap');
    assert.equal(mgr.getSetting('controlsType'), 'tap');
    mgr.setSetting('controlsType', 'keyboard' as any);
    assert.equal(mgr.getSetting('controlsType'), 'swipe');

    // Swipe sensitivity
    mgr.setSetting('swipeSensitivity', 'high');
    assert.equal(mgr.getSetting('swipeSensitivity'), 'high');
    mgr.setSetting('swipeSensitivity', 'extreme' as any);
    assert.equal(mgr.getSetting('swipeSensitivity'), 'normal');
  });

  it('Property 4 (Persistence & Reload): correctly saves and restores all settings across instances', () => {
    const storage = new MockStorage();
    const mgr1 = new SettingsManager(storage);

    mgr1.updateSettings({
      sfxEnabled: false,
      sfxVolume: 0.4,
      musicEnabled: true,
      musicVolume: 0.15,
      hapticsEnabled: false,
      shadowsEnabled: false,
      renderQuality: 'low',
      screenShakeEnabled: false,
      language: 'en',
      controlsType: 'dpad',
      swipeSensitivity: 'high',
    });

    // Check raw storage payload exists
    const rawSaved = storage.getItem(SETTINGS_STORAGE_KEY);
    assert.ok(rawSaved !== null, 'Storage key must contain saved JSON');

    // Instantiate second manager reading from the same storage
    const mgr2 = new SettingsManager(storage);
    const restored = mgr2.getSettings();

    assert.equal(restored.sfxEnabled, false);
    assert.equal(restored.sfxVolume, 0.4);
    assert.equal(restored.musicEnabled, true);
    assert.equal(restored.musicVolume, 0.15);
    assert.equal(restored.hapticsEnabled, false);
    assert.equal(restored.shadowsEnabled, false);
    assert.equal(restored.renderQuality, 'low');
    assert.equal(restored.screenShakeEnabled, false);
    assert.equal(restored.language, 'en');
    assert.equal(restored.controlsType, 'dpad');
    assert.equal(restored.swipeSensitivity, 'high');
  });

  it('Property 5 (Legacy Migration & Corrupt Storage Resilience): safely handles legacy keys and garbage data', () => {
    const legacyStorage = new MockStorage();
    legacyStorage.setItem('crossy_setting_sound', 'false');
    legacyStorage.setItem('crossy_setting_music', 'true');
    legacyStorage.setItem('crossy_setting_sfx_vol', '0.5');
    legacyStorage.setItem('crossy_setting_music_vol', '0.1');

    const legacyMgr = new SettingsManager(legacyStorage);
    assert.equal(legacyMgr.getSetting('sfxEnabled'), false);
    assert.equal(legacyMgr.getSetting('musicEnabled'), true);
    assert.equal(legacyMgr.getSetting('sfxVolume'), 0.5);
    assert.equal(legacyMgr.getSetting('musicVolume'), 0.1);

    // Corrupt JSON storage
    const corruptStorage = new MockStorage();
    corruptStorage.setItem(SETTINGS_STORAGE_KEY, '{invalid_json--corrupted');
    const corruptMgr = new SettingsManager(corruptStorage);
    assert.deepEqual(corruptMgr.getSettings(), DEFAULT_GAME_SETTINGS);

    // Throwing storage on read
    const throwingStorage = new MockStorage();
    throwingStorage.throwOnGet = true;
    const throwingMgr = new SettingsManager(throwingStorage);
    assert.deepEqual(throwingMgr.getSettings(), DEFAULT_GAME_SETTINGS);

    // Throwing storage on write
    throwingStorage.throwOnGet = false;
    throwingStorage.throwOnSet = true;
    assert.doesNotThrow(() => {
      throwingMgr.setSetting('sfxVolume', 0.5);
    });
  });

  it('Property 6 (Listener Subscription & Unsubscribe): notifies listeners upon mutation and allows clean unsubscribe', () => {
    const mgr = new SettingsManager();
    const recorded: Readonly<GameSettings>[] = [];

    const unsubscribe = mgr.subscribe((s) => {
      recorded.push(s);
    });

    mgr.setSetting('sfxEnabled', false);
    mgr.setSetting('shadowsEnabled', false);

    assert.equal(recorded.length, 2);
    assert.equal(recorded[0].sfxEnabled, false);
    assert.equal(recorded[1].shadowsEnabled, false);

    // Unsubscribe
    unsubscribe();
    mgr.setSetting('musicEnabled', false);
    assert.equal(recorded.length, 2, 'Listener must not be called after unsubscribe');
  });

  it('Property 7 (Reset to Defaults): restores default values and persists change', () => {
    const storage = new MockStorage();
    const mgr = new SettingsManager(storage);

    mgr.updateSettings({
      sfxVolume: 0.1,
      musicVolume: 0.9,
      shadowsEnabled: false,
      renderQuality: 'low',
    });

    assert.notDeepEqual(mgr.getSettings(), DEFAULT_GAME_SETTINGS);

    mgr.resetToDefaults();
    assert.deepEqual(mgr.getSettings(), DEFAULT_GAME_SETTINGS);

    // Verify storage was updated to defaults
    const reloaded = new SettingsManager(storage);
    assert.deepEqual(reloaded.getSettings(), DEFAULT_GAME_SETTINGS);
  });
});
