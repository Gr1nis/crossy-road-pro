import os
import shutil

src_dir = r"C:\Users\MIXPC\.gemini\antigravity\brain\5eeda061-c595-4465-b9d0-cee4ac2a1b2f\.system_generated\steps\558"
dst_dir = os.path.join(r"C:\Users\MIXPC\.gemini\antigravity\scratch\crossy-road-pro\assets\models\pallet_views")
os.makedirs(dst_dir, exist_ok=True)

for i in range(5):
    src_file = os.path.join(src_dir, f"media_{i}.png")
    dst_file = os.path.join(dst_dir, f"view_{i}.png")
    if os.path.exists(src_file):
        shutil.copyfile(src_file, dst_file)
        print(f"Copied {src_file} -> {dst_file} ({os.path.getsize(dst_file)} bytes)")
    else:
        print(f"ERROR: {src_file} not found!")

print("All pallet views saved successfully.")
