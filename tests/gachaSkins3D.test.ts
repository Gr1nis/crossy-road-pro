import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { GACHA_CHARACTER_SKIN_BASE64 } from '../src/view/gachaSkinsBase64.ts';
import {
  GACHA_CARD_THUMB_CACHE,
  createGachaCardElement,
  getGachaCardThumbUrl,
} from '../src/view/gachaCardArt.ts';
import { SceneManager } from '../src/view/sceneManager.ts';

describe('3D Voxel Character Real Model Render Pipeline Suite', () => {
  const processedDir = path.join(process.cwd(), 'references', 'processed_icons');
  const skins = ['corgi', 'pigeon_pizza', 'box_cat', 'raccoon_bandit', 'capybara_zen'] as const;

  it('Requirement 1: All 5 in-game character skins have authentic 3D base64 WebP renders in GACHA_CHARACTER_SKIN_BASE64', () => {
    for (const skin of skins) {
      const uri = GACHA_CHARACTER_SKIN_BASE64[skin];
      assert.ok(typeof uri === 'string', `Skin ${skin} must have a base64 string`);
      assert.ok(
        uri.startsWith('data:image/webp;base64,'),
        `Skin ${skin} must be a valid data:image/webp;base64 URI`
      );
      assert.ok(uri.length > 2000, `Skin ${skin} base64 string must not be empty or degenerate`);
    }
  });

  it('Requirement 2: All 5 WebP assets exist in references/processed_icons/ with valid RIFF/WEBP signature', () => {
    for (const skin of skins) {
      const filePath = path.join(processedDir, `char_${skin}.webp`);
      assert.ok(fs.existsSync(filePath), `Asset char_${skin}.webp must exist on disk`);

      const stat = fs.statSync(filePath);
      assert.ok(stat.size > 2000, `Asset char_${skin}.webp size (${stat.size}B) must be valid`);

      const buf = fs.readFileSync(filePath);
      const riff = buf.subarray(0, 4).toString('ascii');
      const webp = buf.subarray(8, 12).toString('ascii');
      assert.equal(riff, 'RIFF', `char_${skin}.webp must have RIFF header`);
      assert.equal(webp, 'WEBP', `char_${skin}.webp must have WEBP fourcc`);
    }
  });

  it('Requirement 3: GACHA_CARD_THUMB_CACHE is populated and getGachaCardThumbUrl returns authentic 3D WebP URI', () => {
    for (const skin of skins) {
      const thumbUrl = getGachaCardThumbUrl(skin);
      assert.ok(thumbUrl.startsWith('data:image/webp;base64,'), `Thumb URL for ${skin} must be WebP base64`);
      assert.equal(thumbUrl, GACHA_CHARACTER_SKIN_BASE64[skin]);
      assert.equal(GACHA_CARD_THUMB_CACHE.get(skin), GACHA_CHARACTER_SKIN_BASE64[skin]);
    }
  });

  it('Requirement 4: createGachaCardElement outputs <img> with authentic 3D render and silhouette classes', () => {
    const originalDocument = globalThis.document;
    const classes = new Set<string>();
    const attrs: Record<string, string> = {};
    const styles: Record<string, string> = {};

    (globalThis as any).document = {
      createElement: () => ({
        set className(v: string) {
          classes.clear();
          v.split(/\s+/).filter(Boolean).forEach((c) => classes.add(c));
        },
        innerHTML: '',
        setAttribute: (k: string, v: string) => { attrs[k] = v; },
        getAttribute: (k: string) => attrs[k] ?? null,
        classList: {
          add: (...cls: string[]) => cls.forEach((c) => classes.add(c)),
          contains: (c: string) => classes.has(c),
        },
        style: {
          setProperty: (k: string, v: string) => { styles[k] = v; },
        },
      }),
    };

    try {
      for (const skin of skins) {
        const card = createGachaCardElement(skin, 1, true);
        assert.ok(card.innerHTML.includes('<img src="data:image/webp;base64,'), 'Must contain 3D WebP img tag');
        assert.ok(card.innerHTML.includes('gacha-card-char-img'), 'Must contain gacha-card-char-img class');
        assert.ok(card.innerHTML.includes('card-silhouette'), 'Must have card-silhouette class for locked skin');
        assert.ok(card.innerHTML.includes(`alt="${skin}"`), 'Must have correct alt attribute');
      }
    } finally {
      (globalThis as any).document = originalDocument;
    }
  });

  it('Requirement 5: All 5 3D WebP renders have 100% transparent alpha channel and no opaque canvas overrides', () => {
    for (const skin of skins) {
      const filePath = path.join(processedDir, `char_${skin}.webp`);
      const buf = fs.readFileSync(filePath);
      const isVp8x = buf.subarray(12, 16).toString('ascii') === 'VP8X';
      const hasAlphaBit = (buf[20] & 0x10) !== 0;
      const hasAlphChunk = buf.includes(Buffer.from('ALPH'));

      assert.ok(isVp8x, `char_${skin}.webp must be extended WebP format`);
      assert.ok(hasAlphaBit, `char_${skin}.webp must have Alpha flag bit set in VP8X header`);
      assert.ok(hasAlphChunk, `char_${skin}.webp must contain ALPH chunk with transparency`);

      const base64Data = GACHA_CHARACTER_SKIN_BASE64[skin].replace('data:image/webp;base64,', '');
      const decodedBuf = Buffer.from(base64Data, 'base64');
      assert.ok(decodedBuf.includes(Buffer.from('ALPH')), `Embedded base64 for ${skin} must contain ALPH chunk`);
    }

    assert.equal(
      (SceneManager.prototype as any).captureSkinThumbnails,
      undefined,
      'Destructive captureSkinThumbnails must be removed from SceneManager'
    );
  });
});
