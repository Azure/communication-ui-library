import {
  baseConfig,
  baseGlobalIgnores,
  globalConfig,
  testFilesBaseConfig
} from '../../common/config/ESLint/eslint.config';

const config = [baseConfig, testFilesBaseConfig, baseGlobalIgnores];

export default globalConfig(config);
