import { NodeModulesPolyfillPlugin as esbuildPluginNodeModulePolyfills } from './node-modules-polyfill/index.js';
import NodeGlobalsPolyfillPluginPkg from '@esbuild-plugins/node-globals-polyfill';
import globCopy from 'esbuild-plugin-globcopy';
import svg from 'esbuild-plugin-svg';
import alias from 'esbuild-plugin-alias';
import { htmlPlugin } from '@craftamap/esbuild-plugin-html';
import { build, serve } from 'esbuild';
import { readFileSync, writeFileSync } from 'fs';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
const { NodeGlobalsPolyfillPlugin } = NodeGlobalsPolyfillPluginPkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..', '..', '..');
const PACKAGE_DIR = path.resolve(ROOT_DIR, 'packages', 'react-composites');
console.log(`Project root: ${ROOT_DIR}`);
console.log(`Sample root: ${PACKAGE_DIR}`);
const PREPROCESSED_SRC_DIR = process.env.COMMUNICATION_REACT_FLAVOR === 'stable' ? 'preprocessed' : 'src';

const pkgJSON = JSON.parse(readFileSync(path.resolve(PACKAGE_DIR, 'package.json')));

const esbuildOptions = (testSubDir, outDir) => {
  console.log(
    `Flavor: ${process.env.COMMUNICATION_REACT_FLAVOR}: Using packlet sources from .../${PREPROCESSED_SRC_DIR}.`
  );
  const testDir = path.resolve(PACKAGE_DIR, testSubDir);
  return {
    bundle: true,
    entryPoints: [path.resolve(testDir, 'index.tsx')],
    logLevel: 'error',
    metafile: true, // Needed by `htmlPlugin`.
    outdir: outDir, // Needed by `htmlPlugin`.
    plugins: [
      alias({
        '@azure/communication-react': absolutePathToPacklet('communication-react'),
        '@internal/acs-ui-common': absolutePathToPacklet('acs-ui-common'),
        '@internal/calling-component-bindings': absolutePathToPacklet('calling-component-bindings'),
        '@internal/calling-stateful-client': absolutePathToPacklet('calling-stateful-client'),
        '@internal/chat-component-bindings': absolutePathToPacklet('chat-component-bindings'),
        '@internal/chat-stateful-client': absolutePathToPacklet('chat-stateful-client'),
        '@internal/react-components': absolutePathToPacklet('react-components'),
        '@internal/react-composites': absolutePathToPacklet('react-composites'),
        '../../../../src': absolutePathToPacklet('react-composites'),
        // Hack to dirty even for an FHL. This path should never have been referenced from the app in the first place.
        '../../../../src/composites/ChatComposite/file-sharing': path.resolve(
          ROOT_DIR,
          `packages/react-composites/${PREPROCESSED_SRC_DIR}/composites/ChatComposite/file-sharing/index.ts`
        )
      }),
      globCopy({
        targets: ['fonts']
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
            // This is very finicky. It wants relative path AND it depends on cwd of where the script is run from :(
            entryPoints: [`${testSubDir}/index.tsx`],
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
  const testRootSubDir = process.env.COMMUNICATION_REACT_FLAVOR === 'stable' ? 'preprocessed-tests' : 'tests';
  const testSubDir = `${testRootSubDir}/browser/${composite}/app`;
  const testDir = path.resolve(PACKAGE_DIR, testSubDir);
  const outDir = path.resolve(PACKAGE_DIR, `tests/browser/${composite}/app/dist/esbuild`);
  const result = await build(esbuildOptions(testSubDir, outDir));
  writeFileSync(path.resolve(outDir, 'meta.json'), JSON.stringify(result.metafile, null, 2));
}

const absolutePathToPacklet = (packlet) =>
  path.resolve(ROOT_DIR, `packages/${packlet}/${PREPROCESSED_SRC_DIR}/index.ts`);
