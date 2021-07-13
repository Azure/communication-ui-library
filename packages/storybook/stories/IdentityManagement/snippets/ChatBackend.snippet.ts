// Logic to create an Azure Communication Services Chat thread and users, and add users to the thread.
// Resides in a secure backend server. The connection string is never exposed to the client application.

import { ChatClient } from '@azure/communication-chat';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { CommunicationIdentityClient, CommunicationUserToken } from '@azure/communication-identity';

export const createUserAndThread = async (resourceConnectionString: string, displayNames: string[]): Promise<any> => {
  if (displayNames.length === 0) {
    return [];
  }

  const endpointUrl = new URL(resourceConnectionString.replace('endpoint=', '').split(';')[0]).toString();
  const tokenClient = new CommunicationIdentityClient(resourceConnectionString);
  const userAndTokens: CommunicationUserToken[] = [];
  for (let i = 0; i < displayNames.length; i++) {
    userAndTokens.push(await tokenClient.createUserAndToken(['chat']));
  }

  const chatClient = new ChatClient(endpointUrl, new AzureCommunicationTokenCredential(userAndTokens[0].token));
  const threadId =
    (
      await chatClient.createChatThread(
        { topic: 'DemoThread' },
        {
          participants: displayNames.map((displayName, i) => ({ id: userAndTokens[i].user, displayName: displayName }))
        }
      )
    ).chatThread?.id ?? '';

  return displayNames.map((displayName, i) => ({
    userId: userAndTokens[i].user,
    token: userAndTokens[i].token,
    endpointUrl,
    displayName,
    threadId
  }));
};
