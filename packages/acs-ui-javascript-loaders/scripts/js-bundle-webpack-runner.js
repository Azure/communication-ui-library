// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

const path = require('path');

const webpack = require('webpack');
const webpackConfig = require(path.join(__dirname, '../bundle.webpack.config.js'));

webpack(webpackConfig, (err, stats) => {
  if (err || stats.hasErrors()) {
    console.error('Webpack build failed:', err || stats.toJson().errors);
  } else {
    console.log('Webpack build completed successfully!');
  }
});
