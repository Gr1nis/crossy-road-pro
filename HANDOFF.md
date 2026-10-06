# HANDOFF.md — Cross-Session State & Roadmap

## 1. Goal & Environment
- **Current Target**: Port **Crossy Road Pro** to Yandex Games following `development_plan.md` (achieving 100% parity with original Crossy Road: mobile controls, monetization, retention, pre-release polish).
- **Active Branch**: `master` (`Gr1nis/crossy-road-pro`)
- **Live Build**: [https://gr1nis.github.io/crossy-road-pro/](https://gr1nis.github.io/crossy-road-pro/)
- **CI/CD Status**: ✅ 100% GREEN in GitHub Actions (`build-and-deploy` passing with automated tests and typecheck).

---

## 2. Completed in Last Sessions (`[x]`)

### Фаза 0 — Стабилизация и критические фиксы (`[x]`)
- `[x]` **Memory Leak Fix**: Sliding window eviction старых полос позади `cameraZ - 30` в `src/core/gameEngine.ts` (`evictOldLanes`).
- `[x]` **Camera Constants Centralization**: `CAMERA_OFFSET` и `FRUSTUM_SIZE` вынесены в `WORLD_CONFIG` (`src/core/types.ts`) и синхронизированы с проекционной формулой в `src/core/collision.ts`.
- `[x]` **NPM Scripts & CI**: Удалён фантомный `vitest`, настроен нативный `node --experimental-strip-types --test`, добавлен гейткипер в `.github/workflows/pages.yml`.
- `[x]` **Adversarial Memory Test**: Написан `Invariant 8` в `tests/gameEngine.adversarial.test.ts` (проверка ограничения размера активных полос `<= 70`).

### Фаза 1 — Рефакторинг SRP (`[x]`)
- `[x]` **Core SRP Decomposition**:
  - `src/core/wallet.ts` (`CoinWallet` — баланс, списание, начисление).
  - `src/core/skinInventory.ts` (`SkinInventory` — коллекция, валидация разблокировки).
  - `src/core/gachaMachine.ts` (`GachaMachine` — шансы редкости, кэшбэк 40 монет).
  - `src/core/achievements.ts` (`AchievementTracker` — 5 ачивок, условия, прогресс).
  - `src/core/scoreTracker.ts` — преобразован в легковесный Фасад с сохранением 100% обратной совместимости.
- `[x]` **App Layer Decoupling**:
  - `src/app/uiManager.ts` (397 строк — DOM, модалки, тосты, dirty-check для очков/монет).
  - `src/app/inputManager.ts` (171 строка — клавиатура, иерархия Escape, изоляция фокуса ввода никнейма).
  - `src/app/gameLoop.ts` (339 строк — RAF loop, FSM состояний, синхронизация Three.js сцены, аудио и виньетки).
  - `src/main.ts` — сокращен с 570+ строк до 26 строк чистого bootstrap-кода.
- `[x]` **Build & CI Stability**:
  - Обновлён `scripts/build.mjs` (все 17 модулей в правильном порядке `moduleOrder`, авто-зачистка блоков `export`).
  - Добавлен `@types/node` в `devDependencies`, полностью решена проблема падения `Typecheck` в GitHub Actions.

### Доработки перед Фазой 3 (Аудит и стабилизация) (`[x]`)
- `[x]` **Fix Train Survival Achievement**: `recordTrainSurvived()` вызывается в `src/core/gameEngine.ts` при завершении проезда поезда в зоне видимости игрока.
- `[x]` **Fix Forward Streak Exploit**: Инкремент `forwardStreak` в `gameEngine.ts` перенесен строго после успешной валидации препятствий.
- `[x]` **Adversarial TDD Suite Expansion**: Добавлены Invariant 9 и Invariant 10 в `tests/gameEngine.adversarial.test.ts` (**50 / 50 GREEN**).
- `[x]` **Ghost Files Removal**: Полностью удалены неиспользуемые дубликаты `src/ui/uiManager.ts` и `src/audio/soundManager.ts`.
- `[x]` **Three.js Allocation Optimization**: `activeIndices` вынесен в поле класса `SceneManager` с `.clear()`, устранено создание `new Set` в каждом кадре; геометрия пыли `SceneManager.puffGeo` закеширована.
- `[x]` **Persistence Unification**: `GameLoop` избавлен от прямого ключа `crossy_road_pro_achievements_v1` и пустых `catch {}`, опирается на профиль `ScoreTracker`.
- `[x]` **Rules Documentation Sync**: Актуализирован таймаут гибели камеры до 0.4s в `.agents/rules/crossy-road.md`.

---

## 3. Key Architectural Decisions
- **Zero-Dependency Core**: Папка `src/core/` никогда не импортирует Three.js или DOM-типы. Все тесты запускаются нативно через Node.js.
- **Flat Bundle Assembly**: `scripts/build.mjs` конкатенирует все модули в один плоский `<script type="module">` в `index.html`. Все имена классов и функций на верхнем уровне должны быть глобально уникальны.
- **Dirty Checking в UI**: Текстовые узлы очков и монет обновляются в DOM только при реальном изменении значений, исключая просадки FPS.
- **Input Focus Protection**: При фокусе в поле ввода текста (`leaderboard-name-input`) клавиши WASD/Space не триггерят движение персонажа.
- **Touch Gesture Engine**: Легковесный детектор тапов и свайпов в `src/app/inputManager.ts`: быстрый тап (<400ms, <26px) делает прыжок вперед, свайпы во все 4 стороны управляют направлением, клики по UI/модалкам изолированы.
- **WebGL Memory Management**: Рекурсивный `disposeHierarchy()` геометрий и материалов при сдвиге камеры, сборе монет, зачистке партиклов и сбросе уровня.
- **Leaderboard Deduplication & PB**: Ровно 1 запись на игрока в таблице лидеров с авто-реконсиляцией рекорда при старте.
- **Clean Voxel Visuals**: Непрозрачные воксельные водопады без Z-fighting и шума; чистый асфальт без визуальной каши пунктира под машинами.
- **Multi-Lane Road Dividers**: Аккуратный белый пунктирный разделитель на межполосной границе $Z = +0.5$, появляющийся только между смежными автомобильными полосами (`ROAD`).
- **Leaderboard CSS Grid Centering**: 3-колоночная сетка (`85px 1fr 95px`) с идеальным вертикальным центрированием никнеймов и соосностью заголовков независимо от бейджа `(Вы)` и длины имени.
- **Yandex Games Viewport & Snappy Camera Death**: Динамический `viewSize = Math.max(11, 10.5 / aspect)` для полной видимости поля 18 клеток на смартфонах; сокращение таймаута гибели от камеры до 0.4s с плавной виньеткой.
- **Squash & Stretch Math**: Чистый изолированный математический модуль `src/view/squashStretch.ts` с сохранением объема тела (`1 / sqrt(scaleY)`), упругой затухающей гармоникой приземления и мультяшным сплющиванием при гибели.
- **PB Record Flag & VFX Celebration**: Воксельный флаг рекорда с короной 👑 на обочине полосы `highScore`, динамический салют из 48 золотых конфетти и фанфары в WebAudio API.

---

## 4. Current State & Immediate Next Steps (`[ ]`)

### Этап 1: Game Juice & Retention (`[x]`)
- `[x]` **Поток 1A (Squash & Stretch & Elastic Landing)**:
  - Процедурная фазовая деформация (Anticipation при hopProgress < 0.2, Flight Stretch в параболе прыжка, Landing readiness > 0.8).
  - Упругий пружинящий отскок при приземлении (`landingBounceTimer = 0.12s` с затухающей синусоидой).
  - Мультяшное сплющивание при столкновениях: машина `[1.65, 0.10, 1.65]`, поезд `[1.85, 0.06, 1.85]`, погружение в воду `position.y = -0.6`.
  - Тесты: 6 unit/adversarial тестов в `tests/squashStretch.test.ts`.
- `[x]` **Поток 1B (PB Record Flag & Victory Celebration)**:
  - 3D-модель маркера личного рекорда (`MeshFactory.createRecordFlag()` — флагшток, постамент, золотой вымпел с короной 👑).
  - Спавн на обочине полосы `highScore` (координата `x = 3.8`).
  - Триумфальное преодоление: исчезновение флага, салют из 48 золотых конфетти (`SceneManager.spawnRecordConfetti`), мажорные арпеджио-фанфары в `AudioSynth` и тост «🏆 НОВЫЙ РЕКОРД!».
  - Тесты: 5 unit/adversarial тестов в `tests/recordFlag.test.ts`.

- `[x]` **Поток 1C (16:9 PC Viewport, Audio Redesign & UI Polish)**:
  - **16:9 Horizon Draw Distance**: диапазон видимых полос вперед расширен до `+38` полос в `gameEngine.ts`, высота камеры скорректирована (`y=13.5`, прицел `camZ+3.0`), серые пустоты спереди на ПК полностью устранены.
  - **Сокращение частиц в 1.5 раза**: фоновые частицы уменьшены с 32 до 21, облачка пыли при шаге — с 6 до 4, праздничные конфетти — с 48 до 32.
  - **Аудио-редизайн (`src/view/audioSynth.ts`)**: замена резких sawtooth-пилящих волн на мягкие аркадные тона (бархатные каучуковые прыжки, кристальный перезвон монет, мягкий стук столкновений, винтажный звоночек поезда).
  - **Полировка интерфейса**: «Гача-автомат» переименован в «Автомат скинов», убрана лишняя строка «1 прокрут = 100 монет», баланс и иконка монеты идеально выровнены на одной линии через flexbox, на главном экране установлен приветственный слоган: «Сможешь перейти дорогу и не угодить под поезд? Погнали! 🚀».
  - Тесты: 62 / 62 GREEN (добавлен Bug 10 в `tests/bugfixes.adversarial.test.ts`).

### Следующий этап — Сеттинг «Городские животные» & Монетизация:
- `[ ]` **Поток 2C (Редизайн 3D-моделей — Сеттинг «Городские животные»)**:
  - ⚠️ **ОБЯЗАТЕЛЬНОЕ НАПОМИНАНИЕ**: При старте этой задачи (триггеры: «новый сеттинг», «новые модели», «давай подумаем над созданием нового сеттинга») **НАПОМНИТЬ пользователю про [OPTIMIZATION_PLAN.md](file:///c:/Users/MIXPC/.gemini/antigravity/scratch/crossy-road-pro/OPTIMIZATION_PLAN.md)** и сразу закладывать оптимизации для мобилок (`ParticlePool`, `InstancedMesh`, общие материалы/геометрии) в архитектуру новых ассетов!
  - Замена дефолтного героя: **Корги** (высокий CTR и виральность) вместо классической курицы.
  - Обновление пула скинов под городскую фауну (Капибара с мандаринкой, Голубь с пиццей, Кот в коробке, Енот-воришка).
  - Стилизация машин и препятствий под уютный городской воксель.
- `[ ]` **Фаза 3 (Интеграция с Yandex Games SDK & Монетизация)**:
  - Создать `src/platform/yandexBridge.ts` с безопасным моком для локального запуска без интернета.
  - Синхронизация прогресса игрока (монеты, рекорды, скины, ачивки) с `ysdk.getPlayer()`.
  - Межстраничная полноэкранная реклама (`showFullscreenAdv`) и Rewarded Video (`showRewardedVideo`) на возрождение.

---

## 5. Verification Status
- **TypeScript**: `npx tsc --noEmit` — 0 errors.
- **Test Suite**: `npm test` — **62 / 62 GREEN** across 9 test suites.
- **Bundle**: `node --check dist/bundle.js` — 0 errors.
- **Offline HTML**: `index.html` самодостаточен, мобильный вьюпорт, воксельный сок и флаг рекорда работают.
