// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  MessageProps,
  MessageThread as MessageThreadComponent,
  ChatMessage,
  CustomMessage,
  SystemMessage,
  DefaultMessageRendererType
} from '@azure/communication-react';
import { PrimaryButton, Stack } from '@fluentui/react';
import { Divider } from '@fluentui/react-northstar';
import { Canvas, Description, Heading, Props, Source, Title } from '@storybook/addon-docs/blocks';
import { boolean } from '@storybook/addon-knobs';
import { Meta } from '@storybook/react/types-6-0';
import React, { useState } from 'react';

import { COMPONENT_FOLDER_PREFIX } from '../constants';
import {
  GenerateMockNewChatMessage,
  UserOne,
  GenerateMockNewChatMessageFromOthers,
  GenerateMockHistoryChatMessages,
  GenerateMockChatMessages,
  MessageThreadContainerStyles,
  MessageThreadStyles,
  GenerateMockSystemMessage,
  GenerateMockCustomMessage
} from './placeholdermessages';
import { DefaultMessageThreadExample } from './snippets/MessageThread.snippet';
import { MessageThreadWithCustomAvatarExample } from './snippets/MessageThreadWithCustomAvatar.snippet';
import { MessageThreadWithCustomChatContainerExample } from './snippets/MessageThreadWithCustomChatContainer.snippet';
import { MessageThreadWithCustomMessageContainerExample } from './snippets/MessageThreadWithCustomMessageContainer.snippet';
import { MessageThreadWithCustomMessagesExample } from './snippets/MessageThreadWithCustomMessages.snippet';
import { MessageThreadWithCustomReadReceiptExample } from './snippets/MessageThreadWithCustomReadReceipt.snippet';
import { MessageThreadWithReadReceiptExample } from './snippets/MessageThreadWithReadReceipt.snippet';
import { MessageThreadWithSystemMessagesExample } from './snippets/MessageThreadWithSystemMessages.snippet';

const DefaultMessageThreadExampleText = require('!!raw-loader!./snippets/MessageThread.snippet.tsx').default;
const MessageThreadWithCustomAvatarExampleText = require('!!raw-loader!./snippets/MessageThreadWithCustomAvatar.snippet.tsx')
  .default;
const MessageThreadWithCustomChatContainerExampleText = require('!!raw-loader!./snippets/MessageThreadWithCustomChatContainer.snippet.tsx')
  .default;
const MessageThreadWithCustomMessageContainerExampleText = require('!!raw-loader!./snippets/MessageThreadWithCustomMessageContainer.snippet.tsx')
  .default;
const MessageThreadWithCustomMessagesExampleText = require('!!raw-loader!./snippets/MessageThreadWithCustomMessages.snippet.tsx')
  .default;
const MessageThreadWithCustomReadReceiptExampleText = require('!!raw-loader!./snippets/MessageThreadWithCustomReadReceipt.snippet.tsx')
  .default;
const MessageThreadWithReadReceiptExampleText = require('!!raw-loader!./snippets/MessageThreadWithReadReceipt.snippet.tsx')
  .default;
const MessageThreadWithSystemMessagesExampleText = require('!!raw-loader!./snippets/MessageThreadWithSystemMessages.snippet.tsx')
  .default;
const ExampleConstantsText = require('!!raw-loader!./snippets/placeholdermessages.ts').default;

const importStatement = `
import { FluentThemeProvider, MessageThread } from '@azure/communication-react';
`;

const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>MessageThread</Title>
      <Description of={MessageThread} />

      <Heading>Importing</Heading>
      <Source code={importStatement} />

      <Heading>Sample Messages</Heading>
      <Description>
        Create a `placeholdermessages.ts` file in the current folder you are working on. Then copy paste the code below
        into that file.
      </Description>
      <Source code={ExampleConstantsText} />

      <Heading>Default MessageThread</Heading>
      <Canvas mdxSource={DefaultMessageThreadExampleText}>
        <DefaultMessageThreadExample />
      </Canvas>

      <Heading>System Message</Heading>
      <Description>The example below shows a message thread with a system message.</Description>
      <Canvas mdxSource={MessageThreadWithSystemMessagesExampleText}>
        <MessageThreadWithSystemMessagesExample />
      </Canvas>

      <Heading>Custom Message</Heading>
      <Description>
        The example below shows how to render a `custom` message with `onRenderMessage` in `MessageThread`
      </Description>
      <Canvas mdxSource={MessageThreadWithCustomMessagesExampleText}>
        <MessageThreadWithCustomMessagesExample />
      </Canvas>

      <Heading>Messages with Customized Chat Container</Heading>
      <Description>
        The example below shows how to render a `custom` chat container with `styles.chatContainer` in `MessageThread`
      </Description>
      <Canvas mdxSource={MessageThreadWithCustomChatContainerExampleText}>
        <MessageThreadWithCustomChatContainerExample />
      </Canvas>

      <Heading>Messages with Customized Message Container</Heading>
      <Description>
        The example below shows how to render a `custom` message container with `styles.chatMessageContainer` or
        `styles.systemMessageContainer` in `MessageThread`
      </Description>
      <Description>
        Note: In the code example, all `%` characters were replaced by their unicode value `\u0025` due to URI malformed
        issue when loading the storybook snippets
      </Description>
      <Canvas mdxSource={MessageThreadWithCustomMessageContainerExampleText}>
        <MessageThreadWithCustomMessageContainerExample />
      </Canvas>

      <Heading>Default Read Receipt</Heading>
      <Canvas mdxSource={MessageThreadWithReadReceiptExampleText}>
        <MessageThreadWithReadReceiptExample />
      </Canvas>

      <Heading>Cutomized Read Receipt</Heading>
      <Description>
        The example below shows how to render a `custom` read receipt with `onRenderReadReceipt` in `MessageThread`
      </Description>
      <Canvas mdxSource={MessageThreadWithCustomReadReceiptExampleText}>
        <MessageThreadWithCustomReadReceiptExample />
      </Canvas>

      <Heading>Customized Avatar</Heading>
      <Canvas mdxSource={MessageThreadWithCustomAvatarExampleText}>
        <MessageThreadWithCustomAvatarExample />
      </Canvas>

      <Description>
        Note: You can view the details of the
        [Persona](https://developer.microsoft.com/en-us/fluentui#/controls/web/persona) component
      </Description>
      <Heading>Props</Heading>
      <Props of={MessageThread} />
    </>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const MessageThread: () => JSX.Element = () => {
  const [chatMessages, setChatMessages] = useState<(SystemMessage | CustomMessage | ChatMessage)[]>(
    GenerateMockChatMessages()
  );
  const showReadReceipt = boolean('Enable Message Read Receipt', true);
  const enableJumpToNewMessageButton = boolean('Enable Jump To New Message', true);

  const onSendNewMessage = (): void => {
    const existingChatMessages = chatMessages;
    // We dont want to render the status for previous messages
    existingChatMessages.forEach((message) => {
      if (message.type === 'chat') {
        message.payload.status = undefined;
      }
    });
    setChatMessages([...existingChatMessages, GenerateMockNewChatMessage()]);
  };

  const onSendNewMessageFromOthers = (): void => {
    setChatMessages([...chatMessages, GenerateMockNewChatMessageFromOthers()]);
  };

  const onLoadPreviousMessages = async (): Promise<boolean> => {
    setChatMessages([...GenerateMockHistoryChatMessages(), ...chatMessages]);
    return false;
  };

  const onSendNewSystemMessage = (): void => {
    setChatMessages([...chatMessages, GenerateMockSystemMessage()]);
  };

  const onSendCustomMessage = (): void => {
    setChatMessages([...chatMessages, GenerateMockCustomMessage()]);
  };

  const onRenderMessage = (messageProps: MessageProps, defaultOnRender?: DefaultMessageRendererType): JSX.Element => {
    if (messageProps.message.type === 'custom') {
      return <Divider content={messageProps.message.payload.content} color="brand" important />;
    }

    return defaultOnRender ? defaultOnRender(messageProps) : <></>;
  };

  return (
    <Stack style={MessageThreadContainerStyles}>
      <MessageThreadComponent
        styles={MessageThreadStyles}
        userId={UserOne.senderId}
        messages={chatMessages}
        disableReadReceipt={!showReadReceipt}
        disableJumpToNewMessageButton={!enableJumpToNewMessageButton}
        onLoadPreviousChatMessages={onLoadPreviousMessages}
        onRenderMessage={onRenderMessage}
      />
      {/* We need to use these two buttons to render more messages in the chat thread and showcase the "new message" button.
      Using storybook knobs would trigger the whole story to do a fresh re-render, not just components inside the story. */}
      <Stack horizontal horizontalAlign="space-between" tokens={{ childrenGap: '1rem' }}>
        <PrimaryButton text="Send new message from others" onClick={onSendNewMessageFromOthers} />
        <PrimaryButton text="Send new message" onClick={onSendNewMessage} />
        <PrimaryButton text="Send new system message" onClick={onSendNewSystemMessage} />
        <PrimaryButton text="Send new custom message" onClick={onSendCustomMessage} />
      </Stack>
    </Stack>
  );
};

export default {
  title: `${COMPONENT_FOLDER_PREFIX}/Message Thread`,
  component: MessageThreadComponent,
  parameters: {
    docs: {
      page: () => getDocs()
    },
    storyshots: { disable: true }
  }
} as Meta;
