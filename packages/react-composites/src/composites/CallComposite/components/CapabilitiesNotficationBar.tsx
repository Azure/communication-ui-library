// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* @conditional-compile-remove(capabilities) */
import {
  CapabilitiesChangeInfo,
  CapabilitiesChangedReason,
  ParticipantCapabilityName,
  ParticipantRole
} from '@azure/communication-calling';
/* @conditional-compile-remove(capabilities) */
import { IMessageBarProps, MessageBar, MessageBarType, Stack } from '@fluentui/react';
/* @conditional-compile-remove(capabilities) */
import React, { useEffect, useMemo, useRef, useState } from 'react';
/* @conditional-compile-remove(capabilities) */
import { useLocale } from '../../localization';
/* @conditional-compile-remove(capabilities) */
import { CallCompositeStrings } from '../Strings';

/* @conditional-compile-remove(capabilities) */
/**
 * @beta
 */
export interface CapabilitiesNotificationBarProps extends IMessageBarProps {
  capabilitiesChangeInfo?: CapabilitiesChangeInfo;
  participantRole?: ParticipantRole;
}

/* @conditional-compile-remove(capabilities) */
/**
 * @beta
 */
export interface CapabalityChangeNotification {
  /**
   * Name of capability
   */
  capabilityName: ParticipantCapabilityName;
  /**
   * Is capability now available
   */
  isPresent: boolean;
  /* @conditional-compile-remove(capabilities) */
  /**
   * Reason capability was changed
   */
  changedReason?: CapabilitiesChangedReason;
  /* @conditional-compile-remove(capabilities) */
  /**
   * Role of participant when capability changed
   */
  role?: ParticipantRole;
  /**
   * The latest timestamp when this notification was observed.
   *
   * When available, this is used to track errors that have already been seen and dismissed
   * by the user.
   */
  timestamp?: Date;
}

/* @conditional-compile-remove(capabilities) */
interface DismissedNotification {
  capabilityName: ParticipantCapabilityName;
  dismissedAt: Date;
  activeSince?: Date;
}

/* @conditional-compile-remove(capabilities) */
/**
 * Notification bar for capabilities changes
 * @beta
 */
export const CapabilitiesNotificationBar = (props: CapabilitiesNotificationBarProps): JSX.Element => {
  const locale = useLocale();

  // Timestamp for when this comopnent is first mounted.
  // Never updated through the lifecycle of this component.
  const mountTimestamp = useRef(new Date(Date.now()));

  const [dismissedNotifications, setDismissedNotifications] = useState<DismissedNotification[]>([]);

  const activeNotifications: CapabalityChangeNotification[] = useMemo(() => {
    const activeNotifications: CapabalityChangeNotification[] = [];
    if (props.capabilitiesChangeInfo?.newValue) {
      Object.entries(props.capabilitiesChangeInfo.newValue).forEach((changedCapability) => {
        if (changedCapability[0] === 'turnVideoOn') {
          activeNotifications.push({
            capabilityName: 'turnVideoOn',
            changedReason: props.capabilitiesChangeInfo?.reason,
            isPresent: changedCapability[1].isPresent,
            role: props.participantRole,
            timestamp: new Date(Date.now())
          });
        }
        if (changedCapability[0] === 'unmuteMic') {
          activeNotifications.push({
            capabilityName: 'unmuteMic',
            changedReason: props.capabilitiesChangeInfo?.reason,
            isPresent: changedCapability[1].isPresent,
            role: props.participantRole,
            timestamp: new Date(Date.now())
          });
        }
        if (changedCapability[0] === 'shareScreen') {
          activeNotifications.push({
            capabilityName: 'shareScreen',
            changedReason: props.capabilitiesChangeInfo?.reason,
            isPresent: changedCapability[1].isPresent,
            role: props.participantRole,
            timestamp: new Date(Date.now())
          });
        }
      });
    }
    return activeNotifications;
  }, [props.capabilitiesChangeInfo?.newValue, props.capabilitiesChangeInfo?.reason, props.participantRole]);

  useEffect(() => {
    setDismissedNotifications(dropDismissalsForInactiveNotifications(activeNotifications, dismissedNotifications));
  }, [activeNotifications, dismissedNotifications]);

  const toShow = activeNotificationsToShow(activeNotifications, dismissedNotifications, mountTimestamp.current);

  return (
    <Stack data-ui-id="capabilities-notification-bar-stack">
      {toShow.map((notification) => {
        const message = getNotificationMessage(notification, locale.strings.call);
        if (!message) {
          return null;
        }
        return (
          <MessageBar
            key={notification.capabilityName}
            styles={messageBarStyles}
            messageBarType={MessageBarType.warning}
            dismissIconProps={{ iconName: 'ErrorBarClear' }}
            onDismiss={() => {
              setDismissedNotifications(dismissNotification(dismissedNotifications, notification));
            }}
          >
            {message}
          </MessageBar>
        );
      })}
    </Stack>
  );
};

/* @conditional-compile-remove(capabilities) */
const getNotificationMessage = (
  notification: CapabalityChangeNotification,
  strings: CallCompositeStrings
): string | undefined => {
  switch (notification.capabilityName) {
    case 'turnVideoOn':
      if (notification.changedReason === 'MeetingOptionOrOrganizerPolicyChanged') {
        return notification.isPresent
          ? strings.capabilityTurnVideoOnGrantedDueToMeetingOption
          : strings.capabilityTurnVideoOnLostDueToMeetingOption;
      }
      break;
    case 'unmuteMic':
      if (notification.changedReason === 'MeetingOptionOrOrganizerPolicyChanged') {
        return notification.isPresent
          ? strings.capabilityUnmuteMicGrantedDueToMeetingOption
          : strings.capabilityUnmuteMicLostDueToMeetingOption;
      }
      break;
    case 'shareScreen':
      if (notification.isPresent && notification.changedReason === 'RoleChanged' && notification.role === 'Presenter') {
        return strings.capabilityShareScreenGrantedDueToRoleChangeToPresenter;
      }
      if (!notification.isPresent && notification.changedReason === 'RoleChanged' && notification.role === 'Attendee') {
        return strings.capabilityShareScreenLostDueToRoleChangeToAttendee;
      }
      break;
  }
  return undefined;
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
  for (const error of dismissedNotifications) {
    dismissed.set(error.capabilityName, error);
  }

  return activeNotifications.filter((error) => {
    if (mountTimestamp && error.timestamp && mountTimestamp > error.timestamp) {
      // Error has a timestamp and it is older than when the component was mounted.
      return false;
    }

    const dismissal = dismissed.get(error.capabilityName);
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

/* @conditional-compile-remove(capabilities) */
const dismissNotification = (
  dismissedNotification: DismissedNotification[],
  toDismiss: CapabalityChangeNotification
): DismissedNotification[] => {
  const now = new Date(Date.now());
  for (const error of dismissedNotification) {
    if (error.capabilityName === toDismiss.capabilityName) {
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
      capabilityName: toDismiss.capabilityName,
      // the error time could be sometimes later than the button click time, which cause the dismiss not working
      // so we set the dismiss time to the later one
      dismissedAt: now > toDismissTimestamp ? now : toDismissTimestamp,
      activeSince: toDismiss.timestamp
    }
  ];
};

/* @conditional-compile-remove(capabilities) */
const messageBarStyles = {
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
};
