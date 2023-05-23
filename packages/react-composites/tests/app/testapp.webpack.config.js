// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

/**
 * @param {appDir} - Directory of the app files (i.e. the folder containing the index.tsx of the test app)
 */
module.exports = (appDir, babelConfig) => {
  const config = {
    entry: path.join(appDir, 'index.tsx'),
    devtool: process.env.CI ? undefined : 'eval-source-map',
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
      alias: {
        // Reference internal packlets' src directly for hot reloading when developing.
        // This also removes the need for CI to wait for packlets to be built before building tests.
        '@internal/acs-ui-common': path.resolve(appDir, '../../../../acs-ui-common/src'),
        '@internal/calling-component-bindings': path.resolve(appDir, '../../../../calling-component-bindings/src'),
        '@internal/calling-stateful-client': path.resolve(appDir, '../../../../calling-stateful-client/src'),
        '@internal/chat-component-bindings': path.resolve(appDir, '../../../../chat-component-bindings/src'),
        '@internal/chat-stateful-client': path.resolve(appDir, '../../../../chat-stateful-client/src'),
        '@internal/fake-backends': path.resolve(appDir, '../../../../fake-backends/src'),
        '@internal/react-components': path.resolve(appDir, '../../../../react-components/src'),
        '@internal/react-composites': path.resolve(appDir, '../../../../react-composites/src')
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
          test: /\.(eot|svg|ttf|woff|woff2)$/,
          type: 'asset/inline'
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({ template: path.join(__dirname, 'index.html') }),
      new CopyWebpackPlugin({
        patterns: [
          { from: path.join(__dirname, 'fonts', 'segoeui-bold.woff2'), to: 'fonts' },
          { from: path.join(__dirname, 'fonts', 'segoeui-regular.woff2'), to: 'fonts' },
          { from: path.join(__dirname, 'fonts', 'segoeui-semibold.woff2'), to: 'fonts' },
          { from: path.join(__dirname, 'images', 'inlineImageExample1.png'), to: 'images' },
          { from: path.join(__dirname, 'public', 'backgrounds'), to: 'backgrounds' }
        ]
      })
    ],
    devServer: {
      port: 3000,
      hot: true,
      open: true
    }
  };

  process.env['COMMUNICATION_REACT_FLAVOR'] !== 'beta' &&
    config.module.rules.push({
      test: /\.tsx?$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          ...babelConfig
        }
      }
    });

  return config;
};
