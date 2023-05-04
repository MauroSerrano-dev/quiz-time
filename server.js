console.log('Arquivo server.js executado');
const { createServer } = require('https');
const express = require('express');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync('./certificates/key.pem'),
  cert: fs.readFileSync('./certificates/cert.pem')
};

app.prepare().then(() => {
  const server = express();

  // Redireciona todas as solicitações HTTP para HTTPS
  server.use((req, res, next) => {
    if (req.secure) {
      next();
    } else {
      res.redirect(`https://${req.headers.host}${req.url}`);
    }
  });

  // Lida com as requisições que chegam na raiz da aplicação
  server.get('/', (req, res) => {
    return app.render(req, res, '/', req.query);
  });

  // Lida com todas as outras requisições
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  // Cria o servidor HTTPS
  createServer(httpsOptions, server).listen(process.env.PORT || 3000, (err) => {
    if (err) throw err;
    console.log(`> Ready on https://localhost:${process.env.PORT || 3000}`);
  });
});
