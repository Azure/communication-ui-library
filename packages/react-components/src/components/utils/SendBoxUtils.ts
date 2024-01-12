// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

const EMPTY_MESSAGE_REGEX = /^\s*$/;

/**
 * @private
 */
export const sanitizeText = (message: string): string => {
  if (EMPTY_MESSAGE_REGEX.test(message)) {
    return '';
  } else {
    return message;
  }
};
