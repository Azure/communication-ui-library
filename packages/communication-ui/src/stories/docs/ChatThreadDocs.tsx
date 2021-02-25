// © Microsoft Corporation. All rights reserved.
import React from 'react';
import { Title, Description, Props, Heading, Source, Canvas } from '@storybook/addon-docs/blocks';
import { Provider, teamsTheme } from '@fluentui/react-northstar';

import { ChatThreadComponent as ChatThread } from '../../components';
import { MessageStatus } from '../../types';

const importStatement = `import { ChatThread } from '@azure/communication-ui';`;
const usageCode = `<ChatThread
    userId={'1'}
    chatMessages={[
      {
        messageId: '1',
        content: '1',
        createdOn: new Date('2020-12-15T00:00:00Z'),
        senderId: '1',
        senderDisplayName: 'User1',
        status: MessageStatus.SEEN
      },
      {
        messageId: '2',
        content: '2',
        createdOn: new Date('2020-12-15T00:01:00Z'),
        senderId: '2',
        senderDisplayName: 'User2',
        status: MessageStatus.SEEN
      }
    ]}
    disableReadReceipt={false}
    sendReadReceipt={() => new Promise<void>((resolve) => resolve())}
/>`;

const ChatThreadExample: () => JSX.Element = () => (
  <>
    <ChatThread
      userId="1"
      chatMessages={[
        {
          messageId: '1',
          content: '1',
          createdOn: new Date('2020-12-15T00:00:00Z'),
          senderId: '1',
          senderDisplayName: 'User1',
          status: MessageStatus.SEEN
        },
        {
          messageId: '2',
          content: '2',
          createdOn: new Date('2020-12-15T00:01:00Z'),
          senderId: '2',
          senderDisplayName: 'User2',
          status: MessageStatus.SEEN
        }
      ]}
      disableReadReceipt={false}
      sendReadReceipt={() => new Promise<void>((resolve) => resolve())}
    />
  </>
);

export const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>ChatThread</Title>
      <Description>Chat Thread takes in an array of WebUiChatMessages and displays them.</Description>
      <Heading>Importing</Heading>
      <Source code={importStatement} />
      <Heading>Example</Heading>
      <Canvas>
        <Provider
          theme={teamsTheme}
          style={{ display: 'flex', height: '200px', width: '100%' }}
        >
          <ChatThreadExample />
        </Provider>
      </Canvas>
      <Source code={usageCode} />
      <Heading>Props</Heading>
      <Props of={ChatThread} />
    </>
  );
};
