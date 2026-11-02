import json

def blockbench_check(cubes):
    issues = []
    n = len(cubes)
    axes = ['x', 'y', 'z']
    for i in range(n):
        c1 = cubes[i]
        f1, t1 = c1['from'], c1['to']
        for j in range(i + 1, n):
            c2 = cubes[j]
            f2, t2 = c2['from'], c2['to']

            # Check for coplanar overlap on each axis
            for a in range(3):
                o1 = (a + 1) % 3
                o2 = (a + 2) % 3
                
                # In the two other axes, there must be a positive 2D area overlap
                overlap1 = min(t1[o1], t2[o1]) - max(f1[o1], f2[o1])
                overlap2 = min(t1[o2], t2[o2]) - max(f1[o2], f2[o2])
                
                # At least 0.01 area overlap
                if overlap1 > 0.05 and overlap2 > 0.05:
                    # Check if any boundary on axis 'a' matches within 0.01
                    for v1 in (f1[a], t1[a]):
                        for v2 in (f2[a], t2[a]):
                            if abs(v1 - v2) < 0.01:
                                issues.append({
                                    'c1': c1['name'],
                                    'c2': c2['name'],
                                    'axis': axes[a],
                                    'plane': v1,
                                    'col1': c1.get('color'),
                                    'col2': c2.get('color')
                                })
    return issues

if __name__ == '__main__':
    with open('scripts/bb_cubes_data.json') as f:
        cubes = json.load(f)
    issues = blockbench_check(cubes)
    print(f"Blockbench logic: {len(issues)} coplanar overlaps.")
    for iss in issues:
        print(f"  {iss['c1']} vs {iss['c2']} on {iss['axis']} = {iss['plane']} ({iss['col1']} vs {iss['col2']})")
