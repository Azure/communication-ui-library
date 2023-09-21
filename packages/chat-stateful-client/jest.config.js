// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// eslint-disable-next-line @typescript-eslint/no-var-requires
const commonConfig = require('../../common/config/jest/jest.config');
const jestCoverageConfig = {
  coverageReporters: [
    ['json', { file: 'detailed-report/chat-stateful-client.json' }],
    ['json-summary', { file: 'summary/chat-stateful-client.json' }]
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
        moduleNameMapper: {
          // Force modules to resolve with the CJS entry point, because Jest does not support package.json.exports. See https://github.com/uuidjs/uuid/issues/451
          '^uuid$': require.resolve('uuid'),
          '^nanoid$': require.resolve('nanoid')
        },
        ...jestCoverageConfig
      }
    : {
        ...commonConfig,
        moduleNameMapper: {
          // Force modules to resolve with the CJS entry point, because Jest does not support package.json.exports. See https://github.com/uuidjs/uuid/issues/451
          '^uuid$': require.resolve('uuid'),
          '^nanoid$': require.resolve('nanoid')
        },
        ...jestCoverageConfig
      };

module.exports = config;
