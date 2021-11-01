const config = require('./webpack.config.js');

module.exports = {
  ...config,
  // Chrome tries to load source map from node_modules folder which generates warnings in dev mode
  // Embedding source map into js file fixes the problem
  devtool: 'eval-source-map'
};
