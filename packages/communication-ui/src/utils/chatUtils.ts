// © Microsoft Corporation. All rights reserved.

import { AzureCommunicationUserCredential, RefreshOptions } from '@azure/communication-common';

export const compareMessages = (firstMessage: { createdOn?: Date }, secondMessage: { createdOn?: Date }): number => {
  if (firstMessage.createdOn === undefined) return 1;
  if (secondMessage.createdOn === undefined) return -1;
  const firstDate = new Date(firstMessage.createdOn).getTime();
  const secondDate = new Date(secondMessage.createdOn).getTime();
  return firstDate - secondDate;
};

// Create AzureCommunicationUserCredential using optional refreshTokenCallback if provided. If callback is provided then
// identity must also be provided for callback to be used.
export const createAzureCommunicationUserCredential = (
  token: string,
  refreshTokenCallback?: (() => Promise<string>) | undefined
): AzureCommunicationUserCredential => {
  if (refreshTokenCallback !== undefined) {
    const options: RefreshOptions = {
      initialToken: token,
      tokenRefresher: () => refreshTokenCallback(),
      refreshProactively: true
    };
    return new AzureCommunicationUserCredential(options);
  } else {
    return new AzureCommunicationUserCredential(token);
  }
};
