
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import typescriptEslint from 'typescript-eslint';
import headers from 'eslint-plugin-headers';

import jsdoc from 'eslint-plugin-jsdoc';
import eslintJs from '@eslint/js';
import esLintConfigPrettier from 'eslint-config-prettier/flat';


export const globalConfig = (moduleConfig) => defineConfig([
  eslintJs.configs.recommended,
  typescriptEslint.configs.recommended,
  // We should move to this config instead for a more thorough checking
  // typescriptEslint.configs.recommendedTypeChecked,
  // {
  //   languageOptions: {
  //     parserOptions: {
  //       projectService: true,
  //       tsconfigRootDir: import.meta.dirname,
  //     },
  //   },
  // },
  ...moduleConfig,
  esLintConfigPrettier
]);

export const baseConfig = {
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

  plugins: {
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
}

export const testFilesBaseConfig = {
  files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx', '**/mocks/*'],
  rules: {
    '@typescript-eslint/ban-ts-comment': 'off'
  },

  languageOptions: {
    globals: {
      ...globals.jest
    }
  }
}

export const baseGlobalIgnores = globalIgnores(['**/docs/', '**/public/', '**/dist/', '**/node_modules/', '**/scripts/', '**/preprocessed/'])
