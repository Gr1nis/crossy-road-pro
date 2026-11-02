import json
from blockbench_coplanar_check import blockbench_check

with open('scripts/solve_z_fighting.py') as f:
    text = f.read()

# Apply the 7 fixes
replacements = [
    ('{"name": "front_paw_sock_left", "from": [-3.8, 0.5, -4.0], "to": [-1.8, 2.9, -2.0]', '{"name": "front_paw_sock_left", "from": [-3.8, 0.4, -4.0], "to": [-1.8, 3.0, -2.0]'),
    ('{"name": "front_toe_beans_left", "from": [-3.4, 0.1, -4.4], "to": [-2.2, 0.5, -3.8]', '{"name": "front_toe_beans_left", "from": [-3.4, 0.1, -4.4], "to": [-2.2, 0.55, -3.8]'),
    ('{"name": "front_paw_sock_right", "from": [1.8, 0.5, -4.0], "to": [3.8, 2.9, -2.0]', '{"name": "front_paw_sock_right", "from": [1.8, 0.4, -4.0], "to": [3.8, 3.0, -2.0]'),
    ('{"name": "front_toe_beans_right", "from": [2.2, 0.1, -4.4], "to": [3.4, 0.5, -3.8]', '{"name": "front_toe_beans_right", "from": [2.2, 0.1, -4.4], "to": [3.4, 0.55, -3.8]'),
    ('{"name": "rear_paw_sock_left", "from": [-3.8, 0.5, 2.0], "to": [-1.8, 2.9, 4.0]', '{"name": "rear_paw_sock_left", "from": [-3.8, 0.4, 2.0], "to": [-1.8, 3.0, 4.0]'),
    ('{"name": "rear_paw_sock_right", "from": [1.8, 0.5, 2.0], "to": [3.8, 2.9, 4.0]', '{"name": "rear_paw_sock_right", "from": [1.8, 0.4, 2.0], "to": [3.8, 3.0, 4.0]'),
    ('{"name": "rear_bum_core", "from": [-3.3, 2.9, 3.4], "to": [3.3, 6.7, 4.7]', '{"name": "rear_bum_core", "from": [-3.3, 2.7, 3.4], "to": [3.3, 6.7, 4.7]'),
    ('{"name": "chin_under_mouth", "from": [-1.3, 6.6, -6.7], "to": [1.3, 7.2, -5.1]', '{"name": "chin_under_mouth", "from": [-1.3, 6.7, -6.7], "to": [1.3, 7.2, -4.9]'),
    ('{"name": "collar_tag_gold", "from": [-0.6, 5.5, -5.4], "to": [0.6, 6.6, -4.7]', '{"name": "collar_tag_gold", "from": [-0.6, 5.5, -5.4], "to": [0.6, 6.5, -4.7]'),
    ('{"name": "blaze_forehead", "from": [-0.8, 7.3, -6.1], "to": [0.8, 12.1, -3.9]', '{"name": "blaze_forehead", "from": [-0.8, 7.1, -6.1], "to": [0.8, 12.1, -3.9]'),
]

for old, new in replacements:
    assert old in text, f"Missing {old}"
    text = text.replace(old, new)

with open('scripts/solve_z_fighting.py', 'w') as f:
    f.write(text)

