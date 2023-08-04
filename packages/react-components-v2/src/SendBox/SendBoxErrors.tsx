// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { _SendBoxErrorBarProps, _SendBoxErrorBarError } from './SendBoxErrorBar.types';
import { _SendBoxErrorBar } from './SendBoxErrorBar';

/**
 * @internal
 */
export interface _SendBoxErrorsProps {
  fileUploadsPendingError?: _SendBoxErrorBarError;
  fileUploadError?: _SendBoxErrorBarError;
}

/**
 * @internal
 */
export const _SendBoxErrors = (props: _SendBoxErrorsProps): JSX.Element => {
  const { fileUploadError, fileUploadsPendingError } = props;

  const errorToDisplay = React.useMemo(() => {
    if (fileUploadError && fileUploadsPendingError) {
      return fileUploadError.timestamp > fileUploadsPendingError.timestamp ? fileUploadError : fileUploadsPendingError;
    }
    return fileUploadError || fileUploadsPendingError;
  }, [fileUploadError, fileUploadsPendingError]);

  return <_SendBoxErrorBar error={errorToDisplay} dismissAfterMs={10 * 1000} />;
};
