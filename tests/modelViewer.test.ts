import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ALL_SKINS } from '../src/core/types.ts';
import {
  getBuildingModelItems,
  getCharacterModelItems,
  getModelCatalog,
  getModelDiagnostics,
  getNatureModelItems,
  getPropModelItems,
  getVehicleModelItems,
  verifyModelRegistry,
} from '../src/view/modelRegistry.ts';

describe('3D Model Viewer & Dynamic Model Registry Suite', () => {
  it('Property 1 (Dynamic Character Discovery from ALL_SKINS): includes all skins defined in ALL_SKINS with valid badges and names', () => {
    const chars = getCharacterModelItems();
    assert.equal(
      chars.length,
      ALL_SKINS.length,
      `Character items count (${chars.length}) must match ALL_SKINS length (${ALL_SKINS.length})`
    );

    for (const skin of ALL_SKINS) {
      const match = chars.find((c) => c.id === skin.id);
      assert.ok(match, `Skin "${skin.id}" must exist in character model items`);
      assert.equal(match.name, skin.name);
      assert.equal(match.icon, skin.badge);
      assert.equal(match.cat, 'chars');

      // Create model mesh
      const group = match.create('forest', false);
      assert.ok(group.isGroup, `Skin "${skin.id}" must return a THREE.Group`);
      const diag = getModelDiagnostics(group);
      assert.ok(
        diag.meshCount >= 25,
        `Skin "${skin.id}" must have at least 25 voxels/meshes (had ${diag.meshCount})`
      );
    }
  });

  it('Property 2 (Ghost Mode Support for Characters): creates valid translucent mesh groups', () => {
    const chars = getCharacterModelItems();
    for (const charItem of chars) {
      const normalGroup = charItem.create('forest', false);
      const ghostGroup = charItem.create('forest', true);

      assert.ok(ghostGroup.isGroup);
      const normalDiag = getModelDiagnostics(normalGroup);
      const ghostDiag = getModelDiagnostics(ghostGroup);

      assert.equal(
        ghostDiag.meshCount,
        normalDiag.meshCount,
        `Ghost model for ${charItem.id} must have same number of voxels as normal model`
      );
    }
  });

  it('Property 3 (Vehicle Models High-Fidelity Geometry): all 6 vehicles instantiate with rich voxel detail', () => {
    const vehicles = getVehicleModelItems();
    const expectedIds = ['taxi', 'scooter', 'bus', 'sweeper', 'train', 'pallet'];

    assert.equal(vehicles.length, expectedIds.length);

    for (const id of expectedIds) {
      const v = vehicles.find((item) => item.id === id);
      assert.ok(v, `Vehicle "${id}" must exist in catalog`);
      assert.equal(v.cat, 'vehicles');

      const group = v.create();
      assert.ok(group.isGroup, `Vehicle "${id}" must return a THREE.Group`);
      const diag = getModelDiagnostics(group);
      assert.ok(
        diag.meshCount >= 10,
        `Vehicle "${id}" must have >= 10 voxel meshes (had ${diag.meshCount})`
      );
    }
  });

  it('Property 4 (Environment Props Integrity): all 10 props instantiate correctly', () => {
    const props = getPropModelItems();
    assert.equal(props.length, 10, 'Must have 10 environment prop items');

    for (const prop of props) {
      assert.equal(prop.cat, 'props');
      const group = prop.create('forest');
      assert.ok(group.isGroup, `Prop "${prop.id}" must return a THREE.Group`);
      const diag = getModelDiagnostics(group);
      assert.ok(diag.meshCount > 0, `Prop "${prop.id}" must have > 0 meshes`);
    }
  });

  it('Property 5 (Nature Biome Responsiveness): trees and hedges adapt to all 4 biomes', () => {
    const nature = getNatureModelItems();
    const biomes = ['forest', 'winter', 'desert', 'neon'] as const;

    for (const item of nature) {
      assert.equal(item.cat, 'nature');
      for (const biome of biomes) {
        const group = item.create(biome);
        assert.ok(group.isGroup, `Nature "${item.id}" in biome "${biome}" must be a group`);
        const diag = getModelDiagnostics(group);
        assert.ok(diag.meshCount >= 3, `Nature "${item.id}" must have >= 3 meshes`);
      }
    }
  });

  it('Property 6 (Architectural Townhouses): all 3 townhouses instantiate with authentic shopfront features', () => {
    const buildings = getBuildingModelItems();
    assert.equal(buildings.length, 3, 'Must have 3 townhouse variants');

    for (const bldg of buildings) {
      assert.equal(bldg.cat, 'buildings');
      const group = bldg.create();
      assert.ok(group.isGroup, `Building "${bldg.id}" must return a THREE.Group`);
      const diag = getModelDiagnostics(group);
      assert.ok(
        diag.meshCount >= 25,
        `Building "${bldg.id}" must have >= 25 voxel meshes (had ${diag.meshCount})`
      );
    }
  });

  it('Property 7 (Comprehensive Model Registry Verification): verifyModelRegistry reports 0 errors across entire catalog', () => {
    const report = verifyModelRegistry();
    assert.equal(report.errors.length, 0, `Registry errors found: ${report.errors.join('; ')}`);
    assert.ok(report.total >= 25, `Total models should be >= 25 (was ${report.total})`);
    assert.equal(report.countsByCategory['chars'], ALL_SKINS.length);
    assert.equal(report.countsByCategory['vehicles'], 6);
    assert.equal(report.countsByCategory['props'], 10);
    assert.equal(report.countsByCategory['nature'], 3);
    assert.equal(report.countsByCategory['buildings'], 3);
  });

  it('Property 8 (Model Diagnostics Accuracy): measures non-zero dimensions and non-empty bounds', () => {
    const catalog = getModelCatalog();
    for (const item of catalog) {
      const group = item.create('forest', false);
      const diag = getModelDiagnostics(group);
      assert.ok(diag.meshCount > 0, `Mesh count for ${item.id} must be > 0`);
      assert.ok(
        diag.dims.includes('×'),
        `Dimensions string for ${item.id} must include '×' (was ${diag.dims})`
      );
      const parts = diag.dims.split('×').map((s) => parseFloat(s.trim()));
      assert.equal(parts.length, 3);
      assert.ok(parts[0] > 0, `Width for ${item.id} must be > 0`);
      assert.ok(parts[1] > 0, `Height for ${item.id} must be > 0`);
      assert.ok(parts[2] > 0, `Depth for ${item.id} must be > 0`);
    }
  });
});
