// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

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