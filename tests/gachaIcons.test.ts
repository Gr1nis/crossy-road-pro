import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  GACHA_ICON_CLOSE,
  GACHA_ICON_POINTER,
  GACHA_ICON_SPIN_BTN,
  GACHA_ICON_TITLE,
  GACHA_ICONS,
} from '../src/view/gachaIconsBase64.ts';

describe('Gacha Prize Machine Icons & WebP Base64 Asset Suite', () => {
  const processedDir = path.join(process.cwd(), 'references', 'processed_icons');

  it('Requirement 1: All required individual export constants are valid data URIs', () => {
    const exports = [
      { name: 'GACHA_ICON_CLOSE', val: GACHA_ICON_CLOSE },
      { name: 'GACHA_ICON_POINTER', val: GACHA_ICON_POINTER },
      { name: 'GACHA_ICON_SPIN_BTN', val: GACHA_ICON_SPIN_BTN },
      { name: 'GACHA_ICON_TITLE', val: GACHA_ICON_TITLE },
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

  it('Requirement 2: GACHA_ICONS dictionary contains all semantic aliases', () => {
    const requiredAliases = [
      'close',
      'closeBtn',
      'pointer',
      'pointerArrow',
      'spinBtn',
      'spin',
      'title',
      'gachaTitle',
    ];

    for (const alias of requiredAliases) {
      assert.ok(
        typeof GACHA_ICONS[alias] === 'string',
        `GACHA_ICONS must contain alias "${alias}"`
      );
      assert.ok(
        GACHA_ICONS[alias].startsWith('data:image/webp;base64,'),
        `GACHA_ICONS["${alias}"] must be a valid data:image/webp;base64 URI`
      );
    }
  });

  it('Requirement 3: Total bundle size of all 4 unique icons combined is under 100 KB', () => {
    const uniqueUris = [
      GACHA_ICON_CLOSE,
      GACHA_ICON_POINTER,
      GACHA_ICON_SPIN_BTN,
      GACHA_ICON_TITLE,
    ];
    const totalBytes = uniqueUris.reduce((sum, uri) => sum + uri.length, 0);
    const totalKB = totalBytes / 1024;

    assert.ok(
      totalKB < 100,
      `Total bundle size of all 4 gacha icons combined (${totalKB.toFixed(2)} KB) must be under 100 KB`
    );
  });

  it('Requirement 4: All WebP assets exist on disk in references/processed_icons/ with valid RIFF/WEBP headers', () => {
    const files = [
      'gacha_close_btn.webp',
      'gacha_pointer.webp',
      'gacha_spin_btn.webp',
      'gacha_title.webp',
    ];

    for (const file of files) {
      const filePath = path.join(processedDir, file);
      assert.ok(fs.existsSync(filePath), `File ${file} must exist in references/processed_icons/`);

      const stat = fs.statSync(filePath);
      assert.ok(stat.size > 1000, `File ${file} must not be empty or too small (${stat.size} bytes)`);

      const buf = fs.readFileSync(filePath);
      const riffHeader = buf.subarray(0, 4).toString('ascii');
      const webpHeader = buf.subarray(8, 12).toString('ascii');
      assert.equal(riffHeader, 'RIFF', `${file} must start with RIFF header`);
      assert.equal(webpHeader, 'WEBP', `${file} must contain WEBP fourcc`);
    }
  });
});
