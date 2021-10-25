// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatClient } from '@azure/communication-chat';
import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import { CommunicationUserToken } from '@azure/communication-identity';
import React from 'react';

import { CompositeConnectionParamsErrMessage } from '../../CompositeStringUtils';

// Adds a bot to the thread that sends out provided canned messages one by one.
export const addParrotBotToThread = async (
  userToken: string,
  botId: string,
  botToken: string,
  endpointUrl: string,
  threadId: string,
  messages: string[]
): Promise<CommunicationUserToken> => {
  const botIdentifier: CommunicationUserIdentifier = { communicationUserId: botId };
  const chatClient = new ChatClient(endpointUrl, new AzureCommunicationTokenCredential(userToken));
  await chatClient.getChatThreadClient(threadId).addParticipants({
    participants: [{ id: botIdentifier, displayName: 'A simple bot' }]
  });

  sendMessagesAsBot(botToken, endpointUrl, threadId, messages);
  return { expiresOn: new Date(), token: botToken, user: botIdentifier };
};

const sendMessagesAsBot = async (
  token: string,
  envUrl: string,
  threadId: string,
  messages: string[]
): Promise<void> => {
  const chatClient = new ChatClient(envUrl, new AzureCommunicationTokenCredential(token));
  const threadClient = await chatClient.getChatThreadClient(threadId);

  let index = 0;
  // Send first message immediately so users aren't staring at an empty chat thread.
  if (messages.length > 0) {
    threadClient.sendMessage({ content: messages[index++] });
  }

  setInterval(() => {
    if (index < messages.length) {
      threadClient.sendMessage({ content: messages[index++] });
    }
  }, 5000);
};

export const ConfigHintBanner = (): JSX.Element => {
  const emptyConfigTips =
    'Please provide an access token, userId for each "participant", endpointUrl and display name to use.';
  return <>{CompositeConnectionParamsErrMessage([emptyConfigTips])}</>;
};

export const ConfigJoinChatThreadHintBanner = (): JSX.Element => {
  const emptyConfigTips = 'Please provide an access token, userId, thread id, endpoint url, and display name to use.';
  return <>{CompositeConnectionParamsErrMessage([emptyConfigTips])}</>;
};
