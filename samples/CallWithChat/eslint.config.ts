// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  baseConfig,
  baseGlobalIgnores,
  globalConfig,
  testFilesBaseConfig
} from '../../common/config/ESLint/eslint.config';
import { globalIgnores } from 'eslint/config';
import reactHooks from 'eslint-plugin-react-hooks';

export default globalConfig([
  baseConfig,
  testFilesBaseConfig,
  reactHooks.configs['recommended-latest'],
  {
    rules: {
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
      'jsdoc/require-jsdoc': 'off'
    }
  },
  baseGlobalIgnores,
  globalIgnores(['.babel*', 'webpack*'])
]);
