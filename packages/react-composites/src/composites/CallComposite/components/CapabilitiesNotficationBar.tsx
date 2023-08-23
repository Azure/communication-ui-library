// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* @conditional-compile-remove(capabilities) */
import React from 'react';
/* @conditional-compile-remove(capabilities) */
import { IMessageBarProps, MessageBar, MessageBarType, Stack } from '@fluentui/react';
/* @conditional-compile-remove(capabilities) */
import { CapabilitiesChangedReason, ParticipantCapabilityName, ParticipantRole } from '@azure/communication-calling';
/* @conditional-compile-remove(capabilities) */
import { useLocale } from '../../localization';
/* @conditional-compile-remove(capabilities) */
import { CallCompositeStrings } from '../Strings';

/* @conditional-compile-remove(capabilities) */
/**
 * @beta
 */
export interface CapabilitiesChangeNotificationBarProps extends IMessageBarProps {
  capabilitiesChangeNotifications: CapabalityChangeNotification[];
  onDismissNotification: (notification: CapabalityChangeNotification) => void;
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
   * When available, this is used to track notifications that have already been seen and dismissed
   * by the user.
   */
  timestamp?: Date;
}

/* @conditional-compile-remove(capabilities) */
/**
 * Notification bar for capabilities changes
 * @beta
 */
export const CapabilitiesChangeNotificationBar = (props: CapabilitiesChangeNotificationBarProps): JSX.Element => {
  const locale = useLocale();

  return (
    <Stack data-ui-id="capabilities-changes-notification-bar-stack">
      {props.capabilitiesChangeNotifications.map((notification) => {
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
            onDismiss={() => props.onDismissNotification(notification)}
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
