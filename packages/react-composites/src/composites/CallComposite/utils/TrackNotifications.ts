// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CapabalityChangeNotification } from '../components/CapabilitiesNotficationBar';
import { CapabilitiesChangeInfo, ParticipantCapabilityName, ParticipantRole } from '@azure/communication-calling';

/* @conditional-compile-remove(capabilities) */
interface DismissedNotification {
  capabilityName: ParticipantCapabilityName;
  dismissedAt: Date;
  activeSince?: Date;
}

/* @conditional-compile-remove(capabilities) */
/**
 * @internal
 */
export interface UseNotificationTrackerArgs {
  capabilitiesChangeInfo?: CapabilitiesChangeInfo;
  participantRole?: ParticipantRole;
}

/* @conditional-compile-remove(capabilities) */
/**
 * @internal
 */
export interface UseNotificationTrackerResult {
  capabilitiesChangeNotifications: CapabalityChangeNotification[];
  onDismissCapabilityChangeNotification: (notification: CapabalityChangeNotification) => void;
}

/* @conditional-compile-remove(capabilities) */
/**
 * @internal
 */
export const useNotificationTracker = (args: UseNotificationTrackerArgs): UseNotificationTrackerResult => {
  // Timestamp for when this component is first mounted.
  // Never updated through the lifecycle of this component.
  const mountTimestamp = useRef(new Date(Date.now()));

  const [dismissedNotifications, setDismissedNotifications] = useState<DismissedNotification[]>([]);

  const activeNotifications: CapabalityChangeNotification[] = useMemo(() => {
    const activeNotifications: CapabalityChangeNotification[] = [];
    if (args.capabilitiesChangeInfo?.newValue) {
      Object.entries(args.capabilitiesChangeInfo.newValue).forEach((changedCapability) => {
        if (changedCapability[0] === 'turnVideoOn') {
          activeNotifications.push({
            capabilityName: 'turnVideoOn',
            changedReason: args.capabilitiesChangeInfo?.reason,
            isPresent: changedCapability[1].isPresent,
            role: args.participantRole,
            timestamp: new Date(Date.now())
          });
        }
        if (changedCapability[0] === 'unmuteMic') {
          activeNotifications.push({
            capabilityName: 'unmuteMic',
            changedReason: args.capabilitiesChangeInfo?.reason,
            isPresent: changedCapability[1].isPresent,
            role: args.participantRole,
            timestamp: new Date(Date.now())
          });
        }
        if (changedCapability[0] === 'shareScreen') {
          activeNotifications.push({
            capabilityName: 'shareScreen',
            changedReason: args.capabilitiesChangeInfo?.reason,
            isPresent: changedCapability[1].isPresent,
            role: args.participantRole,
            timestamp: new Date(Date.now())
          });
        }
      });
    }
    return activeNotifications;
  }, [args.capabilitiesChangeInfo?.newValue, args.capabilitiesChangeInfo?.reason, args.participantRole]);

  useEffect(() => {
    setDismissedNotifications(dropDismissalsForInactiveNotifications(activeNotifications, dismissedNotifications));
  }, [activeNotifications, dismissedNotifications]);

  const toShow = activeNotificationsToShow(activeNotifications, dismissedNotifications, mountTimestamp.current);

  const _dismissNotification = useCallback(
    (notification: CapabalityChangeNotification) => {
      setDismissedNotifications(dismissNotification(dismissedNotifications, notification));
    },
    [setDismissedNotifications, dismissedNotifications]
  );

  return { capabilitiesChangeNotifications: toShow, onDismissCapabilityChangeNotification: _dismissNotification };
};

/* @conditional-compile-remove(capabilities) */
const dropDismissalsForInactiveNotifications = (
  activeNotifications: CapabalityChangeNotification[],
  dismissedNotifications: DismissedNotification[]
): DismissedNotification[] => {
  const active = new Map();
  for (const message of activeNotifications) {
    active.set(message.capabilityName, message);
  }
  const shouldDeleteDismissal = (dismissed: DismissedNotification): boolean =>
    dismissed.activeSince === undefined && active.get(dismissed.capabilityName) === undefined;

  if (dismissedNotifications.some((dismissed) => shouldDeleteDismissal(dismissed))) {
    return dismissedNotifications.filter((dismissed) => !shouldDeleteDismissal(dismissed));
  }
  return dismissedNotifications;
};

/* @conditional-compile-remove(capabilities) */
const activeNotificationsToShow = (
  activeNotifications: CapabalityChangeNotification[],
  dismissedNotifications: DismissedNotification[],
  mountTimestamp?: Date
): CapabalityChangeNotification[] => {
  const dismissed: Map<ParticipantCapabilityName, DismissedNotification> = new Map();
  for (const notification of dismissedNotifications) {
    dismissed.set(notification.capabilityName, notification);
  }

  return activeNotifications.filter((notification) => {
    if (mountTimestamp && notification.timestamp && mountTimestamp > notification.timestamp) {
      // Notification has a timestamp and it is older than when the component was mounted.
      return false;
    }

    const dismissal = dismissed.get(notification.capabilityName);
    if (!dismissal) {
      // This notification was never dismissed.
      return true;
    }
    if (!notification.timestamp) {
      // No timestamp associated with the notification. In this case, the existence of a dismissal is enough to
      // suppress the notification.
      return false;
    }
    // Notification has an associated timestamp, so compare with last dismissal.
    return notification.timestamp > dismissal.dismissedAt;
  });
};

/* @conditional-compile-remove(capabilities) */
const dismissNotification = (
  dismissedNotifications: DismissedNotification[],
  toDismiss: CapabalityChangeNotification
): DismissedNotification[] => {
  const now = new Date(Date.now());
  for (const notification of dismissedNotifications) {
    if (notification.capabilityName === toDismiss.capabilityName) {
      // Bump the timestamp for latest dismissal of this notification to now.
      notification.dismissedAt = now;
      notification.activeSince = toDismiss.timestamp;
      return Array.from(dismissedNotifications);
    }
  }

  const toDismissTimestamp = toDismiss.timestamp ?? now;

  // Record that this notification was dismissed for the first time right now.
  return [
    ...dismissedNotifications,
    {
      capabilityName: toDismiss.capabilityName,
      // the notification time could be sometimes later than the button click time, which cause the dismiss not working
      // so we set the dismiss time to the later one
      dismissedAt: now > toDismissTimestamp ? now : toDismissTimestamp,
      activeSince: toDismiss.timestamp
    }
  ];
};
