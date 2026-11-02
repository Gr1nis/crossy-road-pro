with open('scripts/solve_z_fighting.py') as f:
    text = f.read()

replacements = [
    ('{"name": "body_belly_white", "from": [-2.6, 2.2, -3.3], "to": [2.6, 2.8, 3.3]', '{"name": "body_belly_white", "from": [-2.6, 2.2, -3.3], "to": [2.6, 2.7, 3.3]'),
    ('{"name": "chin_under_mouth", "from": [-1.3, 6.7, -6.7], "to": [1.3, 7.2, -4.9]', '{"name": "chin_under_mouth", "from": [-1.3, 6.8, -6.7], "to": [1.3, 7.2, -4.9]'),
]

for old, new in replacements:
    assert old in text, f"Missing {old}"
    text = text.replace(old, new)

with open('scripts/solve_z_fighting.py', 'w') as f:
    f.write(text)

