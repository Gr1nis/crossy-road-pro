import json
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from blockbench_coplanar_check import blockbench_check
from solve_urban_environment import check_quantization, check_connectivity, check_enclosed

def test_model(name, meta, cubes):
    print(f"\n--- Testing {name} ---")
    print(f"Cube count: {len(cubes)} (Budget: {meta['budget']})")
    
    # 1. Budget
    b_min, b_max = meta['budget']
    assert b_min <= len(cubes) <= b_max, f"Budget failed: {len(cubes)} not in {b_min}..{b_max}"
    
    # 2. Min Y
    min_y = min(c['from'][1] for c in cubes)
    assert abs(min_y - meta['min_y']) < 1e-4, f"Min Y mismatch: {min_y} != {meta['min_y']}"
    
    # 3. Quantization
    q_errs = check_quantization(cubes)
    assert len(q_errs) == 0, f"Quantization errors: {q_errs}"
    
    # 4. Coplanar (Zero Z-fighting)
    iss = blockbench_check(cubes)
    if iss:
        print(f"Coplanar issues found ({len(iss)}):")
        for issue in iss:
            print(f"  {issue['c1']} vs {issue['c2']} on {issue['axis']}={issue['plane']} ({issue['col1']} vs {issue['col2']})")
    assert len(iss) == 0, f"{len(iss)} coplanar overlaps found!"
    
    # 5. Connectivity (Solid Core)
    conn = check_connectivity(cubes, meta['min_y'])
    assert len(conn) == len(cubes), f"Connectivity failed: {len(conn)}/{len(cubes)} connected"
    
    # 6. Enclosed (Hollow Shell)
    enc = check_enclosed(cubes)
    assert len(enc) == 0, f"Enclosed cubes found: {enc}"
    
    print(f"✓ {name} passed all quality gates! (Grade A+ 10/10)")

if __name__ == '__main__':
    print("Test harness ready.")
