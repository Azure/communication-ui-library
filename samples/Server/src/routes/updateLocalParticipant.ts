// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as express from 'express';
import { LOCAL_PARTICIPANT } from '../lib/callAutomationUtils';

const router = express.Router();

interface UpdateLocalParticipantsRequest {
  callCorrelationId: string;
  LocalParticipant: { displayName: string; communicationUserId: string };
}

router.post('/', async function (req, res, next) {
  const { callCorrelationId, LocalParticipant }: UpdateLocalParticipantsRequest = req.body;
  console.log('Updating Local participants for call:', callCorrelationId, 'participants:', LocalParticipant);

  if (!LOCAL_PARTICIPANT[callCorrelationId]) {
    res.status(404).send('Call not found');
    return;
  }

  const callLocalParticipant = LOCAL_PARTICIPANT[callCorrelationId];
  if (!callLocalParticipant) {
    LOCAL_PARTICIPANT[callCorrelationId] = {
      displayName: LocalParticipant.displayName,
      communicationUserId: LocalParticipant.communicationUserId
    };
  } else {
    res.status(202).send('Call already exists');
    return;
  }
  res.status(200).end();
});

export default router;
