// © Microsoft Corporation. All rights reserved.

import { Stack } from '@fluentui/react';
import { CallEndIcon } from '@fluentui/react-northstar';
import { Canvas, Description, Heading, Props, Source, Title } from '@storybook/addon-docs/blocks';
import React from 'react';
import { ChatThreadComponentBase } from '../../components/ChatThread';
import { FluentThemeProvider } from '../../providers';
import { ChatMessage as WebUiChatMessage } from '../../types';
import { THEMES } from '../../constants/themes';

const importStatement = `
import React from 'react';
import {
  ChatThreadComponentBase,
  FluentThemeProvider,
  ChatMessage as WebUiChatMessage,
  THEMES
} from '@azure/communication-ui';
`;

const usageCode = `
const GetHistoryChatMessages = (): WebUiChatMessage[] => {
  return [
    {
      senderId: '1',
      senderDisplayName: 'User1',
      messageId: Math.random().toString(),
      content: 'Hi everyone, I created this awesome group chat for us!',
      createdOn: new Date('2019-04-13T00:00:00.000+08:10'),
      mine: true,
      attached: false
    },
    {
      senderId: '2',
      senderDisplayName: 'User2',
      messageId: Math.random().toString(),
      content: 'Nice! This looks great!',
      createdOn: new Date('2019-04-13T00:00:00.000+08:09'),
      mine: false,
      attached: false
    },{
      senderId: '3',
      senderDisplayName: 'User3',
      messageId: Math.random().toString(),
      content: 'Yeah agree, let\'s chat here from now on!',
      createdOn: new Date('2019-04-13T00:00:00.000+08:09'),
      mine: false,
      attached: false
    }
  ];
};

const ChatThreadExample: () => JSX.Element = () => {
  return (
    <FluentThemeProvider fluentTheme={THEMES['light']}>
      <ChatThreadComponentBase
        userId={'1'}
        chatMessages={GetHistoryChatMessages()}
      />
    </FluentThemeProvider>
  );
};
`;

export const GetHistoryChatMessages = (): WebUiChatMessage[] => {
  return [
    {
      senderId: '1',
      senderDisplayName: 'User1',
      messageId: Math.random().toString(),
      content: 'Hi everyone, I created this awesome group chat for us!',
      createdOn: new Date('2019-04-13T00:00:00.000+08:10'),
      mine: true,
      attached: false
    },
    {
      senderId: '2',
      senderDisplayName: 'User2',
      messageId: Math.random().toString(),
      content: 'Nice! This looks great!',
      createdOn: new Date('2019-04-13T00:00:00.000+08:09'),
      mine: false,
      attached: false
    },
    {
      senderId: '3',
      senderDisplayName: 'User3',
      messageId: Math.random().toString(),
      content: "Yeah agree, let's chat here from now on!",
      createdOn: new Date('2019-04-13T00:00:00.000+08:09'),
      mine: false,
      attached: false
    }
  ];
};

const ChatThreadExample: () => JSX.Element = () => {
  return (
    <FluentThemeProvider fluentTheme={THEMES['light']}>
      <ChatThreadComponentBase userId={'1'} chatMessages={GetHistoryChatMessages()} />
    </FluentThemeProvider>
  );
};

export const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>ChatThread</Title>
      <Description of={ChatThreadComponentBase} />
      <Heading>Importing</Heading>
      <Source code={importStatement} />
      <Heading>Example</Heading>
      <Canvas>
        <ChatThreadExample />
      </Canvas>
      <Source code={usageCode} />
      <Heading>Props</Heading>
      <Props of={ChatThreadComponentBase} />
    </>
  );
};
