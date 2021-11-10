// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { ChatClient } from '@azure/communication-chat';
import { getToken } from './getToken';
import { fetchEndpointUrl } from './getEndpointUrl';
import { loadConfigFromUrlQuery } from './loadConfigFromUrlQuery';

export type IdentityType = {
  userId: string;
  token: string;
  endpointUrl: string;
  displayName: string;
  threadId: string;
};

const TOPIC_NAME = 'My Chat Topic';

export const createChatThreadAndUsers = async (displayName: string): Promise<IdentityType> => {
  // If there is a config object from Url Query, directly return the config
  const configFromQuery = loadConfigFromUrlQuery();
  if (configFromQuery.token) {
    verifyParamExists(configFromQuery, 'displayName');
    verifyParamExists(configFromQuery, 'token');
    verifyParamExists(configFromQuery, 'threadId');
    verifyParamExists(configFromQuery, 'userId');
    verifyParamExists(configFromQuery, 'endpointUrl');
    return configFromQuery;
  }

  const userAndToken = await getToken();
  const endpointUrl = await fetchEndpointUrl();

  const chatClient = new ChatClient(endpointUrl, new AzureCommunicationTokenCredential(userAndToken.token));
  const threadId = (await chatClient.createChatThread({ topic: TOPIC_NAME })).chatThread?.id ?? '';
  await chatClient.getChatThreadClient(threadId).addParticipants({
    participants: [{ id: { communicationUserId: userAndToken.identity }, displayName }]
  });

  return {
    userId: userAndToken.identity,
    token: userAndToken.token,
    endpointUrl,
    displayName,
    threadId
  };
};

export const verifyParamExists = <T>(params: T, paramName: string): void => {
  if (!params[paramName]) {
    throw `${paramName} was not included in the query parameters of the URL.`;
  }
};
