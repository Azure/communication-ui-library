// © Microsoft Corporation. All rights reserved.

import commonjs from '@rollup/plugin-commonjs';
import sourcemaps from 'rollup-plugin-sourcemaps';
import svg from 'rollup-plugin-svg';

export default {
  context: 'window',
  external: [
    '@azure/communication-calling',
    '@azure/communication-common',
    '@azure/communication-chat',
    '@fluentui/react',
    '@fluentui/react-icons',
    '@fluentui/react-icons-northstar',
    '@fluentui/react-northstar',
    '@fluentui/react-northstar/dist/commonjs/components/Alert/Alert',
    '@fluentui/react-theme-provider',
    '@uifabric/react-hooks',
    'classnames',
    'copy-to-clipboard',
    'react',
    'react-aria-live',
    'react-linkify'
  ],
  input: './dist/dist-esm/index.js',
  output: {
    file: './dist/dist-cjs/index.js',
    format: 'cjs',
    sourcemap: true
  },
  plugins: [commonjs(), sourcemaps(), svg()]
};
