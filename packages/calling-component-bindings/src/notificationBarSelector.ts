// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CallingBaseSelectorProps, getLatestNotifications } from './baseSelectors';
/* @conditional-compile-remove(teams-meeting-conference) */
import { CallClientState, CallNotifications } from '@internal/calling-stateful-client';
import { createSelector } from 'reselect';

/**
 * @public
 */
export type NotificationBarSelector = (
  state: CallClientState,
  props: CallingBaseSelectorProps
) => {
  activeNotifications: {
    target: 'assignedBreakoutRoomUpdated';
    messageKey: string;
    timestamp: Date;
    callId?: string;
  }[];
};

/**
 * @public
 */
export const notificationsBarSelector: NotificationBarSelector = createSelector(
  [getLatestNotifications],
  (
    latestNotifications: CallNotifications
  ): {
    activeNotifications: {
      target: 'assignedBreakoutRoomUpdated';
      messageKey: string;
      timestamp: Date;
      callId?: string;
    }[];
  } => {
    console.log('latestNotifications: ', latestNotifications);
    return { activeNotifications: Object.values(latestNotifications) };
  }
);
