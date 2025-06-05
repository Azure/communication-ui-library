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
      'headers/header-format': 'off',
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
