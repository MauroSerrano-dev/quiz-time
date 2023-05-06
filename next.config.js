const sslRedirect = require('heroku-ssl-redirect').default;
const isDev = process.env.NODE_ENV !== 'production'

module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/(.*)',
        destination: 'https://quiztime.pt/$1',
      },
    ];
  },

  async redirects() {
    return [
      {
        source: '/:path*',
        permanent: true,
        destination: 'https://quiztime.pt/:path*',
      },
    ];
  },
};
