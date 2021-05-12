// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatClient } from '@azure/communication-chat';
import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import { CommunicationIdentityClient } from '@azure/communication-identity';
import { Title, Description, Props, Heading, Source } from '@storybook/addon-docs/blocks';
import { text } from '@storybook/addon-knobs';
import { Meta } from '@storybook/react/types-6-0';
import React, { useState, useEffect, useRef } from 'react';
import { ChatAdapter, ChatConfig, ChatComposite, createAzureCommunicationChatAdapter } from 'react-composites';

import {
  CompositeConnectionParamsErrMessage,
  COMPOSITE_STRING_CONNECTIONSTRING,
  COMPOSITE_STRING_REQUIREDCONNECTIONSTRING
} from '../CompositeStringUtils';
import { COMPOSITE_EXPERIENCE_CONTAINER_STYLE, COMPOSITE_FOLDER_PREFIX } from '../constants';

const importStatement = `import { ChatComposite } from 'react-composites';`;
const usageCode = `import { ChatComposite } from 'react-composites';
import { AzureCommunicationUserCredential } from '@azure/communication-common';
import { CommunicationIdentityClient } from "@azure/communication-identity";
import { ChatClient } from '@azure/communication-chat';
import ReactDOM from 'react-dom';

// Initialize an Azure Comunnication Services chat user and create a thread
// This code is for demo purpose. In production this should happen in server side
// Check [Server folder] for a complete nodejs demo server
// Please don't show your CONNECTION STRING in any public place
const connectionString = '[CONNECTION STRING]';

const uri = new URL(connectionString.replace("endpoint=", ""));
const endpointUrl = \`\${uri.protocol}//\${uri.host}\`;

(async () => {
  let tokenClient = new CommunicationIdentityClient(connectionString);
  const user = await tokenClient.createUser();
  const token = await tokenClient.issueToken(user, ["chat"]);
  const [adapter, setAdapter] = useState<ChatAdapter>();

  const userAccessTokenCredential =
    new AzureCommunicationUserCredential(token.token);
  const chatClient = new ChatClient(endpointUrl, userAccessTokenCredential);

  const threadId = (await chatClient.createChatThread({
    members:
      [{ user: token.user }],
    topic: 'DemoThread'
  })).threadId;

  useEffect(() => {
    if (chatConfig) {
      const createAdapter = async (): Promise<void> => {
        setAdapter(
          await createAzureChatAdapter(
            token,
            endpointUrl,
            threadId,
            'Empty Display Name'
          )
        );
      };
      createAdapter();
    }
  }, [token, endpointUrl, threadId]);

  ReactDOM.render(
    <ChatComposite adapter= {adapter} />,
    document.getElementById('root'));
})();
`;

const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>ChatComposite</Title>
      <Description>ChatComposite is an one-stop component that you can make ACS Chat running.</Description>

      <Heading>Importing</Heading>
      <Source code={importStatement} />

      <Heading>Example Code</Heading>
      <Source code={usageCode} />

      <Heading>Props</Heading>
      <Props of={ChatComposite} />
    </>
  );
};

export default {
  title: `${COMPOSITE_FOLDER_PREFIX}/Chat`,
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

const createChatConfig = async (resourceConnectionString: string, displayName: string): Promise<ChatConfig> => {
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
    displayName: displayName,
    threadId
  };
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const Chat: () => JSX.Element = () => {
  const [chatConfig, setChatConfig] = useState<ChatConfig>();

  const knobs = useRef({
    connectionString: text(COMPOSITE_STRING_CONNECTIONSTRING, '', 'Server Simulator'),
    displayName: text('Display Name', '', 'Server Simulator')
  });

  useEffect(() => {
    const fetchToken = async (): Promise<void> => {
      if (knobs.current.connectionString) {
        setChatConfig(await createChatConfig(knobs.current.connectionString, knobs.current.displayName));
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

const ContosoChatContainer = (props: { config: ChatConfig | undefined }): JSX.Element => {
  const { config } = props;

  // Creating an adapter is asynchronous.
  // An update to `config` triggers a new adapter creation, via the useEffect block.
  // When the adapter becomes ready, the state update triggers a re-render of the ChatComposite.

  const [adapter, setAdapter] = useState<ChatAdapter>();
  useEffect(() => {
    if (config) {
      const createAdapter = async (): Promise<void> => {
        setAdapter(
          await createAzureCommunicationChatAdapter(
            config.token,
            config.endpointUrl,
            config.threadId,
            config.displayName
          )
        );
      };
      createAdapter();
    }
  }, [config]);

  return (
    <div style={COMPOSITE_EXPERIENCE_CONTAINER_STYLE}>
      {adapter ? <ChatComposite adapter={adapter} /> : <h3>Loading...</h3>}
    </div>
  );
};

const ConfigHintBanner = (): JSX.Element => {
  const emptyConfigTips = COMPOSITE_STRING_REQUIREDCONNECTIONSTRING.replace('{0}', 'Chat');
  const emptyConfigParametersTips = 'Or you can fill out the required params to do so.';
  return <>{CompositeConnectionParamsErrMessage([emptyConfigTips, emptyConfigParametersTips])}</>;
};
