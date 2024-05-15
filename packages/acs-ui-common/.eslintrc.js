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
  plugins: ['@typescript-eslint', 'header', 'jsdoc'],
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
    '@typescript-eslint/no-explicit-any': 'error',
    eqeqeq: 'warn',
    '@typescript-eslint/no-non-null-assertion': 'error',
    'header/header': ['error', 'line', ' Copyright (c) Microsoft Corporation.\n Licensed under the MIT License.'],
    '@typescript-eslint/no-unused-vars': ['warn', { varsIgnorePattern: '^_' }],
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
    ],
    'jsdoc/require-jsdoc': [
      'error',
      {
        checkConstructors: false,
        enableFixer: false,
        publicOnly: true,
        require: {
          ArrowFunctionExpression: true,
          ClassDeclaration: true,
          FunctionDeclaration: true
        },
        contexts: [
          'ArrowFunctionExpression',
          'FunctionDeclaration',
          'FunctionExpression',
          'TSDeclareFunction',
          'TSEnumDeclaration',
          'TSInterfaceDeclaration',
          'TSTypeAliasDeclaration',
          'VariableDeclaration'
        ]
      }
    ],
    curly: 'error'
  },
  root: true,
  settings: {
    jsdoc: {
      ignorePrivate: true
    }
  },
  overrides: [
    {
      files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx', '**/mocks/*'],
      rules: {
        '@typescript-eslint/ban-ts-comment': 'off'
      },
      env: {
        jest: true
      }
    }
  ]
};
