// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: path.join(__dirname, 'index.tsx'),
  devtool: 'eval-source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      // reference internal packlets src directly for hot reloading when developing
      'react-components': path.resolve(__dirname, '../../../../../react-components/src')
    }
  },
  output: {
    path: path.join(__dirname, 'dist'),
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
  plugins: [
    new HtmlWebpackPlugin({ template: path.join(__dirname, 'public', 'index.html') }),
    new Dotenv({ path: path.join(__dirname, '.env') })
  ],
  devServer: {
    port: 3000,
    hot: true,
    open: true
  }
};
