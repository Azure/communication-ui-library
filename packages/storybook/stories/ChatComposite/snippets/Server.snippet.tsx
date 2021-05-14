// Contoso server to create a new user and thread.

import { ChatClient } from '@azure/communication-chat';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { CommunicationIdentityClient } from '@azure/communication-identity';
import { ChatConfig } from 'react-composites';

export const createUserAndThread = async (
  resourceConnectionString: string,
  displayName: string
): Promise<ChatConfig> => {
  const tokenClient = new CommunicationIdentityClient(resourceConnectionString);
  const user = await tokenClient.createUserAndToken(['chat']);

  const endpointUrl = new URL(resourceConnectionString.replace('endpoint=', '').split(';')[0]).toString();
  const chatClient = new ChatClient(endpointUrl, new AzureCommunicationTokenCredential(user.token));
  const threadId = (await chatClient.createChatThread({ topic: 'DemoThread' })).chatThread?.id ?? '';
  await chatClient.getChatThreadClient(threadId).addParticipants({
    participants: [{ id: user.user, displayName: displayName }]
  });

  return {
    token: user.token,
    endpointUrl: endpointUrl,
    displayName: displayName,
    threadId
  };
};
