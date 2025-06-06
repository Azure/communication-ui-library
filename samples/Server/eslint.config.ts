// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  baseConfig,
  baseGlobalIgnores,
  globalConfig,
  testFilesBaseConfig
} from '../../common/config/ESLint/eslint.config';

export default globalConfig([
  baseConfig,
  testFilesBaseConfig,
  {
    rules: {
      'jsdoc/require-jsdoc': 'off',
      '@typescript-eslint/no-unused-vars': 'off'
    }
  },
  {
    files: ['**/www.ts', '**/app.test.ts'],
    rules: {
      'no-restricted-imports': 'off'
    }
  },
  baseGlobalIgnores
]);
