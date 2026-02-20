const http = require('http')
const axios = require('axios')

http.createServer(async function(req,res){
    if(req.url == "/reparacoes"){
        const response = await axios.get('http://localhost:3000/reparacoes')
        const reparacoes = response.data 

        let corpo = `
            <h1> Reparações </h1>
            <table border="1">
                <tr>
                    <th>Nome</th><th>NIF</th><th>Data</th><th>Viatura</th><th>Nº Intervenções</th>
                </tr>
        `

        reparacoes.forEach(r => {
            corpo += `
                <tr>
                    <td>${r.nome}</td>
                    <td>${r.nif}</td>
                    <td>${r.data}</td>
                    <td>${r.viatura.matricula}</td>
                    <td>${r.nr_intervencoes}</td>
                </tr>
            `
        });

        corpo += "</table>"

        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.end(corpo); 
        
    } else if (req.url == "/intervencoes") { 
        const response = await axios.get('http://localhost:3000/reparacoes')
        const reparacoes = response.data 
        let intervencoes = {}

        reparacoes.forEach( r => {
            r.intervencoes.forEach( i => {
                if (!(i.codigo in intervencoes)){
                    intervencoes[i.codigo] = {
                        nome: i.nome,
                        contagem: 1
                    }
                }
                intervencoes[i.codigo].contagem += 1
            })
        })

        let corpo = `
            <h1>Intervenções</h1>
            <table border="1">
                <tr>
                    <th>ID</th><th>Reparação</th><th>contagem</th>
                </tr>
        `

        Object.keys(intervencoes).sort().forEach(id => {
            corpo += `
                <tr>
                    <td>${id}</td>
                    <td>${intervencoes[id].nome}</td>
                    <td>${intervencoes[id].contagem}</td>
                </tr>
            `;
        });

        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.end(corpo); 

    }else if (req.url == "/viaturas") {
        try {
            const response = await axios.get('http://localhost:3000/reparacoes');
            const reparacoes = response.data;

            let viaturasContagem = {};

            reparacoes.forEach(r => {
                const v = r.viatura;
                const modelo = v.modelo;
                const marca = v.marca;

                if (!(modelo in viaturasContagem)) {
                    viaturasContagem[modelo] = {
                        marca: marca,
                        contagem: 0
                    };
                }
                viaturasContagem[modelo].contagem += 1;
            });

            let corpo = `
                <h2>Registo de Viaturas Intervencionadas</h2>
                <table border="1">
                    <tr>
                        <th>Marca</th>
                        <th>Modelo</th>
                        <th>Nº de Reparações</th>
                    </tr>
            `;

            Object.keys(viaturasContagem).sort().forEach(mod => {
                corpo += `
                    <tr>
                        <td>${viaturasContagem[mod].marca}</td>
                        <td>${mod}</td>
                        <td>${viaturasContagem[mod].contagem}</td>
                    </tr>
                `;
            });

            corpo += "</table><p><a href='/'>Voltar</a></p>";

            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.end(corpo);

        } catch (error) {
            res.writeHead(500, {'Content-Type': 'text/html; charset=utf-8'});
            res.end("<p>Erro ao obter dados das viaturas.</p>");
        }
    }else{
        res.writeHead(520, {'Content-Type': 'text/html; charset=utf-8'});
        res.end("<p>Pedidos não suportado</p>");
    }
}).listen(7777)

console.log("Servidor a correr na porta 7777")
  
