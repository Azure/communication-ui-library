// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatClient } from '@azure/communication-chat';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { CommunicationIdentityClient, CommunicationUserToken } from '@azure/communication-identity';
import React from 'react';

import { CompositeConnectionParamsErrMessage } from '../../CompositeStringUtils';

// Adds a bot to the thread that sends out provided canned messages one by one.
export const addParrotBotToThread = async (
  resourceConnectionString: string,
  token: string,
  threadId: string,
  messages: string[]
): Promise<CommunicationUserToken> => {
  const tokenClient = new CommunicationIdentityClient(resourceConnectionString);
  const bot = await tokenClient.createUserAndToken(['chat']);

  const endpointUrl = new URL(resourceConnectionString.replace('endpoint=', '').split(';')[0]).toString();
  // Must use the credentials of the thread owner to add more participants.
  const chatClient = new ChatClient(endpointUrl, new AzureCommunicationTokenCredential(token));
  await chatClient.getChatThreadClient(threadId).addParticipants({
    participants: [{ id: bot.user, displayName: 'A simple bot' }]
  });

  sendMessagesAsBot(bot.token, endpointUrl, threadId, messages);
  return bot;
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
  const emptyConfigTips = 'Please provide the connection string and display name to use.';
  return <>{CompositeConnectionParamsErrMessage([emptyConfigTips])}</>;
};

export const ConfigJoinChatThreadHintBanner = (): JSX.Element => {
  const emptyConfigTips = 'Please provide a token, thread id, endpoint url, and display name to use.';
  return <>{CompositeConnectionParamsErrMessage([emptyConfigTips])}</>;
};
