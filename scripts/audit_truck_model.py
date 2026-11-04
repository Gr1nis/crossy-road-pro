import json
import os
import sys

def audit_truck():
    model_path = os.path.join(os.path.dirname(__file__), '..', 'assets', 'models', 'truck_cubes.json')
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
    box = cube_map.get('box_main_body')
    cab_floor = cube_map.get('cab_floor')
    ws = cube_map.get('windshield_cab')
    hood = cube_map.get('hood_cab_slab')
    cab_roof = cube_map.get('cab_roof_slab')
    door_l = cube_map.get('door_cab_l')
    door_r = cube_map.get('door_cab_r')
    win_l = cube_map.get('side_window_l')
    win_r = cube_map.get('side_window_r')

    # Cab to Cargo box
    if box and cab_floor:
        if cab_floor['to'][2] < box['from'][2]:
            airtight_issues.append(f"Gap between cab floor rear ({cab_floor['to'][2]}) and cargo box ({box['from'][2]})")

    # Windshield vs Hood & Roof
    if ws and hood and cab_roof:
        if hood['to'][1] < ws['from'][1]:
            airtight_issues.append(f"Gap between hood top ({hood['to'][1]}) and windshield bottom ({ws['from'][1]})")
        if ws['to'][1] < cab_roof['from'][1]:
            airtight_issues.append(f"Gap between windshield top ({ws['to'][1]}) and cab roof bottom ({cab_roof['from'][1]})")

    # Side windows: door underneath, roof on top
    if door_l and win_l and cab_roof:
        if door_l['to'][1] < win_l['from'][1]:
            airtight_issues.append(f"Gap below left side window ({door_l['to'][1]} < {win_l['from'][1]})")
        if door_l['from'][2] > win_l['from'][2] or door_l['to'][2] < win_l['to'][2]:
            airtight_issues.append("Door L does not fully cover Z span under side window L")
        if cab_roof['from'][0] > win_l['from'][0]:
            airtight_issues.append("Cab roof does not cover side window L in X")

    if door_r and win_r and cab_roof:
        if door_r['to'][1] < win_r['from'][1]:
            airtight_issues.append(f"Gap below right side window ({door_r['to'][1]} < {win_r['from'][1]})")
        if door_r['from'][2] > win_r['from'][2] or door_r['to'][2] < win_r['to'][2]:
            airtight_issues.append("Door R does not fully cover Z span under side window R")
        if cab_roof['to'][0] < win_r['to'][0]:
            airtight_issues.append("Cab roof does not cover side window R in X")

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

    # 8. Colors (Truck palette)
    colors = set(c.get('color', '') for c in cubes)
    expected_colors = {
        'truckGreen', 'truckGreenDark',
        'cargoWhite', 'trimBlack', 'rimSilver',
        'bumperSilver', 'bumperGuard', 'glassSky',
        'headlightIce', 'turnSignalAmber', 'taillightRed',
        'plateBlue', 'plateWhite', 'grilleMesh', 'tireBlack'
    }
    unknown_colors = colors - expected_colors

    # 9. Clearance check
    chassis_l = cube_map.get('chassis_rail_left')
    axle_f = cube_map.get('front_axle')
    axle_r = cube_map.get('rear_axle')
    clearance = min(
        chassis_l['from'][1] if chassis_l else 99,
        axle_f['from'][1] if axle_f else 99,
        axle_r['from'][1] if axle_r else 99
    )

    print(f"=== AUDIT RESULTS FOR truck_cubes.json (Box Delivery Van v3 - Feedback Applied) ===")
    print(f"  1. Grid 0.05 errors: {len(q_errs)}")
    print(f"  2. Min Y: {min_y:.4f} (Grounded wheels: {len(grounded)}: {grounded}, Below Y=0: {len(below_zero)})")
    print(f"  3. Cube Count: {cube_count} (Limit 90-120)")
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
    print(f"  8. Chassis Ground Clearance: Y={clearance:.2f} ({clearance*0.05:.3f}m)")
    print(f"  9. Unknown Colors: {len(unknown_colors)}")
    if unknown_colors:
        print(f"     - {unknown_colors}")

    is_perfect = (
        len(q_errs) == 0 and
        abs(min_y - 0.0) < 1e-5 and
        len(grounded) >= 4 and
        len(below_zero) == 0 and
        90 <= cube_count <= 120 and
        len(coplanar_issues) == 0 and
        len(airtight_issues) == 0 and
        len(enclosed) == 0 and
        len(visited) == len(cubes) and
        clearance >= 2.20 and
        len(unknown_colors) == 0
    )
    return is_perfect

if __name__ == '__main__':
    ok = audit_truck()
    sys.exit(0 if ok else 1)
