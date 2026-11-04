import json
import os
import sys

def audit_bus():
    model_path = os.path.join(os.path.dirname(__file__), '..', 'assets', 'models', 'bus_cubes.json')
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
    roof = cube_map.get('roof_main_slab')
    ws = cube_map.get('windshield_lower')
    ws_up = cube_map.get('windshield_upper')
    rear_win = cube_map.get('rear_window_main')
    route_sign = cube_map.get('route_display_box')

    # Roof covering side windows from above
    side_windows = [c for c in cubes if 'window_l' in c['name'] or 'window_r' in c['name']]
    if roof and side_windows:
        for sw in side_windows:
            # Roof must reach or exceed side window X extent
            if '_l' in sw['name'] and sw['from'][0] < roof['from'][0]:
                airtight_issues.append(f"Roof does not cover {sw['name']} on left (sw {sw['from'][0]} < roof {roof['from'][0]})")
            if '_r' in sw['name'] and sw['to'][0] > roof['to'][0]:
                airtight_issues.append(f"Roof does not cover {sw['name']} on right (sw {sw['to'][0]} > roof {roof['to'][0]})")
            # Roof must cover window top Y
            if sw['to'][1] < roof['from'][1]:
                airtight_issues.append(f"Gap above {sw['name']} (sw top {sw['to'][1]} < roof bottom {roof['from'][1]})")

    # Windshield vs Route Sign vs Roof
    if ws and ws_up and route_sign and roof:
        if ws['to'][1] < ws_up['from'][1]:
            airtight_issues.append("Gap between lower and upper windshield")
        if ws_up['to'][1] < route_sign['from'][1]:
            airtight_issues.append("Gap between upper windshield and route display")
        if route_sign['to'][1] < roof['from'][1]:
            airtight_issues.append("Gap between route display and roof")

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

    # 8. Colors (Bus palette)
    colors = set(c.get('color', '') for c in cubes)
    expected_colors = {
        'busRed', 'busRedDark', 'busRedDeep',
        'roofWhite', 'glassSky', 'routeAmber',
        'trimBlack', 'rimSilver', 'bumperSilver',
        'bumperGuard', 'headlightIce', 'turnSignalAmber',
        'taillightRed', 'plateBlue', 'grilleMesh', 'tireBlack'
    }
    unknown_colors = colors - expected_colors

    # 9. Clearance check
    chassis = cube_map.get('chassis_spine')
    axle_f = cube_map.get('front_axle')
    axle_r = cube_map.get('rear_axle')
    clearance = min(
        chassis['from'][1] if chassis else 99,
        axle_f['from'][1] if axle_f else 99,
        axle_r['from'][1] if axle_r else 99
    )

    print(f"=== AUDIT RESULTS FOR bus_cubes.json ===")
    print(f"  1. Grid 0.05 errors: {len(q_errs)}")
    print(f"  2. Min Y: {min_y:.4f} (Grounded wheels: {len(grounded)}: {grounded}, Below Y=0: {len(below_zero)})")
    print(f"  3. Cube Count: {cube_count} (Limit 110-145)")
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
    print(f"  8. Ground Clearance: Y={clearance:.2f} ({clearance*0.05:.3f}m)")
    print(f"  9. Unknown Colors: {len(unknown_colors)}")
    if unknown_colors:
        print(f"     - {unknown_colors}")

    is_perfect = (
        len(q_errs) == 0 and
        abs(min_y - 0.0) < 1e-5 and
        len(grounded) >= 4 and
        len(below_zero) == 0 and
        110 <= cube_count <= 145 and
        len(coplanar_issues) == 0 and
        len(airtight_issues) == 0 and
        len(enclosed) == 0 and
        len(visited) == len(cubes) and
        clearance >= 2.00 and
        len(unknown_colors) == 0
    )
    return is_perfect

if __name__ == '__main__':
    ok = audit_bus()
    sys.exit(0 if ok else 1)
