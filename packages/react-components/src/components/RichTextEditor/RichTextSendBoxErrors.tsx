// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useCallback, useEffect, useState } from 'react';
import { SendBoxErrorBar, SendBoxErrorBarError } from '../SendBoxErrorBar';

/**
 * @private
 */
export interface RichTextSendBoxErrorsProps {
  /* @conditional-compile-remove(attachment-upload) */
  attachmentUploadsPendingError?: SendBoxErrorBarError;
  /* @conditional-compile-remove(attachment-upload) */
  attachmentProgressError?: SendBoxErrorBarError;
  systemMessage?: string;
  textTooLongMessage?: string;
}

/**
 * @private
 */
export const RichTextSendBoxErrors = (props: RichTextSendBoxErrorsProps): JSX.Element => {
  const {
    /* @conditional-compile-remove(attachment-upload) */
    attachmentProgressError,
    /* @conditional-compile-remove(attachment-upload) */
    attachmentUploadsPendingError,
    systemMessage,
    textTooLongMessage
  } = props;
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
    if (
      (textTooLongMessage === undefined || isMessageEmpty(textTooLongMessage)) &&
      (systemMessage === undefined || isMessageEmpty(systemMessage))
    ) {
      setSendBoxError(undefined);
    }
  }, [systemMessage, textTooLongMessage]);

  useEffect(() => {
    setSendBoxError((prev) => {
      const errors: SendBoxErrorBarError[] = [];
      if (prev) {
        errors.push(prev);
      }
      /* @conditional-compile-remove(attachment-upload) */
      if (attachmentUploadsPendingError) {
        errors.push(attachmentUploadsPendingError);
      }
      /* @conditional-compile-remove(attachment-upload) */
      if (attachmentProgressError) {
        errors.push(attachmentProgressError);
      }
      if (errors.length === 0) {
        return undefined;
      }
      // sort to get the latest error
      const sortedErrors = errors.sort((a, b) => b.timestamp - a.timestamp);
      return sortedErrors[0];
    });
  }, [
    /* @conditional-compile-remove(attachment-upload) */ attachmentProgressError,
    /* @conditional-compile-remove(attachment-upload) */ attachmentUploadsPendingError
  ]);

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
