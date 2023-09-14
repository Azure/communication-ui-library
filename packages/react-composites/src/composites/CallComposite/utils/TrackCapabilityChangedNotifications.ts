// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* @conditional-compile-remove(capabilities) */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
/* @conditional-compile-remove(capabilities) */
import {
  CapabilitiesChangeInfo,
  CapabilitiesChangedReason,
  ParticipantCapabilityName,
  ParticipantRole
} from '@azure/communication-calling';
/* @conditional-compile-remove(capabilities) */
import {
  CapabalityChangedNotification,
  CapabilitiesChangeNotificationBarProps
} from '../components/CapabilitiesChangedNotificationBar';
/* @conditional-compile-remove(capabilities) */
import { TrackedCapabilityChangedNotifications } from '../types/CapabilityChangedNotificationTracking';

/* @conditional-compile-remove(capabilities) */
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

  // Keep track of capabilities changed info to ignore
  const capabilitiesChangedInfoToIgnore = useRef<
    Partial<Record<ParticipantCapabilityName, { isPresent: boolean; reason: CapabilitiesChangedReason }>>
  >({ shareScreen: { isPresent: true, reason: 'RoleChanged' } });

  useEffect(() => {
    activeNotifications.current = updateLatestCapabilityChangedNotificationMap(
      capabilitiesChangedAndRoleInfo,
      activeNotifications.current,
      capabilitiesChangedInfoToIgnore.current
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

/* @conditional-compile-remove(capabilities) */
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

/* @conditional-compile-remove(capabilities) */
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

/* @conditional-compile-remove(capabilities) */
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

/* @conditional-compile-remove(capabilities) */
interface CapabilitiesChangedInfoAndRole {
  capabilitiesChangeInfo?: CapabilitiesChangeInfo;
  participantRole?: ParticipantRole;
}

/* @conditional-compile-remove(capabilities) */
type LatestCapabilityChangedNotificationRecord = Partial<
  Record<ParticipantCapabilityName, CapabalityChangedNotification>
>;

/* @conditional-compile-remove(capabilities) */
const updateLatestCapabilityChangedNotificationMap = (
  capabilitiesChangedInfoAndRole: CapabilitiesChangedInfoAndRole,
  activeNotifications: LatestCapabilityChangedNotificationRecord,
  capabilitiesChangedInfoToIgnore: Partial<
    Record<ParticipantCapabilityName, { isPresent: boolean; reason: CapabilitiesChangedReason }>
  >
): LatestCapabilityChangedNotificationRecord => {
  if (!capabilitiesChangedInfoAndRole.capabilitiesChangeInfo) {
    return activeNotifications;
  }

  for (const [capabilityName, newCapabilityValue] of Object.entries(
    capabilitiesChangedInfoAndRole.capabilitiesChangeInfo.newValue
  )) {
    if (
      capabilitiesChangedInfoToIgnore[capabilityName] &&
      capabilitiesChangedInfoAndRole.capabilitiesChangeInfo.reason ===
        capabilitiesChangedInfoToIgnore[capabilityName].reason
    ) {
      if (newCapabilityValue.isPresent === capabilitiesChangedInfoToIgnore[capabilityName].isPresent) {
        continue;
      } else {
        capabilitiesChangedInfoToIgnore[capabilityName].isPresent = newCapabilityValue.isPresent;
      }
    }
    const newCapabilityChangeNotification: CapabalityChangedNotification = {
      capabilityName: capabilityName as ParticipantCapabilityName,
      isPresent: newCapabilityValue.isPresent,
      changedReason: capabilitiesChangedInfoAndRole.capabilitiesChangeInfo.reason,
      role: capabilitiesChangedInfoAndRole.participantRole,
      timestamp: new Date(Date.now())
    };
    activeNotifications[capabilityName] = newCapabilityChangeNotification;
  }
  return activeNotifications;
};
