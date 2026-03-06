var express = require('express');
var axios = require('axios');
var router = express.Router();

/* Aux functions */
var participacoes = {};

async function getParticipacoes() {
    try {
        var resp = await axios.get('http://localhost:3000/filmes');
        var filmes = resp.data;

        filmes.forEach(f => {
          f.cast.forEach(a => {
              if (!(a.id in participacoes)) {
                  participacoes[a.id] = 1;
              } else {
                  participacoes[a.id]++;
              }
          });
        });
        return participacoes;
    } catch (err) {
        console.error(err);
        return {};
    }
}

getParticipacoes()

/* GET home page. */
router.get(['/','/filmes'], function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16);
  axios.get('http://localhost:3000/filmes')
  .then(resp => {
    var filmes = resp.data;
    res.render('index', {list: filmes, data: d});
  })
});

router.get('/atores', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16);
  axios.get('http://localhost:3000/atores')
  .then(resp => {
    var actors = resp.data;
    res.render('actors', {
      atores: actors, 
      contagem: participacoes,
      data: d
    });
  })
});

router.get('/filmes/:id', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16);
  axios.get('http://localhost:3000/filmes/'+req.params.id)
  .then(resp => {
    var film = resp.data;
    res.render('film', {filme: film, data: d});
  })
});

module.exports = router;
