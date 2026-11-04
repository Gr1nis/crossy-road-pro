import json
import os
import sys

sys.path.insert(0, 'scripts')
from solve_arctic_fox import build_arctic_fox, check_quantization
from blockbench_coplanar_check import blockbench_check

if __name__ == '__main__':
    cubes = build_arctic_fox()
    print(f"Total cubes count: {len(cubes)}")
    assert 55 <= len(cubes) <= 68, f"Budget 55-68 violated: {len(cubes)}"

    # Check 1: Quantization (every coord multiple of 0.05)
    quant_errors = check_quantization(cubes)
    print(f"Quantization errors: {len(quant_errors)}")
    for qe in quant_errors:
        print("  ", qe)
    assert len(quant_errors) == 0, "Must have 0 quantization errors"

    # Check 2: Grounding (min Y == 0.00, 4 paw soles)
    min_y = min(c['from'][1] for c in cubes)
    grounded = [c['name'] for c in cubes if c['from'][1] == 0.0]
    print(f"Min Y: {min_y:.2f}, Grounded paws ({len(grounded)}): {grounded}")
    assert min_y == 0.0, "Min Y must be 0.00"
    assert len(grounded) == 4, "Must have exactly 4 grounded paws"

    # Check 3: Coplanar overlaps
    issues = blockbench_check(cubes)
    print(f"Coplanar overlaps: {len(issues)}")
    for iss in issues:
        print(f"  ISSUE: {iss['c1']} vs {iss['c2']} on {iss['axis']} = {iss['plane']} ({iss['col1']} vs {iss['col2']})")
    assert len(issues) == 0, f"Must have 0 coplanar overlaps, got {len(issues)}"

    # Check 4: Geometric clearances & connectivity
    by_name = {c['name']: c for c in cubes}

    # 4a: Eye vs brow clearance in Y and Z (Open clear eyes, no brow overhang)
    eye_names = ['eye_base_left', 'eye_base_right']
    brow = by_name['head_forehead_brow']
    max_eye_y = max(by_name[n]['to'][1] for n in eye_names)
    brow_min_y = brow['from'][1]
    brow_eye_y_gap = brow_min_y - max_eye_y
    print(f"Eye highest Y: {max_eye_y:.2f}, Brow lowest Y: {brow_min_y:.2f}, Y GAP: {brow_eye_y_gap:.2f}")
    assert brow_eye_y_gap >= 0.05, f"Brow must be strictly above eyes in Y, got {brow_eye_y_gap:.2f}"

    min_eye_z = min(by_name[n]['from'][2] for n in eye_names)
    brow_min_z = brow['from'][2]
    eye_forward_relief = brow_min_z - min_eye_z
    print(f"Eye front Z: {min_eye_z:.2f}, Brow front Z: {brow_min_z:.2f}, Eye forward relief: {eye_forward_relief:.2f}")
    assert eye_forward_relief >= 0.20, f"Eyes must stand well forward of brow, got {eye_forward_relief:.2f}"

    # 4b: Classic Continuous Headband Connectivity (Zero Gaps from Cup to Cup)
    def check_connection(n1, n2):
        c1, c2 = by_name[n1], by_name[n2]
        ox = min(c1['to'][0], c2['to'][0]) - max(c1['from'][0], c2['from'][0])
        oy = min(c1['to'][1], c2['to'][1]) - max(c1['from'][1], c2['from'][1])
        oz = min(c1['to'][2], c2['to'][2]) - max(c1['from'][2], c2['from'][2])
        assert ox > 0 and oy > 0 and oz > 0, f"Gap between {n1} and {n2}: ox={ox}, oy={oy}, oz={oz}"
        return ox, oy, oz

    check_connection('earmuff_band_top', 'earmuff_band_left')
    check_connection('earmuff_band_left', 'earmuff_cushion_left')
    check_connection('earmuff_band_top', 'earmuff_band_right')
    check_connection('earmuff_band_right', 'earmuff_cushion_right')
    print("Headband classic arch: 100% gapless continuous connection from cup to cup!")

    print("\nALL QUALITY GATES PASSED: Arctic Fox (Rare [Fox]) is 100% compliant!")
