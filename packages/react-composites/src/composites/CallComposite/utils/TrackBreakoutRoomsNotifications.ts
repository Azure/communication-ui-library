// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BreakoutRoomsNotification,
  BreakoutRoomsNotificationBarProps,
  EventName
} from '../components/BreakoutRoomsNotificationBar';
import { BreakoutRoom } from '@azure/communication-calling';
import { AzureCommunicationCallAdapter } from '../adapter/AzureCommunicationCallAdapter';

/**
 * Create a record for when the notification was most recently dismissed for tracking dismissed notifications.
 *
 * @private
 */
export const useTrackedBreakoutRoomsNotifications = (
  assignedBreakoutRoom?: BreakoutRoom,
  adapter?: AzureCommunicationCallAdapter
): BreakoutRoomsNotificationBarProps => {
  const [trackedCapabilityChangedNotifications, setTrackedCapabilityChangedNotifications] =
    useState<TrackedBreakoutRoomsNotifications>({});

  // Initialize a share screen capability changed notification with 'RoleChanged' reason so that the initial
  // share screen capability changed info from the Calling SDK when joining Teams interop will be ignored because
  // being able to share screen is assumed by default. This is inline with what Teams is doing.
  const activeNotifications = useRef<LatestBreakoutRoomsNotificationRecord>({});

  useEffect(() => {
    const breakoutRoomNotifications: Partial<Record<EventName, BreakoutRoomsNotification>> = {};
    if (assignedBreakoutRoom) {
      breakoutRoomNotifications['assignedBreakoutRoomUpdated'] = {
        eventName: 'assignedBreakoutRoomUpdated',
        breakoutRoom: assignedBreakoutRoom,
        actions:
          assignedBreakoutRoom.autoMoveParticipantToBreakoutRoom === false
            ? [
                {
                  actionName: 'Join room',
                  action: async (): Promise<void> => {
                    const newCall = await assignedBreakoutRoom.join();
                    adapter?.processNewCall(newCall);
                  },
                  dismissAfter: true
                }
              ]
            : undefined
      };
    }
    activeNotifications.current = updateLatestBreakoutRoomsNotificationMap(
      breakoutRoomNotifications,
      activeNotifications.current
    );
    setTrackedCapabilityChangedNotifications((prev) =>
      updateTrackedBreakoutRoomsNotificationsWithActiveNotifications(prev, Object.values(activeNotifications.current))
    );
  }, [assignedBreakoutRoom, adapter]);

  const onDismissBreakoutRoomsNotification = useCallback((notification: BreakoutRoomsNotification) => {
    setTrackedCapabilityChangedNotifications((prev) =>
      trackCapabilityChangedNotificationAsDismissed(notification.eventName, prev)
    );
  }, []);

  const latestBreakoutRoomsNotifications = useMemo(
    () =>
      filterLatestBreakoutRoomsNotifications(
        Object.values(activeNotifications.current),
        trackedCapabilityChangedNotifications
      ),
    [trackedCapabilityChangedNotifications]
  );

  console.log('activeNotifications.current: ', activeNotifications.current);

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
    const trackedNotification = trackedNotifications[activeNotification.eventName];
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

  console.log(
    'updateTrackedBreakoutRoomsNotificationsWithActiveNotifications activeNotifications: ',
    activeNotifications
  );

  // Only care about active notifications. If notifications are no longer active we do not track that they have been previously dismissed.
  for (const activeNotification of activeNotifications) {
    const existingTrackedNotification = existingTrackedNotifications[activeNotification.eventName];
    trackedNotifications[activeNotification.eventName] = {
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

type LatestBreakoutRoomsNotificationRecord = Partial<Record<EventName, BreakoutRoomsNotification>>;

const updateLatestBreakoutRoomsNotificationMap = (
  breakoutRoomsNotifications: Partial<Record<EventName, BreakoutRoomsNotification>>,
  activeNotifications: LatestBreakoutRoomsNotificationRecord
): LatestBreakoutRoomsNotificationRecord => {
  for (const [notificationEvent, breakoutRoomsNotification] of Object.entries(breakoutRoomsNotifications)) {
    const event = notificationEvent as EventName;
    if (event && activeNotifications[event]) {
      continue;
    }
    activeNotifications[event] = breakoutRoomsNotification;
  }

  return activeNotifications;
};

interface NotificationTrackingInfo {
  mostRecentlyActive: Date;
  lastDismissedAt?: Date;
}

type TrackedBreakoutRoomsNotifications = Partial<Record<EventName, NotificationTrackingInfo>>;
