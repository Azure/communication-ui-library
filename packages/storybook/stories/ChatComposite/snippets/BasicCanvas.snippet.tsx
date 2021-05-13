// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { text } from '@storybook/addon-knobs';
import React, { useState, useEffect, useRef } from 'react';
import { ChatConfig } from 'react-composites';
import { COMPOSITE_STRING_CONNECTIONSTRING } from '../../CompositeStringUtils';
import { COMPOSITE_EXPERIENCE_CONTAINER_STYLE } from '../../constants';
import { ContosoChatContainer } from './Container.snippet';
import { createUserAndThread } from './Server.snippet';
import { ConfigHintBanner, addParrotBotToThread } from './Utils.snippet';

export const BasicCanvas: () => JSX.Element = () => {
  const [chatConfig, setChatConfig] = useState<ChatConfig>();

  const knobs = useRef({
    connectionString: text(COMPOSITE_STRING_CONNECTIONSTRING, '', 'Server Simulator'),
    displayName: text('Display Name', '', 'Server Simulator')
  });

  useEffect(() => {
    const fetchToken = async (): Promise<void> => {
      if (knobs.current.connectionString && knobs.current.displayName) {
        const newChatConfig = await createUserAndThread(knobs.current.connectionString, knobs.current.displayName);
        await addParrotBotToThread(knobs.current.connectionString, newChatConfig, messageArray);
        setChatConfig(newChatConfig);
      }
    };
    fetchToken();
  }, [knobs]);

  return (
    <div style={COMPOSITE_EXPERIENCE_CONTAINER_STYLE}>
      {chatConfig ? <ContosoChatContainer config={chatConfig} /> : <ConfigHintBanner />}
    </div>
  );
};

const addBotToThread = async (resourceConnectionString: string, chatConfig: ChatConfig): Promise<void> => {
  const tokenClient = new CommunicationIdentityClient(resourceConnectionString);
  const bot = await tokenClient.createUserAndToken(['chat']);

  const endpointUrl = new URL(resourceConnectionString.replace('endpoint=', '').split(';')[0]).toString();
  // Must use the credentials of the thread owner to add more participants.
  const chatClient = new ChatClient(endpointUrl, new AzureCommunicationTokenCredential(chatConfig.token));
  await chatClient.getChatThreadClient(chatConfig.threadId).addParticipants({
    participants: [{ id: bot.user, displayName: 'I am a bot' }]
  });

  createIntroductionBot(bot.token, endpointUrl, chatConfig.threadId);
};

const messageArray = [
  'Hello ACS!',
  'Congratulations! You can see this message because you successfully passed in a connection string!',
  'In production environment, it is recommended to issue tokens in server side.',
  'You can also issue a token by creating your own server and input them in required tab below.',
  'Have fun!'
];
