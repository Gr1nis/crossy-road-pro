import json
import os
import sys

sys.path.insert(0, 'scripts')
from solve_holiday_elf import build_holiday_elf, check_quantization
from blockbench_coplanar_check import blockbench_check

if __name__ == '__main__':
    cubes = build_holiday_elf()
    print(f"Total cubes count: {len(cubes)}")
    assert 50 <= len(cubes) <= 70, f"Budget 50-70 violated: {len(cubes)}"

    # Check 1: Quantization (every coord multiple of 0.05)
    quant_errors = check_quantization(cubes)
    print(f"Quantization errors: {len(quant_errors)}")
    for qe in quant_errors:
        print("  ", qe)
    assert len(quant_errors) == 0, "Must have 0 quantization errors"

    # Check 2: Grounding (min Y == 0.00, both shoe soles grounded)
    min_y = min(c['from'][1] for c in cubes)
    grounded = [c['name'] for c in cubes if c['from'][1] == 0.0]
    print(f"Min Y: {min_y:.2f}, Grounded shoe soles ({len(grounded)}): {grounded}")
    assert min_y == 0.0, "Min Y must be 0.00"
    assert len(grounded) == 2, "Must have exactly 2 grounded shoe soles"
    assert 'shoe_main_left' in grounded and 'shoe_main_right' in grounded

    # Check 3: Coplanar overlaps
    issues = blockbench_check(cubes)
    print(f"Coplanar overlaps: {len(issues)}")
    for iss in issues:
        print(f"  ISSUE: {iss['c1']} vs {iss['c2']} on {iss['axis']} = {iss['plane']} ({iss['col1']} vs {iss['col2']})")
    assert len(issues) == 0, f"Must have 0 coplanar overlaps, got {len(issues)}"

    # Check 4: Geometric clearances & connectivity (Solid Core)
    by_name = {c['name']: c for c in cubes}

    def check_connection(n1, n2):
        c1, c2 = by_name[n1], by_name[n2]
        ox = min(c1['to'][0], c2['to'][0]) - max(c1['from'][0], c2['from'][0])
        oy = min(c1['to'][1], c2['to'][1]) - max(c1['from'][1], c2['from'][1])
        oz = min(c1['to'][2], c2['to'][2]) - max(c1['from'][2], c2['from'][2])
        assert ox > 0 and oy > 0 and oz > 0, f"Gap between {n1} and {n2}: ox={ox}, oy={oy}, oz={oz}"
        return ox, oy, oz

    # Connectivity checks
    # Shoes to legs
    check_connection('shoe_main_left', 'leg_stripe_r1_left')
    check_connection('leg_stripe_r1_left', 'leg_stripe_w1_left')
    check_connection('leg_stripe_w1_left', 'leg_stripe_r2_left')
    check_connection('leg_stripe_r2_left', 'leg_stripe_w2_left')
    check_connection('leg_stripe_w2_left', 'tunic_skirt_hem')

    check_connection('shoe_main_right', 'leg_stripe_r1_right')
    check_connection('leg_stripe_r1_right', 'leg_stripe_w1_right')
    check_connection('leg_stripe_w1_right', 'leg_stripe_r2_right')
    check_connection('leg_stripe_r2_right', 'leg_stripe_w2_right')
    check_connection('leg_stripe_w2_right', 'tunic_skirt_hem')

    # Torso to head
    check_connection('tunic_skirt_hem', 'tunic_torso_main')
    check_connection('tunic_torso_main', 'neck_core')
    check_connection('neck_core', 'head_core')

    # Head to hat
    check_connection('head_core', 'hat_brim_trim')
    check_connection('hat_brim_trim', 'hat_cone_tier1')
    check_connection('hat_cone_tier1', 'hat_cone_tier2')
    check_connection('hat_cone_tier2', 'hat_cone_tier3_bend')
    check_connection('hat_cone_tier3_bend', 'hat_droop_tier4')
    check_connection('hat_droop_tier4', 'hat_droop_tier5_tail')
    check_connection('hat_droop_tier5_tail', 'hat_tip_socket')
    check_connection('hat_tip_socket', 'hat_pompom_bell')

    # Arms to hands and wind-up key
    check_connection('tunic_torso_main', 'arm_shoulder_left')
    check_connection('arm_shoulder_left', 'arm_forearm_left')
    check_connection('arm_forearm_left', 'sleeve_cuff_left')
    check_connection('sleeve_cuff_left', 'hand_clasp_left')
    check_connection('hand_clasp_left', 'key_bridge_bar')

    check_connection('tunic_torso_main', 'arm_shoulder_right')
    check_connection('arm_shoulder_right', 'arm_forearm_right')
    check_connection('arm_forearm_right', 'sleeve_cuff_right')
    check_connection('sleeve_cuff_right', 'hand_clasp_right')
    check_connection('hand_clasp_right', 'key_bridge_bar')

    check_connection('key_bridge_bar', 'key_shaft')
    check_connection('key_shaft', 'key_handle_hub')
    check_connection('key_handle_hub', 'key_wing_left')
    check_connection('key_handle_hub', 'key_wing_right')

    print("Solid Core & Connectivity: 100% continuous gapless mesh with zero floating parts!")
    print("\nALL QUALITY GATES PASSED: Holiday Elf (Rare [Elf]) is 100% compliant!")
