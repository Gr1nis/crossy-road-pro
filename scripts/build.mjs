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
    .gacha-btn { background: linear-gradient(135deg, #f59e0b, #ea580c); color: #fff; border: none; padding: 8px 14px; border-radius: 10px; font-weight: 800; font-size: 14px; cursor: pointer; transition: transform 0.1s ease, filter 0.1s; }
    .gacha-btn:hover { filter: brightness(1.1); transform: translateY(-1px); }
    .gacha-status { font-size: 12px; color: #fde047; font-weight: 600; min-height: 16px; }
    .skin-list { display: flex; flex-wrap: wrap; gap: 6px; }
    .skin-btn { background: #1e293b; border: 1px solid #475569; color: #e2e8f0; border-radius: 8px; padding: 5px 9px; font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.1s ease; }
    .skin-btn.active { border-color: #38bdf8; background: #0284c7; color: #fff; box-shadow: 0 0 10px rgba(56, 189, 248, 0.4); }
    .skin-btn.locked { opacity: 0.45; cursor: not-allowed; }
    
    .modal { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.78); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 30; }
    .modal.hidden { display: none !important; }
    .modal-card { background: #1e293b; border: 2px solid #334155; border-radius: 24px; padding: 36px 40px; text-align: center; color: #f8fafc; max-width: 460px; width: 90%; box-shadow: 0 24px 60px rgba(0, 0, 0, 0.6); position: relative; }
    .modal-card h1 { font-size: 36px; font-weight: 900; color: #38bdf8; margin-bottom: 6px; letter-spacing: -0.02em; text-shadow: 0 4px 12px rgba(56, 189, 248, 0.3); }
    .modal-card h2 { font-size: 26px; color: #f87171; margin-bottom: 8px; }
    .modal-card p { color: #cbd5e1; margin-bottom: 24px; font-size: 15px; line-height: 1.5; }
    
    .menu-stats-row { display: flex; justify-content: center; gap: 16px; margin: 18px 0 24px; }
    .menu-stat-pill { background: rgba(15, 23, 42, 0.6); border: 1px solid #334155; border-radius: 12px; padding: 8px 16px; font-size: 13px; color: #94a3b8; font-weight: 700; }
    .menu-stat-pill strong { color: #f8fafc; font-size: 15px; margin-left: 4px; }
    .menu-stat-pill.gold strong { color: #facc15; }
    
    .menu-btn-stack { display: flex; flex-direction: column; gap: 12px; }
    .menu-btn { width: 100%; border: none; padding: 15px 24px; font-size: 17px; font-weight: 800; border-radius: 14px; cursor: pointer; transition: transform 0.1s ease, filter 0.1s; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3); }
    .menu-btn:hover { filter: brightness(1.1); transform: translateY(-2px); }
    .menu-btn:active { transform: translateY(0); }
    .menu-btn-primary { background: linear-gradient(135deg, #10b981, #059669); color: #fff; font-size: 19px; }
    .menu-btn-amber { background: linear-gradient(135deg, #f59e0b, #ea580c); color: #fff; }
    .menu-btn-purple { background: linear-gradient(135deg, #8b5cf6, #6366f1); color: #fff; }
    .menu-btn-secondary { background: #334155; color: #e2e8f0; }

    .gacha-modal-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin: 18px 0; }
    .gacha-skin-card { background: #0f172a; border: 2px solid #334155; border-radius: 14px; padding: 12px 10px; text-align: center; cursor: pointer; transition: all 0.15s ease; }
    .gacha-skin-card:hover:not(.locked) { border-color: #38bdf8; transform: translateY(-2px); }
    .gacha-skin-card.active { border-color: #38bdf8; background: rgba(56, 189, 248, 0.12); box-shadow: 0 0 14px rgba(56, 189, 248, 0.3); }
    .gacha-skin-card.locked { opacity: 0.45; cursor: not-allowed; }
    .gacha-skin-badge { font-size: 32px; margin-bottom: 4px; }
    .gacha-skin-name { font-size: 13px; font-weight: 700; color: #f8fafc; }
    .gacha-skin-tag { font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-top: 4px; }
    .gacha-skin-card.active .gacha-skin-tag { color: #38bdf8; }

    .leaderboard-preview-box { background: #0f172a; border: 2px solid #334155; border-radius: 16px; padding: 18px; margin: 18px 0; text-align: left; }
    .lb-row { display: flex; justify-content: space-between; padding: 8px 10px; border-bottom: 1px solid #1e293b; font-size: 13px; color: #cbd5e1; font-weight: 600; }
    .lb-row.header { color: #64748b; font-size: 11px; text-transform: uppercase; font-weight: 800; border-bottom: 2px solid #334155; }
    .lb-row.current-player { color: #38bdf8; background: rgba(56, 189, 248, 0.1); border-radius: 8px; }
    .placeholder-badge { display: inline-block; background: rgba(139, 92, 246, 0.2); color: #c084fc; border: 1px solid rgba(139, 92, 246, 0.4); padding: 3px 8px; border-radius: 999px; font-size: 11px; font-weight: 700; margin-bottom: 8px; }

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
      <button id="gacha-btn" class="gacha-btn">🎰 Гача (100 🪙) [G]</button>
      <div id="gacha-status" class="gacha-status">Управление: WASD / Стрелки / Space | [1-4] Скины</div>
      <div id="skin-list" class="skin-list"></div>
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
        <div class="menu-stat-pill">Рекорд: <strong id="menu-high-score">0</strong></div>
        <div class="menu-stat-pill gold">Монеты: <strong id="menu-coins">0</strong> 🪙</div>
      </div>

      <div class="menu-btn-stack">
        <button id="menu-play-btn" class="menu-btn menu-btn-primary">▶ Начать игру</button>
        <button id="menu-gacha-btn" class="menu-btn menu-btn-amber">🎰 Гача-автомат (100 🪙)</button>
        <button id="menu-leaderboard-btn" class="menu-btn menu-btn-purple">🏆 Таблица лидеров</button>
      </div>
    </div>
  </div>

  <!-- Модальное окно Гача-автомата -->
  <div id="gacha-modal" class="modal hidden">
    <div class="modal-card">
      <h2 style="color: #fbbf24;">🎰 ГАЧА-АВТОМАТ</h2>
      <p>Испытайте удачу и откройте новые воксельные скины!<br>Стоимость одного прокрута — <strong>100 монет</strong>.</p>

      <div class="menu-stat-pill gold" style="display: inline-block; margin-bottom: 12px;">
        Ваш баланс: <strong id="gacha-modal-coins">0</strong> 🪙
      </div>

      <div id="gacha-modal-status" class="gacha-status" style="margin-bottom: 8px;">1 прокрут = 100 монет</div>

      <div id="gacha-modal-skin-list" class="gacha-modal-grid"></div>

      <div class="menu-btn-stack">
        <button id="gacha-modal-roll-btn" class="menu-btn menu-btn-amber">Крутить за 100 🪙</button>
        <button id="gacha-modal-close-btn" class="menu-btn menu-btn-secondary">Закрыть</button>
      </div>
    </div>
  </div>

  <!-- Модальное окно Таблицы лидеров (Заглушка) -->
  <div id="leaderboard-modal" class="modal hidden">
    <div class="modal-card">
      <span class="placeholder-badge">СКОРО В ОБНОВЛЕНИИ</span>
      <h2 style="color: #c084fc;">🏆 ТАБЛИЦА ЛИДЕРОВ</h2>
      <p>Глобальный рейтинг игроков находится в разработке и будет подключен в следующем обновлении.</p>

      <div class="leaderboard-preview-box">
        <div class="lb-row header">
          <span>Ранг</span>
          <span>Игрок</span>
          <span>Рекорд</span>
        </div>
        <div class="lb-row current-player">
          <span>#1 (Вы)</span>
          <span>👤 Игрок</span>
          <span id="leaderboard-best-score">0</span>
        </div>
        <div class="lb-row" style="opacity: 0.6;">
          <span>#2</span>
          <span>🤖 CyberDuck</span>
          <span>142</span>
        </div>
        <div class="lb-row" style="opacity: 0.5;">
          <span>#3</span>
          <span>🤖 MasterChicken</span>
          <span>98</span>
        </div>
      </div>

      <button id="leaderboard-close-btn" class="menu-btn menu-btn-secondary">Закрыть</button>
    </div>
  </div>

  <!-- Экран Game Over -->
  <div id="game-over-modal" class="modal hidden">
    <div class="modal-card">
      <h2>Игра окончена!</h2>
      <p id="death-reason">Вас сбил автомобиль!</p>
      <div class="menu-btn-stack">
        <button id="restart-btn" class="menu-btn menu-btn-primary">Играть снова (Space)</button>
        <button id="to-menu-btn" class="menu-btn menu-btn-secondary">Главное меню (Esc)</button>
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
