// © Microsoft Corporation. All rights reserved.

import commonjs from '@rollup/plugin-commonjs';
import sourcemaps from 'rollup-plugin-sourcemaps';
import svg from 'rollup-plugin-svg';

export default {
  context: 'window',
  external: [],
  input: './dist/dist-esm/index.js',
  output: {
    file: './dist/dist-cjs/index.js',
    format: 'cjs',
    sourcemap: true
  },
  plugins: [commonjs(), sourcemaps(), svg()]
};
