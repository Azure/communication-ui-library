// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatMessage } from '@azure/communication-chat';
import { IStackStyles, Stack } from '@fluentui/react';
import { _formatString } from '@internal/acs-ui-common';
import { ControlBarButtonProps } from '@internal/react-components';
import React, { useCallback, useMemo, useState } from 'react';
import { useEffect } from 'react';
import { ChatAdapter } from '../../ChatComposite';
import { CallWithChatCompositeIcon } from '../../common/icons';
import { ChatButton } from './ChatButton';
import { useCallWithChatCompositeStrings } from '../hooks/useCallWithChatCompositeStrings';
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

const filledIcon = <CallWithChatCompositeIcon iconName={'ControlBarChatButtonActive'} />;
const regularIcon = <CallWithChatCompositeIcon iconName={'ControlBarChatButtonInactive'} />;

/**
 * @private
 */
export const ChatButtonWithUnreadMessagesBadge = (props: ChatButtonWithUnreadMessagesBadgeProps): JSX.Element => {
  const { chatAdapter, isChatPaneVisible, newMessageLabel } = props;
  const [unreadChatMessagesCount, setUnreadChatMessagesCount] = useState<number>(0);

  const baseIcon = props.showLabel ? regularIcon : filledIcon;
  const callWithChatStrings = useCallWithChatCompositeStrings();

  const numberOfMsgToolTip =
    props.strings?.tooltipOffContent && unreadChatMessagesCount > 0
      ? _formatString(callWithChatStrings.chatButtonTooltipClosedWithMessageCount, {
          unreadMessagesCount: `${unreadChatMessagesCount}`
        })
      : undefined;

  const chatStrings = useMemo(
    () => ({
      label: props.strings?.label,
      tooltipOffContent: numberOfMsgToolTip ? numberOfMsgToolTip : props.strings?.tooltipOffContent,
      tooltipOnContent: props.strings?.tooltipOnContent
    }),
    [numberOfMsgToolTip, props.strings?.label, props.strings?.tooltipOffContent, props.strings?.tooltipOnContent]
  );
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
  }, [unreadChatMessagesCount, newMessageLabel, baseIcon]);

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
      strings={chatStrings}
    />
  );
};

const chatNotificationContainerStyles: IStackStyles = {
  root: {
    display: 'inline',
    position: 'relative'
  }
};
