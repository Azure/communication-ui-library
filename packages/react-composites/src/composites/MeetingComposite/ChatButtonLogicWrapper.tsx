// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatMessage } from '@azure/communication-chat';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { ChatAdapter } from '../ChatComposite';
import { ChatButton, ChatButtonProps } from './ChatButton';

/**
 * @private
 */
export type ChatButtonLogicWrapperProps = {
  chatButtonProps: ChatButtonProps;
  chatAdapter: ChatAdapter;
  showChat: boolean;
  onChatButtonClicked: () => void;
  disabled: boolean;
};

/**
 * @private
 */
export const ChatButtonLogicWrapper = (props: ChatButtonLogicWrapperProps): JSX.Element => {
  const { chatButtonProps, chatAdapter, showChat, onChatButtonClicked, disabled } = props;
  const [unreadChatMessagesCount, setUnreadChatMessagesCount] = useState<number>(0);
  useEffect(() => {
    if (showChat === true) {
      setUnreadChatMessagesCount(0);
      return;
    }
    const incrementUnreadtChatMessagesCount = (event: { message: ChatMessage }): void => {
      if (!showChat && event.message.senderDisplayName !== '') {
        if (event.message.type === 'text' || event.message.type === 'html') {
          setUnreadChatMessagesCount(unreadChatMessagesCount + 1);
        }
      }
    };
    chatAdapter.on('messageReceived', incrementUnreadtChatMessagesCount);

    return () => {
      chatAdapter.off('messageReceived', incrementUnreadtChatMessagesCount);
    };
  }, [chatAdapter, setUnreadChatMessagesCount, showChat, unreadChatMessagesCount]);

  return (
    <ChatButton
      chatButtonChecked={chatButtonProps.chatButtonChecked}
      showLabel={true}
      onClick={onChatButtonClicked}
      data-ui-id="meeting-composite-chat-button"
      disabled={disabled}
      label={chatButtonProps.label}
      unreadMessageCount={unreadChatMessagesCount}
    />
  );
};
