const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const babelConfig = require('./.babelrc.js');

const config = {
  entry: {
    chatComposite: './src/chatComposite.js',
    callComposite: './src/callComposite.js',
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
    injectClient: false,
    open: true,
    contentBase: path.join(__dirname, 'dist'),
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
  plugins: [new HtmlWebpackPlugin({ template: 'index.html' })]
};

if (process.env['FLAVOR'] === 'stable') {
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
