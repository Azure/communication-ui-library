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
      'jsdoc/require-jsdoc': 'off'
    }
  },
  {
    files: ['**/.babelrc.js', '**/webpack.config.js'], // candidate for higher migration
    rules: {
      '@typescript-eslint/no-require-imports': 'off'
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
