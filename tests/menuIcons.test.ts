import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { MENU_ICONS } from '../src/view/menuIconsBase64.ts';

describe('Menu Icons & WebP Base64 Asset Suite', () => {
  const processedDir = path.join(process.cwd(), 'references', 'processed_icons');

  it('Requirement 1: All required icon keys and semantic aliases are present in MENU_ICONS', () => {
    const requiredKeys = [
      'skins',
      'shop',
      'leaderboard',
      'achievements',
      'daily_gift',
      'dailyGift',
      'daily_quests',
      'dailyQuests',
      'settings',
      'coin',
      'crown',
      'play',
      'playButton',
      'currency_widget',
      'highscore_widget',
    ];

    for (const key of requiredKeys) {
      assert.ok(
        typeof MENU_ICONS[key] === 'string',
        `MENU_ICONS must contain key "${key}"`
      );
      assert.ok(
        MENU_ICONS[key].startsWith('data:image/webp;base64,'),
        `MENU_ICONS["${key}"] must be a valid data:image/webp;base64 URI`
      );
    }
  });

  it('Requirement 2: Total bundle size of all icons combined is under 120 KB', () => {
    // Unique base64 data URIs
    const uniqueUris = Array.from(new Set(Object.values(MENU_ICONS)));
    const totalBytes = uniqueUris.reduce((sum, uri) => sum + uri.length, 0);
    const totalKB = totalBytes / 1024;

    assert.ok(
      totalKB < 120,
      `Total bundle size of all unique icons combined (${totalKB.toFixed(2)} KB) must be strictly under 120 KB`
    );
  });

  it('Requirement 3: All WebP assets exist on disk in references/processed_icons/ with valid headers', () => {
    const files = [
      'skins.webp',
      'shop.webp',
      'leaderboard.webp',
      'achievements.webp',
      'daily_gift.webp',
      'daily_quests.webp',
      'settings.webp',
      'coin.webp',
      'crown.webp',
      'play.webp',
      'currency_widget.webp',
      'highscore_widget.webp',
    ];

    for (const file of files) {
      const filePath = path.join(processedDir, file);
      assert.ok(fs.existsSync(filePath), `File ${file} must exist in references/processed_icons/`);

      const stat = fs.statSync(filePath);
      assert.ok(stat.size > 1000, `File ${file} must not be empty or too small (${stat.size} bytes)`);

      const buf = fs.readFileSync(filePath);
      // Check RIFF and WEBP signature
      const riffHeader = buf.subarray(0, 4).toString('ascii');
      const webpHeader = buf.subarray(8, 12).toString('ascii');
      assert.equal(riffHeader, 'RIFF', `${file} must start with RIFF header`);
      assert.equal(webpHeader, 'WEBP', `${file} must contain WEBP fourcc`);
    }
  });
});
