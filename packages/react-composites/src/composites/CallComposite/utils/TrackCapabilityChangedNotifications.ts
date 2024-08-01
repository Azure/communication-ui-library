// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { CapabilitiesChangeInfo, ParticipantCapabilityName, ParticipantRole } from '@azure/communication-calling';

import {
  CapabalityChangedNotification,
  CapabilitiesChangeNotificationBarProps
} from '../components/CapabilitiesChangedNotificationBar';

import { TrackedCapabilityChangedNotifications } from '../types/CapabilityChangedNotificationTracking';

/**
 * Create a record for when the notification was most recently dismissed for tracking dismissed notifications.
 *
 * @private
 */
export const useTrackedCapabilityChangedNotifications = (
  capabilitiesChangedAndRoleInfo: CapabilitiesChangedInfoAndRole
): CapabilitiesChangeNotificationBarProps => {
  const [trackedCapabilityChangedNotifications, setTrackedCapabilityChangedNotifications] =
    useState<TrackedCapabilityChangedNotifications>({});

  const activeNotifications = useRef<LatestCapabilityChangedNotificationRecord>({});

  useEffect(() => {
    activeNotifications.current = updateLatestCapabilityChangedNotificationMap(
      capabilitiesChangedAndRoleInfo,
      activeNotifications.current
    );
    setTrackedCapabilityChangedNotifications((prev) =>
      updateTrackedCapabilityChangedNotificationsWithActiveNotifications(
        prev,
        Object.values(activeNotifications.current)
      )
    );
  }, [capabilitiesChangedAndRoleInfo]);

  const onDismissCapabilityChangedNotification = useCallback((notification: CapabalityChangedNotification) => {
    setTrackedCapabilityChangedNotifications((prev) =>
      trackCapabilityChangedNotificationAsDismissed(notification.capabilityName, prev)
    );
  }, []);

  const latestCapabilityChangedNotifications = useMemo(
    () =>
      filterLatestCapabilityChangedNotifications(
        Object.values(activeNotifications.current),
        trackedCapabilityChangedNotifications
      ),
    [trackedCapabilityChangedNotifications]
  );

  return {
    capabilitiesChangedNotifications: latestCapabilityChangedNotifications,
    onDismissNotification: onDismissCapabilityChangedNotification
  };
};

/**
 * Take the set of active notifications, and filter to only those that are newer than previously dismissed notifications or have never been dismissed.
 *
 * @private
 */
export const filterLatestCapabilityChangedNotifications = (
  activeNotifications: CapabalityChangedNotification[],
  trackedNotifications: TrackedCapabilityChangedNotifications
): CapabalityChangedNotification[] => {
  const filteredNotifications = activeNotifications.filter((activeNotification) => {
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
 * Maintain a record of the most recently active notification for each capability name.
 *
 * @private
 */
export const updateTrackedCapabilityChangedNotificationsWithActiveNotifications = (
  existingTrackedNotifications: TrackedCapabilityChangedNotifications,
  activeNotifications: CapabalityChangedNotification[]
): TrackedCapabilityChangedNotifications => {
  const trackedNotifications: TrackedCapabilityChangedNotifications = {};

  // Only care about active notifications. If notifications are no longer active we do not track that they have been previously dismissed.
  for (const activeNotification of activeNotifications) {
    const existingTrackedNotification = existingTrackedNotifications[activeNotification.capabilityName];
    trackedNotifications[activeNotification.capabilityName] = {
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
export const trackCapabilityChangedNotificationAsDismissed = (
  capabilityName: ParticipantCapabilityName,
  trackedNotifications: TrackedCapabilityChangedNotifications
): TrackedCapabilityChangedNotifications => {
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

interface CapabilitiesChangedInfoAndRole {
  capabilitiesChangeInfo?: CapabilitiesChangeInfo;
  participantRole?: ParticipantRole;
}

type LatestCapabilityChangedNotificationRecord = Partial<
  Record<ParticipantCapabilityName, CapabalityChangedNotification>
>;

const updateLatestCapabilityChangedNotificationMap = (
  capabilitiesChangedInfoAndRole: CapabilitiesChangedInfoAndRole,
  activeNotifications: LatestCapabilityChangedNotificationRecord
): LatestCapabilityChangedNotificationRecord => {
  if (!capabilitiesChangedInfoAndRole.capabilitiesChangeInfo) {
    return activeNotifications;
  }

  for (const [capabilityKey, newCapabilityValue] of Object.entries(
    capabilitiesChangedInfoAndRole.capabilitiesChangeInfo.newValue
  )) {
    // Cast is safe because we are iterating over the enum keys on the object.entries where
    // newCapabilityValue typing is correctly returned. Object.entries limitations
    // always returns string for the key
    const capabilityName = capabilityKey as ParticipantCapabilityName;
    // If the active notification for a capability has the same `isPresent` value and the same reason as the new
    // capability value from the SDK then we will not create a new notification to avoid redundancy
    if (
      activeNotifications[capabilityName] &&
      newCapabilityValue.isPresent === activeNotifications[capabilityName]?.isPresent &&
      capabilitiesChangedInfoAndRole.capabilitiesChangeInfo.reason ===
        activeNotifications[capabilityName]?.changedReason
    ) {
      continue;
    }

    // All initial values of capabilities are not present with reason 'FeatureNotSupported'. So we should not show a
    // notification for them when they initially become present at the start of the call
    const oldCapabilityValue = capabilitiesChangedInfoAndRole.capabilitiesChangeInfo.oldValue[capabilityName];
    if (
      newCapabilityValue.isPresent === true &&
      oldCapabilityValue?.isPresent === false &&
      oldCapabilityValue?.reason === 'FeatureNotSupported' &&
      capabilitiesChangedInfoAndRole.capabilitiesChangeInfo.reason === 'MeetingOptionOrOrganizerPolicyChanged'
    ) {
      continue;
    }

    // Do not show the first time the screenshare capability is present when the user's role is resolved to mirror
    // Teams behaviour
    if (
      capabilityName === 'shareScreen' &&
      activeNotifications['shareScreen'] === undefined &&
      newCapabilityValue.isPresent === true &&
      oldCapabilityValue?.isPresent === false &&
      capabilitiesChangedInfoAndRole.capabilitiesChangeInfo.reason === 'RoleChanged'
    ) {
      continue;
    }

    const newCapabilityChangeNotification: CapabalityChangedNotification = {
      capabilityName: capabilityName,
      isPresent: newCapabilityValue.isPresent,
      changedReason: capabilitiesChangedInfoAndRole.capabilitiesChangeInfo.reason,
      role: capabilitiesChangedInfoAndRole.participantRole,
      timestamp: new Date(Date.now())
    };
    activeNotifications[capabilityName] = newCapabilityChangeNotification;
  }
  return activeNotifications;
};
