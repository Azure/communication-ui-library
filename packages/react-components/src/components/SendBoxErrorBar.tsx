// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { MessageBar, MessageBarType } from '@fluentui/react';
import React, { useEffect } from 'react';

/**
 * @private
 */
export interface SendBoxErrorBarProps {
  /** Error message to render */
  message?: string;
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
  const { message, dismissAfterMs, onDismiss } = props;
  const [errorMessage, setErrorMessage] = React.useState(message);
  // Using `any` because `NodeJS.Timeout` here will cause `declaration error` with jest.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const timeoutRef = React.useRef<any>();

  React.useEffect(() => {
    setErrorMessage(message);
  }, [message]);

  useEffect(() => {
    if (dismissAfterMs !== undefined) {
      timeoutRef.current = setTimeout(() => {
        setErrorMessage(undefined);
        onDismiss && onDismiss();
      }, dismissAfterMs);
    }
    return () => {
      timeoutRef.current && clearTimeout(timeoutRef.current);
    };
  }, [dismissAfterMs, onDismiss, message]);

  if (errorMessage) {
    return (
      <MessageBar
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
