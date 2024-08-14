import os
import subprocess

# Define the combinations of function numbers and computation amounts
function_numbers = [1, 10, 100, 1000, 10000, 100000, 1000000]
# function_numbers = [1]
computation_factors = [1, 10, 100, 1000, 10000, 100000, 1000000, 10000000]

# Path to the generate_txt_files.py script
script_path = "/Users/takehikazuki/Desktop/todai/first_project/text_datas/generate_num_called.py"

# Iterate over each combination of function numbers and computation amounts
for num_funcs in function_numbers:
    for factor in computation_factors:
        loop_count = num_funcs * factor
        if loop_count > 10000000:
            continue  # Skip combinations where loop_count exceeds 10,000,000
        filename = f"check_for_{num_funcs}_funcs_{loop_count}_called.txt"
        command = ["python3", script_path, filename, str(num_funcs), str(loop_count)]
        print(f"Running: {' '.join(command)}")
        subprocess.run(command)

print("All combinations have been processed.")