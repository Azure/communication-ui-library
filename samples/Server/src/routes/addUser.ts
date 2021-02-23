// © Microsoft Corporation. All rights reserved.

import { CommunicationUserToken } from '@azure/communication-administration';
import * as express from 'express';
import { refreshUserToken } from '../lib/createUserToken';
import { getChatClientFromUserToken } from '../lib/chat/moderator';
import { threadIdToModeratorTokenMap } from '../lib/chat/threadIdToModeratorTokenMap';

const router = express.Router();
type AddUserParam = {
  Id: string;
  DisplayName: string;
};

router.post('/:threadId', async function (req, res, next) {
  const addUserParam: AddUserParam = req.body;
  const threadId = req.params['threadId'];
  const moderatorToken: CommunicationUserToken = threadIdToModeratorTokenMap.get(threadId);

  // dates to determine if token has expired
  const currentTime = new Date();
  const expiresOn = new Date(moderatorToken.expiresOn);

  // refreshToken flow
  if (currentTime > expiresOn) {
    const userToken: CommunicationUserToken = await refreshUserToken(req.params['id'] as string);
    threadIdToModeratorTokenMap.set(threadId, userToken);
  }

  const moderator = threadIdToModeratorTokenMap.get(threadId);

  const chatClient = await getChatClientFromUserToken(moderator);
  const chatThreadClient = await chatClient.getChatThreadClient(threadId);

  await chatThreadClient.addMembers({
    members: [
      {
        user: { communicationUserId: addUserParam.Id },
        displayName: addUserParam.DisplayName
      }
    ]
  });
  res.sendStatus(201);
});

export default router;
