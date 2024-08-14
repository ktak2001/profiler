import re
import matplotlib.pyplot as plt
import logging
import json
import numpy as np
import os
from matplotlib.ticker import FuncFormatter

def pretty_json(data):
    return json.dumps(data, indent=4, ensure_ascii=False)

# データの読み込み
with open('/Users/takehikazuki/Desktop/todai/first_project/text_datas/sorted_duration_num_called.txt', 'r') as file:
    lines = file.readlines()

# データの解析と構造化
data = {}
pattern = re.compile(r'(\w+_for_10_funcs_(\d+)_called), (\w+): ([\d.]+)ms')

for line in lines:
    match = pattern.match(line.strip())
    if match:
        key = match.group(1)
        function_called = int(match.group(2))
        profiler = match.group(3)
        duration = float(match.group(4))
        
        if key not in data:
            data[key] = {'function_called': function_called}
        
        data[key][profiler] = duration

# オーバーヘッドの倍率の計算
overhead_ratios = []
# logging.info(f"data: {data}")
print("data", pretty_json(data))

for key, values in data.items():
    if 'no_check' in values:
        no_check_duration = values['no_check']
        if 'event_based' in values:
            event_based_multiplier = values['event_based'] / no_check_duration
        if 'statistical_worker' in values:
            statistical_multiplier = values['statistical_worker'] / no_check_duration
        overhead_ratios.append((values['function_called'], event_based_multiplier, statistical_multiplier))

# データの可視化
def plot_overhead_ratios(overhead_ratios, title, xlabel, ylabel):
    function_called = sorted(set([d[0] for d in overhead_ratios]))
    
    bar_width = 0.35  # バーの幅を調整
    index = np.arange(len(function_called))
    
    fig, ax = plt.subplots()
    
    event_based_values = [d[1] for d in overhead_ratios]
    statistical_values = [d[2] for d in overhead_ratios]
    
    ax.bar(index, event_based_values, bar_width, label='Event-based')
    ax.bar(index + bar_width, statistical_values, bar_width, label='Statistical')
    
    ax.set_xlabel(xlabel)
    ax.set_ylabel(ylabel)
    ax.set_title(title)
    ax.set_xticks(index + bar_width / 2)
    ax.set_xticklabels(function_called)
    ax.legend()
    
    # x軸のラベルを10⁵のように右上に小さく乗るように表記
    ax.xaxis.set_major_formatter(FuncFormatter(lambda x, _: f'$10^{{{int(np.log10(function_called[int(x)]))}}}$'))
    
    # y軸のラベルを0.5ごとに設定
    ax.yaxis.set_major_locator(plt.MultipleLocator(0.5))
    
    # y軸が1のところで横に点線を追加
    ax.axhline(y=1, color='r', linestyle='--')
    
    plt.subplots_adjust(bottom=0.2)  # x軸方向のスペースを広げる
    save_path = '/Users/takehikazuki/Desktop/todai/first_project/text_datas/saved_figs/for_num_called'
    filename = f"{title.replace(' ', '_').replace('/',':')}.png"
    full_path = os.path.join(save_path, filename)
    plt.savefig(full_path, dpi=300, bbox_inches='tight')
    print(f"Figure saved as {full_path}")

# グラフの生成
plot_overhead_ratios(overhead_ratios, 'Event-based and Statistical Overhead Ratio', 'Number of Function Calls', 'Overhead Ratio')