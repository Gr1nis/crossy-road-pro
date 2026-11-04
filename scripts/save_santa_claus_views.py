import os
import shutil

views_dir = os.path.join('assets', 'models', 'santa_claus_views')
os.makedirs(views_dir, exist_ok=True)

media_map = {
    0: r'C:\Users\MIXPC\.gemini\antigravity\brain\f8fbe558-2d06-4380-8b79-a5ebf344855a\.system_generated\steps\139\media_0.png', # front_right
    1: r'C:\Users\MIXPC\.gemini\antigravity\brain\f8fbe558-2d06-4380-8b79-a5ebf344855a\.system_generated\steps\135\media_0.png', # front
    2: r'C:\Users\MIXPC\.gemini\antigravity\brain\f8fbe558-2d06-4380-8b79-a5ebf344855a\.system_generated\steps\143\media_0.png', # right
    3: r'C:\Users\MIXPC\.gemini\antigravity\brain\f8fbe558-2d06-4380-8b79-a5ebf344855a\.system_generated\steps\145\media_0.png', # back
    4: r'C:\Users\MIXPC\.gemini\antigravity\brain\f8fbe558-2d06-4380-8b79-a5ebf344855a\.system_generated\steps\147\media_0.png', # top
}

for idx, src in media_map.items():
    dst = os.path.join(views_dir, f'view_{idx}.png')
    shutil.copyfile(src, dst)
    print(f"Saved view_{idx}.png from {src}")
