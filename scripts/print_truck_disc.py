import sys
sys.path.insert(0, 'scripts')
from solve_truck import build_truck, check_connectivity

cubes = build_truck()
visited = check_connectivity(cubes)
print("Disconnected cubes:")
for i, c in enumerate(cubes):
    if i not in visited:
        print(f"  {i}: {c['name']} (group={c['group']}, from={c['from']}, to={c['to']})")
