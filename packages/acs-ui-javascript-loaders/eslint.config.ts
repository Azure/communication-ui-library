import { baseConfig, globalConfig, testFilesBaseConfig } from '../../common/config/ESLint/eslint.config';
import { globalIgnores } from 'eslint/config';

export default globalConfig([
  baseConfig,
  testFilesBaseConfig,
  globalIgnores(['**/dist/', '**/node_modules/', '**/preprocessed/'])
]);
