export type Language = 'ru' | 'en' | 'tr';

const RAW_I18N: Record<string, readonly [string, string, string]> = {
  // Settings modal
  settings_title: ['⚙️ НАСТРОЙКИ', '⚙️ SETTINGS', '⚙️ AYARLAR'],
  settings_subtitle: ['Персонализация звука, графики и геймплея', 'Customize audio, visual and gameplay settings', 'Ses, grafik ve oynanış ayarlarını özelleştirin'],
  tab_sound: ['🔊 Звук', '🔊 Sound', '🔊 Ses'],
  tab_graphics: ['🎨 Графика', '🎨 Graphics', '🎨 Grafik'],
  tab_controls: ['🎮 Управление', '🎮 Controls', '🎮 Kontroller'],
  tab_game: ['⚙️ Игра', '⚙️ Game', '⚙️ Oyun'],
  sfx_label: ['Звуковые эффекты', 'Sound Effects', 'Ses Efektleri'],
  sfx_subtext: ['Прыжки, монеты, поезда и аварии', 'Jumping, coins, trains and crashes', 'Zıplama, jeton, tren ve kaza sesleri'],
  sfx_volume_label: ['Громкость звуков', 'SFX Volume', 'Ses Seviyesi'],
  music_label: ['Фоновая музыка', 'Background Music', 'Arka Plan Müziği'],
  music_subtext: ['Динамический ретро-саундтрек во время игры', 'Dynamic retro soundtrack during gameplay', 'Oyun sırasında dinamik retro müzik'],
  music_volume_label: ['Громкость музыки', 'Music Volume', 'Müzik Seviyesi'],
  shadows_label: ['Динамические тени', 'Dynamic Shadows', 'Dinamik Gölgeler'],
  shadows_subtext: ['Мягкие тени от солнца и окружающих объектов', 'Soft shadows from sun and world props', 'Güneş ve çevre nesnelerinden yumuşak gölgeler'],
  quality_label: ['Качество рендеринга', 'Render Quality', 'Grafik Kalitesi'],
  quality_subtext: ['Высокое (HiDPI / Retina) или низкое (1x)', 'High (HiDPI / Retina) or Low (1x)', 'Yüksek (HiDPI / Retina) veya Düşük (1x)'],
  quality_high: ['Высокое', 'High', 'Yüksek'],
  quality_low: ['Низкое', 'Low', 'Düşük'],
  shake_label: ['Тряска камеры (Screen Shake)', 'Screen Shake', 'Ekran Titremesi'],
  shake_subtext: ['Эффект отдачи при ударах и проезде поезда', 'Impact vibration and train pass reactions', 'Çarpma ve tren geçişlerinde sarsıntı efekti'],
  fullscreen_label: ['Полноэкранный режим', 'Fullscreen Mode', 'Tam Ekran Modu'],
  fullscreen_subtext: ['Развернуть игру на полный экран', 'Expand game to fill display', 'Oyunu tam ekrana genişlet'],
  fullscreen_btn: ['⛶ Экран', '⛶ Fullscreen', '⛶ Tam Ekran'],
  controls_label: ['Тип управления', 'Control Scheme', 'Kontrol Türü'],
  controls_subtext: ['Выберите способ управления персонажем', 'Choose your preferred movement controls', 'Karakter hareket yöntemini seçin'],
  controls_swipe: ['👆 Свайпы', '👆 Swipes', '👆 Kaydırma'],
  controls_dpad: ['🕹️ D-Pad', '🕹️ D-Pad', '🕹️ D-Pad'],
  controls_tap: ['🎯 Тапы', '🎯 Taps', '🎯 Dokunma'],
  sensitivity_label: ['Чувствительность свайпов', 'Swipe Sensitivity', 'Kaydırma Hassasiyeti'],
  sensitivity_subtext: ['Дистанция жеста для срабатывания прыжка', 'Gesture distance required to trigger hop', 'Zıplama için gereken kaydırma mesafesi'],
  sens_low: ['Низкая', 'Low', 'Düşük'],
  sens_normal: ['Нормальная', 'Normal', 'Normal'],
  sens_high: ['Высокая', 'High', 'Yüksek'],
  haptics_label: ['Вибрация (Haptics)', 'Haptic Feedback', 'Titreşim (Haptik)'],
  haptics_subtext: ['Тактильный отклик при сборе бонусов и монет', 'Tactile feedback on coins and bonuses', 'Bonus ve jetonlarda dokunsal geri bildirim'],
  lang_label: ['Язык интерфейса', 'Interface Language', 'Arayüz Dili'],
  lang_subtext: ['Язык подсказок и меню', 'Language for menus and hints', 'Menüler ve ipuçları için dil'],
  reset_settings_label: ['Сброс настроек', 'Reset Settings', 'Ayarları Sıfırla'],
  reset_settings_subtext: ['Вернуть все параметры к заводским значениям', 'Restore all settings to default values', 'Tüm ayarları varsayılan değerlere döndür'],
  reset_settings_btn: ['Сбросить', 'Reset', 'Sıfırla'],
  reset_data_label: ['Сброс прогресса', 'Reset Progress', 'İlerlemeyi Sıfırla'],
  reset_data_subtext: ['Удалить все монеты, открытые скины и рекорды', 'Wipe all coins, unlocked skins, and scores', 'Tüm jetonları, açık görünümleri ve rekorları sil'],
  reset_data_btn: ['Стереть всё', 'Wipe All', 'Hepsini Sil'],
  settings_close_btn: ['Готово', 'Done', 'Bitti'],

  // Reset confirmation
  reset_confirm_title: ['Сброс прогресса', 'Reset Progress', 'İlerlemeyi Sıfırla'],
  reset_confirm_desc: ['Вы уверены? Будут удалены все монеты, открытые скины и рекорды.', 'Are you sure? All coins, unlocked skins, and scores will be deleted.', 'Emin misiniz? Tüm jetonlar, açık görünümler ve rekorlar silinecek.'],
  reset_confirm_cancel: ['Отмена', 'Cancel', 'İptal'],
  reset_confirm_ok: ['Да, сбросить всё', 'Yes, Wipe All', 'Evet, Hepsini Sıfırla'],

  // Main menu & HUD
  hud_distance: ['Пройденный путь', 'Distance', 'Gidilen Yol'],
  hud_coins: ['Монеты 🪙', 'Coins 🪙', 'Jetonlar 🪙'],
  hud_pause_btn: ['Пауза', 'Pause', 'Duraklat'],
  menu_high_score: ['high score', 'high score', 'en yüksek skor'],
  menu_best: ['BEST:', 'BEST:', 'EN İYİ:'],
  menu_tap_to_play: ['НАЖМИТЕ ДЛЯ СТАРТА', 'TAP TO PLAY', 'BAŞLAMAK İÇİN DOKUN'],
  menu_skins: ['Скины', 'Skins', 'Görünümler'],
  menu_shop: ['Магазин', 'Shop', 'Mağaza'],
  menu_leaderboard: ['Рейтинг', 'Leaderboard', 'Liderler'],
  menu_achievements: ['Достижения', 'Achievements', 'Başarılar'],
  menu_daily_gift: ['Подарок', 'Daily Gift', 'Hediye'],
  menu_quests: ['Задания', 'Quests', 'Görevler'],

  // Pause
  pause_title: ['⏸ ПАУЗА', '⏸ PAUSED', '⏸ DURAKLATILDI'],
  pause_desc: ['Игра приостановлена. Выберите действие:', 'Game paused. Choose an action:', 'Oyun duraklatıldı. Bir eylem seçin:'],
  pause_resume_btn: ['▶ Продолжить', '▶ Resume', '▶ Devam Et'],
  pause_settings_btn: ['⚙ Настройки', '⚙ Settings', '⚙ Ayarlar'],
  pause_menu_btn: ['🏠 Главное меню', '🏠 Main Menu', '🏠 Ana Menü'],

  // Game over & death reasons
  game_over_title: ['Игра окончена!', 'Game Over!', 'Oyun Bitti!'],
  game_over_score: ['СЧЁТ', 'SCORE', 'SKOR'],
  game_over_best: ['РЕКОРД', 'RECORD', 'REKOR'],
  game_over_restart: ['Играть снова', 'Play Again', 'Yeniden Oyna'],
  game_over_to_menu: ['Главное меню', 'Main Menu', 'Ana Menü'],
  death_car: ['Вас сбил автомобиль на трассе!', 'You were hit by a car on the highway!', 'Otoyolda bir araba size çarptı!'],
  death_train: ['Вас снёс скоростной экспресс на переезде!', 'You were smashed by an express train!', 'Hemzemin geçitte hızlı tren size çarptı!'],
  death_water: ['Вы упали в бурную реку!', 'You plunged into the roaring river!', 'Azgın nehre düştünüz!'],
  death_bounds: ['Бревно унесло вас за край карты!', 'A log drifted you out of bounds!', 'Kütük sizi haritanın dışına taşıdı!'],
  death_camera: ['Вы слишком долго стояли на месте!', 'You stayed still for too long!', 'Çok uzun süre hareketsiz kaldınız!'],
  death_generic: ['Игра окончена', 'Game Over', 'Oyun Bitti'],

  // Daily bonus & quests
  daily_bonus_title: ['🎁 ЕЖЕДНЕВНЫЙ БОНУС', '🎁 DAILY BONUS', '🎁 GÜNLÜK BONUS'],
  daily_bonus_desc: ['Заходите каждый день и собирайте ценные награды!', 'Log in every day to collect valuable rewards!', 'Her gün giriş yapın ve değerli ödüller toplayın!'],
  daily_streak: ['Серия: {0} дн.', 'Streak: {0} days', 'Seri: {0} gün'],
  daily_next_timer: ['Следующий бонус через:', 'Next bonus in:', 'Sonraki bonus süresi:'],
  daily_claim_btn: ['Забрать награду', 'Claim Reward', 'Ödülü Al'],
  daily_double_btn: ['🎬 Забрать x2 за рекламу', '🎬 Claim 2x with Ad', '🎬 Reklamla 2x Al'],
  quests_title: ['🎯 ЕЖЕДНЕВНЫЕ ЗАДАНИЯ', '🎯 DAILY QUESTS', '🎯 GÜNLÜK GÖREVLER'],
  quests_desc: ['Выполняйте испытания дня и получайте монеты!', 'Complete daily challenges to earn coins!', 'Jeton kazanmak için günlük görevleri tamamlayın!'],
  quests_reset_timer: ['До обновления:', 'Reset in:', 'Yenilenmeye kalan:'],
  quests_progress_header: ['ПРОГРЕСС ДНЯ', 'DAILY PROGRESS', 'GÜNLÜK İLERLEME'],
  quests_progress_summary: ['Выполнено {0} из {1}', 'Completed {0} of {1}', '{1} taneden {0} tamamlandı'],
  quests_super_title: ['СУПЕР-ПРИЗ ДНЯ', 'DAILY SUPER PRIZE', 'GÜNÜN SÜPER ÖDÜLÜ'],
  quests_super_desc: ['Выполните все 3 задания: {0} 🪙', 'Complete all 3 quests: {0} 🪙', '3 görevin hepsini tamamlayın: {0} 🪙'],
  quests_super_claim: ['Забрать {0} 🪙', 'Claim {0} 🪙', '{0} 🪙 Al'],
  quests_super_claim_x2: ['🎬 Забрать x2 за рекламу', '🎬 Claim 2x with Ad', '🎬 Reklamla 2x Al'],
  modal_close: ['Закрыть', 'Close', 'Kapat'],
  gacha_title: ['🎰 АВТОМАТ СКИНОВ', '🎰 PRIZE MACHINE', '🎰 ÖDÜL MAKİNESİ'],
  gacha_desc: ['Испытайте удачу и откройте новые воксельные скины!', 'Try your luck and unlock unique voxel skins!', 'Şansınızı deneyin ve yeni voksel görünümlerin kilidini açın!'],
  gacha_balance: ['Ваш баланс:', 'Your balance:', 'Bakiyeniz:'],
  leaderboard_title: ['🏆 ТАБЛИЦА ЛИДЕРОВ', '🏆 LEADERBOARD', '🏆 LİDER TABLOSU'],
  leaderboard_desc: ['Введите своё имя и соревнуйтесь за первое место в рейтинге лучших забегов!', 'Enter your player name and compete for the #1 spot!', 'Oyuncu adınızı girin ve 1. sıra için yarışın!'],
  leaderboard_save: ['Сохранить', 'Save', 'Kaydet'],
  leaderboard_rank: ['Ранг', 'Rank', 'Sıra'],
  leaderboard_player: ['Игрок', 'Player', 'Oyuncu'],
  leaderboard_score: ['Очки', 'Score', 'Skor'],
  achievements_title: ['🏅 ДОСТИЖЕНИЯ', '🏅 ACHIEVEMENTS', '🏅 BAŞARILAR'],
  achievements_desc: ['Выполняйте испытания и открывайте новые награды!', 'Complete challenges and unlock achievements!', 'Görevleri tamamlayın ve yeni ödüller kazanın!'],
  achievements_summary: ['ОБЩИЙ ПРОГРЕСС', 'OVERALL PROGRESS', 'GENEL İLERLEME'],
};

export const I18N_TRANSLATIONS: Record<Language, Record<string, string>> = {
  ru: {},
  en: {},
  tr: {},
};

for (const [key, [ru, en, tr]] of Object.entries(RAW_I18N)) {
  I18N_TRANSLATIONS.ru[key] = ru;
  I18N_TRANSLATIONS.en[key] = en;
  I18N_TRANSLATIONS.tr[key] = tr;
}

export function resolveLanguage(detected?: string | null): Language {
  if (!detected || typeof detected !== 'string') {
    return 'ru';
  }
  const clean = detected.trim().toLowerCase().split(/[-_]/)[0];
  if (!clean) {
    return 'ru';
  }
  if (['ru', 'be', 'uk', 'kk', 'uz', 'ky', 'tg'].includes(clean)) {
    return 'ru';
  }
  if (clean === 'tr') {
    return 'tr';
  }
  return 'en';
}

export function t(key: string, lang: Language = 'ru', params?: Array<string | number>): string {
  const dict = I18N_TRANSLATIONS[lang];
  let text = dict ? dict[key] : undefined;
  if (!text && lang !== 'en') {
    text = I18N_TRANSLATIONS.en[key];
  }
  if (!text && lang !== 'ru') {
    text = I18N_TRANSLATIONS.ru[key];
  }
  if (!text) {
    return key;
  }
  if (params && params.length > 0) {
    return text.replace(/\{(\d+)\}/g, (_match, index) => {
      const idx = Number(index);
      return idx < params.length ? String(params[idx]) : _match;
    });
  }
  return text;
}
