// © Microsoft Corporation. All rights reserved.

import { Meta } from '@storybook/react/types-6-0';
import React, { useState } from 'react';
import { ChatThreadComponentBase, ChatMessage as WebUiChatMessage } from '@azure/communication-ui';
import { boolean } from '@storybook/addon-knobs';
import { PrimaryButton, Stack } from '@fluentui/react';
import { getDocs } from './ChatThreadDocs';
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
  const [chatMessages, setChatMessages] = useState<WebUiChatMessage[]>(GenerateMockChatMessages());
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
