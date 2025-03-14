// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as express from 'express';
import { CALLCONNECTION_ID_TO_CORRELATION_ID, startTranscriptionForCall } from '../lib/callAutomationUtils';
import { TranscriptionOptions } from '@azure/communication-call-automation/types/communication-call-automation';

const router = express.Router();
interface StartTranscriptionRequest {
  callId: string;
  options?: TranscriptionOptions;
}

router.post('/', async function (req, res, next) {
  const { callId, options }: StartTranscriptionRequest = req.body;
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
    await startTranscriptionForCall(callConnectionId, options);
  } catch (e) {
    console.error('Error starting transcription:', e);
    res.status(500).send('Error starting transcription');
    return;
  }

  res.status(200).end();
});

export default router;
