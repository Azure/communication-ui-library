// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CallingBaseSelectorProps, getLatestErrors, getLatestNotifications } from './baseSelectors';
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
  [getLatestNotifications, getLatestErrors],
  (
    latestNotifications: CallNotifications,
    latestErrors: CallErrors
  ): {
    activeNotifications: ActiveNotification[];
  } => {
    const notifications = Object.values(latestErrors as CallNotifications).map((notification: CallNotification) => ({
      type: notification.target,
      timestamp: notification.timestamp
    }));
    console.log('notifications: ', notifications);
    return { activeNotifications: notifications };
  }
);
