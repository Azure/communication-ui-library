// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * Util to push search params onto the url to create a joinable link.
 *
 * @param name: name of the search parameter
 * @param value: Value of the search parameter
 */

export const pushQSPUrl = ({ name, value }: { name: string; value: string }): void => {
  const url = new URL(window.location.href);
  if (!url.searchParams.has(name)) {
    url.searchParams.append(name, value);
    window.history.pushState({}, document.title, url.toString());
  }
};
