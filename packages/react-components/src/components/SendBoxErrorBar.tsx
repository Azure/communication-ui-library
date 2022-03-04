// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { MessageBar, MessageBarType } from '@fluentui/react';
import React, { useCallback, useEffect } from 'react';

/**
 * @internal
 */
export interface SendBoxErrorBarProps {
  /** Error message to render */
  message?: string;
  /**
   * Timeout delay in ms after which the error bar disappears.
   * If undefined, the error bar will never disappear.
   */
  timeoutDelay?: number;
}

/**
 * @internal
 */
export const SendBoxErrorBar = (props: SendBoxErrorBarProps): JSX.Element => {
  const { message, timeoutDelay } = props;
  const [errorMessage, setErrorMessage] = React.useState(message);
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  const clearTimeoutRef = useCallback(() => {
    timeoutRef.current && clearTimeout(timeoutRef.current);
  }, [timeoutRef]);

  useEffect(() => {
    clearTimeoutRef();
    if (timeoutDelay !== undefined) {
      timeoutRef.current = setTimeout(() => {
        setErrorMessage(undefined);
      }, timeoutDelay);
    }
    return clearTimeoutRef;
  }, [clearTimeoutRef, timeoutDelay]);

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
