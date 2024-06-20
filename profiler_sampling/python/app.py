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

@app.route('/process_sampling', methods=['PUT'])
def process_data():
    data = request.json
    funcs_per_10ms = data['funcs_per_10ms']
    unique_funcs = data['unique_funcs']
    processed_data = {"message": "Data received", "received_data": data}
    print("data:", processed_data)
    make_graph(funcs_per_10ms, unique_funcs)
    return jsonify(processed_data), 200

def make_graph(funcs_per_10ms, unique_funcs):
    # Create a set of unique function names
    unique_functions = sorted(unique_funcs)
    print("unique_functions", unique_functions)

    # Define colors for the bars
    colors = ['tab:blue', 'tab:orange', 'tab:green']

    # Create broken horizontal bar graph
    fig, ax = plt.subplots()

    bar_height = 0.8  # Initial bar height

    # For each time slice in array1, add bars for each function
    for i, funcs in enumerate(funcs_per_10ms):
        start_time = i * 10  # Each time slice is 10ms
        for j, func in enumerate(funcs):
            if func in unique_functions:
                func_index = unique_functions.index(func)
                bar_y = func_index - 0.4
                color = colors[j % len(colors)]
                ax.broken_barh([(start_time, 10)], (bar_y, bar_height), facecolors=color)

    # Set y-ticks to function names
    ax.set_yticks(range(len(unique_functions)))
    ax.set_yticklabels(unique_functions)

    # Set labels and title
    ax.set_xlabel('Time (ms)')
    ax.set_title('Function Execution Times')

    # Save the plot to a file instead of displaying it
    plt.savefig('function_execution_times.png')
    print("finished saving figure")
    plt.close(fig)  # Close the figure to free memory

if __name__ == "__main__":
    app.run(debug=True)
