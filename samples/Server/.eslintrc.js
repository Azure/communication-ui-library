// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'header'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': [
      'warn',
      {
        allowExpressions: true,
        allowTypedFunctionExpressions: true
      }
    ],
    eqeqeq: 'warn',
    'header/header': ['error', 'line', ' Copyright (c) Microsoft Corporation.\n Licensed under the MIT License.'],
    'react/display-name': 'off',

    '@typescript-eslint/no-explicit-any': 'error',
    // Allow unused vars for routing funtions
    '@typescript-eslint/no-unused-vars': ['off'],
    curly: 'error'
  },
  overrides: [
    {
      files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx', '**/mocks/*'],
      env: {
        jest: true
      }
    },
    {
      files: ['envHelper.ts'],
      rules: {
        // Allow requiring the appsettings.json
        '@typescript-eslint/no-var-requires': 'off'
      }
    }
  ]
};
