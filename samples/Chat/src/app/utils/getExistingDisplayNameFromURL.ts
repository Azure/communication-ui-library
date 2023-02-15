// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

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
  