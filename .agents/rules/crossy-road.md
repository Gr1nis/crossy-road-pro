# Crossy Road Pro — Development Rules

## Architecture
- **Core/View wall**: `src/core/` must NEVER import Three.js, DOM, or browser APIs. All persistence through `StorageAdapter` interface.
- **Layers**: `src/core/` (pure logic) → `src/view/` (Three.js + WebAudio) → `src/app/` (UI, input, loop) → `src/platform/` (Yandex SDK). Each layer imports only from layers to its left.
- **Camera constants** (`CAMERA_OFFSET`, `FRUSTUM_SIZE`) live in `WORLD_CONFIG` — never hardcode in collision or view files.
- `src/main.ts` is bootstrap only (≤ 30 lines). Logic goes into `src/app/` modules.

## Code Quality Gates
- `tsc --noEmit` — 0 errors before commit.
- `npm test` — all tests pass (node `--experimental-strip-types --test`).
- No `any` types. No empty `catch {}`. No `as unknown as` casts.
- Max file length: 300 lines. Split if exceeding.
- Magic numbers → named constants in `WORLD_CONFIG` or module-level `const`.

## Performance (Three.js)
- **Always `dispose()`** geometry + material when removing meshes from scene (recursive `traverse`).
- **Never allocate in render loop**: no `new THREE.Color/Vector3/Set` inside `sync()` or `animate()`. Pre-allocate as class fields.
- **Prefer `InstancedMesh`** for repeated objects (trees, rocks, coins).
- **DOM updates** only when value actually changed (cache previous value).
- **Lane eviction**: `GameEngine.lanes` Map must evict rows behind `cameraZ - 30`.

## Build (`scripts/build.mjs`)
- All `const`/`class`/`function` names must be **globally unique** across all `src/` files (flat bundle concatenation).
- Update `moduleOrder` array when adding new files.
- Single external dep: Three.js from CDN. Everything else is procedural.

## Testing
- Tests use `node:test` + `node:assert/strict` (NOT vitest/jest).
- New core feature → new test. Property-based preferred (multi-seed × N iterations).
- View/audio code untestable headlessly — verify manually after build.
- CI (`.github/workflows/pages.yml`) must run `tsc --noEmit && npm test` before deploy.

## Game Design Invariants
- Frustum death: NDC Y < −1.0 via analytical projection + 0.4s grace period.
- Log magnetization: discrete 1.0-spaced slots via `snapToLogSlot`.
- Biome cycle every 25 points: forest → winter → desert → neon.
- HUD shows only score + coins + pause. Everything else is modal-driven.
- One revive per run (rewarded ad).

## Target Platform: Yandex Games
- SDK: `YaGames.init()` in `src/platform/ysdk.ts`, graceful fallback if unavailable.
- Saves: `player.getData()`/`setData()` via `StorageAdapter`.
- Ads: rewarded (coins/revive), interstitial (every 3rd game over), no banners during gameplay.
- Must work offline after initial load (except leaderboard/ads).
- Languages: RU (primary), EN, TR.
