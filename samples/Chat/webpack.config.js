// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

module.exports = (env) => {
  const babelConfig = require('./.babelrc.js');
  const commonConfig = require('../../common/config/webpack/sampleapp.webpack.config')(__dirname, env, babelConfig);
  return commonConfig;
};
