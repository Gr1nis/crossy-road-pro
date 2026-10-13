import os
import glob
import base64
import cv2
import numpy as np
from PIL import Image

RAW_DIR = 'references/menu_buttons'
OUT_DIR = 'references/processed_icons'
TS_OUT_FILE = 'src/view/menuIconsBase64.ts'

os.makedirs(OUT_DIR, exist_ok=True)

# List of all files in RAW_DIR
raw_files = os.listdir(RAW_DIR)

def find_file(sub: str) -> str:
    for f in raw_files:
        if sub in f:
            return os.path.join(RAW_DIR, f)
    raise FileNotFoundError(f"Could not find raw file with substring: {sub}")

# Asset definitions
ASSET_DEFS = [
    {
        "key": "skins",
        "file_sub": "201744",
        "name": "Skins (Red Panda)",
        "out_file": "skins.webp",
        "is_wide": False,
        "target_size": (140, 140),
        "is_coin": False
    },
    {
        "key": "shop",
        "file_sub": "201755",
        "name": "Shop (Shopping Cart)",
        "out_file": "shop.webp",
        "is_wide": False,
        "target_size": (140, 140),
        "is_coin": False
    },
    {
        "key": "leaderboard",
        "file_sub": "201903",
        "name": "Leaderboard (Trophy on podium)",
        "out_file": "leaderboard.webp",
        "is_wide": False,
        "target_size": (140, 140),
        "is_coin": False
    },
    {
        "key": "achievements",
        "file_sub": "201959",
        "name": "Achievements (Star Medal with ribbons)",
        "out_file": "achievements.webp",
        "is_wide": False,
        "target_size": (140, 140),
        "is_coin": False
    },
    {
        "key": "daily_gift",
        "file_sub": "202115",
        "name": "Daily Gift (Red Gift box with yellow bow)",
        "out_file": "daily_gift.webp",
        "is_wide": False,
        "target_size": (140, 140),
        "is_coin": False
    },
    {
        "key": "daily_quests",
        "file_sub": "202202",
        "name": "Daily Quests (Clipboard with checklist)",
        "out_file": "daily_quests.webp",
        "is_wide": False,
        "target_size": (140, 140),
        "is_coin": False
    },
    {
        "key": "settings",
        "file_sub": "202325",
        "name": "Settings (Gear cog)",
        "out_file": "settings.webp",
        "is_wide": False,
        "target_size": (140, 140),
        "is_coin": False
    },
    {
        "key": "coin",
        "file_sub": "202419",
        "name": "Coin (Golden coin)",
        "out_file": "coin.webp",
        "is_wide": False,
        "target_size": (140, 140),
        "is_coin": True
    },
    {
        "key": "crown",
        "file_sub": "202512",
        "name": "Crown (Golden crown badge)",
        "out_file": "crown.webp",
        "is_wide": False,
        "target_size": (140, 140),
        "is_coin": False
    },
    {
        "key": "play",
        "file_sub": "201238",
        "name": "PLAY button / accent",
        "out_file": "play.webp",
        "is_wide": True,
        "target_size": (256, 140),
        "is_coin": False
    },
    {
        "key": "currency_widget",
        "file_sub": "202419",
        "name": "Currency widget (Golden coin with counter & plus)",
        "out_file": "currency_widget.webp",
        "is_wide": True,
        "target_size": (256, 140),
        "is_coin": False
    }
]

def process_standard_asset(fpath: str, is_wide: bool, target_size: tuple[int, int]) -> Image.Image:
    img_pil = Image.open(fpath)
    arr = np.array(img_pil)
    h, w, _ = arr.shape
    gray = cv2.cvtColor(arr, cv2.COLOR_RGB2GRAY)

    # FloodFill from (0,0) with fixed range to isolate outside pure white background
    ff_mask = np.zeros((h + 2, w + 2), dtype=np.uint8)
    flags = 4 | (255 << 8) | cv2.FLOODFILL_MASK_ONLY | cv2.FLOODFILL_FIXED_RANGE
    cv2.floodFill(gray.copy(), ff_mask, (0, 0), 0, loDiff=10, upDiff=10, flags=flags)
    bg_filled = (ff_mask[1:-1, 1:-1] == 255)

    fg_mask = (~bg_filled).astype(np.uint8) * 255
    contours, _ = cv2.findContours(fg_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    c = max(contours, key=cv2.contourArea)
    solid_fg = np.zeros_like(fg_mask)
    cv2.drawContours(solid_fg, [c], -1, 255, -1)

    # Smooth edge anti-aliasing
    alpha_float = cv2.GaussianBlur(solid_fg.astype(np.float32), (5, 5), 1.2)
    alpha_u8 = np.clip(alpha_float, 0, 255).astype(np.uint8)

    x, y, bw, bh = cv2.boundingRect(c)

    if is_wide:
        target_ar = target_size[0] / target_size[1]
        pad_x = int(bw * 0.04)
        pad_y = int(bh * 0.04)
        w_pad = bw + 2 * pad_x
        h_pad = bh + 2 * pad_y
        if w_pad / h_pad > target_ar:
            box_w = w_pad
            box_h = int(box_w / target_ar)
        else:
            box_h = h_pad
            box_w = int(box_h * target_ar)
    else:
        max_dim = max(bw, bh)
        pad = int(max_dim * 0.04)
        box_size = max_dim + 2 * pad
        box_w = box_size
        box_h = box_size

    cx, cy = x + bw // 2, y + bh // 2
    x0 = max(0, cx - box_w // 2)
    y0 = max(0, cy - box_h // 2)
    x1 = min(w, x0 + box_w)
    y1 = min(h, y0 + box_h)

    crop_rgb = arr[y0:y1, x0:x1]
    crop_alpha = alpha_u8[y0:y1, x0:x1]

    # Inpaint background colors under zero alpha to prevent white fringing during downsampling
    mask_for_inpaint = (crop_alpha == 0).astype(np.uint8)
    crop_rgb_clean = cv2.inpaint(crop_rgb, mask_for_inpaint, inpaintRadius=3, flags=cv2.INPAINT_TELEA)

    crop_rgba = np.dstack([crop_rgb_clean, crop_alpha])
    crop_pil = Image.fromarray(crop_rgba)

    return crop_pil.resize(target_size, Image.Resampling.LANCZOS)

def process_coin_asset(fpath: str, target_size: tuple[int, int]) -> Image.Image:
    img_pil = Image.open(fpath)
    arr = np.array(img_pil)
    h, w, _ = arr.shape
    sub = arr[:, :910].copy()

    # Mask golden coin pixels: non-white and dominant red/gold channel over blue/background
    not_white = (sub[:, :, 0] < 248) | (sub[:, :, 1] < 248) | (sub[:, :, 2] < 248)
    is_gold = (sub[:, :, 0] >= sub[:, :, 1] - 5) & (sub[:, :, 0] > sub[:, :, 2] + 25) & not_white
    is_gold[:365, :] = False
    is_gold[1144:, :] = False

    num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(is_gold.astype(np.uint8))
    label_at_center = labels[750, 500]
    coin_mask = (labels == label_at_center).astype(np.uint8) * 255

    contours, _ = cv2.findContours(coin_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    c = max(contours, key=cv2.contourArea)
    solid_mask = np.zeros_like(coin_mask)
    cv2.drawContours(solid_mask, [c], -1, 255, -1)

    alpha_float = cv2.GaussianBlur(solid_mask.astype(np.float32), (5, 5), 1.2)
    alpha_u8 = np.clip(alpha_float, 0, 255).astype(np.uint8)

    x, y, bw, bh = cv2.boundingRect(c)
    max_dim = max(bw, bh)
    pad = int(max_dim * 0.04)
    box_size = max_dim + 2 * pad
    cx, cy = x + bw // 2, y + bh // 2
    x0 = max(0, cx - box_size // 2)
    y0 = max(0, cy - box_size // 2)
    x1 = min(w, x0 + box_size)
    y1 = min(h, y0 + box_size)

    crop_rgb = arr[y0:y1, x0:x1]
    full_alpha = np.zeros((h, w), dtype=np.uint8)
    full_alpha[:, :910] = alpha_u8
    crop_alpha = full_alpha[y0:y1, x0:x1]

    mask_for_inpaint = (crop_alpha == 0).astype(np.uint8)
    crop_rgb_clean = cv2.inpaint(crop_rgb, mask_for_inpaint, inpaintRadius=3, flags=cv2.INPAINT_TELEA)

    crop_rgba = np.dstack([crop_rgb_clean, crop_alpha])
    crop_pil = Image.fromarray(crop_rgba)

    return crop_pil.resize(target_size, Image.Resampling.LANCZOS)

def main():
    print("=" * 60)
    print("Processing 2K Game UI Reference Buttons")
    print("=" * 60)

    results = []
    base64_dict = {}

    for item in ASSET_DEFS:
        key = item["key"]
        name = item["name"]
        file_sub = item["file_sub"]
        out_file = item["out_file"]
        is_wide = item["is_wide"]
        target_size = item["target_size"]
        is_coin = item["is_coin"]

        raw_path = find_file(file_sub)
        print(f"\nProcessing [{key}] '{name}' from {os.path.basename(raw_path)}...")

        if is_coin:
            processed_img = process_coin_asset(raw_path, target_size)
        else:
            processed_img = process_standard_asset(raw_path, is_wide, target_size)

        out_path = os.path.join(OUT_DIR, out_file)
        # Save as optimized WebP
        processed_img.save(out_path, format="WEBP", quality=88, method=6)
        file_bytes = os.path.getsize(out_path)

        with open(out_path, "rb") as f:
            b64_content = base64.b64encode(f.read()).decode("ascii")
            data_uri = f"data:image/webp;base64,{b64_content}"
            base64_dict[key] = data_uri

        results.append({
            "key": key,
            "name": name,
            "file": out_file,
            "size": f"{processed_img.width}x{processed_img.height}",
            "bytes": file_bytes,
            "kb": round(file_bytes / 1024, 2),
            "b64_len": len(data_uri)
        })
        print(f"  -> Saved {out_file}: {processed_img.width}x{processed_img.height}, {file_bytes} bytes ({round(file_bytes/1024, 2)} KB)")

    total_webp_bytes = sum(r["bytes"] for r in results)
    total_b64_bytes = sum(r["b64_len"] for r in results)

    print("\n" + "=" * 60)
    print("Summary of Processed Assets:")
    print(f"Total WebP Size: {total_webp_bytes} bytes ({total_webp_bytes / 1024:.2f} KB)")
    print(f"Total Base64 Size: {total_b64_bytes} bytes ({total_b64_bytes / 1024:.2f} KB)")
    print("=" * 60)

    # Generate TypeScript file src/view/menuIconsBase64.ts
    print(f"\nGenerating {TS_OUT_FILE}...")
    ts_content = [
        "/**",
        " * High-definition menu and UI icons extracted from 2K reference buttons.",
        " * Isolated transparent RGBA with anti-aliased alpha borders in lightweight WebP format.",
        " *",
        " * Total bundle size of all icons combined: " + f"{total_b64_bytes / 1024:.2f} KB (< 120 KB limit).",
        " */",
        "",
    ]

    # Declare individual constants first to avoid string repetition for aliases
    for item in results:
        const_name = f"ICON_{item['key'].upper()}"
        ts_content.append(f"const {const_name} =\n  '{base64_dict[item['key']]}';")

    ts_content.append("")
    ts_content.append("/**")
    ts_content.append(" * Menu icons registry indexed by semantic key (supports camelCase and snake_case aliases).")
    ts_content.append(" */")
    ts_content.append("export const MENU_ICONS: Record<string, string> = {")

    # Map keys and aliases
    for item in results:
        k = item["key"]
        const_ref = f"ICON_{k.upper()}"
        ts_content.append(f"  // {item['name']} ({item['size']})")
        ts_content.append(f"  {json_key(k)}: {const_ref},")

        # Aliases
        if "_" in k:
            camel = "".join(part.capitalize() if i > 0 else part for i, part in enumerate(k.split("_")))
            ts_content.append(f"  {json_key(camel)}: {const_ref},")
        if k == "play":
            ts_content.append(f"  playButton: {const_ref},")
            ts_content.append(f"  play_button: {const_ref},")
        if k == "shop":
            ts_content.append(f"  gacha: {const_ref},")

    ts_content.append("};")
    ts_content.append("")

    with open(TS_OUT_FILE, "w", encoding="utf-8") as f:
        f.write("\n".join(ts_content))

    ts_size = os.path.getsize(TS_OUT_FILE)
    print(f"Generated {TS_OUT_FILE}: {ts_size} bytes ({ts_size / 1024:.2f} KB)")

def json_key(s: str) -> str:
    if s.isidentifier():
        return s
    return f'"{s}"'

if __name__ == "__main__":
    main()
