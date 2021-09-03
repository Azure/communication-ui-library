// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { IMessageBarProps, MessageBar, MessageBarType, Stack } from '@fluentui/react';
import { useLocale } from '../localization';

/**
 * {@link ErrorBar} properties.
 *
 * In addition to the following, {@link ErrorBar} forwards all
 * {@link @fluentui/react#IMessageBarProps} to the underlying {@link @fluentui/react#MessageBar}.
 */
export interface ErrorBarProps extends IMessageBarProps {
  /**
   * Strings shown on the UI on errors.
   */
  strings?: ErrorBarStrings;

  /**
   * Currently active errors.
   */
  activeErrors: ActiveError[];

  /**
   * Callback trigerred when the {@link MessageBar} for an active error is dismissed.
   */
  onDismissErrors: (errorTypes: ErrorType[]) => void;
}

/**
 * All strings that may be shown on the UI in the {@link ErrorBar}.
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
   * See also: {@link ErrorBarStrings.sendMessageNotInThisThread} for a more specific error.
   */
  userNotInThisThread: string;

  /**
   * Sending message failed because user is no longer on the thread.
   */
  sendMessageNotInThisThread: string;

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
}

/**
 * All errors that can be shown in the {@link ErrorBar}.
 */
export type ErrorType = keyof ErrorBarStrings;

/**
 * Active error to be shown via {@link ErrorBar}.
 */
export interface ActiveError {
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
 * Active errors are selected by {@link ErrorBarProps.activeErrors}.
 *
 * Uses {@link @fluentui/react#MessageBar} UI element.
 */
export const ErrorBar = (props: ErrorBarProps): JSX.Element => {
  const localeStrings = useLocale().strings.errorBar;
  const strings = props.strings ?? localeStrings;

  if (props.activeErrors.length === 0) {
    return <></>;
  }

  // FIXME: Memoize onDismiss callbacks.
  return (
    <Stack>
      {props.activeErrors.map((activeError) => (
        <MessageBar
          {...props}
          key={activeError.type}
          messageBarType={MessageBarType.error}
          onDismiss={() => props.onDismissErrors([activeError.type])}
        >
          {strings[activeError.type]}
        </MessageBar>
      ))}
    </Stack>
  );
};
