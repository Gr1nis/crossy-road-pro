
Cube.all.slice().forEach(c => c.remove());
Texture.all.slice().forEach(t => t.remove());

const canvas = document.createElement('canvas');
canvas.width = 16;
canvas.height = 16;
const ctx = canvas.getContext('2d');
ctx.fillStyle = '#1e293b';
ctx.fillRect(0, 0, 16, 16);

const swatches = ["#d4b285", "#09090b", "#1c1917", "#16a34a", "#facc15", "#ffffff", "#b45309", "#78350f", "#854d0e", "#dc2626", "#f472b6"];
swatches.forEach((hex, idx) => {
  ctx.fillStyle = hex;
  ctx.fillRect(idx, 0, 1, 1);
});

const tex = new Texture({ name: 'barista_pug_palette' });
tex.fromDataURL(canvas.toDataURL('image/png')).add(false);

const cubesData = [{"name": "leg_front_left", "from": [-3.35, 0.95, -3.45], "to": [-2.05, 4.25, -1.85], "color": "burlapBag", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "paw_front_left", "from": [-3.45, 0.0, -3.65], "to": [-1.95, 1.25, -1.75], "color": "maskBlack", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "leg_front_right", "from": [2.05, 0.95, -3.45], "to": [3.35, 4.25, -1.85], "color": "burlapBag", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "paw_front_right", "from": [1.95, 0.0, -3.65], "to": [3.45, 1.25, -1.75], "color": "maskBlack", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "thigh_rear_left", "from": [-3.55, 0.95, 1.05], "to": [-2.05, 3.75, 3.25], "color": "burlapBag", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "paw_rear_left", "from": [-3.35, 0.0, 1.15], "to": [-2.15, 1.25, 3.35], "color": "maskBlack", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "thigh_rear_right", "from": [2.05, 0.95, 1.05], "to": [3.55, 3.75, 3.25], "color": "burlapBag", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "paw_rear_right", "from": [2.15, 0.0, 1.15], "to": [3.35, 1.25, 3.35], "color": "maskBlack", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "body_core", "from": [-3.15, 2.25, -2.55], "to": [3.15, 6.45, 3.15], "color": "burlapBag", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "body_underbelly", "from": [-2.55, 1.65, -2.15], "to": [2.55, 2.75, 2.75], "color": "burlapBag", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "back_arch_ridge", "from": [-2.65, 6.25, -1.65], "to": [2.65, 6.95, 2.45], "color": "burlapBag", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "rump_rear", "from": [-2.75, 2.65, 2.95], "to": [2.75, 5.95, 3.85], "color": "burlapBag", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "apron_bib", "from": [-2.15, 3.55, -3.05], "to": [2.15, 6.25, -2.45], "color": "greenLeaf", "col_idx": 3, "uv": [3, 0, 4, 1]}, {"name": "apron_strap_left", "from": [-2.55, 5.85, -2.85], "to": [-1.85, 6.65, -1.85], "color": "greenLeaf", "col_idx": 3, "uv": [3, 0, 4, 1]}, {"name": "apron_strap_right", "from": [1.85, 5.85, -2.85], "to": [2.55, 6.65, -1.85], "color": "greenLeaf", "col_idx": 3, "uv": [3, 0, 4, 1]}, {"name": "apron_waist_wrap", "from": [-3.25, 2.65, -2.75], "to": [3.25, 3.85, 2.25], "color": "greenLeaf", "col_idx": 3, "uv": [3, 0, 4, 1]}, {"name": "apron_tie_bow", "from": [-1.35, 2.75, 3.75], "to": [1.35, 3.65, 4.35], "color": "greenLeaf", "col_idx": 3, "uv": [3, 0, 4, 1]}, {"name": "apron_tie_knot", "from": [-0.45, 2.95, 4.25], "to": [0.45, 3.45, 4.65], "color": "greenLeaf", "col_idx": 3, "uv": [3, 0, 4, 1]}, {"name": "barista_badge", "from": [-1.85, 5.15, -3.18], "to": [-0.95, 5.75, -2.95], "color": "goldCoin", "col_idx": 4, "uv": [4, 0, 5, 1]}, {"name": "cup_base", "from": [-1.15, 0.0, -4.45], "to": [1.15, 1.65, -2.95], "color": "white", "col_idx": 5, "uv": [5, 0, 6, 1]}, {"name": "cup_heat_sleeve", "from": [-1.25, 0.75, -4.55], "to": [1.25, 2.05, -2.85], "color": "cardboard", "col_idx": 6, "uv": [6, 0, 7, 1]}, {"name": "cup_upper_rim", "from": [-1.35, 1.95, -4.65], "to": [1.35, 3.15, -2.8], "color": "white", "col_idx": 5, "uv": [5, 0, 6, 1]}, {"name": "latte_foam", "from": [-1.15, 3.05, -4.45], "to": [1.15, 3.45, -2.95], "color": "white", "col_idx": 5, "uv": [5, 0, 6, 1]}, {"name": "crema_heart", "from": [-0.75, 3.35, -4.15], "to": [0.75, 3.55, -3.25], "color": "capybaraBrown", "col_idx": 7, "uv": [7, 0, 8, 1]}, {"name": "coffee_straw", "from": [0.25, 3.25, -3.75], "to": [0.65, 4.35, -3.35], "color": "deliveryRed", "col_idx": 9, "uv": [9, 0, 10, 1]}, {"name": "head_core", "from": [-3.05, 6.15, -3.55], "to": [3.05, 10.45, 1.15], "color": "burlapBag", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "head_crown_top", "from": [-2.45, 10.25, -2.85], "to": [2.45, 10.95, 0.65], "color": "burlapBag", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "head_face_plate", "from": [-2.75, 6.95, -4.05], "to": [2.75, 9.75, -3.45], "color": "burlapBag", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "cheek_fluff_left", "from": [-3.65, 6.55, -2.95], "to": [-2.85, 8.85, 0.35], "color": "burlapBag", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "cheek_fluff_right", "from": [2.85, 6.55, -2.95], "to": [3.65, 8.85, 0.35], "color": "burlapBag", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "snout_chin_under", "from": [-1.75, 5.65, -3.65], "to": [1.75, 6.75, -2.15], "color": "burlapBag", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "muzzle_jowls", "from": [-1.95, 6.35, -4.95], "to": [1.95, 8.25, -3.75], "color": "darkCharcoal", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "nose_button", "from": [-0.65, 7.85, -5.25], "to": [0.65, 8.75, -4.65], "color": "maskBlack", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "jowl_droop_left", "from": [-1.85, 6.15, -4.85], "to": [-0.95, 7.35, -3.95], "color": "darkCharcoal", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "jowl_droop_right", "from": [0.95, 6.15, -4.85], "to": [1.85, 7.35, -3.95], "color": "darkCharcoal", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "tongue_blep", "from": [-0.35, 6.15, -5.1], "to": [0.35, 6.75, -4.55], "color": "nosePink", "col_idx": 10, "uv": [10, 0, 11, 1]}, {"name": "eye_left_iris", "from": [-2.65, 7.95, -4.25], "to": [-1.55, 9.25, -3.65], "color": "maskBlack", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "eye_left_sparkle", "from": [-2.55, 8.55, -4.35], "to": [-1.95, 9.15, -3.85], "color": "white", "col_idx": 5, "uv": [5, 0, 6, 1]}, {"name": "eye_right_iris", "from": [1.55, 7.95, -4.25], "to": [2.65, 9.25, -3.65], "color": "maskBlack", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "eye_right_sparkle", "from": [1.95, 8.55, -4.35], "to": [2.55, 9.15, -3.85], "color": "white", "col_idx": 5, "uv": [5, 0, 6, 1]}, {"name": "ear_base_left", "from": [-3.55, 9.25, -1.95], "to": [-2.35, 10.75, 0.25], "color": "darkCharcoal", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "ear_flap_left", "from": [-3.75, 8.05, -2.45], "to": [-2.55, 9.65, -0.65], "color": "darkCharcoal", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "ear_base_right", "from": [2.35, 9.25, -1.95], "to": [3.55, 10.75, 0.25], "color": "darkCharcoal", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "ear_flap_right", "from": [2.55, 8.05, -2.45], "to": [3.75, 9.65, -0.65], "color": "darkCharcoal", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "tail_base", "from": [-0.45, 4.95, 3.65], "to": [0.45, 5.75, 4.25], "color": "burlapBag", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "tail_hook_up", "from": [-0.35, 5.55, 3.95], "to": [0.55, 6.55, 4.45], "color": "darkCharcoal", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "tail_hook_tip", "from": [-0.25, 6.35, 3.45], "to": [0.45, 6.95, 4.05], "color": "darkCharcoal", "col_idx": 2, "uv": [2, 0, 3, 1]}];

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

Undo.finishEdit('Barista Pug V5.0 (Hook Tail at Rear, 4 Grounded Paws, Clean Fawn Face)');
Canvas.updateAll();

return {
  cubesCount: Cube.all.length,
  textureName: tex.name
};
