import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from urban_models_data import ALL_URBAN_MODELS

print("Verifying 12 models:")
for model_id, meta in ALL_URBAN_MODELS.items():
    cubes = meta['builder']()
    min_x = min(c['from'][0] for c in cubes) * 0.05
    max_x = max(c['to'][0] for c in cubes) * 0.05
    min_y = min(c['from'][1] for c in cubes) * 0.05
    max_y = max(c['to'][1] for c in cubes) * 0.05
    min_z = min(c['from'][2] for c in cubes) * 0.05
    max_z = max(c['to'][2] for c in cubes) * 0.05
    print(f"{model_id:16}: w={max_x - min_x:.2f}, h={max_y - min_y:.2f}, d={max_z - min_z:.2f}, min_y={min_y:.2f}, cubes={len(cubes)}")
