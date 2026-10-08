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
  const bumper = 0x475569;
  const white = 0xffffff;
  const red = 0xef4444;
  const headlight = 0xfef08a;
  const turnSignal = 0xf97316;
  const plateBlue = 0x1d4ed8;
  const glass = 0x1e293b;

  const specs: UrbanVoxelSpec[] = [
    // 4 Wheels with grey hubcaps (center Y = 0.12, touching ground strictly at Y = 0)
    [0.24, 0.24, 0.12, 0.46, 0.12, 0.33, wheel],
    [0.24, 0.24, 0.12, 0.46, 0.12, -0.33, wheel],
    [0.24, 0.24, 0.12, -0.46, 0.12, 0.33, wheel],
    [0.24, 0.24, 0.12, -0.46, 0.12, -0.33, wheel],
    [0.12, 0.12, 0.04, 0.46, 0.12, 0.39, rim],
    [0.12, 0.12, 0.04, 0.46, 0.12, -0.39, rim],
    [0.12, 0.12, 0.04, -0.46, 0.12, 0.39, rim],
    [0.12, 0.12, 0.04, -0.46, 0.12, -0.39, rim],

    // Chassis & Solid Voxel Body (100% opaque, no interior voids)
    [1.32, 0.06, 0.58, 0, 0.07, 0, bumper],
    [1.40, 0.16, 0.64, 0, 0.18, 0, c],
    [0.50, 0.12, 0.64, 0.45, 0.32, 0, c],
    [0.28, 0.10, 0.64, -0.56, 0.31, 0, c],
    [0.62, 0.28, 0.56, -0.11, 0.40, 0, c],
    [0.52, 0.06, 0.62, -0.10, 0.57, 0, c],

    // Solid Opaque Windows (0% transparency) & Body Pillars
    [0.08, 0.22, 0.56, 0.16, 0.45, 0, glass],
    [0.06, 0.12, 0.56, 0.20, 0.38, 0, glass],
    [0.08, 0.20, 0.54, -0.38, 0.44, 0, glass],
    [0.07, 0.22, 0.62, -0.045, 0.45, 0, c],
    [0.16, 0.18, 0.05, 0.08, 0.45, 0.295, glass],
    [0.16, 0.18, 0.05, 0.08, 0.45, -0.295, glass],
    [0.18, 0.18, 0.05, -0.18, 0.45, 0.295, glass],
    [0.18, 0.18, 0.05, -0.18, 0.45, -0.295, glass],
    [0.07, 0.22, 0.05, 0.17, 0.45, 0.295, c],
    [0.07, 0.22, 0.05, 0.17, 0.45, -0.295, c],
    [0.09, 0.22, 0.05, -0.335, 0.45, 0.295, c],
    [0.09, 0.22, 0.05, -0.335, 0.45, -0.295, c],

    // Relief Door Handles (Protruding Delta >= 0.04) & Door Seam
    [0.02, 0.16, 0.645, -0.045, 0.18, 0, black],
    [0.07, 0.035, 0.05, 0.07, 0.30, 0.345, black],
    [0.07, 0.035, 0.05, 0.07, 0.30, -0.345, black],
    [0.07, 0.035, 0.05, -0.19, 0.30, 0.345, black],
    [0.07, 0.035, 0.05, -0.19, 0.30, -0.345, black],

    // Front View: Bumper, Blue "CITY" Plate, Grille Slats, Headlights, Turn Signals & Mirrors
    [0.10, 0.12, 0.68, 0.74, 0.16, 0, bumper],
    [0.05, 0.08, 0.22, 0.795, 0.16, 0, plateBlue, true],
    [0.03, 0.05, 0.16, 0.82, 0.16, 0, white, true],
    [0.05, 0.12, 0.30, 0.715, 0.31, 0, glass],
    [0.04, 0.025, 0.26, 0.74, 0.345, 0, rim],
    [0.04, 0.025, 0.26, 0.74, 0.31, 0, rim],
    [0.04, 0.025, 0.26, 0.74, 0.275, 0, rim],
    [0.05, 0.10, 0.11, 0.725, 0.31, 0.21, headlight, true],
    [0.05, 0.10, 0.11, 0.725, 0.31, -0.21, headlight, true],
    [0.05, 0.10, 0.06, 0.725, 0.31, 0.295, turnSignal, true],
    [0.05, 0.10, 0.06, 0.725, 0.31, -0.295, turnSignal, true],
    [0.06, 0.07, 0.08, 0.16, 0.42, 0.37, black],
    [0.06, 0.07, 0.08, 0.16, 0.42, -0.37, black],

    // Rear View: Bumper, Taillights & Blue Plate
    [0.10, 0.12, 0.68, -0.74, 0.16, 0, bumper],
    [0.05, 0.09, 0.14, -0.715, 0.30, 0.23, red, true],
    [0.05, 0.09, 0.14, -0.715, 0.30, -0.23, red, true],
    [0.04, 0.07, 0.18, -0.75, 0.16, 0, plateBlue, true],
    [0.02, 0.04, 0.12, -0.77, 0.16, 0, white, true],

    // Roof TAXI Sign: Black Mount, White Box, Checkers & Rear Orange Beacon
    [0.32, 0.03, 0.20, -0.07, 0.61, 0, black],
    [0.28, 0.12, 0.16, -0.06, 0.68, 0, white, true],
    [0.05, 0.10, 0.10, -0.21, 0.68, 0, turnSignal, true],
    [0.06, 0.045, 0.03, -0.14, 0.71, 0.095, black],
    [0.06, 0.045, 0.03, 0.02, 0.71, 0.095, black],
    [0.06, 0.045, 0.03, -0.06, 0.65, 0.095, black],
    [0.06, 0.045, 0.03, -0.14, 0.71, -0.095, black],
    [0.06, 0.045, 0.03, 0.02, 0.71, -0.095, black],
    [0.06, 0.045, 0.03, -0.06, 0.65, -0.095, black],
  ];

  // 2-row Checkerboard pattern on front and rear fenders (relief Delta >= 0.04)
  const frontFenderXs = [0.32, 0.39, 0.46, 0.53];
  for (let i = 0; i < frontFenderXs.length; i++) {
    const fx = frontFenderXs[i];
    const topCol = i % 2 === 0 ? black : white;
    const btmCol = i % 2 === 0 ? white : black;
    specs.push([0.065, 0.04, 0.045, fx, 0.32, 0.3425, topCol, true]);
    specs.push([0.065, 0.04, 0.045, fx, 0.28, 0.3425, btmCol, true]);
    specs.push([0.065, 0.04, 0.045, fx, 0.32, -0.3425, topCol, true]);
    specs.push([0.065, 0.04, 0.045, fx, 0.28, -0.3425, btmCol, true]);
  }

  const rearFenderXs = [-0.39, -0.46, -0.53, -0.60];
  for (let i = 0; i < rearFenderXs.length; i++) {
    const rx = rearFenderXs[i];
    const topCol = i % 2 === 0 ? black : white;
    const btmCol = i % 2 === 0 ? white : black;
    specs.push([0.065, 0.04, 0.045, rx, 0.32, 0.3425, topCol, true]);
    specs.push([0.065, 0.04, 0.045, rx, 0.28, 0.3425, btmCol, true]);
    specs.push([0.065, 0.04, 0.045, rx, 0.32, -0.3425, topCol, true]);
    specs.push([0.065, 0.04, 0.045, rx, 0.28, -0.3425, btmCol, true]);
  }

  return specs;
}

function buildScooter(color: number = 0x84cc16): UrbanVoxelSpec[] {
  const limeGreen = color === 0x3b82f6 || !color ? 0x84cc16 : color;
  const darkGreen = 0x3f6212;
  const bagGreen = 0x22c55e;
  const bagDark = 0x15803d;
  const wheel = 0x0f172a;
  const rim = 0x94a3b8;
  const chrome = 0xe2e8f0;
  const seatDark = 0x1e293b;
  const darkGrey = 0x334155;
  const headlight = 0xfef08a;
  const taillight = 0xef4444;
  const jeanBlue = 0x2563eb;
  const jacketOrange = 0xf97316;
  const skin = 0xfdba74;
  const white = 0xffffff;
  const mirrorGlass = 0x93c5fd;

  return [
    // 2 Wheels with grey rims (center Y = 0.12, bottom touches ground Y = 0)
    [0.24, 0.24, 0.08, 0.44, 0.12, 0, wheel],
    [0.12, 0.12, 0.01, 0.44, 0.12, 0.045, rim],
    [0.12, 0.12, 0.01, 0.44, 0.12, -0.045, rim],
    [0.24, 0.24, 0.08, -0.40, 0.12, 0, wheel],
    [0.12, 0.12, 0.01, -0.40, 0.12, 0.045, rim],
    [0.12, 0.12, 0.01, -0.40, 0.12, -0.045, rim],

    // Front Mudguard & Fork Struts
    [0.22, 0.05, 0.12, 0.44, 0.255, 0, limeGreen],
    [0.08, 0.08, 0.12, 0.52, 0.21, 0, limeGreen],
    [0.04, 0.16, 0.03, 0.40, 0.20, 0.05, chrome],
    [0.04, 0.16, 0.03, 0.40, 0.20, -0.05, chrome],

    // Floorboard Chassis & Rubber Mat
    [0.38, 0.05, 0.22, 0.02, 0.085, 0, darkGrey],
    [0.34, 0.04, 0.32, 0.04, 0.12, 0, limeGreen],
    [0.26, 0.02, 0.24, 0.04, 0.145, 0, darkGrey],

    // Front Retro Apron, Leg Shield & Glowing Square Headlight
    [0.10, 0.18, 0.34, 0.24, 0.22, 0, limeGreen],
    [0.10, 0.22, 0.32, 0.30, 0.38, 0, limeGreen],
    [0.12, 0.10, 0.26, 0.28, 0.50, 0, limeGreen],
    [0.04, 0.10, 0.12, 0.35, 0.48, 0, headlight, true],

    // Rear Body, Side Cowls, Seat & Red Taillight
    [0.38, 0.16, 0.26, -0.22, 0.23, 0, limeGreen],
    [0.32, 0.14, 0.07, -0.26, 0.21, 0.16, limeGreen],
    [0.32, 0.14, 0.07, -0.26, 0.21, -0.16, limeGreen],
    [0.14, 0.14, 0.22, -0.45, 0.21, 0, limeGreen],
    [0.28, 0.07, 0.20, -0.10, 0.33, 0, seatDark],
    [0.04, 0.07, 0.10, -0.53, 0.24, 0, taillight, true],

    // Chrome Steering Column, Handlebars & Side Mirrors
    [0.05, 0.10, 0.05, 0.25, 0.58, 0, chrome],
    [0.04, 0.04, 0.46, 0.25, 0.62, 0, chrome],
    [0.05, 0.05, 0.06, 0.25, 0.62, 0.21, darkGrey],
    [0.05, 0.05, 0.06, 0.25, 0.62, -0.21, darkGrey],
    [0.03, 0.08, 0.03, 0.25, 0.67, 0.19, chrome],
    [0.03, 0.08, 0.03, 0.25, 0.67, -0.19, chrome],
    [0.04, 0.06, 0.06, 0.25, 0.73, 0.19, chrome],
    [0.015, 0.045, 0.045, 0.235, 0.73, 0.19, mirrorGlass, true],
    [0.04, 0.06, 0.06, 0.25, 0.73, -0.19, chrome],
    [0.015, 0.045, 0.045, 0.235, 0.73, -0.19, mirrorGlass, true],

    // Courier Legs (Blue Jeans) & Shoes on Footboard
    [0.18, 0.10, 0.22, -0.08, 0.39, 0, jeanBlue],
    [0.18, 0.09, 0.09, 0.05, 0.38, 0.10, jeanBlue],
    [0.18, 0.09, 0.09, 0.05, 0.38, -0.10, jeanBlue],
    [0.09, 0.16, 0.09, 0.12, 0.26, 0.10, jeanBlue],
    [0.09, 0.16, 0.09, 0.12, 0.26, -0.10, jeanBlue],
    [0.14, 0.06, 0.08, 0.13, 0.155, 0.10, darkGrey],
    [0.14, 0.06, 0.08, 0.13, 0.155, -0.10, darkGrey],

    // Courier Torso (Orange Jacket), Collar & Extended Arms
    [0.20, 0.24, 0.22, -0.06, 0.52, 0, jacketOrange],
    [0.02, 0.16, 0.04, 0.042, 0.53, 0, white],
    [0.10, 0.10, 0.07, -0.03, 0.58, 0.14, jacketOrange],
    [0.10, 0.10, 0.07, -0.03, 0.58, -0.14, jacketOrange],
    [0.16, 0.07, 0.07, 0.10, 0.58, 0.16, jacketOrange],
    [0.16, 0.07, 0.07, 0.10, 0.58, -0.16, jacketOrange],
    [0.06, 0.06, 0.06, 0.21, 0.60, 0.18, skin],
    [0.06, 0.06, 0.06, 0.21, 0.60, -0.18, skin],

    // Courier Head, Face & Lime Green Helmet with Visor
    [0.08, 0.06, 0.08, -0.05, 0.63, 0, skin],
    [0.15, 0.14, 0.16, -0.04, 0.68, 0, skin],
    [0.19, 0.10, 0.20, -0.06, 0.77, 0, limeGreen],
    [0.12, 0.14, 0.20, -0.09, 0.69, 0, limeGreen],
    [0.14, 0.05, 0.16, -0.06, 0.83, 0, limeGreen],
    [0.09, 0.04, 0.18, 0.06, 0.73, 0, darkGreen],

    // Rear Chrome Rack Supporting Delivery Box
    [0.24, 0.03, 0.26, -0.34, 0.35, 0, chrome],
    [0.03, 0.12, 0.22, -0.42, 0.29, 0, chrome],

    // Cubic Thermal Delivery Backpack
    [0.26, 0.04, 0.28, -0.35, 0.38, 0, darkGrey],
    [0.32, 0.36, 0.36, -0.35, 0.57, 0, bagGreen],
    [0.34, 0.05, 0.38, -0.35, 0.74, 0, bagDark],
    [0.34, 0.04, 0.38, -0.35, 0.40, 0, bagDark],
    [0.03, 0.26, 0.26, -0.185, 0.57, 0, bagDark],

    // "FOOD HOT" Placards: Rear Face
    [0.02, 0.22, 0.26, -0.52, 0.57, 0, white, true],
    [0.02, 0.07, 0.20, -0.531, 0.63, 0, bagDark, true],
    [0.02, 0.07, 0.16, -0.531, 0.52, 0, taillight, true],

    // "FOOD HOT" Placards: Left Side Face (+Z)
    [0.22, 0.22, 0.02, -0.35, 0.57, 0.19, white, true],
    [0.18, 0.07, 0.02, -0.35, 0.63, 0.201, bagDark, true],
    [0.14, 0.07, 0.02, -0.35, 0.52, 0.201, taillight, true],

    // "FOOD HOT" Placards: Right Side Face (-Z)
    [0.22, 0.22, 0.02, -0.35, 0.57, -0.19, white, true],
    [0.18, 0.07, 0.02, -0.35, 0.63, -0.201, bagDark, true],
    [0.14, 0.07, 0.02, -0.35, 0.52, -0.201, taillight, true],
  ];
}


function buildBus(_color: number): UrbanVoxelSpec[] {
  const transitGreen = 0x16a34a;
  const roofGreen = 0x15803d;
  const lowerOrange = 0xea580c;
  const upperOrange = 0xf97316;
  const darkBelt = 0x1e293b;
  const bumperDark = 0x334155;
  const glass = 0x1e293b;
  const acBody = 0x15803d;
  const acVent = 0x334155;
  const wheel = 0x0f172a;
  const rim = 0x94a3b8;
  const amberLed = 0xf59e0b;
  const headlight = 0xfef08a;
  const taillight = 0xef4444;
  const signWhite = 0xf8fafc;
  const signCream = 0xffedd5;
  const badgeYellow = 0xfacc15;
  const mirrorDark = 0x0f172a;

  return [
    // 6 Wheels (2 front at X=1.05, 4 tandem rear at X=-0.58 & -1.08; touches ground Y=0)
    [0.30, 0.28, 0.12, 1.05, 0.14, 0.37, wheel],
    [0.30, 0.28, 0.12, 1.05, 0.14, -0.37, wheel],
    [0.14, 0.14, 0.02, 1.05, 0.14, 0.435, rim],
    [0.14, 0.14, 0.02, 1.05, 0.14, -0.435, rim],
    [0.30, 0.28, 0.12, -0.58, 0.14, 0.37, wheel],
    [0.30, 0.28, 0.12, -0.58, 0.14, -0.37, wheel],
    [0.14, 0.14, 0.02, -0.58, 0.14, 0.435, rim],
    [0.14, 0.14, 0.02, -0.58, 0.14, -0.435, rim],
    [0.30, 0.28, 0.12, -1.08, 0.14, 0.37, wheel],
    [0.30, 0.28, 0.12, -1.08, 0.14, -0.37, wheel],
    [0.14, 0.14, 0.02, -1.08, 0.14, 0.435, rim],
    [0.14, 0.14, 0.02, -1.08, 0.14, -0.435, rim],

    // Chassis, Skirts & Heavy Dark Bumpers
    [2.96, 0.10, 0.68, 0, 0.13, 0, darkBelt],
    [0.12, 0.14, 0.78, 1.60, 0.17, 0, bumperDark],
    [0.02, 0.08, 0.22, 1.67, 0.16, 0, signWhite, true],
    [0.12, 0.14, 0.78, -1.60, 0.17, 0, bumperDark],

    // Lower Warm Orange Body & Dividing Dark Belt
    [3.10, 0.26, 0.72, 0, 0.33, 0, lowerOrange],
    [3.12, 0.04, 0.73, 0, 0.48, 0, darkBelt],
    [3.12, 0.06, 0.73, 0, 0.53, 0, transitGreen],

    // Front Fascia: Grille Slats, Headlights, Amber Indicators
    [0.02, 0.035, 0.26, 1.60, 0.34, 0, darkBelt],
    [0.02, 0.035, 0.26, 1.60, 0.27, 0, darkBelt],
    [0.03, 0.08, 0.12, 1.60, 0.31, 0.21, headlight, true],
    [0.03, 0.08, 0.12, 1.60, 0.31, -0.21, headlight, true],
    [0.03, 0.08, 0.06, 1.60, 0.31, 0.31, amberLed, true],
    [0.03, 0.08, 0.06, 1.60, 0.31, -0.31, amberLed, true],

    // Rear Fascia: Taillights & Rear Turn Signals
    [0.03, 0.10, 0.08, -1.60, 0.38, 0.28, taillight, true],
    [0.03, 0.10, 0.08, -1.60, 0.38, -0.28, taillight, true],
    [0.03, 0.06, 0.08, -1.60, 0.28, 0.28, amberLed, true],
    [0.03, 0.06, 0.08, -1.60, 0.28, -0.28, amberLed, true],

    // Route '42' Side Badges on Green Belt
    [0.18, 0.05, 0.02, 0.62, 0.53, 0.38, badgeYellow, true],
    [0.18, 0.05, 0.02, 0.85, 0.53, -0.38, badgeYellow, true],

    // Cabin Core & Windshields (Opaque Indigo Glass, 0% Transparency)
    [3.06, 0.28, 0.70, 0, 0.70, 0, glass],
    [0.06, 0.30, 0.66, 1.54, 0.71, 0, glass],
    [0.08, 0.30, 0.05, 1.54, 0.71, 0.36, transitGreen],
    [0.08, 0.30, 0.05, 1.54, 0.71, -0.36, transitGreen],
    [0.06, 0.26, 0.62, -1.54, 0.70, 0, glass],
    [0.08, 0.26, 0.06, -1.54, 0.70, 0.35, transitGreen],
    [0.08, 0.26, 0.06, -1.54, 0.70, -0.35, transitGreen],

    // Left Side (Driver Side, -Z): Continuous Passenger Windows with Green Pillars
    [0.05, 0.28, 0.04, 0.90, 0.70, -0.375, transitGreen],
    [0.05, 0.28, 0.04, 0.35, 0.70, -0.375, transitGreen],
    [0.05, 0.28, 0.04, -0.20, 0.70, -0.375, transitGreen],
    [0.05, 0.28, 0.04, -0.75, 0.70, -0.375, transitGreen],
    [2.80, 0.025, 0.035, 0, 0.76, -0.365, darkBelt],

    // Right Side (Passenger Side, +Z): Dual Double-Leaf Passenger Doors
    // Front Door Assembly (X=1.12)
    [0.38, 0.58, 0.03, 1.12, 0.52, 0.375, darkBelt],
    [0.14, 0.52, 0.03, 1.205, 0.52, 0.385, glass],
    [0.14, 0.52, 0.03, 1.035, 0.52, 0.385, glass],
    [0.04, 0.56, 0.035, 1.12, 0.52, 0.405, transitGreen],
    [0.34, 0.04, 0.035, 1.12, 0.48, 0.405, darkBelt],
    // Middle Door Assembly (X=-0.05)
    [0.38, 0.58, 0.03, -0.05, 0.52, 0.375, darkBelt],
    [0.14, 0.52, 0.03, 0.035, 0.52, 0.385, glass],
    [0.14, 0.52, 0.03, -0.135, 0.52, 0.385, glass],
    [0.04, 0.56, 0.035, -0.05, 0.52, 0.405, transitGreen],
    [0.34, 0.04, 0.035, -0.05, 0.48, 0.405, darkBelt],
    // Windows on Passenger Side
    [0.28, 0.06, 0.02, 0.54, 0.78, 0.38, darkBelt],
    [0.20, 0.04, 0.02, 0.54, 0.78, 0.395, amberLed, true],
    [0.05, 0.28, 0.04, -0.76, 0.70, 0.375, transitGreen],

    // Upper Orange Frieze & "CITY TRANSIT" Branding
    [3.12, 0.10, 0.73, 0, 0.89, 0, upperOrange],
    // "CITY TRANSIT" lettering on Right Side (+Z, Delta >= 0.045)
    [0.05, 0.06, 0.02, 0.78, 0.89, 0.405, signCream, true],
    [0.025, 0.06, 0.02, 0.70, 0.89, 0.405, signCream, true],
    [0.05, 0.06, 0.02, 0.62, 0.89, 0.405, signCream, true],
    [0.05, 0.06, 0.02, 0.54, 0.89, 0.405, signCream, true],
    [0.05, 0.06, 0.02, 0.40, 0.89, 0.405, signCream, true],
    [0.05, 0.06, 0.02, 0.31, 0.89, 0.405, signCream, true],
    [0.05, 0.06, 0.02, 0.22, 0.89, 0.405, signCream, true],
    [0.05, 0.06, 0.02, 0.13, 0.89, 0.405, signCream, true],
    [0.05, 0.06, 0.02, 0.04, 0.89, 0.405, signCream, true],
    [0.025, 0.06, 0.02, -0.04, 0.89, 0.405, signCream, true],
    [0.05, 0.06, 0.02, -0.12, 0.89, 0.405, signCream, true],

    // Front Illuminated "ROUTE 42" LED Destination Display
    [0.10, 0.14, 0.66, 1.56, 0.94, 0, transitGreen],
    [0.04, 0.10, 0.58, 1.61, 0.94, 0, 0x050505, true],
    // ROUTE 42 Amber LED Pixels (Delta >= 0.04 over panel)
    [0.02, 0.06, 0.045, 1.65, 0.94, -0.22, amberLed, true], // R
    [0.02, 0.06, 0.045, 1.65, 0.94, -0.15, amberLed, true], // O
    [0.02, 0.06, 0.045, 1.65, 0.94, -0.08, amberLed, true], // U
    [0.02, 0.06, 0.045, 1.65, 0.94, -0.01, amberLed, true], // T
    [0.02, 0.06, 0.045, 1.65, 0.94, 0.06, amberLed, true],  // E
    [0.02, 0.06, 0.045, 1.65, 0.94, 0.15, amberLed, true],  // 4
    [0.02, 0.06, 0.045, 1.65, 0.94, 0.22, amberLed, true],  // 2

    // Extended Side Mirrors on Sturdy Brackets
    [0.06, 0.03, 0.10, 1.48, 0.72, -0.42, mirrorDark],
    [0.06, 0.16, 0.05, 1.50, 0.70, -0.47, mirrorDark],
    [0.01, 0.13, 0.04, 1.47, 0.70, -0.47, 0x94a3b8, true],
    [0.06, 0.03, 0.10, 1.48, 0.72, 0.42, mirrorDark],
    [0.06, 0.16, 0.05, 1.50, 0.70, 0.47, mirrorDark],
    [0.01, 0.13, 0.04, 1.47, 0.70, 0.47, 0x94a3b8, true],

    // Roof & Climate Control (AC) Unit
    [3.16, 0.06, 0.76, 0, 0.97, 0, roofGreen],
    [1.60, 0.07, 0.52, 0, 1.035, 0, acBody],
    [1.36, 0.03, 0.44, 0, 1.085, 0, transitGreen],
    [0.36, 0.02, 0.34, 0.42, 1.11, 0, acVent],
    [0.36, 0.02, 0.34, -0.42, 1.11, 0, acVent],
  ];
}

function buildSweeper(color: number): UrbanVoxelSpec[] {
  const cabOrange = color || 0xf97316;
  const hopperGrey = 0x475569;
  const hopperDark = 0x334155;
  const hazardYellow = 0xfacc15;
  const hazardDark = 0x0f172a;
  const glass = 0x1e293b;
  const wheel = 0x0f172a;
  const rim = 0x94a3b8;
  const frameDark = 0x1e293b;
  const brushCore = 0x18181b;
  const brushBristle = 0x27272a;
  const beacon = 0xfacc15;
  const headlight = 0xfef08a;
  const taillight = 0xef4444;
  const labelWhite = 0xf1f5f9;

  const specs: UrbanVoxelSpec[] = [
    // 4 Heavy Road Wheels with Slate Rims (center Y = 0.13, touches ground Y = 0)
    [0.26, 0.26, 0.12, 0.48, 0.13, 0.35, wheel],
    [0.26, 0.26, 0.12, 0.48, 0.13, -0.35, wheel],
    [0.12, 0.12, 0.02, 0.48, 0.13, 0.415, rim],
    [0.12, 0.12, 0.02, 0.48, 0.13, -0.415, rim],
    [0.26, 0.26, 0.12, -0.62, 0.13, 0.35, wheel],
    [0.26, 0.26, 0.12, -0.62, 0.13, -0.35, wheel],
    [0.12, 0.12, 0.02, -0.62, 0.13, 0.415, rim],
    [0.12, 0.12, 0.02, -0.62, 0.13, -0.415, rim],

    // Chassis Frame, Undercarriage Vacuum Suction & Bumpers
    [2.04, 0.12, 0.66, -0.08, 0.14, 0, frameDark],
    [0.40, 0.10, 0.48, -0.06, 0.06, 0, frameDark],
    [0.14, 0.14, 0.74, 0.78, 0.16, 0, frameDark],
    [0.10, 0.16, 0.72, -1.04, 0.18, 0, frameDark],

    // Front Dual Conical Sweeper Brushes (Y = 0 ground contact, flared bristle skirts)
    // Left Brush (Z = +0.38)
    [0.18, 0.06, 0.08, 0.86, 0.18, 0.38, frameDark],
    [0.14, 0.04, 0.14, 0.94, 0.16, 0.38, rim],
    [0.28, 0.05, 0.28, 0.94, 0.12, 0.38, brushCore],
    [0.42, 0.05, 0.34, 0.94, 0.07, 0.38, brushBristle],
    [0.34, 0.05, 0.42, 0.94, 0.07, 0.38, brushBristle],
    [0.54, 0.044, 0.42, 0.94, 0.022, 0.38, brushCore],
    [0.42, 0.044, 0.54, 0.94, 0.022, 0.38, brushCore],
    [0.48, 0.044, 0.48, 0.94, 0.022, 0.38, brushBristle],
    // Right Brush (Z = -0.38)
    [0.18, 0.06, 0.08, 0.86, 0.18, -0.38, frameDark],
    [0.14, 0.04, 0.14, 0.94, 0.16, -0.38, rim],
    [0.28, 0.05, 0.28, 0.94, 0.12, -0.38, brushCore],
    [0.42, 0.05, 0.34, 0.94, 0.07, -0.38, brushBristle],
    [0.34, 0.05, 0.42, 0.94, 0.07, -0.38, brushBristle],
    [0.54, 0.044, 0.42, 0.94, 0.022, -0.38, brushCore],
    [0.42, 0.044, 0.54, 0.94, 0.022, -0.38, brushCore],
    [0.48, 0.044, 0.48, 0.94, 0.022, -0.38, brushBristle],

    // High Municipal Orange Cab Body, Front Grille, Headlights & Door Handles
    [0.72, 0.28, 0.70, 0.44, 0.34, 0, cabOrange],
    [0.03, 0.10, 0.12, 0.81, 0.34, 0.24, headlight, true],
    [0.03, 0.10, 0.12, 0.81, 0.34, -0.24, headlight, true],
    [0.03, 0.03, 0.26, 0.81, 0.37, 0, 0xc2410c],
    [0.03, 0.03, 0.26, 0.81, 0.31, 0, 0xc2410c],
    [0.08, 0.03, 0.02, 0.36, 0.36, 0.36, 0x0f172a],
    [0.08, 0.03, 0.02, 0.36, 0.36, -0.36, 0x0f172a],

    // Panoramic Windshield, Low-Cut Door Glass (0% transparency) & Cab Roof
    [0.04, 0.34, 0.62, 0.79, 0.66, 0, glass],
    [0.06, 0.34, 0.05, 0.79, 0.66, 0.33, cabOrange],
    [0.06, 0.34, 0.05, 0.79, 0.66, -0.33, cabOrange],
    [0.54, 0.34, 0.03, 0.44, 0.66, 0.355, glass],
    [0.54, 0.34, 0.03, 0.44, 0.66, -0.355, glass],
    [0.22, 0.14, 0.03, 0.65, 0.42, 0.355, glass],
    [0.22, 0.14, 0.03, 0.65, 0.42, -0.355, glass],
    [0.08, 0.34, 0.70, 0.10, 0.66, 0, cabOrange],
    [0.72, 0.06, 0.72, 0.44, 0.86, 0, cabOrange],

    // Roof Flashing Safety Beacon (0xfacc15) & Dual Black Side Mirrors
    [0.16, 0.04, 0.16, 0.44, 0.91, 0, frameDark],
    [0.14, 0.12, 0.14, 0.44, 0.99, 0, beacon, true],
    [0.06, 0.03, 0.08, 0.72, 0.65, 0.40, 0x0f172a],
    [0.06, 0.14, 0.05, 0.73, 0.65, 0.45, 0x0f172a],
    [0.06, 0.03, 0.08, 0.72, 0.65, -0.40, 0x0f172a],
    [0.06, 0.14, 0.05, 0.73, 0.65, -0.45, 0x0f172a],

    // Rear Waste Hopper with Sloped / Chamfered Top-Rear Profile & Taillights
    [1.08, 0.50, 0.72, -0.48, 0.47, 0, hopperGrey],
    [0.74, 0.08, 0.70, -0.33, 0.76, 0, hopperDark],
    [0.16, 0.07, 0.70, -0.76, 0.74, 0, hopperDark],
    [0.14, 0.08, 0.70, -0.89, 0.68, 0, hopperDark],
    [0.10, 0.08, 0.70, -0.99, 0.61, 0, hopperDark],
    [0.03, 0.10, 0.12, -1.03, 0.36, 0.26, taillight, true],
    [0.03, 0.10, 0.12, -1.03, 0.36, -0.26, taillight, true],

    // Contrast Black Hazard Band Plate (+0.04 Protrusion, Z = +/-0.38)
    [0.96, 0.13, 0.04, -0.48, 0.34, 0.38, hazardDark],
    [0.96, 0.13, 0.04, -0.48, 0.34, -0.38, hazardDark],
  ];

  // Alternating Hazard Chevrons (Yellow Slanted Slashes, +0.04 Protrusion)
  for (let x = -0.06; x >= -0.86; x -= 0.12) {
    specs.push([0.055, 0.065, 0.042, x, 0.31, 0.382, hazardYellow, true]);
    specs.push([0.055, 0.065, 0.042, x - 0.04, 0.37, 0.382, hazardYellow, true]);
    specs.push([0.055, 0.065, 0.042, x, 0.31, -0.382, hazardYellow, true]);
    specs.push([0.055, 0.065, 0.042, x - 0.04, 0.37, -0.382, hazardYellow, true]);
  }

  // Relief "STREET SWEEP" Typography (Protrusion delta = 0.04, Z = +/-0.385)
  // Two-line layout: "STREET" at Y = 0.63, "SWEEP" at Y = 0.50
  const renderSweeperText = (text: string, startX: number, baseY: number) => {
    const glyphs: Record<string, number[]> = {
      S: [0x7, 0x1, 0x7, 0x4, 0x7],
      T: [0x7, 0x2, 0x2, 0x2, 0x2],
      R: [0x7, 0x5, 0x7, 0x5, 0x5],
      E: [0x7, 0x1, 0x7, 0x1, 0x7],
      W: [0x5, 0x5, 0x7, 0x5, 0x5],
      P: [0x7, 0x5, 0x7, 0x1, 0x1],
    };
    for (let c = 0; c < text.length; c++) {
      const g = glyphs[text[c]];
      if (!g) continue;
      const ox = startX - c * 0.11;
      for (let r = 0; r < 5; r++) {
        const mask = g[r];
        const py = baseY + (4 - r) * 0.022;
        if ((mask & 0x7) === 0x7) {
          specs.push([0.08, 0.02, 0.04, ox, py, 0.385, labelWhite, true]);
          specs.push([0.08, 0.02, 0.04, ox, py, -0.385, labelWhite, true]);
        } else {
          if (mask & 0x1) {
            specs.push([0.025, 0.02, 0.04, ox + 0.028, py, 0.385, labelWhite, true]);
            specs.push([0.025, 0.02, 0.04, ox + 0.028, py, -0.385, labelWhite, true]);
          }
          if (mask & 0x2) {
            specs.push([0.025, 0.02, 0.04, ox, py, 0.385, labelWhite, true]);
            specs.push([0.025, 0.02, 0.04, ox, py, -0.385, labelWhite, true]);
          }
          if (mask & 0x4) {
            specs.push([0.025, 0.02, 0.04, ox - 0.028, py, 0.385, labelWhite, true]);
            specs.push([0.025, 0.02, 0.04, ox - 0.028, py, -0.385, labelWhite, true]);
          }
        }
      }
    }
  };
  renderSweeperText('STREET', -0.21, 0.63);
  renderSweeperText('SWEEP', -0.26, 0.50);

  return specs;
}

function buildTrain(): UrbanVoxelSpec[] {
  const whiteBody = 0xf1f5f9;
  const whiteRoof = 0xe2e8f0;
  const speedBlue = 0x2563eb;
  const goldStripe = 0xfacc15;
  const glass = 0x1e293b;
  const chassisDark = 0x0f172a;
  const wheelDark = 0x111827;
  const rimGrey = 0x94a3b8;
  const fairingDark = 0x334155;
  const roofPod = 0xcfd8dc;
  const roofVent = 0x64748b;
  const copperOrange = 0xd97706;
  const spotlight = 0xfef08a;
  const taillight = 0xef4444;
  const signWhite = 0xffffff;

  return [
    // --- 1. Undercarriage, Bogies & Wheels (sitting directly above rails at Y = 0) ---
    // Front Bogie (Center X = +4.00, 4 wheels at Z = +-0.36)
    [1.60, 0.08, 0.70, 4.00, 0.12, 0, chassisDark],
    [0.24, 0.22, 0.08, 4.50, 0.11, 0.36, wheelDark],
    [0.24, 0.22, 0.08, 4.50, 0.11, -0.36, wheelDark],
    [0.24, 0.22, 0.08, 3.50, 0.11, 0.36, wheelDark],
    [0.24, 0.22, 0.08, 3.50, 0.11, -0.36, wheelDark],
    [0.10, 0.10, 0.02, 4.50, 0.11, 0.405, rimGrey],
    [0.10, 0.10, 0.02, 4.50, 0.11, -0.405, rimGrey],
    [0.10, 0.10, 0.02, 3.50, 0.11, 0.405, rimGrey],
    [0.10, 0.10, 0.02, 3.50, 0.11, -0.405, rimGrey],

    // Rear Bogie (Center X = -4.50, 4 wheels at Z = +-0.36)
    [1.60, 0.08, 0.70, -4.50, 0.12, 0, chassisDark],
    [0.24, 0.22, 0.08, -4.00, 0.11, 0.36, wheelDark],
    [0.24, 0.22, 0.08, -4.00, 0.11, -0.36, wheelDark],
    [0.24, 0.22, 0.08, -5.00, 0.11, 0.36, wheelDark],
    [0.24, 0.22, 0.08, -5.00, 0.11, -0.36, wheelDark],
    [0.10, 0.10, 0.02, -4.00, 0.11, 0.405, rimGrey],
    [0.10, 0.10, 0.02, -4.00, 0.11, -0.405, rimGrey],
    [0.10, 0.10, 0.02, -5.00, 0.11, 0.405, rimGrey],
    [0.10, 0.10, 0.02, -5.00, 0.11, -0.405, rimGrey],

    // Underfloor Equipment Pods & Skirt (between bogies)
    [5.60, 0.12, 0.68, -0.25, 0.11, 0, fairingDark],
    [2.20, 0.08, 0.72, -0.40, 0.09, 0, chassisDark],

    // --- 2. Main Body & Livery (White Body, Gold & Speed Blue Stripes) ---
    // Lower White Skirt
    [11.00, 0.16, 0.80, -1.30, 0.24, 0, whiteBody],
    // Gold Speed Stripe (Delta = 0.04 over body width)
    [11.00, 0.04, 0.84, -1.30, 0.34, 0, goldStripe, true],
    // Speed Blue Stripe (Delta = 0.04)
    [11.00, 0.14, 0.84, -1.30, 0.43, 0, speedBlue, true],
    // White Belt below Windows
    [11.00, 0.07, 0.80, -1.30, 0.535, 0, whiteBody],

    // Passenger Door (curbside & opposite behind cab at X = +3.60)
    [0.48, 0.50, 0.835, 3.60, 0.53, 0, whiteBody],
    [0.22, 0.24, 0.845, 3.60, 0.68, 0, glass],
    [0.04, 0.10, 0.85, 3.76, 0.48, 0, fairingDark],

    // Continuous Tinted Window Ribbon & Dividing Pillars (5 distinct passenger windows)
    [10.80, 0.24, 0.80, -1.30, 0.69, 0, glass],
    [0.40, 0.24, 0.825, 3.16, 0.69, 0, whiteBody],
    [0.24, 0.24, 0.825, 1.48, 0.69, 0, whiteBody],
    [0.24, 0.24, 0.825, -0.20, 0.69, 0, whiteBody],
    [0.24, 0.24, 0.825, -1.88, 0.69, 0, whiteBody],
    [0.24, 0.24, 0.825, -3.56, 0.69, 0, whiteBody],
    [1.65, 0.24, 0.825, -6.00, 0.69, 0, whiteBody],

    // Upper Cabin Wall & Lettering
    [11.00, 0.11, 0.80, -1.30, 0.865, 0, whiteBody],
    // "CITY EXPRESS" Blue Banner & White Lettering (Above windows)
    [3.60, 0.07, 0.84, -2.60, 0.87, 0, speedBlue, true],
    [3.20, 0.035, 0.85, -2.60, 0.87, 0, signWhite, true],
    // "A-1" Train Car Designation (Rear lower flank on blue stripe)
    [0.60, 0.06, 0.85, -5.80, 0.43, 0, signWhite, true],

    // --- 3. Aerodynamic Wedge Nose (Sapsan / Shinkansen profile) ---
    // Stepped nose base & speed accents
    [0.80, 0.16, 0.78, 4.60, 0.24, 0, whiteBody],
    [0.80, 0.04, 0.82, 4.60, 0.34, 0, goldStripe, true],
    [0.80, 0.14, 0.82, 4.60, 0.43, 0, speedBlue, true],
    [0.75, 0.16, 0.72, 5.375, 0.22, 0, whiteBody],
    [0.75, 0.12, 0.75, 5.375, 0.36, 0, speedBlue, true],
    [0.60, 0.04, 0.74, 5.30, 0.28, 0, goldStripe, true],
    [0.70, 0.16, 0.62, 6.10, 0.20, 0, whiteBody],
    [0.60, 0.08, 0.64, 6.05, 0.32, 0, speedBlue, true],
    [0.50, 0.16, 0.48, 6.70, 0.18, 0, whiteBody],
    [0.30, 0.10, 0.38, 6.90, 0.15, 0, whiteRoof],

    // Aerodynamic Sloped Driver Cockpit Windshield & Cab Brow
    [0.70, 0.20, 0.72, 4.65, 0.72, 0, glass],
    [0.65, 0.18, 0.66, 5.25, 0.58, 0, glass],
    [0.55, 0.14, 0.58, 5.75, 0.45, 0, glass],
    [0.50, 0.18, 0.79, 4.45, 0.70, 0, glass],
    [0.60, 0.08, 0.74, 4.40, 0.90, 0, speedBlue, true],
    [0.70, 0.06, 0.77, 4.55, 0.83, 0, speedBlue, true],

    // Front Nose Cheeks, Dynamic Blue Chevron & Twin Headlights
    [0.10, 0.12, 0.22, 6.46, 0.27, 0, speedBlue, true],
    [0.08, 0.12, 0.12, 6.46, 0.27, 0.19, spotlight, true],
    [0.08, 0.12, 0.12, 6.46, 0.27, -0.19, spotlight, true],
    [0.06, 0.05, 0.26, 6.66, 0.22, 0, spotlight, true],
    // High-Intensity Forward Rail Illumination Beam
    [4.20, 0.08, 0.96, 8.90, 0.10, 0, spotlight, true, 0.38],

    // --- 4. Curved Roof, Equipment Housing & Voxel Pantograph ---
    [11.40, 0.07, 0.76, -1.10, 0.935, 0, whiteRoof],
    [10.80, 0.05, 0.58, -1.30, 0.975, 0, whiteRoof],
    // Raised Roof Equipment Pod & Cooling Louvers
    [4.60, 0.10, 0.46, -0.50, 1.03, 0, roofPod],
    [4.20, 0.04, 0.36, -0.50, 1.09, 0, roofVent],
    [0.70, 0.02, 0.38, 0.80, 1.11, 0, chassisDark],
    [0.70, 0.02, 0.38, -0.50, 1.11, 0, chassisDark],
    [0.70, 0.02, 0.38, -1.80, 1.11, 0, chassisDark],

    // Voxel Pantograph (Mounting Base, 4 Insulators, Arms & Collector Head)
    [0.70, 0.04, 0.32, -4.00, 1.00, 0, fairingDark],
    [0.08, 0.06, 0.08, -3.80, 1.04, 0.12, rimGrey],
    [0.08, 0.06, 0.08, -3.80, 1.04, -0.12, rimGrey],
    [0.08, 0.06, 0.08, -4.20, 1.04, 0.12, rimGrey],
    [0.08, 0.06, 0.08, -4.20, 1.04, -0.12, rimGrey],
    [0.08, 0.04, 0.28, -4.15, 1.07, 0, fairingDark],
    [0.34, 0.05, 0.10, -3.95, 1.12, 0, fairingDark],
    [0.08, 0.06, 0.12, -3.75, 1.16, 0, roofVent],
    [0.30, 0.05, 0.08, -3.90, 1.20, 0, fairingDark],
    [0.10, 0.04, 0.44, -4.05, 1.24, 0, chassisDark],
    [0.06, 0.03, 0.38, -4.05, 1.265, 0, copperOrange, true],
    [0.08, 0.03, 0.04, -4.05, 1.22, 0.23, roofVent],
    [0.08, 0.03, 0.04, -4.05, 1.22, -0.23, roofVent],

    // --- 5. Rear End (Diaphragm Gangway, Coupler & Taillights) ---
    [0.12, 0.68, 0.78, -6.85, 0.56, 0, whiteBody],
    [0.14, 0.58, 0.46, -6.92, 0.54, 0, chassisDark],
    [0.22, 0.10, 0.24, -6.94, 0.18, 0, fairingDark],
    [0.06, 0.08, 0.08, -6.90, 0.28, 0.32, taillight, true],
    [0.06, 0.08, 0.08, -6.90, 0.28, -0.32, taillight, true],
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
