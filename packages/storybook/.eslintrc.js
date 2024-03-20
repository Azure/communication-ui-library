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
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
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
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/explicit-function-return-type': [
      'warn',
      {
        allowExpressions: true,
        allowTypedFunctionExpressions: true
      }
    ],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { varsIgnorePattern: '^_' }],
    eqeqeq: 'warn',
    'header/header': ['error', 'line', ' Copyright (c) Microsoft Corporation.\n Licensed under the MIT License.'],
    'import/named': 'off', // very time consuming
    'import/namespace': 'off', // very time consuming
    'import/no-unresolved': 'off', // handled by tsc
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'parent', 'sibling', 'index'],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true
        }
      }
    ],
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['@internal/*'],
            message: 'Use @azure/communication-react instead.'
          }
        ]
      }
    ],
    'react/display-name': 'off',

    // This rule directly conflicts with allowed characters in Storybook's markdown
    'react/no-unescaped-entities': 'off',
    curly: 'error'
  },
  root: true,
  settings: {
    react: {
      'mdx/code-blocks': true,
      version: 'detect'
    }
  },
  overrides: [
    // disable requiring the license header on snippet files
    {
      files: ['**/*.snippet.*', '**/snippets/**'],
      rules: {
        'header/header': 'off'
      }
    },
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
      files: ['**/*.snippet.ts', '**/*.snippet.tsx'],
      rules: {
        'react/prop-types': 'off',
        'react/jsx-key': 'off'
      }
    },
    {
      files: '*.mdx',
      parser: 'eslint-mdx',
      extends: 'plugin:mdx/recommended',
      rules: {
        'header/header': 'off'
      }
    },
    {
      files: 'stories/INTERNAL/**/*',
      rules: {
        'no-restricted-imports': 'off'
      }
    }
  ]
};
