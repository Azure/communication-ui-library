import typescriptEslint from '@typescript-eslint/eslint-plugin';
import header from 'eslint-plugin-header';
import jsdoc from 'eslint-plugin-jsdoc';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default [
  {
    ignores: ['**/docs/', '**/public/', '**/dist/', '**/node_modules/', '**/scripts/', '**/preprocessed/']
  },
  ...compat.extends('eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'),
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
      header,
      jsdoc
    },

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

    settings: {
      jsdoc: {
        ignorePrivate: true
      }
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
    }
  },
  {
    files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx', '**/mocks/*'],

    languageOptions: {
      globals: {
        ...globals.jest
      }
    },

    rules: {
      '@typescript-eslint/ban-ts-comment': 'off'
    }
  }
];
