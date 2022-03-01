// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles, Stack, useTheme } from '@fluentui/react';
import React, { useEffect } from 'react';
import { errorBarStyle } from './styles/SendBox.styles';

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
  const theme = useTheme();

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
    return <Stack className={mergeStyles(errorBarStyle(theme))}>{errorMessage}</Stack>;
  } else {
    return <></>;
  }
};
