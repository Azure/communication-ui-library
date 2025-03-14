// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as express from 'express';
import { REMOTE_PARTICIPANTS_IN_CALL } from '../lib/callAutomationUtils';

const router = express.Router();

interface UpdateRemoteParticipantsRequest {
  callCorrelationId: string;
  remoteParticipants: { communicationUserId: string; displayName: string }[];
}

router.post('/', async function (req, res, next) {
  const { callCorrelationId, remoteParticipants }: UpdateRemoteParticipantsRequest = req.body;
  console.log('Updating remote participants for call:', callCorrelationId, 'participants:', remoteParticipants);

  if (!REMOTE_PARTICIPANTS_IN_CALL[callCorrelationId]) {
    res.status(404).send('Call not found');
    return;
  }

  const callParticipants = REMOTE_PARTICIPANTS_IN_CALL[callCorrelationId];
  if (!callParticipants) {
    REMOTE_PARTICIPANTS_IN_CALL[callCorrelationId] = remoteParticipants;
    res.status(200).end('Call participants added to new call');
    return;
  }

  remoteParticipants.forEach((remoteParticipant) => {
    if (
      !callParticipants.some((participant) => participant.communicationUserId === remoteParticipant.communicationUserId)
    ) {
      callParticipants.concat([
        { communicationUserId: remoteParticipant.communicationUserId, displayName: remoteParticipant.displayName }
      ]);
    }
  });
  res.status(200).end();
});

export default router;
