with open('scripts/solve_z_fighting.py') as f:
    text = f.read()

replacements = [
    ('{"name": "rear_thigh_fluff_left", "from": [-3.9, 2.7, 1.8], "to": [-1.7, 4.7, 4.2]', '{"name": "rear_thigh_fluff_left", "from": [-3.9, 2.8, 1.8], "to": [-1.7, 4.7, 4.2]'),
    ('{"name": "rear_thigh_fluff_right", "from": [1.7, 2.7, 1.8], "to": [3.9, 4.7, 4.2]', '{"name": "rear_thigh_fluff_right", "from": [1.7, 2.8, 1.8], "to": [3.9, 4.7, 4.2]'),
    ('{"name": "collar_tag_gold", "from": [-0.6, 5.5, -5.4], "to": [0.6, 6.5, -4.7]', '{"name": "collar_tag_gold", "from": [-0.6, 5.5, -5.4], "to": [0.6, 6.7, -4.7]'),
    ('{"name": "blaze_forehead", "from": [-0.8, 7.1, -6.1], "to": [0.8, 12.1, -3.9]', '{"name": "blaze_forehead", "from": [-0.8, 6.9, -6.1], "to": [0.8, 12.1, -3.9]'),
]

for old, new in replacements:
    assert old in text, f"Missing {old}"
    text = text.replace(old, new)

with open('scripts/solve_z_fighting.py', 'w') as f:
    f.write(text)

