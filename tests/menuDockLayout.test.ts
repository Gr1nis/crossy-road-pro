import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('Menu Bottom Dock — Desktop and Mobile Layout Suite', () => {
  const htmlPath = path.join(process.cwd(), 'index.html');
  const html = fs.readFileSync(htmlPath, 'utf8');

  it('Requirement 1 (Wide Screens / Desktop Layout): PLAY button is strictly centered, 260-280px wide, 90px high', () => {
    // Check PLAY button element
    assert.ok(html.includes('id="menu-play-btn"'), '#menu-play-btn must exist');
    assert.ok(html.includes('class="hero-play-btn"'), '.hero-play-btn class must be present');

    // Check desktop styling for #menu-play-btn / .hero-play-btn
    assert.ok(html.includes('width: 280px;'), 'Desktop PLAY button width must be between 260px and 280px (280px)');
    assert.ok(html.includes('height: 90px;'), 'Desktop PLAY button height must be 90px');
    assert.ok(html.includes('position: absolute;'), 'Desktop PLAY button must be absolutely positioned for strict centering');
    assert.ok(html.includes('left: 50%;'), 'Desktop PLAY button must have left: 50%');
    assert.ok(html.includes('transform: translateX(-50%);'), 'Desktop PLAY button must have transform: translateX(-50%)');
  });

  it('Requirement 1 (Wide Screens / Desktop Layout): Left and Right button blocks are placed at screen edges', () => {
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

  it('Requirement 1 (Wide Screens / Desktop Layout): Square buttons on PC are sized to 64x64px', () => {
    assert.ok(html.includes('width: 64px;'), 'Square buttons (.dock-btn-inner) width must be 64px on PC');
    assert.ok(html.includes('height: 64px;'), 'Square buttons (.dock-btn-inner) height must be 64px on PC');
  });

  it('Requirement 2 (Mobile Screens Layout): Equal 16px padding and safe-area-inset-bottom support', () => {
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

    // Check mobile buttons do not exceed bounds (flex: 1 with max-width and min-width)
    assert.ok(
      html.includes('max-width: 220px;'),
      'Mobile PLAY button must have max-width constraint to prevent overflow'
    );
    assert.ok(
      html.includes('width: 48px;'),
      'Mobile square button inner size must be scaled down'
    );
  });

  it('Requirement 3 (ID and Badge Compatibility): All button IDs, badges, and titles are preserved', () => {
    assert.ok(html.includes('id="menu-skins-btn"'), '#menu-skins-btn ID must be preserved');
    assert.ok(html.includes('id="menu-gacha-btn"'), '#menu-gacha-btn ID must be preserved');
    assert.ok(html.includes('id="menu-play-btn"'), '#menu-play-btn ID must be preserved');
    assert.ok(html.includes('id="menu-leaderboard-btn"'), '#menu-leaderboard-btn ID must be preserved');
    assert.ok(html.includes('id="menu-achievements-btn"'), '#menu-achievements-btn ID must be preserved');
    assert.ok(html.includes('id="menu-achievements-badge"'), '#menu-achievements-badge ID must be preserved');
    assert.ok(html.includes('title="🎰 Автомат скинов"'), 'Gacha button title must be preserved');
    assert.ok(html.includes('🎰 Автомат скинов'), 'Gacha button test label must be preserved');
  });
});
