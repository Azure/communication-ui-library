// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { IMessageBarProps, MessageBar, MessageBarType, Stack } from '@fluentui/react';
import { useLocale } from '../localization';

/**
 * {@Link ErrorBar} properties.
 *
 * In addition to the following, {@Link ErrorBar} forwards all
 * {@Link @fluentui/react#IMessageBarProps} to the underlying {@Link @fluentui/react#MessageBar}.
 */
export interface ErrorBarProps extends IMessageBarProps {
  /**
   * Strings shown on the UI on errors.
   */
  strings?: ErrorBarStrings;

  /**
   * Currently active errors.
   *
   * When the error is cleared, the {@Link ErrorBar} must be removed instead of clearing {@Link ErrorBarProps.activeError}.
   */
  activeErrors: ErrorType[];

  /**
   * Callback trigerred when the {@Link MessageBar} for an active error is dismissed.
   */
  onDismissErrors: (errorTypes: ErrorType[]) => void;
}

/**
 * All strings that may be shown on the UI in the {@Link ErrorBar}.
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
   * See also: {@Link ErrorBarStrings.sendMessageNotInThisThread} for a more specific error.
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
}

/**
 * All errors that can be shown in the {@Link ErrorBar}.
 */
export type ErrorType = keyof ErrorBarStrings;

/**
 * A component to show error messages on the UI.
 * All strings that can be shown are accepted as the {@Link ErrorBarProps.strings} so that they can be localized.
 * Active errors are selected by {@Link ErrorBarProps.activeErrors}.
 *
 * Uses {@Link @fluentui/react#MessageBar} UI element.
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
          key={activeError}
          messageBarType={MessageBarType.error}
          onDismiss={() => props.onDismissErrors([activeError])}
        >
          {strings[activeError]}
        </MessageBar>
      ))}
    </Stack>
  );
};
