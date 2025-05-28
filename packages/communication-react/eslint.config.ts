import { globalIgnores } from 'eslint/config';
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
      '@typescript-eslint/no-explicit-any': 'off',
      'no-restricted-imports': 'off',
      'jsdoc/require-jsdoc': 'off'
    }
  },
  baseGlobalIgnores,
  globalIgnores(['**/preprocess-dist/'])
]);
