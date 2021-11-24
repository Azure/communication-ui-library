// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* eslint-disable @typescript-eslint/no-var-requires */

module.exports = () => {
  const commonConfig = require('../../common/testapp.webpack.config')(__dirname);
  return commonConfig;
};
