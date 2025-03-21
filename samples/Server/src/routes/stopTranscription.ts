// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as express from 'express';
import { CALLCONNECTION_ID_TO_CORRELATION_ID, stopTranscriptionForCall } from '../lib/callAutomationUtils';

const router = express.Router();
interface StartTranscriptionRequest {
  callId: string;
}

router.post('/', async function (req, res, next) {
  const { callId }: StartTranscriptionRequest = req.body;
  console.log('Starting transcription for call:', callId);

  console.log(CALLCONNECTION_ID_TO_CORRELATION_ID);
  const callConnectionId = Object.keys(CALLCONNECTION_ID_TO_CORRELATION_ID).find(
    (key) => CALLCONNECTION_ID_TO_CORRELATION_ID[key].callId === callId
  );
  if (!callConnectionId) {
    res.status(404).send('Call not found');
    return;
  }

  try {
    await stopTranscriptionForCall(callConnectionId);
  } catch (e) {
    console.error('Error stopping transcription:', e);
    res.status(500).send('Error stopping transcription');
    return;
  }

  res.status(200).end();
});

export default router;
