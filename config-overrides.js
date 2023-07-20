const rewireLess = require("react-app-rewire-less");
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function override(config, env) {
  config = rewireLess.withLoaderOptions({
    javascriptEnabled: true,
  })(config, env);

  config.devServer = {
    ...config.devServer,
    before: function(app) {
      app.use(
        "/dashboard",
        createProxyMiddleware({
          target: "http://localhost/wordpress/",
          changeOrigin: true,
        })
      );
    },
  };

  return config;
};
