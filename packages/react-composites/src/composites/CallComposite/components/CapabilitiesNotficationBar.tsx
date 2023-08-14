// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CapabilitiesChangeInfo, CapabilityResolutionReason } from '@azure/communication-calling';
import { IMessageBarProps, MessageBar, MessageBarType, Stack } from '@fluentui/react';
import React, { useEffect, useMemo, useRef, useState } from 'react';

/**
 * @beta
 */
export interface CapabilitiesNotificationBarProps extends IMessageBarProps {
  /**
   * Strings shown on the UI on errors.
   */
  strings?: CapabilitiesNotificationBarStrings;

  capabilitiesChangeInfo?: CapabilitiesChangeInfo;
  onDismissNotification?: () => void;
}

/**
 * @beta
 */
export interface ActiveNotification {
  /**
   * Type of error that is active.
   */
  type: CapabalitiesNotificationType;

  isPresent: boolean;

  reason: CapabilityResolutionReason;
  /**
   * The latest timestamp when this error was observed.
   *
   * When available, this is used to track errors that have already been seen and dismissed
   * by the user.
   */
  timestamp?: Date;
}

/**
 * @beta
 */
export interface CapabilitiesNotificationBarStrings {
  turnVideoOnOffCapabilityLost?: string;
}

type CapabalitiesNotificationType = 'turnVideoOn' | 'unmuteMic' | 'shareScreen';
interface DismissedNotification {
  type: CapabalitiesNotificationType;
  dismissedAt: Date;
  activeSince?: Date;
}

/**
 * Notification bar for capabilities
 * @beta
 */
export const CapabilitiesNotificationBar = (props: CapabilitiesNotificationBarProps): JSX.Element => {
  // Timestamp for when this comopnent is first mounted.
  // Never updated through the lifecycle of this component.
  const mountTimestamp = useRef(new Date(Date.now()));

  const [dismissedNotifications, setDismissedNotifications] = useState<DismissedNotification[]>([]);

  const activeNotifications: ActiveNotification[] = useMemo(() => {
    const activeNotifications: ActiveNotification[] = [];
    if (props.capabilitiesChangeInfo?.newValue) {
      Object.entries(props.capabilitiesChangeInfo.newValue).forEach((c) => {
        if (c[0] === 'turnVideoOn') {
          activeNotifications.push({ type: 'turnVideoOn', ...c[1], timestamp: new Date(Date.now()) });
        }
        if (c[0] === 'unmuteMic') {
          activeNotifications.push({ type: 'unmuteMic', ...c[1], timestamp: new Date(Date.now()) });
        }
        if (c[0] === 'shareScreen') {
          activeNotifications.push({ type: 'shareScreen', ...c[1], timestamp: new Date(Date.now()) });
        }
      });
    }
    return activeNotifications;
  }, [props.capabilitiesChangeInfo?.newValue]);

  useEffect(() => {
    setDismissedNotifications(dropDismissalsForInactiveNotifications(activeNotifications, dismissedNotifications));
  }, [activeNotifications, dismissedNotifications]);

  const toShow = activeNotificationsToShow(activeNotifications, dismissedNotifications, mountTimestamp.current);

  return (
    <Stack data-ui-id="capabilities-notification-bar-stack">
      {toShow.map((notification) => {
        return (
          <MessageBar
            key={notification.type}
            styles={{
              innerText: {
                alignSelf: 'center'
              },
              icon: {
                height: 0
              },
              content: {
                lineHeight: 'inherit'
              },
              dismissal: {
                height: 0,
                paddingTop: '0.8rem'
              }
            }}
            messageBarType={MessageBarType.warning}
            dismissIconProps={{ iconName: 'ErrorBarClear' }}
            onDismiss={() => {
              setDismissedNotifications(dismissNotification(dismissedNotifications, notification));
            }}
          >
            {getNotificationMessage(notification.type, notification.isPresent)}
          </MessageBar>
        );
      })}
    </Stack>
  );
};

const getNotificationMessage = (type: CapabalitiesNotificationType, isPresent: boolean): string => {
  switch (type) {
    case 'turnVideoOn':
      return isPresent ? 'Your camera has been enabled' : 'Your camera has been disabled';
    case 'unmuteMic':
      return isPresent ? 'Your mic has been enabled' : 'Your mic has been disabled';
    case 'shareScreen':
      return isPresent ? 'Your screen share has been enabled' : 'Your screen share has been disabled';
  }
};

const dropDismissalsForInactiveNotifications = (
  activeNotifications: ActiveNotification[],
  dismissedNotifications: DismissedNotification[]
): DismissedNotification[] => {
  const active = new Map();
  for (const message of activeNotifications) {
    active.set(message.type, message);
  }
  const shouldDeleteDismissal = (dismissed: DismissedNotification): boolean =>
    dismissed.activeSince === undefined && active.get(dismissed.type) === undefined;

  if (dismissedNotifications.some((dismissed) => shouldDeleteDismissal(dismissed))) {
    return dismissedNotifications.filter((dismissed) => !shouldDeleteDismissal(dismissed));
  }
  return dismissedNotifications;
};

const activeNotificationsToShow = (
  activeNotifications: ActiveNotification[],
  dismissedNotifications: DismissedNotification[],
  mountTimestamp?: Date
): ActiveNotification[] => {
  const dismissed: Map<CapabalitiesNotificationType, DismissedNotification> = new Map();
  for (const error of dismissedNotifications) {
    dismissed.set(error.type, error);
  }

  return activeNotifications.filter((error) => {
    if (mountTimestamp && error.timestamp && mountTimestamp > error.timestamp) {
      // Error has a timestamp and it is older than when the component was mounted.
      return false;
    }

    const dismissal = dismissed.get(error.type);
    if (!dismissal) {
      // This error was never dismissed.
      return true;
    }
    if (!error.timestamp) {
      // No timestamp associated with the error. In this case, the existence of a dismissal is enough to suppress the error.
      return false;
    }
    // Error has an associated timestamp, so compare with last dismissal.
    return error.timestamp > dismissal.dismissedAt;
  });
};

const dismissNotification = (
  dismissedNotification: DismissedNotification[],
  toDismiss: ActiveNotification
): DismissedNotification[] => {
  const now = new Date(Date.now());
  for (const error of dismissedNotification) {
    if (error.type === toDismiss.type) {
      // Bump the timestamp for latest dismissal of this error to now.
      error.dismissedAt = now;
      error.activeSince = toDismiss.timestamp;
      return Array.from(dismissedNotification);
    }
  }

  const toDismissTimestamp = toDismiss.timestamp ?? now;

  // Record that this error was dismissed for the first time right now.
  return [
    ...dismissedNotification,
    {
      type: toDismiss.type,
      // the error time could be sometimes later than the button click time, which cause the dismiss not working
      // so we set the dismiss time to the later one
      dismissedAt: now > toDismissTimestamp ? now : toDismissTimestamp,
      activeSince: toDismiss.timestamp
    }
  ];
};
