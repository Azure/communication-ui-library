// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as express from 'express';
import { CALLCONNECTION_ID_TO_CORRELATION_ID, TRANSCRIPTION_STORE } from '../lib/callAutomationUtils';
import { TranscriptionData } from '@azure/communication-call-automation';

const router = express.Router();
interface FetchTranscriptRequest {
  serverCallId: string;
}
interface FetchTranscriptResponse {
  transcript: TranscriptionData[];
}

router.post('/', async function (req, res, next) {
  const { serverCallId }: FetchTranscriptRequest = req.body;
  console.log('Fetching transcript for call:', serverCallId, 'available calls:', Object.keys(TRANSCRIPTION_STORE));
  /**
   * callId here is the correlationId in the Automation event saying transcription has started
   * we need to use this to get the call connectionId from the callAutomation client
   */
  const connectionId = Object.keys(CALLCONNECTION_ID_TO_CORRELATION_ID).find((key) =>
    CALLCONNECTION_ID_TO_CORRELATION_ID[key].serverCallId.includes(serverCallId)
  );
  const correlationId = CALLCONNECTION_ID_TO_CORRELATION_ID[connectionId]?.correlationId;

  console.log('Transcript correlation id:', correlationId);

  if (!TRANSCRIPTION_STORE[correlationId]) {
    res.status(404).send('Transcription not found');
    return;
  } else {
    console.log('Transcription found:', TRANSCRIPTION_STORE[correlationId]);
  }

  const response: FetchTranscriptResponse = { transcript: TRANSCRIPTION_STORE[correlationId]?.data ?? [] };
  res.status(200).send(response);
});

export default router;
