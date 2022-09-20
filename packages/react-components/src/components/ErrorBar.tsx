// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useEffect, useState } from 'react';
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

/**
 * Props for {@link ErrorBar}.
 *
 * In addition to the following, {@link ErrorBar} forwards all
 * {@link @fluentui/react#IMessageBarProps} to the underlying {@link @fluentui/react#MessageBar}.
 *
 * @public
 */
export interface ErrorBarProps extends IMessageBarProps {
  /**
   * Strings shown on the UI on errors.
   */
  strings?: ErrorBarStrings;

  /**
   * Currently active errors.
   */
  activeErrorMessages: ActiveErrorMessage[];
}

/**
 * All strings that may be shown on the UI in the {@link ErrorBar}.
 *
 * @public
 */
export interface ErrorBarStrings {
  /**
   * Unable to reach Chat service.
   *
   * This can mean:
   *   - Incorrect Azure Communication Services endpoint was provided.
   *   - User's network connection is down.
   */
  unableToReachChatService: string;

  /**
   * User does not have access to the Chat service.
   * This usually means that either the Azure Communication Services endpiont or the token provided are incorrect.
   */
  accessDenied: string;

  /**
   * User is no longer on the thread.
   *
   * See also: {@link ErrorBarStrings.sendMessageNotInChatThread} for a more specific error.
   */
  userNotInChatThread: string;

  /**
   * Sending message failed because user is no longer on the thread.
   */
  sendMessageNotInChatThread: string;

  /**
   * A generic message when sending message fails.
   * Prefer more specific error strings when possible.
   */
  sendMessageGeneric: string;

  /**
   * A generic message when starting video fails.
   */
  startVideoGeneric: string;

  /**
   * A generic message when starting video fails.
   */
  stopVideoGeneric: string;

  /**
   * A generic message when muting microphone fails.
   */
  muteGeneric: string;

  /**
   * A generic message when unmuting microphone fails.
   */
  unmuteGeneric: string;

  /**
   * A generic message when starting screenshare fails.
   */
  startScreenShareGeneric: string;

  /**
   * A generic message when stopping screenshare fails.
   */
  stopScreenShareGeneric: string;

  /**
   * Message shown when poor network quality is detected during a call.
   */
  callNetworkQualityLow: string;

  /**
   * Message shown on failure to detect audio output devices.
   */
  callNoSpeakerFound: string;

  /**
   * Message shown on failure to detect audio input devices.
   */
  callNoMicrophoneFound: string;

  /**
   * Message shown when microphone can be enumerated but access is blocked by the system.
   */
  callMicrophoneAccessDenied: string;

  /**
   * Message shown when microphone is muted by the system (not by local or remote participants)
   */
  callMicrophoneMutedBySystem: string;

  /**
   * Message shown when microphone is unmuted by the system (not by local or remote participants).
   * This typically occurs if the system recovers from an unexpected mute.
   */
  callMicrophoneUnmutedBySystem: string;

  /**
   * Mac OS specific message shown when microphone can be enumerated but access is
   * blocked by the system.
   */
  callMacOsMicrophoneAccessDenied: string;

  /**
   * Message shown when poor network causes local video stream to be frozen.
   */
  callLocalVideoFreeze: string;

  /**
   * Message shown when camera can be enumerated but access is blocked by the system.
   */
  callCameraAccessDenied: string;

  /**
   * Message shown when local video fails to start because camera is already in use by
   * another applciation.
   */
  callCameraAlreadyInUse: string;

  /**
   * Message shown when local video is stopped by the system (not by local or remote participants)
   */
  callVideoStoppedBySystem: string;

  /**
   * Message shown when local video was recovered by the system (not by the local participant)
   */
  callVideoRecoveredBySystem: string;

  /**
   * Mac OS specific message shown when system denies access to camera.
   */
  callMacOsCameraAccessDenied: string;

  /**
   * Mac OS specific message shown when system denies sharing local screen on a call.
   */
  callMacOsScreenShareAccessDenied: string;
  /**
   * Dimiss errorbar button aria label read by screen reader accessibility tools
   */
  dismissButtonAriaLabel?: string;

  /**
   * An error message when joining a call fails.
   */
  failedToJoinCallGeneric?: string;

  /**
   * An error message when joining a call fails specifically due to an invalid meeting link.
   */
  failedToJoinCallInvalidMeetingLink?: string;
}

/**
 * All errors that can be shown in the {@link ErrorBar}.
 *
 * @public
 */
export type ErrorType = keyof ErrorBarStrings;

/**
 * Active error messages to be shown via {@link ErrorBar}.
 *
 * @public
 */
export interface ActiveErrorMessage {
  /**
   * Type of error that is active.
   */
  type: ErrorType;
  /**
   * The latest timestamp when this error was observed.
   *
   * When available, this is used to track errors that have already been seen and dismissed
   * by the user.
   */
  timestamp?: Date;
}

/**
 * A component to show error messages on the UI.
 * All strings that can be shown are accepted as the {@link ErrorBarProps.strings} so that they can be localized.
 * Active errors are selected by {@link ErrorBarProps.activeErrorMessages}.
 *
 * This component internally tracks dismissed by the user.
 *   * Errors that have an associated timestamp: The error is shown on the UI again if it occurs after being dismissed.
 *   * Errors that do not have a timestamp: The error is dismissed until it disappears from the props.
 *         If the error recurs, it is shown in the UI.
 *
 * Uses {@link @fluentui/react#MessageBar} UI element.
 *
 * @public
 */
export const ErrorBar = (props: ErrorBarProps): JSX.Element => {
  const localeStrings = useLocale().strings.errorBar;
  const strings = props.strings ?? localeStrings;

  const [dismissedErrors, setDismissedErrors] = useState<DismissedError[]>([]);

  // dropDismissalsForInactiveErrors only returns a new object if `dismissedErrors` actually changes.
  // Without this behaviour, this `useEffect` block would cause a render loop.
  useEffect(
    () => setDismissedErrors(dropDismissalsForInactiveErrors(props.activeErrorMessages, dismissedErrors)),
    [props.activeErrorMessages, dismissedErrors]
  );

  const toShow = errorsToShow(props.activeErrorMessages, dismissedErrors);

  return (
    <Stack data-ui-id="error-bar-stack">
      {toShow.map((error) => (
        <MessageBar
          {...props}
          styles={{
            innerText: {
              paddingTop: messageBarType(error.type) === 5 ? '0.15rem' : '0.1rem', // to move the inner text of the message bar down to be centered
              lineHeight: 'none'
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
          key={error.type}
          messageBarType={messageBarType(error.type)}
          messageBarIconProps={messageBarIconProps(error.type)}
          onDismiss={() => setDismissedErrors(dismissError(dismissedErrors, error))}
          dismissButtonAriaLabel={strings.dismissButtonAriaLabel}
          dismissIconProps={{ iconName: 'ErrorBarClear' }}
        >
          {strings[error.type]}
        </MessageBar>
      ))}
    </Stack>
  );
};
