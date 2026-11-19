import type { UrbanVoxelSpec } from './urbanVehiclesExpansion.ts';
export function buildBus(_color: number): UrbanVoxelSpec[] {
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

export function buildSweeper(color: number): UrbanVoxelSpec[] {
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
    // 4 Heavy Road Wheels & Rims (center Y = 0.13, touches ground strictly at Y = 0)
    [0.26, 0.26, 0.12, 0.48, 0.13, 0.35, wheel],
    [0.26, 0.26, 0.12, 0.48, 0.13, -0.35, wheel],
    [0.12, 0.12, 0.03, 0.48, 0.13, 0.42, rim],
    [0.12, 0.12, 0.03, 0.48, 0.13, -0.42, rim],
    [0.26, 0.26, 0.12, -0.62, 0.13, 0.35, wheel],
    [0.26, 0.26, 0.12, -0.62, 0.13, -0.35, wheel],
    [0.12, 0.12, 0.03, -0.62, 0.13, 0.42, rim],
    [0.12, 0.12, 0.03, -0.62, 0.13, -0.42, rim],

    // Chassis Frame, Undercarriage Vacuum Unit & Bumpers
    [2.04, 0.12, 0.66, -0.08, 0.14, 0, frameDark],
    [0.40, 0.10, 0.48, -0.06, 0.06, 0, frameDark],
    [0.14, 0.14, 0.74, 0.78, 0.16, 0, frameDark],
    [0.10, 0.16, 0.72, -1.04, 0.18, 0, frameDark],

    // Front Dual Conical Sweeper Brushes (Clean 3-tier stepped solid volumes, zero coplanar faces)
    // Left Brush (Z = +0.38)
    [0.18, 0.05, 0.10, 0.86, 0.165, 0.38, frameDark],
    [0.24, 0.04, 0.24, 0.94, 0.12, 0.38, rim],
    [0.38, 0.05, 0.38, 0.94, 0.075, 0.38, brushCore],
    [0.48, 0.05, 0.48, 0.94, 0.025, 0.38, brushBristle],
    // Right Brush (Z = -0.38)
    [0.18, 0.05, 0.10, 0.86, 0.165, -0.38, frameDark],
    [0.24, 0.04, 0.24, 0.94, 0.12, -0.38, rim],
    [0.38, 0.05, 0.38, 0.94, 0.075, -0.38, brushCore],
    [0.48, 0.05, 0.48, 0.94, 0.025, -0.38, brushBristle],

    // Municipal Orange Cab Body, Front Grille, Headlights & Handles
    [0.72, 0.28, 0.70, 0.44, 0.34, 0, cabOrange],
    [0.03, 0.10, 0.12, 0.81, 0.34, 0.24, headlight, true],
    [0.03, 0.10, 0.12, 0.81, 0.34, -0.24, headlight, true],
    [0.03, 0.08, 0.26, 0.81, 0.34, 0, 0xc2410c],
    [0.06, 0.03, 0.03, 0.36, 0.36, 0.365, 0x0f172a],
    [0.06, 0.03, 0.03, 0.36, 0.36, -0.365, 0x0f172a],

    // Panoramic Windshield, Low Observation Glass & Cab Roof
    [0.04, 0.35, 0.61, 0.79, 0.655, 0, glass],
    [0.06, 0.35, 0.05, 0.79, 0.655, 0.33, cabOrange],
    [0.06, 0.35, 0.05, 0.79, 0.655, -0.33, cabOrange],
    [0.55, 0.35, 0.03, 0.45, 0.655, 0.34, glass],
    [0.55, 0.35, 0.03, 0.45, 0.655, -0.34, glass],
    [0.20, 0.12, 0.02, 0.65, 0.41, 0.36, glass],
    [0.20, 0.12, 0.02, 0.65, 0.41, -0.36, glass],
    [0.08, 0.35, 0.70, 0.12, 0.655, 0, cabOrange],
    [0.72, 0.06, 0.72, 0.44, 0.86, 0, cabOrange],

    // Flashing Safety Beacon & Side Mirrors
    [0.16, 0.04, 0.16, 0.44, 0.91, 0, frameDark],
    [0.14, 0.12, 0.14, 0.44, 0.99, 0, beacon, true],
    [0.04, 0.03, 0.08, 0.72, 0.65, 0.39, 0x0f172a],
    [0.05, 0.14, 0.04, 0.72, 0.65, 0.44, 0x0f172a],
    [0.04, 0.03, 0.08, 0.72, 0.65, -0.39, 0x0f172a],
    [0.05, 0.14, 0.04, 0.72, 0.65, -0.44, 0x0f172a],

    // Rear Waste Hopper with Sloped / Stepped Chamfered Top & Taillights
    [1.08, 0.50, 0.72, -0.48, 0.47, 0, hopperGrey],
    [0.72, 0.06, 0.70, -0.34, 0.75, 0, hopperDark],
    [0.16, 0.06, 0.70, -0.78, 0.72, 0, hopperDark],
    [0.12, 0.06, 0.70, -0.90, 0.66, 0, hopperDark],
    [0.08, 0.08, 0.70, -0.98, 0.59, 0, hopperDark],
    [0.03, 0.10, 0.12, -1.03, 0.36, 0.26, taillight, true],
    [0.03, 0.10, 0.12, -1.03, 0.36, -0.26, taillight, true],

    // Solid Contrast Black Hazard Band Plate (Z = +/-0.375)
    [0.96, 0.12, 0.03, -0.48, 0.34, 0.375, hazardDark],
    [0.96, 0.12, 0.03, -0.48, 0.34, -0.375, hazardDark],
  ];

  // Alternating Hazard Chevrons (Yellow Slanted Slashes sitting cleanly at Z = +/-0.395)
  for (let x = -0.08; x >= -0.88; x -= 0.13) {
    specs.push([0.05, 0.055, 0.02, x, 0.31, 0.395, hazardYellow, true]);
    specs.push([0.05, 0.055, 0.02, x - 0.035, 0.365, 0.395, hazardYellow, true]);
    specs.push([0.05, 0.055, 0.02, x, 0.31, -0.395, hazardYellow, true]);
    specs.push([0.05, 0.055, 0.02, x - 0.035, 0.365, -0.395, hazardYellow, true]);
  }

  // Relief "STREET SWEEP" Typography (Clean non-overlapping macro glyph blocks at Z = +/-0.375)
  const addGlyph = (type: string, cx: number, cy: number) => {
    const addBox = (w: number, h: number, x: number, y: number) => {
      specs.push([w, h, 0.03, x, y, 0.375, labelWhite, true]);
      specs.push([w, h, 0.03, x, y, -0.375, labelWhite, true]);
    };
    if (type === 'S') {
      addBox(0.08, 0.02, cx, cy + 0.04);
      addBox(0.08, 0.02, cx, cy);
      addBox(0.08, 0.02, cx, cy - 0.04);
      addBox(0.025, 0.02, cx - 0.0275, cy + 0.02);
      addBox(0.025, 0.02, cx + 0.0275, cy - 0.02);
    } else if (type === 'T') {
      addBox(0.08, 0.02, cx, cy + 0.04);
      addBox(0.025, 0.08, cx, cy - 0.01);
    } else if (type === 'R') {
      addBox(0.025, 0.10, cx - 0.0275, cy);
      addBox(0.055, 0.02, cx + 0.0125, cy + 0.04);
      addBox(0.055, 0.02, cx + 0.0125, cy);
      addBox(0.025, 0.02, cx + 0.0275, cy + 0.02);
      addBox(0.025, 0.04, cx + 0.0275, cy - 0.03);
    } else if (type === 'E') {
      addBox(0.025, 0.10, cx - 0.0275, cy);
      addBox(0.055, 0.02, cx + 0.0125, cy + 0.04);
      addBox(0.045, 0.02, cx + 0.0075, cy);
      addBox(0.055, 0.02, cx + 0.0125, cy - 0.04);
    } else if (type === 'W') {
      addBox(0.025, 0.10, cx - 0.035, cy);
      addBox(0.025, 0.10, cx + 0.035, cy);
      addBox(0.02, 0.06, cx, cy - 0.02);
      addBox(0.09, 0.02, cx, cy - 0.04);
    } else if (type === 'P') {
      addBox(0.025, 0.10, cx - 0.0275, cy);
      addBox(0.055, 0.02, cx + 0.0125, cy + 0.04);
      addBox(0.055, 0.02, cx + 0.0125, cy);
      addBox(0.025, 0.02, cx + 0.0275, cy + 0.02);
    }
  };

  const streetWord = 'STREET';
  for (let i = 0; i < streetWord.length; i++) {
    addGlyph(streetWord[i], -0.16 - i * 0.11, 0.63);
  }
  const sweepWord = 'SWEEP';
  for (let i = 0; i < sweepWord.length; i++) {
    addGlyph(sweepWord[i], -0.21 - i * 0.11, 0.50);
  }

  return specs;
}

