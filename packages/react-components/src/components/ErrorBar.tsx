// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useEffect, useState } from 'react';
import { IMessageBarProps, MessageBar, MessageBarType, Stack } from '@fluentui/react';
import { useLocale } from '../localization';

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
  activeErrors: ActiveError[];
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
   * Detected bad network connection via the Calling SDK.
   */
  callingNetworkFailure: string;

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
 *
 * @public
 */
export type ErrorType = keyof ErrorBarStrings;

/**
 * Active error to be shown via {@link ErrorBar}.
 *
 * @public
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
 * This component internally tracks dismissed by the user.
 *   * Errors that have an associated timestamp: The error is shown on the UI again if it occurs after being dismissed.
 *   * Errors that do not have a timestamp: The error is dismissed until it dissappears from the props.
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
    () => setDismissedErrors(dropDismissalsForInactiveErrors(props.activeErrors, dismissedErrors)),
    [props.activeErrors, dismissedErrors]
  );

  const toShow = errorsToShow(props.activeErrors, dismissedErrors);

  return (
    <Stack>
      {toShow.map((error) => (
        <MessageBar
          {...props}
          key={error.type}
          messageBarType={MessageBarType.error}
          onDismiss={() => setDismissedErrors(dismissError(dismissedErrors, error))}
        >
          {strings[error.type]}
        </MessageBar>
      ))}
    </Stack>
  );
};

interface DismissedError {
  type: ErrorType;
  dismissedAt: Date;
  activeSince?: Date;
}

// Always returns a new Array so that the state variable is updated, trigerring a render.
const dismissError = (dismissedErrors: DismissedError[], toDismiss: ActiveError): DismissedError[] => {
  const now = new Date(Date.now());
  for (const error of dismissedErrors) {
    if (error.type === toDismiss.type) {
      // Bump the timestamp for latest dismissal of this error to now.
      error.dismissedAt = now;
      error.activeSince = toDismiss.timestamp;
      return Array.from(dismissedErrors);
    }
  }

  // Record that this error was dismissed for the first time right now.
  return [
    ...dismissedErrors,
    {
      type: toDismiss.type,
      dismissedAt: now,
      activeSince: toDismiss.timestamp
    }
  ];
};

// Returns a new Array if and only if contents change, to avoid re-rendering when nothing was dropped.
const dropDismissalsForInactiveErrors = (
  activeErrors: ActiveError[],
  dismissedErrors: DismissedError[]
): DismissedError[] => {
  const active = new Map();
  for (const error of activeErrors) {
    active.set(error.type, error);
  }

  // For an error such that:
  // * It was previously active, and dismissed.
  // * It did not have a timestamp associated with it.
  // * It is no longer active.
  //
  // We remove it from dismissals. When it becomes active again next time, it will be shown again on the UI.
  const shouldDeleteDismissal = (dismissed: DismissedError): boolean =>
    dismissed.activeSince === undefined && active.get(dismissed.type) === undefined;

  if (dismissedErrors.some((dismissed) => shouldDeleteDismissal(dismissed))) {
    return dismissedErrors.filter((dismissed) => !shouldDeleteDismissal(dismissed));
  }
  return dismissedErrors;
};

const errorsToShow = (activeErrors: ActiveError[], dismissedErrors: DismissedError[]): ActiveError[] => {
  const dismissed: Map<ErrorType, DismissedError> = new Map();
  for (const error of dismissedErrors) {
    dismissed.set(error.type, error);
  }

  return activeErrors.filter((error) => {
    const dismissal = dismissed.get(error.type);
    if (!dismissal) {
      // This error was never dismissed.
      return true;
    }
    if (!error.timestamp) {
      // No timestamp associated with the error. In this case, the existence of a dismissal is enough to suppress the error.
      return false;
    }
    // Error has an associated timestamp, so compare with last dismissal.
    return error.timestamp > dismissal.dismissedAt;
  });
};
