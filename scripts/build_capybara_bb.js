
Cube.all.slice().forEach(c => c.remove());
Texture.all.slice().forEach(t => t.remove());

const canvas = document.createElement('canvas');
canvas.width = 16;
canvas.height = 16;
const ctx = canvas.getContext('2d');
ctx.fillStyle = '#1e293b';
ctx.fillRect(0, 0, 16, 16);

const swatches = [
  "#925227",
  "#78350f",
  "#542d13",
  "#2b170a",
  "#1e293b",
  "#0f172a",
  "#f97316",
  "#16a34a",
  "#facc15"
];
swatches.forEach((hex, idx) => {
  ctx.fillStyle = hex;
  ctx.fillRect(idx, 0, 1, 1);
});

const tex = new Texture({ name: 'capybara_palette' });
tex.fromDataURL(canvas.toDataURL('image/png')).add(false);

const cubesData = [{"name": "paw_front_left", "from": [-3.65, 0.0, -3.65], "to": [-2.05, 1.45, -1.85], "color": "capybaraPaws", "col_idx": 3, "uv": [3, 0, 4, 1]}, {"name": "paw_digits_front_left", "from": [-3.45, 0.05, -4.25], "to": [-2.25, 0.75, -3.55], "color": "capybaraPaws", "col_idx": 3, "uv": [3, 0, 4, 1]}, {"name": "leg_front_left", "from": [-3.45, 1.25, -3.35], "to": [-2.25, 3.25, -2.05], "color": "capybaraCaramel", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "paw_front_right", "from": [2.05, 0.0, -3.65], "to": [3.65, 1.45, -1.85], "color": "capybaraPaws", "col_idx": 3, "uv": [3, 0, 4, 1]}, {"name": "paw_digits_front_right", "from": [2.25, 0.05, -4.25], "to": [3.45, 0.75, -3.55], "color": "capybaraPaws", "col_idx": 3, "uv": [3, 0, 4, 1]}, {"name": "leg_front_right", "from": [2.25, 1.25, -3.35], "to": [3.45, 3.25, -2.05], "color": "capybaraCaramel", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "thigh_rear_left", "from": [-4.15, 0.95, 1.25], "to": [-2.45, 4.25, 3.95], "color": "capybaraCaramel", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "paw_rear_left", "from": [-3.85, 0.0, 1.05], "to": [-2.25, 1.35, 3.55], "color": "capybaraPaws", "col_idx": 3, "uv": [3, 0, 4, 1]}, {"name": "paw_digits_rear_left", "from": [-3.65, 0.05, 0.35], "to": [-2.45, 0.75, 1.15], "color": "capybaraPaws", "col_idx": 3, "uv": [3, 0, 4, 1]}, {"name": "thigh_rear_right", "from": [2.45, 0.95, 1.25], "to": [4.15, 4.25, 3.95], "color": "capybaraCaramel", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "paw_rear_right", "from": [2.25, 0.0, 1.05], "to": [3.85, 1.35, 3.55], "color": "capybaraPaws", "col_idx": 3, "uv": [3, 0, 4, 1]}, {"name": "paw_digits_rear_right", "from": [2.45, 0.05, 0.35], "to": [3.65, 0.75, 1.15], "color": "capybaraPaws", "col_idx": 3, "uv": [3, 0, 4, 1]}, {"name": "body_core", "from": [-3.75, 2.45, -2.95], "to": [3.75, 7.15, 3.75], "color": "capybaraCaramel", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "body_underbelly", "from": [-2.85, 1.85, -2.55], "to": [2.85, 3.15, 3.35], "color": "capybaraMuzzle", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "flank_left", "from": [-4.35, 2.85, -1.85], "to": [-3.55, 6.25, 2.85], "color": "capybaraBrown", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "flank_right", "from": [3.55, 2.85, -1.85], "to": [4.35, 6.25, 2.85], "color": "capybaraBrown", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "rump_rear", "from": [-3.15, 2.95, 3.55], "to": [3.15, 6.65, 4.65], "color": "capybaraCaramel", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "rump_slope_top", "from": [-2.65, 6.45, 1.85], "to": [2.65, 7.35, 4.15], "color": "capybaraBrown", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "tail_stub", "from": [-0.65, 3.25, 4.55], "to": [0.65, 4.15, 5.25], "color": "capybaraMuzzle", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "neck_base", "from": [-3.25, 3.85, -4.35], "to": [3.25, 7.45, -2.65], "color": "capybaraCaramel", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "neck_bib_throat", "from": [-2.35, 3.15, -4.65], "to": [2.35, 5.65, -3.15], "color": "capybaraMuzzle", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "chest_zen_fluff", "from": [-2.15, 5.25, -3.85], "to": [2.15, 6.75, -2.75], "color": "capybaraBrown", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "head_core", "from": [-3.05, 6.85, -5.85], "to": [3.05, 11.25, -1.65], "color": "capybaraCaramel", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "head_crown_flat", "from": [-2.75, 11.05, -5.45], "to": [2.75, 11.85, -2.15], "color": "capybaraCaramel", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "snout_muzzle", "from": [-2.45, 6.45, -7.45], "to": [2.45, 10.05, -5.65], "color": "capybaraMuzzle", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "snout_chin_under", "from": [-1.95, 5.75, -6.85], "to": [1.95, 7.15, -4.95], "color": "capybaraMuzzle", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "nose_pad_dark", "from": [-1.05, 8.55, -7.75], "to": [1.05, 9.85, -7.25], "color": "capybaraDark", "col_idx": 4, "uv": [4, 0, 5, 1]}, {"name": "nostril_slit_left", "from": [-1.25, 8.85, -7.85], "to": [-0.65, 9.45, -7.55], "color": "maskBlack", "col_idx": 5, "uv": [5, 0, 6, 1]}, {"name": "nostril_slit_right", "from": [0.65, 8.85, -7.85], "to": [1.25, 9.45, -7.55], "color": "maskBlack", "col_idx": 5, "uv": [5, 0, 6, 1]}, {"name": "nostril_bridge", "from": [-0.35, 7.85, -7.65], "to": [0.35, 8.75, -7.15], "color": "capybaraDark", "col_idx": 4, "uv": [4, 0, 5, 1]}, {"name": "cheek_fluff_left", "from": [-3.65, 7.25, -4.85], "to": [-2.85, 9.85, -2.55], "color": "capybaraBrown", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "cheek_fluff_right", "from": [2.85, 7.25, -4.85], "to": [3.65, 9.85, -2.55], "color": "capybaraBrown", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "eye_closed_left", "from": [-3.15, 9.25, -4.75], "to": [-2.95, 9.75, -3.35], "color": "maskBlack", "col_idx": 5, "uv": [5, 0, 6, 1]}, {"name": "eye_closed_right", "from": [2.95, 9.25, -4.75], "to": [3.15, 9.75, -3.35], "color": "maskBlack", "col_idx": 5, "uv": [5, 0, 6, 1]}, {"name": "ear_base_left", "from": [-3.35, 11.15, -2.85], "to": [-2.15, 12.65, -1.45], "color": "capybaraBrown", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "ear_rim_left", "from": [-3.15, 12.45, -2.65], "to": [-2.35, 13.35, -1.65], "color": "capybaraCaramel", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "ear_inner_left", "from": [-3.05, 11.55, -2.95], "to": [-2.45, 12.55, -2.75], "color": "capybaraMuzzle", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "ear_base_right", "from": [2.15, 11.15, -2.85], "to": [3.35, 12.65, -1.45], "color": "capybaraBrown", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "ear_rim_right", "from": [2.35, 12.45, -2.65], "to": [3.15, 13.35, -1.65], "color": "capybaraCaramel", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "ear_inner_right", "from": [2.45, 11.55, -2.95], "to": [3.05, 12.55, -2.75], "color": "capybaraMuzzle", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "mandarin_base", "from": [-1.25, 11.75, -4.75], "to": [1.25, 12.35, -2.85], "color": "orangeFruit", "col_idx": 6, "uv": [6, 0, 7, 1]}, {"name": "mandarin_middle_bulge", "from": [-1.65, 12.15, -5.15], "to": [1.65, 13.45, -2.45], "color": "orangeFruit", "col_idx": 6, "uv": [6, 0, 7, 1]}, {"name": "mandarin_top_dome", "from": [-1.15, 13.25, -4.65], "to": [1.15, 14.05, -2.95], "color": "orangeFruit", "col_idx": 6, "uv": [6, 0, 7, 1]}, {"name": "mandarin_stem", "from": [-0.25, 13.95, -4.05], "to": [0.25, 14.65, -3.55], "color": "greenLeaf", "col_idx": 7, "uv": [7, 0, 8, 1]}, {"name": "mandarin_leaf", "from": [0.15, 14.15, -3.85], "to": [1.25, 14.55, -2.95], "color": "greenLeaf", "col_idx": 7, "uv": [7, 0, 8, 1]}, {"name": "mandarin_leaf_tip", "from": [0.75, 13.95, -3.45], "to": [1.65, 14.35, -2.75], "color": "greenLeaf", "col_idx": 7, "uv": [7, 0, 8, 1]}, {"name": "mandarin_leaf_left", "from": [-1.05, 14.15, -4.45], "to": [-0.15, 14.55, -3.75], "color": "greenLeaf", "col_idx": 7, "uv": [7, 0, 8, 1]}, {"name": "mandarin_sun_spot", "from": [-1.35, 12.65, -5.25], "to": [-0.65, 13.35, -4.75], "color": "goldCoin", "col_idx": 8, "uv": [8, 0, 9, 1]}, {"name": "forehead_zen_tuft", "from": [-0.65, 10.45, -5.95], "to": [0.65, 11.45, -5.35], "color": "capybaraBrown", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "chin_zen_button", "from": [-0.85, 6.15, -7.15], "to": [0.85, 6.95, -6.35], "color": "capybaraDark", "col_idx": 4, "uv": [4, 0, 5, 1]}];

Undo.initEdit({ elements: [] });

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
});

Undo.finishEdit('Zen Capybara V1.0 (Stoic Meditative Pose with Yuzu Mandarin on Head)');
Canvas.updateAll();

return {
  cubesCount: Cube.all.length,
  textureName: tex.name
};
