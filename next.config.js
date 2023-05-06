const isDev = process.env.NODE_ENV !== 'production'

module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/(.*)',
        destination: 'https://quiz-maker.herokuapp.com/$1',
      },
    ];
  },

  async redirects() {
    return [
      {
        source: '/:path*',
        permanent: true,
        destination: 'https://quiz-maker.herokuapp.com/:path*',
      },
    ];
  },
};
