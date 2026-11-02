
// 1. Reset project cubes and textures
Cube.all.slice().forEach(c => c.remove());
Texture.all.slice().forEach(t => t.remove());

// 2. Create 16x16 palette texture
const canvas = document.createElement('canvas');
canvas.width = 16;
canvas.height = 16;
const ctx = canvas.getContext('2d');
ctx.fillStyle = '#1e293b';
ctx.fillRect(0, 0, 16, 16);

const swatches = [
  '#64748b', // 0: pigeonGrey
  '#ffffff', // 1: white
  '#f43f5e', // 2: pigeonFootRed
  '#1e293b', // 3: darkCharcoal
  '#0d9488', // 4: pigeonTeal
  '#8b5cf6', // 5: purpleNeck
  '#f97316', // 6: orangeFruit
  '#b45309', // 7: pizzaCrust
  '#facc15', // 8: pizzaCheese
  '#b91c1c', // 9: pizzaRed
  '#16a34a'  // 10: greenLeaf
];

swatches.forEach((hex, idx) => {
  ctx.fillStyle = hex;
  ctx.fillRect(idx, 0, 1, 1);
});

const tex = new Texture({ name: 'pigeon_palette' });
tex.fromDataURL(canvas.toDataURL('image/png')).add(false);

// 3. Create all 55 solid cubes with zero coplanar overlaps
const cubesData = [{"name": "left_foot_base", "from": [-2.6, 0.0, -1.0], "to": [-1.4, 0.5, 1.0], "color": "pigeonFootRed", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "left_toe_mid", "from": [-2.3, 0.05, -2.4], "to": [-1.7, 0.45, -0.9], "color": "pigeonFootRed", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "left_toe_outer", "from": [-3.1, 0.05, -2.1], "to": [-2.5, 0.45, -0.9], "color": "pigeonFootRed", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "left_toe_inner", "from": [-1.5, 0.05, -2.1], "to": [-0.9, 0.45, -0.9], "color": "pigeonFootRed", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "left_toe_hallux", "from": [-2.3, 0.05, 0.9], "to": [-1.7, 0.45, 1.9], "color": "pigeonFootRed", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "left_leg_shank", "from": [-2.3, 0.4, -0.3], "to": [-1.7, 2.5, 0.3], "color": "pigeonFootRed", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "left_thigh_fluff", "from": [-2.5, 2.3, -0.7], "to": [-1.5, 3.7, 0.7], "color": "pigeonGrey", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "right_foot_base", "from": [1.4, 0.0, -1.0], "to": [2.6, 0.5, 1.0], "color": "pigeonFootRed", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "right_toe_mid", "from": [1.7, 0.05, -2.4], "to": [2.3, 0.45, -0.9], "color": "pigeonFootRed", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "right_toe_outer", "from": [2.5, 0.05, -2.1], "to": [3.1, 0.45, -0.9], "color": "pigeonFootRed", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "right_toe_inner", "from": [0.9, 0.05, -2.1], "to": [1.5, 0.45, -0.9], "color": "pigeonFootRed", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "right_toe_hallux", "from": [1.7, 0.05, 0.9], "to": [2.3, 0.45, 1.9], "color": "pigeonFootRed", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "right_leg_shank", "from": [1.7, 0.4, -0.3], "to": [2.3, 2.5, 0.3], "color": "pigeonFootRed", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "right_thigh_fluff", "from": [1.5, 2.3, -0.7], "to": [2.5, 3.7, 0.7], "color": "pigeonGrey", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "body_belly_base", "from": [-3.2, 3.0, -2.8], "to": [3.2, 4.3, 3.2], "color": "pigeonGrey", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "body_core_loaf", "from": [-3.8, 4.1, -3.4], "to": [3.8, 8.2, 3.6], "color": "pigeonGrey", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "breast_puff_front", "from": [-3.0, 4.5, -4.6], "to": [3.0, 7.8, -3.2], "color": "white", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "undertail_cushion", "from": [-2.0, 3.8, 3.4], "to": [2.0, 5.4, 5.0], "color": "pigeonGrey", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "left_wing_mantle", "from": [-4.4, 4.8, -2.8], "to": [-3.6, 7.8, 2.2], "color": "pigeonGrey", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "left_wing_bar_1", "from": [-4.5, 5.1, -0.4], "to": [-3.7, 7.2, 0.5], "color": "darkCharcoal", "col_idx": 3, "uv": [3, 0, 4, 1]}, {"name": "left_wing_bar_2", "from": [-4.5, 4.7, 1.0], "to": [-3.7, 6.7, 1.9], "color": "darkCharcoal", "col_idx": 3, "uv": [3, 0, 4, 1]}, {"name": "left_wing_primaries", "from": [-4.2, 4.4, 2.1], "to": [-2.3, 5.8, 6.2], "color": "darkCharcoal", "col_idx": 3, "uv": [3, 0, 4, 1]}, {"name": "right_wing_mantle", "from": [3.6, 4.8, -2.8], "to": [4.4, 7.8, 2.2], "color": "pigeonGrey", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "right_wing_bar_1", "from": [3.7, 5.1, -0.4], "to": [4.5, 7.2, 0.5], "color": "darkCharcoal", "col_idx": 3, "uv": [3, 0, 4, 1]}, {"name": "right_wing_bar_2", "from": [3.7, 4.7, 1.0], "to": [4.5, 6.7, 1.9], "color": "darkCharcoal", "col_idx": 3, "uv": [3, 0, 4, 1]}, {"name": "right_wing_primaries", "from": [2.3, 4.4, 2.1], "to": [4.2, 5.8, 6.2], "color": "darkCharcoal", "col_idx": 3, "uv": [3, 0, 4, 1]}, {"name": "tail_base_grey", "from": [-2.4, 5.1, 3.8], "to": [2.4, 6.4, 6.6], "color": "pigeonGrey", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "tail_black_band", "from": [-2.6, 4.6, 6.4], "to": [2.6, 5.7, 8.8], "color": "darkCharcoal", "col_idx": 3, "uv": [3, 0, 4, 1]}, {"name": "tail_white_tip", "from": [-2.4, 4.8, 8.6], "to": [2.4, 5.5, 9.6], "color": "white", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "neck_base_teal", "from": [-3.0, 7.9, -4.1], "to": [3.0, 9.2, -1.2], "color": "pigeonTeal", "col_idx": 4, "uv": [4, 0, 5, 1]}, {"name": "neck_collar_purple", "from": [-2.8, 9.0, -3.9], "to": [2.8, 10.4, -1.4], "color": "purpleNeck", "col_idx": 5, "uv": [5, 0, 6, 1]}, {"name": "neck_sheen_front", "from": [-2.2, 8.2, -4.5], "to": [2.2, 9.8, -3.7], "color": "pigeonTeal", "col_idx": 4, "uv": [4, 0, 5, 1]}, {"name": "head_core", "from": [-2.6, 10.0, -4.2], "to": [2.6, 13.8, 0.2], "color": "pigeonGrey", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "head_crown", "from": [-2.0, 13.6, -3.7], "to": [2.0, 14.5, -0.6], "color": "pigeonGrey", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "eye_ring_left", "from": [-2.85, 11.2, -3.5], "to": [-2.45, 12.8, -1.9], "color": "orangeFruit", "col_idx": 6, "uv": [6, 0, 7, 1]}, {"name": "eye_pupil_left", "from": [-2.9, 11.5, -3.2], "to": [-2.4, 12.5, -2.2], "color": "darkCharcoal", "col_idx": 3, "uv": [3, 0, 4, 1]}, {"name": "eye_sparkle_left", "from": [-2.95, 12.0, -3.0], "to": [-2.5, 12.4, -2.5], "color": "white", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "eye_ring_right", "from": [2.45, 11.2, -3.5], "to": [2.85, 12.8, -1.9], "color": "orangeFruit", "col_idx": 6, "uv": [6, 0, 7, 1]}, {"name": "eye_pupil_right", "from": [2.4, 11.5, -3.2], "to": [2.9, 12.5, -2.2], "color": "darkCharcoal", "col_idx": 3, "uv": [3, 0, 4, 1]}, {"name": "eye_sparkle_right", "from": [2.5, 12.0, -3.0], "to": [2.95, 12.4, -2.5], "color": "white", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "beak_upper", "from": [-0.8, 11.1, -6.3], "to": [0.8, 11.8, -4.0], "color": "orangeFruit", "col_idx": 6, "uv": [6, 0, 7, 1]}, {"name": "beak_tip", "from": [-0.5, 10.8, -6.9], "to": [0.5, 11.7, -5.9], "color": "orangeFruit", "col_idx": 6, "uv": [6, 0, 7, 1]}, {"name": "beak_lower", "from": [-0.7, 10.3, -5.7], "to": [0.7, 11.0, -4.1], "color": "orangeFruit", "col_idx": 6, "uv": [6, 0, 7, 1]}, {"name": "cere_waxy_bump", "from": [-0.9, 11.7, -5.3], "to": [0.9, 12.4, -4.1], "color": "white", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "pizza_crust", "from": [-3.1, 10.8, -9.6], "to": [3.1, 12.0, -8.7], "color": "pizzaCrust", "col_idx": 7, "uv": [7, 0, 8, 1]}, {"name": "pizza_sauce_base", "from": [-2.7, 10.6, -8.8], "to": [2.7, 11.3, -5.6], "color": "pizzaRed", "col_idx": 9, "uv": [9, 0, 10, 1]}, {"name": "pizza_cheese_wide", "from": [-2.6, 11.1, -8.5], "to": [2.6, 11.7, -7.2], "color": "pizzaCheese", "col_idx": 8, "uv": [8, 0, 9, 1]}, {"name": "pizza_cheese_mid", "from": [-1.8, 10.9, -7.3], "to": [1.8, 11.5, -5.8], "color": "pizzaCheese", "col_idx": 8, "uv": [8, 0, 9, 1]}, {"name": "pizza_cheese_tip", "from": [-0.9, 11.05, -6.0], "to": [0.9, 11.4, -4.8], "color": "pizzaCheese", "col_idx": 8, "uv": [8, 0, 9, 1]}, {"name": "pepperoni_left", "from": [-1.7, 11.45, -8.3], "to": [-0.6, 11.85, -7.1], "color": "pizzaRed", "col_idx": 9, "uv": [9, 0, 10, 1]}, {"name": "pepperoni_right", "from": [0.6, 11.45, -8.1], "to": [1.7, 11.85, -6.9], "color": "pizzaRed", "col_idx": 9, "uv": [9, 0, 10, 1]}, {"name": "pepperoni_front", "from": [-0.6, 11.35, -6.7], "to": [0.6, 11.75, -5.5], "color": "pizzaRed", "col_idx": 9, "uv": [9, 0, 10, 1]}, {"name": "basil_leaf", "from": [-1.4, 11.45, -6.8], "to": [-0.7, 11.75, -6.2], "color": "greenLeaf", "col_idx": 10, "uv": [10, 0, 11, 1]}, {"name": "cheese_drip_left", "from": [-2.0, 9.8, -7.7], "to": [-1.4, 11.2, -7.1], "color": "pizzaCheese", "col_idx": 8, "uv": [8, 0, 9, 1]}, {"name": "cheese_drip_right", "from": [1.1, 10.0, -6.9], "to": [1.7, 11.2, -6.3], "color": "pizzaCheese", "col_idx": 8, "uv": [8, 0, 9, 1]}];

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

Undo.finishEdit('Zero Z-Fighting Pigeon Pizza');
Canvas.updateAll();

return {
  cubesCount: Cube.all.length,
  textureName: tex.name
};
