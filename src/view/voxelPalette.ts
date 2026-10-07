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
  ghostYellow: 0xfbbf24,

  // Backward compatibility & environment aliases
  corgiTan: 0xd97706,
  corgiWhite: 0xffffff,
  corgiNose: 0x1e293b,
  corgiTongue: 0xf472b6,
  corgiCollar: 0xb91c1c,
  corgiGold: 0xfacc15,
  pigeonDark: 0x1e293b,
  pigeonBeak: 0xf97316,
  pigeonTeal: 0x8b5cf6,
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
} as const;

export type VoxelColorKey = keyof typeof VOXEL_PALETTE;

export class VoxelPalette {
  private static readonly geoCache = new Map<string, THREE.BoxGeometry>();
  private static readonly matCache = new Map<number, THREE.MeshLambertMaterial>();
  private static readonly basicMatCache = new Map<string, THREE.MeshBasicMaterial>();
  private static ghostMaterial: THREE.MeshLambertMaterial | null = null;

  static getGhostMaterial(): THREE.MeshLambertMaterial {
    if (!VoxelPalette.ghostMaterial) {
      VoxelPalette.ghostMaterial = new THREE.MeshLambertMaterial({
        color: VOXEL_PALETTE.ghostYellow,
        transparent: true,
        opacity: 0.42,
      });
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
      VoxelPalette.basicMatCache.set(key, mat);
    }
    return mat;
  }

  static getBox(w: number, h: number, d: number): THREE.BoxGeometry {
    const key = `${w}_${h}_${d}`;
    let geo = VoxelPalette.geoCache.get(key);
    if (!geo) {
      geo = new THREE.BoxGeometry(w, h, d);
      VoxelPalette.geoCache.set(key, geo);
    }
    return geo;
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
