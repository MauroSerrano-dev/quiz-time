const express = require('express');
const httpToHttps = require('express-http-to-https').redirectToHTTPS;

const app = express();

// Redireciona todas as solicitações HTTP para HTTPS
app.use(httpToHttps({
    trustXFPHeader: true
}));

// Adicione as rotas do seu aplicativo aqui
app.get('/', (req, res) => {
    res.send('Olá, mundo!');
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Servidor iniciado na porta ${process.env.PORT || 3000}`);
});