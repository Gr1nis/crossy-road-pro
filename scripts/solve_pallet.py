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

def build_pallet():
    cubes = [
        # =========================================================================
        # 1. BOTTOM RUNNERS (3 cubes) - Grounded on waterline (Min Y = 0.00)
        # =========================================================================
        {"name": "runner_bottom_left", "group": "bottom_runners", "from": [-8.85, 0.00, -11.85], "to": [-6.65, 0.80, 11.85], "color": "woodDark", "col_idx": 2},
        {"name": "runner_bottom_center", "group": "bottom_runners", "from": [-1.10, 0.00, -11.85], "to": [1.10, 0.80, 11.85], "color": "woodDark", "col_idx": 2},
        {"name": "runner_bottom_right", "group": "bottom_runners", "from": [6.65, 0.00, -11.85], "to": [8.85, 0.80, 11.85], "color": "woodDark", "col_idx": 2},

        # =========================================================================
        # 2. SPACER BLOCKS (9 cubes) - Standard Euro-Pallet 3x3 Block Grid
        # =========================================================================
        # Front row (Z = -10.20)
        {"name": "block_front_left", "group": "spacer_blocks", "from": [-8.70, 0.70, -11.70], "to": [-6.80, 3.40, -8.70], "color": "woodBlock", "col_idx": 3},
        {"name": "block_front_center", "group": "spacer_blocks", "from": [-0.95, 0.70, -11.70], "to": [0.95, 3.40, -8.70], "color": "woodBlock", "col_idx": 3},
        {"name": "block_front_right", "group": "spacer_blocks", "from": [6.80, 0.70, -11.70], "to": [8.70, 3.40, -8.70], "color": "woodBlock", "col_idx": 3},

        # Middle row (Z = 0.00)
        {"name": "block_mid_left", "group": "spacer_blocks", "from": [-8.70, 0.70, -1.50], "to": [-6.80, 3.40, 1.50], "color": "woodBlock", "col_idx": 3},
        {"name": "block_mid_center", "group": "spacer_blocks", "from": [-0.95, 0.70, -1.50], "to": [0.95, 3.40, 1.50], "color": "woodBlock", "col_idx": 3},
        {"name": "block_mid_right", "group": "spacer_blocks", "from": [6.80, 0.70, -1.50], "to": [8.70, 3.40, 1.50], "color": "woodBlock", "col_idx": 3},

        # Rear row (Z = 10.20)
        {"name": "block_rear_left", "group": "spacer_blocks", "from": [-8.70, 0.70, 8.70], "to": [-6.80, 3.40, 11.70], "color": "woodBlock", "col_idx": 3},
        {"name": "block_rear_center", "group": "spacer_blocks", "from": [-0.95, 0.70, 8.70], "to": [0.95, 3.40, 11.70], "color": "woodBlock", "col_idx": 3},
        {"name": "block_rear_right", "group": "spacer_blocks", "from": [6.80, 0.70, 8.70], "to": [8.70, 3.40, 11.70], "color": "woodBlock", "col_idx": 3},

        # =========================================================================
        # 3. CROSS STRINGERS (3 cubes) - Transverse Boards Across Left, Center, Right
        # =========================================================================
        {"name": "stringer_front", "group": "cross_stringers", "from": [-8.80, 3.30, -11.80], "to": [8.80, 4.10, -8.60], "color": "woodDark", "col_idx": 2},
        {"name": "stringer_center", "group": "cross_stringers", "from": [-8.80, 3.30, -1.60], "to": [8.80, 4.10, 1.60], "color": "woodDark", "col_idx": 2},
        {"name": "stringer_rear", "group": "cross_stringers", "from": [-8.80, 3.30, 8.60], "to": [8.80, 4.10, 11.80], "color": "woodDark", "col_idx": 2},

        # =========================================================================
        # 4. TOP DECK SLATS (5 cubes) - Longitudinal Deck Boards With Visible Gaps
        # =========================================================================
        {"name": "deck_slat_1_left", "group": "top_deck_slats", "from": [-8.90, 4.00, -11.90], "to": [-5.70, 4.85, 11.90], "color": "woodDeckLight", "col_idx": 0},
        {"name": "deck_slat_2_inleft", "group": "top_deck_slats", "from": [-4.70, 4.00, -11.90], "to": [-2.50, 4.85, 11.90], "color": "woodDeckMid", "col_idx": 1},
        {"name": "deck_slat_3_center", "group": "top_deck_slats", "from": [-1.60, 4.00, -11.90], "to": [1.60, 4.85, 11.90], "color": "woodDeckLight", "col_idx": 0},
        {"name": "deck_slat_4_inright", "group": "top_deck_slats", "from": [2.50, 4.00, -11.90], "to": [4.70, 4.85, 11.90], "color": "woodDeckMid", "col_idx": 1},
        {"name": "deck_slat_5_right", "group": "top_deck_slats", "from": [5.70, 4.00, -11.90], "to": [8.90, 4.85, 11.90], "color": "woodDeckLight", "col_idx": 0},

        # =========================================================================
        # 5. BRANDING & FASTENERS (9 cubes) - Burned "PALLET" Stamp, Nails & Foam Wake
        # =========================================================================
        # Embossed Burned "PALLET" Brand Stamp on Right Deck Board
        {"name": "pallet_brand_stamp_top", "group": "branding_fasteners", "from": [6.10, 4.80, -3.50], "to": [8.50, 4.95, 3.50], "color": "stampBurn", "col_idx": 4},

        # Galvanized Steel Nail Fastener Heads over Stringers
        {"name": "nail_plate_fl", "group": "branding_fasteners", "from": [-8.50, 4.80, -10.40], "to": [-6.10, 4.95, -10.00], "color": "nailSteel", "col_idx": 5},
        {"name": "nail_plate_fr", "group": "branding_fasteners", "from": [6.10, 4.80, -10.40], "to": [8.50, 4.95, -10.00], "color": "nailSteel", "col_idx": 5},
        {"name": "nail_plate_rl", "group": "branding_fasteners", "from": [-8.50, 4.80, 10.00], "to": [-6.10, 4.95, 10.40], "color": "nailSteel", "col_idx": 5},
        {"name": "nail_plate_rr", "group": "branding_fasteners", "from": [6.10, 4.80, 10.00], "to": [8.50, 4.95, 10.40], "color": "nailSteel", "col_idx": 5},

        # Floating Waterline Foam Wake Collars (Water Ripples around Waterline)
        {"name": "foam_wake_bow", "group": "branding_fasteners", "from": [-8.20, 0.00, -12.10], "to": [8.20, 0.20, -11.80], "color": "foamWhite", "col_idx": 6},
        {"name": "foam_wake_stern", "group": "branding_fasteners", "from": [-8.20, 0.00, 11.80], "to": [8.20, 0.20, 12.10], "color": "foamWhite", "col_idx": 6},
        {"name": "foam_wake_port", "group": "branding_fasteners", "from": [-9.10, 0.00, -7.50], "to": [-8.80, 0.20, 7.50], "color": "foamWhite", "col_idx": 6},
        {"name": "foam_wake_starboard", "group": "branding_fasteners", "from": [8.80, 0.00, -7.50], "to": [9.10, 0.20, 7.50], "color": "foamWhite", "col_idx": 6},
    ]
    return cubes

if __name__ == '__main__':
    cubes = build_pallet()
    print(f"Total cubes: {len(cubes)} (Target budget: 25-40, optimal 28-34)")

    # 1. Quantization check
    q_errs = check_quantization(cubes)
    print(f"Quantization errors (Grid 0.05): {len(q_errs)}")
    for q in q_errs[:5]:
        print(f"  {q}")

    # 2. Grounding check
    min_y = min(c['from'][1] for c in cubes)
    grounded = [c['name'] for c in cubes if abs(c['from'][1] - 0.0) < 1e-5]
    print(f"Min Y: {min_y:.4f} (Grounded cubes: {len(grounded)}: {grounded})")

    # 3. Dimensions check
    min_x = min(c['from'][0] for c in cubes)
    max_x = max(c['to'][0] for c in cubes)
    max_y = max(c['to'][1] for c in cubes)
    min_z = min(c['from'][2] for c in cubes)
    max_z = max(c['to'][2] for c in cubes)
    width = max_x - min_x
    height = max_y - min_y
    length = max_z - min_z
    print(f"Bounds: W={width:.2f} ({width*0.05:.3f}m), H={height:.2f} ({height*0.05:.3f}m), L={length:.2f} ({length*0.05:.3f}m)")

    # 4. Coplanar overlap check
    sys.path.insert(0, os.path.dirname(__file__))
    from blockbench_coplanar_check import blockbench_check
    coplanar_issues = blockbench_check(cubes)
    print(f"Coplanar overlaps: {len(coplanar_issues)}")
    for iss in coplanar_issues:
        print(f"  Overlap on {iss['axis']}={iss['plane']}: {iss['c1']} vs {iss['c2']}")

    # 5. Enclosed check
    enclosed = check_enclosed(cubes)
    print(f"Enclosed cubes: {len(enclosed)}")
    for e in enclosed:
        print(f"  {e[0]} enclosed in {e[1]}")

    # 6. Connectivity check
    visited = check_connectivity(cubes)
    print(f"Connected cubes: {len(visited)} / {len(cubes)}")
    unvisited = [c['name'] for i, c in enumerate(cubes) if i not in visited]
    if unvisited:
        print(f"Unvisited cubes: {unvisited}")
