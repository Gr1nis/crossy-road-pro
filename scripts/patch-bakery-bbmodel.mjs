import fs from 'node:fs';

const bbmodelPath = 'assets/models/bakery_townhouse.bbmodel';
const model = JSON.parse(fs.readFileSync(bbmodelPath, 'utf8'));

console.log('Original element count:', model.elements.length);

const elMap = new Map(model.elements.map(e => [e.name, e]));
function getEl(name) {
  const el = elMap.get(name);
  if (!el) throw new Error(`Element ${name} not found`);
  return el;
}

// 1. Quoin merge: merge quoin_bl_1 and quoin_bl_2 into quoin_bl_all
// Anchor at y=1.35 into plinth (0..1.4) to eliminate coplanar y=1.4 with wall_brick
const qBl1 = getEl('quoin_bl_1');
const qBl2 = getEl('quoin_bl_2');
qBl1.name = 'quoin_bl_all';
qBl1.from = [9.5, 1.35, 6.6];
qBl1.to = [11.2, 26.6, 8.8];

const qBrAll = getEl('quoin_br_all');
qBrAll.from = [-11.2, 1.35, 6.6];
qBrAll.to = [-9.5, 26.6, 8.8];

// 2. Plinth & Doorstep & Showcase sills
const plinthFrontL = getEl('plinth_front_l');
const plinthFrontR = getEl('plinth_front_r');
const plinthDoorstep = getEl('plinth_doorstep');
const showcaseSillL = getEl('stone_showcase_l_sill');
const showcaseSillR = getEl('stone_showcase_r_sill');

plinthFrontL.from = [2.5, 0, -9.35];
plinthFrontL.to = [11.2, 1.4, -8.6];

plinthFrontR.from = [-11.2, 0, -9.35];
plinthFrontR.to = [-2.5, 1.4, -8.6];

plinthDoorstep.from = [-2.5, 0, -9.5];
plinthDoorstep.to = [2.5, 0.4, -8.6];

showcaseSillL.from = [3.3, 1.4, -9.45];
showcaseSillL.to = [8.3, 2.2, -8.6];

showcaseSillR.from = [-8.3, 1.4, -9.45];
showcaseSillR.to = [-3.3, 2.2, -8.6];

// Showcase glass vs keystone & shoulder
getEl('glow_yellow_showcase_l_glass').to[1] = 8.25;
getEl('glow_yellow_showcase_r_glass').to[1] = 8.25;
getEl('glow_yellow_showcase_l_glass').to[2] = -8.5;
getEl('glow_yellow_showcase_r_glass').to[2] = -8.5;
getEl('stone_showcase_l_arch_keystone').to[2] = -8.6;
getEl('stone_showcase_r_arch_keystone').to[2] = -8.6;

// 3. Cornices
getEl('cornice_mid_side_l').from[2] = -8.6;
getEl('cornice_mid_side_l').to[2] = 8.7;
getEl('cornice_mid_side_r').from[2] = -8.6;
getEl('cornice_mid_side_r').to[2] = 8.7;

getEl('cornice_top_side_l').from[2] = -8.6;
getEl('cornice_top_side_l').to[2] = 8.7;
getEl('cornice_top_side_r').from[2] = -8.6;
getEl('cornice_top_side_r').to[2] = 8.7;

// 4. Sign Cartouche, Snow Cap, Drips, and Clean High-Contrast Letters
const signCartouche = getEl('sign_wood_cartouche_main');
signCartouche.from = [-5.4, 9.3, -9.55];
signCartouche.to = [5.4, 11.9, -8.8];

const snowSignCap = getEl('snow_sign_cap_main');
snowSignCap.from = [-5.8, 11.9, -9.85];
snowSignCap.to = [5.8, 12.3, -9.3];

const dripL = getEl('snow_sign_drip_l');
dripL.from = [4.8, 11.3, -9.8];
dripL.to = [5.6, 11.95, -8.9];

const dripR = getEl('snow_sign_drip_r');
dripR.from = [-5.6, 11.3, -9.8];
dripR.to = [-4.8, 11.95, -8.9];

// Letter B: 3 cubes (merge mid into top/bot)
// B: x=[3.6, 4.8], y=[9.7, 11.5]
const bStem = getEl('letter_white_B_stem');
bStem.from = [4.5, 9.7, -9.9];
bStem.to = [4.8, 11.5, -9.55];

const bTop = getEl('letter_white_B_top');
bTop.from = [3.6, 10.7, -9.9];
bTop.to = [4.5, 11.5, -9.55];

const bBot = getEl('letter_white_B_bot');
bBot.from = [3.6, 9.7, -9.9];
bBot.to = [4.5, 10.5, -9.55];

// Letter A: x=[1.8, 3.1]
const aL = getEl('letter_white_A_l');
aL.from = [2.7, 9.7, -9.9];
aL.to = [3.1, 11.1, -9.55];

const aR = getEl('letter_white_A_r');
aR.from = [1.8, 9.7, -9.9];
aR.to = [2.2, 11.1, -9.55];

const aTop = getEl('letter_white_A_top');
aTop.from = [1.8, 11.1, -9.9];
aTop.to = [3.1, 11.5, -9.55];

const aBar = getEl('letter_white_A_bar');
aBar.from = [2.2, 10.3, -9.9];
aBar.to = [2.7, 10.7, -9.55];

// Letter K: x=[0.1, 1.4]
const kStem = getEl('letter_white_K_stem');
kStem.from = [1.0, 9.7, -9.9];
kStem.to = [1.4, 11.5, -9.55];

const kJunc = getEl('letter_white_K_junc');
kJunc.from = [0.6, 10.3, -9.9];
kJunc.to = [1.0, 10.9, -9.55];

const kArm = getEl('letter_white_K_arm');
kArm.from = [0.1, 10.9, -9.9];
kArm.to = [0.6, 11.5, -9.55];

const kLeg = getEl('letter_white_K_leg');
kLeg.from = [0.1, 9.7, -9.9];
kLeg.to = [0.6, 10.3, -9.55];

// Letter E: x=[-1.5, -0.3]
const eStem = getEl('letter_white_E_stem');
eStem.from = [-0.7, 9.7, -9.9];
eStem.to = [-0.3, 11.5, -9.55];

const eTop = getEl('letter_white_E_top');
eTop.from = [-1.5, 11.1, -9.9];
eTop.to = [-0.7, 11.5, -9.55];

const eMid = getEl('letter_white_E_mid');
eMid.from = [-1.3, 10.4, -9.9];
eMid.to = [-0.7, 10.8, -9.55];

const eBot = getEl('letter_white_E_bot');
eBot.from = [-1.5, 9.7, -9.9];
eBot.to = [-0.7, 10.1, -9.55];

// Letter R: 3 cubes (merge top & mid into loop)
// x=[-3.2, -2.0]
const rStem = getEl('letter_white_R_stem');
rStem.from = [-2.4, 9.7, -9.9];
rStem.to = [-2.0, 11.5, -9.55];

const rTop = getEl('letter_white_R_top');
rTop.name = 'letter_white_R_loop';
rTop.from = [-3.2, 10.5, -9.9];
rTop.to = [-2.4, 11.5, -9.55];

const rLeg = getEl('letter_white_R_leg');
rLeg.from = [-3.1, 9.7, -9.9];
rLeg.to = [-2.6, 10.5, -9.55];

// Letter Y: x=[-4.8, -3.6]
const yStem = getEl('letter_white_Y_stem');
yStem.from = [-4.4, 9.7, -9.9];
yStem.to = [-4.0, 10.5, -9.55];

const yL = getEl('letter_white_Y_l');
yL.from = [-4.0, 10.5, -9.9];
yL.to = [-3.6, 11.5, -9.55];

const yR = getEl('letter_white_Y_r');
yR.from = [-4.8, 10.5, -9.9];
yR.to = [-4.4, 11.5, -9.55];

// 5. Garlands & Doorway Loop
const gDip = getEl('garland_pine_lf_c_dip');
gDip.from = [-2.2, 7.5, -9.75];
gDip.to = [2.2, 8.2, -9.4];

const gShL = getEl('garland_pine_lf_c_sh_l');
gShL.from = [2.2, 8.2, -9.75];
gShL.to = [3.8, 9.2, -9.4];

const gShR = getEl('garland_pine_lf_c_sh_r');
gShR.from = [-3.8, 8.2, -9.75];
gShR.to = [-2.2, 9.2, -9.4];

getEl('garland_pine_lf_l').from[2] = -9.65;
getEl('garland_pine_lf_r').from[2] = -9.65;

getEl('garland_pine_uf_corner_l').from[0] = 9.45;
getEl('garland_pine_uf_corner_r').to[0] = -9.45;

getEl('bauble_cyan_uf_l').from[1] = 23.85;
getEl('bauble_cyan_uf_l').to[1] = 24.45;
const bCyan = getEl('bauble_cyan_uf_l');
for (const dir of Object.keys(bCyan.faces)) {
  bCyan.faces[dir].uv = [194, 2, 206, 14]; // swatch 12: bauble_gold
}

getEl('bauble_gold_uf_c').from[1] = 23.85;
getEl('bauble_gold_uf_c').to[1] = 24.45;
getEl('bauble_red_uf_r').from[1] = 23.85;
getEl('bauble_red_uf_r').to[1] = 24.45;

// 6. Windows on Floor 2 and 3: sills, mullions, and glass
for (let f = 2; f <= 3; f++) {
  for (let w = 0; w <= 2; w++) {
    const glass = getEl(`glow_yellow_floor${f}_win_${w}_glass`);
    const mullion = getEl(`wood_floor${f}_win_${w}_mullion`);
    const arch = getEl(`stone_floor${f}_win_${w}_arch_crown`);
    const sillCap = getEl(`snow_floor${f}_win_${w}_sill_cap`);

    // Glass stops at crown bottom:
    const crownBottom = f === 2 ? 17.6 : 24.0;
    glass.to[1] = crownBottom;
    glass.to[2] = -8.6;
    arch.to[2] = -8.6;

    // Prominent snow cushions on sills (butt-joint with jambs at 14.5 and 20.9)
    sillCap.from[2] = -9.55;
    if (f === 3) {
      sillCap.to[1] = 20.9;
    }

    // Mullions stand proud on front of glass without sharing back plane
    mullion.from[2] = -9.08;
    mullion.to[2] = -8.93;
  }
}

// 7. Roof Bed: fills crenels on all 4 sides with a snow ledge (y=27.5..28.5)
const roofBed = getEl('snow_roof_bed_main');
roofBed.from = [-10.85, 27.5, -8.65];
roofBed.to = [10.85, 28.5, 8.65];

// 8. Squat, Sturdy Parapet Merlons
// Standard merlon brick height: 27.6..29.2 (height 1.6)
// Snow cap height: 29.2..30.2 (height 1.0)
const merlonBrickNames = [
  'merlon_brick_front_0', 'merlon_brick_front_1', 'merlon_brick_front_2', 'merlon_brick_front_3',
  'merlon_brick_back_0', 'merlon_brick_back_1',
  'merlon_brick_side_l_0', 'merlon_brick_side_r_0'
];
for (const mName of merlonBrickNames) {
  const m = getEl(mName);
  m.from[1] = 27.6;
  m.to[1] = 29.2;
}

const snowCapNames = [
  'snow_cap_front_0', 'snow_cap_front_1', 'snow_cap_front_2', 'snow_cap_front_3',
  'snow_cap_back_0', 'snow_cap_back_1',
  'snow_cap_side_l_0', 'snow_cap_side_r_0'
];
for (const sName of snowCapNames) {
  const s = getEl(sName);
  s.from[1] = 29.2;
  s.to[1] = 30.2;
}

// 9. Compact, Right-Wall Integrated Chimney & 3-Step Rising Voxel Smoke
const chimneyShaft = getEl('chimney_brick_shaft');
chimneyShaft.from = [-9.8, 27.6, 4.2];
chimneyShaft.to = [-6.8, 31.8, 7.2];

const chimneyCap = getEl('snow_chimney_cap');
chimneyCap.from = [-10.2, 31.8, 3.8];
chimneyCap.to = [-6.4, 32.8, 7.6];

const chimneyPot = getEl('chimney_pot_dark');
chimneyPot.from = [-8.8, 32.8, 5.2];
chimneyPot.to = [-7.8, 33.6, 6.2];

const smoke1 = getEl('snow_smoke_puff_1');
smoke1.from = [-8.8, 33.8, 5.2];
smoke1.to = [-7.8, 34.8, 6.2];

const smoke2 = getEl('snow_smoke_puff_2');
smoke2.from = [-9.6, 35.0, 4.8];
smoke2.to = [-8.2, 36.4, 6.2];

// 10. Helper to create cube with texture 0
function createCube({ name, from, to, swatchId }) {
  const swatchUVs = {
    0: [0, 0, 16, 16],   // snow_white
    4: [64, 0, 80, 16]  // brick_red
  };
  const uv = swatchUVs[swatchId] || [0, 0, 16, 16];
  const faces = {};
  for (const dir of ['north', 'south', 'east', 'west', 'up', 'down']) {
    faces[dir] = {
      uv: [uv[0] + 2, uv[1] + 2, uv[2] - 2, uv[3] - 2],
      rotation: 0,
      texture: 0
    };
  }
  return {
    uuid: `cube-${name}-${Math.random().toString(36).slice(2, 10)}`,
    name,
    type: 'cube',
    from,
    to,
    origin: from,
    rotation: [0, 0, 0],
    inflate: 0,
    box_uv: false,
    uv_offset: [0, 0],
    autouv: 1,
    faces
  };
}

const newCubes = [
  // Left side wall tooth 3
  createCube({
    name: 'merlon_brick_side_l_1',
    from: [9.8, 27.6, 1.4],
    to: [11, 29.2, 4.6],
    swatchId: 4
  }),
  createCube({
    name: 'snow_cap_side_l_1',
    from: [9.6, 29.2, 1.2],
    to: [11.2, 30.2, 4.8],
    swatchId: 0
  }),

  // Right side wall tooth 3
  createCube({
    name: 'merlon_brick_side_r_1',
    from: [-11, 27.6, 1.4],
    to: [-9.8, 29.2, 4.6],
    swatchId: 4
  }),
  createCube({
    name: 'snow_cap_side_r_1',
    from: [-11.2, 29.2, 1.2],
    to: [-9.6, 30.2, 4.8],
    swatchId: 0
  }),

  // Back-right corner tooth
  createCube({
    name: 'merlon_brick_back_corner_r',
    from: [-11, 27.6, 8],
    to: [-7, 29.2, 9.2],
    swatchId: 4
  }),
  createCube({
    name: 'snow_cap_back_corner_r',
    from: [-11.2, 29.2, 7.8],
    to: [-6.8, 30.2, 9.4],
    swatchId: 0
  }),

  // 3rd stepped smoke puff
  createCube({
    name: 'snow_smoke_puff_3',
    from: [-10.4, 36.6, 4.4],
    to: [-8.6, 38.4, 6.2],
    swatchId: 0
  })
];

// Elements to remove (7 elements to keep exact 180 count):
const toRemoveNames = new Set([
  'quoin_bl_2',
  'letter_white_R_mid',
  'letter_white_B_mid',
  'bauble_red_lsl_f',
  'bauble_gold_lsl_b',
  'bauble_pink_usl_f',
  'bauble_gold_usl_b'
]);

const removeUuids = new Set();
for (const el of model.elements) {
  if (toRemoveNames.has(el.name)) {
    removeUuids.add(el.uuid);
  }
}

model.elements = model.elements.filter(el => !removeUuids.has(el.uuid));

for (const g of model.outliner) {
  if (g.children) {
    g.children = g.children.filter(id => !removeUuids.has(id));
  }
}

// Add the 6 merlon cubes to Group 9 (Roof)
for (let i = 0; i < 6; i++) {
  model.elements.push(newCubes[i]);
  model.outliner[9].children.push(newCubes[i].uuid);
}

// Add smoke_puff_3 to Group 10 (Chimney)
model.elements.push(newCubes[6]);
model.outliner[10].children.push(newCubes[6].uuid);

console.log('Final element count:', model.elements.length);

fs.writeFileSync(bbmodelPath, JSON.stringify(model, null, 2), 'utf8');
console.log('Successfully patched', bbmodelPath);
