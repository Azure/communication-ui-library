// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (appDir) => ({
  entry: path.join(appDir, 'index.tsx'),
  devtool: 'eval-source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      // reference internal packlets src directly for hot reloading when developing
      '@internal/react-components': path.resolve(appDir, '../../../../../react-components/src')
    }
  },
  output: {
    path: path.join(appDir, 'dist'),
    filename: 'build.js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true
        },
        exclude: /dist/
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.svg/,
        type: 'asset/inline'
      }
    ]
  },
  plugins: [new HtmlWebpackPlugin({ template: path.join(appDir, 'public', 'index.html') })],
  devServer: {
    port: 3000,
    hot: true,
    open: true
  }
});
