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
pattern = re.compile(r'(\w+_for_(\d+)_funcs_(\d+)_called), (\w+): ([\d.]+)ms')

for line in lines:
    match = pattern.match(line.strip())
    if match:
        key = match.group(1)
        num_funcs = int(match.group(2))
        function_called = int(match.group(3))
        profiler = match.group(4)
        duration = float(match.group(5))
        
        if key not in data:
            data[key] = {'num_funcs': num_funcs, 'function_called': function_called}
        
        data[key][profiler] = duration

# オーバーヘッドの倍率の計算
overhead_ratios_event_to_no_check = []
overhead_ratios_stat_to_no_check = []
overhead_ratios_stat_to_event = []
overhead_ratios_event_to_stat = []
# logging.info(f"data: {data}")
print("data", pretty_json(data))

for key, values in data.items():
    if 'no_check' in values:
        no_check_duration = values['no_check']
        if 'event_based' in values and 'statistical_worker' in values:
            event_based_multiplier = values['event_based'] / no_check_duration
            statistical_multiplier = values['statistical_worker'] / no_check_duration
            ratio_stat_to_event = statistical_multiplier / event_based_multiplier
            ratio_event_to_stat = event_based_multiplier / statistical_multiplier
            overhead_ratios_stat_to_event.append((values['num_funcs'], values['function_called'], ratio_stat_to_event))
            overhead_ratios_event_to_no_check.append((values['num_funcs'], values['function_called'], event_based_multiplier))
            overhead_ratios_stat_to_no_check.append((values['num_funcs'], values['function_called'], statistical_multiplier))
            overhead_ratios_event_to_stat.append((values['num_funcs'], values['function_called'], ratio_event_to_stat))

# データの可視化
def plot_overhead_ratios(overhead_ratios, title, xlabel, ylabel):
    funcs = sorted(set([d[0] for d in overhead_ratios]))
    function_called = sorted(set([d[1] for d in overhead_ratios]), reverse=True)
    
    bar_width = 0.1  # バーの幅を狭くする
    index = np.arange(len(funcs))
    
    fig, ax = plt.subplots()
    
    for i, called in enumerate(function_called):
        y = [0] * len(funcs)  # 初期化
        for j, func in enumerate(funcs):
            for d in overhead_ratios:
                if d[0] == func and d[1] == called:
                    y[j] = d[2]
        ax.bar(index + i * bar_width, y, bar_width, label=f'$10^{{{int(np.log10(called))}}}$ called')
    
    ax.set_xlabel(xlabel)
    ax.set_ylabel(ylabel)
    ax.set_title(title)
    ax.set_xticks(index + bar_width * (len(function_called) - 1) / 2)
    ax.set_xticklabels([f'$10^{{{int(np.log10(func))}}}$' for func in funcs])
    ax.legend()
    
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

def plot_overhead_ratios_reversed(overhead_ratios, title, xlabel, ylabel):
    function_called = sorted(set([d[1] for d in overhead_ratios]))
    funcs = sorted(set([d[0] for d in overhead_ratios]), reverse=True)
    
    bar_width = 0.1  # バーの幅を狭くする
    index = np.arange(len(function_called))
    
    fig, ax = plt.subplots()
    
    for i, func in enumerate(funcs):
        y = [0] * len(function_called)  # 初期化
        for j, called in enumerate(function_called):
            for d in overhead_ratios:
                if d[0] == func and d[1] == called:
                    y[j] = d[2]
        ax.bar(index + i * bar_width, y, bar_width, label=f'$10^{{{int(np.log10(func))}}}$ funcs')
    
    ax.set_xlabel(xlabel)
    ax.set_ylabel(ylabel)
    ax.set_title(title)
    ax.set_xticks(index + bar_width * (len(funcs) - 1) / 2)
    ax.set_xticklabels([f'$10^{{{int(np.log10(called))}}}$' for called in function_called])
    ax.legend()
    
    # y軸のラベルを0.5ごとに設定
    ax.yaxis.set_major_locator(plt.MultipleLocator(0.5))
    
    plt.subplots_adjust(bottom=0.2)  # x軸方向のスペースを広げる
    # Save the plot as a PNG file
    save_path = '/Users/takehikazuki/Desktop/todai/first_project/text_datas/saved_figs/for_num_called'
    filename = f"{title.replace(' ', '_').replace('/',':')}.png"
    full_path = os.path.join(save_path, filename)
    plt.savefig(full_path, dpi=300, bbox_inches='tight')
    print(f"Figure saved as {full_path}")

# グラフの生成
plot_overhead_ratios(overhead_ratios_stat_to_event, 'Statistical/Event-based Overhead Ratio by Number of Functions and Loops', 'Number of Functions', 'Statistical/Event-based Overhead Ratio')
plot_overhead_ratios(overhead_ratios_event_to_stat, 'Event-based/Statistical Overhead Ratio by Number of Functions and Loops', 'Number of Functions', 'Event-based/Statistical Overhead Ratio')
plot_overhead_ratios_reversed(overhead_ratios_stat_to_event, 'Statistical/Event-based Overhead Ratio by Number of Loops and Functions', 'Number of Loops', 'Statistical/Event-based Overhead Ratio')
plot_overhead_ratios_reversed(overhead_ratios_event_to_stat, 'Event-based/Statistical Overhead Ratio by Number of Loops and Functions', 'Number of Loops', 'Event-based/Statistical Overhead Ratio')
plot_overhead_ratios(overhead_ratios_event_to_no_check, 'Event-based/No-Check Overhead Ratio by Number of Functions', 'Number of Functions', 'Event-based/No Check Overhead Ratio')
plot_overhead_ratios(overhead_ratios_stat_to_no_check, 'Statistical/No-Check Overhead Ratio by Number of Functions', 'Number of Functions', 'Statistical/No Check Overhead Ratio')
