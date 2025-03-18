// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as express from 'express';
import { CALLCONNECTION_ID_TO_CORRELATION_ID } from '../lib/callAutomationUtils';
import { startTranscriptionForCall } from '../lib/callAutomationUtils';

const router = express.Router();

router.post('/', async function (req, res) {
  console.log('/automationEvent received', req.body);
  try {
    if (req.body[0].type === 'Microsoft.Communication.CallConnected') {
      /**
       * We want to make a mapping here between the callConnectionId and the correlationId
       * The correlationId in the data is the id of the call that we are using to start the transcription this id
       * is from the calling SDK and the callConnectionId is mapped to the correlationId from the transcription
       * service. We need to store this mapping so that we can fetch the transcription later.
       */
      CALLCONNECTION_ID_TO_CORRELATION_ID[req.body[0].data.callConnectionId] = {
        callId: req.body[0].data.correlationId,
        correlationId: CALLCONNECTION_ID_TO_CORRELATION_ID[req.body[0].data.callConnectionId]?.correlationId
      };
    }
  } catch (e) {
    console.error('Error processing automation event:', e);
    res.status(500).send('Error processing automation event');
  }

  res.status(200).end();
});

export default router;
