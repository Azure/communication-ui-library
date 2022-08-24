// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* eslint-disable @typescript-eslint/no-var-requires */

module.exports = () => {
  const babelConfig = require('../../../../.babelrc.js');
  const commonConfig = require('../../lib/testapp.webpack.config')(__dirname, babelConfig);

  return commonConfig;
};
