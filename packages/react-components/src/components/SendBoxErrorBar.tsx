// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { MessageBar, MessageBarType } from '@fluentui/react';
import React, { useCallback, useEffect } from 'react';

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
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  const clearTimeoutRef = useCallback(() => {
    timeoutRef.current && clearTimeout(timeoutRef.current);
  }, [timeoutRef]);

  useEffect(() => {
    clearTimeoutRef();
    if (dismissAfterMs !== undefined) {
      timeoutRef.current = setTimeout(() => {
        setErrorMessage(undefined);
        onDismiss && onDismiss();
      }, dismissAfterMs);
    }
    return clearTimeoutRef;
  }, [clearTimeoutRef, dismissAfterMs, onDismiss]);

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
