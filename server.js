const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV === 'dev';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();

    /* server.use((req, res, next) => {
        if (req.headers['x-forwarded-proto'] !== 'https') {
            res.redirect('https://' + req.headers.host + req.url);
        } else {
            next();
        }
    }); */

    server.get('*', (req, res) => {
        return handle(req, res);
    });

    server.listen(process.env.PORT, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${process.env.PORT}`);
    });
});