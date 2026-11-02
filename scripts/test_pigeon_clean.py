with open('scripts/solve_pigeon_zfight.py') as f:
    text = f.read()

replacements = [
    ('{"name": "basil_leaf", "from": [-1.4, 11.45, -6.8], "to": [-0.7, 11.80, -6.2]', '{"name": "basil_leaf", "from": [-1.4, 11.45, -6.8], "to": [-0.7, 11.75, -6.2]'),
    ('{"name": "pizza_cheese_mid", "from": [-1.8, 10.9, -7.3], "to": [1.8, 11.5, -5.9]', '{"name": "pizza_cheese_mid", "from": [-1.8, 10.9, -7.3], "to": [1.8, 11.5, -5.8]'),
    ('{"name": "pizza_cheese_tip", "from": [-0.9, 11.0, -6.0], "to": [0.9, 11.4, -4.8]', '{"name": "pizza_cheese_tip", "from": [-0.9, 11.05, -6.0], "to": [0.9, 11.4, -4.8]'),
    ('{"name": "pepperoni_left", "from": [-1.8, 11.45, -8.3], "to": [-0.6, 11.85, -7.1]', '{"name": "pepperoni_left", "from": [-1.7, 11.45, -8.3], "to": [-0.6, 11.85, -7.1]'),
    ('{"name": "pepperoni_right", "from": [0.6, 11.45, -8.1], "to": [1.8, 11.85, -6.9]', '{"name": "pepperoni_right", "from": [0.6, 11.45, -8.1], "to": [1.7, 11.85, -6.9]'),
]

for old, new in replacements:
    assert old in text, f"Missing: {old}"
    text = text.replace(old, new)

with open('scripts/solve_pigeon_zfight.py', 'w') as f:
    f.write(text)

