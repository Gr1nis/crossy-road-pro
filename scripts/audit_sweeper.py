import json
import sys

cubes_path = 'assets/models/sweeper_cubes.json'
with open(cubes_path, 'r', encoding='utf-8') as f:
    cubes = json.load(f)

print(f"Loaded {len(cubes)} cubes from {cubes_path}")

# 1. Quantization
q_errs = []
for c in cubes:
    for ax in range(3):
        f_val = c['from'][ax]
        t_val = c['to'][ax]
        if abs(f_val * 20 - round(f_val * 20)) > 1e-4:
            q_errs.append(f"{c['name']} from[{ax}]={f_val}")
        if abs(t_val * 20 - round(t_val * 20)) > 1e-4:
            q_errs.append(f"{c['name']} to[{ax}]={t_val}")
print(f"Quantization errors: {len(q_errs)}")

# 2. Bounds & Grounding
min_y = min(c['from'][1] for c in cubes)
max_y = max(c['to'][1] for c in cubes)
min_x = min(c['from'][0] for c in cubes)
max_x = max(c['to'][0] for c in cubes)
min_z = min(c['from'][2] for c in cubes)
max_z = max(c['to'][2] for c in cubes)

w = max_x - min_x
h = max_y - min_y
l = max_z - min_z
print(f"Bounds: W={w:.2f} ({w*0.05:.3f}m), H={h:.2f} ({h*0.05:.3f}m), L={l:.2f} ({l*0.05:.3f}m)")

grounded = [c['name'] for c in cubes if abs(c['from'][1] - 0.0) < 1e-5]
print(f"Min Y: {min_y:.4f}, Grounded cubes: {grounded}")

# 3. Coplanar overlaps
sys.path.insert(0, 'scripts')
from blockbench_coplanar_check import blockbench_check
coplanar = blockbench_check(cubes)
print(f"Coplanar overlaps: {len(coplanar)}")
for iss in coplanar[:10]:
    print(f"  Overlap {iss['axis']}={iss['plane']}: {iss['c1']} vs {iss['c2']}")

# 4. Enclosed check
from solve_scooter import check_enclosed, check_connectivity
enclosed = check_enclosed(cubes)
print(f"Enclosed cubes: {len(enclosed)}")
for e in enclosed:
    print(f"  {e[0]} in {e[1]}")

# 5. Connectivity
conn = check_connectivity(cubes)
print(f"Connected cubes: {len(conn)} / {len(cubes)}")
unvisited = [c['name'] for i, c in enumerate(cubes) if i not in conn]
if unvisited:
    print(f"  Unvisited: {unvisited}")

# 6. Palette
colors = set(c.get('color') for c in cubes)
print(f"Color count: {len(colors)}")
print("Colors:", sorted(list(colors)))
