const express = require('express');
const sslRedirect = require('express-sslify');

const server = express();

if (process.env.NODE_ENV === 'production') {
  server.use(sslRedirect());
}

// Restante do código do seu servidor

module.exports = server;
