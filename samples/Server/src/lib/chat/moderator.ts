// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { ChatClient, CreateChatThreadOptions, CreateChatThreadRequest } from '@azure/communication-chat';
import { getEnvUrl } from '../envHelper';
import { GUID_FOR_INITIAL_TOPIC_NAME } from '../constants';
import { threadIdToModeratorCredentialMap } from './threadIdToModeratorTokenMap';
import { createUser, getToken } from '../identityClient';

export const createThread = async (topicName?: string): Promise<string> => {
  const user = await createUser();

  const credential = new AzureCommunicationTokenCredential({
    tokenRefresher: async () => (await getToken(user, ['chat', 'voip'])).token,
    refreshProactively: true
  });
  const chatClient = new ChatClient(getEnvUrl(), credential);

  const request: CreateChatThreadRequest = {
    topic: topicName ?? GUID_FOR_INITIAL_TOPIC_NAME
  };
  const options: CreateChatThreadOptions = {
    participants: [
      {
        id: {
          communicationUserId: user.communicationUserId
        }
      }
    ]
  };
  const result = await chatClient.createChatThread(request, options);

  const threadID = result.chatThread?.id;
  if (!threadID) {
    throw new Error(`Invalid or missing ID for newly created thread ${result.chatThread}`);
  }

  threadIdToModeratorCredentialMap.set(threadID, credential);
  return threadID;
};
