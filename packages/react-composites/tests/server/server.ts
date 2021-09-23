// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import express from 'express';
import { Server } from 'http';
import path from 'path';

let server: Server;
const app = express();

export const createTestServer =
  (props: { appDir: string; serverUrl: string }) =>
  // eslint-disable-next-line no-empty-pattern, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  async ({}, use: (r: string) => Promise<void>) => {
    await startServer(props.appDir);
    try {
      await use(props.serverUrl);
    } finally {
      await stopServer();
    }
  };

export const startServer = (appDir: string): Promise<void> => {
  app.use(express.static(path.resolve(appDir, 'dist')));

  return new Promise((resolve, reject) => {
    server = app.listen(3000, () => {
      resolve();
    });
  });
};

export const stopServer = (): Promise<void> =>
  new Promise((resolve, reject) => {
    if (!server) reject(false);
    server.close(() => {
      resolve();
    });
  });
