// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// eslint-disable-next-line @typescript-eslint/no-var-requires
const commonConfig = require('../../common/config/jest/jest.config');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = {
  ...commonConfig,
  roots: [
    path.join(__dirname, 'src')
    // Uncomment the following line to run E2E browser tests
    // path.join(__dirname, 'tests')
  ]
};
