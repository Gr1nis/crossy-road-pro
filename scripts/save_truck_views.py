import os
import shutil

src_dir = r"C:/Users/MIXPC/.gemini/antigravity/brain/9a102f57-853d-484b-8b30-17d8f8ea1d22/.system_generated/steps/638"
dst_dir = r"assets/models/truck_views"
os.makedirs(dst_dir, exist_ok=True)

for i in range(5):
    src = os.path.join(src_dir, f"media_{i}.png")
    dst = os.path.join(dst_dir, f"view_{i}.png")
    shutil.copyfile(src, dst)
    print(f"Copied {src} -> {dst}")
