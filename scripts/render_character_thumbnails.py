#!/usr/bin/env python3
"""
3D Voxel Character Thumbnail Renderer for Crossy Road Pro
Renders authentic 3D isometric voxel characters matching the in-game models.

Output:
- references/processed_icons/char_{skin_id}.webp (160x160 px transparent WebP)
- src/view/gachaSkinsBase64.ts (embedded base64 Data URLs)
"""

import base64
import math
import os
import re
from PIL import Image

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PALETTE_FILE = os.path.join(ROOT_DIR, 'src', 'view', 'voxelPalette.ts')
CHARACTERS_FILE = os.path.join(ROOT_DIR, 'src', 'view', 'urbanCharacters.ts')
OUT_DIR = os.path.join(ROOT_DIR, 'references', 'processed_icons')
TS_OUT_FILE = os.path.join(ROOT_DIR, 'src', 'view', 'gachaSkinsBase64.ts')

SKIN_IDS = ['corgi', 'pigeon_pizza', 'box_cat', 'raccoon_bandit', 'capybara_zen']


def load_palette():
    with open(PALETTE_FILE, 'r', encoding='utf-8') as f:
        content = f.read()
    palette = {}
    for m in re.finditer(r'(\w+):\s*(0x[0-9a-fA-F]+)', content):
        palette[m.group(1)] = int(m.group(2), 16)
    return palette


def load_skin_voxels(skin_id, palette):
    with open(CHARACTERS_FILE, 'r', encoding='utf-8') as f:
        content = f.read()

    pattern = rf'if\s*\(\s*skinId\s*===\s*[\x27\x22]{skin_id}[\x27\x22]\s*\)\s*\{{(.*?)\}}\s*else'
    m = re.search(pattern, content, re.DOTALL)
    if not m:
        pattern = rf'else if\s*\(\s*skinId\s*===\s*[\x27\x22]{skin_id}[\x27\x22]\s*\)\s*\{{(.*?)\}}\s*else'
        m = re.search(pattern, content, re.DOTALL)

    block = m.group(1) if m else ''
    raw_calls = re.findall(
        r'addCharVoxel\s*\(\s*group\s*,\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*[\x27\x22]([^\x27\x22]+)[\x27\x22],\s*([^,]+),\s*([^,]+),\s*([^,]+)',
        block
    )

    voxels = []
    for w, h, d, col_key, x, y, z in raw_calls:
        color_val = palette.get(col_key, 0xffffff)
        voxels.append((
            float(w.strip()),
            float(h.strip()),
            float(d.strip()),
            color_val,
            float(x.strip()),
            float(y.strip()),
            float(z.strip())
        ))
    return voxels


def normalize(v):
    mag = math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2])
    return (v[0] / mag, v[1] / mag, v[2] / mag) if mag > 1e-8 else (0.0, 0.0, 0.0)


def dot(a, b):
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]


def cross(a, b):
    return (
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0]
    )


def render_voxel_character(voxels, yaw_deg=45.0, pitch_deg=35.264, size=160, supersample=3):
    W = size * supersample
    H = size * supersample

    pitch = math.radians(pitch_deg)
    yaw = math.radians(yaw_deg)

    # Isometric camera direction
    Cx = math.cos(pitch) * math.sin(yaw)
    Cy = math.sin(pitch)
    Cz = math.cos(pitch) * math.cos(yaw)
    cam = normalize((Cx, Cy, Cz))

    up_world = (0.0, 1.0, 0.0)
    right = normalize(cross(up_world, cam))
    up = cross(cam, right)

    faces_to_render = []

    # Three-point lighting setup
    L_key = normalize((0.5, 0.9, 0.6))
    L_fill = normalize((-0.7, 0.4, 0.4))
    L_rim = normalize((0.1, 0.9, -0.6))

    for w, h, d_val, col, x, y, z in voxels:
        x0, x1 = x - w / 2, x + w / 2
        y0, y1 = y - h / 2, y + h / 2
        z0, z1 = z - d_val / 2, z + d_val / 2

        box_faces = [
            ((0, 1, 0), [(x0, y1, z0), (x1, y1, z0), (x1, y1, z1), (x0, y1, z1)]),
            ((0, -1, 0), [(x0, y0, z1), (x1, y0, z1), (x1, y0, z0), (x0, y0, z0)]),
            ((0, 0, 1), [(x0, y0, z1), (x1, y0, z1), (x1, y1, z1), (x0, y1, z1)]),
            ((0, 0, -1), [(x1, y0, z0), (x0, y0, z0), (x0, y1, z0), (x1, y1, z0)]),
            ((1, 0, 0), [(x1, y0, z1), (x1, y0, z0), (x1, y1, z0), (x1, y1, z1)]),
            ((-1, 0, 0), [(x0, y0, z0), (x0, y0, z1), (x0, y1, z1), (x0, y1, z0)]),
        ]

        for norm, verts in box_faces:
            # Backface culling
            if dot(norm, cam) <= 0.001:
                continue

            r0 = (col >> 16) & 0xff
            g0 = (col >> 8) & 0xff
            b0 = col & 0xff

            d_key = max(0.0, dot(norm, L_key))
            d_fill = max(0.0, dot(norm, L_fill))
            d_rim = max(0.0, dot(norm, L_rim))

            # Warm, juicy, vibrant isometric lighting matching in-game Three.js renderer
            amb = 0.65
            key = 0.85
            fill = 0.22
            rim = 0.16

            lr = amb + key * d_key * 1.0 + fill * d_fill * (200 / 255) + rim * d_rim * 1.0
            lg = amb + key * d_key * (248 / 255) + fill * d_fill * (225 / 255) + rim * d_rim * 1.0
            lb = amb + key * d_key * (230 / 255) + fill * d_fill * (255 / 255) + rim * d_rim * 1.0

            R = min(255, max(0, int(r0 * lr)))
            G = min(255, max(0, int(g0 * lg)))
            B = min(255, max(0, int(b0 * lb)))

            proj_verts = []
            for vx, vy, vz in verts:
                u = vx * right[0] + vy * right[1] + vz * right[2]
                v = vx * up[0] + vy * up[1] + vz * up[2]
                dep = vx * cam[0] + vy * cam[1] + vz * cam[2]
                proj_verts.append((u, v, dep))

            faces_to_render.append((proj_verts, (R, G, B, 255)))

    all_u = [v[0] for f in faces_to_render for v in f[0]]
    all_v = [v[1] for f in faces_to_render for v in f[0]]

    min_u, max_u = min(all_u), max(all_u)
    min_v, max_v = min(all_v), max(all_v)

    span_u = max_u - min_u
    span_v = max_v - min_v
    mid_u = (min_u + max_u) / 2
    mid_v = (min_v + max_v) / 2

    # Fit into 84% of bounds for expressive character presentation in card frame
    target_px = W * 0.84
    scale = min(target_px / span_u, target_px / span_v)

    depth_buffer = [-1e9] * (W * H)
    color_buffer = [(0, 0, 0, 0)] * (W * H)

    def rasterize_triangle(p0, p1, p2, color):
        x0, y0, z0 = p0
        x1, y1, z1 = p1
        x2, y2, z2 = p2

        min_x = max(0, int(math.floor(min(x0, x1, x2))))
        max_x = min(W - 1, int(math.ceil(max(x0, x1, x2))))
        min_y = max(0, int(math.floor(min(y0, y1, y2))))
        max_y = min(H - 1, int(math.ceil(max(y0, y1, y2))))

        area = (x1 - x0) * (y2 - y0) - (y1 - y0) * (x2 - x0)
        if abs(area) < 1e-5:
            return
        inv_area = 1.0 / area

        for y in range(min_y, max_y + 1):
            row_idx = y * W
            py = y + 0.5
            for x in range(min_x, max_x + 1):
                px = x + 0.5
                w0 = ((x1 - px) * (y2 - py) - (y1 - py) * (x2 - px)) * inv_area
                w1 = ((x2 - px) * (y0 - py) - (y2 - py) * (x0 - px)) * inv_area
                w2 = 1.0 - w0 - w1
                if w0 >= -1e-4 and w1 >= -1e-4 and w2 >= -1e-4:
                    z = w0 * z0 + w1 * z1 + w2 * z2
                    idx = row_idx + x
                    if z > depth_buffer[idx]:
                        depth_buffer[idx] = z
                        color_buffer[idx] = color

    for pverts, color in faces_to_render:
        s_pts = []
        for u, v, dep in pverts:
            sx = W / 2 + (u - mid_u) * scale
            sy = H / 2 - (v - mid_v) * scale
            s_pts.append((sx, sy, dep))

        rasterize_triangle(s_pts[0], s_pts[1], s_pts[2], color)
        rasterize_triangle(s_pts[0], s_pts[2], s_pts[3], color)

    img = Image.new('RGBA', (W, H))
    img.putdata(color_buffer)
    return img.resize((size, size), Image.Resampling.LANCZOS)


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    palette = load_palette()
    base64_entries = {}

    for skin_id in SKIN_IDS:
        voxels = load_skin_voxels(skin_id, palette)
        print(f"Rendering {skin_id} ({len(voxels)} voxels)...")
        img = render_voxel_character(voxels, yaw_deg=45.0, pitch_deg=35.264, size=160, supersample=3)

        out_path = os.path.join(OUT_DIR, f"char_{skin_id}.webp")
        img.save(out_path, 'WEBP', quality=95, method=6)

        with open(out_path, 'rb') as f:
            b64_data = base64.b64encode(f.read()).decode('utf-8')
        base64_entries[skin_id] = f"data:image/webp;base64,{b64_data}"

    # Generate TypeScript file with embedded base64 URLs
    ts_content = "// Auto-generated by scripts/render_character_thumbnails.py\n"
    ts_content += "// Authentic 3D isometric voxel renders of in-game skins\n\n"
    ts_content += "export const GACHA_CHARACTER_SKIN_BASE64: Record<string, string> = {\n"
    for skin_id in SKIN_IDS:
        ts_content += f"  {skin_id}: '{base64_entries[skin_id]}',\n"
    ts_content += "};\n"

    with open(TS_OUT_FILE, 'w', encoding='utf-8') as f:
        f.write(ts_content)

    print(f"Successfully generated 5 character thumbnails and {TS_OUT_FILE}!")


if __name__ == '__main__':
    main()
