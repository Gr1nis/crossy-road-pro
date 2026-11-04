
Cube.all.slice().forEach(c => c.remove());
Group.all.slice().forEach(g => g.remove());
Texture.all.slice().forEach(t => t.remove());

Project.name = 'penguin_cocoa';
Project.texture_width = 16;
Project.texture_height = 16;

const canvas = document.createElement('canvas');
canvas.width = 16;
canvas.height = 16;
const ctx = canvas.getContext('2d');
ctx.fillStyle = '#0f172a';
ctx.fillRect(0, 0, 16, 16);

const swatches = ["#0f172a", "#f8fafc", "#f97316", "#fb923c", "#dc2626", "#facc15", "#0d9488", "#14b8a6", "#451a03", "#ffffff", "#fef08a", "#e2e8f0", "#991b1b", "#ffffff", "#09090b", "#ffffff", "#f472b6"];
swatches.forEach((hex, idx) => {
  ctx.fillStyle = hex;
  if (idx < 16) {
    ctx.fillRect(idx, 0, 1, 1);
  } else {
    ctx.fillRect(idx - 16, 1, 1, 1);
  }
});

const tex = new Texture({ name: 'penguin_cocoa_palette' });
tex.fromDataURL(canvas.toDataURL('image/png')).add(false);

const groupDefs = ["feet", "body", "tail", "flippers", "mug_cocoa", "scarf", "head_face"];
const groups = {};
groupDefs.forEach(name => {
  groups[name] = new Group({ name: name }).init();
});

const cubesData = [{"name": "foot_sole_left", "from": [-2.75, 0.0, -3.15], "to": [-0.65, 0.7, 1.25], "color": "penguinOrange", "col_idx": 2, "uv": [2, 0, 3, 1], "group": "feet"}, {"name": "foot_sole_right", "from": [0.65, 0.0, -3.15], "to": [2.75, 0.7, 1.25], "color": "penguinOrange", "col_idx": 2, "uv": [2, 0, 3, 1], "group": "feet"}, {"name": "foot_toe_ridge_left", "from": [-2.45, 0.55, -3.35], "to": [-0.95, 0.85, -2.35], "color": "penguinOrangeLight", "col_idx": 3, "uv": [3, 0, 4, 1], "group": "feet"}, {"name": "foot_toe_ridge_right", "from": [0.95, 0.55, -3.35], "to": [2.45, 0.85, -2.35], "color": "penguinOrangeLight", "col_idx": 3, "uv": [3, 0, 4, 1], "group": "feet"}, {"name": "body_core", "from": [-2.55, 0.5, -2.1], "to": [2.55, 6.2, 2.3], "color": "penguinBlack", "col_idx": 0, "uv": [0, 0, 1, 1], "group": "body"}, {"name": "body_underbelly", "from": [-2.2, 0.3, -1.9], "to": [2.2, 1.1, 1.9], "color": "penguinBlack", "col_idx": 0, "uv": [0, 0, 1, 1], "group": "body"}, {"name": "body_flank_left", "from": [-2.9, 1.2, -1.7], "to": [-2.4, 5.4, 1.8], "color": "penguinBlack", "col_idx": 0, "uv": [0, 0, 1, 1], "group": "body"}, {"name": "body_flank_right", "from": [2.4, 1.2, -1.7], "to": [2.9, 5.4, 1.8], "color": "penguinBlack", "col_idx": 0, "uv": [0, 0, 1, 1], "group": "body"}, {"name": "belly_white_lower", "from": [-2.05, 0.8, -2.6], "to": [2.05, 4.3, -1.75], "color": "penguinWhite", "col_idx": 1, "uv": [1, 0, 2, 1], "group": "body"}, {"name": "belly_white_upper", "from": [-1.75, 4.1, -2.5], "to": [1.75, 6.35, -1.8], "color": "penguinWhite", "col_idx": 1, "uv": [1, 0, 2, 1], "group": "body"}, {"name": "body_back_arch", "from": [-2.2, 1.6, 2.15], "to": [2.2, 5.8, 2.7], "color": "penguinBlack", "col_idx": 0, "uv": [0, 0, 1, 1], "group": "body"}, {"name": "tail_main", "from": [-0.75, 1.15, 2.5], "to": [0.75, 2.1, 3.5], "color": "penguinBlack", "col_idx": 0, "uv": [0, 0, 1, 1], "group": "tail"}, {"name": "tail_tip_white", "from": [-0.55, 1.25, 3.3], "to": [0.55, 1.8, 3.8], "color": "penguinWhite", "col_idx": 1, "uv": [1, 0, 2, 1], "group": "tail"}, {"name": "flipper_shoulder_left", "from": [-3.25, 4.25, -1.25], "to": [-2.35, 5.85, 1.25], "color": "penguinBlack", "col_idx": 0, "uv": [0, 0, 1, 1], "group": "flippers"}, {"name": "flipper_arm_left", "from": [-3.15, 3.35, -2.75], "to": [-2.2, 4.7, -0.95], "color": "penguinBlack", "col_idx": 0, "uv": [0, 0, 1, 1], "group": "flippers"}, {"name": "flipper_hand_left", "from": [-2.35, 3.4, -3.55], "to": [-1.15, 4.4, -2.25], "color": "penguinBlack", "col_idx": 0, "uv": [0, 0, 1, 1], "group": "flippers"}, {"name": "flipper_cuff_left", "from": [-2.1, 3.5, -3.65], "to": [-1.25, 4.15, -2.95], "color": "penguinWhite", "col_idx": 1, "uv": [1, 0, 2, 1], "group": "flippers"}, {"name": "flipper_shoulder_right", "from": [2.35, 4.25, -1.25], "to": [3.25, 5.85, 1.25], "color": "penguinBlack", "col_idx": 0, "uv": [0, 0, 1, 1], "group": "flippers"}, {"name": "flipper_arm_right", "from": [2.2, 3.35, -2.75], "to": [3.15, 4.7, -0.95], "color": "penguinBlack", "col_idx": 0, "uv": [0, 0, 1, 1], "group": "flippers"}, {"name": "flipper_hand_right", "from": [1.15, 3.4, -3.55], "to": [2.35, 4.4, -2.25], "color": "penguinBlack", "col_idx": 0, "uv": [0, 0, 1, 1], "group": "flippers"}, {"name": "flipper_cuff_right", "from": [1.25, 3.5, -3.65], "to": [2.1, 4.15, -2.95], "color": "penguinWhite", "col_idx": 1, "uv": [1, 0, 2, 1], "group": "flippers"}, {"name": "mug_base", "from": [-1.2, 2.75, -4.0], "to": [1.2, 4.8, -1.85], "color": "mugTeal", "col_idx": 6, "uv": [6, 0, 7, 1], "group": "mug_cocoa"}, {"name": "mug_rim", "from": [-1.3, 4.7, -4.1], "to": [1.3, 5.2, -1.75], "color": "mugRim", "col_idx": 7, "uv": [7, 0, 8, 1], "group": "mug_cocoa"}, {"name": "mug_handle_top", "from": [1.1, 4.2, -3.25], "to": [2.05, 4.65, -2.65], "color": "mugTeal", "col_idx": 6, "uv": [6, 0, 7, 1], "group": "mug_cocoa"}, {"name": "mug_handle_vert", "from": [1.7, 3.3, -3.3], "to": [2.15, 4.55, -2.55], "color": "mugTeal", "col_idx": 6, "uv": [6, 0, 7, 1], "group": "mug_cocoa"}, {"name": "mug_handle_bottom", "from": [1.1, 3.1, -3.25], "to": [2.05, 3.55, -2.65], "color": "mugTeal", "col_idx": 6, "uv": [6, 0, 7, 1], "group": "mug_cocoa"}, {"name": "cocoa_surface", "from": [-1.1, 4.85, -3.85], "to": [1.1, 5.1, -2.05], "color": "cocoaBrown", "col_idx": 8, "uv": [8, 0, 9, 1], "group": "mug_cocoa"}, {"name": "marshmallow_1", "from": [-0.85, 5.05, -3.5], "to": [-0.15, 5.6, -2.85], "color": "marshmallowWhite", "col_idx": 9, "uv": [9, 0, 10, 1], "group": "mug_cocoa"}, {"name": "marshmallow_2", "from": [0.15, 5.05, -3.4], "to": [0.8, 5.55, -2.7], "color": "marshmallowCream", "col_idx": 10, "uv": [10, 0, 11, 1], "group": "mug_cocoa"}, {"name": "marshmallow_3", "from": [-0.4, 5.05, -2.65], "to": [0.25, 5.45, -2.15], "color": "marshmallowWhite", "col_idx": 9, "uv": [9, 0, 10, 1], "group": "mug_cocoa"}, {"name": "steam_puff_low", "from": [-0.45, 5.65, -3.75], "to": [0.35, 6.25, -3.15], "color": "steamWhite", "col_idx": 11, "uv": [11, 0, 12, 1], "group": "mug_cocoa"}, {"name": "steam_puff_mid", "from": [-0.75, 6.2, -3.85], "to": [-0.1, 6.85, -3.2], "color": "steamWhite", "col_idx": 11, "uv": [11, 0, 12, 1], "group": "mug_cocoa"}, {"name": "steam_puff_high", "from": [-0.35, 6.8, -3.75], "to": [0.25, 7.45, -3.15], "color": "steamWhite", "col_idx": 11, "uv": [11, 0, 12, 1], "group": "mug_cocoa"}, {"name": "scarf_front", "from": [-2.5, 6.15, -2.95], "to": [2.5, 7.35, -1.85], "color": "scarfRed", "col_idx": 4, "uv": [4, 0, 5, 1], "group": "scarf"}, {"name": "scarf_back", "from": [-2.5, 6.25, 1.75], "to": [2.5, 7.4, 2.75], "color": "scarfRed", "col_idx": 4, "uv": [4, 0, 5, 1], "group": "scarf"}, {"name": "scarf_left", "from": [-2.95, 6.05, -2.25], "to": [-2.1, 7.55, 2.15], "color": "scarfRed", "col_idx": 4, "uv": [4, 0, 5, 1], "group": "scarf"}, {"name": "scarf_right", "from": [2.1, 6.05, -2.25], "to": [2.95, 7.55, 2.15], "color": "scarfRed", "col_idx": 4, "uv": [4, 0, 5, 1], "group": "scarf"}, {"name": "scarf_knot", "from": [-3.45, 5.75, -0.65], "to": [-2.3, 6.85, 0.45], "color": "scarfDarkRed", "col_idx": 12, "uv": [12, 0, 13, 1], "group": "scarf"}, {"name": "scarf_tail_drape", "from": [-3.55, 4.0, -0.45], "to": [-2.65, 5.95, 0.35], "color": "scarfRed", "col_idx": 4, "uv": [4, 0, 5, 1], "group": "scarf"}, {"name": "scarf_stripe_accent", "from": [-3.6, 4.45, -0.5], "to": [-2.6, 4.8, 0.4], "color": "scarfWhiteStripe", "col_idx": 13, "uv": [13, 0, 14, 1], "group": "scarf"}, {"name": "scarf_tassels", "from": [-3.5, 3.45, -0.4], "to": [-2.7, 4.1, 0.3], "color": "scarfGoldTassel", "col_idx": 5, "uv": [5, 0, 6, 1], "group": "scarf"}, {"name": "head_core", "from": [-2.45, 7.2, -2.05], "to": [2.45, 10.4, 2.05], "color": "penguinBlack", "col_idx": 0, "uv": [0, 0, 1, 1], "group": "head_face"}, {"name": "head_crown_top", "from": [-1.9, 10.3, -1.65], "to": [1.9, 11.0, 1.65], "color": "penguinBlack", "col_idx": 0, "uv": [0, 0, 1, 1], "group": "head_face"}, {"name": "head_back_arch", "from": [-2.15, 7.45, 1.95], "to": [2.15, 10.15, 2.45], "color": "penguinBlack", "col_idx": 0, "uv": [0, 0, 1, 1], "group": "head_face"}, {"name": "face_mask_white", "from": [-2.05, 7.3, -2.55], "to": [2.05, 9.9, -1.9], "color": "penguinWhite", "col_idx": 1, "uv": [1, 0, 2, 1], "group": "head_face"}, {"name": "face_forehead_notch", "from": [-1.1, 9.8, -2.45], "to": [1.1, 10.35, -1.95], "color": "penguinWhite", "col_idx": 1, "uv": [1, 0, 2, 1], "group": "head_face"}, {"name": "beak_base", "from": [-0.75, 8.05, -3.35], "to": [0.75, 8.85, -2.35], "color": "penguinOrange", "col_idx": 2, "uv": [2, 0, 3, 1], "group": "head_face"}, {"name": "beak_tip", "from": [-0.55, 7.95, -3.85], "to": [0.55, 8.55, -3.2], "color": "penguinOrangeLight", "col_idx": 3, "uv": [3, 0, 4, 1], "group": "head_face"}, {"name": "beak_culmen", "from": [-0.35, 8.75, -2.95], "to": [0.35, 9.05, -2.4], "color": "penguinOrange", "col_idx": 2, "uv": [2, 0, 3, 1], "group": "head_face"}, {"name": "eye_iris_left", "from": [-1.9, 8.65, -2.7], "to": [-1.15, 9.6, -2.3], "color": "eyeBlack", "col_idx": 14, "uv": [14, 0, 15, 1], "group": "head_face"}, {"name": "eye_sparkle_left", "from": [-1.8, 9.15, -2.8], "to": [-1.3, 9.5, -2.4], "color": "white", "col_idx": 15, "uv": [15, 0, 16, 1], "group": "head_face"}, {"name": "eye_iris_right", "from": [1.15, 8.65, -2.7], "to": [1.9, 9.6, -2.3], "color": "eyeBlack", "col_idx": 14, "uv": [14, 0, 15, 1], "group": "head_face"}, {"name": "eye_sparkle_right", "from": [1.3, 9.15, -2.8], "to": [1.8, 9.5, -2.4], "color": "white", "col_idx": 15, "uv": [15, 0, 16, 1], "group": "head_face"}, {"name": "blush_cheek_left", "from": [-2.0, 7.75, -2.6], "to": [-1.35, 8.35, -2.25], "color": "blushPink", "col_idx": 16, "uv": [0, 1, 1, 2], "group": "head_face"}, {"name": "blush_cheek_right", "from": [1.35, 7.75, -2.6], "to": [2.0, 8.35, -2.25], "color": "blushPink", "col_idx": 16, "uv": [0, 1, 1, 2], "group": "head_face"}];

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

Undo.finishEdit('Penguin Cocoa V1.0 (Zero Z-Fighting, 7 Groups, 55 Cubes)');
Canvas.updateAll();

const modelData = Format.codec.compile();
Blockbench.writeFile('C:/Users/MIXPC/.gemini/antigravity/scratch/crossy-road-pro/assets/models/penguin_cocoa.bbmodel', { content: modelData });

return {
  success: true,
  cubesCount: Cube.all.length,
  groupsCount: Group.all.length,
  textureName: tex.name,
  savedPath: 'C:/Users/MIXPC/.gemini/antigravity/scratch/crossy-road-pro/assets/models/penguin_cocoa.bbmodel'
};
