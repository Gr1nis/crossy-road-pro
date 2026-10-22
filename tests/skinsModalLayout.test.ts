import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('Skins Modal — UI & CSS Architecture Suite', () => {
  const indexPath = path.join(process.cwd(), 'index.html');
  assert.ok(fs.existsSync(indexPath), 'index.html must exist');
  const indexHtml = fs.readFileSync(indexPath, 'utf8');

  it('Requirement 1: #skins-modal has the new .modal-card-skins-pc container', () => {
    assert.match(
      indexHtml,
      /<div\s+id="skins-modal"[^>]*class="[^"]*modal[^"]*"[^>]*>[\s\S]*?<div\s+class="modal-card\s+modal-card-skins-pc">/,
      'skins-modal must contain modal-card-skins-pc card'
    );
  });

  it('Requirement 2: Top bar contains coin capsule on the left and 3D close button on the right', () => {
    assert.match(
      indexHtml,
      /<div\s+class="skins-top-left-group\s+skins-coin-capsule-wrap">[\s\S]*?<div\s+class="skins-coin-capsule"[\s\S]*?<span\s+class="skins-coin-val"\s+id="skins-modal-coins">0<\/span>[\s\S]*?COINS[\s\S]*?<img\s+src="data:image\/webp;base64,[^"]+"\s+class="skins-coin-icon-img"/,
      'Top-left group must contain coin capsule with #skins-modal-coins and coin icon'
    );

    assert.match(
      indexHtml,
      /<div\s+class="skins-top-right-group\s+skins-top-bar">[\s\S]*?<button[^>]*id="skins-modal-close-btn"[^>]*class="skins-close-btn-3d"[\s\S]*?<img\s+src="data:image\/webp;base64,[^"]+"\s+class="skins-close-btn-img"[\s\S]*?\[ESC\]/,
      'Top-right group must contain 3D close button with close icon and [ESC] hint'
    );
  });

  it('Requirement 3: Center contains 3D title header with proper structure', () => {
    assert.match(
      indexHtml,
      /<div\s+class="skins-header-wrap">[\s\S]*?<img\s+src="data:image\/webp;base64,[^"]+"\s+class="skins-3d-title-img"\s+alt="SKINS"\s*\/>/,
      'Center header must contain skins-header-wrap and skins-3d-title-img'
    );
  });

  it('Requirement 4: Contains #skins-modal-list with .skins-cards-grid and keyboard navigation hints', () => {
    assert.match(
      indexHtml,
      /<div\s+id="skins-modal-list"\s+class="skins-cards-grid"><\/div>/,
      'Must contain #skins-modal-list with skins-cards-grid'
    );

    assert.match(
      indexHtml,
      /<div\s+class="skins-nav-hint">[\s\S]*?\[A\][\s\S]*?\[D\][\s\S]*?\[ENTER\]/,
      'Must contain navigation hint for [A] / [D] and [ENTER]'
    );
  });

  it('Requirement 5: CSS glassmorphism, gold border and dimensions are properly styled', () => {
    assert.ok(indexHtml.includes('.modal-card-skins-pc {'), 'CSS must define .modal-card-skins-pc');
    assert.ok(indexHtml.includes('linear-gradient(180deg, rgba(20, 31, 53, 0.95) 0%, rgba(13, 20, 36, 0.98) 100%)'), 'Must use dark-blue gradient');
    assert.ok(indexHtml.includes('border: 3px solid #f59e0b;'), 'Must have gold border');
    assert.ok(indexHtml.includes('box-shadow:') && indexHtml.includes('rgba(245, 158, 11, 0.45)'), 'Must have amber glow shadow');
    assert.ok(indexHtml.includes('.skins-header-wrap {') && indexHtml.includes('margin-top: -72px;'), 'Header wrap must have -72px margin-top');
  });

  it('Requirement 6: Locked character silhouette style is defined with brightness(0) and drop-shadow', () => {
    assert.match(
      indexHtml,
      /\.skin-card\.locked\s+\.skin-card-char-img[\s\S]*?filter:\s*brightness\(0\)\s+drop-shadow\(0 0 10px var\(--rarity-glow\)\);/,
      'Locked silhouette must have brightness(0) drop-shadow'
    );
  });

  it('Requirement 7: Rarity color themes (Common, Rare, Epic, Legendary) are defined', () => {
    assert.ok(indexHtml.includes('--rarity-color: #94a3b8;'), 'Common rarity color must be defined');
    assert.ok(indexHtml.includes('--rarity-color: #38bdf8;'), 'Rare rarity color must be defined');
    assert.ok(indexHtml.includes('--rarity-color: #c084fc;'), 'Epic rarity color must be defined');
    assert.ok(indexHtml.includes('--rarity-color: #fbbf24;'), 'Legendary rarity color must be defined');
  });

  it('Requirement 8: Mobile responsive rules for 9:16 portrait are defined', () => {
    assert.ok(indexHtml.includes('.skins-3d-title-img {') && indexHtml.includes('height: 68px !important;'), 'Mobile title height must be 68px');
    assert.ok(indexHtml.includes('.skins-cards-grid {') && indexHtml.includes('overflow-x: auto;') && indexHtml.includes('flex-wrap: nowrap;'), 'Mobile cards grid must scroll horizontally');
  });

  it('Requirement 9: Contains tabs navigation (.skins-tabs-nav) with characters and worlds tab buttons and content containers', () => {
    assert.match(
      indexHtml,
      /<div\s+class="skins-tabs-nav">[\s\S]*?<button[^>]*id="skins-tab-btn-characters"[^>]*data-tab="characters"[^>]*>[\s\S]*?<button[^>]*id="skins-tab-btn-worlds"[^>]*data-tab="worlds"/,
      'Must contain tabs navigation with characters and worlds tab buttons'
    );

    assert.match(
      indexHtml,
      /<div\s+id="skins-tab-characters-content"\s+class="skins-tab-content\s+active">[\s\S]*?<div\s+id="skins-modal-list"/,
      'Must contain #skins-tab-characters-content wrapping #skins-modal-list'
    );

    assert.match(
      indexHtml,
      /<div\s+id="skins-tab-worlds-content"\s+class="skins-tab-content\s+hidden">[\s\S]*?<div\s+id="skins-worlds-list"\s+class="skins-cards-grid"><\/div>/,
      'Must contain #skins-tab-worlds-content wrapping #skins-worlds-list'
    );

    assert.ok(indexHtml.includes('.skins-tabs-nav {'), 'CSS must define .skins-tabs-nav');
    assert.ok(indexHtml.includes('.skins-tab-btn {'), 'CSS must define .skins-tab-btn');
    assert.ok(indexHtml.includes('.skins-tab-content {'), 'CSS must define .skins-tab-content');
    assert.ok(indexHtml.includes('.skins-tab-content.hidden {'), 'CSS must define .skins-tab-content.hidden');
  });
});
