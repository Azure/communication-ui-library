// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';

import { IIconProps, IMessageBarProps, MessageBar, MessageBarType, Stack } from '@fluentui/react';

import { CapabilitiesChangedReason, ParticipantCapabilityName, ParticipantRole } from '@azure/communication-calling';

import { useLocale } from '../../localization';

/**
 * @private
 */
export interface CapabilitiesChangeNotificationBarProps extends IMessageBarProps {
  capabilitiesChangedNotifications: CapabalityChangedNotification[];
  onDismissNotification: (notification: CapabalityChangedNotification) => void;
}

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

  /**
   * Reason capability was changed
   */
  changedReason?: CapabilitiesChangedReason;

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
        const iconProps = getCustomMessageBarIconProps(notification);
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

const getCapabilityChangedNotificationString = (
  notification: CapabalityChangedNotification,
  strings?: CapabilityChangedNotificationStrings
): string | undefined => {
  switch (notification.capabilityName) {
    case 'shareScreen':
      if (notification.isPresent && notification.changedReason === 'RoleChanged' && notification.role === 'Presenter') {
        return strings?.shareScreen?.grantedDueToRoleChangeToPresenter;
      }
      if (!notification.isPresent && notification.changedReason === 'RoleChanged' && notification.role === 'Attendee') {
        return strings?.shareScreen?.lostDueToRoleChangeToAttendee;
      }
      break;
    case 'viewAttendeeNames':
      if (
        !notification.isPresent &&
        notification.changedReason === 'MeetingOptionOrOrganizerPolicyChanged' &&
        notification.role === 'Attendee'
      ) {
        return strings?.hideAttendeeNames?.hideAttendeeNameAttendee;
      }
      if (
        !notification.isPresent &&
        notification.changedReason === 'MeetingOptionOrOrganizerPolicyChanged' &&
        notification.role === 'Presenter'
      ) {
        return strings?.hideAttendeeNames?.hideAttendeeNamePresenter;
      }
  }
  return undefined;
};

const getCustomMessageBarIconProps = (notification: CapabalityChangedNotification): IIconProps | undefined => {
  let iconName: string | undefined = undefined;
  switch (notification.capabilityName) {
    case 'turnVideoOn':
      if (notification.isPresent) {
        iconName = 'ControlButtonCameraOn';
      } else {
        iconName = 'ControlButtonCameraProhibited';
      }
      break;
    case 'unmuteMic':
      if (notification.isPresent) {
        iconName = 'ControlButtonMicOn';
      } else {
        iconName = 'ControlButtonMicProhibited';
      }
      break;
    default:
      return undefined;
  }
  return { iconName, styles: { root: { '> *': { height: '1rem', width: '1rem' } } } };
};

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

  /**
   * Strings for hidden attendee names capability
   */
  hideAttendeeNames?: {
    /**
     * Notification message shown to the user when capability to view attendee names is lost due to a meeting option change for Attendee
     */
    hideAttendeeNameAttendee?: string;
    /**
     * Notification message shown to the user when capability to view attendee names is lost due to a meeting option change for Presenter
     */
    hideAttendeeNamePresenter?: string;
  };
}
