// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * Checks the version of react and throws an error if it is less than 18 in the loaders
 * @param version - version of react
 * @private
 */
export const parseReactVersion = (version: string | undefined): void => {
  if (!version) {
    return;
  }
  const reactVersion = version.split('.').map((v) => parseInt(v));
  if (reactVersion[0] && reactVersion[0] < 18) {
    throw new Error(
      'React version is less than 18. Please upgrade to React 18 or alternatively checkout how to use our composites directly here: https://aka.ms/acsstorybook'
    );
  }
};
