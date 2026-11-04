import json
import os
import sys

sys.path.insert(0, 'scripts')
from solve_santa_claus import build_santa_claus, check_quantization
from blockbench_coplanar_check import blockbench_check

def check_connectivity(cubes):
    # Two cubes are connected if their bounding boxes intersect or touch with tolerance
    n = len(cubes)
    adj = {i: set() for i in range(n)}
    tol = 0.06 # slightly above 0.05 step so touching faces connect
    for i in range(n):
        c1 = cubes[i]
        f1, t1 = c1['from'], c1['to']
        for j in range(i + 1, n):
            c2 = cubes[j]
            f2, t2 = c2['from'], c2['to']
            overlap_x = min(t1[0], t2[0]) - max(f1[0], f2[0])
            overlap_y = min(t1[1], t2[1]) - max(f1[1], f2[1])
            overlap_z = min(t1[2], t2[2]) - max(f1[2], f2[2])
            if overlap_x >= -tol and overlap_y >= -tol and overlap_z >= -tol:
                adj[i].add(j)
                adj[j].add(i)

    # BFS from grounded sole
    visited = set()
    queue = [0]
    visited.add(0)
    while queue:
        curr = queue.pop(0)
        for nbr in adj[curr]:
            if nbr not in visited:
                visited.add(nbr)
                queue.append(nbr)
    return visited

def run_all_checks():
    cubes = build_santa_claus()
    print(f"Total cubes: {len(cubes)}")
    assert 70 <= len(cubes) <= 80, f"Cube count {len(cubes)} outside Legendary budget 70-80"

    q_errs = check_quantization(cubes)
    print(f"Quantization errors: {len(q_errs)}")
    assert len(q_errs) == 0, f"Quantization errors found: {q_errs}"

    min_y = min(c['from'][1] for c in cubes)
    grounded = [c['name'] for c in cubes if c['from'][1] == 0.0]
    print(f"Min Y: {min_y}, grounded cubes: {grounded}")
    assert min_y == 0.0, f"Min Y must be 0.0, got {min_y}"
    assert len(grounded) == 2, f"Expected 2 grounded soles, got {len(grounded)}"

    issues = blockbench_check(cubes)
    print(f"Coplanar overlaps: {len(issues)}")
    assert len(issues) == 0, f"Zero Z-fighting violated! Found {len(issues)} coplanar overlaps"

    visited = check_connectivity(cubes)
    print(f"Connected cubes from ground: {len(visited)} / {len(cubes)}")
    assert len(visited) == len(cubes), f"Levitating cubes detected: {set(range(len(cubes))) - visited}"

    print("ALL SANTA CLAUS VOXEL CHECKS PASSED PERFECTLY!")

if __name__ == '__main__':
    run_all_checks()
