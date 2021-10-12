// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* eslint-disable @typescript-eslint/no-var-requires */

module.exports = (env) => {
  const commonConfig = require('../../common/config/webpack/sampleapp.webpack.config')(__dirname, env);
  return commonConfig;
};
