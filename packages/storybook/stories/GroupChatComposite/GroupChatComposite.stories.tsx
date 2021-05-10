// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatClient } from '@azure/communication-chat';
import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import { CommunicationIdentityClient } from '@azure/communication-identity';
import { text } from '@storybook/addon-knobs';
import { Meta } from '@storybook/react/types-6-0';
import React, { useState, useEffect } from 'react';
import { GroupChatAdapter, ChatConfig, ChatComposite, createAzureCommunicationChatAdapter } from 'react-composites';

import {
  CompositeConnectionParamsErrMessage,
  COMPOSITE_STRING_CONNECTIONSTRING,
  COMPOSITE_STRING_REQUIREDCONNECTIONSTRING
} from '../CompositeStringUtils';
import { COMPOSITE_EXPERIENCE_CONTAINER_STYLE, COMPOSITE_FOLDER_PREFIX } from '../constants';
import { getDocs } from './GroupChatCompositeDocs';

export default {
  title: `${COMPOSITE_FOLDER_PREFIX}/Group Chat`,
  component: ChatComposite,
  parameters: {
    useMaxHeightParent: true,
    useMaxWidthParent: true,
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;

const messageArray = [
  'Hello ACS!',
  'Congratulations! You can see this message because you successfully passed in a connection string!',
  'In production environment, it is recommended to issue tokens in server side.',
  'You can also issue a token by creating your own server and input them in required tab below.',
  'Have fun!'
];

const createUser = async (
  resourceConnectionString: string
): Promise<{ userId: CommunicationUserIdentifier; token: string }> => {
  if (!resourceConnectionString) {
    throw new Error('No ACS connection string provided');
  }

  const tokenClient = new CommunicationIdentityClient(resourceConnectionString);
  const userToken = await tokenClient.createUserAndToken(['chat']);
  return { userId: userToken.user, token: userToken.token };
};

const createChatClient = (token: string, envUrl: string): ChatClient => {
  return new ChatClient(envUrl, new AzureCommunicationTokenCredential(token));
};

const createMessageBot = async (
  token: string,
  envUrl: string,
  threadId: string,
  user: CommunicationUserIdentifier
): Promise<void> => {
  const chatClient = new ChatClient(envUrl, new AzureCommunicationTokenCredential(token));
  const threadClient = await chatClient.getChatThreadClient(threadId);

  let index = 0;

  console.log(
    'Bot Configuration: ' +
      JSON.stringify(
        {
          user,
          token,
          endpointUrl: envUrl,
          displayName: 'TestBot',
          threadId: threadId
        },
        null,
        2
      )
  );

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

const createChatConfig = async (resourceConnectionString: string): Promise<ChatConfig> => {
  const user = await createUser(resourceConnectionString);
  const bot = await createUser(resourceConnectionString);

  const endpointUrl = new URL(resourceConnectionString.replace('endpoint=', '').split(';')[0]).toString();
  const chatClient = new ChatClient(endpointUrl, new AzureCommunicationTokenCredential(user.token));

  const threadId = (await chatClient.createChatThread({ topic: 'DemoThread' })).chatThread?.id ?? '';
  await chatClient.getChatThreadClient(threadId).addParticipants({
    participants: [{ id: user.userId }, { id: bot.userId }]
  });
  console.log(`threadId: ${threadId}`);

  createMessageBot(bot.token, endpointUrl, threadId, bot.userId);

  return {
    token: user.token,
    endpointUrl: endpointUrl.toString(),
    displayName: 'User1',
    threadId
  };
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const GroupChat: () => JSX.Element = () => {
  const [chatConfig, setChatConfig] = useState<ChatConfig>();
  const [adapter, setAdapter] = useState<GroupChatAdapter>();

  const connectionString = text(COMPOSITE_STRING_CONNECTIONSTRING, '', 'Server Simulator');

  const { userId, token, endpointUrl, displayName, threadId } = {
    userId: text('User Id', '', 'Required'),
    token: text('ACS Token', '', 'Required'),
    endpointUrl: text('Endpoint Url', '', 'Required'),
    displayName: text('Display Name', '', 'Required'),
    threadId: text('Thread Id', '', 'Required')
  };

  useEffect(() => {
    if (userId || token || endpointUrl || displayName || threadId) {
      const customizedConfig = { userId, token, endpointUrl, displayName, threadId };
      try {
        createChatClient(token, endpointUrl);
        setChatConfig(customizedConfig);
      } catch {
        setChatConfig(undefined);
      }
    } else {
      const fetchToken = async (): Promise<void> => {
        if (connectionString) {
          setChatConfig(await createChatConfig(connectionString));
        }
      };
      fetchToken();
    }
  }, [connectionString, userId, token, endpointUrl, displayName, threadId]);

  useEffect(() => {
    if (chatConfig) {
      const createAdapter = async (): Promise<void> => {
        setAdapter(
          await createAzureCommunicationChatAdapter(
            chatConfig.token,
            chatConfig.endpointUrl,
            chatConfig.threadId,
            chatConfig.displayName
          )
        );
      };
      createAdapter();
    }
  }, [chatConfig]);

  const emptyConfigTips = COMPOSITE_STRING_REQUIREDCONNECTIONSTRING.replace('{0}', 'Group Chat');
  let emptyConfigParametersTips = '';

  if (!userId && !token && !displayName && !endpointUrl && !threadId) {
    emptyConfigParametersTips = 'Or you can fill out the required params to do so.';
  }

  return (
    <div style={COMPOSITE_EXPERIENCE_CONTAINER_STYLE}>
      {adapter && <ChatComposite adapter={adapter} />}
      {!adapter && CompositeConnectionParamsErrMessage([emptyConfigTips, emptyConfigParametersTips])}
    </div>
  );
};
