const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV === 'development';
const app = next({ dev });
const handle = app.getRequestHandler();
const apiRoute = require('./src/pages/api/checkoutSession');

app.prepare().then(() => {
    const server = express();

    server.use((req, res, next) => {
        if (req.headers['x-forwarded-proto'] !== 'https' || req.headers.host !== process.env.SITE_URL) {
            res.redirect('https://' + process.env.SITE_URL + req.url);
        } else {
            next();
        }
    });

    server.all('/api/checkoutSession', apiRoute);

    server.all('*', (req, res) => {
        return handle(req, res)
    })

    server.listen(process.env.PORT, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${process.env.PORT}`);
    });
});