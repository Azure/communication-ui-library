import { ChatClient } from '@azure/communication-chat';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { CommunicationIdentityClient } from '@azure/communication-identity';
import { text } from '@storybook/addon-knobs';
import React, { useState, useEffect, useRef } from 'react';
import { ChatConfig } from 'react-composites';

import {
  CompositeConnectionParamsErrMessage,
  COMPOSITE_STRING_CONNECTIONSTRING,
  COMPOSITE_STRING_REQUIREDCONNECTIONSTRING
} from '../../CompositeStringUtils';
import { COMPOSITE_EXPERIENCE_CONTAINER_STYLE } from '../../constants';
import { ContosoChatContainer } from './Container.snippet';
import { createUserAndThread } from './Server.snippet';

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
        await addBotToThread(knobs.current.connectionString, newChatConfig);
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
    participants: [{ id: bot.user }]
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

const createIntroductionBot = async (token: string, envUrl: string, threadId: string): Promise<void> => {
  const chatClient = new ChatClient(envUrl, new AzureCommunicationTokenCredential(token));
  const threadClient = await chatClient.getChatThreadClient(threadId);

  let index = 0;
  setInterval(() => {
    if (index < messageArray.length) {
      const sendMessageRequest = {
        content: messageArray[index++],
        senderDisplayName: 'TestBot'
      };
      threadClient.sendMessage(sendMessageRequest);
    }
  }, 5000);
};

const ConfigHintBanner = (): JSX.Element => {
  const emptyConfigTips = COMPOSITE_STRING_REQUIREDCONNECTIONSTRING.replace('{0}', 'Chat');
  const emptyConfigParametersTips = 'Or you can fill out the required params to do so.';
  return <>{CompositeConnectionParamsErrMessage([emptyConfigTips, emptyConfigParametersTips])}</>;
};
