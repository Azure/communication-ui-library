const { defineConfig, globalIgnores } = require('eslint/config');

const globals = require('globals');
const tsParser = require('@typescript-eslint/parser');
const typescriptEslint = require('@typescript-eslint/eslint-plugin');
// const header = require('eslint-plugin-header');
// const licenseHeader = require('eslint-plugin-license-header');
const headers = require('eslint-plugin-headers');
const js = require('@eslint/js');

const { FlatCompat } = require('@eslint/eslintrc');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

module.exports = defineConfig([
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      },

      parser: tsParser,
      ecmaVersion: 2020,
      sourceType: 'module',

      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },

    extends: compat.extends(
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:prettier/recommended'
    ),

    plugins: {
      '@typescript-eslint': typescriptEslint,
      headers
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
      '@typescript-eslint/no-non-null-assertion': 'error',

      'headers/header-format': [
        'error',
        {
          source: 'string',
          style: 'line',
          content: 'Copyright (c) Microsoft Corporation.\nLicensed under the MIT License.\n'
        }
      ],

      'react/display-name': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['off'],
      curly: 'error'
    }
  },
  {
    files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx', '**/mocks/*'],

    languageOptions: {
      globals: {
        ...globals.jest
      }
    }
  },
  {
    files: ['**/envHelper.ts'],

    rules: {
      '@typescript-eslint/no-var-requires': 'off'
    }
  },
  globalIgnores(['**/docs/', '**/public/', '**/dist/', '**/node_modules/'])
]);
