// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { MessageBar, MessageBarType } from '@fluentui/react';
import React, { useEffect } from 'react';

/**
 * @beta
 * Error to be displayed to the user in an error bar above sendbox.
 */
export interface SendBoxErrorBarError {
  /** Error Message to be displayed */
  message: string;
  /**
   * Unix Timestamp. Preferred generation using `Date.now()`
   */
  timestamp: number;
}

/**
 * @private
 */
export interface SendBoxErrorBarProps {
  /** Error to render */
  error?: SendBoxErrorBarError;
  /**
   * Automatically dismisses the error bar after the specified delay in ms.
   * Example: `10 * 1000` would be 10 seconds
   */
  dismissAfterMs?: number;
  /**
   * Callback to invoke when the error bar is dismissed
   */
  onDismiss?: () => void;
}

/**
 * @private
 */
export const SendBoxErrorBar = (props: SendBoxErrorBarProps): JSX.Element => {
  const { error, dismissAfterMs, onDismiss } = props;
  const [errorMessage, setErrorMessage] = React.useState(error?.message);
  // Using `any` because `NodeJS.Timeout` here will cause `declaration error` with jest.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const timeoutRef = React.useRef<any>();

  React.useEffect(() => {
    setErrorMessage(error?.message);
  }, [error]);

  useEffect(() => {
    if (error && dismissAfterMs !== undefined) {
      timeoutRef.current = setTimeout(() => {
        setErrorMessage(undefined);
        onDismiss && onDismiss();
      }, dismissAfterMs);
    }
    return () => {
      timeoutRef.current && clearTimeout(timeoutRef.current);
    };
  }, [dismissAfterMs, onDismiss, error]);

  if (errorMessage) {
    return (
      <MessageBar
        role="alert"
        aria-label={errorMessage}
        data-testid={'send-box-message-bar'}
        messageBarType={MessageBarType.warning}
        styles={{
          iconContainer: {
            display: 'none'
          }
        }}
      >
        {errorMessage}
      </MessageBar>
    );
  } else {
    return <></>;
  }
};
