
Cube.all.slice().forEach(c => c.remove());
Group.all.slice().forEach(g => g.remove());
Texture.all.slice().forEach(t => t.remove());

Project.name = 'arctic_fox';
Project.texture_width = 16;
Project.texture_height = 16;

const canvas = document.createElement('canvas');
canvas.width = 16;
canvas.height = 16;
const ctx = canvas.getContext('2d');
ctx.fillStyle = '#0f172a';
ctx.fillRect(0, 0, 16, 16);

const swatches = ["#f1f5f9", "#cbd5e1", "#ffffff", "#0f172a", "#1e293b", "#059669", "#facc15", "#fbcfe8"];
swatches.forEach((hex, idx) => {
  ctx.fillStyle = hex;
  ctx.fillRect(idx, 0, 1, 1);
});

const tex = new Texture({ name: 'arctic_fox_palette' });
tex.fromDataURL(canvas.toDataURL('image/png')).add(false);

const groupDefs = ["legs", "body", "head_snout", "earmuffs", "fluffy_tail"];
const groups = {};
groupDefs.forEach(name => {
  groups[name] = new Group({ name: name }).init();
});

const cubesData = [{"name": "front_paw_pad_left", "group": "legs", "from": [-2.8, 0.0, -3.8], "to": [-1.6, 0.5, -2.4], "color": "foxSilver", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "front_paw_toes_left", "group": "legs", "from": [-2.6, 0.05, -4.2], "to": [-1.8, 0.45, -3.7], "color": "foxWhite", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "front_leg_left", "group": "legs", "from": [-2.7, 0.4, -3.7], "to": [-1.7, 2.7, -2.5], "color": "foxSilverWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "front_shoulder_left", "group": "legs", "from": [-2.85, 2.6, -3.85], "to": [-1.6, 4.4, -2.35], "color": "foxSilverWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "front_paw_pad_right", "group": "legs", "from": [1.6, 0.0, -3.8], "to": [2.8, 0.5, -2.4], "color": "foxSilver", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "front_paw_toes_right", "group": "legs", "from": [1.8, 0.05, -4.2], "to": [2.6, 0.45, -3.7], "color": "foxWhite", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "front_leg_right", "group": "legs", "from": [1.7, 0.4, -3.7], "to": [2.7, 2.7, -2.5], "color": "foxSilverWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "front_shoulder_right", "group": "legs", "from": [1.6, 2.6, -3.85], "to": [2.85, 4.4, -2.35], "color": "foxSilverWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "rear_paw_pad_left", "group": "legs", "from": [-2.8, 0.0, 1.8], "to": [-1.6, 0.5, 3.2], "color": "foxSilver", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "rear_paw_hock_left", "group": "legs", "from": [-2.7, 0.4, 1.9], "to": [-1.7, 2.65, 3.1], "color": "foxSilverWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "rear_thigh_haunch_left", "group": "legs", "from": [-3.1, 2.5, 1.4], "to": [-1.55, 4.8, 3.5], "color": "foxSilverWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "rear_paw_pad_right", "group": "legs", "from": [1.6, 0.0, 1.8], "to": [2.8, 0.5, 3.2], "color": "foxSilver", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "rear_paw_hock_right", "group": "legs", "from": [1.7, 0.4, 1.9], "to": [2.7, 2.65, 3.1], "color": "foxSilverWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "rear_thigh_haunch_right", "group": "legs", "from": [1.55, 2.5, 1.4], "to": [3.1, 4.8, 3.5], "color": "foxSilverWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "body_torso_core", "group": "body", "from": [-2.6, 2.4, -3.1], "to": [2.6, 6.0, 2.9], "color": "foxSilverWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "body_belly_white", "group": "body", "from": [-2.0, 2.05, -2.7], "to": [2.0, 2.45, 2.5], "color": "foxWhite", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "chest_bib_main", "group": "body", "from": [-2.4, 2.8, -4.2], "to": [2.4, 6.2, -3.0], "color": "foxWhite", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "chest_bib_fluff_high", "group": "body", "from": [-1.9, 3.6, -4.6], "to": [1.9, 5.7, -4.1], "color": "foxWhite", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "chest_throat_tuft", "group": "body", "from": [-1.4, 5.5, -4.8], "to": [1.4, 6.7, -4.15], "color": "foxWhite", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "body_back_mantle", "group": "body", "from": [-2.2, 5.9, -2.3], "to": [2.2, 6.3, 2.1], "color": "foxSilver", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "body_flank_left", "group": "body", "from": [-2.8, 3.1, -1.8], "to": [-2.5, 5.4, 1.6], "color": "foxSilverWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "body_flank_right", "group": "body", "from": [2.5, 3.1, -1.8], "to": [2.8, 5.4, 1.6], "color": "foxSilverWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "body_rump_loaf", "group": "body", "from": [-2.4, 2.6, 2.8], "to": [2.4, 5.8, 3.9], "color": "foxSilverWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "rear_breeches_fluff", "group": "body", "from": [-2.0, 3.0, 3.8], "to": [2.0, 5.2, 4.3], "color": "foxWhite", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "neck_transition", "group": "body", "from": [-2.1, 5.7, -3.7], "to": [2.1, 7.3, -1.9], "color": "foxSilverWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "head_core", "group": "head_snout", "from": [-2.5, 6.8, -4.7], "to": [2.5, 10.5, -0.9], "color": "foxSilverWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "head_crown_top", "group": "head_snout", "from": [-1.2, 10.4, -3.2], "to": [1.2, 10.95, -1.5], "color": "foxSilverWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "head_forehead_brow", "group": "head_snout", "from": [-1.6, 9.75, -4.8], "to": [1.6, 10.6, -3.5], "color": "foxSilverWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "snout_blaze_upper", "group": "head_snout", "from": [-1.0, 8.6, -5.0], "to": [1.0, 9.7, -4.55], "color": "foxWhite", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "cheek_fluff_left", "group": "head_snout", "from": [-3.2, 7.1, -4.3], "to": [-2.4, 8.9, -1.8], "color": "foxWhite", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "cheek_fluff_right", "group": "head_snout", "from": [2.4, 7.1, -4.3], "to": [3.2, 8.9, -1.8], "color": "foxWhite", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "snout_bridge", "group": "head_snout", "from": [-1.4, 7.1, -6.1], "to": [1.4, 8.55, -4.6], "color": "foxWhite", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "snout_taper", "group": "head_snout", "from": [-1.0, 7.2, -7.2], "to": [1.0, 8.4, -6.0], "color": "foxWhite", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "snout_tip_wedge", "group": "head_snout", "from": [-0.65, 7.4, -7.8], "to": [0.65, 8.25, -7.1], "color": "foxWhite", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "chin_under_jaw", "group": "head_snout", "from": [-0.9, 6.65, -5.8], "to": [0.9, 7.2, -4.4], "color": "foxWhite", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "nose_button", "group": "head_snout", "from": [-0.5, 7.9, -8.15], "to": [0.5, 8.55, -7.6], "color": "foxNose", "col_idx": 3, "uv": [3, 0, 4, 1]}, {"name": "eye_base_left", "group": "head_snout", "from": [-2.15, 8.6, -5.15], "to": [-1.15, 9.65, -4.65], "color": "foxEye", "col_idx": 4, "uv": [4, 0, 5, 1]}, {"name": "eye_sparkle_left", "group": "head_snout", "from": [-1.9, 9.15, -5.25], "to": [-1.35, 9.55, -5.0], "color": "foxWhite", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "eye_base_right", "group": "head_snout", "from": [1.15, 8.6, -5.15], "to": [2.15, 9.65, -4.65], "color": "foxEye", "col_idx": 4, "uv": [4, 0, 5, 1]}, {"name": "eye_sparkle_right", "group": "head_snout", "from": [1.35, 9.15, -5.25], "to": [1.9, 9.55, -5.0], "color": "foxWhite", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "ear_base_left", "group": "head_snout", "from": [-2.55, 10.3, -3.1], "to": [-1.35, 12.4, -1.8], "color": "foxSilver", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "ear_tip_left", "group": "head_snout", "from": [-2.25, 12.3, -2.95], "to": [-1.55, 13.9, -1.95], "color": "foxSilverWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "ear_inner_pink_left", "group": "head_snout", "from": [-2.15, 10.6, -3.15], "to": [-1.45, 12.25, -2.9], "color": "innerEarPink", "col_idx": 7, "uv": [7, 0, 8, 1]}, {"name": "ear_base_right", "group": "head_snout", "from": [1.35, 10.3, -3.1], "to": [2.55, 12.4, -1.8], "color": "foxSilver", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "ear_tip_right", "group": "head_snout", "from": [1.55, 12.3, -2.95], "to": [2.25, 13.9, -1.95], "color": "foxSilverWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "ear_inner_pink_right", "group": "head_snout", "from": [1.45, 10.6, -3.15], "to": [2.15, 12.25, -2.9], "color": "innerEarPink", "col_idx": 7, "uv": [7, 0, 8, 1]}, {"name": "earmuff_band_top", "group": "earmuffs", "from": [-2.5, 10.75, -2.85], "to": [2.5, 11.35, -2.15], "color": "muffEmerald", "col_idx": 5, "uv": [5, 0, 6, 1]}, {"name": "earmuff_band_crest", "group": "earmuffs", "from": [-0.55, 11.25, -2.95], "to": [0.55, 11.55, -2.05], "color": "muffGold", "col_idx": 6, "uv": [6, 0, 7, 1]}, {"name": "earmuff_band_left", "group": "earmuffs", "from": [-2.9, 9.9, -2.75], "to": [-2.35, 10.95, -2.25], "color": "muffEmerald", "col_idx": 5, "uv": [5, 0, 6, 1]}, {"name": "earmuff_band_right", "group": "earmuffs", "from": [2.35, 9.9, -2.75], "to": [2.9, 10.95, -2.25], "color": "muffEmerald", "col_idx": 5, "uv": [5, 0, 6, 1]}, {"name": "earmuff_cushion_left", "group": "earmuffs", "from": [-3.6, 8.4, -3.45], "to": [-2.55, 10.2, -1.55], "color": "muffGold", "col_idx": 6, "uv": [6, 0, 7, 1]}, {"name": "earmuff_dome_left", "group": "earmuffs", "from": [-3.85, 8.65, -3.25], "to": [-3.35, 9.95, -1.75], "color": "muffEmerald", "col_idx": 5, "uv": [5, 0, 6, 1]}, {"name": "earmuff_gem_left", "group": "earmuffs", "from": [-3.95, 9.1, -2.7], "to": [-3.75, 9.5, -2.3], "color": "muffGold", "col_idx": 6, "uv": [6, 0, 7, 1]}, {"name": "earmuff_cushion_right", "group": "earmuffs", "from": [2.55, 8.4, -3.45], "to": [3.6, 10.2, -1.55], "color": "muffGold", "col_idx": 6, "uv": [6, 0, 7, 1]}, {"name": "earmuff_dome_right", "group": "earmuffs", "from": [3.35, 8.65, -3.25], "to": [3.85, 9.95, -1.75], "color": "muffEmerald", "col_idx": 5, "uv": [5, 0, 6, 1]}, {"name": "earmuff_gem_right", "group": "earmuffs", "from": [3.75, 9.1, -2.7], "to": [3.95, 9.5, -2.3], "color": "muffGold", "col_idx": 6, "uv": [6, 0, 7, 1]}, {"name": "tail_base_root", "group": "fluffy_tail", "from": [-0.85, 4.4, 3.6], "to": [0.85, 5.9, 4.9], "color": "foxSilverWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "tail_mid_expand", "group": "fluffy_tail", "from": [-1.25, 5.5, 4.6], "to": [1.25, 7.3, 6.3], "color": "foxSilverWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "tail_bulge_core", "group": "fluffy_tail", "from": [-1.55, 6.9, 5.4], "to": [1.55, 9.4, 7.5], "color": "foxSilverWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "tail_fluff_flank_left", "group": "fluffy_tail", "from": [-1.9, 7.3, 5.7], "to": [-1.45, 9.0, 7.2], "color": "foxWhite", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "tail_fluff_flank_right", "group": "fluffy_tail", "from": [1.45, 7.3, 5.7], "to": [1.9, 9.0, 7.2], "color": "foxWhite", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "tail_upper_arch", "group": "fluffy_tail", "from": [-1.35, 9.1, 5.1], "to": [1.35, 11.2, 7.1], "color": "foxWhite", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "tail_white_tip_core", "group": "fluffy_tail", "from": [-1.05, 10.9, 4.4], "to": [1.05, 12.6, 6.2], "color": "foxWhite", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "tail_tip_curl_tuft", "group": "fluffy_tail", "from": [-0.7, 12.3, 3.9], "to": [0.7, 13.4, 5.3], "color": "foxWhite", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "tail_underside_shadow", "group": "fluffy_tail", "from": [-1.0, 6.1, 4.8], "to": [1.0, 7.2, 6.1], "color": "foxSilver", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "tail_dorsal_crest", "group": "fluffy_tail", "from": [-0.8, 8.8, 6.9], "to": [0.8, 10.5, 7.7], "color": "foxSilverWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "tail_tip_hook", "group": "fluffy_tail", "from": [-0.5, 13.1, 3.5], "to": [0.5, 13.8, 4.5], "color": "foxWhite", "col_idx": 2, "uv": [2, 0, 3, 1]}];

Undo.initEdit({ elements: [], groups: [] });

cubesData.forEach(d => {
  const cube = new Cube({
    name: d.name,
    from: d.from,
    to: d.to,
    faces: {
      north: { uv: d.uv, texture: tex.uuid },
      east:  { uv: d.uv, texture: tex.uuid },
      south: { uv: d.uv, texture: tex.uuid },
      west:  { uv: d.uv, texture: tex.uuid },
      up:    { uv: d.uv, texture: tex.uuid },
      down:  { uv: d.uv, texture: tex.uuid }
    }
  });
  cube.init();
  if (groups[d.group]) {
    cube.addTo(groups[d.group]);
  }
});

Undo.finishEdit('Arctic Fox (Rare 🦊) - Silver-White Fur, Emerald & Gold Classic Headband, Open Clear Eyes, Zero Z-Fighting, 67 Cubes');
Canvas.updateAll();

const modelData = Format.codec.compile();
Blockbench.writeFile('C:/Users/MIXPC/.gemini/antigravity/scratch/crossy-road-pro/assets/models/arctic_fox.bbmodel', { content: modelData });

return {
  success: true,
  cubesCount: Cube.all.length,
  groupsCount: Group.all.length,
  textureName: tex.name,
  savedPath: 'C:/Users/MIXPC/.gemini/antigravity/scratch/crossy-road-pro/assets/models/arctic_fox.bbmodel'
};
