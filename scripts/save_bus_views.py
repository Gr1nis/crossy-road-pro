import os
import shutil

src_dir = r"C:\Users\MIXPC\.gemini\antigravity\brain\9a102f57-853d-484b-8b30-17d8f8ea1d22\.system_generated\steps\724"
dst_dir = os.path.join(r"C:\Users\MIXPC\.gemini\antigravity\scratch\crossy-road-pro\assets\models\bus_views")
os.makedirs(dst_dir, exist_ok=True)

for i in range(5):
    src_file = os.path.join(src_dir, f"media_{i}.png")
    dst_file = os.path.join(dst_dir, f"view_{i}.png")
    if os.path.exists(src_file):
        shutil.copyfile(src_file, dst_file)
        print(f"Copied {src_file} -> {dst_file} ({os.path.getsize(dst_file)} bytes)")
    else:
        print(f"ERROR: {src_file} not found!")

print("All bus views saved successfully.")
