// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * @internal
 */
export interface _IObjectMap<T> {
  [key: string]: T;
}

/**
 * @internal
 *
 * Replace the pattern "\{\}" in str with the values passed in as vars
 *
 * @example
 * ```ts
 *   _formatString("hello {name}. '{name}' is a rare name.", {name: "Foo"});
 *   // returns "hello Foo. 'Foo' is a rare name."
 * ```
 * @param str - The string to be formatted
 * @param variables - Variables to use to format the string
 * @returns a formatted string
 */
export const _formatString = (str: string, vars: _IObjectMap<string>): string => {
  if (!str) {
    return '';
  }
  if (!vars) {
    return str;
  }

  // regex to search for the pattern "\{\}"
  const placeholdersRegex = /{(\w+)}/g;
  return str.replace(placeholdersRegex, (_: string, k: string) => {
    const replaceValue = vars[k];
    return replaceValue === undefined ? `{${k}}` : replaceValue;
  });
};
