// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';

import { IIconProps, IMessageBarProps, MessageBar, MessageBarType, PrimaryButton, Stack } from '@fluentui/react';

/**
 * @private
 */
export interface BreakoutRoomsNotificationBarProps extends IMessageBarProps {
  breakoutRoomsNotifications: BreakoutRoomsNotification[];
  onDismissNotification: (notification: BreakoutRoomsNotification) => void;
}

/**
 * @public
 */
export type NotificationTarget =
  | 'assignedBreakoutRoomOpened'
  | 'assignedBreakoutRoomOpenedPromptJoin'
  | 'assignedBreakoutRoomClosingSoon'
  | 'assignedBreakoutRoomClosed';

/**
 * @public
 */
export interface BreakoutRoomsNotification {
  /**
   * Name of event
   */
  target: NotificationTarget;

  messageKey: string;
  /**
   * The latest timestamp when this notification was observed.
   *
   * When available, this is used to track notifications that have already been seen and dismissed
   * by the user.
   */
  timestamp?: Date;

  actions?: {
    actionName: string;
    action: (notification?: BreakoutRoomsNotification) => Promise<void>;
    dismissAfter?: boolean;
  }[];
}

/**
 * Notification bar for capabilities changed
 * @private
 */
export const BreakoutRoomsNotificationBar = (props: BreakoutRoomsNotificationBarProps): JSX.Element => {
  console.log('BreakoutRoomsNotificationBar props: ', props.breakoutRoomsNotifications);
  return (
    <Stack data-ui-id="breakout-rooms-notification-bar-stack">
      {props.breakoutRoomsNotifications.map((notification) => {
        const message = notification.messageKey;
        if (!message) {
          return null;
        }
        const iconProps = getCustomMessageBarIconProps(notification);
        return (
          <MessageBar
            key={notification.target}
            styles={messageBarStyles}
            messageBarType={MessageBarType.warning}
            dismissIconProps={{ iconName: 'ErrorBarClear' }}
            onDismiss={() => props.onDismissNotification(notification)}
            messageBarIconProps={iconProps}
            actions={getActions(notification, props.onDismissNotification)}
          >
            {message}
          </MessageBar>
        );
      })}
    </Stack>
  );
};

const getCustomMessageBarIconProps = (notification: BreakoutRoomsNotification): IIconProps | undefined => {
  const iconName: string | undefined = undefined;
  switch (notification.target) {
    default:
      return { iconName, styles: { root: { '> *': { height: '1rem', width: '1rem' } } } };
  }
};

const getActions = (
  notification: BreakoutRoomsNotification,
  onDismissNotification: (notification: BreakoutRoomsNotification) => void
): JSX.Element | undefined => {
  console.log('getActions notification: ', notification);
  if (!notification.actions || notification.actions.length === 0) {
    return undefined;
  }
  return (
    <Stack horizontal>
      {notification.actions.map((action) => (
        <PrimaryButton
          key={action.actionName}
          text={action.actionName}
          onClick={() => {
            action.action();
            if (action.dismissAfter) {
              onDismissNotification(notification);
            }
          }}
        />
      ))}
    </Stack>
  );
};

const messageBarStyles = {
  innerText: {
    alignSelf: 'center'
  },
  icon: {
    height: 0
  },
  content: {
    lineHeight: 'inherit'
  },
  dismissal: {
    height: 0,
    paddingTop: '0.8rem'
  }
};
