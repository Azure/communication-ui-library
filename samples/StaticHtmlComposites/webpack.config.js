const path = require('path');

module.exports = {
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
  }
};
