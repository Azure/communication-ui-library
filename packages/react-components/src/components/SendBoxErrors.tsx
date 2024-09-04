// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { SendBoxErrorBar, SendBoxErrorBarError } from './SendBoxErrorBar';

/**
 * @private
 */
export interface SendBoxErrorsProps {
  attachmentUploadsPendingError?: SendBoxErrorBarError;
  attachmentProgressError?: SendBoxErrorBarError;
}

/**
 * @private
 */
export const SendBoxErrors = (props: SendBoxErrorsProps): JSX.Element => {
  const { attachmentProgressError, attachmentUploadsPendingError } = props;

  const errorToDisplay = React.useMemo(() => {
    if (attachmentProgressError && attachmentUploadsPendingError) {
      return attachmentProgressError.timestamp > attachmentUploadsPendingError.timestamp
        ? attachmentProgressError
        : attachmentUploadsPendingError;
    }
    return attachmentProgressError || attachmentUploadsPendingError;
  }, [attachmentProgressError, attachmentUploadsPendingError]);

  return <SendBoxErrorBar error={errorToDisplay} dismissAfterMs={10 * 1000} />;
};
