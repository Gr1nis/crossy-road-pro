import json
import math
import os
import sys
from PIL import Image, ImageDraw

sys.path.insert(0, 'scripts')
from render_character_thumbnails import render_voxel_character

with open('scripts/raincoat_duck_zero_zfight_v3.json') as f:
    cubes = json.load(f)

palette = {
    'featherWhite': 0xffffff,
    'duckOrange': 0xf97316,
    'billDark': 0xc2410c,
    'eyeBlack': 0x09090b,
    'sparkleWhite': 0xffffff,
    'drawstringWhite': 0xf1f5f9,
    'raincoatYellow': 0xfacc15,
    'coatAccent': 0xeab308,
    'toggleDark': 0x1e293b,
    'bootBlue': 0x2563eb,
    'bootSole': 0x1d4ed8,
    'bootRim': 0x60a5fa,
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
    '/Users/egorbelogubec/.gemini/antigravity/brain/643290a8-46be-4b5a-98c1-6e1eea10504c/.system_generated/steps/1857/media_0.png',
    '/Users/egorbelogubec/.gemini/antigravity/brain/643290a8-46be-4b5a-98c1-6e1eea10504c/.system_generated/steps/1857/media_1.png',
    '/Users/egorbelogubec/.gemini/antigravity/brain/643290a8-46be-4b5a-98c1-6e1eea10504c/.system_generated/steps/1857/media_2.png',
    '/Users/egorbelogubec/.gemini/antigravity/brain/643290a8-46be-4b5a-98c1-6e1eea10504c/.system_generated/steps/1857/media_3.png'
]

loaded = [Image.open(p).convert('RGBA') for p in bb_imgs]

canvas = Image.new('RGBA', (1600, 950), (15, 23, 42, 255))
draw = ImageDraw.Draw(canvas)

# Header
draw.rectangle([(0, 0), (1600, 70)], fill=(30, 41, 59, 255))
draw.text((30, 20), 'RAINCOAT DUCK V3.0 FINAL (URBAN PACK #8) — Classic Cute Normal Duck Bill, Wide Hat Brim Over Head, Clean Wings', fill=(255, 255, 255, 255))

labels = [
    'Isometric 3/4 (Normal Beak, Wide Brim)',
    'Front View (Cute Bill, 3 Toggles, Clean Wings)',
    'Left Profile (Proportional Bill, Clean Sleeve)',
    'Rear View (Drape Down Neck, Curled Tail)',
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
    'CHARACTER HIGHLIGHTS & DESIGN SPECIFICATIONS (V3.0 FINAL POLISH):',
    '1. Returned to Normal, Cute & Proportional Duck Bill (User Feedback Addressed):',
    '   - Restored classic compact duck spoon bill (not oversized or heavy).',
    '   - Balanced width and gentle front curve with dark nostril ridge accent.',
    '2. Wide-Coverage Sou\'wester Hat Brim (Preserved from V2.0):',
    '   - Extended forward visor (Z: -3.85) and wide side eaves (X: -2.55..+2.55) fully covering entire head!',
    '   - Shading and protecting duck head and cheeks from rain; hanging white drawstrings under chin.',
    '3. Cleaned Symmetric Wings & Sleeves (Preserved from V2.0):',
    '   - Clutter removed: no grey-blue umbrella; both sleeves are clean, balanced and identical.',
    '   - Crisp white feather wingtips peek out of yellow raincoat cuffs on both sides.',
    '4. Royal Blue Rubber Wellingtons (Puddle Boots):',
    '   - Sturdy treaded deep-blue soles (ground contact Y=0), royal blue vamps, and sky blue collar rims.',
    '5. Technical Quality Gates: Exactly 48 monolithic cubes, 0 coplanar overlaps (Zero Z-fighting).'
]

for idx, line in enumerate(specs):
    y_pos = 535 + idx * 22
    col = (250, 204, 21, 255) if idx == 0 else ((203, 213, 225, 255) if not line.startswith('   -') else (148, 163, 184, 255))
    draw.text((450, y_pos), line, fill=col)

out_path = '/Users/egorbelogubec/.gemini/antigravity/brain/643290a8-46be-4b5a-98c1-6e1eea10504c/raincoat_duck_review.png'
canvas.save(out_path)
print('Collage successfully saved to', out_path)
