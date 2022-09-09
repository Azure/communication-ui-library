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
  async ({}, use: (r: string) => Promise<void>, workerInfo) => {
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
    // We've seen some test failures due to timeout (after 60s) in closing the server.
    // This is a serious issue, but the following early resolve is an experiment
    // to see if we can get tests to pass / get some insight by continuing early.
    setInterval(resolve, 40000);
  });
