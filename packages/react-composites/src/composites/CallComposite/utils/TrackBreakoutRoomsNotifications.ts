// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BreakoutRoomsNotification,
  BreakoutRoomsNotificationBarProps,
  EventName
} from '../components/BreakoutRoomsNotificationBar';

/**
 * Create a record for when the notification was most recently dismissed for tracking dismissed notifications.
 *
 * @private
 */
export const useTrackedBreakoutRoomsNotifications = (props: {
  notifications: { target: 'assignedBreakoutRoomUpdated'; messageKey: string; timestamp: Date; callId?: string }[];
  callId: string;
}): BreakoutRoomsNotificationBarProps => {
  const { notifications, callId } = props;

  const [trackedCapabilityChangedNotifications, setTrackedCapabilityChangedNotifications] =
    useState<TrackedBreakoutRoomsNotifications>({});

  // Initialize a share screen capability changed notification with 'RoleChanged' reason so that the initial
  // share screen capability changed info from the Calling SDK when joining Teams interop will be ignored because
  // being able to share screen is assumed by default. This is inline with what Teams is doing.
  const activeNotifications = useRef<LatestBreakoutRoomsNotificationRecord>({});
  const currentCallId = useRef<string | undefined>(callId);

  useEffect(() => {
    if (currentCallId.current !== callId) {
      activeNotifications.current = {};
      currentCallId.current = callId;
    }
    activeNotifications.current = updateLatestBreakoutRoomsNotificationMap(
      notifications,
      activeNotifications.current,
      callId
    );
    setTrackedCapabilityChangedNotifications((prev) =>
      updateTrackedBreakoutRoomsNotificationsWithActiveNotifications(
        prev,
        Object.values(activeNotifications.current[callId] ?? {})
      )
    );
  }, [notifications, callId]);

  const onDismissBreakoutRoomsNotification = useCallback((notification: BreakoutRoomsNotification) => {
    setTrackedCapabilityChangedNotifications((prev) =>
      trackCapabilityChangedNotificationAsDismissed(notification.target, prev)
    );
  }, []);

  const latestBreakoutRoomsNotifications = useMemo(
    () =>
      filterLatestBreakoutRoomsNotifications(
        Object.values(activeNotifications.current[callId] ?? {}),
        trackedCapabilityChangedNotifications
      ),
    [trackedCapabilityChangedNotifications, callId]
  );

  return {
    breakoutRoomsNotifications: latestBreakoutRoomsNotifications,
    onDismissNotification: onDismissBreakoutRoomsNotification
  };
};

/**
 * Take the set of active notifications, and filter to only those that are newer than previously dismissed notifications or have never been dismissed.
 *
 * @private
 */
export const filterLatestBreakoutRoomsNotifications = (
  activeNotifications: BreakoutRoomsNotification[],
  trackedNotifications: TrackedBreakoutRoomsNotifications
): BreakoutRoomsNotification[] => {
  const filteredNotifications = activeNotifications.filter((activeNotification) => {
    const trackedNotification = trackedNotifications[activeNotification.target];
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
export const updateTrackedBreakoutRoomsNotificationsWithActiveNotifications = (
  existingTrackedNotifications: TrackedBreakoutRoomsNotifications,
  activeNotifications: BreakoutRoomsNotification[]
): TrackedBreakoutRoomsNotifications => {
  const trackedNotifications: TrackedBreakoutRoomsNotifications = {};

  // Only care about active notifications. If notifications are no longer active we do not track that they have been previously dismissed.
  for (const activeNotification of activeNotifications) {
    const existingTrackedNotification = existingTrackedNotifications[activeNotification.target];
    trackedNotifications[activeNotification.target] = {
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
  notificationEvent: EventName,
  trackedNotifications: TrackedBreakoutRoomsNotifications
): TrackedBreakoutRoomsNotifications => {
  const now = new Date(Date.now());
  const existingNotification = trackedNotifications[notificationEvent];

  if (!existingNotification) {
    return trackedNotifications;
  }
  return {
    ...trackedNotifications,
    [notificationEvent]: {
      ...(existingNotification || {}),
      lastDismissedAt: now
    }
  };
};

type LatestBreakoutRoomsNotificationRecord = Record<string, Partial<Record<EventName, BreakoutRoomsNotification>>>;

const updateLatestBreakoutRoomsNotificationMap = (
  breakoutRoomsNotifications: {
    target: 'assignedBreakoutRoomUpdated';
    messageKey: string;
    timestamp: Date;
    callId?: string;
  }[],
  activeNotificationsByCall: LatestBreakoutRoomsNotificationRecord,
  callId: string
): LatestBreakoutRoomsNotificationRecord => {
  for (const breakoutRoomsNotification of breakoutRoomsNotifications) {
    const _callId = breakoutRoomsNotification.callId ?? callId;
    const activeNotifications = activeNotificationsByCall[_callId] ?? {};
    activeNotifications[breakoutRoomsNotification.target] = breakoutRoomsNotification;
    activeNotificationsByCall[_callId] = activeNotifications;
  }

  return activeNotificationsByCall;
};

interface NotificationTrackingInfo {
  mostRecentlyActive: Date;
  lastDismissedAt?: Date;
}

type TrackedBreakoutRoomsNotifications = Partial<Record<EventName, NotificationTrackingInfo>>;
