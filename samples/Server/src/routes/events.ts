// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as express from 'express';
import { clients, sendEventToClients } from '../app';

const router = express.Router();

router.get('/', async function (req, res) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();
  console.log('Client connected to SSE endpoint');
  // Send an initial event to confirm the connection
  res.write('data: Connection established\n\n');

  // Add the client to the list of connected clients
  clients.push(res);

  // Remove the client when the connection is closed
  req.on('close', () => {
    const index = clients.indexOf(res);
    if (index !== -1) {
      clients.splice(index, 1);
    }
  });
  res.status(200);
});

export default router;
