import json
import os

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(ROOT_DIR, 'assets', 'models')
VIEW_DIR = os.path.join(ROOT_DIR, 'src', 'view')

palettes = {
    'taxi': {
        'taxiYellow': 0xf59e0b,
        'taxiYellowDark': 0xd97706,
        'taxiYellowDeep': 0xb45309,
        'checkerBlack': 0x1e293b,
        'checkerWhite': 0xf8fafc,
        'tireBlack': 0x0f172a,
        'tireTread': 0x1e293b,
        'rimSilver': 0xcbd5e1,
        'bumperSilver': 0x94a3b8,
        'bumperGuard': 0x475569,
        'glassDark': 0x0f172a,
        'headlightLemon': 0xfef08a,
        'turnSignalOrange': 0xf97316,
        'taillightRed': 0xef4444,
        'plateBlue': 0x2563eb,
        'grilleMesh': 0x334155,
    },
    'car': {
        'carBlue': 0x2563eb,
        'carBlueDark': 0x1d4ed8,
        'carBlueDeep': 0x1e40af,
        'trimBlack': 0x0f172a,
        'plateWhite': 0xf8fafc,
        'tireBlack': 0x0f172a,
        'tireTread': 0x1e293b,
        'rimSilver': 0xcbd5e1,
        'bumperSilver': 0x94a3b8,
        'bumperGuard': 0x334155,
        'glassSky': 0x38bdf8,
        'headlightIce': 0xe0f2fe,
        'turnSignalAmber': 0xf97316,
        'taillightRed': 0xef4444,
        'plateBlue': 0x1d4ed8,
        'grilleMesh': 0x1e293b,
    },
    'truck': {
        'truckGreen': 0x059669,
        'truckGreenDark': 0x047857,
        'truckGreenDeep': 0x064e3b,
        'trimBlack': 0x0f172a,
        'cargoWhite': 0xf8fafc,
        'tireBlack': 0x0f172a,
        'tireTread': 0x1e293b,
        'rimSilver': 0xcbd5e1,
        'bumperSilver': 0x94a3b8,
        'bumperGuard': 0x334155,
        'glassSky': 0x38bdf8,
        'headlightIce': 0xe0f2fe,
        'turnSignalAmber': 0xf97316,
        'taillightRed': 0xef4444,
        'plateBlue': 0x1d4ed8,
        'grilleMesh': 0x1e293b,
    },
    'bus': {
        'busRed': 0xdc2626,
        'busRedDark': 0xb91c1c,
        'busRedDeep': 0x991b1b,
        'trimBlack': 0x0f172a,
        'roofWhite': 0xf8fafc,
        'tireBlack': 0x0f172a,
        'tireTread': 0x1e293b,
        'rimSilver': 0xcbd5e1,
        'bumperSilver': 0x94a3b8,
        'bumperGuard': 0x334155,
        'glassSky': 0x38bdf8,
        'headlightIce': 0xe0f2fe,
        'routeAmber': 0xf59e0b,
        'taillightRed': 0xef4444,
        'plateBlue': 0x1d4ed8,
        'grilleMesh': 0x1e293b,
    },
    'scooter': {
        'scooterOrange': 0xea580c,
        'scooterOrangeDark': 0xc2410c,
        'scooterOrangeLight': 0xfb923c,
        'trimBlack': 0x0f172a,
        'boxPrimary': 0xfacc15,
        'tireBlack': 0x0f172a,
        'courierPants': 0x1e293b,
        'rimSilver': 0xcbd5e1,
        'metalChrome': 0x94a3b8,
        'bumperGuard': 0x334155,
        'glassSky': 0x38bdf8,
        'headlightIce': 0xe0f2fe,
        'turnSignalAmber': 0xf59e0b,
        'courierRed': 0xdc2626,
        'courierSkin': 0xfed7aa,
        'seatLeather': 0x334155,
    },
    'sweeper': {
        'sweeperOrange': 0xea580c,
        'sweeperOrangeDark': 0xc2410c,
        'hopperGrey': 0x475569,
        'hopperGreyDark': 0x334155,
        'chevronYellow': 0xfacc15,
        'tireBlack': 0x0f172a,
        'tireTread': 0x1e293b,
        'rimSilver': 0xcbd5e1,
        'metalChrome': 0x94a3b8,
        'brushBristlesDark': 0x1e293b,
        'glassSky': 0x38bdf8,
        'headlightIce': 0xe0f2fe,
        'beaconAmber': 0xf59e0b,
        'taillightRed': 0xef4444,
        'letteringWhite': 0xf8fafc,
        'trimDark': 0x1e293b,
    },
    'pallet': {
        'woodDeckLight': 0xd97706,
        'woodDeckMid': 0xb45309,
        'woodDark': 0x92400e,
        'woodBlock': 0x78350f,
        'stampBurn': 0x451a03,
        'nailSteel': 0x94a3b8,
        'foamWhite': 0xf8fafc,
        'waterAqua': 0x0284c7,
    }
}

def load_cubes(name):
    path = os.path.join(MODELS_DIR, f"{name}_cubes.json")
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def fmt(num):
    s = f"{num:.4f}"
    if '.' in s:
        s = s.rstrip('0').rstrip('.')
        if not s:
            s = '0'
    return s

def generate_specs(cubes, palette_map, primary_color_name=None, primary_var='c'):
    lines = []
    for c in cubes:
        fx, fy, fz = c['from']
        tx, ty, tz = c['to']
        w = (tz - fz) * 0.05
        h = (ty - fy) * 0.05
        d = (tx - fx) * 0.05
        cx = -((fz + tz) / 2.0) * 0.05
        cy = ((fy + ty) / 2.0) * 0.05
        cz = ((fx + tx) / 2.0) * 0.05
        cname = c.get('color', '')
        if primary_color_name and cname == primary_color_name:
            col_expr = primary_var
        else:
            col_val = palette_map.get(cname, 0)
            col_expr = f"0x{col_val:06x}"
        lines.append(f"    [{fmt(w)}, {fmt(h)}, {fmt(d)}, {fmt(cx)}, {fmt(cy)}, {fmt(cz)}, {col_expr}],")
    return "\n".join(lines)

def run():
    # 1. Expansion A: Taxi (94 cubes) + Scooter (78 cubes)
    taxi_cubes = load_cubes('taxi')
    scooter_cubes = load_cubes('scooter')
    print(f"Loaded taxi: {len(taxi_cubes)} cubes, scooter: {len(scooter_cubes)} cubes")

    taxi_specs = generate_specs(taxi_cubes, palettes['taxi'], primary_color_name='taxiYellow', primary_var='c')
    scooter_specs = generate_specs(scooter_cubes, palettes['scooter'], primary_color_name='scooterOrange', primary_var='c')

    content_a = f"""import type {{ UrbanVoxelSpec }} from './urbanVehiclesExpansion.ts';

/** Model: NYC Checker Cab Taxi ({len(taxi_cubes)} cubes) */
export function buildTaxi(color: number = 0xf59e0b): UrbanVoxelSpec[] {{
  const c = !color ? 0xf59e0b : color;
  return [
{taxi_specs}
  ];
}}

/** Model: Delivery Scooter with Rider & Cargo Box ({len(scooter_cubes)} cubes) */
export function buildScooter(color: number = 0xea580c): UrbanVoxelSpec[] {{
  const c = !color ? 0xea580c : color;
  return [
{scooter_specs}
  ];
}}
"""
    with open(os.path.join(VIEW_DIR, 'urbanVehiclesExpansionA.ts'), 'w', encoding='utf-8') as f:
        f.write(content_a)
    print("Wrote urbanVehiclesExpansionA.ts")

    # 2. Expansion B: Bus (120 cubes) + Sweeper (103 cubes)
    bus_cubes = load_cubes('bus')
    sweeper_cubes = load_cubes('sweeper')
    print(f"Loaded bus: {len(bus_cubes)} cubes, sweeper: {len(sweeper_cubes)} cubes")

    bus_specs = generate_specs(bus_cubes, palettes['bus'], primary_color_name='busRed', primary_var='c')
    sweeper_specs = generate_specs(sweeper_cubes, palettes['sweeper'], primary_color_name='sweeperOrange', primary_var='c')

    content_b = f"""import type {{ UrbanVoxelSpec }} from './urbanVehiclesExpansion.ts';

/** Model: Double-Deck Transit Bus ({len(bus_cubes)} cubes) */
export function buildBus(color: number = 0xdc2626): UrbanVoxelSpec[] {{
  const c = !color ? 0xdc2626 : color;
  return [
{bus_specs}
  ];
}}

/** Model: Municipal Street Sweeper Truck ({len(sweeper_cubes)} cubes) */
export function buildSweeper(color: number = 0xea580c): UrbanVoxelSpec[] {{
  const c = !color ? 0xea580c : color;
  return [
{sweeper_specs}
  ];
}}
"""
    with open(os.path.join(VIEW_DIR, 'urbanVehiclesExpansionB.ts'), 'w', encoding='utf-8') as f:
        f.write(content_b)
    print("Wrote urbanVehiclesExpansionB.ts")

    # 3. Expansion: Car (87 cubes) + Truck (100 cubes)
    car_cubes = load_cubes('car')
    truck_cubes = load_cubes('truck')
    print(f"Loaded car: {len(car_cubes)} cubes, truck: {len(truck_cubes)} cubes")

    car_specs = generate_specs(car_cubes, palettes['car'], primary_color_name='carBlue', primary_var='c')
    truck_specs = generate_specs(truck_cubes, palettes['truck'], primary_color_name='truckGreen', primary_var='c')

    content_exp = f"""export type UrbanVoxelSpec = [
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

/** Model: Sports Sedan Car with Rear Spoiler ({len(car_cubes)} cubes) */
export function buildCar(color: number = 0x2563eb): UrbanVoxelSpec[] {{
  const c = !color ? 0x2563eb : color;
  return [
{car_specs}
  ];
}}

/** Model: Box Delivery Van Truck ({len(truck_cubes)} cubes) */
export function buildTruck(color: number = 0x059669): UrbanVoxelSpec[] {{
  const c = !color ? 0x059669 : color;
  return [
{truck_specs}
  ];
}}
"""
    with open(os.path.join(VIEW_DIR, 'urbanVehiclesExpansion.ts'), 'w', encoding='utf-8') as f:
        f.write(content_exp)
    print("Wrote urbanVehiclesExpansion.ts")

    # 4. Rail & River: Train (preserved) + Pallet (29 cubes)
    pallet_cubes = load_cubes('pallet')
    print(f"Loaded pallet: {len(pallet_cubes)} cubes")

    pallet_base_lines = []
    for c in pallet_cubes:
        fx, fy, fz = c['from']
        tx, ty, tz = c['to']
        w = (tz - fz) * 0.05
        h = (ty - fy) * 0.05
        d = (tx - fx) * 0.05
        cx = -((fz + tz) / 2.0) * 0.05
        cy = ((fy + ty) / 2.0) * 0.05
        cz = ((fx + tx) / 2.0) * 0.05
        cname = c.get('color', 'woodDeckLight')
        pallet_base_lines.append(f"  [{fmt(w)}, {fmt(h)}, {fmt(d)}, {fmt(cx)}, {fmt(cy)}, {fmt(cz)}, '{cname}'],")
    pallet_base_str = "\n".join(pallet_base_lines)

    # Read current buildTrain from urbanVehiclesRailRiver.ts
    with open(os.path.join(VIEW_DIR, 'urbanVehiclesRailRiver.ts'), 'r', encoding='utf-8') as f:
        old_rr = f.read()

    # Extract buildTrain function
    bt_start = old_rr.find('export function buildTrain')
    bp_start = old_rr.find('export function buildPallet')
    build_train_code = old_rr[bt_start:bp_start].strip()

    content_rr = f"""import type {{ BiomeType }} from '../core/types.ts';
import type {{ UrbanVoxelSpec }} from './urbanVehiclesExpansion.ts';

{build_train_code}

const PALLET_CUBES_BASE: readonly [number, number, number, number, number, number, string][] = [
{pallet_base_str}
];

const PALLET_BIOME_PALETTES: Record<BiomeType, Record<string, number>> = {{
  forest: {{
    woodDeckLight: 0xd97706,
    woodDeckMid: 0xb45309,
    woodDark: 0x92400e,
    woodBlock: 0x78350f,
    stampBurn: 0x451a03,
    nailSteel: 0x94a3b8,
    foamWhite: 0xf8fafc,
    waterAqua: 0x0284c7,
  }},
  winter: {{
    woodDeckLight: 0xe0f2fe,
    woodDeckMid: 0xbae6fd,
    woodDark: 0x38bdf8,
    woodBlock: 0x0284c7,
    stampBurn: 0x0369a1,
    nailSteel: 0xf8fafc,
    foamWhite: 0xf1f5f9,
    waterAqua: 0x0284c7,
  }},
  desert: {{
    woodDeckLight: 0xd97706,
    woodDeckMid: 0xb45309,
    woodDark: 0x78350f,
    woodBlock: 0x451a03,
    stampBurn: 0x292524,
    nailSteel: 0xa8a29e,
    foamWhite: 0xfef08a,
    waterAqua: 0x0d9488,
  }},
  neon: {{
    woodDeckLight: 0x1e1b4b,
    woodDeckMid: 0x312e81,
    woodDark: 0x0f172a,
    woodBlock: 0x4338ca,
    stampBurn: 0x06b6d4,
    nailSteel: 0xec4899,
    foamWhite: 0x06b6d4,
    waterAqua: 0x06b6d4,
  }},
}};

/** Model: EPAL-1 Euro Pallet with 4-Way Entry Tunnels and PALLET Brand Stamp (29 cubes) */
export function buildPallet(length: number, biome: BiomeType = 'forest'): UrbanVoxelSpec[] {{
  const pal = PALLET_BIOME_PALETTES[biome] ?? PALLET_BIOME_PALETTES.forest;
  const count = Math.max(1, Math.round(length));
  const halfSpan = (count - 1) * 0.5;
  const specs: UrbanVoxelSpec[] = [];

  for (let s = 0; s < count; s++) {{
    const xOffset = (s - halfSpan) * 1.0;
    for (let i = 0; i < PALLET_CUBES_BASE.length; i++) {{
      const b = PALLET_CUBES_BASE[i];
      if (b[6] === 'foamWhite') {{
        if (b[3] > 0.4 && s !== count - 1) continue;
        if (b[3] < -0.4 && s !== 0) continue;
      }}
      specs.push([b[0], b[1], b[2], b[3] + xOffset, b[4], b[5], pal[b[6]] ?? 0x78350f]);
    }}
  }}
  return specs;
}}
"""
    with open(os.path.join(VIEW_DIR, 'urbanVehiclesRailRiver.ts'), 'w', encoding='utf-8') as f:
        f.write(content_rr)
    print("Wrote urbanVehiclesRailRiver.ts")

if __name__ == '__main__':
    run()
