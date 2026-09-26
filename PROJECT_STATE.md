# PROJECT_STATE.md — Crossy Road (Vibe-Pro Pipeline)

## 1. Архитектура и Стек
- **Пайплайн**: `vibe-pro` (Все 5 фаз завершены: Бриф → Спецификация → RED TDD → GREEN Реализация → Аудит & Sync)
- **Стек**: TypeScript + Three.js (Voxel Isometric 3D) + WebAudio API Synthesizer + Node 24 Test Runner
- **Точки входа**:
  - **GitHub Pages (Live Игра):** [https://gr1nis.github.io/crossy-road-pro/](https://gr1nis.github.io/crossy-road-pro/)
  - **GitHub Pages (Архитектурный план):** [https://gr1nis.github.io/crossy-road-pro/crossy_road_plan.html](https://gr1nis.github.io/crossy-road-pro/crossy_road_plan.html)
  - [index.html](file:///C:/Users/MIXPC/.gemini/antigravity/scratch/crossy-road-pro/index.html) — Автономная 3D-игра (готова к запуску двойным кликом в браузере).
  - [crossy_road_plan.html](file:///C:/Users/MIXPC/.gemini/antigravity/scratch/crossy-road-pro/crossy_road_plan.html) — Инженерный анализ и архитектурный план в HTML-формате.

## 2. Реализованные модули и их контракты
- `src/core/types.ts`: Контракты `Lane`, `Vehicle`, `LogPlatform`, `TrainState`, `PlayerState`, `WORLD_CONFIG` (`CAMERA_BACK_LIMIT = 7.2`, `CAMERA_GRACE_PERIOD = 1.25s`, `GACHA_COST = 100`, `WRAP_LIMIT = 22`).
- `src/core/prng.ts`: Детерминированный ГСЧ `Mulberry32`.
- `src/core/laneGenerator.ts`: Сбалансированный спавн монет (0.22), валуны/кусты/деревья, Ж/Д пути и поезда, реки с брёвнами.
- `src/core/collision.ts`: 1D AABB коллизии авто/поездов, поиск бревна, `quantizeLandX`, `worldToScreenX`.
- `src/core/scoreTracker.ts`: Монотонный трекер очков, High Score, монеты и Gacha-автомат (100 монет / прокрут).
- `src/core/gameEngine.ts`: FSM игры, буфер ввода, дрейф на брёвнах, скролл камеры и смерть при отставании от границы видимости с таймером отсрочки (`cameraGraceTimer`).
- `src/view/meshFactory.ts`, `src/view/sceneManager.ts`, `src/view/audioSynth.ts`: 3D воксельная сцена Three.js (без фантомного клона), настройки звука в WebAudio.
- `src/main.ts` & `index.html`: Минималистичный внутриигровой HUD (только «Пройденный путь», «Монеты» и кнопка паузы), меню паузы, настройки звука, предупреждающая красная виньетка при пересечении границы.

## 3. Жесткие инварианты (Проверены 23 тестами — 100% GREEN)
1. **Camera Boundary & Grace Period Invariant**: Игрок погибает только после того, как он полностью скрылся за видимым нижним краем экрана (`CAMERA_BACK_LIMIT = 7.2`), и истёк таймер отсрочки (`CAMERA_GRACE_PERIOD = 1.25s`), дающий шанс выпрыгнуть обратно на экран.
2. **Danger Vignette Feedback**: При пересечении границы активируется мягкая пульсирующая виньетка внизу экрана, наглядно сигнализирующая об опасности.
3. **Clean HUD Invariant**: Во время геймплея отображаются только показатели пройденного пути и монет; гача-панель вынесена в главное меню.
4. **Pause Invariant**: Игра надёжно приостанавливает физический шаг симуляции `engine.step(dt)` при вызове паузы (кнопка ⏸ или `Esc`/`P`).

## 4. Текущий этап и Next Up
- **Текущий этап**: Граница камеры скорректирована с учётом задержки и виньетки, 23/23 тестов GREEN.
- **Next Up**: Дальнейшее развитие таблицы лидеров и новых биомов.
