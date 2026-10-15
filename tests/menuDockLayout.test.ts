import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('Menu Bottom Dock & Tap-to-Play — Desktop and Mobile Layout Suite', () => {
  const htmlPath = path.join(process.cwd(), 'index.html');
  const html = fs.readFileSync(htmlPath, 'utf8');

  it('Requirement 1 (Full-Screen Tap to Play & Free Center Zone): Center is unobstructed, tap-to-play prompt exists, main menu handles full-screen tap', () => {
    // Physical #menu-play-btn must NOT exist in the bottom dock
    assert.ok(!html.includes('id="menu-play-btn"'), '#menu-play-btn must be removed to free central zone');

    // Check Tap-to-Play prompt element and text
    assert.ok(html.includes('class="tap-to-play-prompt"'), '.tap-to-play-prompt class must be present');
    assert.ok(html.includes('НАЖМИТЕ ДЛЯ СТАРТА'), 'Tap-to-play prompt text must be present');

    // Check styling for full-screen tap-to-play
    assert.ok(html.includes('.tap-to-play-prompt'), '.tap-to-play-prompt CSS must exist');
    assert.ok(html.includes('tapPromptPulse'), 'tapPromptPulse pulse animation must exist');
    assert.ok(html.includes('cursor: pointer;'), 'Main menu modal must have cursor: pointer for tap-to-play area');
  });

  it('Requirement 2 (Wide Screens / Desktop Layout): Left and Right button blocks are placed at screen edges', () => {
    // Check left block buttons
    assert.ok(html.includes('id="menu-skins-btn"'), '#menu-skins-btn must exist');
    assert.ok(html.includes('id="menu-gacha-btn"'), '#menu-gacha-btn must exist');
    assert.ok(html.includes('class="dock-col dock-col-left"'), 'Left column must have dock-col-left class');

    // Check right block buttons
    assert.ok(html.includes('id="menu-leaderboard-btn"'), '#menu-leaderboard-btn must exist');
    assert.ok(html.includes('id="menu-achievements-btn"'), '#menu-achievements-btn must exist');
    assert.ok(html.includes('class="dock-col dock-col-right"'), 'Right column must have dock-col-right class');

    // Check flex distribution with space-between
    assert.ok(html.includes('justify-content: space-between;'), '.menu-bottom-dock must have justify-content: space-between');
    assert.ok(html.includes('.dock-col-left'), '.dock-col-left styling must exist');
    assert.ok(html.includes('.dock-col-right'), '.dock-col-right styling must exist');
  });

  it('Requirement 3 (Wide Screens / Desktop Layout): Square buttons on PC are sized to 64x64px', () => {
    assert.ok(html.includes('width: 64px;'), 'Square buttons (.dock-btn-inner) width must be 64px on PC');
    assert.ok(html.includes('height: 64px;'), 'Square buttons (.dock-btn-inner) height must be 64px on PC');
  });

  it('Requirement 4 (Mobile Screens Layout): Equal 16px padding and safe-area-inset-bottom support', () => {
    // Check mobile media query exists
    assert.ok(html.includes('@media (max-width: 640px)'), 'Mobile media query (max-width: 640px) must exist');

    // Check 16px edge padding on mobile
    assert.ok(
      html.includes('padding: 0 max(16px, env(safe-area-inset-right)) 0 max(16px, env(safe-area-inset-left));'),
      'Mobile menu dock must have 16px edge padding supporting safe areas'
    );

    // Check safe-area-inset-bottom support
    assert.ok(
      html.includes('env(safe-area-inset-bottom)'),
      'Layout must support safe-area-inset-bottom'
    );

    assert.ok(
      html.includes('width: 48px;'),
      'Mobile square button inner size must be scaled down'
    );
  });

  it('Requirement 5 (ID and Badge Compatibility): All functional button IDs, badges, and titles are preserved', () => {
    assert.ok(html.includes('id="menu-skins-btn"'), '#menu-skins-btn ID must be preserved');
    assert.ok(html.includes('id="menu-gacha-btn"'), '#menu-gacha-btn ID must be preserved');
    assert.ok(html.includes('id="menu-leaderboard-btn"'), '#menu-leaderboard-btn ID must be preserved');
    assert.ok(html.includes('id="menu-achievements-btn"'), '#menu-achievements-btn ID must be preserved');
    assert.ok(html.includes('id="menu-achievements-badge"'), '#menu-achievements-badge ID must be preserved');
    assert.ok(html.includes('id="menu-settings-btn"'), '#menu-settings-btn ID must be preserved');
    assert.ok(html.includes('id="menu-daily-btn"'), '#menu-daily-btn ID must be preserved');
    assert.ok(html.includes('id="menu-daily-quests-btn"'), '#menu-daily-quests-btn ID must be preserved');
    assert.ok(html.includes('id="menu-coins-pill"'), '#menu-coins-pill ID must be preserved');
    assert.ok(html.includes('id="menu-coins"'), '#menu-coins ID must be preserved');
    assert.ok(html.includes('id="menu-high-score"'), '#menu-high-score ID must be preserved');
    assert.ok(html.includes('title="🎰 Автомат скинов"'), 'Gacha button title must be preserved');
    assert.ok(html.includes('🎰 Автомат скинов'), 'Gacha button test label must be preserved');
  });

  it('Requirement 6 (3D Currency & Highscore Widgets & Settings Animation): 3D widgets and matching button animation', () => {
    assert.ok(html.includes('class="top-pill top-pill-coins"'), 'Coins pill must be present');
    assert.ok(html.includes('class="top-pill top-pill-score"'), 'Score pill must be present');
    assert.ok(html.includes('class="top-pill-bg-img"'), '3D widget background image must be used');
    assert.ok(!html.includes('rotate(35deg)'), 'Settings button must not rotate on hover');
  });
});
