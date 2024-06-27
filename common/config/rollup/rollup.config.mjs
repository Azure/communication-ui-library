// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import sourcemaps from 'rollup-plugin-sourcemaps';
import svg from 'rollup-plugin-svg';

export default (packageJson) => ({
  context: 'window',
  external: [
    ...(packageJson.dependencies ? Object.keys(packageJson.dependencies) : []),
    ...(packageJson.peerDependencies ? Object.keys(packageJson.peerDependencies) : [])
  ],
  input: './dist/dist-esm/index.js',
  output: {
    file: './dist/dist-cjs/index.js',
    format: 'cjs',
    inlineDynamicImports: true,
    sourcemap: true
  },
  plugins: [commonjs(), sourcemaps(), svg(), json({ compact: true })],
  strictDeprecations: true
});
