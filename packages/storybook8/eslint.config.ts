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
      '@typescript-eslint/explicit-function-return-type': 'off',
      'headers/header-format': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'jsdoc/require-jsdoc': 'off',
      'no-useless-escape': 'off',
      'no-restricted-imports': 'off'
    }
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: false
    }
  },
  baseGlobalIgnores
]);
