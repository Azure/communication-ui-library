// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as express from 'express';
import { userIdToUserConfigMap } from '../lib/chat/userIdToUserConfigMap';

const router = express.Router();

/**
 * route: /userConfig/[userId]
 *
 * purpose: To register the user with the emoji to the thread.
 *
 * @param threadId: id of the thread to which user needs to be registered
 * @param userId: id of the user
 * @param emoji: emoji selected by the user
 *
 * @remarks
 * post call is used for registering the user to the thread and update the
 * user config with the selected emoji and get call returns userconfig of
 * all registered users.
 *
 */

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
