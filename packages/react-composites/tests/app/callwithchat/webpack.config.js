// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* eslint-disable @typescript-eslint/no-var-requires */

module.exports = () => {
  const babelConfig = require('../../../.babelrc.js');
  const commonConfig = require('..//testapp.webpack.config')(__dirname, babelConfig);

  return commonConfig;
};
