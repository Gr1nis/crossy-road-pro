import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  I18N_TRANSLATIONS,
  resolveLanguage,
  t,
  type Language,
} from '../src/core/i18n.ts';

describe('I18n — Multilingual Support (RU / EN / TR) Suite', () => {
  const languages: Language[] = ['ru', 'en', 'tr'];

  it('Property 1 (100% Key Coverage across RU, EN, TR): all languages define the exact same non-empty keys', () => {
    const ruKeys = Object.keys(I18N_TRANSLATIONS.ru).sort();
    assert.ok(ruKeys.length > 50, 'Dictionary must contain comprehensive keys (>50)');

    for (const lang of languages) {
      const keys = Object.keys(I18N_TRANSLATIONS[lang]).sort();
      assert.deepEqual(
        keys,
        ruKeys,
        `Language "${lang}" must have identical keys as "ru"`
      );

      for (const key of keys) {
        const val = I18N_TRANSLATIONS[lang][key];
        assert.equal(
          typeof val,
          'string',
          `Key "${key}" in "${lang}" must be string`
        );
        assert.ok(
          val.trim().length > 0,
          `Key "${key}" in "${lang}" must not be empty`
        );
      }
    }
  });

  it('Property 2 (resolveLanguage normalization): accurately normalizes locale codes', () => {
    // Russian and CIS variants -> ru
    assert.equal(resolveLanguage('ru'), 'ru');
    assert.equal(resolveLanguage('ru-RU'), 'ru');
    assert.equal(resolveLanguage('RU_RU'), 'ru');
    assert.equal(resolveLanguage('be'), 'ru');
    assert.equal(resolveLanguage('uk-UA'), 'ru');
    assert.equal(resolveLanguage('kk-KZ'), 'ru');
    assert.equal(resolveLanguage('uz'), 'ru');

    // Turkish variants -> tr
    assert.equal(resolveLanguage('tr'), 'tr');
    assert.equal(resolveLanguage('tr-TR'), 'tr');
    assert.equal(resolveLanguage('TR'), 'tr');

    // English & other foreign languages -> en
    assert.equal(resolveLanguage('en'), 'en');
    assert.equal(resolveLanguage('en-US'), 'en');
    assert.equal(resolveLanguage('en-GB'), 'en');
    assert.equal(resolveLanguage('de'), 'en');
    assert.equal(resolveLanguage('fr-FR'), 'en');
    assert.equal(resolveLanguage('es'), 'en');
    assert.equal(resolveLanguage('zh-CN'), 'en');
    assert.equal(resolveLanguage('ja'), 'en');

    // Nullish & empty fallbacks -> ru (primary language)
    assert.equal(resolveLanguage(undefined), 'ru');
    assert.equal(resolveLanguage(null), 'ru');
    assert.equal(resolveLanguage(''), 'ru');
    assert.equal(resolveLanguage('   '), 'ru');
  });

  it('Property 3 (t() function translation and parameter formatting): looks up keys and interpolates {0}, {1}', () => {
    assert.equal(t('settings_title', 'ru'), '⚙️ НАСТРОЙКИ');
    assert.equal(t('settings_title', 'en'), '⚙️ SETTINGS');
    assert.equal(t('settings_title', 'tr'), '⚙️ AYARLAR');

    // Parameter substitution
    assert.equal(t('daily_streak', 'ru', [5]), 'Серия: 5 дн.');
    assert.equal(t('daily_streak', 'en', [5]), 'Streak: 5 days');
    assert.equal(t('daily_streak', 'tr', [5]), 'Seri: 5 gün');

    assert.equal(
      t('quests_progress_summary', 'ru', [2, 3]),
      'Выполнено 2 из 3'
    );
    assert.equal(
      t('quests_progress_summary', 'en', [2, 3]),
      'Completed 2 of 3'
    );
    assert.equal(
      t('quests_progress_summary', 'tr', [2, 3]),
      '3 taneden 2 tamamlandı'
    );
  });

  it('Property 4 (t() fallback resilience): falls back to EN/RU or returns key when missing', () => {
    // Save original dictionary state
    const originalTr = { ...I18N_TRANSLATIONS.tr };
    try {
      // Temporarily remove a key from 'tr'
      delete (I18N_TRANSLATIONS.tr as Record<string, string>)['settings_title'];
      // Should fallback to 'en'
      assert.equal(t('settings_title', 'tr'), '⚙️ SETTINGS');

      // Non-existent key returns key name
      assert.equal(t('non_existent_key_12345', 'en'), 'non_existent_key_12345');
    } finally {
      I18N_TRANSLATIONS.tr = originalTr;
    }
  });

  it('Property 5 (Crucial screen keys coverage): includes settings, pause, game over, and rewards keys', () => {
    const requiredKeys = [
      'settings_title',
      'tab_sound',
      'tab_graphics',
      'tab_controls',
      'tab_game',
      'menu_tap_to_play',
      'pause_title',
      'pause_resume_btn',
      'reset_confirm_title',
      'reset_confirm_ok',
      'game_over_title',
      'death_car',
      'death_train',
      'death_water',
      'daily_bonus_title',
      'quests_title',
    ];

    for (const key of requiredKeys) {
      for (const lang of languages) {
        assert.ok(
          Boolean(I18N_TRANSLATIONS[lang][key]),
          `Required key "${key}" must be present in "${lang}"`
        );
      }
    }
  });
});
