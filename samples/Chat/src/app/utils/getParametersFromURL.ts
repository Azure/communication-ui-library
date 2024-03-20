// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 *
 * The threadId of the current thread is extracted from the url
 * using URLsearchparams.
 *
 * @returns The current threadId as String
 *
 */

export const getExistingThreadIdFromURL = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  const threadId = urlParams.get('threadId');

  return threadId;
};

/**
 *
 * The userId is extracted from the url
 * using URLsearchparams.
 *
 * @returns The userId as String
 *
 */

export const getExistingUserIdFromURL = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get('userId');

  return userId;
};

/**
 *
 * The endpointURL is extracted from the url
 * using URLsearchparams.
 *
 * @returns The endpointURL as String
 *
 */

export const getExistingEndpointURLFromURL = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  const endpointUrl = urlParams.get('endpointUrl');

  return endpointUrl;
};

/**
 *
 * The displayName is extracted from the url
 * using URLsearchparams.
 *
 * @returns The displayName as String
 *
 */

export const getExistingDisplayNameFromURL = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  const displayName = urlParams.get('displayName');

  return displayName;
};
