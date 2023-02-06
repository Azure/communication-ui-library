// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatClient } from '@azure/communication-chat';
import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import { ChatAdapter } from '@azure/communication-react';
import React from 'react';

import { CompositeConnectionParamsErrMessage } from '../../CompositeStringUtils';
import { MICROSOFT_AZURE_ACCESS_TOKEN_QUICKSTART } from '../../constants';

// Adds a bot to the thread that sends out provided canned messages one by one.
export const addParrotBotToThread = async (
  userToken: string,
  botId: string,
  botToken: string,
  endpointUrl: string,
  threadId: string,
  messages: string[]
): Promise<CommunicationUserIdentifier> => {
  const botIdentifier: CommunicationUserIdentifier = { communicationUserId: botId };
  const chatClient = new ChatClient(endpointUrl, new AzureCommunicationTokenCredential(userToken));
  await chatClient.getChatThreadClient(threadId).addParticipants({
    participants: [{ id: botIdentifier, displayName: 'A simple bot' }]
  });

  sendMessagesAsBot(botToken, endpointUrl, threadId, messages);
  return botIdentifier;
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

export const sendMessagesAsBotWithAdapter = async (adapter: ChatAdapter, messages: string[]): Promise<void> => {
  let index = 0;
  // Send first message immediately so users aren't staring at an empty chat thread.
  if (messages.length > 0) {
    adapter.sendMessage(messages[index++]);
  }

  setInterval(() => {
    if (index < messages.length) {
      adapter.sendMessage(messages[index++]);
    }
  }, 5000);
};

export const ConfigHintBanner = (): JSX.Element => {
  const emptyConfigTips = (
    <div>
      <p>
        Please provide an{' '}
        <a href={MICROSOFT_AZURE_ACCESS_TOKEN_QUICKSTART} target="_blank" rel="noreferrer">
          access token, userId
        </a>{' '}
        for each participant, endpointUrl and display name to use.
      </p>
      <p>A display name has already been set by default, but feel free to change it.</p>
    </div>
  );
  return <>{CompositeConnectionParamsErrMessage([emptyConfigTips])}</>;
};

export const ConfigJoinChatThreadHintBanner = (): JSX.Element => {
  const emptyConfigTips = (
    <p>
      Please provide an{' '}
      <a href={MICROSOFT_AZURE_ACCESS_TOKEN_QUICKSTART} target="_blank" rel="noreferrer">
        access token, userId
      </a>
      , thread id, endpoint url, and display name to use.
    </p>
  );
  return <>{CompositeConnectionParamsErrMessage([emptyConfigTips])}</>;
};

export type ChatCompositeSetupProps = {
  userIdentifier: string;
  token: string;
  endpointUrl: string;
  displayName: string;
  threadId: string;
};

export const createThreadAndAddUser = async (
  userId: string,
  token: string,
  endpointUrl: string,
  displayName: string
): Promise<ChatCompositeSetupProps> => {
  const chatClient = new ChatClient(endpointUrl, new AzureCommunicationTokenCredential(token));

  const user = { communicationUserId: userId };
  const threadId =
    (
      await chatClient.createChatThread(
        { topic: 'Chat with a friendly bot' },
        {
          participants: [{ id: user, displayName: displayName }]
        }
      )
    ).chatThread?.id ?? '';

  return { userIdentifier: user.communicationUserId, token, endpointUrl, displayName, threadId };
};

export const onDisplayDateTimeString = (messageDate: Date): string => {
  let hours = messageDate.getHours();
  let minutes = messageDate.getMinutes().toString();
  let month = (messageDate.getMonth() + 1).toString();
  let day = messageDate.getDate().toString();
  const year = messageDate.getFullYear().toString();

  if (month.length === 1) {
    month = '0' + month;
  }
  if (day.length === 1) {
    day = '0' + day;
  }
  const isAm = hours < 12;
  if (hours > 12) {
    hours = hours - 12;
  }
  if (hours === 0) {
    hours = 12;
  }
  if (minutes.length < 2) {
    minutes = '0' + minutes;
  }
  return (
    'TimeStamp: ' +
    year +
    '-' +
    month +
    '-' +
    day +
    ', ' +
    hours.toString() +
    ':' +
    minutes +
    ' ' +
    (isAm ? 'a.m.' : 'p.m.')
  );
};
