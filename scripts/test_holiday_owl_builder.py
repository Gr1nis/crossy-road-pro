import json
import os
import sys

sys.path.insert(0, 'scripts')
from solve_holiday_owl import build_holiday_owl, check_quantization
from blockbench_coplanar_check import blockbench_check

if __name__ == '__main__':
    cubes = build_holiday_owl()
    print(f"Total cubes count: {len(cubes)}")
    assert 50 <= len(cubes) <= 70, f"Budget 50-70 violated: {len(cubes)}"

    # Check 1: Quantization (every coord multiple of 0.05)
    quant_errors = check_quantization(cubes)
    print(f"Quantization errors: {len(quant_errors)}")
    for qe in quant_errors:
        print("  ", qe)
    assert len(quant_errors) == 0, "Must have 0 quantization errors"

    # Check 2: Grounding (min Y == 0.00, exactly 2 grounded foot pads)
    min_y = min(c['from'][1] for c in cubes)
    grounded = [c['name'] for c in cubes if c['from'][1] == 0.0]
    print(f"Min Y: {min_y:.2f}, Grounded foot pads ({len(grounded)}): {grounded}")
    assert min_y == 0.0, "Min Y must be 0.00"
    assert len(grounded) == 2, "Must have exactly 2 grounded foot pads"
    assert 'foot_pad_left' in grounded and 'foot_pad_right' in grounded

    # Check 3: Coplanar overlaps
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
            # Connected if positive overlap in all 3 dimensions
            if ox > 0.001 and oy > 0.001 and oz > 0.001:
                adj[i].append(j)
                adj[j].append(i)

    # BFS from root cube (body_torso_mid)
    names = [c['name'] for c in cubes]
    root_idx = names.index('body_torso_mid')
    visited = set([root_idx])
    queue = [root_idx]
    while queue:
        curr = queue.pop(0)
        for neighbor in adj[curr]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

    unconnected = [names[i] for i in range(n) if i not in visited]
    print(f"Connected cubes: {len(visited)}/{n}")
    if unconnected:
        print(f"Unconnected cubes: {unconnected}")
    assert len(visited) == n, f"Mesh has floating parts: {unconnected}"

    print("\nALL 5 QUALITY GATES PASSED: Holiday Owl (Rare [Owl]) is 100% compliant!")
