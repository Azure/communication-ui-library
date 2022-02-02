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
  isChatPaneVisible: boolean;
  onChatButtonClicked: () => void;
  disabled: boolean;
};

/**
 * @private
 */
export const ChatButtonWithUnreadMessagesBadge = (props: ChatButtonLogicWrapperProps): JSX.Element => {
  const { chatButtonProps, chatAdapter, isChatPaneVisible, onChatButtonClicked, disabled } = props;
  const [unreadChatMessagesCount, setUnreadChatMessagesCount] = useState<number>(0);

  /**
   * Helper function to determine if the message in the event is a valid one from a user.
   * Display name is used since system messages will not have one.
   */
  const validNewChatMessage = (message): boolean =>
    !!message.senderDisplayName && (message.type === 'text' || message.type === 'html');

  useEffect(() => {
    if (isChatPaneVisible) {
      setUnreadChatMessagesCount(0);
      return;
    }
    const incrementUnreadChatMessagesCount = (event: { message: ChatMessage }): void => {
      if (!isChatPaneVisible && validNewChatMessage(event.message)) {
        setUnreadChatMessagesCount(unreadChatMessagesCount + 1);
      }
    };
    chatAdapter.on('messageReceived', incrementUnreadChatMessagesCount);

    return () => {
      chatAdapter.off('messageReceived', incrementUnreadChatMessagesCount);
    };
  }, [chatAdapter, setUnreadChatMessagesCount, isChatPaneVisible, unreadChatMessagesCount]);

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
