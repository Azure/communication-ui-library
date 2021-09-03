// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useMemo, useState } from 'react';
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
   *
   * @deprecated
   *
   * {@link ErrorBar} now tracks dismissed errors internally.
   * This prop will be removed soon, along with handlers etc written for it.
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

  // xkcd: Will this lead to `ErrorBar` getting recreated entirely?
  if (props.activeErrors.length === 0) {
    return <></>;
  }

  const [dismissedErrors, setDismissedErrors] = useState<DismissedError[]>([]);
  const errorsToShow = useMemo(
    () => getErrorsToShow(props.activeErrors, dismissedErrors),
    [props.activeErrors, dismissedErrors]
  );

  return (
    <Stack>
      {errorsToShow.map((activeError) => (
        <MessageBar
          {...props}
          key={activeError.type}
          messageBarType={MessageBarType.error}
          onDismiss={() => {
            const newDismissedErrors = updatedDismissedErrors(dismissedErrors, activeError.type);
            setDismissedErrors(newDismissedErrors);
          }}
        >
          {strings[activeError.type]}
        </MessageBar>
      ))}
    </Stack>
  );
};

interface DismissedError {
  type: ErrorType;
  timestamp: Date;
}

// Always returns a new Array so that the state variable is updated, trigerring a render.
const updatedDismissedErrors = (dismissedErrors: DismissedError[], toDismiss: ErrorType): DismissedError[] => {
  const now = new Date(Date.now());
  for (const error of dismissedErrors) {
    if (error.type === toDismiss) {
      // Bump the timestamp for latest dismissal of this error to now.
      error.timestamp = now;
      return Array.from(dismissedErrors);
    }
  }

  // Record that this error was dismissed for the first time right now.
  return [
    ...dismissedErrors,
    {
      type: toDismiss,
      timestamp: now
    }
  ];
};

const getErrorsToShow = (activeErrors: ActiveError[], dismissedErrors: DismissedError[]): ActiveError[] => {
  const dismissed = new Map();
  for (const error of dismissedErrors) {
    dismissed[error.type] = error;
  }

  return activeErrors.filter((error) => {
    if (dismissed[error.type] === undefined) {
      // This error was never dismissed.
      return true;
    }

    const dismissedAt = dismissed[error.type].timestamp;
    if (error.timestamp) {
      // Error has an associated timestamp, so compare with last dismissal.
      return error.timestamp > dismissedAt;
    }

    // No timestamp associated with the error. In this case, dismissal is active for a fixed amount of time.
    return Date.now() - dismissedAt.getTime() > ERROR_DISMISSAL_TIMEOUT_MS;
  });
};

const ERROR_DISMISSAL_TIMEOUT_MS = 10000;
