// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { MessageBar, MessageBarType } from '@fluentui/react';
import React, { useEffect } from 'react';

/**
 * @internal
 */
export interface SendBoxErrorBarProps {
  /** Error message to render */
  message?: string;
  /**
   * Timeout in ms after which the error bar disappears.
   * If undefined, the error bar will never disappear.
   */
  timeout?: number;
}

/**
 * @internal
 */
export const SendBoxErrorBar = (props: { message?: string; timeout?: number }): JSX.Element => {
  const { message, timeout } = props;
  const [errorMessage, setErrorMessage] = React.useState(message);

  useEffect(() => {
    if (timeout !== undefined) {
      const messageTimeout = setTimeout(() => {
        setErrorMessage(undefined);
      }, timeout);
      return () => {
        clearTimeout(messageTimeout);
      };
    } else {
      return;
    }
  }, [timeout]);

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
