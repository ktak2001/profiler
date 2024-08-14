import matplotlib.pyplot as plt
import numpy as np

# Read the data from the file
file_path = '/Users/takehikazuki/Desktop/todai/first_project/profiler_sampling/save_data/duration_sampling.txt'
with open(file_path, 'r') as file:
    lines = file.readlines()

# Initialize variables to store data
function_calls = []
check_durations = []
no_check_durations = []

# Parse the data
current_calls = None
current_check_durations = []
current_no_check_durations = []
isCheck = True

for line in lines:
    line = line.strip()
    if line.startswith('function called:'):
        if current_calls is not None:
            function_calls.append(current_calls)
            check_durations.append(np.mean(current_check_durations))
            no_check_durations.append(np.mean(current_no_check_durations))
        current_calls = int(line.split(' ')[2].replace(',', '').strip())
        current_check_durations = []
        current_no_check_durations = []
    elif line.startswith('check:'):
        isCheck=True
        continue
    elif line.startswith('no check:'):
        isCheck=False
        continue
    elif line.startswith('Duration:'):
        duration = float(line.split(':')[1].replace('ms', '').strip())
        if isCheck:
            current_check_durations.append(duration)
        else:
            current_no_check_durations.append(duration)

# Append the last set of data
if current_calls is not None:
    function_calls.append(current_calls)
    check_durations.append(np.mean(current_check_durations))
    no_check_durations.append(np.mean(current_no_check_durations))

# Plot the data
plt.figure(figsize=(10, 6))
plt.plot(function_calls, check_durations, label='Check', marker='o')
plt.plot(function_calls, no_check_durations, label='No Check', marker='o')
plt.xlabel('Number of Function Calls')
plt.ylabel('Duration (ms)')
plt.title('Average Duration vs Number of Function Calls')
plt.legend()
# plt.xscale('log')
# plt.yscale('log')
plt.grid(True)
plt.savefig('/Users/takehikazuki/Desktop/todai/first_project/profiler_sampling/save_data/check_vs_no_check.png')
plt.close()