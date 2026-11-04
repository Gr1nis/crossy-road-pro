
Cube.all.slice().forEach(c => c.remove());
Group.all.slice().forEach(g => g.remove());
Texture.all.slice().forEach(t => t.remove());

Project.name = 'husky_sweater';
Project.texture_width = 16;
Project.texture_height = 16;

const canvas = document.createElement('canvas');
canvas.width = 16;
canvas.height = 16;
const ctx = canvas.getContext('2d');
ctx.fillStyle = '#0f172a';
ctx.fillRect(0, 0, 16, 16);

const swatches = ["#1e293b", "#475569", "#f8fafc", "#dc2626", "#ffffff", "#38bdf8", "#09090b", "#f472b6"];
swatches.forEach((hex, idx) => {
  ctx.fillStyle = hex;
  ctx.fillRect(idx, 0, 1, 1);
});

const tex = new Texture({ name: 'husky_sweater_palette' });
tex.fromDataURL(canvas.toDataURL('image/png')).add(false);

const groupDefs = ["legs", "body_sweater", "sweater_collar", "head_neck", "tail"];
const groups = {};
groupDefs.forEach(name => {
  groups[name] = new Group({ name: name }).init();
});

const cubesData = [{"name": "front_paw_pad_left", "group": "legs", "from": [-3.7, 0.0, -3.9], "to": [-1.9, 0.6, -2.1], "color": "huskyWhite", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "front_toe_beans_left", "group": "legs", "from": [-3.4, 0.1, -4.4], "to": [-2.2, 0.55, -3.8], "color": "huskyWhite", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "front_paw_sock_left", "group": "legs", "from": [-3.8, 0.45, -4.0], "to": [-1.8, 2.05, -2.0], "color": "huskyWhite", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "front_sweater_cuff_left", "group": "legs", "from": [-3.9, 1.95, -4.1], "to": [-1.7, 3.0, -1.9], "color": "sweaterRed", "col_idx": 3, "uv": [3, 0, 4, 1]}, {"name": "front_paw_pad_right", "group": "legs", "from": [1.9, 0.0, -3.9], "to": [3.7, 0.6, -2.1], "color": "huskyWhite", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "front_toe_beans_right", "group": "legs", "from": [2.2, 0.1, -4.4], "to": [3.4, 0.55, -3.8], "color": "huskyWhite", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "front_paw_sock_right", "group": "legs", "from": [1.8, 0.45, -4.0], "to": [3.8, 2.05, -2.0], "color": "huskyWhite", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "front_sweater_cuff_right", "group": "legs", "from": [1.7, 1.95, -4.1], "to": [3.9, 3.0, -1.9], "color": "sweaterRed", "col_idx": 3, "uv": [3, 0, 4, 1]}, {"name": "rear_paw_pad_left", "group": "legs", "from": [-3.7, 0.0, 2.1], "to": [-1.9, 0.6, 3.9], "color": "huskyWhite", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "rear_paw_sock_left", "group": "legs", "from": [-3.8, 0.45, 2.0], "to": [-1.8, 2.85, 4.0], "color": "huskyWhite", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "rear_thigh_haunch_left", "group": "legs", "from": [-3.95, 2.75, 1.8], "to": [-1.7, 4.7, 4.2], "color": "huskyDark", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "rear_paw_pad_right", "group": "legs", "from": [1.9, 0.0, 2.1], "to": [3.7, 0.6, 3.9], "color": "huskyWhite", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "rear_paw_sock_right", "group": "legs", "from": [1.8, 0.45, 2.0], "to": [3.8, 2.85, 4.0], "color": "huskyWhite", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "rear_thigh_haunch_right", "group": "legs", "from": [1.7, 2.75, 1.8], "to": [3.95, 4.7, 4.2], "color": "huskyDark", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "body_loaf_core", "group": "body_sweater", "from": [-3.5, 2.5, -3.7], "to": [3.5, 7.0, 3.3], "color": "sweaterRed", "col_idx": 3, "uv": [3, 0, 4, 1]}, {"name": "body_belly_soft", "group": "body_sweater", "from": [-2.6, 2.2, -3.3], "to": [2.6, 2.6, 3.0], "color": "sweaterRed", "col_idx": 3, "uv": [3, 0, 4, 1]}, {"name": "sweater_hem_trim", "group": "body_sweater", "from": [-3.6, 2.35, 2.7], "to": [3.6, 3.1, 3.35], "color": "sweaterWhite", "col_idx": 4, "uv": [4, 0, 5, 1]}, {"name": "chest_bib_sweater", "group": "body_sweater", "from": [-3.2, 3.1, -4.4], "to": [3.2, 6.7, -3.6], "color": "sweaterRed", "col_idx": 3, "uv": [3, 0, 4, 1]}, {"name": "chest_snowflake_patch", "group": "body_sweater", "from": [-1.7, 4.1, -4.6], "to": [1.7, 5.9, -4.3], "color": "sweaterWhite", "col_idx": 4, "uv": [4, 0, 5, 1]}, {"name": "sweater_band_white_back", "group": "body_sweater", "from": [-2.9, 6.95, -0.9], "to": [2.9, 7.2, 0.5], "color": "sweaterWhite", "col_idx": 4, "uv": [4, 0, 5, 1]}, {"name": "sweater_band_white_left", "group": "body_sweater", "from": [-3.65, 4.6, -0.9], "to": [-3.45, 5.8, 0.5], "color": "sweaterWhite", "col_idx": 4, "uv": [4, 0, 5, 1]}, {"name": "sweater_band_white_right", "group": "body_sweater", "from": [3.45, 4.6, -0.9], "to": [3.65, 5.8, 0.5], "color": "sweaterWhite", "col_idx": 4, "uv": [4, 0, 5, 1]}, {"name": "rear_bum_loaf", "group": "body_sweater", "from": [-3.3, 2.7, 3.25], "to": [3.3, 6.7, 4.65], "color": "huskyDark", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "rear_bum_white_fluff", "group": "body_sweater", "from": [-2.7, 3.2, 4.55], "to": [2.7, 5.8, 5.1], "color": "huskyWhite", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "chest_under_ruff", "group": "body_sweater", "from": [-1.5, 2.65, -4.2], "to": [1.5, 3.4, -3.65], "color": "huskyWhite", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "collar_roll_red", "group": "sweater_collar", "from": [-3.65, 6.45, -5.1], "to": [3.65, 7.35, -0.2], "color": "sweaterRed", "col_idx": 3, "uv": [3, 0, 4, 1]}, {"name": "collar_trim_white", "group": "sweater_collar", "from": [-3.55, 7.3, -5.0], "to": [3.55, 7.6, -0.3], "color": "sweaterWhite", "col_idx": 4, "uv": [4, 0, 5, 1]}, {"name": "neck_nape_husky", "group": "sweater_collar", "from": [-2.7, 7.25, -1.4], "to": [2.7, 8.45, -0.35], "color": "huskyDark", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "head_core", "group": "head_neck", "from": [-3.4, 7.1, -5.8], "to": [3.4, 11.7, -0.4], "color": "huskyDark", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "head_crown", "group": "head_neck", "from": [-2.5, 11.6, -4.6], "to": [2.5, 12.2, -1.6], "color": "huskyDark", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "cheek_fluff_left", "group": "head_neck", "from": [-4.0, 7.5, -4.8], "to": [-3.3, 9.35, -1.8], "color": "huskyWhite", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "cheek_fluff_right", "group": "head_neck", "from": [3.3, 7.5, -4.8], "to": [4.0, 9.35, -1.8], "color": "huskyWhite", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "face_mask_white", "group": "head_neck", "from": [-2.9, 8.1, -6.0], "to": [2.9, 9.4, -5.7], "color": "huskyWhite", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "forehead_blaze", "group": "head_neck", "from": [-0.8, 9.35, -6.1], "to": [0.8, 12.1, -3.9], "color": "huskyWhite", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "snout_muzzle", "group": "head_neck", "from": [-1.8, 7.3, -7.5], "to": [1.8, 9.25, -5.65], "color": "huskyWhite", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "chin_under_mouth", "group": "head_neck", "from": [-1.3, 6.75, -6.7], "to": [1.3, 7.35, -5.6], "color": "huskyWhite", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "nose_button", "group": "head_neck", "from": [-0.7, 8.4, -8.1], "to": [0.7, 9.45, -7.4], "color": "noseBlack", "col_idx": 6, "uv": [6, 0, 7, 1]}, {"name": "tongue_playful", "group": "head_neck", "from": [0.2, 7.15, -7.8], "to": [0.75, 7.65, -6.85], "color": "tonguePink", "col_idx": 7, "uv": [7, 0, 8, 1]}, {"name": "eye_iris_left", "group": "head_neck", "from": [-2.5, 9.5, -6.05], "to": [-1.3, 10.55, -5.7], "color": "huskyBlue", "col_idx": 5, "uv": [5, 0, 6, 1]}, {"name": "eye_pupil_left", "group": "head_neck", "from": [-2.2, 9.75, -6.15], "to": [-1.5, 10.45, -5.95], "color": "noseBlack", "col_idx": 6, "uv": [6, 0, 7, 1]}, {"name": "eye_sparkle_left", "group": "head_neck", "from": [-2.1, 10.15, -6.25], "to": [-1.7, 10.4, -6.1], "color": "sweaterWhite", "col_idx": 4, "uv": [4, 0, 5, 1]}, {"name": "eyebrow_pip_left", "group": "head_neck", "from": [-2.4, 10.8, -6.0], "to": [-1.4, 11.25, -5.6], "color": "huskyWhite", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "eye_iris_right", "group": "head_neck", "from": [1.3, 9.5, -6.05], "to": [2.5, 10.55, -5.7], "color": "huskyBlue", "col_idx": 5, "uv": [5, 0, 6, 1]}, {"name": "eye_pupil_right", "group": "head_neck", "from": [1.5, 9.75, -6.15], "to": [2.2, 10.45, -5.95], "color": "noseBlack", "col_idx": 6, "uv": [6, 0, 7, 1]}, {"name": "eye_sparkle_right", "group": "head_neck", "from": [1.7, 10.15, -6.25], "to": [2.1, 10.4, -6.1], "color": "sweaterWhite", "col_idx": 4, "uv": [4, 0, 5, 1]}, {"name": "eyebrow_pip_right", "group": "head_neck", "from": [1.4, 10.8, -6.0], "to": [2.4, 11.25, -5.6], "color": "huskyWhite", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "ear_base_left", "group": "head_neck", "from": [-3.3, 11.4, -3.8], "to": [-1.6, 13.8, -2.2], "color": "huskyDark", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "ear_tip_left", "group": "head_neck", "from": [-3.1, 13.6, -3.6], "to": [-1.8, 15.4, -2.4], "color": "huskyDark", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "ear_inner_left", "group": "head_neck", "from": [-2.9, 11.8, -4.0], "to": [-2.0, 13.9, -3.5], "color": "huskyWhite", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "ear_base_right", "group": "head_neck", "from": [1.6, 11.4, -3.8], "to": [3.3, 13.8, -2.2], "color": "huskyDark", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "ear_tip_right", "group": "head_neck", "from": [1.8, 13.6, -3.6], "to": [3.1, 15.4, -2.4], "color": "huskyDark", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "ear_inner_right", "group": "head_neck", "from": [2.0, 11.8, -4.0], "to": [2.9, 13.9, -3.5], "color": "huskyWhite", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "tail_base_up", "group": "tail", "from": [-0.9, 5.5, 4.1], "to": [0.9, 6.9, 5.3], "color": "huskyDark", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "tail_mid_plume", "group": "tail", "from": [-1.0, 6.75, 4.6], "to": [1.0, 8.85, 6.0], "color": "huskyDark", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "tail_high_curl", "group": "tail", "from": [-0.95, 8.7, 4.1], "to": [0.95, 10.35, 5.5], "color": "huskyGray", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "tail_crest_white", "group": "tail", "from": [-0.85, 9.9, 3.2], "to": [0.85, 11.1, 4.6], "color": "huskyWhite", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "tail_feather_white", "group": "tail", "from": [-0.7, 8.9, 3.0], "to": [0.7, 10.1, 3.8], "color": "huskyWhite", "col_idx": 2, "uv": [2, 0, 3, 1]}];

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

Undo.finishEdit('Husky in Sweater V3.0 (Corgi-grade Loaf & Haunches, Low Snug Collar, Raised Ice-Blue Eyes, Upright Sickle Plume, Festive Red Knit, Zero Z-Fighting, 57 Cubes)');
Canvas.updateAll();

const modelData = Format.codec.compile();
Blockbench.writeFile('C:/Users/MIXPC/.gemini/antigravity/scratch/crossy-road-pro/assets/models/husky_sweater.bbmodel', { content: modelData });

return {
  success: true,
  cubesCount: Cube.all.length,
  groupsCount: Group.all.length,
  textureName: tex.name,
  savedPath: 'C:/Users/MIXPC/.gemini/antigravity/scratch/crossy-road-pro/assets/models/husky_sweater.bbmodel'
};
