const withSass = require("@zeit/next-sass");

module.exports = withSass({
  async redirects() {
    return [
      {
        source: "/*",
        destination: "https://quiz-maker.herokuapp.com/:splat",
        permanent: true,
        has: [
          {
            type: "protocol",
            value: "http"
          }
        ]
      }
    ];
  }
});