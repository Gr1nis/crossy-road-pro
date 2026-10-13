# Crossy Road Pro — Handoff Session State

## Цели и контекст перехода (macOS → PC / Windows)
- **Проект**: Crossy Road Pro (HTML5 / Three.js / TypeScript / WebAudio).
- **Платформа**: Переход с Mac (macOS) на ПК (Windows) для аккаунта `Gr1nis`.
- **Ветка**: `master` (все текущие изменения проверены и запушены на `origin/master`).
- **Репозиторий**: `https://github.com/Gr1nis/crossy-road-pro`.
- **Хэш коммита**: `c7e3429` (`feat(view): standardize Parisian Cafe (Townhouse A) to 0.05 voxel grid & update handoff`).

---

## Статус готовности и Code Quality Gates
- **Тесты**: 130 / 130 PASS (20 тестовых сьютов, Property-Based и Adversarial тесты на `node:test`).
- **Типизация**: `npx tsc --noEmit` — 0 ошибок.
- **Сборка**: `node scripts/build.mjs` и `npm run build` — 100% успешно.
- **Дистрибуция**: Zero-dependency автономный `index.html`, интерактивный просмотрщик `viewer.html` / `model-viewer.html`, `dist/bundle.js`.

---

## Текущий фокус задачи: Редизайн Главного Меню и Переход на Формат 9:16

Пользователь поставил задачу привести главное меню в соответствие с визуальным референсом (стиль Subway Surfers / гиперказуальные мобильные хиты) и решить проблему размывания композиции на широких экранах ПК.

### Согласованное решение:
1. **Строгий контейнер 9:16 для всей игры (Pillarbox на ПК)**:
   - Вся игра (3D-холст Three.js + HUD + меню + модалки) ограничивается пропорциями **9:16**.
   - На десктопе игра центрируется с аккуратными полями (pillarbox), что соответствует регламенту Яндекс Игр (свободные зоны по бокам зарезервированы под рекламу/баннеры).
   - На мобилках контейнер занимает 100% экрана.
   - Рендерер Three.js и ортографическая камера в `SceneManager` пересчитываются по `container.clientWidth / clientHeight`, фиксируя идеальное соотношение сторон `0.5625` без искажения геометрии.
2. **Кинематографическая 3D-сцена меню (Three.js)**:
   - В режиме меню камера приближается (`zoom: 1.35...1.45`) и разворачивается под диагональным углом прямо к дороге.
   - Выбранный персонаж стоит в центре сцены на полосе `row = 0, x = 0`, плавно покачивается/дышит (`idle-анимация`).
   - Рядом с героем на дороге левитируют и вращаются золотые 3D-монеты с мягкими тенями.
   - При клике на `PLAY ▶` камера плавно отлетает (lerp ~0.4s) в боевую позицию забега.
3. **Пак отдельных 3D-иконок через NanoBanana**:
   - Вместо системных эмодзи и CSS-градиентов используются изолированные 3D-спрайты на белом фоне.
   - Промпты для генерации согласованы и зафиксированы ниже.
4. **Стеклянный UI и мультяшный шрифт**:
   - Подключение округлого игрового шрифта (Lilita One / Fredoka) и стеклянных плашек (Frosted Glass).

> Детальный план зафиксирован в артефакте: `menu_redesign_plan.md`.

---

## Промпты для NanoBanana (Готовы к генерации)

Стиль: **глянцевый изометрический 3D-стиль, мультяшный винил, мягкое студийное освещение, чистый белый фон**:

1. **Главная кнопка PLAY**:
   `3D mobile game UI asset, giant rounded rectangular green PLAY button with glossy jelly bevel, white bold 3D play triangle arrow, thick white border, casual mobile game style, isometric view, isolated on pure white background, vibrant lighting, no text`
2. **Ежедневный подарок (Daily Gift)**:
   `3D isometric red gift box with bright glossy yellow ribbon and big bow, cute casual game icon, clay style, toy aesthetic, isolated on pure white background, soft shadow`
3. **Квесты (Quests)**:
   `3D cartoon clipboard icon with checklist paper and green checkmarks, casual mobile game UI badge, glossy plastic, isolated on pure white background`
4. **Скины (Skins)**:
   `3D cute voxel red panda head portrait, chibi animal face badge, glossy cartoon game icon, vibrant orange fur, isolated on pure white background`
5. **Магазин (Shop)**:
   `3D cute turquoise shopping cart loaded with shiny golden coins, casual game icon, glossy finish, isolated on pure white background`
6. **Лидерборд (Leaderboard)**:
   `3D golden shiny trophy cup standing on a small white-blue podium pedestal, star emboss, casual mobile game achievement icon, isolated on pure white background`
7. **Достижения (Achievements)**:
   `3D round golden star medal with two hanging red silk ribbon tails, glossy mobile game award icon, isolated on pure white background`
8. **Настройки (Settings)**:
   `3D chunky cyan-blue metallic gear cog, smooth rounded edges, glossy casual game settings icon, isolated on pure white background`
9. **Монетка и Корона (для верхней панели)**:
   `3D shiny gold coin with embossed star, high gloss, casual game currency icon, isolated on pure white background`
   `3D cute golden royal crown with tiny red jewels, casual mobile game high score badge, isolated on pure white background`

---

## Что уже сделано в проекте [x]

### 1. Оптимизация 60 FPS (Все 4 потока завершены)
- **Stream 1**: Пул геометрий полос (`src/view/laneGeometryPool.ts`).
- **Stream 2**: Монолитное слияние вокселей одинаковых материалов (`src/view/voxelMeshBuilder.ts`).
- **Stream 3**: Инстансинг пропсов и монет через `InstancedDecorManager` (`THREE.InstancedMesh`).
- **Stream 4**: Frustum Envelope и выгрузка полос позади камеры (`cameraZ - 30`).

### 2. Бенчмарк-система и Телеметрия
- `PerfMetricsTracker`: скользящий FPS, 1% Low, замер времени кадра и draw calls.
- `PerfMonitor` (вызов по `F3` / `Alt+P`), режим бессмертия (God Mode), авто-хоп центрирование.
- `PerfReportModal`: экспорт отчета с разбивкой таймингов и кнопкой копирования в Markdown.

### 3. Интерактивный 3D Model Viewer
- Реестр моделей `src/view/modelRegistry.ts` (26 проверенных моделей).
- Доступен по `viewer.html` и `model-viewer.html` с автоматическим аудитом при сборке.

### 4. Мета-геймплей
- 7-дневный календарь наград `DailyRewardManager` с заморозкой/восстановлением серии через Rewarded Ads.
- Ежедневные квесты `DailyQuestsManager` с процедурным аудио и летающими монетами.
- 3D воксельный флаг рекорда PB с салютом и конфетти при побитии лучшего счёта.

### 5. Стандартизация воксельной сетки 0.05
- Спецификация `docs/VOXEL_GRID_SPECIFICATION.md` (шаг 0.05, 4 золотых правила: полые оболочки, бюджеты, vertex colors, монолитная склейка).
- Эталонная Зимняя пекарня (`Townhouse B`, `src/view/urbanBuildings.ts`).
- Парижское кафе (`Townhouse A`, `src/view/urbanBuildings.ts`).

---

## ⚠️ ОБЯЗАТЕЛЬНОЕ НАПОМИНАНИЕ: ТЕСТОВЫЙ РЕЖИМ (DEV MODE)
В коде сейчас активирован тестовый режим для мгновенной проверки всех 7 дней наград без ожидания полуночи.

### Чек-лист отключения DEV Mode перед релизом в продакшн:
1. **`src/core/dailyReward.ts` (строка 68)**:
   ```ts
   export let DEV_DISABLE_DAILY_TIMERS = false;
   ```
2. **`src/app/uiManager.ts`**:
   Раскомментировать боевой обратный отсчёт до полуночи в `updateQuestsCountdown()` и показ таймера ожидания бонуса в `renderDailyBonus()`.
3. **`scripts/build.mjs`**:
   Скрыть/убрать кнопку `#menu-dev-btn` и модалку `#dev-modal` перед выкаткой в каталог Яндекс Игр.
4. **Проверка**:
   Запустить `npm test && npm run build`.

---

## Инструкция по развертыванию на ПК (Windows)

1. **Клонирование / обновление репозитория**:
   ```bash
   git pull origin master
   ```
2. **Установка зависимостей (если ещё не установлены)**:
   ```bash
   npm install
   ```
3. **Запуск проверок**:
   ```bash
   npm test
   npx tsc --noEmit
   npm run build
   ```
4. **Локальный запуск**:
   - Через Vite: `npm run dev`
   - Или открыть автономный `index.html` / `model-viewer.html` прямо в браузере.

---

## Следующие шаги (Next Steps на ПК)

1. **Этап 1 (Контейнер 9:16)**:
   - Ввести корневой `#game-container` с `aspect-ratio: 9/16` и `max-width: calc(100vh * (9/16))`.
   - Обновить `onResize` в `src/view/sceneManager.ts`, чтобы брать размеры контейнера.
2. **Этап 2 (3D Сцена Главного Меню)**:
   - Реализовать `setMenuCameraMode(isMenu)` в `src/view/sceneManager.ts` и `src/app/gameLoop.ts`.
   - Зум камеры ~1.4, поворот на персонажа на полосе 0, idle-анимация героя, вращающиеся монеты на дороге.
3. **Этап 3 (Интеграция ассетов NanoBanana)**:
   - Обработать сгенерированные иконки (удаление белого фона, сжатие в WebP/PNG).
   - Внедрить ассеты в `scripts/build.mjs` через Base64 Data URI для сохранения единого автономного файла.
4. **Этап 4 (Стеклянный UI и шрифты)**:
   - Подключить округлый шрифт Lilita One / Fredoka.
   - Финализировать разметку и стили кнопок в `scripts/build.mjs`.
5. **Параллельная задача**:
   - Перевод Книжной лавки (`Townhouse C` в `src/view/urbanBuildings.ts`) на канон сетки 0.05.
6. **Интеграция с Yandex Games SDK (`src/platform/ysdk.ts`)**:
   - Облачные сохранения `getPlayer().setData()`, отправка в лидерборд, боевая реклама (Rewarded & Interstitial).
