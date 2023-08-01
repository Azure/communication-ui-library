// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// eslint-disable-next-line @typescript-eslint/no-var-requires
const commonConfig = require('../../common/config/jest/jest.config');

const config =
  process.env['COMMUNICATION_REACT_FLAVOR'] !== 'beta'
    ? {
        ...commonConfig,
        rootDir: './preprocessed',
        testPathIgnorePatterns: ['/node_modules/'],
        globals: {
          'ts-jest': {
            tsconfig: 'tsconfig.preprocess.json'
          }
        }
      }
    : {
        ...commonConfig,

        // Setup code to run after the environment has been setup. This runs before each test file in the suite.
        setupFilesAfterEnv: ['./../jestSetup.js']
      };

module.exports = config;
