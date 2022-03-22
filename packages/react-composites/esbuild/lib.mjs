import { NodeModulesPolyfillPlugin as esbuildPluginNodeModulePolyfills } from './node-modules-polyfill/index.js';
import NodeGlobalsPolyfillPluginPkg from '@esbuild-plugins/node-globals-polyfill';
import svg from 'esbuild-plugin-svg';
import alias from 'esbuild-plugin-alias';
import { htmlPlugin } from '@craftamap/esbuild-plugin-html';
import { build, serve } from 'esbuild';
import { readFileSync, writeFileSync } from 'fs';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..', '..', '..');
const PACKAGE_DIR = path.resolve(ROOT_DIR, 'packages', 'react-composites');
console.log(`Project root: ${ROOT_DIR}`);
console.log(`Sample root: ${PACKAGE_DIR}`);

const { NodeGlobalsPolyfillPlugin } = NodeGlobalsPolyfillPluginPkg;

const pkgJSON = JSON.parse(readFileSync(path.resolve(PACKAGE_DIR, 'package.json')));

const esbuildOptions = (testSubDir) => {
  const testDir = path.resolve(PACKAGE_DIR, testSubDir);
  return {
    bundle: true,
    entryPoints: [path.resolve(testDir, 'index.tsx')],
    logLevel: 'error',
    metafile: true, // Needed by `htmlPlugin`.
    outdir: path.resolve(testDir, 'dist/esbuild'), // Needed by `htmlPlugin`.
    plugins: [
      alias({
        '@azure/communication-react': path.resolve(ROOT_DIR, 'packages/communication-react/src/index.ts'),
        '@internal/react-components': path.resolve(ROOT_DIR, 'packages/react-components/src/index.ts'),
        '@internal/react-composites': path.resolve(ROOT_DIR, 'packages/react-composites/src/index.ts'),
        '@internal/chat-stateful-client': path.resolve(ROOT_DIR, 'packages/chat-stateful-client/src/index.ts'),
        '@internal/chat-component-bindings': path.resolve(ROOT_DIR, 'packages/chat-component-bindings/src/index.ts'),
        '@internal/calling-stateful-client': path.resolve(ROOT_DIR, 'packages/calling-stateful-client/src/index.ts'),
        '@internal/calling-component-bindings': path.resolve(
          ROOT_DIR,
          'packages/calling-component-bindings/src/index.ts'
        ),
        '@internal/acs-ui-common': path.resolve(ROOT_DIR, 'packages/acs-ui-common/src/index.ts')
      }),
      NodeGlobalsPolyfillPlugin(),
      esbuildPluginNodeModulePolyfills(),
      htmlPlugin({
        files: [
          {
            define: {
              __CALLINGVERSION__: pkgJSON.dependencies['@azure/communication-calling'],
              __CHATVERSION__: pkgJSON.dependencies['@azure/communication-chat'],
              __COMMUNICATIONREACTVERSION__: pkgJSON.dependencies['@azure/communication-react'],
              __BUILDTIME__: new Date().toLocaleString()
            },
            entryPoints: [testSubDir],
            filename: 'index.html',
            htmlTemplate: `
          <!-- Copyright (c) Microsoft Corporation. -->
          <!-- Licensed under the MIT license. -->

          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="utf-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <meta name="description" content="Composite - Test App" />
              <title>Composite - Test App</title>

              <!-- Ensure that fonts have loaded before tests are run -->
              <link rel="preload" href="./fonts/segoeui-regular.woff2" as="font" crossorigin="anonymous" />
              <link rel="preload" href="./fonts/segoeui-semibold.woff2" as="font" crossorigin="anonymous" />
              <link rel="preload" href="./fonts/segoeui-bold.woff2" as="font" crossorigin="anonymous" />
              <style>
                @font-face {
                  font-weight: 400;
                  src: url('./fonts/segoeui-regular.woff2') format('woff2');
                  font-family: 'Segoe UI';
                }
                @font-face {
                  font-weight: 600;
                  src: url('./fonts/segoeui-semibold.woff2') format('woff2');
                  font-family: 'Segoe UI';
                }
                @font-face {
                  font-weight: 700;
                  src: url('./fonts/segoeui-bold.woff2') format('woff2');
                  font-family: 'Segoe UI';
                }
              </style>

              <style>
                /* Important: For ensuring that blinking cursor doesn't get captured in
                   snapshots and cause a diff in subsequent tests. */
                * {
                  caret-color: transparent !important;
                }

                /* Help with inconsistent font rendering */
                * {
                  text-rendering: geometricprecision !important;
                }

                /* Prevent animations. waitForElementState('stable') is not working for opacity
                   animation https://github.com/microsoft/playwright/issues/4055#issuecomment-777697079.
                   Examples of components that currently animate are button flyouts and button tooltips */
                *,
                *::before,
                *::after {
                  transition: none !important;
                  -webkit-transition: none !important;
                  -moz-transition: none !important;
                  -ms-transition: none !important;
                  -o-transition: color 0 ease-in !important;
                  animation: none !important;
                }
              </style>
            </head>

            <body>
              <main id="root" class="Root">
                <!-- Anything in here is replaced by react when react mounts and completes the first render pass -->
                Loading...
              </main>
            </body>
          </html>

      `
          }
        ]
      }),
      svg()
    ],
    sourcemap: true
  };
};

const API_HOST = 'localhost';
const API_PORT = '8080';
const API_PATHS = [
  '/token',
  '/refreshToken',
  '/isValidThread',
  '/createThread',
  '/userConfig',
  '/getEndpointUrl',
  '/addUser'
];

export async function buildIt(composite) {
  const testSubDir = `tests/browser/${composite}/app`;
  const testDir = path.resolve(PACKAGE_DIR, testSubDir);
  const result = await build(esbuildOptions(testSubDir));
  writeFileSync(path.resolve(testDir, 'dist/esbuild/meta.json'), JSON.stringify(result.metafile, null, 2));
}
