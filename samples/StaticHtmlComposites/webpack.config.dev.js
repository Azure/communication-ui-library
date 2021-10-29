const config = require('./webpack.config.js');

module.exports = {
  ...config,
  devtool: 'eval-source-map'
};
