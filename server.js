const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV === 'dev';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();

    /*     if (!dev) { */
    server.use((req, res, next) => {
        if (req.secure) {
            next();
        } else {
            res.redirect('https://' + req.headers.host + req.url);
        }
    });
    /*     } */

    server.get('*', (req, res) => {
        return handle(req, res);
    });

    server.listen(3000, (err) => {
        if (err) throw err;
        console.log('> Ready on http://localhost:3000');
    });
});