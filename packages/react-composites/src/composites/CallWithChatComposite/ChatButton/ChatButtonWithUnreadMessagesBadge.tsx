// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IButton, IStackStyles, Stack } from '@fluentui/react';
import { _formatString } from '@internal/acs-ui-common';
import { ControlBarButtonProps, useAccessibility } from '@internal/react-components';
import React, { useCallback, useMemo, useRef } from 'react';
import { CallWithChatCompositeIcon } from '../../common/icons';
import { ChatButton } from './ChatButton';
import { useCallWithChatCompositeStrings } from '../hooks/useCallWithChatCompositeStrings';
import { NotificationIcon } from './NotificationIcon';

/**
 * @private
 */
export interface ChatButtonWithUnreadMessagesBadgeProps extends ControlBarButtonProps {
  unreadChatMessagesCount: number;
  hideUnreadChatMessagesBadge?: boolean;
  newMessageLabel: string;
}

const filledIcon = <CallWithChatCompositeIcon iconName={'ControlBarChatButtonActive'} />;
const regularIcon = <CallWithChatCompositeIcon iconName={'ControlBarChatButtonInactive'} />;

/**
 * @private
 */
export const ChatButtonWithUnreadMessagesBadge = (props: ChatButtonWithUnreadMessagesBadgeProps): JSX.Element => {
  const { newMessageLabel, unreadChatMessagesCount, hideUnreadChatMessagesBadge } = props;

  const baseIcon = props.showLabel ? regularIcon : filledIcon;
  const callWithChatStrings = useCallWithChatCompositeStrings();
  const accessibility = useAccessibility();
  const chatButtonRef = useRef<IButton | null>(null);

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
        {unreadChatMessagesCount > 0 && !hideUnreadChatMessagesBadge && (
          <NotificationIcon chatMessagesCount={unreadChatMessagesCount} label={newMessageLabel} />
        )}
        {baseIcon}
      </Stack>
    );
  }, [unreadChatMessagesCount, newMessageLabel, baseIcon, hideUnreadChatMessagesBadge]);

  return (
    <ChatButton
      {...props}
      data-ui-id="call-with-chat-composite-chat-button"
      onRenderOffIcon={notificationOnIcon}
      onRenderOnIcon={onRenderOnIcon}
      strings={chatStrings}
      onClick={(event) => {
        accessibility.setComponentRef(chatButtonRef.current);
        props.onClick?.(event);
      }}
      componentRef={chatButtonRef}
    />
  );
};

const chatNotificationContainerStyles: IStackStyles = {
  root: {
    display: 'inline',
    position: 'relative'
  }
};
