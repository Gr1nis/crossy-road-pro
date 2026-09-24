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

  // Remove local relative imports and THREE imports (hoisted to top)
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
    body, html {
      width: 100%;
      height: 100%;
      overflow: hidden;
      font-family: 'Segoe UI', system-ui, sans-serif;
      background: #87ceeb;
    }
    #game-container {
      width: 100%;
      height: 100%;
      position: relative;
    }
    .hud {
      position: fixed;
      top: 20px;
      left: 24px;
      right: 24px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      pointer-events: none;
      z-index: 10;
    }
    .score-card {
      background: rgba(15, 23, 42, 0.78);
      backdrop-filter: blur(8px);
      border: 2px solid rgba(255, 255, 255, 0.2);
      padding: 10px 22px;
      border-radius: 14px;
      color: #fff;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
    }
    .score-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #94a3b8;
      font-weight: 700;
    }
    .score-number {
      font-size: 36px;
      font-weight: 900;
      line-height: 1.1;
      color: #38bdf8;
    }
    .high-score-number {
      color: #fbbf24;
    }
    .controls-pad {
      position: fixed;
      bottom: 24px;
      right: 24px;
      display: grid;
      grid-template-columns: repeat(3, 54px);
      grid-template-rows: repeat(2, 54px);
      gap: 8px;
      z-index: 15;
    }
    .pad-btn {
      background: rgba(15, 23, 42, 0.8);
      border: 2px solid rgba(255, 255, 255, 0.28);
      border-radius: 12px;
      color: #fff;
      font-size: 20px;
      font-weight: 800;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.08s ease, background 0.15s;
    }
    .pad-btn:active {
      transform: scale(0.92);
      background: rgba(56, 189, 248, 0.85);
    }
    .modal {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.72);
      backdrop-filter: blur(6px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 30;
    }
    .modal.hidden {
      display: none;
    }
    .modal-card {
      background: #1e293b;
      border: 2px solid #334155;
      border-radius: 20px;
      padding: 32px 40px;
      text-align: center;
      color: #f8fafc;
      max-width: 420px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
    }
    .modal-card h2 {
      font-size: 28px;
      color: #f87171;
      margin-bottom: 8px;
    }
    .modal-card p {
      color: #cbd5e1;
      margin-bottom: 24px;
      font-size: 16px;
    }
    .restart-btn {
      background: linear-gradient(135deg, #38bdf8, #2563eb);
      color: #fff;
      border: none;
      padding: 14px 32px;
      font-size: 17px;
      font-weight: 700;
      border-radius: 12px;
      cursor: pointer;
      box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
    }
    .restart-btn:hover {
      filter: brightness(1.1);
    }
  </style>
</head>
<body>
  <div id="game-container"></div>

  <div class="hud">
    <div class="score-card">
      <div class="score-label">Счёт (Score)</div>
      <div id="score-value" class="score-number">0</div>
    </div>
    <div class="score-card">
      <div class="score-label">Рекорд (High Score)</div>
      <div id="high-score-value" class="score-number high-score-number">0</div>
    </div>
  </div>

  <div class="controls-pad">
    <div></div>
    <button class="pad-btn" data-move="FORWARD" title="Вперёд (W / Up)">▲</button>
    <div></div>
    <button class="pad-btn" data-move="LEFT" title="Влево (A / Left)">◀</button>
    <button class="pad-btn" data-move="BACKWARD" title="Назад (S / Down)">▼</button>
    <button class="pad-btn" data-move="RIGHT" title="Вправо (D / Right)">▶</button>
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
