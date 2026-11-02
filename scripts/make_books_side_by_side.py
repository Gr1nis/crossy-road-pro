import os
from PIL import Image, ImageDraw, ImageFont

def crop_content(img, top_cut=35, bot_cut=35):
    w, h = img.size
    return img.crop((0, top_cut, w, h - bot_cut))

def build_side_by_side():
    brain_dir = "/Users/egorbelogubec/.gemini/antigravity/brain/a43e017b-04f5-408f-805a-7ef17931e937"
    
    # 1. Front View
    ref_front = Image.open("/tmp/v3_front.png").convert("RGBA")
    # Clean ref front: trim bottom caption "(3) FRONT VIEW"
    ref_w, ref_h = ref_front.size
    ref_front = ref_front.crop((0, 0, ref_w, int(ref_h * 0.92)))
    
    # Model front
    front_path = "/tmp/books_model_front.png"
    if not os.path.exists(front_path):
        front_path = os.path.join(brain_dir, ".system_generated/steps/347/media_0.png")
    model_front_raw = Image.open(front_path).convert("RGBA")
    model_front = crop_content(model_front_raw, 20, 20)
    
    # 2. Isometric View
    ref_iso = Image.open("/tmp/v1_iso.png").convert("RGBA")
    iso_w, iso_h = ref_iso.size
    ref_iso = ref_iso.crop((0, 0, iso_w, int(iso_h * 0.92)))
    
    # Model iso
    iso_path = "/tmp/books_model_iso.png"
    if not os.path.exists(iso_path):
        iso_path = os.path.join(brain_dir, ".system_generated/steps/347/media_2.png")
    model_iso_raw = Image.open(iso_path).convert("RGBA")
    model_iso = crop_content(model_iso_raw, 20, 20)
    
    # Normalize heights
    target_h = 750
    
    def resize_to_h(im, h):
        r = h / float(im.height)
        return im.resize((int(im.width * r), h), Image.Resampling.LANCZOS)
    
    rf_resized = resize_to_h(ref_front, target_h)
    mf_resized = resize_to_h(model_front, target_h)
    
    ri_resized = resize_to_h(ref_iso, target_h)
    mi_resized = resize_to_h(model_iso, target_h)
    
    header_h = 50
    pad = 20
    gap = 20
    
    col1_w = max(rf_resized.width, ri_resized.width)
    col2_w = max(mf_resized.width, mi_resized.width)
    
    total_w = pad * 2 + col1_w + gap + col2_w
    total_h = header_h + target_h * 2 + pad * 3
    
    canvas = Image.new("RGBA", (total_w, total_h), (15, 23, 42, 255))
    draw = ImageDraw.Draw(canvas)
    
    # Row 1: Front View
    y1 = header_h + pad
    x1_ref = pad + (col1_w - rf_resized.width) // 2
    x1_mod = pad + col1_w + gap + (col2_w - mf_resized.width) // 2
    
    canvas.paste(rf_resized, (x1_ref, y1), rf_resized)
    canvas.paste(mf_resized, (x1_mod, y1), mf_resized)
    
    # Row 2: Isometric View
    y2 = y1 + target_h + pad
    x2_ref = pad + (col1_w - ri_resized.width) // 2
    x2_mod = pad + col1_w + gap + (col2_w - mi_resized.width) // 2
    
    canvas.paste(ri_resized, (x2_ref, y2), ri_resized)
    canvas.paste(mi_resized, (x2_mod, y2), mi_resized)
    
    # Dividing line
    div_x = pad + col1_w + gap // 2
    draw.line([(div_x, 20), (div_x, total_h - pad)], fill=(51, 65, 85, 255), width=2)
    draw.line([(pad, y2 - pad // 2), (total_w - pad, y2 - pad // 2)], fill=(51, 65, 85, 255), width=2)
    
    # Headers
    draw.text((pad + 10, 16), "◀ TARGET CONCEPT ART (SUMMER TURNAROUND)", fill=(245, 158, 11, 255))
    draw.text((div_x + 20, 16), "▶ BLOCKBENCH MASTER 3D MODEL (TOWNHOUSE C)", fill=(56, 189, 248, 255))
    
    draw.text((pad + 10, y1 + 10), "[1] FRONT VIEW", fill=(203, 213, 225, 200))
    draw.text((div_x + 20, y1 + 10), "[1] FRONT VIEW", fill=(203, 213, 225, 200))
    
    draw.text((pad + 10, y2 + 10), "[2] 45° ISOMETRIC VIEW", fill=(203, 213, 225, 200))
    draw.text((div_x + 20, y2 + 10), "[2] 45° ISOMETRIC VIEW", fill=(203, 213, 225, 200))
    
    curr_brain_dir = "/Users/egorbelogubec/.gemini/antigravity/brain/bf148b07-0067-4ac6-91d7-afc0d3d43e17"
    os.makedirs(curr_brain_dir, exist_ok=True)
    out_path_brain = os.path.join(curr_brain_dir, "side_by_side_review.png")
    out_path_root = os.path.join(os.getcwd(), "side_by_side_review.png")
    
    canvas.save(out_path_brain)
    canvas.save(out_path_root)
    print(f"Composite saved to: {out_path_brain} and {out_path_root} ({total_w}x{total_h})")

if __name__ == "__main__":
    build_side_by_side()
