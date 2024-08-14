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

def make_graph(funcs_per_10ms, unique_functions):
    function_array = [None] * (len(unique_functions) + 1)
    for funcName, idx in unique_functions.items():
        function_array[idx] = funcName

    funcs_Dict = {}
    for i, funcs in enumerate(funcs_per_10ms):
        for j, func in enumerate(funcs):
            if j % 2 == 0 and j < len(funcs) - 1:
                keyName = '_' + str(funcs[j+1])
                if funcs_Dict.get(keyName) is None:
                    funcs_Dict[keyName] = {
                        "startTime": (i - 1),
                        "duration": 1,
                        "functionName": function_array[func]
                    }
                else:
                    funcs_Dict[keyName]['duration'] += 1

    funcs_list = list(funcs_Dict.values())
    funcs_list.sort(key=lambda x: x['startTime'])

    # Create the broken horizontal bar graph
    function_names = [item['functionName'] for item in funcs_list]
    unique_functions = sorted(set(function_names))
    print("unique_functions", unique_functions)

    # Prepare data for plotting
    plot_data = {func: [] for func in unique_functions}
    for item in funcs_list:
        plot_data[item['functionName']].append((item['startTime'], item['duration']))

    # Define colors for the bars
    colors = ['tab:blue', 'tab:orange', 'tab:green']

    # Create broken horizontal bar graph
    fig, ax = plt.subplots()
    bar_height = 0.8  # Initial bar height

    for i, func in enumerate(unique_functions):
        bars = plot_data[func]
        # Sort bars by start time to handle overlaps
        bars.sort()
        last_end_time = -1
        bar_y = i - 0.4

        for j, (start, duration) in enumerate(bars):
            color = colors[j % len(colors)]
            # Check if the current bar overlaps with the previous one
            if start < last_end_time:
                bar_height = bar_height * 19 / 20
            else:
                bar_height = 0.8
            last_end_time = start + duration
            ax.broken_barh([(start, duration)], (bar_y, bar_height), facecolors=color)

    # Set y-ticks to function names
    ax.set_yticks(range(len(unique_functions)))
    ax.set_yticklabels(unique_functions)

    # Set labels and title
    ax.set_xlabel('Time')
    ax.set_title('statistical_worker: Function Execution Times')

    # Save the plot to a file instead of displaying it
    plt.savefig('/Users/takehikazuki/Desktop/todai/first_project/text_datas/statistical_worker_97funcs.png')
    print("finished saving figure")
    plt.close(fig)  # Close the figure to free memory

if __name__ == "__main__":
    app.run(debug=True, port=5001)
