import { NodeModulesPolyfillPlugin as esbuildPluginNodeModulePolyfills } from '@esbuild-plugins/node-modules-polyfill';
import svg from 'esbuild-plugin-svg';
import { build } from 'esbuild';

build({
  bundle: true,
  entryPoints: ['./src/index.tsx'],
  logLevel: 'error',
  minify: true,
  outfile: 'dist/esbuild/index.js',
  plugins: [esbuildPluginNodeModulePolyfills(), svg()],
  sourcemap: true
});
