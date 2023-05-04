const express = require('express');
const httpToHttps = require('express-http-to-https').redirectToHTTPS;

const app = express();

// Redireciona todas as solicitações HTTP para HTTPS
app.use(httpToHttps({
    trustXFPHeader: true
}));

// Middleware de logging
app.use((req, res, next) => {
    console.log(`Received ${req.method} request to ${req.url}`);
    next();
});

// Rota principal
app.get('/', (req, res) => {
    console.log('Acessou a rota principal');
    res.send('Olá, mundo!');
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Servidor iniciado na porta ${process.env.PORT || 3000}`);
});
