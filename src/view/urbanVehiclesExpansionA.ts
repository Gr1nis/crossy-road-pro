import type { UrbanVoxelSpec } from './urbanVehiclesExpansion.ts';
export function buildTaxi(color: number = 0xfacc15): UrbanVoxelSpec[] {
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
    // 4 Wheels & Rims (center Y = 0.12, touches ground strictly at Y = 0)
    [0.24, 0.24, 0.12, 0.46, 0.12, 0.33, wheel],
    [0.24, 0.24, 0.12, 0.46, 0.12, -0.33, wheel],
    [0.24, 0.24, 0.12, -0.46, 0.12, 0.33, wheel],
    [0.24, 0.24, 0.12, -0.46, 0.12, -0.33, wheel],
    [0.12, 0.12, 0.03, 0.46, 0.12, 0.395, rim],
    [0.12, 0.12, 0.03, 0.46, 0.12, -0.395, rim],
    [0.12, 0.12, 0.03, -0.46, 0.12, 0.395, rim],
    [0.12, 0.12, 0.03, -0.46, 0.12, -0.395, rim],

    // Undercarriage base & Bumpers
    [1.36, 0.08, 0.58, 0, 0.08, 0, bumper],
    [0.12, 0.12, 0.68, 0.74, 0.16, 0, bumper],
    [0.12, 0.12, 0.68, -0.74, 0.16, 0, bumper],

    // Solid Monolithic Body (100% opaque, seamless solid tier)
    [1.38, 0.14, 0.64, 0, 0.19, 0, c],
    [0.50, 0.12, 0.64, 0.44, 0.32, 0, c],
    [0.30, 0.10, 0.64, -0.54, 0.31, 0, c],
    [0.58, 0.12, 0.64, -0.10, 0.32, 0, c],

    // Upper Cabin Glass Core & Roof
    [0.56, 0.18, 0.56, -0.10, 0.47, 0, glass],
    [0.08, 0.16, 0.56, 0.18, 0.46, 0, glass],
    [0.08, 0.16, 0.56, -0.38, 0.46, 0, glass],
    [0.56, 0.05, 0.62, -0.10, 0.585, 0, c],

    // Cabin Pillars (A, B, C pillars framing side windows)
    [0.06, 0.18, 0.05, 0.16, 0.47, 0.305, c],
    [0.06, 0.18, 0.05, 0.16, 0.47, -0.305, c],
    [0.08, 0.18, 0.05, -0.10, 0.47, 0.305, c],
    [0.08, 0.18, 0.05, -0.10, 0.47, -0.305, c],
    [0.08, 0.18, 0.05, -0.36, 0.47, 0.305, c],
    [0.08, 0.18, 0.05, -0.36, 0.47, -0.305, c],

    // Door Handles & Side Mirrors
    [0.07, 0.03, 0.04, 0.06, 0.30, 0.34, black],
    [0.07, 0.03, 0.04, 0.06, 0.30, -0.34, black],
    [0.07, 0.03, 0.04, -0.22, 0.30, 0.34, black],
    [0.07, 0.03, 0.04, -0.22, 0.30, -0.34, black],
    [0.04, 0.03, 0.06, 0.16, 0.43, 0.35, black],
    [0.04, 0.03, 0.06, 0.16, 0.43, -0.35, black],
    [0.05, 0.07, 0.04, 0.16, 0.43, 0.39, black],
    [0.05, 0.07, 0.04, 0.16, 0.43, -0.39, black],

    // Front Fascia: Grille Slats, Headlights, Turn Signals & Blue "CITY" Plate
    [0.04, 0.10, 0.30, 0.70, 0.31, 0, glass],
    [0.03, 0.02, 0.26, 0.73, 0.34, 0, rim],
    [0.03, 0.02, 0.26, 0.73, 0.31, 0, rim],
    [0.03, 0.02, 0.26, 0.73, 0.28, 0, rim],
    [0.04, 0.09, 0.11, 0.71, 0.31, 0.22, headlight, true],
    [0.04, 0.09, 0.11, 0.71, 0.31, -0.22, headlight, true],
    [0.04, 0.09, 0.06, 0.71, 0.31, 0.29, turnSignal, true],
    [0.04, 0.09, 0.06, 0.71, 0.31, -0.29, turnSignal, true],
    [0.05, 0.08, 0.22, 0.80, 0.16, 0, plateBlue, true],
    [0.02, 0.04, 0.16, 0.83, 0.16, 0, white, true],

    // Rear Fascia: Taillights & Blue Plate
    [0.04, 0.09, 0.13, -0.71, 0.30, 0.23, red, true],
    [0.04, 0.09, 0.13, -0.71, 0.30, -0.23, red, true],
    [0.04, 0.07, 0.18, -0.76, 0.16, 0, plateBlue, true],
    [0.02, 0.04, 0.12, -0.785, 0.16, 0, white, true],

    // Roof TAXI Sign: Black Base, White Sign Box, Orange Beacon & Checkers
    [0.32, 0.04, 0.20, -0.10, 0.63, 0, black],
    [0.26, 0.12, 0.16, -0.09, 0.71, 0, white, true],
    [0.06, 0.10, 0.12, -0.23, 0.71, 0, turnSignal, true],
    [0.05, 0.04, 0.02, -0.16, 0.73, 0.09, black],
    [0.05, 0.04, 0.02, -0.08, 0.73, 0.09, black],
    [0.05, 0.04, 0.02, 0.00, 0.73, 0.09, black],
    [0.05, 0.04, 0.02, -0.12, 0.68, 0.09, black],
    [0.05, 0.04, 0.02, -0.04, 0.68, 0.09, black],
    [0.05, 0.04, 0.02, -0.16, 0.73, -0.09, black],
    [0.05, 0.04, 0.02, -0.08, 0.73, -0.09, black],
    [0.05, 0.04, 0.02, 0.00, 0.73, -0.09, black],
    [0.05, 0.04, 0.02, -0.12, 0.68, -0.09, black],
    [0.05, 0.04, 0.02, -0.04, 0.68, -0.09, black],
  ];

  // Side Checkerboard Pattern on Front & Rear Fenders (Solid non-overlapping blocks)
  const frontXs = [0.33, 0.40, 0.47, 0.54];
  for (let i = 0; i < frontXs.length; i++) {
    const fx = frontXs[i];
    const topCol = i % 2 === 0 ? black : white;
    const btmCol = i % 2 === 0 ? white : black;
    specs.push([0.065, 0.035, 0.03, fx, 0.335, 0.335, topCol, true]);
    specs.push([0.065, 0.035, 0.03, fx, 0.30, 0.335, btmCol, true]);
    specs.push([0.065, 0.035, 0.03, fx, 0.335, -0.335, topCol, true]);
    specs.push([0.065, 0.035, 0.03, fx, 0.30, -0.335, btmCol, true]);
  }

  const rearXs = [-0.43, -0.50, -0.57, -0.64];
  for (let i = 0; i < rearXs.length; i++) {
    const rx = rearXs[i];
    const topCol = i % 2 === 0 ? black : white;
    const btmCol = i % 2 === 0 ? white : black;
    specs.push([0.065, 0.035, 0.03, rx, 0.335, 0.335, topCol, true]);
    specs.push([0.065, 0.035, 0.03, rx, 0.30, 0.335, btmCol, true]);
    specs.push([0.065, 0.035, 0.03, rx, 0.335, -0.335, topCol, true]);
    specs.push([0.065, 0.035, 0.03, rx, 0.30, -0.335, btmCol, true]);
  }

  return specs;
}

export function buildScooter(color: number = 0x84cc16): UrbanVoxelSpec[] {
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

