from utils import new_file, mk_dir

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

def make_homePage(html):
    mk_dir("output")
    new_file("./output/index.html",html)

make_homePage(home_page)