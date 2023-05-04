import express from 'express';
const app = express();

// enable ssl redirect
app.get('*', (req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
        res.redirect('https://' + req.headers.host + req.url);
    } else {
        next();
    }
});


app.listen(process.env.PORT || 3000);