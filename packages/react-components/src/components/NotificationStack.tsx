// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useEffect, useRef, useState } from 'react';
import { Stack } from '@fluentui/react';

import { useLocale } from '../localization';
import {
  DismissedNotification,
  NotificationIconProps,
  dismissNotification,
  dropDismissalsForInactiveNotifications,
  notificationsToShow
} from './utils';
import { Notification, NotificationStrings } from './Notification';

/**
 * Props for {@link NotificationStack}.
 * @public
 */
export interface NotificationStackProps {
  /**
   * Strings shown on the UI on errors.
   */
  strings?: NotificationStackStrings;

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
  onDismissNotification?: (dismissedNotification: ActiveNotification) => void;

  /**
   * If set, notifications with {@link ActiveNotification.timestamp} older than the time this component is mounted
   * are not shown.
   *
   * This is useful when using the {@link NotificationStack} with a stateful client that handles more than one call
   * or chat thread. Set this prop to ignore notifications from previous call or chat.
   *
   * @defaultValue false
   */
  ignorePremountNotifications?: boolean;
}

/**
 * All strings that may be shown on the UI in the {@link NotificationStack}.
 *
 * @public
 */
export interface NotificationStackStrings {
  /**
   * A generic message when starting video fails.
   */
  startVideoGeneric?: NotificationStrings;

  /**
   * A generic message when starting video fails.
   */
  stopVideoGeneric?: NotificationStrings;

  /**
   * A generic message when muting microphone fails.
   */
  muteGeneric?: NotificationStrings;

  /**
   * A generic message when unmuting microphone fails.
   */
  unmuteGeneric?: NotificationStrings;

  /**
   * A generic message when starting screenshare fails.
   */
  startScreenShareGeneric?: NotificationStrings;

  /**
   * A generic message when stopping screenshare fails.
   */
  stopScreenShareGeneric?: NotificationStrings;

  /**
   * Message shown when poor network quality is detected during a call.
   */
  callNetworkQualityLow?: NotificationStrings;
  /**
   * Message shown when poor network quality is detected during a teams meetings.
   * Contains actions to open phone info modal.
   */
  teamsMeetingCallNetworkQualityLow?: NotificationStrings;
  /**
   * Message shown on failure to detect audio output devices.
   */
  callNoSpeakerFound?: NotificationStrings;

  /**
   * Message shown on failure to detect audio input devices.
   */
  callNoMicrophoneFound?: NotificationStrings;

  /**
   * Message shown when microphone can be enumerated but access is blocked by the system.
   */
  callMicrophoneAccessDenied?: NotificationStrings;

  /**
   * Message shown when microphone can be enumerated but access is blocked by the system, for safari browsers
   */
  callMicrophoneAccessDeniedSafari?: NotificationStrings;

  /**
   * Message shown when microphone is muted by the system (not by local or remote participants)
   */
  callMicrophoneMutedBySystem?: NotificationStrings;

  /**
   * Message shown when microphone is unmuted by the system (not by local or remote participants).
   * This typically occurs if the system recovers from an unexpected mute.
   */
  callMicrophoneUnmutedBySystem?: NotificationStrings;

  /**
   * Mac OS specific message shown when microphone can be enumerated but access is
   * blocked by the system.
   */
  callMacOsMicrophoneAccessDenied?: NotificationStrings;

  /**
   * Message shown when poor network causes local video stream to be frozen.
   */
  callLocalVideoFreeze?: NotificationStrings;

  /**
   * Message shown when camera can be enumerated but access is blocked by the system.
   */
  callCameraAccessDenied?: NotificationStrings;

  /**
   * Message shown when camera can be enumerated but access is blocked by the system, for safari browsers
   */
  callCameraAccessDeniedSafari?: NotificationStrings;

  /**
   * Message shown when local video fails to start because camera is already in use by
   * another applciation.
   */
  callCameraAlreadyInUse?: NotificationStrings;

  /**
   * Message shown when local video is stopped by the system (not by local or remote participants)
   */
  callVideoStoppedBySystem?: NotificationStrings;

  /**
   * Message shown when local video was recovered by the system (not by the local participant)
   */
  callVideoRecoveredBySystem?: NotificationStrings;

  /**
   * Mac OS specific message shown when system denies access to camera.
   */
  callMacOsCameraAccessDenied?: NotificationStrings;

  /**
   * Mac OS specific message shown when system denies sharing local screen on a call.
   */
  callMacOsScreenShareAccessDenied?: NotificationStrings;

  /**
   * Dimiss Notifications button aria label read by screen reader accessibility tools
   */
  dismissButtonAriaLabel?: NotificationStrings;

  /**
   * An error message when joining a call fails.
   */
  failedToJoinCallGeneric?: NotificationStrings;

  /**
   * An error message when joining a call fails specifically due to an invalid meeting link.
   */
  failedToJoinCallInvalidMeetingLink?: NotificationStrings;
  /**
   * Error string letting you know remote participants see a frozen stream for you.
   */
  cameraFrozenForRemoteParticipants?: NotificationStrings;
  /**
   * Unable to start effect
   */
  unableToStartVideoEffect?: NotificationStrings;
  /**
   * An error message when starting spotlight while max participants are spotlighted
   */
  startSpotlightWhileMaxParticipantsAreSpotlighted?: NotificationStrings;
  /**
   * Muted by a remote participant message
   */
  mutedByRemoteParticipant?: NotificationStrings;
  /**
   * Speaking while muted message
   */
  speakingWhileMuted?: NotificationStrings;
  /**
   * Recording started message
   */
  recordingStarted?: NotificationStrings;
  /**
   * Transcription started message
   */
  transcriptionStarted?: NotificationStrings;
  /**
   * Recording stopped message
   */
  recordingStopped?: NotificationStrings;
  /**
   * Transcription stopped message
   */
  transcriptionStopped?: NotificationStrings;
  /**
   * Recording and transcription both started message
   */
  recordingAndTranscriptionStarted?: NotificationStrings;
  /**
   * Recording and transcription both stopped message
   */
  recordingAndTranscriptionStopped?: NotificationStrings;
  /**
   * Recording stopped but transcription still going on message
   */
  recordingStoppedStillTranscribing?: NotificationStrings;
  /**
   * Transcription stopped but recording still going on message
   */
  transcriptionStoppedStillRecording?: NotificationStrings;
  /* @conditional-compile-remove(breakout-rooms) */
  /**
   * Message shown in notification when the user will be automatically to their assigned breakout room that is opened
   */
  assignedBreakoutRoomOpened?: NotificationStrings;
  /* @conditional-compile-remove(breakout-rooms) */
  /**
   * Message shown in notification when the user is prompted to join their assigned breakout room that is opened
   */
  assignedBreakoutRoomOpenedPromptJoin?: NotificationStrings;
  /* @conditional-compile-remove(breakout-rooms) */
  /**
   * Message shown in notification when the user's assigned breakout room is changed
   */
  assignedBreakoutRoomChanged?: NotificationStrings;
  /* @conditional-compile-remove(breakout-rooms) */
  /**
   * Message shown in notification when the user's assigned breakout room is closed
   */
  assignedBreakoutRoomClosed?: NotificationStrings;
  /* @conditional-compile-remove(breakout-rooms) */
  /**
   * Message shown in notification when breakout room is joined
   */
  breakoutRoomJoined?: NotificationStrings;
  /* @conditional-compile-remove(breakout-rooms) */
  /**
   * Message shown in notification when breakout room is closing soon
   */
  breakoutRoomClosingSoon?: NotificationStrings;
  /**
   * Message shown in notification when capability turnVideoOn is present
   */
  capabilityTurnVideoOnPresent?: NotificationStrings;
  /**
   * Message shown in notification when capability turnVideoOn is absent
   */
  capabilityTurnVideoOnAbsent?: NotificationStrings;
  /**
   * Message shown in notification when capability unMuteMic is present
   */
  capabilityUnmuteMicPresent?: NotificationStrings;
  /**
   * Message shown in notification when capability unMuteMic is absent
   */
  capabilityUnmuteMicAbsent?: NotificationStrings;

  /* @conditional-compile-remove(together-mode) */
  togetherModeStarted?: NotificationStrings;

  /* @conditional-compile-remove(together-mode) */
  togetherModeEnded?: NotificationStrings;
}

/**
 * All notifications that can be shown in the {@link NotificationStack}.
 *
 * @public
 */
export type NotificationType = keyof NotificationStackStrings;

/**
 * Active notifications to be shown via {@link NotificationStack}.
 *
 * @public
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

  /**
   * Aria-live property for the notification.
   * @defaultValue polite
   */
  ariaLive?: 'assertive' | 'off' | 'polite';
}

/**
 * A component to show notifications on the UI.
 * All strings that can be shown are accepted as the {@link NotificationStackProps.strings} so that they can be localized.
 * Active notifications are selected by {@link NotificationStackProps.activeNotifications}.
 *
 * This component internally tracks dismissed by the user.
 *   * Notifications that have an associated timestamp: The notification is shown on the UI again if it occurs after being dismissed.
 *   * Notifications that do not have a timestamp: The notification is dismissed until it disappears from the props.
 *         If the notification recurs, it is shown in the UI.
 *
 *
 * @public
 */
export const NotificationStack = (props: NotificationStackProps): JSX.Element => {
  const localeStrings = useLocale().strings.notificationStack;
  const strings = props.strings ?? localeStrings;
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
          const onDismiss = (): void => {
            trackDismissedNotificationsInternally
              ? setDismissedNotifications(dismissNotification(dismissedNotifications, notification))
              : props.onDismissNotification?.(notification);
            notification.onDismiss && notification.onDismiss();
          };
          /* @conditional-compile-remove(breakout-rooms) */
          if (notification.type === 'assignedBreakoutRoomOpenedPromptJoin') {
            // If notification is of type assignedBreakoutRoomOpenedPromptJoin then set onClickSecondaryButton to
            // onDismiss if it is not defined
            notification.onClickSecondaryButton = notification.onClickSecondaryButton
              ? notification.onClickSecondaryButton
              : () => onDismiss();
          }
          return (
            <div key={index} style={{ marginBottom: `${index === maxNotificationsToShow - 1 ? 0 : '0.25rem'}` }}>
              <Notification
                notificationStrings={strings ? strings[notification.type] : undefined}
                notificationIconProps={NotificationIconProps(notification.type)}
                onClickPrimaryButton={() => notification.onClickPrimaryButton?.()}
                onClickSecondaryButton={() => notification.onClickSecondaryButton?.()}
                onDismiss={onDismiss}
                showStackedEffect={
                  index === maxNotificationsToShow - 1 && activeNotifications.length > maxNotificationsToShow
                }
                autoDismiss={notification.autoDismiss}
                ariaLive={notification.ariaLive}
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
