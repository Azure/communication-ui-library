// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatClient } from '@azure/communication-chat';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import * as express from 'express';
import { getEndpoint } from '../lib/envHelper';
import { getAdminUser, getToken } from '../lib/identityClient';

const router = express.Router();
interface AddUserParam {
  Id: string;
  DisplayName: string;
}

/**
 * route: /addUser/[threadId]
 *
 * purpose: Add the user to the chat thread with given threadId.
 *
 * @param threadId: id of the thread to which user needs to be added
 * @param id: id of the user as string
 * @param displayName: display name of the user as string
 *
 */

router.post('/:threadId', async function (req, res, next) {
  const addUserParam: AddUserParam = req.body;
  const threadId = req.params['threadId'];

  // create a user from the adminUserId and create a credential around that
  const credential = new AzureCommunicationTokenCredential({
    tokenRefresher: async () => (await getToken(getAdminUser(), ['chat', 'voip'])).token,
    refreshProactively: true
  });

  const chatClient = new ChatClient(getEndpoint(), credential);
  const chatThreadClient = await chatClient.getChatThreadClient(threadId);

  try {
    await chatThreadClient.addParticipants({
      participants: [
        {
          id: { communicationUserId: addUserParam.Id },
          displayName: addUserParam.DisplayName
        }
      ]
    });
    res.sendStatus(201);
  } catch (err) {
    // we will return a 404 if the thread to join is not accessible by the server user.
    // The server user needs to be in the thread in order to add someone.
    // So we are returning back that we can't find the thread to add the client user to.
    res.sendStatus(404);
  }
});

export default router;
