// webpack.config.js
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: './src/outboundCallCompositeLoader.ts', // Your TypeScript entry point
  output: {
    filename: 'outboundCallCompositeLoaderBundle.min.js', // Output file name
    library: 'outboundCallCompositeLoaderBundle', // Global variable name (accessible in browsers)
    libraryTarget: 'umd' // Specify UMD format
  },
  resolve: {
    extensions: ['.ts', '.js'] // Add '.ts' extension
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  optimization: {
    minimizer: [new TerserPlugin()] // Minify using Terser
  },
  devtool: 'source-map' // Generate source maps
};
