const axios = require('axios')
const http = require('http')
const u = require('./util')

http.createServer(async function (req, res) {
    switch(req.method){
        case "GET":
            if(req.url == "/"){
                var corpo = `
                    <h2> ${u.link("http://localhost:7777/alunos", "alunos")} </h2>
                    <h2> ${u.link("http://localhost:7777/cursos", "Cursos")} </h2>
                    <h2> ${u.link("http://localhost:7777/instrumentos", "Instrumentos") } </h2>
                `
                var pagina = u.pagina("Início", corpo)
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8'})
                res.end(pagina)
            }
            else if(req.url == "/alunos"){
                axios.get("http://localhost:3000/alunos")
                    .then(resp => {
                        let alunos = resp.data
                        let rows = alunos.map(a => `
                            <tr>
                                <td>${a.id}</td><td>${a.nome}</td><td>${a.instrumento}</td>
                            </tr>
                        `).join("")
                        
                        let corpo = `
                            <p>${u.link("/", "Voltar")}</p>
                            <table class="w3-table-all w3-hoverable">
                                <tr class="w3-teal"><th>ID</th><th>Nome</th><th>Instrumento</th></tr>
                                ${rows}
                            </table>
                            <p>${u.link("/", "Voltar")}</p>
                        `
                        res.end(u.pagina("Listagem de Alunos", corpo))
                    })
                    .catch(err => res.end(u.pagina("Erro", err)))
            }    
            else if(req.url == "/cursos"){
                axios.get("http://localhost:3000/cursos")
                    .then(resp => {
                        let cursos = resp.data
                        let rows = cursos.map(c => `
                            <tr>
                                <td>${c.id}</td><td>${c.designacao}</td><td>${c.duracao}</td>
                            </tr>
                        `).join("")
                        
                        let corpo = `
                            <p>${u.link("/", "Voltar")}</p>
                            <table class="w3-table-all w3-hoverable">
                                <tr class="w3-teal"><th>ID</th><th>Designação</th><th>Duração</th></tr>
                                ${rows}
                            </table>
                            <p>${u.link("/", "Voltar")}</p>
                        `
                        res.end(u.pagina("Listagem de Cursos", corpo))
                    })
                    .catch(err => res.end(u.pagina("Erro", err)))
            }
            else if(req.url == "/instrumentos"){
                axios.get("http://localhost:3000/instrumentos")
                    .then(resp => {
                        let instrumentos = resp.data
                        let rows = instrumentos.map(i => `
                            <tr>
                                <td>${i.id}</td><td>${i["#text"]}</td>
                            </tr>
                        `).join("")
                        
                        let corpo = `
                            <p>${u.link("/", "Voltar")}</p>
                            <table class="w3-table-all w3-hoverable">
                                <tr class="w3-teal"><th>ID</th><th>Nome</th></tr>
                                ${rows}
                            </table>
                            <p>${u.link("/", "Voltar")}</p>
                        `
                        res.end(u.pagina("Listagem de Instrumentos", corpo))
                    })
                    .catch(err => res.end(u.pagina("Erro", err)))
            }
            break;
        default:
            res.end(u.pagina("Erro", "Método não suportado."))  
    }
}).listen(7777)

console.log("Servidor a executar na porta 7777")