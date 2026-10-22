#!/usr/bin/env python3
"""
Process high-fidelity 3D Skins Menu UI icons from 2K raw renders.
Performs clean alpha segmentation, halo and drop shadow removal,
boundary inpainting, Lanczos downsampling, WebP compression,
and updates src/view/skinsIconsBase64.ts.
"""

import os
import base64
import cv2
import numpy as np
from PIL import Image

RAW_DIR = "/Users/egorbelogubec/Downloads/Icons Skins Menu"
OUT_DIR = "references/processed_icons"
TS_FILE = "src/view/skinsIconsBase64.ts"

os.makedirs(OUT_DIR, exist_ok=True)

def get_hsv_planes(img_bgr: np.ndarray):
    rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB).astype(np.float32) / 255.0
    r, g, b = rgb[:, :, 0], rgb[:, :, 1], rgb[:, :, 2]
    max_c = np.maximum(np.maximum(r, g), b)
    min_c = np.minimum(np.minimum(r, g), b)
    delta = max_c - min_c
    sat = np.zeros_like(max_c)
    nz = max_c > 1e-4
    sat[nz] = delta[nz] / max_c[nz]
    val = max_c
    return rgb, r, g, b, sat, val

def crop_inpaint_resize(img_bgr: np.ndarray, alpha_u8: np.ndarray, target_w: int,
                        target_h: int = None, pad: int = 12, square: bool = False) -> Image.Image:
    y_idx, x_idx = np.where(alpha_u8 > 10)
    h, w, _ = img_bgr.shape
    if square:
        bw = int(x_idx.max() - x_idx.min() + 1)
        bh = int(y_idx.max() - y_idx.min() + 1)
        box = max(bw, bh) + 2 * pad
        cx, cy = int(x_idx.min() + bw // 2), int(y_idx.min() + bh // 2)
        x0, y0 = max(0, cx - box // 2), max(0, cy - box // 2)
        x1, y1 = min(w, x0 + box), min(h, y0 + box)
    else:
        x0, y0 = max(0, int(x_idx.min()) - pad), max(0, int(y_idx.min()) - pad)
        x1, y1 = min(w, int(x_idx.max()) + pad), min(h, int(y_idx.max()) + pad)

    crop_bgr = img_bgr[y0:y1, x0:x1].copy()
    crop_alpha = alpha_u8[y0:y1, x0:x1]
    inpaint_mask = (crop_alpha < 128).astype(np.uint8)
    crop_bgr_clean = cv2.inpaint(crop_bgr, inpaint_mask, inpaintRadius=5, flags=cv2.INPAINT_TELEA)

    crop_rgba = cv2.cvtColor(np.dstack([crop_bgr_clean, crop_alpha]), cv2.COLOR_BGRA2RGBA)
    pil_img = Image.fromarray(crop_rgba)

    if target_h is None:
        target_h = int(target_w * (pil_img.height / pil_img.width))
    return pil_img.resize((target_w, target_h), Image.Resampling.LANCZOS)

def process_skins_title(raw_path: str) -> Image.Image:
    print(f"Processing SKINS title from {os.path.basename(raw_path)}...")
    img = cv2.imread(raw_path)
    _, _, _, _, sat, val = get_hsv_planes(img)

    # Outer background candidate mask (pure white or unsaturated gray drop shadows)
    is_bg = ((val > 0.92) & (sat < 0.12)) | ((val > 0.60) & (sat < 0.08))
    _, lab = cv2.connectedComponents(is_bg.astype(np.uint8))
    fg_mask = (lab != lab[0, 0]).astype(np.uint8) * 255

    eroded = cv2.erode(fg_mask, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5)))
    alpha = cv2.GaussianBlur(eroded.astype(np.float32), (5, 5), 1.2)
    return crop_inpaint_resize(img, np.clip(alpha, 0, 255).astype(np.uint8), 520, pad=16)

def process_button(raw_path: str, is_green: bool = False) -> Image.Image:
    color_name = "GREEN" if is_green else "GOLD"
    print(f"Processing {color_name} button from {os.path.basename(raw_path)}...")
    img = cv2.imread(raw_path)
    _, r, g, b, sat, _ = get_hsv_planes(img)

    cond = (sat > 0.25) & (g > r) & (g > b) if is_green else (sat > 0.25) & (r > b + 0.10)
    _, lab, stats, _ = cv2.connectedComponentsWithStats(cond.astype(np.uint8))
    largest = 1 + np.argmax(stats[1:, cv2.CC_STAT_AREA])

    contours, _ = cv2.findContours(((lab == largest) * 255).astype(np.uint8),
                                  cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    solid_mask = np.zeros(img.shape[:2], dtype=np.uint8)
    cv2.drawContours(solid_mask, [max(contours, key=cv2.contourArea)], -1, 255, -1)

    eroded = cv2.erode(solid_mask, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5)))
    alpha = cv2.GaussianBlur(eroded.astype(np.float32), (7, 7), 1.5)
    return crop_inpaint_resize(img, np.clip(alpha, 0, 255).astype(np.uint8), 340, pad=12)

def process_skins_lock(raw_path: str) -> Image.Image:
    print(f"Processing LOCK from {os.path.basename(raw_path)}...")
    img = cv2.imread(raw_path)
    _, r, _, b, sat, val = get_hsv_planes(img)

    fg_raw = (sat > 0.15) | ((val < 0.30) & (r > b))
    closed = cv2.morphologyEx(fg_raw.astype(np.uint8) * 255, cv2.MORPH_CLOSE,
                              cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (11, 11)))

    contours, hierarchy = cv2.findContours(closed, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_SIMPLE)
    outer_idx = max(range(len(contours)), key=lambda i: cv2.contourArea(contours[i]))

    mask = np.zeros(img.shape[:2], dtype=np.uint8)
    cv2.drawContours(mask, contours, outer_idx, 255, -1)

    child = hierarchy[0][outer_idx][2]
    while child != -1:
        if cv2.contourArea(contours[child]) > 5000:
            cv2.drawContours(mask, contours, child, 0, -1)
        child = hierarchy[0][child][0]

    eroded = cv2.erode(mask, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5)))
    alpha = cv2.GaussianBlur(eroded.astype(np.float32), (7, 7), 1.5)
    return crop_inpaint_resize(img, np.clip(alpha, 0, 255).astype(np.uint8), 140, pad=12)

def process_skins_close(raw_path: str) -> Image.Image:
    print(f"Processing CLOSE button from {os.path.basename(raw_path)}...")
    img = cv2.imread(raw_path)
    _, r, g, b, sat, _ = get_hsv_planes(img)

    cond = (r > 0.45) & (sat > 0.35) & (r > g + 0.15) & (r > b + 0.15)
    _, lab, stats, _ = cv2.connectedComponentsWithStats(cond.astype(np.uint8))
    largest = 1 + np.argmax(stats[1:, cv2.CC_STAT_AREA])

    contours, _ = cv2.findContours(((lab == largest) * 255).astype(np.uint8),
                                  cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    solid_mask = np.zeros(img.shape[:2], dtype=np.uint8)
    cv2.drawContours(solid_mask, [max(contours, key=cv2.contourArea)], -1, 255, -1)

    eroded = cv2.erode(solid_mask, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5)))
    alpha = cv2.GaussianBlur(eroded.astype(np.float32), (7, 7), 1.5)
    return crop_inpaint_resize(img, np.clip(alpha, 0, 255).astype(np.uint8), 128, 128, pad=12, square=True)

def verify_on_dark(img_pil: Image.Image, name: str) -> None:
    arr = np.array(img_pil)
    a = arr[:, :, 3].astype(np.float32) / 255.0
    dark_bg = np.array([20, 31, 53], dtype=np.float32)
    comp = arr[:, :, :3].astype(np.float32) * a[:, :, None] + dark_bg * (1.0 - a[:, :, None])
    out_path = os.path.join(OUT_DIR, f"verify_{name}_on_dark.png")
    Image.fromarray(np.clip(comp, 0, 255).astype(np.uint8)).save(out_path)
    print(f"  -> Saved dark background verification: {out_path}")

def main():
    print("=" * 60)
    print("Processing Skins Menu 3D Assets (Halo-Free Alpha Pipeline)")
    print("=" * 60)

    asset_defs = [
        {"key": "title", "file": "skins_title.webp",
         "raw": os.path.join(RAW_DIR, "по_типу,_как_на_референсе_2K_20261019133547.jpg"),
         "fn": lambda path: process_skins_title(path)},
        {"key": "btnGold", "file": "skins_btn_gold.webp",
         "raw": os.path.join(RAW_DIR, "3D_mobile_game_UI_button,_2K_20261019133712.jpg"),
         "fn": lambda path: process_button(path, is_green=False)},
        {"key": "btnGreen", "file": "skins_btn_green.webp",
         "raw": os.path.join(RAW_DIR, "перекрась_кнопку_с_референса_в_2K_20261019133950.jpg"),
         "fn": lambda path: process_button(path, is_green=True)},
        {"key": "lock", "file": "skins_lock.webp",
         "raw": os.path.join(RAW_DIR, "поверни_замок_с_референса_лицом_2K_20261019134033.jpg"),
         "fn": lambda path: process_skins_lock(path)},
        {"key": "close", "file": "skins_close_btn.webp",
         "raw": os.path.join(RAW_DIR, "3D_casual_game_UI_circular_2K_20261019133735.jpg"),
         "fn": lambda path: process_skins_close(path)},
    ]

    base64_dict = {}
    stats = []

    for item in asset_defs:
        key = item["key"]
        file_name = item["file"]
        out_path = os.path.join(OUT_DIR, file_name)
        processed_img = item["fn"](item["raw"])
        processed_img.save(out_path, format="WEBP", quality=90, method=6)
        file_bytes = os.path.getsize(out_path)

        with open(out_path, "rb") as f:
            b64_str = base64.b64encode(f.read()).decode("ascii")
            data_uri = f"data:image/webp;base64,{b64_str}"
            base64_dict[key] = data_uri

        verify_on_dark(processed_img, key)
        stats.append({"key": key, "file": file_name,
                      "dims": f"{processed_img.width}x{processed_img.height}",
                      "bytes": file_bytes, "b64_len": len(data_uri)})
        print(f"  -> Saved {file_name}: {processed_img.width}x{processed_img.height}, {file_bytes} bytes ({file_bytes/1024:.2f} KB)")

    total_webp = sum(s["bytes"] for s in stats)
    total_b64 = sum(s["b64_len"] for s in stats)
    print("\n" + "=" * 60)
    print(f"Total WebP on disk: {total_webp} bytes ({total_webp/1024:.2f} KB)")
    print(f"Total Base64 bundle: {total_b64} bytes ({total_b64/1024:.2f} KB)")
    print("=" * 60)

    print(f"\nUpdating {TS_FILE}...")
    ts_lines = [
        "/**",
        " * Authentic 3D Skins Menu UI Assets in lightweight WebP format (Base64 data URIs).",
        " * Auto-generated by scripts/process_skins_icons.py from reference graphics with halo-free edges.",
        " */",
        "",
        f"export const SKINS_ICON_TITLE =\n  '{base64_dict['title']}';",
        "",
        f"export const SKINS_ICON_BTN_GOLD =\n  '{base64_dict['btnGold']}';",
        "",
        f"export const SKINS_ICON_BTN_GREEN =\n  '{base64_dict['btnGreen']}';",
        "",
        f"export const SKINS_ICON_LOCK =\n  '{base64_dict['lock']}';",
        "",
        f"export const SKINS_ICON_CLOSE =\n  '{base64_dict['close']}';",
        "",
        "/**",
        " * Unified Skins menu icons map adhering to the exact project specification.",
        " */",
        "export const SKINS_MENU_ICONS = {",
        "  title: SKINS_ICON_TITLE,",
        "  btnGold: SKINS_ICON_BTN_GOLD,",
        "  btnGreen: SKINS_ICON_BTN_GREEN,",
        "  lock: SKINS_ICON_LOCK,",
        "  close: SKINS_ICON_CLOSE,",
        "};",
        "",
        "/** Semantic aliases for template convenience */",
        "export const SKINS_ICONS: Record<string, string> = {",
        "  title: SKINS_ICON_TITLE,",
        "  skinsTitle: SKINS_ICON_TITLE,",
        "  btnGold: SKINS_ICON_BTN_GOLD,",
        "  btn_gold: SKINS_ICON_BTN_GOLD,",
        "  btnGreen: SKINS_ICON_BTN_GREEN,",
        "  btn_green: SKINS_ICON_BTN_GREEN,",
        "  lock: SKINS_ICON_LOCK,",
        "  skinsLock: SKINS_ICON_LOCK,",
        "  close: SKINS_ICON_CLOSE,",
        "  closeBtn: SKINS_ICON_CLOSE,",
        "  close_btn: SKINS_ICON_CLOSE,",
        "};",
        ""
    ]

    with open(TS_FILE, "w", encoding="utf-8") as f:
        f.write("\n".join(ts_lines))
    print(f"Generated {TS_FILE}: {os.path.getsize(TS_FILE)} bytes ({os.path.getsize(TS_FILE)/1024:.2f} KB)")

if __name__ == "__main__":
    main()
