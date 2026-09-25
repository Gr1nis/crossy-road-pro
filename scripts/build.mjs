import fs from 'node:fs';
import path from 'node:path';
import { stripTypeScriptTypes } from 'node:module';

const ROOT = process.cwd();

const moduleOrder = [
  'src/core/types.ts',
  'src/core/prng.ts',
  'src/core/collision.ts',
  'src/core/scoreTracker.ts',
  'src/core/laneGenerator.ts',
  'src/core/gameEngine.ts',
  'src/view/audioSynth.ts',
  'src/view/meshFactory.ts',
  'src/view/sceneManager.ts',
  'src/main.ts',
];

let combinedJs = `import * as THREE from 'https://unpkg.com/three@0.170.0/build/three.module.js';\n\n`;

for (const relPath of moduleOrder) {
  const fullPath = path.join(ROOT, relPath);
  const tsSource = fs.readFileSync(fullPath, 'utf8');
  let jsCode = stripTypeScriptTypes(tsSource);

  jsCode = jsCode
    .replace(/^\s*import\s+[\s\S]*?from\s+['"][^'"]+['"];?\s*$/gm, '')
    .replace(/^\s*export\s+(class|function|const)/gm, '$1');

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
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Crossy Road 3D — Vibe-Pro Edition</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
    body, html { width: 100%; height: 100%; overflow: hidden; font-family: 'Segoe UI', system-ui, sans-serif; background: #87ceeb; }
    #game-container { width: 100%; height: 100%; position: relative; }
    .hud { position: fixed; top: 20px; left: 24px; right: 24px; display: flex; justify-content: space-between; align-items: flex-start; pointer-events: none; z-index: 10; gap: 14px; }
    .hud-stats { display: flex; gap: 12px; }
    .score-card { background: rgba(15, 23, 42, 0.82); backdrop-filter: blur(8px); border: 2px solid rgba(255, 255, 255, 0.2); padding: 10px 18px; border-radius: 14px; color: #fff; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25); }
    .score-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #94a3b8; font-weight: 700; }
    .score-number { font-size: 30px; font-weight: 900; line-height: 1.1; color: #38bdf8; }
    .high-score-number { color: #fbbf24; }
    .coins-number { color: #facc15; }
    .gacha-panel { pointer-events: auto; background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(8px); border: 2px solid rgba(255, 255, 255, 0.22); border-radius: 14px; padding: 10px 14px; color: #fff; display: flex; flex-direction: column; gap: 8px; min-width: 280px; }
    .gacha-btn { background: linear-gradient(135deg, #f59e0b, #ea580c); color: #fff; border: none; padding: 8px 14px; border-radius: 10px; font-weight: 800; font-size: 14px; cursor: pointer; }
    .gacha-btn:hover { filter: brightness(1.1); }
    .gacha-status { font-size: 12px; color: #fde047; font-weight: 600; min-height: 16px; }
    .skin-list { display: flex; flex-wrap: wrap; gap: 6px; }
    .skin-btn { background: #1e293b; border: 1px solid #475569; color: #e2e8f0; border-radius: 8px; padding: 5px 9px; font-size: 12px; font-weight: 700; cursor: pointer; }
    .skin-btn.active { border-color: #38bdf8; background: #0284c7; color: #fff; }
    .skin-btn.locked { opacity: 0.45; cursor: not-allowed; }
    .modal { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.72); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; z-index: 30; }
    .modal.hidden { display: none; }
    .modal-card { background: #1e293b; border: 2px solid #334155; border-radius: 20px; padding: 32px 40px; text-align: center; color: #f8fafc; max-width: 420px; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5); }
    .modal-card h2 { font-size: 28px; color: #f87171; margin-bottom: 8px; }
    .modal-card p { color: #cbd5e1; margin-bottom: 24px; font-size: 16px; }
    .restart-btn { background: linear-gradient(135deg, #38bdf8, #2563eb); color: #fff; border: none; padding: 14px 32px; font-size: 17px; font-weight: 700; border-radius: 12px; cursor: pointer; }
    .info-links { position: fixed; bottom: 20px; left: 24px; display: flex; gap: 10px; z-index: 15; }
    .info-link { background: rgba(15, 23, 42, 0.8); border: 2px solid rgba(255, 255, 255, 0.2); padding: 8px 14px; border-radius: 12px; color: #e2e8f0; text-decoration: none; font-size: 13px; font-weight: 700; }
  </style>
</head>
<body>
  <div id="game-container"></div>

  <div class="hud">
    <div class="hud-stats">
      <div class="score-card">
        <div class="score-label">Счёт</div>
        <div id="score-value" class="score-number">0</div>
      </div>
      <div class="score-card">
        <div class="score-label">Рекорд</div>
        <div id="high-score-value" class="score-number high-score-number">0</div>
      </div>
      <div class="score-card">
        <div class="score-label">Монеты 🪙</div>
        <div id="coins-value" class="score-number coins-number">0</div>
      </div>
      <div class="score-card">
        <div class="score-label">Ритм-Комбо</div>
        <div id="combo-value" class="score-number">x1</div>
      </div>
    </div>

    <div class="gacha-panel">
      <button id="gacha-btn" class="gacha-btn">🎰 Гача (10 🪙) [G]</button>
      <div id="gacha-status" class="gacha-status">Управление: WASD / Стрелки / Space | [1-4] Скины</div>
      <div id="skin-list" class="skin-list"></div>
    </div>
  </div>

  <div class="info-links">
    <a class="info-link" href="./crossy_road_plan.html" target="_blank" rel="noopener">📐 Архитектура (Plan)</a>
    <a class="info-link" href="https://github.com/Gr1nis/crossy-road-pro" target="_blank" rel="noopener">🐙 GitHub</a>
  </div>

  <div id="game-over-modal" class="modal hidden">
    <div class="modal-card">
      <h2>Игра окончена!</h2>
      <p id="death-reason">Вас сбил автомобиль!</p>
      <button id="restart-btn" class="restart-btn">Играть снова (Space)</button>
    </div>
  </div>

  <script type="module">
${combinedJs}
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(ROOT, 'index.html'), htmlContent, 'utf8');
console.log('Build complete: index.html and dist/bundle.js generated successfully.');
