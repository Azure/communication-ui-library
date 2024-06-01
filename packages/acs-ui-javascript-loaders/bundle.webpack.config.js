// webpack.config.js
const path2 = require('path');

module.exports = {
  entry: {
    // chatComposite: './src/chatComposite.js',
    // callComposite: './src/callComposite.js',
    outboundCallComposite: './dist/dist-esm/acs-ui-javascript-loaders/src/outboundCallCompositeLoader.js'
    // callWithChatComposite: './src/callWithChatComposite.js',
  },
  mode: 'development', // change to 'production' for optimization
  resolve: {
    extensions: ['.js']
  },
  output: {
    filename: '[name].js',
    path: path2.resolve(__dirname),
    libraryTarget: 'umd',
    library: '[name]'
  },
  devtool: 'source-map' // Generate source maps
};
