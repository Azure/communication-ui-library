// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as express from 'express';
import { checkIfTranscriptionStarted } from '../lib/callAutomationUtils';
import { sendEventToClients } from '../app';

const router = express.Router();
interface FetchTranscriptStateRequest {
  serverCallId: string;
}

router.post('/', async function (req, res, next) {
  const { serverCallId }: FetchTranscriptStateRequest = req.body;
  console.log('Checking transcription state for call:', serverCallId);
  const transcriptStarted = checkIfTranscriptionStarted(serverCallId);

  res.status(200).json(transcriptStarted);
  // Send SSE event to clients
  sendEventToClients('TranscriptionStatus', { serverCallId, transcriptStarted });
});

export default router;
