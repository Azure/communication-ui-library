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
    '@typescript-eslint/explicit-function-return-type': [
      'warn',
      {
        allowExpressions: true,
        allowTypedFunctionExpressions: true
      }
    ],
    '@typescript-eslint/no-explicit-any': 'off',
    eqeqeq: 'warn',
    'header/header': ['error', 'line', ' © Microsoft Corporation. All rights reserved.'],
    'react/display-name': 'off',
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
    ]
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
      // remove the ban on certain types due to the complexity of this file
      files: ['ConnectContext.tsx'],
      rules: {
        '@typescript-eslint/ban-types': 'off'
      }
    }
  ]
};
