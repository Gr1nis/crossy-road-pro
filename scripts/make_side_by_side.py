import os
from PIL import Image, ImageDraw, ImageFont

def make_side_by_side(ref_path, model_path, out_path, title_left="REFERENCE (TARGET)", title_right="BLOCKBENCH 3D MODEL"):
    ref_img = Image.open(ref_path).convert("RGBA")
    model_img = Image.open(model_path).convert("RGBA")
    
    # Target height
    target_h = 800
    
    # Scale ref maintaining aspect ratio
    ref_ratio = target_h / float(ref_img.height)
    ref_w = int(ref_img.width * ref_ratio)
    ref_resized = ref_img.resize((ref_w, target_h), Image.Resampling.LANCZOS)
    
    # Scale model maintaining aspect ratio
    model_ratio = target_h / float(model_img.height)
    model_w = int(model_img.width * model_ratio)
    model_resized = model_img.resize((model_w, target_h), Image.Resampling.LANCZOS)
    
    # Header height
    header_h = 60
    border = 20
    gap = 24
    
    total_w = border * 2 + ref_w + gap + model_w
    total_h = header_h + target_h + border
    
    canvas = Image.new("RGBA", (total_w, total_h), (18, 22, 28, 255))
    draw = ImageDraw.Draw(canvas)
    
    # Paste images
    ref_x = border
    ref_y = header_h
    model_x = border + ref_w + gap
    model_y = header_h
    
    canvas.paste(ref_resized, (ref_x, ref_y), ref_resized)
    canvas.paste(model_resized, (model_x, model_y), model_resized)
    
    # Draw dividing line
    div_x = border + ref_w + gap // 2
    draw.line([(div_x, header_h // 2), (div_x, total_h - border)], fill=(60, 70, 85, 255), width=2)
    
    # Draw headers (simple fallback font)
    draw.text((ref_x + 10, 18), "◀ " + title_left, fill=(234, 179, 8, 255))
    draw.text((model_x + 10, 18), "▶ " + title_right, fill=(59, 130, 246, 255))
    
    canvas.save(out_path)
    print(f"Saved side-by-side composite to: {out_path}")

if __name__ == "__main__":
    brain_dir = "/Users/egorbelogubec/.gemini/antigravity/brain/c4c57069-d105-4cca-bf1f-b4e3ff560ae1"
    
    # Front View
    make_side_by_side(
        os.path.join(brain_dir, "ref_crop_front.png"),
        os.path.join(brain_dir, "fixed_hero_front_framed.png"),
        os.path.join(brain_dir, "side_by_side_front.png"),
        title_left="REFERENCE: FRONT VIEW (PANEL 3)",
        title_right="BLOCKBENCH: FRONT VIEW RENDER"
    )
    
    # Isometric View
    make_side_by_side(
        os.path.join(brain_dir, "ref_crop_iso.png"),
        os.path.join(brain_dir, "fixed_hero_iso_framed.png"),
        os.path.join(brain_dir, "side_by_side_iso.png"),
        title_left="REFERENCE: 45° ISOMETRIC (PANEL 1)",
        title_right="BLOCKBENCH: 45° ISOMETRIC RENDER"
    )
