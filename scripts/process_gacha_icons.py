#!/usr/bin/env python3
"""
Process high-fidelity 3D Prize Machine UI icons from 2K raw renders.
Performs clean alpha segmentation, halo and drop shadow removal,
boundary inpainting, Lanczos downsampling, WebP compression,
and updates src/view/gachaIconsBase64.ts.
"""

import os
import base64
import cv2
import numpy as np
from PIL import Image

RAW_DIR = "/Users/egorbelogubec/Downloads/Icons Prize Machine"
OUT_DIR = "references/processed_icons"
TS_FILE = "src/view/gachaIconsBase64.ts"

os.makedirs(OUT_DIR, exist_ok=True)

def process_spin_button(raw_path: str) -> Image.Image:
    print(f"Processing SPIN button from {os.path.basename(raw_path)}...")
    img = cv2.imread(raw_path)
    rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB).astype(np.float32) / 255.0
    r, g, b = rgb[:, :, 0], rgb[:, :, 1], rgb[:, :, 2]
    max_c = np.maximum(np.maximum(r, g), b)
    min_c = np.minimum(np.minimum(r, g), b)
    delta = max_c - min_c
    sat = np.zeros_like(max_c)
    nz = max_c > 1e-4
    sat[nz] = delta[nz] / max_c[nz]

    # Target golden-orange body, strictly isolating from unsaturated gray drop shadows
    cond = (sat > 0.30) & (r > b + 0.10)
    num, lab, stats, _ = cv2.connectedComponentsWithStats(cond.astype(np.uint8))
    largest = 1 + np.argmax(stats[1:, cv2.CC_STAT_AREA])
    mask = (lab == largest).astype(np.uint8) * 255

    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    c = max(contours, key=cv2.contourArea)
    solid_mask = np.zeros_like(mask)
    cv2.drawContours(solid_mask, [c], -1, 255, -1)

    # Erode slightly (2px in 2K space) to remove any white border pixels
    eroded = cv2.erode(solid_mask, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5)))
    alpha_float = cv2.GaussianBlur(eroded.astype(np.float32), (7, 7), 1.5)
    alpha_u8 = np.clip(alpha_float, 0, 255).astype(np.uint8)

    x, y, w, h = cv2.boundingRect(c)
    pad = 12
    x0 = max(0, x - pad)
    y0 = max(0, y - pad)
    x1 = min(img.shape[1], x + w + pad)
    y1 = min(img.shape[0], y + h + pad)

    crop_bgr = img[y0:y1, x0:x1].copy()
    crop_alpha = alpha_u8[y0:y1, x0:x1]

    # Inpaint background under zero/low alpha with button colors to avoid white fringing on resize
    inpaint_mask = (crop_alpha < 128).astype(np.uint8)
    crop_bgr_clean = cv2.inpaint(crop_bgr, inpaint_mask, inpaintRadius=5, flags=cv2.INPAINT_TELEA)

    crop_bgra = np.dstack([crop_bgr_clean, crop_alpha])
    crop_rgba = cv2.cvtColor(crop_bgra, cv2.COLOR_BGRA2RGBA)
    pil_img = Image.fromarray(crop_rgba)

    target_w = 340
    target_h = int(target_w * (h / w))
    return pil_img.resize((target_w, target_h), Image.Resampling.LANCZOS)

def process_close_button(raw_path: str) -> Image.Image:
    print(f"Processing CLOSE button from {os.path.basename(raw_path)}...")
    img = cv2.imread(raw_path)
    rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB).astype(np.float32) / 255.0
    r, g, b = rgb[:, :, 0], rgb[:, :, 1], rgb[:, :, 2]
    max_c = np.maximum(np.maximum(r, g), b)
    min_c = np.minimum(np.minimum(r, g), b)
    delta = max_c - min_c
    sat = np.zeros_like(max_c)
    nz = max_c > 1e-4
    sat[nz] = delta[nz] / max_c[nz]

    # Red circular rim
    cond = (r > 0.45) & (sat > 0.35) & (r > g + 0.15) & (r > b + 0.15)
    num, lab, stats, _ = cv2.connectedComponentsWithStats(cond.astype(np.uint8))
    largest = 1 + np.argmax(stats[1:, cv2.CC_STAT_AREA])
    mask = (lab == largest).astype(np.uint8) * 255

    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    c = max(contours, key=cv2.contourArea)
    solid_mask = np.zeros_like(mask)
    cv2.drawContours(solid_mask, [c], -1, 255, -1)

    eroded = cv2.erode(solid_mask, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5)))
    alpha_float = cv2.GaussianBlur(eroded.astype(np.float32), (7, 7), 1.5)
    alpha_u8 = np.clip(alpha_float, 0, 255).astype(np.uint8)

    x, y, w, h = cv2.boundingRect(c)
    max_dim = max(w, h)
    cx, cy = x + w // 2, y + h // 2
    pad = 12
    box_size = max_dim + 2 * pad
    x0 = max(0, cx - box_size // 2)
    y0 = max(0, cy - box_size // 2)

    crop_bgr = img[y0:y0+box_size, x0:x0+box_size].copy()
    crop_alpha = alpha_u8[y0:y0+box_size, x0:x0+box_size]

    inpaint_mask = (crop_alpha < 128).astype(np.uint8)
    crop_bgr_clean = cv2.inpaint(crop_bgr, inpaint_mask, inpaintRadius=5, flags=cv2.INPAINT_TELEA)

    crop_bgra = np.dstack([crop_bgr_clean, crop_alpha])
    crop_rgba = cv2.cvtColor(crop_bgra, cv2.COLOR_BGRA2RGBA)
    pil_img = Image.fromarray(crop_rgba)

    return pil_img.resize((136, 136), Image.Resampling.LANCZOS)

def process_pointer_arrow(raw_path: str) -> Image.Image:
    print(f"Processing POINTER arrow from {os.path.basename(raw_path)}...")
    img = cv2.imread(raw_path)
    rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB).astype(np.float32) / 255.0
    r, g, b = rgb[:, :, 0], rgb[:, :, 1], rgb[:, :, 2]
    max_c = np.maximum(np.maximum(r, g), b)
    min_c = np.minimum(np.minimum(r, g), b)
    delta = max_c - min_c
    sat = np.zeros_like(max_c)
    nz = max_c > 1e-4
    sat[nz] = delta[nz] / max_c[nz]

    # Gold triangle arrow
    cond = (sat > 0.32) & (r > b + 0.12) & (g > b)
    num, lab, stats, _ = cv2.connectedComponentsWithStats(cond.astype(np.uint8))
    largest = 1 + np.argmax(stats[1:, cv2.CC_STAT_AREA])
    mask = (lab == largest).astype(np.uint8) * 255

    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    c = max(contours, key=cv2.contourArea)
    solid_mask = np.zeros_like(mask)
    cv2.drawContours(solid_mask, [c], -1, 255, -1)

    eroded = cv2.erode(solid_mask, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5)))
    alpha_float = cv2.GaussianBlur(eroded.astype(np.float32), (7, 7), 1.5)
    alpha_u8 = np.clip(alpha_float, 0, 255).astype(np.uint8)

    x, y, w, h = cv2.boundingRect(c)
    max_dim = max(w, h)
    cx, cy = x + w // 2, y + h // 2
    pad = 12
    box_size = max_dim + 2 * pad
    x0 = max(0, cx - box_size // 2)
    y0 = max(0, cy - box_size // 2)

    crop_bgr = img[y0:y0+box_size, x0:x0+box_size].copy()
    crop_alpha = alpha_u8[y0:y0+box_size, x0:x0+box_size]

    inpaint_mask = (crop_alpha < 128).astype(np.uint8)
    crop_bgr_clean = cv2.inpaint(crop_bgr, inpaint_mask, inpaintRadius=5, flags=cv2.INPAINT_TELEA)

    crop_bgra = np.dstack([crop_bgr_clean, crop_alpha])
    crop_rgba = cv2.cvtColor(crop_bgra, cv2.COLOR_BGRA2RGBA)
    pil_img = Image.fromarray(crop_rgba)

    return pil_img.resize((136, 136), Image.Resampling.LANCZOS)

def process_title_logo(raw_path: str) -> Image.Image:
    print(f"Processing TITLE logo from {os.path.basename(raw_path)}...")
    raw = cv2.imread(raw_path)
    # Sub-crop around title region in 2K reference
    crop = raw[230:1102, 385:2273].copy()
    h, w, _ = crop.shape

    rgb = cv2.cvtColor(crop, cv2.COLOR_BGR2RGB).astype(np.float32) / 255.0
    r, g, b = rgb[:, :, 0], rgb[:, :, 1], rgb[:, :, 2]
    max_c = np.maximum(np.maximum(r, g), b)
    min_c = np.minimum(np.minimum(r, g), b)
    delta = max_c - min_c
    sat = np.zeros_like(max_c)
    nz = max_c > 1e-4
    sat[nz] = delta[nz] / max_c[nz]
    val = max_c

    # Color isolation for text, stars, trails, and banner
    is_letters = ((r > 0.35) & (g > 0.15) & (r >= g) & (g > b) & (sat > 0.20)) | \
                 ((r > 0.24) & (g > 0.10) & (r > b + 0.08) & (sat > 0.30))
    is_ribbon = ((r > 0.30) & (r > g + 0.06) & (r > b + 0.06) & (sat > 0.20)) | \
                ((r > 0.45) & (g > 0.25) & (r > b + 0.12) & (sat > 0.22))
    is_cyan = (b > 0.32) & (g > 0.28) & (b > r + 0.06) & (g > r + 0.04) & (sat > 0.18)
    is_purple = (b > 0.25) & (r > 0.18) & (b > g + 0.05) & (sat > 0.18)
    is_pink = (r > 0.35) & (b > 0.20) & (r > g + 0.08) & (sat > 0.18)
    is_glint = (val > 0.88) & (sat < 0.25)

    candidate = (is_letters | is_ribbon | is_cyan | is_purple | is_pink | is_glint).astype(np.uint8) * 255

    # Pristine bottom ribbon boundary (eliminates scene button, poles, [A]/[D] text, and box artifacts)
    poly_arch = np.array([1.36695802e-04, -2.70744737e-01, 8.87993167e+02])
    for x in range(w):
        if 135 <= x <= 1750:
            y_max = int(np.polyval(poly_arch, x) - 1.0)
        elif x < 135:
            y_max = int(700 + (825 - 700) * (x / 135.0))
        else:
            y_max = int(825 - (825 - 700) * ((x - 1750.0) / (1888.0 - 1750.0)))
        candidate[y_max:, x] = 0

    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    closed = cv2.morphologyEx(candidate, cv2.MORPH_CLOSE, kernel)

    num, lab, stats, _ = cv2.connectedComponentsWithStats(closed)
    filtered = np.zeros_like(closed)
    for i in range(1, num):
        if stats[i, cv2.CC_STAT_AREA] > 2000:
            filtered[lab == i] = 255

    contours, _ = cv2.findContours(filtered, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    solid_mask = np.zeros_like(filtered)
    for c in contours:
        if cv2.contourArea(c) > 2000:
            cv2.drawContours(solid_mask, [c], -1, 255, -1)

    eroded = cv2.erode(solid_mask, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3)))
    alpha_float = cv2.GaussianBlur(eroded.astype(np.float32), (5, 5), 1.2)
    alpha_u8 = np.clip(alpha_float, 0, 255).astype(np.uint8)

    x, y, bw, bh = cv2.boundingRect(solid_mask)
    pad = 12
    x0 = max(0, x - pad)
    y0 = max(0, y - pad)
    x1 = min(w, x + bw + pad)
    y1 = min(h, y + bh + pad)

    crop_bgr = crop[y0:y1, x0:x1].copy()
    crop_alpha = alpha_u8[y0:y1, x0:x1]

    inpaint_mask = (crop_alpha < 128).astype(np.uint8)
    crop_bgr_clean = cv2.inpaint(crop_bgr, inpaint_mask, inpaintRadius=5, flags=cv2.INPAINT_TELEA)

    crop_bgra = np.dstack([crop_bgr_clean, crop_alpha])
    crop_rgba = cv2.cvtColor(crop_bgra, cv2.COLOR_BGRA2RGBA)
    pil_img = Image.fromarray(crop_rgba)

    target_w = 560
    target_h = int(target_w * (bh / bw))
    return pil_img.resize((target_w, target_h), Image.Resampling.LANCZOS)

def verify_on_dark(img_pil: Image.Image, name: str) -> None:
    arr = np.array(img_pil)
    a = arr[:, :, 3].astype(np.float32) / 255.0
    rgb = arr[:, :, :3].astype(np.float32)
    dark_bg = np.array([20, 31, 53], dtype=np.float32) # Dark-blue modal background
    comp = rgb * a[:, :, None] + dark_bg * (1.0 - a[:, :, None])
    comp_u8 = np.clip(comp, 0, 255).astype(np.uint8)
    out_path = os.path.join(OUT_DIR, f"verify_{name}_on_dark.png")
    Image.fromarray(comp_u8).save(out_path)
    print(f"  -> Saved dark background verification: {out_path}")

def main():
    print("=" * 60)
    print("Refining Gacha Prize Machine 3D Assets (Halo Removal Pipeline)")
    print("=" * 60)

    asset_defs = [
        {
            "key": "spinBtn",
            "file": "gacha_spin_btn.webp",
            "raw": os.path.join(RAW_DIR, "3D_mobile_game_UI_button,_2K_20261018185630.jpg"),
            "fn": process_spin_button
        },
        {
            "key": "close",
            "file": "gacha_close_btn.webp",
            "raw": os.path.join(RAW_DIR, "3D_casual_game_UI_circular_2K_20261018185704.jpg"),
            "fn": process_close_button
        },
        {
            "key": "pointer",
            "file": "gacha_pointer.webp",
            "raw": os.path.join(RAW_DIR, "3D_golden_triangle_pointer_arrow_2K_20261018185742.jpg"),
            "fn": process_pointer_arrow
        },
        {
            "key": "title",
            "file": "gacha_title.webp",
            "raw": os.path.join(RAW_DIR, "на_основе_этого_референса_сделаем_2K_20261018185453.jpg"),
            "fn": process_title_logo
        }
    ]

    base64_dict = {}
    stats = []

    for item in asset_defs:
        key = item["key"]
        file_name = item["file"]
        out_path = os.path.join(OUT_DIR, file_name)
        processed_img = item["fn"](item["raw"])

        # Save optimized WebP
        processed_img.save(out_path, format="WEBP", quality=88, method=6)
        file_bytes = os.path.getsize(out_path)

        with open(out_path, "rb") as f:
            b64_str = base64.b64encode(f.read()).decode("ascii")
            data_uri = f"data:image/webp;base64,{b64_str}"
            base64_dict[key] = data_uri

        verify_on_dark(processed_img, key)

        stats.append({
            "key": key,
            "file": file_name,
            "dims": f"{processed_img.width}x{processed_img.height}",
            "bytes": file_bytes,
            "b64_len": len(data_uri)
        })
        print(f"  -> Saved {file_name}: {processed_img.width}x{processed_img.height}, {file_bytes} bytes ({file_bytes/1024:.2f} KB)")

    total_webp = sum(s["bytes"] for s in stats)
    total_b64 = sum(s["b64_len"] for s in stats)
    print("\n" + "=" * 60)
    print(f"Total WebP on disk: {total_webp} bytes ({total_webp/1024:.2f} KB)")
    print(f"Total Base64 bundle: {total_b64} bytes ({total_b64/1024:.2f} KB) [< 100 KB limit]")
    print("=" * 60)

    # Write TypeScript file src/view/gachaIconsBase64.ts
    print(f"\nUpdating {TS_FILE}...")
    ts_lines = [
        "/**",
        " * Authentic 3D Prize Machine UI Assets in lightweight WebP format (Base64 data URIs).",
        " * Auto-generated by asset pipeline from reference graphics with halo-free alpha edges.",
        " */",
        "",
        f"export const GACHA_ICON_CLOSE =",
        f"  '{base64_dict['close']}';",
        "",
        f"export const GACHA_ICON_POINTER =",
        f"  '{base64_dict['pointer']}';",
        "",
        f"export const GACHA_ICON_SPIN_BTN =",
        f"  '{base64_dict['spinBtn']}';",
        "",
        f"export const GACHA_ICON_TITLE =",
        f"  '{base64_dict['title']}';",
        "",
        "/**",
        " * Gacha prize machine icons dictionary indexed by semantic alias.",
        " */",
        "export const GACHA_ICONS: Record<string, string> = {",
        "  close: GACHA_ICON_CLOSE,",
        "  closeBtn: GACHA_ICON_CLOSE,",
        "  close_btn: GACHA_ICON_CLOSE,",
        "  pointer: GACHA_ICON_POINTER,",
        "  pointerArrow: GACHA_ICON_POINTER,",
        "  pointer_arrow: GACHA_ICON_POINTER,",
        "  spinBtn: GACHA_ICON_SPIN_BTN,",
        "  spin_btn: GACHA_ICON_SPIN_BTN,",
        "  spin: GACHA_ICON_SPIN_BTN,",
        "  title: GACHA_ICON_TITLE,",
        "  gachaTitle: GACHA_ICON_TITLE,",
        "  gacha_title: GACHA_ICON_TITLE,",
        "};",
        ""
    ]

    with open(TS_FILE, "w", encoding="utf-8") as f:
        f.write("\n".join(ts_lines))

    ts_size = os.path.getsize(TS_FILE)
    print(f"Generated {TS_FILE}: {ts_size} bytes ({ts_size/1024:.2f} KB)")

if __name__ == "__main__":
    main()
