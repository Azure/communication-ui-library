const { defineConfig, globalIgnores } = require('eslint/config');

const globals = require('globals');
const tsParser = require('@typescript-eslint/parser');
const typescriptEslint = require('@typescript-eslint/eslint-plugin');
const headers = require('eslint-plugin-headers');
const jsdoc = require('eslint-plugin-jsdoc');
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
      headers,
      jsdoc
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

      'headers/header-format': [
        'error',
        {
          source: 'string',
          style: 'line',
          content: 'Copyright (c) Microsoft Corporation.\nLicensed under the MIT License.'
        }
      ],

      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          varsIgnorePattern: '^_'
        }
      ],

      'no-restricted-imports': [
        'error',
        {
          patterns: ['**/../**/src/*', '**/dist/**/es/*', '**/lib/**/es/*']
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

    settings: {
      jsdoc: {
        ignorePrivate: true
      }
    }
  },
  {
    files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx', '**/mocks/*'],

    rules: {
      '@typescript-eslint/ban-ts-comment': 'off'
    },

    languageOptions: {
      globals: {
        ...globals.jest
      }
    }
  },
  globalIgnores(['**/docs/', '**/public/', '**/dist/', '**/node_modules/', '**/scripts/', '**/preprocessed/'])
]);
