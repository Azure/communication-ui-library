// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

const path = require('path');

const forbiddenDependencies = require('./forbiddenDependencies');
const entries = Object.keys(forbiddenDependencies);

module.exports = {
  entry: entries,
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: path.resolve('importChecker.js')
          }
        ],
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
