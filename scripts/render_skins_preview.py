#!/usr/bin/env python3
"""Render high-fidelity PC (16:9) and Mobile (9:16) composite previews for Skins Menu."""
import os, numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ICON_DIR = os.path.join(DIR, 'references', 'processed_icons')
PC_OUT, MOB_OUT = os.path.join(ICON_DIR, 'verify_skins_menu_pc.png'), os.path.join(ICON_DIR, 'verify_skins_menu_mobile.png')

SKINS = [
    {'id': 'corgi', 'name': 'Весёлый Корги', 'rarity': 'Обычный', 'col': (148, 163, 184), 'st': 'active'},
    {'id': 'pigeon_pizza', 'name': 'Пицца-Голубь', 'rarity': 'Обычный', 'col': (148, 163, 184), 'st': 'select'},
    {'id': 'box_cat', 'name': 'Кот в коробке', 'rarity': 'Редкий', 'col': (56, 189, 248), 'st': 'select'},
    {'id': 'raccoon_bandit', 'name': 'Енот-воришка', 'rarity': 'Эпический', 'col': (192, 132, 252), 'st': 'locked'},
    {'id': 'capybara_zen', 'name': 'Дзен-Капибара', 'rarity': 'Легендарный', 'col': (251, 191, 36), 'st': 'locked'},
]

def get_font(sz: int, bold: bool = True):
    for f in ['/System/Library/Fonts/Supplemental/Arial Bold.ttf' if bold else '/System/Library/Fonts/Supplemental/Arial.ttf',
              '/System/Library/Fonts/Helvetica.ttc']:
        if os.path.exists(f):
            try: return ImageFont.truetype(f, sz)
            except Exception: pass
    return ImageFont.load_default()

def load_img(name: str) -> Image.Image:
    return Image.open(os.path.join(ICON_DIR, name)).convert('RGBA')

def make_bg(w: int, h: int) -> Image.Image:
    y = np.linspace(0, 1, h, dtype=np.float32)[:, None, None]
    grad = y * np.array([2, 6, 23], dtype=np.float32) + (1.0 - y) * np.array([11, 17, 32], dtype=np.float32)
    noise = np.random.normal(0, 1.8, (h, w, 3)).astype(np.float32)
    return Image.fromarray(np.clip(grad + noise, 0, 255).astype(np.uint8), 'RGB').convert('RGBA')

def make_sil(char_img: Image.Image, col: tuple) -> Image.Image:
    arr = np.array(char_img)
    alpha = arr[:, :, 3]
    sil_arr = arr.copy()
    sil_arr[:, :, :3] = 10
    sil = Image.fromarray(sil_arr, 'RGBA')
    h, w = arr.shape[:2]
    glow_arr = np.zeros((h + 20, w + 20, 4), dtype=np.uint8)
    glow_arr[10:h + 10, 10:w + 10, :3] = col
    glow_arr[10:h + 10, 10:w + 10, 3] = (alpha * 0.95).astype(np.uint8)
    glow = Image.fromarray(glow_arr, 'RGBA').filter(ImageFilter.GaussianBlur(6))
    comp = Image.new('RGBA', (w + 20, h + 20), (0, 0, 0, 0))
    comp.alpha_composite(glow)
    comp.alpha_composite(sil, (10, 10))
    return comp

def draw_modal_box(img: Image.Image, x: int, y: int, w: int, h: int, rad: int = 26):
    glow = Image.new('RGBA', img.size, (0, 0, 0, 0))
    ImageDraw.Draw(glow).rounded_rectangle([x - 5, y - 5, x + w + 5, y + h + 5], radius=rad + 4, fill=(245, 158, 11, 105))
    img.alpha_composite(glow.filter(ImageFilter.GaussianBlur(16)))
    card = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    cd = ImageDraw.Draw(card)
    cd.rounded_rectangle([0, 0, w - 1, h - 1], radius=rad, fill=(20, 31, 53, 248), outline=(245, 158, 11, 255), width=3)
    img.alpha_composite(card, (x, y))

def draw_topbar(img: Image.Image, mx: int, my: int, mw: int, a: dict, is_mob: bool):
    d = ImageDraw.Draw(img)
    cw, ch = (112, 32) if is_mob else (134, 36)
    cx, cy = mx + (14 if is_mob else 24), my + (14 if is_mob else 18)
    d.rounded_rectangle([cx, cy, cx + cw, cy + ch], radius=ch // 2, fill=(20, 31, 53, 240), outline=(245, 158, 11, 255), width=2)
    coin = a['coin'].resize((ch - 12, ch - 12), Image.Resampling.LANCZOS)
    img.alpha_composite(coin, (cx + 8, cy + 6))
    d.text((cx + 34, cy + ch // 2 - 1), "1 250", font=get_font(13 if is_mob else 15), fill=(250, 204, 21), anchor='lm')
    d.text((cx + cw - 10, cy + ch // 2), "COINS", font=get_font(8 if is_mob else 9), fill=(253, 230, 138), anchor='rm')
    bx, by, bw = mx + mw - (44 if is_mob else 78), my + (12 if is_mob else 16), (34 if is_mob else 40)
    img.alpha_composite(a['close'].resize((bw, bw), Image.Resampling.LANCZOS), (bx, by))
    if not is_mob:
        d.rounded_rectangle([bx + bw + 6, by + 10, bx + bw + 40, by + 28], radius=5, fill=(15, 23, 42, 200), outline=(255, 255, 255, 40))
        d.text((bx + bw + 23, by + 19), "[ESC]", font=get_font(9), fill=(148, 163, 184), anchor='mm')
    th = 72 if is_mob else 92
    tw = int(th * (a['title'].width / a['title'].height))
    tx, ty = mx + (mw - tw) // 2, my - (36 if is_mob else 46)
    t_glow = Image.new('RGBA', (tw + 20, th + 20), (0, 0, 0, 0))
    ImageDraw.Draw(t_glow).ellipse([10, 10, tw + 10, th + 10], fill=(245, 158, 11, 90))
    img.alpha_composite(t_glow.filter(ImageFilter.GaussianBlur(10)), (tx - 10, ty - 5))
    img.alpha_composite(a['title'].resize((tw, th), Image.Resampling.LANCZOS), (tx, ty))

def draw_card(img: Image.Image, x: int, y: int, w: int, h: int, s: dict, a: dict):
    act, lck = (s['st'] == 'active'), (s['st'] == 'locked')
    border_col = (74, 222, 128) if act else s['col']
    c_glow = Image.new('RGBA', img.size, (0, 0, 0, 0))
    ImageDraw.Draw(c_glow).rounded_rectangle([x - 2, y - 2, x + w + 2, y + h + 2], radius=18, fill=(74, 222, 128, 90) if act else (*s['col'], 45))
    img.alpha_composite(c_glow.filter(ImageFilter.GaussianBlur(8)))
    card = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    cd = ImageDraw.Draw(card)
    cd.rounded_rectangle([0, 0, w - 1, h - 1], radius=16, fill=(15, 23, 42, 235), outline=border_col, width=3 if act else 2)
    pw, ph = int(w * 0.65), 18
    px, py = (w - pw) // 2, 10
    cd.rounded_rectangle([px, py, px + pw, py + ph], radius=ph // 2, fill=s['col'])
    cd.text((w // 2, py + ph // 2), s['rarity'].upper(), font=get_font(8), fill=(255, 255, 255), anchor='mm')
    cd.text((w // 2, int(h * 0.68)), s['name'] if not lck else f"??? [{s['rarity'].upper()}]",
            font=get_font(8 if w < 120 else 10), fill=(248, 250, 252) if not lck else (148, 163, 184), anchor='mm')
    img.alpha_composite(card, (x, y))
    char_raw, psz = a[f"char_{s['id']}"], int(w * 0.7)
    char_img = char_raw.resize((psz, psz), Image.Resampling.LANCZOS)
    cx, cy = x + (w - psz) // 2, y + int(h * 0.17)
    img.alpha_composite(make_sil(char_img, s['col']) if lck else char_img, (cx - 10, cy - 10) if lck else (cx, cy))
    bw, bh = 110, 42
    bx = x + (w - bw) // 2
    by = y + h - bh - 10
    btn_img = a['btn_green'] if act else (a['btn_gold'] if not lck else None)
    d = ImageDraw.Draw(img)
    if btn_img:
        img.alpha_composite(btn_img.resize((bw, bh), Image.Resampling.LANCZOS), (bx, by))
        d.text((bx + bw // 2, by + bh // 2 - 4), "ВЫБРАН" if act else "ВЫБРАТЬ", font=get_font(10), fill=(255, 255, 255), anchor='mm')
    else:
        d.rounded_rectangle([bx, by, bx + bw, by + bh], radius=8, fill=(30, 41, 59, 240), outline=(245, 158, 11, 140))
        img.alpha_composite(a['lock'].resize((11, 14), Image.Resampling.LANCZOS), (bx + 8, by + (bh - 14) // 2))
        d.text((bx + bw // 2 + 7, by + bh // 2), "В АВТОМАТЕ", font=get_font(9), fill=(253, 230, 138), anchor='mm')

def draw_tabs(img: Image.Image, mx: int, my: int, mw: int, active_tab: str = 'characters'):
    d = ImageDraw.Draw(img)
    tabs = [('characters', 'ПЕРСОНАЖИ'), ('worlds', 'МИРЫ')]
    tw, th, gap = 140, 30, 12
    tx0 = mx + (mw - (len(tabs) * tw + (len(tabs) - 1) * gap)) // 2
    ty = my + 52
    for i, (tid, label) in enumerate(tabs):
        tx = tx0 + i * (tw + gap)
        is_act = (tid == active_tab)
        bg = (245, 158, 11, 230) if is_act else (15, 23, 42, 200)
        border = (245, 158, 11, 255) if is_act else (148, 163, 184, 90)
        d.rounded_rectangle([tx, ty, tx + tw, ty + th], radius=15, fill=bg, outline=border, width=2)
        d.text((tx + tw // 2, ty + th // 2), label, font=get_font(10), fill=(255, 255, 255) if is_act else (148, 163, 184), anchor='mm')

def render_previews():
    a = {'title': load_img('skins_title.webp'), 'close': load_img('skins_close_btn.webp'),
         'btn_green': load_img('skins_btn_green.webp'), 'btn_gold': load_img('skins_btn_gold.webp'),
         'lock': load_img('skins_lock.webp'), 'coin': load_img('coin.webp')}
    for s in SKINS: a[f"char_{s['id']}"] = load_img(f"char_{s['id']}.webp")
    # PC Preview
    pc = make_bg(1280, 720)
    mw, mh, mx, my = 860, 420, 210, 150
    draw_modal_box(pc, mx, my, mw, mh, rad=28)
    draw_topbar(pc, mx, my, mw, a, is_mob=False)
    draw_tabs(pc, mx, my, mw, 'characters')
    cw, ch, gap = 146, 246, 15
    gx0 = mx + (mw - (5 * cw + 4 * gap)) // 2
    for i, s in enumerate(SKINS): draw_card(pc, gx0 + i * (cw + gap), my + 84, cw, ch, s, a)
    ImageDraw.Draw(pc).text((mx + mw // 2, my + mh - 26), "[A] / [D]  ВЫБОР   •   [ENTER]  ВЫБРАТЬ", font=get_font(11), fill=(250, 204, 21), anchor='mm')
    pc.save(PC_OUT, 'PNG')

    # Mobile Preview
    mob = make_bg(720, 1280)
    mmw, mmh, mmx, mmy = 640, 780, 40, 250
    draw_modal_box(mob, mmx, mmy, mmw, mmh, rad=24)
    draw_topbar(mob, mmx, mmy, mmw, a, is_mob=True)
    draw_tabs(mob, mmx, mmy, mmw, 'characters')
    mcw, mch, mgap = 114, 238, 8
    mgx0 = mmx + (mmw - (5 * mcw + 4 * mgap)) // 2
    for i, s in enumerate(SKINS): draw_card(mob, mgx0 + i * (mcw + mgap), mmy + 88, mcw, mch, s, a)
    md = ImageDraw.Draw(mob)
    bx, by, bw, bh = mmx + 20, mmy + 348, mmw - 40, 280
    md.rounded_rectangle([bx, by, bx + bw, by + bh], radius=18, fill=(15, 23, 42, 220), outline=(74, 222, 128, 200), width=2)
    md.text((bx + bw // 2, by + 22), "ВЫБРАННЫЙ ПЕРСОНАЖ", font=get_font(11), fill=(74, 222, 128), anchor='mm')
    mob.alpha_composite(a['char_corgi'].resize((125, 125), Image.Resampling.LANCZOS), (bx + (bw - 125) // 2, by + 46))
    md.text((bx + bw // 2, by + 190), "ВЕСЁЛЫЙ КОРГИ", font=get_font(18), fill=(255, 255, 255), anchor='mm')
    md.rounded_rectangle([bx + bw // 2 - 45, by + 210, bx + bw // 2 + 45, by + 230], radius=10, fill=(148, 163, 184))
    md.text((bx + bw // 2, by + 220), "ОБЫЧНЫЙ", font=get_font(9), fill=(255, 255, 255), anchor='mm')
    md.text((bx + bw // 2, by + 252), "•  ГОТОВ К ЗАБЕГУ", font=get_font(12), fill=(74, 222, 128), anchor='mm')
    gbw, gbh = 340, 48
    gbx, gby = mmx + (mmw - gbw) // 2, mmy + 680
    md.rounded_rectangle([gbx, gby, gbx + gbw, gby + gbh], radius=12, fill=(245, 158, 11), outline=(254, 240, 138), width=2)
    mob.alpha_composite(a['coin'].resize((20, 20), Image.Resampling.LANCZOS), (gbx + gbw - 50, gby + 14))
    md.text((gbx + gbw // 2 - 12, gby + gbh // 2), "ПРИЗОВОЙ АВТОМАТ  •  100", font=get_font(13), fill=(255, 255, 255), anchor='mm')
    mob.save(MOB_OUT, 'PNG')
    print(f"Generated:\n - {PC_OUT} ({pc.size})\n - {MOB_OUT} ({mob.size})")

if __name__ == '__main__':
    render_previews()
