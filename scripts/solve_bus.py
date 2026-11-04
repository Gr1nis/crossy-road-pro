import json
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

def build_bus():
    cubes = [
        # =========================================================================
        # 1. CHASSIS & RUNNING GEAR (22 cubes)
        # =========================================================================
        {"name": "chassis_rail_left", "group": "chassis_running_gear", "from": [-4.65, 2.55, -25.45], "to": [-2.35, 3.95, 26.85], "color": "trimBlack", "col_idx": 3},
        {"name": "chassis_rail_right", "group": "chassis_running_gear", "from": [2.35, 2.55, -25.45], "to": [4.65, 3.95, 26.85], "color": "trimBlack", "col_idx": 3},
        {"name": "chassis_cross_front", "group": "chassis_running_gear", "from": [-2.65, 2.65, -17.45], "to": [2.65, 3.65, -16.25], "color": "trimBlack", "col_idx": 3},
        {"name": "chassis_cross_mid", "group": "chassis_running_gear", "from": [-2.65, 2.65, -1.45], "to": [2.65, 3.65, -0.25], "color": "trimBlack", "col_idx": 3},
        {"name": "chassis_cross_rear", "group": "chassis_running_gear", "from": [-2.65, 2.65, 14.25], "to": [2.65, 3.65, 15.45], "color": "trimBlack", "col_idx": 3},
        {"name": "front_axle", "group": "chassis_running_gear", "from": [-6.85, 2.25, -19.45], "to": [6.85, 3.45, -18.25], "color": "bumperGuard", "col_idx": 9},
        {"name": "rear_axle", "group": "chassis_running_gear", "from": [-6.85, 2.25, 16.25], "to": [6.85, 3.45, 17.45], "color": "bumperGuard", "col_idx": 9},

        # Front-Left Wheel (Z center = -18.85)
        {"name": "wheel_fl_tread_main", "group": "chassis_running_gear", "from": [-7.85, 0.00, -20.85], "to": [-5.15, 4.65, -16.85], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_fl_tread_front", "group": "chassis_running_gear", "from": [-7.65, 0.85, -21.75], "to": [-5.35, 3.95, -20.75], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_fl_tread_rear", "group": "chassis_running_gear", "from": [-7.65, 0.85, -16.95], "to": [-5.35, 3.95, -15.95], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_fl_rim", "group": "chassis_running_gear", "from": [-8.05, 1.25, -20.05], "to": [-7.75, 3.55, -17.65], "color": "rimSilver", "col_idx": 7},

        # Front-Right Wheel
        {"name": "wheel_fr_tread_main", "group": "chassis_running_gear", "from": [5.15, 0.00, -20.85], "to": [7.85, 4.65, -16.85], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_fr_tread_front", "group": "chassis_running_gear", "from": [5.35, 0.85, -21.75], "to": [7.65, 3.85, -20.75], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_fr_tread_rear", "group": "chassis_running_gear", "from": [5.35, 0.85, -16.95], "to": [7.65, 3.85, -15.95], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_fr_rim", "group": "chassis_running_gear", "from": [7.75, 1.25, -20.05], "to": [8.05, 3.55, -17.65], "color": "rimSilver", "col_idx": 7},

        # Rear-Left Wheel (Z center = 16.85)
        {"name": "wheel_rl_tread_main", "group": "chassis_running_gear", "from": [-8.05, 0.00, 14.85], "to": [-4.95, 4.65, 18.85], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_rl_tread_front", "group": "chassis_running_gear", "from": [-7.75, 0.85, 13.95], "to": [-5.15, 3.95, 14.95], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_rl_tread_rear", "group": "chassis_running_gear", "from": [-7.75, 0.85, 18.75], "to": [-5.15, 3.95, 19.75], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_rl_rim", "group": "chassis_running_gear", "from": [-8.25, 1.25, 15.65], "to": [-7.85, 3.55, 18.05], "color": "rimSilver", "col_idx": 7},

        # Rear-Right Wheel
        {"name": "wheel_rr_tread_main", "group": "chassis_running_gear", "from": [4.95, 0.00, 14.85], "to": [8.05, 4.65, 18.85], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_rr_tread_front", "group": "chassis_running_gear", "from": [5.15, 0.85, 13.95], "to": [7.75, 3.95, 14.95], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_rr_tread_rear", "group": "chassis_running_gear", "from": [5.15, 0.85, 18.75], "to": [7.75, 3.95, 19.75], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_rr_rim", "group": "chassis_running_gear", "from": [7.85, 1.25, 15.65], "to": [8.25, 3.55, 18.05], "color": "rimSilver", "col_idx": 7},

        # Underfloor equipment & exhaust
        {"name": "underfloor_pack_l", "group": "chassis_running_gear", "from": [-7.75, 2.05, -11.85], "to": [-4.75, 3.45, 9.85], "color": "bumperGuard", "col_idx": 9},
        {"name": "underfloor_pack_r", "group": "chassis_running_gear", "from": [4.75, 2.05, -11.85], "to": [7.75, 3.45, 9.85], "color": "bumperGuard", "col_idx": 9},
        {"name": "exhaust_pipe_bus", "group": "chassis_running_gear", "from": [-4.55, 1.95, 25.45], "to": [-3.75, 2.45, 27.55], "color": "rimSilver", "col_idx": 7},
        {"name": "exhaust_guard", "group": "chassis_running_gear", "from": [-4.95, 1.65, 25.05], "to": [-3.65, 2.75, 26.45], "color": "bumperGuard", "col_idx": 9},
        {"name": "mudflap_rear_l", "group": "chassis_running_gear", "from": [-8.05, 1.15, 19.85], "to": [-4.85, 3.95, 20.45], "color": "trimBlack", "col_idx": 3},
        {"name": "mudflap_rear_r", "group": "chassis_running_gear", "from": [4.85, 1.15, 19.85], "to": [8.05, 3.95, 20.45], "color": "trimBlack", "col_idx": 3},

        # =========================================================================
        # 2. BUS BODY LOWER (27 cubes)
        # =========================================================================
        {"name": "bus_floor_slab", "group": "bus_body_lower", "from": [-7.45, 3.75, -26.45], "to": [7.45, 4.75, 26.45], "color": "busRedDark", "col_idx": 1},

        # Front Bumper & Fascia
        {"name": "front_bumper_beam", "group": "bus_body_lower", "from": [-7.75, 2.35, -27.85], "to": [7.75, 4.45, -26.55], "color": "bumperSilver", "col_idx": 8},
        {"name": "front_bumper_skid", "group": "bus_body_lower", "from": [-5.45, 1.85, -27.65], "to": [5.45, 2.45, -26.45], "color": "trimBlack", "col_idx": 3},
        {"name": "front_bumper_guard_l", "group": "bus_body_lower", "from": [-7.85, 2.15, -28.05], "to": [-5.65, 4.55, -27.05], "color": "bumperGuard", "col_idx": 9},
        {"name": "front_bumper_guard_r", "group": "bus_body_lower", "from": [5.65, 2.15, -28.05], "to": [7.85, 4.55, -27.05], "color": "bumperGuard", "col_idx": 9},
        {"name": "front_plate_blue", "group": "bus_body_lower", "from": [-2.55, 2.65, -28.15], "to": [2.55, 3.85, -27.55], "color": "plateBlue", "col_idx": 14},
        {"name": "front_plate_text", "group": "bus_body_lower", "from": [-1.95, 2.85, -28.25], "to": [1.95, 3.65, -27.95], "color": "roofWhite", "col_idx": 4},
        {"name": "front_grille_mesh", "group": "bus_body_lower", "from": [-4.65, 4.35, -27.45], "to": [4.65, 6.75, -26.75], "color": "grilleMesh", "col_idx": 15},
        {"name": "front_grille_slats", "group": "bus_body_lower", "from": [-4.25, 4.85, -27.65], "to": [4.25, 6.35, -27.05], "color": "bumperSilver", "col_idx": 8},
        {"name": "headlight_l", "group": "bus_body_lower", "from": [-7.45, 4.75, -27.55], "to": [-5.15, 6.55, -26.75], "color": "headlightIce", "col_idx": 11},
        {"name": "headlight_r", "group": "bus_body_lower", "from": [5.15, 4.75, -27.55], "to": [7.45, 6.55, -26.75], "color": "headlightIce", "col_idx": 11},
        {"name": "front_cowl_slab", "group": "bus_body_lower", "from": [-7.35, 4.65, -26.85], "to": [7.35, 7.75, -24.45], "color": "busRed", "col_idx": 0},

        # Left Lower Body
        {"name": "lower_wall_left", "group": "bus_body_lower", "from": [-7.65, 4.55, -25.25], "to": [-5.25, 7.85, 25.85], "color": "busRed", "col_idx": 0},
        {"name": "side_skirt_rub_l", "group": "bus_body_lower", "from": [-7.95, 4.35, -25.05], "to": [-7.55, 5.25, 25.65], "color": "trimBlack", "col_idx": 3},
        {"name": "side_stripe_l", "group": "bus_body_lower", "from": [-7.85, 7.75, -24.85], "to": [-7.55, 8.45, 25.25], "color": "roofWhite", "col_idx": 4},

        # Right Lower Body
        {"name": "lower_wall_r_front", "group": "bus_body_lower", "from": [5.25, 4.55, -26.25], "to": [7.65, 7.85, -23.95], "color": "busRed", "col_idx": 0},
        {"name": "door_step_front_r", "group": "bus_body_lower", "from": [5.05, 2.85, -23.75], "to": [7.55, 3.55, -20.65], "color": "bumperGuard", "col_idx": 9},
        {"name": "lower_wall_r_mid1", "group": "bus_body_lower", "from": [5.25, 4.55, -20.45], "to": [7.65, 7.85, -2.55], "color": "busRed", "col_idx": 0},
        {"name": "door_step_center_r", "group": "bus_body_lower", "from": [5.05, 2.85, -2.35], "to": [7.55, 3.55, 2.45], "color": "bumperGuard", "col_idx": 9},
        {"name": "lower_wall_r_mid2", "group": "bus_body_lower", "from": [5.25, 4.55, 2.65], "to": [7.65, 7.85, 26.25], "color": "busRed", "col_idx": 0},
        {"name": "side_skirt_rub_r", "group": "bus_body_lower", "from": [7.55, 4.35, -20.25], "to": [7.95, 5.25, -2.75], "color": "trimBlack", "col_idx": 3},
        {"name": "side_skirt_rub_r2", "group": "bus_body_lower", "from": [7.55, 4.35, 2.85], "to": [7.95, 5.25, 25.65], "color": "trimBlack", "col_idx": 3},
        {"name": "side_stripe_r1", "group": "bus_body_lower", "from": [7.55, 7.75, -20.25], "to": [7.85, 8.45, -2.85], "color": "roofWhite", "col_idx": 4},
        {"name": "side_stripe_r2", "group": "bus_body_lower", "from": [7.55, 7.75, 2.85], "to": [7.85, 8.45, 25.25], "color": "roofWhite", "col_idx": 4},

        # Rear Bumper & Fascia
        {"name": "rear_bumper_beam", "group": "bus_body_lower", "from": [-7.75, 2.35, 26.65], "to": [7.75, 4.45, 27.85], "color": "bumperSilver", "col_idx": 8},
        {"name": "rear_bumper_skid", "group": "bus_body_lower", "from": [-5.45, 1.85, 26.55], "to": [5.45, 2.25, 27.65], "color": "trimBlack", "col_idx": 3},
        {"name": "rear_plate_blue", "group": "bus_body_lower", "from": [-2.55, 2.65, 27.65], "to": [2.55, 3.85, 28.15], "color": "plateBlue", "col_idx": 14},
        {"name": "rear_plate_text", "group": "bus_body_lower", "from": [-1.95, 2.85, 27.95], "to": [1.95, 3.65, 28.25], "color": "roofWhite", "col_idx": 4},
        {"name": "rear_engine_door", "group": "bus_body_lower", "from": [-5.85, 4.65, 26.35], "to": [5.85, 7.85, 27.15], "color": "busRedDark", "col_idx": 1},
        {"name": "rear_engine_vent_grille", "group": "bus_body_lower", "from": [-4.65, 5.05, 27.25], "to": [4.65, 7.45, 27.65], "color": "grilleMesh", "col_idx": 15},

        # =========================================================================
        # 3. PASSENGER SALON & GLAZING (28 cubes)
        # =========================================================================
        {"name": "windshield_front", "group": "passenger_salon_glass", "from": [-5.15, 7.65, -26.35], "to": [5.15, 14.85, -24.55], "color": "glassSky", "col_idx": 10},
        {"name": "route_box_housing", "group": "passenger_salon_glass", "from": [-4.75, 14.75, -26.45], "to": [4.75, 16.95, -24.85], "color": "trimBlack", "col_idx": 3},
        {"name": "route_led_display", "group": "passenger_salon_glass", "from": [-4.15, 15.05, -26.65], "to": [4.15, 16.55, -26.15], "color": "routeAmber", "col_idx": 12},
        {"name": "pillar_a_left", "group": "passenger_salon_glass", "from": [-7.45, 7.55, -26.45], "to": [-5.05, 16.95, -24.15], "color": "busRed", "col_idx": 0},
        {"name": "pillar_a_right", "group": "passenger_salon_glass", "from": [5.05, 7.55, -26.45], "to": [7.45, 16.95, -24.15], "color": "busRed", "col_idx": 0},

        # Wipers
        {"name": "wiper_blade_l", "group": "passenger_salon_glass", "from": [-4.65, 7.95, -26.45], "to": [-1.25, 8.55, -26.15], "color": "trimBlack", "col_idx": 3},
        {"name": "wiper_blade_r", "group": "passenger_salon_glass", "from": [0.85, 7.95, -26.45], "to": [4.25, 8.55, -26.15], "color": "trimBlack", "col_idx": 3},

        # Left Side Panoramic Glazing & Mullions
        {"name": "glass_strip_left", "group": "passenger_salon_glass", "from": [-7.15, 7.75, -24.05], "to": [-5.15, 15.65, 25.55], "color": "glassSky", "col_idx": 10},
        {"name": "mullion_l_1", "group": "passenger_salon_glass", "from": [-7.35, 7.65, -15.25], "to": [-6.95, 15.75, -14.25], "color": "trimBlack", "col_idx": 3},
        {"name": "mullion_l_2", "group": "passenger_salon_glass", "from": [-7.35, 7.65, -5.25], "to": [-6.95, 15.75, -4.25], "color": "trimBlack", "col_idx": 3},
        {"name": "mullion_l_3", "group": "passenger_salon_glass", "from": [-7.35, 7.65, 5.25], "to": [-6.95, 15.75, 6.25], "color": "trimBlack", "col_idx": 3},
        {"name": "mullion_l_4", "group": "passenger_salon_glass", "from": [-7.35, 7.65, 15.25], "to": [-6.95, 15.75, 16.25], "color": "trimBlack", "col_idx": 3},

        # Right Side Glazing & Passenger Doors
        {"name": "door_front_leaf_1", "group": "passenger_salon_glass", "from": [5.25, 3.95, -23.75], "to": [7.25, 15.25, -22.35], "color": "glassSky", "col_idx": 10},
        {"name": "door_front_leaf_2", "group": "passenger_salon_glass", "from": [5.25, 3.95, -22.05], "to": [7.25, 15.25, -20.65], "color": "glassSky", "col_idx": 10},
        {"name": "door_front_gasket", "group": "passenger_salon_glass", "from": [7.15, 3.65, -22.45], "to": [7.35, 15.45, -21.95], "color": "trimBlack", "col_idx": 3},

        {"name": "glass_bay_r1", "group": "passenger_salon_glass", "from": [5.15, 7.75, -20.35], "to": [7.15, 15.65, -2.65], "color": "glassSky", "col_idx": 10},
        {"name": "mullion_r_1", "group": "passenger_salon_glass", "from": [6.95, 7.65, -11.65], "to": [7.35, 15.75, -10.65], "color": "trimBlack", "col_idx": 3},

        {"name": "door_mid_leaf_1", "group": "passenger_salon_glass", "from": [5.25, 3.95, -2.25], "to": [7.25, 15.25, -0.15], "color": "glassSky", "col_idx": 10},
        {"name": "door_mid_leaf_2", "group": "passenger_salon_glass", "from": [5.25, 3.95, 0.15], "to": [7.25, 15.25, 2.35], "color": "glassSky", "col_idx": 10},
        {"name": "door_mid_gasket", "group": "passenger_salon_glass", "from": [7.15, 3.65, -0.25], "to": [7.35, 15.45, 0.25], "color": "trimBlack", "col_idx": 3},

        {"name": "glass_bay_r2", "group": "passenger_salon_glass", "from": [5.15, 7.75, 2.55], "to": [7.15, 15.65, 25.55], "color": "glassSky", "col_idx": 10},
        {"name": "mullion_r_2", "group": "passenger_salon_glass", "from": [6.95, 7.65, 10.25], "to": [7.35, 15.75, 11.25], "color": "trimBlack", "col_idx": 3},
        {"name": "mullion_r_3", "group": "passenger_salon_glass", "from": [6.95, 7.65, 18.25], "to": [7.35, 15.75, 19.25], "color": "trimBlack", "col_idx": 3},

        # Rear Glazing & Rear Pillars
        {"name": "rear_window_glass", "group": "passenger_salon_glass", "from": [-5.15, 8.25, 25.65], "to": [5.15, 15.25, 27.25], "color": "glassSky", "col_idx": 10},
        {"name": "pillar_rear_left", "group": "passenger_salon_glass", "from": [-7.45, 7.55, 25.45], "to": [-5.05, 16.95, 27.35], "color": "busRed", "col_idx": 0},
        {"name": "pillar_rear_right", "group": "passenger_salon_glass", "from": [5.05, 7.55, 25.45], "to": [7.45, 16.95, 27.35], "color": "busRed", "col_idx": 0},

        # Interior Seats & Barrier
        {"name": "seat_row_1", "group": "passenger_salon_glass", "from": [-4.85, 4.65, -14.25], "to": [-2.25, 7.45, -11.65], "color": "busRedDeep", "col_idx": 2},
        {"name": "seat_row_2", "group": "passenger_salon_glass", "from": [-4.85, 4.65, -3.85], "to": [-2.25, 7.45, -1.25], "color": "busRedDeep", "col_idx": 2},
        {"name": "seat_row_3", "group": "passenger_salon_glass", "from": [-4.85, 4.65, 6.85], "to": [-2.25, 7.45, 9.45], "color": "busRedDeep", "col_idx": 2},
        {"name": "interior_driver_barrier", "group": "passenger_salon_glass", "from": [-5.05, 4.65, -20.45], "to": [0.45, 12.85, -19.45], "color": "bumperGuard", "col_idx": 9},

        # =========================================================================
        # 4. ROOF, AERODYNAMICS & HVAC (14 cubes)
        # =========================================================================
        {"name": "roof_main_slab", "group": "roof_aerodynamics_ac", "from": [-7.65, 15.55, -26.25], "to": [7.65, 17.85, 26.65], "color": "roofWhite", "col_idx": 4},
        {"name": "roof_cap_front", "group": "roof_aerodynamics_ac", "from": [-7.35, 16.75, -26.75], "to": [7.35, 18.25, -24.65], "color": "busRedDark", "col_idx": 1},
        {"name": "roof_cap_rear", "group": "roof_aerodynamics_ac", "from": [-7.35, 16.75, 25.05], "to": [7.35, 18.25, 27.15], "color": "busRedDark", "col_idx": 1},

        # Front HVAC Unit
        {"name": "roof_ac_front_base", "group": "roof_aerodynamics_ac", "from": [-5.25, 17.75, -18.85], "to": [5.25, 19.45, -11.85], "color": "roofWhite", "col_idx": 4},
        {"name": "roof_ac_front_vents", "group": "roof_aerodynamics_ac", "from": [-4.65, 19.35, -18.25], "to": [4.65, 19.85, -12.45], "color": "trimBlack", "col_idx": 3},
        {"name": "roof_fan_front", "group": "roof_aerodynamics_ac", "from": [-2.25, 19.75, -16.25], "to": [2.25, 20.25, -14.25], "color": "trimBlack", "col_idx": 3},

        # Rear HVAC Unit
        {"name": "roof_ac_rear_base", "group": "roof_aerodynamics_ac", "from": [-5.25, 17.75, 4.85], "to": [5.25, 19.45, 11.85], "color": "roofWhite", "col_idx": 4},
        {"name": "roof_ac_rear_vents", "group": "roof_aerodynamics_ac", "from": [-4.65, 19.35, 5.45], "to": [4.65, 19.85, 11.25], "color": "trimBlack", "col_idx": 3},
        {"name": "roof_fan_rear", "group": "roof_aerodynamics_ac", "from": [-2.25, 19.75, 7.25], "to": [2.25, 20.25, 9.25], "color": "trimBlack", "col_idx": 3},

        # Roof Hatches
        {"name": "roof_hatch_front", "group": "roof_aerodynamics_ac", "from": [-3.25, 17.75, -6.25], "to": [3.25, 18.35, -3.25], "color": "roofWhite", "col_idx": 4},
        {"name": "roof_hatch_rear", "group": "roof_aerodynamics_ac", "from": [-3.25, 17.75, 16.25], "to": [3.25, 18.35, 19.25], "color": "roofWhite", "col_idx": 4},

        # Front Clearance Lights (Amber)
        {"name": "marker_roof_fl", "group": "roof_aerodynamics_ac", "from": [-5.45, 17.65, -26.95], "to": [-3.85, 18.35, -26.05], "color": "turnSignalAmber", "col_idx": 12},
        {"name": "marker_roof_fc", "group": "roof_aerodynamics_ac", "from": [-0.85, 17.65, -26.95], "to": [0.85, 18.35, -26.05], "color": "turnSignalAmber", "col_idx": 12},
        {"name": "marker_roof_fr", "group": "roof_aerodynamics_ac", "from": [3.85, 17.65, -26.95], "to": [5.45, 18.35, -26.05], "color": "turnSignalAmber", "col_idx": 12},

        # =========================================================================
        # 5. MIRRORS, LIGHTS & DETAILS (18 cubes)
        # =========================================================================
        # Left Mirror
        {"name": "mirror_bracket_l", "group": "mirrors_lights_details", "from": [-8.45, 12.85, -25.85], "to": [-7.35, 13.65, -24.85], "color": "trimBlack", "col_idx": 3},
        {"name": "mirror_body_l", "group": "mirrors_lights_details", "from": [-8.55, 10.25, -26.05], "to": [-7.55, 15.85, -24.65], "color": "busRed", "col_idx": 0},
        {"name": "mirror_glass_l", "group": "mirrors_lights_details", "from": [-8.35, 10.45, -24.75], "to": [-7.75, 15.65, -24.45], "color": "rimSilver", "col_idx": 7},

        # Right Mirror
        {"name": "mirror_bracket_r", "group": "mirrors_lights_details", "from": [7.35, 12.85, -25.85], "to": [8.45, 13.65, -24.85], "color": "trimBlack", "col_idx": 3},
        {"name": "mirror_body_r", "group": "mirrors_lights_details", "from": [7.55, 10.25, -26.05], "to": [8.55, 15.85, -24.65], "color": "busRed", "col_idx": 0},
        {"name": "mirror_glass_r", "group": "mirrors_lights_details", "from": [7.75, 10.45, -24.75], "to": [8.35, 15.65, -24.45], "color": "rimSilver", "col_idx": 7},

        # Rear Vertical Taillights
        {"name": "taillight_l_stop", "group": "mirrors_lights_details", "from": [-7.35, 5.65, 27.25], "to": [-5.65, 8.25, 27.65], "color": "taillightRed", "col_idx": 13},
        {"name": "taillight_l_turn", "group": "mirrors_lights_details", "from": [-7.25, 8.15, 27.45], "to": [-5.75, 10.25, 27.85], "color": "turnSignalAmber", "col_idx": 12},
        {"name": "taillight_r_stop", "group": "mirrors_lights_details", "from": [5.65, 5.65, 27.25], "to": [7.35, 8.25, 27.65], "color": "taillightRed", "col_idx": 13},
        {"name": "taillight_r_turn", "group": "mirrors_lights_details", "from": [5.75, 8.15, 27.45], "to": [7.25, 10.25, 27.85], "color": "turnSignalAmber", "col_idx": 12},

        # Rear Upper Clearance Markers & Sign
        {"name": "marker_roof_rl", "group": "mirrors_lights_details", "from": [-7.15, 17.65, 26.55], "to": [-5.85, 18.35, 27.25], "color": "taillightRed", "col_idx": 13},
        {"name": "marker_roof_rr", "group": "mirrors_lights_details", "from": [5.85, 17.65, 26.55], "to": [7.15, 18.35, 27.35], "color": "taillightRed", "col_idx": 13},
        {"name": "rear_exit_sign", "group": "mirrors_lights_details", "from": [-2.25, 14.45, 27.05], "to": [2.25, 15.15, 27.35], "color": "roofWhite", "col_idx": 4},

        # Side Marker Reflectors
        {"name": "side_marker_fl", "group": "mirrors_lights_details", "from": [-7.85, 6.85, -24.25], "to": [-7.55, 7.65, -23.05], "color": "turnSignalAmber", "col_idx": 12},
        {"name": "side_marker_fr", "group": "mirrors_lights_details", "from": [7.55, 6.85, -24.25], "to": [7.85, 7.65, -23.05], "color": "turnSignalAmber", "col_idx": 12},
        {"name": "side_marker_rl", "group": "mirrors_lights_details", "from": [-7.85, 6.85, 22.25], "to": [-7.55, 7.65, 23.45], "color": "taillightRed", "col_idx": 13},
        {"name": "side_marker_rr", "group": "mirrors_lights_details", "from": [7.55, 6.85, 22.25], "to": [7.85, 7.65, 23.45], "color": "taillightRed", "col_idx": 13},
    ]
    return cubes

if __name__ == '__main__':
    cubes = build_bus()
    print(f"Total cubes: {len(cubes)}")
    q_errs = check_quantization(cubes)
    print(f"Quantization errors: {len(q_errs)}")
    if q_errs:
        for err in q_errs[:5]:
            print(" ", err)
    min_y = min(c['from'][1] for c in cubes)
    grounded = [c['name'] for c in cubes if c['from'][1] == 0.0]
    print(f"Min Y: {min_y}, grounded cubes count: {len(grounded)}: {grounded}")
    xs = [pt for c in cubes for pt in (c['from'][0], c['to'][0])]
    ys = [pt for c in cubes for pt in (c['from'][1], c['to'][1])]
    zs = [pt for c in cubes for pt in (c['from'][2], c['to'][2])]
    print(f"Bounds: X=[{min(xs):.2f}, {max(xs):.2f}] (W={max(xs)-min(xs):.2f}, Three={ (max(xs)-min(xs))*0.05:.3f}m)")
    print(f"        Y=[{min(ys):.2f}, {max(ys):.2f}] (H={max(ys)-min(ys):.2f}, Three={ (max(ys)-min(ys))*0.05:.3f}m)")
    print(f"        Z=[{min(zs):.2f}, {max(zs):.2f}] (D={max(zs)-min(zs):.2f}, Three={ (max(zs)-min(zs))*0.05:.3f}m)")
    issues = blockbench_check(cubes)
    print(f"Coplanar overlaps: {len(issues)}")
    for iss in issues:
        print(f"  {iss['c1']} vs {iss['c2']} on {iss['axis']} = {iss['plane']}")
    visited = check_connectivity(cubes)
    print(f"Connected cubes: {len(visited)} / {len(cubes)}")

    out_path = os.path.join(os.path.dirname(__file__), '..', 'assets', 'models', 'bus_cubes.json')
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(cubes, f, indent=2)
    print(f"Saved {len(cubes)} cubes to {out_path}")
