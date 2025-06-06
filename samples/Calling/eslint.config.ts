// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  baseConfig,
  baseGlobalIgnores,
  globalConfig,
  testFilesBaseConfig
} from '../../common/config/ESLint/eslint.config';
import { globalIgnores } from 'eslint/config';

export default globalConfig([
  baseConfig,
  testFilesBaseConfig,
  {
    rules: {
      'jsdoc/require-jsdoc': 'off'
    }
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: false
    }
  },
  baseGlobalIgnores,
  globalIgnores(['.babel*', 'webpack*'])
]);
