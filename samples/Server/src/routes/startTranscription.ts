// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as express from 'express';
import { startTranscriptionForCall } from '../lib/callAutomationUtils';

const router = express.Router();
interface StartTranscriptionRequest {
  callConnectionId: string;
}

router.post('/', async function (req, res, next) {
  const { callConnectionId }: StartTranscriptionRequest = req.body;
  console.log('Starting transcription for call:', callConnectionId);
  try {
    await startTranscriptionForCall(callConnectionId);
  } catch (e) {
    console.error('Error starting transcription:', e);
    res.status(500).send('Error starting transcription');
    return;
  }

  res.status(200).end();
});

export default router;
