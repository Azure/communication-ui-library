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
      'jsdoc/require-jsdoc': 'off',
      '@typescript-eslint/no-unused-expressions': 'off' // TURN THIS ON IN SUBSEQUENT PR
    }
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: false
    }
  },
  baseGlobalIgnores
]);
