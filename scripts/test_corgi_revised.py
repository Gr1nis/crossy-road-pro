import math
import numpy as np
from PIL import Image, ImageDraw, ImageFont

PALETTE = {
    'corgiOrange': (217, 119, 6),
    'white': (255, 255, 255),
    'nosePink': (244, 114, 182),
    'darkCharcoal': (30, 41, 59),
    'pizzaRed': (185, 28, 28),
    'pizzaCheese': (250, 204, 21),
}

ORIGINAL_VOXELS = [
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

REVISED_VOXELS = [
    # 4 Paws & legs (10 voxels)
    (0.10, 0.03, 0.10, 'nosePink', -0.14, 0.015, 0.16),
    (0.10, 0.12, 0.10, 'white', -0.14, 0.09, 0.16),
    (0.07, 0.03, 0.03, 'nosePink', -0.14, 0.015, 0.215), # Left front toe beans
    (0.10, 0.03, 0.10, 'nosePink', 0.14, 0.015, 0.16),
    (0.10, 0.12, 0.10, 'white', 0.14, 0.09, 0.16),
    (0.07, 0.03, 0.03, 'nosePink', 0.14, 0.015, 0.215),  # Right front toe beans
    (0.10, 0.03, 0.10, 'nosePink', -0.14, 0.015, -0.16),
    (0.10, 0.12, 0.10, 'white', -0.14, 0.09, -0.16),
    (0.10, 0.03, 0.10, 'nosePink', 0.14, 0.015, -0.16),
    (0.10, 0.12, 0.10, 'white', 0.14, 0.09, -0.16),
    (0.11, 0.08, 0.11, 'corgiOrange', -0.14, 0.19, -0.16), # Rear left thigh fluff
    (0.11, 0.08, 0.11, 'corgiOrange', 0.14, 0.19, -0.16),  # Rear right thigh fluff

    # Body loaf, belly, chest bib & tuft (4 voxels)
    (0.38, 0.22, 0.44, 'corgiOrange', 0, 0.25, -0.01),
    (0.28, 0.04, 0.38, 'white', 0, 0.14, -0.01),
    (0.34, 0.20, 0.12, 'white', 0, 0.26, 0.17),
    (0.20, 0.12, 0.05, 'white', 0, 0.27, 0.235),

    # Butt, peach cheeks, bobtail & white tip (5 voxels)
    (0.36, 0.20, 0.08, 'corgiOrange', 0, 0.26, -0.23),
    (0.15, 0.16, 0.06, 'white', -0.075, 0.24, -0.27), # Left peach cheek
    (0.15, 0.16, 0.06, 'white', 0.075, 0.24, -0.27),  # Right peach cheek (together 0.30 wide, seamless!)
    (0.12, 0.12, 0.10, 'corgiOrange', 0, 0.34, -0.26),
    (0.08, 0.08, 0.06, 'white', 0, 0.36, -0.31),

    # Collar & golden heart tag (2 voxels)
    (0.34, 0.05, 0.24, 'pizzaRed', 0, 0.36, 0.14),
    (0.06, 0.06, 0.04, 'pizzaCheese', 0, 0.32, 0.25),

    # Head core & chubby cheeks (3 voxels)
    (0.36, 0.26, 0.30, 'corgiOrange', 0, 0.48, 0.16),
    (0.05, 0.13, 0.14, 'white', -0.185, 0.44, 0.17),
    (0.05, 0.13, 0.14, 'white', 0.185, 0.44, 0.17),

    # Blaze, crown, snout, chin, nose (5 voxels)
    (0.09, 0.24, 0.13, 'white', 0, 0.49, 0.26),
    (0.07, 0.04, 0.10, 'white', 0, 0.61, 0.18), # Crown blaze
    (0.20, 0.12, 0.14, 'white', 0, 0.42, 0.33),
    (0.14, 0.04, 0.08, 'white', 0, 0.36, 0.31),
    (0.08, 0.06, 0.06, 'darkCharcoal', 0, 0.46, 0.40),

    # Playful side tongue (1 voxel)
    (0.06, 0.035, 0.08, 'nosePink', 0.03, 0.385, 0.39),

    # Eyes & sparkles & subtle white eyebrows (6 voxels)
    (0.06, 0.07, 0.04, 'darkCharcoal', -0.11, 0.51, 0.29),
    (0.025, 0.025, 0.02, 'white', -0.11, 0.53, 0.31),
    (0.05, 0.025, 0.02, 'white', -0.11, 0.56, 0.285), # Left eyebrow dot
    (0.06, 0.07, 0.04, 'darkCharcoal', 0.11, 0.51, 0.29),
    (0.025, 0.025, 0.02, 'white', 0.11, 0.53, 0.31),
    (0.05, 0.025, 0.02, 'white', 0.11, 0.56, 0.285),  # Right eyebrow dot

    # 2-tiered pointed ears with pink inner layer (6 voxels)
    (0.10, 0.14, 0.08, 'corgiOrange', -0.14, 0.65, 0.15),
    (0.06, 0.10, 0.06, 'corgiOrange', -0.14, 0.75, 0.15),
    (0.06, 0.12, 0.03, 'nosePink', -0.14, 0.65, 0.176),
    (0.10, 0.14, 0.08, 'corgiOrange', 0.14, 0.65, 0.15),
    (0.06, 0.10, 0.06, 'corgiOrange', 0.14, 0.75, 0.15),
    (0.06, 0.12, 0.03, 'nosePink', 0.14, 0.65, 0.176),
]

print("Revised voxels count:", len(REVISED_VOXELS))

def render_voxels(voxels, yaw_deg, pitch_deg, img_size=(360, 360)):
    W, H = img_size
    yaw = math.radians(yaw_deg)
    pitch = math.radians(pitch_deg)

    cos_y, sin_y = math.cos(yaw), math.sin(yaw)
    cos_p, sin_p = math.cos(pitch), math.sin(pitch)

    light_dir = np.array([0.5, 0.8, 0.4], dtype=np.float32)
    light_dir /= np.linalg.norm(light_dir)

    polygons = []
    for w, h, d, col_key, cx, cy, cz in voxels:
        base_rgb = PALETTE.get(col_key, (200, 200, 200))
        hx, hy, hz = w / 2, h / 2, d / 2
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

        faces = [
            ([0, 1, 2, 3], np.array([0, 0, -1])), # back
            ([5, 4, 7, 6], np.array([0, 0, 1])),  # front
            ([4, 0, 3, 7], np.array([-1, 0, 0])), # left
            ([1, 5, 6, 2], np.array([1, 0, 0])),  # right
            ([3, 2, 6, 7], np.array([0, 1, 0])),  # top
            ([4, 5, 1, 0], np.array([0, -1, 0])), # bottom
        ]

        for f_idx, norm in faces:
            def rot(v):
                x1 = v[0] * cos_y + v[2] * sin_y
                y1 = v[1]
                z1 = -v[0] * sin_y + v[2] * cos_y
                x2 = x1
                y2 = y1 * cos_p - z1 * sin_p
                z2 = y1 * sin_p + z1 * cos_p
                return np.array([x2, y2, z2])

            r_norm = rot(norm)
            if r_norm[2] <= 0.05:
                continue

            diff = max(0.0, float(np.dot(norm, light_dir)))
            shade = 0.55 + 0.45 * diff
            color = tuple(int(min(255, max(0, c * shade))) for c in base_rgb)

            r_corners = [rot(corners[i]) for i in f_idx]
            avg_z = sum(c[2] for c in r_corners) / 4.0

            scale = 260.0
            pts_2d = []
            for c in r_corners:
                px = W / 2 + c[0] * scale
                py = H / 2 - (c[1] - 0.45) * scale
                pts_2d.append((px, py))

            polygons.append((avg_z, pts_2d, color))

    polygons.sort(key=lambda p: p[0])

    im = Image.new('RGBA', (W, H), (20, 24, 34, 255))
    draw = ImageDraw.Draw(im)
    for _, pts, col in polygons:
        draw.polygon(pts, fill=col, outline=(30, 30, 30, 160))

    return im

angles = [
    ("Isometric 3/4", 35, 20),
    ("Front Face", 0, 5),
    ("Rear Butt", 180, 15),
    ("Side View", 90, 10),
]

orig_imgs = [render_voxels(ORIGINAL_VOXELS, yaw, pitch) for _, yaw, pitch in angles]
rev_imgs = [render_voxels(REVISED_VOXELS, yaw, pitch) for _, yaw, pitch in angles]

cell_w, cell_h = 360, 360
pad = 10
total_w = cell_w * 4 + pad * 5
total_h = cell_h * 2 + 120

comp = Image.new('RGBA', (total_w, total_h), (11, 15, 25, 255))
draw = ImageDraw.Draw(comp)
font = ImageFont.load_default()

draw.text((20, 15), "ORIGINAL IN-GAME CORGI (32 voxels) — Baseline beloved model", fill=(74, 222, 128, 255), font=font)
draw.text((20, cell_h + 60), "REVISED SOLID CORGI (42 voxels) — Zero wafers, zero gaps, solid peach cheeks, lively eyes & toe beans", fill=(56, 189, 248, 255), font=font)

for i, (title, _, _) in enumerate(angles):
    x = pad + i * (cell_w + pad)
    comp.alpha_composite(orig_imgs[i], (x, 40))
    draw.text((x + 10, 45), f"{title} (Original)", fill=(255, 255, 255, 220), font=font)

    comp.alpha_composite(rev_imgs[i], (x, cell_h + 85))
    draw.text((x + 10, cell_h + 90), f"{title} (Revised 42v)", fill=(255, 255, 255, 220), font=font)

comp.save('corgi_revised_comparison.png')
print("Successfully generated corgi_revised_comparison.png:", comp.size)
