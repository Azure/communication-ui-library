// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// eslint-disable-next-line @typescript-eslint/no-var-requires
const commonConfig = require('../../common/config/jest/jest.config');
const jestCoverageConfig = {
  coverageReporters: [
    ['json', { file: 'detailed-report/calling-component-binding.json' }],
    ['json-summary', { file: 'summary/calling-component-binding.json' }]
  ]
};

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
        },
        ...jestCoverageConfig
      }
    : { ...commonConfig, ...jestCoverageConfig };

module.exports = config;
