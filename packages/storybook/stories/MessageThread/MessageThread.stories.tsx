// © Microsoft Corporation. All rights reserved.

import { Meta } from '@storybook/react/types-6-0';
import React, { useState } from 'react';
import {
  MessageThread,
  ChatMessage,
  CustomMessage,
  SystemMessage,
  DefaultMessageRendererType
} from '@azure/communication-ui';
import { boolean } from '@storybook/addon-knobs';
import { PrimaryButton, Stack } from '@fluentui/react';
import { Divider } from '@fluentui/react-northstar';
import { getDocs } from './MessageThreadDocs';
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
import { COMPONENT_FOLDER_PREFIX } from '../constants';

export const MessageThreadComponent: () => JSX.Element = () => {
  const [chatMessages, setChatMessages] = useState<(SystemMessage | CustomMessage | ChatMessage)[]>(
    GenerateMockChatMessages()
  );
  const showReadReceipt = boolean('Enable Message Read Receipt', true);
  const loadMoreMessages = boolean('Enable Load More Messages', true);
  const enableJumpToNewMessageButton = boolean('Enable Jump To New Message', true);

  const onSendNewMessage = (): void => {
    const existingChatMessages = chatMessages;
    // We dont want to render the status for previous messages
    existingChatMessages.forEach((message) => {
      if (message.type === 'chat') {
        message.payload.statusToRender = undefined;
      }
    });
    setChatMessages([...existingChatMessages, GenerateMockNewChatMessage()]);
  };

  const onSendNewMessageFromOthers = (): void => {
    setChatMessages([...chatMessages, GenerateMockNewChatMessageFromOthers()]);
  };

  const onLoadPreviousMessages = (): void => {
    setChatMessages([...GenerateMockHistoryChatMessages(), ...chatMessages]);
  };

  const onSendNewSystemMessage = (): void => {
    setChatMessages([...chatMessages, GenerateMockSystemMessage()]);
  };

  const onSendCustomMessage = (): void => {
    setChatMessages([...chatMessages, GenerateMockCustomMessage()]);
  };

  const onRenderMessage = (
    message: SystemMessage | CustomMessage | ChatMessage,
    defaultOnRender?: DefaultMessageRendererType
  ): JSX.Element => {
    if (message.type === 'custom') {
      return <Divider content={message.payload.content} color="brand" important />;
    } else {
      return defaultOnRender ? defaultOnRender(message) : <></>;
    }
  };

  return (
    <Stack style={MessageThreadContainerStyles}>
      <MessageThread
        styles={MessageThreadStyles}
        userId={UserOne.senderId}
        messages={chatMessages}
        disableReadReceipt={!showReadReceipt}
        disableLoadPreviousMessage={!loadMoreMessages}
        disableJumpToNewMessageButton={!enableJumpToNewMessageButton}
        onLoadPreviousMessages={onLoadPreviousMessages}
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
  title: `${COMPONENT_FOLDER_PREFIX}/MessageThread`,
  component: MessageThread,
  parameters: {
    docs: {
      page: () => getDocs()
    },
    storyshots: { disable: true }
  }
} as Meta;
