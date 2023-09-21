// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { PartialDeep } from 'type-fest';
import { CompositeStrings } from '../LocalizationProvider';
import en_US from './en-US/strings.json';

/**
 *
 * @private
 */
export const createCompositeStrings = (localizedStrings: PartialDeep<CompositeStrings>): CompositeStrings => {
  const strings: CompositeStrings = { ...en_US };
  Object.keys(localizedStrings).forEach((key: string) => {
    strings[key] = { ...strings[key], ...localizedStrings[key] };
  });
  return strings;
};
