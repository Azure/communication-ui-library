// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { AzureCommunicationTokenCredential, CommunicationTokenRefreshOptions } from '@azure/communication-common';
import { CallState as CallStatus } from '@azure/communication-calling';
import { CommunicationUiErrorFromError, CommunicationUiErrorInfo } from '../types/CommunicationUiError';

export const isInCall = (callStatus: CallStatus): boolean => !!(callStatus !== 'None' && callStatus !== 'Disconnected');

// Create AzureCommunicationUserCredential using optional refreshTokenCallback if provided. If callback is provided then
// identity must also be provided for callback to be used.
export const createAzureCommunicationUserCredential = (
  token: string,
  refreshTokenCallback?: (() => Promise<string>) | undefined
): AzureCommunicationTokenCredential => {
  if (refreshTokenCallback !== undefined) {
    const options: CommunicationTokenRefreshOptions = {
      token: token,
      tokenRefresher: () => refreshTokenCallback(),
      refreshProactively: true
    };
    return new AzureCommunicationTokenCredential(options);
  } else {
    return new AzureCommunicationTokenCredential(token);
  }
};

export const propagateError = (error: Error, onErrorCallback?: (error: CommunicationUiErrorInfo) => void): void => {
  if (onErrorCallback) {
    onErrorCallback(CommunicationUiErrorFromError(error));
  } else {
    throw error;
  }
};
