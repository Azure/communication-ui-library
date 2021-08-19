// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/en/configuration.html
 */

module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: ['**/*.{js,jsx,ts,tsx}', "!**/node_modules/**", '!src/mocks/**/*', '!**/coverage/**', '!**/index.ts'],

  // The maximum amount of workers used to run your tests. Can be specified as % or a number. E.g. maxWorkers: 10% will use 10% of your CPU amount + 1 as the maximum worker number. maxWorkers: 2 will use a maximum of 2 workers.
  maxWorkers: '50%',

  // An array of directory names to be searched recursively up from the requiring module's location
  moduleDirectories: ['node_modules', 'src'],

  // An array of file extensions your modules use
  moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'node'],

  // A preset that is used as a base for Jest's configuration
  preset: 'ts-jest',

  // The root directory that Jest should scan for tests and modules within
  rootDir: './src',

  // Setup code to run after the environment has been setup. This runs before each test file in the suite.
  setupFilesAfterEnv: ['../../../common/config/jest/jestSetup.js'],

  // The test environment that will be used for testing
  testEnvironment: 'jsdom',

  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],

  // The regexp pattern or array of patterns that Jest uses to detect test files
  testRegex: '(/test/.*|\\.(test|spec))\\.(ts|tsx|js)$',

  // A map from regular expressions to paths to transformers
  transform: {
    '^.+\\.(ts)x?$': 'ts-jest'
  },

  // An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
  transformIgnorePatterns: ['/node_modules/']
};
