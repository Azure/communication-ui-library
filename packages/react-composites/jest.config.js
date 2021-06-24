// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// eslint-disable-next-line @typescript-eslint/no-var-requires
const commonConfig = require('../../common/config/jest/jest.config');
const path = require('path');

module.exports = {
  ...commonConfig,
  roots: [path.join(__dirname, 'src'), path.join(__dirname, 'tests')]
};
