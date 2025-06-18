const { defineConfig, globalIgnores } = require('eslint/config');

const globals = require('globals');

const { fixupConfigRules, fixupPluginRules } = require('@eslint/compat');

const tsParser = require('@typescript-eslint/parser');
const typescriptEslint = require('@typescript-eslint/eslint-plugin');
const headers = require('eslint-plugin-headers');
const mdxPlugin = require('eslint-plugin-mdx');
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
      ecmaVersion: 2022,
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
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:prettier/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended'
      )
    ),

    plugins: {
      '@typescript-eslint': fixupPluginRules(typescriptEslint),
      headers
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

      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          varsIgnorePattern: '^_|^storyControls'
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

      'import/named': 'off',
      'import/namespace': 'off',
      'import/no-unresolved': 'off',

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
      'react/no-unescaped-entities': 'off',
      curly: 'error'
    },

    settings: {
      react: {
        'mdx/code-blocks': true,
        version: 'detect'
      }
    }
  },
  {
    files: ['**/*.snippet.*', '**/snippets/**'],

    rules: {
      'headers/header-format': 'off'
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
    files: ['**/*.snippet.ts', '**/*.snippet.tsx'],

    rules: {
      'react/prop-types': 'off',
      'react/jsx-key': 'off'
    }
  },
  {
    ...mdxPlugin.flat,
    files: ['**/*.mdx'],

    rules: {
      'headers/header-format': 'off',
      'react/react-in-jsx-scope': 'off'
    }
  },
  {
    files: ['stories/INTERNAL/**/*'],

    rules: {
      'no-restricted-imports': 'off'
    }
  },
  globalIgnores([
    '**/docs/',
    '**/public/',
    '**/dist/',
    '**/node_modules/',
    '**/storybook-static/',
    '**/scripts/',
    '**/preprocessed/',
    '**/.storybook/'
  ])
]);
