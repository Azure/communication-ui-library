const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const babelConfig = require('./.babelrc.js');

const config = {
  entry: {
    chatComposite: './src/chatComposite.js',
    callComposite: './src/callComposite.js',
    callWithChatComposite: './src/callWithChatComposite.js',
    service: './src/service.js'
  },
  mode: 'development', // change to 'production' for optimization
  resolve: {
    extensions: ['.js']
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd',
    library: '[name]'
  },
  devServer: {
    port: 3000,
    client: false,
    open: true,
    static: { directory: path.resolve(__dirname, 'dist') },
    proxy: [
      {
        path: '/token',
        target: 'http://[::1]:8080'
      },
      {
        path: '/createThread',
        target: 'http://[::1]:8080'
      },
      {
        path: '/addUser',
        target: 'http://[::1]:8080'
      },
      {
        path: '/getEndpointUrl',
        target: 'http://[::1]:8080'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html'
    }),
    new HtmlWebpackPlugin({
      template: './callComposite.html',
      filename: 'callComposite.html'
    }),
    new HtmlWebpackPlugin({
      template: './chatComposite.html',
      filename: 'chatComposite.html'
    }),
    new HtmlWebpackPlugin({
      template: './callWithChatComposite.html',
      filename: 'callWithChatComposite.html'
    }),
    new HtmlWebpackPlugin({
      template: './index.css',
      filename: 'index.css'
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: path.join(__dirname, 'fonts', 'segoeui-bold.woff2'), to: 'fonts' },
        { from: path.join(__dirname, 'fonts', 'segoeui-regular.woff2'), to: 'fonts' },
        { from: path.join(__dirname, 'fonts', 'segoeui-semibold.woff2'), to: 'fonts' }
      ]
    })
  ]
};

if (process.env['COMMUNICATION_REACT_FLAVOR'] !== 'beta') {
  if (!config.module) config.module = {};
  if (!config.module.rules) config.module.rules = [];
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
}

module.exports = config;
