const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api', // API endpoint path
        createProxyMiddleware({
            target: 'https://api.cloudinary.com/v1_1/dvr6unyvv', // Cloudinary API base URL
            changeOrigin: true,
            pathRewrite: {
                '^/api': '', // Remove the '/api' path prefix
            },
        })
    );
};
