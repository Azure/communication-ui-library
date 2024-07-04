// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { BreakoutRoom } from '@azure/communication-calling';
import {
  CallingBaseSelectorProps,
  getAssignedBreakoutRoom,
  getLatestErrors,
  getLatestNotifications
} from './baseSelectors';
import { CallNotification } from '@internal/calling-stateful-client';
/* @conditional-compile-remove(teams-meeting-conference) */
import { CallClientState, CallErrors, CallNotifications } from '@internal/calling-stateful-client';
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
  [getLatestNotifications, getLatestErrors, getAssignedBreakoutRoom],
  (
    latestNotifications: CallNotifications,
    latestErrors: CallErrors,
    assignedBreakoutRoom: BreakoutRoom | undefined
  ): {
    activeNotifications: ActiveNotification[];
  } => {
    const notifications: ActiveNotification[] = Object.values(latestErrors as CallNotifications).map(
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
