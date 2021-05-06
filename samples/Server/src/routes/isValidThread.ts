// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as express from 'express';
import { threadIdToModeratorCredentialMap } from '../lib/chat/threadIdToModeratorTokenMap';

const router = express.Router();

router.get('/:threadId', async function (req, res, next) {
  if (threadIdToModeratorCredentialMap.has(req.params['threadId'])) {
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

export default router;
