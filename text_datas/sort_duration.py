import re

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
        profiler = match.group(4)
        duration = match.group(5)
        
        if key not in data:
            data[key] = {}
        
        data[key][profiler] = duration

print("data", data)

# ソートのためのキーを生成
def sort_key(item):
    key, _ = item
    match = re.match(r'check_for_(\d+)_funcs_(\d+)_called', key)
    if match:
        num_funcs = int(match.group(1))
        num_loops = int(match.group(2))
        return (num_funcs, num_loops)
    return (0, 0)

# データのソート
sorted_data = sorted(data.items(), key=sort_key)

print("sorted_data", sorted_data)

# ソートされたデータの書き出し
with open('/Users/takehikazuki/Desktop/todai/first_project/text_datas/sorted_duration_num_called.txt', 'w') as file:
    for key, profilers in sorted_data:
        if 'no_check' in profilers:
            file.write(f'{key}, no_check: {profilers["no_check"]}ms\n')
        if 'event_based' in profilers:
            file.write(f'{key}, event_based: {profilers["event_based"]}ms\n')
        if 'statistical_worker' in profilers:
            file.write(f'{key}, statistical_worker: {profilers["statistical_worker"]}ms\n')