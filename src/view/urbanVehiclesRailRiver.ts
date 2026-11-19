import type { BiomeType } from '../core/types.ts';
import type { UrbanVoxelSpec } from './urbanVehiclesExpansion.ts';
export function buildTrain(): UrbanVoxelSpec[] {
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

export function buildPallet(length: number, biome: BiomeType = 'forest'): UrbanVoxelSpec[] {
  if (biome === 'winter') {
    // Winter: Ice floe / floating ice sheet with snowy surface (0xbae6fd, 0xe0f2fe, 0xf8fafc)
    const deepIce = 0x0369a1;  // Submerged keel
    const frostWake = 0xe0f2fe; // Frost/ice rime wake
    const iceBase = 0xbae6fd;   // Main translucent ice floe
    const midIce = 0xe0f2fe;    // Upper stepped ice shelf
    const snowTop = 0xf8fafc;   // Snowy crust
    const frostNotch = 0x7dd3fc;// Hop slot notches

    const specs: UrbanVoxelSpec[] = [
      [length * 0.90, 0.08, 0.64, 0, -0.06, 0, deepIce],
      [length + 0.16, 0.02, 0.86, 0, -0.02, 0, frostWake],
      [length * 0.96, 0.08, 0.72, 0, 0.03, 0, iceBase],
      [length * 0.86, 0.06, 0.62, 0, 0.09, 0, midIce],
      [length * 0.78, 0.05, 0.54, 0, 0.14, 0, snowTop],
      [length * 0.40, 0.04, 0.18, -length * 0.20, 0.16, -0.12, 0xf1f5f9],
      [length * 0.35, 0.04, 0.16, length * 0.22, 0.16, 0.10, 0xf1f5f9],
    ];

    const slotCount = Math.floor(length);
    for (let s = -Math.floor(slotCount / 2); s <= Math.floor(slotCount / 2); s++) {
      if (Math.abs(s) > 0.1 && Math.abs(s) < length / 2 - 0.2) {
        specs.push([0.05, 0.045, 0.60, s, 0.14, 0, frostNotch]);
      }
    }
    return specs;
  }

  if (biome === 'desert') {
    // Desert: Tied canyon timber raft (0x92400e, 0xb45309, 0x78350f)
    const waterColor = 0x0d9488;  // Canyon turquoise river
    const foamColor = 0xfef08a;   // Sandy foam ripples
    const bottomLogs = 0x78350f;  // Heavy weathered logs
    const ropeColor = 0xb45309;   // Bound rope lashings
    const topTimber = 0x92400e;   // Heavy timber cross boards

    const specs: UrbanVoxelSpec[] = [
      [length * 0.92, 0.08, 0.68, 0, -0.06, 0, waterColor],
      [length + 0.16, 0.02, 0.86, 0, -0.02, 0, foamColor],
      [length * 0.94, 0.08, 0.18, 0, 0.02, -0.25, bottomLogs],
      [length * 0.94, 0.08, 0.20, 0, 0.02, 0, bottomLogs],
      [length * 0.94, 0.08, 0.18, 0, 0.02, 0.25, bottomLogs],
    ];

    const blockXPositions = [-length * 0.42, 0, length * 0.42];
    for (const bx of blockXPositions) {
      specs.push([0.08, 0.10, 0.74, bx, 0.05, 0, ropeColor]);
      specs.push([0.14, 0.05, 0.72, bx, 0.10, 0, bottomLogs]);
    }

    const boardZ = [-0.28, -0.14, 0, 0.14, 0.28];
    for (const bz of boardZ) {
      specs.push([length, 0.04, 0.11, 0, 0.14, bz, topTimber]);
    }

    const slotCount = Math.floor(length);
    for (let s = -Math.floor(slotCount / 2); s <= Math.floor(slotCount / 2); s++) {
      if (Math.abs(s) > 0.1 && Math.abs(s) < length / 2 - 0.2) {
        specs.push([0.04, 0.045, 0.74, s, 0.14, 0, 0x78350f]);
      }
    }
    return specs;
  }

  if (biome === 'neon') {
    // Neon: Hover platform / cyber-barge with dark core and glowing cyan/magenta trim (0x0f172a, 0x06b6d4, 0xec4899)
    const energyField = 0x4338ca; // Magnetic levitation glow
    const cyanGlow = 0x06b6d4;    // Cyan trim & thrusters
    const magentaGlow = 0xec4899; // Magenta edge lights
    const darkChassis = 0x0f172a; // Obsidian carbon-fiber core
    const deckPlate = 0x1e1b4b;   // Deep indigo deck

    const specs: UrbanVoxelSpec[] = [
      [length * 0.90, 0.06, 0.64, 0, -0.05, 0, energyField, true],
      [length + 0.16, 0.02, 0.86, 0, -0.02, 0, cyanGlow, true],
      [length * 0.96, 0.08, 0.70, 0, 0.03, 0, darkChassis],
      [length * 0.90, 0.04, 0.62, 0, 0.09, 0, deckPlate],
      [length * 0.94, 0.05, 0.04, 0, 0.13, -0.30, magentaGlow, true],
      [length * 0.94, 0.05, 0.04, 0, 0.13, 0.30, magentaGlow, true],
      [0.40, 0.045, 0.20, 0, 0.12, 0, cyanGlow, true],
    ];

    const slotCount = Math.floor(length);
    for (let s = -Math.floor(slotCount / 2); s <= Math.floor(slotCount / 2); s++) {
      if (Math.abs(s) > 0.1 && Math.abs(s) < length / 2 - 0.2) {
        specs.push([0.05, 0.045, 0.58, s, 0.13, 0, cyanGlow, true]);
      }
    }
    return specs;
  }

  // Forest: Classic wooden pallet (0x78350f, 0xa16207)
  const timberColor = 0xa16207; // Light timber planks
  const darkWood = 0x78350f;    // Stringers, blocks, stamp
  const foamColor = 0xf8fafc;   // Water foam ripples
  const waterColor = 0x0284c7;  // Submerged keel

  const specs: UrbanVoxelSpec[] = [
    [length * 0.92, 0.08, 0.68, 0, -0.06, 0, waterColor],
    [length + 0.16, 0.02, 0.86, 0, -0.02, 0, foamColor],
    [length * 0.94, 0.04, 0.12, 0, 0.01, -0.28, darkWood],
    [length * 0.94, 0.04, 0.12, 0, 0.01, 0, darkWood],
    [length * 0.94, 0.04, 0.12, 0, 0.01, 0.28, darkWood],
  ];

  const blockXPositions = [-length * 0.42, 0, length * 0.42];
  for (const bx of blockXPositions) {
    specs.push([0.14, 0.06, 0.12, bx, 0.05, -0.28, darkWood]);
    specs.push([0.14, 0.06, 0.12, bx, 0.05, 0, darkWood]);
    specs.push([0.14, 0.06, 0.12, bx, 0.05, 0.28, darkWood]);
  }

  for (const bx of blockXPositions) {
    specs.push([0.10, 0.04, 0.72, bx, 0.10, 0, darkWood]);
  }

  const boardZ = [-0.29, -0.15, 0, 0.15, 0.29];
  for (const bz of boardZ) {
    specs.push([length, 0.04, 0.11, 0, 0.14, bz, timberColor]);
  }

  specs.push([0.48, 0.042, 0.02, 0, 0.14, 0.35, darkWood]);

  const slotCount = Math.floor(length);
  for (let s = -Math.floor(slotCount / 2); s <= Math.floor(slotCount / 2); s++) {
    if (Math.abs(s) > 0.1 && Math.abs(s) < length / 2 - 0.2) {
      specs.push([0.04, 0.045, 0.74, s, 0.14, 0, 0x92400e]);
    }
  }

  return specs;
}

