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
- **Zero-Dependency Core**: Папка `src/core/` никогда не импортирует Three.js или DOM-типы. Все 31 тест запускаются нативно через Node.js.
- **Flat Bundle Assembly**: `scripts/build.mjs` конкатенирует все модули в один плоский `<script type="module">` в `index.html`. Все имена классов и функций на верхнем уровне должны быть глобально уникальны.
- **Dirty Checking в UI**: Текстовые узлы очков и монет обновляются в DOM только при реальном изменении значений, исключая просадки FPS.
- **Input Focus Protection**: При фокусе в поле ввода текста (`leaderboard-name-input`) клавиши WASD/Space не триггерят движение персонажа.

---

## 4. Current State & Immediate Next Steps (`[ ]`)
Проект готов к началу **Фазы 2 — Мобильный ввод + Производительность рендеринга**:

- `[ ]` **Поток 2A (Rendering Performance & Three.js Memory)**:
  - Добавить рекурсивный `dispose()` геометрий и материалов при удалении старых полос в `src/view/sceneManager.ts`.
  - Кешировать per-frame объекты (`THREE.Color`, векторы) в полях классов вместо `new` в цикле `sync()`.
  - Использовать `InstancedMesh` или geometry pooling для повторяющихся объектов (деревья, валуны) в `src/view/meshFactory.ts`.
- `[ ]` **Поток 2B (Mobile Touch & Swipe Controls)**:
  - Добавить детектор свайпов (`touchstart`, `touchmove`, `touchend`) и tap-to-hop в `src/app/inputManager.ts`.
  - Блокировать паразитные системные жесты (pull-to-refresh, pinch-zoom) на мобильных устройствах.
  - Адаптивный CSS для мобильных экранов (`viewport-fit=cover`, safe-area-inset) в шаблоне `scripts/build.mjs`.

---

## 5. Verification Status
- **TypeScript**: `npx tsc --noEmit` — 0 errors.
- **Test Suite**: `npm test` — **31 / 31 GREEN**.
- **Bundle**: `node --check dist/bundle.js` — 0 errors.
- **GitHub Actions**: Все проверки и деплой на GitHub Pages завершаются успешно (зеленая галочка).
