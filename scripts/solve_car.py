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

def build_car():
    cubes = [
        # =========================================================================
        # 1. CHASSIS & WHEELS (23 cubes) - Red Calipers + Alloy Wheels
        # =========================================================================
        {"name": "chassis_spine", "group": "chassis_wheels", "from": [-5.25, 2.45, -11.65], "to": [5.25, 4.05, 11.65], "color": "tireBlack", "col_idx": 5},
        {"name": "front_axle", "group": "chassis_wheels", "from": [-6.25, 2.35, -8.45], "to": [6.25, 3.65, -7.55], "color": "bumperGuard", "col_idx": 9},
        {"name": "rear_axle", "group": "chassis_wheels", "from": [-6.25, 2.35, 7.55], "to": [6.25, 3.65, 8.45], "color": "bumperGuard", "col_idx": 9},

        # Front-Left Wheel (Z center = -8.00)
        {"name": "wheel_fl_tread_main", "group": "chassis_wheels", "from": [-7.25, 0.00, -9.75], "to": [-4.85, 4.55, -6.25], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_fl_tread_front", "group": "chassis_wheels", "from": [-7.05, 0.85, -10.55], "to": [-5.05, 3.75, -9.65], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_fl_tread_rear", "group": "chassis_wheels", "from": [-7.05, 0.85, -6.35], "to": [-5.05, 3.75, -5.45], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_fl_rim", "group": "chassis_wheels", "from": [-7.45, 1.15, -9.05], "to": [-7.15, 3.45, -6.95], "color": "rimSilver", "col_idx": 7},
        {"name": "caliper_fl", "group": "chassis_wheels", "from": [-7.35, 2.55, -8.75], "to": [-7.05, 3.65, -7.75], "color": "taillightRed", "col_idx": 13},

        # Front-Right Wheel
        {"name": "wheel_fr_tread_main", "group": "chassis_wheels", "from": [4.85, 0.00, -9.75], "to": [7.25, 4.55, -6.25], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_fr_tread_front", "group": "chassis_wheels", "from": [5.05, 0.85, -10.55], "to": [7.05, 3.75, -9.65], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_fr_tread_rear", "group": "chassis_wheels", "from": [5.05, 0.85, -6.35], "to": [7.05, 3.75, -5.45], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_fr_rim", "group": "chassis_wheels", "from": [7.15, 1.15, -9.05], "to": [7.45, 3.45, -6.95], "color": "rimSilver", "col_idx": 7},
        {"name": "caliper_fr", "group": "chassis_wheels", "from": [7.05, 2.55, -8.75], "to": [7.35, 3.65, -7.75], "color": "taillightRed", "col_idx": 13},

        # Rear-Left Wheel (Z center = +8.00)
        {"name": "wheel_rl_tread_main", "group": "chassis_wheels", "from": [-7.25, 0.00, 6.25], "to": [-4.85, 4.55, 9.75], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_rl_tread_front", "group": "chassis_wheels", "from": [-7.05, 0.85, 5.45], "to": [-5.05, 3.75, 6.35], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_rl_tread_rear", "group": "chassis_wheels", "from": [-7.05, 0.85, 9.65], "to": [-5.05, 3.75, 10.55], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_rl_rim", "group": "chassis_wheels", "from": [-7.45, 1.15, 6.95], "to": [-7.15, 3.45, 9.05], "color": "rimSilver", "col_idx": 7},
        {"name": "caliper_rl", "group": "chassis_wheels", "from": [-7.35, 2.55, 7.25], "to": [-7.05, 3.65, 8.25], "color": "taillightRed", "col_idx": 13},

        # Rear-Right Wheel
        {"name": "wheel_rr_tread_main", "group": "chassis_wheels", "from": [4.85, 0.00, 6.25], "to": [7.25, 4.55, 9.75], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_rr_tread_front", "group": "chassis_wheels", "from": [5.05, 0.85, 5.45], "to": [7.05, 3.75, 6.35], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_rr_tread_rear", "group": "chassis_wheels", "from": [5.05, 0.85, 9.65], "to": [7.05, 3.75, 10.55], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_rr_rim", "group": "chassis_wheels", "from": [7.15, 1.15, 6.95], "to": [7.45, 3.45, 9.05], "color": "rimSilver", "col_idx": 7},
        {"name": "caliper_rr", "group": "chassis_wheels", "from": [7.05, 2.55, 7.25], "to": [7.35, 3.65, 8.25], "color": "taillightRed", "col_idx": 13},

        # =========================================================================
        # 2. BODY LOWER (25 cubes) - Sapphire Blue Body & Sport Wing
        # =========================================================================
        {"name": "rocker_panel_left", "group": "body_lower", "from": [-6.95, 2.65, -4.95], "to": [-4.65, 4.75, 4.95], "color": "carBlueDark", "col_idx": 1},
        {"name": "rocker_panel_right", "group": "body_lower", "from": [4.65, 2.65, -4.95], "to": [6.95, 4.75, 4.95], "color": "carBlueDark", "col_idx": 1},

        {"name": "fender_fl_top", "group": "body_lower", "from": [-7.35, 4.45, -11.85], "to": [-4.75, 7.15, -4.75], "color": "carBlue", "col_idx": 0},
        {"name": "fender_fr_top", "group": "body_lower", "from": [4.75, 4.45, -11.85], "to": [7.35, 7.15, -4.75], "color": "carBlue", "col_idx": 0},
        {"name": "fender_rl_top", "group": "body_lower", "from": [-7.35, 4.45, 4.75], "to": [-4.75, 7.25, 11.85], "color": "carBlue", "col_idx": 0},
        {"name": "fender_rr_top", "group": "body_lower", "from": [4.75, 4.45, 4.75], "to": [7.35, 7.25, 11.85], "color": "carBlue", "col_idx": 0},

        {"name": "door_lower_left", "group": "body_lower", "from": [-7.15, 4.55, -4.85], "to": [-4.85, 7.35, 4.85], "color": "carBlue", "col_idx": 0},
        {"name": "door_lower_right", "group": "body_lower", "from": [4.85, 4.55, -4.85], "to": [7.15, 7.35, 4.85], "color": "carBlue", "col_idx": 0},

        {"name": "front_nose_valance", "group": "body_lower", "from": [-5.15, 3.15, -12.85], "to": [5.15, 5.25, -11.45], "color": "carBlueDark", "col_idx": 1},
        {"name": "hood_main_slab", "group": "body_lower", "from": [-4.95, 4.95, -12.15], "to": [4.95, 7.25, -3.85], "color": "carBlue", "col_idx": 0},
        {"name": "hood_center_bulge", "group": "body_lower", "from": [-2.65, 7.05, -11.45], "to": [2.65, 7.55, -4.15], "color": "carBlueDark", "col_idx": 1},

        {"name": "rear_tail_valance", "group": "body_lower", "from": [-5.15, 3.15, 11.45], "to": [5.15, 5.25, 12.85], "color": "carBlueDark", "col_idx": 1},
        {"name": "trunk_main_slab", "group": "body_lower", "from": [-4.95, 4.85, 3.85], "to": [4.95, 7.05, 12.15], "color": "carBlue", "col_idx": 0},

        # Elevated Sport Rear Wing on Stands
        {"name": "spoiler_stand_l", "group": "body_lower", "from": [-3.45, 6.95, 10.55], "to": [-2.75, 8.45, 11.45], "color": "trimBlack", "col_idx": 3},
        {"name": "spoiler_stand_r", "group": "body_lower", "from": [2.75, 6.95, 10.55], "to": [3.45, 8.45, 11.45], "color": "trimBlack", "col_idx": 3},
        {"name": "spoiler_wing_blade", "group": "body_lower", "from": [-4.65, 8.35, 9.85], "to": [4.65, 8.95, 12.55], "color": "carBlue", "col_idx": 0},

        # Dynamic side body skirts (Sport line along rocker)
        {"name": "side_skirt_l", "group": "body_lower", "from": [-7.25, 3.15, -4.65], "to": [-6.85, 3.85, 4.65], "color": "trimBlack", "col_idx": 3},
        {"name": "side_skirt_r", "group": "body_lower", "from": [6.85, 3.15, -4.65], "to": [7.25, 3.85, 4.65], "color": "trimBlack", "col_idx": 3},

        # Door handles
        {"name": "door_handle_fl", "group": "body_lower", "from": [-7.35, 6.05, -2.95], "to": [-6.95, 6.65, -1.55], "color": "trimBlack", "col_idx": 3},
        {"name": "door_handle_rl", "group": "body_lower", "from": [-7.35, 6.05, 1.55], "to": [-6.95, 6.65, 2.95], "color": "trimBlack", "col_idx": 3},
        {"name": "door_handle_fr", "group": "body_lower", "from": [6.95, 6.05, -2.95], "to": [7.35, 6.65, -1.55], "color": "trimBlack", "col_idx": 3},
        {"name": "door_handle_rr", "group": "body_lower", "from": [6.95, 6.05, 1.55], "to": [7.35, 6.65, 2.95], "color": "trimBlack", "col_idx": 3},

        # Fuel cap door & rear diffuser
        {"name": "fuel_cap_rl", "group": "body_lower", "from": [-7.45, 5.65, 7.15], "to": [-7.15, 6.45, 8.25], "color": "carBlueDark", "col_idx": 1},
        {"name": "rear_diffuser", "group": "body_lower", "from": [-4.25, 2.25, 12.35], "to": [4.25, 3.25, 13.15], "color": "bumperGuard", "col_idx": 9},

        # =========================================================================
        # 3. CABIN & GLASS (16 cubes) - Body-Color Frame & Bright Sky-Blue Glass!
        # =========================================================================
        # Monolithic front windshield and rear window in VIVID SKY BLUE (glassSky col_idx: 10)
        {"name": "windshield_clean", "group": "cabin_glass", "from": [-4.55, 7.15, -4.25], "to": [4.55, 11.45, -2.55], "color": "glassSky", "col_idx": 10},
        {"name": "rear_window_clean", "group": "cabin_glass", "from": [-4.55, 6.85, 2.55], "to": [4.55, 11.45, 4.25], "color": "glassSky", "col_idx": 10},

        # Side windows in VIVID SKY BLUE
        {"name": "side_window_fl", "group": "cabin_glass", "from": [-5.85, 7.25, -2.65], "to": [-4.65, 11.35, -0.15], "color": "glassSky", "col_idx": 10},
        {"name": "side_window_rl", "group": "cabin_glass", "from": [-5.85, 7.25, 0.55], "to": [-4.65, 11.35, 2.65], "color": "glassSky", "col_idx": 10},
        {"name": "side_window_fr", "group": "cabin_glass", "from": [4.65, 7.25, -2.65], "to": [5.85, 11.35, -0.15], "color": "glassSky", "col_idx": 10},
        {"name": "side_window_rr", "group": "cabin_glass", "from": [4.65, 7.25, 0.55], "to": [5.85, 11.35, 2.65], "color": "glassSky", "col_idx": 10},

        # Pillars in Sapphire Body Color (carBlue col_idx: 0) - Clear separation!
        {"name": "pillar_a_left", "group": "cabin_glass", "from": [-5.95, 7.05, -4.45], "to": [-4.35, 11.55, -2.45], "color": "carBlue", "col_idx": 0},
        {"name": "pillar_a_right", "group": "cabin_glass", "from": [4.35, 7.05, -4.45], "to": [5.95, 11.55, -2.45], "color": "carBlue", "col_idx": 0},
        {"name": "pillar_b_left", "group": "cabin_glass", "from": [-5.95, 7.15, -0.25], "to": [-4.55, 11.45, 0.65], "color": "carBlue", "col_idx": 0},
        {"name": "pillar_b_right", "group": "cabin_glass", "from": [4.55, 7.15, -0.25], "to": [5.95, 11.45, 0.65], "color": "carBlue", "col_idx": 0},
        {"name": "pillar_c_left", "group": "cabin_glass", "from": [-5.95, 6.95, 2.45], "to": [-4.35, 11.55, 4.45], "color": "carBlue", "col_idx": 0},
        {"name": "pillar_c_right", "group": "cabin_glass", "from": [4.35, 6.95, 2.45], "to": [5.95, 11.55, 4.45], "color": "carBlue", "col_idx": 0},

        # Roof structure in Sapphire Body Color (carBlue col_idx: 0)
        {"name": "roof_main_slab", "group": "cabin_glass", "from": [-5.15, 11.25, -3.25], "to": [5.15, 12.35, 3.25], "color": "carBlue", "col_idx": 0},
        {"name": "roof_visor_front", "group": "cabin_glass", "from": [-4.85, 11.35, -4.35], "to": [4.85, 12.15, -3.15], "color": "carBlueDark", "col_idx": 1},
        {"name": "roof_visor_rear", "group": "cabin_glass", "from": [-4.85, 11.35, 3.15], "to": [4.85, 12.15, 4.35], "color": "carBlueDark", "col_idx": 1},
        {"name": "roof_crest_crown", "group": "cabin_glass", "from": [-3.95, 12.25, -2.55], "to": [3.95, 12.75, 2.55], "color": "carBlueDark", "col_idx": 1},

        # =========================================================================
        # 4. ROOF DETAILS (1 cube) - Clean Civilian Flat Sunroof (No Flasher, No Rails!)
        # =========================================================================
        {"name": "roof_sunroof_tint", "group": "roof_details", "from": [-2.85, 12.15, -1.95], "to": [2.85, 12.85, 0.85], "color": "trimBlack", "col_idx": 3},

        # =========================================================================
        # 5. BUMPERS, LIGHTS & MIRRORS (23 cubes) - Splitter, Dual Exhaust & 2-Piece Mirrors
        # =========================================================================
        # Front Bumper, Splitter Lip & Sport Intakes
        {"name": "bumper_front_beam", "group": "bumpers_lights_mirrors", "from": [-6.85, 2.35, -14.15], "to": [6.85, 4.25, -12.65], "color": "carBlueDark", "col_idx": 1},
        {"name": "front_splitter_lip", "group": "bumpers_lights_mirrors", "from": [-7.15, 1.85, -14.55], "to": [7.15, 2.45, -13.15], "color": "trimBlack", "col_idx": 3},
        {"name": "front_air_intake_l", "group": "bumpers_lights_mirrors", "from": [-6.95, 2.55, -14.35], "to": [-4.75, 3.85, -13.55], "color": "trimBlack", "col_idx": 3},
        {"name": "front_air_intake_r", "group": "bumpers_lights_mirrors", "from": [4.75, 2.55, -14.35], "to": [6.95, 3.85, -13.55], "color": "trimBlack", "col_idx": 3},
        {"name": "license_plate_front_blue", "group": "bumpers_lights_mirrors", "from": [-2.55, 2.55, -14.35], "to": [2.55, 3.85, -13.55], "color": "plateBlue", "col_idx": 14},
        {"name": "license_plate_front_text", "group": "bumpers_lights_mirrors", "from": [-1.95, 2.75, -14.55], "to": [1.95, 3.65, -14.25], "color": "plateWhite", "col_idx": 4},

        # Front Grille & Lights
        {"name": "front_grille_mesh", "group": "bumpers_lights_mirrors", "from": [-3.15, 4.15, -13.35], "to": [3.15, 6.05, -11.95], "color": "grilleMesh", "col_idx": 15},
        {"name": "front_grille_slats", "group": "bumpers_lights_mirrors", "from": [-2.75, 4.55, -13.65], "to": [2.75, 5.75, -12.95], "color": "bumperSilver", "col_idx": 8},
        {"name": "headlight_lens_left", "group": "bumpers_lights_mirrors", "from": [-5.35, 4.35, -13.25], "to": [-3.45, 5.95, -12.05], "color": "headlightIce", "col_idx": 11},
        {"name": "headlight_lens_right", "group": "bumpers_lights_mirrors", "from": [3.45, 4.35, -13.25], "to": [5.35, 5.95, -12.05], "color": "headlightIce", "col_idx": 11},
        {"name": "turn_signal_front_l", "group": "bumpers_lights_mirrors", "from": [-6.45, 4.55, -13.15], "to": [-5.25, 5.75, -12.15], "color": "turnSignalAmber", "col_idx": 12},
        {"name": "turn_signal_front_r", "group": "bumpers_lights_mirrors", "from": [5.25, 4.55, -13.15], "to": [6.45, 5.75, -12.15], "color": "turnSignalAmber", "col_idx": 12},

        # Rear Bumper, Plate & Dual Chrome Exhaust Tips!
        {"name": "bumper_rear_beam", "group": "bumpers_lights_mirrors", "from": [-6.85, 2.35, 12.65], "to": [6.85, 4.25, 14.15], "color": "carBlueDark", "col_idx": 1},
        {"name": "exhaust_tip_l", "group": "bumpers_lights_mirrors", "from": [-3.85, 1.75, 13.55], "to": [-2.45, 2.45, 14.65], "color": "rimSilver", "col_idx": 7},
        {"name": "exhaust_tip_r", "group": "bumpers_lights_mirrors", "from": [2.45, 1.75, 13.55], "to": [3.85, 2.45, 14.65], "color": "rimSilver", "col_idx": 7},
        {"name": "license_plate_rear_blue", "group": "bumpers_lights_mirrors", "from": [-2.55, 2.55, 13.55], "to": [2.55, 3.85, 14.35], "color": "plateBlue", "col_idx": 14},
        {"name": "license_plate_rear_text", "group": "bumpers_lights_mirrors", "from": [-1.95, 2.75, 14.25], "to": [1.95, 3.65, 14.55], "color": "plateWhite", "col_idx": 4},

        # Rear Taillights
        {"name": "taillight_lens_left", "group": "bumpers_lights_mirrors", "from": [-6.35, 4.55, 12.05], "to": [-3.85, 6.05, 13.25], "color": "taillightRed", "col_idx": 13},
        {"name": "taillight_lens_right", "group": "bumpers_lights_mirrors", "from": [3.85, 4.55, 12.05], "to": [6.35, 6.05, 13.25], "color": "taillightRed", "col_idx": 13},

        # 2-Piece Side Mirrors: Sapphire Blue Housing + Silver Reflective Glass!
        {"name": "side_mirror_l_body", "group": "bumpers_lights_mirrors", "from": [-7.85, 7.45, -4.05], "to": [-5.75, 8.85, -2.85], "color": "carBlue", "col_idx": 0},
        {"name": "side_mirror_l_glass", "group": "bumpers_lights_mirrors", "from": [-7.75, 7.55, -2.95], "to": [-6.05, 8.75, -2.55], "color": "rimSilver", "col_idx": 7},
        {"name": "side_mirror_r_body", "group": "bumpers_lights_mirrors", "from": [5.75, 7.45, -4.05], "to": [7.85, 8.85, -2.85], "color": "carBlue", "col_idx": 0},
        {"name": "side_mirror_r_glass", "group": "bumpers_lights_mirrors", "from": [6.05, 7.55, -2.95], "to": [7.75, 8.75, -2.55], "color": "rimSilver", "col_idx": 7},
    ]
    return cubes

if __name__ == '__main__':
    cubes = build_car()
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

    out_path = os.path.join(os.path.dirname(__file__), '..', 'assets', 'models', 'car_cubes.json')
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(cubes, f, indent=2)
    print(f"Saved {len(cubes)} cubes to {out_path}")
