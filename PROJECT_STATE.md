# PROJECT_STATE.md — Crossy Road (Vibe-Pro Pipeline)

## 1. Архитектура и Стек
- **Пайплайн**: `vibe-pro` (Фазы: Бриф → Спецификация → RED TDD → GREEN Реализация → Аудит & Sync)
- **Стек**: TypeScript + Three.js (Voxel Isometric 3D) + WebAudio API Synthesizer + Node 24 Test Runner (`node:test`)
- **Точки входа**:
  - **GitHub Pages (Live Игра):** [https://gr1nis.github.io/crossy-road-pro/](https://gr1nis.github.io/crossy-road-pro/)
  - **GitHub Pages (Архитектурный план):** [https://gr1nis.github.io/crossy-road-pro/crossy_road_plan.html](https://gr1nis.github.io/crossy-road-pro/crossy_road_plan.html)
  - [index.html](./index.html) — Автономная 3D-игра (полный бандл, готова к запуску в браузере).
  - [viewer.html](./viewer.html) / [model-viewer.html](./model-viewer.html) — Интерактивный 3D-просмотрщик воксельных моделей.
  - [crossy_road_plan.html](./crossy_road_plan.html) — Инженерный анализ и архитектурный план в HTML-формате.

## 2. Реализованные модули и их контракты
- `src/core/types.ts`: Контракты `Lane`, `Vehicle`, `LogPlatform`, `TrainState`, `PlayerState`, `WORLD_CONFIG`.
- `src/core/prng.ts`: Детерминированный ГСЧ `Mulberry32`.
- `src/core/laneGenerator.ts`: Сбалансированный спавн монет (0.22), валуны/кусты/деревья, Ж/Д пути и поезда, реки с брёвнами.
- `src/core/collision.ts`: 1D AABB коллизии авто/поездов, поиск бревна, `quantizeLandX`, `snapToLogSlot`, `worldToScreenX`, `getCameraFrustumNdcY`, `isPlayerBehindCameraFrustum`.
- `src/core/scoreTracker.ts`: Монотонный трекер очков, High Score, монеты и Gacha-автомат (100 монет / прокрут).
- `src/core/settingsManager.ts`: Модульный менеджер настроек (звук, музыка, тряска экрана, тени, D-Pad, языки RU/EN/TR, сброс прогресса).
- `src/core/gameEngine.ts`: FSM игры, буфер ввода, дрейф на брёвнах с дискретным магнетизмом (`snapToLogSlot`), скролл камеры и смерть строго после физического выхода за нижний край экрана (NDC Y < -1.0) с таймером отсрочки (`cameraGraceTimer`).
- `src/view/meshFactory.ts`, `src/view/sceneManager.ts`, `src/view/audioSynth.ts`: 3D воксельная сцена Three.js, водопады на реках (`±10.2`), разметка на дорогах, насечки слотов на брёвнах, процедурное WebAudio с щелчками рулетки и кэшбэком.
- `src/view/gachaCardArt.ts`: Векторные SVG-карточки персонажей в воксельном стиле для рулетки.
- `src/app/gachaMachineModal.ts`: Контроллер горизонтальной рулетки Prize Machine (замедление, аудио-трещотка, штамп дубликата, победный фейерверк).
- `src/app/uiManager.ts`, `src/app/gameLoop.ts`: ПК-лейаут главного меню (Tap-to-Play, 3D-виджеты, док-панель), модалка настроек, коллекция скинов.

## 3. Жесткие инварианты (Проверены 154 тестами в 25 сьютах — 100% GREEN)
1. **True Visual Frustum Boundary Invariant**: Игрок погибает только после того, как его 3D-модель физически и полностью пересекает нижний видимый край экрана вьюпорта (NDC Y < -1.0), плюс истекает таймер отсрочки (`CAMERA_GRACE_PERIOD = 1.25s`).
2. **Backward Movement Safety**: Игрок может свободно отступать назад на 15+ полос, пока остаётся в поле зрения камеры.
3. **Danger Vignette Feedback**: При пересечении границы активируется мягкая пульсирующая виньетка внизу экрана.
4. **Log Slot Magnetization Invariant**: При прыжке на бревно координата игрока мгновенно магнитится к дискретному слоту бревна (`snapToLogSlot`).
5. **VFX & Audio Feedback**: Разные поверхности издают уникальные звуки; процедурные щелчки рулетки при прокрутке автомата скинов и перезвон кэшбэка.
6. **Clean HUD Invariant**: Во время забега отображаются только очки и монеты; меню и гача-автомат модальные.
7. **Pause Invariant**: Приостанавливает физический шаг симуляции `engine.step(dt)` при вызове паузы (кнопка ⏸ или `Esc`/`P`).
8. **Performance Optimization Invariant**: 4 потока оптимизации (Geometry Pooling, Voxel Merging, Instanced Decor, Frustum Envelope & Lane Eviction) активны, удерживая 60 FPS.

## 4. Текущий этап и Next Up
- **Текущий статус**: **154 / 154 тестов GREEN**, `tsc --noEmit` — 0 ошибок, сборка чистая.
- **Свежие фичи**:
  - Полнофункциональный ПК-автомат скинов (Prize Machine Horizontal Roulette).
  - Отдельное окно коллекции скинов с живым переключением 3D-модели героя.
  - Модульное меню настроек (звук, графика, D-Pad, языки RU/EN/TR, сброс прогресса).
  - ПК-лейаут главного меню с 3D-виджетами и полноэкранным Tap-to-Play.
- **Очередь задач (Next Up)**:
  1. [ ] Спринт Motion & Game Feel (сглаживание прыжка $t = 0.2$, частота дыхания героя, левитация монет).
  2. [ ] Спринт Voxel Grid & Performance (защита VoxelPalette, сборка персонажей через `VoxelMeshBuilder`).
  3. [ ] Спринт Yandex Games SDK (облачные сохранения `setData`, таблица рекордов, боевая реклама).
