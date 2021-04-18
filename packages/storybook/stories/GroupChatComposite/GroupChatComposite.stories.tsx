// © Microsoft Corporation. All rights reserved.

import React, { useEffect } from 'react';
import { text } from '@storybook/addon-knobs';
import { getDocs } from './GroupChatCompositeDocs';
import { ChatConfig, GroupChat } from '@azure/communication-ui';
import { AzureCommunicationUserCredential } from '@azure/communication-common';
import { CommunicationIdentityClient } from '@azure/communication-administration';
import { ChatClient } from '@azure/communication-chat';
import { useState } from 'react';
import { COMPOSITE_FOLDER_PREFIX } from '../constants';
import { Meta } from '@storybook/react/types-6-0';

export default {
  title: `${COMPOSITE_FOLDER_PREFIX}/GroupChat`,
  component: GroupChat,
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

const createUser = async (resourceConnectionString: string): Promise<{ userId: string; token: string }> => {
  if (!resourceConnectionString) {
    throw new Error('No ACS connection string provided');
  }

  const tokenClient = new CommunicationIdentityClient(resourceConnectionString);
  const user = await tokenClient.createUser();
  const token = await tokenClient.issueToken(user, ['chat']);
  return { userId: token.user.communicationUserId, token: token.token };
};

const createChatClient = (token: string, envUrl: string): ChatClient => {
  const userAccessTokenCredential = new AzureCommunicationUserCredential(token);
  return new ChatClient(envUrl, userAccessTokenCredential);
};

const createMessageBot = async (token: string, envUrl: string, threadId: string, userId: string): Promise<void> => {
  const userAccessTokenCredential = new AzureCommunicationUserCredential(token);
  const chatClient = new ChatClient(envUrl, userAccessTokenCredential);
  const threadClient = await chatClient.getChatThreadClient(threadId);

  let index = 0;

  console.log(
    'Bot Configuration: ' +
      JSON.stringify(
        {
          userId,
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
  const userAccessTokenCredential = new AzureCommunicationUserCredential(user.token);
  const chatClient = new ChatClient(endpointUrl, userAccessTokenCredential);

  const threadId =
    (
      await chatClient.createChatThread({
        participants: [{ user: { communicationUserId: user.userId } }, { user: { communicationUserId: bot.userId } }],
        topic: 'DemoThread'
      })
    ).chatThread?.id ?? '';
  console.log(`threadId: ${threadId}`);

  createMessageBot(bot.token, endpointUrl, threadId, bot.userId);

  return {
    token: user.token,
    endpointUrl: endpointUrl.toString(),
    displayName: 'User1',
    threadId
  };
};

export const GroupChatComposite: () => JSX.Element = () => {
  const [chatConfig, setChatConfig] = useState<ChatConfig>();

  const connectionString = text('ACS Connection String', '', 'Server Simulator');

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

  let emptyConfigTips = 'Required params to run GroupChat are invalid or not complete.';

  if (!userId && !token && !displayName && !endpointUrl && !threadId) {
    emptyConfigTips = 'Please fill in Connection String or required params to run GroupChat.';
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        maxWidth: '50rem',
        maxHeight: '30rem',
        margin: '20px auto',
        border: '1px solid',
        padding: '0 10px'
      }}
    >
      {chatConfig && <GroupChat {...chatConfig} />}
      {!chatConfig && emptyConfigTips}
    </div>
  );
};
