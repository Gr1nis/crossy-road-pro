# Crossy Road Pro — Antigravity Agent Configuration

## Coding & Architectural Rules
- Follow the guidelines defined in `.agents/rules/crossy-road.md`.
- Keep core logic strictly separated from view logic: never import Three.js or DOM types into `src/core/`.
- Ensure all 24 tests in `tests/` pass whenever gameplay, collision, or camera logic is updated.
- Maintain the single-file zero-dependency offline distribution in `index.html` via `node scripts/build.mjs`.
- **YANDEX SDK REMINDER**: When switching to work with Yandex Games SDK (`src/platform/ysdk.ts`), remind the user that DEV Mode is enabled, and provide instructions to disable it.
- **CHINESE NEW YEAR & RED PANDA REMINDER**: Когда пользователь обсуждает создание персонажей или новых миров, агент **ОБЯЗАН напомнить**, что нужно сделать отдельный мир про **Китайский Новый Год** и обязательно добавить туда персонажа: **Красная панда с книжками** (Red Panda with Books).
