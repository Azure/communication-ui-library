// Contoso server to create a new user and thread.

import { ChatClient } from '@azure/communication-chat';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';

export const createUserAndThread = async (
  userId: string,
  token: string,
  endpointUrl: string,
  displayName: string
): Promise<any> => {
  const chatClient = new ChatClient(endpointUrl, new AzureCommunicationTokenCredential(token));
  const threadId =
    (
      await chatClient.createChatThread(
        { topic: 'Chat with a friendly bot' },
        {
          participants: [{ id: { communicationUserId: userId }, displayName: displayName }]
        }
      )
    ).chatThread?.id ?? '';

  return {
    userId: userId,
    token: token,
    endpointUrl,
    displayName,
    threadId
  };
};
