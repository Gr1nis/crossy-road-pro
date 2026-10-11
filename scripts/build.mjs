import fs from 'node:fs';
import path from 'node:path';
import * as nodeModule from 'node:module';
import ts from 'typescript';

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
  'src/view/urbanVehicles.ts',
  'src/view/urbanEnvironment.ts',
  'src/view/urbanBuildings.ts',
  'src/view/meshFactory.ts',
  'src/view/modelRegistry.ts',
  'src/view/squashStretch.ts',
  'src/view/sceneManager.ts',
  'src/app/perfMetrics.ts',
  'src/app/perfReportModal.ts',
  'src/app/perfMonitor.ts',
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
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; -webkit-user-select: none; }
    body, html { width: 100%; height: 100%; overflow: hidden; font-family: 'Segoe UI', system-ui, sans-serif; background: #87ceeb; touch-action: none; -webkit-touch-callout: none; }
    #game-container { width: 100%; height: 100%; position: relative; touch-action: none; }

    /* Global Visibility Utility */
    .hidden { display: none !important; }
    #in-game-hud.hidden, .hud.hidden { display: none !important; }
    
    /* Clean Minimal In-Game HUD: Coins, Distance & Pause button only */
    .hud { position: fixed; top: max(16px, env(safe-area-inset-top)); left: max(16px, env(safe-area-inset-left)); right: max(16px, env(safe-area-inset-right)); display: flex; justify-content: space-between; align-items: flex-start; pointer-events: none; z-index: 10; }
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
      position: fixed;
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
    #warning-vignette { position: fixed; inset: 0; pointer-events: none; z-index: 5; opacity: 0; background: linear-gradient(to top, rgba(239, 68, 68, 0.65) 0%, rgba(239, 68, 68, 0.2) 20%, transparent 45%); transition: opacity 0.15s ease-out; }

    .modal { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.78); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 30; }
    .modal.hidden { display: none !important; }
    #perf-report-modal { z-index: 2000; }

    /* Modern Subway Surfers-style Main Menu HUD */
    .main-menu-overlay {
      position: fixed;
      inset: 0;
      background: transparent !important;
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
      pointer-events: none;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 0 0 max(24px, env(safe-area-inset-bottom)) 0;
      z-index: 30;
      box-sizing: border-box;
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
      padding: 20px 32px;
      padding-top: max(20px, env(safe-area-inset-top));
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
      background: rgba(255, 255, 255, 0.42);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 2.5px solid rgba(255, 255, 255, 0.85);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15), inset 0 2px 4px rgba(255, 255, 255, 0.9);
      border-radius: 999px;
      display: flex;
      align-items: center;
      padding: 6px 14px;
      transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
    }
    .top-pill:hover {
      border-color: rgba(255, 255, 255, 1);
      box-shadow: 0 10px 28px rgba(0, 0, 0, 0.18), inset 0 2px 4px rgba(255, 255, 255, 1);
    }
    .top-pill-coins {
      gap: 8px;
      cursor: pointer;
    }
    .top-pill-icon {
      font-size: 26px;
      line-height: 1;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .top-pill-val {
      font-size: 19px;
      font-weight: 900;
      color: #0f274a;
      font-variant-numeric: tabular-nums;
      line-height: 1;
      text-shadow: 0 1px 2px rgba(255, 255, 255, 0.7);
      letter-spacing: -0.01em;
    }
    .top-pill-plus {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 45%, #ea580c 100%);
      border: 2px solid #ffffff;
      color: #ffffff;
      font-size: 16px;
      font-weight: 900;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 3px 8px rgba(217, 119, 6, 0.45), inset 0 1px 2px rgba(255, 255, 255, 0.85);
      margin-left: 2px;
      transition: transform 0.12s ease, filter 0.12s ease;
      padding: 0;
      line-height: 1;
    }
    .top-pill-plus:hover {
      transform: scale(1.15);
      filter: brightness(1.1);
    }
    .top-pill-plus:active {
      transform: scale(0.95);
    }
    .top-pill-score {
      gap: 10px;
      padding: 6px 18px;
    }
    .top-pill-crown-box {
      font-size: 18px;
      line-height: 1;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: linear-gradient(135deg, #fef08a 0%, #facc15 50%, #eab308 100%);
      border: 2px solid #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 6px rgba(202, 138, 4, 0.35), inset 0 1px 2px rgba(255, 255, 255, 0.9);
      flex-shrink: 0;
    }
    .top-pill-score-text {
      display: flex;
      flex-direction: column;
      text-align: left;
    }
    .top-pill-score-title {
      font-size: 11px;
      text-transform: lowercase;
      letter-spacing: 0.02em;
      color: #ffffff;
      font-weight: 900;
      line-height: 1.1;
      text-shadow: 0 1px 3px rgba(15, 23, 42, 0.7), 0 0 2px rgba(0, 0, 0, 0.5);
    }
    .top-pill-score-line {
      font-size: 14px;
      font-weight: 900;
      color: #0f274a;
      line-height: 1.1;
      font-variant-numeric: tabular-nums;
      text-shadow: 0 1px 1px rgba(255, 255, 255, 0.6);
    }
    .top-pill-score-line strong {
      color: #d97706;
      font-weight: 900;
      text-shadow: 0 1px 1px rgba(255, 255, 255, 0.5);
    }
    .top-settings-btn {
      pointer-events: auto;
      width: 48px;
      height: 48px;
      border-radius: 18px;
      background: rgba(255, 255, 255, 0.42);
      border: 2.5px solid rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      color: #3b82f6;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15), inset 0 2px 4px rgba(255, 255, 255, 0.9);
      transition: transform 0.15s ease, filter 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
      padding: 0;
    }
    .top-settings-btn:hover {
      transform: scale(1.06);
      border-color: rgba(255, 255, 255, 1);
      box-shadow: 0 10px 28px rgba(0, 0, 0, 0.18), inset 0 2px 4px rgba(255, 255, 255, 1);
    }
    .top-settings-btn:active {
      transform: scale(0.95);
    }
    .top-settings-icon {
      font-size: 26px;
      line-height: 1;
      filter: drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3));
    }

    /* Floating Side Badges */
    .menu-side-widgets {
      position: absolute;
      top: max(100px, calc(env(safe-area-inset-top) + 80px));
      left: max(32px, env(safe-area-inset-left));
      right: max(32px, env(safe-area-inset-right));
      display: flex;
      justify-content: space-between;
      pointer-events: none;
      z-index: 6;
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
      transition: transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
      padding: 0;
    }
    .floating-widget-btn:hover {
      transform: scale(1.08) translateY(-2px);
    }
    .floating-widget-btn:active {
      transform: scale(0.95) translateY(1px);
    }
    .floating-widget-icon-box {
      width: 64px;
      height: 64px;
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      background: rgba(255, 255, 255, 0.42);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 3px solid rgba(255, 255, 255, 0.9);
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.2), inset 0 2px 4px rgba(255, 255, 255, 0.95);
      transition: box-shadow 0.15s ease, border-color 0.15s ease;
      overflow: visible;
    }
    .floating-widget-icon-box::before {
      content: '';
      position: absolute;
      top: 3px;
      left: 6px;
      right: 6px;
      height: 38%;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.05) 100%);
      border-radius: 999px;
      pointer-events: none;
    }
    .floating-widget-icon-box.gift-box,
    .floating-widget-icon-box.quest-box {
      background: rgba(255, 255, 255, 0.42);
      border: 3px solid rgba(255, 255, 255, 0.9);
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.2), inset 0 2px 4px rgba(255, 255, 255, 0.95);
    }
    .floating-widget-icon {
      font-size: 34px;
      line-height: 1;
      filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.25));
      position: relative;
      z-index: 2;
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
      font-weight: 900;
      color: #ffffff;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7), 0 0 6px rgba(0, 0, 0, 0.8);
      letter-spacing: 0.02em;
      white-space: nowrap;
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
      transition: transform 0.12s ease;
    }
    .dock-btn:hover {
      transform: translateY(-2px);
    }
    .dock-btn:active {
      transform: translateY(2px);
    }
    .dock-btn-inner {
      width: 64px;
      height: 64px;
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      background: linear-gradient(180deg, #38d9a9 0%, #06b6d4 50%, #0891b2 100%);
      border: 3.5px solid rgba(255, 255, 255, 0.95);
      box-shadow: 0 8px 0 #0e7490, 0 14px 22px rgba(0, 0, 0, 0.3), inset 0 3px 3px rgba(255, 255, 255, 0.85);
      transition: box-shadow 0.12s ease, transform 0.12s ease, filter 0.12s ease;
      overflow: hidden;
    }
    .dock-btn-inner::before {
      content: '';
      position: absolute;
      top: 3px;
      left: 6px;
      right: 6px;
      height: 35%;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0.05) 100%);
      border-radius: 999px;
      pointer-events: none;
      z-index: 1;
    }
    .dock-btn-teal .dock-btn-inner {
      background: linear-gradient(180deg, #38d9a9 0%, #06b6d4 50%, #0891b2 100%);
      border: 3.5px solid rgba(255, 255, 255, 0.95);
      box-shadow: 0 8px 0 #0e7490, 0 14px 22px rgba(0, 0, 0, 0.3), inset 0 3px 3px rgba(255, 255, 255, 0.85);
    }
    .dock-btn:hover .dock-btn-inner {
      filter: brightness(1.06);
    }
    .dock-btn:active .dock-btn-inner {
      transform: translateY(4px);
      box-shadow: 0 4px 0 #0e7490, 0 6px 12px rgba(0, 0, 0, 0.25);
    }
    .dock-btn-icon {
      font-size: 32px;
      line-height: 1;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.25));
      position: relative;
      z-index: 2;
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
    }

    /* Giant 3D Green PLAY Button */
    .hero-play-btn {
      pointer-events: auto;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 0;
      width: 280px;
      height: 90px;
      border-radius: 34px;
      background: linear-gradient(180deg, #86efac 0%, #4ade80 40%, #22c55e 70%, #16a34a 100%);
      border: 4px solid rgba(255, 255, 255, 0.95);
      box-shadow: 0 10px 0 #15803d, 0 20px 32px rgba(22, 163, 74, 0.4), inset 0 4px 3px rgba(255, 255, 255, 0.9);
      cursor: pointer;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.12s ease, box-shadow 0.12s ease, filter 0.12s ease;
      margin: 0;
      padding: 0;
      z-index: 10;
    }
    .hero-play-btn:hover {
      filter: brightness(1.06);
      transform: translateX(-50%) translateY(-2px);
      box-shadow: 0 12px 0 #15803d, 0 24px 36px rgba(22, 163, 74, 0.45), inset 0 4px 3px rgba(255, 255, 255, 0.95);
    }
    .hero-play-btn:active {
      transform: translateX(-50%) translateY(6px);
      box-shadow: 0 4px 0 #15803d, 0 8px 16px rgba(0, 0, 0, 0.3), inset 0 3px 2px rgba(255, 255, 255, 0.8);
    }
    .hero-play-sheen {
      position: absolute;
      top: 3px;
      left: 12px;
      right: 12px;
      height: 40%;
      border-radius: 999px;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0.08) 100%);
      pointer-events: none;
    }
    .hero-play-text {
      font-size: 38px;
      font-weight: 900;
      letter-spacing: -0.01em;
      color: #ffffff;
      text-shadow: 0 3px 0 #15803d, 0 6px 14px rgba(0, 0, 0, 0.35);
      display: flex;
      align-items: center;
      gap: 10px;
      position: relative;
      z-index: 2;
    }
    .hero-play-arrow {
      font-size: 28px;
      margin-left: 2px;
      text-shadow: 0 3px 0 #15803d, 0 6px 14px rgba(0, 0, 0, 0.35);
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

    .modal-card-gacha { max-height: 90vh; overflow-y: auto; display: flex; flex-direction: column; justify-content: space-between; -webkit-overflow-scrolling: touch; }
    #gacha-modal h2 { font-size: clamp(18px, 4vw, 28px); color: #fbbf24; }
    .modal-card-gacha .menu-stat-pill.gold { display: inline-flex; align-items: center; justify-content: center; gap: 6px; vertical-align: middle; flex-direction: row; align-self: center; margin: 0 auto 16px; font-size: 15px; line-height: 1; }
    .modal-card-gacha .menu-stat-pill.gold strong { font-size: 22px; line-height: 1; display: inline-flex; align-items: center; margin: 0; color: #facc15; }
    .modal-card-gacha .menu-stat-pill.gold span { display: inline-flex; align-items: center; line-height: 1; }
    .gacha-modal-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin: 18px 0; }
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
    #toast-container { position: fixed; top: 88px; right: 24px; display: flex; flex-direction: column; gap: 10px; z-index: 60; pointer-events: none; max-width: 340px; }
    .toast-item { background: rgba(15, 23, 42, 0.94); border: 2px solid #f59e0b; border-radius: 16px; padding: 12px 16px; color: #f8fafc; box-shadow: 0 12px 30px rgba(0, 0, 0, 0.45); display: flex; align-items: center; gap: 12px; animation: toastIn 0.28s ease-out; backdrop-filter: blur(10px); }
    .toast-icon { font-size: 26px; line-height: 1; }
    .toast-title { font-size: 13px; font-weight: 900; color: #fbbf24; text-transform: uppercase; letter-spacing: 0.04em; }
    .toast-desc { font-size: 12px; color: #e2e8f0; margin-top: 2px; font-weight: 600; }
    @keyframes toastIn { from { opacity: 0; transform: translateX(30px) scale(0.95); } to { opacity: 1; transform: translateX(0) scale(1); } }

    /* Settings Modal Styles & Range Slider Support */
    .settings-group { background: #0f172a; border: 2px solid #334155; border-radius: 16px; padding: 16px 20px; margin: 20px 0; display: flex; flex-direction: column; gap: 14px; text-align: left; }
    .settings-row { display: flex; justify-content: space-between; align-items: center; gap: 12px; min-height: 36px; }
    .settings-label { font-size: 15px; font-weight: 700; color: #f8fafc; }
    .settings-subtext { font-size: 12px; color: #94a3b8; margin-top: 2px; }
    .switch { position: relative; display: inline-block; width: 50px; height: 28px; flex-shrink: 0; margin: 2px; }
    .switch input { opacity: 0; width: 0; height: 0; }
    .slider { position: absolute; cursor: pointer; inset: 0; background-color: #334155; transition: .2s ease; border-radius: 28px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.3); }
    .slider:before { position: absolute; content: ""; height: 20px; width: 20px; left: 4px; bottom: 4px; background-color: white; transition: .2s ease; border-radius: 50%; box-shadow: 0 2px 5px rgba(0,0,0,0.3); }
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

      .modal-card-gacha { max-height: 90vh !important; padding: 16px 14px !important; }
      .gacha-modal-grid { gap: 6px; margin: 8px 0; }
      .gacha-skin-card { padding: 8px 6px; }
      .gacha-skin-badge { font-size: 24px; margin: 2px 0; }
      .gacha-skin-name { font-size: 11px; }

      .settings-group { padding: 12px 14px; margin: 14px 0; gap: 10px; }
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
      .top-pill { padding: 5px 10px; border-width: 2px; }
      .top-pill-icon { font-size: 22px; }
      .top-pill-val { font-size: 16px; }
      .top-pill-score { padding: 5px 12px; gap: 6px; }
      .top-pill-crown-box { width: 24px; height: 24px; font-size: 15px; }
      .top-pill-score-title { font-size: 9px; }
      .top-pill-score-line { font-size: 12px; }
      .top-settings-btn { width: 40px; height: 40px; border-radius: 14px; border-width: 2px; }
      .top-settings-icon { font-size: 22px; }
      .menu-side-widgets {
        top: max(100px, calc(env(safe-area-inset-top) + 80px));
        left: max(16px, env(safe-area-inset-left));
        right: max(16px, env(safe-area-inset-right));
      }
      .floating-widget-icon-box { width: 52px; height: 52px; border-radius: 16px; border-width: 2.5px; }
      .floating-widget-icon { font-size: 28px; }
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
        border-radius: 16px;
        border-width: 2.5px;
        box-shadow: 0 5px 0 #0e7490, 0 10px 16px rgba(0, 0, 0, 0.25), inset 0 2px 2px rgba(255, 255, 255, 0.85);
      }
      .dock-btn:active .dock-btn-inner {
        box-shadow: 0 2px 0 #0e7490, 0 4px 6px rgba(0, 0, 0, 0.25);
        transform: translateY(3px);
      }
      .dock-btn-icon {
        font-size: 24px;
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
      .hero-play-btn {
        position: static;
        transform: none;
        flex: 1;
        width: auto;
        min-width: 130px;
        max-width: 220px;
        height: 74px;
        margin: 0;
        border-radius: 26px;
        border-width: 3.5px;
        box-shadow: 0 7px 0 #15803d, 0 14px 24px rgba(22, 163, 74, 0.4), inset 0 3px 2px rgba(255, 255, 255, 0.9);
      }
      .hero-play-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 9px 0 #15803d, 0 18px 28px rgba(22, 163, 74, 0.45), inset 0 3px 2px rgba(255, 255, 255, 0.9);
      }
      .hero-play-btn:active {
        transform: translateY(4px);
        box-shadow: 0 3px 0 #15803d, 0 6px 12px rgba(22, 163, 74, 0.3), inset 0 2px 1px rgba(255, 255, 255, 0.7);
      }
      .hero-play-text {
        font-size: 28px;
        gap: 6px;
        text-shadow: 0 2.5px 0 #15803d, 0 5px 10px rgba(0, 0, 0, 0.35);
      }
      .hero-play-arrow {
        font-size: 20px;
        text-shadow: 0 2.5px 0 #15803d, 0 5px 10px rgba(0, 0, 0, 0.35);
      }
      #menu-dev-btn {
        bottom: max(165px, calc(env(safe-area-inset-bottom) + 165px)) !important;
        left: max(16px, env(safe-area-inset-left)) !important;
      }
    }
  </style>
</head>
<body>
  <div id="game-container"></div>
  <div id="warning-vignette"></div>
  <div id="toast-container"></div>

  <!-- Minimal In-Game HUD: Coins and Distance + Pause Button -->
  <div id="in-game-hud" class="hud hidden">
    <div class="hud-stats">
      <div class="score-card">
        <div class="score-label">Пройденный путь</div>
        <div id="score-value" class="score-number">0</div>
      </div>
      <div class="score-card">
        <div class="score-label">Монеты 🪙</div>
        <div id="coins-value" class="score-number coins-number">0</div>
      </div>
    </div>

    <div class="hud-actions">
      <button id="pause-btn" class="hud-circle-btn" title="Пауза">⏸</button>
    </div>
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
          <span class="top-pill-icon">🪙</span>
          <span id="menu-coins" class="top-pill-val">0</span>
          <button id="menu-coins-plus-btn" class="top-pill-plus" title="Пополнить / Магазин">+</button>
        </div>

        <!-- Рекорд -->
        <div class="top-pill top-pill-score" title="Ваш рекорд">
          <div class="top-pill-crown-box">👑</div>
          <div class="top-pill-score-text">
            <span class="top-pill-score-title">high score</span>
            <span class="top-pill-score-line">BEST: <strong id="menu-high-score">0</strong></span>
          </div>
        </div>
      </div>

      <!-- Справа у самого края экрана: Кнопка Настройки -->
      <div class="menu-top-right">
        <button id="menu-settings-btn" class="top-settings-btn" title="Настройки">
          <span class="top-settings-icon">⚙</span>
        </button>
      </div>
    </div>

    <!-- Боковые плавающие виджеты наград (Floating Side Widgets) -->
    <div class="menu-side-widgets">
      <!-- Левый виджет: Ежедневный подарок -->
      <div class="floating-widget-left">
        <button id="menu-daily-btn" class="floating-widget-btn" title="Ежедневный бонус">
          <div class="floating-widget-icon-box gift-box">
            <span class="floating-widget-icon">🎁</span>
            <span id="menu-daily-badge" class="floating-widget-alert-badge pulse-badge">!</span>
          </div>
          <span class="floating-widget-label">Daily Gift</span>
        </button>
      </div>

      <!-- Правый виджет: Задания дня -->
      <div class="floating-widget-right">
        <button id="menu-daily-quests-btn" class="floating-widget-btn" title="Задания дня">
          <div class="floating-widget-icon-box quest-box">
            <span class="floating-widget-icon">📋</span>
            <span id="menu-daily-quests-badge" class="floating-widget-count-badge hidden">0/3</span>
          </div>
          <span class="floating-widget-label">🎯 Задания дня</span>
        </button>
      </div>
    </div>

    <!-- Нижняя навигационная панель (Bottom Hero Dock) -->
    <div class="menu-bottom-dock">
      <!-- Левая колонка кнопок (Скины и Магазин) -->
      <div class="dock-col dock-col-left">
        <button id="menu-skins-btn" class="dock-btn dock-btn-teal" title="Скины">
          <div class="dock-btn-inner">
            <span class="dock-btn-icon">🦊</span>
          </div>
          <span class="dock-btn-label">Skins</span>
        </button>
        <button id="menu-gacha-btn" class="dock-btn dock-btn-teal" title="🎰 Автомат скинов">
          <div class="dock-btn-inner">
            <span class="dock-btn-icon">🛒</span>
          </div>
          <span class="dock-btn-label">Shop</span>
          <span style="display: none;">🎰 Автомат скинов</span>
        </button>
      </div>

      <!-- Центральная гигантская кнопка ИГРАТЬ (Hero PLAY Button) -->
      <button id="menu-play-btn" class="hero-play-btn" title="Начать игру">
        <div class="hero-play-sheen"></div>
        <span class="hero-play-text">PLAY <span class="hero-play-arrow">▶</span></span>
      </button>

      <!-- Правая колонка кнопок (Лидерборд и Достижения) -->
      <div class="dock-col dock-col-right">
        <button id="menu-leaderboard-btn" class="dock-btn dock-btn-teal" title="Таблица лидеров">
          <div class="dock-btn-inner">
            <span class="dock-btn-icon">🏆</span>
          </div>
          <span class="dock-btn-label">Leaderboard</span>
        </button>
        <button id="menu-achievements-btn" class="dock-btn dock-btn-teal" title="Достижения">
          <div class="dock-btn-inner">
            <span class="dock-btn-icon">🎖</span>
            <span id="menu-achievements-badge" class="dock-badge hidden">0/10</span>
          </div>
          <span class="dock-btn-label">Achievements</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Меню паузы (Pause Modal) -->
  <div id="pause-modal" class="modal hidden">
    <div class="modal-card">
      <h2 style="color: #38bdf8;">⏸ ПАУЗА</h2>
      <p>Игра приостановлена. Выберите действие:</p>

      <div class="menu-btn-stack">
        <button id="pause-resume-btn" class="menu-btn menu-btn-primary">▶ Продолжить</button>
        <button id="pause-settings-btn" class="menu-btn menu-btn-slate">⚙ Настройки</button>
        <button id="pause-menu-btn" class="menu-btn menu-btn-secondary">🏠 Главное меню</button>
      </div>
    </div>
  </div>

  <!-- Окно настроек (Settings Modal) -->
  <div id="settings-modal" class="modal hidden">
    <div class="modal-card">
      <h2 style="color: #94a3b8;">⚙ НАСТРОЙКИ</h2>
      <p>Параметры звука, музыки и управления</p>

      <div class="settings-group">
        <div class="settings-row">
          <div>
            <div class="settings-label">Звуковые эффекты</div>
            <div class="settings-subtext">Синтезатор прыжков, монет, поездов и аварий</div>
          </div>
          <label class="switch">
            <input type="checkbox" id="setting-sound-toggle" checked>
            <span class="slider"></span>
          </label>
        </div>
        <div class="settings-row">
          <div>
            <div class="settings-label">Фоновая музыка</div>
            <div class="settings-subtext">Динамический ретро-саундтрек во время игры</div>
          </div>
          <label class="switch">
            <input type="checkbox" id="setting-music-toggle" checked>
            <span class="slider"></span>
          </label>
        </div>
      </div>

      <button id="settings-close-btn" class="menu-btn menu-btn-primary">Готово</button>
    </div>
  </div>

  <!-- Модальное окно Автомата скинов -->
  <div id="gacha-modal" class="modal hidden">
    <div class="modal-card modal-card-gacha">
      <h2 style="color: #fbbf24;">🎰 АВТОМАТ СКИНОВ</h2>
      <p>Испытайте удачу и откройте новые воксельные скины!</p>

      <div class="menu-stat-pill gold" style="display: inline-flex; align-items: center; justify-content: center; gap: 6px; vertical-align: middle; margin: 0 auto 16px; align-self: center;">
        <span style="display: inline-flex; align-items: center; line-height: 1;">Ваш баланс:</span>
        <strong id="gacha-modal-coins" style="display: inline-flex; align-items: center; line-height: 1; margin: 0;">0</strong>
        <span style="display: inline-flex; align-items: center; line-height: 1;">🪙</span>
      </div>

      <div id="gacha-modal-skin-list" class="gacha-modal-grid"></div>

      <div class="menu-btn-stack">
        <button id="gacha-modal-roll-btn" class="menu-btn menu-btn-amber">100 🪙</button>
        <button id="gacha-modal-close-btn" class="menu-btn menu-btn-secondary">Закрыть</button>
      </div>
    </div>
  </div>

  <!-- Модальное окно Таблицы лидеров -->
  <div id="leaderboard-modal" class="modal hidden">
    <div class="modal-card modal-card-leaderboard">
      <span class="placeholder-badge">LIVE ТОП ЗАБЕГОВ</span>
      <h2 style="color: #c084fc;">🏆 ТАБЛИЦА ЛИДЕРОВ</h2>
      <p class="lb-desc">Введите своё имя и соревнуйтесь за первое место в рейтинге лучших забегов!</p>

      <div class="lb-name-form">
        <input type="text" id="leaderboard-name-input" class="lb-name-input" maxlength="18" placeholder="Ваше имя игрока..." value="Игрок" />
        <button id="leaderboard-save-name-btn" class="lb-save-btn">Сохранить</button>
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

      <button id="leaderboard-close-btn" class="menu-btn menu-btn-secondary">Закрыть</button>
    </div>
  </div>

  <!-- Модальное окно Достижений (Achievements Modal) -->
  <div id="achievements-modal" class="modal hidden">
    <div class="modal-card modal-card-achievements">
      <h2 style="color: #34d399;">🏅 ДОСТИЖЕНИЯ</h2>
      <p class="ach-desc-main">Выполняйте испытания и открывайте новые награды!</p>

      <div class="ach-summary-card">
        <div class="ach-summary-header">
          <span>ОБЩИЙ ПРОГРЕСС</span>
          <strong id="ach-summary-text">0 из 10 (0%)</strong>
        </div>
        <div class="ach-progress-bar-bg">
          <div id="ach-summary-bar" class="ach-progress-bar-fill gold" style="width: 0%;"></div>
        </div>
      </div>

      <div id="achievements-list" class="achievements-list-box"></div>

      <button id="achievements-close-btn" class="menu-btn menu-btn-secondary">Закрыть</button>
    </div>
  </div>

  <!-- Модальное окно Ежедневного бонуса (Daily Bonus Modal) -->
  <div id="daily-bonus-modal" class="modal hidden">
    <div class="modal-card modal-card-daily">
      <h2 style="color: #fbbf24;">🎁 ЕЖЕДНЕВНЫЙ БОНУС</h2>
      <p style="margin-bottom: 12px;">Заходите каждый день и собирайте ценные награды!</p>

      <div class="daily-streak-pill">
        🔥 <span id="daily-streak-text">Серия: 1 день</span>
      </div>

      <div id="daily-bonus-grid" class="daily-grid"></div>

      <div id="daily-timer-box" class="daily-timer-box hidden">
        Следующий бонус через: <strong id="daily-timer-val">00:00:00</strong>
      </div>

      <div class="menu-btn-stack">
        <button id="daily-claim-btn" class="menu-btn menu-btn-primary">Забрать награду</button>
        <button id="daily-double-btn" class="menu-btn menu-btn-purple">🎬 Забрать x2 за рекламу</button>
        <button id="daily-close-btn" class="menu-btn menu-btn-secondary">Закрыть</button>
      </div>
    </div>
  </div>

  <!-- Модальное окно Ежедневных заданий (Daily Quests Modal) -->
  <div id="daily-quests-modal" class="modal hidden">
    <div class="modal-card modal-card-quests">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
        <h2 style="color: #fbbf24; margin: 0;">🎯 ЕЖЕДНЕВНЫЕ ЗАДАНИЯ</h2>
        <div class="menu-stat-pill gold" style="display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; font-size: 13px; margin: 0;">
          <strong id="quests-coins-val">0</strong> 🪙
        </div>
      </div>
      <p style="margin-bottom: 12px;">Выполняйте испытания дня и получайте монеты!</p>

      <div class="quest-timer-box">
        До обновления: <span id="quests-timer-val">00:00:00</span>
      </div>

      <div class="quest-summary-card">
        <div class="quest-summary-header">
          <span>ПРОГРЕСС ДНЯ</span>
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
            <div class="quest-super-title">СУПЕР-ПРИЗ ДНЯ</div>
            <div class="quest-super-desc">Выполните все 3 задания: <strong style="color: #facc15;">+100 🪙</strong></div>
          </div>
        </div>
        <div class="quest-super-actions">
          <button id="quests-claim-bonus-btn" class="quest-btn quest-super-btn" disabled>Забрать 100 🪙</button>
          <button id="quests-claim-bonus-x2-btn" class="quest-btn quest-super-btn quest-btn-purple" style="display: none;">🎬 Забрать x2 за рекламу</button>
        </div>
      </div>

      <button id="quests-close-btn" class="menu-btn menu-btn-secondary" style="margin-top: 14px;">Закрыть</button>
    </div>
  </div>

  <!-- Экран Game Over -->
  <div id="game-over-modal" class="modal hidden">
    <div class="modal-card">
      <h2>Игра окончена!</h2>
      <p id="death-reason">Вас сбил автомобиль!</p>

      <div class="game-over-score-card">
        <div class="game-over-score-item">
          <span class="game-over-score-label">СЧЁТ</span>
          <span id="game-over-score-val" class="game-over-score-num">0</span>
        </div>
        <div class="game-over-score-item">
          <span class="game-over-score-label">РЕКОРД</span>
          <span id="game-over-best-val" class="game-over-score-num">0</span>
        </div>
      </div>

      <div class="menu-btn-stack">
        <button id="restart-btn" class="menu-btn menu-btn-primary">Играть снова</button>
        <button id="to-menu-btn" class="menu-btn menu-btn-secondary">Главное меню</button>
      </div>
    </div>
  </div>

  <!-- Кнопка вызова DEV-панели -->
  <button id="menu-dev-btn" class="hud-circle-btn" style="position: fixed; bottom: max(200px, calc(env(safe-area-inset-bottom) + 200px)); left: max(24px, env(safe-area-inset-left)); z-index: 100; font-size: 13px; width: auto; padding: 0 12px; height: 38px; border-radius: 12px; background: rgba(15, 23, 42, 0.9); border: 2px solid #38bdf8; color: #38bdf8; font-weight: 800; display: flex; align-items: center; gap: 6px; cursor: pointer; pointer-events: auto;" title="Панель разработчика">🛠️ DEV</button>

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
  'src/view/urbanVehicles.ts',
  'src/view/urbanEnvironment.ts',
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
