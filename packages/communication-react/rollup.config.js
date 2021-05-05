// © Microsoft Corporation. All rights reserved.

import Package from './package.json';
import commonConfig from '../../common/config/rollup/rollup.config';

export default [
  {
    ...commonConfig(Package),
    input: './dist/dist-esm/react-components/src/index.js',
    output: {
      file: './dist/dist-cjs/react-components/index.js',
      format: 'cjs',
      sourcemap: true
    }
  }
];
