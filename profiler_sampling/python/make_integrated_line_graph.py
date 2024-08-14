import matplotlib.pyplot as plt
import pandas as pd

# Read the CSV data
data = pd.read_csv('../save_data/duration.csv')

# Set the x-axis values (function calls)
x = [1000, 10000, 100000, 1000000, 10000000]

# Plot each row with a different color
plt.figure()
plt.plot(x, data.loc[0, '1000':'10000000'], label='statistical_promise', color='blue')
# plt.plot(x, data.loc[1, '1000':'10000000'], label='statistical_worker', color='green')
plt.plot(x, data.loc[2, '1000':'10000000'], label='event_based', color='red')
plt.plot(x, data.loc[3, '1000':'10000000'], label='no_profiled', color='purple')

# Set the labels and title
plt.xlabel('Function Calls')
plt.ylabel('Duration (ms)')
plt.title('OverHead for each Profiler (Log Scale)')
plt.xscale('log')  # Set x-axis to logarithmic scale for better visualization
plt.yscale('log')  # Set x-axis to logarithmic scale for better visualization

# Add a legend
plt.legend()

# Save the plot to a file
plt.savefig('../save_data/function_call_duration_analysis_log_log.png')

# Show the plot
plt.show()

# Plot without log scale
plt.figure()
plt.plot(x, data.loc[0, '1000':'10000000'], label='statistical_promise', color='blue')
plt.plot(x, data.loc[1, '1000':'10000000'], label='statistical_worker', color='green')
plt.plot(x, data.loc[2, '1000':'10000000'], label='event_based', color='red')
plt.plot(x, data.loc[3, '1000':'10000000'], label='no_profiled', color='purple')

# Set the labels and title
plt.xlabel('Function Calls')
plt.ylabel('Duration (ms)')
plt.title('Function Call Duration Analysis (Linear Scale)')

# Add a legend
plt.legend()

# Save the plot to a file
plt.savefig('../save_data/function_call_duration_analysis_linear.png')

# Show the plot
plt.show()