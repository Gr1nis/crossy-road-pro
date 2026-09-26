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
- `src/core/types.ts`: Контракты `Lane`, `Vehicle`, `LogPlatform`, `TrainState`, `PlayerState`, `WORLD_CONFIG` (`CAMERA_BACK_LIMIT = 6.5`, `GACHA_COST = 100`, `WRAP_LIMIT = 22`).
- `src/core/prng.ts`: Детерминированный ГСЧ `Mulberry32`.
- `src/core/laneGenerator.ts`: Сбалансированный спавн монет (0.22), валуны/кусты/деревья, Ж/Д пути и поезда, реки с брёвнами.
- `src/core/collision.ts`: 1D AABB коллизии авто/поездов, поиск бревна, `quantizeLandX`, `worldToScreenX`.
- `src/core/scoreTracker.ts`: Монотонный трекер очков, High Score, монеты и Gacha-автомат (100 монет / прокрут).
- `src/core/gameEngine.ts`: FSM игры, буфер ввода, дрейф на брёвнах, скролл камеры и смерть при отставании от границы видимости.
- `src/view/meshFactory.ts`, `src/view/sceneManager.ts`, `src/view/audioSynth.ts`: 3D воксельная сцена Three.js и WebAudio.
- `src/main.ts` & `index.html`: Главное меню («Начать игру», «Гача-автомат», «Таблица лидеров»), модальные окна и HUD.

## 3. Жесткие инварианты (Проверены 23 тестами — 100% GREEN)
1. **Camera Back Limit Invariant**: Игрок погибает только при действительном выходе за нижний край видимой области поля (`CAMERA_BACK_LIMIT = 6.5`), без преждевременной смерти на видимой полосе.
2. **Gacha Economy Invariant**: Стоимость 1 прокрута строго 100 монет; дубликаты исключены, прогресс сохраняется в `LocalStorage`.
3. **Visual-Physical X-Axis Sync (`worldToScreenX`)**: Синхронизация всех объектов и коллайдеров.
4. **Solvability & Log Drift Invariants**: 100% проходимость сгенерированного мира и непрерывный дрейф на брёвнах.

## 4. Текущий этап и Next Up
- **Текущий этап**: Главное меню, модальные окна, скорректированный край камеры и экономика 100 монет внедрены и протестированы.
- **Next Up**: Полноценная интеграция бэкенда/SDK для таблицы лидеров.
