// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import Package from './package.json';
import commonConfig from '../../common/config/rollup/rollup.config';
import commonjs from '@rollup/plugin-commonjs';
import sourcemaps from 'rollup-plugin-sourcemaps';
import svg from 'rollup-plugin-svg';
import json from '@rollup/plugin-json';

export default [
  {
    ...commonConfig(Package),
    input: './dist/dist-esm/communication-react/src/index.js',
    output: {
      dir: './dist/dist-cjs/communication-react',
      format: 'cjs',
      sourcemap: true
    },
    plugins: [
      commonjs(),
      sourcemaps(),
      svg(),
      json({
        compact: true
      })
    ]
  }
];
