// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import Package from './package.json';
import commonjs from '@rollup/plugin-commonjs';
import sourcemaps from 'rollup-plugin-sourcemaps';
import svg from 'rollup-plugin-svg';
import json from '@rollup/plugin-json';

export default {
  context: 'window',
  external: [
    ...(Package.dependencies ? Object.keys(Package.dependencies) : []),
    ...(Package.peerDependencies ? Object.keys(Package.peerDependencies) : [])
  ],
  input: './dist/dist-esm/index.js',
  output: {
    dir: './dist/dist-cjs',
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
};
