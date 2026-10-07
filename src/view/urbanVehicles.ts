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

function buildTaxi(color: number = 0xfacc15): UrbanVoxelSpec[] {
  const taxiYellow = 0xfacc15;
  const c = color === 0xeab308 || color === 0xfacc15 || !color ? taxiYellow : color;
  const black = 0x0f172a;
  const wheel = 0x111827;
  const rim = 0x94a3b8;
  const chrome = 0xe2e8f0;
  const bumper = 0x334155;
  const white = 0xffffff;
  const red = 0xef4444;
  const headlight = 0xfef08a;
  const plateBlue = 0x1d4ed8;
  const glass = 0x1e293b;
  const driverSkin = 0xfdba74;
  const driverShirt = 0x2563eb;

  return [
    // 4 Wheels with grey hubcaps (center Y = 0.12, touches ground Y = 0)
    [0.24, 0.24, 0.12, 0.48, 0.12, 0.33, wheel],
    [0.24, 0.24, 0.12, 0.48, 0.12, -0.33, wheel],
    [0.24, 0.24, 0.12, -0.48, 0.12, 0.33, wheel],
    [0.24, 0.24, 0.12, -0.48, 0.12, -0.33, wheel],
    [0.12, 0.12, 0.02, 0.48, 0.12, 0.395, rim],
    [0.12, 0.12, 0.02, 0.48, 0.12, -0.395, rim],
    [0.12, 0.12, 0.02, -0.48, 0.12, 0.395, rim],
    [0.12, 0.12, 0.02, -0.48, 0.12, -0.395, rim],

    // Chassis & Main Yellow Sedan Body
    [1.32, 0.08, 0.60, 0, 0.08, 0, bumper],
    [1.44, 0.14, 0.66, 0, 0.19, 0, c],
    [0.44, 0.12, 0.64, 0.48, 0.32, 0, c],
    [0.36, 0.12, 0.64, -0.52, 0.32, 0, c],

    // Side Black Decal Stripe with Checkerboard accents
    [1.36, 0.06, 0.67, 0, 0.27, 0, black],
    [0.08, 0.06, 0.675, 0.22, 0.27, 0, white, true],
    [0.08, 0.06, 0.675, 0.06, 0.27, 0, white, true],
    [0.08, 0.06, 0.675, -0.10, 0.27, 0, white, true],
    [0.08, 0.06, 0.675, -0.26, 0.27, 0, white, true],

    // Front: Bumpers, Chrome Grille, Headlights & Blue "CITY" Plate
    [0.08, 0.12, 0.66, 0.73, 0.18, 0, bumper],
    [0.04, 0.10, 0.26, 0.74, 0.28, 0, chrome],
    [0.05, 0.10, 0.14, 0.73, 0.29, 0.22, headlight, true],
    [0.05, 0.10, 0.14, 0.73, 0.29, -0.22, headlight, true],
    [0.04, 0.08, 0.18, 0.74, 0.16, 0, plateBlue, true],

    // Rear: Bumper, Taillights & Plate
    [0.08, 0.12, 0.66, -0.73, 0.18, 0, bumper],
    [0.05, 0.10, 0.12, -0.73, 0.29, 0.22, red, true],
    [0.05, 0.10, 0.12, -0.73, 0.29, -0.22, red, true],
    [0.04, 0.08, 0.16, -0.74, 0.16, 0, white, true],

    // Cabin Driver Silhouette (shirt, skin, cap, wheel)
    [0.16, 0.16, 0.16, 0.06, 0.43, 0.12, driverShirt],
    [0.12, 0.12, 0.12, 0.06, 0.55, 0.12, driverSkin],
    [0.14, 0.05, 0.14, 0.06, 0.61, 0.12, black],
    [0.04, 0.08, 0.10, 0.18, 0.45, 0.12, black],

    // Cabin Pillars & Tinted Windows
    [0.06, 0.22, 0.06, 0.25, 0.48, 0.27, c],
    [0.06, 0.22, 0.06, 0.25, 0.48, -0.27, c],
    [0.06, 0.22, 0.06, -0.33, 0.48, 0.27, c],
    [0.06, 0.22, 0.06, -0.33, 0.48, -0.27, c],
    [0.04, 0.20, 0.52, 0.26, 0.48, 0, glass, false, 0.68],
    [0.04, 0.18, 0.52, -0.34, 0.48, 0, glass, false, 0.68],
    [0.56, 0.18, 0.03, -0.04, 0.48, 0.28, glass, false, 0.68],
    [0.56, 0.18, 0.03, -0.04, 0.48, -0.28, glass, false, 0.68],

    // Yellow Roof & Side Mirrors
    [0.64, 0.07, 0.58, -0.04, 0.61, 0, c],
    [0.06, 0.06, 0.05, 0.22, 0.43, 0.34, c],
    [0.06, 0.06, 0.05, 0.22, 0.43, -0.34, c],

    // Roof TAXI Checker Sign (Base, illuminated white box, checkers, amber beacon)
    [0.30, 0.03, 0.18, -0.04, 0.66, 0, black],
    [0.26, 0.10, 0.15, -0.04, 0.72, 0, white, true],
    [0.06, 0.06, 0.155, -0.09, 0.72, 0, black],
    [0.06, 0.06, 0.155, 0.02, 0.72, 0, black],
    [0.10, 0.03, 0.10, -0.04, 0.78, 0, 0xf59e0b, true],
  ];
}

function buildScooter(color: number = 0x84cc16): UrbanVoxelSpec[] {
  const limeGreen = 0x84cc16;
  const darkGreen = 0x4d7c0f;
  const frame = color === 0x3b82f6 || !color ? limeGreen : color;
  const wheel = 0x0f172a;
  const rim = 0x94a3b8;
  const chrome = 0xcbd5e1;
  const seatDark = 0x1e293b;
  const headlight = 0xfef08a;
  const taillight = 0xef4444;
  const jeanBlue = 0x2563eb;
  const jacketOrange = 0xf97316;
  const skin = 0xfdba74;
  const bagGreen = 0x22c55e;
  const bagDark = 0x15803d;
  const white = 0xffffff;

  return [
    // 2 Wheels with silver hubcaps (center Y = 0.12, touches ground Y = 0)
    [0.24, 0.24, 0.10, 0.42, 0.12, 0, wheel],
    [0.10, 0.10, 0.11, 0.42, 0.12, 0, rim],
    [0.24, 0.24, 0.10, -0.36, 0.12, 0, wheel],
    [0.10, 0.10, 0.11, -0.36, 0.12, 0, rim],

    // Chassis, Front Mudguard, Apron & Rear Fairing
    [0.42, 0.06, 0.26, 0.03, 0.12, 0, seatDark],
    [0.18, 0.18, 0.16, 0.40, 0.21, 0, frame],
    [0.12, 0.32, 0.30, 0.31, 0.36, 0, frame],
    [0.38, 0.20, 0.24, -0.19, 0.22, 0, frame],
    [0.24, 0.12, 0.16, -0.34, 0.24, 0, frame],
    [0.30, 0.08, 0.22, -0.15, 0.35, 0, wheel],

    // Front Glowing Headlight & Rear Taillight
    [0.06, 0.12, 0.12, 0.37, 0.42, 0, headlight, true],
    [0.05, 0.08, 0.12, -0.44, 0.24, 0, taillight, true],

    // Chrome Steering Column, Handlebars, Grips & Mirrors
    [0.08, 0.22, 0.08, 0.28, 0.50, 0, chrome],
    [0.08, 0.06, 0.42, 0.27, 0.60, 0, chrome],
    [0.08, 0.07, 0.08, 0.27, 0.60, 0.19, wheel],
    [0.08, 0.07, 0.08, 0.27, 0.60, -0.19, wheel],
    [0.04, 0.08, 0.04, 0.27, 0.66, 0.20, chrome],
    [0.04, 0.08, 0.04, 0.27, 0.66, -0.20, chrome],
    [0.04, 0.06, 0.06, 0.28, 0.71, 0.20, wheel],
    [0.04, 0.06, 0.06, 0.28, 0.71, -0.20, wheel],

    // Courier Legs (Blue Jeans) & Shoes on Footboard
    [0.18, 0.18, 0.09, 0.06, 0.24, 0.13, jeanBlue],
    [0.18, 0.18, 0.09, 0.06, 0.24, -0.13, jeanBlue],
    [0.14, 0.06, 0.08, 0.14, 0.15, 0.13, wheel],
    [0.14, 0.06, 0.08, 0.14, 0.15, -0.13, wheel],

    // Courier Torso (Orange Jacket) & Arms Holding Handlebars
    [0.22, 0.24, 0.24, -0.06, 0.47, 0, jacketOrange],
    [0.03, 0.16, 0.06, 0.05, 0.48, 0, white],
    [0.22, 0.08, 0.08, 0.10, 0.52, 0.15, jacketOrange],
    [0.22, 0.08, 0.08, 0.10, 0.52, -0.15, jacketOrange],
    [0.07, 0.07, 0.07, 0.25, 0.58, 0.17, skin],
    [0.07, 0.07, 0.07, 0.25, 0.58, -0.17, skin],

    // Courier Head & Lime Green Helmet with Visor
    [0.14, 0.12, 0.16, -0.03, 0.63, 0, skin],
    [0.20, 0.16, 0.22, -0.05, 0.72, 0, frame],
    [0.10, 0.04, 0.20, 0.06, 0.69, 0, darkGreen],
    [0.03, 0.05, 0.18, -0.02, 0.58, 0, wheel],

    // Isothermal Delivery Backpack (Green Box, "FOOD HOT" Red Emblem)
    [0.22, 0.06, 0.22, -0.32, 0.38, 0, seatDark],
    [0.34, 0.36, 0.36, -0.32, 0.58, 0, bagGreen],
    [0.36, 0.06, 0.38, -0.32, 0.76, 0, bagDark],
    [0.35, 0.04, 0.37, -0.32, 0.48, 0, white, true],
    [0.03, 0.20, 0.22, -0.49, 0.60, 0, taillight, true],
    [0.04, 0.06, 0.14, -0.49, 0.64, 0, white, true],
    [0.04, 0.05, 0.10, -0.49, 0.56, 0, headlight, true],
    [0.04, 0.24, 0.26, -0.16, 0.49, 0, bagDark],
  ];
}


function buildBus(_color: number): UrbanVoxelSpec[] {
  const transitGreen = 0x16a34a;
  const lowerOrange = 0xea580c;
  const beltGrey = 0x334155;
  const bumperGrey = 0x475569;
  const glass = 0x1e293b;
  const roof = 0xf8fafc;
  const acBody = 0x94a3b8;
  const acVent = 0x475569;
  const wheel = 0x0f172a;
  const rim = 0x94a3b8;
  const amberDisplay = 0xf59e0b;
  const headlight = 0xfef08a;
  const taillight = 0xef4444;
  const signWhite = 0xffffff;

  return [
    // 6 Wheels with hubcap rims (center Y = 0.14, touches ground Y = 0)
    [0.30, 0.28, 0.12, 1.05, 0.14, 0.37, wheel],
    [0.30, 0.28, 0.12, 1.05, 0.14, -0.37, wheel],
    [0.14, 0.14, 0.02, 1.05, 0.14, 0.435, rim],
    [0.14, 0.14, 0.02, 1.05, 0.14, -0.435, rim],
    [0.30, 0.28, 0.12, -0.60, 0.14, 0.37, wheel],
    [0.30, 0.28, 0.12, -0.60, 0.14, -0.37, wheel],
    [0.14, 0.14, 0.02, -0.60, 0.14, 0.435, rim],
    [0.14, 0.14, 0.02, -0.60, 0.14, -0.435, rim],
    [0.30, 0.28, 0.12, -1.05, 0.14, 0.37, wheel],
    [0.30, 0.28, 0.12, -1.05, 0.14, -0.37, wheel],
    [0.14, 0.14, 0.02, -1.05, 0.14, 0.435, rim],
    [0.14, 0.14, 0.02, -1.05, 0.14, -0.435, rim],

    // Chassis & Bumpers
    [3.00, 0.12, 0.68, 0, 0.12, 0, beltGrey],
    [0.10, 0.16, 0.74, 1.60, 0.20, 0, bumperGrey],
    [0.10, 0.16, 0.74, -1.60, 0.20, 0, bumperGrey],
    [0.02, 0.08, 0.24, 1.65, 0.18, 0, signWhite, true],

    // Lower Body (Orange) & Grey Dividing Stripe
    [3.18, 0.24, 0.72, 0, 0.32, 0, lowerOrange],
    [3.20, 0.06, 0.73, 0, 0.46, 0, beltGrey],

    // Upper Cabin Structure & Pillars (Transit Green)
    [3.16, 0.42, 0.70, 0, 0.70, 0, transitGreen],
    [0.08, 0.32, 0.06, 1.57, 0.68, 0.33, transitGreen],
    [0.08, 0.32, 0.06, 1.57, 0.68, -0.33, transitGreen],
    [0.06, 0.28, 0.06, 0.55, 0.70, 0.36, transitGreen],
    [0.06, 0.28, 0.06, 0.55, 0.70, -0.36, transitGreen],
    [0.06, 0.28, 0.06, -0.05, 0.70, 0.36, transitGreen],
    [0.06, 0.28, 0.06, -0.05, 0.70, -0.36, transitGreen],
    [0.06, 0.28, 0.06, -0.65, 0.70, 0.36, transitGreen],
    [0.06, 0.28, 0.06, -0.65, 0.70, -0.36, transitGreen],

    // Panoramic Tinted Windows (Front, Rear & Sides)
    [0.06, 0.32, 0.66, 1.57, 0.68, 0, glass],
    [0.06, 0.28, 0.64, -1.58, 0.70, 0, glass],
    [2.84, 0.28, 0.04, -0.05, 0.70, 0.36, glass],
    [2.84, 0.28, 0.04, -0.05, 0.70, -0.36, glass],
    // Passenger Door Panels (curbside)
    [0.26, 0.48, 0.03, 0.80, 0.48, 0.36, glass],
    [0.26, 0.48, 0.03, -0.32, 0.48, 0.36, glass],

    // Electronic Route Display (ROUTE 42 above windshield)
    [0.06, 0.12, 0.52, 1.59, 0.88, 0, 0x0f172a],
    [0.02, 0.08, 0.46, 1.62, 0.88, 0, amberDisplay, true],

    // Side "CITY TRANSIT" Branding Banner
    [1.80, 0.08, 0.03, 0.05, 0.87, 0.365, signWhite, true],
    [1.80, 0.08, 0.03, 0.05, 0.87, -0.365, signWhite, true],

    // White Roof & Dual Relief Climate Control (AC) Units
    [3.18, 0.08, 0.72, 0, 0.94, 0, roof],
    [0.60, 0.10, 0.44, 0.45, 1.02, 0, acBody],
    [0.44, 0.04, 0.32, 0.45, 1.08, 0, acVent],
    [0.60, 0.10, 0.44, -0.55, 1.02, 0, acBody],
    [0.44, 0.04, 0.32, -0.55, 1.08, 0, acVent],

    // Headlights, Indicators, Taillights & Side Mirrors
    [0.04, 0.10, 0.14, 1.60, 0.36, 0.24, headlight, true],
    [0.04, 0.10, 0.14, 1.60, 0.36, -0.24, headlight, true],
    [0.04, 0.06, 0.08, 1.60, 0.36, 0.32, amberDisplay, true],
    [0.04, 0.06, 0.08, 1.60, 0.36, -0.32, amberDisplay, true],
    [0.04, 0.12, 0.12, -1.60, 0.38, 0.25, taillight, true],
    [0.04, 0.12, 0.12, -1.60, 0.38, -0.25, taillight, true],
    [0.08, 0.04, 0.10, 1.48, 0.68, 0.42, 0x0f172a],
    [0.08, 0.04, 0.10, 1.48, 0.68, -0.42, 0x0f172a],
    [0.08, 0.14, 0.06, 1.50, 0.68, 0.46, 0x0f172a],
    [0.08, 0.14, 0.06, 1.50, 0.68, -0.46, 0x0f172a],
  ];
}

function buildSweeper(color: number): UrbanVoxelSpec[] {
  const cabOrange = color || 0xf97316;
  const hopperGrey = 0x64748b;
  const hopperDark = 0x475569;
  const hazardYellow = 0xfacc15;
  const hazardDark = 0x1e293b;
  const glass = 0x1e293b;
  const wheel = 0x0f172a;
  const rim = 0x94a3b8;
  const frameDark = 0x334155;
  const brushCore = 0x18181b;
  const brushBristle = 0x27272a;
  const beacon = 0xfbbf24;
  const headlight = 0xfef08a;
  const taillight = 0xef4444;
  const labelWhite = 0xe2e8f0;

  return [
    // 4 Heavy Wheels with rims (center Y = 0.13, touches ground Y = 0)
    [0.26, 0.26, 0.12, 0.48, 0.13, 0.35, wheel],
    [0.26, 0.26, 0.12, 0.48, 0.13, -0.35, wheel],
    [0.12, 0.12, 0.02, 0.48, 0.13, 0.415, rim],
    [0.12, 0.12, 0.02, 0.48, 0.13, -0.415, rim],
    [0.26, 0.26, 0.12, -0.62, 0.13, 0.35, wheel],
    [0.26, 0.26, 0.12, -0.62, 0.13, -0.35, wheel],
    [0.12, 0.12, 0.02, -0.62, 0.13, 0.415, rim],
    [0.12, 0.12, 0.02, -0.62, 0.13, -0.415, rim],

    // Chassis, Bumpers & Central Vacuum Suction Nozzle
    [2.00, 0.14, 0.66, -0.06, 0.16, 0, frameDark],
    [0.10, 0.16, 0.72, 0.74, 0.20, 0, hopperDark],
    [0.10, 0.16, 0.72, -1.02, 0.20, 0, hopperDark],
    [0.34, 0.10, 0.50, -0.06, 0.07, 0, frameDark],

    // Front Dual Rotating Disc Brushes (touching ground Y = 0)
    // Left Brush assembly
    [0.10, 0.12, 0.10, 0.78, 0.14, 0.34, frameDark],
    [0.32, 0.06, 0.32, 0.82, 0.07, 0.34, brushCore],
    [0.40, 0.04, 0.40, 0.82, 0.02, 0.34, brushBristle],
    [0.12, 0.03, 0.12, 0.82, 0.10, 0.34, rim],
    // Right Brush assembly
    [0.10, 0.12, 0.10, 0.78, 0.14, -0.34, frameDark],
    [0.32, 0.06, 0.32, 0.82, 0.07, -0.34, brushCore],
    [0.40, 0.04, 0.40, 0.82, 0.02, -0.34, brushBristle],
    [0.12, 0.03, 0.12, 0.82, 0.10, -0.34, rim],

    // High Orange Cab Structure & Windows
    [0.72, 0.26, 0.70, 0.40, 0.36, 0, cabOrange],
    [0.06, 0.34, 0.64, 0.73, 0.66, 0, glass],
    [0.54, 0.34, 0.04, 0.40, 0.66, 0.33, glass],
    [0.54, 0.34, 0.04, 0.40, 0.66, -0.33, glass],
    [0.08, 0.34, 0.06, 0.73, 0.66, 0.33, cabOrange],
    [0.08, 0.34, 0.06, 0.73, 0.66, -0.33, cabOrange],
    [0.08, 0.34, 0.68, 0.08, 0.66, 0, cabOrange],
    [0.72, 0.08, 0.72, 0.40, 0.87, 0, cabOrange],

    // Roof Flashing Amber Safety Beacon & Side Mirrors
    [0.16, 0.04, 0.16, 0.40, 0.93, 0, frameDark],
    [0.14, 0.12, 0.14, 0.40, 1.01, 0, beacon, true],
    [0.06, 0.04, 0.10, 0.66, 0.64, 0.38, 0x0f172a],
    [0.06, 0.04, 0.10, 0.66, 0.64, -0.38, 0x0f172a],
    [0.06, 0.14, 0.06, 0.68, 0.64, 0.42, 0x0f172a],
    [0.06, 0.14, 0.06, 0.68, 0.64, -0.42, 0x0f172a],

    // Rear Waste Hopper with Beveled Top
    [1.06, 0.52, 0.72, -0.48, 0.52, 0, hopperGrey],
    [0.96, 0.10, 0.64, -0.48, 0.83, 0, hopperDark],

    // Diagonal Hazard Stripes (Sides of Hopper)
    [0.12, 0.12, 0.02, -0.12, 0.38, 0.365, hazardYellow, true],
    [0.12, 0.12, 0.02, -0.12, 0.38, -0.365, hazardYellow, true],
    [0.12, 0.12, 0.02, -0.24, 0.38, 0.365, hazardDark],
    [0.12, 0.12, 0.02, -0.24, 0.38, -0.365, hazardDark],
    [0.12, 0.12, 0.02, -0.36, 0.38, 0.365, hazardYellow, true],
    [0.12, 0.12, 0.02, -0.36, 0.38, -0.365, hazardYellow, true],
    [0.12, 0.12, 0.02, -0.48, 0.38, 0.365, hazardDark],
    [0.12, 0.12, 0.02, -0.48, 0.38, -0.365, hazardDark],
    [0.12, 0.12, 0.02, -0.60, 0.38, 0.365, hazardYellow, true],
    [0.12, 0.12, 0.02, -0.60, 0.38, -0.365, hazardYellow, true],
    [0.12, 0.12, 0.02, -0.72, 0.38, 0.365, hazardDark],
    [0.12, 0.12, 0.02, -0.72, 0.38, -0.365, hazardDark],
    [0.12, 0.12, 0.02, -0.84, 0.38, 0.365, hazardYellow, true],
    [0.12, 0.12, 0.02, -0.84, 0.38, -0.365, hazardYellow, true],

    // "STREET SWEEP" Label Plate on Hopper
    [0.80, 0.18, 0.02, -0.48, 0.64, 0.365, labelWhite, true],
    [0.80, 0.18, 0.02, -0.48, 0.64, -0.365, labelWhite, true],
    [0.68, 0.10, 0.03, -0.48, 0.64, 0.365, hazardDark],
    [0.68, 0.10, 0.03, -0.48, 0.64, -0.365, hazardDark],

    // Front Headlights & Rear Taillights
    [0.04, 0.10, 0.14, 0.77, 0.36, 0.24, headlight, true],
    [0.04, 0.10, 0.14, 0.77, 0.36, -0.24, headlight, true],
    [0.04, 0.12, 0.12, -1.02, 0.36, 0.26, taillight, true],
    [0.04, 0.12, 0.12, -1.02, 0.36, -0.26, taillight, true],
  ];
}

function buildTrain(): UrbanVoxelSpec[] {
  const whiteBody = 0xf1f5f9;
  const whiteRoof = 0xe2e8f0;
  const speedBlue = 0x2563eb;
  const goldStripe = 0xf59e0b;
  const glass = 0x1e293b;
  const chassisDark = 0x0f172a;
  const fairingDark = 0x334155;
  const ventGrey = 0x64748b;
  const spotlight = 0xfef08a;
  const taillight = 0xef4444;

  return [
    // Undercarriage & Bogie trucks (touching rails at Y = 0)
    [13.60, 0.14, 0.78, 0, 0.07, 0, chassisDark],
    [1.40, 0.12, 0.82, 4.80, 0.08, 0, chassisDark],
    [1.40, 0.12, 0.82, 0, 0.08, 0, chassisDark],
    [1.40, 0.12, 0.82, -4.80, 0.08, 0, chassisDark],

    // Main Body: Lower White Skirt, Gold & Speed Blue Dynamic Stripes
    [12.20, 0.18, 0.82, 0, 0.23, 0, whiteBody],
    [12.20, 0.06, 0.835, 0, 0.35, 0, goldStripe, true],
    [12.20, 0.14, 0.84, 0, 0.45, 0, speedBlue, true],
    [12.20, 0.08, 0.82, 0, 0.56, 0, whiteBody],

    // Continuous Tinted Window Ribbon & Car Dividers
    [12.00, 0.22, 0.83, 0, 0.71, 0, glass],
    [0.16, 0.22, 0.835, -3.80, 0.71, 0, whiteBody],
    [0.16, 0.22, 0.835, 0, 0.71, 0, whiteBody],
    [0.16, 0.22, 0.835, 3.80, 0.71, 0, whiteBody],

    // "CITY EXPRESS A-1" Branding Banners
    [4.20, 0.08, 0.835, 1.80, 0.86, 0, speedBlue, true],
    [4.20, 0.08, 0.835, -2.20, 0.86, 0, speedBlue, true],
    [3.60, 0.04, 0.84, 1.80, 0.86, 0, 0xffffff, true],
    [3.60, 0.04, 0.84, -2.20, 0.86, 0, 0xffffff, true],

    // Aerodynamic Curved Roof & Spine Fairings / AC Pods
    [12.20, 0.08, 0.78, 0, 0.94, 0, whiteRoof],
    [10.80, 0.04, 0.44, 0, 1.00, 0, fairingDark],
    [1.20, 0.08, 0.38, -3.60, 1.04, 0, ventGrey],
    [1.20, 0.08, 0.38, 0, 1.04, 0, ventGrey],
    [1.20, 0.08, 0.38, 3.60, 1.04, 0, ventGrey],

    // Aerodynamic Wedge Front Nose (Shinkansen / Sapsan profile)
    [0.40, 0.22, 0.76, 6.30, 0.25, 0, whiteBody],
    [0.40, 0.20, 0.72, 6.65, 0.24, 0, whiteBody],
    [0.35, 0.18, 0.64, 7.00, 0.23, 0, whiteBody],
    [0.20, 0.16, 0.52, 7.25, 0.22, 0, whiteBody],
    // Dynamic Blue & Gold spearhead on front nose
    [0.75, 0.12, 0.74, 6.45, 0.38, 0, speedBlue, true],
    [0.55, 0.06, 0.73, 6.40, 0.30, 0, goldStripe, true],
    [0.40, 0.10, 0.65, 6.95, 0.33, 0, speedBlue, true],
    // Wedge driver cockpit window & cab roof
    [0.50, 0.28, 0.72, 6.30, 0.68, 0, glass],
    [0.40, 0.22, 0.66, 6.70, 0.55, 0, glass],
    [0.55, 0.10, 0.68, 6.30, 0.86, 0, whiteRoof],
    // High-intensity spotlight cluster & rail illumination beam
    [0.12, 0.16, 0.32, 7.36, 0.32, 0, spotlight, true],
    [3.80, 0.10, 0.96, 9.20, 0.18, 0, spotlight, true, 0.42],

    // Aerodynamic Rear Nose
    [0.40, 0.22, 0.76, -6.30, 0.25, 0, whiteBody],
    [0.40, 0.20, 0.72, -6.65, 0.24, 0, whiteBody],
    [0.35, 0.18, 0.64, -7.00, 0.23, 0, whiteBody],
    [0.20, 0.16, 0.52, -7.25, 0.22, 0, whiteBody],
    [0.75, 0.12, 0.74, -6.45, 0.38, 0, speedBlue, true],
    [0.55, 0.06, 0.73, -6.40, 0.30, 0, goldStripe, true],
    [0.40, 0.10, 0.65, -6.95, 0.33, 0, speedBlue, true],
    [0.50, 0.28, 0.72, -6.30, 0.68, 0, glass],
    [0.40, 0.22, 0.66, -6.70, 0.55, 0, glass],
    [0.55, 0.10, 0.68, -6.30, 0.86, 0, whiteRoof],
    [0.12, 0.14, 0.32, -7.36, 0.32, 0, taillight, true],
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
