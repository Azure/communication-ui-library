// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// eslint-disable-next-line @typescript-eslint/no-var-requires
const commonConfig = require('../../common/config/jest/jest.config');

const config =
  process.env['FLAVOR'] === 'stable'
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
    : { ...commonConfig };

module.exports = config;
