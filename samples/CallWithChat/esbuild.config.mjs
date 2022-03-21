import { NodeModulesPolyfillPlugin as esbuildPluginNodeModulePolyfills } from '@esbuild-plugins/node-modules-polyfill';
import svg from 'esbuild-plugin-svg';
import { htmlPlugin } from '@craftamap/esbuild-plugin-html';
import { build } from 'esbuild';

build({
  bundle: true,
  entryPoints: ['./src/index.tsx'],
  logLevel: 'error',
  metafile: true, // Needed by `htmlPlugin`.
  minify: true,
  outdir: 'dist/esbuild/', // Needed by `htmlPlugin`.
  plugins: [
    esbuildPluginNodeModulePolyfills(),
    htmlPlugin({
      files: [
        {
          entryPoints: ['./src/index.tsx'],
          filename: 'index.html',
          template: `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="Azure Communication Services - UI Library: Call With Chat Sample app" />
    <title>UI Library Call With Chat Sample</title>
  </head>

  <body>
    <main id="root" class="Root"></main>
    <script type="text/javascript">
      window.FabricConfig = {};
    </script>
  </body>
</html>
        `
        }
      ]
    }),
    svg()
  ],
  sourcemap: true
});
