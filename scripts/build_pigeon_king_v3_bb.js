
Cube.all.slice().forEach(c => c.remove());
Group.all.slice().forEach(g => g.remove());
Texture.all.slice().forEach(t => t.remove());

Project.texture_width = 16;
Project.texture_height = 16;

const canvas = document.createElement('canvas');
canvas.width = 16;
canvas.height = 16;
const ctx = canvas.getContext('2d');
ctx.fillStyle = '#0f172a';
ctx.fillRect(0, 0, 16, 16);

const swatches = ["#ffffff", "#e2e8f0", "#fde047", "#ffffff", "#f43f5e", "#f59e0b", "#09090b", "#ffffff", "#991b1b", "#f8fafc", "#0f172a", "#facc15", "#ca8a04", "#dc2626", "#2563eb"];
swatches.forEach((hex, idx) => {
  ctx.fillStyle = hex;
  ctx.fillRect(idx, 0, 1, 1);
});

const tex = new Texture({ name: 'pigeon_king_palette' });
tex.fromDataURL(canvas.toDataURL('image/png')).add(false);

const groupDefs = ["legs", "body", "wings", "head", "crown", "mantle"];
const groups = {};
groupDefs.forEach(name => {
  groups[name] = new Group({ name: name }).init();
});

const cubesData = [{"name": "foot_base_left", "group": "legs", "from": [-2.15, 0.04, -0.65], "to": [-1.45, 0.4, 0.75], "color": "pigeonFootRed", "col_idx": 4, "uv": [4, 0, 5, 1]}, {"name": "leg_shank_left", "group": "legs", "from": [-1.95, 0.35, -0.15], "to": [-1.65, 2.55, 0.25], "color": "pigeonFootRed", "col_idx": 4, "uv": [4, 0, 5, 1]}, {"name": "toe_mid_left", "group": "legs", "from": [-1.95, 0.0, -1.75], "to": [-1.65, 0.3, -0.55], "color": "pigeonFootRed", "col_idx": 4, "uv": [4, 0, 5, 1]}, {"name": "toe_outer_left", "group": "legs", "from": [-2.55, 0.0, -1.45], "to": [-2.05, 0.28, -0.45], "color": "pigeonFootRed", "col_idx": 4, "uv": [4, 0, 5, 1]}, {"name": "toe_inner_left", "group": "legs", "from": [-1.55, 0.0, -1.45], "to": [-1.05, 0.28, -0.45], "color": "pigeonFootRed", "col_idx": 4, "uv": [4, 0, 5, 1]}, {"name": "foot_base_right", "group": "legs", "from": [1.45, 0.04, -0.65], "to": [2.15, 0.4, 0.75], "color": "pigeonFootRed", "col_idx": 4, "uv": [4, 0, 5, 1]}, {"name": "leg_shank_right", "group": "legs", "from": [1.65, 0.35, -0.15], "to": [1.95, 2.55, 0.25], "color": "pigeonFootRed", "col_idx": 4, "uv": [4, 0, 5, 1]}, {"name": "toe_mid_right", "group": "legs", "from": [1.65, 0.0, -1.75], "to": [1.95, 0.3, -0.55], "color": "pigeonFootRed", "col_idx": 4, "uv": [4, 0, 5, 1]}, {"name": "toe_outer_right", "group": "legs", "from": [2.05, 0.0, -1.45], "to": [2.55, 0.28, -0.45], "color": "pigeonFootRed", "col_idx": 4, "uv": [4, 0, 5, 1]}, {"name": "toe_inner_right", "group": "legs", "from": [1.05, 0.0, -1.45], "to": [1.55, 0.28, -0.45], "color": "pigeonFootRed", "col_idx": 4, "uv": [4, 0, 5, 1]}, {"name": "thigh_fluff_left", "group": "body", "from": [-2.25, 2.35, -0.45], "to": [-1.35, 3.45, 0.55], "color": "featherPureWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "thigh_fluff_right", "group": "body", "from": [1.35, 2.35, -0.45], "to": [2.25, 3.45, 0.55], "color": "featherPureWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "body_lower_belly", "group": "body", "from": [-2.55, 3.25, -1.75], "to": [2.55, 4.38, 2.45], "color": "featherPureWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "body_core_loaf", "group": "body", "from": [-2.45, 4.35, -1.65], "to": [2.45, 7.62, 2.45], "color": "featherPureWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "breast_puff_lower", "group": "body", "from": [-2.15, 4.48, -2.55], "to": [2.15, 6.25, -1.5], "color": "featherPureWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "breast_puff_main", "group": "body", "from": [-2.05, 6.15, -2.85], "to": [2.05, 7.48, -1.55], "color": "featherPureWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "breast_puff_upper", "group": "body", "from": [-1.65, 7.45, -2.65], "to": [1.65, 8.48, -1.58], "color": "featherPureWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "torso_upper_block", "group": "body", "from": [-2.25, 7.4, -1.7], "to": [2.25, 8.52, 1.75], "color": "featherPureWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "neck_throat", "group": "body", "from": [-1.38, 7.3, -1.85], "to": [1.38, 8.85, -0.75], "color": "featherPureWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "neck_core", "group": "body", "from": [-1.35, 7.35, -0.85], "to": [1.35, 8.95, 0.85], "color": "featherPureWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "wing_left_shoulder", "group": "wings", "from": [-2.85, 5.25, -0.75], "to": [-2.35, 7.25, 1.75], "color": "featherPureWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "wing_left_mid", "group": "wings", "from": [-2.8, 4.25, 0.15], "to": [-2.3, 5.45, 2.18], "color": "featherPureWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "wing_left_flight", "group": "wings", "from": [-2.78, 3.55, 1.05], "to": [-2.38, 4.4, 2.8], "color": "featherPureWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "epaulette_left", "group": "wings", "from": [-2.92, 7.15, -0.55], "to": [-2.32, 7.5, 1.25], "color": "crownGold", "col_idx": 11, "uv": [11, 0, 12, 1]}, {"name": "wing_right_shoulder", "group": "wings", "from": [2.35, 5.25, -0.75], "to": [2.85, 7.25, 1.75], "color": "featherPureWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "wing_right_mid", "group": "wings", "from": [2.3, 4.25, 0.15], "to": [2.8, 5.45, 2.18], "color": "featherPureWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "wing_right_flight", "group": "wings", "from": [2.38, 3.55, 1.05], "to": [2.78, 4.4, 2.8], "color": "featherPureWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "epaulette_right", "group": "wings", "from": [2.32, 7.15, -0.55], "to": [2.92, 7.5, 1.25], "color": "crownGold", "col_idx": 11, "uv": [11, 0, 12, 1]}, {"name": "head_core", "group": "head", "from": [-1.55, 8.5, -1.75], "to": [1.55, 11.15, 0.95], "color": "featherPureWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "cheek_puff_left", "group": "head", "from": [-1.85, 8.55, -1.35], "to": [-1.45, 9.35, 0.45], "color": "featherPureWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "cheek_puff_right", "group": "head", "from": [1.45, 8.55, -1.35], "to": [1.85, 9.35, 0.45], "color": "featherPureWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "beak_upper", "group": "head", "from": [-0.45, 8.95, -3.35], "to": [0.45, 9.65, -1.65], "color": "pigeonBeak", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "beak_tip", "group": "head", "from": [-0.3, 8.75, -3.95], "to": [0.3, 9.35, -3.25], "color": "pigeonBeak", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "beak_cere_white", "group": "head", "from": [-0.4, 9.55, -2.55], "to": [0.4, 9.95, -1.68], "color": "featherPureWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "beak_lower", "group": "head", "from": [-0.35, 8.6, -3.15], "to": [0.35, 8.98, -1.68], "color": "pigeonBeak", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "eye_left", "group": "head", "from": [-1.65, 9.45, -1.92], "to": [-0.95, 10.25, -1.15], "color": "eyePupil", "col_idx": 6, "uv": [6, 0, 7, 1]}, {"name": "eye_right", "group": "head", "from": [0.95, 9.45, -1.92], "to": [1.65, 10.25, -1.15], "color": "eyePupil", "col_idx": 6, "uv": [6, 0, 7, 1]}, {"name": "sparkle_left", "group": "head", "from": [-1.52, 9.9, -1.98], "to": [-1.18, 10.2, -1.55], "color": "sparkleWhite", "col_idx": 7, "uv": [7, 0, 8, 1]}, {"name": "sparkle_right", "group": "head", "from": [1.18, 9.9, -1.98], "to": [1.52, 10.2, -1.55], "color": "sparkleWhite", "col_idx": 7, "uv": [7, 0, 8, 1]}, {"name": "crown_circlet", "group": "crown", "from": [-1.68, 11.05, -1.68], "to": [1.68, 11.55, 0.88], "color": "crownGold", "col_idx": 11, "uv": [11, 0, 12, 1]}, {"name": "crown_peak_front", "group": "crown", "from": [-0.6, 11.45, -1.78], "to": [0.6, 12.85, -1.15], "color": "crownGold", "col_idx": 11, "uv": [11, 0, 12, 1]}, {"name": "crown_peak_back", "group": "crown", "from": [-0.55, 11.45, 0.35], "to": [0.55, 12.55, 0.95], "color": "crownGold", "col_idx": 11, "uv": [11, 0, 12, 1]}, {"name": "crown_prong_left", "group": "crown", "from": [-1.78, 11.45, -0.65], "to": [-1.15, 12.45, 0.25], "color": "crownGold", "col_idx": 11, "uv": [11, 0, 12, 1]}, {"name": "crown_prong_right", "group": "crown", "from": [1.15, 11.45, -0.65], "to": [1.78, 12.45, 0.25], "color": "crownGold", "col_idx": 11, "uv": [11, 0, 12, 1]}, {"name": "crown_ruby_front", "group": "crown", "from": [-0.25, 11.75, -1.9], "to": [0.25, 12.35, -1.68], "color": "royalRuby", "col_idx": 13, "uv": [13, 0, 14, 1]}, {"name": "crown_cross_finial", "group": "crown", "from": [-0.2, 12.8, -1.65], "to": [0.2, 13.35, -1.25], "color": "crownGold", "col_idx": 11, "uv": [11, 0, 12, 1]}, {"name": "mantle_cape_upper", "group": "mantle", "from": [-2.25, 6.45, 1.85], "to": [2.25, 7.85, 2.48], "color": "mantleRed", "col_idx": 8, "uv": [8, 0, 9, 1]}, {"name": "mantle_cape_mid", "group": "mantle", "from": [-2.35, 4.85, 1.95], "to": [2.35, 6.55, 2.55], "color": "mantleRed", "col_idx": 8, "uv": [8, 0, 9, 1]}, {"name": "mantle_cape_lower", "group": "mantle", "from": [-2.25, 3.85, 2.05], "to": [2.25, 4.95, 2.58], "color": "mantleRed", "col_idx": 8, "uv": [8, 0, 9, 1]}, {"name": "ermine_collar_back", "group": "mantle", "from": [-2.35, 7.65, 0.65], "to": [2.35, 8.45, 2.25], "color": "ermineFur", "col_idx": 9, "uv": [9, 0, 10, 1]}, {"name": "ermine_collar_shoulder_left", "group": "mantle", "from": [-2.55, 7.58, -1.25], "to": [-1.95, 8.35, 1.15], "color": "ermineFur", "col_idx": 9, "uv": [9, 0, 10, 1]}, {"name": "ermine_collar_shoulder_right", "group": "mantle", "from": [1.95, 7.58, -1.25], "to": [2.55, 8.35, 1.15], "color": "ermineFur", "col_idx": 9, "uv": [9, 0, 10, 1]}, {"name": "ermine_lapel_front_left", "group": "mantle", "from": [-2.12, 6.45, -2.05], "to": [-1.48, 7.65, -1.35], "color": "ermineFur", "col_idx": 9, "uv": [9, 0, 10, 1]}, {"name": "ermine_lapel_front_right", "group": "mantle", "from": [1.48, 6.45, -2.05], "to": [2.12, 7.65, -1.35], "color": "ermineFur", "col_idx": 9, "uv": [9, 0, 10, 1]}, {"name": "ermine_spot_left", "group": "mantle", "from": [-1.95, 6.75, -2.15], "to": [-1.55, 7.15, -1.95], "color": "ermineSpot", "col_idx": 10, "uv": [10, 0, 11, 1]}, {"name": "ermine_spot_right", "group": "mantle", "from": [1.55, 6.75, -2.15], "to": [1.95, 7.15, -1.95], "color": "ermineSpot", "col_idx": 10, "uv": [10, 0, 11, 1]}, {"name": "mantle_fur_hem", "group": "mantle", "from": [-2.45, 3.75, 2.38], "to": [2.45, 4.15, 2.85], "color": "ermineFur", "col_idx": 9, "uv": [9, 0, 10, 1]}, {"name": "order_gold_chain", "group": "mantle", "from": [-1.05, 7.35, -2.4], "to": [1.05, 7.75, -2.0], "color": "crownGold", "col_idx": 11, "uv": [11, 0, 12, 1]}, {"name": "order_gold_frame", "group": "mantle", "from": [-0.65, 6.45, -2.8], "to": [0.65, 7.38, -2.35], "color": "crownGold", "col_idx": 11, "uv": [11, 0, 12, 1]}, {"name": "order_ruby_gem", "group": "mantle", "from": [-0.35, 6.6, -2.95], "to": [0.35, 7.25, -2.65], "color": "royalRuby", "col_idx": 13, "uv": [13, 0, 14, 1]}, {"name": "order_ruby_sparkle", "group": "mantle", "from": [-0.2, 6.95, -2.98], "to": [0.05, 7.2, -2.82], "color": "sparkleWhite", "col_idx": 7, "uv": [7, 0, 8, 1]}, {"name": "tail_base", "group": "body", "from": [-1.05, 3.2, 2.05], "to": [1.05, 3.7, 3.25], "color": "featherPureWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "tail_mid", "group": "body", "from": [-0.85, 3.15, 3.15], "to": [0.85, 3.65, 4.05], "color": "featherPureWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "tail_tip", "group": "body", "from": [-0.65, 3.05, 3.95], "to": [0.65, 3.55, 4.65], "color": "featherPureWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}];

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

Undo.finishEdit('Pigeon King V3.0 (Zero Holes & Sleek Tail)');
Canvas.updateAll();

const modelData = Format.codec.compile();
Blockbench.writeFile('/Users/egorbelogubec/Downloads/GitHub/Crossy road pro/assets/models/pigeon_king.bbmodel', { content: modelData });

return {
  cubesCount: Cube.all.length,
  groupsCount: Group.all.length,
  textureName: tex.name,
  savedPath: '/Users/egorbelogubec/Downloads/GitHub/Crossy road pro/assets/models/pigeon_king.bbmodel'
};
