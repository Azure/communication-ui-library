// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BreakoutRoomsNotificationBarProps } from '../components/BreakoutRoomsNotificationBar';
import { BreakoutRoom } from '@azure/communication-calling';
import { ActiveNotification, NotificationsStrings } from '@internal/react-components';

/**
 * Create a record for when the notification was most recently dismissed for tracking dismissed notifications.
 *
 * @private
 */
export const useTrackedBreakoutRoomsNotifications = (props: {
  notifications: ActiveNotification[];
  assignedBreakoutRoom?: BreakoutRoom;
}): BreakoutRoomsNotificationBarProps => {
  const { notifications } = props;

  const [trackedCapabilityChangedNotifications, setTrackedCapabilityChangedNotifications] =
    useState<TrackedBreakoutRoomsNotifications>({});

  // Initialize a share screen capability changed notification with 'RoleChanged' reason so that the initial
  // share screen capability changed info from the Calling SDK when joining Teams interop will be ignored because
  // being able to share screen is assumed by default. This is inline with what Teams is doing.
  const activeNotifications = useRef<LatestBreakoutRoomsNotificationRecord>({});

  useEffect(() => {
    activeNotifications.current = convertActiveNotificationsToRecord(notifications, activeNotifications.current);
    setTrackedCapabilityChangedNotifications((prev) =>
      updateTrackedBreakoutRoomsNotificationsWithActiveNotifications(prev, Object.values(activeNotifications.current))
    );
  }, [notifications]);

  const onDismissBreakoutRoomsNotification = useCallback((notification: ActiveNotification) => {
    setTrackedCapabilityChangedNotifications((prev) =>
      trackCapabilityChangedNotificationAsDismissed(notification.type, prev)
    );
  }, []);

  const latestBreakoutRoomsNotifications = useMemo(
    () =>
      addActions(
        filterLatestBreakoutRoomsNotifications(
          Object.values(activeNotifications.current),
          trackedCapabilityChangedNotifications
        ),
        onDismissBreakoutRoomsNotification
      ),
    [trackedCapabilityChangedNotifications, onDismissBreakoutRoomsNotification]
  );

  return {
    breakoutRoomsNotifications: latestBreakoutRoomsNotifications,
    onDismissNotification: onDismissBreakoutRoomsNotification
  };
};

const addActions = (
  notifications: ActiveNotification[],
  onDismissBreakoutRoomsNotification: (notification: ActiveNotification) => void
): ActiveNotification[] => {
  return notifications.map((notification) => {
    if (notification.type === 'assignedBreakoutRoomOpenedPromptJoin') {
      notification.onClickSecondaryButton = () => onDismissBreakoutRoomsNotification(notification);
    }
    return notification;
  });
};

/**
 * Take the set of active notifications, and filter to only those that are newer than previously dismissed notifications or have never been dismissed.
 *
 * @private
 */
export const filterLatestBreakoutRoomsNotifications = (
  activeNotifications: ActiveNotification[],
  trackedNotifications: TrackedBreakoutRoomsNotifications
): ActiveNotification[] => {
  const filteredNotifications = activeNotifications.filter((activeNotification) => {
    const trackedNotification = trackedNotifications[activeNotification.type];
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
  activeNotifications: ActiveNotification[]
): TrackedBreakoutRoomsNotifications => {
  const trackedNotifications: TrackedBreakoutRoomsNotifications = {};

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
export const trackCapabilityChangedNotificationAsDismissed = (
  notificationEvent: keyof NotificationsStrings,
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

type LatestBreakoutRoomsNotificationRecord = Partial<Record<keyof NotificationsStrings, ActiveNotification>>;

const convertActiveNotificationsToRecord = (
  breakoutRoomsNotifications: ActiveNotification[],
  activeNotifications: LatestBreakoutRoomsNotificationRecord
): LatestBreakoutRoomsNotificationRecord => {
  activeNotifications = {};
  for (const breakoutRoomsNotification of breakoutRoomsNotifications) {
    activeNotifications[breakoutRoomsNotification.type] = breakoutRoomsNotification;
  }

  return activeNotifications;
};

interface NotificationTrackingInfo {
  mostRecentlyActive: Date;
  lastDismissedAt?: Date;
}

type TrackedBreakoutRoomsNotifications = Partial<Record<keyof NotificationsStrings, NotificationTrackingInfo>>;
