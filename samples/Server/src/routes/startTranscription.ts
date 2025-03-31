// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as express from 'express';
import { CALLCONNECTION_ID_TO_CORRELATION_ID, startTranscriptionForCall } from '../lib/callAutomationUtils';
import { TranscriptionOptions } from '@azure/communication-call-automation/types/communication-call-automation';
import { sendMessageToWebSocket } from '../app';

const router = express.Router();
interface StartTranscriptionRequest {
  serverCallId: string;
  options?: TranscriptionOptions;
}

router.post('/', async function (req, res, next) {
  const { serverCallId, options }: StartTranscriptionRequest = req.body;

  console.log('Starting transcription for call:', serverCallId);
  console.log(CALLCONNECTION_ID_TO_CORRELATION_ID);
  const callConnectionId = Object.keys(CALLCONNECTION_ID_TO_CORRELATION_ID).find((key) =>
    CALLCONNECTION_ID_TO_CORRELATION_ID[key].serverCallId.includes(serverCallId)
  );
  console.log('Call connection id:', callConnectionId);
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
  sendMessageToWebSocket(
    JSON.stringify({
      kind: 'TranscriptionStarted',
      serverCallId: serverCallId
    })
  );
});

export default router;
