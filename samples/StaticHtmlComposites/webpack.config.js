const path = require('path');

module.exports = {
  entry: './src/index.js',
  mode: 'development', // change to 'production' for optimization
  resolve: {
    extensions: ['.js']
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      type: 'var',
      name: 'app'
    }
  }
};
