# Crossy Road Pro — Handoff Session State

## Цели и контекст сессии (Windows PC ↔ macOS)
- **Проект**: Crossy Road Pro (HTML5 / Three.js / TypeScript / WebAudio).
- **Платформа**: Синхронизация между ПК (Windows) и Mac (macOS) для аккаунта `Gr1nis`.
- **Ветка**: `master`.
- **Репозиторий**: `https://github.com/Gr1nis/crossy-road-pro`.
- **GitHub Pages**: `https://gr1nis.github.io/crossy-road-pro/`.

---

## Статус готовности и Code Quality Gates
- **Тесты**: **253 / 253 PASS** (40 тестовых сьютов на `node:test` + `node:assert/strict`).
- **Типизация**: `npx tsc --noEmit` — 0 ошибок.
- **Сборка**: `node scripts/build.mjs` и `npm run build` — 100% успешно (41 синхронизированная модель).
- **Дистрибуция**: Zero-dependency автономный `index.html`, `viewer.html` / `model-viewer.html` (3D Model Viewer), `dist/bundle.js`.
- **GitHub Pages CI**: Автоматический деплой при пуше в `master` через `.github/workflows/pages.yml`.

---

## Что было реализовано в текущей сессии [x]

### 1. Рождественский пак персонажей («Рождественские чудеса») — 10 из 10 моделей
Все 10 персонажей смоделированы в Blockbench, сертифицированы независимыми критиками (квант 0.05, Zero Z-Fighting `coplanar_overlap = 0`, заземление $Y = 0.00$, монолитное ядро):
1. [x] `penguin_cocoa` (Common, 🐧) — Пингвинёнок с какао (55 кубов).
2. [x] `snow_hare` (Common, 🐰) — Снежный заяц с морковкой (61 куб).
3. [x] `husky_sweater` (Common, 🐕) — Хаски в рождественском свитере (57 кубов, Corgi-style loaf body).
4. [x] `derpy_snowman` (Common, ⛄) — Снеговик с полосатым шарфом и метёлкой (70 кубов).
5. [x] `arctic_fox` (Rare, 🦊) — Песец в тёплых изумрудных наушниках (67 кубов).
6. [x] `holiday_elf` (Rare, 🧝) — Эльф-помощник с коробочкой подарка (67 кубов).
7. [x] `holiday_owl` (Rare, 🦉) — Полярная сова с кедровой шишкой (69 кубов).
8. [x] `gingerbread_man` (Epic, 🍪) — Пряничный человечек с сахарной глазурью и леденцами (68 кубов).
9. [x] `reindeer_glow` (Epic, 🦌) — Олень Рудольф с сияющим рубиновым носом и гирляндой (66 кубов).
10. [x] `santa_claus` (Legendary, 🎅) — Дедушка Санта с мешком подарков и леденцом-тростью (78 кубов).

### 2. Полная интеграция пака в движок игры
- **Процедурные 3D-меши (Three.js)**:
  - `src/view/christmasCharacters.ts` (223 строки, $\le 300$): персонажи 1–5, калибровка масштаба `CHRISTMAS_CHARACTER_CALIBRATIONS`.
  - `src/view/christmasCharactersExpansion.ts` (213 строк, $\le 300$): персонажи 6–10.
  - Связка с `createUrbanCharacter` в `src/view/urbanCharacters.ts`.
- **Палитра**: `src/view/voxelPalette.ts` дополнен всеми рождественскими оттенками и алиасами.
- **Ядро и типы**:
  - `src/core/types.ts`: `SkinId` расширен до 20 скинов, `ALL_SKINS` дополнен 10 новыми персонажами с именами и эмодзи-бейджами.
  - `src/core/gachaMachine.ts`: актуализированы редкости `SKIN_RARITY_MAP`, веса и расчёт дубликатов.
- **UI и коллекции**:
  - `src/app/skinsCollectionModal.ts`: обновлена карта редкостей `SKINS_RARITY_MAP` для всех 20 скинов.
  - `src/view/modelRegistry.ts`: добавлены авторские описания в `SKIN_DESCRIPTIONS`.
  - `src/view/gachaCardArt.ts`: добавлены верхнерегистровые имена в `CARD_NAMES_UPPER`.
- **3D WebP иконки**:
  - `scripts/render_character_thumbnails.py` сгенерировал 20 прозрачных 160×160 иконок в `references/processed_icons/`.
  - Обновлён `src/view/gachaSkinsBase64.ts` с Data URI для офлайн-рендеринга.
- **WebAudio синтезатор (`src/view/audioSynth.ts`)**:
  - Добавлены 10 уникальных процедурных голосов и эффектов в `playSkinVoice` (включая бас «Хо-хо-хо!» и колокольчики Санты).
- **Тесты и сборка**:
  - Добавлен тестовый сьют `tests/christmasCharactersIntegration.test.ts` (253 теста PASS).
  - Обновлён `scripts/build.mjs`, верифицирован чекер `auditDeployModels` (41 модель).

---

## ⚠️ ОБЯЗАТЕЛЬНОЕ НАПОМИНАНИЕ: ТЕСТОВЫЙ РЕЖИМ (DEV MODE)
В коде сейчас активен тестовый режим для мгновенной проверки всех 7 дней наград и механик.

### Чек-лист отключения DEV Mode перед релизом:
1. `src/core/dailyReward.ts`: `export let DEV_DISABLE_DAILY_TIMERS = false;`
2. `src/app/uiManager.ts`: раскомментировать боевой обратный отсчёт до полуночи в `updateQuestsCountdown()` и показ таймера ожидания бонуса в `renderDailyBonus()`.
3. `scripts/build.mjs`: скрыть/убрать кнопку `#menu-dev-btn` и модалку `#dev-modal`.
4. Запустить `npm test && npm run build`.

---

## 📋 Очередь задач: Ремастер Мира 1 («Городские легенды»)
Подробный регламент и таблица всех моделей: [docs/WORLD_1_OVERHAUL_GUIDE.md](docs/WORLD_1_OVERHAUL_GUIDE.md).

1. **Транспорт полос (8 моделей)**:
   - [ ] `taxi` (Городское такси: 80–110 кубов, $Y=0.00$)
   - [ ] `car` (Легковой седан: 70–95 кубов, $Y=0.00$)
   - [ ] `truck` (Фургон доставки: 90–120 кубов, $Y=0.00$)
   - [ ] `bus` (Городской автобус: 110–145 кубов, $Y=0.00$)
   - [ ] `scooter` (Курьерский скутер: 55–75 кубов, $Y=0.00$)
   - [ ] `sweeper` (Уборочная машина: 85–115 кубов, $Y=0.00$)
   - [ ] `train` (Городской поезд: 95–130 кубов, $Y=0.00$)
   - [ ] `pallet` (Плавающий поддон реки: 25–40 кубов, $Y=0.00$)

2. **Пропсы и мебель тротуаров (8 моделей)**:
   - [ ] `tree_planter`, `hedge`, `hydrant`, `trash_can`, `bench`, `lamp_post`, `railway_signal`, `road_barrier`

3. **Декор реки и полос (4 модели)**:
   - [ ] `riverbank_edge`, `coin`, `record_flag`, `road_markings`

4. **Архитектурные кулисы обочин (3 гранд-модели)**:
   - [ ] `townhouse_cafe`, `townhouse_bakery`, `townhouse_books`

---

## 🏮 СЛЕДУЮЩИЙ МИР В ПЛАНАХ: КИТАЙСКИЙ НОВЫЙ ГОД
1. **Тематический мир «Китайский Новый Год» (Chinese New Year)**:
   - [ ] Традиционные пагоды с загнутыми крышами, резные деревянные арки.
   - [ ] Красные шёлковые фонарики с золотыми кисточками.
   - [ ] Мостики над рекой с цветущими лотосами.
   - [ ] Золотые монетки с квадратным отверстием по центру.
   - [ ] Праздничные салюты и фейерверки на фоне.
2. **Обязательный маскот мира**:
   - [ ] **«Красная панда с книжками» (Red Panda with Books)** — пушистая рыжая панда с полосатым кольчатым хвостом в традиционном китайском жилете, держащая стопку старинных книг/свитков.
