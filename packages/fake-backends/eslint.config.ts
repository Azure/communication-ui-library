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
      'jsdoc/require-jsdoc': 'off'
    }
  },
  baseGlobalIgnores
]);
