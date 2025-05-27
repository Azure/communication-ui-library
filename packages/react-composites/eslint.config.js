const { defineConfig, globalIgnores } = require('eslint/config');

const globals = require('globals');

const { fixupConfigRules, fixupPluginRules } = require('@eslint/compat');

const tsParser = require('@typescript-eslint/parser');
const typescriptEslint = require('@typescript-eslint/eslint-plugin');
const headers = require('eslint-plugin-headers');
const jsdoc = require('eslint-plugin-jsdoc');
const internalCustomRules = require('@internal/eslint-plugin-custom-rules');
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

    extends: fixupConfigRules(
      compat.extends(
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended'
      )
    ),

    plugins: {
      '@typescript-eslint': fixupPluginRules(typescriptEslint),
      headers,
      jsdoc,
      '@internal/custom-rules': internalCustomRules
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
      '@typescript-eslint/no-non-null-assertion': 'error',

      'headers/header-format': [
        'error',
        {
          source: 'string',
          style: 'line',
          content: 'Copyright (c) Microsoft Corporation.\nLicensed under the MIT License.'
        }
      ],

      'react/display-name': 'off',
      '@typescript-eslint/no-unused-expressions': 'off', // TO BE ENABLED ASAP
      'react-hooks/rules-of-hooks': 'off', // TURN THIS ON when we have more clarity on how to resolve.
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-empty-function': 'error',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          varsIgnorePattern: '^_'
        }
      ],

      'no-restricted-imports': [
        'error',
        {
          patterns: ['**/../**/src/*', '**/dist/**/es/*', '**/lib/**/es/*'],

          paths: [
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

    settings: {
      jsdoc: {
        ignorePrivate: true
      },

      react: {
        version: 'detect'
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
  {
    files: ['tests/**/*.ts'],

    rules: {
      'jsdoc/require-jsdoc': 'off'
    }
  },
  {
    files: [
      'tests/**/*',
      '**/*.test.ts',
      '**/AzureCommunicationCallAdapter.ts',
      '**/AzureCommunicationCallWithChatAdapter.ts',
      '**/AzureCommunicationChatAdapter.ts',
      '**/useAdaptedSelector.ts',
      '**/useHandlers.ts'
    ],

    rules: {
      '@internal/custom-rules/no-getstate': 'off'
    }
  },
  globalIgnores(['**/docs/', '**/public/', '**/dist/', '**/node_modules/', '**/scripts/', '**/preprocessed/'])
]);
