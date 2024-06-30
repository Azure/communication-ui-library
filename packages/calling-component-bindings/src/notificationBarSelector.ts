// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CallingBaseSelectorProps, getLatestErrors, getLatestNotifications } from './baseSelectors';
/* @conditional-compile-remove(teams-meeting-conference) */
import { CallClientState, CallErrors, CallNotifications, NotificationTarget } from '@internal/calling-stateful-client';
import { createSelector } from 'reselect';

/**
 * @public
 */
export type NotificationBarSelector = (
  state: CallClientState,
  props: CallingBaseSelectorProps
) => {
  activeNotifications: {
    target: NotificationTarget;
    messageKey: string;
    timestamp: Date;
    callId?: string;
  }[];
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
    activeNotifications: {
      target: NotificationTarget;
      messageKey: string;
      timestamp: Date;
      callId?: string;
    }[];
  } => {
    const notifications = Object.values(latestErrors as CallNotifications);
    console.log('notifications: ', notifications);
    return { activeNotifications: notifications };
  }
);
