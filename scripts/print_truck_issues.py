import sys
sys.path.insert(0, 'scripts')
from solve_truck import build_truck, blockbench_check

cubes = build_truck()
issues = blockbench_check(cubes)
print(f"Total issues: {len(issues)}")
for i, iss in enumerate(issues):
    print(f"{i+1}: {iss['c1']} vs {iss['c2']} on {iss['axis']} = {iss['plane']}")
