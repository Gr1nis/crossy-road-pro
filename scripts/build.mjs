import fs from 'node:fs';
import path from 'node:path';
import * as nodeModule from 'node:module';
import ts from 'typescript';
import { MENU_ICONS } from '../src/view/menuIconsBase64.ts';
import { GACHA_ICONS } from '../src/view/gachaIconsBase64.ts';
import { SKINS_MENU_ICONS } from '../src/view/skinsIconsBase64.ts';

function stripTypes(source) {
  if (typeof nodeModule.stripTypeScriptTypes === 'function') {
    return nodeModule.stripTypeScriptTypes(source);
  }
  return ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ESNext,
      module: ts.ModuleKind.ESNext,
    },
  }).outputText;
}

const ROOT = process.cwd();

const moduleOrder = [
  'src/core/types.ts',
  'src/core/prng.ts',
  'src/core/collision.ts',
  'src/core/i18n.ts',
  'src/core/settingsManager.ts',
  'src/core/wallet.ts',
  'src/core/skinInventory.ts',
  'src/core/gachaMachine.ts',
  'src/core/achievements.ts',
  'src/core/dailyReward.ts',
  'src/core/dailyQuests.ts',
  'src/core/scoreTracker.ts',
  'src/core/laneGenerator.ts',
  'src/core/gameEngine.ts',
  'src/platform/ysdk.ts',
  'src/view/audioSynth.ts',
  'src/view/voxelPalette.ts',
  'src/view/urbanCharacters.ts',
  'src/view/voxelMeshBuilder.ts',
  'src/view/urbanVehicles.ts',
  'src/view/urbanEnvironment.ts',
  'src/view/townhouse/shopfront.ts',
  'src/view/townhouse/upperFloors.ts',
  'src/view/townhouse/roof.ts',
  'src/view/urbanBuildings.ts',
  'src/view/meshFactory.ts',
  'src/view/modelRegistry.ts',
  'src/view/squashStretch.ts',
  'src/view/laneGeometryPool.ts',
  'src/view/instancedDecorManager.ts',
  'src/view/menuIconsBase64.ts',
  'src/view/gachaIconsBase64.ts',
  'src/view/skinsIconsBase64.ts',
  'src/view/gachaSkinsBase64.ts',
  'src/view/gachaCardArt.ts',
  'src/view/sceneManager.ts',
  'src/app/perfMetrics.ts',
  'src/app/perfReportModal.ts',
  'src/app/perfMonitor.ts',
  'src/app/settingsModal.ts',
  'src/app/gachaRouletteAnim.ts',
  'src/app/gachaMachineModal.ts',
  'src/app/worldsCollectionModal.ts',
  'src/app/skinsCollectionModal.ts',
  'src/app/uiManager.ts',
  'src/app/inputManager.ts',
  'src/app/gameLoop.ts',
  'src/main.ts',
];

let combinedJs = `import * as THREE from 'https://unpkg.com/three@0.170.0/build/three.module.js';\n\n`;

for (const relPath of moduleOrder) {
  const fullPath = path.join(ROOT, relPath);
  const tsSource = fs.readFileSync(fullPath, 'utf8');
  let jsCode = stripTypes(tsSource);

  // Remove local relative imports, export blocks, and un-prefix export keyword
  jsCode = jsCode
    .replace(/^\s*import\s+[\s\S]*?from\s+['"][^'"]+['"];?\s*$/gm, '')
    .replace(/^\s*export\s*\{[\s\S]*?\};?\s*$/gm, '')
    .replace(/^\s*export\s+(class|function|const|let|var)/gm, '$1');

  combinedJs += `// --- Module: ${relPath} ---\n${jsCode.trim()}\n\n`;
}

const distDir = path.join(ROOT, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}
fs.writeFileSync(path.join(distDir, 'bundle.js'), combinedJs, 'utf8');

const htmlContent = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
  <meta http-equiv="Pragma" content="no-cache" />
  <meta http-equiv="Expires" content="0" />
  <title>Crossy Road 3D — Vibe-Pro Edition</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700;800;900&family=Lilita+One&display=swap" rel="stylesheet" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; -webkit-user-select: none; }
    body, html { width: 100%; height: 100%; overflow: hidden; font-family: 'Segoe UI', system-ui, sans-serif; background: #000; touch-action: none; -webkit-touch-callout: none; display: flex; align-items: center; justify-content: center; }
    #game-container { aspect-ratio: 16 / 9; width: min(100vw, calc((100vh - 100px) * (16 / 9))); height: auto; max-height: calc(100vh - 100px); position: relative; overflow: hidden; border-radius: 0; border: none; box-shadow: none; touch-action: none; background: #87ceeb; }
    #game-container > canvas { width: 100% !important; height: 100% !important; display: block; position: absolute; inset: 0; z-index: 1; }
    @media (max-width: 768px), (max-aspect-ratio: 1/1) {
      body, html { background: #000; }
      #game-container { aspect-ratio: auto; height: 100%; max-height: 100vh; max-width: 100%; width: 100%; border-radius: 0; border: none; box-shadow: none; }
    }

    /* Global Visibility Utility */
    .hidden { display: none !important; }
    #in-game-hud.hidden, .hud.hidden { display: none !important; }
    
    /* Clean Minimal In-Game HUD: Coins, Distance & Pause button only */
    .hud { position: absolute; top: max(16px, env(safe-area-inset-top)); left: max(16px, env(safe-area-inset-left)); right: max(16px, env(safe-area-inset-right)); display: flex; justify-content: space-between; align-items: flex-start; pointer-events: none; z-index: 10; }
    .hud.hidden { display: none !important; }
    .hud-stats { display: flex; gap: 14px; }
    .score-card { background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(10px); border: 2px solid rgba(255, 255, 255, 0.22); padding: 10px 22px; border-radius: 16px; color: #fff; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3); }
    .score-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #94a3b8; font-weight: 800; }
    .score-number { font-size: 32px; font-weight: 900; line-height: 1.1; color: #38bdf8; }
    .coins-number { color: #facc15; }
    
    .hud-actions { pointer-events: auto; }
    .hud-circle-btn { width: 48px; height: 48px; border-radius: 14px; background: rgba(15, 23, 42, 0.85); border: 2px solid rgba(255, 255, 255, 0.25); color: #fff; font-size: 18px; font-weight: 900; cursor: pointer; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(8px); transition: transform 0.1s ease, filter 0.1s; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3); }
    .hud-circle-btn:hover { filter: brightness(1.2); transform: scale(1.05); }
    .hud-circle-btn:active { transform: scale(0.95); }

    /* Telemetry / Perf HUD */
    .perf-hud {
      position: absolute;
      top: max(16px, env(safe-area-inset-top));
      right: max(16px, env(safe-area-inset-right));
      width: 250px;
      background: rgba(15, 23, 42, 0.92);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 2px solid rgba(56, 189, 248, 0.35);
      border-radius: 14px;
      padding: 10px 12px;
      color: #f8fafc;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      z-index: 1000;
      pointer-events: auto;
      user-select: none;
    }
    .perf-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
    .perf-title { font-size: 11px; font-weight: 900; color: #38bdf8; letter-spacing: 0.05em; }
    .perf-actions { display: flex; gap: 4px; }
    .perf-btn { background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(255, 255, 255, 0.15); color: #cbd5e1; font-size: 10px; padding: 2px 6px; border-radius: 6px; cursor: pointer; }
    .perf-btn:hover { background: #38bdf8; color: #0f172a; }
    .perf-main-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .perf-fps-box { display: flex; flex-direction: column; }
    .perf-fps-num { font-size: 26px; font-weight: 900; line-height: 1; color: #4ade80; }
    .perf-fps-sub { font-size: 9px; color: #94a3b8; margin-top: 2px; }
    .perf-canvas { border-radius: 4px; border: 1px solid rgba(255, 255, 255, 0.1); }
    .perf-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 8px; font-size: 10px; margin-bottom: 6px; }
    .perf-stat { display: flex; justify-content: space-between; }
    .perf-k { color: #94a3b8; }
    .perf-v { font-weight: 700; color: #f8fafc; }
    .perf-breakdown { font-size: 9px; color: #a5b4fc; background: rgba(30, 41, 59, 0.5); padding: 4px 6px; border-radius: 6px; text-align: center; }

    /* Danger vignette at bottom when player crosses edge */
    #warning-vignette { position: absolute; inset: 0; pointer-events: none; z-index: 5; opacity: 0; background: linear-gradient(to top, rgba(239, 68, 68, 0.65) 0%, rgba(239, 68, 68, 0.2) 20%, transparent 45%); transition: opacity 0.15s ease-out; }

    .modal { position: absolute; inset: 0; background: rgba(15, 23, 42, 0.78); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 30; }
    .modal.hidden { display: none !important; }
    #perf-report-modal { z-index: 2000; }

    /* Modern Subway Surfers-style Main Menu HUD */
    .main-menu-overlay {
      position: absolute;
      inset: 0;
      width: 100%;
      max-width: 100%;
      background: transparent !important;
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
      pointer-events: auto;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 0 0 max(24px, env(safe-area-inset-bottom)) 0;
      z-index: 30;
      box-sizing: border-box;
      font-family: 'Fredoka', 'Lilita One', system-ui, -apple-system, sans-serif;
    }
    .main-menu-overlay.hidden {
      display: none !important;
    }

    /* Top Bar Status Pills */
    .menu-top-bar {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      padding: 24px 32px;
      padding-top: max(24px, env(safe-area-inset-top));
      padding-right: max(32px, env(safe-area-inset-right));
      padding-left: max(32px, env(safe-area-inset-left));
      pointer-events: none;
      position: relative;
      z-index: 10;
    }
    .menu-top-left {
      display: flex;
      align-items: center;
      gap: 12px;
      pointer-events: auto;
    }
    .menu-top-right {
      display: flex;
      align-items: center;
      pointer-events: auto;
    }
    .top-pill {
      pointer-events: auto;
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 140px;
      height: 76px;
      background: transparent;
      border: none;
      box-shadow: none;
      backdrop-filter: none;
      -webkit-backdrop-filter: none;
      border-radius: 0;
      padding: 0;
      cursor: pointer;
      transition: transform 0.12s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.12s ease;
      font-family: 'Fredoka', 'Lilita One', system-ui, sans-serif;
      user-select: none;
    }
    .top-pill:hover {
      transform: scale(1.05);
      filter: brightness(1.08);
    }
    .top-pill:active {
      transform: translateY(2px) scale(0.96);
    }
    .top-pill-bg-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      pointer-events: none;
      filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.3));
      display: block;
    }
    .top-pill-coins {
      cursor: pointer;
    }
    .top-pill-coins .top-pill-val {
      position: absolute;
      left: 31%;
      right: 27%;
      top: 50%;
      transform: translateY(-50%);
      text-align: center;
      font-size: 19px;
      font-weight: 900;
      color: #0f274a;
      font-variant-numeric: tabular-nums;
      line-height: 1;
      text-shadow: 0 1px 2px rgba(255, 255, 255, 0.85);
      letter-spacing: -0.01em;
      pointer-events: none;
    }
    .top-pill-plus {
      position: absolute;
      right: 2%;
      top: 50%;
      transform: translateY(-50%);
      width: 27%;
      height: 60%;
      border-radius: 50%;
      background: transparent;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0;
      color: transparent;
      padding: 0;
      line-height: 1;
      font-family: inherit;
      pointer-events: auto;
    }
    .top-pill-score {
      cursor: pointer;
    }
    .top-pill-score-text {
      position: absolute;
      left: 36%;
      right: 6%;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      pointer-events: none;
      gap: 1px;
    }
    .top-pill-score-title {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #334155;
      font-weight: 900;
      line-height: 1.1;
      text-shadow: 0 1px 1px rgba(255, 255, 255, 0.8);
    }
    .top-pill-score-line {
      font-size: 13px;
      font-weight: 900;
      color: #0f274a;
      line-height: 1.1;
      font-variant-numeric: tabular-nums;
      text-shadow: 0 1px 1px rgba(255, 255, 255, 0.8);
    }
    .top-pill-score-line strong {
      color: #d97706;
      font-weight: 900;
      text-shadow: 0 1px 1px rgba(255, 255, 255, 0.7);
    }
    .top-settings-btn {
      pointer-events: auto;
      width: 48px;
      height: 48px;
      background: transparent;
      border: none;
      box-shadow: none;
      backdrop-filter: none;
      -webkit-backdrop-filter: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: transform 0.12s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.12s ease;
      padding: 0;
    }
    .top-settings-btn:hover {
      transform: scale(1.06);
      filter: brightness(1.08);
    }
    .top-settings-btn:active {
      transform: translateY(2px) scale(0.96);
    }
    .top-settings-icon {
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
    }
    .top-settings-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.3));
      pointer-events: none;
    }

    /* Floating Side Badges */
    .menu-side-widgets {
      position: absolute;
      top: max(100px, calc(env(safe-area-inset-top) + 80px));
      left: max(32px, env(safe-area-inset-left));
      display: flex;
      gap: 16px;
      pointer-events: none;
      z-index: 6;
    }
    .floating-widgets-left,
    .floating-widget-left {
      display: flex;
      gap: 16px;
      pointer-events: none;
    }
    .floating-widget-btn {
      pointer-events: auto;
      background: none;
      border: none;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      transition: transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
      padding: 0;
      font-family: inherit;
    }
    .floating-widget-btn:hover {
      transform: scale(1.06);
    }
    .floating-widget-btn:active {
      transform: translateY(2px) scale(0.96);
    }
    .floating-widget-icon-box {
      width: 64px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      background: transparent;
      border: none;
      box-shadow: none;
      backdrop-filter: none;
      -webkit-backdrop-filter: none;
      transition: transform 0.15s ease, filter 0.15s ease;
      overflow: visible;
    }
    .floating-widget-icon-box.gift-box,
    .floating-widget-icon-box.quest-box {
      background: transparent;
      border: none;
      box-shadow: none;
      backdrop-filter: none;
    }
    .floating-widget-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.35));
      position: relative;
      z-index: 2;
      pointer-events: none;
      transition: transform 0.15s ease;
    }
    .floating-widget-btn:hover .floating-widget-img {
      transform: scale(1.08);
    }
    .floating-widget-alert-badge {
      position: absolute;
      top: -6px;
      right: -6px;
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: linear-gradient(135deg, #ff4d6d 0%, #ef4444 50%, #dc2626 100%);
      color: #ffffff;
      font-size: 14px;
      font-weight: 900;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2.5px solid #ffffff;
      box-shadow: 0 3px 8px rgba(239, 68, 68, 0.5), inset 0 1px 2px rgba(255, 255, 255, 0.8);
      z-index: 5;
    }
    .floating-widget-count-badge {
      position: absolute;
      top: -6px;
      right: -6px;
      padding: 0 7px;
      min-width: 26px;
      height: 26px;
      border-radius: 999px;
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #ea580c 100%);
      color: #ffffff;
      font-size: 11px;
      font-weight: 900;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2.5px solid #ffffff;
      box-shadow: 0 3px 8px rgba(245, 158, 11, 0.5), inset 0 1px 2px rgba(255, 255, 255, 0.8);
      z-index: 5;
    }
    .floating-widget-label {
      font-size: 13px;
      font-weight: 800;
      color: #ffffff;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8), 0 0 6px rgba(0, 0, 0, 0.8);
      letter-spacing: 0.02em;
      white-space: nowrap;
      pointer-events: none;
    }

    /* Bottom Hero Dock */
    .menu-bottom-dock {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      width: 100%;
      box-sizing: border-box;
      padding: 0 max(32px, env(safe-area-inset-right)) 0 max(32px, env(safe-area-inset-left));
      margin: 0;
      pointer-events: none;
      position: relative;
      z-index: 5;
    }
    .dock-col {
      display: flex;
      flex-direction: column;
      gap: 12px;
      align-items: center;
      pointer-events: auto;
    }
    .dock-col-left {
      align-self: flex-end;
    }
    .dock-col-right {
      align-self: flex-end;
      margin-left: auto;
    }
    .dock-btn {
      background: none;
      border: none;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
      padding: 0;
      transition: transform 0.12s cubic-bezier(0.34, 1.56, 0.64, 1);
      font-family: inherit;
    }
    .dock-btn:hover {
      transform: scale(1.04);
    }
    .dock-btn:active {
      transform: translateY(2px) scale(0.96);
    }
    .dock-btn-inner {
      width: 64px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      background: transparent;
      border: none;
      box-shadow: none;
      backdrop-filter: none;
      -webkit-backdrop-filter: none;
      transition: transform 0.12s ease, filter 0.12s ease;
      overflow: visible;
    }
    .dock-btn-teal .dock-btn-inner {
      background: transparent;
      border: none;
      box-shadow: none;
    }
    .dock-btn:hover .dock-btn-inner {
      transform: scale(1.06);
      filter: brightness(1.1);
    }
    .dock-btn:active .dock-btn-inner {
      transform: translateY(3px) scale(0.96);
      box-shadow: none;
    }
    .dock-btn-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.35));
      position: relative;
      z-index: 2;
      pointer-events: none;
      transition: transform 0.15s ease;
    }
    .dock-btn:hover .dock-btn-img {
      transform: scale(1.06);
    }
    .dock-badge {
      position: absolute;
      top: -5px;
      right: -5px;
      padding: 0 6px;
      min-width: 20px;
      height: 20px;
      border-radius: 999px;
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #ea580c 100%);
      color: #fff;
      font-size: 11px;
      font-weight: 900;
      border: 2px solid #fff;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 5;
    }
    .dock-btn-label {
      font-size: 13px;
      font-weight: 900;
      color: #ffffff;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8), 0 0 6px rgba(0, 0, 0, 0.8);
      letter-spacing: 0.02em;
      white-space: nowrap;
      pointer-events: none;
    }

    /* Tap to Play Central Prompt */
    .tap-to-play-prompt {
      position: absolute;
      bottom: max(32px, calc(env(safe-area-inset-bottom) + 32px));
      left: 50%;
      transform: translateX(-50%);
      pointer-events: none;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px 24px;
      background: rgba(15, 23, 42, 0.72);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1.5px solid rgba(255, 255, 255, 0.3);
      border-radius: 999px;
      color: #ffffff;
      font-family: 'Fredoka', 'Lilita One', system-ui, sans-serif;
      font-size: 15px;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      box-shadow: 0 6px 22px rgba(0, 0, 0, 0.4);
      animation: tapPromptPulse 2s ease-in-out infinite;
      white-space: nowrap;
    }
    @keyframes tapPromptPulse {
      0%, 100% {
        transform: translateX(-50%) scale(1);
        opacity: 0.88;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
      }
      50% {
        transform: translateX(-50%) scale(1.05);
        opacity: 1;
        box-shadow: 0 8px 26px rgba(56, 189, 248, 0.45);
        border-color: rgba(56, 189, 248, 0.65);
      }
    }

    .modal-card { background: #1e293b; border: 2px solid #334155; border-radius: 24px; padding: 36px 40px; text-align: center; color: #f8fafc; max-width: 460px; width: 90%; box-shadow: 0 24px 60px rgba(0, 0, 0, 0.6); position: relative; }
    .modal-card h1 { font-size: 36px; font-weight: 900; color: #38bdf8; margin-bottom: 6px; letter-spacing: -0.02em; text-shadow: 0 4px 12px rgba(56, 189, 248, 0.3); }
    .modal-card h2 { font-size: 26px; color: #f87171; margin-bottom: 8px; }
    .modal-card p { color: #cbd5e1; margin-bottom: 24px; font-size: 15px; line-height: 1.5; }
    
    .menu-stats-row { display: flex; justify-content: center; gap: 16px; margin: 18px 0 24px; }
    .menu-stat-pill { background: rgba(15, 23, 42, 0.6); border: 1.5px solid #334155; border-radius: 14px; padding: 8px 18px; min-width: 105px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
    .menu-stat-title { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #94a3b8; font-weight: 800; line-height: 1.2; margin-bottom: 2px; }
    .menu-stat-val, .menu-stat-pill strong { font-size: 24px; font-weight: 900; line-height: 1.1; color: #f8fafc; margin: 0; }
    .menu-stat-pill.gold strong, .menu-stat-pill.gold .menu-stat-val { color: #facc15; }
    
    .menu-btn-stack { display: flex; flex-direction: column; gap: 12px; }
    .menu-btn { width: 100%; border: none; padding: 15px 24px; font-size: 17px; font-weight: 800; border-radius: 14px; cursor: pointer; transition: transform 0.1s ease, filter 0.1s; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3); }
    .menu-btn:hover { filter: brightness(1.1); transform: translateY(-2px); }
    .menu-btn:active { transform: translateY(0); }
    .menu-btn-primary { background: linear-gradient(135deg, #10b981, #059669); color: #fff; font-size: 19px; }
    .menu-btn-emerald { background: linear-gradient(135deg, #059669, #0d9488); color: #fff; }
    .btn-badge { background: rgba(0, 0, 0, 0.35); padding: 2px 8px; border-radius: 999px; font-size: 13px; margin-left: 6px; font-weight: 800; border: 1px solid rgba(255, 255, 255, 0.2); }
    .menu-btn-amber { background: linear-gradient(135deg, #f59e0b, #ea580c); color: #fff; }
    .menu-btn-purple { background: linear-gradient(135deg, #8b5cf6, #6366f1); color: #fff; }
    .menu-btn-slate { background: linear-gradient(135deg, #475569, #334155); color: #f8fafc; }
    .menu-btn-secondary { background: #334155; color: #e2e8f0; }
    .menu-btn-danger { background: linear-gradient(135deg, #ef4444, #dc2626); color: #fff; }

    /* ===== НОВЫЙ ДИЗАЙН ГАЧА-АВТОМАТА (ПК 16:9 ПО РЕФЕРЕНСУ) ===== */
    .modal-card-gacha-pc {
      background: linear-gradient(180deg, rgba(20, 31, 53, 0.95) 0%, rgba(13, 20, 36, 0.98) 100%);
      border: 3px solid #f59e0b;
      border-radius: 30px;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      box-shadow:
        0 0 35px rgba(245, 158, 11, 0.45),
        inset 0 0 20px rgba(245, 158, 11, 0.2),
        0 25px 60px rgba(0, 0, 0, 0.85);
      max-width: 840px;
      width: 92%;
      padding: 28px 28px 24px;
      position: relative;
      color: #f8fafc;
      display: flex;
      flex-direction: column;
      align-items: center;
      user-select: none;
      overflow: visible;
    }
    .modal-card-gacha-pc::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 27px;
      background: radial-gradient(ellipse at 20% 0%, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.02) 45%, transparent 70%);
      pointer-events: none;
      z-index: 1;
    }

    /* Верхний левый блок: плашка баланса монет на одном уровне с кнопкой закрытия */
    .gacha-top-left-group, .gacha-coin-capsule-wrap {
      position: absolute;
      top: 16px;
      left: 24px;
      display: flex;
      align-items: center;
      height: 44px;
      z-index: 25;
    }

    /* Верхний правый блок: кнопка закрытия и подсказка ESC */
    .gacha-top-right-group, .gacha-top-bar {
      position: absolute;
      top: 16px;
      right: 24px;
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 6px;
      height: 44px;
      z-index: 25;
    }
    .gacha-close-box {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .gacha-close-btn-3d {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: transparent;
      border: none;
      padding: 0;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.6));
      transition: transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.15s ease;
      outline: none;
    }
    .gacha-close-btn-3d:hover {
      transform: scale(1.12);
      filter: brightness(1.12) drop-shadow(0 6px 14px rgba(239, 68, 68, 0.5));
    }
    .gacha-close-btn-3d:active {
      transform: scale(0.92);
    }
    .gacha-close-btn-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .gacha-esc-hint {
      font-family: 'Fredoka', 'Lilita One', system-ui, sans-serif;
      font-size: 11px;
      font-weight: 800;
      color: #94a3b8;
      letter-spacing: 0.05em;
      background: rgba(15, 23, 42, 0.75);
      padding: 2px 6px;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.15);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
    }
    .gacha-coin-capsule {
      background: linear-gradient(180deg, rgba(20, 31, 53, 0.95) 0%, rgba(13, 20, 36, 0.98) 100%);
      border: 2px solid #f59e0b;
      border-radius: 999px;
      padding: 5px 14px 5px 16px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      box-shadow: 0 0 16px rgba(245, 158, 11, 0.35), inset 0 1px 2px rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(8px);
      font-family: 'Fredoka', 'Lilita One', system-ui, sans-serif;
    }
    .gacha-coin-capsule .gacha-coin-val {
      font-size: 19px;
      font-weight: 900;
      color: #facc15;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
    }
    .gacha-coin-capsule .gacha-coin-label {
      font-size: 11px;
      font-weight: 900;
      color: #fde68a;
      letter-spacing: 0.06em;
    }
    .gacha-coin-capsule .gacha-coin-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .gacha-coin-icon-img {
      width: 22px;
      height: 22px;
      object-fit: contain;
      vertical-align: middle;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
    }
    /* Legacy aliases for backward compatibility */
    .gacha-coin-pill { display: none; }
    .gacha-close-btn { display: none; }

    /* 3D Заголовок PRIZE MACHINE (середина на верхней золотой границе) */
    .gacha-header-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: -72px;
      margin-bottom: 14px;
      position: relative;
      z-index: 15;
      pointer-events: none;
    }
    .gacha-3d-title-img {
      height: 98px;
      max-width: 460px;
      width: auto;
      object-fit: contain;
      filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.85)) drop-shadow(0 0 30px rgba(245, 158, 11, 0.55));
    }

    /* Шасси барабана (глубокая темная ниша с фаской) */
    .gacha-viewport {
      position: relative;
      width: 100%;
      height: 220px;
      background: radial-gradient(ellipse at 50% 50%, #0d162a 0%, #060912 100%);
      border: 3px solid #1e293b;
      border-top-color: #334155;
      border-bottom-color: #0b1120;
      border-radius: 22px;
      overflow: hidden;
      margin-bottom: 20px;
      box-shadow:
        inset 0 8px 24px rgba(0, 0, 0, 0.85),
        inset 0 0 12px rgba(0, 0, 0, 0.9),
        0 4px 12px rgba(0, 0, 0, 0.5);
      -webkit-mask-image: linear-gradient(to right, transparent, black 12%, black 88%, transparent);
      mask-image: linear-gradient(to right, transparent, black 12%, black 88%, transparent);
      z-index: 5;
    }
    .gacha-pointer {
      position: absolute;
      top: -6px;
      left: 50%;
      transform: translateX(-50%);
      width: 44px;
      height: 48px;
      z-index: 20;
      pointer-events: none;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: pointerFloat 1.4s ease-in-out infinite alternate;
    }
    .gacha-pointer-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      filter: drop-shadow(0 0 12px rgba(250, 204, 21, 0.95)) drop-shadow(0 6px 8px rgba(0, 0, 0, 0.8));
    }
    @keyframes pointerFloat {
      0% { transform: translateX(-50%) translateY(0); filter: drop-shadow(0 0 8px rgba(250, 204, 21, 0.8)); }
      100% { transform: translateX(-50%) translateY(4px); filter: drop-shadow(0 0 18px rgba(250, 204, 21, 1)); }
    }
    .gacha-guide-line {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 50%;
      width: 2px;
      background: linear-gradient(180deg, rgba(250, 204, 21, 0.6) 0%, rgba(250, 204, 21, 0.05) 100%);
      transform: translateX(-50%);
      z-index: 10;
      pointer-events: none;
    }
    .gacha-reel-track {
      position: absolute;
      top: 14px;
      left: 0;
      display: flex;
      gap: 14px;
      will-change: transform;
      padding: 0 40px;
    }
    .gacha-roulette-card {
      flex: 0 0 150px;
      width: 150px;
      height: 190px;
      background: #111c33;
      border: 2px solid #334155;
      border-radius: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      padding: 10px 8px 8px;
      box-sizing: border-box;
      flex-shrink: 0;
      transition: transform 0.25s ease, border-color 0.25s, box-shadow 0.25s;
      position: relative;
    }
    .gacha-roulette-card.glow-common {
      border-color: #64748b;
      box-shadow: 0 0 12px rgba(148, 163, 184, 0.35), inset 0 0 8px rgba(148, 163, 184, 0.12);
    }
    .gacha-roulette-card.glow-rare {
      border-color: #0284c7;
      box-shadow: 0 0 14px rgba(56, 189, 248, 0.45), inset 0 0 10px rgba(56, 189, 248, 0.18);
    }
    .gacha-roulette-card.glow-epic {
      border-color: #9333ea;
      box-shadow: 0 0 16px rgba(192, 132, 252, 0.55), inset 0 0 12px rgba(192, 132, 252, 0.22);
    }
    .gacha-roulette-card.glow-legendary {
      border-color: #f59e0b;
      box-shadow: 0 0 20px rgba(251, 191, 36, 0.65), inset 0 0 14px rgba(251, 191, 36, 0.25);
    }
    .gacha-roulette-card.winning-card {
      border-color: #fbbf24;
      box-shadow: 0 0 25px rgba(251, 191, 36, 0.8), inset 0 0 15px rgba(251, 191, 36, 0.3);
      transform: scale(1.06);
      z-index: 12;
      background: #192747;
    }
    .card-silhouette {
      opacity: 0.95;
      transition: opacity 0.45s ease, transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .card-silhouette .gacha-card-char-img,
    .card-silhouette svg {
      filter: brightness(0) drop-shadow(0 0 10px var(--rarity-glow, rgba(255, 255, 255, 0.7)));
    }
    .gacha-card-character.reveal-pop {
      animation: cardRevealPop 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }
    @keyframes cardRevealPop {
      0% { transform: scale(0.85); filter: brightness(2.2) drop-shadow(0 0 22px #fbbf24); }
      50% { transform: scale(1.18); filter: brightness(1.3) drop-shadow(0 0 26px #fbbf24); }
      100% { transform: scale(1.0); filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.55)); }
    }
    .gacha-card-name.name-revealed {
      animation: nameShine 0.5s ease-out forwards;
      color: #fde047;
      border-color: rgba(250, 204, 21, 0.5);
      box-shadow: 0 0 12px rgba(250, 204, 21, 0.4);
    }
    @keyframes nameShine {
      0% { transform: scale(0.8); opacity: 0; }
      100% { transform: scale(1.0); opacity: 1; }
    }
    .gacha-all-unlocked-banner {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      height: 100%;
      color: #fbbf24;
      font-size: 20px;
      font-weight: 900;
      letter-spacing: 0.08em;
      text-shadow: 0 2px 10px rgba(251, 191, 36, 0.6);
      z-index: 15;
    }
    .gacha-all-unlocked-sub {
      font-size: 13px;
      font-weight: 700;
      color: #94a3b8;
      letter-spacing: 0.04em;
    }
    .gacha-spin-btn.all-collected-btn {
      filter: grayscale(0.5) brightness(0.85);
      cursor: not-allowed;
    }
    .gacha-card-name {
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.06em;
      color: #f1f5f9;
      background: rgba(15, 23, 42, 0.7);
      padding: 3px 10px;
      border-radius: 999px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      max-width: 90%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .gacha-card-character {
      width: 100px;
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 4px 0;
      position: relative;
    }
    .gacha-card-char-img,
    .gacha-card-character svg {
      width: 100%;
      height: 100%;
      object-fit: contain;
      background: transparent;
      filter: drop-shadow(0 6px 10px rgba(0, 0, 0, 0.5));
      transition: filter 0.45s ease, transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
      user-select: none;
      -webkit-user-drag: none;
      pointer-events: none;
    }
    .gacha-card-rarity {
      width: 92%;
      text-align: center;
      font-size: 10px;
      font-weight: 900;
      letter-spacing: 0.08em;
      padding: 3px 0;
      border-radius: 8px;
      text-transform: uppercase;
    }

    .gacha-win-fx {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 220px;
      height: 220px;
      pointer-events: none;
      z-index: 11;
    }
    .gacha-sunburst {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(250, 204, 21, 0.45) 0%, rgba(250, 204, 21, 0.1) 45%, transparent 70%);
      animation: sunburstRotate 8s linear infinite;
    }
    @keyframes sunburstRotate {
      0% { transform: rotate(0deg) scale(0.9); }
      50% { transform: rotate(180deg) scale(1.15); }
      100% { transform: rotate(360deg) scale(0.9); }
    }

    .gacha-duplicate-stamp {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-8deg);
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%);
      border: 3.5px dashed #fecaca;
      border-radius: 16px;
      padding: 10px 24px;
      text-align: center;
      z-index: 45;
      color: #ffffff;
      font-weight: 900;
      font-size: 22px;
      letter-spacing: 0.06em;
      box-shadow: 0 8px 30px rgba(220, 38, 38, 0.85), inset 0 2px 6px rgba(255, 255, 255, 0.35);
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
      pointer-events: none;
      animation: stampPop 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }
    .gacha-stamp-sub {
      font-size: 14px;
      font-weight: 900;
      color: #facc15;
      margin-top: 4px;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);
      letter-spacing: 0.04em;
    }
    @keyframes stampPop {
      0% { transform: translate(-50%, -50%) rotate(-25deg) scale(2.4); opacity: 0; }
      100% { transform: translate(-50%, -50%) rotate(-8deg) scale(1); opacity: 1; }
    }

    .gacha-cashback-flyer {
      position: absolute;
      top: 50%;
      left: 50%;
      font-size: 26px;
      font-weight: 900;
      color: #facc15;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.85), 0 0 14px rgba(250, 204, 21, 0.6);
      z-index: 50;
      pointer-events: none;
    }
    .gacha-cashback-flyer.fly-anim {
      animation: flyerMove 1.1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
    }
    @keyframes flyerMove {
      0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
      50% { transform: translate(120px, -90px) scale(1.35); opacity: 1; }
      100% { transform: translate(250px, -150px) scale(0.6); opacity: 0; }
    }

    .gacha-confetti-piece {
      animation: confettiExplode 1.2s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
    }
    @keyframes confettiExplode {
      0% { transform: translate(-50%, -50%) translate(0, 0) rotate(0deg); opacity: 1; }
      80% { opacity: 1; }
      100% { transform: translate(-50%, -50%) translate(var(--dx), var(--dy)) rotate(var(--rot)); opacity: 0; }
    }

    /* Нижняя зона: 3D кнопка SPIN */
    .gacha-action-bar {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      z-index: 10;
    }
    .gacha-spin-btn {
      position: relative;
      width: 270px;
      height: 128px;
      background: url('${GACHA_ICONS.spin}') center center / contain no-repeat;
      border: none;
      border-radius: 28px;
      padding: 0;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      filter: drop-shadow(0 8px 20px rgba(0, 0, 0, 0.65));
      transition: transform 0.12s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.12s ease;
      outline: none;
      box-sizing: border-box;
    }
    .gacha-spin-btn:hover:not(:disabled) {
      transform: scale(1.05);
      filter: brightness(1.08) drop-shadow(0 12px 28px rgba(245, 158, 11, 0.55));
    }
    .gacha-spin-btn:active:not(:disabled) {
      transform: scale(0.97) translateY(2px);
      filter: brightness(0.98);
    }
    .gacha-spin-btn:disabled {
      opacity: 0.85;
      cursor: not-allowed;
      filter: grayscale(0.25) brightness(0.9);
    }
    .gacha-spin-btn.shake-error {
      animation: shakeBtn 0.4s ease-in-out;
    }
    @keyframes shakeBtn {
      0%, 100% { transform: translateX(0); }
      20%, 60% { transform: translateX(-8px); }
      40%, 80% { transform: translateX(8px); }
    }
    .gacha-spin-content {
      position: absolute;
      top: 10px;
      left: 14px;
      right: 14px;
      height: 72px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 3px;
      pointer-events: none;
      z-index: 2;
    }
    .gacha-spin-main {
      font-family: 'Lilita One', 'Fredoka', system-ui, sans-serif;
      font-size: 24px;
      font-weight: 900;
      line-height: 1;
      letter-spacing: 0.06em;
      color: #451a03;
      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.8), 0 2px 3px rgba(0, 0, 0, 0.35);
    }
    .gacha-spin-price {
      font-family: 'Fredoka', 'Lilita One', system-ui, sans-serif;
      font-size: 16px;
      font-weight: 900;
      line-height: 1.1;
      color: #451a03;
      letter-spacing: 0.04em;
      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.8), 0 2px 3px rgba(0, 0, 0, 0.25);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
    }
    .gacha-btn-coin-img {
      width: 18px;
      height: 18px;
      object-fit: contain;
      vertical-align: middle;
      filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.35));
    }

    .gacha-spin-btn.select-character-btn {
      filter: drop-shadow(0 0 22px rgba(245, 158, 11, 0.8)) brightness(1.05);
      animation: pulseWinBtn 1.2s ease-in-out infinite alternate;
    }
    @keyframes pulseWinBtn {
      0% { filter: drop-shadow(0 0 12px rgba(245, 158, 11, 0.6)); }
      100% { filter: drop-shadow(0 0 26px rgba(245, 158, 11, 0.95)) brightness(1.08); }
    }
    .gacha-spin-btn.select-character-btn .gacha-spin-main {
      color: #451a03;
      font-size: 22px;
    }
    .gacha-spin-btn.select-character-btn .gacha-spin-price {
      color: #451a03;
      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.8), 0 2px 3px rgba(0, 0, 0, 0.25);
    }
    .gacha-space-hint {
      margin-top: 10px;
      font-family: 'Fredoka', 'Lilita One', system-ui, sans-serif;
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 0.08em;
      color: #facc15;
      text-shadow: 0 0 12px rgba(250, 204, 21, 0.75), 0 2px 4px rgba(0, 0, 0, 0.8);
      animation: spaceHintGlow 1.6s ease-in-out infinite alternate;
    }
    @keyframes spaceHintGlow {
      0% { opacity: 0.75; transform: scale(0.98); }
      100% { opacity: 1; transform: scale(1.02); text-shadow: 0 0 18px rgba(250, 204, 21, 1), 0 2px 6px rgba(0, 0, 0, 0.9); }
    }
    .gacha-skin-card { background: #0f172a; border: 2px solid #334155; border-radius: 14px; padding: 12px 10px; text-align: center; cursor: pointer; transition: all 0.15s ease; position: relative; overflow: hidden; }
    .gacha-skin-card:hover:not(.locked) { border-color: #38bdf8; transform: translateY(-2px); }
    .gacha-skin-card.active { border-color: #38bdf8; background: rgba(56, 189, 248, 0.12); box-shadow: 0 0 14px rgba(56, 189, 248, 0.3); }
    .gacha-skin-card.locked { opacity: 0.48; cursor: not-allowed; }
    .gacha-skin-badge { font-size: 32px; margin: 4px 0; }
    .gacha-skin-name { font-size: 13px; font-weight: 700; color: #f8fafc; }
    .gacha-skin-tag { font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-top: 4px; }
    .gacha-skin-card.active .gacha-skin-tag { color: #38bdf8; }
    .rarity-badge { display: inline-block; font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.06em; padding: 2px 8px; border-radius: 999px; margin-bottom: 4px; }
    .rarity-common { background: rgba(148, 163, 184, 0.2); color: #cbd5e1; border: 1px solid #64748b; }
    .rarity-rare { background: rgba(56, 189, 248, 0.2); color: #38bdf8; border: 1px solid #0284c7; }
    .rarity-epic { background: rgba(192, 132, 252, 0.22); color: #c084fc; border: 1px solid #9333ea; box-shadow: 0 0 8px rgba(168, 85, 247, 0.3); }
    .rarity-legendary { background: linear-gradient(135deg, rgba(251, 191, 36, 0.3), rgba(234, 88, 12, 0.3)); color: #fbbf24; border: 1px solid #f59e0b; box-shadow: 0 0 10px rgba(245, 158, 11, 0.4); }

    /* ========================================================================== */
    /* SKINS COLLECTION MODAL (PC / Mobile Glassmorphism by Reference)            */
    /* ========================================================================== */

    .modal-card-skins-pc {
      background: linear-gradient(180deg, rgba(20, 31, 53, 0.95) 0%, rgba(13, 20, 36, 0.98) 100%);
      border: 3px solid #f59e0b;
      border-radius: 30px;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      box-shadow:
        0 0 35px rgba(245, 158, 11, 0.45),
        inset 0 0 20px rgba(245, 158, 11, 0.2),
        0 25px 60px rgba(0, 0, 0, 0.85);
      max-width: 860px;
      width: 92%;
      padding: 32px 24px 24px;
      position: relative;
      color: #f8fafc;
      display: flex;
      flex-direction: column;
      align-items: center;
      user-select: none;
      overflow: visible;
    }
    .modal-card-skins-pc::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 27px;
      background: radial-gradient(ellipse at 20% 0%, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.02) 45%, transparent 70%);
      pointer-events: none;
      z-index: 1;
    }

    /* Верхний левый блок: плашка баланса монет */
    .skins-top-left-group, .skins-coin-capsule-wrap {
      position: absolute;
      top: 16px;
      left: 24px;
      display: flex;
      align-items: center;
      height: 44px;
      z-index: 25;
    }

    /* Верхний правый блок: кнопка закрытия и подсказка ESC */
    .skins-top-right-group, .skins-top-bar {
      position: absolute;
      top: 16px;
      right: 24px;
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 6px;
      height: 44px;
      z-index: 25;
    }
    .skins-close-box {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .skins-close-btn-3d {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: transparent;
      border: none;
      padding: 0;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.6));
      transition: transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.15s ease;
      outline: none;
    }
    .skins-close-btn-3d:hover {
      transform: scale(1.12);
      filter: brightness(1.12) drop-shadow(0 6px 14px rgba(239, 68, 68, 0.5));
    }
    .skins-close-btn-3d:active {
      transform: scale(0.92);
    }
    .skins-close-btn-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .skins-esc-hint {
      font-family: 'Fredoka', 'Lilita One', system-ui, sans-serif;
      font-size: 11px;
      font-weight: 800;
      color: #94a3b8;
      letter-spacing: 0.05em;
      background: rgba(15, 23, 42, 0.75);
      padding: 2px 6px;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.15);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
    }
    .skins-coin-capsule {
      background: linear-gradient(180deg, rgba(20, 31, 53, 0.95) 0%, rgba(13, 20, 36, 0.98) 100%);
      border: 2px solid #f59e0b;
      border-radius: 999px;
      padding: 5px 14px 5px 16px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      box-shadow: 0 0 16px rgba(245, 158, 11, 0.35), inset 0 1px 2px rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(8px);
      font-family: 'Fredoka', 'Lilita One', system-ui, sans-serif;
    }
    .skins-coin-capsule .skins-coin-val {
      font-size: 19px;
      font-weight: 900;
      color: #facc15;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
    }
    .skins-coin-capsule .skins-coin-label {
      font-size: 11px;
      font-weight: 900;
      color: #fde68a;
      letter-spacing: 0.06em;
    }
    .skins-coin-capsule .skins-coin-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .skins-coin-icon-img {
      width: 22px;
      height: 22px;
      object-fit: contain;
      vertical-align: middle;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
    }

    /* 3D Заголовок SKINS (середина на верхней золотой границе) */
    .skins-header-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: -72px;
      margin-bottom: 6px;
      position: relative;
      z-index: 15;
      pointer-events: none;
    }
    .skins-3d-title-img {
      height: 98px;
      max-width: 440px;
      width: auto;
      object-fit: contain;
      filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.85)) drop-shadow(0 0 30px rgba(245, 158, 11, 0.55));
    }

    /* Сетка карточек персонажей */
    .skins-cards-grid {
      display: flex;
      gap: 14px;
      justify-content: center;
      width: 100%;
      margin-top: 24px;
      flex-wrap: wrap;
      z-index: 5;
      position: relative;
    }

    /* Карточка персонажа */
    .skin-card {
      --rarity-color: #94a3b8;
      --rarity-glow: rgba(148, 163, 184, 0.4);
      width: 146px;
      min-height: 236px;
      background: rgba(15, 23, 42, 0.75);
      border: 2px solid var(--rarity-color);
      border-radius: 18px;
      padding: 10px 8px 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      position: relative;
      overflow: hidden;
      box-shadow:
        0 4px 16px rgba(0, 0, 0, 0.4),
        0 0 16px var(--rarity-glow),
        inset 0 1px 2px rgba(255, 255, 255, 0.08);
      transition: transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.18s ease, border-color 0.18s ease;
      cursor: pointer;
      user-select: none;
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
    }
    .skin-card:hover:not(.locked) {
      transform: translateY(-4px) scale(1.02);
      box-shadow:
        0 8px 24px rgba(0, 0, 0, 0.5),
        0 0 24px var(--rarity-glow),
        inset 0 1px 4px rgba(255, 255, 255, 0.15);
    }
    .skin-card.active {
      border-color: #4ade80;
      box-shadow:
        0 0 25px rgba(74, 222, 128, 0.55),
        inset 0 0 14px rgba(74, 222, 128, 0.25),
        0 8px 24px rgba(0, 0, 0, 0.6);
      transform: translateY(-2px);
    }
    .skin-card.locked {
      opacity: 0.88;
      cursor: pointer;
    }
    .skin-card.locked:hover {
      transform: translateY(-2px);
      box-shadow:
        0 6px 20px rgba(0, 0, 0, 0.5),
        0 0 18px var(--rarity-glow);
    }

    /* Рамки и свечение по редкостям */
    .skin-card.rarity-common {
      --rarity-color: #94a3b8;
      --rarity-glow: rgba(148, 163, 184, 0.4);
    }
    .skin-card.rarity-rare {
      --rarity-color: #38bdf8;
      --rarity-glow: rgba(56, 189, 248, 0.45);
    }
    .skin-card.rarity-epic {
      --rarity-color: #c084fc;
      --rarity-glow: rgba(192, 132, 252, 0.5);
    }
    .skin-card.rarity-legendary {
      --rarity-color: #fbbf24;
      --rarity-glow: rgba(251, 191, 36, 0.55);
    }

    /* Плашка редкости внутри карточки */
    .skin-card-rarity {
      font-family: 'Fredoka', 'Lilita One', system-ui, sans-serif;
      font-size: 9px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      padding: 2px 8px;
      border-radius: 999px;
      color: #ffffff;
      background: var(--rarity-color);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
      margin-bottom: 2px;
      z-index: 2;
    }

    /* Превью персонажа */
    .skin-card-preview {
      width: 110px;
      height: 110px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      margin: 2px 0 6px;
    }
    .skin-card-char-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.65));
      transition: filter 0.2s ease, transform 0.2s ease;
      pointer-events: none;
    }

    /* Силуэт закрытого скина с неоновым контуром редкости */
    .skin-card.locked .skin-card-char-img,
    .skin-card.skin-card-silhouette .skin-card-char-img {
      filter: brightness(0) drop-shadow(0 0 10px var(--rarity-glow));
    }

    /* Имя персонажа */
    .skin-card-name {
      font-family: 'Fredoka', 'Lilita One', system-ui, sans-serif;
      font-size: 13px;
      font-weight: 800;
      color: #f8fafc;
      text-align: center;
      line-height: 1.2;
      margin-bottom: 8px;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
      z-index: 2;
    }
    .skin-card.locked .skin-card-name {
      color: #94a3b8;
    }

    /* 3D Кнопки действия в карточке */
    .skin-card-btn {
      width: 110px;
      height: 42px;
      border: none;
      background: transparent;
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      padding: 0 4px 6px; /* смещение контента вверх */
      margin: 0 auto;
      outline: none;
      border-radius: 12px;
      filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.5));
      transition: transform 0.12s ease, filter 0.12s ease;
      user-select: none;
      z-index: 3;
    }
    .skin-card-btn:hover {
      transform: scale(1.05);
      filter: brightness(1.1) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.6));
    }
    .skin-card-btn:active {
      transform: scale(0.96);
    }
    .skin-card-btn.btn-active {
      background-image: url('${SKINS_MENU_ICONS.btnGreen}');
    }
    .skin-card-btn.btn-select {
      background-image: url('${SKINS_MENU_ICONS.btnGold}');
    }
    .skin-card-btn.btn-locked {
      background: linear-gradient(180deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%);
      border: 1.5px solid rgba(245, 158, 11, 0.5);
      box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.1), 0 2px 6px rgba(0, 0, 0, 0.4);
    }

    .skin-card-btn-text {
      font-family: 'Fredoka', 'Lilita One', system-ui, sans-serif;
      font-size: 12px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #ffffff;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8), 0 0 2px rgba(0, 0, 0, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      pointer-events: none;
      transform: translateY(-3px);
    }
    .skin-card-btn.btn-active .skin-card-btn-text {
      color: #ffffff;
      text-shadow: 0 2px 4px rgba(20, 83, 45, 0.9), 0 0 3px rgba(0, 0, 0, 0.9);
    }
    .skin-card-btn.btn-select .skin-card-btn-text {
      color: #ffffff;
      text-shadow: 0 2px 4px rgba(120, 53, 15, 0.9), 0 0 3px rgba(0, 0, 0, 0.9);
    }
    .skin-card-btn.btn-locked .skin-card-btn-text {
      color: #fde68a;
      font-size: 11px;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
    }
    .skin-card-btn-lock-img {
      width: 15px;
      height: 15px;
      object-fit: contain;
      filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.6));
      vertical-align: middle;
    }

    /* Вкладки разделов меню: Персонажи / Миры */
    .skins-tabs-nav {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin: 6px 0 14px;
      z-index: 10;
    }
    .skins-tab-btn {
      font-family: 'Fredoka', 'Lilita One', system-ui, sans-serif;
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 0.06em;
      color: #94a3b8;
      background: rgba(15, 23, 42, 0.75);
      border: 2px solid rgba(148, 163, 184, 0.3);
      border-radius: 20px;
      padding: 6px 18px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.15s ease;
      user-select: none;
      outline: none;
    }
    .skins-tab-btn:hover {
      color: #f8fafc;
      border-color: rgba(245, 158, 11, 0.6);
      transform: translateY(-1px);
    }
    .skins-tab-btn.active {
      color: #ffffff;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
      background: linear-gradient(180deg, #f59e0b 0%, #d97706 100%);
      border-color: #fbbf24;
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.45);
    }
    .skins-tab-content {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .skins-tab-content.hidden {
      display: none !important;
    }

    /* Навигационная подсказка для ПК */
    .skins-nav-hint {
      margin-top: 18px;
      font-family: 'Fredoka', 'Lilita One', system-ui, sans-serif;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.08em;
      color: #facc15;
      text-shadow: 0 0 12px rgba(250, 204, 21, 0.75), 0 2px 4px rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      z-index: 5;
      position: relative;
    }
    .skins-key-badge {
      background: rgba(15, 23, 42, 0.8);
      border: 1px solid rgba(250, 204, 21, 0.4);
      color: #fef08a;
      padding: 2px 6px;
      border-radius: 6px;
      font-size: 11px;
    }

    /* Daily Bonus Modal & 7-Day Grid */
    #daily-bonus-modal { z-index: 50; }
    #daily-bonus-modal .modal-card-daily { z-index: 51; }
    #daily-quests-modal { z-index: 48; }
    .menu-btn-gold { background: linear-gradient(135deg, #f59e0b, #d97706); color: #fff; }
    .btn-badge.pulse-badge { background: #10b981; color: #fff; border-color: #34d399; animation: badgePulse 1.4s infinite; }
    .floating-widget-alert-badge.pulse-badge { animation: badgePulse 1.4s infinite; }
    .btn-badge.hidden { display: none !important; }
    @keyframes badgePulse { 0% { transform: scale(1); box-shadow: 0 3px 8px rgba(239, 68, 68, 0.5); } 50% { transform: scale(1.12); box-shadow: 0 0 12px rgba(239, 68, 68, 0.7), 0 4px 10px rgba(239, 68, 68, 0.6); } 100% { transform: scale(1); box-shadow: 0 3px 8px rgba(239, 68, 68, 0.5); } }
    @keyframes pulse { 0%, 100% { transform: scale(1); box-shadow: 0 3px 8px rgba(245, 158, 11, 0.5); } 50% { transform: scale(1.12); box-shadow: 0 0 10px rgba(245, 158, 11, 0.7), 0 4px 10px rgba(245, 158, 11, 0.6); } }
    #menu-daily-quests-badge { background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #ea580c 100%); color: #ffffff; font-weight: 900; border: 2.5px solid #ffffff; box-shadow: 0 3px 8px rgba(245, 158, 11, 0.5), inset 0 1px 2px rgba(255, 255, 255, 0.8); animation: pulse 1.5s infinite; }

    .modal-card-daily { max-height: 90vh; overflow-y: auto; padding: 28px 24px; -webkit-overflow-scrolling: touch; }
    .daily-streak-pill { display: inline-flex; align-items: center; justify-content: center; gap: 6px; background: rgba(245, 158, 11, 0.15); border: 1.5px solid rgba(245, 158, 11, 0.4); color: #fbbf24; padding: 6px 16px; border-radius: 999px; font-weight: 800; font-size: 13px; margin: 0 auto 16px; }
    .daily-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 16px; }
    .daily-card { background: #0f172a; border: 2px solid #334155; border-radius: 14px; padding: 12px 8px; text-align: center; position: relative; transition: all 0.2s ease; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .daily-card-mega { grid-column: span 3; background: linear-gradient(135deg, rgba(245, 158, 11, 0.18), rgba(234, 88, 12, 0.12)); border-color: #f59e0b; flex-direction: row; justify-content: space-between; padding: 14px 20px; }
    .daily-card.claimed { opacity: 0.65; border-color: #10b981; background: rgba(16, 185, 129, 0.08); }
    .daily-card.available { border-color: #fbbf24; background: rgba(251, 191, 36, 0.15); box-shadow: 0 0 16px rgba(245, 158, 11, 0.35); animation: availableFloat 2s ease-in-out infinite; }
    @keyframes availableFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
    .daily-card.locked { opacity: 0.45; }
    .daily-card-day { font-size: 11px; font-weight: 800; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.05em; margin-bottom: 4px; }
    .daily-card.available .daily-card-day { color: #fbbf24; }
    .daily-card-icon { font-size: 26px; margin: 4px 0; }
    .daily-card-mega .daily-card-icon { font-size: 32px; }
    .daily-card-reward { font-size: 14px; font-weight: 900; color: #facc15; }
    .daily-card-status { font-size: 10px; font-weight: 800; margin-top: 6px; padding: 2px 6px; border-radius: 999px; text-transform: uppercase; }
    .daily-card.claimed .daily-card-status { background: rgba(16, 185, 129, 0.2); color: #34d399; }
    .daily-card.available .daily-card-status { background: #f59e0b; color: #000; }
    .daily-card.locked .daily-card-status { color: #64748b; }
    .daily-timer-box { background: #0f172a; border: 1.5px solid #334155; border-radius: 12px; padding: 10px 14px; color: #94a3b8; font-size: 13px; font-weight: 700; margin-bottom: 16px; }
    .daily-timer-box strong { color: #38bdf8; font-variant-numeric: tabular-nums; }
    .daily-timer-box.hidden { display: none !important; }

    .modal-card-leaderboard { max-height: 85vh; display: flex; flex-direction: column; overflow: hidden; }
    #leaderboard-modal h2 { font-size: clamp(18px, 4vw, 28px); }
    .lb-name-form { display: flex; gap: 8px; margin-bottom: 12px; flex-shrink: 0; }
    .lb-name-input { flex: 1; background: #0f172a; border: 2px solid #334155; border-radius: 12px; padding: 10px 14px; color: #f8fafc; font-size: 14px; font-weight: 700; outline: none; }
    .lb-name-input:focus { border-color: #38bdf8; }
    .lb-save-btn { background: linear-gradient(135deg, #38bdf8, #0284c7); border: none; border-radius: 12px; padding: 0 16px; color: #fff; font-weight: 800; font-size: 13px; cursor: pointer; flex-shrink: 0; }
    .leaderboard-preview-box { background: #0f172a; border: 2px solid #334155; border-radius: 16px; padding: 14px; margin: 12px 0 18px; text-align: left; max-height: 240px; overflow-y: auto; flex: 1 1 auto; min-height: 100px; -webkit-overflow-scrolling: touch; }
    .lb-row { display: grid; grid-template-columns: 85px 1fr 95px; align-items: center; gap: 8px; padding: 8px 10px; border-bottom: 1px solid #1e293b; font-size: 13px; color: #cbd5e1; font-weight: 600; }
    .lb-row.header { color: #64748b; font-size: 11px; text-transform: uppercase; font-weight: 800; border-bottom: 2px solid #334155; }
    .lb-row.current-player { color: #38bdf8; background: rgba(56, 189, 248, 0.12); border-radius: 8px; font-weight: 800; }
    .lb-col-rank { text-align: left; }
    .lb-col-player { text-align: center; color: #f8fafc; font-weight: 700; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; }
    .lb-col-score { text-align: right; font-variant-numeric: tabular-nums; }
    .placeholder-badge { display: inline-block; background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4); padding: 3px 10px; border-radius: 999px; font-size: 11px; font-weight: 800; margin-bottom: 8px; }

    /* Achievements Modal & Cards */
    .modal-card-achievements { max-height: 88vh; display: flex; flex-direction: column; overflow: hidden; padding: 26px 22px; }
    .ach-desc-main { color: #cbd5e1; margin-bottom: 12px; font-size: 14px; }
    .ach-summary-card { background: #0f172a; border: 2px solid #334155; border-radius: 16px; padding: 12px 16px; margin-bottom: 12px; text-align: left; }
    .ach-summary-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 12px; font-weight: 800; color: #94a3b8; }
    .ach-summary-header strong { color: #facc15; font-size: 14px; }
    .ach-progress-bar-bg { width: 100%; height: 10px; background: #1e293b; border-radius: 999px; overflow: hidden; }
    .ach-progress-bar-bg.small { height: 6px; flex: 1; }
    .ach-progress-bar-fill { height: 100%; border-radius: 999px; transition: width 0.3s ease; }
    .ach-progress-bar-fill.gold { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
    .ach-progress-bar-fill.blue { background: linear-gradient(90deg, #0284c7, #38bdf8); }
    .achievements-list-box { background: #0f172a; border: 2px solid #334155; border-radius: 16px; padding: 10px; margin-bottom: 16px; display: flex; flex-direction: column; gap: 8px; max-height: 320px; overflow-y: auto; text-align: left; -webkit-overflow-scrolling: touch; }
    .ach-card { display: flex; align-items: center; gap: 12px; background: rgba(30, 41, 59, 0.7); border: 1.5px solid #334155; border-radius: 14px; padding: 10px 12px; transition: border-color 0.15s ease; }
    .ach-card.unlocked { border-color: rgba(250, 204, 21, 0.4); background: rgba(245, 158, 11, 0.08); }
    .ach-card.locked { opacity: 0.65; }
    .ach-badge-col { flex-shrink: 0; }
    .ach-badge-icon { font-size: 26px; width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; background: #1e293b; border: 1.5px solid #334155; border-radius: 12px; }
    .ach-card.unlocked .ach-badge-icon { border-color: #f59e0b; background: rgba(245, 158, 11, 0.15); box-shadow: 0 0 10px rgba(245, 158, 11, 0.25); }
    .ach-info-col { flex: 1; min-width: 0; }
    .ach-title-row { display: flex; justify-content: space-between; align-items: center; gap: 6px; }
    .ach-title { font-size: 13px; font-weight: 800; color: #f8fafc; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .ach-status-badge { font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 999px; text-transform: uppercase; white-space: nowrap; flex-shrink: 0; }
    .ach-status-badge.done { background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4); }
    .ach-status-badge.pending { background: rgba(148, 163, 184, 0.15); color: #94a3b8; border: 1px solid #475569; }
    .ach-desc { font-size: 11px; color: #cbd5e1; margin: 2px 0 6px; line-height: 1.3; }
    .ach-progress-row { display: flex; align-items: center; gap: 8px; }
    .ach-progress-num { font-size: 11px; font-weight: 800; color: #94a3b8; min-width: 44px; text-align: right; }
    .ach-diff-tag { font-size: 9px; font-weight: 800; padding: 2px 6px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.03em; }
    .ach-diff-tag.easy { background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4); }
    .ach-diff-tag.medium { background: rgba(56, 189, 248, 0.2); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.4); }
    .ach-diff-tag.hard { background: rgba(249, 115, 22, 0.2); color: #fb923c; border: 1px solid rgba(249, 115, 22, 0.4); }
    .ach-diff-tag.master { background: rgba(234, 179, 8, 0.2); color: #facc15; border: 1px solid rgba(234, 179, 8, 0.4); }
    .ach-reward-tag { display: inline-flex; align-items: center; gap: 3px; font-size: 11px; font-weight: 800; color: #facc15; }
    .ach-card.claimable { border-color: #facc15; background: rgba(245, 158, 11, 0.16); box-shadow: 0 0 14px rgba(245, 158, 11, 0.25); cursor: pointer; }
    .ach-card.claimed { border-color: rgba(16, 185, 129, 0.4); background: rgba(16, 185, 129, 0.08); }
    .ach-claim-btn { background: linear-gradient(135deg, #f59e0b, #d97706); color: #fff; border: none; border-radius: 8px; padding: 4px 10px; font-size: 11px; font-weight: 800; cursor: pointer; transition: transform 0.1s ease, filter 0.1s ease; white-space: nowrap; }
    .ach-claim-btn:active { transform: scale(0.96); filter: brightness(1.1); }

    /* Daily Quests Modal & Cards */
    .modal-card-quests { max-height: 88vh; display: flex; flex-direction: column; overflow-y: auto; padding: 24px 22px; -webkit-overflow-scrolling: touch; }
    .quest-timer-box { background: #0f172a; border: 1.5px solid #334155; border-radius: 12px; padding: 8px 14px; color: #94a3b8; font-size: 13px; font-weight: 700; margin-bottom: 12px; display: inline-flex; align-items: center; justify-content: center; gap: 6px; }
    #quests-timer-val { color: #38bdf8; font-variant-numeric: tabular-nums; font-weight: 800; }
    .quest-summary-card { background: #0f172a; border: 2px solid #334155; border-radius: 16px; padding: 10px 14px; margin-bottom: 12px; text-align: left; }
    .quest-summary-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; font-size: 12px; font-weight: 800; color: #94a3b8; }
    .quest-summary-header strong { color: #facc15; font-size: 13px; }
    .quest-progress-bar-bg { width: 100%; height: 8px; background: #1e293b; border-radius: 999px; overflow: hidden; }
    .quest-progress-bar-fill { height: 100%; border-radius: 999px; transition: width 0.3s ease; }
    .quest-progress-bar-fill.gold { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
    .quest-progress-bar-fill.blue { background: linear-gradient(90deg, #0284c7, #38bdf8); }
    .quest-list-box { display: flex; flex-direction: column; gap: 10px; margin-bottom: 12px; text-align: left; }
    .quest-card { display: flex; align-items: center; gap: 12px; background: rgba(15, 23, 42, 0.7); border: 2px solid #334155; border-radius: 14px; padding: 12px 14px; transition: all 0.2s ease; }
    .quest-card.in-progress { border-color: #334155; background: rgba(15, 23, 42, 0.6); }
    .quest-card.ready { border-color: #f59e0b; background: rgba(245, 158, 11, 0.14); box-shadow: 0 0 16px rgba(245, 158, 11, 0.35); }
    .quest-card.ready .quest-btn-claim {
      position: relative;
      overflow: hidden;
      background: linear-gradient(135deg, #f59e0b, #d97706);
      box-shadow: 0 0 14px rgba(245, 158, 11, 0.5), 0 4px 12px rgba(245, 158, 11, 0.4);
    }
    .quest-card.ready .quest-btn-claim::after {
      content: '';
      position: absolute;
      top: -50%;
      left: -100%;
      width: 60%;
      height: 200%;
      background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.6) 50%,
        rgba(255, 255, 255, 0) 100%
      );
      transform: skewX(-25deg);
      animation: questBtnShimmer 2s infinite ease-in-out;
      pointer-events: none;
    }
    @keyframes questBtnShimmer {
      0% { left: -100%; }
      40%, 100% { left: 200%; }
    }
    .quest-card.claimed { border-color: rgba(16, 185, 129, 0.4); background: rgba(16, 185, 129, 0.08); opacity: 0.8; }
    .quest-icon-col { flex-shrink: 0; }
    .quest-icon { font-size: 26px; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; background: #1e293b; border: 1.5px solid #334155; border-radius: 12px; }
    .quest-card.ready .quest-icon { border-color: #f59e0b; background: rgba(245, 158, 11, 0.2); box-shadow: 0 0 10px rgba(245, 158, 11, 0.3); }
    .quest-card.claimed .quest-icon { border-color: #10b981; background: rgba(16, 185, 129, 0.15); }
    .quest-info-col { flex: 1; min-width: 0; }
    .quest-title-row { display: flex; justify-content: space-between; align-items: center; gap: 6px; }
    .quest-title { font-size: 13px; font-weight: 800; color: #f8fafc; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .quest-reward-pill { font-size: 11px; font-weight: 800; color: #facc15; white-space: nowrap; }
    .quest-desc { font-size: 11px; color: #cbd5e1; margin: 2px 0 6px; line-height: 1.3; }
    .quest-progress-row { display: flex; align-items: center; gap: 8px; }
    .quest-progress-row .quest-progress-bar-bg { height: 6px; flex: 1; }
    .quest-progress-text { font-size: 11px; font-weight: 800; color: #94a3b8; font-variant-numeric: tabular-nums; white-space: nowrap; }
    .quest-action-col { display: flex; flex-direction: column; gap: 6px; flex-shrink: 0; margin-left: 6px; }
    .quest-super-actions { display: flex; gap: 8px; align-items: center; }
    .quest-btn { border: none; border-radius: 10px; padding: 8px 14px; font-size: 12px; font-weight: 800; cursor: pointer; transition: all 0.15s ease; white-space: nowrap; }
    .quest-btn-claim { background: linear-gradient(135deg, #f59e0b, #d97706); color: #fff; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4); }
    .quest-btn-claim:hover { filter: brightness(1.1); transform: scale(1.03); }
    .quest-btn-claim:active { transform: scale(0.97); }
    .quest-btn-purple { background: linear-gradient(135deg, #8b5cf6, #6366f1); color: #fff; box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4); }
    .quest-btn-purple:hover { filter: brightness(1.1); transform: scale(1.03); }
    .quest-btn-purple:active { transform: scale(0.97); }
    .quest-status-badge { font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 999px; text-transform: uppercase; white-space: nowrap; display: inline-block; }
    .quest-status-badge.claimed { background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4); }
    .quest-status-badge.pending { background: rgba(148, 163, 184, 0.15); color: #94a3b8; border: 1px solid #475569; }
    .quest-super-card { display: flex; align-items: center; justify-content: space-between; gap: 12px; background: linear-gradient(135deg, rgba(245, 158, 11, 0.18), rgba(234, 88, 12, 0.12)); border: 2px solid #f59e0b; border-radius: 16px; padding: 12px 16px; text-align: left; }
    .quest-super-info { display: flex; align-items: center; gap: 10px; }
    .quest-super-icon { font-size: 30px; }
    .quest-super-text { min-width: 0; }
    .quest-super-title { font-size: 13px; font-weight: 900; color: #fbbf24; text-transform: uppercase; }
    .quest-super-desc { font-size: 11px; color: #e2e8f0; margin-top: 2px; }
    .quest-super-btn { background: linear-gradient(135deg, #f59e0b, #ea580c); color: #fff; padding: 10px 18px; font-size: 13px; font-weight: 900; border-radius: 12px; border: none; cursor: pointer; transition: all 0.15s ease; }
    .quest-super-btn:not(:disabled) {
      position: relative;
      overflow: hidden;
      box-shadow: 0 0 16px rgba(245, 158, 11, 0.6);
    }
    .quest-super-btn:not(:disabled)::after {
      content: '';
      position: absolute;
      top: -50%;
      left: -100%;
      width: 60%;
      height: 200%;
      background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.6) 50%,
        rgba(255, 255, 255, 0) 100%
      );
      transform: skewX(-25deg);
      animation: questBtnShimmer 2s infinite ease-in-out;
      pointer-events: none;
    }
    .quest-super-btn:not(:disabled):hover { filter: brightness(1.1); transform: translateY(-1px); }
    .quest-super-btn:disabled { opacity: 0.45; cursor: not-allowed; filter: grayscale(0.8); }
    .quest-super-btn.claimed { background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4); opacity: 1; filter: none; cursor: default; }

    /* Flying Coin VFX & Counter Pulse */
    .flying-coin-particle {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 100;
      pointer-events: none;
      font-size: 24px;
      line-height: 1;
      will-change: transform, opacity;
      filter: drop-shadow(0 4px 8px rgba(245, 158, 11, 0.5));
    }
    @keyframes coinCounterPulse {
      0% { transform: scale(1); }
      40% { transform: scale(1.25); }
      100% { transform: scale(1); }
    }
    .coin-counter-pulse {
      animation: coinCounterPulse 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
      display: inline-block;
    }

    /* Game Over Score Card */
    .game-over-score-card { display: flex; justify-content: center; gap: 16px; margin: 0 auto 20px; max-width: 280px; }
    .game-over-score-item { flex: 1; background: #0f172a; border: 2px solid #334155; border-radius: 14px; padding: 10px 8px; text-align: center; }
    .game-over-score-label { display: block; font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom: 2px; }
    .game-over-score-num { display: block; font-size: 26px; font-weight: 900; color: #38bdf8; font-variant-numeric: tabular-nums; line-height: 1.1; }
    .game-over-score-item:last-child .game-over-score-num { color: #facc15; }

    /* Toast Notifications */
    #toast-container { position: absolute; top: 88px; right: 24px; display: flex; flex-direction: column; gap: 10px; z-index: 9999; pointer-events: none; max-width: 340px; }
    .toast-item { background: rgba(15, 23, 42, 0.94); border: 2px solid #f59e0b; border-radius: 16px; padding: 12px 16px; color: #f8fafc; box-shadow: 0 12px 30px rgba(0, 0, 0, 0.45); display: flex; align-items: center; gap: 12px; animation: toastIn 0.28s ease-out; backdrop-filter: blur(10px); }
    .toast-icon { font-size: 26px; line-height: 1; }
    .toast-title { font-size: 13px; font-weight: 900; color: #fbbf24; text-transform: uppercase; letter-spacing: 0.04em; }
    .toast-desc { font-size: 12px; color: #e2e8f0; margin-top: 2px; font-weight: 600; }
    @keyframes toastIn { from { opacity: 0; transform: translateX(30px) scale(0.95); } to { opacity: 1; transform: translateX(0) scale(1); } }

    /* Settings Modal Styles & Range Slider Support */
    .modal-card-settings {
      max-width: 480px !important;
      width: 94%;
      max-height: 88vh;
      display: flex;
      flex-direction: column;
      padding: 20px 22px !important;
    }
    .settings-modal-header { text-align: center; margin-bottom: 12px; }
    .settings-subtitle { font-size: 13px; color: #94a3b8; margin-top: 2px; font-weight: 600; }
    
    /* Tabs Navigation */
    .settings-tabs {
      display: flex;
      gap: 6px;
      background: #090d16;
      padding: 4px;
      border-radius: 14px;
      margin-bottom: 12px;
      border: 1px solid #1e293b;
    }
    .settings-tab-btn {
      flex: 1;
      padding: 9px 4px;
      font-size: 12px;
      font-weight: 800;
      color: #94a3b8;
      background: transparent;
      border: 1px solid transparent;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.15s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      white-space: nowrap;
    }
    .settings-tab-btn:hover { color: #f8fafc; background: rgba(255, 255, 255, 0.05); }
    .settings-tab-btn.active {
      background: #1e293b;
      color: #38bdf8;
      border-color: rgba(56, 189, 248, 0.4);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
    }

    .settings-tab-contents {
      flex: 1;
      overflow-y: auto;
      max-height: calc(88vh - 180px);
      padding-right: 2px;
    }
    .settings-tab-contents::-webkit-scrollbar { width: 5px; }
    .settings-tab-contents::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }

    .settings-group {
      background: #0f172a;
      border: 2px solid #334155;
      border-radius: 16px;
      padding: 14px 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      text-align: left;
    }
    .settings-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      min-height: 36px;
    }
    .settings-row-col {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .settings-info { flex: 1; min-width: 0; }
    .settings-label { font-size: 14px; font-weight: 800; color: #f8fafc; }
    .settings-subtext { font-size: 11px; color: #94a3b8; margin-top: 2px; line-height: 1.3; }
    .settings-divider { height: 1px; background: rgba(255, 255, 255, 0.08); margin: 2px 0; }

    /* Sliders and Badges */
    .settings-slider-row {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 2px 0;
    }
    .settings-slider-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .settings-slider-label { font-size: 13px; font-weight: 700; color: #cbd5e1; }
    .settings-badge {
      background: rgba(56, 189, 248, 0.15);
      border: 1px solid rgba(56, 189, 248, 0.4);
      color: #38bdf8;
      font-size: 12px;
      font-weight: 800;
      padding: 2px 8px;
      border-radius: 6px;
      min-width: 44px;
      text-align: center;
      box-shadow: 0 0 8px rgba(56, 189, 248, 0.2);
    }

    /* Segmented Control Buttons */
    .settings-segmented {
      display: inline-flex;
      background: #090d16;
      padding: 3px;
      border-radius: 10px;
      border: 1px solid #334155;
      gap: 3px;
    }
    .settings-segmented.full-width { display: flex; width: 100%; }
    .settings-segment-btn {
      flex: 1;
      padding: 7px 10px;
      font-size: 12px;
      font-weight: 700;
      color: #94a3b8;
      background: transparent;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.12s ease;
      white-space: nowrap;
      text-align: center;
    }
    .settings-segment-btn:hover { color: #f8fafc; }
    .settings-segment-btn.active {
      background: #38bdf8;
      color: #0f172a;
      font-weight: 800;
      box-shadow: 0 2px 6px rgba(56, 189, 248, 0.35);
    }

    .settings-action-btn {
      padding: 6px 14px;
      font-size: 12px;
      font-weight: 800;
      border-radius: 10px;
      border: 1px solid #475569;
      background: #1e293b;
      color: #f8fafc;
      cursor: pointer;
      transition: all 0.15s ease;
      white-space: nowrap;
    }
    .settings-action-btn:hover { filter: brightness(1.2); border-color: #38bdf8; }
    .settings-action-btn.danger {
      border-color: rgba(239, 68, 68, 0.6);
      color: #fca5a5;
      background: rgba(239, 68, 68, 0.12);
    }
    .settings-action-btn.danger:hover {
      background: rgba(239, 68, 68, 0.25);
      color: #fff;
    }

    .settings-version-tag {
      text-align: center;
      font-size: 11px;
      color: #64748b;
      font-weight: 800;
      margin-top: 10px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .switch { position: relative; display: inline-block; width: 48px; height: 26px; flex-shrink: 0; margin: 2px; }
    .switch::after { content: ""; position: absolute; inset: -9px -6px; z-index: 1; }
    .switch input { opacity: 0; width: 0; height: 0; }
    .slider { position: absolute; cursor: pointer; inset: 0; background-color: #334155; transition: .2s ease; border-radius: 28px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.3); }
    .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 4px; bottom: 4px; background-color: white; transition: .2s ease; border-radius: 50%; box-shadow: 0 2px 5px rgba(0,0,0,0.3); }
    input:checked + .slider { background-color: #10b981; }
    input:checked + .slider:before { transform: translateX(22px); }

    /* Range slider styles (no clipping, centered thumb) */
    input[type=range] { -webkit-appearance: none; appearance: none; width: 100%; height: 28px; background: transparent; margin: 0; padding: 0 4px; cursor: pointer; display: block; box-sizing: border-box; }
    input[type=range]:focus { outline: none; }
    input[type=range]::-webkit-slider-runnable-track { width: 100%; height: 8px; background: #334155; border-radius: 4px; border: none; }
    input[type=range]::-moz-range-track { width: 100%; height: 8px; background: #334155; border-radius: 4px; border: none; }
    input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; height: 20px; width: 20px; border-radius: 50%; background: #ffffff; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4); cursor: pointer; margin-top: -6px; transition: transform 0.15s ease, background-color 0.15s ease; box-sizing: border-box; }
    input[type=range]::-moz-range-thumb { height: 20px; width: 20px; border: none; border-radius: 50%; background: #ffffff; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4); cursor: pointer; transition: transform 0.15s ease, background-color 0.15s ease; box-sizing: border-box; }
    input[type=range]:active::-webkit-slider-thumb { transform: scale(1.1); background: #38bdf8; }
    input[type=range]:active::-moz-range-thumb { transform: scale(1.1); background: #38bdf8; }

    /* Neon Accent Range Sliders */
    input[type=range].settings-slider {
      -webkit-appearance: none;
      appearance: none;
      width: 100%;
      height: 24px;
      background: transparent;
      margin: 2px 0;
      padding: 0;
      cursor: pointer;
      display: block;
      box-sizing: border-box;
    }
    input[type=range].settings-slider:focus { outline: none; }
    input[type=range].settings-slider::-webkit-slider-runnable-track {
      width: 100%;
      height: 8px;
      background: #1e293b;
      border-radius: 4px;
      border: 1px solid #334155;
    }
    input[type=range].settings-slider::-moz-range-track {
      width: 100%;
      height: 8px;
      background: #1e293b;
      border-radius: 4px;
      border: 1px solid #334155;
    }
    input[type=range].settings-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      height: 20px;
      width: 20px;
      border-radius: 50%;
      background: #38bdf8;
      box-shadow: 0 0 10px rgba(56, 189, 248, 0.7);
      border: 2px solid #ffffff;
      cursor: pointer;
      margin-top: -7px;
      transition: transform 0.12s ease, box-shadow 0.12s ease;
      box-sizing: border-box;
    }
    input[type=range].settings-slider::-moz-range-thumb {
      height: 20px;
      width: 20px;
      border: 2px solid #ffffff;
      border-radius: 50%;
      background: #38bdf8;
      box-shadow: 0 0 10px rgba(56, 189, 248, 0.7);
      cursor: pointer;
      transition: transform 0.12s ease, box-shadow 0.12s ease;
      box-sizing: border-box;
    }
    input[type=range].settings-slider:active::-webkit-slider-thumb {
      transform: scale(1.18);
      box-shadow: 0 0 15px rgba(56, 189, 248, 1);
    }
    input[type=range].settings-slider:active::-moz-range-thumb {
      transform: scale(1.18);
      box-shadow: 0 0 15px rgba(56, 189, 248, 1);
    }

    /* Virtual On-Screen D-Pad */
    .dpad-container {
      position: absolute;
      bottom: max(20px, env(safe-area-inset-bottom));
      left: 50%;
      transform: translateX(-50%);
      display: grid;
      grid-template-columns: repeat(3, 54px);
      grid-template-rows: repeat(3, 54px);
      gap: 8px;
      justify-items: center;
      align-items: center;
      pointer-events: auto;
      z-index: 15;
      user-select: none;
      -webkit-user-select: none;
      touch-action: none;
    }
    .dpad-container.hidden { display: none !important; }
    .dpad-btn {
      width: 54px;
      height: 54px;
      background: rgba(15, 23, 42, 0.72);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 2px solid rgba(56, 189, 248, 0.55);
      border-radius: 14px;
      color: #38bdf8;
      font-size: 22px;
      font-weight: 900;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4), inset 0 0 10px rgba(56, 189, 248, 0.2);
      transition: transform 0.08s ease, background 0.08s ease, border-color 0.08s ease;
      outline: none;
      -webkit-tap-highlight-color: transparent;
    }
    .dpad-btn:active, .dpad-btn.pressed {
      transform: scale(0.92);
      background: rgba(56, 189, 248, 0.35);
      border-color: #38bdf8;
      color: #ffffff;
      box-shadow: 0 0 18px rgba(56, 189, 248, 0.85);
    }
    .dpad-up { grid-column: 2; grid-row: 1; }
    .dpad-left { grid-column: 1; grid-row: 2; }
    .dpad-center {
      grid-column: 2;
      grid-row: 2;
      width: 24px;
      height: 24px;
      border-radius: 8px;
      background: rgba(56, 189, 248, 0.15);
      border: 1px dashed rgba(56, 189, 248, 0.4);
      pointer-events: none;
    }
    .dpad-right { grid-column: 3; grid-row: 2; }
    .dpad-down { grid-column: 2; grid-row: 3; }

    @media (max-height: 700px) {
      .dpad-container {
        bottom: max(10px, env(safe-area-inset-bottom));
        grid-template-columns: repeat(3, 44px);
        grid-template-rows: repeat(3, 44px);
        gap: 6px;
      }
      .dpad-btn {
        width: 44px;
        height: 44px;
        font-size: 20px;
        border-radius: 12px;
      }
      .dpad-center {
        width: 18px;
        height: 18px;
        border-radius: 6px;
      }
    }

    /* Mobile Responsive Overrides */
    @media (max-width: 640px) {
      .hud { top: max(8px, env(safe-area-inset-top)); left: max(8px, env(safe-area-inset-left)); right: max(8px, env(safe-area-inset-right)); }
      .hud-stats { gap: 6px; }
      .score-card { padding: 6px 10px; border-radius: 12px; border-width: 1.5px; box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3); }
      .score-label { font-size: 9px; letter-spacing: 0.04em; }
      .score-number { font-size: 16px; }
      .hud-circle-btn { width: 36px; height: 36px; border-radius: 10px; font-size: 15px; }

      .modal-card { padding: 20px 16px; border-radius: 20px; max-width: 95%; max-height: 90vh; }
      .modal-card h1 { font-size: clamp(24px, 7vw, 32px); }
      .modal-card h2 { font-size: clamp(18px, 5vw, 24px); }
      .modal-card p { font-size: 13px; margin-bottom: 14px; }
      .menu-btn { padding: 12px 18px; font-size: 15px; border-radius: 12px; }
      .menu-btn-primary { font-size: 16px; }
      
      .menu-stats-row { gap: 10px; margin: 12px 0 16px; }
      .menu-stat-pill { padding: 6px 14px; min-width: 90px; }
      .menu-stat-val, .menu-stat-pill strong { font-size: 20px; }

      .modal-card-leaderboard { max-height: 85vh !important; padding: 16px 14px !important; }
      .modal-card-leaderboard .lb-desc { display: none; }
      .lb-name-form { margin-bottom: 8px; }
      .lb-name-input { padding: 8px 10px; font-size: 13px; }
      .lb-save-btn { padding: 0 12px; font-size: 12px; }
      .leaderboard-preview-box { padding: 6px 8px; margin: 6px 0 10px; max-height: calc(85vh - 200px); }
      .lb-row { grid-template-columns: 56px 1fr 50px !important; gap: 6px !important; padding: 6px 4px !important; font-size: 12px !important; }
      .lb-row.header { font-size: 10px !important; }
      .lb-col-rank { font-size: 11px; }
      .lb-col-player { text-align: left !important; font-size: 13px; display: flex; align-items: center; gap: 4px; }
      .lb-col-score { font-size: 12px; font-weight: 800; color: #38bdf8; }

      .modal-card-gacha, .modal-card-gacha-pc { max-height: 94vh !important; padding: 22px 14px 18px !important; border-radius: 22px !important; }
      .gacha-header-wrap { margin-top: -52px !important; margin-bottom: 8px !important; }
      .gacha-3d-title-img { height: 68px !important; max-width: 310px !important; }
      .gacha-top-left-group, .gacha-coin-capsule-wrap { top: 10px; left: 12px; height: 36px; }
      .gacha-top-right-group, .gacha-top-bar { top: 10px; right: 12px; height: 36px; gap: 8px; }
      .gacha-close-btn-3d { width: 36px; height: 36px; }
      .gacha-esc-hint { display: none; }
      .gacha-coin-capsule { padding: 3px 10px; }
      .gacha-coin-capsule .gacha-coin-val { font-size: 16px; }
      .gacha-coin-capsule .gacha-coin-label { font-size: 10px; }
      .gacha-coin-icon-img { width: 18px; height: 18px; }
      .gacha-viewport { height: 185px; margin-bottom: 14px; }
      .gacha-spin-btn { width: 230px !important; height: 110px !important; }
      .gacha-spin-content { top: 8px !important; height: 60px !important; gap: 2px !important; }
      .gacha-spin-main { font-size: 20px !important; }
      .gacha-spin-price { font-size: 14px !important; padding: 0 !important; }
      .gacha-btn-coin-img { width: 15px !important; height: 15px !important; }
      .gacha-space-hint { font-size: 11px; margin-top: 6px; }
      .gacha-modal-grid { gap: 6px; margin: 8px 0; }
      .gacha-skin-card { padding: 8px 6px; }
      .gacha-skin-badge { font-size: 24px; margin: 2px 0; }
      .gacha-skin-name { font-size: 11px; }

      /* Skins Menu Mobile Overrides (9:16 Portrait) */
      .modal-card-skins, .modal-card-skins-pc {
        max-height: 94vh !important;
        padding: 22px 14px 18px !important;
        border-radius: 22px !important;
        width: 95% !important;
      }
      .skins-header-wrap {
        margin-top: -52px !important;
        margin-bottom: 6px !important;
      }
      .skins-3d-title-img {
        height: 68px !important;
        max-width: 290px !important;
      }
      .skins-top-left-group, .skins-coin-capsule-wrap {
        top: 10px;
        left: 12px;
        height: 36px;
      }
      .skins-top-right-group, .skins-top-bar {
        top: 10px;
        right: 12px;
        height: 36px;
        gap: 8px;
      }
      .skins-close-btn-3d {
        width: 36px;
        height: 36px;
      }
      .skins-esc-hint {
        display: none;
      }
      .skins-coin-capsule {
        padding: 3px 10px;
      }
      .skins-coin-capsule .skins-coin-val {
        font-size: 16px;
      }
      .skins-coin-capsule .skins-coin-label {
        font-size: 10px;
      }
      .skins-coin-icon-img {
        width: 18px;
        height: 18px;
      }
      .skins-cards-grid {
        display: flex;
        flex-wrap: nowrap;
        overflow-x: auto;
        padding-bottom: 8px;
        justify-content: flex-start;
        gap: 10px;
        width: 100%;
        -webkit-overflow-scrolling: touch;
        scroll-snap-type: x mandatory;
        margin-top: 14px;
      }
      .skin-card {
        flex: 0 0 136px;
        min-height: 220px;
        scroll-snap-align: center;
      }
      .skin-card-preview {
        width: 95px;
        height: 95px;
      }
      .skins-nav-hint {
        display: none;
      }

      .settings-group { padding: 12px 14px; margin: 6px 0 10px; gap: 10px; }
      .settings-label { font-size: 14px; }
      .settings-subtext { font-size: 11px; }

      .modal-card-daily { padding: 18px 14px !important; }
      .daily-grid { gap: 6px; }
      .daily-card { padding: 8px 4px; }
      .daily-card-icon { font-size: 20px; }
      .daily-card-reward { font-size: 12px; }
      .daily-card-mega { padding: 10px 14px; }

      .modal-card-quests { padding: 18px 14px !important; }
      .quest-card { padding: 10px 10px; gap: 8px; }
      .quest-icon { width: 36px; height: 36px; font-size: 20px; }
      .quest-title { font-size: 12px; }
      .quest-btn { padding: 6px 10px; font-size: 11px; }
      .quest-super-card { padding: 10px 12px; flex-direction: column; align-items: stretch; text-align: center; gap: 8px; }
      .quest-super-info { justify-content: center; }

      .main-menu-overlay {
        padding: 0 0 max(16px, env(safe-area-inset-bottom)) 0;
      }
      .menu-top-bar {
        padding: max(10px, env(safe-area-inset-top)) max(16px, env(safe-area-inset-right)) 0 max(16px, env(safe-area-inset-left));
      }
      .menu-top-left { gap: 6px; }
      .top-pill { width: 106px; height: 58px; }
      .top-pill-coins .top-pill-val { font-size: 15px; }
      .top-pill-score-title { font-size: 8px; }
      .top-pill-score-line { font-size: 11px; }
      .top-settings-btn { width: 42px; height: 42px; background: transparent; border: none; box-shadow: none; backdrop-filter: none; }
      .top-settings-img { width: 100%; height: 100%; }
      .menu-side-widgets {
        top: max(100px, calc(env(safe-area-inset-top) + 80px));
        left: max(16px, env(safe-area-inset-left));
        gap: 10px;
      }
      .floating-widgets-left,
      .floating-widget-left {
        gap: 10px;
      }
      .floating-widget-icon-box { width: 52px; height: 52px; background: transparent; border: none; box-shadow: none; }
      .floating-widget-img { width: 100%; height: 100%; }
      .floating-widget-label { font-size: 11px; }
      .floating-widget-alert-badge { width: 22px; height: 22px; font-size: 12px; top: -5px; right: -5px; border-width: 2px; }
      .floating-widget-count-badge { min-width: 22px; height: 22px; font-size: 10px; padding: 0 5px; top: -5px; right: -5px; border-width: 2px; }
      .menu-bottom-dock {
        position: relative;
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 8px;
        width: 100%;
        max-width: 100%;
        margin: 0;
        padding: 0 max(16px, env(safe-area-inset-right)) 0 max(16px, env(safe-area-inset-left));
        box-sizing: border-box;
      }
      .dock-col {
        gap: 8px;
        flex-shrink: 0;
      }
      .dock-col-right {
        margin-left: 0;
      }
      .dock-btn {
        gap: 3px;
      }
      .dock-btn-inner {
        width: 48px;
        height: 48px;
        background: transparent;
        border: none;
        box-shadow: none;
      }
      .dock-btn:active .dock-btn-inner {
        box-shadow: none;
        transform: translateY(2px) scale(0.96);
      }
      .dock-btn-img {
        width: 100%;
        height: 100%;
      }
      .dock-btn-label {
        font-size: 11px;
      }
      .dock-badge {
        top: -4px;
        right: -4px;
        font-size: 9px;
        padding: 0 5px;
        min-width: 18px;
        height: 18px;
      }
      .tap-to-play-prompt {
        bottom: max(22px, calc(env(safe-area-inset-bottom) + 22px));
        padding: 7px 16px;
        font-size: 12px;
        letter-spacing: 0.06em;
      }
      #menu-dev-btn {
        bottom: max(165px, calc(env(safe-area-inset-bottom) + 165px)) !important;
        left: max(16px, env(safe-area-inset-left)) !important;
      }
    }
  </style>
</head>
<body>
  <div id="game-container">
    <div id="warning-vignette"></div>
    <div id="toast-container"></div>

  <!-- Minimal In-Game HUD: Coins and Distance + Pause Button -->
  <div id="in-game-hud" class="hud hidden">
    <div class="hud-stats">
      <div class="score-card">
        <div class="score-label" data-i18n="hud_distance">Пройденный путь</div>
        <div id="score-value" class="score-number">0</div>
      </div>
      <div class="score-card">
        <div class="score-label" data-i18n="hud_coins">Монеты 🪙</div>
        <div id="coins-value" class="score-number coins-number">0</div>
      </div>
    </div>

    <div class="hud-actions">
      <button id="pause-btn" class="hud-circle-btn" title="Пауза">⏸</button>
    </div>
  </div>
 
  <!-- Виртуальный D-Pad (On-Screen D-Pad) -->
  <div id="on-screen-dpad" class="dpad-container hidden">
    <button type="button" id="dpad-up" class="dpad-btn dpad-up" data-dir="forward" aria-label="Вверх">▲</button>
    <button type="button" id="dpad-left" class="dpad-btn dpad-left" data-dir="left" aria-label="Влево">◄</button>
    <div class="dpad-center" aria-hidden="true"></div>
    <button type="button" id="dpad-right" class="dpad-btn dpad-right" data-dir="right" aria-label="Вправо">►</button>
    <button type="button" id="dpad-down" class="dpad-btn dpad-down" data-dir="backward" aria-label="Вниз">▼</button>
  </div>

  <!-- Главное меню (Main Menu Modal) - Modern Casual Arcade HUD -->
  <div id="main-menu-modal" class="modal main-menu-overlay">
    <p class="menu-slogan" style="display: none;">Посмотрим, как далеко ты сможешь зайти!</p>
    <!-- Верхний бар (Top Header Status Bar) -->
    <div class="menu-top-bar">
      <!-- Слева: Монеты и Рекорд -->
      <div class="menu-top-left">
        <!-- Монеты -->
        <div id="menu-coins-pill" class="top-pill top-pill-coins" title="Баланс монет">
          <img src="${MENU_ICONS.currency_widget}" class="top-pill-bg-img" alt="Coins" />
          <span id="menu-coins" class="top-pill-val">0</span>
          <button id="menu-coins-plus-btn" class="top-pill-plus" title="Пополнить / Магазин" aria-label="Пополнить">+</button>
        </div>

        <!-- Рекорд -->
        <div id="menu-score-pill" class="top-pill top-pill-score" title="Ваш рекорд">
          <img src="${MENU_ICONS.highscore_widget}" class="top-pill-bg-img" alt="Best" />
          <div class="top-pill-score-text">
            <span class="top-pill-score-title" data-i18n="menu_high_score">high score</span>
            <span class="top-pill-score-line">BEST: <strong id="menu-high-score">0</strong></span>
          </div>
        </div>
      </div>

      <!-- Справа у самого края экрана: Кнопка Настройки -->
      <div class="menu-top-right">
        <button id="menu-settings-btn" class="top-settings-btn" title="Настройки">
          <span class="top-settings-icon"><img src="${MENU_ICONS.settings}" class="top-settings-img" alt="Settings" /></span>
        </button>
      </div>
    </div>

    <!-- Боковые плавающие виджеты наград (Floating Side Widgets) -->
    <div class="menu-side-widgets">
      <!-- Виджеты слева: Ежедневный подарок и Задания дня -->
      <div class="floating-widgets-left floating-widget-left">
        <button id="menu-daily-btn" class="floating-widget-btn" title="Ежедневный бонус">
          <div class="floating-widget-icon-box gift-box">
            <img src="${MENU_ICONS.daily_gift}" class="floating-widget-img" alt="Daily Gift" />
            <span id="menu-daily-badge" class="floating-widget-alert-badge pulse-badge">!</span>
          </div>
          <span class="floating-widget-label" data-i18n="menu_daily_gift">Daily Gift</span>
        </button>

        <button id="menu-daily-quests-btn" class="floating-widget-btn" title="Задания дня">
          <div class="floating-widget-icon-box quest-box">
            <img src="${MENU_ICONS.daily_quests}" class="floating-widget-img" alt="Quests" />
            <span id="menu-daily-quests-badge" class="floating-widget-count-badge hidden">0/3</span>
          </div>
          <span class="floating-widget-label" data-i18n="menu_quests">Quests</span>
        </button>
      </div>
    </div>

    <!-- Подсказка Нажмите для старта (Tap to Play Prompt) -->
    <div class="tap-to-play-prompt" data-i18n="menu_tap_to_play">НАЖМИТЕ ДЛЯ СТАРТА</div>

    <!-- Нижняя навигационная панель (Bottom Hero Dock) -->
    <div class="menu-bottom-dock">
      <!-- Левая колонка кнопок (Скины и Магазин) -->
      <div class="dock-col dock-col-left">
        <button id="menu-skins-btn" class="dock-btn dock-btn-teal" title="Скины">
          <div class="dock-btn-inner">
            <img src="${MENU_ICONS.skins}" class="dock-btn-img" alt="Skins" />
          </div>
          <span class="dock-btn-label" data-i18n="menu_skins">Skins</span>
        </button>
        <button id="menu-gacha-btn" class="dock-btn dock-btn-teal" title="🎰 Автомат скинов">
          <div class="dock-btn-inner">
            <img src="${MENU_ICONS.shop}" class="dock-btn-img" alt="Shop" />
          </div>
          <span class="dock-btn-label" data-i18n="menu_shop">Shop</span>
          <span style="display: none;">🎰 Автомат скинов</span>
        </button>
      </div>

      <!-- Правая колонка кнопок (Лидерборд и Достижения) -->
      <div class="dock-col dock-col-right">
        <button id="menu-leaderboard-btn" class="dock-btn dock-btn-teal" title="Таблица лидеров">
          <div class="dock-btn-inner">
            <img src="${MENU_ICONS.leaderboard}" class="dock-btn-img" alt="Leaderboard" />
          </div>
          <span class="dock-btn-label" data-i18n="menu_leaderboard">Leaderboard</span>
        </button>
        <button id="menu-achievements-btn" class="dock-btn dock-btn-teal" title="Достижения">
          <div class="dock-btn-inner">
            <img src="${MENU_ICONS.achievements}" class="dock-btn-img" alt="Achievements" />
            <span id="menu-achievements-badge" class="dock-badge hidden">0/10</span>
          </div>
          <span class="dock-btn-label" data-i18n="menu_achievements">Achievements</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Меню паузы (Pause Modal) -->
  <div id="pause-modal" class="modal hidden">
    <div class="modal-card">
      <h2 style="color: #38bdf8;" data-i18n="pause_title">⏸ ПАУЗА</h2>
      <p data-i18n="pause_desc">Игра приостановлена. Выберите действие:</p>

      <div class="menu-btn-stack">
        <button id="pause-resume-btn" class="menu-btn menu-btn-primary" data-i18n="pause_resume_btn">▶ Продолжить</button>
        <button id="pause-settings-btn" class="menu-btn menu-btn-slate" data-i18n="pause_settings_btn">⚙ Настройки</button>
        <button id="pause-menu-btn" class="menu-btn menu-btn-secondary" data-i18n="pause_menu_btn">🏠 Главное меню</button>
      </div>
    </div>
  </div>

  <!-- Окно настроек (Settings Modal) -->
  <div id="settings-modal" class="modal hidden">
    <div class="modal-card modal-card-settings">
      <div class="settings-modal-header">
        <h2 style="color: #38bdf8;" data-i18n="settings_title">⚙️ НАСТРОЙКИ</h2>
        <p class="settings-subtitle" data-i18n="settings_subtitle">Персонализация звука, графики и геймплея</p>
      </div>

      <!-- Табы категорий -->
      <div class="settings-tabs">
        <button type="button" class="settings-tab-btn active" data-tab="sound" data-i18n="tab_sound">🔊 Звук</button>
        <button type="button" class="settings-tab-btn" data-tab="graphics" data-i18n="tab_graphics">🎨 Графика</button>
        <button type="button" class="settings-tab-btn" data-tab="controls" data-i18n="tab_controls">🎮 Управление</button>
        <button type="button" class="settings-tab-btn" data-tab="game" data-i18n="tab_game">⚙️ Игра</button>
      </div>

      <div class="settings-tab-contents">
        <!-- Вкладка: Звук -->
        <div class="settings-tab-panel" data-tab="sound" id="settings-panel-sound">
          <div class="settings-group">
            <div class="settings-row">
              <div class="settings-info">
                <div class="settings-label" data-i18n="sfx_label">Звуковые эффекты</div>
                <div class="settings-subtext" data-i18n="sfx_subtext">Прыжки, монеты, поезда и аварии</div>
              </div>
              <label class="switch">
                <input type="checkbox" id="setting-sound-toggle" checked>
                <span class="slider"></span>
              </label>
            </div>
            <div class="settings-slider-row">
              <div class="settings-slider-header">
                <span class="settings-slider-label" data-i18n="sfx_volume_label">Громкость звуков</span>
                <span class="settings-badge" id="setting-sfx-volume-val">80%</span>
              </div>
              <input type="range" id="setting-sfx-volume" class="settings-slider" min="0" max="100" value="80" step="5" />
            </div>

            <div class="settings-divider"></div>

            <div class="settings-row">
              <div class="settings-info">
                <div class="settings-label" data-i18n="music_label">Фоновая музыка</div>
                <div class="settings-subtext" data-i18n="music_subtext">Динамический ретро-саундтрек во время игры</div>
              </div>
              <label class="switch">
                <input type="checkbox" id="setting-music-toggle" checked>
                <span class="slider"></span>
              </label>
            </div>
            <div class="settings-slider-row">
              <div class="settings-slider-header">
                <span class="settings-slider-label" data-i18n="music_volume_label">Громкость музыки</span>
                <span class="settings-badge" id="setting-music-volume-val">25%</span>
              </div>
              <input type="range" id="setting-music-volume" class="settings-slider" min="0" max="100" value="25" step="5" />
            </div>
          </div>
        </div>

        <!-- Вкладка: Графика -->
        <div class="settings-tab-panel hidden" data-tab="graphics" id="settings-panel-graphics">
          <div class="settings-group">
            <div class="settings-row">
              <div class="settings-info">
                <div class="settings-label" data-i18n="shadows_label">Динамические тени</div>
                <div class="settings-subtext" data-i18n="shadows_subtext">Мягкие тени от солнца и окружающих объектов</div>
              </div>
              <label class="switch">
                <input type="checkbox" id="setting-shadows-toggle" checked>
                <span class="slider"></span>
              </label>
            </div>

            <div class="settings-divider"></div>

            <div class="settings-row">
              <div class="settings-info">
                <div class="settings-label" data-i18n="quality_label">Качество рендеринга</div>
                <div class="settings-subtext" data-i18n="quality_subtext">Высокое (HiDPI / Retina) или низкое (1x)</div>
              </div>
              <div class="settings-segmented">
                <button type="button" class="settings-segment-btn active" data-quality="high" data-i18n="quality_high">Высокое</button>
                <button type="button" class="settings-segment-btn" data-quality="low" data-i18n="quality_low">Низкое</button>
              </div>
            </div>

            <div class="settings-divider"></div>

            <div class="settings-row">
              <div class="settings-info">
                <div class="settings-label" data-i18n="shake_label">Тряска камеры (Screen Shake)</div>
                <div class="settings-subtext" data-i18n="shake_subtext">Эффект отдачи при ударах и проезде поезда</div>
              </div>
              <label class="switch">
                <input type="checkbox" id="setting-shake-toggle" checked>
                <span class="slider"></span>
              </label>
            </div>

            <div class="settings-divider"></div>

            <div class="settings-row">
              <div class="settings-info">
                <div class="settings-label" data-i18n="fullscreen_label">Полноэкранный режим</div>
                <div class="settings-subtext" data-i18n="fullscreen_subtext">Развернуть игру на полный экран</div>
              </div>
              <button type="button" id="setting-fullscreen-btn" class="settings-action-btn" data-i18n="fullscreen_btn">⛶ Экран</button>
            </div>
          </div>
        </div>

        <!-- Вкладка: Управление -->
        <div class="settings-tab-panel hidden" data-tab="controls" id="settings-panel-controls">
          <div class="settings-group">
            <div class="settings-row-col">
              <div class="settings-info">
                <div class="settings-label" data-i18n="controls_label">Тип управления</div>
                <div class="settings-subtext" data-i18n="controls_subtext">Выберите способ управления персонажем</div>
              </div>
              <div class="settings-segmented full-width">
                <button type="button" class="settings-segment-btn active" data-controls="swipe" data-i18n="controls_swipe">👆 Свайпы</button>
                <button type="button" class="settings-segment-btn" data-controls="dpad" data-i18n="controls_dpad">🕹️ D-Pad</button>
                <button type="button" class="settings-segment-btn" data-controls="tap" data-i18n="controls_tap">🎯 Тапы</button>
              </div>
            </div>

            <div class="settings-divider"></div>

            <div class="settings-row-col">
              <div class="settings-info">
                <div class="settings-label" data-i18n="sensitivity_label">Чувствительность свайпов</div>
                <div class="settings-subtext" data-i18n="sensitivity_subtext">Дистанция жеста для срабатывания прыжка</div>
              </div>
              <div class="settings-segmented full-width">
                <button type="button" class="settings-segment-btn" data-sensitivity="low" data-i18n="sens_low">Низкая</button>
                <button type="button" class="settings-segment-btn active" data-sensitivity="normal" data-i18n="sens_normal">Нормальная</button>
                <button type="button" class="settings-segment-btn" data-sensitivity="high" data-i18n="sens_high">Высокая</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Вкладка: Игра -->
        <div class="settings-tab-panel hidden" data-tab="game" id="settings-panel-game">
          <div class="settings-group">
            <div class="settings-row">
              <div class="settings-info">
                <div class="settings-label" data-i18n="haptics_label">Вибрация (Haptics)</div>
                <div class="settings-subtext" data-i18n="haptics_subtext">Тактильный отклик при сборе бонусов и монет</div>
              </div>
              <label class="switch">
                <input type="checkbox" id="setting-haptics-toggle" checked>
                <span class="slider"></span>
              </label>
            </div>

            <div class="settings-divider"></div>

            <div class="settings-row-col">
              <div class="settings-info">
                <div class="settings-label" data-i18n="lang_label">Язык интерфейса</div>
                <div class="settings-subtext" data-i18n="lang_subtext">Язык подсказок и меню</div>
              </div>
              <div class="settings-segmented full-width">
                <button type="button" class="settings-segment-btn active" data-lang="ru">🇷🇺 Русский</button>
                <button type="button" class="settings-segment-btn" data-lang="en">🇬🇧 English</button>
                <button type="button" class="settings-segment-btn" data-lang="tr">🇹🇷 Türkçe</button>
              </div>
            </div>

            <div class="settings-divider"></div>

            <div class="settings-row">
              <div class="settings-info">
                <div class="settings-label" data-i18n="reset_settings_label">Сброс настроек</div>
                <div class="settings-subtext" data-i18n="reset_settings_subtext">Вернуть все параметры к заводским значениям</div>
              </div>
              <button type="button" id="setting-reset-btn" class="settings-action-btn danger" data-i18n="reset_settings_btn">Сбросить</button>
            </div>

            <div class="settings-divider"></div>

            <div class="settings-row">
              <div class="settings-info">
                <div class="settings-label" style="color: #f87171;" data-i18n="reset_data_label">Сброс прогресса</div>
                <div class="settings-subtext" data-i18n="reset_data_subtext">Удалить все монеты, открытые скины и рекорды</div>
              </div>
              <button type="button" id="setting-reset-data-btn" class="settings-action-btn danger" data-i18n="reset_data_btn">Стереть всё</button>
            </div>
          </div>

          <div class="settings-version-tag">Crossy Road Pro • v1.2.0 • Phase 2</div>
        </div>
      </div>

      <button id="settings-close-btn" class="menu-btn menu-btn-primary" style="margin-top: 12px;" data-i18n="settings_close_btn">Готово</button>
    </div>
  </div>

  <!-- Модальное окно подтверждения сброса прогресса -->
  <div id="reset-confirm-modal" class="modal hidden" style="z-index: 250;">
    <div class="modal-card" style="max-width: 360px; text-align: center; border: 2px solid rgba(239, 68, 68, 0.6); box-shadow: 0 0 30px rgba(239, 68, 68, 0.3);">
      <div style="font-size: 38px; margin-bottom: 8px;">⚠️</div>
      <h2 style="color: #ef4444; font-size: 20px; margin-bottom: 8px;" data-i18n="reset_confirm_title">Сброс прогресса</h2>
      <p style="font-size: 13px; color: #cbd5e1; line-height: 1.5; margin-bottom: 20px;" data-i18n="reset_confirm_desc">
        Вы уверены? Будут удалены все монеты, открытые скины и рекорды.
      </p>
      <div style="display: flex; gap: 10px; justify-content: center;">
        <button type="button" id="reset-confirm-cancel-btn" class="menu-btn menu-btn-slate" style="flex: 1;" data-i18n="reset_confirm_cancel">Отмена</button>
        <button type="button" id="reset-confirm-ok-btn" class="menu-btn menu-btn-danger" style="flex: 1;" data-i18n="reset_confirm_ok">Да, сбросить всё</button>
      </div>
    </div>
  </div>

  <!-- Модальное окно Автомата скинов (ПК рулетка по референсу) -->
  <div id="gacha-modal" class="modal hidden" style="z-index: 120;">
    <div class="modal-card modal-card-gacha-pc">
      <!-- Верхний левый блок: плашка баланса монет -->
      <div class="gacha-top-left-group gacha-coin-capsule-wrap">
        <div class="gacha-coin-capsule" style="display: inline-flex; align-items: center; justify-content: center; gap: 6px; vertical-align: middle;" title="Баланс монет">
          <span class="gacha-coin-val" id="gacha-modal-coins">0</span>
          <span class="gacha-coin-label">COINS</span>
          <span class="gacha-coin-icon"><img src="${MENU_ICONS.coin}" class="gacha-coin-icon-img" alt="🪙" /></span>
        </div>
      </div>

      <!-- Верхний правый блок: кнопка закрытия [ESC] -->
      <div class="gacha-top-right-group gacha-top-bar">
        <div class="gacha-close-box">
          <button type="button" id="gacha-modal-close-btn" class="gacha-close-btn-3d" aria-label="Закрыть" title="Закрыть [ESC]">
            <img src="${GACHA_ICONS.close}" class="gacha-close-btn-img" alt="✕" />
          </button>
          <span class="gacha-esc-hint">[ESC]</span>
        </div>
      </div>

      <!-- 3D Заголовок PRIZE MACHINE -->
      <div class="gacha-header-wrap">
        <span style="display:none;" data-i18n="gacha_title">🎰 АВТОМАТ СКИНОВ</span>
        <img src="${GACHA_ICONS.title}" class="gacha-3d-title-img" alt="PRIZE MACHINE" />
      </div>

      <!-- Смотровое окно горизонтальной рулетки (шасси барабана) -->
      <div id="gacha-viewport" class="gacha-viewport">
        <!-- 3D Стрелка-указатель по центру -->
        <div class="gacha-pointer">
          <img src="${GACHA_ICONS.pointer}" class="gacha-pointer-img" alt="Pointer" />
        </div>

        <!-- Центральная направляющая линия -->
        <div class="gacha-guide-line"></div>

        <!-- Контейнер карточек рулетки -->
        <div id="gacha-modal-skin-list" class="gacha-reel-track"></div>

        <!-- Оверлей сияния при победе -->
        <div id="gacha-win-fx" class="gacha-win-fx hidden">
          <div class="gacha-sunburst"></div>
        </div>

        <!-- Штамп дубликата -->
        <div id="gacha-duplicate-stamp" class="gacha-duplicate-stamp hidden">
          <span>♻ ДУБЛИКАТ</span>
          <div class="gacha-stamp-sub">+40 🪙 КЭШБЭК</div>
        </div>

        <!-- Анимация вылетающих монеток кэшбэка -->
        <div id="gacha-cashback-flyer" class="gacha-cashback-flyer hidden">+40 🪙</div>
      </div>

      <!-- Нижняя зона: большая 3D кнопка SPIN и подсказка клавиши -->
      <div class="gacha-action-bar">
        <button type="button" id="gacha-modal-roll-btn" class="gacha-spin-btn">
          <div class="gacha-spin-content">
            <span class="gacha-spin-main">SPIN</span>
            <span class="gacha-spin-price">100 <img src="${MENU_ICONS.coin}" class="gacha-btn-coin-img" alt="🪙"></span>
          </div>
        </button>
        <div class="gacha-space-hint">PRESS [SPACE] TO SPIN</div>
      </div>
    </div>
  </div>

  <!-- Модальное окно Коллекции скинов -->
  <div id="skins-modal" class="modal hidden" style="z-index: 110;">
    <div class="modal-card modal-card-skins-pc">
      <!-- Верхний левый блок: плашка баланса монет -->
      <div class="skins-top-left-group skins-coin-capsule-wrap">
        <div class="skins-coin-capsule" style="display: inline-flex; align-items: center; justify-content: center; gap: 6px; vertical-align: middle;" title="Баланс монет">
          <span class="skins-coin-val" id="skins-modal-coins">0</span>
          <span class="skins-coin-label">COINS</span>
          <span class="skins-coin-icon"><img src="${MENU_ICONS.coin}" class="skins-coin-icon-img" alt="🪙" /></span>
        </div>
      </div>

      <!-- Верхний правый блок: кнопка закрытия [ESC] -->
      <div class="skins-top-right-group skins-top-bar">
        <div class="skins-close-box">
          <button type="button" id="skins-modal-close-btn" class="skins-close-btn-3d" aria-label="Закрыть" title="Закрыть [ESC]">
            <img src="${SKINS_MENU_ICONS.close}" class="skins-close-btn-img" alt="✕" />
          </button>
          <span class="skins-esc-hint">[ESC]</span>
        </div>
      </div>

      <!-- 3D Заголовок SKINS -->
      <div class="skins-header-wrap">
        <span style="display:none;" data-i18n="skins_title">👤 КОЛЛЕКЦИЯ СКИНОВ</span>
        <img src="${SKINS_MENU_ICONS.title}" class="skins-3d-title-img" alt="SKINS" />
      </div>

      <!-- Переключатель разделов: Персонажи / Миры -->
      <div class="skins-tabs-nav">
        <button type="button" id="skins-tab-btn-characters" class="skins-tab-btn active" data-tab="characters">
          <span class="skins-tab-icon">👤</span> ПЕРСОНАЖИ
        </button>
        <button type="button" id="skins-tab-btn-worlds" class="skins-tab-btn" data-tab="worlds">
          <span class="skins-tab-icon">🌍</span> МИРЫ
        </button>
      </div>

      <!-- Вкладка 1: Карточки персонажей -->
      <div id="skins-tab-characters-content" class="skins-tab-content active">
        <div id="skins-modal-list" class="skins-cards-grid"></div>
        <div class="skins-nav-hint">
          <span class="skins-key-badge">[A]</span> / <span class="skins-key-badge">[D]</span> <span data-i18n="skins_nav_hint">ВЫБОР</span> • <span class="skins-key-badge">[ENTER]</span> <span data-i18n="skins_select_hint">ВЫБРАТЬ</span>
        </div>
      </div>

      <!-- Вкладка 2: Карточки миров / локаций -->
      <div id="skins-tab-worlds-content" class="skins-tab-content hidden">
        <div id="skins-worlds-list" class="skins-cards-grid"></div>
        <div class="skins-nav-hint">
          <span class="skins-key-badge">[A]</span> / <span class="skins-key-badge">[D]</span> ВЫБОР МИРА • <span class="skins-key-badge">[ENTER]</span> ПРИМЕНИТЬ
        </div>
      </div>
    </div>
  </div>

  <!-- Модальное окно Таблицы лидеров -->
  <div id="leaderboard-modal" class="modal hidden">
    <div class="modal-card modal-card-leaderboard">
      <span class="placeholder-badge">LIVE ТОП ЗАБЕГОВ</span>
      <h2 style="color: #c084fc;" data-i18n="leaderboard_title">🏆 ТАБЛИЦА ЛИДЕРОВ</h2>
      <p class="lb-desc" data-i18n="leaderboard_desc">Введите своё имя и соревнуйтесь за первое место в рейтинге лучших забегов!</p>

      <div class="lb-name-form">
        <input type="text" id="leaderboard-name-input" class="lb-name-input" maxlength="18" placeholder="Ваше имя игрока..." value="Игрок" />
        <button id="leaderboard-save-name-btn" class="lb-save-btn" data-i18n="leaderboard_save">Сохранить</button>
      </div>

      <div class="leaderboard-preview-box">
        <div class="lb-row header">
          <span class="lb-col-rank">Ранг</span>
          <span class="lb-col-player">Игрок</span>
          <span class="lb-col-score">Очки</span>
        </div>
        <div id="leaderboard-rows"></div>
      </div>
      <span id="leaderboard-best-score" style="display: none;">0</span>

      <button id="leaderboard-close-btn" class="menu-btn menu-btn-secondary" data-i18n="modal_close">Закрыть</button>
    </div>
  </div>

  <!-- Модальное окно Достижений (Achievements Modal) -->
  <div id="achievements-modal" class="modal hidden">
    <div class="modal-card modal-card-achievements">
      <h2 style="color: #34d399;" data-i18n="achievements_title">🏅 ДОСТИЖЕНИЯ</h2>
      <p class="ach-desc-main" data-i18n="achievements_desc">Выполняйте испытания и открывайте новые награды!</p>

      <div class="ach-summary-card">
        <div class="ach-summary-header">
          <span data-i18n="achievements_summary">ОБЩИЙ ПРОГРЕСС</span>
          <strong id="ach-summary-text">0 из 10 (0%)</strong>
        </div>
        <div class="ach-progress-bar-bg">
          <div id="ach-summary-bar" class="ach-progress-bar-fill gold" style="width: 0%;"></div>
        </div>
      </div>

      <div id="achievements-list" class="achievements-list-box"></div>

      <button id="achievements-close-btn" class="menu-btn menu-btn-secondary" data-i18n="modal_close">Закрыть</button>
    </div>
  </div>

  <!-- Модальное окно Ежедневного бонуса (Daily Bonus Modal) -->
  <div id="daily-bonus-modal" class="modal hidden">
    <div class="modal-card modal-card-daily">
      <h2 style="color: #fbbf24;" data-i18n="daily_bonus_title">🎁 ЕЖЕДНЕВНЫЙ БОНУС</h2>
      <p style="margin-bottom: 12px;" data-i18n="daily_bonus_desc">Заходите каждый день и собирайте ценные награды!</p>

      <div class="daily-streak-pill">
        🔥 <span id="daily-streak-text">Серия: 1 день</span>
      </div>

      <div id="daily-bonus-grid" class="daily-grid"></div>

      <div id="daily-timer-box" class="daily-timer-box hidden">
        <span data-i18n="daily_next_timer">Следующий бонус через:</span> <strong id="daily-timer-val">00:00:00</strong>
      </div>

      <div class="menu-btn-stack">
        <button id="daily-claim-btn" class="menu-btn menu-btn-primary" data-i18n="daily_claim_btn">Забрать награду</button>
        <button id="daily-double-btn" class="menu-btn menu-btn-purple" data-i18n="daily_double_btn">🎬 Забрать x2 за рекламу</button>
        <button id="daily-close-btn" class="menu-btn menu-btn-secondary" data-i18n="modal_close">Закрыть</button>
      </div>
    </div>
  </div>

  <!-- Модальное окно Ежедневных заданий (Daily Quests Modal) -->
  <div id="daily-quests-modal" class="modal hidden">
    <div class="modal-card modal-card-quests">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
        <h2 style="color: #fbbf24; margin: 0;" data-i18n="quests_title">🎯 ЕЖЕДНЕВНЫЕ ЗАДАНИЯ</h2>
        <div class="menu-stat-pill gold" style="display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; font-size: 13px; margin: 0;">
          <strong id="quests-coins-val">0</strong> 🪙
        </div>
      </div>
      <p style="margin-bottom: 12px;" data-i18n="quests_desc">Выполняйте испытания дня и получайте монеты!</p>

      <div class="quest-timer-box">
        <span data-i18n="quests_reset_timer">До обновления:</span> <span id="quests-timer-val">00:00:00</span>
      </div>

      <div class="quest-summary-card">
        <div class="quest-summary-header">
          <span data-i18n="quests_progress_header">ПРОГРЕСС ДНЯ</span>
          <strong id="quests-summary-text">Выполнено 0 из 3</strong>
        </div>
        <div class="quest-progress-bar-bg">
          <div id="quests-summary-bar" class="quest-progress-bar-fill gold" style="width: 0%;"></div>
        </div>
      </div>

      <div id="daily-quests-list" class="quest-list-box"></div>

      <div class="quest-super-card">
        <div class="quest-super-info">
          <div class="quest-super-icon">👑</div>
          <div class="quest-super-text">
            <div class="quest-super-title" data-i18n="quests_super_title">СУПЕР-ПРИЗ ДНЯ</div>
            <div class="quest-super-desc">Выполните все 3 задания: <strong style="color: #facc15;">+100 🪙</strong></div>
          </div>
        </div>
        <div class="quest-super-actions">
          <button id="quests-claim-bonus-btn" class="quest-btn quest-super-btn" disabled>Забрать 100 🪙</button>
          <button id="quests-claim-bonus-x2-btn" class="quest-btn quest-super-btn quest-btn-purple" style="display: none;">🎬 Забрать x2 за рекламу</button>
        </div>
      </div>

      <button id="quests-close-btn" class="menu-btn menu-btn-secondary" style="margin-top: 14px;" data-i18n="modal_close">Закрыть</button>
    </div>
  </div>

  <!-- Экран Game Over -->
  <div id="game-over-modal" class="modal hidden">
    <div class="modal-card">
      <h2 data-i18n="game_over_title">Игра окончена!</h2>
      <p id="death-reason">Вас сбил автомобиль!</p>

      <div class="game-over-score-card">
        <div class="game-over-score-item">
          <span class="game-over-score-label" data-i18n="game_over_score">СЧЁТ</span>
          <span id="game-over-score-val" class="game-over-score-num">0</span>
        </div>
        <div class="game-over-score-item">
          <span class="game-over-score-label" data-i18n="game_over_best">РЕКОРД</span>
          <span id="game-over-best-val" class="game-over-score-num">0</span>
        </div>
      </div>

      <div class="menu-btn-stack">
        <button id="restart-btn" class="menu-btn menu-btn-primary" data-i18n="game_over_restart">Играть снова</button>
        <button id="to-menu-btn" class="menu-btn menu-btn-secondary" data-i18n="game_over_to_menu">Главное меню</button>
      </div>
    </div>
  </div>

  <!-- Кнопка вызова DEV-панели -->
  <button id="menu-dev-btn" class="hud-circle-btn" style="position: absolute; bottom: max(200px, calc(env(safe-area-inset-bottom) + 200px)); left: max(24px, env(safe-area-inset-left)); z-index: 100; font-size: 13px; width: auto; padding: 0 12px; height: 38px; border-radius: 12px; background: rgba(15, 23, 42, 0.9); border: 2px solid #38bdf8; color: #38bdf8; font-weight: 800; display: flex; align-items: center; gap: 6px; cursor: pointer; pointer-events: auto;" title="Панель разработчика">🛠️ DEV</button>

  <!-- Модальное окно Dev Sandbox (Тестирование и Вьюер) -->
  <div id="dev-modal" class="modal hidden">
    <div class="modal-card" style="max-width: 440px;">
      <h2 style="color: #38bdf8;">🛠️ DEV SANDBOX</h2>
      <p style="font-size: 13px; color: #94a3b8; margin-bottom: 14px;">Тестирование механик и наград без ограничений по времени</p>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
        <button id="dev-add-coins-btn" class="menu-btn menu-btn-primary" style="font-size: 13px; padding: 10px;">🪙 +500 Монет</button>
        <button id="dev-bonus-btn" class="menu-btn menu-btn-primary" style="font-size: 13px; padding: 10px;">🎁 Бонус дня</button>
        <button id="dev-complete-quests-btn" class="menu-btn menu-btn-slate" style="font-size: 13px; padding: 10px;">🎯 Выполнить квесты</button>
        <button id="dev-reroll-quests-btn" class="menu-btn menu-btn-slate" style="font-size: 13px; padding: 10px;">🔄 Обновить квесты</button>
        <button id="dev-cycle-biome-btn" class="menu-btn menu-btn-slate" style="font-size: 13px; padding: 10px;">🌲 Сменить биом</button>
        <button id="dev-godmode-btn" class="menu-btn menu-btn-slate" style="font-size: 13px; padding: 10px;">🛡️ God Mode: ВЫКЛ</button>
        <button id="dev-perf-btn" class="menu-btn menu-btn-slate" style="font-size: 13px; padding: 10px;">⚡ Perf HUD: ВЫКЛ</button>
        <button id="dev-benchmark-btn" class="menu-btn menu-btn-slate" style="font-size: 13px; padding: 10px;">🚀 Бенчмарк (60)</button>
        <button id="dev-report-btn" class="menu-btn menu-btn-primary" style="font-size: 13px; padding: 10px; grid-column: span 2; background: #0284c7; border-color: #38bdf8; color: #fff;">📋 Открыть отчёт бенчмарка</button>
      </div>

      <div style="margin-bottom: 14px;">
        <a id="dev-open-viewer-btn" href="model-viewer.html" onclick="this.href='model-viewer.html?v='+Date.now();" target="_blank" class="menu-btn menu-btn-secondary" style="display: block; text-decoration: none; text-align: center; background: #6366f1; border-color: #818cf8; color: #fff;">
          🔍 3D Вьюер моделей (Live Engine Assets)
        </a>
      </div>

      <button id="dev-close-btn" class="menu-btn menu-btn-secondary">Закрыть</button>
    </div>
  </div>
  </div>

  <script type="module">
${combinedJs}
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(ROOT, 'index.html'), htmlContent, 'utf8');
fs.writeFileSync(path.join(distDir, 'index.html'), htmlContent, 'utf8');

// ============================================================================
// 3D MODEL VIEWER — DEPLOY AUDIT & DYNAMIC GENERATION
// ============================================================================
function auditDeployModels() {
  console.log('\n===============================================================');
  console.log('🔍 [3D Model Viewer Deploy Check] Auditing models in game codebase...');

  const typesSource = fs.readFileSync(path.join(ROOT, 'src/core/types.ts'), 'utf8');
  const charsSource = fs.readFileSync(path.join(ROOT, 'src/view/urbanCharacters.ts'), 'utf8');
  const vehSource = fs.readFileSync(path.join(ROOT, 'src/view/urbanVehicles.ts'), 'utf8');
  const envSource = fs.readFileSync(path.join(ROOT, 'src/view/urbanEnvironment.ts'), 'utf8');
  const bldgSource = fs.readFileSync(path.join(ROOT, 'src/view/urbanBuildings.ts'), 'utf8');

  // Check skins
  const skinMatches = Array.from(typesSource.matchAll(/id:\s*['"]([^'"]+)['"]/g)).map((m) => m[1]);
  const uniqueSkins = Array.from(new Set(skinMatches));
  if (uniqueSkins.length === 0) {
    throw new Error('Deploy Check Error: No skins found in src/core/types.ts');
  }

  for (const s of uniqueSkins) {
    if (!charsSource.includes(`'${s}'`)) {
      throw new Error(`Deploy Check Error: Skin "${s}" from ALL_SKINS is missing from src/view/urbanCharacters.ts!`);
    }
  }
  console.log(`✔ Verified ${uniqueSkins.length} character skins in ALL_SKINS: ${uniqueSkins.join(', ')}`);

  // Check vehicles
  const vehicles = ['taxi', 'scooter', 'bus', 'sweeper', 'train', 'pallet'];
  for (const v of vehicles) {
    const fnName = v === 'train' ? 'createUrbanTrain' : v === 'pallet' ? 'createUrbanPallet' : `build${v.charAt(0).toUpperCase() + v.slice(1)}`;
    if (!vehSource.includes(fnName)) {
      throw new Error(`Deploy Check Error: Vehicle generator "${fnName}" missing in src/view/urbanVehicles.ts!`);
    }
  }
  console.log(`✔ Verified ${vehicles.length} urban vehicles: ${vehicles.join(', ')}`);

  // Check props & nature
  const props = [
    'createUrbanHydrant',
    'createUrbanTrashCan',
    'createUrbanBench',
    'createUrbanLampPost',
    'createUrbanCoin',
    'createUrbanRailwaySignal',
    'createUrbanRecordFlag',
    'createUrbanRoadBarrier',
    'createUrbanRoadMarkings',
    'createUrbanRiverbankEdge',
    'createUrbanTreePlanter',
    'createUrbanHedge',
  ];
  for (const p of props) {
    if (!envSource.includes(p)) {
      throw new Error(`Deploy Check Error: Prop "${p}" missing in src/view/urbanEnvironment.ts!`);
    }
  }
  console.log(`✔ Verified ${props.length} environment & biome props.`);

  // Check buildings
  const buildings = ['createTownhouseA', 'createTownhouseB', 'createTownhouseC'];
  for (const b of buildings) {
    if (!bldgSource.includes(b)) {
      throw new Error(`Deploy Check Error: Building "${b}" missing in src/view/urbanBuildings.ts!`);
    }
  }
  console.log(`✔ Verified ${buildings.length} architectural townhouses (Cafe, Bakery, Books).`);

  const total = uniqueSkins.length + vehicles.length + props.length + buildings.length;
  console.log(`🎯 Total verified models: ${total}. All game models synchronized!`);
  console.log('===============================================================\n');
}

auditDeployModels();

// Extract view & core modules required by 3D Model Viewer
const viewerModuleOrder = [
  'src/core/types.ts',
  'src/core/collision.ts',
  'src/view/voxelPalette.ts',
  'src/view/urbanCharacters.ts',
  'src/view/voxelMeshBuilder.ts',
  'src/view/urbanVehicles.ts',
  'src/view/urbanEnvironment.ts',
  'src/view/townhouse/shopfront.ts',
  'src/view/townhouse/upperFloors.ts',
  'src/view/townhouse/roof.ts',
  'src/view/urbanBuildings.ts',
  'src/view/meshFactory.ts',
  'src/view/modelRegistry.ts',
];

let viewerModulesJs = '';
for (const relPath of viewerModuleOrder) {
  const fullPath = path.join(ROOT, relPath);
  const tsSource = fs.readFileSync(fullPath, 'utf8');
  let jsCode = stripTypes(tsSource);
  jsCode = jsCode
    .replace(/^\s*import\s+[\s\S]*?from\s+['"][^'"]+['"];?\s*$/gm, '')
    .replace(/^\s*export\s*\{[\s\S]*?\};?\s*$/gm, '')
    .replace(/^\s*export\s+(class|function|const|let|var)/gm, '$1');
  viewerModulesJs += `// --- Module: ${relPath} ---\n${jsCode.trim()}\n\n`;
}

const viewerHtmlContent = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
  <meta http-equiv="Pragma" content="no-cache" />
  <meta http-equiv="Expires" content="0" />
  <title>Crossy Road 3D — 3D Model Viewer & Dev Studio (Live Sync)</title>
  <script type="importmap">
  {
    "imports": {
      "three": "https://unpkg.com/three@0.170.0/build/three.module.js",
      "three/addons/": "https://unpkg.com/three@0.170.0/examples/jsm/"
    }
  }
  </script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
    html, body { width: 100%; height: 100%; overflow: hidden; font-family: 'Segoe UI', system-ui, sans-serif; background: #0b0f19; color: #f8fafc; }
    #canvas-container { width: 100%; height: 100%; position: absolute; inset: 0; }

    /* Top Navigation Header */
    .top-header {
      position: absolute; top: 16px; left: 16px; right: 16px; display: flex; justify-content: space-between; align-items: center; pointer-events: none; z-index: 20;
    }
    .brand-box {
      background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.15); padding: 10px 18px; border-radius: 14px; pointer-events: auto; display: flex; align-items: center; gap: 12px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
    }
    .brand-title { font-size: 16px; font-weight: 900; letter-spacing: 0.04em; color: #38bdf8; }
    .brand-subtitle { font-size: 11px; color: #94a3b8; font-weight: 600; text-transform: uppercase; }
    .header-links { display: flex; gap: 10px; pointer-events: auto; }
    .nav-btn {
      background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.15); color: #fff; font-size: 13px; font-weight: 700; padding: 10px 16px; border-radius: 12px; cursor: pointer; text-decoration: none; display: flex; align-items: center; gap: 6px; transition: transform 0.1s, border-color 0.2s, background 0.2s; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    }
    .nav-btn:hover { background: rgba(30, 41, 59, 0.95); border-color: #38bdf8; transform: translateY(-1px); }

    /* Left Sidebar: Catalog & Categories */
    .sidebar {
      position: absolute; top: 80px; bottom: 80px; left: 16px; width: 320px; background: rgba(15, 23, 42, 0.88); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 18px; display: flex; flex-direction: column; overflow: hidden; z-index: 20; box-shadow: 0 16px 36px rgba(0, 0, 0, 0.5);
    }
    .category-tabs {
      display: flex; gap: 4px; padding: 10px; background: rgba(2, 6, 23, 0.5); border-bottom: 1px solid rgba(255, 255, 255, 0.08); overflow-x: auto;
    }
    .cat-tab {
      padding: 6px 10px; border-radius: 8px; font-size: 11px; font-weight: 800; cursor: pointer; border: 1px solid transparent; background: transparent; color: #94a3b8; white-space: nowrap; transition: all 0.15s;
    }
    .cat-tab:hover { color: #fff; background: rgba(255, 255, 255, 0.06); }
    .cat-tab.active { background: #0284c7; color: #fff; border-color: #38bdf8; }

    .model-list {
      flex: 1; overflow-y: auto; padding: 10px; display: flex; flex-direction: column; gap: 6px;
    }
    .model-list::-webkit-scrollbar { width: 6px; }
    .model-list::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.15); border-radius: 4px; }
    .model-card-btn {
      display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; border-radius: 12px; background: rgba(30, 41, 59, 0.5); border: 1px solid rgba(255, 255, 255, 0.06); color: #cbd5e1; cursor: pointer; text-align: left; transition: all 0.15s;
    }
    .model-card-btn:hover { background: rgba(51, 65, 85, 0.7); border-color: rgba(255, 255, 255, 0.2); color: #fff; transform: translateX(3px); }
    .model-card-btn.active { background: linear-gradient(135deg, rgba(2, 132, 199, 0.4), rgba(14, 165, 233, 0.2)); border-color: #38bdf8; color: #fff; font-weight: 700; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.25); }
    .model-card-title { display: flex; align-items: center; gap: 8px; font-size: 13px; }
    .model-card-badge { font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 6px; background: rgba(0, 0, 0, 0.4); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.2); }

    /* Bottom Toolbar */
    .bottom-bar {
      position: absolute; bottom: 16px; left: 16px; right: 16px; display: flex; justify-content: center; pointer-events: none; z-index: 20;
    }
    .toolbar-dock {
      background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.15); padding: 8px 16px; border-radius: 18px; display: flex; align-items: center; gap: 12px; pointer-events: auto; box-shadow: 0 16px 36px rgba(0, 0, 0, 0.5); flex-wrap: wrap; justify-content: center;
    }
    .tool-group { display: flex; align-items: center; gap: 6px; border-right: 1px solid rgba(255, 255, 255, 0.1); padding-right: 12px; }
    .tool-group:last-child { border-right: none; padding-right: 0; }
    .tool-btn {
      background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(255, 255, 255, 0.1); color: #cbd5e1; font-size: 12px; font-weight: 700; padding: 8px 12px; border-radius: 10px; cursor: pointer; transition: all 0.15s; display: flex; align-items: center; gap: 6px;
    }
    .tool-btn:hover { background: rgba(51, 65, 85, 1); color: #fff; border-color: #38bdf8; }
    .tool-btn.active { background: #0284c7; color: #fff; border-color: #38bdf8; }
    .tool-select {
      background: rgba(30, 41, 59, 0.9); border: 1px solid rgba(255, 255, 255, 0.15); color: #fff; font-size: 12px; font-weight: 700; padding: 7px 10px; border-radius: 10px; cursor: pointer; outline: none;
    }

    /* Right Info Panel */
    .info-panel {
      position: absolute; top: 80px; right: 16px; width: 290px; background: rgba(15, 23, 42, 0.88); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 18px; padding: 18px; z-index: 20; box-shadow: 0 16px 36px rgba(0, 0, 0, 0.5);
    }
    .info-title { font-size: 17px; font-weight: 900; color: #fff; display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
    .info-category { font-size: 11px; text-transform: uppercase; font-weight: 800; color: #38bdf8; letter-spacing: 0.06em; margin-bottom: 12px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px; }
    .info-item { background: rgba(2, 6, 23, 0.4); border: 1px solid rgba(255, 255, 255, 0.06); padding: 8px; border-radius: 10px; }
    .info-label { font-size: 10px; color: #94a3b8; font-weight: 700; text-transform: uppercase; }
    .info-val { font-size: 14px; font-weight: 900; color: #facc15; }
    .info-desc { font-size: 12px; color: #cbd5e1; line-height: 1.45; border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 10px; }

    .hint-chip {
      position: absolute; bottom: 80px; right: 16px; background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(8px); border: 1px solid rgba(255, 255, 255, 0.1); padding: 8px 12px; border-radius: 10px; font-size: 11px; color: #94a3b8; z-index: 10; pointer-events: none;
    }
  </style>
</head>
<body>
  <div id="canvas-container"></div>

  <!-- Header -->
  <header class="top-header">
    <div class="brand-box">
      <div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <div class="brand-title">CROSSY ROAD 3D</div>
          <span style="background: linear-gradient(135deg, #0284c7, #38bdf8); color: #020617; font-size: 10px; font-weight: 900; padding: 2px 7px; border-radius: 6px; letter-spacing: 0.05em; text-transform: uppercase;">⚡ LIVE V2.0</span>
        </div>
        <div class="brand-subtitle">3D Model Viewer • Прямой рендер моделей игрового движка</div>
      </div>
    </div>
    <div class="header-links">
      <div style="background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.15); padding: 8px 14px; border-radius: 12px; font-size: 11px; font-weight: 700; color: #38bdf8; display: flex; align-items: center; gap: 6px;">
        <span>🎯 Проверено: 26 моделей</span>
        <span style="color: #64748b;">|</span>
        <span style="color: #4ade80;">✔ Синхронизировано</span>
      </div>
      <a href="index.html" class="nav-btn">🎮 В игру</a>
    </div>
  </header>

  <!-- Left Sidebar (Models Catalog) -->
  <aside class="sidebar">
    <div class="category-tabs">
      <button class="cat-tab active" data-cat="chars">Персонажи (5)</button>
      <button class="cat-tab" data-cat="vehicles">Транспорт (6)</button>
      <button class="cat-tab" data-cat="props">Окружение (10)</button>
      <button class="cat-tab" data-cat="nature">Биомы (3)</button>
      <button class="cat-tab" data-cat="buildings">Здания (3)</button>
    </div>
    <div id="model-list" class="model-list"></div>
  </aside>

  <!-- Right Info Panel -->
  <div class="info-panel">
    <div id="info-title" class="info-title">🐶 Весёлый Корги</div>
    <div id="info-category" class="info-category">Персонаж (Mascot)</div>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Воксели / Меши</div>
        <div id="info-voxels" class="info-val">32</div>
      </div>
      <div class="info-item">
        <div class="info-label">Габариты (Ш×В×Г)</div>
        <div id="info-dims" class="info-val">0.38 × 0.78 × 0.46</div>
      </div>
      <div class="info-item" style="grid-column: span 2;">
        <div class="info-label">Источник модели</div>
        <div id="info-source" class="info-val" style="font-size: 11px; color: #38bdf8;">src/view/ (Движок игры)</div>
      </div>
    </div>
    <div id="info-desc" class="info-desc">
      Главный маскот игры. Озорной рыже-белый корги с розовыми лапками, торчащими ушками и ошейником.
    </div>
  </div>

  <div class="hint-chip">
    🖱️ ЛКМ — Вращение | ПКМ — Сдвиг | Колесо — Зум
  </div>

  <!-- Bottom Toolbar -->
  <footer class="bottom-bar">
    <div class="toolbar-dock">
      <div class="tool-group">
        <button id="btn-spin" class="tool-btn active">🔄 360° Вращение</button>
        <button id="btn-hop" class="tool-btn">🦘 Тест прыжка</button>
        <button id="btn-ghost" class="tool-btn">👻 Ghost Mode</button>
      </div>

      <div class="tool-group">
        <label style="font-size: 11px; font-weight: 700; color: #94a3b8;">Биом:</label>
        <select id="biome-select" class="tool-select">
          <option value="forest">🌲 Лес (Forest)</option>
          <option value="winter">❄️ Зима (Winter)</option>
          <option value="desert">🏜️ Пустыня (Desert)</option>
          <option value="neon">⚡ Неон (Cyberpunk)</option>
        </select>
      </div>

      <div class="tool-group">
        <label style="font-size: 11px; font-weight: 700; color: #94a3b8;">Свет:</label>
        <select id="light-select" class="tool-select">
          <option value="studio">💡 Студийный</option>
          <option value="sun">☀️ Солнечный день</option>
          <option value="sunset">🌅 Закат</option>
          <option value="cyber">🌆 Неоновый вечер</option>
        </select>
      </div>

      <div class="tool-group">
        <button id="btn-grid" class="tool-btn active">📐 Сетка пола</button>
        <button id="btn-reset-cam" class="tool-btn">📷 Сброс камеры</button>
      </div>
    </div>
  </footer>

  <script type="module">
    import * as THREE from 'three';
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

${viewerModulesJs}

    // === THREE.JS STAGE SETUP ===
    const container = document.getElementById('canvas-container');
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b0f19);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(3.2, 2.5, 4.0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 0.5, 0);
    controls.maxPolarAngle = Math.PI / 2 + 0.05;

    // Lights
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x1e293b, 0.75);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.25);
    dirLight.position.set(5, 10, 7);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.45);
    fillLight.position.set(-6, 4, -4);
    scene.add(fillLight);

    // Floor Pedestal & Grid
    const pedestalGeo = new THREE.CylinderGeometry(2.4, 2.5, 0.1, 48);
    const pedestalMat = new THREE.MeshLambertMaterial({ color: 0x111827 });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -0.05;
    pedestal.receiveShadow = true;
    scene.add(pedestal);

    const grid = new THREE.GridHelper(6, 24, 0x0284c7, 0x1e293b);
    grid.position.y = 0.002;
    scene.add(grid);

    // Dynamic Model Registry from Game Code
    const MODELS = getModelCatalog();

    // Current State
    let activeCategory = 'chars';
    let currentModelId = MODELS[0] ? MODELS[0].id : 'corgi';
    let currentMesh = null;
    let autoSpin = true;
    let hopTest = false;
    let ghostMode = false;
    let currentBiome = 'forest';

    // Model Mount Node
    const modelRoot = new THREE.Group();
    scene.add(modelRoot);

    function loadModel(id) {
      currentModelId = id;
      const def = MODELS.find(m => m.id === id) || MODELS[0];
      if (!def) return;

      while (modelRoot.children.length > 0) {
        modelRoot.remove(modelRoot.children[0]);
      }

      currentMesh = def.create(currentBiome, ghostMode);
      modelRoot.add(currentMesh);

      // Center model on pedestal
      const box = new THREE.Box3().setFromObject(currentMesh);
      const center = box.getCenter(new THREE.Vector3());
      currentMesh.position.x = -center.x;
      currentMesh.position.z = -center.z;
      currentMesh.position.y = -box.min.y;

      // Dynamic diagnostics from actual 3D geometry
      const diag = getModelDiagnostics(currentMesh);

      // Update Info Panel
      document.getElementById('info-title').textContent = def.icon + ' ' + def.name;
      document.getElementById('info-category').textContent = def.cat.toUpperCase();
      document.getElementById('info-voxels').textContent = String(diag.meshCount);
      document.getElementById('info-dims').textContent = diag.dims;
      document.getElementById('info-desc').textContent = def.desc;

      // Update sidebar buttons
      document.querySelectorAll('.model-card-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.id === id);
      });
    }

    function renderSidebar() {
      const listEl = document.getElementById('model-list');
      listEl.innerHTML = '';
      const filtered = MODELS.filter(m => m.cat === activeCategory);

      filtered.forEach(m => {
        const btn = document.createElement('button');
        btn.className = 'model-card-btn ' + (m.id === currentModelId ? 'active' : '');
        btn.dataset.id = m.id;

        // Quick voxel badge
        let badgeText = '3D';
        try {
          const testGroup = m.create(currentBiome, false);
          const d = getModelDiagnostics(testGroup);
          badgeText = d.meshCount + ' vx';
        } catch {
          badgeText = '3D';
        }

        btn.innerHTML =
          '<div class="model-card-title">' +
            '<span style="font-size: 18px;">' + m.icon + '</span>' +
            '<span>' + m.name + '</span>' +
          '</div>' +
          '<span class="model-card-badge">' + badgeText + '</span>';
        btn.addEventListener('click', () => loadModel(m.id));
        listEl.appendChild(btn);
      });
    }

    // Category Tabs
    document.querySelectorAll('.cat-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        activeCategory = tab.dataset.cat;
        renderSidebar();
        const first = MODELS.find(m => m.cat === activeCategory);
        if (first) loadModel(first.id);
      });
    });

    // Toolbar Controls
    const btnSpin = document.getElementById('btn-spin');
    btnSpin.addEventListener('click', () => {
      autoSpin = !autoSpin;
      btnSpin.classList.toggle('active', autoSpin);
    });

    const btnHop = document.getElementById('btn-hop');
    btnHop.addEventListener('click', () => {
      hopTest = !hopTest;
      btnHop.classList.toggle('active', hopTest);
      if (!hopTest && modelRoot) {
        modelRoot.scale.set(1, 1, 1);
        modelRoot.position.y = 0;
      }
    });

    const btnGhost = document.getElementById('btn-ghost');
    btnGhost.addEventListener('click', () => {
      ghostMode = !ghostMode;
      btnGhost.classList.toggle('active', ghostMode);
      loadModel(currentModelId);
    });

    const biomeSelect = document.getElementById('biome-select');
    biomeSelect.addEventListener('change', (e) => {
      currentBiome = e.target.value;
      loadModel(currentModelId);
    });

    const lightSelect = document.getElementById('light-select');
    lightSelect.addEventListener('change', (e) => {
      const v = e.target.value;
      if (v === 'studio') {
        scene.background.set(0x0b0f19);
        hemiLight.color.set(0xffffff);
        dirLight.color.set(0xffffff);
        fillLight.color.set(0x38bdf8);
      } else if (v === 'sun') {
        scene.background.set(0x38bdf8);
        hemiLight.color.set(0xbae6fd);
        dirLight.color.set(0xffedd5);
        fillLight.color.set(0x60a5fa);
      } else if (v === 'sunset') {
        scene.background.set(0x4c1d95);
        hemiLight.color.set(0xf472b6);
        dirLight.color.set(0xf97316);
        fillLight.color.set(0x818cf8);
      } else if (v === 'cyber') {
        scene.background.set(0x050510);
        hemiLight.color.set(0x06b6d4);
        dirLight.color.set(0xd946ef);
        fillLight.color.set(0x3b82f6);
      }
    });

    const btnGrid = document.getElementById('btn-grid');
    btnGrid.addEventListener('click', () => {
      grid.visible = !grid.visible;
      btnGrid.classList.toggle('active', grid.visible);
    });

    const btnResetCam = document.getElementById('btn-reset-cam');
    btnResetCam.addEventListener('click', () => {
      camera.position.set(3.2, 2.5, 4.0);
      controls.target.set(0, 0.5, 0);
    });

    // Resize Handler
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Animation Loop
    const clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      if (autoSpin && modelRoot && !hopTest) {
        modelRoot.rotation.y += delta * 0.8;
      }

      if (hopTest && modelRoot) {
        const cycle = (elapsed * 3.5) % Math.PI;
        const hopHeight = Math.sin(cycle) * 0.45;
        modelRoot.position.y = hopHeight;
        const squish = hopHeight > 0.08 ? 1.15 : 0.90;
        modelRoot.scale.set(1 / Math.sqrt(squish), squish, 1 / Math.sqrt(squish));
      } else if (!hopTest && modelRoot) {
        modelRoot.position.y = 0;
        modelRoot.scale.set(1, 1, 1);
      }

      controls.update();
      renderer.render(scene, camera);
    }

    renderSidebar();
    loadModel(currentModelId);
    animate();
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(ROOT, 'viewer.html'), viewerHtmlContent, 'utf8');
fs.writeFileSync(path.join(distDir, 'viewer.html'), viewerHtmlContent, 'utf8');
fs.writeFileSync(path.join(ROOT, 'model-viewer.html'), viewerHtmlContent, 'utf8');
fs.writeFileSync(path.join(distDir, 'model-viewer.html'), viewerHtmlContent, 'utf8');

console.log('Build complete: index.html, dist/index.html, viewer.html, model-viewer.html and dist/bundle.js generated successfully.');
