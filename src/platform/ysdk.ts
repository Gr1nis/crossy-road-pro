// ============================================================================
// ⚠️ НАПОМИНАНИЕ ПРИ РАБОТЕ С YANDEX GAMES SDK:
// В проекте сейчас активен ТЕСТОВЫЙ РЕЖИМ (DEV Mode).
// Перед тестированием в боевой среде или релизом отключите тест-режим:
// 1. src/core/dailyReward.ts -> DEV_DISABLE_DAILY_TIMERS = false;
// 2. src/app/uiManager.ts -> раскомментировать боевые таймеры
// 3. scripts/build.mjs -> убрать/скрыть кнопку #menu-dev-btn и модалку
// 4. npm test && npm run build
// ============================================================================

import type { AdProvider, RewardedAdCallbacks } from '../core/types.ts';
import type { Language } from '../core/i18n.ts';
import { resolveLanguage } from '../core/i18n.ts';

export interface YsdkRewardedCallbacks {
  onOpen?: () => void;
  onRewarded?: () => void;
  onClose?: () => void;
  onError?: (err: unknown) => void;
}

export interface YsdkAdv {
  showRewardedVideo(options: { callbacks: YsdkRewardedCallbacks }): Promise<void> | void;
  showFullscreenAdv?(options: { callbacks: { onClose?: (wasShown: boolean) => void; onError?: (err: unknown) => void } }): void;
}

export interface YsdkEnvironmentI18n {
  lang?: string;
  tld?: string;
}

export interface YsdkEnvironment {
  i18n?: YsdkEnvironmentI18n;
}

export interface YsdkInstance {
  adv: YsdkAdv;
  environment?: YsdkEnvironment;
  features?: {
    LoadingAPI?: {
      ready(): void;
    };
  };
}

export interface YaGamesGlobal {
  init(): Promise<YsdkInstance>;
}

declare global {
  interface Window {
    YaGames?: YaGamesGlobal;
    crossy_sim_ads?: boolean;
  }
}

export class PlatformBridge implements AdProvider {
  private ysdk: YsdkInstance | null = null;
  private isInitStarted: boolean = false;
  private isInitCompleted: boolean = false;
  private simulationMode: boolean = false;

  constructor(simulationMode: boolean = false) {
    this.simulationMode = simulationMode;
  }

  public async init(): Promise<boolean> {
    if (this.isInitCompleted) return this.isAvailable();
    if (this.isInitStarted) return false;
    this.isInitStarted = true;

    if (typeof window === 'undefined') {
      this.isInitCompleted = true;
      return false;
    }

    if (window.crossy_sim_ads) {
      this.simulationMode = true;
    }

    if (window.YaGames && typeof window.YaGames.init === 'function') {
      try {
        this.ysdk = await window.YaGames.init();
        this.isInitCompleted = true;
        this.ysdk?.features?.LoadingAPI?.ready?.();
        return true;
      } catch (err: unknown) {
        console.warn('[PlatformBridge] YaGames.init failed, falling back to offline mode:', err);
        this.ysdk = null;
        this.isInitCompleted = true;
        return false;
      }
    }

    this.isInitCompleted = true;
    return false;
  }

  public isAvailable(): boolean {
    return Boolean(this.ysdk && this.ysdk.adv && typeof this.ysdk.adv.showRewardedVideo === 'function');
  }

  public isAdReady(): boolean {
    return this.isAvailable() || this.simulationMode || Boolean(typeof window !== 'undefined' && window.crossy_sim_ads);
  }

  public setSimulationMode(enabled: boolean): void {
    this.simulationMode = enabled;
  }

  public getEnvironmentLanguage(): Language | null {
    const raw = this.ysdk?.environment?.i18n?.lang;
    if (typeof raw === 'string' && raw.trim().length > 0) {
      return resolveLanguage(raw);
    }
    return null;
  }

  public showRewardedVideo(callbacks: RewardedAdCallbacks): void {
    if (this.isAvailable() && this.ysdk) {
      callbacks.onOpen?.();
      try {
        this.ysdk.adv.showRewardedVideo({
          callbacks: {
            onOpen: () => callbacks.onOpen?.(),
            onRewarded: () => callbacks.onRewarded?.(),
            onClose: () => callbacks.onClose?.(),
            onError: (err: unknown) => callbacks.onError?.(err),
          },
        });
      } catch (err: unknown) {
        callbacks.onError?.(err);
      }
      return;
    }

    if (this.simulationMode || (typeof window !== 'undefined' && window.crossy_sim_ads)) {
      callbacks.onOpen?.();
      setTimeout(() => {
        callbacks.onRewarded?.();
        callbacks.onClose?.();
      }, 200);
      return;
    }

    callbacks.onError?.(new Error('Yandex SDK is not initialized and simulation is disabled'));
  }
}
