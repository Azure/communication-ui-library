// © Microsoft Corporation. All rights reserved.

import { Canvas, Description, Heading, Props, Source, Title } from '@storybook/addon-docs/blocks';
import React from 'react';
import {
  FluentThemeProvider,
  THEMES,
  ChatThreadComponent,
  ChatMessage as WebUiChatMessage,
  MessageStatus
} from '@azure/communication-ui';
import { Persona, PersonaPresence, PersonaSize } from '@fluentui/react';

const importStatement = `
import React from 'react';
// We need to wrap ChatThread component with the FluentThemeProvider and pass the THEMES you'd like to use to the provider.
import {
  ChatThreadComponent,
  ChatMessage as WebUiChatMessage,
  MessageStatus,
  FluentThemeProvider,
  THEMES
} from '@azure/communication-ui';
`;

const dataStatement = `
// This is some mock messages for example purposes.
// For actual projects, you can get chat messages from declarative/selectors for ACS.
const GetHistoryChatMessages = (): WebUiChatMessage[] => {
  return [
    {
      senderId: '1',
      senderDisplayName: 'User1',
      messageId: Math.random().toString(),
      content: 'Hi everyone, I created this awesome group chat for us!',
      createdOn: new Date('2019-04-13T00:00:00.000+08:10'),
      mine: true,
      attached: false,
      statusToRender: 'seen' as MessageStatus
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
`;

const defaultChatThreadUsageCode = `
const DefaultChatThreadExample: () => JSX.Element = () => {
  // userId and chatMessages are required props.
  return (
    <FluentThemeProvider fluentTheme={THEMES['light']}>
      <ChatThreadComponent
        userId={'1'}
        chatMessages={GetHistoryChatMessages()}
      />
    </FluentThemeProvider>
  );
};
`;

const chatThreadWithReadReceiptUsageCode = `
const ChatThreadWithReadReceiptExample: () => JSX.Element = () => {
  // Show the read receipt of messages that I sent by setting 'disableReadReceipt' prop to be false.
  // You can also set your own read receipt component by passing in onRenderReadReceipt of type (readReceiptComponentProps: ReadReceiptComponentProps) => JSX.Element.
  return (
    <FluentThemeProvider fluentTheme={THEMES['light']}>
      <ChatThreadComponent userId={'1'} chatMessages={GetHistoryChatMessages()} disableReadReceipt={false}/>
    </FluentThemeProvider>
  );
};
`;

const chatThreadWithCustomAvatarExample = `
import { Persona, PersonaPresence, PersonaSize } from '@fluentui/react';

const ChatThreadWithCustomAvatarExample: () => JSX.Element = () => {
  // Customize the Avatar of other participants to be a Persona component from Fluent and show the presence status on the avatar.
  return (
    <FluentThemeProvider fluentTheme={THEMES['light']}>
      <ChatThreadComponent
        userId={'1'}
        chatMessages={GetHistoryChatMessages()}
        onRenderAvatar={(userId: string) => {
          return (
            <Persona
              size={PersonaSize.size32}
              hidePersonaDetails
              presence={PersonaPresence.online}
              text={userId}
            />
          )
        }}
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
      attached: false,
      statusToRender: 'seen' as MessageStatus
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

const DefaultChatThreadExample: () => JSX.Element = () => {
  return (
    <FluentThemeProvider fluentTheme={THEMES['light']}>
      <ChatThreadComponent userId={'1'} chatMessages={GetHistoryChatMessages()} />
    </FluentThemeProvider>
  );
};

const ChatThreadWithReadReceiptExample: () => JSX.Element = () => {
  // Show the read receipt of messages that I sent by setting 'disableReadReceipt' prop to be false.
  return (
    <FluentThemeProvider fluentTheme={THEMES['light']}>
      <ChatThreadComponent userId={'1'} chatMessages={GetHistoryChatMessages()} disableReadReceipt={false} />
    </FluentThemeProvider>
  );
};

const ChatThreadWithCustomAvatarExample: () => JSX.Element = () => {
  // Customize the Avatar of other participants to be a Persona component from Fluent and show the presence status on the avatar.
  return (
    <FluentThemeProvider fluentTheme={THEMES['light']}>
      <ChatThreadComponent
        userId={'1'}
        chatMessages={GetHistoryChatMessages()}
        onRenderAvatar={(userId: string) => {
          return (
            <Persona size={PersonaSize.size32} hidePersonaDetails presence={PersonaPresence.online} text={userId} />
          );
        }}
      />
    </FluentThemeProvider>
  );
};

export const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>ChatThread</Title>
      <Description of={ChatThreadComponent} />
      <Heading>Importing</Heading>
      <Source code={importStatement} />
      <Heading>Sample Messages</Heading>
      <Source code={dataStatement} />
      <Heading>Default ChatThread</Heading>
      <Canvas>
        <DefaultChatThreadExample />
      </Canvas>
      <Source code={defaultChatThreadUsageCode} />
      <Heading>Read Receipt</Heading>
      <Canvas>
        <ChatThreadWithReadReceiptExample />
      </Canvas>
      <Source code={chatThreadWithReadReceiptUsageCode} />
      <Heading>Customized Avatar</Heading>
      <Canvas>
        <ChatThreadWithCustomAvatarExample />
      </Canvas>
      <Source code={chatThreadWithCustomAvatarExample} />
      <Description>
        Note: You can view the details of the
        [Persona](https://developer.microsoft.com/en-us/fluentui#/controls/web/persona) component
      </Description>
      <Heading>Props</Heading>
      <Props of={ChatThreadComponent} />
    </>
  );
};
