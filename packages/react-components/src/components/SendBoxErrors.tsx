// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { SendBoxErrorBar, SendBoxErrorBarError } from './SendBoxErrorBar';

/**
 * @private
 */
export interface SendBoxErrorsProps {
  attachmentUploadsPendingError?: SendBoxErrorBarError;
  attachmentUploadError?: SendBoxErrorBarError;
}

/**
 * @private
 */
export const SendBoxErrors = (props: SendBoxErrorsProps): JSX.Element => {
  const { attachmentUploadError, attachmentUploadsPendingError } = props;

  const errorToDisplay = React.useMemo(() => {
    if (attachmentUploadError && attachmentUploadsPendingError) {
      return attachmentUploadError.timestamp > attachmentUploadsPendingError.timestamp
        ? attachmentUploadError
        : attachmentUploadsPendingError;
    }
    return attachmentUploadError || attachmentUploadsPendingError;
  }, [attachmentUploadError, attachmentUploadsPendingError]);

  return <SendBoxErrorBar error={errorToDisplay} dismissAfterMs={10 * 1000} />;
};
