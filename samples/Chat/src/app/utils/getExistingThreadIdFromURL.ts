// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

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
