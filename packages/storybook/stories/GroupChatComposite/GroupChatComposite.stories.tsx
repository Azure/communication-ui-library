// © Microsoft Corporation. All rights reserved.

import React, { useEffect } from 'react';
import { text } from '@storybook/addon-knobs';
import { getDocs } from './GroupChatCompositeDocs';
import { ChatConfig, GroupChat as GroupChatComposite } from 'react-composites';
import { AzureCommunicationUserCredential } from '@azure/communication-common';
import { CommunicationIdentityClient } from '@azure/communication-administration';
import { ChatClient } from '@azure/communication-chat';
import { useState } from 'react';
import { COMPOSITE_EXPERIENCE_CONTAINER_STYLE, COMPOSITE_FOLDER_PREFIX } from '../constants';
import {
  CompositeConnectionParamsErrMessage,
  COMPOSITE_STRING_CONNECTIONSTRING,
  COMPOSITE_STRING_REQUIREDCONNECTIONSTRING
} from '../CompositeStringUtils';
import { Meta } from '@storybook/react/types-6-0';

export default {
  title: `${COMPOSITE_FOLDER_PREFIX}/Group Chat`,
  component: GroupChatComposite,
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

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const GroupChat: () => JSX.Element = () => {
  const [chatConfig, setChatConfig] = useState<ChatConfig>();

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

  const emptyConfigTips = COMPOSITE_STRING_REQUIREDCONNECTIONSTRING.replace('{0}', 'Group Chat');
  let emptyConfigParametersTips = '';

  if (!userId && !token && !displayName && !endpointUrl && !threadId) {
    emptyConfigParametersTips = 'Or you can fill out the required params to do so.';
  }

  return (
    <div style={COMPOSITE_EXPERIENCE_CONTAINER_STYLE}>
      {chatConfig && <GroupChatComposite {...chatConfig} />}
      {!chatConfig && CompositeConnectionParamsErrMessage([emptyConfigTips, emptyConfigParametersTips])}
    </div>
  );
};
