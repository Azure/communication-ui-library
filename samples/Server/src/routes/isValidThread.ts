// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as express from 'express';
import { threadIdToModeratorCredentialMap } from '../lib/chat/threadIdToModeratorTokenMap';

const router = express.Router();

/**
 * route: /isValidThread/[threadId]
 *
 * purpose: Check if thread is valid for given threadId.
 *
 * @param threadId: id of the thread to be verified
 *
 * @returns status 200 if thread is valid and status 404 if thread is
 * invalid.
 */

router.get('/:threadId', async function (req, res, next) {
  if (threadIdToModeratorCredentialMap.has(req.params['threadId'])) {
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

export default router;
