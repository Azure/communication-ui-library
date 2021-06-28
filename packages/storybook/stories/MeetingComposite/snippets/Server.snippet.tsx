// Contoso server to create a new user and thread.

import { ChatClient } from '@azure/communication-chat';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { CommunicationIdentityClient } from '@azure/communication-identity';
import { v1 as createGUID } from 'uuid';

export const createUserCredentials = async (resourceConnectionString: string, displayName: string): Promise<any> => {
  const tokenClient = new CommunicationIdentityClient(resourceConnectionString);
  const { user, token } = await tokenClient.createUserAndToken(['voip', 'chat']);
  const endpointUrl = new URL(resourceConnectionString.replace('endpoint=', '').split(';')[0]).toString();
  const chatClient = new ChatClient(endpointUrl, new AzureCommunicationTokenCredential(token));
  const threadId = (await chatClient.createChatThread({ topic: 'DemoMeeting' })).chatThread?.id ?? '';
  await chatClient.getChatThreadClient(threadId).addParticipants({
    participants: [{ id: user, displayName: displayName }]
  });
  await chatClient.getChatThreadClient(threadId).updateTopic('Meeting with a friendly bot');

  return {
    userId: user,
    token,
    endpointUrl,
    locator: createGUID(), // calling GUID
    threadId // chat GUID
  };
};
