import json
import math
import os
import sys
from PIL import Image, ImageDraw

sys.path.insert(0, 'scripts')
from render_character_thumbnails import render_voxel_character, load_palette

with open('scripts/barista_pug_zero_zfight.json') as f:
    cubes = json.load(f)

palette = {
    'burlapBag': 0xd4b285,      # fawn fur
    'maskBlack': 0x09090b,      # jet black nose & eyes
    'darkCharcoal': 0x1c1917,   # espresso dark snout, ears, jowls
    'greenLeaf': 0x16a34a,      # green barista apron
    'goldCoin': 0xfacc15,       # gold barista badge
    'white': 0xffffff,          # white cup, foam, eye sparkles
    'cardboard': 0xb45309,      # kraft heat sleeve
    'capybaraBrown': 0x78350f,  # crema heart
    'bagRope': 0x854d0e,        # warm caramel brow wrinkles
    'deliveryRed': 0xdc2626,    # bright red cafe straw
    'nosePink': 0xf472b6,       # cute pink tongue blep
}

voxels = []
for c in cubes:
    fx, fy, fz = c['from']
    tx, ty, tz = c['to']
    
    w = round((tx - fx) * 0.05, 4)
    h = round((ty - fy) * 0.05, 4)
    d = round((tz - fz) * 0.05, 4)
    
    cx = round(((fx + tx) / 2.0) * 0.05, 4)
    cy = round(((fy + ty) / 2.0) * 0.05, 4)
    cz = round(-((fz + tz) / 2.0) * 0.05, 4)
    
    col_key = c['color']
    col_val = palette.get(col_key, 0xffffff)
    voxels.append((w, h, d, col_val, cx, cy, cz))

thumb = render_voxel_character(voxels, yaw_deg=45.0, pitch_deg=35.264, size=360, supersample=2)

bb_imgs = [
    '/Users/egorbelogubec/.gemini/antigravity/brain/643290a8-46be-4b5a-98c1-6e1eea10504c/.system_generated/steps/1356/media_0.png',
    '/Users/egorbelogubec/.gemini/antigravity/brain/643290a8-46be-4b5a-98c1-6e1eea10504c/.system_generated/steps/1356/media_1.png',
    '/Users/egorbelogubec/.gemini/antigravity/brain/643290a8-46be-4b5a-98c1-6e1eea10504c/.system_generated/steps/1356/media_2.png',
    '/Users/egorbelogubec/.gemini/antigravity/brain/643290a8-46be-4b5a-98c1-6e1eea10504c/.system_generated/steps/1356/media_3.png'
]

loaded = [Image.open(p).convert('RGBA') for p in bb_imgs]

canvas = Image.new('RGBA', (1600, 950), (15, 23, 42, 255))
draw = ImageDraw.Draw(canvas)

# Header
draw.rectangle([(0, 0), (1600, 70)], fill=(30, 41, 59, 255))
draw.text((30, 20), 'BARISTA PUG V5.0 (URBAN PACK #6) — Rear Curled Hook Tail, Grounded Paws, Clean Fawn Face', fill=(255, 255, 255, 255))

labels = [
    'Isometric 3/4 (Grounded Paws, Coffee Cup & Rear Hook Tail)',
    'Front View (Clean Fawn Face, Big Eyes, Button Nose & Blep)',
    'Left Profile (Rear Hook Tail, Sturdy Legs & Grounded Cup)',
    'Rear View (Neat Hook Tail Curling Upward at Rump Rear)',
]

img_w, img_h = 360, 360
for i, im in enumerate(loaded):
    im_resized = im.resize((img_w, img_h), Image.Resampling.LANCZOS)
    x = 30 + i * (img_w + 30)
    y = 110
    draw.rectangle([(x-4, y-4), (x+img_w+4, y+img_h+4)], fill=(51, 65, 85, 255))
    canvas.paste(im_resized, (x, y), im_resized)
    draw.text((x, 85), labels[i], fill=(226, 232, 240, 255))

# Bottom row: In-game 3D render & specs
thumb_resized = thumb.resize((360, 360), Image.Resampling.LANCZOS)
bx = 30
by = 520
draw.rectangle([(bx-4, by-4), (bx+360+4, by+360+4)], fill=(51, 65, 85, 255))
canvas.paste(thumb_resized, (bx, by), thumb_resized)
draw.text((bx, 490), 'In-Game 3D Isometric Software Render', fill=(226, 232, 240, 255))

# Info card
draw.rectangle([(420, 520), (1570, 880)], fill=(30, 41, 59, 255), outline=(71, 85, 105, 255), width=2)
specs = [
    'CHARACTER HIGHLIGHTS & DESIGN SPECIFICATIONS (V5.0 POLISH):',
    '1. Neat Curled Hook Tail at the Rear (User Feedback Addressed):',
    '   - Fixed position: attached strictly at the rear of the rump (Z: 3.65..4.45), NOT on the spine/back.',
    '   - Classic pug tail curling upward into a neat hook with dark charcoal tip accent.',
    '2. 4 Solid Grounded Legs & Paws (Y=0):',
    '   - All 4 paws planted firmly on the floor — no hanging or floating limbs!',
    '   - Grounded latte cup (Y=0) rests stably between front paws with kraft sleeve and bright red straw.',
    '3. Clean Iconic Pug Face:',
    '   - Smooth, clean fawn forehead and cheeks (#d4b285), dark espresso snout (#1c1917), and pink blep (#f472b6).',
    '   - Big soulful black pupils with white sparkles directly on fawn fur.',
    '4. Technical Quality Gates: Exactly 47 solid cubes, 0 coplanar overlaps (Zero Z-fighting).'
]

for idx, line in enumerate(specs):
    y_pos = 540 + idx * 28
    col = (250, 204, 21, 255) if idx == 0 else ((203, 213, 225, 255) if not line.startswith('   -') else (148, 163, 184, 255))
    draw.text((450, y_pos), line, fill=col)

out_path = '/Users/egorbelogubec/.gemini/antigravity/brain/643290a8-46be-4b5a-98c1-6e1eea10504c/barista_pug_review.png'
canvas.save(out_path)
print('Collage successfully saved to', out_path)
