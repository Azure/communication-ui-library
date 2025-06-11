// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { WorkerInfo } from '@playwright/test';
import express from 'express';
import { Server } from 'http';
import path from 'path';

let server: Server;
const app = express();

/**
 *
 * @param props - Properties for the test server, including the app directory and server URL.
 * @returns - A Playwright fixture that starts a test server and provides the server URL.
 */
export const createTestServer =
  (props: { appDir: string; serverUrl: string }) =>
  // eslint-disable-next-line no-empty-pattern, @typescript-eslint/explicit-module-boundary-types
  async ({}, use: (r: string) => Promise<void>, workerInfo: WorkerInfo) => {
    const port = 3000 + workerInfo.workerIndex;
    await startServer(props.appDir, port);
    try {
      await use(`${props.serverUrl}:${port}`);
    } finally {
      await stopServer();
    }
  };

const startServer = (appDir: string, port: number): Promise<void> => {
  app.use(express.static(path.resolve(appDir, 'dist')));

  return new Promise((resolve) => {
    server = app.listen(port, () => {
      resolve();
    });
  });
};

const stopServer = (): Promise<void> =>
  new Promise((resolve, reject) => {
    if (!server) {
      reject(false);
    }
    server.close(() => {
      resolve();
    });

    // closeAllConnections() is only available from Node v18.02
    if (server.closeAllConnections) {
      server.closeAllConnections();
    } else {
      setTimeout(() => resolve(), 5000);
    }
  });
