const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV === 'development';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();

    // Aumentando o limite de tamanho de corpo para 2MB
    server.use(express.json({ limit: '2mb' }));
    server.use(express.urlencoded({ limit: '2mb', extended: true }));

    server.use((req, res, next) => {
        if (req.headers['x-forwarded-proto'] !== 'https' || req.headers.host !== process.env.PROD_URL) {
            res.redirect('https://' + process.env.PROD_URL + req.url);
        } else {
            next();
        }
    });

    server.all('*', (req, res) => {
        return handle(req, res)
    })

    // Middleware de tratamento de erros
    server.use((err, req, res, next) => {
        console.error('Erro capturado:', err);
        // Lógica adicional para manipular o erro, como enviar uma resposta de erro ao cliente
        res.status(500).json({ error: 'Ocorreu um erro interno.' });
    });

    server.listen(process.env.PORT, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${process.env.PORT}`);
    });
});