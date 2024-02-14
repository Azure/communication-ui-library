// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { PartialDeep } from 'type-fest';
import { ComponentStrings } from '..';
import en_US from './en-US/strings.json';

/**
 *
 * @private
 */
export const createComponentStrings = (localizedStrings: PartialDeep<ComponentStrings>): ComponentStrings => {
  const strings: ComponentStrings = { ...en_US };
  Object.keys(localizedStrings).forEach((key: string) => {
    // @ts-expect-error TODO: fix noImplicitAny error here
    strings[key] = { ...strings[key], ...localizedStrings[key] };
  });
  return strings;
};
