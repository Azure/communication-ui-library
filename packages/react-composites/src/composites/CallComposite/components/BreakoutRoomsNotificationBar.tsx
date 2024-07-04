// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';

import { IMessageBarProps, Stack } from '@fluentui/react';
import { ActiveNotification, Notifications } from '@internal/react-components';

/**
 * @private
 */
export interface BreakoutRoomsNotificationBarProps extends IMessageBarProps {
  breakoutRoomsNotifications: ActiveNotification[];
  onDismissNotification: (notification: ActiveNotification) => void;
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
  type: NotificationTarget;

  messageKey: string;
  /**
   * The latest timestamp when this notification was observed.
   *
   * When available, this is used to track notifications that have already been seen and dismissed
   * by the user.
   */
  timestamp?: Date;

  onClickPrimaryButton?: () => void;

  onClickSecondaryButton?: () => void;
}

/**
 * Notification bar for capabilities changed
 * @private
 */
export const BreakoutRoomsNotificationBar = (props: BreakoutRoomsNotificationBarProps): JSX.Element => {
  return (
    <Stack
      data-ui-id="breakout-rooms-notification-bar-stack"
      styles={{
        root: {
          innerText: {
            alignSelf: 'center'
          }
        }
      }}
    >
      <Notifications
        activeNotifications={props.breakoutRoomsNotifications.map((notification) => ({
          type: notification.type,
          onClickPrimaryButton: notification.onClickPrimaryButton,
          onClickSecondaryButton: notification.onClickSecondaryButton
        }))}
      />
    </Stack>
  );
};
