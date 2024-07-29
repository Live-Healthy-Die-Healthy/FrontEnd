const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://api.live-healthy.store/',
      changeOrigin: true,
      pathRewrite: {
        '^/': '', // remove base path
      },
    })
  )
}