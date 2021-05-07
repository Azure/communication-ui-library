// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as express from 'express';
import { CommunicationUserToken } from '@azure/communication-identity';
import { CommunicationUserIdentifier } from '@azure/communication-common';
import { getToken } from '../lib/identityClient';

const router = express.Router();

router.post('/:id', async function (req, res, next) {
  if (!req.params['id']) {
    res.sendStatus(404);
  }

  const user: CommunicationUserIdentifier = {
    communicationUserId: req.params['id'] as string
  };
  const token = await getToken(user, ['chat', 'voip']);
  const userToken: CommunicationUserToken = {
    user,
    ...token
  };

  res.send(userToken);
});

export default router;
