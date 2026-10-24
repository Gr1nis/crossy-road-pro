import json
import math
import os
import re
from PIL import Image, ImageDraw

ROOT = os.getcwd()
cafe_ts_path = os.path.join(ROOT, 'src/view/townhouse/cafe.ts')

with open(cafe_ts_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Extract PALETTE_FOREST
pal_match = re.search(r'const CAFE_PALETTE_FOREST: readonly number\[\] = \[([\s\S]*?)\];', content)
palette = []
if pal_match:
    palette = [int(x, 16) for x in re.findall(r'0x[0-9a-fA-F]+', pal_match.group(1))]

# Extract CAFE_BOXES
boxes_match = re.search(r'const CAFE_BOXES: readonly \[number, number, number, number, number, number, number\]\[\] = \[\s*([\s\S]*?)\];', content)
boxes = []
if boxes_match:
    # Find all arrays [w, h, d, x, y, z, swatch]
    for b in re.findall(r'\[([^\]]+)\]', boxes_match.group(1)):
        parts = [float(p.strip()) for p in b.split(',')]
        if len(parts) == 7:
            boxes.append(parts)

print(f"Loaded {len(boxes)} boxes and {len(palette)} palette entries from cafe.ts")

def render_scene(boxes, palette, cam_pos, cam_target, fov_deg=45, w=1200, h=1000, light_dir=(-0.4, 0.8, 0.5), bg=(15, 23, 42)):
    img = Image.new("RGBA", (w, h), (*bg, 255))
    draw = ImageDraw.Draw(img)

    # Normalize light
    lx, ly, lz = light_dir
    l_len = math.sqrt(lx*lx + ly*ly + lz*lz)
    lx, ly, lz = lx/l_len, ly/l_len, lz/l_len

    # Camera basis
    cx, cy, cz = cam_pos
    tx, ty, tz = cam_target
    fwd = (tx - cx, ty - cy, tz - cz)
    f_len = math.sqrt(fwd[0]**2 + fwd[1]**2 + fwd[2]**2)
    fwd = (fwd[0]/f_len, fwd[1]/f_len, fwd[2]/f_len)

    up = (0, 1, 0)
    # right = fwd x up
    right = (fwd[1]*up[2] - fwd[2]*up[1], fwd[2]*up[0] - fwd[0]*up[2], fwd[0]*up[1] - fwd[1]*up[0])
    r_len = math.sqrt(right[0]**2 + right[1]**2 + right[2]**2)
    right = (right[0]/r_len, right[1]/r_len, right[2]/r_len)

    # real up = right x fwd
    up = (right[1]*fwd[2] - right[2]*fwd[1], right[2]*fwd[0] - right[0]*fwd[2], right[0]*fwd[1] - right[1]*fwd[0])

    fov_rad = math.radians(fov_deg)
    focal = (h / 2.0) / math.tan(fov_rad / 2.0)

    faces = []

    for box in boxes:
        bw, bh, bd, bx, by, bz, swatch_id = box
        hw, hh, hd = bw * 0.5, bh * 0.5, bd * 0.5
        color_int = palette[int(swatch_id)]
        cr = (color_int >> 16) & 0xFF
        cg = (color_int >> 8) & 0xFF
        cb = color_int & 0xFF

        # 6 faces of box: normal, 4 vertices
        # Front (+Z), Back (-Z), Right (+X), Left (-X), Top (+Y), Bottom (-Y)
        face_defs = [
            # Front (+Z)
            ((0, 0, 1), [
                (bx - hw, by - hh, bz + hd),
                (bx + hw, by - hh, bz + hd),
                (bx + hw, by + hh, bz + hd),
                (bx - hw, by + hh, bz + hd)
            ]),
            # Back (-Z)
            ((0, 0, -1), [
                (bx + hw, by - hh, bz - hd),
                (bx - hw, by - hh, bz - hd),
                (bx - hw, by + hh, bz - hd),
                (bx + hw, by + hh, bz - hd)
            ]),
            # Right (+X)
            ((1, 0, 0), [
                (bx + hw, by - hh, bz + hd),
                (bx + hw, by - hh, bz - hd),
                (bx + hw, by + hh, bz - hd),
                (bx + hw, by + hh, bz + hd)
            ]),
            # Left (-X)
            ((-1, 0, 0), [
                (bx - hw, by - hh, bz - hd),
                (bx - hw, by - hh, bz + hd),
                (bx - hw, by + hh, bz + hd),
                (bx - hw, by + hh, bz - hd)
            ]),
            # Top (+Y)
            ((0, 1, 0), [
                (bx - hw, by + hh, bz + hd),
                (bx + hw, by + hh, bz + hd),
                (bx + hw, by + hh, bz - hd),
                (bx - hw, by + hh, bz - hd)
            ]),
            # Bottom (-Y)
            ((0, -1, 0), [
                (bx - hw, by - hh, bz - hd),
                (bx + hw, by - hh, bz - hd),
                (bx + hw, by - hh, bz + hd),
                (bx - hw, by - hh, bz + hd)
            ])
        ]

        for normal, verts in face_defs:
            # Face center
            fcx = sum(v[0] for v in verts) / 4.0
            fcy = sum(v[1] for v in verts) / 4.0
            fcz = sum(v[2] for v in verts) / 4.0

            # Vector from cam to face center
            v_cam = (fcx - cx, fcy - cy, fcz - cz)
            # Dot with normal for backface culling
            dot_view = normal[0]*v_cam[0] + normal[1]*v_cam[1] + normal[2]*v_cam[2]
            if dot_view >= 0:
                continue # facing away

            # Project depth along forward
            depth = v_cam[0]*fwd[0] + v_cam[1]*fwd[1] + v_cam[2]*fwd[2]
            if depth <= 0.1:
                continue

            # Lighting
            dot_light = normal[0]*lx + normal[1]*ly + normal[2]*lz
            shade = 0.50 + 0.50 * max(0.0, dot_light)
            sr = int(min(255, cr * shade))
            sg = int(min(255, cg * shade))
            sb = int(min(255, cb * shade))

            # Project 4 vertices
            poly2d = []
            for vx, vy, vz in verts:
                dx, dy, dz = vx - cx, vy - cy, vz - cz
                x_cam = dx*right[0] + dy*right[1] + dz*right[2]
                y_cam = dx*up[0] + dy*up[1] + dz*up[2]
                z_cam = dx*fwd[0] + dy*fwd[1] + dz*fwd[2]
                if z_cam <= 0.1:
                    break
                px = w / 2.0 + (x_cam / z_cam) * focal
                py = h / 2.0 - (y_cam / z_cam) * focal
                poly2d.append((px, py))

            if len(poly2d) == 4:
                faces.append((depth, poly2d, (sr, sg, sb)))

    # Painter's sort: farthest first
    faces.sort(key=lambda f: f[0], reverse=True)

    for depth, poly, color in faces:
        draw.polygon(poly, fill=color)

    return img

brain_dir = '/Users/egorbelogubec/.gemini/antigravity/brain/c4c57069-d105-4cca-bf1f-b4e3ff560ae1'

# 1. Front View (Looking at +Z facade from +Z, looking towards (0, 1.8, 0))
img_front = render_scene(boxes, palette, cam_pos=(0, 1.8, 5.0), cam_target=(0, 1.8, 0), fov_deg=45)
img_front.save(os.path.join(brain_dir, 'game_cafe_front.png'))
print("Saved game_cafe_front.png")

# 2. Isometric Hero View (Front-Right angle matching game model-viewer camera)
# Looking from (-3.5, 3.2, 4.0) towards (0, 1.8, 0)
img_iso = render_scene(boxes, palette, cam_pos=(-3.6, 3.2, 3.8), cam_target=(0, 1.8, 0), fov_deg=45)
img_iso.save(os.path.join(brain_dir, 'game_cafe_iso.png'))
print("Saved game_cafe_iso.png")

# 3. Side View (Facing the side with dormers and hanging coffee cup sign)
img_side = render_scene(boxes, palette, cam_pos=(-5.0, 2.0, 0), cam_target=(0, 1.8, 0), fov_deg=45)
img_side.save(os.path.join(brain_dir, 'game_cafe_side.png'))
print("Saved game_cafe_side.png")
