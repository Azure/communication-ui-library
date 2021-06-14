// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import path from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const config = {
  name: 'server',
  entry: './bin/www.ts',
  target: 'node',
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'server.js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  optimization: {
    minimize: false
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: path.join(__dirname, 'web.config'), to: path.join(__dirname, 'dist') }]
    })
  ]
};

export default config;
