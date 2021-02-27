// © Microsoft Corporation. All rights reserved.

import * as express from 'express';
import { getResourceConnectionString } from '../lib/envHelper';
import { CommunicationIdentityClient, CommunicationUserToken } from '@azure/communication-identity';
import { CommunicationUser } from '@azure/communication-common';

const router = express.Router();

router.post('/:id', async function (req, res, next) {
  if (!req.params['id']) {
    res.sendStatus(404);
  }

  const identityClient = new CommunicationIdentityClient(getResourceConnectionString());
  const user: CommunicationUser = {
    communicationUserId: req.params['id'] as string
  };
  const token = await identityClient.issueToken(user, ['chat', 'voip']);
  const userToken: CommunicationUserToken = {
    user,
    ...token
  };

  res.send(userToken);
});

export default router;
