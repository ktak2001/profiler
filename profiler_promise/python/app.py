import matplotlib
matplotlib.use('Agg')  # Set the backend to 'Agg'

import matplotlib.pyplot as plt
from flask import Flask, request, jsonify

app = Flask(__name__)

# def handler(signum, frame):
#     raise Exception("Timeout")

# signal.signal(signal.SIGALRM, handler)
# signal.alarm(300)  # Set timeout to 300 seconds

@app.route('/process_promise', methods=['PUT'])
def process_data():
    data = request.json
    funcs_per_10ms = data['funcs_per_10ms']
    unique_funcs = data['unique_funcs']
    processed_data = {"message": "Data received", "received_data": data}
    print("data:", processed_data)
    make_graph(unique_funcs, funcs_per_10ms)
    return jsonify(processed_data), 200

def make_graph(unique_functions, funcs_per_10ms):
    funcs_Dict = {}
    for i, funcs in enumerate(funcs_per_10ms):
        for j, func in enumerate(funcs):
            keyName = '_' + str(func['uniqueId'])
            if funcs_Dict.get(keyName) is None:
                funcs_Dict[keyName] = {
                    "startTime": (i-1)*10,
                    "duration": 10,
                    "functionName": func['funcName']
                }
            else:
                funcs_Dict[keyName]['duration'] += 10
    funcs_list = list(funcs_Dict.values())
    funcs_list.sort(key=lambda x: x['startTime'])
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
    ax.set_title('Function Execution Times')

    # Save the plot to a file instead of displaying it
    plt.savefig('function_execution_times.png')
    print("finished saving figure")
    plt.close(fig)  # Close the figure to free memory

if __name__ == "__main__":
    app.run(debug=True)
