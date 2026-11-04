import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import * as THREE from 'three';
import { ALL_SKINS, type SkinId } from '../src/core/types.ts';
import { SKIN_RARITY_MAP, SkinRarity } from '../src/core/gachaMachine.ts';
import { createUrbanCharacter, URBAN_CHARACTER_CALIBRATIONS } from '../src/view/urbanCharacters.ts';
import { CHRISTMAS_CHARACTER_CALIBRATIONS, createChristmasCharacter } from '../src/view/christmasCharacters.ts';
import { AudioSynth } from '../src/view/audioSynth.ts';
import { GACHA_CHARACTER_SKIN_BASE64 } from '../src/view/gachaSkinsBase64.ts';
import { CARD_NAMES_UPPER } from '../src/view/gachaCardArt.ts';
import { SKINS_RARITY_MAP } from '../src/app/skinsCollectionModal.ts';
import { getCharacterModelItems } from '../src/view/modelRegistry.ts';

const CHRISTMAS_SKINS: SkinId[] = [
  'penguin_cocoa',
  'snow_hare',
  'husky_sweater',
  'derpy_snowman',
  'arctic_fox',
  'holiday_elf',
  'holiday_owl',
  'gingerbread_man',
  'reindeer_glow',
  'santa_claus',
];

describe('Christmas Characters Integration Suite (10 Holiday Wonders)', () => {
  it('Requirement 1: Total skins in game is exactly 20 and all 10 Christmas skins are registered in ALL_SKINS', () => {
    assert.equal(ALL_SKINS.length, 20, 'ALL_SKINS must contain exactly 20 characters');
    const registeredIds = ALL_SKINS.map((s) => s.id);
    for (const skinId of CHRISTMAS_SKINS) {
      assert.ok(registeredIds.includes(skinId), `Skin ${skinId} must be registered in ALL_SKINS`);
    }
  });

  it('Requirement 2: All 10 Christmas skins have correct rarities (4 Common, 3 Rare, 2 Epic, 1 Legendary)', () => {
    const expectedRarities: Record<string, string> = {
      penguin_cocoa: SkinRarity.COMMON,
      snow_hare: SkinRarity.COMMON,
      husky_sweater: SkinRarity.COMMON,
      derpy_snowman: SkinRarity.COMMON,
      arctic_fox: SkinRarity.RARE,
      holiday_elf: SkinRarity.RARE,
      holiday_owl: SkinRarity.RARE,
      gingerbread_man: SkinRarity.EPIC,
      reindeer_glow: SkinRarity.EPIC,
      santa_claus: SkinRarity.LEGENDARY,
    };

    let commonCount = 0;
    let rareCount = 0;
    let epicCount = 0;
    let legendaryCount = 0;

    for (const skinId of CHRISTMAS_SKINS) {
      const rarity = SKIN_RARITY_MAP[skinId];
      assert.equal(rarity, expectedRarities[skinId], `Rarity for ${skinId} must match expected`);
      if (rarity === SkinRarity.COMMON) commonCount++;
      if (rarity === SkinRarity.RARE) rareCount++;
      if (rarity === SkinRarity.EPIC) epicCount++;
      if (rarity === SkinRarity.LEGENDARY) legendaryCount++;
    }

    assert.equal(commonCount, 4, 'Must have 4 Common Christmas skins');
    assert.equal(rareCount, 3, 'Must have 3 Rare Christmas skins');
    assert.equal(epicCount, 2, 'Must have 2 Epic Christmas skins');
    assert.equal(legendaryCount, 1, 'Must have 1 Legendary Christmas skin');
  });

  it('Requirement 3: createUrbanCharacter and createChristmasCharacter generate valid Three.js voxel groups', () => {
    for (const skinId of CHRISTMAS_SKINS) {
      const charGroup = createUrbanCharacter(skinId);
      assert.ok(charGroup.isGroup, `Character ${skinId} must be a THREE.Group`);
      assert.equal(charGroup.name, 'char_root');

      const innerPivot = charGroup.children[0] as THREE.Group;
      assert.ok(innerPivot && innerPivot.isGroup, `Character ${skinId} must have innerPivot`);
      assert.equal(innerPivot.name, 'innerPivot');

      const meshCount = innerPivot.children.filter((c) => (c as THREE.Mesh).isMesh).length;
      assert.ok(meshCount >= 25, `Character ${skinId} must have at least 25 voxels (had ${meshCount})`);

      // Verify calibration values
      const calib = CHRISTMAS_CHARACTER_CALIBRATIONS[skinId];
      assert.ok(calib, `Calibration must exist for ${skinId}`);
      assert.ok(calib.scale >= 1.0 && calib.scale <= 1.45, `Scale for ${skinId} (${calib.scale}) must be 1.0 - 1.45`);
      assert.equal(calib.offsetY, 0, `OffsetY for ${skinId} must be 0`);
    }
  });

  it('Requirement 4: 160x160 transparent WebP assets exist on disk and in GACHA_CHARACTER_SKIN_BASE64', () => {
    const iconsDir = path.join(process.cwd(), 'references', 'processed_icons');
    for (const skinId of CHRISTMAS_SKINS) {
      const filePath = path.join(iconsDir, `char_${skinId}.webp`);
      assert.ok(fs.existsSync(filePath), `Icon file char_${skinId}.webp must exist on disk`);

      const stat = fs.statSync(filePath);
      assert.ok(stat.size > 2000, `Icon file char_${skinId}.webp must be > 2KB (had ${stat.size}B)`);

      const b64 = GACHA_CHARACTER_SKIN_BASE64[skinId];
      assert.ok(b64 && b64.startsWith('data:image/webp;base64,'), `Base64 entry for ${skinId} must be WebP data URL`);
    }
  });

  it('Requirement 5: AudioSynth playSkinVoice plays procedurally for all 10 Christmas skins without crashing', () => {
    const synth = new AudioSynth();
    for (const skinId of CHRISTMAS_SKINS) {
      assert.doesNotThrow(() => {
        synth.playSkinVoice(skinId);
      }, `playSkinVoice("${skinId}") must execute safely`);
    }
  });

  it('Requirement 6: UI catalog and card metadata are present for all 10 Christmas skins', () => {
    const catalogItems = getCharacterModelItems();
    const catalogIds = catalogItems.map((c) => c.id);

    for (const skinId of CHRISTMAS_SKINS) {
      assert.ok(CARD_NAMES_UPPER[skinId], `Card upper name must exist for ${skinId}`);
      assert.ok(SKINS_RARITY_MAP[skinId], `UI rarity meta must exist for ${skinId}`);
      assert.ok(catalogIds.includes(skinId), `Model catalog must include ${skinId}`);
    }
  });
});
