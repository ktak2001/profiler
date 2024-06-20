import matplotlib
matplotlib.use('Agg')  # Set the backend to 'Agg'

import matplotlib.pyplot as plt
from flask import Flask, request, jsonify
import signal

app = Flask(__name__)

# def handler(signum, frame):
#     raise Exception("Timeout")

# signal.signal(signal.SIGALRM, handler)
# signal.alarm(300)  # Set timeout to 300 seconds

@app.route('/process', methods=['PUT'])
def process_data():
    data = request.json
    processed_data = {"message": "Data received", "received_data": data}
    print("data:", processed_data)
    make_graph(data)
    return jsonify(processed_data), 200

def make_graph(data):
    function_names = [item['funcName'] for item in data]
    start_times = [item['startTime'] for item in data]
    durations = [item['duration'] for item in data]
    parameters = [item['parameters'] for item in data]

    # Create a set of unique function names
    unique_functions = sorted(set(function_names))
    print("unique_functions", unique_functions)
    # Prepare data for plotting
    plot_data = {func: [] for func in unique_functions}
    # print("inside 1")
    for item in data:
        plot_data[item['funcName']].append((item['startTime'], item['duration'], item['parameters']))
    # print("inside 2")
    # Define colors for the bars
    colors = ['tab:blue', 'tab:orange', 'tab:green']

    # Create broken horizontal bar graph
    fig, ax = plt.subplots()

    bar_height = 0.8  # Initial bar height

    # For each unique function, add all its bars with different colors
    # print("inside 3")
    for i, func in enumerate(unique_functions):
        # print(i, "inside 4")
        bars = plot_data[func]
        # Sort bars by start time to handle overlaps
        bars.sort()
        last_end_time = -1
        bar_y = i - 0.4
        # print(i, "inside 5")
        for j, (start, duration, params) in enumerate(bars):
            # print(i, j, "inside 6")
            color = colors[j % len(colors)]
            # Check if the current bar overlaps with the previous one
            if start < last_end_time:
                bar_height = bar_height * 19/20
            else:
                bar_height = 0.8
            last_end_time = start + duration
            ax.broken_barh([(start, duration)], (bar_y, bar_height), facecolors=color)
            # Add parameters as labels
            # ax.text(start + duration / 2, bar_y + bar_height / 2, ', '.join(map(str, params)), va='center', ha='center', color='white', fontsize=8)

    # Set y-ticks to function names
    ax.set_yticks(range(len(unique_functions)))
    ax.set_yticklabels(unique_functions)

    # Set labels and title
    ax.set_xlabel('Time')
    ax.set_title('Function Execution Times')

    # Save the plot to a file instead of displaying it
    plt.savefig('function_execution_times.png')
    print("finished saving figure")
    plt.close(fig)  # Close the figure to free memory

if __name__ == "__main__":
    app.run(debug=True)
