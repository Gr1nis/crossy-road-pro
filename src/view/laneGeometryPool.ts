import * as THREE from 'three';
import { LaneType, type LaneTypeValue } from '../core/types.ts';

/**
 * LaneGeometryPool — Pre-allocates and caches static lane geometries and materials.
 * Eliminates GPU VRAM memory leaks and GC spikes during lane generation & eviction.
 */
export class LaneGeometryPool {
  // Pre-allocated static geometries (7 fixed ground and road furniture meshes)
  public static readonly grassStripGeo = new THREE.BoxGeometry(80, 0.24, 1);
  public static readonly roadStripGeo = new THREE.BoxGeometry(80, 0.16, 1);
  public static readonly riverStripGeo = new THREE.BoxGeometry(80, 0.08, 1);
  public static readonly railStripGeo = new THREE.BoxGeometry(80, 0.2, 1);
  public static readonly railGeo = new THREE.BoxGeometry(80, 0.06, 0.08);
  public static readonly dividerGeo = new THREE.BoxGeometry(0.65, 0.02, 0.08);
  public static readonly riverRippleGeo = new THREE.BoxGeometry(1.1, 0.02, 0.12);

  // Cached materials for dividers, rails, and ripples
  public static readonly dividerMat = new THREE.MeshBasicMaterial({ color: 0xf8fafc });
  public static readonly railMatDefault = new THREE.MeshLambertMaterial({ color: 0xcbd5e1 });
  public static readonly railMatNeon = new THREE.MeshLambertMaterial({ color: 0x38bdf8 });
  public static readonly riverRippleMatDefault = new THREE.MeshBasicMaterial({
    color: 0xbae6fd,
    transparent: true,
    opacity: 0.55,
  });
  public static readonly riverRippleMatNeon = new THREE.MeshBasicMaterial({
    color: 0x22d3ee,
    transparent: true,
    opacity: 0.55,
  });

  // Cached strip materials map (stripColor -> material)
  private static readonly stripMaterials = new Map<number, THREE.MeshLambertMaterial>();

  // Protection sets for disposeHierarchy
  private static readonly sharedGeometries = new Set<THREE.BufferGeometry>([
    LaneGeometryPool.grassStripGeo,
    LaneGeometryPool.roadStripGeo,
    LaneGeometryPool.riverStripGeo,
    LaneGeometryPool.railStripGeo,
    LaneGeometryPool.railGeo,
    LaneGeometryPool.dividerGeo,
    LaneGeometryPool.riverRippleGeo,
  ]);

  private static readonly sharedMaterials = new Set<THREE.Material>([
    LaneGeometryPool.dividerMat,
    LaneGeometryPool.railMatDefault,
    LaneGeometryPool.railMatNeon,
    LaneGeometryPool.riverRippleMatDefault,
    LaneGeometryPool.riverRippleMatNeon,
  ]);

  public static getGroundGeometry(laneType: LaneTypeValue): THREE.BoxGeometry {
    switch (laneType) {
      case LaneType.ROAD:
        return LaneGeometryPool.roadStripGeo;
      case LaneType.RIVER:
        return LaneGeometryPool.riverStripGeo;
      case LaneType.RAILWAY:
        return LaneGeometryPool.railStripGeo;
      case LaneType.GRASS:
      default:
        return LaneGeometryPool.grassStripGeo;
    }
  }

  public static getStripMaterial(color: number): THREE.MeshLambertMaterial {
    let mat = LaneGeometryPool.stripMaterials.get(color);
    if (!mat) {
      mat = new THREE.MeshLambertMaterial({ color });
      LaneGeometryPool.stripMaterials.set(color, mat);
      LaneGeometryPool.sharedMaterials.add(mat);
    }
    return mat;
  }

  public static getRailMaterial(isNeon: boolean): THREE.MeshLambertMaterial {
    return isNeon ? LaneGeometryPool.railMatNeon : LaneGeometryPool.railMatDefault;
  }

  public static getRiverRippleMaterial(isNeon: boolean): THREE.MeshBasicMaterial {
    return isNeon ? LaneGeometryPool.riverRippleMatNeon : LaneGeometryPool.riverRippleMatDefault;
  }

  public static createLaneDivider(): THREE.Group {
    const group = new THREE.Group();
    for (let x = -8.5; x <= 8.5; x += 1.6) {
      const dash = new THREE.Mesh(LaneGeometryPool.dividerGeo, LaneGeometryPool.dividerMat);
      dash.position.set(x, 0.015, 0.5);
      group.add(dash);
    }
    return group;
  }

  public static isSharedGeometry(geometry: THREE.BufferGeometry | null | undefined): boolean {
    if (!geometry) return false;
    return LaneGeometryPool.sharedGeometries.has(geometry);
  }

  public static isSharedMaterial(material: THREE.Material | null | undefined): boolean {
    if (!material) return false;
    return LaneGeometryPool.sharedMaterials.has(material);
  }
}

// Pre-populate standard palette strip materials
const LANE_STRIP_COLORS: number[] = [
  0x4ade80, 0x22c55e, 0xf8fafc, 0xe2e8f0,
  0xfde68a, 0xfcd34d, 0x1e1b4b, 0x311042,
  0x334155, 0x57534e, 0x0f172a, 0x0284c7,
  0x0369a1, 0x0d9488, 0x4338ca, 0x475569,
  0x1e293b,
];
for (const col of LANE_STRIP_COLORS) {
  LaneGeometryPool.getStripMaterial(col);
}
