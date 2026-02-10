import json, os, shutil

def open_json(filename):
    with open(filename, encoding="utf-8") as f:
        data = json.load(f)
    return data

def mk_dir(my_path):
    if not os.path.exists(my_path):
        os.mkdir(my_path)
    else:
        shutil.rmtree(my_path)
        os.mkdir(my_path)

def new_file(filename, content):
    with open(filename,"w", encoding="utf-8") as f:
        f.write(content)



