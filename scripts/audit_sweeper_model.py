import json
import os
import sys

def audit_sweeper():
    model_path = os.path.join(os.path.dirname(__file__), '..', 'assets', 'models', 'sweeper_cubes.json')
    if not os.path.exists(model_path):
        print(f"ERROR: {model_path} does not exist")
        return False

    with open(model_path, 'r', encoding='utf-8') as f:
        cubes = json.load(f)

    cube_map = {c['name']: c for c in cubes}

    # 1. Quantization (Grid 0.05)
    q_errs = []
    for c in cubes:
        name = c['name']
        for i, ax in enumerate(['x', 'y', 'z']):
            f_val = c['from'][i]
            t_val = c['to'][i]
            size = t_val - f_val
            if size <= 0:
                q_errs.append(f"{name}: non-positive size {ax}={size}")
            if abs(f_val * 20 - round(f_val * 20)) > 1e-4:
                q_errs.append(f"{name}: from[{ax}]={f_val}")
            if abs(t_val * 20 - round(t_val * 20)) > 1e-4:
                q_errs.append(f"{name}: to[{ax}]={t_val}")

    # 2. Grounding
    min_y = min(c['from'][1] for c in cubes)
    grounded = [c['name'] for c in cubes if abs(c['from'][1] - 0.0) < 1e-5]
    below_zero = [c['name'] for c in cubes if c['from'][1] < -1e-5]

    # 3. Budget & Bounds
    cube_count = len(cubes)
    min_x = min(c['from'][0] for c in cubes)
    max_x = max(c['to'][0] for c in cubes)
    max_y = max(c['to'][1] for c in cubes)
    min_z = min(c['from'][2] for c in cubes)
    max_z = max(c['to'][2] for c in cubes)
    width = max_x - min_x
    height = max_y - min_y
    length = max_z - min_z

    # 4. Coplanar check (Zero Z-Fighting)
    sys.path.insert(0, os.path.dirname(__file__))
    from blockbench_coplanar_check import blockbench_check
    coplanar_issues = blockbench_check(cubes)

    # 5. Airtight envelope checks
    airtight_issues = []
    cab_floor = cube_map.get('cab_lower_floor')
    fascia = cube_map.get('cab_front_fascia_lower')
    windshield = cube_map.get('windshield_panoramic')
    cab_roof = cube_map.get('cab_roof_slab')
    hopper_floor = cube_map.get('hopper_floor_base')
    hopper_tank = cube_map.get('hopper_main_tank')
    hopper_roof = cube_map.get('hopper_roof_top') or cube_map.get('hopper_roof_slab')

    if cab_floor and fascia:
        if cab_floor['to'][2] < fascia['from'][2]:
            airtight_issues.append("Gap between cab floor and front fascia")
    if fascia and windshield:
        if fascia['to'][1] < windshield['from'][1]:
            airtight_issues.append("Gap between front fascia and windshield")
    if windshield and cab_roof:
        if windshield['to'][1] < cab_roof['from'][1]:
            airtight_issues.append("Gap between windshield and cab roof")
    if cab_floor and hopper_floor:
        if cab_floor['to'][2] < hopper_floor['from'][2]:
            airtight_issues.append("Gap between cab floor and hopper floor")
    if hopper_tank and hopper_roof:
        if hopper_tank['to'][1] < hopper_roof['from'][1]:
            airtight_issues.append("Gap between hopper tank and hopper roof")

    # 6. Hollow shell (enclosed cubes)
    enclosed = []
    for i, c1 in enumerate(cubes):
        f1, t1 = c1['from'], c1['to']
        for j, c2 in enumerate(cubes):
            if i == j: continue
            f2, t2 = c2['from'], c2['to']
            if f2[0] <= f1[0] and t2[0] >= t1[0] and f2[1] <= f1[1] and t2[1] >= t1[1] and f2[2] <= f1[2] and t2[2] >= t1[2]:
                enclosed.append((c1['name'], c2['name']))

    # 7. Connectivity (Solid Core)
    n = len(cubes)
    adj = {i: set() for i in range(n)}
    tol = 0.15
    for i in range(n):
        c1 = cubes[i]
        f1, t1 = c1['from'], c1['to']
        for j in range(i + 1, n):
            c2 = cubes[j]
            f2, t2 = c2['from'], c2['to']
            ox = min(t1[0], t2[0]) - max(f1[0], f2[0])
            oy = min(t1[1], t2[1]) - max(f1[1], f2[1])
            oz = min(t1[2], t2[2]) - max(f1[2], f2[2])
            if ox >= -tol and oy >= -tol and oz >= -tol:
                adj[i].add(j)
                adj[j].add(i)

    visited = set()
    queue = [i for i, c in enumerate(cubes) if abs(c['from'][1] - 0.0) < 1e-5]
    for q in queue:
        visited.add(q)
    while queue:
        curr = queue.pop(0)
        for nbr in adj[curr]:
            if nbr not in visited:
                visited.add(nbr)
                queue.append(nbr)

    # 8. Colors (Municipal Sweeper Palette)
    colors = set(c.get('color', '') for c in cubes)
    expected_colors = {
        'sweeperOrange', 'sweeperOrangeDark', 'hopperGrey', 'hopperGreyDark',
        'chevronYellow', 'tireBlack', 'tireTread', 'rimSilver',
        'metalChrome', 'brushBristlesDark', 'glassSky', 'headlightIce',
        'beaconAmber', 'taillightRed', 'letteringWhite', 'trimDark'
    }
    unknown_colors = colors - expected_colors

    # 9. Ground Clearance
    chassis = cube_map.get('chassis_spine')
    suction = cube_map.get('vacuum_suction_box')
    brush_l = cube_map.get('brush_skirt_flare_l')
    brush_r = cube_map.get('brush_skirt_flare_r')
    chassis_clearance = chassis['from'][1] if chassis else 99
    suction_clearance = suction['from'][1] if suction else 99
    brush_clearance = min(brush_l['from'][1] if brush_l else 99, brush_r['from'][1] if brush_r else 99)

    print(f"=== AUDIT RESULTS FOR sweeper_cubes.json (Municipal Street Sweeper v1) ===")
    print(f"  1. Grid 0.05 errors: {len(q_errs)}")
    print(f"  2. Min Y: {min_y:.4f} (Grounded wheels: {len(grounded)}: {grounded}, Below Y=0: {len(below_zero)})")
    print(f"  3. Cube Count: {cube_count} (Limit 85-115)")
    print(f"     Bounds: W={width:.2f} ({width*0.05:.3f}m), H={height:.2f} ({height*0.05:.3f}m), L={length:.2f} ({length*0.05:.3f}m)")
    print(f"  4. Coplanar Overlaps: {len(coplanar_issues)}")
    if coplanar_issues:
        for iss in coplanar_issues:
            print(f"     - {iss['c1']} vs {iss['c2']} on {iss['axis']}={iss['plane']}")
    print(f"  5. Airtight Envelope Issues: {len(airtight_issues)}")
    if airtight_issues:
        for err in airtight_issues:
            print(f"     - {err}")
    print(f"  6. Fully Enclosed Cubes (Hollow Shell): {len(enclosed)}")
    if enclosed:
        for c1, c2 in enclosed:
            print(f"     - {c1} inside {c2}")
    print(f"  7. Connected Cubes: {len(visited)} / {len(cubes)}")
    print(f"  8. Clearances: Chassis Y={chassis_clearance:.2f} ({chassis_clearance*0.05:.3f}m), Suction Nozzle Y={suction_clearance:.2f} ({suction_clearance*0.05:.3f}m), Sweeper Brushes Y={brush_clearance:.2f} ({brush_clearance*0.05:.3f}m)")
    print(f"  9. Unknown Colors: {len(unknown_colors)}")
    if unknown_colors:
        print(f"     - {unknown_colors}")

    passed = (
        len(q_errs) == 0 and
        min_y == 0.0 and
        len(below_zero) == 0 and
        85 <= cube_count <= 115 and
        len(coplanar_issues) == 0 and
        len(airtight_issues) == 0 and
        len(enclosed) == 0 and
        len(visited) == len(cubes) and
        len(unknown_colors) == 0
    )
    return passed

if __name__ == '__main__':
    ok = audit_sweeper()
    sys.exit(0 if ok else 1)
