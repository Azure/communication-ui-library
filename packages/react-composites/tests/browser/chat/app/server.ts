// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import express from 'express';
import { Server } from 'http';

let server: Server;
const app = express();
app.use(express.static(__dirname + '/dist'));

export const startServer = (): Promise<void> =>
  new Promise((resolve, reject) => {
    server = app.listen(3000, () => {
      resolve();
    });
  });

export const stopServer = (): Promise<void> =>
  new Promise((resolve, reject) => {
    if (!server) reject(false);
    server.close(() => {
      resolve();
    });
  });
