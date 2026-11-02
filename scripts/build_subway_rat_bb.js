
Cube.all.slice().forEach(c => c.remove());
Texture.all.slice().forEach(t => t.remove());

const canvas = document.createElement('canvas');
canvas.width = 16;
canvas.height = 16;
const ctx = canvas.getContext('2d');
ctx.fillStyle = '#1e293b';
ctx.fillRect(0, 0, 16, 16);

const swatches = ["#475569", "#94a3b8", "#fecdd3", "#f43f5e", "#ffffff", "#09090b", "#ffffff", "#b45309", "#fef3c7", "#f97316", "#64748b", "#1e293b"];
swatches.forEach((hex, idx) => {
  ctx.fillStyle = hex;
  ctx.fillRect(idx, 0, 1, 1);
});

const tex = new Texture({ name: 'subway_rat_palette' });
tex.fromDataURL(canvas.toDataURL('image/png')).add(false);

const cubesData = [{"name": "thigh_rear_left", "from": [-2.75, 0.55, 0.45], "to": [-1.55, 3.65, 2.85], "color": "ratGrey", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "thigh_rear_right", "from": [1.55, 0.55, 0.45], "to": [2.75, 3.65, 2.85], "color": "ratGrey", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "ankle_rear_left", "from": [-2.55, 0.35, 0.75], "to": [-1.65, 1.45, 2.15], "color": "ratGrey", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "ankle_rear_right", "from": [1.65, 0.35, 0.75], "to": [2.55, 1.45, 2.15], "color": "ratGrey", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "foot_heel_left", "from": [-2.4, 0.0, -0.65], "to": [-1.45, 0.65, 1.45], "color": "ratPink", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "foot_heel_right", "from": [1.45, 0.0, -0.65], "to": [2.4, 0.65, 1.45], "color": "ratPink", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "toes_front_left", "from": [-2.55, 0.05, -1.65], "to": [-1.35, 0.5, -0.55], "color": "ratPink", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "toes_front_right", "from": [1.35, 0.05, -1.65], "to": [2.55, 0.5, -0.55], "color": "ratPink", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "body_lower_core", "from": [-2.15, 0.75, -1.45], "to": [2.15, 4.25, 2.65], "color": "ratGrey", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "belly_front_plate", "from": [-1.55, 1.15, -1.85], "to": [1.55, 3.95, -1.25], "color": "bellyLight", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "body_mid_chest", "from": [-2.0, 3.75, -1.75], "to": [2.0, 6.45, 2.25], "color": "ratGrey", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "shoulders_neck_base", "from": [-1.95, 5.25, -2.45], "to": [1.95, 6.85, -0.75], "color": "ratGrey", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "body_back_slope", "from": [-1.85, 5.75, -0.85], "to": [1.85, 6.95, 1.95], "color": "ratGrey", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "body_rump_rear", "from": [-1.85, 1.35, 2.35], "to": [1.85, 4.15, 3.25], "color": "ratGrey", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "tail_root", "from": [-0.45, 1.05, 3.05], "to": [0.45, 1.85, 4.25], "color": "ratPink", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "tail_mid_1", "from": [-0.55, 0.55, 4.05], "to": [0.35, 1.35, 5.45], "color": "ratPink", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "tail_mid_2", "from": [-0.25, 0.0, 5.25], "to": [0.55, 0.75, 6.55], "color": "ratPink", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "tail_curled_tip", "from": [0.35, 0.05, 6.25], "to": [1.25, 0.65, 7.35], "color": "ratPink", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "arm_upper_left", "from": [-2.25, 3.65, -2.25], "to": [-1.45, 5.35, -0.85], "color": "ratGrey", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "arm_upper_right", "from": [1.45, 3.65, -2.25], "to": [2.25, 5.35, -0.85], "color": "ratGrey", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "arm_forearm_left", "from": [-2.05, 2.45, -3.15], "to": [-1.25, 3.85, -1.95], "color": "ratGrey", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "arm_forearm_right", "from": [1.25, 2.45, -3.15], "to": [2.05, 3.85, -1.95], "color": "ratGrey", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "paw_front_left", "from": [-1.95, 2.25, -3.85], "to": [-0.75, 3.25, -2.85], "color": "ratPink", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "paw_front_right", "from": [0.75, 2.25, -3.85], "to": [1.95, 3.25, -2.85], "color": "ratPink", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "bagel_rim_bottom", "from": [-1.45, 1.35, -3.7], "to": [1.45, 2.35, -2.5], "color": "bagelCrust", "col_idx": 7, "uv": [7, 0, 8, 1]}, {"name": "bagel_rim_top", "from": [-1.45, 3.55, -3.7], "to": [1.45, 4.45, -2.5], "color": "bagelCrust", "col_idx": 7, "uv": [7, 0, 8, 1]}, {"name": "bagel_pillar_left", "from": [-1.8, 2.15, -3.8], "to": [-0.9, 3.75, -2.6], "color": "bagelCrust", "col_idx": 7, "uv": [7, 0, 8, 1]}, {"name": "bagel_pillar_right", "from": [0.9, 2.15, -3.8], "to": [1.8, 3.75, -2.6], "color": "bagelCrust", "col_idx": 7, "uv": [7, 0, 8, 1]}, {"name": "sesame_top_cluster", "from": [-1.15, 4.35, -3.65], "to": [1.15, 4.75, -2.65], "color": "sesameSeed", "col_idx": 8, "uv": [8, 0, 9, 1]}, {"name": "sesame_left_speck", "from": [-1.65, 3.35, -3.95], "to": [-1.05, 4.05, -3.55], "color": "sesameSeed", "col_idx": 8, "uv": [8, 0, 9, 1]}, {"name": "sesame_right_speck", "from": [1.05, 3.35, -3.95], "to": [1.65, 4.05, -3.55], "color": "sesameSeed", "col_idx": 8, "uv": [8, 0, 9, 1]}, {"name": "head_core", "from": [-1.9, 6.05, -2.85], "to": [1.9, 8.85, -0.35], "color": "ratGrey", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "snout_bridge", "from": [-1.25, 5.75, -4.35], "to": [1.25, 7.15, -2.65], "color": "ratGrey", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "muzzle_tip", "from": [-0.85, 5.85, -5.25], "to": [0.85, 6.95, -4.15], "color": "bellyLight", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "nose_button", "from": [-0.4, 6.45, -5.65], "to": [0.4, 7.05, -5.15], "color": "nosePink", "col_idx": 3, "uv": [3, 0, 4, 1]}, {"name": "bucktooth", "from": [-0.25, 5.45, -4.95], "to": [0.25, 5.95, -4.25], "color": "buckTooth", "col_idx": 4, "uv": [4, 0, 5, 1]}, {"name": "throat_under", "from": [-0.95, 5.35, -3.85], "to": [0.95, 6.15, -2.25], "color": "bellyLight", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "cheek_left", "from": [-2.1, 6.25, -2.75], "to": [-1.65, 7.65, -1.15], "color": "ratGrey", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "cheek_right", "from": [1.65, 6.25, -2.75], "to": [2.1, 7.65, -1.15], "color": "ratGrey", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "eye_iris_left", "from": [-1.65, 7.35, -3.45], "to": [-0.95, 8.25, -2.75], "color": "eyeBlack", "col_idx": 5, "uv": [5, 0, 6, 1]}, {"name": "eye_iris_right", "from": [0.95, 7.35, -3.45], "to": [1.65, 8.25, -2.75], "color": "eyeBlack", "col_idx": 5, "uv": [5, 0, 6, 1]}, {"name": "eye_sparkle_left", "from": [-1.55, 7.75, -3.55], "to": [-1.15, 8.15, -3.35], "color": "sparkleWhite", "col_idx": 6, "uv": [6, 0, 7, 1]}, {"name": "eye_sparkle_right", "from": [1.15, 7.75, -3.55], "to": [1.55, 8.15, -3.35], "color": "sparkleWhite", "col_idx": 6, "uv": [6, 0, 7, 1]}, {"name": "ear_outer_left", "from": [-2.45, 8.55, -0.95], "to": [-1.65, 10.15, 0.45], "color": "ratGrey", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "ear_outer_right", "from": [1.65, 8.55, -0.95], "to": [2.45, 10.15, 0.45], "color": "ratGrey", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "ear_inner_left", "from": [-2.35, 8.75, -0.85], "to": [-1.7, 9.95, 0.25], "color": "ratPink", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "ear_inner_right", "from": [1.7, 8.75, -0.85], "to": [2.35, 9.95, 0.25], "color": "ratPink", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "headband_top", "from": [-1.65, 8.95, -2.05], "to": [1.65, 9.45, -1.35], "color": "headbandMetal", "col_idx": 10, "uv": [10, 0, 11, 1]}, {"name": "headband_arm_left", "from": [-2.35, 7.75, -1.95], "to": [-1.55, 9.05, -1.45], "color": "headbandMetal", "col_idx": 10, "uv": [10, 0, 11, 1]}, {"name": "headband_arm_right", "from": [1.55, 7.75, -1.95], "to": [2.35, 9.05, -1.45], "color": "headbandMetal", "col_idx": 10, "uv": [10, 0, 11, 1]}, {"name": "earpad_orange_left", "from": [-2.85, 6.75, -2.35], "to": [-2.15, 8.35, -1.05], "color": "retroOrange", "col_idx": 9, "uv": [9, 0, 10, 1]}, {"name": "earpad_orange_right", "from": [2.15, 6.75, -2.35], "to": [2.85, 8.35, -1.05], "color": "retroOrange", "col_idx": 9, "uv": [9, 0, 10, 1]}, {"name": "cup_casing_left", "from": [-3.05, 7.05, -2.15], "to": [-2.75, 8.05, -1.25], "color": "cupDark", "col_idx": 11, "uv": [11, 0, 12, 1]}, {"name": "cup_casing_right", "from": [2.75, 7.05, -2.15], "to": [3.05, 8.05, -1.25], "color": "cupDark", "col_idx": 11, "uv": [11, 0, 12, 1]}];

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

Undo.finishEdit('Subway Rat V1.0 (Retro Headphones, Sesame Bagel, Bucktooth)');
Canvas.updateAll();

return {
  cubesCount: Cube.all.length,
  textureName: tex.name
};
