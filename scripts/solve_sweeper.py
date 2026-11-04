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

def build_sweeper():
    cubes = [
        # =========================================================================
        # 1. CHASSIS & WHEELS (22 cubes) - 4 Grounded Wheels, Axles, Suction Nozzle
        # =========================================================================
        # Central Chassis Spine
        {"name": "chassis_spine", "group": "chassis_wheels", "from": [-4.65, 2.25, -9.85], "to": [4.65, 3.85, 12.85], "color": "hopperGreyDark", "col_idx": 3},
        {"name": "front_axle", "group": "chassis_wheels", "from": [-6.25, 2.45, -6.85], "to": [6.25, 3.55, -5.65], "color": "hopperGreyDark", "col_idx": 3},
        {"name": "rear_axle", "group": "chassis_wheels", "from": [-6.25, 2.45, 6.65], "to": [6.25, 3.55, 7.85], "color": "hopperGreyDark", "col_idx": 3},
        # Central Belly Vacuum Suction Intake Nozzle
        {"name": "vacuum_suction_box", "group": "chassis_wheels", "from": [-3.15, 1.15, -1.85], "to": [3.15, 2.45, 2.85], "color": "trimDark", "col_idx": 15},
        {"name": "vacuum_hose_pipe", "group": "chassis_wheels", "from": [-1.25, 2.35, 1.45], "to": [1.25, 4.45, 3.45], "color": "metalChrome", "col_idx": 8},
        {"name": "hydraulic_fluid_tank", "group": "chassis_wheels", "from": [4.55, 2.35, -2.45], "to": [5.95, 3.75, 2.45], "color": "hopperGreyDark", "col_idx": 3},

        # Front-Left Wheel (Center Z = -6.25)
        {"name": "wheel_fl_tread_main", "group": "chassis_wheels", "from": [-7.15, 0.00, -7.85], "to": [-4.95, 4.30, -4.65], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_fl_tread_front", "group": "chassis_wheels", "from": [-6.95, 0.75, -8.65], "to": [-5.15, 3.55, -7.75], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_fl_tread_rear", "group": "chassis_wheels", "from": [-6.95, 0.75, -4.75], "to": [-5.15, 3.55, -3.85], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_fl_rim", "group": "chassis_wheels", "from": [-7.35, 1.15, -7.15], "to": [-7.05, 3.15, -5.35], "color": "rimSilver", "col_idx": 7},

        # Front-Right Wheel
        {"name": "wheel_fr_tread_main", "group": "chassis_wheels", "from": [4.95, 0.00, -7.85], "to": [7.15, 4.30, -4.65], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_fr_tread_front", "group": "chassis_wheels", "from": [5.15, 0.75, -8.65], "to": [6.95, 3.55, -7.75], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_fr_tread_rear", "group": "chassis_wheels", "from": [5.15, 0.75, -4.75], "to": [6.95, 3.55, -3.85], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_fr_rim", "group": "chassis_wheels", "from": [7.05, 1.15, -7.15], "to": [7.35, 3.15, -5.35], "color": "rimSilver", "col_idx": 7},

        # Rear-Left Wheel (Center Z = +7.25)
        {"name": "wheel_rl_tread_main", "group": "chassis_wheels", "from": [-7.15, 0.00, 5.65], "to": [-4.95, 4.30, 8.85], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_rl_tread_front", "group": "chassis_wheels", "from": [-6.95, 0.75, 4.75], "to": [-5.15, 3.55, 5.75], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_rl_tread_rear", "group": "chassis_wheels", "from": [-6.95, 0.75, 8.75], "to": [-5.15, 3.55, 9.65], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_rl_rim", "group": "chassis_wheels", "from": [-7.35, 1.15, 6.35], "to": [-7.05, 3.15, 8.15], "color": "rimSilver", "col_idx": 7},

        # Rear-Right Wheel
        {"name": "wheel_rr_tread_main", "group": "chassis_wheels", "from": [4.95, 0.00, 5.65], "to": [7.15, 4.30, 8.85], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_rr_tread_front", "group": "chassis_wheels", "from": [5.15, 0.75, 4.75], "to": [6.95, 3.55, 5.75], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_rr_tread_rear", "group": "chassis_wheels", "from": [5.15, 0.75, 8.75], "to": [6.95, 3.55, 9.65], "color": "tireBlack", "col_idx": 5},
        {"name": "wheel_rr_rim", "group": "chassis_wheels", "from": [7.05, 1.15, 6.35], "to": [7.35, 3.15, 8.15], "color": "rimSilver", "col_idx": 7},

        # =========================================================================
        # 2. FRONT SWEEPER BRUSHES ASSEMBLY (17 cubes) - Dual Outrigger Brushes
        # =========================================================================
        # Front Mounting Frame & Bumper Extension
        {"name": "sweeper_bumper_base", "group": "front_brushes", "from": [-5.75, 2.15, -12.65], "to": [5.75, 3.75, -10.75], "color": "hopperGreyDark", "col_idx": 3},
        {"name": "brush_arm_mount_l", "group": "front_brushes", "from": [-7.45, 2.35, -13.55], "to": [-4.85, 3.25, -11.85], "color": "metalChrome", "col_idx": 8},
        {"name": "brush_arm_mount_r", "group": "front_brushes", "from": [4.85, 2.35, -13.55], "to": [7.45, 3.25, -11.85], "color": "metalChrome", "col_idx": 8},

        # Left Sweeper Brush (Outrigger, Center X = -6.15, Center Z = -13.75)
        {"name": "brush_spindle_disc_l", "group": "front_brushes", "from": [-7.85, 2.85, -15.45], "to": [-4.45, 3.45, -12.05], "color": "metalChrome", "col_idx": 8},
        {"name": "brush_cone_top_l", "group": "front_brushes", "from": [-8.15, 1.95, -15.75], "to": [-4.15, 2.95, -11.75], "color": "brushBristlesDark", "col_idx": 9},
        {"name": "brush_cone_mid_l", "group": "front_brushes", "from": [-8.45, 1.05, -16.05], "to": [-3.85, 2.05, -11.45], "color": "brushBristlesDark", "col_idx": 9},
        {"name": "brush_skirt_flare_l", "group": "front_brushes", "from": [-8.75, 0.35, -16.35], "to": [-3.55, 1.15, -11.15], "color": "brushBristlesDark", "col_idx": 9},
        {"name": "brush_hub_cap_l", "group": "front_brushes", "from": [-6.65, 3.35, -14.25], "to": [-5.65, 3.95, -13.25], "color": "rimSilver", "col_idx": 7},

        # Right Sweeper Brush (Outrigger, Center X = +6.15, Center Z = -13.75)
        {"name": "brush_spindle_disc_r", "group": "front_brushes", "from": [4.45, 2.85, -15.45], "to": [7.85, 3.45, -12.05], "color": "metalChrome", "col_idx": 8},
        {"name": "brush_cone_top_r", "group": "front_brushes", "from": [4.15, 1.95, -15.75], "to": [8.15, 2.95, -11.75], "color": "brushBristlesDark", "col_idx": 9},
        {"name": "brush_cone_mid_r", "group": "front_brushes", "from": [3.85, 1.05, -16.05], "to": [8.45, 2.05, -11.45], "color": "brushBristlesDark", "col_idx": 9},
        {"name": "brush_skirt_flare_r", "group": "front_brushes", "from": [3.55, 0.35, -16.35], "to": [8.75, 1.15, -11.15], "color": "brushBristlesDark", "col_idx": 9},
        {"name": "brush_hub_cap_r", "group": "front_brushes", "from": [5.65, 3.35, -14.25], "to": [6.65, 3.95, -13.25], "color": "rimSilver", "col_idx": 7},

        # Front Central Suction Guide Flap
        {"name": "suction_guide_curtain", "group": "front_brushes", "from": [-3.35, 1.45, -12.05], "to": [3.35, 2.75, -10.95], "color": "trimDark", "col_idx": 15},
        {"name": "bumper_tow_hitch_l", "group": "front_brushes", "from": [-4.75, 2.55, -12.95], "to": [-3.85, 3.35, -12.55], "color": "metalChrome", "col_idx": 8},
        {"name": "bumper_tow_hitch_r", "group": "front_brushes", "from": [3.85, 2.55, -12.95], "to": [4.75, 3.35, -12.55], "color": "metalChrome", "col_idx": 8},

        # =========================================================================
        # 3. MUNICIPAL CABIN (26 cubes) - Orange Cab, Panoramic Glass, Grille & Mirrors
        # =========================================================================
        # Cab Lower Floor & Fender Skirts
        {"name": "cab_lower_floor", "group": "cab_structure", "from": [-5.85, 3.35, -11.25], "to": [5.85, 6.35, -1.05], "color": "sweeperOrange", "col_idx": 0},
        {"name": "cab_front_fascia_lower", "group": "cab_structure", "from": [-5.75, 4.45, -11.85], "to": [5.75, 7.85, -10.75], "color": "sweeperOrange", "col_idx": 0},
        {"name": "fender_fl_skirt", "group": "cab_structure", "from": [-6.15, 3.95, -8.45], "to": [-4.85, 5.85, -3.95], "color": "sweeperOrangeDark", "col_idx": 1},
        {"name": "fender_fr_skirt", "group": "cab_structure", "from": [4.85, 3.95, -8.45], "to": [6.15, 5.85, -3.95], "color": "sweeperOrangeDark", "col_idx": 1},

        # Front Grille & Headlights
        {"name": "grille_recess_plate", "group": "cab_structure", "from": [-3.15, 5.05, -12.05], "to": [3.15, 6.75, -11.75], "color": "trimDark", "col_idx": 15},
        {"name": "grille_slat_upper", "group": "cab_structure", "from": [-2.75, 6.15, -12.15], "to": [2.75, 6.55, -11.95], "color": "metalChrome", "col_idx": 8},
        {"name": "grille_slat_lower", "group": "cab_structure", "from": [-2.75, 5.35, -12.15], "to": [2.75, 5.75, -11.95], "color": "metalChrome", "col_idx": 8},
        {"name": "headlight_fl", "group": "cab_structure", "from": [-5.05, 5.25, -12.10], "to": [-3.45, 6.65, -11.75], "color": "headlightIce", "col_idx": 11},
        {"name": "headlight_fr", "group": "cab_structure", "from": [3.45, 5.25, -12.10], "to": [5.05, 6.65, -11.75], "color": "headlightIce", "col_idx": 11},
        {"name": "turn_signal_fl", "group": "cab_structure", "from": [-5.65, 5.35, -12.00], "to": [-5.15, 6.55, -11.70], "color": "beaconAmber", "col_idx": 12},
        {"name": "turn_signal_fr", "group": "cab_structure", "from": [5.15, 5.35, -12.00], "to": [5.65, 6.55, -11.70], "color": "beaconAmber", "col_idx": 12},

        # Panoramic Cockpit Glazing & Framing (Airtight Envelope)
        {"name": "windshield_panoramic", "group": "cab_structure", "from": [-5.25, 7.65, -11.25], "to": [5.25, 14.15, -10.15], "color": "glassSky", "col_idx": 10},
        {"name": "windshield_pillar_l", "group": "cab_structure", "from": [-5.85, 7.55, -11.35], "to": [-5.15, 14.35, -9.95], "color": "sweeperOrange", "col_idx": 0},
        {"name": "windshield_pillar_r", "group": "cab_structure", "from": [5.15, 7.55, -11.35], "to": [5.85, 14.35, -9.95], "color": "sweeperOrange", "col_idx": 0},

        # Side Windows & Doors
        {"name": "door_panel_l", "group": "cab_structure", "from": [-5.95, 6.15, -10.25], "to": [-5.35, 14.25, -1.15], "color": "sweeperOrange", "col_idx": 0},
        {"name": "door_panel_r", "group": "cab_structure", "from": [5.35, 6.15, -10.25], "to": [5.95, 14.25, -1.15], "color": "sweeperOrange", "col_idx": 0},
        {"name": "side_window_l", "group": "cab_structure", "from": [-6.05, 8.45, -9.65], "to": [-5.85, 13.95, -3.15], "color": "glassSky", "col_idx": 10},
        {"name": "side_window_r", "group": "cab_structure", "from": [5.85, 8.45, -9.65], "to": [6.05, 13.95, -3.15], "color": "glassSky", "col_idx": 10},
        {"name": "door_handle_l", "group": "cab_structure", "from": [-6.15, 7.45, -4.35], "to": [-5.75, 8.15, -2.65], "color": "trimDark", "col_idx": 15},
        {"name": "door_handle_r", "group": "cab_structure", "from": [5.75, 7.45, -4.35], "to": [6.15, 8.15, -2.65], "color": "trimDark", "col_idx": 15},

        # Mirrors on Outrigger Brackets
        {"name": "mirror_bracket_l", "group": "cab_structure", "from": [-6.75, 9.85, -10.85], "to": [-5.75, 10.55, -10.05], "color": "metalChrome", "col_idx": 8},
        {"name": "mirror_head_l", "group": "cab_structure", "from": [-7.25, 9.25, -11.25], "to": [-6.55, 11.95, -9.85], "color": "sweeperOrange", "col_idx": 0},
        {"name": "mirror_glass_l", "group": "cab_structure", "from": [-7.15, 9.45, -10.15], "to": [-6.65, 11.75, -9.75], "color": "glassSky", "col_idx": 10},
        {"name": "mirror_bracket_r", "group": "cab_structure", "from": [5.75, 9.85, -10.85], "to": [6.75, 10.55, -10.05], "color": "metalChrome", "col_idx": 8},
        {"name": "mirror_head_r", "group": "cab_structure", "from": [6.55, 9.25, -11.25], "to": [7.25, 11.95, -9.85], "color": "sweeperOrange", "col_idx": 0},
        {"name": "mirror_glass_r", "group": "cab_structure", "from": [6.65, 9.45, -10.15], "to": [7.15, 11.75, -9.75], "color": "glassSky", "col_idx": 10},

        # Cab Roof & Visor
        {"name": "cab_roof_slab", "group": "cab_structure", "from": [-6.05, 14.05, -11.45], "to": [6.05, 15.65, -1.05], "color": "sweeperOrange", "col_idx": 0},

        # =========================================================================
        # 4. ROOF FLASHING BEACON (3 cubes) - Amber Strobe on Pedestal
        # =========================================================================
        {"name": "beacon_pedestal", "group": "roof_beacon", "from": [-1.15, 15.55, -6.65], "to": [1.15, 16.25, -4.45], "color": "trimDark", "col_idx": 15},
        {"name": "beacon_amber_lens", "group": "roof_beacon", "from": [-0.95, 16.15, -6.45], "to": [0.95, 17.55, -4.65], "color": "beaconAmber", "col_idx": 12},
        {"name": "beacon_light_core", "group": "roof_beacon", "from": [-0.65, 16.55, -6.15], "to": [0.65, 17.65, -4.95], "color": "headlightIce", "col_idx": 11},

        # =========================================================================
        # 5. REAR VACUUM HOPPER TANK & TAILGATE (REVISED MONOLITHIC & AIRTIGHT)
        # =========================================================================
        # 1. Lower chassis floor base under the hopper
        {"name": "hopper_floor_base", "group": "rear_hopper", "from": [-6.05, 3.45, -1.35], "to": [6.05, 6.45, 13.85], "color": "hopperGreyDark", "col_idx": 3},

        # 2. Main Tank Monolithic Body: UNIFIED X [-6.15, 6.15] from cab (Z=-1.25) to rear vertical wall (Z=13.75)
        {"name": "hopper_main_tank", "group": "rear_hopper", "from": [-6.15, 5.85, -1.25], "to": [6.15, 13.55, 13.75], "color": "hopperGrey", "col_idx": 2},

        # 3. Flat Upper Roof of Hopper Tank (meeting cab roof at Z=-1.10, inset X to -5.85..5.85)
        {"name": "hopper_roof_top", "group": "rear_hopper", "from": [-5.85, 13.45, -1.10], "to": [5.85, 15.45, 11.45], "color": "hopperGrey", "col_idx": 2},

        # 4. Upper Roof Weather Cap / Trim
        {"name": "hopper_roof_cap", "group": "rear_hopper", "from": [-5.75, 15.35, -0.95], "to": [5.75, 15.95, 11.25], "color": "hopperGreyDark", "col_idx": 3},

        # 5. 45-degree Chamfer: Upper Step (Y: 13.35..14.65, Z: 11.35..12.65)
        {"name": "hopper_chamfer_step1", "group": "rear_hopper", "from": [-5.95, 13.35, 11.35], "to": [5.95, 14.65, 12.65], "color": "hopperGrey", "col_idx": 2},

        # 6. 45-degree Chamfer: Lower Step (Y: 13.25..14.05, Z: 12.55..13.65)
        {"name": "hopper_chamfer_step2", "group": "rear_hopper", "from": [-5.85, 13.25, 12.55], "to": [5.85, 14.05, 13.65], "color": "hopperGrey", "col_idx": 2},

        # 7. Tailgate Door Embossed Relief Panel on Rear Wall (Z = 13.75)
        {"name": "hopper_tailgate_relief", "group": "rear_hopper", "from": [-5.65, 6.15, 13.65], "to": [5.65, 13.25, 13.95], "color": "hopperGreyDark", "col_idx": 3},

        # 8. Hydraulic Tailgate Top Hinges
        {"name": "tailgate_hinge_l", "group": "rear_hopper", "from": [-4.65, 13.35, 13.55], "to": [-3.65, 14.15, 14.05], "color": "metalChrome", "col_idx": 8},
        {"name": "tailgate_hinge_r", "group": "rear_hopper", "from": [3.65, 13.35, 13.55], "to": [4.65, 14.15, 14.05], "color": "metalChrome", "col_idx": 8},

        # 9. Rear Bumper Beam (tight against rear wall Z=13.75)
        {"name": "rear_bumper_beam", "group": "rear_hopper", "from": [-6.35, 2.35, 13.65], "to": [6.35, 4.15, 14.45], "color": "hopperGreyDark", "col_idx": 3},
        {"name": "rear_bumper_step_hitch", "group": "rear_hopper", "from": [-1.65, 2.15, 14.25], "to": [1.65, 2.85, 14.85], "color": "metalChrome", "col_idx": 8},

        # 10. Rear Taillights on Rear Wall
        {"name": "rear_taillight_l", "group": "rear_hopper", "from": [-5.85, 4.45, 13.65], "to": [-4.15, 5.65, 14.15], "color": "taillightRed", "col_idx": 13},
        {"name": "rear_taillight_r", "group": "rear_hopper", "from": [4.15, 4.45, 13.65], "to": [5.85, 5.65, 14.15], "color": "taillightRed", "col_idx": 13},

        # 11. Rear License Plate & Light
        {"name": "rear_license_tag", "group": "rear_hopper", "from": [-1.25, 2.75, 14.35], "to": [1.25, 3.75, 14.65], "color": "rimSilver", "col_idx": 7},

        # 12. Rear Fender Skirts
        {"name": "fender_rl_skirt", "group": "rear_hopper", "from": [-6.25, 3.95, 5.15], "to": [-5.05, 5.75, 9.45], "color": "hopperGreyDark", "col_idx": 3},
        {"name": "fender_rr_skirt", "group": "rear_hopper", "from": [5.05, 3.95, 5.15], "to": [6.25, 5.75, 9.45], "color": "hopperGreyDark", "col_idx": 3},

        # 13. Safety Chevron Backing Bands (Black base)
        {"name": "chevron_base_bar_l", "group": "rear_hopper", "from": [-6.35, 4.75, -0.95], "to": [-6.10, 6.05, 12.65], "color": "trimDark", "col_idx": 15},
        {"name": "chevron_base_bar_r", "group": "rear_hopper", "from": [6.10, 4.75, -0.95], "to": [6.35, 6.05, 12.65], "color": "trimDark", "col_idx": 15},

        # 14. Embossed Safety Chevron Yellow Stripes
        {"name": "chevron_l1_yellow", "group": "rear_hopper", "from": [-6.45, 4.85, -0.85], "to": [-6.30, 5.95, 0.45], "color": "chevronYellow", "col_idx": 4},
        {"name": "chevron_l2_yellow", "group": "rear_hopper", "from": [-6.45, 4.85, 1.85], "to": [-6.30, 5.95, 3.15], "color": "chevronYellow", "col_idx": 4},
        {"name": "chevron_l3_yellow", "group": "rear_hopper", "from": [-6.45, 4.85, 4.55], "to": [-6.30, 5.95, 5.85], "color": "chevronYellow", "col_idx": 4},
        {"name": "chevron_l4_yellow", "group": "rear_hopper", "from": [-6.45, 4.85, 7.25], "to": [-6.30, 5.95, 8.55], "color": "chevronYellow", "col_idx": 4},
        {"name": "chevron_l5_yellow", "group": "rear_hopper", "from": [-6.45, 4.85, 9.95], "to": [-6.30, 5.95, 11.25], "color": "chevronYellow", "col_idx": 4},

        {"name": "chevron_r1_yellow", "group": "rear_hopper", "from": [6.30, 4.85, -0.85], "to": [6.45, 5.95, 0.45], "color": "chevronYellow", "col_idx": 4},
        {"name": "chevron_r2_yellow", "group": "rear_hopper", "from": [6.30, 4.85, 1.85], "to": [6.45, 5.95, 3.15], "color": "chevronYellow", "col_idx": 4},
        {"name": "chevron_r3_yellow", "group": "rear_hopper", "from": [6.30, 4.85, 4.55], "to": [6.45, 5.95, 5.85], "color": "chevronYellow", "col_idx": 4},
        {"name": "chevron_r4_yellow", "group": "rear_hopper", "from": [6.30, 4.85, 7.25], "to": [6.45, 5.95, 8.55], "color": "chevronYellow", "col_idx": 4},
        {"name": "chevron_r5_yellow", "group": "rear_hopper", "from": [6.30, 4.85, 9.95], "to": [6.45, 5.95, 11.25], "color": "chevronYellow", "col_idx": 4},

        # 15. Side Municipal Lettering Badges ("STREET SWEEP")
        {"name": "sweep_badge_plate_l", "group": "rear_hopper", "from": [-6.35, 8.45, 0.85], "to": [-6.05, 13.25, 7.85], "color": "hopperGreyDark", "col_idx": 3},
        {"name": "sweep_letter_row1_l", "group": "rear_hopper", "from": [-6.45, 11.15, 1.45], "to": [-6.30, 12.55, 7.25], "color": "letteringWhite", "col_idx": 14},
        {"name": "sweep_letter_row2_l", "group": "rear_hopper", "from": [-6.45, 9.15, 1.85], "to": [-6.30, 10.55, 6.85], "color": "letteringWhite", "col_idx": 14},

        {"name": "sweep_badge_plate_r", "group": "rear_hopper", "from": [6.05, 8.45, 0.85], "to": [6.35, 13.25, 7.85], "color": "hopperGreyDark", "col_idx": 3},
        {"name": "sweep_letter_row1_r", "group": "rear_hopper", "from": [6.30, 11.15, 1.45], "to": [6.45, 12.55, 7.25], "color": "letteringWhite", "col_idx": 14},
        {"name": "sweep_letter_row2_r", "group": "rear_hopper", "from": [6.30, 9.15, 1.85], "to": [6.45, 10.55, 6.85], "color": "letteringWhite", "col_idx": 14},

        # 16. Hopper Top Exhaust Vent
        {"name": "hopper_vent_grille", "group": "rear_hopper", "from": [-2.45, 15.85, 2.45], "to": [2.45, 16.55, 7.45], "color": "trimDark", "col_idx": 15},
    ]
    return cubes

if __name__ == '__main__':
    cubes = build_sweeper()
    print(f"Total cubes: {len(cubes)} (Budget: 85-115)")

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
