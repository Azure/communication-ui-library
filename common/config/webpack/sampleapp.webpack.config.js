// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const CopyPlugin = require("copy-webpack-plugin");

const webpackConfig = (sampleAppDir, env, babelConfig) => {
  const config = {
    entry: './src/index.tsx',
    mode: env.production ? 'production' : 'development',
    ...(env.production || !env.development ? {} : { devtool: 'eval-source-map' }),
    resolve:  {
      extensions: ['.ts', '.tsx', '.js'],
      alias: env.production ? {
        // read dist folder from package to simulate production environment
        '@azure/communication-react': path.resolve(sampleAppDir, '../../packages/communication-react'),
      } : {
        // reference internal packlets src directly for hot reloading when developing
        '@azure/communication-react': path.resolve(sampleAppDir, '../../packages/communication-react/src'),
        '@internal/react-components': path.resolve(sampleAppDir, '../../packages/react-components/src'),
        '@internal/react-composites': path.resolve(sampleAppDir, '../../packages/react-composites/src'),
        '@internal/chat-stateful-client': path.resolve(sampleAppDir, '../../packages/chat-stateful-client/src'),
        '@internal/chat-component-bindings': path.resolve(sampleAppDir, '../../packages/chat-component-bindings/src'),
        '@internal/calling-stateful-client': path.resolve(sampleAppDir, '../../packages/calling-stateful-client/src'),
        '@internal/calling-component-bindings': path.resolve(sampleAppDir, '../../packages/calling-component-bindings/src'),
        '@internal/acs-ui-common': path.resolve(sampleAppDir, '../../packages/acs-ui-common/src'),
        '@internal/northstar-wrapper': path.resolve(sampleAppDir, '../../packages/northstar-wrapper/src')
      }
    },
    output: {
      path: path.join(sampleAppDir, env.production ? '/dist/build' : 'dist'),
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
      new HtmlWebpackPlugin({ template: './public/index.html' }),
      new webpack.DefinePlugin({
        'process.env.PRODUCTION': env.production || !env.development,
        'process.env.NAME': JSON.stringify(require(path.resolve(sampleAppDir, 'package.json')).name),
        'process.env.VERSION': JSON.stringify(require(path.resolve(sampleAppDir, 'package.json')).version),
        __CALLINGVERSION__: JSON.stringify(require(path.resolve(sampleAppDir, 'package.json')).dependencies['@azure/communication-calling']),
        __CHATVERSION__: JSON.stringify(require(path.resolve(sampleAppDir, 'package.json')).dependencies['@azure/communication-chat']),
        __COMMUNICATIONREACTVERSION__: JSON.stringify(require(path.resolve(sampleAppDir, 'package.json')).dependencies['@azure/communication-react']),
        __BUILDTIME__: JSON.stringify(new Date().toLocaleString())
      }),
      new BundleAnalyzerPlugin({
        analyzerMode: 'json',
      }),
      new CopyPlugin({
        patterns: [
          { from: path.resolve(sampleAppDir, "public/manifest.json"), to: "manifest.json" },
          { from: path.resolve(sampleAppDir, "public/backgrounds"), to: "backgrounds",  noErrorOnMissing: true },
        ]
      })
    ],
    devServer: {
      port: 3000,
      hot: true,
      open: true,
      static: { directory: path.resolve(sampleAppDir, 'public') },
      proxy: [
        {
          path: '/token',
          target: 'http://[::1]:8080'
        },
        {
          path: '/refreshToken/*',
          target: 'http://[::1]:8080'
        },
        {
          path: '/createThread',
          target: 'http://[::1]:8080'
        },
        {
          path: '/userConfig/*',
          target: 'http://[::1]:8080'
        },
        {
          path: '/getEndpointUrl',
          target: 'http://[::1]:8080'
        },
        {
          path: '/addUser/*',
          target: 'http://[::1]:8080'
        },
        {
          path: '/createRoom',
          target: 'http://[::1]:8080'
        },
        {
          path: '/addUserToRoom',
          target: 'http://[::1]:8080'
        }
      ]
    }
  }

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

module.exports = webpackConfig;
