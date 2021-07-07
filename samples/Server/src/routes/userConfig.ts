// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as express from 'express';
import { userIdToUserConfigMap } from '../lib/chat/userIdToUserConfigMap';

const router = express.Router();

router.post('/:userId', async function (req, res, next) {
  const userConfig = req.body;
  userIdToUserConfigMap.set(req.params['userId'], {
    emoji: userConfig['Emoji'],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    id: (req.params as any)['threadId']
  });

  res.sendStatus(200);
});

router.get('/:userId', async function (req, res, next) {
  const userConfig = userIdToUserConfigMap.get(req.params['userId']);

  res.send(userConfig);
});

export default router;
