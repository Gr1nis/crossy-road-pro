import * as THREE from 'three';

export const VOXEL_PALETTE = {
  // 16 Standard Color Palette
  corgiOrange: 0xd97706,
  white: 0xffffff,
  capybaraBrown: 0x78350f,
  orangeFruit: 0xf97316,
  pigeonGrey: 0x64748b,
  purpleNeck: 0x8b5cf6,
  pizzaRed: 0xb91c1c,
  pizzaCheese: 0xfacc15,
  catOrange: 0xea580c,
  cardboard: 0xb45309,
  raccoonGrey: 0x475569,
  maskBlack: 0x0f172a,
  darkCharcoal: 0x1e293b,
  nosePink: 0xf472b6,
  greenLeaf: 0x16a34a,
  nvgGreen: 0x22c55e,
  ghostYellow: 0xfbbf24,
  burlapBag: 0xd4b285,
  bagRope: 0x854d0e,
  capybaraCaramel: 0x925227,
  capybaraMuzzle: 0x542d13,
  capybaraPaws: 0x2b170a,
  pigeonFootRed: 0xf43f5e,
  deliveryRed: 0xdc2626,
  catStripe: 0x9a3412,
  boxFlap: 0x92400e,

  // Backward compatibility & environment aliases
  corgiTan: 0xd97706,
  corgiWhite: 0xffffff,
  corgiNose: 0x1e293b,
  corgiTongue: 0xf472b6,
  corgiCollar: 0xb91c1c,
  corgiGold: 0xfacc15,
  pigeonDark: 0x1e293b,
  pigeonBeak: 0xf97316,
  pigeonTeal: 0x0d9488, // Emerald teal sheen for street pigeon neck
  pizzaCrust: 0xb45309,
  pizzaPepperoni: 0xb91c1c,
  boxTan: 0xb45309,
  boxTape: 0xf97316,
  catWhite: 0xffffff,
  catNose: 0xf472b6,
  catEye: 0xfacc15,
  raccoonDark: 0x0f172a,
  raccoonWhite: 0xffffff,
  sodaSilver: 0x64748b,
  capybaraDark: 0x1e293b,
  mandarinOrange: 0xf97316,
  mandarinLeaf: 0x16a34a,
  hydrantRed: 0xb91c1c,
  woodLight: 0xd97706,
  concreteGrey: 0x64748b,
  goldCoin: 0xfacc15,
  rubyRed: 0xb91c1c,

  // Expansion Pack: Urban Gang (Pug, Ferret, Rat, Duck, Pigeon King)
  capRed: 0xdc2626,
  eyeBlack: 0x09090b,
  ferretCream: 0xfef08a,
  ferretDark: 0x451a03,
  ferretSable: 0x78350f,
  fireRed: 0xef4444,
  goldButton: 0xfacc15,
  gripTape: 0x18181b,
  truckDark: 0x27272a,
  truckSilver: 0x94a3b8,
  bagelCrust: 0xd97706,
  bellyLight: 0x94a3b8,
  buckTooth: 0xffffff,
  cupDark: 0x1e293b,
  headbandMetal: 0x64748b,
  ratGrey: 0x475569,
  ratPink: 0xf472b6,
  retroOrange: 0xf97316,
  sesameSeed: 0xfef08a,
  sparkleWhite: 0xffffff,
  billDark: 0xc2410c,
  bootBlue: 0x2563eb,
  bootRim: 0x60a5fa,
  bootSole: 0x1d4ed8,
  coatAccent: 0xeab308,
  drawstringWhite: 0xf1f5f9,
  duckOrange: 0xf97316,
  featherWhite: 0xffffff,
  raincoatYellow: 0xfacc15,
  toggleDark: 0x1e293b,
  crownGold: 0xfacc15,
  ermineFur: 0xf8fafc,
  ermineSpot: 0x0f172a,
  eyePupil: 0x09090b,
  featherPureWhite: 0xffffff,
  mantleRed: 0x991b1b,
  royalRuby: 0xdc2626,

  // Christmas Wonders Pack (10 Holiday Characters)
  amberGold: 0xf59e0b, antlerBone: 0xe7e5e4, bellGold: 0xfacc15, bellyWhite: 0xf8fafc,
  beltBlack: 0x0f172a, bibCream: 0xfef3c7, blushPink: 0xfb7185, bootBlack: 0x1c1917,
  brightAmber: 0xfbbf24, bucketBlue: 0x1d4ed8, buckleGold: 0xfacc15, candyRed: 0xdc2626,
  carrotOrange: 0xf97316, carrotOrangeBright: 0xfb923c, carrotOrangeDark: 0xea580c,
  cheekPink: 0xfb7185, coalBlack: 0x18181b, cocoaBrown: 0x451a03, collarRed: 0xdc2626,
  coneWoodDark: 0x78350f, coneWoodWarm: 0x92400e, doughCrust: 0xb45309, doughWarm: 0xd97706,
  earPink: 0xf472b6, earPinkLight: 0xfbcfe8, elfBelt: 0x18181b, elfCheek: 0xfca5a5,
  elfEye: 0x0f172a, elfGold: 0xfacc15, elfGreen: 0x15803d, elfGreenDark: 0x166534,
  elfHair: 0xb45309, elfRed: 0xdc2626, elfSkin: 0xfed7aa, elfWhite: 0xffffff,
  foxEye: 0x1e293b, foxNose: 0x0f172a, foxSilver: 0xcbd5e1, foxSilverWhite: 0xf1f5f9,
  foxWhite: 0xffffff, furWhite: 0xffffff, furWhiteSoft: 0xf1f5f9, giftCyan: 0x0284c7,
  goldAccent: 0xfbbf24, graphiteBeak: 0x334155, gumdropGreen: 0x10b981, gumdropRuby: 0xef4444,
  gumdropYellow: 0xf59e0b, hareCream: 0xfef3c7, hareWhite: 0xf8fafc, hareWhiteSoft: 0xe2e8f0,
  hoofDark: 0x1c1917, huskyBlue: 0x38bdf8, huskyDark: 0x1e293b, huskyGray: 0x475569,
  huskyWhite: 0xf8fafc, icingWhite: 0xffffff, innerEarPink: 0xfbcfe8, leafGreen: 0x22c55e, leafGreenDark: 0x15803d,
  leafGreenBright: 0x4ade80, lightCyan: 0x38bdf8, lightEmerald: 0x10b981, lightRuby: 0xf43f5e,
  marshmallowCream: 0xfef08a, marshmallowWhite: 0xffffff, metalSilver: 0x94a3b8, mittenGreen: 0x15803d,
  muffEmerald: 0x059669, muffGold: 0xfacc15, mugRim: 0x14b8a6, mugTeal: 0x0d9488,
  noseBlack: 0x09090b, noseRubyGlow: 0xef4444, owlSnowPure: 0xffffff, owlSpeckleDark: 0x94a3b8,
  owlSpeckleLight: 0xcbd5e1, owlWhite: 0xf8fafc, peachSkin: 0xfed7aa, penguinBlack: 0x0f172a,
  penguinOrange: 0xf97316, penguinOrangeLight: 0xfb923c, penguinWhite: 0xf8fafc, pineGreen: 0x15803d,
  pureWhite: 0xffffff, reindeerCaramel: 0xb45309, reindeerDark: 0x78350f, rosyCheek: 0xf87171,
  sackDark: 0x14532d, sackEmerald: 0x166534, santaRed: 0xdc2626, santaRedDark: 0xb91c1c,
  scarfDarkRed: 0x991b1b, scarfGoldTassel: 0xfacc15, scarfRed: 0xdc2626, scarfWhite: 0xf8fafc,
  scarfWhiteStripe: 0xffffff, silverFrost: 0xe2e8f0, snowBody: 0xe2e8f0, snowWhite: 0xffffff,
  steamWhite: 0xe2e8f0, sweaterRed: 0xdc2626, sweaterWhite: 0xffffff, tonguePink: 0xf472b6,
  woodBrown: 0x78350f, gingerbreadBrown: 0xb45309, firGreen: 0x15803d, goldBell: 0xfacc15,
  boneIvory: 0xe7e5e4, foxEarmuffCyan: 0x059669, rubyGlow: 0xef4444,

} as const;

export type VoxelColorKey = keyof typeof VOXEL_PALETTE;

export class VoxelPalette {
  public static readonly geoCache = new Map<string, THREE.BoxGeometry>();
  public static readonly matCache = new Map<number, THREE.MeshLambertMaterial>();
  public static readonly basicMatCache = new Map<string, THREE.MeshBasicMaterial>();
  public static ghostMaterial: THREE.MeshLambertMaterial | null = null;

  static getGhostMaterial(): THREE.MeshLambertMaterial {
    if (!VoxelPalette.ghostMaterial) {
      VoxelPalette.ghostMaterial = new THREE.MeshLambertMaterial({
        color: VOXEL_PALETTE.ghostYellow,
        transparent: true,
        opacity: 0.42,
      });
      VoxelPalette.ghostMaterial.dispose = () => {};
    }
    return VoxelPalette.ghostMaterial;
  }

  static getMaterial(
    colorKey: VoxelColorKey | number,
    isGhost = false
  ): THREE.MeshLambertMaterial {
    if (isGhost) {
      return VoxelPalette.getGhostMaterial();
    }
    const hex = typeof colorKey === 'number' ? colorKey : VOXEL_PALETTE[colorKey];
    let mat = VoxelPalette.matCache.get(hex);
    if (!mat) {
      mat = new THREE.MeshLambertMaterial({ color: hex });
      mat.dispose = () => {};
      VoxelPalette.matCache.set(hex, mat);
    }
    return mat;
  }

  static getBasicMaterial(
    color: number,
    transparent = false,
    opacity = 1.0
  ): THREE.MeshBasicMaterial {
    const key = `${color}_${transparent ? 1 : 0}_${opacity}`;
    let mat = VoxelPalette.basicMatCache.get(key);
    if (!mat) {
      mat = new THREE.MeshBasicMaterial({ color, transparent, opacity });
      mat.dispose = () => {};
      VoxelPalette.basicMatCache.set(key, mat);
    }
    return mat;
  }

  static getBox(w: number, h: number, d: number): THREE.BoxGeometry {
    const key = `${w}_${h}_${d}`;
    let geo = VoxelPalette.geoCache.get(key);
    if (!geo) {
      geo = new THREE.BoxGeometry(w, h, d);
      geo.dispose = () => {};
      VoxelPalette.geoCache.set(key, geo);
    }
    return geo;
  }

  static isSharedGeometry(geometry: THREE.BufferGeometry | null | undefined): boolean {
    if (!geometry) return false;
    for (const cached of VoxelPalette.geoCache.values()) {
      if (cached === geometry) return true;
    }
    return false;
  }

  static isSharedMaterial(material: THREE.Material | null | undefined): boolean {
    if (!material) return false;
    if (material === VoxelPalette.ghostMaterial) return true;
    for (const cached of VoxelPalette.matCache.values()) {
      if (cached === material) return true;
    }
    for (const cached of VoxelPalette.basicMatCache.values()) {
      if (cached === material) return true;
    }
    return false;
  }
}

// Pre-populate standard geometries and materials to avoid runtime allocations
const voxelStandardSizes: [number, number, number][] = [
  [0.1, 0.1, 0.1],
  [0.14, 0.14, 0.14],
  [0.2, 0.2, 0.2],
  [0.3, 0.3, 0.3],
  [0.4, 0.4, 0.4],
  [0.5, 0.5, 0.5],
  [0.6, 0.6, 0.6],
  [0.1, 0.14, 0.12],
  [0.14, 0.04, 0.22],
];

for (const [w, h, d] of voxelStandardSizes) {
  VoxelPalette.getBox(w, h, d);
}

for (const key of Object.keys(VOXEL_PALETTE) as VoxelColorKey[]) {
  VoxelPalette.getMaterial(key, false);
}
VoxelPalette.getGhostMaterial();

export function createVoxelMaterial(
  colorKey: VoxelColorKey | number,
  isGhost = false
): THREE.MeshLambertMaterial {
  return VoxelPalette.getMaterial(colorKey, isGhost);
}

export function createVoxelBasicMaterial(
  color: number,
  transparent = false,
  opacity = 1.0
): THREE.MeshBasicMaterial {
  return VoxelPalette.getBasicMaterial(color, transparent, opacity);
}

export function createVoxelMesh(
  w: number,
  h: number,
  d: number,
  mat: THREE.Material,
  x = 0,
  y = 0,
  z = 0,
  castShadow = true,
  receiveShadow = true
): THREE.Mesh {
  const mesh = new THREE.Mesh(VoxelPalette.getBox(w, h, d), mat);
  mesh.position.set(x, y, z);
  mesh.castShadow = castShadow;
  mesh.receiveShadow = receiveShadow;
  return mesh;
}
