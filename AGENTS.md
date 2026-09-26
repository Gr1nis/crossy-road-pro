# Crossy Road Pro — Antigravity Agent Configuration

## Coding & Architectural Rules
- Follow the guidelines defined in `.agents/rules/crossy-road.md`.
- Keep core logic strictly separated from view logic: never import Three.js or DOM types into `src/core/`.
- Ensure all 24 tests in `tests/` pass whenever gameplay, collision, or camera logic is updated.
- Maintain the single-file zero-dependency offline distribution in `index.html` via `node scripts/build.mjs`.
