import * as THREE from 'three';
import { vehicleScreenRotationY } from '../core/collision.ts';
import type { LogPlatform, Vehicle } from '../core/types.ts';

const urbanGeoCache = new Map<string, THREE.BoxGeometry>();
const urbanMatCache = new Map<string, THREE.Material>();

function getUrbanGeo(w: number, h: number, d: number): THREE.BoxGeometry {
  const key = `${w}_${h}_${d}`;
  let geo = urbanGeoCache.get(key);
  if (!geo) {
    geo = new THREE.BoxGeometry(w, h, d);
    urbanGeoCache.set(key, geo);
  }
  return geo;
}

function getUrbanMat(
  color: number,
  basic = false,
  transparent = false,
  opacity = 1.0
): THREE.Material {
  const key = `${color}_${basic ? 1 : 0}_${transparent ? 1 : 0}_${opacity}`;
  let mat = urbanMatCache.get(key);
  if (!mat) {
    mat = basic
      ? new THREE.MeshBasicMaterial({ color, transparent, opacity })
      : new THREE.MeshLambertMaterial({ color, transparent, opacity });
    urbanMatCache.set(key, mat);
  }
  return mat;
}

type UrbanVoxelSpec = [
  number, // w
  number, // h
  number, // d
  number, // x
  number, // y
  number, // z
  number, // color
  boolean?, // basic material
  number?, // opacity
];

function buildUrbanVoxels(group: THREE.Group, specs: UrbanVoxelSpec[]): void {
  for (let i = 0; i < specs.length; i++) {
    const s = specs[i];
    const transparent = (s[8] ?? 1.0) < 1.0;
    const mesh = new THREE.Mesh(
      getUrbanGeo(s[0], s[1], s[2]),
      getUrbanMat(s[6], !!s[7], transparent, s[8] ?? 1.0)
    );
    mesh.position.set(s[3], s[4], s[5]);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
  }
}

function buildTaxi(color: number): UrbanVoxelSpec[] {
  const c = color;
  const glass = 0x1e293b;
  const wheel = 0x0f172a;
  const bumper = 0x94a3b8;
  const white = 0xffffff;
  const red = 0xef4444;
  return [
    // Wheels (4) - center Y = 0.13, touches ground Y = 0
    [0.26, 0.26, 0.12, 0.5, 0.13, 0.34, wheel],
    [0.26, 0.26, 0.12, 0.5, 0.13, -0.34, wheel],
    [0.26, 0.26, 0.12, -0.5, 0.13, 0.34, wheel],
    [0.26, 0.26, 0.12, -0.5, 0.13, -0.34, wheel],
    // Body & Cabin (5)
    [1.7, 0.22, 0.68, 0, 0.23, 0, c],
    [0.48, 0.18, 0.64, 0.54, 0.41, 0, c],
    [0.44, 0.18, 0.64, -0.56, 0.41, 0, c],
    [0.82, 0.24, 0.62, -0.05, 0.47, 0, glass],
    [0.74, 0.08, 0.6, -0.05, 0.63, 0, c],
    // Lights & Bumpers (6)
    [0.06, 0.1, 0.16, 0.85, 0.3, 0.22, white, true],
    [0.06, 0.1, 0.16, 0.85, 0.3, -0.22, white, true],
    [0.06, 0.1, 0.16, -0.85, 0.3, 0.22, red, true],
    [0.06, 0.1, 0.16, -0.85, 0.3, -0.22, red, true],
    [0.1, 0.12, 0.68, 0.85, 0.17, 0, bumper],
    [0.1, 0.12, 0.68, -0.85, 0.17, 0, bumper],
    // Taxi Checker Sign on roof (3)
    [0.28, 0.08, 0.22, -0.05, 0.71, 0, 0xfacc15, true],
    [0.12, 0.08, 0.09, -0.11, 0.75, 0.04, wheel],
    [0.12, 0.08, 0.09, 0.01, 0.75, -0.04, wheel],
  ];
}

function buildScooter(color: number): UrbanVoxelSpec[] {
  const frame = color;
  const wheel = 0x0f172a;
  const chrome = 0x94a3b8;
  const thermo = 0x10b981;
  const darkGreen = 0x059669;
  return [
    // Wheels (2) - center Y = 0.12, touches ground Y = 0
    [0.24, 0.24, 0.1, 0.44, 0.12, 0, wheel],
    [0.24, 0.24, 0.1, -0.4, 0.12, 0, wheel],
    // Frame & Controls (7)
    [0.54, 0.08, 0.3, 0.02, 0.14, 0, chrome],
    [0.36, 0.26, 0.26, -0.16, 0.28, 0, frame],
    [0.28, 0.08, 0.22, -0.16, 0.44, 0, 0x1e293b],
    [0.08, 0.42, 0.08, 0.34, 0.38, 0, chrome],
    [0.08, 0.06, 0.44, 0.34, 0.58, 0, chrome],
    [0.09, 0.08, 0.08, 0.34, 0.58, 0.21, wheel],
    [0.09, 0.08, 0.08, 0.34, 0.58, -0.21, wheel],
    // Lights (2)
    [0.08, 0.1, 0.14, 0.38, 0.46, 0, 0xfef08a, true],
    [0.06, 0.08, 0.1, -0.36, 0.32, 0, 0xef4444, true],
    // Courier Thermal Box (3)
    [0.38, 0.4, 0.38, -0.34, 0.54, 0, thermo],
    [0.4, 0.06, 0.4, -0.34, 0.77, 0, darkGreen],
    [0.39, 0.08, 0.39, -0.34, 0.58, 0, 0xffffff, true],
  ];
}

function buildBus(color: number): UrbanVoxelSpec[] {
  const c = color;
  const wheel = 0x0f172a;
  const bumper = 0x334155;
  const glass = 0x1e293b;
  const roof = 0xf8fafc;
  const ac = 0x94a3b8;
  return [
    // Wheels (6) - center Y = 0.14, touches ground Y = 0
    [0.3, 0.28, 0.12, 1.05, 0.14, 0.37, wheel],
    [0.3, 0.28, 0.12, 1.05, 0.14, -0.37, wheel],
    [0.3, 0.28, 0.12, -0.65, 0.14, 0.37, wheel],
    [0.3, 0.28, 0.12, -0.65, 0.14, -0.37, wheel],
    [0.3, 0.28, 0.12, -1.05, 0.14, 0.37, wheel],
    [0.3, 0.28, 0.12, -1.05, 0.14, -0.37, wheel],
    // Chassis & Bumpers (3)
    [3.2, 0.42, 0.74, 0, 0.36, 0, c],
    [0.08, 0.16, 0.74, 1.6, 0.22, 0, bumper],
    [0.08, 0.16, 0.74, -1.6, 0.22, 0, bumper],
    // Windows & Cabin core (5)
    [0.06, 0.32, 0.68, 1.58, 0.72, 0, glass],
    [0.06, 0.3, 0.68, -1.58, 0.72, 0, glass],
    [2.9, 0.28, 0.04, -0.05, 0.72, 0.36, glass],
    [2.9, 0.28, 0.04, -0.05, 0.72, -0.36, glass],
    [3.06, 0.32, 0.7, 0, 0.72, 0, c],
    // White roof & AC units (3)
    [3.2, 0.14, 0.74, 0, 0.94, 0, roof],
    [0.55, 0.1, 0.44, 0.4, 1.05, 0, ac],
    [0.55, 0.1, 0.44, -0.5, 1.05, 0, ac],
    // Lights & Route display (5)
    [0.04, 0.1, 0.16, 1.6, 0.36, 0.24, 0xfef08a, true],
    [0.04, 0.1, 0.16, 1.6, 0.36, -0.24, 0xfef08a, true],
    [0.04, 0.12, 0.12, -1.6, 0.36, 0.26, 0xef4444, true],
    [0.04, 0.12, 0.12, -1.6, 0.36, -0.26, 0xef4444, true],
    [0.04, 0.1, 0.44, 1.6, 0.93, 0, 0xf59e0b, true],
  ];
}

function buildSweeper(color: number): UrbanVoxelSpec[] {
  const orange = color;
  const white = 0xf8fafc;
  const wheel = 0x0f172a;
  const dark = 0x334155;
  const grey = 0x64748b;
  const glass = 0x1e293b;
  return [
    // Wheels (4) - center Y = 0.13, touches ground Y = 0
    [0.26, 0.26, 0.12, 0.58, 0.13, 0.35, wheel],
    [0.26, 0.26, 0.12, 0.58, 0.13, -0.35, wheel],
    [0.26, 0.26, 0.12, -0.55, 0.13, 0.35, wheel],
    [0.26, 0.26, 0.12, -0.55, 0.13, -0.35, wheel],
    // Cleaning brushes & vacuum (3)
    [0.32, 0.08, 0.32, 0.86, 0.06, 0.3, dark],
    [0.32, 0.08, 0.32, 0.86, 0.06, -0.3, dark],
    [0.4, 0.12, 0.5, 0.05, 0.08, 0, grey],
    // Body & Cabin (6)
    [1.8, 0.18, 0.7, 0, 0.23, 0, orange],
    [0.9, 0.54, 0.68, -0.4, 0.56, 0, orange],
    [0.65, 0.3, 0.68, 0.45, 0.44, 0, white],
    [0.6, 0.32, 0.64, 0.45, 0.72, 0, glass],
    [0.62, 0.08, 0.66, 0.45, 0.91, 0, white],
    [0.14, 0.14, 0.14, 0.45, 1.01, 0, 0xfacc15, true],
    // Details & Lights (7)
    [0.06, 0.1, 0.14, 0.8, 0.38, 0.22, 0xfef08a, true],
    [0.06, 0.1, 0.14, 0.8, 0.38, -0.22, 0xfef08a, true],
    [0.06, 0.1, 0.14, -0.86, 0.38, 0.24, 0xef4444, true],
    [0.06, 0.1, 0.14, -0.86, 0.38, -0.24, 0xef4444, true],
    [0.1, 0.12, 0.68, 0.8, 0.2, 0, grey],
    [0.86, 0.12, 0.7, -0.4, 0.44, 0, white],
    [0.26, 0.14, 0.26, -0.65, 0.88, 0, grey],
  ];
}

function buildTrain(): UrbanVoxelSpec[] {
  const silver = 0xd1d5db;
  const red = 0xef4444;
  const darkRoof = 0x334155;
  const glass = 0x1e293b;
  const undercarriage = 0x0f172a;
  const vent = 0x64748b;
  return [
    // Undercarriage / chassis touching rails Y = 0
    [13.6, 0.24, 0.8, 0, 0.12, 0, undercarriage],
    // Main silver body & red stripe & roof
    [13.2, 0.68, 0.84, 0, 0.56, 0, silver],
    [13.24, 0.14, 0.86, 0, 0.46, 0, red],
    [13.2, 0.12, 0.76, 0, 0.94, 0, darkRoof],
    // Streamlined aerodynamic front nose
    [0.6, 0.56, 0.82, 6.85, 0.48, 0, silver],
    [0.46, 0.28, 0.76, 6.78, 0.76, 0, glass],
    [0.3, 0.4, 0.72, 7.15, 0.39, 0, silver],
    // Streamlined aerodynamic rear nose
    [0.6, 0.56, 0.82, -6.85, 0.48, 0, silver],
    [0.46, 0.28, 0.76, -6.78, 0.76, 0, glass],
    [0.3, 0.4, 0.72, -7.15, 0.39, 0, silver],
    // Bright glowing spotlight in front + light beam
    [0.14, 0.2, 0.28, 7.32, 0.54, 0, 0xfef08a, true],
    [3.4, 0.12, 0.88, 8.8, 0.24, 0, 0xfef08a, true, 0.5],
    // Side window stripes
    [12.0, 0.22, 0.04, 0, 0.68, 0.43, glass],
    [12.0, 0.22, 0.04, 0, 0.68, -0.43, glass],
    // Roof vents
    [0.8, 0.08, 0.4, -3.5, 1.02, 0, vent],
    [0.8, 0.08, 0.4, 0, 1.02, 0, vent],
    [0.8, 0.08, 0.4, 3.5, 1.02, 0, vent],
  ];
}

export function createUrbanVehicle(
  vOrType: Vehicle | 'taxi' | 'scooter' | 'bus' | 'sweeper' | string,
  speed?: number,
  colorOverride?: number
): THREE.Group {
  const group = new THREE.Group();
  let specs: UrbanVoxelSpec[];
  let spd: number;

  if (typeof vOrType === 'object') {
    spd = vOrType.speed;
    const col = vOrType.color;
    if (vOrType.type === 'truck') {
      specs = Math.abs(vOrType.id) % 2 === 0 ? buildBus(col) : buildSweeper(col);
    } else {
      specs = Math.abs(vOrType.id) % 2 === 0 ? buildTaxi(col) : buildScooter(col);
    }
  } else {
    spd = speed ?? 1;
    switch (vOrType) {
      case 'taxi': specs = buildTaxi(colorOverride ?? 0xeab308); break;
      case 'scooter': specs = buildScooter(colorOverride ?? 0x3b82f6); break;
      case 'bus': specs = buildBus(colorOverride ?? 0x38bdf8); break;
      case 'sweeper': specs = buildSweeper(colorOverride ?? 0xf97316); break;
      case 'train': return createUrbanTrain(spd);
      default: specs = buildTaxi(colorOverride ?? 0xeab308); break;
    }
  }

  buildUrbanVoxels(group, specs);
  group.rotation.y = vehicleScreenRotationY(spd);
  return group;
}

export function createUrbanTrain(lengthOrSpeed: number = -1, speed?: number): THREE.Group {
  const group = new THREE.Group();
  buildUrbanVoxels(group, buildTrain());
  const actualSpeed = speed !== undefined ? speed : lengthOrSpeed;
  group.rotation.y = vehicleScreenRotationY(actualSpeed);
  return group;
}

export function createUrbanPallet(log: LogPlatform): THREE.Group {
  const group = new THREE.Group();
  const specs: UrbanVoxelSpec[] = [
    [log.length, 0.22, 0.74, 0, 0.02, 0, 0x854d0e],
    [log.length + 0.04, 0.14, 0.54, 0, 0.02, 0, 0xfde047],
    [0.36, 0.22, 0.68, -log.length * 0.38, -0.08, 0, 0x0284c7],
    [0.36, 0.22, 0.68, log.length * 0.38, -0.08, 0, 0x0284c7],
  ];

  const slotCount = Math.floor(log.length);
  for (let s = -Math.floor(slotCount / 2); s <= Math.floor(slotCount / 2); s++) {
    if (Math.abs(s) > 0.1 && Math.abs(s) < log.length / 2 - 0.2) {
      specs.push([0.06, 0.24, 0.75, s, 0.02, 0, 0x582a08]);
    }
  }

  buildUrbanVoxels(group, specs);
  return group;
}
