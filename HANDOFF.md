# HANDOFF.md — Cross-Device Session State (Windows → macOS)

## 1. Last Updated & Goal
- **Last Updated**: 2026-09-28 (Windows PC → macOS Handoff)
- **Active Branch**: `master` (`Gr1nis/crossy-road-pro`)
- **Current Goal**: Parallel 5-stream upgrade (Biomes, Meta/Leaderboard/Gacha Cashback, 3D Voxel Weather & Biomes, WebAudio BGM & Skin Voices, Interactive UI/Toasts) has been audited, integrated, tested (30/30 tests GREEN), and bundled into standalone `index.html` and `dist/bundle.js`. Ready to continue development or deploy on macOS.

---

## 2. Completed in Last Session (`[x]`)
- `[x]` **Multi-Chat Architecture & File Ownership Split**: Divided work across 5 isolated streams with zero file conflicts:
  1. **Stream 1 (Core & Biomes)**: `src/core/types.ts`, `src/core/laneGenerator.ts`, `src/core/gameEngine.ts`, `tests/laneGenerator.test.ts` — Added biome rotation every 25 points (`forest` → `winter` → `desert` → `neon`), progressive vehicle/train speeds, and higher traffic density with guaranteed passable corridors.
  2. **Stream 2 (Meta, Economy & Leaderboard)**: `src/core/scoreTracker.ts`, `tests/scoreTracker.test.ts` — Implemented persistent Top-10 local leaderboard with 10 bot rivals (`DEFAULT_BOT_RIVALS`), overtaken bot tracking (`overtakenBots`), Gacha rarity tiers (`Common`, `Rare`, `Epic`, `Legendary`), `+40` coin duplicate cashback, and 5 core achievements (`first_50_steps`, `collector`, `train_conqueror`, `rich_hopper`, `leaderboard_champion`).
  3. **Stream 3 (3D Voxel Art & Weather)**: `src/view/meshFactory.ts`, `src/view/sceneManager.ts` — Added biome-aware trees/rocks/bushes, dynamic lighting & exponential fog transitions (`BIOME_ATMOSPHERES`), 32 ambient weather particles (leaves/snow/sand/neon sparks), and elastic log-landing tilt animation (`LogImpact`).
  4. **Stream 4 (WebAudio Synthesizer & BGM)**: `src/view/audioSynth.ts` — Added procedural 16-step pentatonic chiptune BGM (`startMusic` / `stopMusic` / `setMusicEnabled`), per-skin jump voices (`playSkinVoice` for Chicken, Cyber-Duck, Shadow-Ninja, Frost-Penguin), Gacha roulette SFX (`playGachaRoll`, `playGachaUnlock`), and high-score fanfare (`playNewHighScore`).
  5. **Stream 5 (UI/HUD & Final Integration)**: `src/main.ts`, `scripts/build.mjs`, `index.html`, `dist/bundle.js` — Built interactive Leaderboard modal (with player nickname input), Music toggle in Settings modal, Gacha rarity badges & cashback toast notifications, and wired `ScoreTracker` + `AudioSynth` into the main game loop.
- `[x]` **Cross-Stream Integration Fixes**:
  - Resolved top-level bundle identifier collision (`SKIN_RARITY_MAP` & `LeaderboardEntry` between `src/core/scoreTracker.ts` and `src/main.ts`) by renaming the UI dictionary in `src/main.ts` to `UI_SKIN_RARITY`.
  - Fixed TypeScript strict narrowing error `TS2367` in `src/core/laneGenerator.ts` (`for (let x: number = WORLD_CONFIG.MIN_X; ...)`).
  - Exposed `getScoreTracker()` on `GameEngine` and connected `recordRun`, `getLeaderboard`, `setPlayerName`, `playSkinVoice`, `playGachaRoll`, `playGachaUnlock`, and `playNewHighScore` in `src/main.ts`.
- `[x]` **Verification & Build**:
  - `npx tsc --noEmit`: **0 errors**.
  - `node --check dist/bundle.js`: **0 syntax errors**.
  - `node --test tests/*.test.ts`: **30 / 30 tests PASS** across all 5 suites.
  - Regenerated standalone `index.html` and `dist/bundle.js` via `node scripts/build.mjs`.

---

## 3. Key Architectural & Design Decisions
- **Single-File Bundle Constraint (`scripts/build.mjs`)**: Because `scripts/build.mjs` strips TypeScript types and concatenates all modules in `moduleOrder` into a single `<script type="module">` inside `index.html` and `dist/bundle.js`, top-level `const` / `function` / `class` names must be globally unique across all files in `src/`.
- **Core vs View Separation**: `src/core/*` never imports Three.js or DOM APIs so all 30 tests run natively in Node (`node --test`).
- **Gacha Economy**: Gacha remains Roll-able even after unlocking skins so players can test luck or trigger duplicate cashback (`+40` coins), while tracking rarity tiers.

---

## 4. Current State & Exact Next Steps (`[ ]`)
When resuming on **macOS**:
1. `[ ]` Run `git pull` on Mac and verify tests locally (`npm test` or `node --test tests/*.test.ts`).
2. `[ ]` Open `index.html` in browser (or run `npm run dev`) to visually playtest the 4 biome transitions (`forest`, `winter`, `desert`, `neon`), skin voices, BGM toggle, and Leaderboard name editor.
3. `[ ]` Choose the next feature milestone (e.g., new unlockable skins/obstacles per biome, daily challenges UI modal, or mobile touch/swipe controls toggle).

---

## 5. Known Issues / Unfinished Debugging
- **None**: All 30 unit/property/adversarial tests pass (`0 fail`), TypeScript compiles cleanly (`0 errors`), and `dist/bundle.js` + `index.html` are freshly built and verified.
