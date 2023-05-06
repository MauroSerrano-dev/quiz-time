const withHttpsRedirect = require('next-https-redirect');

module.exports = withHttpsRedirect({
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
