// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

const path = require('path');

module.exports = {
  entry: {
    // chatComposite: './src/chatComposite.js',
    callComposite: './dist/dist-esm/callCompositeLoader.js',
    outboundCallComposite: `${path.join(__dirname, './dist/dist-esm/outboundCallCompositeLoader.js')}`
    // callWithChatComposite: './src/callWithChatComposite.js',
  },
  mode: 'development', // change to 'production' for optimization
  resolve: {
    extensions: ['.js']
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './dist/dist-bundle'),
    libraryTarget: 'umd',
    library: '[name]'
  },
  devtool: 'source-map' // Generate source maps
};
