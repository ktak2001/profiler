import os
import subprocess

# Paths to the JavaScript files
main_event_based_js = "/Users/takehikazuki/Desktop/todai/first_project/profiler_deterministic/main_event_based.js"
main_statistical_worker_js = "/Users/takehikazuki/Desktop/todai/first_project/profiler_sampling/main_statistical_worker.js"

# Directory containing the generated text files
generated_txt_dir = "/Users/takehikazuki/Desktop/todai/first_project/text_datas/generated_txt/check_num_called"

# Get all file paths in the generated_txt_dir
filepaths = [os.path.join(generated_txt_dir, f) for f in os.listdir(generated_txt_dir) if f.endswith('.txt')]

# Function to run a JavaScript file with a given filepath argument
def run_js_script(js_file, filepath):
    command = ["node", js_file, filepath]
    print(f"Running: {' '.join(command)}")
    try:
        result = subprocess.run(command, timeout=120)
        if result.returncode != 0:
            print(f"Error detected while running: {' '.join(command)}")
        return result.returncode
    except subprocess.TimeoutExpired:
        print(f"Timeout expired for: {' '.join(command)}")
        # Write to duration file with -1ms for timeout cases
        with open("/Users/takehikazuki/Desktop/todai/first_project/text_datas/duration.txt", "a") as f:
            profiler_type = "event_based" if js_file == main_event_based_js else "statistical_worker"
            f.write(f"{os.path.basename(filepath)}, {profiler_type}: -1ms\n")
        return 0

# Function to run all scripts with retry logic
def run_all_scripts():
    for i in range(0, len(filepaths)):
        filepath = filepaths[i]
        if run_js_script(main_event_based_js, filepath) != 0:
            break
        if run_js_script(main_statistical_worker_js, filepath) != 0:
            break
    else:
        # If the loop completes without breaking, all scripts have been processed
        print("All scripts have been processed.")
        return
    print("Restarting from the point of failure...")

run_all_scripts()