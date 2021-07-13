// Contoso server to create a new user and thread.

import { ChatClient } from '@azure/communication-chat';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { CommunicationIdentityClient } from '@azure/communication-identity';

export const createUserAndThread = async (resourceConnectionString: string, displayName: string): Promise<any> => {
  const tokenClient = new CommunicationIdentityClient(resourceConnectionString);
  const user = await tokenClient.createUserAndToken(['chat']);

  const endpointUrl = new URL(resourceConnectionString.replace('endpoint=', '').split(';')[0]).toString();
  const chatClient = new ChatClient(endpointUrl, new AzureCommunicationTokenCredential(user.token));
  const threadId =
    (
      await chatClient.createChatThread(
        { topic: 'Chat with a friendly bot' },
        {
          participants: [{ id: user.user, displayName: displayName }]
        }
      )
    ).chatThread?.id ?? '';

  return {
    userId: user.user,
    token: user.token,
    endpointUrl,
    displayName,
    threadId
  };
};
