// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { PartialDeep } from 'type-fest';
import { ComponentStrings } from '..';
import en_US from './en-US/strings.json';
import { _getKeys } from '@internal/acs-ui-common';

/**
 *
 * @private
 */
export const createComponentStrings = (localizedStrings: PartialDeep<ComponentStrings>): ComponentStrings => {
  const strings: ComponentStrings = { ...en_US };
  _getKeys(localizedStrings).forEach((key) => {
    // mark the value as unknown because the type changes based on the key.
    // this is unsafe at runtime as we could assign the wrong type based on the key here.
    // but typescript isn't smart enough to know that the key used across each access will result in the same type
    (strings as Record<keyof ComponentStrings, unknown>)[key] = { ...strings[key], ...localizedStrings[key] };
  });
  return strings;
};
