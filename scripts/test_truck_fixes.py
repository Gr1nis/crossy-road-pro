import json
import os
import sys

sys.path.insert(0, 'scripts')
from blockbench_coplanar_check import blockbench_check
from solve_truck import check_quantization, check_connectivity

# Let's write the exact proposed cubes
from solve_truck import build_truck
cubes = build_truck()

# Remove the 6 arch cubes and the 4 split rub rails
cubes = [c for c in cubes if not c['name'].startswith('fender_arch_') and not c['name'].startswith('rub_rail_bottom_')]

# Add back continuous rub rails from v1
cubes.extend([
    {"name": "rub_rail_bottom_l", "group": "cargo_box", "from": [-8.35, 4.45, -8.95], "to": [-8.05, 5.45, 17.95], "color": "bumperSilver", "col_idx": 8},
    {"name": "rub_rail_bottom_r", "group": "cargo_box", "from": [8.05, 4.45, -8.95], "to": [8.35, 5.45, 17.95], "color": "bumperSilver", "col_idx": 8},
])

print(f"Total cubes: {len(cubes)}")
q_errs = check_quantization(cubes)
print(f"Quantization errors: {len(q_errs)}")

min_y = min(c['from'][1] for c in cubes)
grounded = [c['name'] for c in cubes if c['from'][1] == 0.0]
print(f"Min Y: {min_y}, grounded cubes count: {len(grounded)}: {grounded}")

issues = blockbench_check(cubes)
print(f"Coplanar overlaps: {len(issues)}")
for iss in issues:
    print(f"  {iss['c1']} vs {iss['c2']} on {iss['axis']} = {iss['plane']}")

visited = check_connectivity(cubes)
print(f"Connected cubes: {len(visited)} / {len(cubes)}")
