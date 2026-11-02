import json

def check_coplanar(cubes):
    issues = []
    n = len(cubes)
    planes = ['x', 'y', 'z']
    for i in range(n):
        c1 = cubes[i]
        f1, t1 = c1['from'], c1['to']
        for j in range(i + 1, n):
            c2 = cubes[j]
            f2, t2 = c2['from'], c2['to']
            
            # Check 6 faces of c1 vs 6 faces of c2
            # X faces: f1[0] and t1[0]
            for p1 in [f1[0], t1[0]]:
                for p2 in [f2[0], t2[0]]:
                    if abs(p1 - p2) < 0.005:
                        # Overlap in Y and Z?
                        y_ov = max(0.0, min(t1[1], t2[1]) - max(f1[1], f2[1]))
                        z_ov = max(0.0, min(t1[2], t2[2]) - max(f1[2], f2[2]))
                        if y_ov > 0.01 and z_ov > 0.01:
                            issues.append((c1['name'], c2['name'], f'X={p1:.2f}', f'area={y_ov*z_ov:.3f}'))
            # Y faces: f1[1] and t1[1]
            for p1 in [f1[1], t1[1]]:
                for p2 in [f2[1], t2[1]]:
                    if abs(p1 - p2) < 0.005:
                        x_ov = max(0.0, min(t1[0], t2[0]) - max(f1[0], f2[0]))
                        z_ov = max(0.0, min(t1[2], t2[2]) - max(f1[2], f2[2]))
                        if x_ov > 0.01 and z_ov > 0.01:
                            issues.append((c1['name'], c2['name'], f'Y={p1:.2f}', f'area={x_ov*z_ov:.3f}'))
            # Z faces: f1[2] and t1[2]
            for p1 in [f1[2], t1[2]]:
                for p2 in [f2[2], t2[2]]:
                    if abs(p1 - p2) < 0.005:
                        x_ov = max(0.0, min(t1[0], t2[0]) - max(f1[0], f2[0]))
                        y_ov = max(0.0, min(t1[1], t2[1]) - max(f1[1], f2[1]))
                        if x_ov > 0.01 and y_ov > 0.01:
                            issues.append((c1['name'], c2['name'], f'Z={p1:.2f}', f'area={x_ov*y_ov:.3f}'))
    return issues

if __name__ == '__main__':
    with open('scripts/pigeon_v2_zero_zfight.json') as f:
        cubes = json.load(f)
    issues = check_coplanar(cubes)
    print(f"Pigeon issues: {len(issues)}")
