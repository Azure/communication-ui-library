// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IdentityType } from './utils';

/**
 * Loads configuration from the URL query parameters.
 * @returns {IdentityType} An object containing the user identity and chat thread information.
 */
export const loadConfigFromUrlQuery = (): IdentityType => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const { displayName, token, endpointUrl, threadId, userId } = Object.fromEntries(urlSearchParams.entries());

  if (!displayName || !token || !endpointUrl || !threadId || !userId) {
    throw new Error(`Missing config values in URL query: ${window.location.search}`);
  }

  return {
    displayName,
    token,
    endpointUrl,
    threadId,
    userId
  };
};
