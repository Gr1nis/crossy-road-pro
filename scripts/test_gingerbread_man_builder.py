import json
import os
import sys

sys.path.insert(0, 'scripts')
from solve_gingerbread_man import build_gingerbread_man, check_quantization
from blockbench_coplanar_check import blockbench_check

if __name__ == '__main__':
    cubes = build_gingerbread_man()
    print(f"Total cubes count: {len(cubes)}")
    assert 55 <= len(cubes) <= 70, f"Budget 55-70 violated: {len(cubes)}"

    # Check 1: Quantization (every coord multiple of 0.05)
    quant_errors = check_quantization(cubes)
    print(f"Quantization errors: {len(quant_errors)}")
    for qe in quant_errors:
        print("  ", qe)
    assert len(quant_errors) == 0, "Must have 0 quantization errors"

    # Check 2: Grounding (min Y == 0.00, exactly 2 grounded foot soles)
    min_y = min(c['from'][1] for c in cubes)
    grounded = [c['name'] for c in cubes if c['from'][1] == 0.0]
    print(f"Min Y: {min_y:.2f}, Grounded foot soles ({len(grounded)}): {grounded}")
    assert min_y == 0.0, "Min Y must be 0.00"
    assert len(grounded) == 2, "Must have exactly 2 grounded foot soles"
    assert 'foot_sole_left' in grounded and 'foot_sole_right' in grounded

    # Check 3: Coplanar overlaps (Zero Z-fighting)
    issues = blockbench_check(cubes)
    print(f"Coplanar overlaps: {len(issues)}")
    for iss in issues:
        print(f"  ISSUE: {iss['c1']} vs {iss['c2']} on {iss['axis']} = {iss['plane']} ({iss['col1']} vs {iss['col2']})")
    assert len(issues) == 0, f"Must have 0 coplanar overlaps, got {len(issues)}"

    # Check 4: Connectivity graph (Watertight / Monolithic solid core)
    # Build adjacency list: two cubes connect if their boxes overlap or share a surface
    n = len(cubes)
    adj = {i: [] for i in range(n)}
    for i in range(n):
        c1 = cubes[i]
        f1, t1 = c1['from'], c1['to']
        for j in range(i + 1, n):
            c2 = cubes[j]
            f2, t2 = c2['from'], c2['to']
            ox = min(t1[0], t2[0]) - max(f1[0], f2[0])
            oy = min(t1[1], t2[1]) - max(f1[1], f2[1])
            oz = min(t1[2], t2[2]) - max(f1[2], f2[2])
            # Connected if positive overlap or contact
            if ox >= -0.01 and oy >= -0.01 and oz >= -0.01:
                adj[i].append(j)
                adj[j].append(i)

    visited = set()
    queue = [0]
    visited.add(0)
    while queue:
        curr = queue.pop(0)
        for nbr in adj[curr]:
            if nbr not in visited:
                visited.add(nbr)
                queue.append(nbr)

    unreachable = [cubes[i]['name'] for i in range(n) if i not in visited]
    print(f"Connected components: {len(visited)} / {n} reachable from foot_sole_left")
    if unreachable:
        print(f"Unreachable / Floating cubes ({len(unreachable)}): {unreachable}")
    assert len(visited) == n, f"All cubes must form a single connected solid structure! Unreachable: {unreachable}"

    print("ALL 5 RIGOROUS CHECKS PASSED PERFECTLY!")
