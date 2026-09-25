# PROJECT_STATE.md — Crossy Road (Vibe-Pro Pipeline)

## 1. Архитектура и Стек
- **Пайплайн**: `vibe-pro` (Все 5 фаз завершены: Бриф → Спецификация → RED TDD → GREEN Реализация → Аудит & Sync)
- **Стек**: TypeScript + Three.js (Voxel Isometric 3D) + WebAudio API Synthesizer + Node 24 Test Runner
- **Точки входа**:
  - **GitHub Pages (Live Игра):** [https://gr1nis.github.io/crossy-road-pro/](https://gr1nis.github.io/crossy-road-pro/)
  - **GitHub Pages (Архитектурный план):** [https://gr1nis.github.io/crossy-road-pro/crossy_road_plan.html](https://gr1nis.github.io/crossy-road-pro/crossy_road_plan.html)
  - [index.html](file:///Users/egorbelogubec/.gemini/antigravity/scratch/crossy-road-pro/index.html) — Автономная 3D-игра (готова к запуску двойным кликом в браузере).
  - [crossy_road_plan.html](file:///Users/egorbelogubec/.gemini/antigravity/scratch/crossy-road-pro/crossy_road_plan.html) — Инженерный анализ и архитектурный план в HTML-формате.

## 2. Реализованные модули и их контракты
- `src/core/types.ts`: Контракты `Lane`, `Vehicle`, `LogPlatform`, `PlayerState`, `WORLD_CONFIG` (`WRAP_LIMIT = 22`, `LOG_MARGIN = 0.12`).
- `src/core/prng.ts`: Детерминированный ГСЧ `Mulberry32`.
- `src/core/laneGenerator.ts`: Генератор полос (`GRASS`, `ROAD`, `RIVER`) с гарантированным коридором проходимости, чередованием течения рек и равномерным распределением на кольце `2 * WRAP_LIMIT`.
- `src/core/collision.ts`: 1D AABB коллизии авто, поиск поддерживающего бревна, квантование `X` (`quantizeLandX`), синхронизация мировых и 3D-координат (`worldToScreenX`, `vehicleScreenRotationY`).
- `src/core/scoreTracker.ts`: Монотонный трекер очков и `High Score` с защитой от повреждённого `LocalStorage`.
- `src/core/gameEngine.ts`: Конечный автомат симуляции, неблокирующийся буфер ввода (`inputQueue`), снос на брёвнах (включая фазу прыжка `isHopping`) и скролл камеры.
- `src/view/meshFactory.ts`, `src/view/sceneManager.ts`, `src/view/audioSynth.ts`: 3D воксельная сцена Three.js с единой системой координат `worldToScreenX` и процедурным звуком.

## 3. Жесткие инварианты (Проверены 18 тестами — 100% GREEN)
1. **Visual-Physical X-Axis Sync (`worldToScreenX`)**: Все объекты (курица, деревья, автомобили, брёвна) отображаются через единое преобразование `-x`, исключая зеркальный рассинхрон коллайдеров и соскальзывание с брёвен в противоположную сторону.
2. **Solvability Invariant**: 2 500+ полос на 5 разных `seed` всегда имеют сквозной проход между соседними полосами `GRASS`.
3. **Continuous Log Drift (Standing & Hopping) & Quantization**: Позиция игрока на бревне сохраняет `player.x - log.x` как в покое, так и при прыжках вдоль бревна, а при сходе на сушу квантуется к `ℤ`.
4. **Score Monotonicity & Storage Resilience**: Счёт никогда не убывает при шагах назад; битые значения `LocalStorage` безопасно сбрасываются в `0`.

## 4. Текущий этап и Next Up
- **Текущий этап**: Фаза 5 завершена (18/18 тестов GREEN, баги коллизий и координат устранены, билд опубликован в GitHub Pages).
- **Next Up**: Возможные расширения по желанию (поезда, таймер Орла, магазин воксельных скинов).
