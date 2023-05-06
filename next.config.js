module.exports = {
  async redirects() {
    return [
      {
        source: '/(.*)',
        destination: 'https://quiz-maker.herokuapp.com/:path*',
        permanent: true,
      },
    ];
  },
};