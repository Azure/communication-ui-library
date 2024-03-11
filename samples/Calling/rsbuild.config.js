// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import packageJson from './package.json';

export default defineConfig({
  entry: 'src/index.tsx',
  source: {
    alias: {
      '@internal/chat-component-bindings': ['../../packages/chat-component-bindings/src'],
      '@internal/calling-component-bindings': ['../../packages/calling-component-bindings/src'],
      '@internal/acs-ui-common': ['../../packages/acs-ui-common/src'],
      '@internal/calling-stateful-client': ['../../packages/calling-stateful-client/src'],
      '@internal/chat-stateful-client': ['../../packages/chat-stateful-client/src'],
      '@internal/react-components': ['../../packages/react-components/src'],
      '@internal/react-composites': ['../../packages/react-composites/src'],
      '@azure/communication-react': ['../../packages/communication-react/src']
    },
    define: {
      'process.env.PRODUCTION': process.env.production || !process.env.development,
      'process.env.NAME': JSON.stringify(packageJson.name),
      'process.env.VERSION': JSON.stringify(packageJson.version),
      __CALLINGVERSION__: JSON.stringify(packageJson.dependencies['@azure/communication-calling']),
      __CHATVERSION__: JSON.stringify(packageJson.dependencies['@azure/communication-chat']),
      __COMMUNICATIONREACTVERSION__: JSON.stringify(packageJson.dependencies['@azure/communication-react']),
      __BUILDTIME__: JSON.stringify(new Date().toLocaleString()),
      __COMMITID__: `"${process.env.REACT_APP_COMMIT_SHA || ''}"`
    }
  },
  plugins: [pluginReact()],
  server: {
    port: 3000,
    proxy: {
      '/token': 'http://[::1]:8080',
      '/refreshToken/*': 'http://[::1]:8080',
      '/createThread': 'http://[::1]:8080',
      '/userConfig/*': 'http://[::1]:8080',
      '/getEndpointUrl': 'http://[::1]:8080',
      '/addUser/*': 'http://[::1]:8080',
      '/createRoom': 'http://[::1]:8080',
      '/addUserToRoom': 'http://[::1]:8080',
      '/uploadToAzureBlobStorage': 'http://[::1]:8080'
    }
  }
});
