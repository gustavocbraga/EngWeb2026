

def get_interventions(dataset):
    codigo_intervencoes = []
    intervencoes = []

    for r in dataset["reparacoes"]:
        for i in r["intervencoes"]:
            if i["codigo"] not in codigo_intervencoes:
                codigo_intervencoes.append(i["codigo"])
                intervencoes.append(i)

    return intervencoes