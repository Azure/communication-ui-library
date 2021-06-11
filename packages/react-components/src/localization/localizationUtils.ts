// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export interface IObjectMap<T> {
  [key: string]: T;
}

/**
 * Get the formatted string with the passed variables
 * @param {string} str The string to be formatted
 * @param {Object} variables Variables to use to format the string
 * @returns {string} formatted string
 */
export const formatString = (str: string, vars: IObjectMap<string>): string => {
  if (!str) {
    return '';
  }
  if (!vars) {
    return str;
  }

  // regex to search for the pattern "{}"
  const placeholdersRegex = /{(\w+)}/g;

  // replace the pattern "{}" with the values passed in as vars
  // ex: get(ILocaleKeys.local_key_hello, {name: "Foo"}) => "hello Foo"
  //     "hello {name}" => "hello Foo"
  return str.replace(placeholdersRegex, (_: string, k: string) => vars[k] || `{${k}}`);
};

export const regexIndexOf = (str: string, regex: RegExp, startpos: number): number => {
  const indexOf = str.substring(startpos || 0).search(regex);
  return indexOf >= 0 ? indexOf + (startpos || 0) : indexOf;
};
