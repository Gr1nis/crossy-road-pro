import json
import os
import sys

def audit_taxi():
    model_path = os.path.join(os.path.dirname(__file__), '..', 'assets', 'models', 'taxi_cubes.json')
    if not os.path.exists(model_path):
        print(f"ERROR: {model_path} does not exist")
        return False

    with open(model_path, 'r', encoding='utf-8') as f:
        cubes = json.load(f)

    cube_map = {c['name']: c for c in cubes}

    # 1. Quantization
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

    # 3. Budget
    cube_count = len(cubes)

    # 4. Coplanar check
    sys.path.insert(0, os.path.dirname(__file__))
    from blockbench_coplanar_check import blockbench_check
    coplanar_issues = blockbench_check(cubes)

    # 5. Airtight envelope checks
    airtight_issues = []
    roof = cube_map.get('roof_main_slab')
    door_l = cube_map.get('door_lower_left')
    door_r = cube_map.get('door_lower_right')
    ws = cube_map.get('windshield_clean')
    rw = cube_map.get('rear_window_clean')
    hood = cube_map.get('hood_main_slab')
    trunk = cube_map.get('trunk_main_slab')

    if roof and ws and rw and hood and trunk:
        # Windshield
        if hood['to'][1] < ws['from'][1]:
            airtight_issues.append("Gap between hood and windshield")
        if ws['to'][1] < roof['from'][1]:
            airtight_issues.append("Gap between windshield and roof")
        # Rear window
        if trunk['to'][1] < rw['from'][1]:
            airtight_issues.append("Gap between trunk and rear window")
        if rw['to'][1] < roof['from'][1]:
            airtight_issues.append("Gap between rear window and roof")
        # Side windows
        for swn in ['side_window_fl', 'side_window_rl', 'side_window_fr', 'side_window_rr']:
            sw = cube_map.get(swn)
            if sw:
                if sw['to'][1] < roof['from'][1]:
                    airtight_issues.append(f"Gap above {swn}")
                dr = door_l if 'l' in swn else door_r
                if dr and dr['to'][1] < sw['from'][1]:
                    airtight_issues.append(f"Gap below {swn}")

    # 6. Hollow shell (enclosed cubes)
    enclosed = []
    for i, c1 in enumerate(cubes):
        f1, t1 = c1['from'], c1['to']
        for j, c2 in enumerate(cubes):
            if i == j: continue
            f2, t2 = c2['from'], c2['to']
            if f2[0] <= f1[0] and t2[0] >= t1[0] and f2[1] <= f1[1] and t2[1] >= t1[1] and f2[2] <= f1[2] and t2[2] >= t1[2]:
                enclosed.append((c1['name'], c2['name']))

    # 7. Connectivity
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

    # 8. Colors
    colors = set(c.get('color', '') for c in cubes)
    expected_colors = {
        'taxiYellow', 'taxiYellowDark', 'taxiYellowDeep',
        'checkerBlack', 'checkerWhite', 'tireBlack', 'tireTread',
        'rimSilver', 'bumperSilver', 'bumperGuard', 'glassDark',
        'headlightLemon', 'turnSignalOrange', 'taillightRed',
        'plateBlue', 'grilleMesh'
    }
    unknown_colors = colors - expected_colors

    print(f"Audit results for taxi_cubes.json:")
    print(f"  1. Grid 0.05 errors: {len(q_errs)}")
    print(f"  2. Min Y: {min_y:.4f} (Grounded: {len(grounded)}, Below Y=0: {len(below_zero)})")
    print(f"  3. Cube Count: {cube_count} (Limit 80-110)")
    print(f"  4. Coplanar Overlaps: {len(coplanar_issues)}")
    print(f"  5. Airtight Issues: {len(airtight_issues)}")
    print(f"  6. Fully Enclosed Cubes (Hollow Shell): {len(enclosed)}")
    print(f"  7. Connected Cubes: {len(visited)} / {len(cubes)}")
    print(f"  8. Unknown Colors: {len(unknown_colors)}")

    is_perfect = (
        len(q_errs) == 0 and
        abs(min_y - 0.0) < 1e-5 and
        len(grounded) == 4 and
        len(below_zero) == 0 and
        80 <= cube_count <= 110 and
        len(coplanar_issues) == 0 and
        len(airtight_issues) == 0 and
        len(enclosed) == 0 and
        len(visited) == len(cubes) and
        len(unknown_colors) == 0
    )
    return is_perfect

if __name__ == '__main__':
    ok = audit_taxi()
    sys.exit(0 if ok else 1)
