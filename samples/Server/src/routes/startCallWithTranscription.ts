// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as express from 'express';
import { connectRoomsCallWithTranscription } from '../lib/callAutomationUtils';

const router = express.Router();
interface StartCallWithTranscriptionRequest {
  roomId: string;
}

router.post('/', async function (req, res, next) {
  const { roomId }: StartCallWithTranscriptionRequest = req.body;
  try {
    await connectRoomsCallWithTranscription(roomId);
  } catch (e) {
    console.error('Error starting call with transcription:', e);
    res.status(500).send('Error starting call');
    return;
  }

  res.status(200).end();
});

export default router;
