// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { BreakoutRoom } from '@azure/communication-calling';
import { CallNotification } from '@internal/calling-stateful-client';
import { CallingBaseSelectorProps, getAssignedBreakoutRoom, getLatestNotifications } from './baseSelectors';
/* @conditional-compile-remove(teams-meeting-conference) */
import { CallClientState, CallNotifications } from '@internal/calling-stateful-client';
import { ActiveNotification } from '@internal/react-components';
import { createSelector } from 'reselect';

/**
 * @public
 */
export type NotificationBarSelector = (
  state: CallClientState,
  props: CallingBaseSelectorProps
) => {
  activeNotifications: ActiveNotification[];
};

/**
 * @public
 */
export const notificationsBarSelector: NotificationBarSelector = createSelector(
  [getLatestNotifications, getAssignedBreakoutRoom],
  (
    latestNotifications: CallNotifications,
    assignedBreakoutRoom: BreakoutRoom | undefined
  ): {
    activeNotifications: ActiveNotification[];
  } => {
    const notifications: ActiveNotification[] = Object.values(latestNotifications).map(
      (notification: CallNotification) => ({
        type: notification.target,
        timestamp: notification.timestamp
      })
    );
    notifications.forEach((notification) => {
      if (notification.type === 'assignedBreakoutRoomOpenedPromptJoin' && assignedBreakoutRoom) {
        notification.onClickPrimaryButton = () => assignedBreakoutRoom.join();
      }
    });
    console.log('notifications: ', notifications);
    return { activeNotifications: notifications };
  }
);
