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
const SAMPLE_DIR = path.resolve(ROOT_DIR, 'samples', 'StaticHtmlComposites');
console.log(`Project root: ${ROOT_DIR}`);
console.log(`Sample root: ${SAMPLE_DIR}`);

const { NodeGlobalsPolyfillPlugin } = NodeGlobalsPolyfillPluginPkg;

const pkgJSON = JSON.parse(readFileSync(path.resolve(SAMPLE_DIR, 'package.json')));

const esbuildOptions = {
  bundle: true,
  entryPoints: [
    path.resolve(SAMPLE_DIR, 'src/service.js'),
    path.resolve(SAMPLE_DIR, 'src/callComposite.js'),
    path.resolve(SAMPLE_DIR, 'src/chatComposite.js')
  ],
  logLevel: 'error',
  metafile: true, // Needed by `htmlPlugin`.
  outdir: path.resolve(SAMPLE_DIR, 'dist/esbuild'), // Needed by `htmlPlugin`.
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
          entryPoints: ['src/callComposite.js', 'src/chatComposite.js', 'src/service.js'],
          filename: 'index.html',
          scriptLoading: 'blocking',
          htmlTemplate: `
          <!DOCTYPE html>

          <head>
            <meta charset="utf-8" />
            <title>Basic example for CallComposite and ChatComposite</title>
          </head>

          <body>
            <!-- height need to be set for composite to fit the layout -->
            <div id="video-call-container" style="height: 55vh"></div>
            <div id="chat-container" style="height: 45vh"></div>
            <!-- replace with https://github.com/Azure/communication-ui-library/releases/latest/download/chatComposite.js for development and prototyping -->
            <script src="./chatComposite.js"></script>
            <!-- replace with https://github.com/Azure/communication-ui-library/releases/latest/download/callComposite.js for development and prototyping -->
            <script src="./callComposite.js"></script>
            <script src="./service.js"></script>
            <script type="module">
              const testParams = service.loadConfigFromUrlQuery();
              const { user, token } = testParams.token
                ? { token: testParams.token, user: { communicationUserId: testParams.userId } }
                : { ...(await service.createUserWithToken()) };
              const groupId = await service.createGUID();
              // Call composite sample code starts here
              const displayName = testParams.displayName ?? 'Bob';

              const callAdapter = await callComposite.loadCallComposite(
                {
                  groupId, // Provide any GUID to join a group
                  displayName: displayName,
                  userId: user,
                  token: token
                },
                document.getElementById('video-call-container')
              );

              const threadId = testParams.threadId ?? (await service.createChatThread());
              testParams.threadId ?? (await service.addChatUser(threadId, user, displayName));
              const endpoint = testParams.endpointUrl ?? (await service.getEndpointUrl());

              // Chat composite sample code starts here
              const chatAdapter = await chatComposite.loadChatComposite(
                {
                  displayName: displayName,
                  threadId: threadId,
                  endpoint: endpoint,
                  userId: user,
                  token: token
                },
                document.getElementById('chat-container'),
                { visualElements: { showParticipantPane: true, showTopic: false } }
              );

              await chatAdapter.sendMessage('Hello to you! 👋');

              window.onbeforeunload = () => {
                callAdapter.dispose();
                chatAdapter.dispose();
              };
            </script>
          </body>
`
        }
      ]
    }),
    svg()
  ],
  sourcemap: true
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

export async function serveIt() {
  const { host: esbuildHost, port: esbuildPort } = await serve(
    {
      servedir: path.resolve(SAMPLE_DIR, 'dist/esbuild') // index.html generated by `htmlPlugin`.
    },
    esbuildOptions
  );
  console.log(`esbuild started at ${esbuildHost}:${esbuildPort}`);
  console.log(`Head over to localhost:3000 to load your app!`);
  // Then start a proxy server on port 3000
  http
    .createServer((req, res) => {
      const hostname = isApiCall(req.url) ? API_HOST : esbuildHost;
      const port = isApiCall(req.url) ? API_PORT : esbuildPort;
      console.log(`Proxy ${req.url} -> ${hostname}:${port}`);
      // Forward each incoming request.
      const proxyReq = http.request(
        {
          hostname,
          port,
          path: req.url,
          method: req.method,
          headers: req.headers
        },
        (proxyRes) => {
          console.log(`Proxy response: ${proxyRes.statusCode}`);
          res.writeHead(proxyRes.statusCode, proxyRes.headers);
          proxyRes.pipe(res, { end: true });
        }
      );
      // Forward the body of the request.
      req.pipe(proxyReq, { end: true });
    })
    .listen(3000);
}

function isApiCall(url) {
  return API_PATHS.some((p) => url.startsWith(p));
}

export async function buildIt() {
  const result = await build(esbuildOptions);
  writeFileSync(path.resolve(SAMPLE_DIR, 'dist/esbuild/meta.json'), JSON.stringify(result.metafile, null, 2));
}
