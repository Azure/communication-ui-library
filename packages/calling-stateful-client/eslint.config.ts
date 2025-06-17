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
    files: ['**/TestUtils.ts', '**/*.test.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off'
    }
  },
  baseGlobalIgnores
]);
