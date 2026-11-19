import sys
sys.path.insert(0, 'scripts')
from blockbench_coplanar_check import blockbench_check
from solve_urban_environment import check_quantization, check_connectivity, check_enclosed
from urban_models_data import ALL_URBAN_MODELS

print("Starting perfection audit...")
