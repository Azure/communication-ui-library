// © Microsoft Corporation. All rights reserved.

import { AzureCommunicationUserCredential } from '@azure/communication-common';
import { ChatClient, CreateChatThreadRequest } from '@azure/communication-chat';
import { getEnvUrl } from '../envHelper';
import { GUID_FOR_INITIAL_TOPIC_NAME } from '../constants';
import { threadIdToModeratorCredentialMap } from './threadIdToModeratorTokenMap';
import { createUser, issueToken } from '../identityClient';

export const createThread = async (topicName?: string): Promise<string> => {
  const user = await createUser();
  // create an on-demand auto-refreshing credential and store it
  const credential = new AzureCommunicationUserCredential({
    tokenRefresher: async () => (await issueToken(user, ['chat', 'voip'])).token
  });
  const chatClient = new ChatClient(getEnvUrl(), credential);
  const request: CreateChatThreadRequest = {
    topic: topicName ?? GUID_FOR_INITIAL_TOPIC_NAME,
    members: [{ user }]
  };
  const chatThreadClient = await chatClient.createChatThread(request);
  threadIdToModeratorCredentialMap.set(chatThreadClient.threadId, credential);
  return chatThreadClient.threadId;
};
