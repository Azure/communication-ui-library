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
    // Removing the `tests` dir from jest tests directories to prevent these tests
    // from running with the command `npm test` | `rushx test`
    // path.join(__dirname, 'tests')
  ]
};
