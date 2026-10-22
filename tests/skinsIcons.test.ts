import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  SKINS_ICON_TITLE,
  SKINS_ICON_BTN_GOLD,
  SKINS_ICON_BTN_GREEN,
  SKINS_ICON_LOCK,
  SKINS_ICON_CLOSE,
  SKINS_MENU_ICONS,
  SKINS_ICONS,
} from '../src/view/skinsIconsBase64.ts';

describe('Skins Menu Icons & WebP Base64 Asset Suite', () => {
  const processedDir = path.join(process.cwd(), 'references', 'processed_icons');

  it('Requirement 1: All individual export constants are valid WebP data URIs', () => {
    const exports = [
      { name: 'SKINS_ICON_TITLE', val: SKINS_ICON_TITLE },
      { name: 'SKINS_ICON_BTN_GOLD', val: SKINS_ICON_BTN_GOLD },
      { name: 'SKINS_ICON_BTN_GREEN', val: SKINS_ICON_BTN_GREEN },
      { name: 'SKINS_ICON_LOCK', val: SKINS_ICON_LOCK },
      { name: 'SKINS_ICON_CLOSE', val: SKINS_ICON_CLOSE },
    ];

    for (const exp of exports) {
      assert.ok(typeof exp.val === 'string', `${exp.name} must be a string`);
      assert.ok(
        exp.val.startsWith('data:image/webp;base64,'),
        `${exp.name} must be a valid data:image/webp;base64 URI`
      );
      assert.ok(exp.val.length > 500, `${exp.name} must contain non-trivial data`);
    }
  });

  it('Requirement 2: SKINS_MENU_ICONS contains all 5 required properties', () => {
    const requiredKeys = ['title', 'btnGold', 'btnGreen', 'lock', 'close'] as const;

    for (const key of requiredKeys) {
      assert.ok(
        typeof SKINS_MENU_ICONS[key] === 'string',
        `SKINS_MENU_ICONS must contain property "${key}"`
      );
      assert.ok(
        SKINS_MENU_ICONS[key].startsWith('data:image/webp;base64,'),
        `SKINS_MENU_ICONS.${key} must be a valid data:image/webp;base64 URI`
      );
    }
  });

  it('Requirement 3: SKINS_ICONS dictionary contains semantic aliases', () => {
    const requiredAliases = [
      'title',
      'skinsTitle',
      'btnGold',
      'btn_gold',
      'btnGreen',
      'btn_green',
      'lock',
      'skinsLock',
      'close',
      'closeBtn',
      'close_btn',
    ];

    for (const alias of requiredAliases) {
      assert.ok(
        typeof SKINS_ICONS[alias] === 'string',
        `SKINS_ICONS must contain alias "${alias}"`
      );
    }
  });

  it('Requirement 4: Optimized WebP files exist on disk with valid file headers', () => {
    const expectedFiles = [
      'skins_title.webp',
      'skins_btn_gold.webp',
      'skins_btn_green.webp',
      'skins_lock.webp',
      'skins_close_btn.webp',
    ];

    for (const file of expectedFiles) {
      const fullPath = path.join(processedDir, file);
      assert.ok(fs.existsSync(fullPath), `Expected file ${file} to exist on disk`);
      const buffer = fs.readFileSync(fullPath);
      assert.ok(buffer.length > 500, `${file} size must be non-trivial`);
      assert.equal(buffer.toString('ascii', 0, 4), 'RIFF', `${file} must have RIFF header`);
      assert.equal(buffer.toString('ascii', 8, 12), 'WEBP', `${file} must have WEBP signature`);
    }
  });

  it('Requirement 5: Combined Base64 bundle size is under 100 KB limit', () => {
    const uniqueUris = [
      SKINS_ICON_TITLE,
      SKINS_ICON_BTN_GOLD,
      SKINS_ICON_BTN_GREEN,
      SKINS_ICON_LOCK,
      SKINS_ICON_CLOSE,
    ];

    const totalB64Chars = uniqueUris.reduce((sum, uri) => sum + uri.length, 0);
    const totalB64KB = totalB64Chars / 1024;
    assert.ok(
      totalB64KB < 100,
      `Base64 bundle size (${totalB64KB.toFixed(2)} KB) must be strictly under 100 KB limit`
    );
  });

  it('Requirement 6: scripts/build.mjs includes src/view/skinsIconsBase64.ts in moduleOrder', () => {
    const buildScript = fs.readFileSync(path.join(process.cwd(), 'scripts', 'build.mjs'), 'utf8');
    assert.ok(
      buildScript.includes("'src/view/skinsIconsBase64.ts'"),
      'build.mjs moduleOrder must include src/view/skinsIconsBase64.ts'
    );
  });
});
