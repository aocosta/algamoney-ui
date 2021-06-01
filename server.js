// Pequeno servidor http para servir localmente a aplicação compilada (ng build --prod)

// Importa o módulo express
const express = require('express');
// Cria um objeto que representa um servidor web
const app = express();

// Sirvo todos os arquivos estáticos que estão na pasta onde foi criado os arquivos de build (dist)
app.use(express.static(__dirname + '/dist/algamoney-ui'));

// Direciona a chamada para a página principal da aplicação
app.get('/*', function(req, res) {
  res.sendFile(__dirname + '/dist/algamoney-ui/index.html');
});

// Fica escutando a porta onde se encontra está a aplicação
// 4200 - porta do angular
// process.env.PORT - porta dinâmica que será fornecida por um servidor na web (heroku)
// app.listen(4200);
app.listen(process.env.PORT || 4200);
