// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { AzureCommunicationTokenCredential, CommunicationTokenRefreshOptions } from '@azure/communication-common';
import { CallState as CallStatus } from '@azure/communication-calling';

/**
 * @private
 */
export const isInCall = (callStatus: CallStatus): boolean => !!(callStatus !== 'None' && callStatus !== 'Disconnected');

/**
 * Create AzureCommunicationUserCredential using optional refreshTokenCallback if provided.
 * If callback is provided then identity must also be provided for callback to be used.
 *
 * @private
 */
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
