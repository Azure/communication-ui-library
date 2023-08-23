// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ParticipantCapabilityName } from '@azure/communication-calling';
import { CapabalityChangedNotification } from '../components/CapabilitiesNotficationBar';
import { TrackedNotifications } from '../types/NotificationTracking';

/**
 * Take the set of active errors, and filter to only those that are newer than previously dismissed errors or have never been dismissed.
 *
 * @private
 */
export const filterLatestNotifications = (
  activeNotifications: Partial<Record<ParticipantCapabilityName, CapabalityChangedNotification>>,
  trackedNotifications: TrackedNotifications
): CapabalityChangedNotification[] => {
  const filteredNotifications = Object.values(activeNotifications).filter((activeNotification) => {
    const trackedNotification = trackedNotifications[activeNotification.capabilityName];
    return (
      !trackedNotification ||
      !trackedNotification.lastDismissedAt ||
      trackedNotification.lastDismissedAt < trackedNotification.mostRecentlyActive
    );
  });
  return filteredNotifications;
};

/**
 * Maintain a record of the most recently active error for each error type.
 *
 * @private
 */
export const updateTrackedNotificationsWithActiveNotifications = (
  existingTrackedNotifications: TrackedNotifications,
  activeNotifications: Partial<Record<ParticipantCapabilityName, CapabalityChangedNotification>>
): TrackedNotifications => {
  const trackedNotifications: TrackedNotifications = {};

  // Only care about active notifications. If notifications are no longer active we do not track that they have been previously dismissed.
  for (const activeNotification of Object.values(activeNotifications)) {
    const existingTrackedError = existingTrackedNotifications[activeNotification.capabilityName];
    trackedNotifications[activeNotification.capabilityName] = {
      mostRecentlyActive:
        activeNotification.timestamp ?? existingTrackedError?.mostRecentlyActive ?? new Date(Date.now()),
      lastDismissedAt: existingTrackedError?.lastDismissedAt
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
  capabilityName: ParticipantCapabilityName,
  trackedNotifications: TrackedNotifications
): TrackedNotifications => {
  const now = new Date(Date.now());
  const existingNotification = trackedNotifications[capabilityName];

  return {
    ...trackedNotifications,
    [capabilityName]: {
      ...(existingNotification || {}),
      lastDismissedAt: now
    }
  };
};
