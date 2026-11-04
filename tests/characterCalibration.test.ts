import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import * as THREE from 'three';
import { ALL_SKINS, type SkinId } from '../src/core/types.ts';
import {
  createUrbanCharacter,
  URBAN_CHARACTER_CALIBRATIONS,
  type UrbanCharacterCalibration,
} from '../src/view/urbanCharacters.ts';
import { getModelDiagnostics } from '../src/view/modelRegistry.ts';

describe('Urban Gang (Pack 1) Character Calibration & Pivot Architecture Suite', () => {
  const EXPECTED_CALIBRATIONS: Record<SkinId, UrbanCharacterCalibration> = {
    corgi: { scale: 1.0, offsetY: 0 },
    pigeon_pizza: { scale: 1.05, offsetY: 0 },
    barista_pug: { scale: 1.38, offsetY: 0 },
    skater_ferret: { scale: 1.42, offsetY: 0 },
    box_cat: { scale: 1.08, offsetY: 0 },
    subway_rat: { scale: 1.48, offsetY: 0 },
    raccoon_bandit: { scale: 1.0, offsetY: 0 },
    raincoat_duck: { scale: 1.3, offsetY: 0 },
    capybara_zen: { scale: 1.0, offsetY: 0 },
    pigeon_king: { scale: 1.14, offsetY: 0 },
    penguin_cocoa: { scale: 1.35, offsetY: 0 },
    snow_hare: { scale: 1.10, offsetY: 0 },
    husky_sweater: { scale: 1.00, offsetY: 0 },
    derpy_snowman: { scale: 1.22, offsetY: 0 },
    arctic_fox: { scale: 1.20, offsetY: 0 },
    holiday_elf: { scale: 1.28, offsetY: 0 },
    holiday_owl: { scale: 1.35, offsetY: 0 },
    gingerbread_man: { scale: 1.35, offsetY: 0 },
    reindeer_glow: { scale: 1.20, offsetY: 0 },
    santa_claus: { scale: 1.35, offsetY: 0 },
  };

  it('Requirement 1 (Pivot Hierarchy & Calibration Values): all 20 characters have root -> innerPivot container', () => {
    for (const skin of ALL_SKINS) {
      const skinId = skin.id;
      const expected = EXPECTED_CALIBRATIONS[skinId];
      assert.ok(expected, `Expected calibration must exist for ${skinId}`);

      const root = createUrbanCharacter(skinId);
      assert.ok(root.isGroup, `createUrbanCharacter("${skinId}") must return a THREE.Group`);
      assert.equal(root.name, 'char_root');
      assert.equal(root.children.length, 1, `root group for ${skinId} must contain exactly 1 child (innerPivot)`);

      const innerPivot = root.children[0] as THREE.Group;
      assert.ok(innerPivot.isGroup, `innerPivot for ${skinId} must be a THREE.Group`);
      assert.equal(innerPivot.name, 'innerPivot');

      // Check scale and offset applied to innerPivot
      assert.equal(innerPivot.scale.x, expected.scale);
      assert.equal(innerPivot.scale.y, expected.scale);
      assert.equal(innerPivot.scale.z, expected.scale);
      assert.equal(innerPivot.position.y, expected.offsetY);

      // Check innerPivot contains all voxels directly
      assert.ok(
        innerPivot.children.length >= 25,
        `innerPivot for ${skinId} must directly contain all voxels (found ${innerPivot.children.length})`
      );
      for (const child of innerPivot.children) {
        assert.ok((child as THREE.Mesh).isMesh, `Every child of innerPivot for ${skinId} must be a THREE.Mesh`);
      }
    }
  });

  it('Requirement 2 (Animation Isolation Invariant): animations applied to root preserve calibrated proportions', () => {
    for (const skin of ALL_SKINS) {
      const skinId = skin.id;
      const root = createUrbanCharacter(skinId);
      const innerPivot = root.children[0] as THREE.Group;
      const calib = URBAN_CHARACTER_CALIBRATIONS[skinId];

      // Measure un-animated bounds
      root.updateMatrixWorld(true);
      const baseBox = new THREE.Box3().setFromObject(root);
      const baseSize = new THREE.Vector3();
      baseBox.getSize(baseSize);

      // 1. Hop squash & stretch: root scale (0.9, 1.15, 0.9)
      root.scale.set(0.9, 1.15, 0.9);
      root.updateMatrixWorld(true);
      const hopBox = new THREE.Box3().setFromObject(root);
      const hopSize = new THREE.Vector3();
      hopBox.getSize(hopSize);

      assert.ok(
        Math.abs(hopSize.y - baseSize.y * 1.15) < 0.001,
        `Hop height for ${skinId} must scale by 1.15x relative to calibrated base`
      );
      assert.ok(
        Math.abs(hopSize.x - baseSize.x * 0.9) < 0.001,
        `Hop width for ${skinId} must scale by 0.9x relative to calibrated base`
      );

      // 2. Collision death squash: root scale (1.65, 0.1, 1.65)
      root.scale.set(1.65, 0.1, 1.65);
      root.updateMatrixWorld(true);
      const deathBox = new THREE.Box3().setFromObject(root);
      const deathSize = new THREE.Vector3();
      deathBox.getSize(deathSize);

      assert.ok(
        Math.abs(deathSize.y - baseSize.y * 0.1) < 0.001,
        `Death height for ${skinId} must scale by 0.1x relative to calibrated base`
      );
      assert.ok(
        Math.abs(deathSize.x - baseSize.x * 1.65) < 0.001,
        `Death width for ${skinId} must scale by 1.65x relative to calibrated base`
      );

      // 3. Reset to neutral root scale (1, 1, 1) preserves base calibration
      root.scale.set(1, 1, 1);
      root.updateMatrixWorld(true);
      const resetBox = new THREE.Box3().setFromObject(root);
      const resetSize = new THREE.Vector3();
      resetBox.getSize(resetSize);

      assert.ok(
        Math.abs(resetSize.x - baseSize.x) < 0.0001,
        `Reset width for ${skinId} must restore base calibrated size`
      );
      assert.ok(
        Math.abs(resetSize.y - baseSize.y) < 0.0001,
        `Reset height for ${skinId} must restore base calibrated size`
      );

      // Inner pivot scale was untouched
      assert.equal(innerPivot.scale.x, calib.scale);
      assert.equal(innerPivot.scale.y, calib.scale);
      assert.equal(innerPivot.scale.z, calib.scale);
    }
  });

  it('Requirement 3 (Harmonious Dimension Balance): all calibrated character heights are between 0.60 and 0.85', () => {
    for (const skin of ALL_SKINS) {
      const root = createUrbanCharacter(skin.id);
      root.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(root);
      const size = new THREE.Vector3();
      box.getSize(size);

      assert.ok(
        size.y >= 0.6 && size.y <= 0.85,
        `Character ${skin.id} height (${size.y.toFixed(3)}) must be harmoniously balanced between 0.60 and 0.85`
      );
      assert.ok(
        size.x >= 0.25 && size.x <= 0.7,
        `Character ${skin.id} width (${size.x.toFixed(3)}) must be within playable lane limits [0.25, 0.70]`
      );
    }
  });

  it('Requirement 4 (File Length Gate <= 300 Lines): touched files strictly respect the 300 lines rule', () => {
    const files = [
      'src/view/urbanCharacters.ts',
      'src/view/urbanCharactersExpansionA.ts',
      'src/view/urbanCharactersExpansionB.ts',
      'src/view/gachaCardArt.ts',
    ];

    for (const rel of files) {
      const fullPath = path.join(process.cwd(), rel);
      const lines = fs.readFileSync(fullPath, 'utf8').split('\n').length;
      assert.ok(
        lines <= 300,
        `File ${rel} has ${lines} lines, exceeding the 300-line architectural limit!`
      );
    }
  });

  it('Requirement 5 (Model Diagnostics Compatibility): getModelDiagnostics correctly measures meshCount and dims', () => {
    for (const skin of ALL_SKINS) {
      const root = createUrbanCharacter(skin.id);
      const diag = getModelDiagnostics(root);
      assert.ok(diag.meshCount >= 40, `Model ${skin.id} meshCount must be >= 40, got ${diag.meshCount}`);
      assert.ok(diag.dims.includes('×'), `Dims for ${skin.id} must include '×'`);
    }
  });
});
