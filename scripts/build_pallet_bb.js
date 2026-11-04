
Cube.all.slice().forEach(c => c.remove());
Group.all.slice().forEach(g => g.remove());
Texture.all.slice().forEach(t => t.remove());

Project.name = 'pallet';
Project.texture_width = 16;
Project.texture_height = 16;

const canvas = document.createElement('canvas');
canvas.width = 16;
canvas.height = 16;
const ctx = canvas.getContext('2d');
ctx.fillStyle = '#0f172a';
ctx.fillRect(0, 0, 16, 16);

const swatches = ["#d97706", "#b45309", "#92400e", "#78350f", "#451a03", "#94a3b8", "#f8fafc", "#0284c7", "#0f172a", "#0f172a", "#0f172a", "#0f172a", "#0f172a", "#0f172a", "#0f172a", "#0f172a"];
swatches.forEach((hex, idx) => {
  ctx.fillStyle = hex;
  ctx.fillRect(idx, 0, 1, 1);
});

const tex = new Texture({ name: 'pallet_palette' });
tex.fromDataURL(canvas.toDataURL('image/png')).add(false);

const groupDefs = ["bottom_runners", "spacer_blocks", "cross_stringers", "top_deck_slats", "branding_fasteners"];
const groups = {};
groupDefs.forEach(name => {
  groups[name] = new Group({ name: name }).init();
});

const cubesData = [{"name": "runner_bottom_left", "group": "bottom_runners", "from": [-8.85, 0.0, -11.85], "to": [-6.65, 0.8, 11.85], "color": "woodDark", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "runner_bottom_center", "group": "bottom_runners", "from": [-1.1, 0.0, -11.85], "to": [1.1, 0.8, 11.85], "color": "woodDark", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "runner_bottom_right", "group": "bottom_runners", "from": [6.65, 0.0, -11.85], "to": [8.85, 0.8, 11.85], "color": "woodDark", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "block_front_left", "group": "spacer_blocks", "from": [-8.7, 0.7, -11.7], "to": [-6.8, 3.4, -8.7], "color": "woodBlock", "col_idx": 3, "uv": [3, 0, 4, 1]}, {"name": "block_front_center", "group": "spacer_blocks", "from": [-0.95, 0.7, -11.7], "to": [0.95, 3.4, -8.7], "color": "woodBlock", "col_idx": 3, "uv": [3, 0, 4, 1]}, {"name": "block_front_right", "group": "spacer_blocks", "from": [6.8, 0.7, -11.7], "to": [8.7, 3.4, -8.7], "color": "woodBlock", "col_idx": 3, "uv": [3, 0, 4, 1]}, {"name": "block_mid_left", "group": "spacer_blocks", "from": [-8.7, 0.7, -1.5], "to": [-6.8, 3.4, 1.5], "color": "woodBlock", "col_idx": 3, "uv": [3, 0, 4, 1]}, {"name": "block_mid_center", "group": "spacer_blocks", "from": [-0.95, 0.7, -1.5], "to": [0.95, 3.4, 1.5], "color": "woodBlock", "col_idx": 3, "uv": [3, 0, 4, 1]}, {"name": "block_mid_right", "group": "spacer_blocks", "from": [6.8, 0.7, -1.5], "to": [8.7, 3.4, 1.5], "color": "woodBlock", "col_idx": 3, "uv": [3, 0, 4, 1]}, {"name": "block_rear_left", "group": "spacer_blocks", "from": [-8.7, 0.7, 8.7], "to": [-6.8, 3.4, 11.7], "color": "woodBlock", "col_idx": 3, "uv": [3, 0, 4, 1]}, {"name": "block_rear_center", "group": "spacer_blocks", "from": [-0.95, 0.7, 8.7], "to": [0.95, 3.4, 11.7], "color": "woodBlock", "col_idx": 3, "uv": [3, 0, 4, 1]}, {"name": "block_rear_right", "group": "spacer_blocks", "from": [6.8, 0.7, 8.7], "to": [8.7, 3.4, 11.7], "color": "woodBlock", "col_idx": 3, "uv": [3, 0, 4, 1]}, {"name": "stringer_front", "group": "cross_stringers", "from": [-8.8, 3.3, -11.8], "to": [8.8, 4.1, -8.6], "color": "woodDark", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "stringer_center", "group": "cross_stringers", "from": [-8.8, 3.3, -1.6], "to": [8.8, 4.1, 1.6], "color": "woodDark", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "stringer_rear", "group": "cross_stringers", "from": [-8.8, 3.3, 8.6], "to": [8.8, 4.1, 11.8], "color": "woodDark", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "deck_slat_1_left", "group": "top_deck_slats", "from": [-8.9, 4.0, -11.9], "to": [-5.7, 4.85, 11.9], "color": "woodDeckLight", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "deck_slat_2_inleft", "group": "top_deck_slats", "from": [-4.7, 4.0, -11.9], "to": [-2.5, 4.85, 11.9], "color": "woodDeckMid", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "deck_slat_3_center", "group": "top_deck_slats", "from": [-1.6, 4.0, -11.9], "to": [1.6, 4.85, 11.9], "color": "woodDeckLight", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "deck_slat_4_inright", "group": "top_deck_slats", "from": [2.5, 4.0, -11.9], "to": [4.7, 4.85, 11.9], "color": "woodDeckMid", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "deck_slat_5_right", "group": "top_deck_slats", "from": [5.7, 4.0, -11.9], "to": [8.9, 4.85, 11.9], "color": "woodDeckLight", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "pallet_brand_stamp_top", "group": "branding_fasteners", "from": [6.1, 4.8, -3.5], "to": [8.5, 4.95, 3.5], "color": "stampBurn", "col_idx": 4, "uv": [4, 0, 5, 1]}, {"name": "nail_plate_fl", "group": "branding_fasteners", "from": [-8.5, 4.8, -10.4], "to": [-6.1, 4.95, -10.0], "color": "nailSteel", "col_idx": 5, "uv": [5, 0, 6, 1]}, {"name": "nail_plate_fr", "group": "branding_fasteners", "from": [6.1, 4.8, -10.4], "to": [8.5, 4.95, -10.0], "color": "nailSteel", "col_idx": 5, "uv": [5, 0, 6, 1]}, {"name": "nail_plate_rl", "group": "branding_fasteners", "from": [-8.5, 4.8, 10.0], "to": [-6.1, 4.95, 10.4], "color": "nailSteel", "col_idx": 5, "uv": [5, 0, 6, 1]}, {"name": "nail_plate_rr", "group": "branding_fasteners", "from": [6.1, 4.8, 10.0], "to": [8.5, 4.95, 10.4], "color": "nailSteel", "col_idx": 5, "uv": [5, 0, 6, 1]}, {"name": "foam_wake_bow", "group": "branding_fasteners", "from": [-8.2, 0.0, -12.1], "to": [8.2, 0.2, -11.8], "color": "foamWhite", "col_idx": 6, "uv": [6, 0, 7, 1]}, {"name": "foam_wake_stern", "group": "branding_fasteners", "from": [-8.2, 0.0, 11.8], "to": [8.2, 0.2, 12.1], "color": "foamWhite", "col_idx": 6, "uv": [6, 0, 7, 1]}, {"name": "foam_wake_port", "group": "branding_fasteners", "from": [-9.1, 0.0, -7.5], "to": [-8.8, 0.2, 7.5], "color": "foamWhite", "col_idx": 6, "uv": [6, 0, 7, 1]}, {"name": "foam_wake_starboard", "group": "branding_fasteners", "from": [8.8, 0.0, -7.5], "to": [9.1, 0.2, 7.5], "color": "foamWhite", "col_idx": 6, "uv": [6, 0, 7, 1]}];
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

Undo.finishEdit('Floating Wooden Euro-Pallet - 5 Slats, 3 Stringers, 9 Blocks, 3 Runners, Foam Wake');
Canvas.updateAll();

const modelData = Format.codec.compile();
Blockbench.writeFile('C:/Users/MIXPC/.gemini/antigravity/scratch/crossy-road-pro/assets/models/pallet.bbmodel', { content: modelData });

return {
  success: true,
  cubesCount: Cube.all.length,
  groupsCount: Group.all.length,
  textureName: tex.name,
  savedPath: 'C:/Users/MIXPC/.gemini/antigravity/scratch/crossy-road-pro/assets/models/pallet.bbmodel'
};
