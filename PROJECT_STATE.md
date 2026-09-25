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
- `src/core/types.ts`: Контракты `Lane`, `Vehicle`, `LogPlatform`, `PlayerState`, `WORLD_CONFIG`.
- `src/core/prng.ts`: Детерминированный ГСЧ `Mulberry32`.
- `src/core/laneGenerator.ts`: Генератор полос (`GRASS`, `ROAD`, `RIVER`) с гарантированным коридором проходимости и чередованием течения рек.
- `src/core/collision.ts`: 1D AABB коллизии авто, поиск поддерживающего бревна, квантование `X` (`quantizeLandX`).
- `src/core/scoreTracker.ts`: Монотонный трекер очков и `High Score` с защитой от повреждённого `LocalStorage`.
- `src/core/gameEngine.ts`: Конечный автомат симуляции, буфер ввода (`inputQueue`), дрейф на брёвнах и скролл камеры.
- `src/view/meshFactory.ts`, `src/view/sceneManager.ts`, `src/view/audioSynth.ts`: 3D воксельная сцена Three.js с мягкими тенями и процедурным звуком.

## 3. Жесткие инварианты (Проверены 13 тестами — 100% GREEN)
1. **Solvability Invariant**: 2 500+ полос на 5 разных `seed` всегда имеют сквозной проход между соседними полосами `GRASS`.
2. **Continuous Log Drift & Quantization**: Позиция игрока на бревне сохраняет `player.x - log.x`, а при сходе на берег квантуется к `ℤ`.
3. **Score Monotonicity & Storage Resilience**: Счёт никогда не убывает при шагах назад; битые значения `LocalStorage` безопасно сбрасываются в `0`.

## 4. Текущий этап и Next Up
- **Текущий этап**: Фаза 5 завершена + **GitHub Pages развёрнут и активен** (`https://gr1nis.github.io/crossy-road-pro/`).
- **Next Up**: Возможные расширения по желанию (поезда, таймер Орла, магазин воксельных скинов).
