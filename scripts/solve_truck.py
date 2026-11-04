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

def build_truck():
    cubes = [
        # =========================================================================
        # 1. CHASSIS & WHEELS (26 cubes) - Heavy Rails, Wide Duals, Tank, Toolbox
        # =========================================================================
        {"name": "chassis_rail_left", "group": "chassis_wheels", "from": [-4.65, 2.45, -17.45], "to": [-2.35, 3.95, 18.85], "color": "trimBlack", "col_idx": 3},
        {"name": "chassis_rail_right", "group": "chassis_wheels", "from": [2.35, 2.45, -17.45], "to": [4.65, 3.95, 18.85], "color": "trimBlack", "col_idx": 3},
        {"name": "chassis_cross_front", "group": "chassis_wheels", "from": [-2.65, 2.65, -12.45], "to": [2.65, 3.65, -11.25], "color": "trimBlack", "col_idx": 3},
        {"name": "chassis_cross_mid", "group": "chassis_wheels", "from": [-2.65, 2.65, -1.45], "to": [2.65, 3.65, -0.25], "color": "trimBlack", "col_idx": 3},
        {"name": "chassis_cross_rear", "group": "chassis_wheels", "from": [-2.65, 2.65, 6.25], "to": [2.65, 3.65, 7.45], "color": "trimBlack", "col_idx": 3},
        {"name": "front_axle", "group": "chassis_wheels", "from": [-6.85, 2.25, -14.45], "to": [6.85, 3.45, -13.25], "color": "bumperGuard", "col_idx": 9},
        {"name": "rear_axle", "group": "chassis_wheels", "from": [-6.85, 2.25, 9.25], "to": [6.85, 3.45, 10.45], "color": "bumperGuard", "col_idx": 9},

        # Front-Left Wheel (Z center = -13.85)
        {"name": "wheel_fl_tread_main", "group": "chassis_wheels", "from": [-7.75, 0.00, -15.85], "to": [-5.15, 4.65, -11.85], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_fl_tread_front", "group": "chassis_wheels", "from": [-7.55, 0.85, -16.75], "to": [-5.35, 4.05, -15.75], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_fl_tread_rear", "group": "chassis_wheels", "from": [-7.55, 0.85, -11.95], "to": [-5.35, 4.05, -10.95], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_fl_rim", "group": "chassis_wheels", "from": [-7.95, 1.25, -15.05], "to": [-7.65, 3.65, -12.65], "color": "rimSilver", "col_idx": 7},

        # Front-Right Wheel
        {"name": "wheel_fr_tread_main", "group": "chassis_wheels", "from": [5.15, 0.00, -15.85], "to": [7.75, 4.65, -11.85], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_fr_tread_front", "group": "chassis_wheels", "from": [5.35, 0.85, -16.75], "to": [7.55, 4.05, -15.75], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_fr_tread_rear", "group": "chassis_wheels", "from": [5.35, 0.85, -11.95], "to": [7.55, 4.05, -10.95], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_fr_rim", "group": "chassis_wheels", "from": [7.65, 1.25, -15.05], "to": [7.95, 3.65, -12.65], "color": "rimSilver", "col_idx": 7},

        # Rear-Left Dual Wheel
        {"name": "wheel_rl_tread_main", "group": "chassis_wheels", "from": [-7.95, 0.00, 7.85], "to": [-4.95, 4.65, 11.85], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_rl_tread_front", "group": "chassis_wheels", "from": [-7.75, 0.85, 6.95], "to": [-5.15, 4.05, 7.95], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_rl_tread_rear", "group": "chassis_wheels", "from": [-7.75, 0.85, 11.75], "to": [-5.15, 4.05, 12.75], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_rl_rim", "group": "chassis_wheels", "from": [-8.25, 1.25, 8.65], "to": [-7.85, 3.65, 11.05], "color": "rimSilver", "col_idx": 7},

        # Rear-Right Dual Wheel
        {"name": "wheel_rr_tread_main", "group": "chassis_wheels", "from": [4.95, 0.00, 7.85], "to": [7.95, 4.65, 11.85], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_rr_tread_front", "group": "chassis_wheels", "from": [5.15, 0.85, 6.95], "to": [7.75, 4.05, 7.95], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_rr_tread_rear", "group": "chassis_wheels", "from": [5.15, 0.85, 11.75], "to": [7.75, 4.05, 12.75], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_rr_rim", "group": "chassis_wheels", "from": [7.85, 1.25, 8.65], "to": [8.25, 3.65, 11.05], "color": "rimSilver", "col_idx": 7},

        # Accessories under cargo box
        {"name": "fuel_tank_left", "group": "chassis_wheels", "from": [-7.85, 2.05, -7.25], "to": [-4.75, 3.75, 4.25], "color": "bumperGuard", "col_idx": 9},
        {"name": "battery_box_right", "group": "chassis_wheels", "from": [4.75, 2.05, -6.85], "to": [7.85, 3.75, -1.25], "color": "bumperGuard", "col_idx": 9},
        {"name": "toolbox_right", "group": "chassis_wheels", "from": [4.75, 2.05, 0.25], "to": [7.85, 3.75, 4.85], "color": "trimBlack", "col_idx": 3},
        {"name": "mudflap_rear_l", "group": "chassis_wheels", "from": [-8.05, 1.15, 12.85], "to": [-4.85, 3.95, 13.45], "color": "trimBlack", "col_idx": 3},
        {"name": "mudflap_rear_r", "group": "chassis_wheels", "from": [4.85, 1.15, 12.85], "to": [8.05, 3.95, 13.45], "color": "trimBlack", "col_idx": 3},

        # =========================================================================
        # 2. CAB LOWER (21 cubes) - Emerald Green Cab, Steps, Bumper, Grille
        # =========================================================================
        {"name": "cab_floor", "group": "cab_lower", "from": [-7.15, 3.75, -17.85], "to": [7.15, 4.75, -9.05], "color": "truckGreenDark", "col_idx": 1},
        {"name": "fender_fl", "group": "cab_lower", "from": [-7.55, 4.45, -16.45], "to": [-4.95, 7.45, -13.45], "color": "truckGreenDark", "col_idx": 1},
        {"name": "fender_fr", "group": "cab_lower", "from": [4.95, 4.45, -16.45], "to": [7.55, 7.45, -13.45], "color": "truckGreenDark", "col_idx": 1},
        {"name": "cab_side_step_l", "group": "cab_lower", "from": [-7.85, 2.35, -11.55], "to": [-6.85, 3.25, -9.65], "color": "bumperSilver", "col_idx": 8},
        {"name": "cab_side_step_r", "group": "cab_lower", "from": [6.85, 2.35, -11.55], "to": [7.85, 3.25, -9.65], "color": "bumperSilver", "col_idx": 8},
        {"name": "door_cab_l", "group": "cab_lower", "from": [-7.35, 4.55, -13.55], "to": [-5.25, 7.85, -9.15], "color": "truckGreen", "col_idx": 0},
        {"name": "door_cab_r", "group": "cab_lower", "from": [5.25, 4.55, -13.55], "to": [7.35, 7.85, -9.15], "color": "truckGreen", "col_idx": 0},
        {"name": "door_handle_l", "group": "cab_lower", "from": [-7.55, 6.85, -10.45], "to": [-7.25, 7.45, -9.65], "color": "trimBlack", "col_idx": 3},
        {"name": "door_handle_r", "group": "cab_lower", "from": [7.25, 6.85, -10.45], "to": [7.55, 7.45, -9.65], "color": "trimBlack", "col_idx": 3},
        {"name": "hood_cab_slab", "group": "cab_lower", "from": [-5.05, 4.65, -18.25], "to": [5.05, 7.85, -14.65], "color": "truckGreen", "col_idx": 0},
        {"name": "hood_center_cowl", "group": "cab_lower", "from": [-3.25, 7.55, -17.85], "to": [3.25, 8.25, -14.85], "color": "truckGreenDark", "col_idx": 1},
        {"name": "front_bumper_beam", "group": "cab_lower", "from": [-7.75, 2.35, -19.45], "to": [7.75, 4.45, -18.15], "color": "bumperSilver", "col_idx": 8},
        {"name": "front_bumper_skid", "group": "cab_lower", "from": [-5.25, 1.85, -19.25], "to": [5.25, 2.45, -18.05], "color": "trimBlack", "col_idx": 3},
        {"name": "front_bumper_guard_l", "group": "cab_lower", "from": [-7.85, 2.15, -19.65], "to": [-5.45, 4.65, -18.65], "color": "bumperGuard", "col_idx": 9},
        {"name": "front_bumper_guard_r", "group": "cab_lower", "from": [5.45, 2.15, -19.65], "to": [7.85, 4.65, -18.65], "color": "bumperGuard", "col_idx": 9},
        {"name": "license_plate_front_blue", "group": "cab_lower", "from": [-2.55, 2.65, -19.75], "to": [2.55, 3.95, -19.15], "color": "plateBlue", "col_idx": 14},
        {"name": "license_plate_front_text", "group": "cab_lower", "from": [-1.95, 2.85, -19.95], "to": [1.95, 3.75, -19.65], "color": "cargoWhite", "col_idx": 4},
        {"name": "front_grille_mesh", "group": "cab_lower", "from": [-3.85, 4.35, -18.85], "to": [3.85, 6.95, -17.95], "color": "grilleMesh", "col_idx": 15},
        {"name": "front_grille_slats", "group": "cab_lower", "from": [-3.45, 4.65, -19.05], "to": [3.45, 6.65, -18.45], "color": "bumperSilver", "col_idx": 8},
        {"name": "headlight_l", "group": "cab_lower", "from": [-6.45, 4.75, -18.75], "to": [-4.15, 6.55, -17.95], "color": "headlightIce", "col_idx": 11},
        {"name": "headlight_r", "group": "cab_lower", "from": [4.15, 4.75, -18.75], "to": [6.45, 6.55, -17.95], "color": "headlightIce", "col_idx": 11},

        # =========================================================================
        # 3. CAB UPPER & GLASS (18 cubes) - Sky-Blue Glass, Markers, Fairing, Mirrors
        # =========================================================================
        {"name": "windshield_cab", "group": "cab_upper_glass", "from": [-4.95, 7.65, -15.15], "to": [4.95, 12.85, -13.25], "color": "glassSky", "col_idx": 10},
        {"name": "side_window_l", "group": "cab_upper_glass", "from": [-6.85, 7.75, -13.45], "to": [-5.05, 12.75, -9.25], "color": "glassSky", "col_idx": 10},
        {"name": "side_window_r", "group": "cab_upper_glass", "from": [5.05, 7.75, -13.45], "to": [6.85, 12.75, -9.25], "color": "glassSky", "col_idx": 10},
        {"name": "pillar_a_l", "group": "cab_upper_glass", "from": [-7.15, 7.55, -15.35], "to": [-4.85, 12.95, -13.15], "color": "truckGreen", "col_idx": 0},
        {"name": "pillar_a_r", "group": "cab_upper_glass", "from": [4.85, 7.55, -15.35], "to": [7.15, 12.95, -13.15], "color": "truckGreen", "col_idx": 0},
        {"name": "pillar_b_l", "group": "cab_upper_glass", "from": [-7.15, 7.55, -9.75], "to": [-4.85, 12.95, -9.05], "color": "truckGreen", "col_idx": 0},
        {"name": "pillar_b_r", "group": "cab_upper_glass", "from": [4.85, 7.55, -9.75], "to": [7.15, 12.95, -9.05], "color": "truckGreen", "col_idx": 0},
        {"name": "cab_roof_slab", "group": "cab_upper_glass", "from": [-7.25, 12.65, -14.85], "to": [7.25, 13.95, -9.15], "color": "truckGreen", "col_idx": 0},
        {"name": "cab_roof_brow", "group": "cab_upper_glass", "from": [-7.05, 12.75, -15.45], "to": [7.05, 13.75, -14.65], "color": "truckGreenDark", "col_idx": 1},

        # 3 Amber Cab Marker Lights
        {"name": "marker_light_l", "group": "cab_upper_glass", "from": [-4.25, 13.85, -15.15], "to": [-2.65, 14.35, -14.25], "color": "turnSignalAmber", "col_idx": 12},
        {"name": "marker_light_c", "group": "cab_upper_glass", "from": [-0.85, 13.85, -15.15], "to": [0.85, 14.35, -14.25], "color": "turnSignalAmber", "col_idx": 12},
        {"name": "marker_light_r", "group": "cab_upper_glass", "from": [2.65, 13.85, -15.15], "to": [4.25, 14.35, -14.25], "color": "turnSignalAmber", "col_idx": 12},

        # Aerodynamic Wind Fairing / Deflector
        {"name": "aero_deflector_base", "group": "cab_upper_glass", "from": [-6.85, 13.85, -12.85], "to": [6.85, 16.45, -9.05], "color": "cargoWhite", "col_idx": 4},
        {"name": "aero_deflector_top", "group": "cab_upper_glass", "from": [-6.45, 16.35, -11.25], "to": [6.45, 19.85, -8.95], "color": "cargoWhite", "col_idx": 4},

        # Truck Side Mirrors (Brackets, Bodies, Reflective Glass)
        {"name": "mirror_bracket_l", "group": "cab_upper_glass", "from": [-8.35, 8.85, -14.15], "to": [-7.05, 9.65, -13.25], "color": "trimBlack", "col_idx": 3},
        {"name": "mirror_body_l", "group": "cab_upper_glass", "from": [-8.45, 8.25, -14.35], "to": [-7.45, 11.85, -12.95], "color": "truckGreen", "col_idx": 0},
        {"name": "mirror_glass_l", "group": "cab_upper_glass", "from": [-8.35, 8.45, -13.05], "to": [-7.55, 11.65, -12.75], "color": "rimSilver", "col_idx": 7},
        {"name": "mirror_bracket_r", "group": "cab_upper_glass", "from": [7.05, 8.85, -14.15], "to": [8.35, 9.65, -13.25], "color": "trimBlack", "col_idx": 3},
        {"name": "mirror_body_r", "group": "cab_upper_glass", "from": [7.45, 8.25, -14.35], "to": [8.45, 11.85, -12.95], "color": "truckGreen", "col_idx": 0},
        {"name": "mirror_glass_r", "group": "cab_upper_glass", "from": [7.55, 8.45, -13.05], "to": [8.35, 11.65, -12.75], "color": "rimSilver", "col_idx": 7},

        # =========================================================================
        # 4. CARGO BOX (19 cubes) - Monolithic Isothermal Box, Doors, Clean Sides
        # =========================================================================
        {"name": "box_main_body", "group": "cargo_box", "from": [-8.15, 3.85, -9.35], "to": [8.15, 21.65, 18.25], "color": "cargoWhite", "col_idx": 4},
        {"name": "box_roof_cap", "group": "cargo_box", "from": [-8.05, 21.55, -9.15], "to": [8.05, 21.95, 18.15], "color": "cargoWhite", "col_idx": 4},

        # Protective Rub-Rails (Continuous full-length silver rails)
        {"name": "rub_rail_bottom_l", "group": "cargo_box", "from": [-8.35, 4.45, -8.95], "to": [-8.05, 5.45, 17.95], "color": "bumperSilver", "col_idx": 8},
        {"name": "rub_rail_bottom_r", "group": "cargo_box", "from": [8.05, 4.45, -8.95], "to": [8.35, 5.45, 17.95], "color": "bumperSilver", "col_idx": 8},
        {"name": "rub_rail_top_l", "group": "cargo_box", "from": [-8.35, 21.15, -9.05], "to": [-7.85, 21.85, 18.05], "color": "bumperGuard", "col_idx": 9},
        {"name": "rub_rail_top_r", "group": "cargo_box", "from": [7.85, 21.15, -9.05], "to": [8.35, 21.85, 18.05], "color": "bumperGuard", "col_idx": 9},

        # Green Brand Accent Stripes along sides
        {"name": "brand_stripe_l", "group": "cargo_box", "from": [-8.25, 12.25, -7.45], "to": [-8.05, 13.85, 16.85], "color": "truckGreen", "col_idx": 0},
        {"name": "brand_stripe_r", "group": "cargo_box", "from": [8.05, 12.25, -7.45], "to": [8.25, 13.85, 16.85], "color": "truckGreen", "col_idx": 0},

        # Rear Double Doors & Frame
        {"name": "door_panel_l", "group": "cargo_box", "from": [-7.75, 4.55, 18.15], "to": [-0.15, 20.85, 18.65], "color": "cargoWhite", "col_idx": 4},
        {"name": "door_panel_r", "group": "cargo_box", "from": [0.15, 4.55, 18.15], "to": [7.75, 20.85, 18.65], "color": "cargoWhite", "col_idx": 4},
        {"name": "door_center_gasket", "group": "cargo_box", "from": [-0.25, 4.45, 18.55], "to": [0.25, 21.05, 18.85], "color": "trimBlack", "col_idx": 3},

        # Chrome Locking Rods & Handles
        {"name": "door_rod_l", "group": "cargo_box", "from": [-4.45, 4.85, 18.55], "to": [-3.85, 20.65, 19.05], "color": "rimSilver", "col_idx": 7},
        {"name": "door_rod_r", "group": "cargo_box", "from": [3.85, 4.85, 18.55], "to": [4.45, 20.65, 19.05], "color": "rimSilver", "col_idx": 7},
        {"name": "door_handle_cam_l", "group": "cargo_box", "from": [-4.65, 10.25, 18.95], "to": [-3.25, 11.25, 19.35], "color": "trimBlack", "col_idx": 3},
        {"name": "door_handle_cam_r", "group": "cargo_box", "from": [3.25, 10.25, 18.95], "to": [4.65, 11.25, 19.35], "color": "trimBlack", "col_idx": 3},

        # Door Hinges
        {"name": "door_hinge_top_l", "group": "cargo_box", "from": [-8.05, 18.45, 18.35], "to": [-7.45, 19.45, 18.85], "color": "trimBlack", "col_idx": 3},
        {"name": "door_hinge_bot_l", "group": "cargo_box", "from": [-8.05, 6.25, 18.35], "to": [-7.45, 7.25, 18.85], "color": "trimBlack", "col_idx": 3},
        {"name": "door_hinge_top_r", "group": "cargo_box", "from": [7.45, 18.45, 18.35], "to": [8.05, 19.45, 18.85], "color": "trimBlack", "col_idx": 3},
        {"name": "door_hinge_bot_r", "group": "cargo_box", "from": [7.45, 6.25, 18.35], "to": [8.05, 7.25, 18.85], "color": "trimBlack", "col_idx": 3},

        # =========================================================================
        # 5. REAR BUMPER & LIGHTS (12 cubes) - Underrun Bar, Triple Lights, Markers
        # =========================================================================
        {"name": "rear_underrun_bar", "group": "rear_bumper_lights", "from": [-7.65, 2.25, 18.65], "to": [7.65, 3.45, 19.65], "color": "bumperSilver", "col_idx": 8},
        {"name": "rear_plate_blue", "group": "rear_bumper_lights", "from": [-2.55, 2.45, 19.55], "to": [2.55, 3.65, 19.85], "color": "plateBlue", "col_idx": 14},
        {"name": "rear_plate_text", "group": "rear_bumper_lights", "from": [-1.95, 2.65, 19.75], "to": [1.95, 3.45, 20.05], "color": "cargoWhite", "col_idx": 4},
        {"name": "taillight_truck_l", "group": "rear_bumper_lights", "from": [-7.25, 2.35, 19.55], "to": [-4.85, 3.35, 19.85], "color": "taillightRed", "col_idx": 13},
        {"name": "taillight_truck_r", "group": "rear_bumper_lights", "from": [4.85, 2.35, 19.55], "to": [7.25, 3.35, 19.85], "color": "taillightRed", "col_idx": 13},

        # Rear Upper Clearance Red Marker Lights
        {"name": "marker_upper_rear_l", "group": "rear_bumper_lights", "from": [-7.65, 21.25, 18.35], "to": [-6.45, 21.85, 18.85], "color": "taillightRed", "col_idx": 13},
        {"name": "marker_upper_rear_r", "group": "rear_bumper_lights", "from": [6.45, 21.25, 18.35], "to": [7.65, 21.85, 18.85], "color": "taillightRed", "col_idx": 13},

        # Side Marker Reflectors on Cargo Box
        {"name": "side_reflector_fl", "group": "rear_bumper_lights", "from": [-8.25, 5.85, -6.85], "to": [-8.05, 6.65, -5.65], "color": "turnSignalAmber", "col_idx": 12},
        {"name": "side_reflector_fr", "group": "rear_bumper_lights", "from": [8.05, 5.85, -6.85], "to": [8.25, 6.65, -5.65], "color": "turnSignalAmber", "col_idx": 12},
        {"name": "side_reflector_rl", "group": "rear_bumper_lights", "from": [-8.25, 5.85, 15.25], "to": [-8.05, 6.65, 16.45], "color": "taillightRed", "col_idx": 13},
        {"name": "side_reflector_rr", "group": "rear_bumper_lights", "from": [8.05, 5.85, 15.25], "to": [8.25, 6.65, 16.45], "color": "taillightRed", "col_idx": 13},

        # Exhaust Pipe Under Chassis
        {"name": "exhaust_pipe_truck", "group": "rear_bumper_lights", "from": [4.05, 1.85, -10.45], "to": [4.75, 2.65, -7.85], "color": "rimSilver", "col_idx": 7},
    ]
    return cubes

if __name__ == '__main__':
    cubes = build_truck()
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

    out_path = os.path.join(os.path.dirname(__file__), '..', 'assets', 'models', 'truck_cubes.json')
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(cubes, f, indent=2)
    print(f"Saved {len(cubes)} cubes to {out_path}")
