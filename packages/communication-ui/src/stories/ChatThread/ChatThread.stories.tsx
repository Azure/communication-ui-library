// © Microsoft Corporation. All rights reserved.

import { Meta } from '@storybook/react/types-6-0';
import React, { useState } from 'react';
import { ChatThreadComponentBase } from '../../components/ChatThread';
import { boolean } from '@storybook/addon-knobs';
import { PrimaryButton, Stack } from '@fluentui/react';
import { getDocs } from './ChatThreadDocs';
import { ChatMessage as WebUiChatMessage } from '../../types';
import {
  GetChatThreadMessages,
  UserOne,
  GetNewChatMessage,
  GetNewChatMessageFromOthers,
  GetHistoryChatMessages
} from './constants';
import { COMPONENT_FOLDER_PREFIX } from '../constants';

export const ChatThreadComponent: () => JSX.Element = () => {
  const [chatMessages, setChatMessages] = useState<WebUiChatMessage[]>(GetChatThreadMessages());
  const showReadReceipt = boolean('Enable Message Read Receipt', true);
  const loadMoreMessages = boolean('Enable Load More Messages', true);
  const enableJumpToNewMessageButton = boolean('Enable Jump To New Message', true);

  const onSendNewMessage = () => {
    const existingChatMessages = chatMessages;
    // We dont want to render the status for previous messages
    existingChatMessages.forEach((message) => {
      message.statusToRender = undefined;
    });
    setChatMessages([...existingChatMessages, GetNewChatMessage()]);
  };

  const onSendNewMessageFromOthers = () => {
    setChatMessages([...chatMessages, GetNewChatMessageFromOthers()]);
  };

  const onLoadPreviousMessages = () => {
    setChatMessages([...GetHistoryChatMessages(), ...chatMessages]);
  };

  return (
    <Stack
      style={{
        width: '100%',
        height: '100%',
        maxWidth: '50rem',
        maxHeight: '30rem'
      }}
    >
      <ChatThreadComponentBase
        styles={{
          root: {
            margin: '20px auto',
            border: '1px solid',
            padding: '0 10px'
          }
        }}
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
    }
  }
} as Meta;
