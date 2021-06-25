// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { ChatClient } from '@azure/communication-chat';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { CommunicationIdentityClient, CommunicationUserToken } from '@azure/communication-identity';

export const createUserAndThread = async (
  resourceConnectionString: string,
  topic: string,
  displayNames: string[]
): Promise<Array<any>> => {
  const endpointUrl = new URL(resourceConnectionString.replace('endpoint=', '').split(';')[0]).toString();
  const tokenClient = new CommunicationIdentityClient(resourceConnectionString);
  const userAndTokens: CommunicationUserToken[] = [];
  for (let i = 0; i < displayNames.length; i++) {
    userAndTokens.push(await tokenClient.createUserAndToken(['chat']));
  }

  const chatClient = new ChatClient(endpointUrl, new AzureCommunicationTokenCredential(userAndTokens[0].token));
  const threadId = (await chatClient.createChatThread({ topic: topic })).chatThread?.id ?? '';
  await chatClient.getChatThreadClient(threadId).addParticipants({
    participants: displayNames.map((displayName, i) => ({ id: userAndTokens[i].user, displayName: displayName }))
  });

  return displayNames.map((displayName, i) => ({
    userId: userAndTokens[i].user,
    token: userAndTokens[i].token,
    endpointUrl,
    displayName,
    threadId
  }));
};
