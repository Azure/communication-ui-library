// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

///
/// This file is only for use by the test apps
///

/**
 * Throw error if required parameter exists.
 * Return parameter for easy usage.
 */
export function verifyParamExists<T>(param: T, paramName: string): T {
  if (!param) {
    throw `${paramName} was not included in the query parameters of the URL.`;
  }

  return param;
}
