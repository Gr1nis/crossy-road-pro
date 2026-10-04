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

---

## 3. Key Architectural Decisions
- **Zero-Dependency Core**: Папка `src/core/` никогда не импортирует Three.js или DOM-типы. Все 38 тестов запускаются нативно через Node.js.
- **Flat Bundle Assembly**: `scripts/build.mjs` конкатенирует все модули в один плоский `<script type="module">` в `index.html`. Все имена классов и функций на верхнем уровне должны быть глобально уникальны.
- **Dirty Checking в UI**: Текстовые узлы очков и монет обновляются в DOM только при реальном изменении значений, исключая просадки FPS.
- **Input Focus Protection**: При фокусе в поле ввода текста (`leaderboard-name-input`) клавиши WASD/Space не триггерят движение персонажа.
- **Touch Gesture Engine**: Легковесный детектор тапов и свайпов в `src/app/inputManager.ts`: быстрый тап (<400ms, <26px) делает прыжок вперед, свайпы во все 4 стороны управляют направлением, клики по UI/модалкам изолированы.
- **WebGL Memory Management**: Рекурсивный `disposeHierarchy()` геометрий и материалов при сдвиге камеры, сборе монет, зачистке партиклов и сбросе уровня.
- **Leaderboard Deduplication & PB**: Ровно 1 запись на игрока в таблице лидеров с авто-реконсиляцией рекорда при старте.
- **Clean Voxel Visuals**: Непрозрачные воксельные водопады без Z-fighting и шума; чистый асфальт без визуальной каши пунктира под машинами.
- **Yandex Games Viewport & Snappy Camera Death**: Динамический `viewSize = Math.max(11, 10.5 / aspect)` для полной видимости поля 18 клеток на смартфонах; сокращение таймаута гибели от камеры до 0.4s с плавной виньеткой.

---

## 4. Current State & Immediate Next Steps (`[ ]`)
Завершена **Фаза 2 (Мобильный ввод, оптимизация рендеринга и точечные исправления)**. Следующий этап — **Фаза 3 (Интеграция с Yandex Games SDK & Монетизация)**:

- `[ ]` **Поток 3A (Yandex Games SDK Bridge)**:
  - Создать `src/app/yandexBridge.ts` с безопасным моком для локального запуска без интернета.
  - Инициализация `YaGames.init()` и передача информации об окружении (`isMobile`, `lang`, `deviceType`).
  - Синхронизация прогресса игрока (монеты, рекорды, скины, ачивки) с `ysdk.getPlayer().setData()` / `getData()`.
- `[ ]` **Поток 3B (Монетизация & Реклама)**:
  - Межстраничная полноэкранная реклама (`showFullscreenAdv`) с кулдауном между смертями игрока.
  - Реклама за вознаграждение (`showRewardedVideo`): возрождение 1 раз за забег (`revive`) с сохранением комбо и дистанции.
  - Награда за просмотр рекламы в главном меню (+50 бесплатных монет на гача-рулетку).

---

## 5. Verification Status
- **TypeScript**: `npx tsc --noEmit` — 0 errors.
- **Test Suite**: `npm test` — **42 / 42 GREEN** across 6 test suites.
- **Bundle**: `node --check dist/bundle.js` — 0 errors.
- **Offline HTML**: `index.html` самодостаточен, мобильный вьюпорт и жесты настроены.
