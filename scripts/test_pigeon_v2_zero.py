with open('scripts/design_pigeon_v2.py') as f:
    text = f.read()

replacements = [
    ('{"name": "pizza_crust", "from": [-2.8, 10.8, -6.5], "to": [2.8, 11.9, -5.4]', '{"name": "pizza_crust", "from": [-2.8, 10.8, -6.5], "to": [2.8, 11.8, -5.4]'),
    ('{"name": "pizza_cheese_wide", "from": [-2.3, 11.05, -7.4], "to": [2.3, 11.6, -6.1]', '{"name": "pizza_cheese_wide", "from": [-2.3, 11.05, -7.4], "to": [2.3, 11.6, -6.2]'),
    ('{"name": "cheese_drip_left", "from": [-1.9, 9.8, -7.4], "to": [-1.3, 11.2, -6.8]', '{"name": "cheese_drip_left", "from": [-1.9, 9.8, -7.3], "to": [-1.3, 11.1, -6.7]'),
    ('{"name": "cheese_drip_right", "from": [1.1, 10.0, -7.8], "to": [1.7, 11.2, -7.2]', '{"name": "cheese_drip_right", "from": [1.1, 10.0, -7.7], "to": [1.7, 11.1, -7.1]'),
    ('{"name": "basil_leaf", "from": [-1.2, 11.45, -8.3], "to": [-0.5, 11.75, -7.6]', '{"name": "basil_leaf", "from": [-1.2, 11.45, -8.3], "to": [-0.5, 11.80, -7.6]'),
]

for old, new in replacements:
    assert old in text, f"Missing: {old}"
    text = text.replace(old, new)

with open('scripts/design_pigeon_v2.py', 'w') as f:
    f.write(text)

