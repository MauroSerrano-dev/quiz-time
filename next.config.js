const isProd = process.env.NODE_ENV === 'production'

import sslRedirect from 'heroku-ssl-redirect';
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(
  sslRedirect({
    async redirects() {
      return [
        {
          source: '/about',
          destination: '/',
          permanent: true,
        },
      ]
    },
    webpack(config, { isServer }) {
      if (!isServer) {
        config.resolve.fallback.fs = false
      }
      return config
    },
    env: {
      customKey: 'my-value',
    },
    future: {
      webpack5: true,
    },
    poweredByHeader: false,
  })
)
