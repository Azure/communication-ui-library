// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  baseConfig,
  baseGlobalIgnores,
  globalConfig,
  testFilesBaseConfig
} from '../../common/config/ESLint/eslint.config';
import reactHooks from 'eslint-plugin-react-hooks';

export default globalConfig([
  baseConfig,
  testFilesBaseConfig,
  reactHooks.configs['recommended-latest'],
  {
    files: [
      './tests/browser/**/*.spec.ts',
      './tests/browser/**/*.spec.tsx',
      './tests/browser/**/*.tsx',
      './playwright/index.tsx'
    ],
    rules: {
      'no-restricted-imports': 'off'
    }
  },
  {
    rules: {
      '@typescript-eslint/no-unused-expressions': 'off', // TURN THIS ON IN SUBSEQUENT PR
      'react-hooks/rules-of-hooks': 'off' // TURN THIS ON when we have more clarity on how to resolve.
    }
  },
  baseGlobalIgnores
]);
