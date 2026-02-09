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

def get_interventions(dataset):
    codigo_intervencoes = []
    intervencoes = []

    for r in dataset["reparacoes"]:
        for i in r["intervencoes"]:
            if i["codigo"] not in codigo_intervencoes:
                codigo_intervencoes.append(i["codigo"])
                intervencoes.append(i)

    return intervencoes

