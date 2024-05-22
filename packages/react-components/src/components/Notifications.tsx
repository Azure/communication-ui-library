// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useEffect, useRef, useState } from 'react';
import { IMessageBarProps, MessageBar, Stack } from '@fluentui/react';
import { useLocale } from '../localization';
import {
  DismissedError,
  dismissError,
  dropDismissalsForInactiveErrors,
  errorsToShow,
  messageBarIconProps,
  messageBarType
} from './utils';
import { NotificationBar, NotificationBarStrings } from './NotificationBar';

/**
 * Props for {@link Notifications}.
 * @public
 */
export interface NotificationsProps {
  /**
   * Strings shown on the UI on errors.
   */
  strings?: NotificationsStrings;

  /**
   * Currently active notifications.
   */
  activeNotifications: ActiveNotification[];
}

/**
 * All strings that may be shown on the UI in the {@link Notifications}.
 *
 * @public
 */
export interface NotificationsStrings {
  /**
   * Unable to reach Chat service.
   *
   * This can mean:
   *   - Incorrect Azure Communication Services endpoint was provided.
   *   - User's network connection is down.
   */
  unableToReachChatService: NotificationBarStrings;

  /**
   * User does not have access to the Chat service.
   * This usually means that either the Azure Communication Services endpiont or the token provided are incorrect.
   */
  accessDenied: NotificationBarStrings;

  /**
   * User is no longer on the thread.
   *
   * See also: {@link NotificationsStrings.sendMessageNotInChatThread} for a more specific error.
   */
  userNotInChatThread: NotificationBarStrings;

  /**
   * Sending message failed because user is no longer on the thread.
   */
  sendMessageNotInChatThread: NotificationBarStrings;

  /**
   * A generic message when sending message fails.
   * Prefer more specific error strings when possible.
   */
  sendMessageGeneric: NotificationBarStrings;

  /**
   * A generic message when starting video fails.
   */
  startVideoGeneric: NotificationBarStrings;

  /**
   * A generic message when starting video fails.
   */
  stopVideoGeneric: NotificationBarStrings;

  /**
   * A generic message when muting microphone fails.
   */
  muteGeneric: NotificationBarStrings;

  /**
   * A generic message when unmuting microphone fails.
   */
  unmuteGeneric: NotificationBarStrings;

  /**
   * A generic message when starting screenshare fails.
   */
  startScreenShareGeneric: NotificationBarStrings;

  /**
   * A generic message when stopping screenshare fails.
   */
  stopScreenShareGeneric: NotificationBarStrings;

  /**
   * Message shown when poor network quality is detected during a call.
   */
  callNetworkQualityLow: NotificationBarStrings;

  /**
   * Message shown on failure to detect audio output devices.
   */
  callNoSpeakerFound: NotificationBarStrings;

  /**
   * Message shown on failure to detect audio input devices.
   */
  callNoMicrophoneFound: NotificationBarStrings;

  /**
   * Message shown when microphone can be enumerated but access is blocked by the system.
   */
  callMicrophoneAccessDenied: NotificationBarStrings;

  /**
   * Message shown when microphone can be enumerated but access is blocked by the system, for safari browsers
   */
  callMicrophoneAccessDeniedSafari: NotificationBarStrings;

  /**
   * Message shown when microphone is muted by the system (not by local or remote participants)
   */
  callMicrophoneMutedBySystem: NotificationBarStrings;

  /**
   * Message shown when microphone is unmuted by the system (not by local or remote participants).
   * This typically occurs if the system recovers from an unexpected mute.
   */
  callMicrophoneUnmutedBySystem: NotificationBarStrings;

  /**
   * Mac OS specific message shown when microphone can be enumerated but access is
   * blocked by the system.
   */
  callMacOsMicrophoneAccessDenied: NotificationBarStrings;

  /**
   * Message shown when poor network causes local video stream to be frozen.
   */
  callLocalVideoFreeze: NotificationBarStrings;

  /**
   * Message shown when camera can be enumerated but access is blocked by the system.
   */
  callCameraAccessDenied: NotificationBarStrings;

  /**
   * Message shown when camera can be enumerated but access is blocked by the system, for safari browsers
   */
  callCameraAccessDeniedSafari: NotificationBarStrings;

  /**
   * Message shown when local video fails to start because camera is already in use by
   * another applciation.
   */
  callCameraAlreadyInUse: NotificationBarStrings;

  /**
   * Message shown when local video is stopped by the system (not by local or remote participants)
   */
  callVideoStoppedBySystem: NotificationBarStrings;

  /**
   * Message shown when local video was recovered by the system (not by the local participant)
   */
  callVideoRecoveredBySystem: NotificationBarStrings;

  /**
   * Mac OS specific message shown when system denies access to camera.
   */
  callMacOsCameraAccessDenied: NotificationBarStrings;

  /**
   * Mac OS specific message shown when system denies sharing local screen on a call.
   */
  callMacOsScreenShareAccessDenied: NotificationBarStrings;
  /**
   * Dimiss Notifications button aria label read by screen reader accessibility tools
   */
  dismissButtonAriaLabel?: NotificationBarStrings;

  /**
   * An error message when joining a call fails.
   */
  failedToJoinCallGeneric?: NotificationBarStrings;

  /**
   * An error message when joining a call fails specifically due to an invalid meeting link.
   */
  failedToJoinCallInvalidMeetingLink?: NotificationBarStrings;
  /**
   * Error string letting you know remote participants see a frozen stream for you.
   */
  cameraFrozenForRemoteParticipants?: NotificationBarStrings;

  /**
   * Unable to start effect
   */
  unableToStartVideoEffect?: NotificationBarStrings;
  /* @conditional-compile-remove(spotlight) */
  /**
   * An error message when starting spotlight while max participants are spotlighted
   */
  startSpotlightWhileMaxParticipantsAreSpotlighted: NotificationBarStrings;
}

/**
 * All notifications that can be shown in the {@link Notifications}.
 *
 * @public
 */
export type NotificationType = keyof NotificationsStrings;

/**
 * Active notifications to be shown via {@link Notifications}.
 *
 * @public
 */
export interface ActiveNotification {
  /**
   * Type of error that is active.
   */
  type: NotificationType;
  /**
   * Name of icon to be shown.
   */
  iconName: string;
  /**
   * Callback called when the button inside notification bar is clicked.
   */
  onClick?: () => void;
  /**
   * The latest timestamp when this notification was observed.
   *
   * When available, this is used to track notifications that have already been seen and dismissed
   * by the user.
   */
  timestamp?: Date;
}

/**
 * A component to show notifications on the UI.
 * All strings that can be shown are accepted as the {@link NotificationsProps.strings} so that they can be localized.
 * Active notifications are selected by {@link NotificationsProps.activeNotifications}.
 *
 * This component internally tracks dismissed by the user.
 *   * Notifications that have an associated timestamp: The notification is shown on the UI again if it occurs after being dismissed.
 *   * Notifications that do not have a timestamp: The notification is dismissed until it disappears from the props.
 *         If the notification recurs, it is shown in the UI.
 *
 *
 * @public
 */
export const Notifications = (props: NotificationsProps): JSX.Element => {
  const localeStrings = useLocale().strings.notifications;
  const strings = props.strings ?? localeStrings;

  return (
    <Stack data-ui-id="error-bar-stack">
      {props.activeNotifications.map((notification, index) => (
        <NotificationBar
          key={index}
          notificationBarStrings={strings[notification.type]}
          notificationBarIconName={notification.iconName}
          onClick={() => notification.onClick?.()}
        />
      ))}
    </Stack>
  );
};
