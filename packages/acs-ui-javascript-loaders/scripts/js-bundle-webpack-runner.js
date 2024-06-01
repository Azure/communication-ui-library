#!/usr/bin/env node

const webpack = require('webpack');
const webpackConfig = require('./bundle.webpack.config.js');
webpack(webpackConfig, (err, stats) => {
  if (err || stats.hasErrors()) {
    console.error('Webpack build failed:', err || stats.toJson().errors);
  } else {
    console.log('Webpack build completed successfully!');
  }
});
