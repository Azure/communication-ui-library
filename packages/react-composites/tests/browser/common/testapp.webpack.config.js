// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/**
 * @param {appDir} - Directory of the app files (i.e. the folder containing the index.tsx of the test app)
 */
module.exports = (appDir) => ({
  entry: path.join(appDir, 'index.tsx'),
  devtool: process.env.CI ? undefined : 'eval-source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      // Reference internal packlets' src directly for hot reloading when developing.
      // This also removes the need for CI to wait for packlets to be built before building tests.
      '@internal/react-components': path.resolve(appDir, '../../../../../react-components/src'),
      '@internal/react-composites': path.resolve(appDir, '../../../../../react-composites/src'),
      '@internal/chat-stateful-client': path.resolve(appDir, '../../../../../chat-stateful-client/src'),
      '@internal/chat-component-bindings': path.resolve(appDir, '../../../../../chat-component-bindings/src'),
      '@internal/calling-stateful-client': path.resolve(appDir, '../../../../../calling-stateful-client/src'),
      '@internal/calling-component-bindings': path.resolve(appDir, '../../../../../calling-component-bindings/src'),
      '@internal/acs-ui-common': path.resolve(appDir, '../../../../../acs-ui-common/src')
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
