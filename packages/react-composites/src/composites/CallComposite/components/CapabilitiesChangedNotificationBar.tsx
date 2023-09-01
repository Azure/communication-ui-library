// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* @conditional-compile-remove(capabilities) */
import React from 'react';
/* @conditional-compile-remove(capabilities) */
import { IIconProps, IMessageBarProps, MessageBar, MessageBarType, Stack } from '@fluentui/react';
/* @conditional-compile-remove(capabilities) */
import { CapabilitiesChangedReason, ParticipantCapabilityName, ParticipantRole } from '@azure/communication-calling';
/* @conditional-compile-remove(capabilities) */
import { useLocale } from '../../localization';

/* @conditional-compile-remove(capabilities) */
/**
 * @private
 */
export interface CapabilitiesChangeNotificationBarProps extends IMessageBarProps {
  capabilitiesChangedNotifications: CapabalityChangedNotification[];
  onDismissNotification: (notification: CapabalityChangedNotification) => void;
}

/* @conditional-compile-remove(capabilities) */
/**
 * @private
 */
export interface CapabalityChangedNotification {
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
 * Notification bar for capabilities changed
 * @private
 */
export const CapabilitiesChangedNotificationBar = (props: CapabilitiesChangeNotificationBarProps): JSX.Element => {
  const locale = useLocale();

  return (
    <Stack data-ui-id="capabilities-changed-notification-bar-stack">
      {props.capabilitiesChangedNotifications.map((notification) => {
        const message = getCapabilityChangedNotificationString(
          notification,
          locale.strings.call.capabilityChangedNotification
        );
        if (!message) {
          return null;
        }
        const iconProps = getNotificationIconProps(notification);
        return (
          <MessageBar
            key={notification.capabilityName}
            styles={messageBarStyles}
            messageBarType={MessageBarType.warning}
            dismissIconProps={{ iconName: 'ErrorBarClear' }}
            onDismiss={() => props.onDismissNotification(notification)}
            messageBarIconProps={iconProps}
          >
            {message}
          </MessageBar>
        );
      })}
    </Stack>
  );
};

/* @conditional-compile-remove(capabilities) */
const getCapabilityChangedNotificationString = (
  notification: CapabalityChangedNotification,
  strings?: CapabilityChangedNotificationStrings
): string | undefined => {
  switch (notification.capabilityName) {
    case 'turnVideoOn':
      if (notification.changedReason === 'MeetingOptionOrOrganizerPolicyChanged') {
        return notification.isPresent
          ? strings?.turnVideoOn?.grantedDueToMeetingOption
          : strings?.turnVideoOn?.lostDueToMeetingOption;
      }
      break;
    case 'unmuteMic':
      if (notification.changedReason === 'MeetingOptionOrOrganizerPolicyChanged') {
        return notification.isPresent
          ? strings?.unmuteMic?.grantedDueToMeetingOption
          : strings?.unmuteMic?.lostDueToMeetingOption;
      }
      break;
    case 'shareScreen':
      if (notification.isPresent && notification.changedReason === 'RoleChanged' && notification.role === 'Presenter') {
        return strings?.shareScreen?.grantedDueToRoleChangeToPresenter;
      }
      if (!notification.isPresent && notification.changedReason === 'RoleChanged' && notification.role === 'Attendee') {
        return strings?.shareScreen?.lostDueToRoleChangeToAttendee;
      }
      break;
  }
  return undefined;
};

/* @conditional-compile-remove(capabilities) */
const getNotificationIconProps = (notification: CapabalityChangedNotification): IIconProps | undefined => {
  switch (notification.capabilityName) {
    case 'turnVideoOn':
      if (notification.isPresent) {
        return { iconName: 'ControlButtonCameraOn' };
      }
      return { iconName: 'ControlButtonCameraProhibited' };
    case 'unmuteMic':
      if (notification.isPresent) {
        return { iconName: 'ControlButtonMicOn' };
      }
      return { iconName: 'ControlButtonMicProhibited' };
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

/* @conditional-compile-remove(capabilities) */
/**
 * Strings for capability changed notification
 * @public
 */
export interface CapabilityChangedNotificationStrings {
  /**
   * Strings for 'turnVideoOn' capability
   */
  turnVideoOn?: {
    /**
     * Notification message shown to the user when capability to turn video on is lost due to a meeting option change
     */
    lostDueToMeetingOption?: string;
    /**
     * Notification message shown to the user when capability to turn video on is granted due to a meeting option change
     */
    grantedDueToMeetingOption?: string;
  };
  /**
   * Strings for 'unmuteMic' capability
   */
  unmuteMic?: {
    /**
     * Notification message shown to the user when capability to unmute mic is lost due to a meeting option change
     */
    lostDueToMeetingOption?: string;
    /**
     * Notification message shown to the user when capability to unmute mic is granted due to a meeting option change
     */
    grantedDueToMeetingOption?: string;
  };
  /**
   * Strings for 'shareScreen' capability
   */
  shareScreen?: {
    /**
     * Notification message shown to the user when capability to share screen is lost due to a role change to Attendeee
     */
    lostDueToRoleChangeToAttendee?: string;
    /**
     * Notification message shown to the user when capability to share screen is granted due to a role change to Presenter
     */
    grantedDueToRoleChangeToPresenter?: string;
  };
}
