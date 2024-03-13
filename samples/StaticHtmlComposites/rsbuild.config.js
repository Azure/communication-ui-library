// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import path from 'path';
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  source: {
    entry: {
      chatComposite: './src/chatComposite.js',
      callComposite: './src/callComposite.js',
      callWithChatComposite: './src/callWithChatComposite.js',
      service: './src/service.js'
    },
    alias: {
      '@azure/communication-react': path.resolve(__dirname, '../../packages/communication-react/src')
    }
  },
  performance: {
    chunkSplit: {
      strategy: 'all-in-one'
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
