import os
import subprocess

# Paths to the JavaScript files
main_event_based_js = "/Users/takehikazuki/Desktop/todai/first_project/profiler_deterministic/main_event_based.js"

# Directory containing the generated text files
generated_txt_dir = "/Users/takehikazuki/Desktop/todai/first_project/text_datas/generated_txt/no_check_num_called"

# Get all file paths in the generated_txt_dir
filepaths = [os.path.join(generated_txt_dir, f) for f in os.listdir(generated_txt_dir) if f.endswith('.txt')]

# Function to run a JavaScript file with a given filepath argument
def run_js_script(js_file, filepath):
    # if not os.path.basename(filepath).startswith("check_for_1_"):
    #     return 0
    command = ["node", js_file, filepath]
    print(f"Running: {' '.join(command)}")
    result = subprocess.run(command)
    if result.returncode != 0:
        print(f"Error detected while running: {' '.join(command)}")
    return result.returncode

# Function to run all scripts with retry logic
def run_all_scripts(start_from_beginning):
    start_index = 0
    while start_index < len(filepaths):
        for i in range(start_index, len(filepaths)):
            filepath = filepaths[i]
            if run_js_script(main_event_based_js, filepath) != 0:
                if start_from_beginning:
                    start_index = 0
                else:
                    start_index = i
                break
        else:
            # If the loop completes without breaking, all scripts have been processed
            print("All scripts have been processed.")
            return
        print("Restarting from the point of failure...")

# Ask the user whether to start from the beginning or from the point of failure
user_input = input("Do you want to start from the beginning if an error occurs? (yes/no): ").strip().lower()
start_from_beginning = user_input == 'yes'

run_all_scripts(start_from_beginning)