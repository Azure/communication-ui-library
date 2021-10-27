// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';

/**
 * @internal
 */
export interface _IObjectMap<T> {
  [key: string]: T;
}

/**
 * @internal
 *
 * Create an array of span elements by replacing the pattern "\{\}" in str with the elements
 * passed in as vars and creating span elements fromt the rest
 *
 * @example
 * ```ts
 *   formatElements("hello {name}. '{name}' is a rare name.", {name: <Persona text="Foo"/>});
 *   // returns [<span>hello </span>, <span><Persona text="Foo"/></span>, <span>. <span>, <span><Persona text="Foo"/></span>, <span> is a rare name.</span>]"
 * ```
 * @param str - The string to be formatted
 * @param vars - Variables to use to format the string
 * @returns formatted JSX elements
 */
export const _formatSpanElements = (str: string, vars: _IObjectMap<JSX.Element>): JSX.Element[] => {
  if (!str) {
    return [];
  }
  if (!vars) {
    return [];
  }

  const elements: JSX.Element[] = [];

  // regex to search for the pattern "{}"
  const placeholdersRegex = /{(\w+)}/g;
  const regex = RegExp(placeholdersRegex);
  let array: RegExpExecArray | null = regex.exec(str);
  let prev = 0;
  let elementKey = 1;
  while (array !== null) {
    if (prev !== array.index) {
      elements.push(<span key={elementKey++}>{str.substring(prev, array.index)}</span>);
    }
    elements.push(<span key={elementKey++}>{vars[array[0].substring(1, array[0].length - 1)]}</span>);
    prev = regex.lastIndex;
    array = regex.exec(str);
  }
  elements.push(<span key={elementKey++}>{str.substring(prev)}</span>);
  return elements;
};

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
  return str.replace(placeholdersRegex, (_: string, k: string) => vars[k] || `{${k}}`);
};
