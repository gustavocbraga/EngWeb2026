var http = require('http')
var axios = require('axios')
var static = require('./static.js')
const { parse } = require('querystring');
var templates = require('./templates.js')

// Aux functions
function generateHexID() {
    return [...Array(24)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
}

function collectRequestBodyData(request, callback) {
    if(request.headers['content-type'] === 'application/x-www-form-urlencoded') {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            callback(parse(body));
        });
    }
    else {
        callback(null);
    }
}

http.createServer((req,res) => {
    // Logger: what was requested and when it was requested
    var d = new Date().toISOString().substring(0, 16)
    console.log(req.method + " " + req.url + " " + d)

    // Handling request
    if(static.staticResource(req)){
        static.serveStaticResource(req, res)
    }
    else{
        switch(req.method){
            case "GET":
                if(req.url == '/' || req.url == '/emd'){
                    axios.get("http://localhost:3000/exames")
                    .then(resp => {
                        var exames = resp.data
                        res.writeHead(200, {'Content-Type' : 'text/html;charset=utf-8'})
                        res.write(templates.emdListPage(exames))
                        res.end()
                    })
                    .catch(erro => {
                        res.writeHead(501, {'Content-Type' : 'text/html;charset=utf-8'})
                        res.write('<p>Não foi possível obter os dados dos EMD</p>')
                        res.write('<p>' + erro + '</p>')
                        res.end()
                    })
                }
                else if(/\/emd\/delete\/[0-9a-z]+$/i.test(req.url)){
                    var idExame = req.url.split("/")[3]
                    console.log(req.url)

                    axios.delete("http://localhost:3000/exames/" + idExame)
                    .then(resp => {
                        var exame = resp.data
                        res.writeHead(302, {'location' : '/'})
                        res.end()
                    })
                    .catch(erro => {
                        res.writeHead(501, {'Content-Type' : 'text/html;charset=utf-8'})
                        res.write('<p>Não foi possível deletar exame</p>')
                        res.write('<p>' + erro + '</p>')
                        res.end()
                    })
                }
                else if(req.url == '/emd/registo'){
                    res.writeHead(200, {'Content-Type' : 'text/html;charset=utf-8'})
                    res.write(templates.emdForm(d))
                    res.end()
                }
                else if(/\/emd\/registar\/[0-9a-z]+$/i.test(req.url)){
                    var idemd = req.url.split("/")[3]
                    console.log(idemd)

                    axios.get("http://localhost:3000/exames/" + idemd)
                    .then(resp => {
                        var exame = resp.data
                        res.writeHead(200, {'Content-Type' : 'text/html;charset=utf-8'})
                        res.write(templates.emdFormData(exame, d))
                        res.end()
                    })
                    .catch(erro => {
                        res.writeHead(501, {'Content-Type' : 'text/html;charset=utf-8'})
                        res.write('<p>Não foi possível deletar exame</p>')
                        res.write('<p>' + erro + '</p>')
                        res.end()
                    })
                }
                else if(/\/emd\/[0-9a-z]+$/i.test(req.url)){
                    var idExame = req.url.split("/")[2]
                    console.log(req.url)

                    axios.get("http://localhost:3000/exames/" + idExame)
                    .then(resp => {
                        var exame = resp.data
                        res.writeHead(200, {'Content-Type' : 'text/html;charset=utf-8'})
                        res.write(templates.emdPage(exame, d))
                        res.end()
                    })
                    .catch(erro => {
                        res.writeHead(501, {'Content-Type' : 'text/html;charset=utf-8'})
                        res.write('<p>Não foi possível obter os dados dos EMD</p>')
                        res.write('<p>' + erro + '</p>')
                        res.end()
                    })
                }
                break
            case "POST":
                case "POST":
                    if (req.url == '/emd') {
                        collectRequestBodyData(req, result => {
                            if (result) {
                                axios.get("http://localhost:3000/exames")
                                    .then(listResp => {
                                        const currentData = listResp.data;
                                        
                                        const finalData = {
                                            id: result.id || generateHexID(),
                                            index: currentData.length, 
                                            dataEMD: result.dataEMD,
                                            nome: {
                                                primeiro: result.primeiro,
                                                último: result.ultimo
                                            },
                                            idade: parseInt(result.idade),
                                            género: result.género,
                                            morada: result.morada || "", 
                                            modalidade: result.modalidade,
                                            clube: result.clube,
                                            email: result.email,
                                            federado: result.federado === "true",
                                            resultado: result.resultado === "true"
                                        };

                                        return axios.post("http://localhost:3000/exames", finalData);
                                    })
                                    .then(resp => {
                                        console.log("Registo inserido:", resp.data.id);
                                        res.writeHead(201, { 'Content-Type': 'text/html;charset=utf-8', 'location': '/' });
                                        res.write('<h2>Sucesso!</h2>');
                                        res.write('<p>Registo inserido: ' + JSON.stringify(resp.data) + '</p>');
                                        res.end('<address><a href="/">Voltar</a></address>');
                                    })
                                    .catch(erro => {
                                        res.writeHead(503, { 'Content-Type': 'text/html;charset=utf-8' });
                                        res.write('<p>Não foi possível inserir o registo</p>');
                                        res.write('<p>' + erro + '</p>');
                                        res.end('<address><a href="/">Voltar</a></address>');
                                    });
                            } 
                        });
                    }
                    else if (/\/emd\/[0-9a-z]+$/i.test(req.url)) {
                        collectRequestBodyData(req, result => {
                            if (result) {
                                axios.get("http://localhost:3000/exames")
                                    .then(listResp => {
                                        const currentData = listResp.data;
                                        
                                        const finalData = {
                                            id: result.id || generateHexID(),
                                            index: currentData.length, 
                                            dataEMD: result.dataEMD,
                                            nome: {
                                                primeiro: result.primeiro,
                                                último: result.ultimo
                                            },
                                            idade: parseInt(result.idade),
                                            género: result.género,
                                            morada: result.morada || "", 
                                            modalidade: result.modalidade,
                                            clube: result.clube,
                                            email: result.email,
                                            federado: result.federado === "true",
                                            resultado: result.resultado === "true"
                                        };

                                        return axios.put("http://localhost:3000/exames/" + finalData.id, finalData);
                                    })
                                    .then(resp => {
                                        console.log("Registo inserido:", resp.data.id);
                                        res.writeHead(201, { 'Content-Type': 'text/html;charset=utf-8', 'location': '/' });
                                        res.write('<h2>Sucesso!</h2>');
                                        res.write('<p>Registo inserido: ' + JSON.stringify(resp.data) + '</p>');
                                        res.end('<address><a href="/">Voltar</a></address>');
                                    })
                                    .catch(erro => {
                                        res.writeHead(503, { 'Content-Type': 'text/html;charset=utf-8' });
                                        res.write('<p>Não foi possível inserir o registo</p>');
                                        res.write('<p>' + erro + '</p>');
                                        res.end('<address><a href="/">Voltar</a></address>');
                                    });
                            } 
                        });
                    }
                    break;
        }
    }
}).listen(7777)

console.log("Servidor a escutar na porta 7777")