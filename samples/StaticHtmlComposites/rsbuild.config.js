// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import path from 'path';
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginUmd } from '@rsbuild/plugin-umd';

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
  output: {
    filename: {
      js: '[name].js',
      jsAsync: '[name].js'
    },
    distPath: {
      js: path.resolve(__dirname, 'dist'),
      jsAsync: path.resolve(__dirname, 'dist')
    },
    copy: [{ from: path.join(__dirname, 'fonts', '*.woff2') }]
  },
  tools: {
    htmlPlugin(config, { entryName }) {
      if (entryName === 'chatComposite') {
        config.template = 'chatComposite.html';
        config.excludeChunks = ['chatComposite']; // already included in html file
      }
      if (entryName === 'callComposite') {
        config.template = 'callComposite.html';
        config.excludeChunks = ['callComposite'];
      }
      if (entryName === 'callWithChatComposite') {
        config.template = 'callWithChatComposite.html';
        config.excludeChunks = ['callWithChatComposite']; // already included in html file
      }
      if (entryName === 'service') {
        config.template = 'index.html';
        config.excludeChunks = ['service']; // already included in html file
      }
    }
  },
  performance: {
    chunkSplit: {
      strategy: 'all-in-one'
    },
    printFileSize: false
  },
  plugins: [pluginReact(), pluginUmd({ name: '[name]' })],
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
  },
  dev: {
    client: {
      port: 443 // required for codespaces https://github.com/orgs/community/discussions/11524
    }
  }
});
