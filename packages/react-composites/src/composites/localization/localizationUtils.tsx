// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';

/**
 * @private
 */
export interface IObjectMap<T> {
  [key: string]: T;
}

/**
 * Create an array of span elements by replacing the pattern "{}" in str with the elements
 * passed in as vars and creating span elements fromt he rest
 * eg: formatElements("hello {name}. '{name}' is a rare name.", {name: <Persona text="Foo"/>})
 * returns [<span>hello </span>, <span><Persona text="Foo"/></span>, <span>. <span>, <span><Persona text="Foo"/></span>, <span> is a rare name.</span>]"
 * @param {string} str The string to be formatted
 * @param {Object} vars Variables to use to format the string
 * @returns {JSX.Element} formatted elements
 */
export const formatSpanElements = (str: string, vars: IObjectMap<JSX.Element>): JSX.Element[] => {
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
 * Replace the pattern "{}" in str with the values passed in as vars
 * eg: formatString("hello {name}. '{name}' is a rare name.", {name: "Foo"})
 * return "hello Foo. 'Foo' is a rare name."
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
  return str.replace(placeholdersRegex, (_: string, k: string) => vars[k] || `{${k}}`);
};
