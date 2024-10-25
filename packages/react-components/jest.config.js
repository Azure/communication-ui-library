// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// eslint-disable-next-line @typescript-eslint/no-var-requires
const commonConfig = require('../../common/config/jest/jest.config');
const jestCoverageConfig = {
  coverageReporters: [
    ['json', { file: 'detailed-report/react-components.json' }],
    ['json-summary', { file: 'summary/react-components.json' }]
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

config.setupFilesAfterEnv = [...config.setupFilesAfterEnv, '../jestSetup.ts'];

module.exports = config;
