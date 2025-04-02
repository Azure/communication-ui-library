// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as express from 'express';
import { CALLCONNECTION_ID_TO_CORRELATION_ID, stopTranscriptionForCall } from '../lib/callAutomationUtils';
import { sendEventToClients } from '../app';

const router = express.Router();
interface StartTranscriptionRequest {
  serverCallId: string;
}

router.post('/', async function (req, res, next) {
  const { serverCallId }: StartTranscriptionRequest = req.body;

  const callConnectionId = Object.keys(CALLCONNECTION_ID_TO_CORRELATION_ID).find((key) =>
    CALLCONNECTION_ID_TO_CORRELATION_ID[key].serverCallId.includes(serverCallId)
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

  // Send SSE event to clients
  sendEventToClients('TranscriptionStopped', { serverCallId });
});

export default router;
