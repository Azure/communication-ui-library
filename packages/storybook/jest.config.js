// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// eslint-disable-next-line @typescript-eslint/no-var-requires
const commonConfig = require('../../common/config/jest/jest.config');

module.exports = {
  ...commonConfig,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: ['stories/**/*.{js,jsx,ts,tsx}', '!/node_modules/', '!stories/mocks/**/*'],

  // An array of directory names to be searched recursively up from the requiring module's location
  moduleDirectories: ['node_modules', 'stories'],

  // An array of file extensions your modules use
  moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'node'],

  // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
  moduleNameMapper: {
    // Jest is unable to perform the raw load of snippet files, instead stub out these imports.
    // More information: https://stackoverflow.com/questions/63226101/handle-webpack-loader-syntax-with-jest-testing-exclamation-raw-loader
    '^!!raw-loader!.*': '<rootDir>/jest/snippetStub.txt'
  },

  // The root directory that Jest should scan for tests and modules within
  rootDir: '.',

  // A list of paths to directories that Jest should use to search for files in
  roots: ['stories', '.storybook'],

  // A map from regular expressions to paths to transformers
  transform: {
    '^.+\\.(ts)x?$': 'ts-jest',
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '<rootDir>/jest/fileTransform.js'
  },

  // An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
  transformIgnorePatterns: ['/node_modules/', 'node_modules/(?!(@storybook/addon-storyshots)/)']
};
