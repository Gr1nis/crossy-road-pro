# Crossy Road Pro — Antigravity Workspace Guidelines

## Overview
This repository contains **Crossy Road 3D — Vibe-Pro Edition**, a zero-dependency, standalone 3D isometric browser game developed using TypeScript, Three.js, WebAudio API, and Node.js test runner.

## Project Structure
- `src/core/`: Deterministic game logic (physics, collisions, RNG, procedural generation, combo and scoring). Completely decoupled from the DOM and renderer.
- `src/view/`: Three.js isometric rendering (voxels, dynamic lighting, particles, water cascades, road markings) and procedural WebAudio synthesis.
- `src/main.ts`: Application orchestrator, game loop, keyboard/touch input handling, HUD and UI modals.
- `tests/`: Adversarial, property-based, and unit test suites running on Node Test Runner.
- `scripts/build.mjs`: Zero-dependency build pipeline compiling all modules into `dist/bundle.js` and standalone `index.html`.
- `PROJECT_STATE.md`: Single source of truth for architectural invariants, completed phases, and active pipeline state.

## Architectural Invariants
1. **Frustum & Grace Period**: Death behind the camera is determined strictly by 3D viewport frustum projection (`NDC Y < -1.0` via `isPlayerBehindCameraFrustum`), giving players an active 1.25s grace window and danger vignette feedback.
2. **Log Slot Magnetization**: When landing on river logs, player X snaps to discrete 1.0-spaced slots (`snapToLogSlot`), maintaining deterministic drift.
3. **Clean HUD & Main Menu**: In-game HUD displays only Score, Coins, and Pause. Gacha shop, character selector, and settings are modal-driven.
4. **100% Test Pass Guarantee**: Before committing, all test suites in `tests/` must pass with 0 failures.
