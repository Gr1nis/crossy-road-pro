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
            overlap_x = min(t1[0], t2[0]) - max(f1[0], f2[0])
            overlap_y = min(t1[1], t2[1]) - max(f1[1], f2[1])
            overlap_z = min(t1[2], t2[2]) - max(f1[2], f2[2])
            if overlap_x >= -tol and overlap_y >= -tol and overlap_z >= -tol:
                adj[i].add(j)
                adj[j].add(i)

    grounded_idx = [i for i, c in enumerate(cubes) if c['from'][1] == 0.0]
    if not grounded_idx:
        return set()

    visited = set()
    queue = [grounded_idx[0]]
    visited.add(grounded_idx[0])
    while queue:
        curr = queue.pop(0)
        for nbr in adj[curr]:
            if nbr not in visited:
                visited.add(nbr)
                queue.append(nbr)
    return visited

def blockbench_check(cubes):
    issues = []
    n = len(cubes)
    for i in range(n):
        c1 = cubes[i]
        f1, t1 = c1['from'], c1['to']
        for j in range(i + 1, n):
            c2 = cubes[j]
            f2, t2 = c2['from'], c2['to']
            for ax, (ax_name, other_axes) in enumerate([
                ('x', [(1, 'y'), (2, 'z')]),
                ('y', [(0, 'x'), (2, 'z')]),
                ('z', [(0, 'x'), (1, 'y')])
            ]):
                for p1 in [f1[ax], t1[ax]]:
                    for p2 in [f2[ax], t2[ax]]:
                        if abs(p1 - p2) < 0.01:
                            o1, n1 = other_axes[0]
                            o2, n2 = other_axes[1]
                            overlap1 = min(t1[o1], t2[o1]) - max(f1[o1], f2[o1])
                            overlap2 = min(t1[o2], t2[o2]) - max(f1[o2], f2[o2])
                            if overlap1 > 0.05 and overlap2 > 0.05:
                                issues.append({
                                    'c1': c1['name'], 'c2': c2['name'],
                                    'axis': ax_name, 'plane': p1,
                                    'overlap': (overlap1, overlap2)
                                })
    return issues

def build_taxi():
    cubes = [
        # =========================================================================
        # 1. CHASSIS & WHEELS (19 cubes) - High Ground Clearance Y=2.35!
        # =========================================================================
        {"name": "chassis_spine", "group": "chassis_wheels", "from": [-5.25, 2.45, -12.85], "to": [5.25, 4.25, 12.85], "color": "tireBlack", "col_idx": 5},
        {"name": "front_axle", "group": "chassis_wheels", "from": [-6.25, 2.35, -9.45], "to": [6.25, 3.65, -8.55], "color": "bumperGuard", "col_idx": 9},
        {"name": "rear_axle", "group": "chassis_wheels", "from": [-6.25, 2.35, 8.55], "to": [6.25, 3.65, 9.45], "color": "bumperGuard", "col_idx": 9},

        # Front-Left Wheel
        {"name": "wheel_fl_tread_main", "group": "chassis_wheels", "from": [-7.25, 0.00, -10.75], "to": [-4.85, 4.55, -7.25], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_fl_tread_front", "group": "chassis_wheels", "from": [-7.05, 0.85, -11.55], "to": [-5.05, 3.75, -10.65], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_fl_tread_rear", "group": "chassis_wheels", "from": [-7.05, 0.85, -7.35], "to": [-5.05, 3.75, -6.45], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_fl_rim", "group": "chassis_wheels", "from": [-7.45, 1.15, -10.05], "to": [-7.15, 3.45, -7.95], "color": "rimSilver", "col_idx": 7},

        # Front-Right Wheel
        {"name": "wheel_fr_tread_main", "group": "chassis_wheels", "from": [4.85, 0.00, -10.75], "to": [7.25, 4.55, -7.25], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_fr_tread_front", "group": "chassis_wheels", "from": [5.05, 0.85, -11.55], "to": [7.05, 3.75, -10.65], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_fr_tread_rear", "group": "chassis_wheels", "from": [5.05, 0.85, -7.35], "to": [7.05, 3.75, -6.45], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_fr_rim", "group": "chassis_wheels", "from": [7.15, 1.15, -10.05], "to": [7.45, 3.45, -7.95], "color": "rimSilver", "col_idx": 7},

        # Rear-Left Wheel
        {"name": "wheel_rl_tread_main", "group": "chassis_wheels", "from": [-7.25, 0.00, 7.25], "to": [-4.85, 4.55, 10.75], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_rl_tread_front", "group": "chassis_wheels", "from": [-7.05, 0.85, 6.45], "to": [-5.05, 3.75, 7.35], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_rl_tread_rear", "group": "chassis_wheels", "from": [-7.05, 0.85, 10.65], "to": [-5.05, 3.75, 11.55], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_rl_rim", "group": "chassis_wheels", "from": [-7.45, 1.15, 7.95], "to": [-7.15, 3.45, 10.05], "color": "rimSilver", "col_idx": 7},

        # Rear-Right Wheel
        {"name": "wheel_rr_tread_main", "group": "chassis_wheels", "from": [4.85, 0.00, 7.25], "to": [7.25, 4.55, 10.75], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_rr_tread_front", "group": "chassis_wheels", "from": [5.05, 0.85, 6.45], "to": [7.05, 3.75, 7.35], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_rr_tread_rear", "group": "chassis_wheels", "from": [5.05, 0.85, 10.65], "to": [7.05, 3.75, 11.55], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_rr_rim", "group": "chassis_wheels", "from": [7.15, 1.15, 7.95], "to": [7.45, 3.45, 10.05], "color": "rimSilver", "col_idx": 7},

        # =========================================================================
        # 2. BODY LOWER (27 cubes)
        # =========================================================================
        {"name": "rocker_panel_left", "group": "body_lower", "from": [-6.95, 2.65, -5.45], "to": [-4.65, 4.75, 5.45], "color": "taxiYellowDark", "col_idx": 1},
        {"name": "rocker_panel_right", "group": "body_lower", "from": [4.65, 2.65, -5.45], "to": [6.95, 4.75, 5.45], "color": "taxiYellowDark", "col_idx": 1},

        {"name": "fender_fl_top", "group": "body_lower", "from": [-7.35, 4.45, -12.85], "to": [-4.75, 7.15, -5.05], "color": "taxiYellow", "col_idx": 0},
        {"name": "fender_fr_top", "group": "body_lower", "from": [4.75, 4.45, -12.85], "to": [7.35, 7.15, -5.05], "color": "taxiYellow", "col_idx": 0},
        {"name": "fender_rl_top", "group": "body_lower", "from": [-7.35, 4.45, 5.15], "to": [-4.75, 7.25, 12.85], "color": "taxiYellow", "col_idx": 0},
        {"name": "fender_rr_top", "group": "body_lower", "from": [4.75, 4.45, 5.15], "to": [7.35, 7.25, 12.85], "color": "taxiYellow", "col_idx": 0},

        {"name": "door_lower_left", "group": "body_lower", "from": [-7.15, 4.55, -5.25], "to": [-4.85, 7.35, 5.25], "color": "taxiYellow", "col_idx": 0},
        {"name": "door_lower_right", "group": "body_lower", "from": [4.85, 4.55, -5.25], "to": [7.15, 7.35, 5.25], "color": "taxiYellow", "col_idx": 0},

        {"name": "front_nose_valance", "group": "body_lower", "from": [-5.15, 3.15, -13.85], "to": [5.15, 5.25, -12.45], "color": "taxiYellowDark", "col_idx": 1},
        {"name": "hood_main_slab", "group": "body_lower", "from": [-4.95, 4.95, -13.15], "to": [4.95, 7.25, -4.15], "color": "taxiYellow", "col_idx": 0},
        {"name": "hood_center_bulge", "group": "body_lower", "from": [-2.85, 7.05, -12.45], "to": [2.85, 7.55, -4.45], "color": "taxiYellowDark", "col_idx": 1},

        {"name": "rear_tail_valance", "group": "body_lower", "from": [-5.15, 3.15, 12.45], "to": [5.15, 5.25, 13.85], "color": "taxiYellowDark", "col_idx": 1},
        {"name": "trunk_main_slab", "group": "body_lower", "from": [-4.95, 4.85, 4.15], "to": [4.95, 7.05, 13.15], "color": "taxiYellow", "col_idx": 0},
        {"name": "trunk_lip_spoiler", "group": "body_lower", "from": [-3.85, 6.95, 11.85], "to": [3.85, 7.55, 13.45], "color": "taxiYellowDark", "col_idx": 1},

        # Door handles
        {"name": "door_handle_fl", "group": "body_lower", "from": [-7.35, 6.05, -3.25], "to": [-6.95, 6.65, -1.85], "color": "checkerBlack", "col_idx": 3},
        {"name": "door_handle_rl", "group": "body_lower", "from": [-7.35, 6.05, 1.85], "to": [-6.95, 6.65, 3.25], "color": "checkerBlack", "col_idx": 3},
        {"name": "door_handle_fr", "group": "body_lower", "from": [6.95, 6.05, -3.25], "to": [7.35, 6.65, -1.85], "color": "checkerBlack", "col_idx": 3},
        {"name": "door_handle_rr", "group": "body_lower", "from": [6.95, 6.05, 1.85], "to": [7.35, 6.65, 3.25], "color": "checkerBlack", "col_idx": 3},

        # Checkerboard side stripes (Relief 0.20 outward)
        {"name": "checker_side_l1", "group": "body_lower", "from": [-7.55, 5.35, -11.65], "to": [-7.15, 6.15, -9.45], "color": "checkerBlack", "col_idx": 3},
        {"name": "checker_side_l2", "group": "body_lower", "from": [-7.55, 5.35, -9.35], "to": [-7.15, 6.15, -7.15], "color": "checkerWhite", "col_idx": 4},
        {"name": "checker_side_l3", "group": "body_lower", "from": [-7.55, 5.35, 7.15], "to": [-7.15, 6.15, 9.35], "color": "checkerBlack", "col_idx": 3},
        {"name": "checker_side_l4", "group": "body_lower", "from": [-7.55, 5.35, 9.45], "to": [-7.15, 6.15, 11.65], "color": "checkerWhite", "col_idx": 4},

        {"name": "checker_side_r1", "group": "body_lower", "from": [7.15, 5.35, -11.65], "to": [7.55, 6.15, -9.45], "color": "checkerBlack", "col_idx": 3},
        {"name": "checker_side_r2", "group": "body_lower", "from": [7.15, 5.35, -9.35], "to": [7.55, 6.15, -7.15], "color": "checkerWhite", "col_idx": 4},
        {"name": "checker_side_r3", "group": "body_lower", "from": [7.15, 5.35, 7.15], "to": [7.55, 6.15, 9.35], "color": "checkerBlack", "col_idx": 3},
        {"name": "checker_side_r4", "group": "body_lower", "from": [7.15, 5.35, 9.45], "to": [7.55, 6.15, 11.65], "color": "checkerWhite", "col_idx": 4},

        # =========================================================================
        # 3. CABIN & GLASS (16 cubes) - AIRTIGHT ENVELOPE (0 GAPS!)
        # =========================================================================
        # Monolithic front windshield and rear window (No stepped bulge!)
        {"name": "windshield_clean", "group": "cabin_glass", "from": [-4.55, 7.15, -4.55], "to": [4.55, 11.45, -2.85], "color": "glassDark", "col_idx": 10},
        {"name": "rear_window_clean", "group": "cabin_glass", "from": [-4.55, 6.85, 2.85], "to": [4.55, 11.45, 4.55], "color": "glassDark", "col_idx": 10},

        # Side windows (Flush with roof Y=11.25..11.35)
        {"name": "side_window_fl", "group": "cabin_glass", "from": [-5.85, 7.25, -2.95], "to": [-4.65, 11.35, -0.15], "color": "glassDark", "col_idx": 10},
        {"name": "side_window_rl", "group": "cabin_glass", "from": [-5.85, 7.25, 0.55], "to": [-4.65, 11.35, 2.95], "color": "glassDark", "col_idx": 10},
        {"name": "side_window_fr", "group": "cabin_glass", "from": [4.65, 7.25, -2.95], "to": [5.85, 11.35, -0.15], "color": "glassDark", "col_idx": 10},
        {"name": "side_window_rr", "group": "cabin_glass", "from": [4.65, 7.25, 0.55], "to": [5.85, 11.35, 2.95], "color": "glassDark", "col_idx": 10},

        # Pillars
        {"name": "pillar_a_left", "group": "cabin_glass", "from": [-5.95, 7.05, -4.75], "to": [-4.35, 11.55, -2.75], "color": "taxiYellow", "col_idx": 0},
        {"name": "pillar_a_right", "group": "cabin_glass", "from": [4.35, 7.05, -4.75], "to": [5.95, 11.55, -2.75], "color": "taxiYellow", "col_idx": 0},
        {"name": "pillar_b_left", "group": "cabin_glass", "from": [-5.95, 7.15, -0.25], "to": [-4.55, 11.45, 0.65], "color": "taxiYellow", "col_idx": 0},
        {"name": "pillar_b_right", "group": "cabin_glass", "from": [4.55, 7.15, -0.25], "to": [5.95, 11.45, 0.65], "color": "taxiYellow", "col_idx": 0},
        {"name": "pillar_c_left", "group": "cabin_glass", "from": [-5.95, 6.95, 2.75], "to": [-4.35, 11.55, 4.75], "color": "taxiYellow", "col_idx": 0},
        {"name": "pillar_c_right", "group": "cabin_glass", "from": [4.35, 6.95, 2.75], "to": [5.95, 11.55, 4.75], "color": "taxiYellow", "col_idx": 0},

        # Roof structure (Airtight seal on top of glass)
        {"name": "roof_main_slab", "group": "cabin_glass", "from": [-5.15, 11.25, -3.55], "to": [5.15, 12.35, 3.55], "color": "taxiYellow", "col_idx": 0},
        {"name": "roof_visor_front", "group": "cabin_glass", "from": [-4.85, 11.35, -4.65], "to": [4.85, 12.15, -3.45], "color": "taxiYellowDark", "col_idx": 1},
        {"name": "roof_visor_rear", "group": "cabin_glass", "from": [-4.85, 11.35, 3.45], "to": [4.85, 12.15, 4.65], "color": "taxiYellowDark", "col_idx": 1},
        {"name": "roof_crest_crown", "group": "cabin_glass", "from": [-3.95, 12.25, -2.85], "to": [3.95, 12.75, 2.85], "color": "taxiYellowDark", "col_idx": 1},

        # =========================================================================
        # 4. ROOF TAXI SIGN (13 cubes) - NO BEACON, PERIMETER CHECKERS!
        # =========================================================================
        {"name": "taxi_sign_mount_base", "group": "roof_taxi_sign", "from": [-3.25, 12.65, -1.35], "to": [3.25, 13.05, 1.35], "color": "checkerBlack", "col_idx": 3},
        {"name": "taxi_sign_box_main", "group": "roof_taxi_sign", "from": [-2.65, 12.95, -1.05], "to": [2.65, 14.35, 1.05], "color": "checkerWhite", "col_idx": 4},
        {"name": "taxi_sign_cap_slope", "group": "roof_taxi_sign", "from": [-2.05, 14.25, -0.75], "to": [2.05, 14.85, 0.75], "color": "checkerWhite", "col_idx": 4},

        # Front perimeter checkers
        {"name": "taxi_sign_chk_fl", "group": "roof_taxi_sign", "from": [-2.25, 13.25, -1.15], "to": [-0.85, 13.95, -0.95], "color": "checkerBlack", "col_idx": 3},
        {"name": "taxi_sign_chk_fr", "group": "roof_taxi_sign", "from": [0.85, 13.25, -1.15], "to": [2.25, 13.95, -0.95], "color": "checkerBlack", "col_idx": 3},

        # Rear perimeter checkers
        {"name": "taxi_sign_chk_rl", "group": "roof_taxi_sign", "from": [-2.25, 13.25, 0.95], "to": [-0.85, 13.95, 1.15], "color": "checkerBlack", "col_idx": 3},
        {"name": "taxi_sign_chk_rr", "group": "roof_taxi_sign", "from": [0.85, 13.25, 0.95], "to": [2.25, 13.95, 1.15], "color": "checkerBlack", "col_idx": 3},

        # Left perimeter checkers
        {"name": "taxi_sign_chk_side_l1", "group": "roof_taxi_sign", "from": [-2.75, 13.15, -0.85], "to": [-2.55, 13.65, -0.05], "color": "checkerBlack", "col_idx": 3},
        {"name": "taxi_sign_chk_side_l2", "group": "roof_taxi_sign", "from": [-2.75, 13.55, 0.05], "to": [-2.55, 14.05, 0.85], "color": "checkerBlack", "col_idx": 3},

        # Right perimeter checkers
        {"name": "taxi_sign_chk_side_r1", "group": "roof_taxi_sign", "from": [2.55, 13.15, -0.85], "to": [2.75, 13.65, -0.05], "color": "checkerBlack", "col_idx": 3},
        {"name": "taxi_sign_chk_side_r2", "group": "roof_taxi_sign", "from": [2.55, 13.55, 0.05], "to": [2.75, 14.05, 0.85], "color": "checkerBlack", "col_idx": 3},

        # Roof taxi top accent bar
        {"name": "taxi_sign_top_crest", "group": "roof_taxi_sign", "from": [-1.45, 14.75, -0.45], "to": [1.45, 15.05, 0.45], "color": "checkerBlack", "col_idx": 3},
        {"name": "taxi_sign_center_accent", "group": "roof_taxi_sign", "from": [-0.55, 13.35, -1.15], "to": [0.55, 13.85, 1.15], "color": "taxiYellow", "col_idx": 0},

        # =========================================================================
        # 5. BUMPERS, LIGHTS & MIRRORS (20 cubes) - Clearance Y=2.35!
        # =========================================================================
        # Front Bumper & Plate
        {"name": "bumper_front_beam", "group": "bumpers_lights_mirrors", "from": [-6.85, 2.35, -15.15], "to": [6.85, 4.25, -13.65], "color": "bumperSilver", "col_idx": 8},
        {"name": "bumper_front_guard_l", "group": "bumpers_lights_mirrors", "from": [-7.15, 2.15, -15.65], "to": [-5.35, 4.45, -14.25], "color": "bumperGuard", "col_idx": 9},
        {"name": "bumper_front_guard_r", "group": "bumpers_lights_mirrors", "from": [5.35, 2.15, -15.65], "to": [7.15, 4.45, -14.25], "color": "bumperGuard", "col_idx": 9},
        {"name": "license_plate_front_blue", "group": "bumpers_lights_mirrors", "from": [-2.55, 2.55, -15.75], "to": [2.55, 3.85, -14.95], "color": "plateBlue", "col_idx": 14},
        {"name": "license_plate_front_text", "group": "bumpers_lights_mirrors", "from": [-1.95, 2.75, -15.95], "to": [1.95, 3.65, -15.65], "color": "checkerWhite", "col_idx": 4},

        # Front Grille & Lights
        {"name": "front_grille_mesh", "group": "bumpers_lights_mirrors", "from": [-3.15, 4.15, -14.35], "to": [3.15, 6.05, -12.95], "color": "grilleMesh", "col_idx": 15},
        {"name": "front_grille_slats", "group": "bumpers_lights_mirrors", "from": [-2.75, 4.55, -14.65], "to": [2.75, 5.75, -13.95], "color": "bumperSilver", "col_idx": 8},
        {"name": "headlight_lens_left", "group": "bumpers_lights_mirrors", "from": [-5.35, 4.35, -14.25], "to": [-3.45, 5.95, -13.05], "color": "headlightLemon", "col_idx": 11},
        {"name": "headlight_lens_right", "group": "bumpers_lights_mirrors", "from": [3.45, 4.35, -14.25], "to": [5.35, 5.95, -13.05], "color": "headlightLemon", "col_idx": 11},
        {"name": "turn_signal_front_l", "group": "bumpers_lights_mirrors", "from": [-6.45, 4.55, -14.15], "to": [-5.25, 5.75, -13.15], "color": "turnSignalOrange", "col_idx": 12},
        {"name": "turn_signal_front_r", "group": "bumpers_lights_mirrors", "from": [5.25, 4.55, -14.15], "to": [6.45, 5.75, -13.15], "color": "turnSignalOrange", "col_idx": 12},

        # Rear Bumper & Plate
        {"name": "bumper_rear_beam", "group": "bumpers_lights_mirrors", "from": [-6.85, 2.35, 13.65], "to": [6.85, 4.25, 15.15], "color": "bumperSilver", "col_idx": 8},
        {"name": "bumper_rear_guard_l", "group": "bumpers_lights_mirrors", "from": [-7.15, 2.15, 14.25], "to": [-5.35, 4.45, 15.65], "color": "bumperGuard", "col_idx": 9},
        {"name": "bumper_rear_guard_r", "group": "bumpers_lights_mirrors", "from": [5.35, 2.15, 14.25], "to": [7.15, 4.45, 15.65], "color": "bumperGuard", "col_idx": 9},
        {"name": "license_plate_rear_blue", "group": "bumpers_lights_mirrors", "from": [-2.55, 2.55, 14.95], "to": [2.55, 3.85, 15.75], "color": "plateBlue", "col_idx": 14},
        {"name": "license_plate_rear_text", "group": "bumpers_lights_mirrors", "from": [-1.95, 2.75, 15.65], "to": [1.95, 3.65, 15.95], "color": "checkerWhite", "col_idx": 4},

        # Rear Taillights
        {"name": "taillight_lens_left", "group": "bumpers_lights_mirrors", "from": [-6.35, 4.55, 13.05], "to": [-3.85, 6.05, 14.25], "color": "taillightRed", "col_idx": 13},
        {"name": "taillight_lens_right", "group": "bumpers_lights_mirrors", "from": [3.85, 4.55, 13.05], "to": [6.35, 6.05, 14.25], "color": "taillightRed", "col_idx": 13},

        # Side Mirrors (Raised to Y=7.45..8.85)
        {"name": "side_mirror_left", "group": "bumpers_lights_mirrors", "from": [-7.85, 7.45, -4.35], "to": [-5.75, 8.85, -3.05], "color": "checkerBlack", "col_idx": 3},
        {"name": "side_mirror_right", "group": "bumpers_lights_mirrors", "from": [5.75, 7.45, -4.35], "to": [7.85, 8.85, -3.05], "color": "checkerBlack", "col_idx": 3},
    ]
    return cubes

if __name__ == '__main__':
    cubes = build_taxi()
    print(f"Total cubes: {len(cubes)}")
    q_errs = check_quantization(cubes)
    print(f"Quantization errors: {len(q_errs)}")
    min_y = min(c['from'][1] for c in cubes)
    grounded = [c['name'] for c in cubes if c['from'][1] == 0.0]
    print(f"Min Y: {min_y}, grounded cubes count: {len(grounded)}: {grounded}")
    xs = [pt for c in cubes for pt in (c['from'][0], c['to'][0])]
    ys = [pt for c in cubes for pt in (c['from'][1], c['to'][1])]
    zs = [pt for c in cubes for pt in (c['from'][2], c['to'][2])]
    print(f"Bounds: X=[{min(xs):.2f}, {max(xs):.2f}] (W={max(xs)-min(xs):.2f}), Y=[{min(ys):.2f}, {max(ys):.2f}] (H={max(ys)-min(ys):.2f}), Z=[{min(zs):.2f}, {max(zs):.2f}] (D={max(zs)-min(zs):.2f})")
    issues = blockbench_check(cubes)
    print(f"Coplanar overlaps: {len(issues)}")
    for iss in issues:
        print(f"  {iss['c1']} vs {iss['c2']} on {iss['axis']} = {iss['plane']}")
    visited = check_connectivity(cubes)
    print(f"Connected cubes: {len(visited)} / {len(cubes)}")

    out_path = os.path.join(os.path.dirname(__file__), '..', 'assets', 'models', 'taxi_cubes.json')
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(cubes, f, indent=2)
    print(f"Saved {len(cubes)} cubes to {out_path}")
