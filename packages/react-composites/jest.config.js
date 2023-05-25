// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// eslint-disable-next-line @typescript-eslint/no-var-requires
const commonConfig = require('../../common/config/jest/jest.config');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

const config =
  process.env['COMMUNICATION_REACT_FLAVOR'] !== 'beta'
    ? {
        ...commonConfig,
        testPathIgnorePatterns: ['/node_modules/'],
        globals: {
          'ts-jest': {
            tsconfig: 'tsconfig.preprocess.json'
          }
        }
      }
    : {
        ...commonConfig
      };

module.exports = {
  ...config,
  roots: [
    path.join(__dirname, process.env['COMMUNICATION_REACT_FLAVOR'] !== 'beta' ? 'preprocessed' : 'src')
    // Uncomment the following line to run E2E browser tests
    // path.join(__dirname, 'tests')
  ]
};
