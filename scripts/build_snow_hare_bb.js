
Cube.all.slice().forEach(c => c.remove());
Group.all.slice().forEach(g => g.remove());
Texture.all.slice().forEach(t => t.remove());

Project.name = 'snow_hare';
Project.texture_width = 16;
Project.texture_height = 16;

const canvas = document.createElement('canvas');
canvas.width = 16;
canvas.height = 16;
const ctx = canvas.getContext('2d');
ctx.fillStyle = '#0f172a';
ctx.fillRect(0, 0, 16, 16);

const swatches = ["#f8fafc", "#e2e8f0", "#fef3c7", "#f472b6", "#09090b", "#ffffff", "#fb7185", "#fbcfe8", "#ea580c", "#f97316", "#fb923c", "#e0f2fe", "#15803d", "#22c55e", "#4ade80", "#ffffff"];
swatches.forEach((hex, idx) => {
  ctx.fillStyle = hex;
  ctx.fillRect(idx, 0, 1, 1);
});

const tex = new Texture({ name: 'snow_hare_palette' });
tex.fromDataURL(canvas.toDataURL('image/png')).add(false);

const groupDefs = ["feet", "body", "tail", "head_ears", "forepaws", "frosted_carrot"];
const groups = {};
groupDefs.forEach(name => {
  groups[name] = new Group({ name: name }).init();
});

const cubesData = [{"name": "foot_sole_left", "group": "feet", "from": [-2.45, 0.0, -1.05], "to": [-0.95, 0.9, 2.35], "color": "hareWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "foot_sole_right", "group": "feet", "from": [0.95, 0.0, -1.05], "to": [2.45, 0.9, 2.35], "color": "hareWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "foot_toes_left", "group": "feet", "from": [-2.3, 0.15, -1.85], "to": [-1.1, 0.75, -0.85], "color": "hareWhiteSoft", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "foot_toes_right", "group": "feet", "from": [1.1, 0.15, -1.85], "to": [2.3, 0.75, -0.85], "color": "hareWhiteSoft", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "haunch_left", "group": "feet", "from": [-2.6, 0.7, 0.45], "to": [-1.2, 2.8, 2.45], "color": "hareWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "haunch_right", "group": "feet", "from": [1.2, 0.7, 0.45], "to": [2.6, 2.8, 2.45], "color": "hareWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "haunch_fluff_left", "group": "feet", "from": [-2.85, 1.15, 0.65], "to": [-2.45, 2.45, 2.25], "color": "hareWhiteSoft", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "haunch_fluff_right", "group": "feet", "from": [2.45, 1.15, 0.65], "to": [2.85, 2.45, 2.25], "color": "hareWhiteSoft", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "body_core", "group": "body", "from": [-2.1, 1.2, -1.7], "to": [2.1, 5.8, 2.1], "color": "hareWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "body_lower_belly", "group": "body", "from": [-1.8, 0.55, -1.45], "to": [1.8, 1.6, 1.8], "color": "hareWhiteSoft", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "body_chest_front", "group": "body", "from": [-1.75, 1.8, -2.2], "to": [1.75, 5.5, -1.55], "color": "hareWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "belly_cream_bib", "group": "body", "from": [-1.35, 2.05, -2.3], "to": [1.35, 4.65, -2.05], "color": "hareCream", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "body_back_cushion", "group": "body", "from": [-1.9, 1.75, 1.95], "to": [1.9, 5.2, 2.65], "color": "hareWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "body_flank_puff_left", "group": "body", "from": [-2.4, 2.4, -1.15], "to": [-1.95, 4.8, 1.65], "color": "hareWhiteSoft", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "body_flank_puff_right", "group": "body", "from": [1.95, 2.4, -1.15], "to": [2.4, 4.8, 1.65], "color": "hareWhiteSoft", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "tail_core", "group": "tail", "from": [-0.85, 1.65, 2.35], "to": [0.85, 3.25, 3.95], "color": "hareWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "tail_puff_top", "group": "tail", "from": [-0.65, 3.1, 2.5], "to": [0.65, 3.65, 3.75], "color": "hareWhiteSoft", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "tail_puff_bottom", "group": "tail", "from": [-0.65, 1.25, 2.5], "to": [0.65, 1.85, 3.75], "color": "hareWhiteSoft", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "tail_puff_left", "group": "tail", "from": [-1.15, 1.95, 2.5], "to": [-0.7, 2.95, 3.75], "color": "hareWhiteSoft", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "tail_puff_right", "group": "tail", "from": [0.7, 1.95, 2.5], "to": [1.15, 2.95, 3.75], "color": "hareWhiteSoft", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "head_core", "group": "head_ears", "from": [-2.3, 5.4, -2.05], "to": [2.3, 8.8, 1.75], "color": "hareWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "head_crown", "group": "head_ears", "from": [-1.9, 8.65, -1.65], "to": [1.9, 9.45, 1.45], "color": "hareWhiteSoft", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "head_back", "group": "head_ears", "from": [-2.05, 5.75, 1.6], "to": [2.05, 8.45, 2.25], "color": "hareWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "cheek_fluff_left", "group": "head_ears", "from": [-2.7, 5.7, -1.8], "to": [-2.15, 7.3, 0.4], "color": "hareWhiteSoft", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "cheek_fluff_right", "group": "head_ears", "from": [2.15, 5.7, -1.8], "to": [2.7, 7.3, 0.4], "color": "hareWhiteSoft", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "snout_muzzle", "group": "head_ears", "from": [-1.3, 5.85, -2.7], "to": [1.3, 7.2, -1.9], "color": "hareWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "snout_lip_left", "group": "head_ears", "from": [-1.15, 5.95, -2.9], "to": [-0.1, 6.7, -2.6], "color": "hareWhiteSoft", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "snout_lip_right", "group": "head_ears", "from": [0.1, 5.95, -2.9], "to": [1.15, 6.7, -2.6], "color": "hareWhiteSoft", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "nose_pink", "group": "head_ears", "from": [-0.4, 6.8, -2.95], "to": [0.4, 7.35, -2.65], "color": "earPink", "col_idx": 3, "uv": [3, 0, 4, 1]}, {"name": "forehead_fluff", "group": "head_ears", "from": [-0.65, 8.45, -2.25], "to": [0.65, 9.15, -1.85], "color": "hareWhiteSoft", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "eye_iris_left", "group": "head_ears", "from": [-2.05, 6.95, -2.25], "to": [-1.35, 7.95, -1.95], "color": "eyeBlack", "col_idx": 4, "uv": [4, 0, 5, 1]}, {"name": "eye_sparkle_left", "group": "head_ears", "from": [-1.9, 7.45, -2.35], "to": [-1.45, 7.85, -2.15], "color": "pureWhite", "col_idx": 5, "uv": [5, 0, 6, 1]}, {"name": "eye_iris_right", "group": "head_ears", "from": [1.35, 6.95, -2.25], "to": [2.05, 7.95, -1.95], "color": "eyeBlack", "col_idx": 4, "uv": [4, 0, 5, 1]}, {"name": "eye_sparkle_right", "group": "head_ears", "from": [1.45, 7.45, -2.35], "to": [1.9, 7.85, -2.15], "color": "pureWhite", "col_idx": 5, "uv": [5, 0, 6, 1]}, {"name": "blush_left", "group": "head_ears", "from": [-2.15, 6.1, -2.2], "to": [-1.45, 6.65, -1.95], "color": "blushPink", "col_idx": 6, "uv": [6, 0, 7, 1]}, {"name": "blush_right", "group": "head_ears", "from": [1.45, 6.1, -2.2], "to": [2.15, 6.65, -1.95], "color": "blushPink", "col_idx": 6, "uv": [6, 0, 7, 1]}, {"name": "ear_base_left", "group": "head_ears", "from": [-1.95, 9.15, -0.45], "to": [-0.85, 10.95, 0.85], "color": "hareWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "ear_pink_lower_left", "group": "head_ears", "from": [-1.75, 9.35, -0.55], "to": [-1.05, 10.55, -0.35], "color": "earPink", "col_idx": 3, "uv": [3, 0, 4, 1]}, {"name": "ear_mid_left", "group": "head_ears", "from": [-2.15, 10.7, -0.25], "to": [-1.05, 12.65, 0.95], "color": "hareWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "ear_pink_mid_left", "group": "head_ears", "from": [-1.85, 10.4, -0.4], "to": [-1.25, 12.5, -0.15], "color": "earPinkLight", "col_idx": 7, "uv": [7, 0, 8, 1]}, {"name": "ear_tip_left", "group": "head_ears", "from": [-2.05, 12.4, -0.05], "to": [-1.15, 13.95, 1.05], "color": "hareWhiteSoft", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "ear_base_right", "group": "head_ears", "from": [0.85, 9.15, -0.45], "to": [1.95, 10.95, 0.85], "color": "hareWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "ear_pink_lower_right", "group": "head_ears", "from": [1.05, 9.35, -0.55], "to": [1.75, 10.55, -0.35], "color": "earPink", "col_idx": 3, "uv": [3, 0, 4, 1]}, {"name": "ear_mid_right", "group": "head_ears", "from": [1.05, 10.7, -0.25], "to": [2.15, 12.65, 0.95], "color": "hareWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "ear_pink_mid_right", "group": "head_ears", "from": [1.25, 10.4, -0.4], "to": [1.85, 12.5, -0.15], "color": "earPinkLight", "col_idx": 7, "uv": [7, 0, 8, 1]}, {"name": "ear_tip_right", "group": "head_ears", "from": [1.15, 12.4, -0.05], "to": [2.05, 13.95, 1.05], "color": "hareWhiteSoft", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "forearm_left", "group": "forepaws", "from": [-2.25, 2.75, -2.15], "to": [-1.45, 3.8, -0.85], "color": "hareWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "forepaw_left", "group": "forepaws", "from": [-1.65, 2.65, -3.35], "to": [-0.65, 3.7, -1.85], "color": "hareWhiteSoft", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "paw_pad_left", "group": "forepaws", "from": [-1.2, 2.85, -3.75], "to": [-0.15, 3.55, -3.2], "color": "hareCream", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "forearm_right", "group": "forepaws", "from": [1.45, 2.75, -2.15], "to": [2.25, 3.8, -0.85], "color": "hareWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "forepaw_right", "group": "forepaws", "from": [0.65, 2.65, -3.35], "to": [1.65, 3.7, -1.85], "color": "hareWhiteSoft", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "paw_pad_right", "group": "forepaws", "from": [0.15, 2.85, -3.75], "to": [1.2, 3.55, -3.2], "color": "hareCream", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "carrot_tip", "group": "frosted_carrot", "from": [-0.35, 1.2, -2.95], "to": [0.35, 1.95, -2.45], "color": "carrotOrangeDark", "col_idx": 8, "uv": [8, 0, 9, 1]}, {"name": "carrot_mid", "group": "frosted_carrot", "from": [-0.55, 1.8, -3.25], "to": [0.55, 2.95, -2.35], "color": "carrotOrange", "col_idx": 9, "uv": [9, 0, 10, 1]}, {"name": "carrot_upper", "group": "frosted_carrot", "from": [-0.75, 2.8, -3.55], "to": [0.75, 3.95, -2.25], "color": "carrotOrange", "col_idx": 9, "uv": [9, 0, 10, 1]}, {"name": "carrot_crown", "group": "frosted_carrot", "from": [-0.65, 3.85, -3.45], "to": [0.65, 4.3, -2.35], "color": "carrotOrangeBright", "col_idx": 10, "uv": [10, 0, 11, 1]}, {"name": "carrot_stem", "group": "frosted_carrot", "from": [-0.25, 4.2, -3.1], "to": [0.25, 4.75, -2.55], "color": "leafGreenDark", "col_idx": 12, "uv": [12, 0, 13, 1]}, {"name": "leaf_sprig_left", "group": "frosted_carrot", "from": [-0.85, 4.45, -3.35], "to": [-0.15, 5.1, -2.6], "color": "leafGreen", "col_idx": 13, "uv": [13, 0, 14, 1]}, {"name": "leaf_sprig_right", "group": "frosted_carrot", "from": [0.15, 4.45, -3.35], "to": [0.85, 5.1, -2.6], "color": "leafGreen", "col_idx": 13, "uv": [13, 0, 14, 1]}, {"name": "leaf_frond_center", "group": "frosted_carrot", "from": [-0.35, 4.55, -3.65], "to": [0.35, 5.15, -2.85], "color": "leafGreenBright", "col_idx": 14, "uv": [14, 0, 15, 1]}, {"name": "leaf_frond_front", "group": "frosted_carrot", "from": [-0.3, 4.35, -3.85], "to": [0.3, 4.9, -3.3], "color": "leafGreen", "col_idx": 13, "uv": [13, 0, 14, 1]}];

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

Undo.finishEdit('Snow Hare V1.0 (Zero Z-Fighting, 6 Groups, 64 Cubes)');
Canvas.updateAll();

const modelData = Format.codec.compile();
Blockbench.writeFile('C:/Users/MIXPC/.gemini/antigravity/scratch/crossy-road-pro/assets/models/snow_hare.bbmodel', { content: modelData });

return {
  success: true,
  cubesCount: Cube.all.length,
  groupsCount: Group.all.length,
  textureName: tex.name,
  savedPath: 'C:/Users/MIXPC/.gemini/antigravity/scratch/crossy-road-pro/assets/models/snow_hare.bbmodel'
};
