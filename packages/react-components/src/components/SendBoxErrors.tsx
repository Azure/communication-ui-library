// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { SendBoxErrorBar, SendBoxErrorBarError } from './SendBoxErrorBar';

/**
 * @private
 */
export interface SendBoxErrorsProps {
  fileUploadsPendingError?: SendBoxErrorBarError;
  fileUploadError?: SendBoxErrorBarError;
}

/**
 * @private
 */
export const SendBoxErrors = (props: SendBoxErrorsProps): JSX.Element => {
  const { fileUploadError, fileUploadsPendingError } = props;

  const errorToDisplay = React.useMemo(() => {
    if (fileUploadError && fileUploadsPendingError) {
      return fileUploadError.timestamp > fileUploadsPendingError.timestamp ? fileUploadError : fileUploadsPendingError;
    }
    return fileUploadError || fileUploadsPendingError;
  }, [fileUploadError, fileUploadsPendingError]);

  return <SendBoxErrorBar error={errorToDisplay} dismissAfterMs={10 * 1000} />;
};
