import os

# 元のディレクトリと新しいディレクトリのパス
source_dir = "/Users/takehikazuki/Desktop/todai/first_project/text_datas/generated_txt/check_num_called"
destination_dir = "/Users/takehikazuki/Desktop/todai/first_project/text_datas/generated_txt/no_check_num_called"

# 新しいディレクトリが存在しない場合は作成
if not os.path.exists(destination_dir):
    os.makedirs(destination_dir)

# 元のディレクトリ内のすべてのテキストファイルを処理
for filename in os.listdir(source_dir):
    if filename.endswith(".txt"):
        source_path = os.path.join(source_dir, filename)
        destination_path = os.path.join(destination_dir, filename)
        
        # ファイルを読み込み、check_defをdefに置き換え
        with open(source_path, 'r') as file:
            content = file.read()
            new_content = content.replace("check_def", "def")
        
        # 新しいディレクトリに保存
        with open(destination_path, 'w') as file:
            file.write(new_content)

print("All files have been processed and saved to the new directory.")