
Cube.all.slice().forEach(c => c.remove());
Group.all.slice().forEach(g => g.remove());
Texture.all.slice().forEach(t => t.remove());

Project.name = 'reindeer_glow';
Project.texture_width = 16;
Project.texture_height = 16;

const canvas = document.createElement('canvas');
canvas.width = 16;
canvas.height = 16;
const ctx = canvas.getContext('2d');
ctx.fillStyle = '#1c1917';
ctx.fillRect(0, 0, 16, 16);

const swatches = ["#b45309", "#78350f", "#fef3c7", "#f8fafc", "#1c1917", "#ef4444", "#e7e5e4", "#d6d3d1", "#dc2626", "#facc15", "#10b981", "#38bdf8", "#f43f5e"];
swatches.forEach((hex, idx) => {
  ctx.fillStyle = hex;
  ctx.fillRect(idx, 0, 1, 1);
});

const tex = new Texture({ name: 'reindeer_glow_palette' });
tex.fromDataURL(canvas.toDataURL('image/png')).add(false);

const groupDefs = ["legs_hooves", "body_torso", "collar_bells", "head_snout", "antlers_lights"];
const groups = {};
groupDefs.forEach(name => {
  groups[name] = new Group({ name: name }).init();
});

const cubesData = [{"name": "hoof_front_left", "group": "legs_hooves", "from": [-2.3, 0.0, -2.5], "to": [-1.5, 0.5, -1.7], "color": "hoofDark", "col_idx": 4, "uv": [4, 0, 5, 1]}, {"name": "leg_shin_front_left", "group": "legs_hooves", "from": [-2.2, 0.4, -2.4], "to": [-1.6, 2.7, -1.8], "color": "reindeerCaramel", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "leg_knee_front_left", "group": "legs_hooves", "from": [-2.25, 1.4, -2.5], "to": [-1.55, 1.9, -2.25], "color": "reindeerDark", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "shoulder_front_left", "group": "legs_hooves", "from": [-2.4, 2.6, -2.6], "to": [-1.5, 4.2, -1.5], "color": "reindeerCaramel", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "hoof_front_right", "group": "legs_hooves", "from": [1.5, 0.0, -2.5], "to": [2.3, 0.5, -1.7], "color": "hoofDark", "col_idx": 4, "uv": [4, 0, 5, 1]}, {"name": "leg_shin_front_right", "group": "legs_hooves", "from": [1.6, 0.4, -2.4], "to": [2.2, 2.7, -1.8], "color": "reindeerCaramel", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "leg_knee_front_right", "group": "legs_hooves", "from": [1.55, 1.4, -2.5], "to": [2.25, 1.9, -2.25], "color": "reindeerDark", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "shoulder_front_right", "group": "legs_hooves", "from": [1.5, 2.6, -2.6], "to": [2.4, 4.2, -1.5], "color": "reindeerCaramel", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "hoof_rear_left", "group": "legs_hooves", "from": [-2.3, 0.0, 1.7], "to": [-1.5, 0.5, 2.5], "color": "hoofDark", "col_idx": 4, "uv": [4, 0, 5, 1]}, {"name": "leg_shin_rear_left", "group": "legs_hooves", "from": [-2.2, 0.4, 1.8], "to": [-1.6, 2.6, 2.4], "color": "reindeerCaramel", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "leg_hock_rear_left", "group": "legs_hooves", "from": [-2.25, 1.2, 2.25], "to": [-1.55, 1.8, 2.55], "color": "reindeerDark", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "haunch_rear_left", "group": "legs_hooves", "from": [-2.45, 2.4, 1.3], "to": [-1.5, 4.5, 2.7], "color": "reindeerCaramel", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "hoof_rear_right", "group": "legs_hooves", "from": [1.5, 0.0, 1.7], "to": [2.3, 0.5, 2.5], "color": "hoofDark", "col_idx": 4, "uv": [4, 0, 5, 1]}, {"name": "leg_shin_rear_right", "group": "legs_hooves", "from": [1.6, 0.4, 1.8], "to": [2.2, 2.6, 2.4], "color": "reindeerCaramel", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "leg_hock_rear_right", "group": "legs_hooves", "from": [1.55, 1.2, 2.25], "to": [2.25, 1.8, 2.55], "color": "reindeerDark", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "haunch_rear_right", "group": "legs_hooves", "from": [1.5, 2.4, 1.3], "to": [2.45, 4.5, 2.7], "color": "reindeerCaramel", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "body_core", "group": "body_torso", "from": [-2.0, 2.8, -2.2], "to": [2.0, 5.5, 2.2], "color": "reindeerCaramel", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "body_withers_front", "group": "body_torso", "from": [-1.8, 5.2, -2.15], "to": [1.8, 6.0, -0.6], "color": "reindeerCaramel", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "body_back_spine", "group": "body_torso", "from": [-1.2, 5.3, -0.55], "to": [1.2, 5.8, 1.8], "color": "reindeerDark", "col_idx": 1, "uv": [1, 0, 2, 1]}, {"name": "body_belly_white", "group": "body_torso", "from": [-1.4, 2.45, -1.8], "to": [1.4, 2.85, 1.8], "color": "bellyWhite", "col_idx": 3, "uv": [3, 0, 4, 1]}, {"name": "body_flank_left", "group": "body_torso", "from": [-2.3, 3.2, -1.4], "to": [-1.95, 4.9, 1.4], "color": "reindeerCaramel", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "body_flank_right", "group": "body_torso", "from": [1.95, 3.2, -1.4], "to": [2.3, 4.9, 1.4], "color": "reindeerCaramel", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "body_rump_haunches", "group": "body_torso", "from": [-1.9, 3.0, 2.1], "to": [1.9, 5.4, 3.2], "color": "reindeerCaramel", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "rump_patch_white", "group": "body_torso", "from": [-1.5, 3.2, 3.15], "to": [1.5, 5.1, 3.45], "color": "bellyWhite", "col_idx": 3, "uv": [3, 0, 4, 1]}, {"name": "tail_base", "group": "body_torso", "from": [-0.6, 4.6, 3.3], "to": [0.6, 5.6, 4.1], "color": "reindeerCaramel", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "tail_white_fluff", "group": "body_torso", "from": [-0.5, 4.4, 3.4], "to": [0.5, 5.2, 4.25], "color": "bellyWhite", "col_idx": 3, "uv": [3, 0, 4, 1]}, {"name": "chest_bib_front", "group": "body_torso", "from": [-1.7, 3.1, -3.15], "to": [1.7, 5.7, -2.05], "color": "bibCream", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "chest_bib_lower_tuft", "group": "body_torso", "from": [-1.25, 3.3, -3.35], "to": [1.25, 4.8, -3.05], "color": "bibCream", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "neck_base_core", "group": "collar_bells", "from": [-1.5, 5.1, -2.9], "to": [1.5, 7.8, -1.4], "color": "reindeerCaramel", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "neck_throat_cream", "group": "collar_bells", "from": [-1.1, 5.6, -3.1], "to": [1.1, 7.3, -2.85], "color": "bibCream", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "collar_strap_front", "group": "collar_bells", "from": [-1.65, 5.75, -3.65], "to": [1.65, 6.45, -2.7], "color": "collarRed", "col_idx": 8, "uv": [8, 0, 9, 1]}, {"name": "collar_strap_sides", "group": "collar_bells", "from": [-1.75, 5.75, -2.75], "to": [1.75, 6.5, -1.5], "color": "collarRed", "col_idx": 8, "uv": [8, 0, 9, 1]}, {"name": "bell_center_gold", "group": "collar_bells", "from": [-0.6, 5.4, -4.3], "to": [0.6, 6.4, -3.6], "color": "bellGold", "col_idx": 9, "uv": [9, 0, 10, 1]}, {"name": "bell_left_gold", "group": "collar_bells", "from": [-1.9, 5.85, -2.5], "to": [-1.65, 6.4, -1.9], "color": "bellGold", "col_idx": 9, "uv": [9, 0, 10, 1]}, {"name": "bell_right_gold", "group": "collar_bells", "from": [1.65, 5.85, -2.5], "to": [1.9, 6.4, -1.9], "color": "bellGold", "col_idx": 9, "uv": [9, 0, 10, 1]}, {"name": "head_core", "group": "head_snout", "from": [-1.7, 7.2, -3.8], "to": [1.7, 9.9, -1.8], "color": "reindeerCaramel", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "head_crown_forehead", "group": "head_snout", "from": [-1.3, 9.7, -3.3], "to": [1.3, 10.45, -1.9], "color": "reindeerCaramel", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "snout_bridge", "group": "head_snout", "from": [-1.1, 7.3, -5.1], "to": [1.1, 8.65, -3.7], "color": "reindeerCaramel", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "snout_muzzle_lower", "group": "head_snout", "from": [-1.0, 6.75, -4.9], "to": [1.0, 7.4, -3.6], "color": "bibCream", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "snout_tip_black_lip", "group": "head_snout", "from": [-0.5, 6.85, -5.05], "to": [0.5, 7.25, -4.6], "color": "hoofDark", "col_idx": 4, "uv": [4, 0, 5, 1]}, {"name": "rudolph_nose_glow", "group": "head_snout", "from": [-0.6, 7.5, -5.9], "to": [0.6, 8.7, -4.9], "color": "noseRubyGlow", "col_idx": 5, "uv": [5, 0, 6, 1]}, {"name": "rudolph_nose_highlight", "group": "head_snout", "from": [-0.25, 8.2, -6.0], "to": [0.25, 8.6, -5.85], "color": "bellyWhite", "col_idx": 3, "uv": [3, 0, 4, 1]}, {"name": "eye_left", "group": "head_snout", "from": [-1.85, 8.1, -3.85], "to": [-1.6, 9.05, -3.05], "color": "hoofDark", "col_idx": 4, "uv": [4, 0, 5, 1]}, {"name": "eye_sparkle_left", "group": "head_snout", "from": [-1.9, 8.6, -3.65], "to": [-1.75, 8.95, -3.25], "color": "bellyWhite", "col_idx": 3, "uv": [3, 0, 4, 1]}, {"name": "eye_right", "group": "head_snout", "from": [1.6, 8.1, -3.85], "to": [1.85, 9.05, -3.05], "color": "hoofDark", "col_idx": 4, "uv": [4, 0, 5, 1]}, {"name": "eye_sparkle_right", "group": "head_snout", "from": [1.75, 8.6, -3.65], "to": [1.9, 8.95, -3.25], "color": "bellyWhite", "col_idx": 3, "uv": [3, 0, 4, 1]}, {"name": "ear_base_left", "group": "head_snout", "from": [-2.7, 9.3, -2.6], "to": [-1.5, 10.5, -1.7], "color": "reindeerCaramel", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "ear_inner_left", "group": "head_snout", "from": [-2.55, 9.5, -2.65], "to": [-1.65, 10.3, -2.15], "color": "bibCream", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "ear_base_right", "group": "head_snout", "from": [1.5, 9.3, -2.6], "to": [2.7, 10.5, -1.7], "color": "reindeerCaramel", "col_idx": 0, "uv": [0, 0, 1, 1]}, {"name": "ear_inner_right", "group": "head_snout", "from": [1.65, 9.5, -2.65], "to": [2.55, 10.3, -2.15], "color": "bibCream", "col_idx": 2, "uv": [2, 0, 3, 1]}, {"name": "antler_pedicle_left", "group": "antlers_lights", "from": [-1.2, 10.3, -2.6], "to": [-0.7, 11.2, -2.0], "color": "antlerBone", "col_idx": 6, "uv": [6, 0, 7, 1]}, {"name": "antler_brow_tine_left", "group": "antlers_lights", "from": [-1.15, 10.9, -3.4], "to": [-0.75, 11.5, -2.55], "color": "antlerBone", "col_idx": 6, "uv": [6, 0, 7, 1]}, {"name": "antler_main_beam_left", "group": "antlers_lights", "from": [-1.85, 11.1, -2.5], "to": [-1.1, 13.0, -1.9], "color": "antlerBone", "col_idx": 6, "uv": [6, 0, 7, 1]}, {"name": "antler_top_fork_back_left", "group": "antlers_lights", "from": [-2.1, 12.8, -1.95], "to": [-1.4, 14.1, -1.25], "color": "antlerBone", "col_idx": 6, "uv": [6, 0, 7, 1]}, {"name": "antler_top_fork_out_left", "group": "antlers_lights", "from": [-2.8, 12.6, -2.45], "to": [-1.75, 13.6, -1.85], "color": "antlerBone", "col_idx": 6, "uv": [6, 0, 7, 1]}, {"name": "antler_pedicle_right", "group": "antlers_lights", "from": [0.7, 10.3, -2.6], "to": [1.2, 11.2, -2.0], "color": "antlerBone", "col_idx": 6, "uv": [6, 0, 7, 1]}, {"name": "antler_brow_tine_right", "group": "antlers_lights", "from": [0.75, 10.9, -3.4], "to": [1.15, 11.5, -2.55], "color": "antlerBone", "col_idx": 6, "uv": [6, 0, 7, 1]}, {"name": "antler_main_beam_right", "group": "antlers_lights", "from": [1.1, 11.1, -2.5], "to": [1.85, 13.0, -1.9], "color": "antlerBone", "col_idx": 6, "uv": [6, 0, 7, 1]}, {"name": "antler_top_fork_back_right", "group": "antlers_lights", "from": [1.4, 12.8, -1.95], "to": [2.1, 14.1, -1.25], "color": "antlerBone", "col_idx": 6, "uv": [6, 0, 7, 1]}, {"name": "antler_top_fork_out_right", "group": "antlers_lights", "from": [1.75, 12.6, -2.45], "to": [2.8, 13.6, -1.85], "color": "antlerBone", "col_idx": 6, "uv": [6, 0, 7, 1]}, {"name": "garland_wire_swag", "group": "antlers_lights", "from": [-1.25, 11.35, -2.25], "to": [1.25, 11.65, -2.05], "color": "lightEmerald", "col_idx": 10, "uv": [10, 0, 11, 1]}, {"name": "light_bulb_emerald_left", "group": "antlers_lights", "from": [-1.45, 11.45, -2.75], "to": [-1.0, 12.0, -2.35], "color": "lightEmerald", "col_idx": 10, "uv": [10, 0, 11, 1]}, {"name": "light_bulb_gold_center", "group": "antlers_lights", "from": [-0.25, 10.85, -2.35], "to": [0.25, 11.45, -1.95], "color": "bellGold", "col_idx": 9, "uv": [9, 0, 10, 1]}, {"name": "light_bulb_cyan_right", "group": "antlers_lights", "from": [1.0, 11.45, -2.75], "to": [1.45, 12.0, -2.35], "color": "lightCyan", "col_idx": 11, "uv": [11, 0, 12, 1]}, {"name": "light_bulb_ruby_top_left", "group": "antlers_lights", "from": [-2.4, 12.2, -2.65], "to": [-1.95, 12.75, -2.25], "color": "lightRuby", "col_idx": 12, "uv": [12, 0, 13, 1]}, {"name": "light_bulb_gold_top_right", "group": "antlers_lights", "from": [1.95, 12.2, -2.65], "to": [2.4, 12.75, -2.25], "color": "bellGold", "col_idx": 9, "uv": [9, 0, 10, 1]}];

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

Undo.finishEdit('Rudolph the Red-Nosed Reindeer (Epic 🦌) - Cream Bib Fluff, Branching Antlers with Fairy Lights, Shining Red Nose, Gold Sleigh Bells Collar, Zero Z-Fighting, 66 Cubes');
Canvas.updateAll();

const modelData = Format.codec.compile();
Blockbench.writeFile('C:/Users/MIXPC/.gemini/antigravity/scratch/crossy-road-pro/assets/models/reindeer_glow.bbmodel', { content: modelData });

return {
  success: true,
  cubesCount: Cube.all.length,
  groupsCount: Group.all.length,
  textureName: tex.name,
  savedPath: 'C:/Users/MIXPC/.gemini/antigravity/scratch/crossy-road-pro/assets/models/reindeer_glow.bbmodel'
};
