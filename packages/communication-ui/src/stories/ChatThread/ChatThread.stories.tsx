// © Microsoft Corporation. All rights reserved.

import { Meta } from '@storybook/react/types-6-0';
import React, { useState } from 'react';
import { ChatThreadComponentBase } from '../../components/ChatThread';
import { boolean } from '@storybook/addon-knobs';
import { PrimaryButton, Stack } from '@fluentui/react';
import { getDocs } from './ChatThreadDocs';
import { ChatMessage as WebUiChatMessage, MessageStatus } from '../../types';
import {
  GenerateMockNewChatMessage,
  UserOne,
  GenerateMockNewChatMessageFromOthers,
  GenerateMockHistoryChatMessages,
  GenerateMockChatMessages,
  ChatThreadContainerStyles,
  ChatThreadStyles
} from './constants';
import { COMPONENT_FOLDER_PREFIX } from '../constants';

export const ChatThreadComponent: () => JSX.Element = () => {
  const [chatMessages, setChatMessages] = useState<WebUiChatMessage[]>(
    process.env.NODE_ENV === 'test'
      ? [
          {
            senderId: '1',
            senderDisplayName: 'User1',
            messageId: Math.random().toString(),
            content: 'Hi everyone, I created this awesome group chat for us!',
            createdOn: new Date('2019-04-13T00:00:00.000+08:10'),
            mine: true,
            attached: false,
            statusToRender: 'seen' as MessageStatus
          }
        ]
      : GenerateMockChatMessages()
  );
  const showReadReceipt = boolean('Enable Message Read Receipt', true);
  const loadMoreMessages = boolean('Enable Load More Messages', true);
  const enableJumpToNewMessageButton = boolean('Enable Jump To New Message', true);

  const onSendNewMessage = (): void => {
    const existingChatMessages = chatMessages;
    // We dont want to render the status for previous messages
    existingChatMessages.forEach((message) => {
      message.statusToRender = undefined;
    });
    setChatMessages([...existingChatMessages, GenerateMockNewChatMessage()]);
  };

  const onSendNewMessageFromOthers = (): void => {
    setChatMessages([...chatMessages, GenerateMockNewChatMessageFromOthers()]);
  };

  const onLoadPreviousMessages = (): void => {
    setChatMessages([...GenerateMockHistoryChatMessages(), ...chatMessages]);
  };

  return (
    <Stack style={ChatThreadContainerStyles}>
      <ChatThreadComponentBase
        styles={ChatThreadStyles}
        userId={UserOne.senderId}
        chatMessages={chatMessages}
        disableReadReceipt={!showReadReceipt}
        disableLoadPreviousMessage={!loadMoreMessages}
        disableJumpToNewMessageButton={!enableJumpToNewMessageButton}
        onLoadPreviousMessages={onLoadPreviousMessages}
      />
      {/* We need to use these two buttons to render more messages in the chat thread and showcase the "new message" button.
      Using storybook knobs would trigger the whole story to do a fresh re-render, not just components inside the story. */}
      <Stack horizontal horizontalAlign="space-between">
        <PrimaryButton text="Send new message from others" onClick={onSendNewMessageFromOthers} />
        <PrimaryButton text="Send new message" onClick={onSendNewMessage} />
      </Stack>
    </Stack>
  );
};

export default {
  title: `${COMPONENT_FOLDER_PREFIX}/ChatThread`,
  component: ChatThreadComponentBase,
  parameters: {
    docs: {
      page: () => getDocs()
    },
    storyshots: { disable: true }
  }
} as Meta;
