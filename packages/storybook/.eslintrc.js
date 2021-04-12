// © Microsoft Corporation. All rights reserved.
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
    eqeqeq: 'warn',
    'react/display-name': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { varsIgnorePattern: '^_' }]
  },
  root: true,
  settings: {
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
      files: ['**/*.example.ts', '**/*.example.tsx'],
      rules: {
        'react/prop-types': 'off',
        'react/jsx-key': 'off'
      }
    }
  ]
};
