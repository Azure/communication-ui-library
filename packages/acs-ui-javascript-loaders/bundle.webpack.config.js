// webpack.config.js
const path = require('path');

module.exports = {
  entry: {
    // chatComposite: './src/chatComposite.js',
    // callComposite: './src/callComposite.js',
    outboundCallComposite: `${path.join(__dirname, '../outboundCallCompositeLoader.js')}`
    // callWithChatComposite: './src/callWithChatComposite.js',
  },
  mode: 'development', // change to 'production' for optimization
  resolve: {
    extensions: ['.js']
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname),
    libraryTarget: 'umd',
    library: '[name]'
  },
  devtool: 'source-map' // Generate source maps
};
