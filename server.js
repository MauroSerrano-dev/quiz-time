var express = require('express');
var secure = require('ssl-express-www');
var app = express();

app.use(secure);

app.get('/', (req, res) => {
  res.send('Olá, mundo!');
});

var port = process.env.PORT || 3000;
app.listen(port, () => console.log('Server listening.'));
