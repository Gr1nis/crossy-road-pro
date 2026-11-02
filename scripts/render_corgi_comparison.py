import math
import numpy as np
from PIL import Image, ImageDraw, ImageFont

# Define palette
PALETTE = {
    'corgiOrange': (217, 119, 6),
    'white': (255, 255, 255),
    'nosePink': (244, 114, 182),
    'darkCharcoal': (30, 41, 59),
    'pizzaRed': (185, 28, 28),
    'pizzaCheese': (250, 204, 21),
}

# Original 32 voxels
ORIGINAL_VOXELS = [
    # w, h, d, col, x, y, z
    (0.10, 0.03, 0.10, 'nosePink', -0.14, 0.015, 0.16),
    (0.10, 0.12, 0.10, 'white', -0.14, 0.09, 0.16),
    (0.10, 0.03, 0.10, 'nosePink', 0.14, 0.015, 0.16),
    (0.10, 0.12, 0.10, 'white', 0.14, 0.09, 0.16),
    (0.10, 0.03, 0.10, 'nosePink', -0.14, 0.015, -0.16),
    (0.10, 0.12, 0.10, 'white', -0.14, 0.09, -0.16),
    (0.10, 0.03, 0.10, 'nosePink', 0.14, 0.015, -0.16),
    (0.10, 0.12, 0.10, 'white', 0.14, 0.09, -0.16),
    (0.38, 0.22, 0.46, 'corgiOrange', 0, 0.25, -0.01),
    (0.26, 0.04, 0.38, 'white', 0, 0.15, -0.01),
    (0.34, 0.20, 0.12, 'white', 0, 0.26, 0.18),
    (0.36, 0.20, 0.08, 'corgiOrange', 0, 0.26, -0.24),
    (0.16, 0.12, 0.03, 'white', 0, 0.25, -0.28),
    (0.12, 0.12, 0.10, 'corgiOrange', 0, 0.35, -0.27),
    (0.08, 0.08, 0.05, 'white', 0, 0.37, -0.31),
    (0.32, 0.04, 0.22, 'pizzaRed', 0, 0.35, 0.15),
    (0.04, 0.04, 0.03, 'pizzaCheese', 0, 0.33, 0.26),
    (0.36, 0.26, 0.30, 'corgiOrange', 0, 0.48, 0.18),
    (0.08, 0.22, 0.12, 'white', 0, 0.50, 0.28),
    (0.20, 0.12, 0.14, 'white', 0, 0.42, 0.35),
    (0.08, 0.06, 0.06, 'darkCharcoal', 0, 0.46, 0.42),
    (0.06, 0.03, 0.08, 'nosePink', 0.03, 0.38, 0.41),
    (0.05, 0.06, 0.04, 'darkCharcoal', -0.11, 0.51, 0.33),
    (0.02, 0.02, 0.02, 'white', -0.11, 0.53, 0.35),
    (0.05, 0.06, 0.04, 'darkCharcoal', 0.11, 0.51, 0.33),
    (0.02, 0.02, 0.02, 'white', 0.11, 0.53, 0.35),
    (0.10, 0.16, 0.06, 'corgiOrange', -0.14, 0.66, 0.16),
    (0.06, 0.08, 0.05, 'corgiOrange', -0.15, 0.76, 0.16),
    (0.06, 0.14, 0.03, 'nosePink', -0.14, 0.67, 0.18),
    (0.10, 0.16, 0.06, 'corgiOrange', 0.14, 0.66, 0.16),
    (0.06, 0.08, 0.05, 'corgiOrange', 0.15, 0.76, 0.16),
    (0.06, 0.14, 0.03, 'nosePink', 0.14, 0.67, 0.18),
]

# Load current 61 voxels from src/view/urbanCharacters.ts
import re
with open('src/view/urbanCharacters.ts') as f:
    text = f.read()

m = re.search(r'if\s*\(\s*skinId\s*===\s*[\x27\x22]corgi[\x27\x22]\s*\)\s*\{(.*?)\}\s*else', text, re.DOTALL)
block = m.group(1) if m else ''
raw = re.findall(r'addCharVoxel\s*\(\s*group\s*,\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*[\x27\x22]([^\x27\x22]+)[\x27\x22],\s*([^,]+),\s*([^,]+),\s*([^,]+)', block)
CURRENT_VOXELS = [(float(w), float(h), float(d), col, float(x), float(y), float(z)) for w, h, d, col, x, y, z in raw]

def render_voxels(voxels, yaw_deg, pitch_deg, img_size=(360, 360)):
    W, H = img_size
    yaw = math.radians(yaw_deg)
    pitch = math.radians(pitch_deg)

    cos_y, sin_y = math.cos(yaw), math.sin(yaw)
    cos_p, sin_p = math.cos(pitch), math.sin(pitch)

    # Lighting: Sun from upper-front-right
    light_dir = np.array([0.5, 0.8, 0.4], dtype=np.float32)
    light_dir /= np.linalg.norm(light_dir)

    polygons = []
    for w, h, d, col_key, cx, cy, cz in voxels:
        base_rgb = PALETTE.get(col_key, (200, 200, 200))
        hx, hy, hz = w / 2, h / 2, d / 2
        
        # 8 corners
        corners = [
            np.array([cx - hx, cy - hy, cz - hz]),
            np.array([cx + hx, cy - hy, cz - hz]),
            np.array([cx + hx, cy + hy, cz - hz]),
            np.array([cx - hx, cy + hy, cz - hz]),
            np.array([cx - hx, cy - hy, cz + hz]),
            np.array([cx + hx, cy - hy, cz + hz]),
            np.array([cx + hx, cy + hy, cz + hz]),
            np.array([cx - hx, cy + hy, cz + hz]),
        ]

        # 6 faces: (indices, normal)
        faces = [
            ([0, 1, 2, 3], np.array([0, 0, -1])), # back
            ([5, 4, 7, 6], np.array([0, 0, 1])),  # front
            ([4, 0, 3, 7], np.array([-1, 0, 0])), # left
            ([1, 5, 6, 2], np.array([1, 0, 0])),  # right
            ([3, 2, 6, 7], np.array([0, 1, 0])),  # top
            ([4, 5, 1, 0], np.array([0, -1, 0])), # bottom
        ]

        for f_idx, norm in faces:
            # Transform normal & corners
            # Rotate Y then X (pitch)
            def rot(v):
                # yaw around Y
                x1 = v[0] * cos_y + v[2] * sin_y
                y1 = v[1]
                z1 = -v[0] * sin_y + v[2] * cos_y
                # pitch around X
                x2 = x1
                y2 = y1 * cos_p - z1 * sin_p
                z2 = y1 * sin_p + z1 * cos_p
                return np.array([x2, y2, z2])

            r_norm = rot(norm)
            if r_norm[2] <= 0.05: # cull backfaces
                continue

            # Lighting
            diff = max(0.0, float(np.dot(norm, light_dir)))
            shade = 0.55 + 0.45 * diff
            color = tuple(int(min(255, max(0, c * shade))) for c in base_rgb)

            r_corners = [rot(corners[i]) for i in f_idx]
            avg_z = sum(c[2] for c in r_corners) / 4.0

            # Project isometric: orthographic
            scale = 260.0
            pts_2d = []
            for c in r_corners:
                px = W / 2 + c[0] * scale
                py = H / 2 - (c[1] - 0.45) * scale # center around Y=0.45
                pts_2d.append((px, py))

            polygons.append((avg_z, pts_2d, color))

    # Sort back-to-front
    polygons.sort(key=lambda p: p[0])

    im = Image.new('RGBA', (W, H), (20, 24, 34, 255))
    draw = ImageDraw.Draw(im)
    for _, pts, col in polygons:
        draw.polygon(pts, fill=col, outline=(30, 30, 30, 160))

    return im

# Render sets of angles for both models:
# 1. Front Isometric (yaw=35, pitch=20)
# 2. Front Face (yaw=0, pitch=5)
# 3. Rear Peach Butt (yaw=180, pitch=15)
# 4. Side Profile (yaw=90, pitch=10)

angles = [
    ("Isometric 3/4", 35, 20),
    ("Front Face", 0, 5),
    ("Rear Butt", 180, 15),
    ("Side View", 90, 10),
]

orig_imgs = [render_voxels(ORIGINAL_VOXELS, yaw, pitch) for _, yaw, pitch in angles]
curr_imgs = [render_voxels(CURRENT_VOXELS, yaw, pitch) for _, yaw, pitch in angles]

# Compose side by side:
# Row 1: Original Model (32 voxels)
# Row 2: Current Model (61 voxels)
cell_w, cell_h = 360, 360
pad = 10
total_w = cell_w * 4 + pad * 5
total_h = cell_h * 2 + 120

comp = Image.new('RGBA', (total_w, total_h), (11, 15, 25, 255))
draw = ImageDraw.Draw(comp)
font = ImageFont.load_default()

draw.text((20, 15), "ORIGINAL IN-GAME CORGI (32 voxels) — Clean, cohesive, solid volumes", fill=(74, 222, 128, 255), font=font)
draw.text((20, cell_h + 60), "CURRENT UPDATED CORGI (61 voxels) — User critique: 'одноцветное и дырявое'", fill=(248, 113, 113, 255), font=font)

for i, (title, _, _) in enumerate(angles):
    x = pad + i * (cell_w + pad)
    # Row 1
    comp.alpha_composite(orig_imgs[i], (x, 40))
    draw.text((x + 10, 45), f"{title} (Original)", fill=(255, 255, 255, 220), font=font)

    # Row 2
    comp.alpha_composite(curr_imgs[i], (x, cell_h + 85))
    draw.text((x + 10, cell_h + 90), f"{title} (Current)", fill=(255, 255, 255, 220), font=font)

comp.save('corgi_before_after_comparison.png')
print("Successfully generated corgi_before_after_comparison.png:", comp.size)
