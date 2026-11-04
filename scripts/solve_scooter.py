import json
import math
import os
import sys

def check_quantization(cubes):
    errors = []
    for c in cubes:
        for ax in range(3):
            f_val = c['from'][ax]
            t_val = c['to'][ax]
            if abs(f_val * 20 - round(f_val * 20)) > 1e-4:
                errors.append(f"{c['name']} from[{ax}]={f_val}")
            if abs(t_val * 20 - round(t_val * 20)) > 1e-4:
                errors.append(f"{c['name']} to[{ax}]={t_val}")
    return errors

def check_connectivity(cubes):
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

    grounded_idx = [i for i, c in enumerate(cubes) if abs(c['from'][1] - 0.0) < 1e-5]
    if not grounded_idx:
        return set()

    visited = set()
    queue = list(grounded_idx)
    for g in queue:
        visited.add(g)
    while queue:
        curr = queue.pop(0)
        for nbr in adj[curr]:
            if nbr not in visited:
                visited.add(nbr)
                queue.append(nbr)
    return visited

def check_enclosed(cubes):
    enclosed = []
    for i, c1 in enumerate(cubes):
        f1, t1 = c1['from'], c1['to']
        for j, c2 in enumerate(cubes):
            if i == j: continue
            f2, t2 = c2['from'], c2['to']
            if f2[0] <= f1[0] and t2[0] >= t1[0] and f2[1] <= f1[1] and t2[1] >= t1[1] and f2[2] <= f1[2] and t2[2] >= t1[2]:
                enclosed.append((c1['name'], c2['name']))
    return enclosed

def build_scooter():
    cubes = [
        # =========================================================================
        # 1. CHASSIS, WHEELS & SUSPENSION (15 cubes)
        # =========================================================================
        # Front Wheel (Center Z = -7.45)
        {"name": "wheel_front_tread_main", "group": "chassis_wheels", "from": [-0.65, 0.00, -8.55], "to": [0.65, 3.80, -6.35], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_front_tread_front", "group": "chassis_wheels", "from": [-0.55, 0.65, -9.35], "to": [0.55, 3.15, -8.45], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_front_tread_rear", "group": "chassis_wheels", "from": [-0.55, 0.65, -6.45], "to": [0.55, 3.15, -5.55], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_front_rim_l", "group": "chassis_wheels", "from": [-0.85, 0.95, -8.15], "to": [-0.60, 2.85, -6.75], "color": "rimSilver", "col_idx": 7},
        {"name": "wheel_front_rim_r", "group": "chassis_wheels", "from": [0.60, 0.95, -8.15], "to": [0.85, 2.85, -6.75], "color": "rimSilver", "col_idx": 7},
        {"name": "front_axle_hub", "group": "chassis_wheels", "from": [-0.95, 1.65, -7.75], "to": [0.95, 2.15, -7.15], "color": "metalChrome", "col_idx": 8},

        # Front Telescopic Fork
        {"name": "front_fork_strut_l", "group": "chassis_wheels", "from": [-1.25, 1.85, -7.85], "to": [-0.90, 7.15, -7.05], "color": "metalChrome", "col_idx": 8},
        {"name": "front_fork_strut_r", "group": "chassis_wheels", "from": [0.90, 1.85, -7.85], "to": [1.25, 7.15, -7.05], "color": "metalChrome", "col_idx": 8},
        {"name": "front_fork_crown", "group": "chassis_wheels", "from": [-1.35, 6.75, -7.95], "to": [1.35, 7.75, -6.75], "color": "bumperGuard", "col_idx": 9},

        # Rear Wheel (Center Z = +5.45)
        {"name": "wheel_rear_tread_main", "group": "chassis_wheels", "from": [-0.65, 0.00, 4.35], "to": [0.65, 3.80, 6.55], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_rear_tread_front", "group": "chassis_wheels", "from": [-0.55, 0.65, 3.55], "to": [0.55, 3.15, 4.45], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_rear_tread_rear", "group": "chassis_wheels", "from": [-0.55, 0.65, 6.45], "to": [0.55, 3.15, 7.35], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_rear_rim_l", "group": "chassis_wheels", "from": [-0.85, 0.95, 4.75], "to": [-0.60, 2.85, 6.15], "color": "rimSilver", "col_idx": 7},
        {"name": "wheel_rear_rim_r", "group": "chassis_wheels", "from": [0.60, 0.95, 4.75], "to": [0.85, 2.85, 6.15], "color": "rimSilver", "col_idx": 7},
        {"name": "rear_axle_hub", "group": "chassis_wheels", "from": [-0.95, 1.65, 5.15], "to": [0.95, 2.15, 5.75], "color": "metalChrome", "col_idx": 8},

        # Central Chassis Spine
        {"name": "chassis_under_spine", "group": "chassis_wheels", "from": [-1.15, 1.75, -6.55], "to": [1.15, 2.85, 4.55], "color": "trimBlack", "col_idx": 3},

        # =========================================================================
        # 2. FLOORBOARD & FOOTREST (4 cubes) - In Motion (No Kickstand)
        # =========================================================================
        {"name": "footrest_floorboard_main", "group": "floorboard", "from": [-3.25, 2.15, -4.15], "to": [3.25, 2.75, 1.25], "color": "scooterOrangeDark", "col_idx": 1},
        {"name": "footrest_rubber_mat_l", "group": "floorboard", "from": [-2.95, 2.70, -3.75], "to": [-1.45, 2.95, 0.85], "color": "trimBlack", "col_idx": 3},
        {"name": "footrest_rubber_mat_r", "group": "floorboard", "from": [1.45, 2.70, -3.75], "to": [2.95, 2.95, 0.85], "color": "trimBlack", "col_idx": 3},
        {"name": "central_tunnel_hump", "group": "floorboard", "from": [-1.35, 2.65, -3.85], "to": [1.35, 4.35, 1.15], "color": "scooterOrange", "col_idx": 0},

        # =========================================================================
        # 3. FRONT APRON, SOLID STEERING COLUMN & CONTROLS (20 cubes)
        # =========================================================================
        # Solid Steering Column Base (Eliminates the gap under the handlebars)
        {"name": "steering_column_solid_base", "group": "front_apron_cockpit", "from": [-1.25, 4.15, -4.75], "to": [1.25, 10.35, -3.55], "color": "scooterOrange", "col_idx": 0},

        # Front Shield / Leg Apron
        {"name": "front_fender_mudguard", "group": "front_apron_cockpit", "from": [-1.30, 3.45, -9.15], "to": [1.30, 4.55, -5.95], "color": "scooterOrange", "col_idx": 0},
        {"name": "front_apron_lower", "group": "front_apron_cockpit", "from": [-2.85, 2.65, -5.85], "to": [2.85, 6.35, -4.05], "color": "scooterOrangeDark", "col_idx": 1},
        {"name": "front_apron_main_shield", "group": "front_apron_cockpit", "from": [-3.15, 6.15, -5.65], "to": [3.15, 10.45, -4.25], "color": "scooterOrange", "col_idx": 0},
        {"name": "front_apron_crest_accent", "group": "front_apron_cockpit", "from": [-0.55, 6.85, -5.85], "to": [0.55, 9.85, -5.55], "color": "rimSilver", "col_idx": 7},
        {"name": "front_turn_signal_l", "group": "front_apron_cockpit", "from": [-2.95, 7.85, -5.75], "to": [-2.15, 9.25, -5.55], "color": "turnSignalAmber", "col_idx": 12},
        {"name": "front_turn_signal_r", "group": "front_apron_cockpit", "from": [2.15, 7.85, -5.75], "to": [2.95, 9.25, -5.55], "color": "turnSignalAmber", "col_idx": 12},

        # Steering Head & Handlebars
        {"name": "handlebar_stem", "group": "front_apron_cockpit", "from": [-1.05, 9.75, -4.95], "to": [1.05, 11.25, -4.15], "color": "scooterOrangeDark", "col_idx": 1},
        {"name": "handlebar_crossbar", "group": "front_apron_cockpit", "from": [-3.85, 10.85, -5.05], "to": [3.85, 11.65, -4.45], "color": "metalChrome", "col_idx": 8},
        {"name": "handlebar_grip_l", "group": "front_apron_cockpit", "from": [-4.35, 10.75, -5.15], "to": [-3.65, 11.75, -4.35], "color": "trimBlack", "col_idx": 3},
        {"name": "handlebar_grip_r", "group": "front_apron_cockpit", "from": [3.65, 10.75, -5.15], "to": [4.35, 11.75, -4.35], "color": "trimBlack", "col_idx": 3},
        {"name": "brake_lever_l", "group": "front_apron_cockpit", "from": [-3.95, 10.45, -5.55], "to": [-3.15, 11.05, -4.85], "color": "rimSilver", "col_idx": 7},
        {"name": "brake_lever_r", "group": "front_apron_cockpit", "from": [3.15, 10.45, -5.55], "to": [3.95, 11.05, -4.85], "color": "rimSilver", "col_idx": 7},

        # Headlight & Windshield
        {"name": "headlight_housing", "group": "front_apron_cockpit", "from": [-1.45, 10.65, -5.65], "to": [1.45, 12.45, -4.65], "color": "scooterOrange", "col_idx": 0},
        {"name": "headlight_glass_lens", "group": "front_apron_cockpit", "from": [-1.15, 10.95, -5.85], "to": [1.15, 12.15, -5.55], "color": "headlightIce", "col_idx": 11},
        {"name": "windshield_visor", "group": "front_apron_cockpit", "from": [-1.65, 12.35, -5.25], "to": [1.65, 14.15, -4.75], "color": "glassSky", "col_idx": 10},

        # Rear-view Mirrors
        {"name": "mirror_stem_l", "group": "front_apron_cockpit", "from": [-3.45, 11.55, -4.95], "to": [-3.15, 13.05, -4.65], "color": "metalChrome", "col_idx": 8},
        {"name": "mirror_stem_r", "group": "front_apron_cockpit", "from": [3.15, 11.55, -4.95], "to": [3.45, 13.05, -4.65], "color": "metalChrome", "col_idx": 8},
        {"name": "mirror_head_l", "group": "front_apron_cockpit", "from": [-3.85, 12.85, -5.25], "to": [-2.75, 14.15, -4.45], "color": "scooterOrange", "col_idx": 0},
        {"name": "mirror_head_r", "group": "front_apron_cockpit", "from": [2.75, 12.85, -5.25], "to": [3.85, 14.15, -4.45], "color": "scooterOrange", "col_idx": 0},

        # =========================================================================
        # 4. ENGINE BODY, SADDLE & REAR SECTION (11 cubes)
        # =========================================================================
        # Engine Cowl & Side Covers
        {"name": "engine_cowl_base", "group": "body_seat_rear", "from": [-2.25, 2.55, 0.95], "to": [2.25, 5.85, 5.35], "color": "scooterOrange", "col_idx": 0},
        {"name": "engine_side_badge_l", "group": "body_seat_rear", "from": [-2.45, 3.85, 1.85], "to": [-2.15, 4.85, 4.35], "color": "scooterOrangeLight", "col_idx": 2},
        {"name": "engine_side_badge_r", "group": "body_seat_rear", "from": [2.15, 3.85, 1.85], "to": [2.45, 4.85, 4.35], "color": "scooterOrangeLight", "col_idx": 2},

        # Saddle / Seat
        {"name": "seat_cushion_rider", "group": "body_seat_rear", "from": [-1.95, 5.75, 0.45], "to": [1.95, 7.15, 4.15], "color": "seatLeather", "col_idx": 15},

        # Rear Fender & License Plate
        {"name": "rear_mudguard", "group": "body_seat_rear", "from": [-1.35, 3.45, 5.25], "to": [1.35, 5.15, 8.45], "color": "scooterOrangeDark", "col_idx": 1},
        {"name": "rear_fender_lip", "group": "body_seat_rear", "from": [-1.15, 2.45, 8.15], "to": [1.15, 4.45, 8.95], "color": "trimBlack", "col_idx": 3},
        {"name": "license_plate_bracket", "group": "body_seat_rear", "from": [-0.95, 2.85, 8.85], "to": [0.95, 4.15, 9.15], "color": "bumperGuard", "col_idx": 9},
        {"name": "license_plate_tag", "group": "body_seat_rear", "from": [-0.85, 2.95, 9.10], "to": [0.85, 4.05, 9.30], "color": "rimSilver", "col_idx": 7},

        # Exhaust System
        {"name": "exhaust_header_pipe", "group": "body_seat_rear", "from": [1.85, 2.35, 2.45], "to": [2.55, 3.05, 4.75], "color": "metalChrome", "col_idx": 8},
        {"name": "exhaust_muffler_can", "group": "body_seat_rear", "from": [2.35, 2.45, 4.55], "to": [3.15, 3.55, 7.95], "color": "bumperGuard", "col_idx": 9},
        {"name": "exhaust_chrome_tip", "group": "body_seat_rear", "from": [2.45, 2.65, 7.85], "to": [2.95, 3.35, 8.45], "color": "metalChrome", "col_idx": 8},

        # =========================================================================
        # 5. LUGGAGE RACK & THERMAL DELIVERY BOX (12 cubes)
        # =========================================================================
        # Sturdy Steel Rack
        {"name": "luggage_rack_base", "group": "thermal_delivery_box", "from": [-2.65, 5.45, 4.05], "to": [2.65, 6.25, 8.45], "color": "bumperGuard", "col_idx": 9},
        {"name": "rack_support_strut_l", "group": "thermal_delivery_box", "from": [-2.45, 4.15, 4.75], "to": [-2.05, 5.65, 7.55], "color": "metalChrome", "col_idx": 8},
        {"name": "rack_support_strut_r", "group": "thermal_delivery_box", "from": [2.05, 4.15, 4.75], "to": [2.45, 5.65, 7.55], "color": "metalChrome", "col_idx": 8},

        # Bulky Thermal Delivery Box (W=6.90, H=6.80, D=5.40)
        {"name": "thermal_box_main_body", "group": "thermal_delivery_box", "from": [-3.45, 6.15, 3.35], "to": [3.45, 12.95, 8.75], "color": "boxPrimary", "col_idx": 4},
        {"name": "thermal_box_top_lid", "group": "thermal_delivery_box", "from": [-3.55, 12.80, 3.25], "to": [3.55, 13.95, 8.85], "color": "boxPrimary", "col_idx": 4},

        # Side Fastener Straps (disjoint Z from side patch)
        {"name": "strap_side_l", "group": "thermal_delivery_box", "from": [-3.55, 7.35, 3.85], "to": [-3.35, 12.55, 4.45], "color": "trimBlack", "col_idx": 3},
        {"name": "strap_side_r", "group": "thermal_delivery_box", "from": [3.35, 7.35, 3.85], "to": [3.55, 12.55, 4.45], "color": "trimBlack", "col_idx": 3},

        # Side Delivery Brand Patches
        {"name": "delivery_brand_patch_l", "group": "thermal_delivery_box", "from": [-3.55, 8.65, 5.05], "to": [-3.35, 11.05, 7.05], "color": "courierRed", "col_idx": 13},
        {"name": "delivery_brand_patch_r", "group": "thermal_delivery_box", "from": [3.35, 8.65, 5.05], "to": [3.55, 11.05, 7.05], "color": "courierRed", "col_idx": 13},

        # Rear Brand Emblem & Reflector Strip
        {"name": "delivery_brand_patch_rear", "group": "thermal_delivery_box", "from": [-1.45, 8.85, 8.65], "to": [1.45, 11.35, 8.85], "color": "courierRed", "col_idx": 13},
        {"name": "delivery_reflector_strip", "group": "thermal_delivery_box", "from": [-2.65, 6.55, 8.65], "to": [2.65, 7.15, 8.85], "color": "turnSignalAmber", "col_idx": 12},

        # Rear Taillight / Brake Lamp
        {"name": "taillight_brake_lamp", "group": "thermal_delivery_box", "from": [-1.25, 4.95, 8.35], "to": [1.25, 5.75, 8.75], "color": "courierRed", "col_idx": 13},

        # =========================================================================
        # 6. VOXEL COURIER RIDER (15 cubes) - Full Adult Scale & Anatomical Bent Legs
        # =========================================================================
        # Torso & Vest (Adult proportions, height up to 12.25)
        {"name": "courier_torso", "group": "courier_rider", "from": [-2.05, 6.85, 0.35], "to": [2.05, 12.25, 2.95], "color": "courierRed", "col_idx": 13},
        {"name": "courier_vest_stripe", "group": "courier_rider", "from": [-1.95, 8.85, 0.20], "to": [1.95, 10.35, 0.45], "color": "boxPrimary", "col_idx": 4},

        # Head, Helmet & Visor (Towering proudly above windshield at Y=16.85!)
        {"name": "courier_helmet_dome", "group": "courier_rider", "from": [-1.75, 12.05, 0.45], "to": [1.75, 16.85, 3.15], "color": "courierRed", "col_idx": 13},
        {"name": "courier_face", "group": "courier_rider", "from": [-1.35, 12.55, -0.05], "to": [1.35, 14.65, 0.65], "color": "courierSkin", "col_idx": 14},
        {"name": "courier_helmet_visor", "group": "courier_rider", "from": [-1.55, 13.45, -0.35], "to": [1.55, 15.15, 0.35], "color": "glassSky", "col_idx": 10},

        # Long Ergonomic Arms (Reaching down-forward from shoulders to handlebars)
        {"name": "courier_arm_l", "group": "courier_rider", "from": [-3.45, 10.25, -3.75], "to": [-1.85, 11.95, 0.75], "color": "courierRed", "col_idx": 13},
        {"name": "courier_arm_r", "group": "courier_rider", "from": [1.85, 10.25, -3.75], "to": [3.45, 11.95, 0.75], "color": "courierRed", "col_idx": 13},
        # Compact neat gripping hands
        {"name": "courier_hand_l", "group": "courier_rider", "from": [-3.80, 10.65, -4.65], "to": [-3.00, 11.45, -3.65], "color": "courierSkin", "col_idx": 14},
        {"name": "courier_hand_r", "group": "courier_rider", "from": [3.00, 10.65, -4.65], "to": [3.80, 11.45, -3.65], "color": "courierSkin", "col_idx": 14},

        # Anatomical Bent Legs (Two rectangular blocks per leg: Thigh + Shin, 90° Knee Bend!)
        # Thighs: horizontal forward block from pelvis to knee
        {"name": "courier_thigh_l", "group": "courier_rider", "from": [-2.35, 5.65, -1.85], "to": [-1.25, 7.05, 0.55], "color": "courierPants", "col_idx": 6},
        {"name": "courier_thigh_r", "group": "courier_rider", "from": [1.25, 5.65, -1.85], "to": [2.35, 7.05, 0.55], "color": "courierPants", "col_idx": 6},
        # Shins: vertical block from knee down to floorboard
        {"name": "courier_shin_l", "group": "courier_rider", "from": [-2.45, 3.15, -2.45], "to": [-1.30, 6.45, -1.35], "color": "courierPants", "col_idx": 6},
        {"name": "courier_shin_r", "group": "courier_rider", "from": [1.30, 3.15, -2.45], "to": [2.45, 6.45, -1.35], "color": "courierPants", "col_idx": 6},
        # Boots: flat on rubber mats
        {"name": "courier_boot_l", "group": "courier_rider", "from": [-2.55, 2.80, -3.65], "to": [-1.25, 3.65, -1.75], "color": "trimBlack", "col_idx": 3},
        {"name": "courier_boot_r", "group": "courier_rider", "from": [1.25, 2.80, -3.65], "to": [2.55, 3.65, -1.75], "color": "trimBlack", "col_idx": 3},
    ]
    return cubes

if __name__ == '__main__':
    cubes = build_scooter()
    print(f"Total cubes: {len(cubes)} (Budget: 55-75, max 80 for model with rider)")

    # Quantization
    q_errs = check_quantization(cubes)
    print(f"Quantization errors: {len(q_errs)}")
    for q in q_errs[:5]:
        print(f"  {q}")

    # Grounding
    min_y = min(c['from'][1] for c in cubes)
    grounded = [c['name'] for c in cubes if abs(c['from'][1] - 0.0) < 1e-5]
    print(f"Min Y: {min_y:.4f} (Grounded cubes: {grounded})")

    # Dimensions
    min_x = min(c['from'][0] for c in cubes)
    max_x = max(c['to'][0] for c in cubes)
    max_y = max(c['to'][1] for c in cubes)
    min_z = min(c['from'][2] for c in cubes)
    max_z = max(c['to'][2] for c in cubes)
    width = max_x - min_x
    height = max_y - min_y
    length = max_z - min_z
    print(f"Bounds: W={width:.2f} ({width*0.05:.3f}m), H={height:.2f} ({height*0.05:.3f}m), L={length:.2f} ({length*0.05:.3f}m)")

    # Coplanar overlap check
    sys.path.insert(0, 'scripts')
    from blockbench_coplanar_check import blockbench_check
    coplanar_issues = blockbench_check(cubes)
    print(f"Coplanar overlaps: {len(coplanar_issues)}")
    for iss in coplanar_issues:
        print(f"  Overlap on {iss['axis']}={iss['plane']}: {iss['c1']} vs {iss['c2']}")

    # Enclosed check
    enclosed = check_enclosed(cubes)
    print(f"Enclosed cubes: {len(enclosed)}")
    for e in enclosed:
        print(f"  {e[0]} enclosed in {e[1]}")

    # Connectivity
    visited = check_connectivity(cubes)
    print(f"Connected cubes: {len(visited)} / {len(cubes)}")
    unvisited = [c['name'] for i, c in enumerate(cubes) if i not in visited]
    if unvisited:
        print(f"Unvisited cubes: {unvisited}")
