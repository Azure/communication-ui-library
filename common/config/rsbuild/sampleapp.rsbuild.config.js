// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import path from 'path';
import { pluginReact } from '@rsbuild/plugin-react';
import { defineConfig } from '@rsbuild/core';

export const rsbuildConfig = (sampleAppDir) => {
  const packageJson = require(path.join(sampleAppDir, 'package.json'));
  return defineConfig({
    source: {
      alias: {
        '@azure/communication-react': path.resolve(sampleAppDir, '../../packages/communication-react/src'),
        '@internal/react-components': path.resolve(sampleAppDir, '../../packages/react-components/src'),
        '@internal/react-composites': path.resolve(sampleAppDir, '../../packages/react-composites/src'),
        '@internal/chat-stateful-client': path.resolve(sampleAppDir, '../../packages/chat-stateful-client/src'),
        '@internal/chat-component-bindings': path.resolve(sampleAppDir, '../../packages/chat-component-bindings/src'),
        '@internal/calling-stateful-client': path.resolve(sampleAppDir, '../../packages/calling-stateful-client/src'),
        '@internal/calling-component-bindings': path.resolve(sampleAppDir, '../../packages/calling-component-bindings/src'),
        '@internal/acs-ui-common': path.resolve(sampleAppDir, '../../packages/acs-ui-common/src'),
        '@internal/fake-backends': path.resolve(sampleAppDir, '../../fake-backends/src'),
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
    html: {
      title: 'UI Library Sample'
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
};