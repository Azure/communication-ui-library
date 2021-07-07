// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { ChatClient } from '@azure/communication-chat';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { CommunicationIdentityClient, CommunicationUserToken } from '@azure/communication-identity';

const DATA_UI_ID = 'data-ui-id';

export const dataUiId = (v: string): string => `[${DATA_UI_ID}="${v}"]`;

export const encodeQueryData = (data: IdentityType): string => {
  const qs: Array<string> = [];
  for (const d in data) {
    qs.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
  }
  return qs.join('&');
};

type IdentityType = {
  userId: string;
  token: string;
  endpointUrl: string;
  displayName: string;
  threadId: string;
  topic: string;
};

export const createUserAndThread = async (
  resourceConnectionString: string,
  topic: string,
  displayNames: string[]
): Promise<Array<IdentityType>> => {
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
    userId: userAndTokens[i].user.communicationUserId,
    token: userAndTokens[i].token,
    endpointUrl,
    displayName,
    threadId,
    topic
  }));
};

export const getNameInitials = (name: string): string => {
  return Array.prototype.map.call(name.split(' '), (x) => x.substring(0, 1).toUpperCase()).join('');
};
