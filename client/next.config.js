module.exports = {
  // watch changes and poll them every 1000 ms
  // https://webpack.js.org/configuration/watch/#watchoptionspoll
  webpackDevMiddleware: (config) => {
    config.watchOptions.poll = 1000;
    return config;
  },
  publicRuntimeConfig: {
    NODE_ENV: process.env.NODE_ENV,
    HOSTING_SITE: process.env.HOSTING_SITE,
  },
};
