// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

var path = require('path');

module.exports = {
  mode: 'production',
  entry: path.resolve(__dirname, 'tsc-out/index.js'),
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist/dist-cjs'),
    library: {
      type: 'commonjs'
    }
  },
  externals: {
    react: 'react',
    'react-dom': 'react-dom'
  }
};
