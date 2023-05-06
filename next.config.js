const sslRedirect = require('next-ssl-redirect-middleware');

module.exports = sslRedirect({
  async redirects() {
    return [
      {
        source: '/:path*',
        destination: `https://quiz-maker.herokuapp.com/:path*`,
        permanent: true,
      },
    ];
  },
});
