// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as express from 'express';
import { connectRoomsCall } from '../lib/callAutomationUtils';

const router = express.Router();
interface connectToRoomsCallRequest {
  serverCallId: string;
}

router.post('/', async function (req, res, next) {
  const { serverCallId }: connectToRoomsCallRequest = req.body;

  console.log('Connecting to call:', serverCallId);
  try {
    await connectRoomsCall(serverCallId);
  } catch (e) {
    console.error('Error connecting to call:', e);
    res.status(500).send('Error connecting to call');
    return;
  }
  res.status(200).end();
});

export default router;
