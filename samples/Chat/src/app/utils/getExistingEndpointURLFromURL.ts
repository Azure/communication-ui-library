// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

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