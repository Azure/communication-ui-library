// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

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
    '@typescript-eslint/no-explicit-any': 'off',
    eqeqeq: 'warn',
    'header/header': ['error', 'line', ' Copyright (c) Microsoft Corporation.\n Licensed under the MIT license.'],
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          // Do not allow references that are outside the src folder. These will break the npm package created as no src dir exists in output dir.
          '**/../**/src/*',
          // Do not allow references to node_modules' /es/ folder. These will break jest tests and the npm package as those imports won't be transpiled.
          '**/dist/**/es/*',
          '**/lib/**/es/*'
        ]
      }
    ]
  },
  root: true,
  overrides: [
    {
      files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx', '**/mocks/*'],
      rules: {
        '@typescript-eslint/ban-ts-comment': 'off'
      },
      env: {
        jest: true
      }
    },
    {
      // remove ban on files affected by https://github.com/microsoft/rushstack/pull/1916.
      // This should be removed once this issue is fixed.
      files: ['videoGallerySelector.ts', 'callControlSelectors.ts'],
      rules: {
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-unused-vars': 'off'
      }
    }
  ]
};
