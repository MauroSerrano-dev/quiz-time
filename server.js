import sslRedirect from 'heroku-ssl-redirect';
import express from 'express';
const app = express();

// enable ssl redirect
app.use(sslRedirect());

app.get('/', (req, res) => {
    res.send('hello world');
});

app.listen(process.env.PORT || 3000);