// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as express from 'express';
import { CALLCONNECTION_ID_TO_CORRELATION_ID } from '../lib/callAutomationUtils';
import { startTranscriptionForCall } from '../lib/callAutomationUtils';
import { sendEventToClients } from '../app';

const router = express.Router();

router.post('/', async function (req, res) {
  try {
    if (req.body[0].type === 'Microsoft.Communication.CallConnected') {
      console.log('/automationEvent received', req.body);
      const connectionId = req.body[0].data.callConnectionId;
      /**
       * this id in the CallAutomation event is the CallId that we get
       * from the calling SDK in the client.
       */
      const serverCallId = req.body[0].data.serverCallId;

      /**
       * if the call already exists in the mapping we don't want to start a
       */
      if (CALLCONNECTION_ID_TO_CORRELATION_ID[req.body[0].data.callConnectionId]) {
        console.log('CallConnectionId already exists in mapping');

        res.status(200).end();
        return;
      }
      /**
       * We want to make a mapping here between the callConnectionId and the correlationId
       * The correlationId in the data is the id of the call that we are using to start the transcription this id
       * is from the calling SDK and the callConnectionId is mapped to the correlationId from the transcription
       * service. We need to store this mapping so that we can fetch the transcription later.
       */
      CALLCONNECTION_ID_TO_CORRELATION_ID[req.body[0].data.callConnectionId] = {
        serverCallId: req.body[0].data.serverCallId,
        correlationId: CALLCONNECTION_ID_TO_CORRELATION_ID[req.body[0].data.callConnectionId]?.correlationId
      };
    } else if (req.body[0].type === 'Microsoft.Communication.ParticipantAdded') {
      console.log('Participant added event received', req.body);
      const connectionId = req.body[0].data.callConnectionId;
      const serverCallId = CALLCONNECTION_ID_TO_CORRELATION_ID[connectionId]?.serverCallId;
      const transcriptionStatus = !!Object.keys(CALLCONNECTION_ID_TO_CORRELATION_ID).find((key) =>
        CALLCONNECTION_ID_TO_CORRELATION_ID[key].serverCallId.includes(serverCallId)
      );

      if (serverCallId) {
        console.log('Starting transcription for call:', serverCallId);
        await startTranscriptionForCall(connectionId);
        sendEventToClients('TranscriptionStatus', { serverCallId, transcriptionStatus });
      }
    }
  } catch (e) {
    console.error('Error processing automation event:', e);
    res.status(500).send('Error processing automation event');
  }

  res.status(200).end();
});

export default router;
