// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useEffect } from 'react';
import { SendBoxErrorBar } from './SendBoxErrorBar';

/**
 * @private
 * @TODO Add a timestamp to the error
 */
export type SendBoxError = {
  message?: string;
};

/**
 * @private
 */
export interface SendBoxErrorsProps {
  fileUploadsPendingError?: SendBoxError;
  onDismissFileUploadsPendingError?: () => void;
  fileUploadError?: SendBoxError;
}

/**
 * @private
 */
export const SendBoxErrors = (props: SendBoxErrorsProps): JSX.Element => {
  const { fileUploadError, fileUploadsPendingError, onDismissFileUploadsPendingError } = props;
  const [showFileUploadsPendingError, setShowFileUploadsPendingError] = React.useState(false);

  useEffect(() => {
    fileUploadsPendingError && setShowFileUploadsPendingError(true);
  }, [fileUploadsPendingError]);

  // If a new `fileUploadError` is available, show it instead of the `fileUploadsPendingError`
  useEffect(() => {
    fileUploadError && setShowFileUploadsPendingError(false);
  }, [fileUploadError]);

  if (showFileUploadsPendingError && fileUploadsPendingError) {
    return (
      <SendBoxErrorBar
        message={fileUploadsPendingError.message}
        dismissAfterMs={10 * 1000}
        onDismiss={() => {
          setShowFileUploadsPendingError(false);
          onDismissFileUploadsPendingError && onDismissFileUploadsPendingError();
        }}
      />
    );
  } else if (fileUploadError) {
    return <SendBoxErrorBar message={fileUploadError.message} dismissAfterMs={10 * 1000} />;
  }
  return <></>;
};
