// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 *
 * The token is extracted from the url
 * using URLsearchparams.
 *
 * @returns The token as String
 *
 */

export const getExistingTokenFromURL = (): string | null => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    return token;
  };