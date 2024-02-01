// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useCallback, useEffect, useState } from 'react';
import { SendBoxErrorBar, SendBoxErrorBarError } from '../SendBoxErrorBar';

/**
 * @private
 */
export interface RTESendBoxErrorsProps {
  fileUploadsPendingError?: SendBoxErrorBarError;
  fileUploadError?: SendBoxErrorBarError;
  systemMessage?: string;
  textTooLongMessage?: string;
}

/**
 * @private
 */
export const RTESendBoxErrors = (props: RTESendBoxErrorsProps): JSX.Element => {
  const { fileUploadError, fileUploadsPendingError, systemMessage, textTooLongMessage } = props;
  const [sendBoxError, setSendBoxError] = useState<SendBoxErrorBarError | undefined>(undefined);

  useEffect(() => {
    if (systemMessage && !isMessageEmpty(systemMessage)) {
      setSendBoxError({ message: systemMessage, timestamp: Date.now() });
    }
  }, [systemMessage]);

  useEffect(() => {
    if (textTooLongMessage && !isMessageEmpty(textTooLongMessage)) {
      setSendBoxError({ message: textTooLongMessage, timestamp: Date.now() });
    }
  }, [textTooLongMessage]);

  useEffect(() => {
    setSendBoxError((prev) => {
      const errors: SendBoxErrorBarError[] = [];
      if (prev) {
        errors.push(prev);
      }
      if (fileUploadsPendingError) {
        errors.push(fileUploadsPendingError);
      }
      if (fileUploadError) {
        errors.push(fileUploadError);
      }
      if (errors.length === 0) {
        return undefined;
      }
      // sort to get the latest error
      const sortedErrors = errors.sort((a, b) => b.timestamp - a.timestamp);
      return sortedErrors[0];
    });
  }, [fileUploadError, fileUploadsPendingError]);

  const onDismiss = useCallback(() => {
    if (systemMessage && !isMessageEmpty(systemMessage)) {
      setSendBoxError({ message: systemMessage, timestamp: Date.now() });
    }
  }, [systemMessage]);

  return (
    <SendBoxErrorBar
      error={sendBoxError}
      dismissAfterMs={
        // don't dismiss the system message
        systemMessage !== undefined && sendBoxError?.message !== systemMessage ? 10 * 1000 : undefined
      }
      onDismiss={onDismiss}
    />
  );
};

const isMessageEmpty = (message: string): boolean => {
  return message.trim().length === 0;
};
