// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useEffect, useRef, useState } from 'react';
import { Stack } from '@fluentui/react';
/* @conditional-compile-remove(notifications) */
import { useLocale } from '../localization';
import {
  DismissedNotification,
  NotificationIconProps,
  dismissNotification,
  dropDismissalsForInactiveNotifications,
  notificationsToShow
} from './utils';
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

  /**
   * Callback called when the dismiss button is triggered.
   * Use this to control notifications shown when they dismissed by the user.
   * Note this onDismiss function will affect all notifications in the same stack
   */
  onDismissNotification?: (dismissedNotifications: ActiveNotification) => void;

  /**
   * If set, notifications with {@link ActiveNotification.timestamp} older than the time this component is mounted
   * are not shown.
   *
   * This is useful when using the {@link Notifications} with a stateful client that handles more than one call
   * or chat thread. Set this prop to ignore notifications from previous call or chat.
   *
   * @defaultValue false
   */
  ignorePremountNotifications?: boolean;
}

/**
 * All strings that may be shown on the UI in the {@link Notifications}.
 *
 * @beta
 */
export interface NotificationsStrings {
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
  /**
   * An error message when starting spotlight while max participants are spotlighted
   */
  startSpotlightWhileMaxParticipantsAreSpotlighted: NotificationBarStrings;

  assignedBreakoutRoomOpened: NotificationBarStrings;
  assignedBreakoutRoomOpenedPromptJoin: NotificationBarStrings;
  assignedBreakoutRoomClosingSoon: NotificationBarStrings;
  assignedBreakoutRoomClosed: NotificationBarStrings;
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
   * Callback called when the primary button inside notification bar is clicked.
   */
  onClickPrimaryButton?: () => void;

  /**
   * Callback called when the primary button inside notification bar is clicked.
   */
  onClickSecondaryButton?: () => void;

  /**
   * Callback called when the notification is dismissed.
   */
  onDismiss?: () => void;

  /**
   * If set, notification will automatically dismiss after 5 seconds
   */
  autoDismiss?: boolean;

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
 * @beta
 */
export const Notifications = (props: NotificationsProps): JSX.Element => {
  /* @conditional-compile-remove(notifications) */
  const localeStrings = useLocale().strings.notifications;
  const strings = props.strings ?? /* @conditional-compile-remove(notifications) */ localeStrings;
  const maxNotificationsToShow = props.maxNotificationsToShow ?? 2;

  const trackDismissedNotificationsInternally = !props.onDismissNotification;

  // Timestamp for when this comopnent is first mounted.
  // Never updated through the lifecycle of this component.
  const mountTimestamp = useRef(new Date(Date.now()));

  const [dismissedNotifications, setDismissedNotifications] = useState<DismissedNotification[]>([]);

  // dropDismissalsForInactiveNotifications only returns a new object if `dismissedErrors` actually changes.
  // Without this behaviour, this `useEffect` block would cause a render loop.
  useEffect(() => {
    trackDismissedNotificationsInternally &&
      setDismissedNotifications(
        dropDismissalsForInactiveNotifications(props.activeNotifications, dismissedNotifications)
      );
  }, [props.activeNotifications, dismissedNotifications, trackDismissedNotificationsInternally]);

  const activeNotifications = notificationsToShow(
    props.activeNotifications,
    dismissedNotifications,
    props.ignorePremountNotifications ? mountTimestamp.current : undefined
  );

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
                onClickPrimaryButton={() => notification.onClickPrimaryButton?.()}
                onClickSecondaryButton={() => notification.onClickSecondaryButton?.()}
                onDismiss={() => {
                  trackDismissedNotificationsInternally
                    ? setDismissedNotifications(dismissNotification(dismissedNotifications, notification))
                    : props.onDismissNotification?.(notification);
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
