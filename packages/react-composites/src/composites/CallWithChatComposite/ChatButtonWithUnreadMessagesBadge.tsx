// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatMessage } from '@azure/communication-chat';
import { FontIcon, IStackStyles, Stack } from '@fluentui/react';
import { ControlBarButtonProps } from '@internal/react-components';
import React, { useCallback, useState } from 'react';
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
  newMessageLabel?: string;
}

/**
 * Helper function to determine if the message in the event is a valid one from a user.
 * Display name is used since system messages will not have one.
 */
const validNewChatMessage = (message): boolean =>
  !!message.senderDisplayName && (message.type === 'text' || message.type === 'html');

const filledIcon = <FontIcon iconName={'ControlBarChatButtonActive'} />;
const regularIcon = <FontIcon iconName={'ControlBarChatButtonInactive'} />;

/**
 * @private
 */
export const ChatButtonWithUnreadMessagesBadge = (props: ChatButtonWithUnreadMessagesBadgeProps): JSX.Element => {
  const { chatAdapter, isChatPaneVisible, newMessageLabel } = props;
  const [unreadChatMessagesCount, setUnreadChatMessagesCount] = useState<number>(0);

  const baseIcon = props.showLabel ? regularIcon : filledIcon;
  const onRenderOnIcon = useCallback(() => baseIcon, [baseIcon]);
  const notificationOnIcon = useCallback((): JSX.Element => {
    return (
      <Stack styles={chatNotificationContainerStyles}>
        {unreadChatMessagesCount > 0 && (
          <NotificationIcon chatMessagesCount={unreadChatMessagesCount} label={newMessageLabel} />
        )}
        {baseIcon}
      </Stack>
    );
  }, [unreadChatMessagesCount, newMessageLabel]);

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
      data-ui-id="call-with-chat-composite-chat-button"
      onRenderOffIcon={notificationOnIcon}
      onRenderOnIcon={onRenderOnIcon}
    />
  );
};

const chatNotificationContainerStyles: IStackStyles = {
  root: {
    display: 'inline',
    position: 'relative'
  }
};
