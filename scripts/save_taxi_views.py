import os
import shutil

views_dir = os.path.join('assets', 'models', 'taxi_views')
os.makedirs(views_dir, exist_ok=True)

step_dir = r'C:\Users\MIXPC\.gemini\antigravity\brain\9a102f57-853d-484b-8b30-17d8f8ea1d22\.system_generated\steps\353'

for i in range(5):
    src = os.path.join(step_dir, f'media_{i}.png')
    dst = os.path.join(views_dir, f'view_{i}.png')
    shutil.copyfile(src, dst)
    print(f"Copied {src} -> {dst} ({os.path.getsize(dst)} bytes)")

print("All 5 views saved successfully!")
