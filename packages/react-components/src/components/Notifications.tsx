// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useEffect, useState } from 'react';
import { Stack } from '@fluentui/react';
/* @conditional-compile-remove(notifications) */
import { useLocale } from '../localization';
import { NotificationIconProps } from './utils';
import { NotificationBar, NotificationBarStrings } from './NotificationBar';

/**
 * Props for {@link Notifications}.
 * @beta
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

  /**
   * Max notifications to show at a time.
   * @defaultValue 2
   */
  maxNotificationsToShow?: number;
}

/**
 * All strings that may be shown on the UI in the {@link Notifications}.
 *
 * @beta
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
 * @beta
 */
export type NotificationType = keyof NotificationsStrings;

/**
 * Active notifications to be shown via {@link Notifications}.
 *
 * @beta
 */
export interface ActiveNotification {
  /**
   * Type of error that is active.
   */
  type: NotificationType;
  /**
   * Callback called when the button inside notification bar is clicked.
   */
  onClick?: () => void;

  /**
   * Callback called when the notification is dismissed.
   */
  onDismiss?: () => void;

  /**
   * If set, notification will automatically dismiss after 5 seconds
   */
  autoDismiss?: boolean;
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
 * @beta
 */
export const Notifications = (props: NotificationsProps): JSX.Element => {
  /* @conditional-compile-remove(notifications) */
  const localeStrings = useLocale().strings.notifications;
  const strings = props.strings ?? /* @conditional-compile-remove(notifications) */ localeStrings;
  const maxNotificationsToShow = props.maxNotificationsToShow ?? 2;
  const [activeNotifications, setActiveNotifications] = useState<ActiveNotification[]>(props.activeNotifications);
  useEffect(() => {
    setActiveNotifications(props.activeNotifications);
  }, [props.activeNotifications]);

  return (
    <Stack
      data-ui-id="notifications-stack"
      style={{
        width: 'fit-content'
      }}
    >
      {activeNotifications.map((notification, index) => {
        if (index < maxNotificationsToShow) {
          return (
            <div key={index} style={{ marginBottom: `${index === maxNotificationsToShow - 1 ? 0 : '0.25rem'}` }}>
              <NotificationBar
                notificationBarStrings={strings ? strings[notification.type] : undefined}
                notificationBarIconProps={NotificationIconProps(notification.type)}
                onClick={() => notification.onClick?.()}
                onDismiss={() => {
                  activeNotifications.splice(index, 1);
                  setActiveNotifications([...activeNotifications]);
                  notification.onDismiss && notification.onDismiss();
                }}
                showStackedEffect={
                  index === maxNotificationsToShow - 1 && activeNotifications.length > maxNotificationsToShow
                }
                autoDismiss={notification.autoDismiss}
              />
            </div>
          );
        } else {
          return <></>;
        }
      })}
    </Stack>
  );
};
