const isDev = process.env.NODE_ENV !== 'production';

module.exports = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/*',
        destination: `https://quiz-maker.herokuapp.com/:splat`,
        permanent: !isDev,
      },
    ];
  },
};
