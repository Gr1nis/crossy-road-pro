import json

def check_coplanar(cubes):
    issues = []
    n = len(cubes)
    axes = ['x', 'y', 'z']
    for i in range(n):
        c1 = cubes[i]
        f1, t1 = c1['from'], c1['to']
        for j in range(i + 1, n):
            c2 = cubes[j]
            f2, t2 = c2['from'], c2['to']

            # Check overlap on each axis
            overlap = [
                max(0.0, min(t1[a], t2[a]) - max(f1[a], f2[a]))
                for a in range(3)
            ]

            # Check if any face planes match within 0.001
            for a in range(3):
                o1 = (a + 1) % 3
                o2 = (a + 2) % 3
                # Overlap in the other 2 dimensions
                if overlap[o1] > 0.001 and overlap[o2] > 0.001:
                    # Check 4 plane combinations: from-from, from-to, to-from, to-to
                    planes = [
                        ('from', 'from', abs(f1[a] - f2[a]), f1[a]),
                        ('from', 'to', abs(f1[a] - t2[a]), f1[a]),
                        ('to', 'from', abs(t1[a] - f2[a]), t1[a]),
                        ('to', 'to', abs(t1[a] - t2[a]), t1[a]),
                    ]
                    for p1, p2, diff, val in planes:
                        if diff < 0.01:
                            # If colors are identical, sometimes it is okay, but user specifically asked for NO Z-FIGHTING
                            issues.append({
                                'c1': c1['name'],
                                'c2': c2['name'],
                                'axis': axes[a],
                                'plane': val,
                                'col1': c1.get('color'),
                                'col2': c2.get('color')
                            })
    return issues

if __name__ == '__main__':
    with open('scripts/bb_cubes_data.json') as f:
        cubes = json.load(f)
    issues = check_coplanar(cubes)
    print(f"Found {len(issues)} coplanar overlaps.")
    for iss in issues:
        print(f"  {iss['c1']} vs {iss['c2']} on {iss['axis']} = {iss['plane']} (col: {iss['col1']} vs {iss['col2']})")
