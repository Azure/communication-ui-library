// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

///
/// This file is only for use by the test apps
///

/**
 * Throw error if required parameter exists.
 * Return parameter for easy usage.
 *
 * @private
 */
export function verifyParamExists<T>(param: T, paramName: string): T {
  if (!param) {
    throw `${paramName} was not included in the query parameters of the URL.`;
  }

  return param;
}

/**
 * Detect if the test is run in a mobile browser.
 *
 * @remarks User agent string is not sufficient alone to detect if a device is mobile. It is
 * sufficient for our tests however.
 *
 * @private
 */
export const isMobile = (): boolean =>
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
