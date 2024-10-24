// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  plugins: ['header'],
  rules: {
    eqeqeq: 'warn',
    'header/header': ['error', 'line', ' Copyright (c) Microsoft Corporation.\n Licensed under the MIT License.']
  }
};
