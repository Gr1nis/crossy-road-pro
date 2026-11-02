
Cube.all.slice().forEach(c => c.remove());
Texture.all.slice().forEach(t => t.remove());

const canvas = document.createElement('canvas');
canvas.width = 16;
canvas.height = 16;
const ctx = canvas.getContext('2d');
ctx.fillStyle = '#1e293b';
ctx.fillRect(0, 0, 16, 16);

const swatches = ["#ffffff", "#f97316", "#c2410c", "#ea580c", "#09090b", "#ffffff", "#f1f5f9", "#facc15", "#eab308", "#1e293b", "#2563eb", "#1d4ed8", "#60a5fa"];
swatches.forEach((hex, idx) => {
  ctx.fillStyle = hex;
  ctx.fillRect(idx, 0, 1, 1);
});

const tex = new Texture({ name: 'raincoat_duck_palette' });
tex.fromDataURL(canvas.toDataURL('image/png')).add(false);

const cubesData = [{"name": "boot_sole_left", "from": [-2.45, 0.0, -1.95], "to": [-0.95, 0.65, 1.25], "color": "bootSole", "col_idx": 11, "uv": [11, 0, 12, 1]}, {"name": "boot_sole_right", "from": [0.95, 0.0, -1.95], "to": [2.45, 0.65, 1.25], "color": "bootSole", "col_idx": 11, "uv": [11, 0, 12, 1]}, {"name": "boot_vamp_left", "from": [-2.35, 0.55, -1.85], "to": [-1.05, 1.65, 1.05], "color": "bootBlue", "col_idx": 10, "uv": [10, 0, 11, 1]}, {"name": "boot_vamp_right", "from": [1.05, 0.55, -1.85], "to": [2.35, 1.65, 1.05], "color": "bootBlue", "col_idx": 10, "uv": [10, 0, 11, 1]}, {"name": "boot_shaft_left", "from": [-2.15, 1.55, -0.95], "to": [-1.25, 2.85, 0.75], "color": "bootBlue", "col_idx": 10, "uv": [10, 0, 11, 1]}, {"name": "boot_shaft_right", "from": [1.25, 1.55, -0.95], "to": [2.15, 2.85, 0.75], "color": "bootBlue", "col_idx": 10, "uv": [10, 0, 11, 1]}, {"name": "boot_rim_left", "from": [-2.25, 2.75, -1.05], "to": [-1.15, 3.15, 0.85], "color": "bootRim", "col_idx": 12, "uv": [12, 0, 13, 1]}, {"name": "boot_rim_right", "from": [1.15, 2.75, -1.05], "to": [2.25, 3.15, 0.85], "color": "bootRim", "col_idx": 12, "uv": [12, 0, 13, 1]}, {"name": "leg_left", "from": [-1.95, 2.95, -0.65], "to": [-1.45, 3.95, 0.45], "color": "duckOrange", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "leg_right", "from": [1.45, 2.95, -0.65], "to": [1.95, 3.95, 0.45], "color": "duckOrange", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "raincoat_hem", "from": [-2.45, 3.75, -1.95], "to": [2.45, 4.55, 2.45], "color": "raincoatYellow", "col_idx": 7, "uv": [7, 0, 8, 1]}, {"name": "raincoat_body", "from": [-2.25, 4.45, -1.75], "to": [2.25, 7.25, 2.15], "color": "raincoatYellow", "col_idx": 7, "uv": [7, 0, 8, 1]}, {"name": "coat_placket_strip", "from": [-0.35, 4.25, -2.05], "to": [0.35, 7.15, -1.7], "color": "coatAccent", "col_idx": 8, "uv": [8, 0, 9, 1]}, {"name": "toggle_button_1", "from": [-0.25, 4.65, -2.25], "to": [0.25, 5.15, -1.95], "color": "toggleDark", "col_idx": 9, "uv": [9, 0, 10, 1]}, {"name": "toggle_button_2", "from": [-0.25, 5.65, -2.25], "to": [0.25, 6.15, -1.95], "color": "toggleDark", "col_idx": 9, "uv": [9, 0, 10, 1]}, {"name": "toggle_button_3", "from": [-0.25, 6.55, -2.25], "to": [0.25, 7.05, -1.95], "color": "toggleDark", "col_idx": 9, "uv": [9, 0, 10, 1]}, {"name": "pocket_left", "from": [-2.35, 4.62, -1.85], "to": [-1.45, 5.45, -1.05], "color": "coatAccent", "col_idx": 8, "uv": [8, 0, 9, 1]}, {"name": "pocket_right", "from": [1.45, 4.62, -1.85], "to": [2.35, 5.45, -1.05], "color": "coatAccent", "col_idx": 8, "uv": [8, 0, 9, 1]}, {"name": "coat_belt_back", "from": [-1.85, 4.85, 2.05], "to": [1.85, 5.55, 2.35], "color": "coatAccent", "col_idx": 8, "uv": [8, 0, 9, 1]}, {"name": "coat_belt_buckle", "from": [-0.45, 4.95, 2.25], "to": [0.45, 5.45, 2.55], "color": "toggleDark", "col_idx": 9, "uv": [9, 0, 10, 1]}, {"name": "sleeve_left", "from": [-2.75, 4.85, -1.15], "to": [-2.15, 6.75, 1.15], "color": "raincoatYellow", "col_idx": 7, "uv": [7, 0, 8, 1]}, {"name": "sleeve_right", "from": [2.15, 4.85, -1.15], "to": [2.75, 6.75, 1.15], "color": "raincoatYellow", "col_idx": 7, "uv": [7, 0, 8, 1]}, {"name": "wingtip_left", "from": [-2.65, 4.15, -0.85], "to": [-2.28, 4.95, 0.85], "color": "featherWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "wingtip_right", "from": [2.28, 4.15, -0.85], "to": [2.65, 4.95, 0.85], "color": "featherWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "tail_base", "from": [-0.85, 4.75, 2.1], "to": [0.85, 5.85, 3.15], "color": "featherWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "tail_curl_tip", "from": [-0.55, 5.65, 2.85], "to": [0.55, 6.75, 3.85], "color": "featherWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "neck_duck", "from": [-1.55, 7.05, -1.35], "to": [1.55, 8.2, 1.05], "color": "featherWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "raincoat_collar", "from": [-1.85, 6.95, -1.65], "to": [1.85, 7.65, 1.35], "color": "raincoatYellow", "col_idx": 7, "uv": [7, 0, 8, 1]}, {"name": "head_core", "from": [-1.85, 7.85, -2.15], "to": [1.85, 10.65, 1.35], "color": "featherWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "cheek_fluff_left", "from": [-2.15, 7.95, -1.85], "to": [-1.65, 9.35, 0.75], "color": "featherWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "cheek_fluff_right", "from": [1.65, 7.95, -1.85], "to": [2.15, 9.35, 0.75], "color": "featherWhite", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "bill_lower_jaw", "from": [-1.05, 7.55, -3.95], "to": [1.05, 7.95, -1.9], "color": "billLower", "col_idx": 3, "uv": [3, 0, 4, 1]}, {"name": "bill_dorsal_bridge", "from": [-0.85, 8.45, -3.35], "to": [0.85, 9.05, -2.05], "color": "duckOrange", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "bill_nostril_plate", "from": [-0.45, 8.75, -3.15], "to": [0.45, 9.15, -2.45], "color": "billDark", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "bill_main_body", "from": [-1.3, 7.8, -3.85], "to": [1.3, 8.65, -1.95], "color": "duckOrange", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "bill_rim_left", "from": [-1.42, 8.05, -4.35], "to": [-1.22, 8.55, -2.25], "color": "billDark", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "bill_rim_right", "from": [1.22, 8.05, -4.35], "to": [1.42, 8.55, -2.25], "color": "billDark", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "bill_spoon_flare", "from": [-1.2, 7.9, -4.75], "to": [1.2, 8.45, -3.75], "color": "duckOrange", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "bill_tip_nail", "from": [-0.35, 7.95, -4.95], "to": [0.35, 8.35, -4.65], "color": "billDark", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "eye_left", "from": [-1.65, 8.75, -2.45], "to": [-0.95, 9.65, -1.85], "color": "eyeBlack", "col_idx": 4, "uv": [4, 0, 5, 1]}, {"name": "eye_right", "from": [0.95, 8.75, -2.45], "to": [1.65, 9.65, -1.85], "color": "eyeBlack", "col_idx": 4, "uv": [4, 0, 5, 1]}, {"name": "sparkle_left", "from": [-1.55, 9.15, -2.55], "to": [-1.15, 9.55, -2.25], "color": "sparkleWhite", "col_idx": 5, "uv": [5, 0, 6, 1]}, {"name": "sparkle_right", "from": [1.15, 9.15, -2.55], "to": [1.55, 9.55, -2.25], "color": "sparkleWhite", "col_idx": 5, "uv": [5, 0, 6, 1]}, {"name": "hood_crown", "from": [-1.95, 10.45, -1.95], "to": [1.95, 11.55, 1.55], "color": "raincoatYellow", "col_idx": 7, "uv": [7, 0, 8, 1]}, {"name": "hood_drape_rear", "from": [-2.05, 8.28, 0.45], "to": [2.05, 10.7, 1.65], "color": "raincoatYellow", "col_idx": 7, "uv": [7, 0, 8, 1]}, {"name": "hood_flap_left", "from": [-2.25, 9.25, -1.75], "to": [-1.75, 10.6, 0.55], "color": "raincoatYellow", "col_idx": 7, "uv": [7, 0, 8, 1]}, {"name": "hood_flap_right", "from": [1.75, 9.25, -1.75], "to": [2.25, 10.6, 0.55], "color": "raincoatYellow", "col_idx": 7, "uv": [7, 0, 8, 1]}, {"name": "hood_visor_main", "from": [-2.45, 10.15, -3.35], "to": [2.45, 10.75, -1.7], "color": "raincoatYellow", "col_idx": 7, "uv": [7, 0, 8, 1]}, {"name": "hood_visor_lip", "from": [-2.25, 9.85, -3.85], "to": [2.25, 10.45, -3.25], "color": "coatAccent", "col_idx": 8, "uv": [8, 0, 9, 1]}, {"name": "hood_brim_eave_left", "from": [-2.55, 9.95, -2.15], "to": [-2.15, 10.55, 0.75], "color": "raincoatYellow", "col_idx": 7, "uv": [7, 0, 8, 1]}, {"name": "hood_brim_eave_right", "from": [2.15, 9.95, -2.15], "to": [2.55, 10.55, 0.75], "color": "raincoatYellow", "col_idx": 7, "uv": [7, 0, 8, 1]}, {"name": "drawstring_left", "from": [-1.15, 6.75, -2.15], "to": [-0.75, 7.75, -1.8], "color": "drawstringWhite", "col_idx": 6, "uv": [6, 0, 7, 1]}, {"name": "drawstring_right", "from": [0.75, 6.75, -2.15], "to": [1.15, 7.75, -1.8], "color": "drawstringWhite", "col_idx": 6, "uv": [6, 0, 7, 1]}];

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

Undo.finishEdit('Raincoat Duck V2.0 (Factured Sculpted Bill, Full Head Visor Brim, Clean Wings)');
Canvas.updateAll();

return {
  cubesCount: Cube.all.length,
  textureName: tex.name
};
