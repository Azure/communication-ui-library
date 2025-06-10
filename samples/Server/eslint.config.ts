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
    files: ['**/www.ts', '**/app.test.ts'],
    rules: {
      'no-restricted-imports': 'off'
    }
  },
  baseGlobalIgnores
]);
