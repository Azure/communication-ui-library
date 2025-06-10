// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { ChatClient, CreateChatThreadOptions, CreateChatThreadRequest } from '@azure/communication-chat';
import { getEndpoint } from '../envHelper';
import { getAdminUser, getToken } from '../identityClient';

/**
 * Creates a new chat thread with the specified topic name.
 * If no topic name is provided, it defaults to 'Your Chat sample'.
 *
 * @param {string} [topicName] - The topic name for the chat thread.
 * @returns {Promise<string>} - The ID of the newly created chat thread.
 * @throws {Error} - If the thread ID is invalid or missing.
 */
export const createThread = async (topicName?: string): Promise<string> => {
  const user = await getAdminUser();

  const credential = new AzureCommunicationTokenCredential({
    tokenRefresher: async () => (await getToken(user, ['chat', 'voip'])).token,
    refreshProactively: true
  });
  const chatClient = new ChatClient(getEndpoint(), credential);

  const request: CreateChatThreadRequest = {
    topic: topicName ?? 'Your Chat sample'
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

  return threadID;
};
