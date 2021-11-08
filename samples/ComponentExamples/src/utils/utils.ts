// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { CommunicationIdentityClient, CommunicationUserToken } from '@azure/communication-identity';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { ChatClient } from '@azure/communication-chat';

export type IdentityType = {
  userId: string;
  token: string;
  endpointUrl: string;
  displayName: string;
  threadId: string;
};

const CONNECTION_STRING = require('../../appsettings.json')['ResourceConnectionString'];
const TOPIC_NAME = 'My Chat Topic';

export const createChatThreadAndUsers = async (displayName: string): Promise<IdentityType> => {
  const endpointUrl = new URL(CONNECTION_STRING.replace('endpoint=', '').split(';')[0]).toString();
  const tokenClient = new CommunicationIdentityClient(CONNECTION_STRING);
  const userAndToken: CommunicationUserToken = await tokenClient.createUserAndToken(['chat', 'voip']);

  const chatClient = new ChatClient(endpointUrl, new AzureCommunicationTokenCredential(userAndToken.token));
  const threadId = (await chatClient.createChatThread({ topic: TOPIC_NAME })).chatThread?.id ?? '';
  await chatClient.getChatThreadClient(threadId).addParticipants({
    participants: [{ id: userAndToken.user, displayName }]
  });

  return {
    userId: userAndToken.user.communicationUserId,
    token: userAndToken.token,
    endpointUrl,
    displayName,
    threadId
  };
};
