// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatClient } from '@azure/communication-chat';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { CommunicationIdentityClient } from '@azure/communication-identity';
import React from 'react';
import { ChatConfig } from 'react-composites';

import { CompositeConnectionParamsErrMessage } from '../../CompositeStringUtils';

// Adds a bot to the thread that sends out provided canned messages one by one.
export const addParrotBotToThread = async (
  resourceConnectionString: string,
  chatConfig: ChatConfig,
  messages: string[]
): Promise<void> => {
  const tokenClient = new CommunicationIdentityClient(resourceConnectionString);
  const bot = await tokenClient.createUserAndToken(['chat']);

  const endpointUrl = new URL(resourceConnectionString.replace('endpoint=', '').split(';')[0]).toString();
  // Must use the credentials of the thread owner to add more participants.
  const chatClient = new ChatClient(endpointUrl, new AzureCommunicationTokenCredential(chatConfig.token));
  await chatClient.getChatThreadClient(chatConfig.threadId).addParticipants({
    participants: [{ id: bot.user, displayName: 'A simple bot' }]
  });

  sendMessagesAsBot(bot.token, endpointUrl, chatConfig.threadId, messages);
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
  setInterval(() => {
    if (index < messages.length) {
      const sendMessageRequest = {
        content: messages[index++],
        senderDisplayName: 'TestBot'
      };
      threadClient.sendMessage(sendMessageRequest);
    }
  }, 5000);
};

export const ConfigHintBanner = (): JSX.Element => {
  const emptyConfigTips = 'Please provide the connection string and display name to use.';
  return <>{CompositeConnectionParamsErrMessage([emptyConfigTips])}</>;
};
