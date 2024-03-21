// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { SendBoxErrorBar, SendBoxErrorBarError } from './SendBoxErrorBar';

/**
 * @private
 */
export interface SendBoxErrorsProps {
  sendBoxStatusMessage?: string;
}

/**
 * @private
 */
export const SendBoxErrors = (props: SendBoxErrorsProps): JSX.Element => {
  const { sendBoxStatusMessage } = props;
  if (!sendBoxStatusMessage) {
    return <></>;
  }
  const error: SendBoxErrorBarError = {
    message: sendBoxStatusMessage,
    timestamp: Date.now()
  };
  return <SendBoxErrorBar error={error} dismissAfterMs={10 * 1000} />;
};
