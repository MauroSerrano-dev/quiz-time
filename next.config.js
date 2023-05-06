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

  webpack: (config, { isServer }) => {
    // for production, force SSL/TLS
    if (!isDev) {
      config.resolve.alias['@sentry/node'] = '@sentry/browser';
      config.plugins.push(new sslRedirect());
    }

    return config;
  },
};
