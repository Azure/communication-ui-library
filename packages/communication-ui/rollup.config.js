// © Microsoft Corporation. All rights reserved.

import commonjs from '@rollup/plugin-commonjs';
import sourcemaps from 'rollup-plugin-sourcemaps';
import svg from 'rollup-plugin-svg';
import Package from './package.json';

export default {
  context: 'window',
  external: [
    ...Object.keys(Package.dependencies),
    ...Object.keys(Package.peerDependencies),
    '@fluentui/react-northstar/dist/commonjs/components/Alert/Alert'
  ],
  input: './dist/dist-esm/index.js',
  output: {
    file: './dist/dist-cjs/index.js',
    format: 'cjs',
    sourcemap: true
  },
  plugins: [commonjs(), sourcemaps(), svg()]
};
