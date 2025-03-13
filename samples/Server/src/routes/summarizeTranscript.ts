// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as express from 'express';
import { SummarizeConversation } from '../lib/summarizationHelper';
import { formatTranscriptionForSummarization, getTranscriptionData } from '../lib/callAutomationUtils';

const router = express.Router();
interface SummarizeTranscriptRequest {
  /** CallId of the transcript to summarize */
  callId: string;
}

router.post('/', async function (req, res, next) {
  try {
    const { callId }: SummarizeTranscriptRequest = req.body;
    const transcription = getTranscriptionData(callId);

    if (!transcription) {
      res.status(404).send('Transcription not found');
      return;
    }

    const formattedTranscript = await formatTranscriptionForSummarization(transcription);

    const summarized = await SummarizeConversation(formattedTranscript);
    res.send(summarized);
  } catch (e) {
    console.error('Error summarizing transcript:', e);
    res.status(500).send('Error summarizing transcript');
  }
});

export default router;
