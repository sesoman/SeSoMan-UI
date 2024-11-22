const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/sesoman',
    createProxyMiddleware({
      target: 'https://sesoman-backend-iwck.onrender.com', 
      changeOrigin: true,
      pathRewrite: {
        '^/sesoman': '',
      },
    })
  );

  app.use(
    '/ocm_mit', // Path for the second API
    createProxyMiddleware({
      target: 'https://ocm.dev.imc-merlot-education.eu', // API 2 URL
      changeOrigin: true,
      pathRewrite: {
        '^/ocm_mit': '', // Optionally remove '/api2' prefix before sending request to the target
      },
    })
  );

  app.use(
    '/token', // Path for the second API
    createProxyMiddleware({
      target: 'https://auth.aws-institut.de:8080', // API 2 URL
      changeOrigin: true,
      pathRewrite: {
        '^/token': '', // Optionally remove '/api2' prefix before sending request to the target
      },
    })
  );

  // Add more proxies here if needed
};

