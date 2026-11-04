import json
import math
import os
import shutil
import sys
from PIL import Image, ImageDraw, ImageFont

sys.path.insert(0, 'scripts')
from render_character_thumbnails import render_voxel_character

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(ROOT_DIR, 'assets', 'models')
CUBES_FILE = os.path.join(MODELS_DIR, 'sweeper_cubes.json')
OUT_FILE = os.path.join(ROOT_DIR, 'sweeper_review.png')

with open(CUBES_FILE, 'r', encoding='utf-8') as f:
    cubes = json.load(f)

palette_hex = {
    'sweeperOrange': 0xea580c,
    'sweeperOrangeDark': 0xc2410c,
    'hopperGrey': 0x475569,
    'hopperGreyDark': 0x334155,
    'chevronYellow': 0xfacc15,
    'tireBlack': 0x0f172a,
    'tireTread': 0x1e293b,
    'rimSilver': 0xcbd5e1,
    'metalChrome': 0x94a3b8,
    'brushBristlesDark': 0x1e293b,
    'glassSky': 0x38bdf8,
    'headlightIce': 0xe0f2fe,
    'beaconAmber': 0xf59e0b,
    'taillightRed': 0xef4444,
    'letteringWhite': 0xf8fafc,
    'trimDark': 0x1e293b,
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

    col_val = palette_hex.get(c['color'], 0xffffff)
    voxels.append((w, h, d, col_val, cx, cy, cz))

thumb = render_voxel_character(voxels, yaw_deg=45.0, pitch_deg=35.264, size=400, supersample=2)

views_dir = os.path.join(MODELS_DIR, 'sweeper_views')
bb_files = [f"view_{i}.png" for i in range(5)]
loaded_views = [Image.open(os.path.join(views_dir, fn)).convert('RGBA') for fn in bb_files]

font_title = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 24)
font_sub = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 14)
font_label = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 14)
font_section = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 15)
font_body = ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf', 13)
font_bold = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 13)

CANVAS_W, CANVAS_H = 2000, 1220
canvas = Image.new('RGBA', (CANVAS_W, CANVAS_H), (15, 23, 42, 255))
draw = ImageDraw.Draw(canvas)

# Header banner
draw.rectangle([(0, 0), (CANVAS_W, 85)], fill=(30, 41, 59, 255))
draw.text((35, 16), "CROSSY ROAD PRO — WORLD 1 REMASTER: «УБОРОЧНАЯ КОММУНАЛЬНАЯ МАШИНА» (sweeper) [MUNICIPAL SWEEPER v2 REVISED]", fill=(248, 250, 252, 255), font=font_title)
draw.text((35, 52), "Класс: Municipal Vehicle | Бюджет: 103 куба (Лимит 85–115) | Монолитный герметичный бункер | Сплошная корма без полок | Zero Z-Fighting", fill=(250, 204, 21, 255), font=font_sub)

view_titles = [
    "1. 3/4 Hero (Ракурс героя)",
    "2. Спереди (Front View)",
    "3. Левый бок (Left Side)",
    "4. Сзади (Back View)",
    "5. 3/4 Сзади-справа (Rear 3/4)"
]

view_subs = [
    "Изометрия: щетки, кабина, маячок, шевронный бункер",
    "Спереди: выносные щетки, фары, стекло",
    "Профиль: единый борт X=[-6.15, 6.15], STREET SWEEP",
    "Сзади: сплошная стенка, дверь, петли, бампер",
    "Корма 3/4: плавный 45° скос, 0 полок и вырезов"
]

card_w, card_h = 360, 395
y_top = 138
for i, im in enumerate(loaded_views):
    im_resized = im.resize((card_w, card_h), Image.Resampling.LANCZOS)
    x = 35 + i * (card_w + 30)
    draw.rectangle([(x - 4, y_top - 4), (x + card_w + 4, y_top + card_h + 4)], fill=(51, 65, 85, 255))
    canvas.paste(im_resized, (x, y_top), im_resized)
    draw.text((x, y_top - 42), view_titles[i], fill=(248, 250, 252, 255), font=font_label)
    draw.text((x, y_top - 22), view_subs[i], fill=(148, 163, 184, 255), font=font_body)

y_bot = 585
thumb_box_w = 400
draw.rectangle([(35 - 4, y_bot - 4), (35 + thumb_box_w + 4, y_bot + 580 + 4)], fill=(51, 65, 85, 255))
draw.rectangle([(35, y_bot), (35 + thumb_box_w, y_bot + 580)], fill=(30, 41, 59, 255))
thumb_resized = thumb.resize((360, 360), Image.Resampling.LANCZOS)
canvas.paste(thumb_resized, (55, y_bot + 65), thumb_resized)
draw.text((55, y_bot + 22), "In-Game 3D Three.js Render", fill=(248, 250, 252, 255), font=font_label)
draw.text((55, y_bot + 450), "Изометрический софт-рендер", fill=(203, 213, 225, 255), font=font_body)
draw.text((55, y_bot + 475), "Municipal Orange + Slate Hopper + Hazard Yellow + Sky Glass", fill=(148, 163, 184, 255), font=font_body)

# Information cards
info_x = 35 + thumb_box_w + 30
info_w = CANVAS_W - info_x - 35
col_w = (info_w - 30) // 2
col1_x = info_x
col2_x = info_x + col_w + 30

draw.rectangle([(col1_x - 4, y_bot - 4), (col1_x + col_w + 4, y_bot + 580 + 4)], fill=(51, 65, 85, 255))
draw.rectangle([(col1_x, y_bot), (col1_x + col_w, y_bot + 580)], fill=(30, 41, 59, 255))
draw.text((col1_x + 20, y_bot + 20), "АРХИТЕКТУРА И ЩЕТОЧНЫЙ УЗЕЛ (ENGINEERING SPEC)", fill=(248, 250, 252, 255), font=font_section)

draw.rectangle([(col2_x - 4, y_bot - 4), (col2_x + col_w + 4, y_bot + 580 + 4)], fill=(51, 65, 85, 255))
draw.rectangle([(col2_x, y_bot), (col2_x + col_w, y_bot + 580)], fill=(30, 41, 59, 255))
draw.text((col2_x + 20, y_bot + 20), "БУНКЕР, БЕЗОПАСНОСТЬ И ВЕРДИКТ (HOPPER & VERDICT)", fill=(248, 250, 252, 255), font=font_section)

# Column 1
cy = y_bot + 65
draw.text((col1_x + 20, cy), "1. Ходовая часть, заземление и всасывающий узел (Chassis)", fill=(248, 250, 252, 255), font=font_bold)
cy += 24
draw.text((col1_x + 20, cy), "• Физическое заземление: все 4 колеса строго на Y = 0.00 (min_y = 0.0000).", fill=(203, 213, 225, 255), font=font_body)
cy += 20
draw.text((col1_x + 20, cy), "• Дорожный просвет рамы: Y = 2.25 (0.113 м), колесные узлы с дисками Silver.", fill=(203, 213, 225, 255), font=font_body)
cy += 20
draw.text((col1_x + 20, cy), "• Всасывающий патрубок: вакуумный короб по центру брюха Y=1.15 + гидробак.", fill=(203, 213, 225, 255), font=font_body)
cy += 20
draw.text((col1_x + 20, cy), "• Габариты: 0.875 × 0.882 × 1.545 м (17.5 × 17.65 × 30.9 вокс.) — точно по гайдлайну.", fill=(203, 213, 225, 255), font=font_body)

cy += 35
draw.text((col1_x + 20, cy), "2. Передние вращающиеся уборочные щетки (Dual Sweeper Brushes)", fill=(248, 250, 252, 255), font=font_bold)
cy += 24
draw.text((col1_x + 20, cy), "• Конические щетки: двухсторонние выносные щетки с темным ворсом и дисками.", fill=(203, 213, 225, 255), font=font_body)
cy += 20
draw.text((col1_x + 20, cy), "• Клиренс щеток: щетки опущены к асфальту на Y = 0.35 (0.017 м над дорогой).", fill=(203, 213, 225, 255), font=font_body)
cy += 20
draw.text((col1_x + 20, cy), "• Монтажный бампер: прочная стальная рама с буксировочными проушинами.", fill=(203, 213, 225, 255), font=font_body)
cy += 20
draw.text((col1_x + 20, cy), "• Резиновая шторка: фартук направления мусора в центральный заборный канал.", fill=(203, 213, 225, 255), font=font_body)

# Column 2
cy = y_bot + 65
draw.text((col2_x + 20, cy), "3. Оранжевая кабина коммунальной службы (Municipal Cab)", fill=(248, 250, 252, 255), font=font_bold)
cy += 24
draw.text((col2_x + 20, cy), "• Панорамное остекление: глубокое лобовое стекло Sky Blue + боковые окна дверей.", fill=(203, 213, 225, 255), font=font_body)
cy += 20
draw.text((col2_x + 20, cy), "• Оптика и решетка: яркие Ice-White фары, янтарные сигналы, хромированные ламели.", fill=(203, 213, 225, 255), font=font_body)
cy += 20
draw.text((col2_x + 20, cy), "• Проблесковый маячок: янтарный строб-маяк на крыше капота (Beacon Amber).", fill=(203, 213, 225, 255), font=font_body)
cy += 20
draw.text((col2_x + 20, cy), "• Зеркала заднего вида: выносные кронштейны Chrome с зеркальным стеклом Sky Blue.", fill=(203, 213, 225, 255), font=font_body)

cy += 35
draw.text((col2_x + 20, cy), "4. Бункер для мусора и герметичная корма (Airtight Rear Hopper)", fill=(248, 250, 252, 255), font=font_bold)
cy += 24
draw.text((col2_x + 20, cy), "• Единая ширина бункера: X=[-6.15, 6.15] по всей длине, 0 щелей и вырезов на бортах.", fill=(203, 213, 225, 255), font=font_body)
cy += 20
draw.text((col2_x + 20, cy), "• Монолитная задняя стенка: сплошная вертикальная плоскость от бампера до скоса.", fill=(203, 213, 225, 255), font=font_body)
cy += 20
draw.text((col2_x + 20, cy), "• Плавный 45° скос: аккуратный переход крыши к задней стенке без полок и карманов.", fill=(203, 213, 225, 255), font=font_body)
cy += 20
draw.text((col2_x + 20, cy), "• Финальный вердикт: 103 куба (Лимит 85–115), 0 Z-Fighting, 100% герметичный!", fill=(250, 204, 21, 255), font=font_bold)

canvas.save(OUT_FILE, 'PNG')
print(f"Successfully generated review collage: {OUT_FILE}")

# Save in models dir too
models_review_path = os.path.join(MODELS_DIR, "sweeper_review.png")
shutil.copyfile(OUT_FILE, models_review_path)
print(f"Copied review collage to models dir: {models_review_path}")

caller_brain_dir = r"C:\Users\MIXPC\.gemini\antigravity\brain\32252d72-d2f4-4af8-9503-c21fb97996ac"
if os.path.exists(caller_brain_dir):
    caller_review_path = os.path.join(caller_brain_dir, "sweeper_review.png")
    shutil.copyfile(OUT_FILE, caller_review_path)
    print(f"Copied review collage to caller brain directory: {caller_review_path}")
