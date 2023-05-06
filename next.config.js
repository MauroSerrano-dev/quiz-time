module.exports = {
  async redirects() {
    return [
      {
        source: '/*',
        has: [
          {
            type: 'host',
            value: '(?<host>.+)',
            destination: ':https',
            continue: true,
          },
        ],
      },
    ];
  },
};
