// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatMessage } from '@azure/communication-chat';
import { IStackStyles, Stack } from '@fluentui/react';
import { Chat20Regular } from '@fluentui/react-icons';
import { ControlBarButtonProps } from '@internal/react-components';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { ChatAdapter } from '../ChatComposite';
import { ChatButton } from './ChatButton';
import { NotificationIcon } from './NotificationIcon';

/**
 * @private
 */
export interface ChatButtonWithUnreadMessagesBadgeProps extends ControlBarButtonProps {
  chatAdapter: ChatAdapter;
  isChatPaneVisible: boolean;
}

/**
 * Helper function to determine if the message in the event is a valid one from a user.
 * Display name is used since system messages will not have one.
 */
const validNewChatMessage = (message): boolean =>
  !!message.senderDisplayName && (message.type === 'text' || message.type === 'html');

/**
 * @private
 */
export const ChatButtonWithUnreadMessagesBadge = (props: ChatButtonWithUnreadMessagesBadgeProps): JSX.Element => {
  const { chatAdapter, isChatPaneVisible } = props;
  const [unreadChatMessagesCount, setUnreadChatMessagesCount] = useState<number>(0);

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
      {...props}
      showLabel={true}
      data-ui-id="meeting-composite-chat-button"
      onRenderOffIcon={(): JSX.Element => {
        return (
          <Stack styles={chatNotificationContainerStyles}>
            {unreadChatMessagesCount > 0 && <NotificationIcon chatMessagesCount={unreadChatMessagesCount} />}
            <Chat20Regular key={'chatOffIconKey'} primaryFill="currentColor" />
          </Stack>
        );
      }}
    />
  );
};

const chatNotificationContainerStyles: IStackStyles = {
  root: {
    display: 'inline',
    position: 'relative'
  }
};
