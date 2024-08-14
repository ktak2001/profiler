import sys
import math

def generate_functions(filename, num_funcs, time_complexity):
    with open(f"generated_txt/{filename}", 'w') as f:
        # Calculate k
        k = math.log10(time_complexity // num_funcs)
        
        # Calculate loop counts
        if (num_funcs==1):
            loop_count_func1 = 10 ** int(k)
        else:
            loop_count_func1 = 10 ** math.ceil(k / 2)
        loop_count_others = 10 ** math.floor(k / 2)

        # Write the initial function (func1)
        f.write("check_def func1() {\n")
        f.write("  i=0;\n")
        f.write(f"  while (i<{loop_count_func1}) {{\n")
        f.write("    i = i+1;\n")
        for j in range(2, num_funcs + 1):
            f.write(f"    func{j}();\n")
        f.write("  };\n")
        f.write("};\n\n")

        # Write the remaining functions (func2 to func{num_funcs})
        for i in range(2, num_funcs + 1):
            f.write(f"check_def func{i}() {{\n")
            f.write("  i=0;\n")
            f.write(f"  while (i<{loop_count_others}) {{\n")
            f.write("    i = i+1;\n")
            f.write("  };\n")
            f.write("};\n\n")

        # Write the final call to func1
        f.write("func1();\n")

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Usage: python3 generate_txt_files.py <filename> <num_funcs> <time_complexity>")
        sys.exit(1)
    
    filename = sys.argv[1]
    num_funcs = int(sys.argv[2])
    time_complexity = int(sys.argv[3])
    generate_functions(filename, num_funcs, time_complexity)
    print(f"File saved as {filename}")