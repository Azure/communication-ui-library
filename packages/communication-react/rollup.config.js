// © Microsoft Corporation. All rights reserved.

import Package from './package.json';
import commonConfig from '../../common/config/rollup/rollup.config';

export default [
  {
    ...commonConfig(Package),
    input: './dist/dist-esm/communication-ui/src/release.index.js',
    output: {
      file: './dist/dist-cjs/communication-ui/index.js',
      format: 'cjs',
      sourcemap: true
    }
  }
];
