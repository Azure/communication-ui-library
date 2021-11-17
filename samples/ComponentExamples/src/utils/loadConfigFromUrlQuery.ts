// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IdentityType } from './utils';

export const loadConfigFromUrlQuery = (): IdentityType => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());

  return {
    displayName: params.displayName,
    token: params.token,
    endpointUrl: params.endpointUrl,
    threadId: params.threadId,
    userId: params.userId
  };
};
