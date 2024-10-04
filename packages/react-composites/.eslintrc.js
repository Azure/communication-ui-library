// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'header', 'jsdoc', '@internal/custom-rules'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  rules: {
    '@internal/custom-rules/no-getstate': 'error',
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
        ],
        paths: [
          // Encourage use of typeguarded icon types
          {
            name: '@fluentui/react',
            importNames: ['Icon', 'FontIcon'],
            message:
              'Avoid directly using the Icon component from Fluent. Instead use, as appropriate, CallCompositeIcon, ChatCompositeIcon or CallWithChatCompositeIcon'
          }
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
    },
    react: {
      version: 'detect'
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
    },
    {
      files: ['tests/**/*.ts'],
      rules: {
        'jsdoc/require-jsdoc': 'off'
      }
    },
    {
      files: [
        'tests/**/*',
        '*.test.ts',
        'AzureCommunicationCallAdapter.ts',
        'AzureCommunicationCallWithChatAdapter.ts',
        'AzureCommunicationChatAdapter.ts',
        'useAdaptedSelector.ts',
        'useHandlers.ts'
      ],
      rules: {
        '@internal/custom-rules/no-getstate': 'off'
      }
    }
  ]
};
