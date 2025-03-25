// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as express from 'express';
import { checkIfTranscriptionStarted } from '../lib/callAutomationUtils';

const router = express.Router();
interface FetchTranscriptStateRequest {
  serverCallId: string;
}

router.post('/', async function (req, res, next) {
  const { serverCallId }: FetchTranscriptStateRequest = req.body;
  console.log('Checking transcription state for call:', serverCallId);
  const transcriptStarted = checkIfTranscriptionStarted(serverCallId);

  res.status(200).json(transcriptStarted);
});

export default router;
