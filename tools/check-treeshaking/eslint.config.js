// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
const { defineConfig, globalIgnores } = require('eslint/config');

const globals = require('globals');
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
      }
    },

    extends: compat.extends('eslint:recommended', 'plugin:prettier/recommended'),

    plugins: {
      headers
    },

    rules: {
      eqeqeq: 'warn',

      'headers/header-format': [
        'error',
        {
          source: 'string',
          style: 'line',
          content: 'Copyright (c) Microsoft Corporation.\nLicensed under the MIT License.'
        }
      ]
    }
  },
  globalIgnores(['**/docs/', '**/public/', '**/dist/', '**/node_modules/', '**/scripts/'])
]);
