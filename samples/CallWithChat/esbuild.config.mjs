import { NodeModulesPolyfillPlugin as esbuildPluginNodeModulePolyfills } from '@esbuild-plugins/node-modules-polyfill';
import svg from 'esbuild-plugin-svg';
import { build } from 'esbuild';

build({
  entryPoints: ['./src/index.tsx'],
  outfile: 'dist/esbuild/index.js',
  bundle: true,
  plugins: [esbuildPluginNodeModulePolyfills(), svg()],
  sourcemap: true,
  logLevel: 'error'
});
