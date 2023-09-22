// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import Package from './package.json';
import commonConfig from '../../common/config/rollup/rollup.config';

export default [
  {
    ...commonConfig(Package),
    input: './dist/dist-esm/communication-react/src/index.js',
    output: {
      file: './dist/dist-cjs/communication-react/index.js',
      format: 'cjs',
      sourcemap: true
    }
  }
];
