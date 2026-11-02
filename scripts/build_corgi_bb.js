
// 1. Reset project cubes and textures
Cube.all.slice().forEach(c => c.remove());
Texture.all.slice().forEach(t => t.remove());

// 2. Create 16x16 palette texture
const canvas = document.createElement('canvas');
canvas.width = 16;
canvas.height = 16;
const ctx = canvas.getContext('2d');
// Fill background
ctx.fillStyle = '#1e293b';
ctx.fillRect(0, 0, 16, 16);

// Color row 0
const swatches = [
  '#d97706', // 0: corgiOrange
  '#ffffff', // 1: white
  '#f472b6', // 2: nosePink
  '#1e293b', // 3: darkCharcoal
  '#b91c1c', // 4: pizzaRed
  '#facc15'  // 5: pizzaCheese
];

swatches.forEach((hex, idx) => {
  ctx.fillStyle = hex;
  ctx.fillRect(idx, 0, 1, 1);
});

const tex = new Texture({ name: 'corgi_palette' });
tex.fromDataURL(canvas.toDataURL('image/png')).add(false);

// 3. Create all 44 solid cubes
const cubesData = [{"name": "front_paw_pad_left", "from": [-3.8, 0.0, -4.2], "to": [-1.8, 0.6, -2.2], "uv": [2, 0, 3, 1], "color": "nosePink"}, {"name": "front_paw_sock_left", "from": [-3.8, 0.6, -4.2], "to": [-1.8, 3.0, -2.2], "uv": [1, 0, 2, 1], "color": "white"}, {"name": "front_toe_beans_left", "from": [-3.5, 0.0, -4.6], "to": [-2.1, 0.6, -4.0], "uv": [2, 0, 3, 1], "color": "nosePink"}, {"name": "front_paw_pad_right", "from": [1.8, 0.0, -4.2], "to": [3.8, 0.6, -2.2], "uv": [2, 0, 3, 1], "color": "nosePink"}, {"name": "front_paw_sock_right", "from": [1.8, 0.6, -4.2], "to": [3.8, 3.0, -2.2], "uv": [1, 0, 2, 1], "color": "white"}, {"name": "front_toe_beans_right", "from": [2.1, 0.0, -4.6], "to": [3.5, 0.6, -4.0], "uv": [2, 0, 3, 1], "color": "nosePink"}, {"name": "rear_paw_pad_left", "from": [-3.8, 0.0, 2.2], "to": [-1.8, 0.6, 4.2], "uv": [2, 0, 3, 1], "color": "nosePink"}, {"name": "rear_paw_sock_left", "from": [-3.8, 0.6, 2.2], "to": [-1.8, 3.0, 4.2], "uv": [1, 0, 2, 1], "color": "white"}, {"name": "rear_paw_pad_right", "from": [1.8, 0.0, 2.2], "to": [3.8, 0.6, 4.2], "uv": [2, 0, 3, 1], "color": "nosePink"}, {"name": "rear_paw_sock_right", "from": [1.8, 0.6, 2.2], "to": [3.8, 3.0, 4.2], "uv": [1, 0, 2, 1], "color": "white"}, {"name": "rear_thigh_fluff_left", "from": [-3.9, 3.0, 2.1], "to": [-1.7, 4.6, 4.3], "uv": [0, 0, 1, 1], "color": "corgiOrange"}, {"name": "rear_thigh_fluff_right", "from": [1.7, 3.0, 2.1], "to": [3.9, 4.6, 4.3], "uv": [0, 0, 1, 1], "color": "corgiOrange"}, {"name": "body_loaf_core", "from": [-3.8, 2.8, -4.2], "to": [3.8, 7.2, 4.6], "uv": [0, 0, 1, 1], "color": "corgiOrange"}, {"name": "body_belly_white", "from": [-2.8, 2.4, -3.6], "to": [2.8, 3.2, 4.0], "uv": [1, 0, 2, 1], "color": "white"}, {"name": "chest_bib_main", "from": [-3.4, 3.2, -4.6], "to": [3.4, 7.2, -2.2], "uv": [1, 0, 2, 1], "color": "white"}, {"name": "chest_bib_tuft", "from": [-2.0, 4.2, -5.2], "to": [2.0, 6.6, -4.2], "uv": [1, 0, 2, 1], "color": "white"}, {"name": "rear_bum_core", "from": [-3.6, 3.2, 3.8], "to": [3.6, 7.2, 5.4], "uv": [0, 0, 1, 1], "color": "corgiOrange"}, {"name": "butt_peach_left", "from": [-3.0, 3.2, 4.8], "to": [0.0, 6.4, 6.0], "uv": [1, 0, 2, 1], "color": "white"}, {"name": "butt_peach_right", "from": [0.0, 3.2, 4.8], "to": [3.0, 6.4, 6.0], "uv": [1, 0, 2, 1], "color": "white"}, {"name": "butt_tail_bob", "from": [-1.2, 5.6, 4.2], "to": [1.2, 8.0, 6.2], "uv": [0, 0, 1, 1], "color": "corgiOrange"}, {"name": "butt_tail_tip", "from": [-0.8, 6.4, 5.6], "to": [0.8, 8.0, 6.8], "uv": [1, 0, 2, 1], "color": "white"}, {"name": "collar_ring", "from": [-3.4, 6.7, -5.2], "to": [3.4, 7.7, -0.4], "uv": [4, 0, 5, 1], "color": "pizzaRed"}, {"name": "collar_tag_gold", "from": [-0.6, 5.8, -5.4], "to": [0.6, 7.0, -4.6], "uv": [5, 0, 6, 1], "color": "pizzaCheese"}, {"name": "head_core", "from": [-3.6, 7.0, -6.2], "to": [3.6, 12.2, -0.2], "uv": [0, 0, 1, 1], "color": "corgiOrange"}, {"name": "cheek_fluff_left", "from": [-4.2, 7.5, -4.8], "to": [-3.2, 10.1, -2.0], "uv": [1, 0, 2, 1], "color": "white"}, {"name": "cheek_fluff_right", "from": [3.2, 7.5, -4.8], "to": [4.2, 10.1, -2.0], "uv": [1, 0, 2, 1], "color": "white"}, {"name": "blaze_forehead", "from": [-0.9, 7.4, -6.5], "to": [0.9, 12.2, -3.9], "uv": [1, 0, 2, 1], "color": "white"}, {"name": "blaze_crown", "from": [-0.7, 11.8, -4.6], "to": [0.7, 12.6, -2.6], "uv": [1, 0, 2, 1], "color": "white"}, {"name": "snout_muzzle", "from": [-2.0, 7.2, -8.0], "to": [2.0, 9.6, -5.2], "uv": [1, 0, 2, 1], "color": "white"}, {"name": "chin_under_mouth", "from": [-1.4, 6.8, -7.0], "to": [1.4, 7.6, -5.4], "uv": [1, 0, 2, 1], "color": "white"}, {"name": "nose_button", "from": [-0.8, 8.6, -8.6], "to": [0.8, 9.8, -7.4], "uv": [3, 0, 4, 1], "color": "darkCharcoal"}, {"name": "tongue_playful", "from": [0.0, 7.35, -8.6], "to": [1.2, 8.05, -7.0], "uv": [2, 0, 3, 1], "color": "nosePink"}, {"name": "eye_left_iris", "from": [-2.8, 9.5, -6.2], "to": [-1.6, 10.9, -5.4], "uv": [3, 0, 4, 1], "color": "darkCharcoal"}, {"name": "eye_left_sparkle", "from": [-2.45, 10.35, -6.4], "to": [-1.95, 10.85, -6.0], "uv": [1, 0, 2, 1], "color": "white"}, {"name": "eyebrow_left", "from": [-2.7, 10.95, -5.9], "to": [-1.7, 11.45, -5.5], "uv": [1, 0, 2, 1], "color": "white"}, {"name": "eye_right_iris", "from": [1.6, 9.5, -6.2], "to": [2.8, 10.9, -5.4], "uv": [3, 0, 4, 1], "color": "darkCharcoal"}, {"name": "eye_right_sparkle", "from": [1.95, 10.35, -6.4], "to": [2.45, 10.85, -6.0], "uv": [1, 0, 2, 1], "color": "white"}, {"name": "eyebrow_right", "from": [1.7, 10.95, -5.9], "to": [2.7, 11.45, -5.5], "uv": [1, 0, 2, 1], "color": "white"}, {"name": "ear_base_left", "from": [-3.8, 11.6, -3.8], "to": [-1.8, 14.4, -2.2], "uv": [0, 0, 1, 1], "color": "corgiOrange"}, {"name": "ear_tip_left", "from": [-3.4, 14.0, -3.6], "to": [-2.2, 16.0, -2.4], "uv": [0, 0, 1, 1], "color": "corgiOrange"}, {"name": "ear_pink_left", "from": [-3.4, 11.8, -3.82], "to": [-2.2, 14.2, -3.22], "uv": [2, 0, 3, 1], "color": "nosePink"}, {"name": "ear_base_right", "from": [1.8, 11.6, -3.8], "to": [3.8, 14.4, -2.2], "uv": [0, 0, 1, 1], "color": "corgiOrange"}, {"name": "ear_tip_right", "from": [2.2, 14.0, -3.6], "to": [3.4, 16.0, -2.4], "uv": [0, 0, 1, 1], "color": "corgiOrange"}, {"name": "ear_pink_right", "from": [2.2, 11.8, -3.82], "to": [3.4, 14.2, -3.22], "uv": [2, 0, 3, 1], "color": "nosePink"}];

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

Undo.finishEdit('Build Solid Corgi 44v');
Canvas.updateAll();

return {
  cubesCount: Cube.all.length,
  textureName: tex.name
};
