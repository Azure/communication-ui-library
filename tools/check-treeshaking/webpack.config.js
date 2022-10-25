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
      },
      {
        // Loader required due to: https://github.com/fb55/htmlparser2/issues/1237#issuecomment-1182522861
        test: /htmlparser2\/lib\/esm\/index.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: ['@babel/plugin-proposal-export-namespace-from']
            }
          }
        ]
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
