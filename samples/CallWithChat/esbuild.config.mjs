import { NodeModulesPolyfillPlugin as esbuildPluginNodeModulePolyfills } from '@esbuild-plugins/node-modules-polyfill';
import { build } from 'esbuild';

build({
  entryPoints: ['./src/index.tsx'],
  outfile: 'dist/esbuild/index.js',
  bundle: true,
  plugins: [esbuildPluginNodeModulePolyfills()],
  sourcemap: true,
  logLevel: 'error'
});
