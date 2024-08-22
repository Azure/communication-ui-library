// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ActiveErrorMessage, ErrorType } from '@internal/react-components';
import { TrackedNotifications } from '../types/ErrorTracking';

import { NotificationType, ActiveNotification } from '@internal/react-components';

/**
 * Take the set of active notifications, and filter to only those that are newer than previously dismissed notifications or have never been dismissed.
 *
 * @private
 */
export const filterLatestNotifications = (
  activeNotifications: ActiveErrorMessage[] | ActiveNotification[],
  trackedNotifications: TrackedNotifications
): ActiveErrorMessage[] | ActiveNotification[] => {
  const filteredNotifications = activeNotifications.filter((activeNotification) => {
    const trackedNotification = trackedNotifications[activeNotification.type];
    return (
      !trackedNotification ||
      !trackedNotification.lastDismissedAt ||
      trackedNotification.lastDismissedAt < trackedNotification.mostRecentlyActive
    );
  });
  return filteredNotifications as ActiveErrorMessage[] | ActiveNotification[];
};

/**
 * Maintain a record of the most recently active notification for each notification type.
 *
 * @private
 */
export const updateTrackedNotificationsWithActiveNotifications = (
  existingTrackedNotifications: TrackedNotifications,
  activeNotifications: ActiveErrorMessage[] | ActiveNotification[]
): TrackedNotifications => {
  const trackedNotifications: TrackedNotifications = {};

  // Only care about active notifications. If notifications are no longer active we do not track that they have been previously dismissed.
  for (const activeNotification of activeNotifications) {
    const existingTrackedNotification = existingTrackedNotifications[activeNotification.type];
    trackedNotifications[activeNotification.type] = {
      mostRecentlyActive:
        activeNotification.timestamp ?? existingTrackedNotification?.mostRecentlyActive ?? new Date(Date.now()),
      lastDismissedAt: existingTrackedNotification?.lastDismissedAt
    };
  }

  return trackedNotifications;
};

/**
 * Create a record for when the notification was most recently dismissed for tracking dismissed notifications.
 *
 * @private
 */
export const trackNotificationAsDismissed = (
  notificationType: ErrorType | NotificationType,
  trackedNotifications: TrackedNotifications
): TrackedNotifications => {
  const now = new Date(Date.now());
  const existingNotification = trackedNotifications[notificationType];

  return {
    ...trackedNotifications,
    [notificationType]: {
      ...(existingNotification || {}),
      lastDismissedAt: now
    }
  };
};
