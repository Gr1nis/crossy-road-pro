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
  'src/core/scoreTracker.ts',
  'src/core/laneGenerator.ts',
  'src/core/gameEngine.ts',
  'src/view/audioSynth.ts',
  'src/view/meshFactory.ts',
  'src/view/sceneManager.ts',
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
  <title>Crossy Road 3D — Vibe-Pro Edition</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; -webkit-user-select: none; }
    body, html { width: 100%; height: 100%; overflow: hidden; font-family: 'Segoe UI', system-ui, sans-serif; background: #87ceeb; touch-action: none; -webkit-touch-callout: none; }
    #game-container { width: 100%; height: 100%; position: relative; touch-action: none; }
    
    /* Clean Minimal In-Game HUD: Coins, Distance & Pause button only */
    .hud { position: fixed; top: max(16px, env(safe-area-inset-top)); left: max(16px, env(safe-area-inset-left)); right: max(16px, env(safe-area-inset-right)); display: flex; justify-content: space-between; align-items: flex-start; pointer-events: none; z-index: 10; }
    .hud-stats { display: flex; gap: 14px; }
    .score-card { background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(10px); border: 2px solid rgba(255, 255, 255, 0.22); padding: 10px 22px; border-radius: 16px; color: #fff; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3); }
    .score-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #94a3b8; font-weight: 800; }
    .score-number { font-size: 32px; font-weight: 900; line-height: 1.1; color: #38bdf8; }
    .coins-number { color: #facc15; }
    
    .hud-actions { pointer-events: auto; }
    .hud-circle-btn { width: 48px; height: 48px; border-radius: 14px; background: rgba(15, 23, 42, 0.85); border: 2px solid rgba(255, 255, 255, 0.25); color: #fff; font-size: 18px; font-weight: 900; cursor: pointer; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(8px); transition: transform 0.1s ease, filter 0.1s; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3); }
    .hud-circle-btn:hover { filter: brightness(1.2); transform: scale(1.05); }
    .hud-circle-btn:active { transform: scale(0.95); }

    /* Danger vignette at bottom when player crosses edge */
    #warning-vignette { position: fixed; inset: 0; pointer-events: none; z-index: 5; opacity: 0; background: linear-gradient(to top, rgba(239, 68, 68, 0.65) 0%, rgba(239, 68, 68, 0.2) 20%, transparent 45%); transition: opacity 0.15s ease-out; }

    .modal { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.78); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 30; }
    .modal.hidden { display: none !important; }
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
    .menu-btn-amber { background: linear-gradient(135deg, #f59e0b, #ea580c); color: #fff; }
    .menu-btn-purple { background: linear-gradient(135deg, #8b5cf6, #6366f1); color: #fff; }
    .menu-btn-slate { background: linear-gradient(135deg, #475569, #334155); color: #f8fafc; }
    .menu-btn-secondary { background: #334155; color: #e2e8f0; }

    .modal-card-gacha { max-height: 90vh; overflow-y: auto; display: flex; flex-direction: column; justify-content: space-between; -webkit-overflow-scrolling: touch; }
    #gacha-modal h2 { font-size: clamp(18px, 4vw, 28px); color: #fbbf24; }
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

    .info-links { position: fixed; bottom: 20px; left: 24px; display: flex; gap: 10px; z-index: 15; }
    .info-link { background: rgba(15, 23, 42, 0.8); border: 2px solid rgba(255, 255, 255, 0.2); padding: 8px 14px; border-radius: 12px; color: #e2e8f0; text-decoration: none; font-size: 13px; font-weight: 700; }

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

      .info-links { display: none; }
    }
  </style>
</head>
<body>
  <div id="game-container"></div>
  <div id="warning-vignette"></div>
  <div id="toast-container"></div>

  <!-- Minimal In-Game HUD: Coins and Distance + Pause Button -->
  <div class="hud">
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

  <div class="info-links">
    <a class="info-link" href="./crossy_road_plan.html" target="_blank" rel="noopener">📐 Архитектура (Plan)</a>
    <a class="info-link" href="https://github.com/Gr1nis/crossy-road-pro" target="_blank" rel="noopener">🐙 GitHub</a>
  </div>

  <!-- Главное меню (Main Menu Modal) -->
  <div id="main-menu-modal" class="modal">
    <div class="modal-card">
      <h1>CROSSY ROAD</h1>
      <p>Классическая воксельная аркада с поездами, реками и скинами</p>

      <div class="menu-stats-row">
        <div class="menu-stat-pill">
          <span class="menu-stat-title">РЕКОРД</span>
          <strong id="menu-high-score" class="menu-stat-val">0</strong>
        </div>
        <div class="menu-stat-pill gold">
          <span class="menu-stat-title">МОНЕТЫ</span>
          <strong id="menu-coins" class="menu-stat-val">0</strong>
        </div>
      </div>

      <div class="menu-btn-stack">
        <button id="menu-play-btn" class="menu-btn menu-btn-primary">▶ Начать игру</button>
        <button id="menu-gacha-btn" class="menu-btn menu-btn-amber">🎰 ГАЧА-АВТОМАТ</button>
        <button id="menu-leaderboard-btn" class="menu-btn menu-btn-purple">🏆 Таблица лидеров</button>
        <button id="menu-settings-btn" class="menu-btn menu-btn-slate">⚙ Настройки</button>
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
        <button id="pause-menu-btn" class="menu-btn menu-btn-secondary">🏠 Обратно в главное меню</button>
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

  <!-- Модальное окно Гача-автомата -->
  <div id="gacha-modal" class="modal hidden">
    <div class="modal-card modal-card-gacha">
      <h2 style="color: #fbbf24;">🎰 ГАЧА-АВТОМАТ</h2>
      <p>Испытайте удачу и откройте новые воксельные скины!</p>

      <div class="menu-stat-pill gold" style="display: inline-block; margin-bottom: 12px;">
        Ваш баланс: <strong id="gacha-modal-coins">0</strong> 🪙
      </div>

      <div id="gacha-modal-status" class="gacha-status" style="margin-bottom: 8px;">1 прокрут = 100 монет</div>

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

  <!-- Экран Game Over -->
  <div id="game-over-modal" class="modal hidden">
    <div class="modal-card">
      <h2>Игра окончена!</h2>
      <p id="death-reason">Вас сбил автомобиль!</p>
      <div class="menu-btn-stack">
        <button id="restart-btn" class="menu-btn menu-btn-primary">Играть снова</button>
        <button id="to-menu-btn" class="menu-btn menu-btn-secondary">Главное меню</button>
      </div>
    </div>
  </div>

  <script type="module">
${combinedJs}
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(ROOT, 'index.html'), htmlContent, 'utf8');
console.log('Build complete: index.html and dist/bundle.js generated successfully.');
