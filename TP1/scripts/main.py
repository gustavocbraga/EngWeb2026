from utils import new_file, mk_dir, open_json
from data import get_interventions

data = open_json("../dataset_reparacoes.json")
intervencoes = get_interventions(data)
reparacoes = data["reparacoes"]
viaturas_dict = {}
reps_vinculadas = {}
mk_dir("../output")


# ----------------- Home Page -----------------

dados_consultaveis = f'''
    <li> <a href="reparacoes.html"> Reparações </a> </li>
    <li> <a href="intervencoes.html"> Intervenções </a> </li>
    <li> <a href="automoveis.html"> Marcas e modelos </a> </li>
'''

home_page = f'''
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title> Oficina Automovel </title>
    </head>
    <body>
        <h1 style="text-align: center;"> Oficina automovel </h1>
        <hr>
        <h2> Dados consultaveis </h2>
        <ul>
            {dados_consultaveis}
        </ul>
    </body>
    </html>
'''

new_file("../output/index.html",home_page)

# --------------- Reparações ---------------

rep_links = ""

mk_dir("../output/reparacoes")

for i, rep in enumerate(reparacoes):
    rep["id"] = i + 1
    rep_links += f'''
        <li><a href="reparacoes/{rep["id"]}.html">{rep["data"]} - {rep["nome"]} ({rep["viatura"]["matricula"]})</a></li>
    '''

    links_inter = ""

    for inter in rep["intervencoes"]:
        links_inter += f'<li><a href="../intervencoes/{inter["codigo"]}.html">{inter["nome"]}</a></li>'
        # --------------------------------------------------------------------------- #
        cod_inter = inter["codigo"]
        
        if cod_inter not in reps_vinculadas:
            reps_vinculadas[cod_inter] = []
        
        if rep["id"] not in reps_vinculadas[cod_inter]:
            reps_vinculadas[cod_inter].append(rep["id"])

        # ---------- Agrupar viaturas por marca e modelo ----------
        v_key = f"{rep['viatura']['marca']}-{rep['viatura']['modelo']}"
        if v_key not in viaturas_dict:
            viaturas_dict[v_key] = []
        viaturas_dict[v_key].append(rep)


    rep_ind_html = f'''
        <html>
        <body>
            <h1>Reparação: {rep['id']}</h1>
            <p><b>Data:</b> {rep['data']}</p>
            <p><b>Cliente:</b> {rep['nome']} (NIF: {rep['nif']})</p>
            <p><b>Viatura:</b> {rep['viatura']['marca']} {rep['viatura']['modelo']}</p>
            <h3>Intervenções Realizadas:</h3>
            <ul>{links_inter}</ul>
            <a href="../index.html">Voltar</a>
        </body></html>
    '''
    new_file(f"../output/reparacoes/{rep['id']}.html", rep_ind_html)\
    



rep_html = f'''
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title> Oficina Automovel </title>
    </head>
    <body>
        <h1 style="text-align: center;"> Reparações </h1>
        <hr>
        <h2> Lista de reparações </h2>
        <ul>
            {rep_links}
        </ul>
    </body>
    </html>
'''

new_file("../output/reparacoes.html", rep_html)

# --------------- intervenções ---------------

mk_dir("../output/intervencoes")

reps_vinculadas_list = ""

in_links = ""

for i, inter in enumerate(intervencoes):
    in_links += f'''
        <li><a href="intervencoes/{inter["codigo"]}.html">{inter["codigo"]} - {inter["nome"]} </a></li>
    '''

    for rep_id in reps_vinculadas[inter["codigo"]]:
        reps_vinculadas_list += f'''
            <li><a href="reparacoes/{rep_id}.html">Reparação: {rep_id} </a></li>
        '''


    int_ind_html = f'''
        <!DOCTYPE html>
        <html>
        <body>
            <h1>Intervenção: {inter['codigo']}</h1>
            <p><b>nome:</b> {inter['nome']} </p>
            <p><b>Descrição:</b> {inter['descricao']}</p>
            <h3>Reparações vinculadas:</h3>
            <ul>{reps_vinculadas_list}</ul>
            <a href="../index.html">Voltar</a>
        </body>
        </html>
    '''
    new_file(f"../output/intervencoes/{inter["codigo"]}.html", int_ind_html)

int_html = f'''
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title> Oficina Automovel </title>
    </head>
    <body>
        <h1 style="text-align: center;"> Intervenções </h1>
        <hr>
        <h2> Lista de intervenções </h2>
        <ul>
            {in_links}
        </ul>
    </body>
    </html>
'''

new_file("../output/intervencoes.html", int_html)


# --------------- Marcas e modelos ---------------
mk_dir("../output/automoveis")

html_v_list = ""
viaturas_ordenadas = sorted(viaturas_dict.items())

for v_key, reps in viaturas_ordenadas:
    safe_name = v_key.replace(" ", "_")
    html_v_list += f'''
        <li><a href="automoveis/{safe_name}.html">{v_key}</a></li>
    '''
    
    reps_v_links = ""
    
    reps_ordenadas = sorted(reps, key=lambda x: x["data"], reverse=True)
    
    for r in reps_ordenadas:
        reps_v_links += f'''
            <li><a href="../reparacoes/{r["id"]}.html">{r["data"]} - {r["viatura"]["matricula"]}</a></li>
        '''

    html_v_ind = f'''
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Oficina Automóvel</title>
        </head>
        <body>
            <h1>{v_key}</h1>
            <h2> Histórico de reparações: </h2>
            <ul>
                {reps_v_links}
            </ul>
            <br>
            <a href="../index.html">Voltar</a>
        </body>
        </html>
    '''
    
    new_file(f"../output/automoveis/{safe_name}.html", html_v_ind)

viaturas_html = f'''
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title> Oficina Automóvel </title>
    </head>
    <body>
        <h1 style="text-align: center;"> Marcas e Modelos </h1>
        <hr>
        <h2> Lista de Viaturas </h2>
        <ul>
            {html_v_list}
        </ul>
        <br>
        <a href="index.html">Voltar à Página Inicial</a>
    </body>
    </html>
'''

new_file("../output/automoveis.html", viaturas_html)


